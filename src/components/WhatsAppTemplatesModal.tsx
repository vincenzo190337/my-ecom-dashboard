import React, { useState } from 'react';
import { Order, SystemConfig } from '../types';
import { X, MessageCircle, Send, Copy, Check, Sparkles, Phone } from 'lucide-react';

interface WhatsAppTemplatesModalProps {
  order: Order | null;
  config: SystemConfig;
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsAppTemplatesModal: React.FC<WhatsAppTemplatesModalProps> = ({
  order,
  config,
  isOpen,
  onClose,
}) => {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  if (!isOpen || !order) return null;

  const courierName = order.courierService || config.defaultCourier || 'Steadfast Courier';
  const consignmentId = order.courierConsignmentId || order.courierTrackingCode || `CN-${order.id}`;

  const cleanPhone = order.phone.replace(/\D/g, '');
  const intlPhone = cleanPhone.startsWith('880')
    ? cleanPhone
    : cleanPhone.startsWith('0')
    ? '88' + cleanPhone
    : '880' + cleanPhone;

  const templates = [
    {
      id: 'confirmed',
      title: '১. Order Confirmed (অর্ডার নিশ্চিতকরণ)',
      tag: 'Confirmation',
      badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-700',
      message:
        `🌸 ALVINA Exclusive Boutique\n` +
        `আসসালামু আলাইকুম ${order.customer} আপু,\n` +
        `আপনার অর্ডার #${order.id} সফলভাবে নিশ্চিত (Confirmed) করা হয়েছে।\n\n` +
        `👗 আইটেম: ${order.items.map((i) => `${i.name} (x${i.qty})`).join(', ')}\n` +
        `💰 মোট বিল: ৳${order.total}\n` +
        `🚚 ক্যাশ অন ডেলিভারি (Due COD): ৳${order.due}\n` +
        `📍 ডেলিভারি ঠিকানা: ${order.address}\n\n` +
        `পার্সেল প্রস্তুত হলে আমরা আপনাকে কুরিয়ার ট্র্যাকিং লিঙ্ক পাঠাব। ধন্যবাদ!`,
    },
    {
      id: 'dispatched',
      title: '২. Parcel Dispatched with Tracking (কুরিয়ার ট্র্যাকিং)',
      tag: 'Tracking',
      badgeColor: 'bg-blue-950 text-blue-300 border-blue-700',
      message:
        `📦 ALVINA Dispatch Alert\n` +
        `প্রিয় ${order.customer} আপু,\n` +
        `আপনার অর্ডার #${order.id}-এর পার্সেলটি ${courierName}-এ হ্যান্ডওভার করা হয়েছে।\n\n` +
        `🚚 কুরিয়ার: ${courierName}\n` +
        `🔖 কনসাইনমেন্ট কোড: ${consignmentId}\n` +
        `💵 ডেলিভারির সময় প্রদেয় (Cash on Delivery): ৳${order.due}\n\n` +
        `আগামী ২৪-৪৮ ঘণ্টার মধ্যে রাইডার আপনার সাথে ফোনে যোগাযোগ করবে। পার্সেলটি চেক করে রিসিভ করবেন। ধন্যবাদ!`,
    },
    {
      id: 'delivered',
      title: '৩. Delivered & Review Request (ডেলিভারি ফিডব্যাক)',
      tag: 'Feedback',
      badgeColor: 'bg-purple-950 text-purple-300 border-purple-700',
      message:
        `🌸 ALVINA Commerce Review Request\n` +
        `আসসালামু আলাইকুম ${order.customer} আপু,\n` +
        `আশা করি আপনার পার্সেলটি #${order.id} হাতে পেয়েছেন।\n\n` +
        `আমাদের ড্রেসটির কোয়ালিটি, ফ্যাব্রিক ও ফিটিং আপনার কেমন লেগেছে? আপনার একটি ছোট রিভিউ আমাদের জন্য অনেক অনুপ্রেরণাদায়ক হবে।\n\n` +
        `পরবর্তী অর্ডারে আপনার জন্য থাকছে বিশেষ ৫% লয়ালটি ডিসকাউন্ট! সুস্থ থাকুন, ভালো থাকুন। 💖`,
    },
    {
      id: 'preorder_advance',
      title: '৪. Pre-Order Advance Reminder (অগ্রিম জমার রিমাইন্ডার)',
      tag: 'Advance',
      badgeColor: 'bg-amber-950 text-amber-300 border-amber-700',
      message:
        `⚠️ ALVINA Pre-Order Notice\n` +
        `প্রিয় ${order.customer} আপু,\n` +
        `আপনার প্রি-অর্ডার ড্রেস #${order.id} প্রস্তুত করার কাজ শুরু হয়েছে।\n\n` +
        `ডেলিভারি চার্জ বাবদ ৳${order.charge || 150} অগ্রিম জমা দেওয়ার অনুরোধ করা যাচ্ছে:\n` +
        `📱 বিকাশ / নগদ (মার্চেন্ট): ${config.whatsapp || '01956591199'}\n` +
        `টাকা পাঠিয়ে শেষ ৪ ডিজিট দিয়ে রিপ্লাই দিন। ধন্যবাদ!`,
    },
  ];

  const handleSendWhatsApp = (msg: string) => {
    const url = `https://wa.me/${intlPhone}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  const handleCopyMessage = (idx: number, msg: string) => {
    navigator.clipboard.writeText(msg);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-[#16121f] border border-[#523868] rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#342b40] bg-[#120f18] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#128C7E] to-[#25D366] flex items-center justify-center text-white shadow-md">
              <MessageCircle className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>WhatsApp Automation Message Hub</span>
                <span className="text-[10px] bg-[#25D366]/20 text-[#25D366] px-2 py-0.5 rounded-full border border-[#25D366]/40 font-mono">
                  1-Click Send
                </span>
              </h3>
              <p className="text-[11px] text-[#a69ab1]">
                কাস্টমার: <span className="text-white font-medium">{order.customer}</span> ({order.phone}) · Order #{order.id}
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

        {/* Templates List */}
        <div className="p-5 max-h-[65vh] overflow-y-auto space-y-4 text-xs">
          {templates.map((tpl, idx) => (
            <div
              key={tpl.id}
              className="p-4 rounded-xl bg-[#191424] border border-[#342b40] hover:border-[#bd70df]/50 transition-all space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-xs">{tpl.title}</span>
                  <span className={`text-[10px] px-2 py-0.2 rounded-full border font-semibold ${tpl.badgeColor}`}>
                    {tpl.tag}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyMessage(idx, tpl.message)}
                    className="p-1.5 rounded-lg bg-[#20182b] text-[#a69ab1] hover:text-white flex items-center gap-1 text-[11px] transition-colors"
                    title="টেক্সট কপি করুন"
                  >
                    {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedIdx === idx ? 'কপি হয়েছে' : 'কপি'}</span>
                  </button>

                  <button
                    onClick={() => handleSendWhatsApp(tpl.message)}
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#128C7E] to-[#25D366] text-white font-bold flex items-center gap-1.5 shadow-sm hover:brightness-110 active:scale-95 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>WhatsApp-এ পাঠান</span>
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#110d18] border border-[#2a2036] font-sans text-[#cfc4d9] text-[11px] whitespace-pre-line leading-relaxed select-text">
                {tpl.message}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#342b40] bg-[#120f18] flex items-center justify-between text-xs">
          <span className="text-[#a69ab1] text-[11px]">
            বাটনে ক্লিক করলেই স্বয়ংক্রিয়ভাবে কাস্টমারের নম্বরে মেসেজ লোড হয়ে WhatsApp খুলবে।
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#251d30] text-white hover:bg-[#342942] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
