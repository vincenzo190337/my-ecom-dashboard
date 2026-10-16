import React, { useState, useRef, useEffect } from 'react';
import { PageId, Language, Order, Product } from '../types';
import {
  Menu,
  Download,
  Plus,
  LogOut,
  Languages,
  ShieldAlert,
  Palette,
  MessageCircle,
  Check,
  Bell,
  Search,
  AlertTriangle,
  Package,
  ShoppingBag,
  X,
  ChevronRight,
  PanelLeft,
  PanelLeftClose,
  Clock,
  Globe,
  Keyboard,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface TopBarProps {
  currentPage: PageId;
  lang: Language;
  onToggleLanguage: () => void;
  onNavigate: (page: PageId) => void;
  onOpenMobileMenu: () => void;
  onExportCSV: () => void;
  onLogout: () => void;
  orders?: Order[];
  products?: Product[];
  activeTheme?: string;
  onSelectTheme?: (theme: string) => void;
  onOpenWhatsApp?: () => void;
  isSidebarCollapsed?: boolean;
  onToggleSidebarCollapse?: () => void;
  onOpenKeyboardShortcuts?: () => void;
  onOpenDomainSetup?: () => void;
}

const PAGE_TITLES: Record<
  PageId,
  {
    titleBn: string;
    subtitleBn: string;
    titleEn: string;
    subtitleEn: string;
  }
> = {
  dashboard: {
    titleBn: 'ড্যাশবোর্ড ওভারভিউ',
    subtitleBn: 'আপনার অনলাইন ব্যবসার লাইভ সারসংক্ষেপ ও বিশ্লেষণ',
    titleEn: 'Dashboard Overview',
    subtitleEn: 'Live overview and analytics of your store',
  },
  merchants: {
    titleBn: 'মার্চেন্ট ও শোরুম ম্যানেজমেন্ট',
    subtitleBn: 'একাধিক দোকান, আউটলেট ও মালিকের তথ্য',
    titleEn: 'Merchant & Store Management',
    subtitleEn: 'Multi-outlet profiles and owners',
  },
  websites: {
    titleBn: 'ওয়েবসাইট ও ডোমেইন ম্যানেজমেন্ট',
    subtitleBn: 'সংযুক্ত অনলাইন স্টোর ও কাস্টম ডোমেইন',
    titleEn: 'Website & Domains',
    subtitleEn: 'Connected storefronts and custom domains',
  },
  landings: {
    titleBn: 'ল্যান্ডিং পেজ ও সেলস ফানেল',
    subtitleBn: 'অফার পেজ ও ক্যাম্পেইন URL পরিচালনা',
    titleEn: 'Landing Pages & Funnels',
    subtitleEn: 'High-converting single product funnels',
  },
  products: {
    titleBn: 'প্রোডাক্ট ও স্টক ক্যাটালগ',
    subtitleBn: 'বুটিক ড্রেস, মূল্য, স্টক ও সাইজ (৩৬-৫৬)',
    titleEn: 'Products & Inventory',
    subtitleEn: 'Boutique apparel, pricing & stock',
  },
  collections: {
    titleBn: 'আলভিনা ওমেন্স কালেকশন (২৪টি ক্যাটাগরি)',
    subtitleBn: 'ক্যাটাগরি ভিত্তিক পণ্য বিন্যাস ও চ্যানেল বরাদ্দ',
    titleEn: "Alvina Women's Collections",
    subtitleEn: '24 catalog nodes and destination channel allocation',
  },
  reportsAccounting: {
    titleBn: 'রিপোর্টস ও অ্যাকাউন্টিং',
    subtitleBn: 'বিক্রয় বিশ্লেষণ, লাভ-ক্ষতি ও ব্যালেন্স শীট',
    titleEn: 'Reports & Accounting',
    subtitleEn: 'Financial analytics and balance sheet',
  },
  orders: {
    titleBn: 'অর্ডার ম্যানেজমেন্ট ও প্রফিট',
    subtitleBn: 'কাস্টমার অর্ডার প্রসেসিং, চালান ও কুরিয়ার ট্র্যাকিং',
    titleEn: 'Order Management & Profit',
    subtitleEn: 'Processing orders, invoices & tracking',
  },
  manualOrder: {
    titleBn: 'ম্যানুয়াল অর্ডার এন্ট্রি ও ফ্রড চেক',
    subtitleBn: 'সাইজ ৩৬-৫৬ নির্বাচন ও লাইভ কুরিয়ার নম্বর যাচাই',
    titleEn: 'Manual Order Entry & Fraud Check',
    subtitleEn: 'Size 36-56 selector and live courier verification',
  },
  delivery: {
    titleBn: 'ডেলিভারি চার্জ ও পেমেন্ট সেটিংস',
    subtitleBn: 'ঢাকা (৳৮০), ঢাকার বাইরে (৳১৫০) ও হেল্পলাইন',
    titleEn: 'Delivery & Payment Settings',
    subtitleEn: 'Dhaka & outside delivery charges',
  },
  couriers: {
    titleBn: 'কুরিয়ার সার্ভিস ইন্টিগ্রেশন',
    subtitleBn: 'Steadfast, Pathao, RedX ও বাল্ক বুকিং',
    titleEn: 'Courier Services',
    subtitleEn: 'Steadfast, Pathao, RedX integrations',
  },
  exchange: {
    titleBn: 'ড্রেস ও সাইজ এক্সচেঞ্জ ট্র্যাকার',
    subtitleBn: 'সাইজ বদল ও রিটার্ন পার্সেল হ্যান্ডলিং',
    titleEn: 'Exchange & Size Swap',
    subtitleEn: 'Dress size swap and replacement',
  },
  staff: {
    titleBn: 'স্টাফ ও পারমিশন কন্ট্রোল',
    subtitleBn: 'টিম মেম্বার ও গ্র্যানুলার অ্যাক্সেস পারমিশন',
    titleEn: 'Staff & Granular Permissions',
    subtitleEn: 'Team access roles and privileges',
  },
  settings: {
    titleBn: 'সিস্টেম সেটিংস',
    subtitleBn: 'স্টোর কনফিগারেশন, পাসওয়ার্ড ও হেল্পলাইন সেটিংস',
    titleEn: 'System Settings',
    subtitleEn: 'Store configuration, password and preferences',
  },
  pos: {
    titleBn: 'শোরুম POS ও কাউন্টার বিলিং',
    subtitleBn: 'ক্যাশ কাউন্টার বিক্রয়, বারকোড ও থার্মাল রসিদ',
    titleEn: 'Showroom POS Billing',
    subtitleEn: 'Counter billing and thermal receipts',
  },
  preorders: {
    titleBn: 'প্রি-অর্ডার ও ব্যাক-অর্ডার ট্র্যাকার',
    subtitleBn: 'কাস্টমার অগ্রিম বুকিং ও রিলিজ শিডিউল',
    titleEn: 'Pre-Order & Backorders',
    subtitleEn: 'Advance reservations and booking dates',
  },
  returns: {
    titleBn: 'রিটার্ন ও রিফান্ড ম্যানেজমেন্ট',
    subtitleBn: 'ফেরত পার্সেল পরীক্ষা ও কাস্টমার রিফান্ড প্রদান',
    titleEn: 'Returns & Refunds',
    subtitleEn: 'Parcel inspection and refund processing',
  },
  variants: {
    titleBn: 'প্রোডাক্ট ভ্যারিয়েন্ট ম্যানেজার',
    subtitleBn: 'রং ও সাইজ (৩৬-৪৮ স্ট্যান্ডার্ড, ৫০-৫৬ ম্যাক্স) স্টক',
    titleEn: 'Product Variant Manager',
    subtitleEn: 'Colors and size variants matrix (36-56)',
  },
  bundles: {
    titleBn: 'বান্ডেল ও কম্বো বিল্ডার',
    subtitleBn: 'কম্বো অফার, ছাড় ও আকর্ষণীয় প্যাকেজ ক্রিয়েটর',
    titleEn: 'Bundle & Combo Builder',
    subtitleEn: 'Multi-item bundle deals and package discounts',
  },
  stockAudit: {
    titleBn: 'ইনভেন্টরি স্টক অডিট ও গণনা',
    subtitleBn: 'ফিজিক্যাল স্টক গণনা, অসামঞ্জস্যতা ও অডিট রেকর্ড',
    titleEn: 'Stock Audit & Count',
    subtitleEn: 'Physical inventory audit and discrepancy logs',
  },
  priceHistory: {
    titleBn: 'মূল্য পরিবর্তনের ইতিহাস (Price History)',
    subtitleBn: 'কোন পণ্যের দাম কখন পরিবর্তন করা হয়েছে তার লগ',
    titleEn: 'Price Change History',
    subtitleEn: 'Historical audit trail of all price adjustments',
  },
  imageManager: {
    titleBn: 'ইমেজ ও মিডিয়া গ্যালারি অ্যাসেট',
    subtitleBn: 'হাই-রেজোলিউশন প্রোডাক্ট ফটো ও আপলোড হাব',
    titleEn: 'Image & Media Gallery',
    subtitleEn: 'High-res catalog photography asset manager',
  },
  codSettlement: {
    titleBn: 'COD সেটেলমেন্ট ট্র্যাকার',
    subtitleBn: 'কুরিয়ার থেকে কত টাকা পাওনা ও পাওয়া গেছে তার হিসাব',
    titleEn: 'COD Settlement Tracker',
    subtitleEn: 'Courier remittances and cash collected accounts',
  },
  suppliers: {
    titleBn: 'সাপ্লায়ার ও পারচেজ অর্ডার',
    subtitleBn: 'কাপড় সরবরাহকারী মিল, ইনভয়েস ও বাকি-পরিশোধ',
    titleEn: 'Suppliers & Purchases',
    subtitleEn: 'Fabric mills, raw materials & purchase orders',
  },
  warehouses: {
    titleBn: 'মাল্টি-স্টোর ও ওয়্যারহাউজ',
    subtitleBn: 'কেন্দ্রীয় গুদাম ও বিভিন্ন আউটলেটে স্টক বন্টন',
    titleEn: 'Multi-Store & Warehouses',
    subtitleEn: 'Central hub and retail outlet inventory distribution',
  },
  reports: {
    titleBn: 'রিপোর্টস ও অ্যাকাউন্টস ওভারভিউ',
    subtitleBn: 'বিক্রয় বিশ্লেষণ, চ্যানেল পারফরম্যান্স ও গ্রাফ',
    titleEn: 'Reports & Accounts',
    subtitleEn: 'Sales analytics and revenue reports',
  },
  accounting: {
    titleBn: 'অ্যাকাউন্টিং ও লাভ-ক্ষতির হিসাব (P&L)',
    subtitleBn: 'COGS, ডেলিভারি খরচ ও বিজ্ঞাপন বাদে নীট লাভ',
    titleEn: 'Accounting & Profit/Loss',
    subtitleEn: 'Net profit, COGS and order margin analysis',
  },
  expenses: {
    titleBn: 'এক্সপেন্স ম্যানেজার (ব্যয় ব্যবস্থাপনা)',
    subtitleBn: 'ফেসবুক অ্যাড খরচ, প্যাকেজিং, দোকান ভাড়া ও দৈনন্দিন ব্যয়',
    titleEn: 'Expense Manager',
    subtitleEn: 'Meta ads spend, packaging and operational expenses',
  },
  reconciliation: {
    titleBn: 'পেমেন্ট রিকনসিলিয়েশন',
    subtitleBn: 'বিকাশ, নগদ, ব্যাংক ও কুরিয়ার ক্যাশ লেনদেন মেলানো',
    titleEn: 'Payment Reconciliation',
    subtitleEn: 'Matching gateway deposits with order totals',
  },
  crm: {
    titleBn: 'কাস্টমার CRM ও লাইভ ফ্রড চেকার',
    subtitleBn: 'ফোন নম্বর দিয়ে কুরিয়ার ডেলিভারি ও ক্যান্সেলেশন লাইভ চেক',
    titleEn: 'Customer CRM & Live Fraud Checker',
    subtitleEn: 'Live courier parcel check and fraud risk verification',
  },
  coupons: {
    titleBn: 'প্রোমো কোড ও ডিসকাউন্ট ভাউচার',
    subtitleBn: 'ক্যাম্পেইনের জন্য কুপন কোড, পারসেন্টেজ ও লিমিট',
    titleEn: 'Promo Codes & Discounts',
    subtitleEn: 'Discount coupons, min order thresholds and expiry',
  },
  flashSales: {
    titleBn: 'ফ্ল্যাশ সেল শিডিউলার',
    subtitleBn: 'কাউন্টডাউন টাইমার সহ স্পেশাল ফ্ল্যাশ সেল পরিচালনা',
    titleEn: 'Flash Sale Scheduler',
    subtitleEn: 'Timed promotions with countdown timers',
  },
  giftCards: {
    titleBn: 'গিফট কার্ড ও স্টোর ক্রেডিট',
    subtitleBn: 'ডিজিটাল ভাউচার ও কাস্টমার ব্যালেন্স ট্র্যাকিং',
    titleEn: 'Gift Cards & Store Credit',
    subtitleEn: 'Digital vouchers and customer balance tracking',
  },
  loyalty: {
    titleBn: 'লয়ালটি রিওয়ার্ড পয়েন্ট প্রোগ্রাম',
    subtitleBn: 'পয়েন্ট টিয়ার, পারচেজ বোনাস ও কাস্টমার রিটেনশন',
    titleEn: 'Loyalty Points Program',
    subtitleEn: 'Customer rewards, silver/gold tiers and redemption',
  },
  affiliates: {
    titleBn: 'অ্যাফিলিয়েট ও রেফারেল ম্যানেজমেন্ট',
    subtitleBn: 'অ্যাফিলিয়েট লিংক, রেফারেল সেলস ও কমিশন হিসাব',
    titleEn: 'Affiliate & Referral Program',
    subtitleEn: 'Referral tracking, custom links and payout balances',
  },
  marketing: {
    titleBn: 'মার্কেটিং ও নোটিফিকেশন ক্যাম্পেইন',
    subtitleBn: 'হোয়াটসঅ্যাপ, এসএমএস ও ইমেইল ব্রডকাস্ট সিস্টেম',
    titleEn: 'Marketing & Notifications',
    subtitleEn: 'WhatsApp, SMS & email campaign broadcast templates',
  },
  tickets: {
    titleBn: 'কমপ্লেইন্ট ও কাস্টমার সাপোর্ট টিকেট',
    subtitleBn: 'গ্রাহকের অভিযোগ, সাইজ ইস্যু ও সমাধান ট্র্যাকিং',
    titleEn: 'Complaints & Support Ticketing',
    subtitleEn: 'Customer complaints, issue tracking and resolutions',
  },
  wholesale: {
    titleBn: 'B2B ও পাইকারি হোলসেল পোর্টাল',
    subtitleBn: 'পাইকারি ক্রেতা, স্পেশাল ট্রেড ডিসকাউন্ট ও ক্রেডিট লিমিট',
    titleEn: 'B2B & Wholesale Portal',
    subtitleEn: 'Wholesale client management and bulk discount tiers',
  },
  pixels: {
    titleBn: 'পিক্সেল ও কনভার্সন ট্র্যাকিং',
    subtitleBn: 'Meta Facebook Pixel, TikTok Pixel ও কনভার্সন API',
    titleEn: 'Pixel & Conversion Tracking',
    subtitleEn: 'Facebook Meta Pixel, TikTok tracking and Conversion APIs',
  },
  theme: {
    titleBn: 'থিম কাস্টমাইজেশন ও মাল্টি-কারেন্সি',
    subtitleBn: 'কালার স্কিম, ব্যানার টেক্সট ও ৳ BDT / $ USD কারেন্সি',
    titleEn: 'Theme & Multi-Currency',
    subtitleEn: 'Admin palettes and multi-currency formatting',
  },
  approvals: {
    titleBn: 'ম্যানেজার অ্যাপ্রুভাল ওয়ার্কফ্লো',
    subtitleBn: 'বড় ডিসকাউন্ট, রিফান্ড, খরচ ও স্টক অ্যাডজাস্টমেন্ট অনুমোদন',
    titleEn: 'Manager Approval Workflow',
    subtitleEn: 'Discounts, refunds and expense approval workflows',
  },
  auditLogs: {
    titleBn: 'অডিট ট্রেইল ও অ্যাক্টিভিটি লগ',
    subtitleBn: 'কে, কখন, কোন ডেটা পরিবর্তন করেছে—আগের ও পরের মানসহ লগ',
    titleEn: 'Audit Trail & Logs',
    subtitleEn: 'Immutable chronological audit log of all system changes',
  },
  apiWebhooks: {
    titleBn: 'API ও ওয়েবহুক ম্যানেজার',
    subtitleBn: 'কুরিয়ার স্ট্যাটাস পুশ, পেমেন্ট গেটওয়ে ও অটোমেশন',
    titleEn: 'API & Webhook Manager',
    subtitleEn: 'Courier webhooks, external integrations and endpoints',
  },
  healthMonitor: {
    titleBn: 'সিস্টেম হেলথ ও পারফরম্যান্স মনিটর',
    subtitleBn: 'ফেইল্ড অর্ডার অ্যালার্ট, API এরর ও স্টোরেজ অবস্থা',
    titleEn: 'System Health Monitor',
    subtitleEn: 'Real-time operational alerts, API latency and task health',
  },
  documents: {
    titleBn: 'ডকুমেন্ট ও ফাইল সেন্টার',
    subtitleBn: 'চালান, পারচেজ রসিদ, ট্রেড লাইসেন্স ও ট্যাক্স ফাইল',
    titleEn: 'Document Center',
    subtitleEn: 'Central repository for invoices, permits and contracts',
  },
  privacy: {
    titleBn: 'ডাটা প্রাইভেসি ও GDPR টুলস',
    subtitleBn: 'গ্রাহকের ডেটা অ্যাক্সেস, এক্সপোর্ট ও রিটেনশন পলিসি',
    titleEn: 'Data Privacy & GDPR',
    subtitleEn: 'Customer export, deletion requests and privacy controls',
  },
  websiteLeads: {
    titleBn: 'ওয়েবসাইট ভিজিটর লিড ও ড্রপ-কার্ট',
    subtitleBn: 'ওয়েবসাইটে ভিজিট করা, কার্ড করা ও ফোন নাম্বার রেখে যাওয়া গ্রাহকের তালিকা',
    titleEn: 'Website Leads & Dropped Cart',
    subtitleEn: 'Captured phone numbers, active viewings and abandoned cart recoveries',
  },
  loginAudit: {
    titleBn: 'লগইন হিস্ট্রি ও ডিভাইস ট্র্যাকার (অ্যাডমিন)',
    subtitleBn: 'কে কোন ডিভাইস, ব্রাউজার ও আইপি থেকে লগইন করেছে তার সার্বিক রেকর্ড',
    titleEn: 'Login Audit & Device Tracker',
    subtitleEn: 'Session history, IP addresses, browsers and device tracker',
  },
};

const THEMES = [
  { id: 'theme-default', nameBn: 'ডার্ক প্লাম (ডিফল্ট)', nameEn: 'Dark Plum Luxe', color: '#bd70df' },
  { id: 'theme-royal', nameBn: 'রয়্যাল রোজ', nameEn: 'Royal Rose', color: '#f43f5e' },
  { id: 'theme-emerald', nameBn: 'এমারেল্ড গোল্ড', nameEn: 'Emerald Gold', color: '#10b981' },
  { id: 'theme-midnight', nameBn: 'মিডনাইট সায়ান', nameEn: 'Midnight Cyan', color: '#06b6d4' },
  { id: 'theme-amoled', nameBn: 'অ্যামোলেড ভায়োলেট', nameEn: 'AMOLED Black', color: '#8b5cf6' },
];

export const TopBar: React.FC<TopBarProps> = ({
  currentPage,
  lang,
  onToggleLanguage,
  onNavigate,
  onOpenMobileMenu,
  onExportCSV,
  onLogout,
  orders = [],
  products = [],
  activeTheme = 'theme-default',
  onSelectTheme,
  onOpenWhatsApp,
  isSidebarCollapsed = false,
  onToggleSidebarCollapse,
  onOpenKeyboardShortcuts,
  onOpenDomainSetup,
}) => {
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSoundMuted, setIsSoundMuted] = useState(sounds.getMuted());
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);

  const current = PAGE_TITLES[currentPage] || {
    titleBn: 'অ্যাডমিন প্যানেল',
    subtitleBn: '',
    titleEn: 'Admin Panel',
    subtitleEn: '',
  };

  const isBn = lang === 'bn';
  const pageTitle = isBn ? current.titleBn : current.titleEn;
  const pageSubtitle = isBn ? current.subtitleBn : current.subtitleEn;

  // Stock alerts calculation
  const outOfStockProducts = products.filter((p) => p.stock === 0);
  const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock <= 10);
  const totalStockAlerts = outOfStockProducts.length + lowStockProducts.length;

  // Universal Omnisearch matching
  const cleanSearch = searchTerm.trim().toLowerCase();
  const matchedOrders = cleanSearch
    ? orders.filter(
        (o) =>
          String(o.id).includes(cleanSearch) ||
          o.customer.toLowerCase().includes(cleanSearch) ||
          o.phone.includes(cleanSearch) ||
          o.address.toLowerCase().includes(cleanSearch) ||
          (o.courierTrackingCode && o.courierTrackingCode.toLowerCase().includes(cleanSearch))
      ).slice(0, 5)
    : [];

  const matchedProducts = cleanSearch
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(cleanSearch) ||
          p.sku.toLowerCase().includes(cleanSearch) ||
          p.category.toLowerCase().includes(cleanSearch)
      ).slice(0, 5)
    : [];

  // Close popovers on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (themeRef.current && !themeRef.current.contains(e.target as Node)) {
        setIsThemeMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const today = isBn
    ? new Intl.DateTimeFormat('bn-BD', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date())
    : new Intl.DateTimeFormat('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(new Date());

  return (
    <header className="sticky top-0 z-30 bg-[#100e16]/95 backdrop-blur-md border-b border-[#342b40] px-3.5 sm:px-6 py-3 mb-6 transition-all">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        {/* Left: Mobile Toggle + Sidebar Collapse + Title */}
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Mobile hamburger */}
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-xl bg-[#1b1524] text-[#bcb1c7] hover:text-white border border-[#342b40]"
            title="Open mobile menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Desktop Sidebar Toggle Button */}
          {onToggleSidebarCollapse && (
            <button
              onClick={onToggleSidebarCollapse}
              className="hidden lg:flex p-2 rounded-xl bg-[#1b1524] text-[#bcb1c7] hover:text-white hover:bg-[#281b37] border border-[#342b40] transition-colors"
              title={isSidebarCollapsed ? (isBn ? 'সাইডবার শো করুন' : 'Expand Sidebar') : (isBn ? 'ফুল স্ক্রিন করুন / সাইডবার হাইড' : 'Collapse Sidebar')}
            >
              {isSidebarCollapsed ? (
                <PanelLeft className="w-4 h-4 text-[#bd70df]" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </button>
          )}

          <div className="min-w-0">
            <div className="text-[11px] font-medium text-[#a69ab1] flex items-center gap-1.5 truncate">
              <span>ALVINA</span>
              <span>/</span>
              <span className="capitalize text-[#bd70df] font-semibold">{currentPage}</span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight truncate">
              {pageTitle}
            </h1>
          </div>
        </div>

        {/* Quick Nav Buttons to the Left of Search Bar (Requested by User) */}
        <div className="hidden lg:flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => onNavigate('manualOrder')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              currentPage === 'manualOrder'
                ? 'bg-[#bd70df] text-[#160e1b] font-bold shadow-sm'
                : 'bg-[#181324] hover:bg-[#281b37] text-[#f7dcff] border border-[#3e2e50]'
            }`}
            title="Create New Order"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Order</span>
          </button>

          <button
            onClick={() => onNavigate('orders')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              currentPage === 'orders'
                ? 'bg-[#bd70df] text-[#160e1b] font-bold shadow-sm'
                : 'bg-[#181324] hover:bg-[#281b37] text-[#cfc4d9] border border-[#3e2e50]'
            }`}
            title="View Order List"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Order List</span>
          </button>

          <button
            onClick={() => onNavigate('websiteLeads')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              currentPage === 'websiteLeads'
                ? 'bg-[#bd70df] text-[#160e1b] font-bold shadow-sm'
                : 'bg-[#181324] hover:bg-[#281b37] text-[#cfc4d9] border border-[#3e2e50]'
            }`}
            title="Website Orders & Leads"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Web Orders</span>
          </button>

          <button
            onClick={() => onNavigate('products')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              currentPage === 'products'
                ? 'bg-[#bd70df] text-[#160e1b] font-bold shadow-sm'
                : 'bg-[#181324] hover:bg-[#281b37] text-[#cfc4d9] border border-[#3e2e50]'
            }`}
            title="All Products & Inventory"
          >
            <Package className="w-3.5 h-3.5" />
            <span>Inventory</span>
          </button>
        </div>

        {/* Middle: Universal Omnisearch Bar */}
        <div ref={searchRef} className="relative flex-1 max-w-md w-full">
          <div className="relative">
            <Search className="w-4 h-4 text-[#a69ab1] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder={
                isBn
                  ? 'সার্চ করুন: অর্ডার ID (#98410), ফোন নম্বর, কাস্টমার বা ড্রেসের নাম...'
                  : 'Universal search: Invoice ID, phone, customer, product...'
              }
              className="w-full pl-9 pr-8 py-2 bg-[#16111f] border border-[#3a2c49] focus:border-[#bd70df] rounded-xl text-xs text-white placeholder:text-[#766985] outline-none shadow-inner transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setIsSearchOpen(false);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#a69ab1] hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Omnisearch Results Dropdown */}
          {isSearchOpen && cleanSearch && (
            <div className="absolute left-0 right-0 mt-2 bg-[#181324] border border-[#5d3b76] rounded-2xl shadow-2xl p-2.5 z-50 max-h-80 overflow-y-auto space-y-2 animate-in fade-in">
              <div className="text-[10px] uppercase font-bold text-[#bd70df] px-2 py-0.5 tracking-wider">
                {isBn ? 'লাইভ সার্চ ফলাফল' : 'Search Results'}
              </div>

              {matchedOrders.length === 0 && matchedProducts.length === 0 ? (
                <div className="p-4 text-center text-xs text-[#a69ab1]">
                  "{searchTerm}" দিয়ে কোনো অর্ডার বা প্রোডাক্ট পাওয়া যায়নি।
                </div>
              ) : (
                <>
                  {/* Matched Orders */}
                  {matchedOrders.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-[11px] font-semibold text-[#cfc4d9] px-2 flex items-center gap-1.5">
                        <ShoppingBag className="w-3.5 h-3.5 text-[#bd70df]" />
                        <span>{isBn ? 'অর্ডারসমূহ' : 'Orders'}</span>
                      </div>
                      {matchedOrders.map((o) => (
                        <div
                          key={o.id}
                          onClick={() => {
                            onNavigate('orders');
                            setIsSearchOpen(false);
                          }}
                          className="p-2 rounded-xl bg-[#110d18] hover:bg-[#281b37] border border-transparent hover:border-[#5a2e72] flex items-center justify-between cursor-pointer transition-colors"
                        >
                          <div>
                            <div className="font-bold text-white text-xs flex items-center gap-2">
                              <span>#{o.id}</span>
                              <span className="text-[11px] font-normal text-[#cfc4d9]">{o.customer}</span>
                            </div>
                            <div className="text-[10px] text-[#a69ab1] font-mono">{o.phone} • {o.address}</div>
                          </div>
                          <div className="text-right">
                            <span className="font-mono font-bold text-[#36c98b] text-xs">৳{o.total}</span>
                            <span className="block text-[10px] text-[#bd70df]">{o.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Matched Products */}
                  {matchedProducts.length > 0 && (
                    <div className="space-y-1 pt-1 border-t border-[#2e233c]">
                      <div className="text-[11px] font-semibold text-[#cfc4d9] px-2 flex items-center gap-1.5">
                        <Package className="w-3.5 h-3.5 text-[#bd70df]" />
                        <span>{isBn ? 'প্রোডাক্ট ক্যাটালগ' : 'Products'}</span>
                      </div>
                      {matchedProducts.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => {
                            onNavigate('products');
                            setIsSearchOpen(false);
                          }}
                          className="p-2 rounded-xl bg-[#110d18] hover:bg-[#281b37] border border-transparent hover:border-[#5a2e72] flex items-center justify-between cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <img
                              src={p.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=80&q=80'}
                              alt={p.name}
                              className="w-8 h-8 rounded-lg object-cover shrink-0"
                            />
                            <div className="min-w-0 truncate">
                              <div className="font-semibold text-white text-xs truncate">{p.name}</div>
                              <div className="text-[10px] text-[#a69ab1] font-mono">SKU: {p.sku} • {p.category}</div>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="font-mono font-bold text-[#36c98b] text-xs">৳{p.offer > 0 ? p.offer : p.price}</span>
                            <span className="block text-[10px] text-[#a69ab1]">স্টক: {p.stock}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap justify-end">
          {/* Theme Switcher */}
          <div ref={themeRef} className="relative">
            <button
              onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-[#1b1524] hover:bg-[#2c2038] text-white border border-[#483959] transition-all shadow-sm"
              title={isBn ? 'থিম পরিবর্তন করুন' : 'Change Dashboard Theme'}
            >
              <Palette className="w-3.5 h-3.5 text-[#bd70df]" />
              <span className="hidden sm:inline">{isBn ? 'থিম' : 'Theme'}</span>
            </button>

            {isThemeMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#1b1524] border border-[#483959] shadow-2xl p-2 z-50">
                <div className="text-[10px] uppercase font-bold text-[#a69ab1] px-2 py-1 tracking-wider">
                  {isBn ? 'ড্যাশবোর্ড থিম বাছাই' : 'Select Theme'}
                </div>
                {THEMES.map((t) => {
                  const isSelected = activeTheme === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        onSelectTheme?.(t.id);
                        setIsThemeMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                        isSelected
                          ? 'bg-[#332341] text-white'
                          : 'text-[#bcb1c7] hover:bg-[#251c31] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: t.color }}
                        />
                        <span>{isBn ? t.nameBn : t.nameEn}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#bd70df]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Direct WhatsApp Chat Trigger */}
          {onOpenWhatsApp && (
            <button
              onClick={onOpenWhatsApp}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-[#128C7E]/20 hover:bg-[#128C7E]/40 text-[#25D366] border border-[#25D366]/40 transition-all shadow-sm"
              title={isBn ? 'সরাসরি কাস্টমার WhatsApp চ্যাট' : 'Direct Customer WhatsApp Chat'}
            >
              <MessageCircle className="w-3.5 h-3.5 fill-[#25D366]" />
              <span className="hidden xl:inline">{isBn ? 'WhatsApp' : 'WhatsApp'}</span>
            </button>
          )}

          {/* Sound Effects Mute/Unmute */}
          <button
            onClick={() => {
              const next = sounds.toggleMute();
              setIsSoundMuted(next);
            }}
            className="p-2 rounded-xl bg-[#1b1524] hover:bg-[#2c2038] text-white border border-[#483959] transition-all shadow-sm"
            title={isSoundMuted ? 'সাউন্ড আনমিউট করুন (Unmute Cash Register & Beep)' : 'সাউন্ড মিউট করুন (Mute Audio)'}
          >
            {isSoundMuted ? (
              <VolumeX className="w-4 h-4 text-[#a69ab1]" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#bd70df]" />
            )}
          </button>

          {/* Domain & Hosting Wizard Trigger */}
          {onOpenDomainSetup && (
            <button
              onClick={onOpenDomainSetup}
              className="p-2 rounded-xl bg-[#1b1524] hover:bg-[#2c2038] text-white border border-[#483959] transition-all shadow-sm hidden lg:flex items-center justify-center"
              title="ডোমেইন ও হোস্টিং সেটআপ গাইড (Domain Setup Wizard)"
            >
              <Globe className="w-4 h-4 text-[#bd70df]" />
            </button>
          )}

          {/* Keyboard Shortcuts Trigger */}
          {onOpenKeyboardShortcuts && (
            <button
              onClick={onOpenKeyboardShortcuts}
              className="p-2 rounded-xl bg-[#1b1524] hover:bg-[#2c2038] text-white border border-[#483959] transition-all shadow-sm hidden md:flex items-center justify-center"
              title="কিবোর্ড শর্টকাট তালিকা (Keyboard Shortcuts Cheatsheet - Press ?)"
            >
              <Keyboard className="w-4 h-4 text-[#bd70df]" />
            </button>
          )}

          {/* Language Switcher Button */}
          <button
            onClick={onToggleLanguage}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-[#1b1524] hover:bg-[#2c2038] text-white border border-[#483959] transition-all shadow-sm"
            title="Switch Language (বাংলা / English)"
          >
            <Languages className="w-3.5 h-3.5 text-[#bd70df]" />
            <span>{isBn ? 'বাংলা' : 'EN'}</span>
          </button>

          {/* STOCK OUT & ORDERS NOTIFICATION BELL (Positioned right beside New Order) */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 rounded-xl bg-[#1b1524] hover:bg-[#2c2038] text-white border border-[#483959] transition-all shadow-sm flex items-center justify-center cursor-pointer"
              title={isBn ? 'স্টক ও অর্ডার নোটিফিকেশন' : 'Stock & Order Alerts'}
            >
              <Bell className="w-4 h-4 text-[#e6b4fa]" />
              {totalStockAlerts > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-rose-500 text-white animate-pulse">
                  {totalStockAlerts}
                </span>
              )}
            </button>

            {/* Notification Dropdown Drawer */}
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#181223] border border-[#6b3f83] shadow-2xl p-3 z-50 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-[#342b40]">
                  <div className="flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-[#bd70df]" />
                    <span className="font-bold text-white text-xs">
                      {isBn ? 'স্টক ও ইনভেন্টরি নোটিফিকেশন' : 'Stock & Inventory Alerts'}
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#351822] text-[#ff9aaa] font-bold">
                    {totalStockAlerts} টি অ্যালার্ট
                  </span>
                </div>

                <div className="max-h-64 overflow-y-auto space-y-2">
                  {/* Out of Stock Alerts */}
                  {outOfStockProducts.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span>{isBn ? 'স্টক আউট (০ পিস বাকি)' : 'Out of Stock'}</span>
                      </div>
                      {outOfStockProducts.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => {
                            onNavigate('products');
                            setIsNotificationsOpen(false);
                          }}
                          className="p-2 rounded-xl bg-[#29131a] border border-[#52212d] hover:border-rose-500 flex items-center justify-between cursor-pointer transition-all"
                        >
                          <div className="min-w-0 pr-2">
                            <div className="font-bold text-white text-xs truncate">{p.name}</div>
                            <div className="text-[10px] text-[#ff9aaa] font-mono">SKU: {p.sku} • {p.category}</div>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-rose-500 text-white text-[10px] font-bold shrink-0">
                            স্টক শেষ
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Low Stock Alerts */}
                  {lowStockProducts.length > 0 && (
                    <div className="space-y-1.5 pt-1 border-t border-[#342b40]">
                      <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{isBn ? 'কম স্টক সতর্কতা (১০ বা কম পিস)' : 'Low Stock Warning'}</span>
                      </div>
                      {lowStockProducts.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => {
                            onNavigate('products');
                            setIsNotificationsOpen(false);
                          }}
                          className="p-2 rounded-xl bg-[#2b2114] border border-[#5c421e] hover:border-amber-400 flex items-center justify-between cursor-pointer transition-all"
                        >
                          <div className="min-w-0 pr-2">
                            <div className="font-bold text-white text-xs truncate">{p.name}</div>
                            <div className="text-[10px] text-[#fcd34d] font-mono">SKU: {p.sku} • {p.category}</div>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-amber-500/30 text-amber-300 border border-amber-500/50 text-[10px] font-bold shrink-0">
                            {p.stock} পিস বাকি
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {totalStockAlerts === 0 && (
                    <div className="py-6 text-center text-xs text-[#a69ab1]">
                      🎉 সকল প্রোডাক্টের পর্যাপ্ত স্টক রয়েছে! কোনো সতর্কতা নেই।
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-[#342b40] flex justify-between items-center text-[11px]">
                  <button
                    onClick={() => {
                      onNavigate('products');
                      setIsNotificationsOpen(false);
                    }}
                    className="text-[#bd70df] font-bold hover:underline"
                  >
                    {isBn ? 'সকল প্রোডাক্ট ও স্টক দেখুন →' : 'View all products →'}
                  </button>
                  <button
                    onClick={() => setIsNotificationsOpen(false)}
                    className="text-[#a69ab1] hover:text-white"
                  >
                    {isBn ? 'বন্ধ করুন' : 'Close'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* New Order Button */}
          <button
            onClick={() => onNavigate('manualOrder')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#bd70df] text-[#160e1b] hover:bg-[#cf8fed] transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isBn ? 'নতুন অর্ডার' : 'New Order'}</span>
          </button>

          {/* Export CSV */}
          <button
            onClick={onExportCSV}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-[#1c1726] text-[#e8d9f0] hover:text-white hover:bg-[#2b2038] border border-[#342b40] transition-colors"
            title="Export Orders CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-[#1c1726] text-[#ff9aaa] hover:bg-[#341822] border border-[#522533] transition-colors"
            title={isBn ? 'লগআউট' : 'Logout'}
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
