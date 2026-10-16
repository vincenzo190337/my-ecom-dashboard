import React, { useState, useEffect } from 'react';
import { StockAuditRecord, PriceChangeRecord, Product } from '../types';
import { ClipboardCheck, History, Plus, X, AlertCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StockAuditViewProps {
  products: Product[];
  audits: StockAuditRecord[];
  priceHistory: PriceChangeRecord[];
  onSaveAudit: (rec: StockAuditRecord) => void;
  onSavePriceChange: (rec: PriceChangeRecord) => void;
  initialTab?: 'stockAudit' | 'priceHistory';
}

export const StockAuditView: React.FC<StockAuditViewProps> = ({
  products,
  audits,
  priceHistory,
  onSaveAudit,
  onSavePriceChange,
  initialTab = 'stockAudit',
}) => {
  const [tab, setTab] = useState<'stockAudit' | 'priceHistory'>(initialTab);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);
  const [isAuditModal, setIsAuditModal] = useState(false);
  const [isPriceModal, setIsPriceModal] = useState(false);

  // Stock Audit Form State
  const [auditProdName, setAuditProdName] = useState(products[0]?.name || 'Luxury Organza Three Piece');
  const [physicalCount, setPhysicalCount] = useState<number>(24);
  const [auditNotes, setAuditNotes] = useState('');

  // Price Change Form State
  const [priceProdId, setPriceProdId] = useState<number>(products[0]?.id || 401);
  const [newPrice, setNewPrice] = useState<number>(3650);
  const [priceReason, setPriceReason] = useState('');

  const handleAuditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find((p) => p.name === auditProdName) || products[0];
    const diff = physicalCount - prod.stock;
    const rec: StockAuditRecord = {
      id: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      productName: auditProdName,
      systemStock: prod.stock,
      physicalStock: physicalCount,
      difference: diff,
      auditor: 'Mahfuz Alam (Audit Exec)',
      status: diff === 0 ? 'Balanced' : 'Discrepancy',
      notes: auditNotes.trim() || undefined,
    };
    onSaveAudit(rec);
    setIsAuditModal(false);
  };

  const handlePriceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find((p) => p.id === priceProdId) || products[0];
    const rec: PriceChangeRecord = {
      id: Date.now(),
      productId: prod.id,
      productName: prod.name,
      oldPrice: prod.price,
      newPrice,
      changeDate: new Date().toISOString().slice(0, 10),
      changedBy: 'Admin Manager',
      reason: priceReason.trim() || 'Seasonal pricing adjustment',
    };
    onSavePriceChange(rec);
    setIsPriceModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            {tab === 'stockAudit' ? (
              <ClipboardCheck className="w-5 h-5 text-[#bd70df]" />
            ) : (
              <History className="w-5 h-5 text-[#bd70df]" />
            )}
            <span>
              {tab === 'stockAudit'
                ? 'স্টক অডিট ও ইনভেন্টরি যাচাই (Stock Audit)'
                : 'মূল্য পরিবর্তনের ইতিহাস (Price Change History)'}
            </span>
          </h2>
          <p className="text-xs text-[#a69ab1]">
            শোরুম ও গুদামের ফিজিক্যাল স্টক বনাম সিস্টেম স্টক গরমিল এবং পণ্যের দামের পরিবর্তন লগ
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-[#100d16] p-1 rounded-xl border border-[#342b40]">
            <button
              onClick={() => setTab('stockAudit')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                tab === 'stockAudit'
                  ? 'bg-[#bd70df] text-[#160e1b]'
                  : 'text-[#bcb1c7] hover:text-white'
              }`}
            >
              Stock Audit
            </button>
            <button
              onClick={() => setTab('priceHistory')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                tab === 'priceHistory'
                  ? 'bg-[#bd70df] text-[#160e1b]'
                  : 'text-[#bcb1c7] hover:text-white'
              }`}
            >
              Price History
            </button>
          </div>

          {tab === 'stockAudit' ? (
            <button
              onClick={() => setIsAuditModal(!isAuditModal)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#bd70df] text-[#160e1b] hover:bg-[#d091ee]"
            >
              <Plus className="w-4 h-4" />
              <span>স্টক গণনা এন্ট্রি</span>
            </button>
          ) : (
            <button
              onClick={() => setIsPriceModal(!isPriceModal)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#bd70df] text-[#160e1b] hover:bg-[#d091ee]"
            >
              <Plus className="w-4 h-4" />
              <span>মূল্য আপডেট লগ</span>
            </button>
          )}
        </div>
      </div>

      {/* Audit Modal */}
      {isAuditModal && (
        <div className="p-5 rounded-2xl bg-[#1b1524] border border-[#714786] shadow-xl space-y-3 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#342b40]">
            <h3 className="font-bold text-white text-sm">ইনভেন্টরি ফিজিক্যাল কাউন্ট অডিট</h3>
            <button onClick={() => setIsAuditModal(false)} className="text-[#a69ab1]">
              <X className="w-4 h-4" />
            </button>
          </div>
          <form onSubmit={handleAuditSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[#cfc4d9] mb-1">পণ্য নির্বাচন</label>
              <select
                value={auditProdName}
                onChange={(e) => setAuditProdName(e.target.value)}
                className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white outline-none"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name} (সিস্টেম স্টক: {p.stock})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[#cfc4d9] mb-1">হাতে পাওয়া স্টক সংখ্যা (Physical Count)</label>
              <input
                type="number"
                min={0}
                required
                value={physicalCount}
                onChange={(e) => setPhysicalCount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-[#cfc4d9] mb-1">অডিট নোট / কারণ</label>
              <input
                value={auditNotes}
                onChange={(e) => setAuditNotes(e.target.value)}
                placeholder="যেমন: ডিসপ্লেতে একটি পিস রাখা হয়েছে"
                className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white outline-none"
              />
            </div>
            <div className="col-span-full pt-1">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#bd70df] text-[#160e1b] hover:bg-[#d091ee]"
              >
                অডিট রেকর্ড সেভ করুন
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Price Modal */}
      {isPriceModal && (
        <div className="p-5 rounded-2xl bg-[#1b1524] border border-[#714786] shadow-xl space-y-3 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#342b40]">
            <h3 className="font-bold text-white text-sm">নতুন দাম পরিবর্তন হিস্ট্রি</h3>
            <button onClick={() => setIsPriceModal(false)} className="text-[#a69ab1]">
              <X className="w-4 h-4" />
            </button>
          </div>
          <form onSubmit={handlePriceSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[#cfc4d9] mb-1">পণ্য নির্বাচন</label>
              <select
                value={priceProdId}
                onChange={(e) => setPriceProdId(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white outline-none"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (বর্তমান: ৳{p.price})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[#cfc4d9] mb-1">নতুন মূল্য (৳) *</label>
              <input
                type="number"
                min={0}
                required
                value={newPrice}
                onChange={(e) => setNewPrice(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-[#cfc4d9] mb-1">পরিবর্তনের কারণ</label>
              <input
                value={priceReason}
                onChange={(e) => setPriceReason(e.target.value)}
                placeholder="যেমন: ফ্যাব্রিক কাঁচামাল খরচ বৃদ্ধি"
                className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white outline-none"
              />
            </div>
            <div className="col-span-full pt-1">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#bd70df] text-[#160e1b] hover:bg-[#d091ee]"
              >
                মূল্য পরিবর্তন নিশ্চিত করুন
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tables based on active tab */}
      {tab === 'stockAudit' ? (
        <div className="rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#14101c] border-b border-[#342b40] text-[#a69ab1]">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Product Name</th>
                  <th className="py-2.5 px-3">System Stock</th>
                  <th className="py-2.5 px-3">Physical Count</th>
                  <th className="py-2.5 px-3">Difference</th>
                  <th className="py-2.5 px-3">Auditor</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#282033]">
                {audits.map((a) => (
                  <tr key={a.id} className="hover:bg-[#201927]">
                    <td className="py-3 px-3 font-mono text-[#a69ab1]">{a.date}</td>
                    <td className="py-3 px-3 font-semibold text-white">{a.productName}</td>
                    <td className="py-3 px-3 font-mono tabular-nums text-white">{a.systemStock} pcs</td>
                    <td className="py-3 px-3 font-mono tabular-nums text-white">{a.physicalStock} pcs</td>
                    <td className="py-3 px-3 font-mono font-bold tabular-nums">
                      {a.difference === 0 ? (
                        <span className="text-[#36c98b]">0 (Match)</span>
                      ) : (
                        <span className="text-[#ff6b83]">
                          {a.difference > 0 ? `+${a.difference}` : a.difference}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-[#d7cddd]">{a.auditor}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                          a.status === 'Balanced'
                            ? 'bg-[#16382d] text-[#8de8bf]'
                            : 'bg-[#44202a] text-[#ff9aaa]'
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#a69ab1] max-w-xs truncate">{a.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#14101c] border-b border-[#342b40] text-[#a69ab1]">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Product Name</th>
                  <th className="py-2.5 px-3">Old Price (৳)</th>
                  <th className="py-2.5 px-3">New Price (৳)</th>
                  <th className="py-2.5 px-3">Delta</th>
                  <th className="py-2.5 px-3">Changed By</th>
                  <th className="py-2.5 px-3">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#282033]">
                {priceHistory.map((ph) => {
                  const delta = ph.newPrice - ph.oldPrice;
                  return (
                    <tr key={ph.id} className="hover:bg-[#201927]">
                      <td className="py-3 px-3 font-mono text-[#a69ab1]">{ph.changeDate}</td>
                      <td className="py-3 px-3 font-semibold text-white">{ph.productName}</td>
                      <td className="py-3 px-3 font-mono line-through text-[#a69ab1] tabular-nums">
                        ৳{ph.oldPrice}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-[#bd70df] tabular-nums">
                        ৳{ph.newPrice}
                      </td>
                      <td className="py-3 px-3 font-mono font-semibold tabular-nums">
                        {delta > 0 ? (
                          <span className="text-[#36c98b] inline-flex items-center">
                            <ArrowUpRight className="w-3.5 h-3.5" /> +৳{delta}
                          </span>
                        ) : (
                          <span className="text-[#ff9aaa] inline-flex items-center">
                            <ArrowDownRight className="w-3.5 h-3.5" /> -৳{Math.abs(delta)}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-[#d7cddd]">{ph.changedBy}</td>
                      <td className="py-3 px-3 text-[#a69ab1] max-w-xs truncate">{ph.reason}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
