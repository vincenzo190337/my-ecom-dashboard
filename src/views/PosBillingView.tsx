import React, { useState, useRef } from 'react';
import {
  Product,
  PosTransaction,
  SystemConfig,
  STANDARD_SIZES,
  MAX_SIZES,
  ALL_SIZES,
  BD_MOBILE_BANKING,
  BD_BANKS,
  DISCOUNT_PERCENTAGES,
  ExchangeRecord,
} from '../types';
import {
  Receipt,
  Search,
  Plus,
  Minus,
  Trash2,
  Printer,
  CreditCard,
  Banknote,
  Smartphone,
  CheckCircle,
  Package,
  Barcode,
  Camera,
  Edit2,
  ArrowLeftRight,
  X,
  Sparkles,
  ShieldAlert,
  Building,
} from 'lucide-react';

interface PosBillingViewProps {
  products: Product[];
  posTransactions: PosTransaction[];
  config: SystemConfig;
  userRole?: string;
  onSaveTransaction: (tx: PosTransaction) => void;
  onUpdateTransaction?: (tx: PosTransaction) => void;
  onNavigateToExchange?: (orderId: string, customer: string, phone: string, dress: string) => void;
}

export const PosBillingView: React.FC<PosBillingViewProps> = ({
  products,
  posTransactions,
  config,
  userRole = 'Admin',
  onSaveTransaction,
  onUpdateTransaction,
  onNavigateToExchange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentType, setPaymentType] = useState<'Cash' | 'bKash / Nagad' | 'Card'>('Cash');
  const [selectedMfs, setSelectedMfs] = useState<string>('bKash');
  const [mfsTrxId, setMfsTrxId] = useState('');
  const [selectedBank, setSelectedBank] = useState<string>('City Bank');
  const [cardLast4, setCardLast4] = useState('');
  
  // Discount state (2% to 80% serial)
  const [selectedDiscountPercent, setSelectedDiscountPercent] = useState<number | 'custom'>(0);
  const [customDiscount, setCustomDiscount] = useState<number>(0);
  const [paidAmount, setPaidAmount] = useState<number | ''>('');
  const [cart, setCart] = useState<
    { product: Product; qty: number; size: string; fabric?: string; stitching?: string }[]
  >([]);
  const [lastReceipt, setLastReceipt] = useState<PosTransaction | null>(null);

  // Super Edit State
  const [editingTx, setEditingTx] = useState<PosTransaction | null>(null);

  const barcodeInputRef = useRef<HTMLInputElement>(null);

  const canSuperEdit = userRole === 'Admin' || userRole === 'Merchant';

  const filteredProducts = products.filter(
    (p) =>
      p.status !== 'Out of stock' &&
      (p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const addToCart = (product: Product, selectedSize: string = '38') => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.product.id === product.id && i.size === selectedSize);
      if (idx >= 0) {
        return prev.map((item, i) => (i === idx ? { ...item, qty: item.qty + 1 } : item));
      }
      return [
        ...prev,
        {
          product,
          qty: 1,
          size: selectedSize,
          fabric: product.fabric || 'Cotton',
          stitching: product.stitching || 'Stitched',
        },
      ];
    });
  };

  // Barcode / Dress Scan Handler
  const handleBarcodeScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;

    const matched = products.find(
      (p) =>
        p.sku.toLowerCase() === barcodeInput.trim().toLowerCase() ||
        String(p.id) === barcodeInput.trim() ||
        p.name.toLowerCase().includes(barcodeInput.trim().toLowerCase())
    );

    if (matched) {
      addToCart(matched, '38');
      setBarcodeInput('');
    } else {
      alert(`বারকোড "${barcodeInput}" দিয়ে কোনো ড্রেস পাওয়া যায়নি!`);
    }
  };

  const updateQty = (index: number, delta: number) => {
    setCart((prev) => {
      const item = prev[index];
      const newQty = item.qty + delta;
      if (newQty <= 0) return prev.filter((_, i) => i !== index);
      return prev.map((it, i) => (i === index ? { ...it, qty: newQty } : it));
    });
  };

  const updateSize = (index: number, size: string) => {
    setCart((prev) => prev.map((it, i) => (i === index ? { ...it, size } : it)));
  };

  const subtotal = cart.reduce((sum, item) => {
    const price = item.product.offer > 0 ? item.product.offer : item.product.price;
    return sum + price * item.qty;
  }, 0);

  // Discount calculation
  const calculatedDiscount =
    selectedDiscountPercent === 'custom'
      ? Math.max(0, customDiscount)
      : Math.round((subtotal * (Number(selectedDiscountPercent) || 0)) / 100);

  const total = Math.max(0, subtotal - calculatedDiscount);
  const numericPaid = paidAmount === '' ? total : Number(paidAmount);
  const changeAmount = Math.max(0, numericPaid - total);

  const handleCompleteSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert('কার্টে কোনো ড্রেস যোগ করা হয়নি!');
      return;
    }

    const tx: PosTransaction = {
      id: 'POS-' + Date.now().toString().slice(-6),
      date: new Date().toISOString(),
      cashier: config.user || 'Showroom Executive',
      customerName: customerName.trim() || 'Walking Customer',
      customerPhone: customerPhone.trim() || undefined,
      items: cart.map((c) => ({
        name: c.product.name,
        price: c.product.offer > 0 ? c.product.offer : c.product.price,
        qty: c.qty,
        size: c.size,
        fabric: c.fabric,
        stitching: c.stitching,
      })),
      subtotal,
      discount: calculatedDiscount,
      discountPercent: selectedDiscountPercent === 'custom' ? undefined : Number(selectedDiscountPercent),
      total,
      paidAmount: numericPaid,
      changeAmount,
      paymentType,
      mfsProvider: paymentType === 'bKash / Nagad' ? selectedMfs : undefined,
      transactionTrxId: mfsTrxId.trim() || undefined,
      bankName: paymentType === 'Card' ? selectedBank : undefined,
      cardLast4: cardLast4.trim() || undefined,
    };

    onSaveTransaction(tx);
    setLastReceipt(tx);
    // Reset cart
    setCart([]);
    setCustomerName('');
    setCustomerPhone('');
    setSelectedDiscountPercent(0);
    setCustomDiscount(0);
    setPaidAmount('');
    setMfsTrxId('');
    setCardLast4('');
  };

  // Super Edit Submit
  const handleSuperEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTx) return;

    if (onUpdateTransaction) {
      onUpdateTransaction(editingTx);
    }
    setEditingTx(null);
  };

  return (
    <div className="space-y-6">
      {/* POS Top Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Receipt className="w-5 h-5 text-[#bd70df]" />
            <span>শোরুম পিওএস ও কাউন্টার বিলিং (Showroom POS & Counter Billing)</span>
          </h2>
          <p className="text-xs text-[#a69ab1]">
            বারকোড স্ক্যানার, বিডি মোবাইল ব্যাংকিং ও কার্ড পেমেন্ট, ডিসকাউন্ট (২%-৮০%) এবং সুপার এডিট সুবিধা
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-lg bg-[#271b35] text-[#e6b4fa] border border-[#503067]">
            ক্যাশিয়ার: <b>{config.user}</b>
          </span>
          <span className="text-xs px-2.5 py-1 rounded-lg bg-[#14261f] text-[#6ee7b7] border border-[#2b6b50]">
            হেড অফিস: <b>মোহাম্মদপুর, আদাবর ১২০৭</b>
          </span>
        </div>
      </div>

      {/* POS Two Column Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Product Catalog & Barcode Scanner */}
        <div className="lg:col-span-7 bg-[#181520] border border-[#342b40] rounded-2xl p-5 shadow-sm space-y-4">
          {/* Quick Barcode Scanner Form */}
          <form
            onSubmit={handleBarcodeScan}
            className="p-3 rounded-xl bg-[#120e18] border border-[#40334f] flex flex-col sm:flex-row gap-2 items-center"
          >
            <div className="relative flex-1 w-full">
              <Barcode className="w-4 h-4 text-[#bd70df] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                ref={barcodeInputRef}
                type="text"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                placeholder="ড্রেস বারকোড বা SKU কোড স্ক্যান / এন্টার করুন (e.g. ALV-101)..."
                className="w-full pl-9 pr-3 py-2 bg-[#181520] border border-[#342b40] rounded-lg text-xs text-white outline-none focus:border-[#bd70df] font-mono"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="submit"
                className="px-3 py-2 rounded-lg bg-[#bd70df] text-[#160e1b] font-bold text-xs hover:bg-[#d091ee] whitespace-nowrap flex-1 sm:flex-none"
              >
                স্ক্যান / যোগ
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsScannerActive(!isScannerActive);
                  if (!isScannerActive && products.length > 0) {
                    // simulate camera scan detection
                    setTimeout(() => {
                      const randomProd = products[Math.floor(Math.random() * products.length)];
                      addToCart(randomProd, '38');
                      alert(`📷 ক্যামেরা স্ক্যান সম্পন্ন! "${randomProd.name}" বিল কার্টে যোগ হয়েছে।`);
                      setIsScannerActive(false);
                    }, 1200);
                  }
                }}
                className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-all ${
                  isScannerActive
                    ? 'bg-[#3b1223] text-[#ff809b] border-[#7a283e] animate-pulse'
                    : 'bg-[#271b35] text-[#e6b4fa] border-[#553670]'
                }`}
                title="ক্যামেরা বারকোড স্ক্যানার"
              >
                <Camera className="w-4 h-4" />
                <span className="hidden sm:inline">{isScannerActive ? 'স্ক্যান হচ্ছে...' : 'ক্যামেরা স্ক্যান'}</span>
              </button>
            </div>
          </form>

          {/* Catalog Search & Grid */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#a69ab1] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ক্যাটালগ থেকে ড্রেসের নাম দিয়ে খুঁজুন..."
              className="w-full pl-10 pr-4 py-2 bg-[#100d16] border border-[#342b40] rounded-xl text-xs sm:text-sm text-white focus:border-[#bd70df] outline-none"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[460px] overflow-y-auto pr-1">
            {filteredProducts.map((p) => {
              const activePrice = p.offer > 0 ? p.offer : p.price;
              return (
                <div
                  key={p.id}
                  className="bg-[#120e18] border border-[#2e2638] hover:border-[#bd70df] rounded-xl p-3 flex flex-col justify-between text-left transition-all group"
                >
                  <div className="aspect-[4/3] rounded-lg bg-[#1b1524] mb-2 overflow-hidden flex items-center justify-center">
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <Package className="w-6 h-6 text-[#4d3d5f]" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white line-clamp-1">{p.name}</h4>
                    <span className="text-[10px] text-[#a69ab1] font-mono">{p.sku}</span>
                    <div className="text-xs font-bold text-[#bd70df] font-mono mt-1">
                      ৳{activePrice.toLocaleString()}
                    </div>
                  </div>

                  {/* Numeric Size Pills */}
                  <div className="mt-2 pt-2 border-t border-[#261f30] flex flex-wrap gap-1">
                    {['36', '38', '40', '42', '44'].map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => addToCart(p, sz)}
                        className="px-1.5 py-0.5 rounded bg-[#20182b] hover:bg-[#bd70df] hover:text-[#160e1b] text-[10px] text-[#cfc4d9] font-mono font-bold transition-colors"
                        title={`সাইজ ${sz} কার্টে যোগ করুন`}
                      >
                        {sz}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => addToCart(p, 'Unstitched')}
                      className="px-1.5 py-0.5 rounded bg-[#1e293b] hover:bg-[#38bdf8] hover:text-[#0f172a] text-[9px] text-[#93c5fd] font-bold"
                    >
                      আনস্টিচ
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Cart & Checkout Form */}
        <div className="lg:col-span-5 bg-[#181520] border border-[#342b40] rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <form onSubmit={handleCompleteSale} className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#342b40]">
              <h3 className="font-bold text-white text-sm">কাউন্টার বিলিং কার্ট</h3>
              <span className="text-xs text-[#a69ab1]">মোট আইটেম: {cart.length}</span>
            </div>

            {/* Customer Information */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-[#a69ab1] mb-1">কাস্টমার নাম</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Walking Customer"
                  className="w-full px-3 py-1.5 bg-[#100d16] border border-[#342b40] rounded-lg text-white outline-none focus:border-[#bd70df]"
                />
              </div>
              <div>
                <label className="block text-[#a69ab1] mb-1">ফোন নম্বর</label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full px-3 py-1.5 bg-[#100d16] border border-[#342b40] rounded-lg text-white font-mono outline-none focus:border-[#bd70df]"
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1">
              {cart.length === 0 ? (
                <div className="py-8 text-center text-[#a69ab1] text-xs">
                  কার্টে কোনো ড্রেস নেই। বাম পাশের ক্যাটালগ থেকে সিলেক্ট করুন।
                </div>
              ) : (
                cart.map((item, idx) => {
                  const price = item.product.offer > 0 ? item.product.offer : item.product.price;
                  return (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-[#120e18] border border-[#2b2235] flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-white truncate">{item.product.name}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[#bd70df] font-mono">৳{price}</span>
                          {/* Size selector dropdown */}
                          <select
                            value={item.size}
                            onChange={(e) => updateSize(idx, e.target.value)}
                            className="bg-[#1b1524] border border-[#443555] rounded px-1.5 py-0.5 text-[11px] text-white outline-none"
                          >
                            {ALL_SIZES.map((sz) => (
                              <option key={sz} value={sz}>
                                সাইজ {sz}
                              </option>
                            ))}
                            <option value="Unstitched">আনস্টিচড (Unstitched)</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => updateQty(idx, -1)}
                          className="w-6 h-6 rounded bg-[#20182b] text-white flex items-center justify-center hover:bg-[#342646]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono font-bold text-white px-1">{item.qty}</span>
                        <button
                          type="button"
                          onClick={() => updateQty(idx, 1)}
                          className="w-6 h-6 rounded bg-[#20182b] text-white flex items-center justify-center hover:bg-[#342646]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => updateQty(idx, -item.qty)}
                          className="p-1 rounded text-[#ff6b83] hover:bg-[#351822]"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Discount Section (2% to 80% Serial) */}
            <div className="p-3 rounded-xl bg-[#120e18] border border-[#342b40] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#cfc4d9] flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#f59e0b]" />
                  <span>ডিসকাউন্ট ছাড় (২% থেকে ৮০% সিরিয়াল):</span>
                </span>
                <span className="text-xs font-mono font-bold text-[#bd70df]">
                  -৳{calculatedDiscount.toLocaleString()}
                </span>
              </div>
              <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto">
                <button
                  type="button"
                  onClick={() => setSelectedDiscountPercent(0)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    selectedDiscountPercent === 0
                      ? 'bg-[#bd70df] text-[#160e1b]'
                      : 'bg-[#1b1524] text-[#a69ab1] hover:text-white'
                  }`}
                >
                  0%
                </button>
                {DISCOUNT_PERCENTAGES.map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setSelectedDiscountPercent(pct)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      selectedDiscountPercent === pct
                        ? 'bg-[#bd70df] text-[#160e1b]'
                        : 'bg-[#1b1524] text-[#cfc4d9] hover:text-white'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setSelectedDiscountPercent('custom')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    selectedDiscountPercent === 'custom'
                      ? 'bg-[#bd70df] text-[#160e1b]'
                      : 'bg-[#1b1524] text-[#cfc4d9]'
                  }`}
                >
                  কাস্টম ৳
                </button>
              </div>

              {selectedDiscountPercent === 'custom' && (
                <div className="pt-1">
                  <input
                    type="number"
                    min={0}
                    value={customDiscount}
                    onChange={(e) => setCustomDiscount(Number(e.target.value))}
                    placeholder="কাস্টম ডিসকাউন্ট পরিমাণ (টাকা)"
                    className="w-full px-3 py-1 bg-[#1a1424] border border-[#4c3960] rounded-lg text-xs text-white font-mono outline-none"
                  />
                </div>
              )}
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-[#cfc4d9]">
                পেমেন্ট মেথড নির্বাচন করুন
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentType('Cash')}
                  className={`p-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border ${
                    paymentType === 'Cash'
                      ? 'bg-[#bd70df] text-[#160e1b] border-[#bd70df]'
                      : 'bg-[#100d16] text-[#bcb1c7] border-[#342b40] hover:text-white'
                  }`}
                >
                  <Banknote className="w-3.5 h-3.5" />
                  <span>ক্যাশ (Cash)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentType('bKash / Nagad')}
                  className={`p-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border ${
                    paymentType === 'bKash / Nagad'
                      ? 'bg-[#e11d48] text-white border-[#e11d48]'
                      : 'bg-[#100d16] text-[#bcb1c7] border-[#342b40] hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>বিকাশ/MFS</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentType('Card')}
                  className={`p-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border ${
                    paymentType === 'Card'
                      ? 'bg-[#2563eb] text-white border-[#2563eb]'
                      : 'bg-[#100d16] text-[#bcb1c7] border-[#342b40] hover:text-white'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>কার্ড (Card)</span>
                </button>
              </div>

              {/* bKash & BD Mobile Banking Sub-options */}
              {paymentType === 'bKash / Nagad' && (
                <div className="p-3 rounded-xl bg-[#1f1019] border border-[#6b253e] space-y-2 animate-in fade-in duration-200">
                  <span className="text-[11px] font-semibold text-[#fca5a5] block">
                    বাংলাদেশ মোবাইল ব্যাংকিং নির্বাচন করুন:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {BD_MOBILE_BANKING.map((mfs) => (
                      <button
                        key={mfs}
                        type="button"
                        onClick={() => setSelectedMfs(mfs)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          selectedMfs === mfs
                            ? 'bg-[#e11d48] text-white shadow-sm'
                            : 'bg-[#140b11] text-[#fca5a5] border border-[#521b30]'
                        }`}
                      >
                        {mfs}
                      </button>
                    ))}
                  </div>
                  <div>
                    <input
                      type="text"
                      value={mfsTrxId}
                      onChange={(e) => setMfsTrxId(e.target.value)}
                      placeholder={`${selectedMfs} TrxID বা ট্রানজেকশন রেফারেন্স...`}
                      className="w-full px-3 py-1.5 bg-[#140b11] border border-[#521b30] rounded-lg text-xs text-white font-mono outline-none"
                    />
                  </div>
                </div>
              )}

              {/* BD Bank Card Sub-options */}
              {paymentType === 'Card' && (
                <div className="p-3 rounded-xl bg-[#0f172a] border border-[#1e3a8a] space-y-2 animate-in fade-in duration-200">
                  <span className="text-[11px] font-semibold text-[#93c5fd] flex items-center gap-1">
                    <Building className="w-3 h-3" />
                    <span>বাংলাদেশ ব্যাংক কার্ড নির্বাচন করুন:</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {BD_BANKS.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setSelectedBank(b)}
                        className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-all ${
                          selectedBank === b
                            ? 'bg-[#2563eb] text-white'
                            : 'bg-[#0a0f1d] text-[#93c5fd] border border-[#1e293b]'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      maxLength={4}
                      value={cardLast4}
                      onChange={(e) => setCardLast4(e.target.value)}
                      placeholder="কার্ড শেষ ৪ ডিজিট (Last 4)"
                      className="w-full px-3 py-1.5 bg-[#0a0f1d] border border-[#1e293b] rounded-lg text-xs text-white font-mono outline-none"
                    />
                    <input
                      type="text"
                      placeholder="POS স্লিপ Approval নং"
                      className="w-full px-3 py-1.5 bg-[#0a0f1d] border border-[#1e293b] rounded-lg text-xs text-white font-mono outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Calculations Summary */}
            <div className="p-3.5 rounded-xl bg-[#100d16] border border-[#342b40] space-y-2 text-xs">
              <div className="flex justify-between text-[#a69ab1]">
                <span>সাবটোটাল</span>
                <span className="font-mono text-white">৳{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#a69ab1]">
                <span>ডিসকাউন্ট ছাড়</span>
                <span className="font-mono text-[#e11d48]">-৳{calculatedDiscount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-[#342b40]">
                <span>সর্বমোট প্রদেয় (Total)</span>
                <span className="font-mono text-[#bd70df]">৳{total.toLocaleString()}</span>
              </div>

              <div className="pt-2 grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-[#a69ab1] mb-1">গ্রহীত অর্থ (Paid)</label>
                  <input
                    type="number"
                    min={0}
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder={`৳${total}`}
                    className="w-full px-3 py-1.5 bg-[#181520] border border-[#342b40] rounded-lg font-mono font-bold text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#a69ab1] mb-1">ফেরতযোগ্য (Change)</label>
                  <div className="px-3 py-1.5 bg-[#181520] border border-[#342b40] rounded-lg font-mono font-bold text-[#10b981]">
                    ৳{changeAmount.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <button
              type="submit"
              disabled={cart.length === 0}
              className="w-full py-3 rounded-xl bg-[#bd70df] hover:bg-[#d091ee] disabled:opacity-50 text-[#160e1b] font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4 font-bold" />
              <span>বিল সম্পন্ন করুন (৳{total.toLocaleString()})</span>
            </button>
          </form>
        </div>
      </div>

      {/* Completed POS Transactions & Super Edit List */}
      <div className="rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#342b40] flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-sm">সর্বশেষ শোরুম বিক্রয় ও ক্যাশ মেমো (Recent Counter Bills)</h3>
            <p className="text-xs text-[#a69ab1]">
              ভুল হলে সুপার এডিট করুন অথবা কাস্টমার এক্সচেঞ্জ রিকোয়েস্ট তৈরি করুন
            </p>
          </div>
          <span className="text-xs text-[#bd70df] font-mono">মোট {posTransactions.length} টি বিল</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#14101c] border-b border-[#342b40] text-[#a69ab1]">
                <th className="py-2.5 px-3">বিল নম্বর</th>
                <th className="py-2.5 px-3">তারিখ ও সময়</th>
                <th className="py-2.5 px-3">কাস্টমার ও ফোন</th>
                <th className="py-2.5 px-3">আইটেম ও সাইজ</th>
                <th className="py-2.5 px-3">পেমেন্ট মেথড</th>
                <th className="py-2.5 px-3">মোট বিল</th>
                <th className="py-2.5 px-3 text-right">অ্যাকশন ও এক্সচেঞ্জ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#282033]">
              {posTransactions.slice(0, 10).map((tx) => (
                <tr key={tx.id} className="hover:bg-[#201927] transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-[#bd70df]">{tx.id}</td>
                  <td className="py-3 px-3 font-mono text-[#a69ab1]">{tx.date.slice(0, 16).replace('T', ' ')}</td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-white">{tx.customerName || 'Walking'}</div>
                    {tx.customerPhone && <div className="text-[11px] text-[#a69ab1] font-mono">{tx.customerPhone}</div>}
                  </td>
                  <td className="py-3 px-3 max-w-xs">
                    {tx.items.map((it, i) => (
                      <span key={i} className="inline-block mr-2 text-[#e2d5eb]">
                        {it.name} ({it.size || '38'}) ×{it.qty}
                      </span>
                    ))}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-[#271b35] text-[#e6b4fa] font-medium">
                      {tx.paymentType} {tx.mfsProvider ? `(${tx.mfsProvider})` : ''} {tx.bankName ? `(${tx.bankName})` : ''}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-white">
                    ৳{tx.total.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Super Edit Button (Merchant & Admin only) */}
                      {canSuperEdit && (
                        <button
                          onClick={() => setEditingTx({ ...tx })}
                          className="px-2 py-1 rounded bg-[#271b35] text-[#e6b4fa] hover:bg-[#bd70df] hover:text-[#160e1b] font-semibold text-[11px] flex items-center gap-1 transition-all"
                          title="সুপার এডিট (Super Edit Bill)"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>সুপার এডিট</span>
                        </button>
                      )}

                      {/* Exchange Button */}
                      <button
                        onClick={() => {
                          if (onNavigateToExchange) {
                            onNavigateToExchange(
                              tx.id,
                              tx.customerName || 'Walking Customer',
                              tx.customerPhone || '01XXXXXXXXX',
                              tx.items[0]?.name || 'Dress'
                            );
                          } else {
                            alert(`এক্সচেঞ্জ রিকোয়েস্ট তৈরি হয়েছে বিল ${tx.id} এর জন্য!`);
                          }
                        }}
                        className="px-2 py-1 rounded bg-[#1f2937] text-[#93c5fd] hover:bg-[#2563eb] hover:text-white font-semibold text-[11px] flex items-center gap-1 transition-all"
                        title="সাইজ বা ড্রেস এক্সচেঞ্জ করুন"
                      >
                        <ArrowLeftRight className="w-3 h-3" />
                        <span>এক্সচেঞ্জ</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Super Edit Modal */}
      {editingTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-[#16121f] border border-[#714786] rounded-2xl p-5 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#342b40]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-[#bd70df]" />
                <span>সুপার এডিট: পিওএস বিল ({editingTx.id})</span>
              </h3>
              <button onClick={() => setEditingTx(null)} className="text-[#a69ab1] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSuperEditSave} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#cfc4d9] mb-1">কাস্টমার নাম</label>
                  <input
                    value={editingTx.customerName || ''}
                    onChange={(e) => setEditingTx({ ...editingTx, customerName: e.target.value })}
                    className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#cfc4d9] mb-1">ফোন নম্বর</label>
                  <input
                    value={editingTx.customerPhone || ''}
                    onChange={(e) => setEditingTx({ ...editingTx, customerPhone: e.target.value })}
                    className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white font-mono outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#cfc4d9] mb-1">সাবটোটাল (৳)</label>
                  <input
                    type="number"
                    value={editingTx.subtotal}
                    onChange={(e) => {
                      const st = Number(e.target.value);
                      const tot = Math.max(0, st - (editingTx.discount || 0));
                      setEditingTx({ ...editingTx, subtotal: st, total: tot });
                    }}
                    className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#cfc4d9] mb-1">ডিসকাউন্ট (৳)</label>
                  <input
                    type="number"
                    value={editingTx.discount}
                    onChange={(e) => {
                      const disc = Number(e.target.value);
                      const tot = Math.max(0, (editingTx.subtotal || 0) - disc);
                      setEditingTx({ ...editingTx, discount: disc, total: tot });
                    }}
                    className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#cfc4d9] mb-1">চূড়ান্ত বিল (৳)</label>
                  <input
                    type="number"
                    value={editingTx.total}
                    onChange={(e) => setEditingTx({ ...editingTx, total: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white font-mono outline-none font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#cfc4d9] mb-1">পেমেন্ট মেথড</label>
                <select
                  value={editingTx.paymentType}
                  onChange={(e) => setEditingTx({ ...editingTx, paymentType: e.target.value as any })}
                  className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white outline-none"
                >
                  <option value="Cash">Cash (ক্যাশ)</option>
                  <option value="bKash / Nagad">bKash / Nagad (বিকাশ/নগদ)</option>
                  <option value="Card">Bank Card (কার্ড)</option>
                </select>
              </div>

              <div>
                <label className="block text-[#cfc4d9] mb-1">নোট বা কারণ</label>
                <textarea
                  rows={2}
                  value={editingTx.notes || ''}
                  onChange={(e) => setEditingTx({ ...editingTx, notes: e.target.value })}
                  placeholder="সুপার এডিটের কারণ লিখুন..."
                  className="w-full p-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingTx(null)}
                  className="px-4 py-2 rounded-xl text-[#a69ab1] hover:text-white"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#bd70df] text-[#160e1b] font-bold hover:bg-[#d091ee]"
                >
                  পরিবর্তন সেভ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
