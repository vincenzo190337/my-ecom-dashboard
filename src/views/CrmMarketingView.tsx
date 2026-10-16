import React, { useState, useEffect } from 'react';
import {
  CrmCustomer,
  PromoCode,
  FlashSale,
  GiftCard,
  LoyaltyAccount,
  AffiliatePartner,
  MarketingCampaign,
  SupportTicket,
  ALVINA_CATALOG_STRUCTURE,
} from '../types';
import {
  Users,
  Tag,
  Zap,
  Gift,
  Award,
  Share2,
  MessageSquare,
  LifeBuoy,
  Plus,
  ShieldAlert,
  CheckCircle,
  Phone,
  Trash2,
  X,
  Send,
  Smartphone,
  MessageCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  Edit2,
  Calendar,
} from 'lucide-react';
import { LiveFraudCheckerWidget } from '../components/LiveFraudCheckerWidget';

interface CrmMarketingViewProps {
  customers: CrmCustomer[];
  coupons: PromoCode[];
  flashSales: FlashSale[];
  giftCards: GiftCard[];
  loyalty: LoyaltyAccount[];
  affiliates: AffiliatePartner[];
  campaigns: MarketingCampaign[];
  tickets: SupportTicket[];
  userRole?: string;
  onToggleBlacklist: (customerId: number) => void;
  onSaveCoupon: (c: PromoCode) => void;
  onUpdateCoupon?: (c: PromoCode) => void;
  onSaveFlashSale?: (fs: FlashSale) => void;
  onUpdateFlashSale?: (fs: FlashSale) => void;
  onDeleteFlashSale?: (id: number) => void;
  onSaveGiftCard?: (gc: GiftCard) => void;
  onUpdateGiftCard?: (gc: GiftCard) => void;
  onSaveLoyalty?: (ly: LoyaltyAccount) => void;
  onUpdateLoyalty?: (ly: LoyaltyAccount) => void;
  onSaveAffiliate?: (af: AffiliatePartner) => void;
  onUpdateAffiliate?: (af: AffiliatePartner) => void;
  onSaveCampaign: (cmp: MarketingCampaign) => void;
  onUpdateCampaign?: (cmp: MarketingCampaign) => void;
  onSaveTicket?: (tk: SupportTicket) => void;
  onUpdateTicket?: (tk: SupportTicket) => void;
  initialTab?: 'crm' | 'coupons' | 'flashSales' | 'giftCards' | 'loyalty' | 'affiliates' | 'marketing' | 'tickets';
}

export const CrmMarketingView: React.FC<CrmMarketingViewProps> = ({
  customers,
  coupons,
  flashSales,
  giftCards,
  loyalty,
  affiliates,
  campaigns,
  tickets,
  userRole = 'Admin',
  onToggleBlacklist,
  onSaveCoupon,
  onUpdateCoupon,
  onSaveFlashSale,
  onUpdateFlashSale,
  onDeleteFlashSale,
  onSaveGiftCard,
  onUpdateGiftCard,
  onSaveLoyalty,
  onUpdateLoyalty,
  onSaveAffiliate,
  onUpdateAffiliate,
  onSaveCampaign,
  onUpdateCampaign,
  onSaveTicket,
  onUpdateTicket,
  initialTab = 'crm',
}) => {
  const [tab, setTab] = useState(initialTab);
  const [selectedCheckerPhone, setSelectedCheckerPhone] = useState('');

  const canSuperEdit = userRole === 'Admin' || userRole === 'Merchant';

  // Super Edit active modal targets
  const [editingCoupon, setEditingCoupon] = useState<PromoCode | null>(null);
  const [editingFlashSale, setEditingFlashSale] = useState<FlashSale | null>(null);
  const [editingGiftCard, setEditingGiftCard] = useState<GiftCard | null>(null);
  const [editingLoyalty, setEditingLoyalty] = useState<LoyaltyAccount | null>(null);
  const [editingAffiliate, setEditingAffiliate] = useState<AffiliatePartner | null>(null);
  const [editingCampaign, setEditingCampaign] = useState<MarketingCampaign | null>(null);
  const [editingTicket, setEditingTicket] = useState<SupportTicket | null>(null);

  // Creation Modals
  const [isAddFlashSaleOpen, setIsAddFlashSaleOpen] = useState(false);
  const [isAddLoyaltyOpen, setIsAddLoyaltyOpen] = useState(false);
  const [isAddAffiliateOpen, setIsAddAffiliateOpen] = useState(false);
  const [isAddCampaignOpen, setIsAddCampaignOpen] = useState(false);
  const [isAddTicketOpen, setIsAddTicketOpen] = useState(false);

  // Direct Campaign Action Modals
  const [isDirectWhatsAppOpen, setIsDirectWhatsAppOpen] = useState(false);
  const [isDirectSmsOpen, setIsDirectSmsOpen] = useState(false);

  // New Gift Card form state
  const [isAddGiftCardOpen, setIsAddGiftCardOpen] = useState(false);
  const [newGcCode, setNewGcCode] = useState('');
  const [newGcCustomer, setNewGcCustomer] = useState('');
  const [newGcPhone, setNewGcPhone] = useState('');
  const [newGcAmount, setNewGcAmount] = useState<number>(2000);

  // New Flash Sale form state
  const [newFsTitle, setNewFsTitle] = useState('');
  const [newFsDiscount, setNewFsDiscount] = useState<number>(25);
  const [newFsCategory, setNewFsCategory] = useState('All');
  const [newFsStart, setNewFsStart] = useState('2026-10-15 18:00');
  const [newFsEnd, setNewFsEnd] = useState('2026-10-15 23:59');

  // New Loyalty form state
  const [newLyCustomer, setNewLyCustomer] = useState('');
  const [newLyPhone, setNewLyPhone] = useState('');
  const [newLyPoints, setNewLyPoints] = useState<number>(200);
  const [newLyTier, setNewLyTier] = useState<LoyaltyAccount['tier']>('Silver');

  // New Affiliate form state
  const [newAfName, setNewAfName] = useState('');
  const [newAfPhone, setNewAfPhone] = useState('');
  const [newAfCode, setNewAfCode] = useState('');
  const [newAfRate, setNewAfRate] = useState<number>(10);

  // New Campaign form state
  const [newCmpName, setNewCmpName] = useState('');
  const [newCmpChannel, setNewCmpChannel] = useState<'SMS' | 'WhatsApp' | 'Facebook' | 'Email'>('WhatsApp');
  const [newCmpAudience, setNewCmpAudience] = useState('All Customers (সকল গ্রাহক)');
  const [newCmpTemplate, setNewCmpTemplate] = useState('প্রিয় {name}, ALVINA Boutique-এ নতুন কালেকশন এসে পৌঁছেছে! বিশেষ ডিসকাউন্ট কোড: EID26');

  // Direct WhatsApp campaign execution state
  const [waAudience, setWaAudience] = useState<'all' | 'vip' | 'cart_dropouts' | 'inactive'>('all');
  const [waMessage, setWaMessage] = useState('প্রিয় {name}, ALVINA Boutique-এর নতুন কালেকশনে পাচ্ছেন ফ্ল্যাট ২০% ছাড়! অর্ডার করতে সরাসরি রিপ্লাই দিন অথবা ভিজিট করুন: alvina.com.bd');
  const [waDispatchProgress, setWaDispatchProgress] = useState<string | null>(null);

  // Direct SMS campaign execution state
  const [smsAudience, setSmsAudience] = useState<'all' | 'vip' | 'repeat' | 'sub_dhaka'>('all');
  const [smsText, setSmsText] = useState('ALVINA: Exclusive New Three-Piece Collection is LIVE! Order now & get instant delivery. Helpline: 01956591199');
  const [smsDispatchStatus, setSmsDispatchStatus] = useState<string | null>(null);

  // New Ticket form state
  const [newTkCustomer, setNewTkCustomer] = useState('');
  const [newTkPhone, setNewTkPhone] = useState('');
  const [newTkIssue, setNewTkIssue] = useState('Size mismatch / এক্সচেঞ্জ ইস্যু');
  const [newTkPriority, setNewTkPriority] = useState<SupportTicket['priority']>('Medium');
  const [newTkNotes, setNewTkNotes] = useState('');

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  // Quick coupon create
  const [couponCode, setCouponCode] = useState('');
  const [couponVal, setCouponVal] = useState<number>(10);
  const [couponMin, setCouponMin] = useState<number>(2000);

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const cp: PromoCode = {
      id: Date.now(),
      code: couponCode.trim().toUpperCase(),
      discountType: 'percentage',
      discountValue: couponVal,
      minOrderValue: couponMin,
      maxUsageLimit: 100,
      usedCount: 0,
      expiryDate: '2026-11-30',
      status: 'Active',
    };
    onSaveCoupon(cp);
    setCouponCode('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            {tab === 'crm' && <Users className="w-5 h-5 text-[#bd70df]" />}
            {tab === 'coupons' && <Tag className="w-5 h-5 text-[#bd70df]" />}
            {tab === 'flashSales' && <Zap className="w-5 h-5 text-[#bd70df]" />}
            {tab === 'giftCards' && <Gift className="w-5 h-5 text-[#bd70df]" />}
            {tab === 'affiliates' && <Share2 className="w-5 h-5 text-[#bd70df]" />}
            {tab === 'marketing' && <MessageSquare className="w-5 h-5 text-[#bd70df]" />}
            {tab === 'tickets' && <LifeBuoy className="w-5 h-5 text-[#bd70df]" />}
            <span>
              {tab === 'crm' && 'কাস্টমার ডাটাবেজ ও ফ্রড চেকার (Customer CRM & Fraud)'}
              {tab === 'coupons' && 'প্রোমো কোড ও ডিসকাউন্ট ভাউচার (Promo Codes)'}
              {tab === 'flashSales' && 'ফ্ল্যাশ সেল ও কাউন্টডাউন (Flash Sale Scheduler)'}
              {tab === 'giftCards' && 'গিফট কার্ড ও লয়ালটি পয়েন্ট (Gift Cards & Loyalty)'}
              {tab === 'affiliates' && 'অ্যাফিলিয়েট ও রেফারেল সেলস (Affiliate Management)'}
              {tab === 'marketing' && 'এসএমএস ও হোয়াটসঅ্যাপ ক্যাম্পেইন (Marketing)'}
              {tab === 'tickets' && 'কমপ্লেইন্ট ও কাস্টমার সাপোর্ট টিকেট (Ticketing)'}
            </span>
          </h2>
          <p className="text-xs text-[#a69ab1]">
            রিপিট কাস্টমারদের ইতিহাস, ভুয়া অর্ডার রোধে ফ্রড স্কোর এবং গ্রাহক বৃদ্ধির মার্কেটিং টুলস
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-[#100d16] p-1 rounded-xl border border-[#342b40] overflow-x-auto">
          {[
            { id: 'crm', label: 'CRM & Fraud' },
            { id: 'coupons', label: 'Coupons' },
            { id: 'flashSales', label: 'Flash Sales' },
            { id: 'giftCards', label: 'Gift Cards' },
            { id: 'loyalty', label: 'Loyalty Points' },
            { id: 'affiliates', label: 'Affiliates' },
            { id: 'marketing', label: 'Campaigns' },
            { id: 'tickets', label: 'Support' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                tab === t.id ? 'bg-[#bd70df] text-[#160e1b]' : 'text-[#bcb1c7] hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. CRM & FRAUD CHECKER TAB */}
      {tab === 'crm' && (
        <div className="space-y-6">
          {/* Prominent Live Fraud Checker Widget */}
          <LiveFraudCheckerWidget
            initialPhone={selectedCheckerPhone}
            crmCustomers={customers}
            onSelectPhone={(p) => setSelectedCheckerPhone(p)}
          />

          <div className="rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm overflow-hidden">
            <div className="p-4 border-b border-[#342b40] flex items-center justify-between">
              <div>
                <span className="font-bold text-white text-sm">গ্রাহক তালিকা ও ফ্রড রিস্ক স্কোর</span>
                <p className="text-[11px] text-[#a69ab1]">
                  যে কোনো ফোন নম্বরে ক্লিক করে উপরের লাইভ ফ্রড বক্সে কুরিয়ার রিপোর্ট যাচাই করুন
                </p>
              </div>
              <span className="text-xs text-[#a69ab1]">মোট {customers.length} জন গ্রাহক</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#14101c] border-b border-[#342b40] text-[#a69ab1]">
                    <th className="py-2.5 px-3">Customer Name</th>
                    <th className="py-2.5 px-3">Phone (Click to Live Check)</th>
                    <th className="py-2.5 px-3">Orders (Delivered / Cancel)</th>
                    <th className="py-2.5 px-3">Total Spent</th>
                    <th className="py-2.5 px-3">Fraud Risk Score</th>
                    <th className="py-2.5 px-3">Tags & Notes</th>
                    <th className="py-2.5 px-3 text-right">Blacklist</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#282033]">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-[#201927]">
                      <td className="py-3 px-3">
                        <div className="font-semibold text-white">{c.name}</div>
                        <div className="text-[11px] text-[#a69ab1]">{c.address}</div>
                      </td>
                      <td className="py-3 px-3">
                        <button
                          type="button"
                          onClick={() => setSelectedCheckerPhone(c.phone)}
                          className="font-mono text-[#e6b4fa] hover:text-white underline underline-offset-2 flex items-center gap-1 font-semibold"
                          title="কুরিয়ার লাইভ রিপোর্ট দেখতে ক্লিক করুন"
                        >
                          <Phone className="w-3 h-3 text-[#bd70df]" />
                          <span>{c.phone}</span>
                        </button>
                      </td>
                      <td className="py-3 px-3 font-mono">
                        <span className="text-[#36c98b] font-bold">{c.deliveredCount} Delv</span>
                        <span className="text-[#a69ab1]"> / </span>
                        <span className="text-[#ff6b83] font-bold">{c.cancelledCount} Cancel</span>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-[#bd70df] tabular-nums">
                        ৳{c.totalSpent.toLocaleString()}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            c.fraudRiskScore === 'Safe'
                              ? 'bg-[#16382d] text-[#8de8bf]'
                              : c.fraudRiskScore === 'Moderate'
                              ? 'bg-[#2f2719] text-[#fcd34d]'
                              : 'bg-[#44202a] text-[#ff9aaa]'
                          }`}
                        >
                          {c.fraudRiskScore}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[#bcb1c7] max-w-xs">
                        <div className="flex flex-wrap gap-1 mb-1">
                          {c.tags.map((t, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 rounded bg-[#271b35] text-[#e6b4fa] text-[10px]"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                        {c.notes && <div className="text-[10px] text-[#a69ab1] truncate">{c.notes}</div>}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => onToggleBlacklist(c.id)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                            c.isBlacklisted
                              ? 'bg-[#ff6b83] text-black font-bold'
                              : 'bg-[#27151a] text-[#ff9aaa] hover:bg-[#44202a]'
                          }`}
                        >
                          {c.isBlacklisted ? 'Blacklisted' : 'Block Number'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. PROMO CODES TAB */}
      {tab === 'coupons' && (
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-[#1b1524] border border-[#714786] shadow-sm">
            <h3 className="font-bold text-white text-xs mb-3">নতুন কুপন কোড তৈরি করুন</h3>
            <form onSubmit={handleCreateCoupon} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <input
                required
                placeholder="PROMO CODE (e.g. EID20)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="px-3 py-2 bg-[#100d16] border border-[#342b40] rounded-xl text-white font-mono uppercase"
              />
              <input
                type="number"
                min={1}
                max={99}
                placeholder="Discount %"
                value={couponVal}
                onChange={(e) => setCouponVal(Number(e.target.value))}
                className="px-3 py-2 bg-[#100d16] border border-[#342b40] rounded-xl text-white font-mono"
              />
              <input
                type="number"
                min={500}
                placeholder="Min Order Value (৳)"
                value={couponMin}
                onChange={(e) => setCouponMin(Number(e.target.value))}
                className="px-3 py-2 bg-[#100d16] border border-[#342b40] rounded-xl text-white font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#bd70df] text-[#160e1b] font-bold hover:bg-[#d091ee]"
              >
                + Create Coupon
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {coupons.map((cp) => (
              <div key={cp.id} className="p-5 rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-base font-bold text-[#bd70df]">{cp.code}</span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] ${
                        cp.status === 'Active'
                          ? 'bg-[#16382d] text-[#8de8bf]'
                          : 'bg-[#44202a] text-[#ff9aaa]'
                      }`}
                    >
                      {cp.status}
                    </span>
                    {canSuperEdit && (
                      <button
                        onClick={() => setEditingCoupon({ ...cp })}
                        className="px-2 py-0.5 rounded bg-[#271b35] text-[#e6b4fa] hover:bg-[#bd70df] hover:text-[#160e1b] text-[10px] font-bold"
                        title="সুপার এডিট কুপন"
                      >
                        সুপার এডিট
                      </button>
                    )}
                  </div>
                </div>
                <div className="text-sm font-semibold text-white">
                  {cp.discountValue}% Off on order &gt; ৳{cp.minOrderValue}
                </div>
                <div className="text-[11px] text-[#a69ab1] flex justify-between pt-2 border-t border-[#342b40]">
                  <span>ব্যবহার: {cp.usedCount} বার</span>
                  <span>মেয়াদ: {cp.expiryDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. FLASH SALES TAB */}
      {tab === 'flashSales' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {flashSales.map((fs) => (
            <div key={fs.id} className="p-5 rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm space-y-3">
              <div className="flex justify-between items-center">
                <span className="px-2 py-0.5 rounded-full bg-[#35203f] text-[#bd70df] text-xs font-bold flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  <span>{fs.discountPercent}% Flash Discount</span>
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-[#36c98b]">{fs.status}</span>
                  {canSuperEdit && (
                    <button
                      onClick={() => setEditingFlashSale({ ...fs })}
                      className="px-2 py-0.5 rounded bg-[#271b35] text-[#e6b4fa] hover:bg-[#bd70df] hover:text-[#160e1b] text-[10px] font-bold"
                    >
                      সুপার এডিট
                    </button>
                  )}
                </div>
              </div>
              <h3 className="font-bold text-white text-base">{fs.title}</h3>
              <div className="text-xs text-[#d7cddd]">ক্যাটাগরি: {fs.applicableCategory}</div>
              <div className="p-2.5 rounded-xl bg-[#100d16] font-mono text-xs text-[#f7dcff] flex justify-between">
                <span>Start: {fs.startTime}</span>
                <span>End: {fs.endTime}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. GIFT CARDS TAB */}
      {tab === 'giftCards' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#181520] border border-[#342b40] flex items-center justify-between">
            <div>
              <span className="text-sm font-bold text-white">ডিজিটাল গিফট কার্ড ও স্টোর ক্রেডিট</span>
              <p className="text-xs text-[#a69ab1]">গ্রাহকের জন্য প্রিপেইড কার্ড ইস্যু ও ব্যালেন্স ম্যানেজমেন্ট</p>
            </div>
            <button
              onClick={() => {
                setNewGcCode('GIFT-' + Math.floor(1000 + Math.random() * 9000));
                setNewGcCustomer('');
                setNewGcPhone('');
                setNewGcAmount(2000);
                setIsAddGiftCardOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#bd70df] text-[#160e1b] hover:bg-[#d091ee]"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন গিফট কার্ড ইস্যু করুন</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {giftCards.map((g) => (
              <div key={g.id} className="p-5 rounded-2xl bg-[#21162d] border border-[#714786] shadow-sm space-y-2">
                <div className="flex justify-between items-center text-xs text-[#a69ab1]">
                  <span>ALVINA Digital Gift Card</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#36c98b] font-semibold">{g.status}</span>
                    {canSuperEdit && (
                      <button
                        onClick={() => setEditingGiftCard({ ...g })}
                        className="px-2 py-0.5 rounded bg-[#2c1d3c] text-[#e6b4fa] hover:bg-[#bd70df] hover:text-[#160e1b] text-[10px] font-bold"
                      >
                        সুপার এডিট
                      </button>
                    )}
                  </div>
                </div>
                <div className="font-mono text-base font-bold text-white tracking-wider">{g.code}</div>
                <div className="flex justify-between items-end pt-2">
                  <div>
                    <div className="text-xs text-white">{g.customerName}</div>
                    <div className="text-[10px] text-[#a69ab1]">{g.customerPhone}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[#a69ab1]">ব্যালেন্স:</span>
                    <div className="font-mono text-lg font-bold text-[#bd70df]">৳{g.balance}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. LOYALTY POINTS TAB */}
      {tab === 'loyalty' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#1b1524] border border-[#714786] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-white text-sm">লয়ালটি রিওয়ার্ডস প্রোগ্রাম রুলস</h3>
              <p className="text-xs text-[#a69ab1]">প্রতি ১০০ টাকা কেনাকাটায় ১ পয়েন্ট অর্জন (১ পয়েন্ট = ১ টাকা ছাড়)</p>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-[#16382d] text-[#8de8bf]">Silver Tier (0 - 500)</span>
              <span className="px-2.5 py-1 rounded-lg bg-[#271b35] text-[#e6b4fa]">Gold Tier (501 - 1500)</span>
              <span className="px-2.5 py-1 rounded-lg bg-[#3b2110] text-[#fbbf24]">VIP Tier (1500+)</span>
            </div>
          </div>

          <div className="rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm overflow-hidden">
            <div className="p-4 border-b border-[#342b40] font-bold text-white text-sm">
              গ্রাহক লয়ালটি পয়েন্ট টিয়ার্স ও পয়েন্ট হিস্ট্রি ({loyalty.length} জন সক্রিয় সদস্য)
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#14101c] border-b border-[#342b40] text-[#a69ab1]">
                    <th className="py-2.5 px-3">Customer</th>
                    <th className="py-2.5 px-3">Phone</th>
                    <th className="py-2.5 px-3">Tier</th>
                    <th className="py-2.5 px-3">Current Points</th>
                    <th className="py-2.5 px-3">Lifetime Earned</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#282033]">
                  {loyalty.map((ly) => (
                    <tr key={ly.id} className="hover:bg-[#201927]">
                      <td className="py-3 px-3 font-semibold text-white">{ly.customerName}</td>
                      <td className="py-3 px-3 font-mono text-[#a69ab1]">{ly.customerPhone}</td>
                      <td className="py-3 px-3 font-bold text-[#bd70df]">{ly.tier}</td>
                      <td className="py-3 px-3 font-mono font-bold text-[#36c98b] tabular-nums">
                        {ly.points} pts
                      </td>
                      <td className="py-3 px-3 font-mono text-white tabular-nums">
                        {ly.lifetimeEarned} pts
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. AFFILIATES TAB */}
      {tab === 'affiliates' && (
        <div className="rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#14101c] border-b border-[#342b40] text-[#a69ab1]">
                  <th className="py-2.5 px-3">Partner / Influencer</th>
                  <th className="py-2.5 px-3">Affiliate Code</th>
                  <th className="py-2.5 px-3">Commission</th>
                  <th className="py-2.5 px-3">Referred Orders</th>
                  <th className="py-2.5 px-3">Total Sales</th>
                  <th className="py-2.5 px-3">Payable Balance</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#282033]">
                {affiliates.map((af) => (
                  <tr key={af.id} className="hover:bg-[#201927]">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-white">{af.name}</div>
                      <div className="text-[11px] font-mono text-[#a69ab1]">{af.phone}</div>
                    </td>
                    <td className="py-3 px-3 font-mono text-[#e6b4fa] font-bold">{af.affiliateCode}</td>
                    <td className="py-3 px-3 font-mono font-bold text-white">{af.commissionRate}%</td>
                    <td className="py-3 px-3 font-mono text-white">{af.referredOrdersCount} orders</td>
                    <td className="py-3 px-3 font-mono font-semibold text-[#bd70df] tabular-nums">
                      ৳{af.totalSalesGenerated.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-[#36c98b] tabular-nums">
                      ৳{af.earningsBalance}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#16382d] text-[#8de8bf]">
                        {af.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. MARKETING TAB */}
      {tab === 'marketing' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {campaigns.map((cmp) => (
              <div key={cmp.id} className="p-5 rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm space-y-3">
                <div className="flex justify-between items-center">
                  <span className="px-2 py-0.5 rounded bg-[#271b35] text-[#bd70df] text-xs font-semibold">
                    {cmp.channel} Campaign
                  </span>
                  <span className="text-[11px] font-semibold text-[#36c98b]">{cmp.status}</span>
                </div>
                <h3 className="font-bold text-white text-sm">{cmp.name}</h3>
                <p className="text-xs text-[#d7cddd] bg-[#100d16] p-3 rounded-xl border border-[#342b40] leading-relaxed">
                  "{cmp.messageTemplate}"
                </p>
                <div className="flex justify-between text-[11px] text-[#a69ab1] pt-1">
                  <span>টার্গেট: {cmp.targetAudience}</span>
                  <span>ডেলিভারি রেট: {cmp.deliveredRate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. SUPPORT TICKETS TAB */}
      {tab === 'tickets' && (
        <div className="rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#14101c] border-b border-[#342b40] text-[#a69ab1]">
                  <th className="py-2.5 px-3">Ticket ID</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Issue Type</th>
                  <th className="py-2.5 px-3">Priority</th>
                  <th className="py-2.5 px-3">Assigned To</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Resolution Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#282033]">
                {tickets.map((tk) => (
                  <tr key={tk.id} className="hover:bg-[#201927]">
                    <td className="py-3 px-3 font-mono font-bold text-white">#TK-{tk.id}</td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-white">{tk.customerName}</div>
                      <div className="text-[11px] font-mono text-[#a69ab1]">{tk.customerPhone}</div>
                    </td>
                    <td className="py-3 px-3 text-[#f7dcff]">{tk.issueType}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          tk.priority === 'High'
                            ? 'bg-[#44202a] text-[#ff9aaa]'
                            : 'bg-[#271b35] text-[#e6b4fa]'
                        }`}
                      >
                        {tk.priority}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#d7cddd]">{tk.assignedTo}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#16382d] text-[#8de8bf]">
                        {tk.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#a69ab1] max-w-xs truncate">{tk.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Gift Card Modal */}
      {isAddGiftCardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#16121f] border border-[#714786] rounded-2xl p-5 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#342b40]">
              <h3 className="font-bold text-white text-sm">নতুন ডিজিটাল গিফট কার্ড তৈরি</h3>
              <button onClick={() => setIsAddGiftCardOpen(false)} className="text-[#a69ab1] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newGcCode.trim() || !newGcCustomer.trim()) {
                  alert('কোড ও গ্রাহক নাম দিন!');
                  return;
                }
                const gc: GiftCard = {
                  id: Date.now(),
                  code: newGcCode.trim().toUpperCase(),
                  customerName: newGcCustomer.trim(),
                  customerPhone: newGcPhone.trim() || '01XXXXXXXXX',
                  balance: Number(newGcAmount) || 2000,
                  originalAmount: Number(newGcAmount) || 2000,
                  issuedDate: new Date().toISOString().slice(0, 10),
                  expiryDate: '2027-12-31',
                  status: 'Active',
                };
                if (onSaveGiftCard) onSaveGiftCard(gc);
                setIsAddGiftCardOpen(false);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-[#cfc4d9] mb-1">কার্ড কোড (Unique Code) *</label>
                <input
                  required
                  value={newGcCode}
                  onChange={(e) => setNewGcCode(e.target.value)}
                  className="w-full px-3 py-2 bg-[#100d16] border border-[#342b40] rounded-xl text-white font-mono uppercase outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#cfc4d9] mb-1">গ্রাহকের নাম *</label>
                  <input
                    required
                    value={newGcCustomer}
                    onChange={(e) => setNewGcCustomer(e.target.value)}
                    placeholder="মেহজাবিন চৌধুরী"
                    className="w-full px-3 py-2 bg-[#100d16] border border-[#342b40] rounded-xl text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#cfc4d9] mb-1">ফোন নম্বর</label>
                  <input
                    value={newGcPhone}
                    onChange={(e) => setNewGcPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full px-3 py-2 bg-[#100d16] border border-[#342b40] rounded-xl text-white font-mono outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[#cfc4d9] mb-1">কার্ড ক্রেডিট ব্যালেন্স (৳) *</label>
                <input
                  type="number"
                  min={100}
                  required
                  value={newGcAmount}
                  onChange={(e) => setNewGcAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#100d16] border border-[#342b40] rounded-xl text-white font-mono outline-none"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2 border-t border-[#342b40]">
                <button
                  type="button"
                  onClick={() => setIsAddGiftCardOpen(false)}
                  className="px-4 py-2 rounded-xl text-[#a69ab1] hover:text-white"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#bd70df] text-[#160e1b] font-bold hover:bg-[#d091ee]"
                >
                  কার্ড ইস্যু করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Super Edit Coupon Modal */}
      {editingCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#16121f] border border-[#714786] rounded-2xl p-5 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#342b40]">
              <h3 className="font-bold text-white text-sm">সুপার এডিট: কুপন কোড ({editingCoupon.code})</h3>
              <button onClick={() => setEditingCoupon(null)} className="text-[#a69ab1] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-[#cfc4d9] mb-1">কুপন কোড</label>
                <input
                  value={editingCoupon.code}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 bg-[#100d16] border border-[#342b40] rounded-xl text-white font-mono uppercase outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#cfc4d9] mb-1">ছাড় পরিমাণ (%)</label>
                  <input
                    type="number"
                    value={editingCoupon.discountValue}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, discountValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#100d16] border border-[#342b40] rounded-xl text-white font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#cfc4d9] mb-1">সর্বনিম্ন অর্ডার (৳)</label>
                  <input
                    type="number"
                    value={editingCoupon.minOrderValue}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, minOrderValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#100d16] border border-[#342b40] rounded-xl text-white font-mono outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#cfc4d9] mb-1">মেয়াদ শেষ</label>
                  <input
                    type="date"
                    value={editingCoupon.expiryDate}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 bg-[#100d16] border border-[#342b40] rounded-xl text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#cfc4d9] mb-1">স্ট্যাটাস</label>
                  <select
                    value={editingCoupon.status}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#100d16] border border-[#342b40] rounded-xl text-white outline-none"
                  >
                    <option value="Active">Active (সক্রিয়)</option>
                    <option value="Expired">Expired (মেয়াদোত্তীর্ণ)</option>
                    <option value="Disabled">Disabled (বন্ধ)</option>
                  </select>
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2 border-t border-[#342b40]">
                <button
                  type="button"
                  onClick={() => setEditingCoupon(null)}
                  className="px-4 py-2 rounded-xl text-[#a69ab1] hover:text-white"
                >
                  বাতিল
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onUpdateCoupon) onUpdateCoupon(editingCoupon);
                    setEditingCoupon(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-[#bd70df] text-[#160e1b] font-bold hover:bg-[#d091ee]"
                >
                  আপডেট সংরক্ষণ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Super Edit Gift Card Modal */}
      {editingGiftCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#16121f] border border-[#714786] rounded-2xl p-5 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#342b40]">
              <h3 className="font-bold text-white text-sm">সুপার এডিট: গিফট কার্ড ({editingGiftCard.code})</h3>
              <button onClick={() => setEditingGiftCard(null)} className="text-[#a69ab1] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-[#cfc4d9] mb-1">গ্রাহকের নাম</label>
                <input
                  value={editingGiftCard.customerName}
                  onChange={(e) => setEditingGiftCard({ ...editingGiftCard, customerName: e.target.value })}
                  className="w-full px-3 py-2 bg-[#100d16] border border-[#342b40] rounded-xl text-white outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#cfc4d9] mb-1">ফোন নম্বর</label>
                  <input
                    value={editingGiftCard.customerPhone}
                    onChange={(e) => setEditingGiftCard({ ...editingGiftCard, customerPhone: e.target.value })}
                    className="w-full px-3 py-2 bg-[#100d16] border border-[#342b40] rounded-xl text-white font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#cfc4d9] mb-1">বর্তমান ব্যালেন্স (৳)</label>
                  <input
                    type="number"
                    value={editingGiftCard.balance}
                    onChange={(e) => setEditingGiftCard({ ...editingGiftCard, balance: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#100d16] border border-[#342b40] rounded-xl text-white font-mono outline-none font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[#cfc4d9] mb-1">স্ট্যাটাস</label>
                <select
                  value={editingGiftCard.status}
                  onChange={(e) => setEditingGiftCard({ ...editingGiftCard, status: e.target.value as any })}
                  className="w-full px-3 py-2 bg-[#100d16] border border-[#342b40] rounded-xl text-white outline-none"
                >
                  <option value="Active">Active (সক্রিয়)</option>
                  <option value="Redeemed">Redeemed (ব্যবহৃত)</option>
                  <option value="Expired">Expired (মেয়াদোত্তীর্ণ)</option>
                </select>
              </div>
              <div className="pt-2 flex justify-end gap-2 border-t border-[#342b40]">
                <button
                  type="button"
                  onClick={() => setEditingGiftCard(null)}
                  className="px-4 py-2 rounded-xl text-[#a69ab1] hover:text-white"
                >
                  বাতিল
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onUpdateGiftCard) onUpdateGiftCard(editingGiftCard);
                    setEditingGiftCard(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-[#bd70df] text-[#160e1b] font-bold hover:bg-[#d091ee]"
                >
                  ব্যালেন্স আপডেট করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
