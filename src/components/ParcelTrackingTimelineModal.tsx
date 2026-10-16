import React from 'react';
import { Order } from '../types';
import {
  X,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Phone,
  Copy,
  Check,
} from 'lucide-react';

interface ParcelTrackingTimelineModalProps {
  order: Order | null;
  onClose: () => void;
}

export const ParcelTrackingTimelineModal: React.FC<ParcelTrackingTimelineModalProps> = ({
  order,
  onClose,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!order) return null;

  const courierName = order.courierService || 'Steadfast Courier';
  const consignmentId = order.courierConsignmentId || `CN-${order.id}-9821`;
  const trackingCode = order.courierTrackingCode || `ST-${order.id}-4012`;
  const currentStatus = order.courierStatus || (order.status === 'Delivered' ? 'Delivered' : order.status === 'Shipped' ? 'In Transit' : 'Pending');

  const steps = [
    {
      id: 'placed',
      title: 'Order Placed (অর্ডার গৃহীত)',
      description: 'অর্ডার কনফার্ম হয়েছে এবং ইনভেন্টরি থেকে পিকিং তালিকা তৈরি করা হয়েছে।',
      time: new Date(order.date).toLocaleDateString('bn-BD', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      hub: 'ALVINA Central Warehouse, Dhaka',
      completed: true,
      current: currentStatus === 'Pending' && order.status === 'Pending',
    },
    {
      id: 'picked',
      title: 'Picked by Courier (পার্সেল সংগ্রহ)',
      description: `${courierName}-এর রাইডার পার্সেল স্ক্যান করে ব্যাগে তুলেছে।`,
      time: order.courierSentAt || '১০:৪৫ AM (Yesterday)',
      hub: `${courierName} Tejgaon Sorting Hub`,
      completed: ['Sent to Courier', 'In Transit', 'Out for Delivery', 'Delivered'].includes(currentStatus) || order.status === 'Shipped' || order.status === 'Delivered',
      current: currentStatus === 'Sent to Courier',
    },
    {
      id: 'transit',
      title: 'In Transit (হাব ট্রানজিট)',
      description: 'পার্সেলটি ডেস্টিনেশন ডিস্ট্রিবিউশন সেন্টারে স্থানান্তরিত হচ্ছে।',
      time: '০২:৩০ PM',
      hub: order.area === 'dhaka' ? 'Mirpur Delivery Hub, Dhaka' : 'District Regional Delivery Center',
      completed: ['In Transit', 'Out for Delivery', 'Delivered'].includes(currentStatus) || order.status === 'Delivered',
      current: currentStatus === 'In Transit' || (order.status === 'Shipped' && currentStatus !== 'Out for Delivery'),
    },
    {
      id: 'out_delivery',
      title: 'Out for Delivery (ডেলিভারির পথে)',
      description: 'ডেলিভারি রাইডার কাস্টমারের ঠিকানার উদ্দেশ্যে বের হয়েছে।',
      time: '০৯:১৫ AM',
      hub: 'Local Courier Rider Assigned',
      completed: ['Out for Delivery', 'Delivered'].includes(currentStatus) || order.status === 'Delivered',
      current: currentStatus === 'Out for Delivery',
    },
    {
      id: 'delivered',
      title: 'Delivered & COD Collected (সফল ডেলিভারি)',
      description: `গ্রাহক পার্সেল রিসিভ করেছেন এবং ক্যাশ কালেকশন ৳${order.due} সম্পন্ন হয়েছে।`,
      time: order.status === 'Delivered' ? '০৪:২০ PM' : 'প্রত্যাশিত আজ বিকাল',
      hub: order.address,
      completed: currentStatus === 'Delivered' || order.status === 'Delivered',
      current: currentStatus === 'Delivered' || order.status === 'Delivered',
    },
  ];

  const handleCopyTracking = () => {
    navigator.clipboard.writeText(`${consignmentId} (${trackingCode})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#16121f] border border-[#4a365b] rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#342b40] bg-[#120f18] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7a2e9e] to-[#a344cb] flex items-center justify-center text-white shadow-md">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">Live Parcel Timeline</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#16382d] text-[#8de8bf] border border-[#255845]">
                  Active
                </span>
              </div>
              <p className="text-xs text-[#bd70df] font-mono mt-0.5">
                Order #{order.id} · {courierName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#a69ab1] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Consignment Banner */}
        <div className="px-5 py-3 bg-[#1c1628] border-b border-[#342b40] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <div className="text-[10px] text-[#a69ab1]">Consignment / Tracking ID:</div>
            <div className="font-mono font-bold text-white flex items-center gap-2">
              <span>{consignmentId}</span>
              <button
                onClick={handleCopyTracking}
                className="text-[#a69ab1] hover:text-[#bd70df] transition-colors"
                title="Copy Consignment ID"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] text-[#a69ab1]">Cash on Delivery (Due COD):</div>
            <div className="font-mono font-bold text-[#ff9aaa] text-sm">৳{order.due}</div>
          </div>
        </div>

        {/* Timeline body */}
        <div className="p-5 max-h-[60vh] overflow-y-auto space-y-4">
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#342b40]">
            {steps.map((st, idx) => (
              <div key={st.id} className="relative group">
                {/* Node icon indicator */}
                <div
                  className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                    st.completed
                      ? 'bg-[#10b981] text-[#062419] shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                      : st.current
                      ? 'bg-[#bd70df] text-white ring-4 ring-[#bd70df]/20 animate-pulse'
                      : 'bg-[#251d30] border border-[#473b57] text-[#7d718b]'
                  }`}
                >
                  {st.completed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 font-bold" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-current" />
                  )}
                </div>

                <div className="bg-[#191424] border border-[#342b40] rounded-xl p-3 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-white">{st.title}</span>
                    <span className="text-[10px] text-[#a69ab1] font-mono">{st.time}</span>
                  </div>
                  <p className="text-[11px] text-[#cfc4d9] leading-relaxed">{st.description}</p>
                  <div className="text-[10px] text-[#bd70df] flex items-center gap-1 pt-0.5">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">{st.hub}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer with Actions */}
        <div className="p-4 border-t border-[#342b40] bg-[#120f18] flex items-center justify-between text-xs">
          <div className="text-[11px] text-[#a69ab1]">
            কাস্টমার: <span className="text-white font-medium">{order.customer}</span> ({order.phone})
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const phone = order.phone.replace(/\D/g, '');
                const url = `https://wa.me/88${phone.startsWith('88') ? phone.slice(2) : phone}?text=${encodeURIComponent(
                  `Assalamu Alaikum ${order.customer},\nYour parcel #${order.id} with ${courierName} is on the way!\nTracking: ${consignmentId}\nDue COD: ৳${order.due}\nThank you, ALVINA.`
                )}`;
                window.open(url, '_blank');
              }}
              className="px-3 py-1.5 rounded-lg bg-[#25D366] text-black font-bold hover:brightness-110 flex items-center gap-1.5 transition-all"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>WhatsApp Alert</span>
            </button>
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-[#251d30] text-white hover:bg-[#342942] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
