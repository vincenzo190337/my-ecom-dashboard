import React, { useState } from 'react';
import { Merchant } from '../types';
import { Store, Plus, Search, Edit2, Trash2, X, Phone, Mail } from 'lucide-react';

interface MerchantsViewProps {
  merchants: Merchant[];
  onSaveMerchant: (merchant: Merchant) => void;
  onDeleteMerchant: (merchantId: number) => void;
}

export const MerchantsView: React.FC<MerchantsViewProps> = ({
  merchants,
  onSaveMerchant,
  onDeleteMerchant,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [owner, setOwner] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [address, setAddress] = useState('');

  const filteredMerchants = merchants.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.phone.includes(searchTerm)
  );

  const openAddForm = () => {
    setEditingId(null);
    setName('');
    setOwner('');
    setPhone('');
    setEmail('');
    setStatus('Active');
    setAddress('');
    setIsFormOpen(true);
  };

  const openEditForm = (m: Merchant) => {
    setEditingId(m.id);
    setName(m.name);
    setOwner(m.owner);
    setPhone(m.phone);
    setEmail(m.email);
    setStatus(m.status);
    setAddress(m.address || '');
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('দোকানের নাম (Store Name) আবশ্যক।');
      return;
    }

    const merchantData: Merchant = {
      id: editingId ? editingId : Date.now(),
      name: name.trim(),
      owner: owner.trim(),
      phone: phone.trim(),
      email: email.trim(),
      status,
      address: address.trim(),
    };

    onSaveMerchant(merchantData);
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Search and Action Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1 max-w-md relative">
          <Search className="w-4 h-4 text-[#a69ab1] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="মার্চেন্ট / দোকানের নাম বা ফোন খুঁজুন..."
            className="w-full pl-9 pr-3 py-2 bg-[#100d16] border border-[#342b40] rounded-xl text-xs sm:text-sm text-white focus:border-[#bd70df] outline-none"
          />
        </div>

        <button
          onClick={openAddForm}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#bd70df] text-[#160e1b] hover:bg-[#d091ee] transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন মার্চেন্ট যুক্ত করুন</span>
        </button>
      </div>

      {/* Form Card */}
      {isFormOpen && (
        <div className="p-5 rounded-2xl bg-[#1b1524] border border-[#714786] shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#342b40]">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Store className="w-5 h-5 text-[#bd70df]" />
              <span>{editingId ? 'মার্চেন্ট তথ্য পরিবর্তন' : 'নতুন মার্চেন্ট প্রোফাইল'}</span>
            </h3>
            <button
              onClick={() => setIsFormOpen(false)}
              className="p-1 rounded-lg text-[#a69ab1] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#cfc4d9] mb-1.5">
                  দোকানের নাম (Store Name) *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ALVINA Women Wear"
                  className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-xs sm:text-sm text-white focus:border-[#bd70df] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#cfc4d9] mb-1.5">
                  মালিকের নাম (Owner Name)
                </label>
                <input
                  type="text"
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  placeholder="Owner Name"
                  className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-xs sm:text-sm text-white focus:border-[#bd70df] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#cfc4d9] mb-1.5">
                  মোবাইল নম্বর (Phone)
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-xs sm:text-sm text-white focus:border-[#bd70df] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#cfc4d9] mb-1.5">ইমেইল</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="merchant@example.com"
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
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#cfc4d9] mb-1.5">
                  শোরুম / দোকানের ঠিকানা
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Dhanmondi, Dhaka"
                  className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-xs sm:text-sm text-white focus:border-[#bd70df] outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-[#342b40]">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#bd70df] text-[#160e1b] hover:bg-[#d091ee] transition-colors"
              >
                {editingId ? 'আপডেট করুন' : 'মার্চেন্ট সেভ করুন'}
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

      {/* Merchants Table */}
      <div className="rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#14101c] border-b border-[#342b40] text-[#a69ab1]">
                <th className="py-3 px-3 font-semibold">দোকানের নাম (Store Name)</th>
                <th className="py-3 px-3 font-semibold">মালিক (Owner)</th>
                <th className="py-3 px-3 font-semibold">মোবাইল</th>
                <th className="py-3 px-3 font-semibold">ইমেইল ও ঠিকানা</th>
                <th className="py-3 px-3 font-semibold">স্ট্যাটাস</th>
                <th className="py-3 px-3 font-semibold text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#282033]">
              {filteredMerchants.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#a69ab1]">
                    কোনো মার্চেন্ট নেই। "+ নতুন মার্চেন্ট" বাটনে ক্লিক করুন।
                  </td>
                </tr>
              ) : (
                filteredMerchants.map((m) => (
                  <tr key={m.id} className="hover:bg-[#201927] transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-white">{m.name}</div>
                      <div className="text-[11px] text-[#a69ab1]">ID: #{m.id}</div>
                    </td>

                    <td className="py-3 px-3 text-[#f7f2fb]">{m.owner || '—'}</td>

                    <td className="py-3 px-3 font-mono text-[#e4d8ec]">
                      {m.phone ? (
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-[#bd70df]" />
                          <span>{m.phone}</span>
                        </div>
                      ) : (
                        '—'
                      )}
                    </td>

                    <td className="py-3 px-3 text-[#a69ab1]">
                      <div>{m.email || '—'}</div>
                      {m.address && <div className="text-[11px] text-[#d7cddd]">{m.address}</div>}
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                          m.status === 'Active'
                            ? 'bg-[#16382d] text-[#8de8bf]'
                            : 'bg-[#44202a] text-[#ff9aaa]'
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => openEditForm(m)}
                          className="p-1.5 rounded-lg text-[#a69ab1] hover:text-[#bd70df] hover:bg-[#2b2038] transition-colors"
                          title="Edit Merchant"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`মার্চেন্ট "${m.name}" মুছে ফেলতে চান?`)) {
                              onDeleteMerchant(m.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-[#a69ab1] hover:text-[#ff6b83] hover:bg-[#351822] transition-colors"
                          title="Delete Merchant"
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
