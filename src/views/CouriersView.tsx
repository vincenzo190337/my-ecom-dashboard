import React, { useState } from 'react';
import { CourierService } from '../types';
import { Truck, Plus, Edit2, Trash2, X, Key, ShieldCheck, Globe, Lock } from 'lucide-react';

interface CouriersViewProps {
  couriers: CourierService[];
  userRole?: string;
  onSaveCourier: (courier: CourierService) => void;
  onDeleteCourier: (courierId: number) => void;
}

export const CouriersView: React.FC<CouriersViewProps> = ({
  couriers,
  userRole = 'Admin',
  onSaveCourier,
  onDeleteCourier,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form Fields as requested
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [storeId, setStoreId] = useState('');
  const [clientId, setClientId] = useState('');
  const [token, setToken] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [extraParams, setExtraParams] = useState('');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');

  const canSuperEdit = userRole === 'Admin' || userRole === 'Merchant';

  const openAdd = () => {
    setEditingId(null);
    setName('');
    setContact('');
    setApiKey('');
    setStoreId('');
    setClientId('');
    setToken('');
    setBaseUrl('https://portal.steadfast.com.bd/api/v1');
    setExtraParams('');
    setStatus('Active');
    setIsFormOpen(true);
  };

  const openEdit = (c: CourierService) => {
    setEditingId(c.id);
    setName(c.name);
    setContact(c.contact);
    setApiKey(c.apiKey || '');
    setStoreId(c.storeId || '');
    setClientId(c.clientId || '');
    setToken(c.token || '');
    setBaseUrl(c.baseUrl || '');
    setExtraParams(c.extraParams || '');
    setStatus(c.status);
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('কুরিয়ার সার্ভিসের নাম আবশ্যক।');
      return;
    }

    const courierData: CourierService = {
      id: editingId ? editingId : Date.now(),
      name: name.trim(),
      contact: contact.trim(),
      apiKey: apiKey.trim() || undefined,
      storeId: storeId.trim() || undefined,
      clientId: clientId.trim() || undefined,
      token: token.trim() || undefined,
      baseUrl: baseUrl.trim() || undefined,
      extraParams: extraParams.trim() || undefined,
      status,
    };

    onSaveCourier(courierData);
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#bd70df]" />
            <span>কুরিয়ার সার্ভিস ম্যানেজমেন্ট ও এপিআই (Courier Service API)</span>
          </h2>
          <p className="text-xs text-[#a69ab1]">
            Steadfast, Pathao, RedX সহ সকল কুরিয়ার কোম্পানির API Key, Client ID, Secret ও টোকেন কনফিগারেশন
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#bd70df] text-[#160e1b] hover:bg-[#d091ee] transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন কুরিয়ার কোম্পানি যোগ করুন</span>
        </button>
      </div>

      {/* Couriers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {couriers.map((c) => (
          <div
            key={c.id}
            className="p-5 rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#271b35] text-[#bd70df] flex items-center justify-center font-bold">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">{c.name}</h3>
                  <span className="text-[11px] text-[#a69ab1] font-mono">{c.contact || 'হটলাইন নেই'}</span>
                </div>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                  c.status === 'Active' ? 'bg-[#16382d] text-[#8de8bf]' : 'bg-[#3b232a] text-[#ff809b]'
                }`}
              >
                {c.status}
              </span>
            </div>

            {/* API Credentials Details */}
            <div className="p-3 rounded-xl bg-[#110e17] border border-[#2e2438] space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-[#a69ab1]">
                <span>Base URL:</span>
                <span className="text-white truncate max-w-[200px]">{c.baseUrl || 'https://...'}</span>
              </div>
              <div className="flex justify-between text-[#a69ab1]">
                <span>API Key / Secret:</span>
                <span className="text-[#e6b4fa]">{c.apiKey ? '••••••••' + c.apiKey.slice(-4) : 'সেট করা নেই'}</span>
              </div>
              <div className="flex justify-between text-[#a69ab1]">
                <span>Store ID / Secret:</span>
                <span className="text-white">{c.storeId || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-[#a69ab1]">
                <span>Client ID / Username:</span>
                <span className="text-white">{c.clientId || 'N/A'}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#2e2438]">
              {canSuperEdit && (
                <button
                  onClick={() => openEdit(c)}
                  className="px-3 py-1.5 rounded-lg bg-[#271b35] text-[#e6b4fa] hover:bg-[#bd70df] hover:text-[#160e1b] font-semibold text-xs flex items-center gap-1 transition-all"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>সুপার এডিট</span>
                </button>
              )}
              <button
                onClick={() => onDeleteCourier(c.id)}
                className="p-1.5 rounded-lg text-[#ff6b83] hover:bg-[#351822] transition-colors"
                title="মুছে ফেলুন"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Adding/Super Editing Courier API */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xl p-5 rounded-2xl bg-[#1b1524] border border-[#714786] shadow-2xl space-y-4 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#342b40]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#bd70df]" />
                <span>{editingId ? 'সুপার এডিট: কুরিয়ার সার্ভিস এপিআই' : 'নতুন কুরিয়ার কোম্পানি যোগ'}</span>
              </h3>
              <button onClick={() => setIsFormOpen(false)} className="text-[#a69ab1] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#cfc4d9] mb-1 font-medium">কুরিয়ার সার্ভিসের নাম *</label>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Steadfast Courier"
                    className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#cfc4d9] mb-1 font-medium">হেল্পলাইন / ফোন</label>
                  <input
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="09612XXXXXX"
                    className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white font-mono outline-none"
                  />
                </div>
              </div>

              {/* Exact fields requested by User */}
              <div className="p-3.5 rounded-xl bg-[#120e18] border border-[#342b40] space-y-2.5">
                <div className="font-bold text-[#e6b4fa] flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-[#bd70df]" />
                  <span>কুরিয়ার এপিআই ক্রেডেনশিয়ালস (Courier API Credentials):</span>
                </div>

                <div>
                  <label className="block text-[#a69ab1] mb-1">Base URL / API URL</label>
                  <input
                    value={baseUrl}
                    onChange={(e) => setBaseUrl(e.target.value)}
                    placeholder="https://portal.steadfast.com.bd/api/v1"
                    className="w-full px-3 py-2 bg-[#181422] border border-[#40344c] rounded-xl text-white font-mono outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#a69ab1] mb-1">API Key / Secret Key *</label>
                    <input
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="e.g. sf_live_key_99218274..."
                      className="w-full px-3 py-2 bg-[#181422] border border-[#40344c] rounded-xl text-white font-mono outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[#a69ab1] mb-1">Store ID / Client Secret</label>
                    <input
                      value={storeId}
                      onChange={(e) => setStoreId(e.target.value)}
                      placeholder="e.g. store_alvina_01"
                      className="w-full px-3 py-2 bg-[#181422] border border-[#40344c] rounded-xl text-white font-mono outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#a69ab1] mb-1">Client ID / Username</label>
                    <input
                      value={clientId}
                      onChange={(e) => setClientId(e.target.value)}
                      placeholder="e.g. alvina_merchant_client"
                      className="w-full px-3 py-2 bg-[#181422] border border-[#40344c] rounded-xl text-white font-mono outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[#a69ab1] mb-1">Password / Token</label>
                    <input
                      type="password"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3 py-2 bg-[#181422] border border-[#40344c] rounded-xl text-white font-mono outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#a69ab1] mb-1">অতিরিক্ত সেটিংস / Extra Parameters</label>
                  <input
                    value={extraParams}
                    onChange={(e) => setExtraParams(e.target.value)}
                    placeholder="যেমন: webhook_callback_url, auto_assign_rider=true"
                    className="w-full px-3 py-2 bg-[#181422] border border-[#40344c] rounded-xl text-white font-mono outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#cfc4d9] mb-1">স্ট্যাটাস</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white outline-none"
                >
                  <option value="Active">সক্রিয় (Active)</option>
                  <option value="Inactive">নিষ্ক্রিয় (Inactive)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#342b40]">
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
                  {editingId ? 'আপডেট সেভ করুন' : 'কুরিয়ার যোগ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
