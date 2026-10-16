import React, { useState } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Phone,
  User,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { normalizeBdPhone } from '../utils/fraudChecker';

interface WhatsAppChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPhone?: string;
  defaultCustomerName?: string;
}

export const WhatsAppChatModal: React.FC<WhatsAppChatModalProps> = ({
  isOpen,
  onClose,
  defaultPhone = '',
  defaultCustomerName = '',
}) => {
  const [phone, setPhone] = useState(defaultPhone);
  const [customerName, setCustomerName] = useState(defaultCustomerName);
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const templates = [
    {
      titleBn: 'অর্ডার কনফার্মেশন',
      titleEn: 'Order Confirmation',
      text: `আসসালামু আলাইকুম ${customerName ? customerName + ' আপু/ম্যাম' : ''}! ALVINA Women's Collection থেকে বলছি। আপনার সুন্দর ড্রেস অর্ডারটি কনফার্ম করার জন্য মেসেজ দেওয়া হয়েছে। অনুগ্রহ করে ডেলিভারির ঠিকানা ও সাইজ নিশ্চিত করুন। ধন্যবাদ!`,
    },
    {
      titleBn: 'প্রি-অর্ডার তৈরি সম্পন্ন',
      titleEn: 'Pre-order Ready',
      text: `আসসালামু আলাইকুম ${customerName || ''}! আপনার প্রি-অর্ডারকৃত আলভিনা এক্সক্লুসিভ ড্রেসটি তৈরি সম্পন্ন হয়েছে এবং স্টকে চলে এসেছে। আমরা কি আজই পার্সেলটি কুরিয়ারে বুকিং করে দেব?`,
    },
    {
      titleBn: 'কুরিয়ার ট্র্যাকিং ও ডেলিভারি',
      titleEn: 'Courier Tracking',
      text: `শুভ দিন ${customerName || ''}! আপনার আলভিনা পার্সেলটি কুরিয়ার সার্ভিসে হস্তান্তর করা হয়েছে। আগামী ২৪-৪৮ ঘণ্টার মধ্যে ডেলিভারি রাইডার আপনার সাথে যোগাযোগ করবেন।`,
    },
    {
      titleBn: 'কার্ট ফেলে যাওয়া কাস্টমার ফলো-আপ',
      titleEn: 'Abandoned Cart Follow-up',
      text: `আসসালামু আলাইকুম ${customerName || ''}! আপনি আলভিনা ওয়েবসাইটে একটি আকর্ষণীয় ড্রেস পছন্দ করে ব্যাগে রেখেছিলেন। অর্ডার সম্পন্ন করতে বা কোনো সাইজ সংক্রান্ত প্রশ্ন থাকলে আমাদের জানান, বিশেষ ছাড় প্রদান করা হবে!`,
    },
    {
      titleBn: 'সাইজ ও কালার এক্সচেঞ্জ হেল্প',
      titleEn: 'Size Exchange Support',
      text: `আসসালামু আলাইকুম ${customerName || ''}! আপনার ড্রেসের সাইজ বা ডিজাইন এক্সচেঞ্জ সংক্রান্ত যে কোনো সহায়তার জন্য আমরা প্রস্তুত। অনুগ্রহ করে আপনার পছন্দের সাইজটি আমাদের জানান।`,
    },
  ];

  const handleOpenWhatsApp = () => {
    const raw = normalizeBdPhone(phone);
    if (!raw || raw.length < 10) {
      alert('সঠিক ১১ ডিজিটের ফোন নম্বর দিন (যেমন: 017XXXXXXXX)');
      return;
    }
    const intlPhone = '880' + raw.slice(-10);
    const encoded = encodeURIComponent(message || `আসসালামু আলাইকুম ${customerName || ''}, ALVINA Women's Collection থেকে বলছি।`);
    const url = `https://wa.me/${intlPhone}?text=${encoded}`;
    window.open(url, '_blank');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl bg-[#16121f] border border-[#3e2e50] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#2e233c] bg-gradient-to-r from-[#1b1427] to-[#251838] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#25D366] text-white flex items-center justify-center shadow-lg">
              <MessageSquare className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>সরাসরি হোয়াটসঅ্যাপ চ্যাট (WhatsApp Direct Chat)</span>
              </h3>
              <p className="text-xs text-[#a69ab1]">
                গ্রাহকের নম্বরে সরাসরি বার্তা প্রেরণ ও ফলো-আপ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#a69ab1] hover:text-white hover:bg-[#2b1f3a] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs">
          {/* Customer & Phone row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[#cfc4d9] font-medium mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#bd70df]" />
                <span>গ্রাহকের নাম (Customer Name)</span>
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="যেমন: তানিয়া আক্তার"
                className="w-full px-3 py-2 bg-[#100d16] border border-[#3b2f4a] rounded-xl text-white outline-none focus:border-[#25D366]"
              />
            </div>
            <div>
              <label className="block text-[#cfc4d9] font-medium mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#25D366]" />
                <span>হোয়াটসঅ্যাপ নম্বর (WhatsApp No) *</span>
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="017XXXXXXXX"
                className="w-full px-3 py-2 bg-[#100d16] border border-[#3b2f4a] rounded-xl text-white font-mono outline-none focus:border-[#25D366]"
              />
            </div>
          </div>

          {/* Quick Templates */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[#a69ab1] font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#f59e0b]" />
                <span>রেডিমেড মেসেজ টেমপ্লেট নির্বাচন করুন:</span>
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {templates.map((tpl, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setMessage(tpl.text)}
                  className="px-2.5 py-1 rounded-lg bg-[#21172e] hover:bg-[#34224b] text-[#e3ccf8] border border-[#44325a] text-[11px] font-medium transition-colors"
                >
                  {tpl.titleBn}
                </button>
              ))}
            </div>
          </div>

          {/* Message Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[#cfc4d9] font-medium">মেসেজ টেক্সট (Message Body)</label>
              {message && (
                <button
                  type="button"
                  onClick={handleCopy}
                  className="text-[11px] text-[#bd70df] hover:underline flex items-center gap-1"
                >
                  {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'কপি হয়েছে!' : 'কপি করুন'}</span>
                </button>
              )}
            </div>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="গ্রাহকের কাছে পাঠানোর মেসেজ এখানে লিখুন..."
              className="w-full p-3 bg-[#100d16] border border-[#3b2f4a] rounded-xl text-white outline-none focus:border-[#25D366] leading-relaxed resize-none text-xs"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#140f1d] border-t border-[#2e233c] flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#a69ab1] hover:text-white hover:bg-[#251b34]"
          >
            বাতিল
          </button>
          <button
            onClick={handleOpenWhatsApp}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-[#25D366] text-white hover:bg-[#20ba59] shadow-lg shadow-[#25D366]/20 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>সরাসরি হোয়াটসঅ্যাপে পাঠান</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </button>
        </div>
      </div>
    </div>
  );
};
