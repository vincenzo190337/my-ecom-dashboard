import React, { useState } from 'react';
import { StaffMember } from '../types';
import { Users, Plus, Edit2, Trash2, X, ShieldCheck, Check } from 'lucide-react';

interface StaffViewProps {
  staff: StaffMember[];
  onSaveStaff: (member: StaffMember) => void;
  onDeleteStaff: (id: number) => void;
}

export const StaffView: React.FC<StaffViewProps> = ({ staff, onSaveStaff, onDeleteStaff }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<StaffMember['role']>('Order Manager');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');

  // Granular Permissions
  const [canEditOrders, setCanEditOrders] = useState(true);
  const [canDeleteOrders, setCanDeleteOrders] = useState(false);
  const [canApproveRefund, setCanApproveRefund] = useState(false);
  const [canViewProfit, setCanViewProfit] = useState(true);
  const [canManageProducts, setCanManageProducts] = useState(false);

  const openAdd = () => {
    setEditingId(null);
    setName('');
    setEmail('');
    setRole('Order Manager');
    setStatus('Active');
    setCanEditOrders(true);
    setCanDeleteOrders(false);
    setCanApproveRefund(false);
    setCanViewProfit(true);
    setCanManageProducts(false);
    setIsFormOpen(true);
  };

  const openEdit = (s: StaffMember) => {
    setEditingId(s.id);
    setName(s.name);
    setEmail(s.email);
    setRole(s.role);
    setStatus(s.status);
    setCanEditOrders(s.permissions?.canEditOrders ?? true);
    setCanDeleteOrders(s.permissions?.canDeleteOrders ?? false);
    setCanApproveRefund(s.permissions?.canApproveRefund ?? false);
    setCanViewProfit(s.permissions?.canViewProfit ?? false);
    setCanManageProducts(s.permissions?.canManageProducts ?? false);
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      alert('স্টাফের নাম ও ইমেইল আবশ্যক।');
      return;
    }

    const member: StaffMember = {
      id: editingId ? editingId : Date.now(),
      name: name.trim(),
      email: email.trim(),
      role,
      permissions: {
        canEditOrders,
        canDeleteOrders,
        canApproveRefund,
        canViewProfit,
        canManageProducts,
      },
      status,
    };

    onSaveStaff(member);
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-5">
      <div className="p-4 sm:p-5 rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-[#bd70df]" />
            <span>স্টাফ ও গ্র্যানুলার পারমিশন (Staff & Granular Permissions)</span>
          </h2>
          <p className="text-xs text-[#a69ab1]">
            কোন স্টাফ কোন পেজ দেখতে পারবে, অর্ডার এডিট, ডিলিট, বা রিফান্ড অনুমোদন দিতে পারবে তা নিয়ন্ত্রণ করুন
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#bd70df] text-[#160e1b] hover:bg-[#d091ee] transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন স্টাফ যোগ করুন</span>
        </button>
      </div>

      {isFormOpen && (
        <div className="p-5 rounded-2xl bg-[#1b1524] border border-[#714786] shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#342b40]">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#bd70df]" />
              <span>{editingId ? 'স্টাফ একাউন্ট এডিট' : 'নতুন স্টাফ ও পারমিশন অ্যাসাইন'}</span>
            </h3>
            <button
              onClick={() => setIsFormOpen(false)}
              className="p-1 rounded-lg text-[#a69ab1] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-[#cfc4d9] mb-1.5 font-medium">স্টাফের নাম *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tasnim Hasan"
                  className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white focus:border-[#bd70df] outline-none"
                />
              </div>

              <div>
                <label className="block text-[#cfc4d9] mb-1.5 font-medium">ইমেইল ঠিকানা *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tasnim@alvinawomen.com"
                  className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white focus:border-[#bd70df] outline-none"
                />
              </div>

              <div>
                <label className="block text-[#cfc4d9] mb-1.5 font-medium">রোল (Role)</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white focus:border-[#bd70df] outline-none"
                >
                  <option value="Admin">Admin (সর্বোচ্চ পূর্ণ অ্যাক্সেস)</option>
                  <option value="Merchant">Merchant (মার্চেন্ট ও স্টোর ওনার)</option>
                  <option value="Order Manager">Order Manager (অর্ডার কন্ট্রোল ও চালান)</option>
                  <option value="Product Manager">Product Manager (প্রোডাক্ট ও ক্যাটালগ)</option>
                  <option value="Inventory & Stock Manager">Inventory & Stock Manager (ইনভেন্টরি ও স্টক)</option>
                  <option value="Delivery & Courier Manager">Delivery & Courier Manager (কুরিয়ার লজিস্টিকস)</option>
                  <option value="Showroom POS Cashier">Showroom POS Cashier (শোরুম ক্যাশিয়ার)</option>
                  <option value="Customer Support Executive">Customer Support Executive (কাস্টমার সাপোর্ট)</option>
                  <option value="Marketing & Growth">Marketing & Growth (মার্কেটিং ও ক্যাম্পেইন)</option>
                  <option value="Accounts Manager">Accounts Manager (ফাইন্যান্স ও লাভ-ক্ষতি)</option>
                </select>
              </div>

              <div>
                <label className="block text-[#cfc4d9] mb-1.5 font-medium">স্ট্যাটাস</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white focus:border-[#bd70df] outline-none"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Granular Permissions Checkboxes */}
            <div className="p-4 rounded-xl bg-[#120f18] border border-[#342b40] space-y-2">
              <span className="text-xs font-bold text-white block mb-1">
                গ্র্যানুলার পারমিশন অ্যাক্সেস (Granular Permissions):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <label className="flex items-center gap-2 text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={canEditOrders}
                    onChange={(e) => setCanEditOrders(e.target.checked)}
                    className="accent-[#bd70df]"
                  />
                  <span>অর্ডার এডিট ও স্ট্যাটাস পরিবর্তন</span>
                </label>

                <label className="flex items-center gap-2 text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={canDeleteOrders}
                    onChange={(e) => setCanDeleteOrders(e.target.checked)}
                    className="accent-[#bd70df]"
                  />
                  <span>অর্ডার চিরতরে মুছে ফেলা (Delete)</span>
                </label>

                <label className="flex items-center gap-2 text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={canApproveRefund}
                    onChange={(e) => setCanApproveRefund(e.target.checked)}
                    className="accent-[#bd70df]"
                  />
                  <span>রিফান্ড ও ডিসকাউন্ট অনুমোদন (Refund Approval)</span>
                </label>

                <label className="flex items-center gap-2 text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={canViewProfit}
                    onChange={(e) => setCanViewProfit(e.target.checked)}
                    className="accent-[#bd70df]"
                  />
                  <span>লাভ-ক্ষতি ও রেভিনিউ রিপোর্ট দেখা (View Profit)</span>
                </label>

                <label className="flex items-center gap-2 text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={canManageProducts}
                    onChange={(e) => setCanManageProducts(e.target.checked)}
                    className="accent-[#bd70df]"
                  />
                  <span>প্রোডাক্ট যোগ ও মূল্য পরিবর্তন (Manage Products)</span>
                </label>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-[#342b40]">
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

      {/* Staff Table */}
      <div className="rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#14101c] border-b border-[#342b40] text-[#a69ab1]">
                <th className="py-3 px-3 font-semibold">Name</th>
                <th className="py-3 px-3 font-semibold">Email</th>
                <th className="py-3 px-3 font-semibold">Role</th>
                <th className="py-3 px-3 font-semibold">Active Permissions</th>
                <th className="py-3 px-3 font-semibold">Status</th>
                <th className="py-3 px-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#282033]">
              {staff.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#a69ab1]">
                    কোনো স্টাফ সদস্য নেই।
                  </td>
                </tr>
              ) : (
                staff.map((s) => (
                  <tr key={s.id} className="hover:bg-[#201927] transition-colors">
                    <td className="py-3 px-3 font-semibold text-white">{s.name}</td>
                    <td className="py-3 px-3 text-[#bcb1c7] font-mono">{s.email}</td>
                    <td className="py-3 px-3">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#2a1d35] text-[#e6b4fa] font-medium">
                        {s.role}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#bcb1c7]">
                      <div className="flex flex-wrap gap-1">
                        {s.permissions?.canEditOrders && (
                          <span className="px-1.5 py-0.5 rounded bg-[#162720] text-[#8de8bf] text-[10px]">
                            Edit Orders
                          </span>
                        )}
                        {s.permissions?.canApproveRefund && (
                          <span className="px-1.5 py-0.5 rounded bg-[#271b35] text-[#e6b4fa] text-[10px]">
                            Refunds
                          </span>
                        )}
                        {s.permissions?.canViewProfit && (
                          <span className="px-1.5 py-0.5 rounded bg-[#1e2738] text-[#93c5fd] text-[10px]">
                            Profit View
                          </span>
                        )}
                        {s.permissions?.canDeleteOrders && (
                          <span className="px-1.5 py-0.5 rounded bg-[#351822] text-[#ff9aaa] text-[10px]">
                            Delete
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${
                          s.status === 'Active'
                            ? 'bg-[#16382d] text-[#8de8bf]'
                            : 'bg-[#44202a] text-[#ff9aaa]'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => openEdit(s)}
                          className="p-1.5 rounded-lg text-[#a69ab1] hover:text-[#bd70df] hover:bg-[#2b2038] transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`স্টাফ সদস্য "${s.name}" মুছে ফেলতে চান?`)) {
                              onDeleteStaff(s.id);
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
