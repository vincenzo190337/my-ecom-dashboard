import React, { useState } from 'react';
import { CodSettlement } from '../types';
import { CircleDollarSign, Plus, Check, Clock, AlertCircle, X, Download } from 'lucide-react';

interface CodSettlementViewProps {
  settlements: CodSettlement[];
  onSaveSettlement: (st: CodSettlement) => void;
}

export const CodSettlementView: React.FC<CodSettlementViewProps> = ({
  settlements,
  onSaveSettlement,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courierName, setCourierName] = useState('Steadfast Courier');
  const [consignmentCount, setConsignmentCount] = useState<number>(10);
  const [totalCodDue, setTotalCodDue] = useState<number>(32000);
  const [totalReceived, setTotalReceived] = useState<number>(32000);
  const [referenceId, setReferenceId] = useState('ST-DISB-' + Date.now().toString().slice(-5));

  const totalDueAll = settlements.reduce((s, c) => s + c.totalCodDue, 0);
  const totalReceivedAll = settlements.reduce((s, c) => s + c.totalReceived, 0);
  const pendingDueAll = settlements.reduce((s, c) => s + c.pendingCod, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pending = Math.max(0, totalCodDue - totalReceived);
    const item: CodSettlement = {
      id: Date.now(),
      courierName,
      consignmentCount,
      totalCodDue,
      totalReceived,
      pendingCod: pending,
      settlementDate: new Date().toISOString().slice(0, 10),
      referenceId: referenceId.trim(),
      status: pending === 0 ? 'Full Settled' : totalReceived > 0 ? 'Partial' : 'Pending',
    };
    onSaveSettlement(item);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 sm:p-5 rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <CircleDollarSign className="w-5 h-5 text-[#bd70df]" />
            <span>কুরিয়ার সিওডি সেটেলমেন্ট ট্র্যাকার (COD Settlement)</span>
          </h2>
          <p className="text-xs text-[#a69ab1]">
            Steadfast, Pathao ও RedX কুরিয়ার থেকে গ্রাহকের সংগৃহীত ক্যাশ টাকা পাওয়ার পূর্ণ খতিয়ান
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(!isModalOpen)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#bd70df] text-[#160e1b] hover:bg-[#d091ee] transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন সেটেলমেন্ট এন্ট্রি</span>
        </button>
      </div>

      {/* 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm">
          <span className="text-xs text-[#a69ab1]">মোট কুরিয়ার পার্সেল পাওনা (Total COD)</span>
          <div className="text-2xl font-bold text-white font-mono mt-1 tabular-nums">
            ৳ {totalDueAll.toLocaleString()}
          </div>
          <span className="text-[11px] text-[#bd70df] mt-1 block">বুকিং করা পার্সেলগুলোর মূল্য</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm">
          <span className="text-xs text-[#a69ab1]">ব্যাংকে রিসিভড টাকা (Disbursed)</span>
          <div className="text-2xl font-bold text-[#36c98b] font-mono mt-1 tabular-nums">
            ৳ {totalReceivedAll.toLocaleString()}
          </div>
          <span className="text-[11px] text-[#8de8bf] mt-1 block">কুরিয়ার থেকে সফলভাবে হস্তান্তরিত</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm">
          <span className="text-xs text-[#a69ab1]">বকেয়া পাওনা টাকা (Pending COD)</span>
          <div className="text-2xl font-bold text-[#ff6b83] font-mono mt-1 tabular-nums">
            ৳ {pendingDueAll.toLocaleString()}
          </div>
          <span className="text-[11px] text-[#ff9aaa] mt-1 block">কুরিয়ারে বর্তমানে আটকে থাকা ব্যালেন্স</span>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="p-5 rounded-2xl bg-[#1b1524] border border-[#714786] shadow-xl space-y-3 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#342b40]">
            <h3 className="font-bold text-white text-sm">কুরিয়ার পেমেন্ট সেটেলমেন্ট রেকর্ড</h3>
            <button onClick={() => setIsModalOpen(false)} className="text-[#a69ab1]">
              <X className="w-4 h-4" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[#cfc4d9] mb-1">কুরিয়ার সার্ভিস</label>
              <select
                value={courierName}
                onChange={(e) => setCourierName(e.target.value)}
                className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white outline-none"
              >
                <option>Steadfast Courier</option>
                <option>Pathao Courier</option>
                <option>RedX Logistics</option>
                <option>eCourier BD</option>
                <option>Paperfly Delivery</option>
              </select>
            </div>
            <div>
              <label className="block text-[#cfc4d9] mb-1">পার্সেল সংখ্যা (Consignments)</label>
              <input
                type="number"
                min={1}
                required
                value={consignmentCount}
                onChange={(e) => setConsignmentCount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-[#cfc4d9] mb-1">মোট COD মূল্য (৳) *</label>
              <input
                type="number"
                min={0}
                required
                value={totalCodDue}
                onChange={(e) => setTotalCodDue(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-[#cfc4d9] mb-1">ব্যাংকে প্রাপ্ত টাকা (৳) *</label>
              <input
                type="number"
                min={0}
                required
                value={totalReceived}
                onChange={(e) => setTotalReceived(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-[#cfc4d9] mb-1">রেফারেন্স / ইনভয়েস আইডি</label>
              <input
                value={referenceId}
                onChange={(e) => setReferenceId(e.target.value)}
                className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white outline-none font-mono"
              />
            </div>
            <div className="col-span-full pt-1">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#bd70df] text-[#160e1b] hover:bg-[#d091ee]"
              >
                সেটেলমেন্ট রেকর্ড সেভ করুন
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Settlements Table */}
      <div className="rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#14101c] border-b border-[#342b40] text-[#a69ab1]">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Courier Name</th>
                <th className="py-2.5 px-3">Reference ID</th>
                <th className="py-2.5 px-3">Parcels</th>
                <th className="py-2.5 px-3">Total COD Due</th>
                <th className="py-2.5 px-3">Received Amount</th>
                <th className="py-2.5 px-3">Pending COD</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#282033]">
              {settlements.map((s) => (
                <tr key={s.id} className="hover:bg-[#201927]">
                  <td className="py-3 px-3 font-mono text-[#a69ab1]">{s.settlementDate}</td>
                  <td className="py-3 px-3 font-semibold text-white">{s.courierName}</td>
                  <td className="py-3 px-3 font-mono text-[#e6b4fa]">{s.referenceId}</td>
                  <td className="py-3 px-3 font-mono text-[#d7cddd]">{s.consignmentCount} pcs</td>
                  <td className="py-3 px-3 font-mono tabular-nums text-white">৳{s.totalCodDue}</td>
                  <td className="py-3 px-3 font-mono font-bold text-[#36c98b] tabular-nums">
                    ৳{s.totalReceived}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-[#ff9aaa] tabular-nums">
                    ৳{s.pendingCod}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                        s.status === 'Full Settled'
                          ? 'bg-[#16382d] text-[#8de8bf]'
                          : s.status === 'Partial'
                          ? 'bg-[#2b2518] text-[#fcd34d]'
                          : 'bg-[#44202a] text-[#ff9aaa]'
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
