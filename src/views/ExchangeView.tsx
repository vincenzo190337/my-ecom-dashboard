import React, { useState } from 'react';
import { ExchangeRecord } from '../types';
import { ArrowLeftRight, Plus, Edit2, Trash2, X, Phone, RotateCcw } from 'lucide-react';

interface ExchangeViewProps {
  exchanges: ExchangeRecord[];
  onSaveExchange: (record: ExchangeRecord) => void;
  onDeleteExchange: (id: number) => void;
  onNavigateToReturns?: () => void;
}

export const ExchangeView: React.FC<ExchangeViewProps> = ({
  exchanges,
  onSaveExchange,
  onDeleteExchange,
  onNavigateToReturns,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form State
  const [orderId, setOrderId] = useState('');
  const [customer, setCustomer] = useState('');
  const [phone, setPhone] = useState('');
  const [oldDress, setOldDress] = useState('');
  const [newDress, setNewDress] = useState('');
  const [charge, setCharge] = useState<number>(80);
  const [status, setStatus] = useState<
    'Requested' | 'Approved' | 'Picked Up' | 'Completed' | 'Rejected'
  >('Requested');
  const [note, setNote] = useState('');

  const openAdd = () => {
    setEditingId(null);
    setOrderId('');
    setCustomer('');
    setPhone('');
    setOldDress('');
    setNewDress('');
    setCharge(80);
    setStatus('Requested');
    setNote('');
    setIsFormOpen(true);
  };

  const openEdit = (x: ExchangeRecord) => {
    setEditingId(x.id);
    setOrderId(x.orderId);
    setCustomer(x.customer);
    setPhone(x.phone);
    setOldDress(x.oldDress);
    setNewDress(x.newDress);
    setCharge(x.charge);
    setStatus(x.status);
    setNote(x.note || '');
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim() || !customer.trim()) {
      alert('Order ID ও কাস্টমারের নাম আবশ্যক।');
      return;
    }

    const record: ExchangeRecord = {
      id: editingId ? editingId : Date.now(),
      orderId: orderId.trim(),
      customer: customer.trim(),
      phone: phone.trim(),
      oldDress: oldDress.trim(),
      newDress: newDress.trim(),
      charge: Math.max(0, charge),
      status,
      note: note.trim(),
    };

    onSaveExchange(record);
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-5">
      <div className="p-4 sm:p-5 rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ArrowLeftRight className="w-5 h-5 text-[#bd70df]" />
              <span>ড্রেস ও সাইজ এক্সচেঞ্জ ম্যানেজমেন্ট (Exchange)</span>
            </h2>
            {/* Unified Hub Switcher */}
            {onNavigateToReturns && (
              <div className="inline-flex items-center gap-1 p-0.5 rounded-xl bg-[#100d17] border border-[#342b40] text-xs ml-0 sm:ml-2">
                <button
                  type="button"
                  onClick={onNavigateToReturns}
                  className="px-2.5 py-1 rounded-lg font-semibold text-[#a69ab1] hover:text-white hover:bg-[#20182a] transition-all flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3 text-rose-400" />
                  <span>রিটার্ন ও রিফান্ড</span>
                </button>
                <span className="px-2.5 py-1 rounded-lg font-bold bg-[#bd70df] text-[#120a17]">
                  ড্রেস এক্সচেঞ্জ
                </span>
              </div>
            )}
          </div>
          <p className="text-xs text-[#a69ab1]">কাস্টমারের সাইজ বদল ও রিটার্ন পার্সেল ট্র্যাকিং</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#bd70df] text-[#160e1b] hover:bg-[#d091ee] transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন এক্সচেঞ্জ এন্ট্রি</span>
        </button>
      </div>

      {isFormOpen && (
        <div className="p-5 rounded-2xl bg-[#1b1524] border border-[#714786] shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#342b40]">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ArrowLeftRight className="w-5 h-5 text-[#bd70df]" />
              <span>{editingId ? 'এক্সচেঞ্জ তথ্য এডিট' : 'নতুন এক্সচেঞ্জ রিকোয়েস্ট'}</span>
            </h3>
            <button
              onClick={() => setIsFormOpen(false)}
              className="p-1 rounded-lg text-[#a69ab1] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#cfc4d9] mb-1.5">Order ID *</label>
              <input
                type="text"
                required
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="98412"
                className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-xs sm:text-sm text-white focus:border-[#bd70df] outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#cfc4d9] mb-1.5">কাস্টমারের নাম *</label>
              <input
                type="text"
                required
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                placeholder="Sadia Islam"
                className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-xs sm:text-sm text-white focus:border-[#bd70df] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#cfc4d9] mb-1.5">মোবাইল নম্বর</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="017XXXXXXXX"
                className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-xs sm:text-sm text-white focus:border-[#bd70df] outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#cfc4d9] mb-1.5">
                এক্সচেঞ্জ ডেলিভারি ফি (৳)
              </label>
              <input
                type="number"
                min={0}
                value={charge}
                onChange={(e) => setCharge(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-xs sm:text-sm text-white focus:border-[#bd70df] outline-none font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-[#cfc4d9] mb-1.5">
                আগের ড্রেস ও সাইজ (Old Dress / Size)
              </label>
              <input
                type="text"
                value={oldDress}
                onChange={(e) => setOldDress(e.target.value)}
                placeholder="e.g. Organza Three Piece - Size M"
                className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-xs sm:text-sm text-white focus:border-[#bd70df] outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-[#cfc4d9] mb-1.5">
                নতুন ড্রেস ও সাইজ (New Dress / Size)
              </label>
              <input
                type="text"
                value={newDress}
                onChange={(e) => setNewDress(e.target.value)}
                placeholder="e.g. Organza Three Piece - Size L"
                className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-xs sm:text-sm text-white focus:border-[#bd70df] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#cfc4d9] mb-1.5">স্ট্যাটাস</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-xs sm:text-sm text-white focus:border-[#bd70df] outline-none cursor-pointer"
              >
                <option value="Requested">Requested (অনুরোধ)</option>
                <option value="Approved">Approved (অনুমোদিত)</option>
                <option value="Picked Up">Picked Up (কালেক্টেড)</option>
                <option value="Completed">Completed (সম্পন্ন)</option>
                <option value="Rejected">Rejected (বাতিল)</option>
              </select>
            </div>

            <div className="lg:col-span-3">
              <label className="block text-xs font-medium text-[#cfc4d9] mb-1.5">বিশেষ নোট</label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. কাস্টমারের অভিযোগ: বডি টাইট হচ্ছে"
                className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-xs sm:text-sm text-white focus:border-[#bd70df] outline-none"
              />
            </div>

            <div className="col-span-full flex items-center gap-2 pt-2 border-t border-[#342b40]">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#bd70df] text-[#160e1b] hover:bg-[#d091ee] transition-colors"
              >
                {editingId ? 'আপডেট করুন' : 'সেভ করুন'}
              </button>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium bg-[#1c1726] text-[#bcb1c7] hover:text-white"
              >
                বাতিল
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Exchanges Table */}
      <div className="rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#14101c] border-b border-[#342b40] text-[#a69ab1]">
                <th className="py-3 px-3 font-semibold">Order ID</th>
                <th className="py-3 px-3 font-semibold">Customer</th>
                <th className="py-3 px-3 font-semibold">আগের ড্রেস / সাইজ</th>
                <th className="py-3 px-3 font-semibold">নতুন ড্রেস / সাইজ</th>
                <th className="py-3 px-3 font-semibold">চার্জ (৳)</th>
                <th className="py-3 px-3 font-semibold">স্ট্যাটাস</th>
                <th className="py-3 px-3 font-semibold text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#282033]">
              {exchanges.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#a69ab1]">
                    কোনো এক্সচেঞ্জ রিকোয়েস্ট নেই।
                  </td>
                </tr>
              ) : (
                exchanges.map((x) => (
                  <tr key={x.id} className="hover:bg-[#201927] transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-white">#{x.orderId}</td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-white">{x.customer}</div>
                      {x.phone && (
                        <div className="text-[11px] font-mono text-[#a69ab1]">{x.phone}</div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-[#ff9aaa]">{x.oldDress || '—'}</td>
                    <td className="py-3 px-3 text-[#8de8bf] font-medium">{x.newDress || '—'}</td>
                    <td className="py-3 px-3 font-mono tabular-nums text-white">৳{x.charge}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                          x.status === 'Completed'
                            ? 'bg-[#16382d] text-[#8de8bf]'
                            : x.status === 'Rejected'
                            ? 'bg-[#44202a] text-[#ff9aaa]'
                            : 'bg-[#2b1f36] text-[#bd70df]'
                        }`}
                      >
                        {x.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => openEdit(x)}
                          className="p-1.5 rounded-lg text-[#a69ab1] hover:text-[#bd70df] hover:bg-[#2b2038] transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`এক্সচেঞ্জ রেকর্ড #${x.orderId} মুছে ফেলবেন?`)) {
                              onDeleteExchange(x.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-[#a69ab1] hover:text-[#ff6b83] hover:bg-[#351822] transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
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
    </div>
  );
};
