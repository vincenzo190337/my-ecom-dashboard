import React from 'react';
import { Order, CrmCustomer } from '../types';
import {
  X,
  User,
  Phone,
  MapPin,
  ShoppingBag,
  Award,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  MessageCircle,
  ExternalLink,
  Calendar,
  CreditCard,
  RotateCcw,
} from 'lucide-react';

interface CustomerProfileDrawerProps {
  customerPhone: string | null;
  orders: Order[];
  crmCustomers?: CrmCustomer[];
  onClose: () => void;
  onOpenOrder?: (order: Order) => void;
}

export const CustomerProfileDrawer: React.FC<CustomerProfileDrawerProps> = ({
  customerPhone,
  orders,
  crmCustomers = [],
  onClose,
  onOpenOrder,
}) => {
  if (!customerPhone) return null;

  // Filter orders for this customer
  const cleanTargetPhone = customerPhone.replace(/\D/g, '').slice(-11);
  const customerOrders = orders.filter((o) => {
    const cleanOPhone = o.phone.replace(/\D/g, '').slice(-11);
    return cleanOPhone && cleanTargetPhone && cleanOPhone === cleanTargetPhone;
  });

  const latestOrder = customerOrders[0];
  const customerName = latestOrder?.customer || 'Customer';
  const customerAddress = latestOrder?.address || 'Dhaka, Bangladesh';

  // Find CRM record if any
  const crmRecord = crmCustomers.find((c) => c.phone.replace(/\D/g, '').slice(-11) === cleanTargetPhone);

  const totalSpent = customerOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const deliveredOrders = customerOrders.filter((o) => o.status === 'Delivered');
  const returnedOrders = customerOrders.filter((o) => o.status === 'Returned' || o.status === 'Cancelled');
  const returnRate = customerOrders.length > 0 ? Math.round((returnedOrders.length / customerOrders.length) * 100) : 0;

  // Tier calculation
  let vipTier = 'Regular Member';
  let vipBadgeColor = 'bg-[#1b233a] text-[#60a5fa] border-[#3b82f6]/40';
  let vipIcon = '🌟';

  if (totalSpent >= 12000 || customerOrders.length >= 5) {
    vipTier = '💎 Diamond VIP';
    vipBadgeColor = 'bg-[#2b1738] text-[#e879f9] border-[#c026d3]/50';
    vipIcon = '💎';
  } else if (totalSpent >= 5000 || customerOrders.length >= 3) {
    vipTier = '🥇 Gold Member';
    vipBadgeColor = 'bg-[#2e220e] text-[#fbbf24] border-[#d97706]/50';
    vipIcon = '🥇';
  }

  const isHighRisk = returnRate > 40 || (crmRecord && (crmRecord.fraudRiskScore === 'High Risk / Fraud' || (crmRecord as any).riskScore > 50));

  const handleOpenWhatsApp = () => {
    const p = customerPhone.replace(/\D/g, '');
    const intl = p.startsWith('880') ? p : p.startsWith('0') ? '88' + p : '880' + p;
    window.open(`https://wa.me/${intl}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <aside className="w-screen max-w-md bg-[#16121f] border-l border-[#3d2f4d] shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-[#342b40] bg-[#120f18] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7a2e9e] to-[#bd70df] flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-[#bd70df]/20">
                {customerName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-base truncate">{customerName}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${vipBadgeColor}`}>
                    {vipTier}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#a69ab1] mt-0.5">
                  <Phone className="w-3 h-3 text-[#bd70df]" />
                  <span className="font-mono">{customerPhone}</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#a69ab1] hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="p-4 bg-[#191424] border-b border-[#342b40] grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 rounded-xl bg-[#120e1a] border border-[#2e243a]">
              <div className="text-[10px] text-[#a69ab1] uppercase tracking-wider font-semibold">Total Orders</div>
              <div className="text-base font-bold text-white font-mono mt-0.5">{customerOrders.length}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#120e1a] border border-[#2e243a]">
              <div className="text-[10px] text-[#a69ab1] uppercase tracking-wider font-semibold">Lifetime Spend</div>
              <div className="text-base font-bold text-[#bd70df] font-mono mt-0.5">৳{totalSpent.toLocaleString()}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#120e1a] border border-[#2e243a]">
              <div className="text-[10px] text-[#a69ab1] uppercase tracking-wider font-semibold">Return Rate</div>
              <div className={`text-base font-bold font-mono mt-0.5 ${returnRate > 30 ? 'text-[#ff6b83]' : 'text-[#36c98b]'}`}>
                {returnRate}%
              </div>
            </div>
          </div>

          {/* Fraud / Delivery Trust Alert */}
          <div className="px-5 py-3 border-b border-[#342b40]">
            {isHighRisk ? (
              <div className="p-3 rounded-xl bg-[#3d131f] border border-[#7a283e] flex items-center gap-2.5 text-xs text-[#ff9aaa]">
                <ShieldAlert className="w-5 h-5 text-[#ff4264] shrink-0" />
                <div>
                  <span className="font-bold text-white">উচ্চ ঝুঁকি (High Return Risk):</span> ডেলিভারি চার্জ অগ্রিম ছাড়া পার্সেল পাঠানো থেকে বিরত থাকুন!
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-[#112920] border border-[#1b5840] flex items-center gap-2.5 text-xs text-[#a5f3d0]">
                <ShieldCheck className="w-5 h-5 text-[#10b981] shrink-0" />
                <div>
                  <span className="font-bold text-white">বিশ্বস্ত কাস্টমার (Verified Buyer):</span> ডেলিভারি সাকসেস রেট চমৎকার।
                </div>
              </div>
            )}
          </div>

          {/* Body: Past Orders History */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>Purchase History (পূর্ববর্তী অর্ডারসমূহ)</span>
                <span className="text-[11px] text-[#a69ab1] font-mono">{customerOrders.length} records</span>
              </div>
              <p className="text-[11px] text-[#a69ab1]">
                ডিফল্ট ডেলিভারি ঠিকানা: <span className="text-[#cfc4d9] font-medium">{customerAddress}</span>
              </p>
            </div>

            <div className="space-y-2.5">
              {customerOrders.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#a69ab1]">
                  এই নম্বরের কোনো পূর্ববর্তী অর্ডার রেকর্ড পাওয়া যায়নি।
                </div>
              ) : (
                customerOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-3 rounded-xl bg-[#191424] border border-[#342b40] hover:border-[#bd70df]/50 transition-all text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white">#{ord.id}</span>
                        <span className="text-[10px] text-[#a69ab1]">
                          {new Date(ord.date).toLocaleDateString('bn-BD', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          ord.status === 'Delivered'
                            ? 'bg-[#16382d] text-[#8de8bf]'
                            : ord.status === 'Cancelled' || ord.status === 'Returned'
                            ? 'bg-[#401822] text-[#ff9aaa]'
                            : 'bg-[#291738] text-[#e3b7f3]'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </div>

                    <div className="text-[11px] text-[#cfc4d9] space-y-0.5">
                      {ord.items.map((it, i) => (
                        <div key={i} className="flex justify-between">
                          <span className="truncate pr-2">
                            • {it.name} (x{it.qty}) {it.size ? `[${it.size}]` : ''}
                          </span>
                          <span className="font-mono text-[#a69ab1]">৳{it.price * it.qty}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-[#2e243a] flex items-center justify-between text-[11px]">
                      <span className="text-[#a69ab1]">কুরিয়ার: {ord.courierService || 'Steadfast'}</span>
                      <span className="font-mono font-bold text-[#bd70df]">সর্বমোট: ৳{ord.total}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-[#342b40] bg-[#120f18] flex items-center gap-2">
            <button
              onClick={handleOpenWhatsApp}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#128C7E] to-[#25D366] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:brightness-110 active:scale-95 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp চ্যাট</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[#241c30] text-white font-medium text-xs hover:bg-[#322644] transition-colors"
            >
              Close
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};
