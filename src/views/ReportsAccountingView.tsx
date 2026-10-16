import React, { useState, useEffect } from 'react';
import { Order, ExpenseRecord, ReconciliationRecord, SystemConfig } from '../types';
import {
  BarChart3,
  TrendingUp,
  CreditCard,
  CheckCircle2,
  Plus,
  X,
  ArrowUpRight,
  ArrowDownRight,
  CircleDollarSign,
} from 'lucide-react';

interface ReportsAccountingViewProps {
  orders: Order[];
  expenses: ExpenseRecord[];
  reconciliations: ReconciliationRecord[];
  config: SystemConfig;
  onSaveExpense: (exp: ExpenseRecord) => void;
  onSaveReconciliation: (rec: ReconciliationRecord) => void;
  initialTab?: 'reports' | 'accounting' | 'expenses' | 'reconciliation';
}

export const ReportsAccountingView: React.FC<ReportsAccountingViewProps> = ({
  orders,
  expenses,
  reconciliations,
  config,
  onSaveExpense,
  onSaveReconciliation,
  initialTab = 'reports',
}) => {
  const [activeTab, setActiveTab] = useState<'reports' | 'accounting' | 'expenses' | 'reconciliation'>(
    initialTab
  );

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Expense modal state
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);
  const [expenseCat, setExpenseCat] = useState<ExpenseRecord['category']>('Facebook Ads');
  const [expenseAmount, setExpenseAmount] = useState<number>(3000);
  const [paidTo, setPaidTo] = useState('');
  const [expenseMethod, setExpenseMethod] = useState<ExpenseRecord['method']>('bKash');
  const [expenseNote, setExpenseNote] = useState('');

  // Financial Calculations
  const deliveredOrders = orders.filter((o) => o.status === 'Delivered');
  const totalRevenueDelivered = deliveredOrders.reduce((sum, o) => sum + o.total, 0);
  const totalRevenueAll = orders.reduce((sum, o) => sum + o.total, 0);

  // Approximate COGS (Product cost ~55% of sale or from items)
  const totalCogs = orders.reduce((sum, o) => {
    const itemCost = o.items.reduce((s, i) => s + (i.costPrice || i.price * 0.58) * i.qty, 0);
    return sum + itemCost;
  }, 0);

  const totalExpenseAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
  const grossProfit = totalRevenueAll - totalCogs;
  const netProfit = grossProfit - totalExpenseAmount;
  const profitMargin = totalRevenueAll ? Math.round((netProfit / totalRevenueAll) * 100) : 0;

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paidTo.trim() || expenseAmount <= 0) {
      alert('সঠিক প্রাপক ও খরচের পরিমাণ দিন!');
      return;
    }

    const exp: ExpenseRecord = {
      id: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      category: expenseCat,
      amount: expenseAmount,
      paidTo: paidTo.trim(),
      method: expenseMethod,
      note: expenseNote.trim() || undefined,
    };

    onSaveExpense(exp);
    setIsExpenseOpen(false);
    setPaidTo('');
    setExpenseNote('');
  };

  return (
    <div className="space-y-6">
      {/* Top Bar with Navigation Tabs */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            {activeTab === 'reports' && <BarChart3 className="w-5 h-5 text-[#bd70df]" />}
            {activeTab === 'accounting' && <TrendingUp className="w-5 h-5 text-[#bd70df]" />}
            {activeTab === 'expenses' && <CreditCard className="w-5 h-5 text-[#bd70df]" />}
            {activeTab === 'reconciliation' && <CheckCircle2 className="w-5 h-5 text-[#bd70df]" />}
            <span>
              {activeTab === 'reports' && 'সেলস রিপোর্ট ও পারফরম্যান্স (Reports & Analytics)'}
              {activeTab === 'accounting' && 'আয়-ব্যয় ও নীট লাভ-ক্ষতি (Accounting & Profit/Loss)'}
              {activeTab === 'expenses' && 'ব্যবসায়িক খরচের হিসাব (Expense Manager)'}
              {activeTab === 'reconciliation' && 'পেমেন্ট গেটওয়ে রিকনসিলিয়েশন (Reconciliation)'}
            </span>
          </h2>
          <p className="text-xs text-[#a69ab1]">
            দৈনিক বিক্রয়, পণ্যের উৎপাদন খরচ, কুরিয়ার চার্জ ও বিজ্ঞাপনের খরচের পর চূড়ান্ত লাভ-ক্ষতি
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex bg-[#100d16] p-1 rounded-xl border border-[#342b40] overflow-x-auto">
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'reports'
                  ? 'bg-[#bd70df] text-[#160e1b]'
                  : 'text-[#bcb1c7] hover:text-white'
              }`}
            >
              Reports
            </button>
            <button
              onClick={() => setActiveTab('accounting')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'accounting'
                  ? 'bg-[#bd70df] text-[#160e1b]'
                  : 'text-[#bcb1c7] hover:text-white'
              }`}
            >
              Profit & Loss
            </button>
            <button
              onClick={() => setActiveTab('expenses')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'expenses'
                  ? 'bg-[#bd70df] text-[#160e1b]'
                  : 'text-[#bcb1c7] hover:text-white'
              }`}
            >
              Expenses ({expenses.length})
            </button>
            <button
              onClick={() => setActiveTab('reconciliation')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'reconciliation'
                  ? 'bg-[#bd70df] text-[#160e1b]'
                  : 'text-[#bcb1c7] hover:text-white'
              }`}
            >
              Reconciliation
            </button>
          </div>

          {activeTab === 'expenses' && (
            <button
              onClick={() => setIsExpenseOpen(!isExpenseOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#bd70df] text-[#160e1b] hover:bg-[#d091ee]"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন খরচ যোগ</span>
            </button>
          )}
        </div>
      </div>

      {/* Expense Modal */}
      {isExpenseOpen && (
        <div className="p-5 rounded-2xl bg-[#1b1524] border border-[#714786] shadow-xl space-y-3 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#342b40]">
            <h3 className="font-bold text-white text-sm">নতুন খরচ এন্ট্রি (Add Business Expense)</h3>
            <button onClick={() => setIsExpenseOpen(false)} className="text-[#a69ab1]">
              <X className="w-4 h-4" />
            </button>
          </div>
          <form onSubmit={handleExpenseSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[#cfc4d9] mb-1">খরচের খাত (Category) *</label>
              <select
                value={expenseCat}
                onChange={(e) => setExpenseCat(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white outline-none"
              >
                <option value="Facebook Ads">Facebook Ads (বিজ্ঞাপন)</option>
                <option value="Fabric & Sewing">Fabric & Sewing (কাপড় ও সেলাই)</option>
                <option value="Showroom Rent">Showroom Rent (দোকান ভাড়া)</option>
                <option value="Staff Salary">Staff Salary (কর্মচারী বেতন)</option>
                <option value="Packaging">Packaging (প্যাকেজিং ব্যাগ ও কার্টন)</option>
                <option value="Utility & Tea">Utility & Tea (বিল ও আপ্যায়ন)</option>
              </select>
            </div>
            <div>
              <label className="block text-[#cfc4d9] mb-1">খরচের পরিমাণ (৳) *</label>
              <input
                type="number"
                min={0}
                required
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-[#cfc4d9] mb-1">প্রাপক / ব্যক্তি / কোম্পানি *</label>
              <input
                required
                value={paidTo}
                onChange={(e) => setPaidTo(e.target.value)}
                placeholder="e.g. Meta Ads / Building Landlord"
                className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-[#cfc4d9] mb-1">পেমেন্ট মেথড</label>
              <select
                value={expenseMethod}
                onChange={(e) => setExpenseMethod(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white outline-none"
              >
                <option value="bKash">bKash</option>
                <option value="Bank">Bank</option>
                <option value="Cash">Cash</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[#cfc4d9] mb-1">খরচের বিবরণ / নোট</label>
              <input
                value={expenseNote}
                onChange={(e) => setExpenseNote(e.target.value)}
                placeholder="বিল বা ভাউচার নম্বরসহ বিস্তারিত"
                className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white outline-none"
              />
            </div>
            <div className="col-span-full pt-1">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#bd70df] text-[#160e1b] hover:bg-[#d091ee]"
              >
                খরচ সেভ করুন
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 1. REPORTS TAB */}
      {activeTab === 'reports' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#181520] border border-[#342b40]">
              <span className="text-xs text-[#a69ab1]">মোট অর্ডার সংখ্যা</span>
              <div className="text-2xl font-bold text-white font-mono mt-1 tabular-nums">
                {orders.length} টি
              </div>
              <span className="text-[11px] text-[#36c98b] mt-1 block">
                সাকসেস রেট:{' '}
                {orders.length
                  ? Math.round((deliveredOrders.length / orders.length) * 100)
                  : 0}
                %
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#181520] border border-[#342b40]">
              <span className="text-xs text-[#a69ab1]">ডেলিভার্ড রেভিনিউ</span>
              <div className="text-2xl font-bold text-[#36c98b] font-mono mt-1 tabular-nums">
                ৳ {totalRevenueDelivered.toLocaleString()}
              </div>
              <span className="text-[11px] text-[#a69ab1] mt-1 block">
                মোট বুকিং: ৳ {totalRevenueAll.toLocaleString()}
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#181520] border border-[#342b40]">
              <span className="text-xs text-[#a69ab1]">মোট পরিচালন ব্যয় (Expenses)</span>
              <div className="text-2xl font-bold text-[#ff9aaa] font-mono mt-1 tabular-nums">
                ৳ {totalExpenseAmount.toLocaleString()}
              </div>
              <span className="text-[11px] text-[#a69ab1] mt-1 block">এডস, রেণ্ট ও প্যাকেজিং</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#181520] border border-[#342b40]">
              <span className="text-xs text-[#a69ab1]">নীট প্রফিট মার্জিন</span>
              <div className="text-2xl font-bold text-[#bd70df] font-mono mt-1 tabular-nums">
                {profitMargin}%
              </div>
              <span className="text-[11px] text-[#d7cddd] mt-1 block">সুস্থ ও টেকসই লাভজনক হার</span>
            </div>
          </div>

          {/* Top Selling Products Bar */}
          <div className="p-5 rounded-2xl bg-[#181520] border border-[#342b40] space-y-4">
            <h3 className="font-bold text-white text-sm">সর্বোচ্চ বিক্রিত ড্রেসসমূহ (Top Selling Collections)</h3>
            <div className="space-y-3 text-xs">
              {[
                { name: 'Luxury Organza Embroidered Three Piece', sold: 38, rev: 123500 },
                { name: 'Handblock Printed Premium Cotton Kurti', sold: 52, rev: 75400 },
                { name: 'Emerald Festive Silk Co-ord Set', sold: 29, rev: 73950 },
                { name: 'Royal Flared Anarkali Festive Gown', sold: 16, rev: 76800 },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-[#d7cddd]">
                    <span className="font-medium text-white">{item.name}</span>
                    <span className="font-mono text-[#bd70df]">
                      {item.sold} pcs · ৳{item.rev.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-[#271f30] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#bd70df]"
                      style={{ width: `${Math.min(100, item.sold * 2)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. PROFIT & LOSS TAB */}
      {activeTab === 'accounting' && (
        <div className="space-y-5">
          <div className="p-6 rounded-2xl bg-[#181520] border border-[#342b40] space-y-4">
            <h3 className="font-bold text-white text-base pb-3 border-b border-[#342b40]">
              আয়-ব্যয় বিবরণী (Income & Profit Statement)
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-[#282133]">
                <span className="text-[#a69ab1]">১. মোট বিক্রয় রেভিনিউ (Gross Sales):</span>
                <span className="font-mono font-bold text-white tabular-nums">
                  ৳ {totalRevenueAll.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#282133]">
                <span className="text-[#a69ab1]">২. বিক্রিত পণ্যের কাঁচামাল খরচ (COGS):</span>
                <span className="font-mono text-[#ff9aaa] tabular-nums">
                  - ৳ {totalCogs.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#282133] font-bold text-[#d7cddd]">
                <span>৩. গ্রস প্রফিট (Gross Profit):</span>
                <span className="font-mono text-[#36c98b] tabular-nums">
                  ৳ {grossProfit.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#282133]">
                <span className="text-[#a69ab1]">৪. পরিচালন ও বিজ্ঞাপন ব্যয় (Operating Expenses):</span>
                <span className="font-mono text-[#ff9aaa] tabular-nums">
                  - ৳ {totalExpenseAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-[#2b172a] border border-[#714786] text-sm font-bold text-white">
                <span>চূড়ান্ত নীট লাভ (Net Business Profit):</span>
                <span className="font-mono text-base text-[#bd70df] tabular-nums">
                  ৳ {netProfit.toLocaleString()} ({profitMargin}%)
                </span>
              </div>
            </div>
          </div>

          {/* Profit Per Order Table */}
          <div className="rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm overflow-hidden">
            <div className="p-4 border-b border-[#342b40]">
              <h3 className="font-bold text-white text-sm">প্রতিটি অর্ডারে নীট লাভ (Profit per Order)</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#14101c] border-b border-[#342b40] text-[#a69ab1]">
                    <th className="py-2.5 px-3">Order ID</th>
                    <th className="py-2.5 px-3">Customer</th>
                    <th className="py-2.5 px-3">Order Total</th>
                    <th className="py-2.5 px-3">Approx Cost</th>
                    <th className="py-2.5 px-3">Estimated Profit</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#282033]">
                  {orders.map((o) => {
                    const cost = o.items.reduce(
                      (s, i) => s + (i.costPrice || i.price * 0.58) * i.qty,
                      0
                    );
                    const p = Math.max(0, o.total - cost - o.charge);
                    return (
                      <tr key={o.id} className="hover:bg-[#201927]">
                        <td className="py-3 px-3 font-mono font-bold text-white">#{o.id}</td>
                        <td className="py-3 px-3 text-[#d7cddd]">{o.customer}</td>
                        <td className="py-3 px-3 font-mono text-white tabular-nums">৳{o.total}</td>
                        <td className="py-3 px-3 font-mono text-[#a69ab1] tabular-nums">
                          ৳{Math.round(cost)}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-[#36c98b] tabular-nums">
                          +৳{Math.round(p)}
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#211a2a] text-[#bd70df]">
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. EXPENSES TAB */}
      {activeTab === 'expenses' && (
        <div className="rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#14101c] border-b border-[#342b40] text-[#a69ab1]">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Paid To</th>
                  <th className="py-2.5 px-3">Method</th>
                  <th className="py-2.5 px-3">Amount (৳)</th>
                  <th className="py-2.5 px-3">Receipt / Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#282033]">
                {expenses.map((e) => (
                  <tr key={e.id} className="hover:bg-[#201927]">
                    <td className="py-3 px-3 font-mono text-[#a69ab1]">{e.date}</td>
                    <td className="py-3 px-3 font-medium text-white">
                      <span className="px-2 py-0.5 rounded bg-[#271b35] text-[#e6b4fa]">
                        {e.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#f7dcff]">{e.paidTo}</td>
                    <td className="py-3 px-3 text-[#bd70df] font-mono">{e.method}</td>
                    <td className="py-3 px-3 font-mono font-bold text-[#ff9aaa] tabular-nums">
                      ৳{e.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-[#a69ab1] max-w-xs truncate">{e.note || e.receiptNo || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. RECONCILIATION TAB */}
      {activeTab === 'reconciliation' && (
        <div className="rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#14101c] border-b border-[#342b40] text-[#a69ab1]">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Payment Channel</th>
                  <th className="py-2.5 px-3">Trx ID / Gateway Ref</th>
                  <th className="py-2.5 px-3">Order Amount</th>
                  <th className="py-2.5 px-3">Gateway Received</th>
                  <th className="py-2.5 px-3">Verified By</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#282033]">
                {reconciliations.map((r) => (
                  <tr key={r.id} className="hover:bg-[#201927]">
                    <td className="py-3 px-3 font-mono text-[#a69ab1]">{r.date}</td>
                    <td className="py-3 px-3 font-semibold text-white">{r.channel}</td>
                    <td className="py-3 px-3 font-mono text-[#bd70df]">{r.gatewayRefTrx}</td>
                    <td className="py-3 px-3 font-mono text-white tabular-nums">৳{r.systemOrderAmount}</td>
                    <td className="py-3 px-3 font-mono font-bold text-[#36c98b] tabular-nums">
                      ৳{r.gatewayReceivedAmount}
                    </td>
                    <td className="py-3 px-3 text-[#d7cddd]">{r.verifiedBy}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[11px] bg-[#16382d] text-[#8de8bf]">
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
