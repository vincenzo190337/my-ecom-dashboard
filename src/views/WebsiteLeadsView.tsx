import React, { useState } from 'react';
import { WebsiteLead, Order } from '../types';
import {
  UserCheck,
  ShoppingCart,
  Phone,
  MessageSquare,
  Search,
  Filter,
  Plus,
  Trash2,
  ExternalLink,
  Clock,
  Sparkles,
  ArrowRight,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { WhatsAppChatModal } from '../components/WhatsAppChatModal';

interface WebsiteLeadsViewProps {
  leads: WebsiteLead[];
  onSaveLead: (lead: WebsiteLead) => void;
  onDeleteLead: (id: number) => void;
  onConvertToOrder?: (lead: WebsiteLead) => void;
}

export const WebsiteLeadsView: React.FC<WebsiteLeadsViewProps> = ({
  leads,
  onSaveLead,
  onDeleteLead,
  onConvertToOrder,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActivity, setFilterActivity] = useState<string>('All');
  const [chatTarget, setChatTarget] = useState<{ phone: string; name: string } | null>(null);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  // Manual lead modal form
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newDress, setNewDress] = useState('');
  const [newCartTotal, setNewCartTotal] = useState<number>(3200);
  const [newActivity, setNewActivity] = useState<WebsiteLead['activityType']>('Added to Cart');

  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.phone.includes(searchTerm) ||
      l.viewedDress.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesActivity = filterActivity === 'All' || l.activityType === filterActivity;
    return matchesSearch && matchesActivity;
  });

  const handleCreateManualLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim() || !newDress.trim()) {
      alert('কাস্টমার নাম, ফোন ও পছন্দের ড্রেস পূরণ করুন!');
      return;
    }

    const lead: WebsiteLead = {
      id: Date.now(),
      name: newName.trim(),
      phone: newPhone.trim(),
      viewedDress: newDress.trim(),
      cartItems: [
        {
          name: newDress.trim(),
          size: '38',
          price: Number(newCartTotal) || 2800,
        },
      ],
      cartTotal: Number(newCartTotal) || 2800,
      timestamp: new Date().toISOString(),
      activityType: newActivity,
      status: 'New Lead',
    };

    onSaveLead(lead);
    setIsManualModalOpen(false);
    setNewName('');
    setNewPhone('');
    setNewDress('');
  };

  const handleStatusChange = (lead: WebsiteLead, status: WebsiteLead['status']) => {
    onSaveLead({ ...lead, status });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#bd70df]" />
            <span>ওয়েবসাইট ভিজিটর লিড ও ড্রপ-কার্ট ট্র্যাকার (Visitor Leads & Dropped Cart)</span>
          </h2>
          <p className="text-xs text-[#a69ab1]">
            ওয়েবসাইটে ড্রেস দেখা, কার্টে রাখা বা চেকআউট পেজে গিয়ে ফিরে যাওয়া কাস্টমারদের তাৎক্ষণিক তথ্য ও হোয়াটসঅ্যাপ ফলো-আপ
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsManualModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#bd70df] text-[#160e1b] hover:bg-[#d091ee] transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন লিড এন্ট্রি</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-[#16121f] border border-[#342b40]">
          <span className="text-[11px] text-[#a69ab1]">মোট ক্যাপচার করা লিড</span>
          <div className="text-xl font-bold text-white mt-1">{leads.length}</div>
          <span className="text-[10px] text-[#bd70df]">সক্রিয় ভিজিটর</span>
        </div>
        <div className="p-4 rounded-xl bg-[#16121f] border border-[#342b40]">
          <span className="text-[11px] text-[#a69ab1]">ড্রপ / পরিত্যক্ত কার্ট</span>
          <div className="text-xl font-bold text-[#f59e0b] mt-1">
            {leads.filter((l) => l.activityType === 'Added to Cart').length}
          </div>
          <span className="text-[10px] text-[#a69ab1]">কার্টে ড্রেস রেখে গেছে</span>
        </div>
        <div className="p-4 rounded-xl bg-[#16121f] border border-[#342b40]">
          <span className="text-[11px] text-[#a69ab1]">চেকআউট পেজ লিডস</span>
          <div className="text-xl font-bold text-[#ec4899] mt-1">
            {leads.filter((l) => l.activityType === 'Initiated Checkout').length}
          </div>
          <span className="text-[10px] text-[#a69ab1]">অর্ডারের খুব কাছাকাছি</span>
        </div>
        <div className="p-4 rounded-xl bg-[#16121f] border border-[#342b40]">
          <span className="text-[11px] text-[#a69ab1]">সম্ভাব্য বিক্রয় মূল্য</span>
          <div className="text-xl font-bold text-[#10b981] mt-1 font-mono">
            ৳{leads.reduce((s, l) => s + l.cartTotal, 0).toLocaleString()}
          </div>
          <span className="text-[10px] text-[#6ee7b7]">রিকভারি টার্গেট</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-[#181520] border border-[#342b40] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#a69ab1] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="নাম, ফোন নম্বর বা ড্রেস দিয়ে খুঁজুন..."
            className="w-full pl-9 pr-3 py-2 bg-[#100d16] border border-[#3b2f4a] rounded-xl text-xs text-white outline-none focus:border-[#bd70df]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {['All', 'Added to Cart', 'Initiated Checkout', 'Viewed Product'].map((act) => (
            <button
              key={act}
              onClick={() => setFilterActivity(act)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                filterActivity === act
                  ? 'bg-[#bd70df] text-[#160e1b]'
                  : 'bg-[#120f18] text-[#a69ab1] hover:text-white border border-[#342b40]'
              }`}
            >
              {act === 'All'
                ? 'সকল লিড'
                : act === 'Added to Cart'
                ? 'কার্টে যুক্ত'
                : act === 'Initiated Checkout'
                ? 'চেকআউট পেজ'
                : 'পণ্য ভিউ'}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Table */}
      <div className="rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#14101c] border-b border-[#342b40] text-[#a69ab1]">
                <th className="py-3 px-4 font-semibold">গ্রাহকের নাম ও ফোন</th>
                <th className="py-3 px-4 font-semibold">পছন্দকৃত ড্রেস ও আইটেম</th>
                <th className="py-3 px-4 font-semibold">কার্ট ভ্যালু</th>
                <th className="py-3 px-4 font-semibold">ওয়েবসাইট অ্যাক্টিভিটি</th>
                <th className="py-3 px-4 font-semibold">সময় ও তারিখ</th>
                <th className="py-3 px-4 font-semibold">ফলো-আপ স্ট্যাটাস</th>
                <th className="py-3 px-4 font-semibold text-right">হোয়াটসঅ্যাপ ও অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#282033]">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-[#a69ab1]">
                    কোনো লিড রেকর্ড পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-[#201927] transition-colors">
                    {/* Customer */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-white text-sm">{lead.name}</div>
                      <div className="font-mono text-xs text-[#bd70df] flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3" />
                        <span>{lead.phone}</span>
                      </div>
                    </td>

                    {/* Dress */}
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-medium text-[#f3ebf8]">{lead.viewedDress}</div>
                      {lead.cartItems && lead.cartItems.length > 0 && (
                        <div className="text-[11px] text-[#a69ab1] mt-0.5">
                          সাইজ: {lead.cartItems[0]?.size || '38'} · {lead.cartItems.length} টি আইটেম
                        </div>
                      )}
                    </td>

                    {/* Value */}
                    <td className="py-3 px-4 font-mono font-bold text-[#10b981]">
                      ৳{lead.cartTotal.toLocaleString()}
                    </td>

                    {/* Activity */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold ${
                          lead.activityType === 'Initiated Checkout'
                            ? 'bg-[#3b1223] text-[#ff809b] border border-[#6b223c]'
                            : lead.activityType === 'Added to Cart'
                            ? 'bg-[#2e2013] text-[#fcd34d] border border-[#61441b]'
                            : 'bg-[#182333] text-[#93c5fd] border border-[#23436d]'
                        }`}
                      >
                        {lead.activityType === 'Added to Cart' && <ShoppingCart className="w-3 h-3" />}
                        {lead.activityType === 'Initiated Checkout' && <ArrowRight className="w-3 h-3" />}
                        {lead.activityType === 'Viewed Product' && <Eye className="w-3 h-3" />}
                        <span>{lead.activityType}</span>
                      </span>
                    </td>

                    {/* Time */}
                    <td className="py-3 px-4 text-[#a69ab1] font-mono text-[11px]">
                      {lead.timestamp.slice(0, 10)}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead, e.target.value as any)}
                        className="px-2 py-1 bg-[#100d16] border border-[#3b2f4a] rounded-lg text-[11px] text-white outline-none"
                      >
                        <option value="New Lead">নতুন লিড (New)</option>
                        <option value="WhatsApp Contacted">মেসেজ পাঠানো হয়েছে</option>
                        <option value="Converted to Order">অর্ডার সম্পন্ন হয়েছে</option>
                        <option value="Dismissed">বাতিল</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* WhatsApp Button */}
                        <button
                          onClick={() => setChatTarget({ phone: lead.phone, name: lead.name })}
                          className="px-2.5 py-1.5 rounded-lg bg-[#25D366]/20 text-[#25D366] hover:bg-[#25D366] hover:text-white font-bold transition-all flex items-center gap-1"
                          title="সরাসরি হোয়াটসঅ্যাপ মেসেজ পাঠান"
                        >
                          <MessageSquare className="w-3.5 h-3.5 fill-current" />
                          <span>WhatsApp</span>
                        </button>

                        {/* Convert to Order */}
                        {onConvertToOrder && (
                          <button
                            onClick={() => onConvertToOrder(lead)}
                            className="px-2.5 py-1.5 rounded-lg bg-[#271b35] text-[#e6b4fa] hover:bg-[#bd70df] hover:text-[#160e1b] font-semibold transition-all"
                            title="অর্ডারে রূপান্তর করুন"
                          >
                            অর্ডার তৈরি
                          </button>
                        )}

                        <button
                          onClick={() => onDeleteLead(lead.id)}
                          className="p-1.5 rounded-lg text-[#ff6b83] hover:bg-[#351822] transition-colors"
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

      {/* Manual Lead Modal */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#16121f] border border-[#3e2e50] rounded-2xl p-5 shadow-2xl space-y-4 text-xs">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#bd70df]" />
              <span>নতুন কাস্টমার লিড যুক্ত করুন</span>
            </h3>

            <form onSubmit={handleCreateManualLead} className="space-y-3">
              <div>
                <label className="block text-[#cfc4d9] mb-1">গ্রাহকের নাম *</label>
                <input
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="যেমন: নুসরাত জাহান"
                  className="w-full px-3 py-2 bg-[#100d16] border border-[#3b2f4a] rounded-xl text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-[#cfc4d9] mb-1">ফোন নম্বর *</label>
                <input
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full px-3 py-2 bg-[#100d16] border border-[#3b2f4a] rounded-xl text-white font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-[#cfc4d9] mb-1">দেখা বা কার্টে রাখা ড্রেস *</label>
                <input
                  required
                  value={newDress}
                  onChange={(e) => setNewDress(e.target.value)}
                  placeholder="যেমন: Three-Piece Cotton Block Print"
                  className="w-full px-3 py-2 bg-[#100d16] border border-[#3b2f4a] rounded-xl text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#cfc4d9] mb-1">কার্ট মূল্য (৳)</label>
                  <input
                    type="number"
                    value={newCartTotal}
                    onChange={(e) => setNewCartTotal(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#100d16] border border-[#3b2f4a] rounded-xl text-white font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#cfc4d9] mb-1">অ্যাক্টিভিটি লেভেল</label>
                  <select
                    value={newActivity}
                    onChange={(e) => setNewActivity(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#100d16] border border-[#3b2f4a] rounded-xl text-white outline-none"
                  >
                    <option value="Added to Cart">কার্টে যুক্ত</option>
                    <option value="Initiated Checkout">চেকআউট পেজ</option>
                    <option value="Viewed Product">পণ্য ভিউ</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-[#a69ab1] hover:text-white"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#bd70df] text-[#160e1b] font-bold hover:bg-[#d091ee]"
                >
                  লিড সেভ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WhatsApp Chat Modal */}
      {chatTarget && (
        <WhatsAppChatModal
          isOpen={true}
          onClose={() => setChatTarget(null)}
          defaultPhone={chatTarget.phone}
          defaultCustomerName={chatTarget.name}
        />
      )}
    </div>
  );
};
