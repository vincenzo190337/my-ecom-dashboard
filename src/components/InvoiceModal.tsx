import React, { useState } from 'react';
import { Order, SystemConfig } from '../types';
import {
  X,
  Printer,
  Copy,
  Check,
  Receipt,
  Tag,
  FileText,
  Phone,
  MapPin,
  Truck,
  QrCode,
  Sparkles,
  Zap,
} from 'lucide-react';

interface InvoiceModalProps {
  order: Order | null;
  config: SystemConfig;
  onClose: () => void;
  initialFormat?: PrintFormat;
}

export type PrintFormat = 'sticker4x6' | 'roll2inch' | 'thermal' | 'a4invoice';

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  order,
  config,
  onClose,
  initialFormat = 'sticker4x6',
}) => {
  const [format, setFormat] = useState<PrintFormat>(initialFormat);
  const [copied, setCopied] = useState(false);

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Intl.DateTimeFormat('bn-BD', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(new Date(order.date));

  const handleCopyMemoText = () => {
    const itemsText = order.items
      .map((i) => `• ${i.name} (x${i.qty})${i.size ? ` [সাইজ: ${i.size}]` : ''} - ৳${i.price * i.qty}`)
      .join('\n');

    const memoText =
      `🌸 ALVINA COMMERCE - কাস্টমার চালান #${order.id}\n` +
      `তারিখ: ${formattedDate}\n` +
      `------------------------------------\n` +
      `গ্রাহক: ${order.customer}\n` +
      `মোবাইল: ${order.phone}\n` +
      `ঠিকানা: ${order.address}\n` +
      `কুরিয়ার: ${order.courierService || 'Steadfast Courier'}\n` +
      `------------------------------------\n` +
      `আইটেমসমূহ:\n${itemsText}\n` +
      `------------------------------------\n` +
      `সাবটোটাল: ৳${order.subtotal}\n` +
      `ডেলিভারি চার্জ: ৳${order.charge}\n` +
      (order.discount ? `ডিসকাউন্ট: -৳${order.discount}\n` : '') +
      `সর্বমোট: ৳${order.total}\n` +
      (order.advance ? `অগ্রিম জমা: ৳${order.advance}\n` : '') +
      `ক্যাশ অন ডেলিভারি (Due COD): ৳${order.due}\n` +
      `------------------------------------\n` +
      `হটলাইন: ${config.whatsapp}`;

    navigator.clipboard.writeText(memoText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const courierName = order.courierService || config.defaultCourier || 'Steadfast Courier';
  const consignmentId = order.courierConsignmentId || `CN-${order.id}-892`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#15121c] border border-[#382d46] rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="no-print p-3 sm:p-4 border-b border-[#342b40] bg-[#120f18] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#bd70df]/20 flex items-center justify-center text-[#bd70df]">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>থার্মাল স্টিকার ও ইনভয়েস জেনারেটর</span>
                <span className="text-[11px] font-mono text-[#bd70df]">#{order.id}</span>
              </div>
              <p className="text-[10px] text-[#a69ab1]">
                রোল ওয়ালা বারকোড থার্মাল প্রিন্টারে ৪×৬ ইঞ্চি পার্সেল স্টিকার বা A4 চালান প্রিন্ট করুন
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMemoText}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[#211b2b] hover:bg-[#2e233d] text-[#e8d9f0] border border-[#3b2f4a] flex items-center gap-1.5 transition-colors"
              title="চালান টেক্সট কপি করুন"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#36c98b]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'কপি হয়েছে' : 'কপি'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-[#bd70df] text-[#160e1b] hover:bg-[#d091ee] flex items-center gap-1.5 shadow-md transition-all active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>প্রিন্ট করুন (Print)</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#a69ab1] hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Format Selector Tabs */}
        <div className="no-print px-4 py-2 bg-[#191522] border-b border-[#342b40] flex flex-wrap items-center justify-center gap-1.5 text-xs">
          <button
            onClick={() => setFormat('sticker4x6')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
              format === 'sticker4x6'
                ? 'bg-[#bd70df] text-[#160e1b] shadow-sm'
                : 'bg-[#120f18] text-[#bcb1c7] hover:text-white border border-[#342b40]'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>৪x৬" কুরিয়ার স্টিকার (Thermal Sticker)</span>
          </button>

          <button
            onClick={() => setFormat('roll2inch')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
              format === 'roll2inch'
                ? 'bg-[#bd70df] text-[#160e1b] shadow-sm'
                : 'bg-[#120f18] text-[#bcb1c7] hover:text-white border border-[#342b40]'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>২" মিনি রোল (Roll 58mm)</span>
          </button>

          <button
            onClick={() => setFormat('thermal')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
              format === 'thermal'
                ? 'bg-[#bd70df] text-[#160e1b] shadow-sm'
                : 'bg-[#120f18] text-[#bcb1c7] hover:text-white border border-[#342b40]'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>৮০মিমি POS রসিদ (80mm Slip)</span>
          </button>

          <button
            onClick={() => setFormat('a4invoice')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
              format === 'a4invoice'
                ? 'bg-[#bd70df] text-[#160e1b] shadow-sm'
                : 'bg-[#120f18] text-[#bcb1c7] hover:text-white border border-[#342b40]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>A4 ফুল চালান (Standard Invoice)</span>
          </button>
        </div>

        {/* Preview Area */}
        <div className="p-4 sm:p-6 bg-[#0d0b12] flex justify-center items-start overflow-y-auto max-h-[75vh]">
          {/* FORMAT 1: 4x6 INCH THERMAL PARCEL STICKER (Most Requested for E-commerce Packaging) */}
          {format === 'sticker4x6' && (
            <div
              id="printable-memo"
              className="printable-slip-container w-full max-w-[380px] bg-white text-black p-4 rounded-xl shadow-2xl font-sans text-xs select-none border-2 border-black print:border-2"
              style={{ width: '100%', minHeight: '520px' }}
            >
              {/* Courier Brand & Barcode Header */}
              <div className="flex justify-between items-center pb-2 border-b-2 border-black">
                <div>
                  <div className="font-black text-base tracking-tight uppercase">
                    {courierName}
                  </div>
                  <div className="text-[10px] font-bold text-gray-700">
                    AIR EXPRESS PARCEL DELIVERY
                  </div>
                </div>
                <div className="text-right">
                  <div className="inline-block px-2 py-0.5 bg-black text-white font-mono font-black text-xs rounded">
                    ORDER #{order.id}
                  </div>
                  <div className="text-[9px] text-gray-600 font-mono mt-0.5">{formattedDate}</div>
                </div>
              </div>

              {/* Scannable Barcode Strip */}
              <div className="py-2 border-b-2 border-black text-center bg-gray-50">
                <div className="font-mono font-bold tracking-widest text-lg leading-none">
                  ||||| | |||| || ||||| | || ||||| ||| |
                </div>
                <div className="font-mono font-bold text-[11px] mt-1 tracking-wider">
                  *{consignmentId}*
                </div>
              </div>

              {/* Recipient Information Box (Big & Clear for Rider) */}
              <div className="py-3 border-b-2 border-black space-y-1">
                <div className="text-[10px] uppercase font-black text-gray-600 flex items-center justify-between">
                  <span>প্রাপক (RECIPIENT / CUSTOMER):</span>
                  <span className="font-mono text-black font-bold uppercase">{order.area || 'DHAKA'}</span>
                </div>
                <div className="font-black text-base text-black leading-tight">
                  {order.customer}
                </div>
                <div className="font-mono font-black text-lg tracking-wider bg-black text-white px-2 py-0.5 inline-block rounded">
                  📞 {order.phone}
                </div>
                <div className="text-xs font-semibold text-gray-900 leading-snug pt-1">
                  <span className="font-bold">ঠিকানা:</span> {order.address}
                </div>
                {order.shippingNote && (
                  <div className="text-[10px] font-bold text-red-700 bg-red-100 p-1 rounded border border-red-300">
                    ⚠️ ডেলিভারি নির্দেশ: {order.shippingNote}
                  </div>
                )}
              </div>

              {/* GIANT COD CASH COLLECTION BOX */}
              <div className="my-2.5 p-3 bg-yellow-100 border-4 border-black rounded-lg text-center print-highlight-box">
                <div className="text-[11px] font-black uppercase tracking-wider text-black">
                  ক্যাশ অন ডেলিভারি (DUE COD COLLECTION)
                </div>
                <div className="text-3xl font-black tabular-nums text-black leading-none mt-1">
                  ৳ {order.due}
                </div>
                <div className="text-[10px] font-bold text-gray-800 mt-1">
                  {order.due === 0 ? '✓ সম্পূর্ণ পরিশোধিত (PAID - Do Not Collect)' : '⚠️ রাইডার পার্সেল দেওয়ার সময় এই টাকা আদায় করুন'}
                </div>
              </div>

              {/* Items Summary */}
              <div className="py-2 border-b border-dashed border-black text-[11px]">
                <div className="font-bold text-[10px] text-gray-600 uppercase mb-1">প্যাকেজের আইটেম:</div>
                <div className="space-y-1">
                  {order.items.map((i, idx) => (
                    <div key={idx} className="flex justify-between font-medium">
                      <span className="truncate max-w-[240px]">
                        • {i.name} {i.size ? `(সাইজ: ${i.size})` : ''}
                      </span>
                      <span className="font-bold font-mono">x{i.qty}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipper Return Details */}
              <div className="pt-2 text-[9.5px] text-gray-700 flex justify-between items-end">
                <div>
                  <div className="font-black text-black text-[11px]">
                    প্রেরক: ALVINA Commerce
                  </div>
                  <div>হটলাইন: {config.whatsapp}</div>
                  <div>{config.storeAddress || 'Adabor / Dhanmondi, Dhaka'}</div>
                  <div className="text-[8.5px] text-gray-500 mt-0.5">Return Address: Central Hub, Dhaka</div>
                </div>
                <div className="text-right">
                  <div className="w-12 h-12 border-2 border-black p-0.5 rounded flex items-center justify-center font-mono text-[7px] text-center leading-none">
                    [ QR SCAN ]
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FORMAT 2: 2 INCH MINI ROLL STICKER (58mm Compact Label) */}
          {format === 'roll2inch' && (
            <div
              id="printable-memo"
              className="printable-slip-container w-full max-w-[240px] bg-white text-black p-3 rounded-lg shadow-xl font-mono text-[10px] leading-tight select-none border-2 border-black"
            >
              <div className="text-center font-bold pb-1 border-b border-black">
                <div className="text-xs">ALVINA COMMERCE</div>
                <div className="text-[9px]">{courierName}</div>
              </div>

              <div className="py-1 border-b border-black">
                <div className="font-black text-xs">#{order.id}</div>
                <div className="font-bold text-xs">{order.phone}</div>
                <div className="text-[9px] truncate">{order.customer}</div>
                <div className="text-[9px] leading-tight mt-0.5">{order.address}</div>
              </div>

              <div className="my-1.5 p-1.5 bg-yellow-100 border-2 border-black text-center font-bold">
                <div className="text-[9px]">DUE COD:</div>
                <div className="text-xl font-black">৳{order.due}</div>
              </div>

              <div className="text-[9px] pt-1 text-center">
                <div>|||||||||||||||||||||</div>
                <div>{consignmentId}</div>
              </div>
            </div>
          )}

          {/* FORMAT 3: 80mm POS RECEIPT SLIP */}
          {format === 'thermal' && (
            <div
              id="printable-memo"
              className="printable-slip-container w-full max-w-[320px] bg-white text-black p-4 rounded-lg shadow-xl font-mono text-[11px] leading-tight select-none border border-dashed border-gray-300"
            >
              <div className="text-center pb-2 border-b border-dashed border-black">
                <div className="text-base font-extrabold tracking-tight font-sans">
                  ALVINA COMMERCE
                </div>
                <div className="text-[10px] text-gray-700 font-sans">Exclusive Boutique & Women's Wear</div>
                <div className="text-[10px] text-gray-600 mt-0.5">হটলাইন: {config.whatsapp}</div>
              </div>

              <div className="py-2 border-b border-dashed border-black text-[10px] space-y-0.5">
                <div className="flex justify-between font-bold text-xs">
                  <span>MEMO: #{order.id}</span>
                  <span className="text-[10px] font-normal">{formattedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>উৎস: {order.source}</span>
                  <span>কুরিয়ার: {courierName}</span>
                </div>
              </div>

              <div className="py-2 border-b border-dashed border-black text-[10.5px]">
                <div className="font-bold text-[11px]">প্রাপক: {order.customer}</div>
                <div className="font-bold text-xs tracking-wider">মোবাইল: {order.phone}</div>
                <div className="text-gray-800 mt-0.5 leading-snug">ঠিকানা: {order.address}</div>
              </div>

              <div className="py-2 border-b border-dashed border-black">
                <table className="w-full text-left text-[10.5px]">
                  <thead>
                    <tr className="border-b border-black text-[10px] font-bold">
                      <th className="pb-1">আইটেম (সাইজ)</th>
                      <th className="pb-1 text-center">পরি.</th>
                      <th className="pb-1 text-right">মূল্য</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {order.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-1 pr-1">
                          <div className="font-semibold">{item.name}</div>
                          {item.size && (
                            <span className="text-[9.5px] font-sans font-bold bg-gray-200 px-1 rounded">
                              সাইজ: {item.size}
                            </span>
                          )}
                        </td>
                        <td className="py-1 text-center font-bold">x{item.qty}</td>
                        <td className="py-1 text-right tabular-nums">৳{item.price * item.qty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="py-2 border-b border-dashed border-black space-y-1 text-[10.5px]">
                <div className="flex justify-between">
                  <span>সাবটোটাল:</span>
                  <span className="tabular-nums">৳{order.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>ডেলিভারি চার্জ:</span>
                  <span className="tabular-nums">+৳{order.charge}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-red-600 font-medium">
                    <span>ডিসকাউন্ট:</span>
                    <span className="tabular-nums">-৳{order.discount}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold border-t border-gray-300 pt-1">
                  <span>মোট বিল:</span>
                  <span className="tabular-nums">৳{order.total}</span>
                </div>
                {order.advance > 0 && (
                  <div className="flex justify-between text-green-700">
                    <span>অগ্রিম পেমেন্ট:</span>
                    <span className="tabular-nums">-৳{order.advance}</span>
                  </div>
                )}
              </div>

              <div className="my-2.5 p-2 bg-gray-100 border-2 border-black rounded text-center">
                <div className="text-[10px] uppercase font-bold tracking-wider">
                  ক্যাশ অন ডেলিভারি (Due COD)
                </div>
                <div className="text-xl font-black tabular-nums tracking-tight">
                  ৳{order.due}
                </div>
              </div>

              <div className="pt-2 text-center text-[9px] text-gray-600">
                ধন্যবাদ, সাথে থাকার জন্য! 🌸
              </div>
            </div>
          )}

          {/* FORMAT 4: STANDARD A4 / A5 FULL INVOICE */}
          {format === 'a4invoice' && (
            <div
              id="printable-memo"
              className="printable-slip-container w-full max-w-[460px] bg-white text-black p-6 rounded-lg shadow-xl font-sans text-xs select-none border border-gray-300"
            >
              <div className="flex justify-between items-start pb-4 border-b-2 border-purple-900">
                <div>
                  <div className="text-xl font-black tracking-tight text-purple-900">
                    ALVINA COMMERCE
                  </div>
                  <div className="text-[11px] text-gray-600 font-medium">
                    Exclusive Boutique & Fashion House
                  </div>
                  <div className="text-[10px] text-gray-500 mt-1">
                    হটলাইন: {config.whatsapp} | {config.storeAddress || 'Dhaka, Bangladesh'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="px-3 py-1 bg-purple-900 text-white rounded font-bold text-xs uppercase">
                    Customer Invoice
                  </div>
                  <div className="font-mono font-bold text-sm mt-1">#{order.id}</div>
                  <div className="text-[10px] text-gray-500 font-mono">{formattedDate}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-3 border-b border-gray-200">
                <div>
                  <span className="text-gray-500 text-[10px] block font-bold uppercase">গ্রাহকের বিবরণ:</span>
                  <div className="font-bold text-sm text-black">{order.customer}</div>
                  <div className="font-mono text-xs font-semibold">{order.phone}</div>
                  <div className="text-gray-700 text-xs mt-0.5">{order.address}</div>
                </div>
                <div>
                  <span className="text-gray-500 text-[10px] block font-bold uppercase">ডেলিভারি তথ্য:</span>
                  <div>কুরিয়ার: <span className="font-bold">{courierName}</span></div>
                  <div>পেমেন্ট: {order.paymentMethod}</div>
                  <div>উৎস: {order.source}</div>
                </div>
              </div>

              <div className="py-3 border-b border-gray-200">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b-2 border-gray-300 font-bold text-gray-700">
                      <th className="pb-2">আইটেম বিবরণ</th>
                      <th className="pb-2 text-center">পরিমাণ</th>
                      <th className="pb-2 text-right">মূল্য</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {order.items.map((it, idx) => (
                      <tr key={idx}>
                        <td className="py-2">
                          <div className="font-bold text-gray-900">{it.name}</div>
                          {it.size && <div className="text-[10px] text-gray-500">সাইজ: {it.size}</div>}
                        </td>
                        <td className="py-2 text-center font-bold">x{it.qty}</td>
                        <td className="py-2 text-right font-mono font-semibold">৳{it.price * it.qty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="py-3 space-y-1 text-xs text-right">
                <div className="flex justify-between text-gray-600">
                  <span>সাবটোটাল:</span>
                  <span className="font-mono font-semibold">৳{order.subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>ডেলিভারি চার্জ:</span>
                  <span className="font-mono font-semibold">+৳{order.charge}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>ছাড় (Discount):</span>
                    <span className="font-mono font-semibold">-৳{order.discount}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-sm pt-2 border-t border-gray-300">
                  <span>সর্বমোট বিল:</span>
                  <span className="font-mono text-purple-900 font-black">৳{order.total}</span>
                </div>
                {order.advance > 0 && (
                  <div className="flex justify-between text-green-700">
                    <span>অগ্রিম পেমেন্ট:</span>
                    <span className="font-mono font-semibold">-৳{order.advance}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-base bg-yellow-100 p-2 rounded mt-2 border-2 border-black text-black">
                  <span>ক্যাশ অন ডেলিভারি (Due COD):</span>
                  <span className="font-mono text-black font-black">৳{order.due}</span>
                </div>
              </div>

              <div className="pt-4 text-center text-[10px] text-gray-500 border-t border-gray-200">
                পার্সেলটি রাইডারের সামনে খুলে চেক করুন। কোনো সমস্যায় হটলাইনে যোগাযোগ করুন। ধন্যবাদ!
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
