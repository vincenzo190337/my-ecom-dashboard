import React, { useState } from 'react';
import { SystemConfig } from '../types';
import { Truck, Phone, MapPin, Save, Check, Building2, Navigation } from 'lucide-react';

interface DeliverySettingsViewProps {
  config: SystemConfig;
  onSaveConfig: (updated: SystemConfig) => void;
}

export const DeliverySettingsView: React.FC<DeliverySettingsViewProps> = ({
  config,
  onSaveConfig,
}) => {
  const [dhakaFee, setDhakaFee] = useState<number>(config.dhakaFee || 80);
  const [outsideFee, setOutsideFee] = useState<number>(config.outsideFee || 150);
  const [subDhakaFee, setSubDhakaFee] = useState<number>(config.subDhakaFee || 100);
  const [whatsapp, setWhatsapp] = useState<string>(config.whatsapp || '01956591199');
  const [storeName, setStoreName] = useState<string>(config.storeName || "ALVINA Women's Collection");
  const [storeAddress, setStoreAddress] = useState<string>(
    config.storeAddress || 'Mohammadpur, Adabor, Dhaka-1207'
  );
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig({
      ...config,
      dhakaFee: Math.max(0, dhakaFee),
      outsideFee: Math.max(0, outsideFee),
      subDhakaFee: Math.max(0, subDhakaFee),
      whatsapp: whatsapp.trim() || '01956591199',
      storeName: storeName.trim(),
      storeAddress: storeAddress.trim() || 'Mohammadpur, Adabor, Dhaka-1207',
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="p-6 rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm">
        <div className="pb-4 mb-5 border-b border-[#342b40] flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#bd70df]" />
              <span>ডেলিভারি ও শিপিং ফি সেটিংস (Delivery & Shipping Fee)</span>
            </h2>
            <p className="text-xs text-[#a69ab1]">
              ঢাকা সিটি, সাব ঢাকা (সাভার/কেরানীগঞ্জ/নারায়ণগঞ্জ) ও ঢাকার বাইরে শিপিং চার্জ এবং হেড অফিস ইনভয়েস ঠিকানা
            </p>
          </div>
          {isSaved && (
            <span className="px-3 py-1 rounded-lg bg-[#16382d] text-[#8de8bf] font-bold text-xs flex items-center gap-1">
              <Check className="w-4 h-4" />
              <span>সেভ হয়েছে!</span>
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {/* 3 Delivery Fee Rates as requested: Dhaka Inside, Sub Dhaka, Dhaka Outside */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#120e18] border border-[#3b2f4a] space-y-2">
              <label className="block font-bold text-[#cfc4d9]">
                ঢাকার ভিতরে ডেলিভারি চার্জ (৳) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  required
                  value={dhakaFee}
                  onChange={(e) => setDhakaFee(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#181422] border border-[#40344c] rounded-xl text-sm font-bold text-white focus:border-[#bd70df] outline-none font-mono"
                />
              </div>
              <span className="text-[11px] text-[#a69ab1] block">ঢাকা মেট্রোপলিটন এলাকা (যেমন: ৳৮০)</span>
            </div>

            <div className="p-4 rounded-xl bg-[#120e18] border border-[#6b253e] space-y-2">
              <label className="block font-bold text-[#fca5a5] flex items-center gap-1">
                <Navigation className="w-3.5 h-3.5 text-[#ec4899]" />
                <span>সাব ঢাকা ডেলিভারি চার্জ (৳) *</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  required
                  value={subDhakaFee}
                  onChange={(e) => setSubDhakaFee(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#181422] border border-[#6b253e] rounded-xl text-sm font-bold text-white focus:border-[#ec4899] outline-none font-mono"
                />
              </div>
              <span className="text-[11px] text-[#a69ab1] block">
                সাভার, কেরানীগঞ্জ, টঙ্গী, গাজীপুর, নারায়ণগঞ্জ (যেমন: ৳১০০)
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#120e18] border border-[#3b2f4a] space-y-2">
              <label className="block font-bold text-[#cfc4d9]">
                ঢাকার বাইরে ডেলিভারি চার্জ (৳) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  required
                  value={outsideFee}
                  onChange={(e) => setOutsideFee(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#181422] border border-[#40344c] rounded-xl text-sm font-bold text-white focus:border-[#bd70df] outline-none font-mono"
                />
              </div>
              <span className="text-[11px] text-[#a69ab1] block">সারাদেশের সকল জেলা ও উপজেলা (যেমন: ৳১৫০)</span>
            </div>
          </div>

          {/* Head Office Invoice Address as requested: "Mohammadpur, Adabor, Dhaka-1207" */}
          <div className="p-4 rounded-xl bg-[#140f1d] border border-[#523368] space-y-2">
            <label className="block font-bold text-[#e6b4fa] flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-[#bd70df]" />
              <span>হেড অফিস ইনভয়েস ঠিকানা (Head Office Invoice Address) *</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-[#bd70df] absolute left-3 top-3" />
              <textarea
                rows={2}
                required
                value={storeAddress}
                onChange={(e) => setStoreAddress(e.target.value)}
                placeholder="Mohammadpur, Adabor, Dhaka-1207"
                className="w-full pl-9 pr-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-xs sm:text-sm text-white focus:border-[#bd70df] outline-none font-medium leading-relaxed resize-none"
              />
            </div>
            <span className="text-[11px] text-[#a69ab1]">
              ইনভয়েস চালান, মেমো ও পার্সেল স্টিকারে প্রেরক ঠিকানা হিসেবে এটি প্রিন্ট হবে (মোহাম্মদপুর, আদাবর ১২০৭)।
            </span>
          </div>

          {/* Store Name & Official WhatsApp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#cfc4d9] mb-1.5">
                স্টোর / বুটিক ব্র্যান্ডের নাম
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="ALVINA Women's Collection"
                className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-xs sm:text-sm text-white focus:border-[#bd70df] outline-none font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#cfc4d9] mb-1.5">
                অফিসিয়াল WhatsApp ও হেল্পলাইন নম্বর *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#bd70df] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="01956591199"
                  className="w-full pl-9 pr-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-xs sm:text-sm text-white focus:border-[#bd70df] outline-none font-mono"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#bd70df] text-[#160e1b] hover:bg-[#d091ee] transition-all shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>ডেলিভারি সেটিংস সংরক্ষণ করুন</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
