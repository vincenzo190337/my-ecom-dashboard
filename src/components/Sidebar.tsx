import React, { useState } from 'react';
import { PageId, Language } from '../types';
import {
  LayoutDashboard,
  ShoppingBag,
  PlusCircle,
  Receipt,
  Clock,
  RotateCcw,
  ArrowLeftRight,
  Package,
  Layers,
  Sparkles,
  ClipboardCheck,
  History,
  Image as ImageIcon,
  Truck,
  CircleDollarSign,
  Boxes,
  Building2,
  Sliders,
  TrendingUp,
  CreditCard,
  CheckCircle2,
  Users,
  Tag,
  Zap,
  Gift,
  Award,
  Share2,
  MessageSquare,
  LifeBuoy,
  Store,
  Globe,
  Briefcase,
  Target,
  Palette,
  ShieldCheck,
  FileCheck,
  ScrollText,
  Webhook,
  Activity,
  FolderArchive,
  Lock,
  Settings,
  ChevronDown,
  ChevronRight,
  X,
  LogOut,
  Search,
  UserCheck,
  MessageCircle,
  ShieldAlert,
  Pin,
  PinOff,
  FolderTree,
  ListFilter,
  Check,
} from 'lucide-react';

interface SidebarProps {
  currentPage: PageId;
  lang?: Language;
  onToggleLanguage?: () => void;
  onNavigate: (page: PageId) => void;
  onLogout: () => void;
  userName: string;
  userRole?: string;
  onOpenWhatsApp?: () => void;
  isOpen: boolean;
  onClose: () => void;
  isPinned?: boolean;
  onTogglePin?: () => void;
  isHovered?: boolean;
  onHoverChange?: (hovered: boolean) => void;
  pendingOrdersCount: number;
  pendingApprovalsCount?: number;
}

interface NavItem {
  id: PageId;
  label: string;
  subLabel?: string;
  icon: React.ReactNode;
  badge?: number;
}

interface NavHub {
  id: string;
  name: string;
  badge?: number;
  primaryItems: NavItem[];
  extendedItems: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  lang = 'bn',
  onToggleLanguage,
  onNavigate,
  onLogout,
  userName,
  userRole = 'Admin',
  onOpenWhatsApp,
  isOpen,
  onClose,
  isPinned = true,
  onTogglePin,
  isHovered = false,
  onHoverChange,
  pendingOrdersCount,
  pendingApprovalsCount = 0,
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [menuMode, setMenuViewMode] = useState<'clean' | 'all'>('clean');
  const [collapsedHubs, setCollapsedHubs] = useState<Record<string, boolean>>({});
  const [expandedExtendedHubs, setExpandedExtendedHubs] = useState<Record<string, boolean>>({});

  const isBn = lang === 'bn';

  const toggleHub = (hubId: string) => {
    setCollapsedHubs((prev) => ({
      ...prev,
      [hubId]: !prev[hubId],
    }));
  };

  const toggleExtended = (hubId: string) => {
    setExpandedExtendedHubs((prev) => ({
      ...prev,
      [hubId]: !prev[hubId],
    }));
  };

  // 5 Clean Core Hubs Structure (আন্তর্জাতিক স্ট্যান্ডার্ড অনুযায়ী ৫টি প্রধান হাব)
  const navHubs: NavHub[] = [
    {
      id: 'orders_pos',
      name: isBn ? '📁 ১. ORDERS & POS (অর্ডার ও বিক্রয়)' : '📁 1. ORDERS & POS',
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
      primaryItems: [
        {
          id: 'dashboard',
          label: isBn ? 'ড্যাশবোর্ড (Dashboard Overview)' : 'Dashboard Overview',
          icon: <LayoutDashboard className="w-4 h-4 text-[#bd70df]" />,
        },
        {
          id: 'orders',
          label: isBn ? 'All Orders (সকল অর্ডার ও ফিল্টার)' : 'All Orders & Filters',
          icon: <ShoppingBag className="w-4 h-4 text-[#bd70df]" />,
          badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
        },
        {
          id: 'manualOrder',
          label: isBn ? '+ New Order (নতুন অর্ডার / প্রি-অর্ডার)' : '+ New Order Entry',
          icon: <PlusCircle className="w-4 h-4 text-[#e879f9]" />,
        },
        {
          id: 'pos',
          label: isBn ? 'Showroom POS (শোরুম কাউন্টার বিলিং)' : 'Showroom POS Billing',
          icon: <Receipt className="w-4 h-4 text-emerald-400" />,
        },
        {
          id: 'preorders',
          label: isBn ? 'Pre-Orders (সকল প্রি-অর্ডার ও চ্যানেল)' : 'Pre-Orders & Channels',
          icon: <Clock className="w-4 h-4 text-amber-400" />,
        },
        {
          id: 'returns',
          label: isBn ? 'Exchanges & Returns (এক্সচেঞ্জ ও রিটার্ন)' : 'Exchanges & Returns',
          icon: <RotateCcw className="w-4 h-4 text-rose-400" />,
        },
      ],
      extendedItems: [
        {
          id: 'exchange',
          label: isBn ? 'ড্রেস ও সাইজ এক্সচেঞ্জ (Exchange)' : 'Dress & Size Exchange',
          icon: <ArrowLeftRight className="w-4 h-4 text-amber-300" />,
        },
      ],
    },
    {
      id: 'products_inventory',
      name: isBn ? '📁 ২. PRODUCTS & INVENTORY (পণ্য ও স্টক)' : '📁 2. PRODUCTS & INVENTORY',
      primaryItems: [
        {
          id: 'products',
          label: isBn ? 'Product Catalog (সকল ড্রেস ও স্টক)' : 'Product Catalog & Stock',
          icon: <Package className="w-4 h-4 text-[#bd70df]" />,
        },
        {
          id: 'variants',
          label: isBn ? 'Size Variants (৩৬-৫৬ সাইজ ভ্যারিয়েন্ট)' : 'Size Variants (36-56)',
          icon: <Layers className="w-4 h-4 text-indigo-400" />,
        },
        {
          id: 'bundles',
          label: isBn ? 'Combos & Bundles (কম্বো অফার বিল্ডার)' : 'Combos & Bundles Builder',
          icon: <Sparkles className="w-4 h-4 text-amber-400" />,
        },
        {
          id: 'stockAudit',
          label: isBn ? 'Stock Audit (ইনভেন্টরি গোনা ও রিপোর্ট)' : 'Stock Audit & Count',
          icon: <ClipboardCheck className="w-4 h-4 text-emerald-400" />,
        },
      ],
      extendedItems: [
        {
          id: 'priceHistory',
          label: isBn ? 'মূল্য পরিবর্তনের ইতিহাস' : 'Price Change History',
          icon: <History className="w-4 h-4 text-[#a69ab1]" />,
        },
        {
          id: 'imageManager',
          label: isBn ? 'ইমেজ ও মিডিয়া গ্যালারি' : 'Image & Media Gallery',
          icon: <ImageIcon className="w-4 h-4 text-[#a69ab1]" />,
        },
        {
          id: 'collections',
          label: isBn ? 'কালেকশন ও ক্যাটাগরি' : 'Collections & Categories',
          icon: <Boxes className="w-4 h-4 text-[#a69ab1]" />,
        },
      ],
    },
    {
      id: 'courier_logistics',
      name: isBn ? '📁 ৩. COURIER & LOGISTICS (কুরিয়ার ও লজিস্টিকস)' : '📁 3. COURIER & LOGISTICS',
      primaryItems: [
        {
          id: 'couriers',
          label: isBn ? 'Courier Service (স্টিডফাস্ট, পাঠাও, রেডএক্স)' : 'Courier Services (Steadfast/Pathao/RedX)',
          icon: <Truck className="w-4 h-4 text-sky-400" />,
        },
        {
          id: 'codSettlement',
          label: isBn ? 'COD Settlement (টাকা তোলার হিসাব)' : 'COD Settlement Tracker',
          icon: <CircleDollarSign className="w-4 h-4 text-emerald-400" />,
        },
        {
          id: 'delivery',
          label: isBn ? 'Delivery Fees (ঢাকা ও বাইরে চার্জ)' : 'Delivery & Shipping Fees',
          icon: <Sliders className="w-4 h-4 text-purple-400" />,
        },
      ],
      extendedItems: [
        {
          id: 'suppliers',
          label: isBn ? 'সাপ্লায়ার ও পারচেজ অর্ডার' : 'Suppliers & Purchases',
          icon: <Boxes className="w-4 h-4 text-[#a69ab1]" />,
        },
        {
          id: 'warehouses',
          label: isBn ? 'মাল্টি-স্টোর ও ওয়্যারহাউজ' : 'Multi-Store & Warehouses',
          icon: <Building2 className="w-4 h-4 text-[#a69ab1]" />,
        },
      ],
    },
    {
      id: 'customers_crm',
      name: isBn ? '📁 ৪. CUSTOMERS & CRM (গ্রাহক ও প্রচারণা)' : '📁 4. CUSTOMERS & CRM',
      primaryItems: [
        {
          id: 'crm',
          label: isBn ? 'Customer List & Fraud Check (কাস্টমার ও ফ্রড)' : 'Customer List & Fraud Check',
          icon: <Users className="w-4 h-4 text-[#bd70df]" />,
        },
        {
          id: 'websiteLeads',
          label: isBn ? 'Website Leads & Abandoned Cart' : 'Website Leads & Dropped Cart',
          icon: <UserCheck className="w-4 h-4 text-emerald-400" />,
        },
        {
          id: 'coupons',
          label: isBn ? 'Discounts & Coupons (প্রোমো কোড ও গিফট)' : 'Discounts & Promo Codes',
          icon: <Tag className="w-4 h-4 text-amber-400" />,
        },
      ],
      extendedItems: [
        {
          id: 'flashSales',
          label: isBn ? 'ফ্ল্যাশ সেল শিডিউলার' : 'Flash Sale Scheduler',
          icon: <Zap className="w-4 h-4 text-amber-400" />,
        },
        {
          id: 'giftCards',
          label: isBn ? 'গিফট কার্ড ও স্টোর ক্রেডিট' : 'Gift Cards & Store Credit',
          icon: <Gift className="w-4 h-4 text-pink-400" />,
        },
        {
          id: 'loyalty',
          label: isBn ? 'লয়ালটি পয়েন্ট প্রোগ্রাম' : 'Loyalty Points Program',
          icon: <Award className="w-4 h-4 text-yellow-400" />,
        },
        {
          id: 'affiliates',
          label: isBn ? 'অ্যাফিলিয়েট ও রেফারেল কোড' : 'Affiliate & Referral Codes',
          icon: <Share2 className="w-4 h-4 text-cyan-400" />,
        },
        {
          id: 'marketing',
          label: isBn ? 'মার্কেটিং ও ক্যাম্পেইন হাব' : 'Marketing & Campaigns',
          icon: <MessageSquare className="w-4 h-4 text-sky-400" />,
        },
        {
          id: 'tickets',
          label: isBn ? 'কাস্টমার সাপোর্ট ও টিকেটিং' : 'Support Complaints & Tickets',
          icon: <LifeBuoy className="w-4 h-4 text-teal-400" />,
        },
      ],
    },
    {
      id: 'accounts_settings',
      name: isBn ? '📁 ৫. ACCOUNTS & SETTINGS (হিসাব ও সিস্টেম)' : '📁 5. ACCOUNTS & SETTINGS',
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
      primaryItems: [
        {
          id: 'reports',
          label: isBn ? 'Profit & Loss (দৈনিক ও মাসিক লাভ-ক্ষতি)' : 'Profit & Loss Reports',
          icon: <TrendingUp className="w-4 h-4 text-emerald-400" />,
        },
        {
          id: 'staff',
          label: isBn ? 'Staff & Roles (কর্মচারীদের পারমিশন)' : 'Staff & Role Permissions',
          icon: <ShieldCheck className="w-4 h-4 text-sky-400" />,
        },
        {
          id: 'settings',
          label: isBn ? 'Store Settings (দোকান ও সিস্টেম সেটিংস)' : 'Store & System Settings',
          icon: <Settings className="w-4 h-4 text-purple-400" />,
        },
      ],
      extendedItems: [
        {
          id: 'accounting',
          label: isBn ? 'দৈনিক আয় ও ব্যয়ের লেজার' : 'Accounting & Ledger',
          icon: <CircleDollarSign className="w-4 h-4 text-[#a69ab1]" />,
        },
        {
          id: 'expenses',
          label: isBn ? 'খরচ ও ভাউচার এন্ট্রি' : 'Expense & Voucher Logs',
          icon: <CreditCard className="w-4 h-4 text-[#a69ab1]" />,
        },
        {
          id: 'reconciliation',
          label: isBn ? 'ব্যাংক ও ক্যাশ সমন্বয়' : 'Bank Reconciliation',
          icon: <CheckCircle2 className="w-4 h-4 text-[#a69ab1]" />,
        },
        {
          id: 'merchants',
          label: isBn ? 'মার্চেন্ট ও আউটলেট' : 'Merchants & Outlets',
          icon: <Store className="w-4 h-4 text-[#a69ab1]" />,
        },
        {
          id: 'websites',
          label: isBn ? 'ওয়েবসাইট ও ডোমেইন' : 'Websites & Domains',
          icon: <Globe className="w-4 h-4 text-[#a69ab1]" />,
        },
        {
          id: 'landings',
          label: isBn ? 'ল্যান্ডিং পেজ ও ফানেল' : 'Landing Pages & Funnels',
          icon: <Layers className="w-4 h-4 text-[#a69ab1]" />,
        },
        {
          id: 'wholesale',
          label: isBn ? 'B2B পাইকারি পোর্টাল' : 'B2B Wholesale Portal',
          icon: <Briefcase className="w-4 h-4 text-[#a69ab1]" />,
        },
        {
          id: 'pixels',
          label: isBn ? 'পিক্সেল ও কনভার্সন ট্র্যাকিং' : 'Pixel & Conversion API',
          icon: <Target className="w-4 h-4 text-[#a69ab1]" />,
        },
        {
          id: 'theme',
          label: isBn ? 'থিম ও ব্র্যান্ড কালার' : 'Theme & Color Palette',
          icon: <Palette className="w-4 h-4 text-[#a69ab1]" />,
        },
        {
          id: 'approvals',
          label: isBn ? 'ম্যানেজার অ্যাপ্রুভাল' : 'Approval Workflow',
          icon: <FileCheck className="w-4 h-4 text-amber-400" />,
          badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
        },
        ...((!userRole || userRole === 'Admin')
          ? [
              {
                id: 'loginAudit' as PageId,
                label: isBn ? 'লগইন হিস্ট্রি ও ডিভাইস ট্র্যাকার' : 'Login Device Tracker (Admin)',
                icon: <ShieldAlert className="w-4 h-4 text-amber-400" />,
              },
            ]
          : []),
        {
          id: 'auditLogs',
          label: isBn ? 'অডিট ট্রেইল ও সিস্টেম লগ' : 'Audit Trail & Logs',
          icon: <ScrollText className="w-4 h-4 text-[#a69ab1]" />,
        },
        {
          id: 'apiWebhooks',
          label: isBn ? 'API ও ওয়েবহুক ম্যানেজার' : 'API & Webhooks',
          icon: <Webhook className="w-4 h-4 text-[#a69ab1]" />,
        },
        {
          id: 'healthMonitor',
          label: isBn ? 'সিস্টেম হেলথ মনিটর' : 'System Health Monitor',
          icon: <Activity className="w-4 h-4 text-[#a69ab1]" />,
        },
        {
          id: 'documents',
          label: isBn ? 'ডকুমেন্ট ও ফাইল সেন্টার' : 'Document Center',
          icon: <FolderArchive className="w-4 h-4 text-[#a69ab1]" />,
        },
        {
          id: 'privacy',
          label: isBn ? 'ডাটা প্রাইভেসি ও GDPR' : 'Data Privacy & GDPR',
          icon: <Lock className="w-4 h-4 text-[#a69ab1]" />,
        },
      ],
    },
  ];

  const filterText = searchFilter.trim().toLowerCase();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Edge trigger strip: touching or hovering near left edge expands sidebar without clicking */}
      {!isPinned && (
        <div
          onMouseEnter={() => onHoverChange && onHoverChange(true)}
          onTouchStart={() => onHoverChange && onHoverChange(true)}
          className="hidden lg:block fixed top-0 bottom-0 left-0 w-6 z-40 cursor-pointer group"
          title="Hover or touch left edge to reveal sidebar menu"
        >
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-14 bg-[#bd70df]/30 group-hover:bg-[#bd70df] rounded-r-full group-hover:h-24 transition-all duration-300 shadow-[0_0_12px_rgba(189,112,223,0.5)]" />
        </div>
      )}

      {/* Desktop hover backdrop */}
      {!isPinned && isHovered && (
        <div
          className="hidden lg:block fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px] transition-opacity duration-300"
          onClick={() => onHoverChange && onHoverChange(false)}
        />
      )}

      <aside
        onMouseEnter={() => !isPinned && onHoverChange && onHoverChange(true)}
        onMouseLeave={() => !isPinned && onHoverChange && onHoverChange(false)}
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#130f19] border-r border-[#342b40] flex flex-col transition-all duration-300 ease-out shadow-2xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isPinned ? 'lg:translate-x-0' : isHovered ? 'lg:translate-x-0 lg:shadow-[0_0_50px_rgba(0,0,0,0.85)]' : 'lg:-translate-x-full'}`}
      >
        {/* Brand header */}
        <div className="p-4 border-b border-[#342b40] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white font-['Plus_Jakarta_Sans']">
                ALVINA
              </span>
              <span className="text-xl font-bold text-[#bd70df] font-['Plus_Jakarta_Sans']">
                COMMERCE
              </span>
            </div>
            <p className="text-[10px] text-[#a69ab1] uppercase tracking-wider font-semibold mt-0.5">
              5 Clean Core Hubs Suite
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            {onTogglePin && (
              <button
                type="button"
                onClick={onTogglePin}
                className={`hidden lg:flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold border transition-all ${
                  isPinned
                    ? 'bg-[#bd70df]/20 text-[#e6b4fa] border-[#bd70df]/50 shadow-sm'
                    : 'bg-[#1b1524] text-[#a69ab1] hover:text-white border-[#342b40]'
                }`}
                title={isPinned ? 'Unpin (Auto-hide on hover)' : 'Pin sidebar open'}
              >
                {isPinned ? (
                  <>
                    <Pin className="w-3.5 h-3.5 text-[#bd70df] fill-[#bd70df]" />
                    <span className="text-[10px] hidden xl:inline">Pinned</span>
                  </>
                ) : (
                  <>
                    <PinOff className="w-3.5 h-3.5" />
                    <span className="text-[10px] hidden xl:inline">Float</span>
                  </>
                )}
              </button>
            )}
            {onToggleLanguage && (
              <button
                onClick={onToggleLanguage}
                title="Switch Language (বাংলা / English)"
                className="px-2 py-1 rounded-lg text-[11px] font-bold bg-[#1b1524] hover:bg-[#2c2038] text-white border border-[#483959] transition-colors"
              >
                {isBn ? '🇧🇩 বাংলা' : '🇬🇧 EN'}
              </button>
            )}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-[#a69ab1] hover:text-white hover:bg-[#211b2b]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Mode Switcher: 5 Clean Hubs vs All 42 Menus */}
        <div className="px-3 pt-3 pb-2 border-b border-[#282133] bg-[#100d17]/60 space-y-2">
          <div className="grid grid-cols-2 p-0.5 rounded-xl bg-[#1b1524] border border-[#342b40] text-[11px]">
            <button
              type="button"
              onClick={() => setMenuViewMode('clean')}
              className={`py-1.5 px-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
                menuMode === 'clean'
                  ? 'bg-[#bd70df] text-[#120a17] shadow-sm'
                  : 'text-[#a69ab1] hover:text-white'
              }`}
              title="৫টি প্রধান হাব (সহজ ও ক্লিন ভিউ)"
            >
              <FolderTree className="w-3.5 h-3.5" />
              <span>{isBn ? '৫টি কোর হাব' : '5 Clean Hubs'}</span>
            </button>
            <button
              type="button"
              onClick={() => setMenuViewMode('all')}
              className={`py-1.5 px-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
                menuMode === 'all'
                  ? 'bg-[#bd70df] text-[#120a17] shadow-sm'
                  : 'text-[#a69ab1] hover:text-white'
              }`}
              title="সকল ৪২টি অপশন দেখুন"
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>{isBn ? 'সকল মেনু (৪২)' : 'All 42 Menus'}</span>
            </button>
          </div>

          {/* Quick Menu Search (Instant search across all 42 menus) */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#a69ab1] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder={isBn ? 'যেকোনো মেনু খুঁজুন...' : 'Search any menu item...'}
              className="w-full pl-8 pr-2.5 py-1.5 bg-[#100d16] border border-[#342b40] rounded-lg text-xs text-white placeholder:text-[#7d718b] focus:border-[#bd70df] outline-none"
            />
          </div>
        </div>

        {/* Navigation items grouped in 5 Clean Core Hubs */}
        <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4">
          {navHubs.map((hub) => {
            const isHubCollapsed = collapsedHubs[hub.id] && !filterText;
            const isExtendedOpen = expandedExtendedHubs[hub.id] || menuMode === 'all';

            // Items to display: in clean mode, show primary + (extended if expanded). If searching, search in both.
            const allHubItems = [...hub.primaryItems, ...hub.extendedItems];
            const itemsToFilter = filterText
              ? allHubItems
              : menuMode === 'all' || isExtendedOpen
              ? allHubItems
              : hub.primaryItems;

            const filteredItems = itemsToFilter.filter((item) =>
              filterText
                ? item.label.toLowerCase().includes(filterText) ||
                  hub.name.toLowerCase().includes(filterText)
                : true
            );

            if (filteredItems.length === 0) return null;

            return (
              <div key={hub.id} className="space-y-1 bg-[#17121f]/40 p-1.5 rounded-2xl border border-[#2d2238]/60">
                {/* Hub Header */}
                <button
                  type="button"
                  onClick={() => toggleHub(hub.id)}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 text-[11px] font-bold text-[#c7b5d8] uppercase tracking-wider hover:text-white hover:bg-[#251833] rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="truncate">{hub.name}</span>
                    {hub.badge !== undefined && (
                      <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-rose-500 text-white tabular-nums">
                        {hub.badge}
                      </span>
                    )}
                  </div>
                  {!filterText && (
                    <span className="text-[#a69ab1]">
                      {isHubCollapsed ? (
                        <ChevronRight className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </span>
                  )}
                </button>

                {/* Hub Items */}
                {!isHubCollapsed && (
                  <div className="space-y-0.5 mt-1">
                    {filteredItems.map((item) => {
                      const isActive = currentPage === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            onNavigate(item.id);
                            onClose();
                            if (!isPinned && onHoverChange) onHoverChange(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                            isActive
                              ? 'bg-[#3a2346] text-[#f7dcff] border border-[#714786]/60 shadow-sm'
                              : 'text-[#bcb1c7] hover:bg-[#211a2a] hover:text-white border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className={isActive ? 'text-[#bd70df]' : 'text-[#8e819b]'}>
                              {item.icon}
                            </span>
                            <span className="truncate">{item.label}</span>
                          </div>
                          {item.badge !== undefined && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#bd70df]/20 text-[#e6b4fa] border border-[#bd70df]/30 tabular-nums shrink-0">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}

                    {/* Expand/Collapse more items under this hub (in clean mode) */}
                    {!filterText && menuMode === 'clean' && hub.extendedItems.length > 0 && (
                      <button
                        type="button"
                        onClick={() => toggleExtended(hub.id)}
                        className="w-full text-left px-3 py-1.5 text-[11px] font-semibold text-[#a69ab1] hover:text-[#bd70df] flex items-center gap-1.5 transition-colors"
                      >
                        <span className="text-[10px]">{isExtendedOpen ? '− কম দেখুন' : `+ আরও ${hub.extendedItems.length}টি অপশন`}</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* WhatsApp Direct Chat Trigger Button */}
        {onOpenWhatsApp && (
          <div className="px-3 py-2 border-t border-[#342b40]/60 bg-[#16111e]">
            <button
              onClick={() => {
                onOpenWhatsApp();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-[#128C7E] to-[#25D366] text-white text-xs font-bold hover:brightness-110 active:scale-95 transition-all shadow-md shadow-[#25D366]/20 border border-[#25D366]/40 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white text-[#128C7E]" />
              <span>{isBn ? 'সরাসরি WhatsApp চ্যাট' : 'Direct WhatsApp Chat'}</span>
            </button>
          </div>
        )}

        {/* User footer */}
        <div className="p-3.5 border-t border-[#342b40] bg-[#110d17]">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <div className="text-[10px] text-[#a69ab1]">Signed in as</div>
              <div className="text-xs font-semibold text-white truncate">{userName}</div>
            </div>
            <button
              onClick={onLogout}
              title="Logout"
              className="p-1.5 rounded-lg text-[#a69ab1] hover:text-[#ff6b83] hover:bg-[#2b1720] transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
