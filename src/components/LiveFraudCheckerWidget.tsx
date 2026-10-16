import React, { useState, useEffect } from 'react';
import { checkCustomerFraud, normalizeBdPhone } from '../utils/fraudChecker';
import { CourierFraudReport, CrmCustomer, Language } from '../types';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Search,
  Truck,
  PhoneCall,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

interface LiveFraudCheckerWidgetProps {
  initialPhone?: string;
  onSelectPhone?: (phone: string) => void;
  crmCustomers?: CrmCustomer[];
  lang?: Language;
  compact?: boolean;
}

export const LiveFraudCheckerWidget: React.FC<LiveFraudCheckerWidgetProps> = ({
  initialPhone = '',
  onSelectPhone,
  crmCustomers,
  lang = 'bn',
  compact = false,
}) => {
  const [phoneNumber, setPhoneNumber] = useState(initialPhone);
  const [report, setReport] = useState<CourierFraudReport | null>(null);

  useEffect(() => {
    if (initialPhone) {
      setPhoneNumber(initialPhone);
    }
  }, [initialPhone]);

  useEffect(() => {
    const clean = normalizeBdPhone(phoneNumber);
    if (clean.length >= 6) {
      const result = checkCustomerFraud(clean, crmCustomers);
      setReport(result);
    } else {
      setReport(null);
    }
  }, [phoneNumber, crmCustomers]);

  const handlePreset = (num: string) => {
    setPhoneNumber(num);
    if (onSelectPhone) onSelectPhone(num);
  };

  const isBn = lang === 'bn';

  return (
    <div
      className={`rounded-2xl border transition-all ${
        report?.riskLevel === 'High'
          ? 'bg-[#220d14] border-[#8b233a]'
          : report?.riskLevel === 'Moderate'
          ? 'bg-[#231a0e] border-[#865d21]'
          : 'bg-[#14121d] border-[#382d46]'
      } p-4 sm:p-5 shadow-lg space-y-4`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              report?.riskLevel === 'High'
                ? 'bg-[#ff4264]/20 text-[#ff708b]'
                : report?.riskLevel === 'Moderate'
                ? 'bg-[#f59e0b]/20 text-[#fbbf24]'
                : 'bg-[#bd70df]/20 text-[#bd70df]'
            }`}
          >
            {report?.riskLevel === 'High' ? (
              <ShieldAlert className="w-5 h-5 text-[#ff4264]" />
            ) : report?.riskLevel === 'Moderate' ? (
              <AlertTriangle className="w-5 h-5 text-[#f59e0b]" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-[#36c98b]" />
            )}
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span>
                {isBn
                  ? 'লাইভ কুরিয়ার ফ্রড চেকার'
                  : 'Live Courier Fraud Checker'}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#291b38] text-[#e6b4fa] border border-[#6b3591]">
                Steadfast • Pathao • RedX
              </span>
            </h3>
            <p className="text-[11px] text-[#a69ab1]">
              {isBn
                ? 'গ্রাহকের নম্বর দিয়ে যাচাই করুন পার্সেল রিসিভ ও বাতিলের লাইভ রেকর্ড'
                : 'Enter phone number to check live parcel delivery & cancellation history'}
            </p>
          </div>
        </div>

        {/* Risk Badge */}
        {report && (
          <div
            className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
              report.riskLevel === 'High'
                ? 'bg-[#4b1421] text-[#ff7991] border border-[#ff4264]/50'
                : report.riskLevel === 'Moderate'
                ? 'bg-[#432f11] text-[#fcd34d] border border-[#f59e0b]/50'
                : 'bg-[#113926] text-[#6ee7b7] border border-[#10b981]/50'
            }`}
          >
            {report.riskLevel === 'High' && (
              <>
                <XCircle className="w-3.5 h-3.5" />
                <span>{isBn ? 'উচ্চ ঝুঁকি / ভুয়া কাস্টমার' : 'High Risk / Fraud'}</span>
              </>
            )}
            {report.riskLevel === 'Moderate' && (
              <>
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{isBn ? 'মাঝারি ঝুঁকি (অগ্রিম নিন)' : 'Moderate Risk'}</span>
              </>
            )}
            {report.riskLevel === 'Safe' && (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isBn ? 'নিরাপদ ক্রেতা (Safe Buyer)' : 'Safe Customer'}</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Number Input Box */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-[#cfc4d9]">
          {isBn
            ? 'কাস্টমারের ফোন নম্বর লিখুন (Customer Phone Number):'
            : 'Enter Customer Phone Number:'}
        </label>
        <div className="relative">
          <Search className="w-4 h-4 text-[#a69ab1] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => {
              setPhoneNumber(e.target.value);
              if (onSelectPhone) onSelectPhone(e.target.value);
            }}
            placeholder={
              isBn
                ? 'যেমন: 01711987654 বা 01988001122'
                : 'e.g. 01711987654 or 01988001122'
            }
            className="w-full pl-10 pr-24 py-2.5 bg-[#0e0c14] border border-[#3f344e] rounded-xl text-sm font-mono text-white placeholder:text-[#6e637b] focus:border-[#bd70df] focus:ring-1 focus:ring-[#bd70df] outline-none"
          />
          {phoneNumber && (
            <button
              type="button"
              onClick={() => {
                setPhoneNumber('');
                if (onSelectPhone) onSelectPhone('');
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#a69ab1] hover:text-white bg-[#251f2f] px-2 py-1 rounded"
            >
              {isBn ? 'মুছুন' : 'Clear'}
            </button>
          )}
        </div>

        {/* Demo Preset Buttons for Quick Testing */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] text-[#8e829d]">
            {isBn ? 'টেস্ট নম্বর:' : 'Test Numbers:'}
          </span>
          <button
            type="button"
            onClick={() => handlePreset('01711987654')}
            className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#16382d] text-[#8de8bf] hover:bg-[#1f4a3c] transition-colors"
          >
            01711987654 (Safe 100%)
          </button>
          <button
            type="button"
            onClick={() => handlePreset('01677889900')}
            className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#3c2a11] text-[#fcd34d] hover:bg-[#523a17] transition-colors"
          >
            01677889900 (Moderate 70%)
          </button>
          <button
            type="button"
            onClick={() => handlePreset('01988001122')}
            className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#4b1421] text-[#ff7991] hover:bg-[#681e30] transition-colors"
          >
            01988001122 (Fraud 9%)
          </button>
        </div>
      </div>

      {/* Live Result Cards */}
      {report && normalizeBdPhone(phoneNumber).length >= 8 && (
        <div className="space-y-4 pt-2">
          {/* Summary KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-xl bg-[#0e0c14] border border-[#2d2538]">
              <span className="text-[10px] text-[#a69ab1] uppercase font-bold block mb-1">
                {isBn ? 'মোট পার্সেল' : 'Total Parcels'}
              </span>
              <span className="text-xl font-bold font-mono text-white">
                {report.totalParcels} {isBn ? 'টি' : ''}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#0e0c14] border border-[#1b3d2c]">
              <span className="text-[10px] text-[#6ee7b7] uppercase font-bold block mb-1">
                {isBn ? 'রিসিভ / ডেলিভার্ড' : 'Delivered'}
              </span>
              <span className="text-xl font-bold font-mono text-[#36c98b]">
                {report.delivered} {isBn ? 'টি' : ''}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#0e0c14] border border-[#4d1624]">
              <span className="text-[10px] text-[#ff7991] uppercase font-bold block mb-1">
                {isBn ? 'ক্যানসেল / রিটার্ন' : 'Cancelled'}
              </span>
              <span className="text-xl font-bold font-mono text-[#ff4264]">
                {report.cancelled} {isBn ? 'টি' : ''}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#0e0c14] border border-[#2d2538]">
              <span className="text-[10px] text-[#cfc4d9] uppercase font-bold block mb-1">
                {isBn ? 'ডেলিভারি সাকসেস রেট' : 'Success Rate'}
              </span>
              <span
                className={`text-xl font-bold font-mono ${
                  report.deliveryRate >= 80
                    ? 'text-[#36c98b]'
                    : report.deliveryRate >= 60
                    ? 'text-[#f59e0b]'
                    : 'text-[#ff4264]'
                }`}
              >
                {report.deliveryRate}%
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-[11px] mb-1 font-semibold">
              <span className="text-[#a69ab1]">
                {isBn ? 'পার্সেল সফলতার হার' : 'Success vs Cancellation Ratio'}:
              </span>
              <span className="text-white font-mono">{report.deliveryRate}% Success</span>
            </div>
            <div className="h-2 w-full bg-[#201a2b] rounded-full overflow-hidden flex">
              <div
                style={{ width: `${report.deliveryRate}%` }}
                className={`h-full ${
                  report.deliveryRate >= 80
                    ? 'bg-[#36c98b]'
                    : report.deliveryRate >= 60
                    ? 'bg-[#f59e0b]'
                    : 'bg-[#ff4264]'
                } transition-all duration-300`}
              />
              <div
                style={{ width: `${100 - report.deliveryRate}%` }}
                className="h-full bg-[#ff4264]/40"
              />
            </div>
          </div>

          {/* Courier Breakdown Details */}
          <div className="p-3.5 rounded-xl bg-[#0c0a12] border border-[#31273e] space-y-2.5">
            <h4 className="text-xs font-bold text-white flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#bd70df]" />
                {isBn
                  ? 'কুরিয়ার সার্ভিস অনুযায়ী ক্যান্সেলেশন ও ডেলিভারি বিবরণী'
                  : 'Courier-wise Cancellation & Delivery Breakdown'}
              </span>
              <span className="text-[10px] text-[#8e829d]">
                {isBn ? 'লাইভ কুরিয়ার ডাটাবেজ' : 'Live Courier Feed'}
              </span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              {/* Steadfast */}
              <div className="p-2.5 rounded-lg bg-[#14101c] border border-[#2b2236] flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-white">Steadfast Courier</span>
                  <span className="text-[10px] text-[#bd70df] font-mono">
                    {report.courierBreakdown.steadfast.delivered +
                      report.courierBreakdown.steadfast.cancelled}{' '}
                    orders
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#36c98b] flex items-center gap-1">
                    ✓ {report.courierBreakdown.steadfast.delivered} {isBn ? 'সফল' : 'Delivered'}
                  </span>
                  <span
                    className={`font-bold flex items-center gap-1 ${
                      report.courierBreakdown.steadfast.cancelled > 0
                        ? 'text-[#ff4264]'
                        : 'text-[#8e829d]'
                    }`}
                  >
                    ✗ {report.courierBreakdown.steadfast.cancelled} {isBn ? 'বাতিল' : 'Cancelled'}
                  </span>
                </div>
              </div>

              {/* Pathao */}
              <div className="p-2.5 rounded-lg bg-[#14101c] border border-[#2b2236] flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-white">Pathao Courier</span>
                  <span className="text-[10px] text-[#bd70df] font-mono">
                    {report.courierBreakdown.pathao.delivered +
                      report.courierBreakdown.pathao.cancelled}{' '}
                    orders
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#36c98b] flex items-center gap-1">
                    ✓ {report.courierBreakdown.pathao.delivered} {isBn ? 'সফল' : 'Delivered'}
                  </span>
                  <span
                    className={`font-bold flex items-center gap-1 ${
                      report.courierBreakdown.pathao.cancelled > 0
                        ? 'text-[#ff4264]'
                        : 'text-[#8e829d]'
                    }`}
                  >
                    ✗ {report.courierBreakdown.pathao.cancelled} {isBn ? 'বাতিল' : 'Cancelled'}
                  </span>
                </div>
              </div>

              {/* RedX */}
              <div className="p-2.5 rounded-lg bg-[#14101c] border border-[#2b2236] flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-white">RedX Logistics</span>
                  <span className="text-[10px] text-[#bd70df] font-mono">
                    {report.courierBreakdown.redx.delivered +
                      report.courierBreakdown.redx.cancelled}{' '}
                    orders
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#36c98b] flex items-center gap-1">
                    ✓ {report.courierBreakdown.redx.delivered} {isBn ? 'সফল' : 'Delivered'}
                  </span>
                  <span
                    className={`font-bold flex items-center gap-1 ${
                      report.courierBreakdown.redx.cancelled > 0
                        ? 'text-[#ff4264]'
                        : 'text-[#8e829d]'
                    }`}
                  >
                    ✗ {report.courierBreakdown.redx.cancelled} {isBn ? 'বাতিল' : 'Cancelled'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Advice & Recommendation */}
          <div
            className={`p-3 rounded-xl border text-xs leading-relaxed ${
              report.riskLevel === 'High'
                ? 'bg-[#37111b] border-[#ff4264]/40 text-[#ffb0be]'
                : report.riskLevel === 'Moderate'
                ? 'bg-[#31210c] border-[#f59e0b]/40 text-[#fde68a]'
                : 'bg-[#10291d] border-[#10b981]/40 text-[#a7f3d0]'
            }`}
          >
            <div className="font-bold mb-1 flex items-center gap-1.5">
              <span>💡 {isBn ? 'মার্চেন্টের জন্য পরামর্শ:' : 'Actionable Advice:'}</span>
            </div>
            <p>{report.recommendation}</p>

            {report.notes.length > 0 && (
              <ul className="mt-2 list-disc list-inside space-y-0.5 text-[11px] opacity-90">
                {report.notes.map((note, i) => (
                  <li key={i}>{note}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
