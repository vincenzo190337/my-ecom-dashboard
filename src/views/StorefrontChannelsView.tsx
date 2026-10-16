import React, { useState, useEffect } from 'react';
import { WholesaleBuyer, TrackingPixel, SystemConfig } from '../types';
import { Briefcase, Target, Palette, Plus, X, Globe, Save } from 'lucide-react';

interface StorefrontChannelsViewProps {
  wholesaleBuyers: WholesaleBuyer[];
  pixels: TrackingPixel[];
  config: SystemConfig;
  onSaveWholesale: (wb: WholesaleBuyer) => void;
  onSavePixel: (tp: TrackingPixel) => void;
  onSaveConfig: (cfg: SystemConfig) => void;
  initialTab?: 'wholesale' | 'pixels' | 'theme';
}

export const StorefrontChannelsView: React.FC<StorefrontChannelsViewProps> = ({
  wholesaleBuyers,
  pixels,
  config,
  onSaveWholesale,
  onSavePixel,
  onSaveConfig,
  initialTab = 'wholesale',
}) => {
  const [tab, setTab] = useState(initialTab);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  // Wholesale form
  const [isWholesaleModal, setIsWholesaleModal] = useState(false);
  const [bizName, setBizName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('Chittagong');
  const [creditLimit, setCreditLimit] = useState<number>(100000);
  const [tierDiscount, setTierDiscount] = useState<number>(20);

  // Theme settings
  const [currency, setCurrency] = useState(config.currencySymbol || '৳');
  const [themeMode, setThemeMode] = useState<'dark' | 'plum' | 'midnight'>('dark');

  const handleWholesaleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bizName.trim() || !phone.trim()) return;
    const wb: WholesaleBuyer = {
      id: Date.now(),
      businessName: bizName.trim(),
      contactPerson: contactName.trim() || 'Owner',
      phone: phone.trim(),
      district,
      creditLimit,
      outstandingDue: 0,
      tierDiscount,
      status: 'Approved',
    };
    onSaveWholesale(wb);
    setIsWholesaleModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            {tab === 'wholesale' && <Briefcase className="w-5 h-5 text-[#bd70df]" />}
            {tab === 'pixels' && <Target className="w-5 h-5 text-[#bd70df]" />}
            {tab === 'theme' && <Palette className="w-5 h-5 text-[#bd70df]" />}
            <span>
              {tab === 'wholesale' && 'পাইকারি ও বিটুবি পোর্টাল (B2B / Wholesale Portal)'}
              {tab === 'pixels' && 'পিক্সেল ও কনভার্সন ট্র্যাকিং (Pixel & Conversion Tracking)'}
              {tab === 'theme' && 'থিম ও মাল্টি-কারেন্সি (Theme & Multi-Currency)'}
            </span>
          </h2>
          <p className="text-xs text-[#a69ab1]">
            পাইকারি ক্রেতাদের ক্রেডিট লিমিট, মেটা পিক্সেল ইভেন্টস এবং আন্তর্জাতিক কারেন্সি সাপোর্ট
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-[#100d16] p-1 rounded-xl border border-[#342b40]">
            <button
              onClick={() => setTab('wholesale')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                tab === 'wholesale' ? 'bg-[#bd70df] text-[#160e1b]' : 'text-[#bcb1c7]'
              }`}
            >
              Wholesale B2B
            </button>
            <button
              onClick={() => setTab('pixels')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                tab === 'pixels' ? 'bg-[#bd70df] text-[#160e1b]' : 'text-[#bcb1c7]'
              }`}
            >
              Pixels ({pixels.length})
            </button>
            <button
              onClick={() => setTab('theme')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                tab === 'theme' ? 'bg-[#bd70df] text-[#160e1b]' : 'text-[#bcb1c7]'
              }`}
            >
              Theme & Currency
            </button>
          </div>

          {tab === 'wholesale' && (
            <button
              onClick={() => setIsWholesaleModal(!isWholesaleModal)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#bd70df] text-[#160e1b] hover:bg-[#d091ee]"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন পাইকারি বায়ার</span>
            </button>
          )}
        </div>
      </div>

      {/* Modal */}
      {isWholesaleModal && (
        <div className="p-5 rounded-2xl bg-[#1b1524] border border-[#714786] shadow-xl space-y-3 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#342b40]">
            <h3 className="font-bold text-white text-sm">নতুন পাইকারি বুটিক ক্রেতা যুক্ত করুন</h3>
            <button onClick={() => setIsWholesaleModal(false)} className="text-[#a69ab1]">
              <X className="w-4 h-4" />
            </button>
          </div>
          <form onSubmit={handleWholesaleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[#cfc4d9] mb-1">দোকানের নাম / শোরুম *</label>
              <input
                required
                value={bizName}
                onChange={(e) => setBizName(e.target.value)}
                placeholder="Rongon Boutique"
                className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-[#cfc4d9] mb-1">মালিকের নাম</label>
              <input
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Contact Person"
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
            <div>
              <label className="block text-[#cfc4d9] mb-1">জেলা / জেলা সদর</label>
              <input
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-[#cfc4d9] mb-1">ক্রেডিট লিমিট (৳)</label>
              <input
                type="number"
                min={0}
                value={creditLimit}
                onChange={(e) => setCreditLimit(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-[#cfc4d9] mb-1">হোলসেল ডিসকাউন্ট %</label>
              <input
                type="number"
                min={5}
                max={50}
                value={tierDiscount}
                onChange={(e) => setTierDiscount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white outline-none font-mono"
              />
            </div>
            <div className="col-span-full pt-1">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#bd70df] text-[#160e1b] hover:bg-[#d091ee]"
              >
                বায়ার অনুমোদন ও সেভ
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 1. WHOLESALE TAB */}
      {tab === 'wholesale' && (
        <div className="rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#14101c] border-b border-[#342b40] text-[#a69ab1]">
                  <th className="py-2.5 px-3">Business Name</th>
                  <th className="py-2.5 px-3">Contact & Phone</th>
                  <th className="py-2.5 px-3">District</th>
                  <th className="py-2.5 px-3">Credit Limit</th>
                  <th className="py-2.5 px-3">Outstanding Due</th>
                  <th className="py-2.5 px-3">Wholesale Tier Discount</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#282033]">
                {wholesaleBuyers.map((wb) => (
                  <tr key={wb.id} className="hover:bg-[#201927]">
                    <td className="py-3 px-3 font-semibold text-white">{wb.businessName}</td>
                    <td className="py-3 px-3 text-[#f7dcff]">
                      <div>{wb.contactPerson}</div>
                      <div className="text-[11px] font-mono text-[#a69ab1]">{wb.phone}</div>
                    </td>
                    <td className="py-3 px-3 text-[#d7cddd]">{wb.district}</td>
                    <td className="py-3 px-3 font-mono text-white tabular-nums">
                      ৳{wb.creditLimit.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-[#ff9aaa] tabular-nums">
                      {wb.outstandingDue > 0 ? `৳${wb.outstandingDue.toLocaleString()}` : 'No Due'}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-[#bd70df] tabular-nums">
                      Flat {wb.tierDiscount}%
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#16382d] text-[#8de8bf]">
                        {wb.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. PIXELS TAB */}
      {tab === 'pixels' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pixels.map((px) => (
            <div key={px.id} className="p-5 rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white text-sm">{px.platform}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#16382d] text-[#8de8bf]">
                  {px.status}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-[#a69ab1]">Pixel ID / Measurement ID:</span>
                <div className="font-mono text-xs font-bold text-[#bd70df] mt-0.5">{px.pixelId}</div>
              </div>
              <div className="pt-2 border-t border-[#342b40]">
                <span className="text-[11px] text-[#cfc4d9] block mb-1">Active Events:</span>
                <div className="flex flex-wrap gap-1">
                  {px.eventTracking.map((ev, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-[#271b35] text-[#e6b4fa] text-[10px]">
                      {ev}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. THEME & CURRENCY TAB */}
      {tab === 'theme' && (
        <div className="p-6 rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm space-y-5 max-w-xl">
          <h3 className="font-bold text-white text-base pb-3 border-b border-[#342b40]">
            কারেন্সি ও থিম কনফিগারেশন
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-[#cfc4d9] mb-1.5 font-medium">প্রধান কারেন্সি প্রতীক (Currency Symbol)</label>
              <div className="grid grid-cols-3 gap-2">
                {['৳ (BDT)', '$ (USD)', '£ (GBP)'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      const sym = c.charAt(0);
                      setCurrency(sym);
                      onSaveConfig({ ...config, currencySymbol: sym });
                    }}
                    className={`py-2 px-3 rounded-xl font-bold border transition-colors ${
                      currency === c.charAt(0)
                        ? 'bg-[#bd70df] text-[#160e1b] border-[#bd70df]'
                        : 'bg-[#100d16] text-white border-[#342b40]'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[#cfc4d9] mb-1.5 font-medium">থিম স্টাইল (Admin Theme)</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'dark', label: 'Dark Twilight (Default)' },
                  { id: 'plum', label: 'Deep Royal Plum' },
                  { id: 'midnight', label: 'Midnight Obsidian' },
                ].map((th) => (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => setThemeMode(th.id as any)}
                    className={`p-2.5 rounded-xl border text-center transition-colors ${
                      themeMode === th.id
                        ? 'bg-[#35203f] border-[#bd70df] text-white font-bold'
                        : 'bg-[#100d16] border-[#342b40] text-[#a69ab1]'
                    }`}
                  >
                    {th.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <span className="text-[11px] text-[#36c98b]">✓ সেটিংস স্বয়ংক্রিয়ভাবে ব্রাউজারে সংরক্ষিত হয়েছে</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
