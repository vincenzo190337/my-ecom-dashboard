import React, { useState } from 'react';
import { Website, Merchant } from '../types';
import { Globe, Plus, Trash2, ExternalLink, X } from 'lucide-react';

interface WebsitesViewProps {
  websites: Website[];
  merchants: Merchant[];
  onSaveWebsite: (website: Website) => void;
  onDeleteWebsite: (websiteId: number) => void;
}

export const WebsitesView: React.FC<WebsitesViewProps> = ({
  websites,
  merchants,
  onSaveWebsite,
  onDeleteWebsite,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [merchantId, setMerchantId] = useState<number | ''>('');
  const [status, setStatus] = useState<'Active' | 'Draft' | 'Inactive'>('Active');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) {
      alert('ওয়েবসাইটের নাম ও URL আবশ্যক।');
      return;
    }

    const newSite: Website = {
      id: Date.now(),
      name: name.trim(),
      url: url.trim(),
      merchantId: merchantId === '' ? null : Number(merchantId),
      status,
    };

    onSaveWebsite(newSite);
    setName('');
    setUrl('');
    setMerchantId('');
    setStatus('Active');
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Top action */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white">ওয়েবসাইট পোর্টাল তালিকা</h2>
          <p className="text-xs text-[#a69ab1]">মার্চেন্টদের সাথে যুক্ত ই-কমার্স ডোমেইন ও স্টোরফ্রন্ট</p>
        </div>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#bd70df] text-[#160e1b] hover:bg-[#d091ee] transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন ওয়েবসাইট যোগ করুন</span>
        </button>
      </div>

      {/* Form Card */}
      {isFormOpen && (
        <div className="p-5 rounded-2xl bg-[#1b1524] border border-[#714786] shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#342b40]">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#bd70df]" />
              <span>ওয়েবসাইটের তথ্য যোগ করুন</span>
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
              <label className="block text-xs font-medium text-[#cfc4d9] mb-1.5">ওয়েবসাইটের নাম *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ALVINA Main Store"
                className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-xs sm:text-sm text-white focus:border-[#bd70df] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#cfc4d9] mb-1.5">ওয়েবসাইট URL *</label>
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://alvinawomen.com"
                className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-xs sm:text-sm text-white focus:border-[#bd70df] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#cfc4d9] mb-1.5">মার্চেন্ট</label>
              <select
                value={merchantId}
                onChange={(e) => setMerchantId(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-xs sm:text-sm text-white focus:border-[#bd70df] outline-none cursor-pointer"
              >
                <option value="">কোনো মার্চেন্ট নেই</option>
                {merchants.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#cfc4d9] mb-1.5">স্ট্যাটাস</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-xs sm:text-sm text-white focus:border-[#bd70df] outline-none cursor-pointer"
              >
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="col-span-full flex items-center gap-2 pt-2 border-t border-[#342b40]">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#bd70df] text-[#160e1b] hover:bg-[#d091ee] transition-colors"
              >
                সেভ করুন (Save Website)
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

      {/* Websites Table */}
      <div className="rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#14101c] border-b border-[#342b40] text-[#a69ab1]">
                <th className="py-3 px-3 font-semibold">Website Name</th>
                <th className="py-3 px-3 font-semibold">URL Link</th>
                <th className="py-3 px-3 font-semibold">মার্চেন্ট (Merchant)</th>
                <th className="py-3 px-3 font-semibold">স্ট্যাটাস</th>
                <th className="py-3 px-3 font-semibold text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#282033]">
              {websites.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#a69ab1]">
                    কোনো ওয়েবসাইট নেই। উপরে বাটনে ক্লিক করে যোগ করুন।
                  </td>
                </tr>
              ) : (
                websites.map((w) => {
                  const merchant = merchants.find((m) => m.id === w.merchantId);
                  return (
                    <tr key={w.id} className="hover:bg-[#201927] transition-colors">
                      <td className="py-3 px-3 font-semibold text-white">{w.name}</td>
                      <td className="py-3 px-3">
                        <a
                          href={w.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#bd70df] hover:underline inline-flex items-center gap-1 font-mono"
                        >
                          <span>{w.url}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                      <td className="py-3 px-3 text-[#f7f2fb]">{merchant ? merchant.name : '—'}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                            w.status === 'Active'
                              ? 'bg-[#16382d] text-[#8de8bf]'
                              : 'bg-[#2b1f36] text-[#bd70df]'
                          }`}
                        >
                          {w.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => {
                            if (confirm(`ওয়েবসাইট "${w.name}" মুছে ফেলবেন?`)) {
                              onDeleteWebsite(w.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-[#a69ab1] hover:text-[#ff6b83] hover:bg-[#351822] transition-colors"
                          title="Delete Website"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
