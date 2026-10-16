import React, { useState } from 'react';
import { Order, CrmCustomer } from '../types';
import { Language, t } from '../utils/i18n';
import {
  ShieldAlert,
  Search,
  CheckCircle2,
  XCircle,
  Truck,
  AlertTriangle,
  X,
  Phone,
  Ban,
  Check,
} from 'lucide-react';

interface FraudCheckerModalProps {
  orders: Order[];
  customers: CrmCustomer[];
  language: Language;
  onClose: () => void;
  onToggleBlacklist: (customerId: number) => void;
}

export const FraudCheckerModal: React.FC<FraudCheckerModalProps> = ({
  orders,
  customers,
  language,
  onClose,
  onToggleBlacklist,
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Normalize phone digits
  const cleanPhone = phoneNumber.replace(/\D/g, '');

  // Search matching in CRM & Orders
  const matchedCustomer = customers.find(
    (c) => c.phone.replace(/\D/g, '').includes(cleanPhone) && cleanPhone.length >= 6
  );

  const matchedOrders = orders.filter((o) =>
    o.phone.replace(/\D/g, '').includes(cleanPhone) && cleanPhone.length >= 6
  );

  // Calculate live parcel statistics
  const localDelivered = matchedOrders.filter((o) => o.status === 'Delivered').length;
  const localCancelled = matchedOrders.filter((o) => ['Cancelled', 'Returned'].includes(o.status)).length;
  const localTotal = matchedOrders.length;

  // Simulate or retrieve historical external BD courier statistics based on phone number hash
  const getCourierStats = () => {
    if (!cleanPhone || cleanPhone.length < 6) return null;

    // Use phone digits hash to create stable realistic courier history
    const seed = cleanPhone.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const isBadCustomer = cleanPhone.endsWith('22') || cleanPhone.endsWith('00') || (matchedCustomer && matchedCustomer.isBlacklisted);

    const steadfastDelivered = isBadCustomer ? 0 : (seed % 5) + (localDelivered > 0 ? localDelivered : 1);
    const steadfastCancelled = isBadCustomer ? 3 : (seed % 3 === 0 ? 1 : 0);

    const pathaoDelivered = isBadCustomer ? 1 : (seed % 4) + 1;
    const pathaoCancelled = isBadCustomer ? 2 : (seed % 4 === 0 ? 1 : 0);

    const redxDelivered = isBadCustomer ? 0 : seed % 3;
    const redxCancelled = isBadCustomer ? 2 : (seed % 5 === 0 ? 1 : 0);

    const ecourierDelivered = isBadCustomer ? 0 : 1;
    const ecourierCancelled = isBadCustomer ? 1 : 0;

    const totalDelivered = steadfastDelivered + pathaoDelivered + redxDelivered + ecourierDelivered;
    const totalCancelled = steadfastCancelled + pathaoCancelled + redxCancelled + ecourierCancelled;
    const totalParcels = totalDelivered + totalCancelled;
    const successRate = totalParcels > 0 ? Math.round((totalDelivered / totalParcels) * 100) : 0;

    let riskLevel: 'Safe' | 'Moderate' | 'High Risk' = 'Safe';
    if (successRate < 60 || totalCancelled >= 3 || (matchedCustomer && matchedCustomer.isBlacklisted)) {
      riskLevel = 'High Risk';
    } else if (successRate < 85 || totalCancelled >= 1) {
      riskLevel = 'Moderate';
    }

    return {
      totalParcels,
      totalDelivered,
      totalCancelled,
      successRate,
      riskLevel,
      couriers: [
        { name: 'Steadfast Courier', delivered: steadfastDelivered, cancelled: steadfastCancelled },
        { name: 'Pathao Courier', delivered: pathaoDelivered, cancelled: pathaoCancelled },
        { name: 'RedX Logistics', delivered: redxDelivered, cancelled: redxCancelled },
        { name: 'eCourier BD', delivered: ecourierDelivered, cancelled: ecourierCancelled },
      ],
    };
  };

  const stats = cleanPhone.length >= 6 ? getCourierStats() : null;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl bg-[#181520] border border-[#342b40] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-[#342b40] bg-[#14101c] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#bd70df]" />
            <h3 className="font-bold text-white text-base">
              {t('fraudTitle', language)}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#a69ab1] hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Box */}
        <div className="p-5 border-b border-[#342b40] bg-[#1a1324] space-y-2">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Phone className="w-4 h-4 text-[#a69ab1] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                autoFocus
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  setHasSearched(true);
                }}
                placeholder={t('fraudInputPlaceholder', language)}
                className="w-full pl-9 pr-3 py-2.5 bg-[#100d16] border border-[#342b40] rounded-xl text-white text-sm focus:border-[#bd70df] outline-none font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-[#bd70df] text-[#160e1b] hover:bg-[#d091ee] transition-colors flex items-center gap-1.5 shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>{t('checkNow', language)}</span>
            </button>
          </form>
          <div className="flex items-center gap-2 text-[11px] text-[#a69ab1]">
            <span>{language === 'bn' ? 'ডেমো পরীক্ষা করতে লিখুন:' : 'Try demo numbers:'}</span>
            <button
              type="button"
              onClick={() => {
                setPhoneNumber('01711987654');
                setHasSearched(true);
              }}
              className="text-[#36c98b] underline font-mono"
            >
              01711987654 (Safe)
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => {
                setPhoneNumber('01988001122');
                setHasSearched(true);
              }}
              className="text-[#ff6b83] underline font-mono"
            >
              01988001122 (Fraud)
            </button>
          </div>
        </div>

        {/* Results Area */}
        <div className="p-5 flex-1 overflow-y-auto space-y-5">
          {!stats ? (
            <div className="py-12 text-center text-xs text-[#a69ab1] border border-dashed border-[#342b40] rounded-2xl">
              {language === 'bn'
                ? 'উপরের বক্সে কাস্টমারের মোবাইল নম্বর লিখলে সাথে সাথে কুরিয়ার ডেলিভারি ও ক্যান্সেলেশন হিস্ট্রি প্রদর্শিত হবে।'
                : 'Enter a mobile number above to inspect delivery success and courier return history.'}
            </div>
          ) : (
            <>
              {/* Risk Banner */}
              <div
                className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${
                  stats.riskLevel === 'Safe'
                    ? 'bg-[#14261d] border-[#29604a] text-[#8de8bf]'
                    : stats.riskLevel === 'Moderate'
                    ? 'bg-[#2b2414] border-[#6b5826] text-[#fde047]'
                    : 'bg-[#351820] border-[#6d2737] text-[#ff9aaa]'
                }`}
              >
                <div className="flex items-center gap-3">
                  {stats.riskLevel === 'Safe' && <CheckCircle2 className="w-6 h-6 text-[#36c98b] shrink-0" />}
                  {stats.riskLevel === 'Moderate' && <AlertTriangle className="w-6 h-6 text-[#eab308] shrink-0" />}
                  {stats.riskLevel === 'High Risk' && <XCircle className="w-6 h-6 text-[#ff6b83] shrink-0" />}
                  <div>
                    <div className="font-bold text-sm">
                      {stats.riskLevel === 'Safe'
                        ? t('riskSafe', language)
                        : stats.riskLevel === 'Moderate'
                        ? t('riskModerate', language)
                        : t('riskHigh', language)}
                    </div>
                    <div className="text-xs opacity-90 mt-0.5">
                      {language === 'bn'
                        ? `এই নম্বরে সার্বিক সাকসেস রেট: ${stats.successRate}%`
                        : `Overall delivery success rate: ${stats.successRate}%`}
                    </div>
                  </div>
                </div>

                {matchedCustomer && (
                  <button
                    onClick={() => onToggleBlacklist(matchedCustomer.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-colors ${
                      matchedCustomer.isBlacklisted
                        ? 'bg-[#ff6b83] text-black'
                        : 'bg-black/30 hover:bg-black/50 text-white'
                    }`}
                  >
                    {matchedCustomer.isBlacklisted
                      ? language === 'bn'
                        ? 'ব্লকলিস্টেড'
                        : 'Blacklisted'
                      : language === 'bn'
                      ? 'ব্লক করুন'
                      : 'Block Number'}
                  </button>
                )}
              </div>

              {/* 3 Metric Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-[#100d16] border border-[#342b40] text-center">
                  <span className="text-[11px] text-[#a69ab1] block">{t('totalParcels', language)}</span>
                  <span className="text-xl font-bold text-white font-mono mt-1 block tabular-nums">
                    {stats.totalParcels}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#100d16] border border-[#342b40] text-center">
                  <span className="text-[11px] text-[#36c98b] block">{t('receivedParcels', language)}</span>
                  <span className="text-xl font-bold text-[#36c98b] font-mono mt-1 block tabular-nums">
                    {stats.totalDelivered}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#100d16] border border-[#342b40] text-center">
                  <span className="text-[11px] text-[#ff6b83] block">{t('cancelledParcels', language)}</span>
                  <span className="text-xl font-bold text-[#ff6b83] font-mono mt-1 block tabular-nums">
                    {stats.totalCancelled}
                  </span>
                </div>
              </div>

              {/* Courier Breakdown Table */}
              <div className="rounded-xl border border-[#342b40] bg-[#120f18] overflow-hidden">
                <div className="p-3 border-b border-[#342b40] font-semibold text-white text-xs flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#bd70df]" />
                  <span>{t('courierBreakdown', language)}</span>
                </div>
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#100d16] text-[#a69ab1] border-b border-[#342b40]">
                      <th className="py-2 px-3">Courier Partner</th>
                      <th className="py-2 px-3 text-center">Received (ডেলিভার্ড)</th>
                      <th className="py-2 px-3 text-center">Cancelled (বাতিল/রিটার্ন)</th>
                      <th className="py-2 px-3 text-right">Return Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#241c2c]">
                    {stats.couriers.map((cr, idx) => {
                      const totalC = cr.delivered + cr.cancelled;
                      const returnRate = totalC > 0 ? Math.round((cr.cancelled / totalC) * 100) : 0;
                      return (
                        <tr key={idx} className="hover:bg-[#1a1424]">
                          <td className="py-2.5 px-3 font-medium text-white">{cr.name}</td>
                          <td className="py-2.5 px-3 text-center font-mono font-bold text-[#36c98b] tabular-nums">
                            {cr.delivered}
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono font-bold text-[#ff6b83] tabular-nums">
                            {cr.cancelled}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                                returnRate > 30
                                  ? 'bg-[#351822] text-[#ff9aaa]'
                                  : 'bg-[#182a20] text-[#8de8bf]'
                              }`}
                            >
                              {returnRate}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Internal Store Orders Link */}
              {matchedOrders.length > 0 && (
                <div className="p-3 rounded-xl bg-[#1c1426] border border-[#523363] text-xs">
                  <span className="font-bold text-[#f7dcff] block mb-1">
                    আমাদের স্টোরে পূর্ববর্তী অর্ডার ({matchedOrders.length} টি):
                  </span>
                  <div className="space-y-1 text-[#d7cddd]">
                    {matchedOrders.map((o) => (
                      <div key={o.id} className="flex justify-between items-center text-[11px]">
                        <span>
                          #{o.id} · {o.items.map((i) => i.name).join(', ')}
                        </span>
                        <span
                          className={`font-semibold ${
                            o.status === 'Delivered'
                              ? 'text-[#36c98b]'
                              : o.status === 'Cancelled'
                              ? 'text-[#ff6b83]'
                              : 'text-[#bd70df]'
                          }`}
                        >
                          {o.status} (৳{o.total})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-[#342b40] bg-[#14101c] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-[#211a2a] text-white hover:bg-[#2b2138]"
          >
            {t('cancel', language)}
          </button>
        </div>
      </div>
    </div>
  );
};
