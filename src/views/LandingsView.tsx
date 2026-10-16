import React, { useState } from 'react';
import { LandingPage, Merchant } from '../types';
import { Layers, Plus, Trash2, X, ExternalLink } from 'lucide-react';

interface LandingsViewProps {
  landings: LandingPage[];
  merchants: Merchant[];
  onSaveLanding: (landing: LandingPage) => void;
  onDeleteLanding: (landingId: number) => void;
}

export const LandingsView: React.FC<LandingsViewProps> = ({
  landings,
  merchants,
  onSaveLanding,
  onDeleteLanding,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [merchantId, setMerchantId] = useState<number | ''>('');
  const [offer, setOffer] = useState('');
  const [status, setStatus] = useState<'Draft' | 'Published' | 'Inactive'>('Published');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) {
      alert('টাইটেল ও URL Slug আবশ্যক।');
      return;
    }

    const cleanSlug = slug
      .trim()
      .toLowerCase()
      .replace(/^\/+|\/+$/g, '')
      .replace(/\s+/g, '-');

    const newLanding: LandingPage = {
      id: Date.now(),
      name: name.trim(),
      slug: cleanSlug,
      merchantId: merchantId === '' ? null : Number(merchantId),
      offer: offer.trim(),
      status,
    };

    onSaveLanding(newLanding);
    setName('');
    setSlug('');
    setMerchantId('');
    setOffer('');
    setStatus('Published');
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Top action */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white">ল্যান্ডিং পেজ ও ক্যাম্পেইন ম্যানেজার</h2>
          <p className="text-xs text-[#a69ab1]">অফার পেজ ও বিজ্ঞাপনের ডেডিকেটেড সেলস ফানেল লিংক</p>
        </div>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#bd70df] text-[#160e1b] hover:bg-[#d091ee] transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন ল্যান্ডিং পেজ যোগ করুন</span>
        </button>
      </div>

      {/* Form Card */}
      {isFormOpen && (
        <div className="p-5 rounded-2xl bg-[#1b1524] border border-[#714786] shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#342b40]">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#bd70df]" />
              <span>ল্যান্ডিং পেজের তথ্য</span>
            </h3>
            <button
              onClick={() => setIsFormOpen(false)}
              className="p-1 rounded-lg text-[#a69ab1] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-xs font-medium text-[#cfc4d9] mb-1.5">পেজ টাইটেল *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Eid Special Three Piece Offer"
                className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-xs sm:text-sm text-white focus:border-[#bd70df] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#cfc4d9] mb-1.5">URL Slug *</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="eid-special-offer"
                className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-xs sm:text-sm text-white focus:border-[#bd70df] outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#cfc4d9] mb-1.5">মার্চেন্ট</label>
              <select
                value={merchantId}
                onChange={(e) => setMerchantId(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-xs sm:text-sm text-white focus:border-[#bd70df] outline-none cursor-pointer"
              >
                <option value="">কোনো নির্দিষ্ট মার্চেন্ট নেই</option>
                {merchants.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#cfc4d9] mb-1.5">ক্যাম্পেইন অফার</label>
              <input
                type="text"
                value={offer}
                onChange={(e) => setOffer(e.target.value)}
                placeholder="Flat 15% Off"
                className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-xs sm:text-sm text-white focus:border-[#bd70df] outline-none"
              />
            </div>

            <div className="col-span-full flex items-center gap-2 pt-2 border-t border-[#342b40]">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#bd70df] text-[#160e1b] hover:bg-[#d091ee] transition-colors"
              >
                সেভ করুন (Save Landing Page)
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

      {/* Landings Table */}
      <div className="rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#14101c] border-b border-[#342b40] text-[#a69ab1]">
                <th className="py-3 px-3 font-semibold">Title</th>
                <th className="py-3 px-3 font-semibold">Slug URL</th>
                <th className="py-3 px-3 font-semibold">মার্চেন্ট (Merchant)</th>
                <th className="py-3 px-3 font-semibold">ক্যাম্পেইন অফার</th>
                <th className="py-3 px-3 font-semibold">স্ট্যাটাস</th>
                <th className="py-3 px-3 font-semibold text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#282033]">
              {landings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#a69ab1]">
                    কোনো ল্যান্ডিং পেজ নেই। "+ নতুন ল্যান্ডিং পেজ" বাটনে ক্লিক করুন।
                  </td>
                </tr>
              ) : (
                landings.map((l) => {
                  const merchant = merchants.find((m) => m.id === l.merchantId);
                  return (
                    <tr key={l.id} className="hover:bg-[#201927] transition-colors">
                      <td className="py-3 px-3 font-semibold text-white">{l.name}</td>
                      <td className="py-3 px-3">
                        <span className="font-mono text-[#bd70df]">/{l.slug}</span>
                      </td>
                      <td className="py-3 px-3 text-[#f7f2fb]">{merchant ? merchant.name : '—'}</td>
                      <td className="py-3 px-3 text-[#a69ab1]">{l.offer || '—'}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                            l.status === 'Published'
                              ? 'bg-[#16382d] text-[#8de8bf]'
                              : 'bg-[#2b1f36] text-[#bd70df]'
                          }`}
                        >
                          {l.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => {
                            if (confirm(`ল্যান্ডিং পেজ "${l.name}" মুছে ফেলবেন?`)) {
                              onDeleteLanding(l.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-[#a69ab1] hover:text-[#ff6b83] hover:bg-[#351822] transition-colors"
                          title="Delete Landing Page"
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
