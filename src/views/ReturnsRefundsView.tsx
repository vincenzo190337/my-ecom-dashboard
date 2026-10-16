import React, { useState } from 'react';
import { ReturnRefund, Product } from '../types';
import { RotateCcw, Plus, Check, X, Trash2, Search, Package, ChevronDown, Sparkles, Edit3, ArrowRight, ArrowLeftRight } from 'lucide-react';

interface ReturnsRefundsViewProps {
  returns: ReturnRefund[];
  products?: Product[];
  userRole?: string;
  onSaveReturn: (record: ReturnRefund) => void;
  onUpdateStatus: (id: number, status: ReturnRefund['status']) => void;
  onDeleteReturn: (id: number) => void;
  onNavigateToExchange?: () => void;
}

export const ReturnsRefundsView: React.FC<ReturnsRefundsViewProps> = ({
  returns,
  products = [],
  userRole = 'Admin',
  onSaveReturn,
  onUpdateStatus,
  onDeleteReturn,
  onNavigateToExchange,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [customer, setCustomer] = useState('');
  const [phone, setPhone] = useState('');
  const [productName, setProductName] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductPickerOpen, setIsProductPickerOpen] = useState(false);
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [refundAmount, setRefundAmount] = useState<number>(1500);
  const [refundMethod, setRefundMethod] = useState<ReturnRefund['refundMethod']>('bKash');
  const [reason, setReason] = useState('');

  // Super Edit active return target
  const [editingReturn, setEditingReturn] = useState<ReturnRefund | null>(null);
  const [isSuperEditPickerOpen, setIsSuperEditPickerOpen] = useState(false);
  const [superEditSearchTerm, setSuperEditSearchTerm] = useState('');

  const canSuperEdit = userRole === 'Admin' || userRole === 'Merchant';

  const categories = ['All', 'Three Piece', 'Kurti', 'Saree', 'Co-ord Set', 'Anarkali', 'Maxi & Dress'];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearchTerm.toLowerCase());
    const matchesCat = selectedCategoryFilter === 'All' || p.category === selectedCategoryFilter;
    return matchesSearch && matchesCat;
  });

  const superEditFilteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(superEditSearchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(superEditSearchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(superEditSearchTerm.toLowerCase())
  );

  const handleSelectProduct = (p: Product) => {
    setSelectedProduct(p);
    setProductName(p.name);
    setRefundAmount(p.offer > 0 ? p.offer : p.price);
    setIsProductPickerOpen(false);
  };

  const handleSelectProductForEdit = (p: Product) => {
    if (editingReturn) {
      setEditingReturn({
        ...editingReturn,
        productName: p.name,
        refundAmount: p.offer > 0 ? p.offer : p.price,
      });
      setIsSuperEditPickerOpen(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim() || !customer.trim() || !phone.trim() || !productName.trim()) {
      alert('Order ID, কাস্টমার তথ্য এবং রিটার্নকৃত প্রোডাক্ট নাম দিন।');
      return;
    }

    const item: ReturnRefund = {
      id: Date.now(),
      orderId: orderId.trim(),
      customer: customer.trim(),
      phone: phone.trim(),
      productName: productName.trim(),
      refundAmount: Math.max(0, refundAmount),
      refundMethod,
      reason: reason.trim() || 'Defect / Size issue',
      status: 'Pending',
    };

    onSaveReturn(item);
    setIsFormOpen(false);
    setOrderId('');
    setCustomer('');
    setPhone('');
    setProductName('');
    setSelectedProduct(null);
    setReason('');
  };

  return (
    <div className="space-y-5">
      <div className="p-4 sm:p-5 rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-[#bd70df]" />
              <span>রিটার্ন ও রিফান্ড ম্যানেজমেন্ট (Returns & Refunds)</span>
            </h2>
            {/* Unified Hub Switcher */}
            {onNavigateToExchange && (
              <div className="inline-flex items-center gap-1 p-0.5 rounded-xl bg-[#100d17] border border-[#342b40] text-xs ml-0 sm:ml-2">
                <span className="px-2.5 py-1 rounded-lg font-bold bg-[#bd70df] text-[#120a17]">
                  রিটার্ন ও রিফান্ড
                </span>
                <button
                  type="button"
                  onClick={onNavigateToExchange}
                  className="px-2.5 py-1 rounded-lg font-semibold text-[#a69ab1] hover:text-white hover:bg-[#20182a] transition-all flex items-center gap-1"
                >
                  <ArrowLeftRight className="w-3 h-3 text-amber-400" />
                  <span>ড্রেস এক্সচেঞ্জ</span>
                </button>
              </div>
            )}
          </div>
          <p className="text-xs text-[#a69ab1]">
            ক্যাটালগের সকল প্রোডাক্ট লিস্ট থেকে ক্লিক করে সহজে ড্রেস সিলেক্ট করুন এবং সরাসরি রিটার্ন বা রিফান্ড প্রদান করুন
          </p>
        </div>
        <button
          onClick={() => {
            setIsFormOpen(!isFormOpen);
            setIsProductPickerOpen(false);
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#bd70df] text-[#160e1b] hover:bg-[#d091ee] transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন রিটার্ন এন্ট্রি (+ প্রোডাক্ট সিলেক্ট)</span>
        </button>
      </div>

      {isFormOpen && (
        <div className="p-5 rounded-2xl bg-[#1b1524] border border-[#714786] shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#342b40]">
            <div>
              <h3 className="font-bold text-white text-sm">নতুন রিটার্ন বা রিফান্ড রিকোয়েস্ট তৈরি</h3>
              <p className="text-[11px] text-[#cfc4d9]">প্রোডাক্ট নামের ঘরে ক্লিক করলে স্টোরের সব প্রোডাক্ট প্রদর্শন করবে, সেখান থেকে সিলেক্ট করুন</p>
            </div>
            <button onClick={() => setIsFormOpen(false)} className="text-[#a69ab1] hover:text-white cursor-pointer p-1">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-[#cfc4d9] mb-1 font-semibold">Order ID *</label>
              <input
                required
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="যেমন: 98410"
                className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-[#cfc4d9] mb-1 font-semibold">কাস্টমার নাম *</label>
              <input
                required
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                placeholder="যেমন: তানিয়া সুলতানা"
                className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-[#cfc4d9] mb-1 font-semibold">মোবাইল নম্বর *</label>
              <input
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white outline-none font-mono"
              />
            </div>

            {/* PRODUCT NAME WITH CLICK-TO-SELECT ALL PRODUCTS MODAL/POPUP */}
            <div className="sm:col-span-3">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[#cfc4d9] font-semibold flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-[#bd70df]" />
                  <span>প্রোডাক্ট এর নাম * (এখানে ক্লিক করলে সব প্রোডাক্ট শো করবে)</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsProductPickerOpen(true)}
                  className="px-2.5 py-1 rounded-lg bg-[#2f1b3d] text-[#e6b4fa] hover:bg-[#bd70df] hover:text-[#160e1b] font-bold text-[11px] transition-colors flex items-center gap-1"
                >
                  <Search className="w-3 h-3" />
                  <span>ক্যাটালগ থেকে প্রোডাক্ট বাছুন ({products.length} টি প্রোডাক্ট)</span>
                </button>
              </div>

              <div
                onClick={() => setIsProductPickerOpen(true)}
                className="w-full p-3 bg-[#100d16] border-2 border-dashed border-[#57396b] hover:border-[#bd70df] rounded-xl text-white cursor-pointer flex items-center justify-between transition-all group"
              >
                {selectedProduct ? (
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedProduct.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=100&q=80'}
                      alt={selectedProduct.name}
                      className="w-10 h-10 rounded-lg object-cover border border-[#4a3458]"
                    />
                    <div>
                      <div className="font-bold text-white text-xs">{selectedProduct.name}</div>
                      <div className="text-[11px] text-[#a69ab1] font-mono">
                        SKU: {selectedProduct.sku} • {selectedProduct.category} • স্টক: {selectedProduct.stock} পিস
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-[#bcaec9]">
                    <Package className="w-5 h-5 text-[#bd70df]" />
                    <span className="font-medium text-xs">
                      {productName ? productName : '👉 এখানে ক্লিক করুন — সব প্রোডাক্ট লিস্ট শো করবে এবং আপনি সিলেক্ট করতে পারবেন'}
                    </span>
                  </div>
                )}
                <span className="px-2.5 py-1 rounded-lg bg-[#271835] text-[#dcaef5] text-[11px] font-bold group-hover:bg-[#bd70df] group-hover:text-[#160e1b] transition-colors">
                  {selectedProduct ? 'পরিবর্তন করুন' : 'প্রোডাক্ট সিলেক্ট করুন'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-[#cfc4d9] mb-1 font-semibold">রিফান্ড পরিমাণ (৳) *</label>
              <input
                type="number"
                min={0}
                required
                value={refundAmount}
                onChange={(e) => setRefundAmount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white outline-none font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-[#cfc4d9] mb-1 font-semibold">রিফান্ড মাধ্যম</label>
              <select
                value={refundMethod}
                onChange={(e) => setRefundMethod(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white outline-none"
              >
                <option value="bKash">bKash (বিকাশ)</option>
                <option value="Nagad">Nagad (নগদ)</option>
                <option value="Bank">Bank Transfer (ব্যাংক একাউন্ট)</option>
                <option value="Store Credit">Store Credit / ভাউচার ক্রেডিট</option>
              </select>
            </div>

            <div>
              <label className="block text-[#cfc4d9] mb-1 font-semibold">রিটার্ন কারণ ও ত্রুটি নোট</label>
              <input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="যেমন: ফ্যাব্রিক ত্রুটি / সাইজ ইস্যু / রিটার্ন"
                className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white outline-none"
              />
            </div>

            <div className="col-span-full pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 rounded-xl text-xs text-[#a69ab1] hover:text-white"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#bd70df] text-[#160e1b] hover:bg-[#d091ee] transition-all shadow-md cursor-pointer"
              >
                রিটার্ন ও রিফান্ড রিকোয়েস্ট তৈরি করুন
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ALL PRODUCTS SELECTION MODAL (POPUP) */}
      {isProductPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-3xl bg-[#161220] border border-[#714786] rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b border-[#342b40] flex items-center justify-between bg-[#1a1425]">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#bd70df]" />
                  <span>সকল প্রোডাক্ট ক্যাটালগ (যেকোনো প্রোডাক্টে ক্লিক করে রিটার্ন সিলেক্ট করুন)</span>
                </h3>
                <p className="text-xs text-[#a69ab1]">মোট {products.length} টি প্রোডাক্ট রয়েছে — সার্চ করে বা সরাসরি ক্লিক করুন</p>
              </div>
              <button
                onClick={() => setIsProductPickerOpen(false)}
                className="p-1.5 rounded-lg text-[#a69ab1] hover:text-white hover:bg-[#281b37]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter and Search Bar */}
            <div className="p-3 bg-[#120e18] border-b border-[#342b40] flex flex-col sm:flex-row items-center gap-2">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-[#bd70df] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  autoFocus
                  value={productSearchTerm}
                  onChange={(e) => setProductSearchTerm(e.target.value)}
                  placeholder="প্রোডাক্টের নাম, SKU বা ক্যাটাগরি দিয়ে সার্চ করুন..."
                  className="w-full pl-9 pr-3 py-2 bg-[#1b1525] border border-[#40344c] rounded-xl text-xs text-white placeholder:text-[#7d6f8a] outline-none focus:border-[#bd70df]"
                />
              </div>
              <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto py-1">
                {categories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedCategoryFilter(c)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                      selectedCategoryFilter === c
                        ? 'bg-[#bd70df] text-[#160e1b]'
                        : 'bg-[#1e1729] text-[#cfc4d9] hover:text-white'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Products List Grid */}
            <div className="p-3 overflow-y-auto space-y-2 flex-1">
              {filteredProducts.length === 0 ? (
                <div className="p-12 text-center text-[#a69ab1] text-xs">
                  কোনো প্রোডাক্ট পাওয়া যায়নি। অন্য নাম বা SKU দিয়ে খুঁজুন।
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {filteredProducts.map((p) => {
                    const price = p.offer > 0 ? p.offer : p.price;
                    return (
                      <div
                        key={p.id}
                        onClick={() => handleSelectProduct(p)}
                        className="p-2.5 rounded-xl bg-[#1b1525] hover:bg-[#2c1d3c] border border-[#342b40] hover:border-[#bd70df] flex items-center justify-between gap-3 cursor-pointer transition-all group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={p.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=100&q=80'}
                            alt={p.name}
                            className="w-12 h-12 rounded-lg object-cover shrink-0 border border-[#453655] group-hover:scale-105 transition-transform"
                          />
                          <div className="min-w-0">
                            <div className="font-bold text-white truncate text-xs group-hover:text-[#e6b4fa]">
                              {p.name}
                            </div>
                            <div className="text-[10px] text-[#a69ab1] font-mono flex items-center gap-1.5 flex-wrap">
                              <span className="text-[#e0cfed] font-bold">{p.sku}</span>
                              <span>•</span>
                              <span className="text-[#bd70df]">{p.category}</span>
                              <span>•</span>
                              <span>স্টক: {p.stock}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="font-mono font-bold text-[#36c98b] text-xs">৳{price}</div>
                          <span className="inline-block mt-1 px-2 py-0.5 rounded bg-[#bd70df] text-[#160e1b] text-[10px] font-bold group-hover:bg-[#d091ee]">
                            সিলেক্ট
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-3 border-t border-[#342b40] bg-[#14101c] flex justify-between items-center text-xs text-[#a69ab1]">
              <span>প্রোডাক্টে ক্লিক করলে স্বয়ংক্রিয়ভাবে রিটার্ন ফর্মে যুক্ত হবে</span>
              <button
                onClick={() => setIsProductPickerOpen(false)}
                className="px-3.5 py-1.5 rounded-lg bg-[#241a30] text-white hover:bg-[#342546]"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Returns Table */}
      <div className="rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#342b40] flex items-center justify-between">
          <div>
            <span className="font-bold text-white text-sm">সকল কাস্টমার রিটার্ন ও রিফান্ড রেকর্ড</span>
            <p className="text-[11px] text-[#a69ab1]">প্রোডাক্ট নামের উপর ক্লিক করে সরাসরি প্রোডাক্ট পরিবর্তন বা সুপার এডিট করা যাবে</p>
          </div>
          <span className="text-xs text-[#a69ab1]">মোট {returns.length} টি রেকর্ড</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#14101c] border-b border-[#342b40] text-[#a69ab1]">
                <th className="py-2.5 px-3">Order ID</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Product Name (ক্লিক করে পরিবর্তন)</th>
                <th className="py-2.5 px-3">Refund Amount</th>
                <th className="py-2.5 px-3">Method</th>
                <th className="py-2.5 px-3">Reason</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#282033]">
              {returns.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#a69ab1]">
                    কোনো রিটার্ন বা রিফান্ড রেকর্ড নেই।
                  </td>
                </tr>
              ) : (
                returns.map((r, idx) => (
                  <tr key={`return-${r.id}-${idx}`} className="hover:bg-[#201927]">
                    <td className="py-3 px-3 font-mono font-bold text-white">#{r.orderId}</td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-white">{r.customer}</div>
                      <div className="text-[11px] font-mono text-[#a69ab1]">{r.phone}</div>
                    </td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => {
                          setEditingReturn({ ...r });
                          setIsSuperEditPickerOpen(false);
                        }}
                        className="text-left font-semibold text-[#e6b4fa] hover:text-[#bd70df] hover:underline flex items-center gap-1.5 cursor-pointer group"
                        title="ক্লিক করে এই প্রোডাক্ট পরিবর্তন করুন"
                      >
                        <Package className="w-3.5 h-3.5 text-[#bd70df] shrink-0" />
                        <span className="group-hover:translate-x-0.5 transition-transform">{r.productName}</span>
                        <Edit3 className="w-3 h-3 text-[#a69ab1] opacity-60 group-hover:opacity-100" />
                      </button>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-[#ff9aaa] tabular-nums">
                      ৳{r.refundAmount}
                    </td>
                    <td className="py-3 px-3 text-[#bd70df] font-medium">{r.refundMethod}</td>
                    <td className="py-3 px-3 text-[#a69ab1] max-w-xs truncate">{r.reason}</td>
                    <td className="py-3 px-3">
                      <select
                        value={r.status}
                        onChange={(e) => onUpdateStatus(r.id, e.target.value as any)}
                        className={`px-2 py-0.5 rounded-full text-[11px] font-medium border outline-none cursor-pointer ${
                          r.status === 'Refunded'
                            ? 'bg-[#16382d] text-[#8de8bf] border-[#29604a]'
                            : r.status === 'Approved'
                            ? 'bg-[#1e2f42] text-[#93c5fd] border-[#315783]'
                            : r.status === 'Rejected'
                            ? 'bg-[#44202a] text-[#ff9aaa] border-[#6b2a3a]'
                            : 'bg-[#35203f] text-[#f7dcff] border-[#5d3870]'
                        }`}
                      >
                        <option value="Pending">Pending (অপেক্ষমাণ)</option>
                        <option value="Approved">Approved (অনুমোদিত)</option>
                        <option value="Refunded">Refunded (টাকা ফেরত সম্পন্ন)</option>
                        <option value="Rejected">Rejected (বাতিল)</option>
                      </select>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {canSuperEdit && (
                          <button
                            onClick={() => {
                              setEditingReturn({ ...r });
                              setIsSuperEditPickerOpen(false);
                            }}
                            className="px-2 py-1 rounded-lg text-[10px] font-bold bg-[#271b35] text-[#e6b4fa] hover:bg-[#bd70df] hover:text-[#160e1b] cursor-pointer"
                            title="সুপার এডিট"
                          >
                            সুপার এডিট
                          </button>
                        )}
                        <button
                          onClick={() => onDeleteReturn(r.id)}
                          className="p-1.5 rounded-lg text-[#ff6b83] hover:bg-[#351822] cursor-pointer"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SUPER EDIT RETURN & PRODUCT SWITCH MODAL */}
      {editingReturn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl bg-[#161220] border border-[#714786] rounded-2xl shadow-2xl p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#342b40]">
              <div>
                <h3 className="font-bold text-white text-sm">সুপার এডিট: রিটার্ন রেকর্ড (#{editingReturn.orderId})</h3>
                <p className="text-[11px] text-[#a69ab1]">প্রোডাক্ট পরিবর্তন করুন অথবা রিফান্ডের পরিমাণ ও স্ট্যাটাস আপডেট করুন</p>
              </div>
              <button onClick={() => setEditingReturn(null)} className="text-[#a69ab1] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Product selector trigger inside Super Edit */}
              <div>
                <label className="block text-[#cfc4d9] mb-1 font-semibold flex items-center justify-between">
                  <span>রিটার্নকৃত প্রোডাক্ট</span>
                  <button
                    type="button"
                    onClick={() => setIsSuperEditPickerOpen(!isSuperEditPickerOpen)}
                    className="text-[#bd70df] font-bold hover:underline"
                  >
                    {isSuperEditPickerOpen ? 'লিস্ট বন্ধ করুন' : 'সকল প্রোডাক্ট থেকে পছন্দ করুন'}
                  </button>
                </label>
                <div
                  onClick={() => setIsSuperEditPickerOpen(true)}
                  className="p-2.5 rounded-xl bg-[#100d16] border border-[#40344c] hover:border-[#bd70df] flex items-center justify-between cursor-pointer"
                >
                  <span className="font-bold text-white text-xs">{editingReturn.productName}</span>
                  <span className="text-[10px] text-[#bd70df] font-bold">ক্লিক করে পরিবর্তন করুন</span>
                </div>

                {isSuperEditPickerOpen && (
                  <div className="mt-2 p-3 bg-[#110d18] border border-[#5d3870] rounded-xl max-h-56 overflow-y-auto space-y-2">
                    <input
                      type="text"
                      value={superEditSearchTerm}
                      onChange={(e) => setSuperEditSearchTerm(e.target.value)}
                      placeholder="খুঁজুন..."
                      className="w-full px-2.5 py-1.5 bg-[#1b1525] border border-[#342b40] rounded-lg text-white text-xs outline-none"
                    />
                    <div className="space-y-1">
                      {superEditFilteredProducts.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => handleSelectProductForEdit(p)}
                          className="p-1.5 rounded-lg hover:bg-[#281b37] flex items-center justify-between text-xs cursor-pointer text-white"
                        >
                          <span className="truncate">{p.name} ({p.sku})</span>
                          <span className="text-[#36c98b] font-mono font-bold">৳{p.offer > 0 ? p.offer : p.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#cfc4d9] mb-1 font-semibold">কাস্টমার নাম</label>
                  <input
                    value={editingReturn.customer}
                    onChange={(e) => setEditingReturn({ ...editingReturn, customer: e.target.value })}
                    className="w-full px-3 py-2 bg-[#100d16] border border-[#342b40] rounded-xl text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#cfc4d9] mb-1 font-semibold">মোবাইল নম্বর</label>
                  <input
                    value={editingReturn.phone}
                    onChange={(e) => setEditingReturn({ ...editingReturn, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-[#100d16] border border-[#342b40] rounded-xl text-white outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#cfc4d9] mb-1 font-semibold">রিফান্ড অ্যামাউন্ট (৳)</label>
                  <input
                    type="number"
                    min={0}
                    value={editingReturn.refundAmount}
                    onChange={(e) => setEditingReturn({ ...editingReturn, refundAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#100d16] border border-[#342b40] rounded-xl text-white outline-none font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[#cfc4d9] mb-1 font-semibold">রিফান্ড মাধ্যম</label>
                  <select
                    value={editingReturn.refundMethod}
                    onChange={(e) => setEditingReturn({ ...editingReturn, refundMethod: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#100d16] border border-[#342b40] rounded-xl text-white outline-none"
                  >
                    <option value="bKash">bKash (বিকাশ)</option>
                    <option value="Nagad">Nagad (নগদ)</option>
                    <option value="Bank">Bank Transfer (ব্যাংক একাউন্ট)</option>
                    <option value="Store Credit">Store Credit / ভাউচার</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#cfc4d9] mb-1 font-semibold">স্ট্যাটাস</label>
                  <select
                    value={editingReturn.status}
                    onChange={(e) => setEditingReturn({ ...editingReturn, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#100d16] border border-[#342b40] rounded-xl text-white outline-none"
                  >
                    <option value="Pending">Pending (অপেক্ষমাণ)</option>
                    <option value="Approved">Approved (অনুমোদিত)</option>
                    <option value="Refunded">Refunded (টাকা ফেরত সম্পন্ন)</option>
                    <option value="Rejected">Rejected (বাতিল)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#cfc4d9] mb-1 font-semibold">রিটার্নের কারণ</label>
                  <input
                    value={editingReturn.reason}
                    onChange={(e) => setEditingReturn({ ...editingReturn, reason: e.target.value })}
                    className="w-full px-3 py-2 bg-[#100d16] border border-[#342b40] rounded-xl text-white outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-[#342b40]">
                <button
                  type="button"
                  onClick={() => setEditingReturn(null)}
                  className="px-4 py-2 rounded-xl text-[#a69ab1] hover:text-white"
                >
                  বাতিল
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSaveReturn(editingReturn);
                    setEditingReturn(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-[#bd70df] text-[#160e1b] font-bold hover:bg-[#d091ee] cursor-pointer"
                >
                  আপডেট সংরক্ষণ করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
