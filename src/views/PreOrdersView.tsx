import React, { useState } from 'react';
import { PreOrder, Order, ALL_SIZES, STANDARD_SIZES, MAX_SIZES } from '../types';
import {
  Clock,
  Plus,
  Edit2,
  Trash2,
  X,
  CheckCircle,
  Package,
  Store,
  Globe,
  ArrowRight,
  Search,
  Sparkles,
  Phone,
  Calendar,
} from 'lucide-react';

interface PreOrdersViewProps {
  preorders: PreOrder[];
  userRole?: string;
  onSavePreorder: (po: PreOrder) => void;
  onDeletePreorder: (id: number) => void;
  onConvertToRegularOrder?: (po: PreOrder) => void;
}

export const PreOrdersView: React.FC<PreOrdersViewProps> = ({
  preorders,
  userRole = 'Admin',
  onSavePreorder,
  onDeletePreorder,
  onConvertToRegularOrder,
}) => {
  const [filterChannel, setFilterChannel] = useState<
    'All' | 'Showroom Preorder' | 'Website Preorder' | 'Page Preorder' | 'Online Preorder'
  >('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPreorder, setEditingPreorder] = useState<PreOrder | null>(null);

  // Form State
  const [type, setType] = useState<
    'Showroom Preorder' | 'Website Preorder' | 'Page Preorder' | 'Online Preorder'
  >('Showroom Preorder');
  const [customer, setCustomer] = useState('');
  const [phone, setPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [productName, setProductName] = useState('');
  const [dressFabric, setDressFabric] = useState('Cotton');
  const [size, setSize] = useState('38');
  const [expectedDate, setExpectedDate] = useState('');
  const [advancePaid, setAdvancePaid] = useState<number>(1000);
  const [totalPrice, setTotalPrice] = useState<number>(3500);
  const [note, setNote] = useState('');

  const canSuperEdit = userRole === 'Admin' || userRole === 'Merchant';

  const filteredPreorders = preorders.filter((p) => {
    let matchesChannel = filterChannel === 'All';
    if (!matchesChannel) {
      if (filterChannel === 'Showroom Preorder') {
        matchesChannel = p.type === 'Showroom Preorder';
      } else if (filterChannel === 'Website Preorder') {
        matchesChannel = p.type === 'Website Preorder' || (p.type === 'Online Preorder' && !p.note?.includes('Facebook'));
      } else if (filterChannel === 'Page Preorder') {
        matchesChannel = p.type === 'Page Preorder' || (p.type === 'Online Preorder' && Boolean(p.note?.includes('Facebook')));
      }
    }
    const matchesSearch =
      p.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm) ||
      p.productName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesChannel && matchesSearch;
  });

  const handleOpenAdd = () => {
    setEditingPreorder(null);
    setType('Showroom Preorder');
    setCustomer('');
    setPhone('');
    setCustomerAddress('');
    setProductName('');
    setDressFabric('Cotton');
    setSize('38');
    setExpectedDate(new Date(Date.now() + 86400000 * 10).toISOString().slice(0, 10));
    setAdvancePaid(1000);
    setTotalPrice(3500);
    setNote('');
    setIsFormOpen(true);
  };

  const handleOpenSuperEdit = (po: PreOrder) => {
    setEditingPreorder(po);
    setType(po.type || 'Showroom Preorder');
    setCustomer(po.customer);
    setPhone(po.phone);
    setCustomerAddress(po.customerAddress || '');
    setProductName(po.productName);
    setDressFabric(po.dressFabric || 'Cotton');
    setSize(po.size || '38');
    setExpectedDate(po.expectedDate);
    setAdvancePaid(po.advancePaid);
    setTotalPrice(po.totalPrice);
    setNote(po.note || '');
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.trim() || !phone.trim() || !productName.trim()) {
      alert('গ্রাহকের নাম, ফোন এবং প্রোডাক্ট নাম দিন।');
      return;
    }

    const item: PreOrder = {
      id: editingPreorder ? editingPreorder.id : Date.now(),
      type,
      customer: customer.trim(),
      phone: phone.trim(),
      customerAddress: customerAddress.trim() || undefined,
      productName: productName.trim(),
      dressFabric: dressFabric.trim(),
      size,
      expectedDate: expectedDate || new Date(Date.now() + 86400000 * 14).toISOString().slice(0, 10),
      advancePaid: Math.max(0, advancePaid),
      totalPrice: Math.max(0, totalPrice),
      status: editingPreorder ? editingPreorder.status : 'Awaiting Stock',
      note: note.trim() || undefined,
    };

    onSavePreorder(item);
    setIsFormOpen(false);
    setEditingPreorder(null);
  };

  const handleConvertToOrder = (po: PreOrder) => {
    if (onConvertToRegularOrder) {
      onConvertToRegularOrder(po);
    } else {
      alert(`প্রি-অর্ডার #${po.id} মূল ডেলিভারি অর্ডার লিস্টে সফলভাবে পাঠানো হয়েছে!`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#bd70df]" />
            <span>PRE-ORDER & BACKORDERS TRACKING</span>
            <span className="text-xs text-[#a69ab1] font-normal">(প্রি-অর্ডার ট্র্যাকিং)</span>
          </h2>
          <p className="text-xs text-[#a69ab1] mt-0.5">
            সকল প্রি-অর্ডার, শোরুম প্রি-অর্ডার, ওয়েবসাইট প্রি-অর্ডার এবং ফেসবুক পেইজ প্রি-অর্ডার ম্যানেজমেন্ট
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#bd70df] text-[#160e1b] hover:bg-[#d091ee] transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Pre-Order (নতুন এন্ট্রি)</span>
        </button>
      </div>

      {/* 4-Option Sub-Channel Tabs: All, Showroom, Website, Page */}
      <div className="p-4 rounded-2xl bg-[#181520] border border-[#342b40] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex bg-[#100d16] p-1 rounded-xl border border-[#342b40] overflow-x-auto gap-1">
          <button
            onClick={() => setFilterChannel('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              filterChannel === 'All' ? 'bg-[#bd70df] text-[#160e1b] font-bold' : 'text-[#bcb1c7] hover:text-white'
            }`}
          >
            All Pre-Orders ({preorders.length})
          </button>
          <button
            onClick={() => setFilterChannel('Showroom Preorder')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              filterChannel === 'Showroom Preorder'
                ? 'bg-[#bd70df] text-[#160e1b] font-bold'
                : 'text-[#bcb1c7] hover:text-white'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Showroom Pre-Order ({preorders.filter((p) => p.type === 'Showroom Preorder').length})</span>
          </button>
          <button
            onClick={() => setFilterChannel('Website Preorder')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              filterChannel === 'Website Preorder'
                ? 'bg-[#bd70df] text-[#160e1b] font-bold'
                : 'text-[#bcb1c7] hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Website Pre-Order ({preorders.filter((p) => p.type === 'Website Preorder' || (p.type === 'Online Preorder' && !p.note?.includes('Facebook'))).length})</span>
          </button>
          <button
            onClick={() => setFilterChannel('Page Preorder')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              filterChannel === 'Page Preorder'
                ? 'bg-[#bd70df] text-[#160e1b] font-bold'
                : 'text-[#bcb1c7] hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Page Pre-Order ({preorders.filter((p) => p.type === 'Page Preorder' || (p.type === 'Online Preorder' && p.note?.includes('Facebook'))).length})</span>
          </button>
        </div>

        <div className="relative flex-1 max-w-xs">
          <Search className="w-4 h-4 text-[#a69ab1] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="কাস্টমার, ফোন বা ড্রেস দিয়ে খুঁজুন..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#100d16] border border-[#342b40] rounded-xl text-xs text-white outline-none focus:border-[#bd70df]"
          />
        </div>
      </div>

      {/* Preorders Table */}
      <div className="rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#14101c] border-b border-[#342b40] text-[#a69ab1]">
                <th className="py-3 px-4 font-semibold">Type & ID <span className="text-[10px] font-normal block text-[#7e728d]">টাইপ ও আইডি</span></th>
                <th className="py-3 px-4 font-semibold">Customer & Phone <span className="text-[10px] font-normal block text-[#7e728d]">কাস্টমার ও ফোন</span></th>
                <th className="py-3 px-4 font-semibold">Dress & Fabric <span className="text-[10px] font-normal block text-[#7e728d]">ড্রেস ও ফেব্রিক</span></th>
                <th className="py-3 px-4 font-semibold">Size (36-56) <span className="text-[10px] font-normal block text-[#7e728d]">সাইজ ভ্যারিয়েন্ট</span></th>
                <th className="py-3 px-4 font-semibold">Expected Date <span className="text-[10px] font-normal block text-[#7e728d]">সম্ভাব্য ডেলিভারি</span></th>
                <th className="py-3 px-4 font-semibold">Advance & Due <span className="text-[10px] font-normal block text-[#7e728d]">অগ্রিম ও বাকি</span></th>
                <th className="py-3 px-4 font-semibold">Status <span className="text-[10px] font-normal block text-[#7e728d]">স্ট্যাটাস</span></th>
                <th className="py-3 px-4 font-semibold text-right">Actions <span className="text-[10px] font-normal block text-[#7e728d]">অ্যাকশন</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#282033]">
              {filteredPreorders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-[#a69ab1]">
                    কোনো প্রি-অর্ডার পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                filteredPreorders.map((po, index) => {
                  const due = Math.max(0, po.totalPrice - po.advancePaid);
                  return (
                    <tr key={`preorder-${po.id}-${index}`} className="hover:bg-[#201927] transition-colors">
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                            po.type === 'Online Preorder'
                              ? 'bg-[#1e293b] text-[#93c5fd] border border-[#334155]'
                              : 'bg-[#2b1b36] text-[#e6b4fa] border border-[#503067]'
                          }`}
                        >
                          {po.type === 'Online Preorder' ? <Globe className="w-3 h-3" /> : <Store className="w-3 h-3" />}
                          <span>{po.type || 'Showroom Preorder'}</span>
                        </span>
                        <div className="font-mono text-[10px] text-[#a69ab1] mt-0.5">#{po.id}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{po.customer}</div>
                        <div className="text-[11px] text-[#bd70df] font-mono flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3" />
                          <span>{po.phone}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-medium text-[#f1e7f6]">{po.productName}</div>
                        {po.dressFabric && (
                          <div className="text-[10px] text-[#a69ab1]">ফেব্রিক: {po.dressFabric}</div>
                        )}
                      </td>

                      {/* Numeric Size 36-56 */}
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-[#271b35] text-[#e6b4fa] font-mono font-bold">
                          সাইজ {po.size}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono text-[#a69ab1]">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#bd70df]" />
                          <span>{po.expectedDate}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono">
                        <div className="text-[#10b981] font-bold">অগ্রিম: ৳{po.advancePaid}</div>
                        <div className="text-[#a69ab1] text-[11px]">বাকি: ৳{due}</div>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            po.status === 'Ready to Dispatch'
                              ? 'bg-[#16382d] text-[#8de8bf]'
                              : po.status === 'Stock Received'
                              ? 'bg-[#1e293b] text-[#93c5fd]'
                              : 'bg-[#3b2d18] text-[#fcd34d]'
                          }`}
                        >
                          {po.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Transfer to Regular Order List Button */}
                          <button
                            onClick={() => handleConvertToOrder(po)}
                            className="px-2.5 py-1.5 rounded-lg bg-[#14261f] text-[#6ee7b7] hover:bg-[#10b981] hover:text-white font-bold text-[11px] flex items-center gap-1 border border-[#2b6b50] transition-all"
                            title="ড্রেস তৈরি শেষ - মূল অর্ডার লিস্টে পাঠান"
                          >
                            <ArrowRight className="w-3 h-3" />
                            <span>অর্ডার লিস্টে পাঠান</span>
                          </button>

                          {/* Super Edit Button */}
                          {canSuperEdit && (
                            <button
                              onClick={() => handleOpenSuperEdit(po)}
                              className="px-2 py-1 rounded-lg bg-[#271b35] text-[#e6b4fa] hover:bg-[#bd70df] hover:text-[#160e1b] font-semibold text-[11px] flex items-center gap-1 transition-all"
                              title="সুপার এডিট (Super Edit Preorder)"
                            >
                              <Edit2 className="w-3 h-3" />
                              <span>সুপার এডিট</span>
                            </button>
                          )}

                          <button
                            onClick={() => onDeletePreorder(po.id)}
                            className="p-1 rounded text-[#ff6b83] hover:bg-[#351822]"
                            title="ডিলিট"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Super Edit Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-[#1b1524] border border-[#714786] shadow-2xl p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#342b40]">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#bd70df]" />
                <span>{editingPreorder ? 'সুপার এডিট: প্রি-অর্ডার' : 'নতুন প্রি-অর্ডার বুকিং'}</span>
              </h3>
              <button onClick={() => setIsFormOpen(false)} className="text-[#a69ab1] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Channel Type Selector */}
              <div>
                <label className="block text-[#cfc4d9] mb-1 font-semibold">Pre-Order Channel (চ্যানেল)</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setType('Showroom Preorder')}
                    className={`py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 border transition-all ${
                      type === 'Showroom Preorder'
                        ? 'bg-[#bd70df] text-[#160e1b] font-bold border-[#bd70df]'
                        : 'bg-[#100d16] text-[#a69ab1] border-[#342b40]'
                    }`}
                  >
                    <Store className="w-3.5 h-3.5" />
                    <span>Showroom</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setType('Website Preorder')}
                    className={`py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 border transition-all ${
                      type === 'Website Preorder'
                        ? 'bg-[#bd70df] text-[#160e1b] font-bold border-[#bd70df]'
                        : 'bg-[#100d16] text-[#a69ab1] border-[#342b40]'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Website</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setType('Page Preorder')}
                    className={`py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 border transition-all ${
                      type === 'Page Preorder'
                        ? 'bg-[#bd70df] text-[#160e1b] font-bold border-[#bd70df]'
                        : 'bg-[#100d16] text-[#a69ab1] border-[#342b40]'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Page</span>
                  </button>
                </div>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#cfc4d9] mb-1">কাস্টমার নাম *</label>
                  <input
                    required
                    value={customer}
                    onChange={(e) => setCustomer(e.target.value)}
                    placeholder="Lamia Tabassum"
                    className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#cfc4d9] mb-1">ফোন নম্বর *</label>
                  <input
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white outline-none font-mono"
                  />
                </div>
              </div>

              {/* Product & Fabric */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#cfc4d9] mb-1">প্রোডাক্ট নাম ও ডিজাইন *</label>
                  <input
                    required
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Royal Flared Anarkali Gown"
                    className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#cfc4d9] mb-1">ফেব্রিক / কাপড়</label>
                  <input
                    value={dressFabric}
                    onChange={(e) => setDressFabric(e.target.value)}
                    placeholder="Cotton / Muslin / Georgette"
                    className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white outline-none"
                  />
                </div>
              </div>

              {/* Numeric Size 36-56 */}
              <div>
                <label className="block text-[#cfc4d9] mb-1 font-semibold">
                  প্রি-অর্ডার সাইজ নির্বাচন করুন (৩৬-৫৬) *
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_SIZES.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSize(sz)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                        size === sz
                          ? 'bg-[#bd70df] text-[#160e1b] shadow-md'
                          : 'bg-[#100d16] text-[#cfc4d9] border border-[#3b2f48] hover:text-white'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setSize('Unstitched')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      size === 'Unstitched'
                        ? 'bg-[#3b82f6] text-white'
                        : 'bg-[#100d16] text-[#93c5fd] border border-[#1e293b]'
                    }`}
                  >
                    আনস্টিচড
                  </button>
                </div>
              </div>

              {/* Amounts & Expected Date */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#cfc4d9] mb-1">অগ্রিম গ্রহণ (৳)</label>
                  <input
                    type="number"
                    min={0}
                    value={advancePaid}
                    onChange={(e) => setAdvancePaid(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[#cfc4d9] mb-1">সর্বমোট মূল্য (৳)</label>
                  <input
                    type="number"
                    min={0}
                    value={totalPrice}
                    onChange={(e) => setTotalPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[#cfc4d9] mb-1">সম্ভাব্য তারিখ</label>
                  <input
                    type="date"
                    value={expectedDate}
                    onChange={(e) => setExpectedDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#cfc4d9] mb-1">ঠিকানা / কাস্টমার নোট</label>
                <textarea
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="ডেলিভারি ঠিকানা বা কাস্টমাইজেশন নির্দেশাবলী..."
                  className="w-full p-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl text-[#a69ab1] hover:text-white"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#bd70df] text-[#160e1b] font-bold hover:bg-[#d091ee]"
                >
                  {editingPreorder ? 'আপডেট সেভ করুন' : 'প্রি-অর্ডার সংরক্ষণ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
