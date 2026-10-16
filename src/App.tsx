import React, { useState, useEffect } from 'react';
import {
  PageId,
  Language,
  Merchant,
  Website,
  LandingPage,
  Product,
  Order,
  CourierService,
  ExchangeRecord,
  StaffMember,
  SystemConfig,
  OrderStatus,
  PosTransaction,
  PreOrder,
  ReturnRefund,
  ProductVariant,
  ProductBundle,
  StockAuditRecord,
  PriceChangeRecord,
  CodSettlement,
  Supplier,
  PurchaseOrder,
  Warehouse,
  ExpenseRecord,
  ReconciliationRecord,
  CrmCustomer,
  PromoCode,
  FlashSale,
  GiftCard,
  LoyaltyAccount,
  AffiliatePartner,
  MarketingCampaign,
  SupportTicket,
  WholesaleBuyer,
  TrackingPixel,
  ApprovalRequest,
  AuditLogEntry,
  ApiWebhook,
  DocumentFile,
  WebsiteLead,
} from './types';
import {
  getStoredData,
  setStoredData,
  initializeStorage,
} from './utils/storage';
import {
  INITIAL_CONFIG,
  INITIAL_MERCHANTS,
  INITIAL_WEBSITES,
  INITIAL_LANDINGS,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_COURIERS,
  INITIAL_EXCHANGES,
  INITIAL_STAFF,
  INITIAL_POS_TRANSACTIONS,
  INITIAL_PREORDERS,
  INITIAL_RETURNS,
  INITIAL_VARIANTS,
  INITIAL_BUNDLES,
  INITIAL_STOCK_AUDITS,
  INITIAL_PRICE_HISTORY,
  INITIAL_COD_SETTLEMENTS,
  INITIAL_SUPPLIERS,
  INITIAL_PURCHASES,
  INITIAL_WAREHOUSES,
  INITIAL_EXPENSES,
  INITIAL_RECONCILIATION,
  INITIAL_CRM_CUSTOMERS,
  INITIAL_PROMO_CODES,
  INITIAL_FLASH_SALES,
  INITIAL_GIFT_CARDS,
  INITIAL_LOYALTY,
  INITIAL_AFFILIATES,
  INITIAL_CAMPAIGNS,
  INITIAL_TICKETS,
  INITIAL_WHOLESALE,
  INITIAL_PIXELS,
  INITIAL_APPROVALS,
  INITIAL_AUDIT_LOGS,
  INITIAL_WEBHOOKS,
  INITIAL_DOCUMENTS,
  INITIAL_WEBSITE_LEADS,
} from './data/initialData';

import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { ToastContainer, ToastMessage } from './components/Toast';
import { InvoiceModal } from './components/InvoiceModal';
import { CourierExportModal } from './components/CourierExportModal';
import { CodeExportModal } from './components/CodeExportModal';
import { WhatsAppChatModal } from './components/WhatsAppChatModal';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { DomainSetupModal } from './components/DomainSetupModal';

import { LoginView } from './views/LoginView';
import { DashboardView } from './views/DashboardView';
import { OrdersView } from './views/OrdersView';
import { ManualOrderView } from './views/ManualOrderView';
import { ProductsView } from './views/ProductsView';
import { MerchantsView } from './views/MerchantsView';
import { WebsitesView } from './views/WebsitesView';
import { LandingsView } from './views/LandingsView';
import { DeliverySettingsView } from './views/DeliverySettingsView';
import { CouriersView } from './views/CouriersView';
import { ExchangeView } from './views/ExchangeView';
import { StaffView } from './views/StaffView';
import { SettingsView } from './views/SettingsView';

// Enterprise Views
import { PosBillingView } from './views/PosBillingView';
import { PreOrdersView } from './views/PreOrdersView';
import { ReturnsRefundsView } from './views/ReturnsRefundsView';
import { VariantsBundlesView } from './views/VariantsBundlesView';
import { StockAuditView } from './views/StockAuditView';
import { ImageManagerView } from './views/ImageManagerView';
import { CodSettlementView } from './views/CodSettlementView';
import { SuppliersWarehousesView } from './views/SuppliersWarehousesView';
import { ReportsAccountingView } from './views/ReportsAccountingView';
import { CrmMarketingView } from './views/CrmMarketingView';
import { StorefrontChannelsView } from './views/StorefrontChannelsView';
import { SecuritySystemView } from './views/SecuritySystemView';
import { WebsiteLeadsView } from './views/WebsiteLeadsView';

const getInitialPage = (): PageId => {
  try {
    const hash = window.location.hash.replace('#', '') as PageId;
    const validPages: PageId[] = [
      'dashboard', 'merchants', 'websites', 'landings', 'products', 'orders',
      'manualOrder', 'delivery', 'couriers', 'exchange', 'staff', 'settings',
      'pos', 'preorders', 'returns', 'collections', 'variants', 'bundles',
      'stockAudit', 'priceHistory', 'codSettlement', 'suppliers', 'warehouses',
      'expenses', 'reportsAccounting', 'crm', 'coupons', 'flashSales',
      'giftCards', 'loyalty', 'affiliates', 'marketing', 'tickets',
      'wholesale', 'pixels', 'theme', 'approvals', 'auditLogs', 'apiWebhooks',
      'healthMonitor', 'documents', 'privacy', 'loginAudit', 'imageManager', 'websiteLeads'
    ];
    if (hash && validPages.includes(hash)) return hash;
    const saved = localStorage.getItem('alvina_current_page') as PageId;
    if (saved && validPages.includes(saved)) return saved;
  } catch (e) {
    // ignore
  }
  return 'dashboard';
};

export default function App() {
  useEffect(() => {
    initializeStorage();
  }, []);

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem('alvina_logged_in') === 'yes';
  });

  const [showAppSplash, setShowAppSplash] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAppSplash(false);
    }, 1300);
    return () => clearTimeout(timer);
  }, []);

  const [currentPage, setCurrentPage] = useState<PageId>(getInitialPage);

  const [isSidebarPinned, setIsSidebarPinned] = useState<boolean>(() => {
    const saved = localStorage.getItem('alvina_sidebar_pinned');
    return saved !== null ? saved === 'true' : true;
  });
  const [isSidebarHovered, setIsSidebarHovered] = useState<boolean>(false);

  // Keep page URL hash and localStorage in sync so refresh stays on the exact page
  useEffect(() => {
    try {
      localStorage.setItem('alvina_current_page', currentPage);
      if (window.location.hash.replace('#', '') !== currentPage) {
        window.location.hash = currentPage;
      }
    } catch (e) {
      // ignore
    }
  }, [currentPage]);

  useEffect(() => {
    const handleHashChange = () => {
      try {
        const hash = window.location.hash.replace('#', '') as PageId;
        if (hash && hash !== currentPage) {
          setCurrentPage(hash);
        }
      } catch (e) {
        // ignore
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentPage]);

  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('alvina_lang') as Language) || 'bn';
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const handleToggleSidebarPin = () => {
    setIsSidebarPinned((prev) => {
      const next = !prev;
      localStorage.setItem('alvina_sidebar_pinned', String(next));
      if (!next) {
        setIsSidebarHovered(false);
      }
      return next;
    });
  };

  const navigateTo = (page: PageId) => {
    if (page === 'manualOrder' && currentPage !== 'manualOrder') {
      setOrderToEdit(null);
    }
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
    if (!isSidebarPinned) {
      setIsSidebarHovered(false);
    }
  };

  const handleToggleLanguage = () => {
    const next: Language = lang === 'bn' ? 'en' : 'bn';
    setLang(next);
    localStorage.setItem('alvina_lang', next);
    addToast('info', next === 'bn' ? 'ভাষা পরিবর্তন: বাংলা 🇧🇩' : 'Language switched to English 🇬🇧');
  };

  // Modals state
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);
  const [bulkCourierOrders, setBulkCourierOrders] = useState<Order[] | null>(null);
  const [orderToEdit, setOrderToEdit] = useState<Order | null>(null);
  const [isKeyboardShortcutsOpen, setIsKeyboardShortcutsOpen] = useState(false);
  const [isDomainSetupOpen, setIsDomainSetupOpen] = useState(false);
  const [isGlobalWhatsAppOpen, setIsGlobalWhatsAppOpen] = useState(false);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      const isInput = activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select';

      // Universal Escape key
      if (e.key === 'Escape') {
        if (isKeyboardShortcutsOpen) setIsKeyboardShortcutsOpen(false);
        if (isDomainSetupOpen) setIsDomainSetupOpen(false);
        if (invoiceOrder) setInvoiceOrder(null);
        if (bulkCourierOrders) setBulkCourierOrders(null);
        if (isGlobalWhatsAppOpen) setIsGlobalWhatsAppOpen(false);
        if (isMobileMenuOpen) setIsMobileMenuOpen(false);
        return;
      }

      // Alt + N -> New Order Form
      if (e.altKey && (e.key === 'n' || e.key === 'N')) {
        e.preventDefault();
        navigateTo('manualOrder');
        return;
      }

      // Alt + D -> Dashboard
      if (e.altKey && (e.key === 'd' || e.key === 'D')) {
        e.preventDefault();
        navigateTo('dashboard');
        return;
      }

      // Alt + O -> Orders
      if (e.altKey && (e.key === 'o' || e.key === 'O')) {
        e.preventDefault();
        navigateTo('orders');
        return;
      }

      // Alt + P -> POS Billing
      if (e.altKey && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        navigateTo('pos');
        return;
      }

      // '/' to focus search bar if not typing
      if (e.key === '/' && !isInput) {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
        return;
      }

      // '?' to open keyboard shortcuts cheatsheet if not typing
      if (e.key === '?' && !isInput) {
        e.preventDefault();
        setIsKeyboardShortcutsOpen(true);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isKeyboardShortcutsOpen,
    isDomainSetupOpen,
    invoiceOrder,
    bulkCourierOrders,
    isGlobalWhatsAppOpen,
    isMobileMenuOpen,
  ]);

  // Business state
  const [config, setConfig] = useState<SystemConfig>(() =>
    getStoredData('config', INITIAL_CONFIG)
  );
  const [merchants, setMerchants] = useState<Merchant[]>(() =>
    getStoredData('merchants', INITIAL_MERCHANTS)
  );
  const [websites, setWebsites] = useState<Website[]>(() =>
    getStoredData('websites', INITIAL_WEBSITES)
  );
  const [landings, setLandings] = useState<LandingPage[]>(() =>
    getStoredData('landings', INITIAL_LANDINGS)
  );
  const [products, setProducts] = useState<Product[]>(() =>
    getStoredData('products', INITIAL_PRODUCTS)
  );
  const [orders, setOrders] = useState<Order[]>(() =>
    getStoredData('orders', INITIAL_ORDERS)
  );
  const [couriers, setCouriers] = useState<CourierService[]>(() =>
    getStoredData('couriers', INITIAL_COURIERS)
  );
  const [exchanges, setExchanges] = useState<ExchangeRecord[]>(() =>
    getStoredData('exchanges', INITIAL_EXCHANGES)
  );
  const [staff, setStaff] = useState<StaffMember[]>(() =>
    getStoredData('staff', INITIAL_STAFF)
  );

  // Enterprise modules state
  const [posTransactions, setPosTransactions] = useState<PosTransaction[]>(() =>
    getStoredData('pos', INITIAL_POS_TRANSACTIONS)
  );
  const [preorders, setPreorders] = useState<PreOrder[]>(() => {
    const raw = getStoredData('preorders', INITIAL_PREORDERS);
    const seen = new Set<number>();
    const unique = raw.filter((p: PreOrder) => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });
    if (unique.length !== raw.length) {
      setStoredData('preorders', unique);
    }
    return unique;
  });
  const [returns, setReturns] = useState<ReturnRefund[]>(() =>
    getStoredData('returns', INITIAL_RETURNS)
  );
  const [variants, setVariants] = useState<ProductVariant[]>(() =>
    getStoredData('variants', INITIAL_VARIANTS)
  );
  const [bundles, setBundles] = useState<ProductBundle[]>(() =>
    getStoredData('bundles', INITIAL_BUNDLES)
  );
  const [stockAudits, setStockAudits] = useState<StockAuditRecord[]>(() =>
    getStoredData('stockAudit', INITIAL_STOCK_AUDITS)
  );
  const [priceHistory, setPriceHistory] = useState<PriceChangeRecord[]>(() =>
    getStoredData('priceHistory', INITIAL_PRICE_HISTORY)
  );
  const [codSettlements, setCodSettlements] = useState<CodSettlement[]>(() =>
    getStoredData('codSettlement', INITIAL_COD_SETTLEMENTS)
  );
  const [suppliers, setSuppliers] = useState<Supplier[]>(() =>
    getStoredData('suppliers', INITIAL_SUPPLIERS)
  );
  const [purchases, setPurchases] = useState<PurchaseOrder[]>(() =>
    getStoredData('purchases', INITIAL_PURCHASES)
  );
  const [warehouses, setWarehouses] = useState<Warehouse[]>(() =>
    getStoredData('warehouses', INITIAL_WAREHOUSES)
  );
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(() =>
    getStoredData('expenses', INITIAL_EXPENSES)
  );
  const [reconciliations, setReconciliations] = useState<ReconciliationRecord[]>(() =>
    getStoredData('reconciliation', INITIAL_RECONCILIATION)
  );
  const [customers, setCustomers] = useState<CrmCustomer[]>(() =>
    getStoredData('crm', INITIAL_CRM_CUSTOMERS)
  );
  const [coupons, setCoupons] = useState<PromoCode[]>(() =>
    getStoredData('coupons', INITIAL_PROMO_CODES)
  );
  const [flashSales, setFlashSales] = useState<FlashSale[]>(() =>
    getStoredData('flashSales', INITIAL_FLASH_SALES)
  );
  const [giftCards, setGiftCards] = useState<GiftCard[]>(() =>
    getStoredData('giftCards', INITIAL_GIFT_CARDS)
  );
  const [loyalty, setLoyalty] = useState<LoyaltyAccount[]>(() =>
    getStoredData('loyalty', INITIAL_LOYALTY)
  );
  const [affiliates, setAffiliates] = useState<AffiliatePartner[]>(() =>
    getStoredData('affiliates', INITIAL_AFFILIATES)
  );
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>(() =>
    getStoredData('marketing', INITIAL_CAMPAIGNS)
  );
  const [tickets, setTickets] = useState<SupportTicket[]>(() =>
    getStoredData('tickets', INITIAL_TICKETS)
  );
  const [wholesaleBuyers, setWholesaleBuyers] = useState<WholesaleBuyer[]>(() =>
    getStoredData('wholesale', INITIAL_WHOLESALE)
  );
  const [pixels, setPixels] = useState<TrackingPixel[]>(() =>
    getStoredData('pixels', INITIAL_PIXELS)
  );
  const [approvals, setApprovals] = useState<ApprovalRequest[]>(() =>
    getStoredData('approvals', INITIAL_APPROVALS)
  );
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() =>
    getStoredData('auditLogs', INITIAL_AUDIT_LOGS)
  );
  const [webhooks, setWebhooks] = useState<ApiWebhook[]>(() =>
    getStoredData('apiWebhooks', INITIAL_WEBHOOKS)
  );
  const [documents, setDocuments] = useState<DocumentFile[]>(() =>
    getStoredData('documents', INITIAL_DOCUMENTS)
  );
  const [websiteLeads, setWebsiteLeads] = useState<WebsiteLead[]>(() =>
    getStoredData('websiteLeads', INITIAL_WEBSITE_LEADS)
  );
  const [activeTheme, setActiveTheme] = useState<string>(() => {
    return localStorage.getItem('alvina_theme') || 'theme-default';
  });

  const handleSelectTheme = (themeId: string) => {
    setActiveTheme(themeId);
    localStorage.setItem('alvina_theme', themeId);
    addToast('info', 'ড্যাশবোর্ড থিম পরিবর্তিত হয়েছে!');
  };

  const userRole = config.user === 'admin' ? 'Admin' : 'Merchant';

  const addToast = (type: 'success' | 'error' | 'info', text: string) => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleLogin = (user: string, pass: string): boolean => {
    if (user === config.user && pass === config.password) {
      sessionStorage.setItem('alvina_logged_in', 'yes');
      setIsLoggedIn(true);
      addToast('success', `স্বাগতম ${config.user}! অ্যাডমিন প্যানেলে সফলভাবে লগইন হয়েছে।`);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    sessionStorage.removeItem('alvina_logged_in');
    setIsLoggedIn(false);
    addToast('info', 'লগআউট সম্পন্ন হয়েছে।');
  };

  // Updaters
  const updateOrders = (next: Order[]) => {
    setOrders(next);
    setStoredData('orders', next);
  };

  const updateProducts = (next: Product[]) => {
    setProducts(next);
    setStoredData('products', next);
  };

  const updateMerchants = (next: Merchant[]) => {
    setMerchants(next);
    setStoredData('merchants', next);
  };

  const updateWebsites = (next: Website[]) => {
    setWebsites(next);
    setStoredData('websites', next);
  };

  const updateLandings = (next: LandingPage[]) => {
    setLandings(next);
    setStoredData('landings', next);
  };

  const updateCouriers = (next: CourierService[]) => {
    setCouriers(next);
    setStoredData('couriers', next);
  };

  const updateExchanges = (next: ExchangeRecord[]) => {
    setExchanges(next);
    setStoredData('exchanges', next);
  };

  const updateStaff = (next: StaffMember[]) => {
    setStaff(next);
    setStoredData('staff', next);
  };

  const updateConfig = (next: SystemConfig) => {
    setConfig(next);
    setStoredData('config', next);
    addToast('success', 'ডেলিভারি ও সিস্টেম সেটিংস সংরক্ষিত হয়েছে।');
  };

  // Orders
  const handleSaveOrder = (saved: Order) => {
    const exists = orders.some((o) => o.id === saved.id);
    let next: Order[];
    if (exists) {
      next = orders.map((o) => (o.id === saved.id ? saved : o));
      addToast('success', `অর্ডার #${saved.id} সফলভাবে আপডেট হয়েছে।`);
    } else {
      next = [saved, ...orders];
      addToast('success', `নতুন অর্ডার #${saved.id} সফলভাবে তৈরি হয়েছে!`);
    }
    updateOrders(next);
    setOrderToEdit(null);
    setCurrentPage('orders');
  };

  const handleDeleteOrder = (orderId: number) => {
    const next = orders.filter((o) => o.id !== orderId);
    updateOrders(next);
    addToast('success', `অর্ডার #${orderId} মুছে ফেলা হয়েছে।`);
  };

  const handleUpdateOrderStatus = (orderId: number, status: OrderStatus) => {
    const next = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
    updateOrders(next);
    addToast('success', `Order #${orderId} এর স্ট্যাটাস "${status}" করা হয়েছে।`);
  };

  const handleEditOrder = (order: Order) => {
    setOrderToEdit(order);
    setCurrentPage('manualOrder');
  };

  // POS
  const handleSavePosTransaction = (tx: PosTransaction) => {
    const next = [tx, ...posTransactions];
    setPosTransactions(next);
    setStoredData('pos', next);
    addToast('success', `কাউন্টার রসিদ #${tx.id} সফলভাবে তৈরি হয়েছে!`);
  };

  // Pre-orders
  const handleSavePreorder = (po: PreOrder) => {
    const exists = preorders.some((p) => p.id === po.id);
    const next = exists
      ? preorders.map((p) => (p.id === po.id ? po : p))
      : [po, ...preorders];
    setPreorders(next);
    setStoredData('preorders', next);
    addToast('success', exists ? 'প্রি-অর্ডার আপডেট হয়েছে।' : 'নতুন প্রি-অর্ডার সংরক্ষিত হয়েছে।');
  };

  const handleDeletePreorder = (id: number) => {
    const next = preorders.filter((p) => p.id !== id);
    setPreorders(next);
    setStoredData('preorders', next);
    addToast('info', 'প্রি-অর্ডার মুছে ফেলা হয়েছে।');
  };

  // Returns
  const handleSaveReturn = (r: ReturnRefund) => {
    const exists = returns.some((it) => it.id === r.id);
    const next = exists
      ? returns.map((it) => (it.id === r.id ? r : it))
      : [r, ...returns];
    setReturns(next);
    setStoredData('returns', next);
    addToast('success', exists ? `রিটার্ন রিকোয়েস্ট #${r.orderId} আপডেট হয়েছে।` : `রিটার্ন রিকোয়েস্ট #${r.orderId} যুক্ত হয়েছে।`);
  };

  const handleUpdateReturnStatus = (id: number, status: ReturnRefund['status']) => {
    const next = returns.map((r) => (r.id === id ? { ...r, status } : r));
    setReturns(next);
    setStoredData('returns', next);
    addToast('success', `রিটার্ন স্ট্যাটাস "${status}" আপডেট হয়েছে।`);
  };

  const handleDeleteReturn = (id: number) => {
    const next = returns.filter((r) => r.id !== id);
    setReturns(next);
    setStoredData('returns', next);
  };

  // Variants & Bundles
  const handleSaveVariant = (v: ProductVariant) => {
    const exists = variants.some((it) => it.id === v.id);
    const next = exists
      ? variants.map((it) => (it.id === v.id ? v : it))
      : [v, ...variants];
    setVariants(next);
    setStoredData('variants', next);
    addToast('success', `ভ্যারিয়েন্ট "${v.color} - ${v.size}" সংরক্ষিত হয়েছে।`);
  };

  const handleDeleteVariant = (id: number) => {
    const next = variants.filter((v) => v.id !== id);
    setVariants(next);
    setStoredData('variants', next);
  };

  const handleSaveBundle = (b: ProductBundle) => {
    const exists = bundles.some((it) => it.id === b.id);
    const next = exists
      ? bundles.map((it) => (it.id === b.id ? b : it))
      : [b, ...bundles];
    setBundles(next);
    setStoredData('bundles', next);
    addToast('success', `বান্ডেল প্যাক "${b.name}" সংরক্ষিত হয়েছে!`);
  };

  const handleDeleteBundle = (id: number) => {
    const next = bundles.filter((b) => b.id !== id);
    setBundles(next);
    setStoredData('bundles', next);
  };

  // Stock Audit & Price History
  const handleSaveStockAudit = (rec: StockAuditRecord) => {
    const next = [rec, ...stockAudits];
    setStockAudits(next);
    setStoredData('stockAudit', next);
    addToast('success', 'ইনভেন্টরি স্টক অডিট রেকর্ড সেভ হয়েছে।');
  };

  const handleSavePriceChange = (rec: PriceChangeRecord) => {
    const next = [rec, ...priceHistory];
    setPriceHistory(next);
    setStoredData('priceHistory', next);
    addToast('success', 'মূল্য পরিবর্তন হিস্ট্রি লগ হয়েছে।');
  };

  // COD Settlement
  const handleSaveCodSettlement = (st: CodSettlement) => {
    const next = [st, ...codSettlements];
    setCodSettlements(next);
    setStoredData('codSettlement', next);
    addToast('success', `কুরিয়ার সেটেলমেন্ট #${st.referenceId} সেভ হয়েছে!`);
  };

  // Suppliers & Warehouses
  const handleSaveSupplier = (s: Supplier) => {
    const next = [...suppliers, s];
    setSuppliers(next);
    setStoredData('suppliers', next);
    addToast('success', `সাপ্লায়ার "${s.companyName}" যুক্ত হয়েছে।`);
  };

  const handleSaveWarehouse = (w: Warehouse) => {
    const next = [...warehouses, w];
    setWarehouses(next);
    setStoredData('warehouses', next);
    addToast('success', `আউটলেট/হাব "${w.name}" যুক্ত হয়েছে।`);
  };

  // Expenses & Reconciliation
  const handleSaveExpense = (exp: ExpenseRecord) => {
    const next = [exp, ...expenses];
    setExpenses(next);
    setStoredData('expenses', next);
    addToast('success', `খরচ ৳${exp.amount} যুক্ত হয়েছে।`);
  };

  const handleSaveReconciliation = (rec: ReconciliationRecord) => {
    const next = [rec, ...reconciliations];
    setReconciliations(next);
    setStoredData('reconciliation', next);
    addToast('success', 'রিকনসিলিয়েশন রেকর্ড সেভ হয়েছে।');
  };

  // CRM & Fraud Blacklist
  const handleToggleBlacklist = (customerId: number) => {
    const next = customers.map((c) =>
      c.id === customerId ? { ...c, isBlacklisted: !c.isBlacklisted } : c
    );
    setCustomers(next);
    setStoredData('crm', next);
    const updated = next.find((c) => c.id === customerId);
    addToast(
      updated?.isBlacklisted ? 'error' : 'success',
      updated?.isBlacklisted ? 'কাস্টমার নম্বর ব্লকলিস্ট করা হয়েছে।' : 'ব্লকলিস্ট প্রত্যাহার করা হয়েছে।'
    );
  };

  const handleSaveCoupon = (cp: PromoCode) => {
    const next = [cp, ...coupons];
    setCoupons(next);
    setStoredData('coupons', next);
    addToast('success', `কুপন কোড "${cp.code}" তৈরি হয়েছে!`);
  };

  const handleSaveCampaign = (cmp: MarketingCampaign) => {
    const next = [cmp, ...campaigns];
    setCampaigns(next);
    setStoredData('marketing', next);
    addToast('success', `ক্যাম্পেইন "${cmp.name}" তৈরি হয়েছে!`);
  };

  // Wholesale & Pixels
  const handleSaveWholesale = (wb: WholesaleBuyer) => {
    const next = [...wholesaleBuyers, wb];
    setWholesaleBuyers(next);
    setStoredData('wholesale', next);
    addToast('success', `পাইকারি বায়ার "${wb.businessName}" অনুমোদিত হয়েছে।`);
  };

  const handleSavePixel = (tp: TrackingPixel) => {
    const next = [...pixels, tp];
    setPixels(next);
    setStoredData('pixels', next);
    addToast('success', 'পিক্সেল ট্র্যাকিং কনফিগারেশন সংরক্ষিত হয়েছে।');
  };

  // Approvals
  const handleUpdateApproval = (id: number, status: 'Approved' | 'Rejected') => {
    const next = approvals.map((a) =>
      a.id === id ? { ...a, status, actionedBy: config.user } : a
    );
    setApprovals(next);
    setStoredData('approvals', next);
    addToast('success', `অনুমোদন স্ট্যাটাস "${status}" হয়েছে।`);
  };

  const handleDeleteDocument = (id: number) => {
    const next = documents.filter((d) => d.id !== id);
    setDocuments(next);
    setStoredData('documents', next);
    addToast('info', 'ডকুমেন্ট ফাইল মুছে ফেলা হয়েছে।');
  };

  // Export CSV
  const handleExportCSV = () => {
    if (orders.length === 0) {
      addToast('info', 'এক্সপোর্ট করার জন্য কোনো অর্ডার নেই।');
      return;
    }

    const headers = [
      'Order ID',
      'Date',
      'Customer',
      'Phone',
      'Address',
      'Products',
      'Area',
      'Method',
      'Payment',
      'Subtotal',
      'Delivery',
      'Discount',
      'Total',
      'Advance',
      'Due COD',
      'Status',
      'Courier',
      'Shipping Note',
    ];

    const rows = orders.map((o) => [
      o.id,
      new Date(o.date).toLocaleDateString(),
      o.customer,
      o.phone,
      o.address,
      o.items.map((i) => `${i.name} (x${i.qty})`).join('; '),
      o.area,
      o.deliveryMethod,
      o.paymentMethod,
      o.subtotal,
      o.charge,
      o.discount,
      o.total,
      o.advance,
      o.due,
      o.status,
      o.courierService || '',
      o.shippingNote || '',
    ]);

    const csvContent =
      '\uFEFF' +
      [headers, ...rows]
        .map((r) => r.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(','))
        .join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `alvina-orders-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addToast('success', 'Orders CSV সফলভাবে ডাউনলোড হয়েছে।');
  };

  // Backup & Restore
  const handleBackupJSON = () => {
    const dump = {
      version: '2.5-enterprise',
      exportedAt: new Date().toISOString(),
      config,
      merchants,
      websites,
      landings,
      products,
      orders,
      couriers,
      exchanges,
      staff,
      posTransactions,
      preorders,
      returns,
      variants,
      bundles,
      stockAudits,
      priceHistory,
      codSettlements,
      suppliers,
      purchases,
      warehouses,
      expenses,
      reconciliations,
      customers,
      coupons,
      flashSales,
      giftCards,
      loyalty,
      affiliates,
      campaigns,
      tickets,
      wholesaleBuyers,
      pixels,
      approvals,
      auditLogs,
      webhooks,
      documents,
    };

    const jsonString = JSON.stringify(dump, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `alvina-backup-all-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addToast('success', 'সম্পূর্ণ সিস্টেম ব্যাকআপ JSON ডাউনলোড হয়েছে।');
  };

  const handleRestoreJSON = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        if (parsed.merchants) updateMerchants(parsed.merchants);
        if (parsed.websites) updateWebsites(parsed.websites);
        if (parsed.landings) updateLandings(parsed.landings);
        if (parsed.products) updateProducts(parsed.products);
        if (parsed.orders) updateOrders(parsed.orders);
        if (parsed.couriers) updateCouriers(parsed.couriers);
        if (parsed.exchanges) updateExchanges(parsed.exchanges);
        if (parsed.staff) updateStaff(parsed.staff);
        if (parsed.posTransactions) {
          setPosTransactions(parsed.posTransactions);
          setStoredData('pos', parsed.posTransactions);
        }
        if (parsed.expenses) {
          setExpenses(parsed.expenses);
          setStoredData('expenses', parsed.expenses);
        }
        if (parsed.config) {
          setConfig(parsed.config);
          setStoredData('config', parsed.config);
        }
        addToast('success', 'ব্যাকআপ ফাইল থেকে সফলভাবে ডেটা রিস্টোর করা হয়েছে!');
      } catch (err) {
        addToast('error', 'ব্যাকআপ ফাইলটি সঠিক নয় অথবা নষ্ট হয়েছে।');
      }
    };
    reader.readAsText(file);
  };

  const handleClearAllData = () => {
    updateMerchants([]);
    updateWebsites([]);
    updateLandings([]);
    updateProducts([]);
    updateOrders([]);
    updateExchanges([]);
    setPosTransactions([]);
    setPreorders([]);
    setExpenses([]);
    addToast('info', 'সকল ব্যবসায়িক তথ্য মুছে ফেলা হয়েছে।');
  };

  if (!isLoggedIn) {
    return (
      <>
        <LoginView onLogin={handleLogin} />
        <ToastContainer toasts={toasts} onDismiss={removeToast} />
      </>
    );
  }

  const pendingOrdersCount = orders.filter(
    (o) => !['Delivered', 'Cancelled'].includes(o.status)
  ).length;

  const pendingApprovalsCount = approvals.filter((a) => a.status === 'Pending').length;

  return (
    <div className={`min-h-screen ${activeTheme} bg-[#100e16] text-[#f7f2fb] flex font-['Hind_Siliguri','Plus_Jakarta_Sans',sans-serif]`}>
      {/* Grand Opening Logo Splash Visual */}
      {showAppSplash && (
        <div
          onClick={() => setShowAppSplash(false)}
          className="fixed inset-0 z-50 bg-[#0e0a15] flex flex-col items-center justify-center p-6 cursor-pointer select-none animate-in fade-in duration-300"
        >
          <div className="relative mb-6">
            <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-[#69298a] via-[#bd70df] to-[#f4b8ff] p-0.5 shadow-2xl shadow-[#bd70df]/50 animate-pulse">
              <div className="w-full h-full bg-[#140c1e] rounded-[22px] flex items-center justify-center border border-[#e6b4fa]/30">
                <span className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-[#f3d4ff] to-[#bd70df] font-['Plus_Jakarta_Sans'] tracking-wider">
                  A
                </span>
              </div>
            </div>
            {/* Pulsating glowing aura rings */}
            <div className="absolute -inset-4 rounded-3xl border-2 border-[#bd70df]/40 animate-ping pointer-events-none opacity-30" />
            <div className="absolute -inset-8 rounded-full bg-[#bd70df]/20 blur-2xl pointer-events-none" />
          </div>

          <div className="text-center space-y-1.5 animate-in slide-in-from-bottom-3 duration-500">
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-4xl font-extrabold tracking-widest text-white font-['Plus_Jakarta_Sans'] drop-shadow-md">
                ALVINA
              </h1>
              <span className="text-3xl font-light text-[#bd70df] font-['Plus_Jakarta_Sans']">
                COMMERCE
              </span>
            </div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#d99ff5] font-semibold">
              Boutique & Enterprise Store Portal
            </p>
          </div>

          <div className="flex items-center gap-2 pt-6">
            <span className="w-2 h-2 rounded-full bg-[#bd70df] animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 rounded-full bg-[#bd70df] animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 rounded-full bg-[#bd70df] animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <div className="text-[11px] text-[#7d6f8a] mt-4 font-mono">
            {lang === 'bn' ? 'এডমিন প্যানেল লোড হচ্ছে... (ক্লিক করে স্কিপ করুন)' : 'Loading Admin Portal... (Click to skip)'}
          </div>
        </div>
      )}

      {/* Toast Alert System */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Printable Invoice / Packing Slip Modal */}
      <InvoiceModal
        order={invoiceOrder}
        config={config}
        onClose={() => setInvoiceOrder(null)}
      />

      {/* Bulk Courier Consignment Export Modal */}
      {bulkCourierOrders && (
        <CourierExportModal
          orders={bulkCourierOrders}
          onClose={() => setBulkCourierOrders(null)}
          onCopySuccess={() => addToast('success', 'কুরিয়ার বাল্ক ডাটা ক্লিপবোর্ডে কপি হয়েছে!')}
        />
      )}

      {/* Global WhatsApp Chat Modal */}
      {isGlobalWhatsAppOpen && (
        <WhatsAppChatModal
          isOpen={true}
          onClose={() => setIsGlobalWhatsAppOpen(false)}
        />
      )}

      {/* Keyboard Shortcuts Cheatsheet Modal */}
      <KeyboardShortcutsModal
        isOpen={isKeyboardShortcutsOpen}
        onClose={() => setIsKeyboardShortcutsOpen(false)}
      />

      {/* Domain & Deployment Wizard Modal */}
      <DomainSetupModal
        isOpen={isDomainSetupOpen}
        onClose={() => setIsDomainSetupOpen(false)}
      />

      {/* Sidebar Navigation */}
      <Sidebar
        currentPage={currentPage}
        lang={lang}
        onToggleLanguage={handleToggleLanguage}
        onNavigate={navigateTo}
        onLogout={handleLogout}
        userName={config.user}
        userRole={userRole}
        onOpenWhatsApp={() => setIsGlobalWhatsAppOpen(true)}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        isPinned={isSidebarPinned}
        onTogglePin={handleToggleSidebarPin}
        isHovered={isSidebarHovered}
        onHoverChange={setIsSidebarHovered}
        pendingOrdersCount={pendingOrdersCount}
        pendingApprovalsCount={pendingApprovalsCount}
      />

      {/* Main Content Viewport */}
      <div className={`flex-1 ${isSidebarPinned ? 'lg:ml-72' : 'lg:ml-0'} flex flex-col min-w-0 transition-all duration-300 ease-out`}>
        <TopBar
          currentPage={currentPage}
          lang={lang}
          onToggleLanguage={handleToggleLanguage}
          onNavigate={navigateTo}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onExportCSV={handleExportCSV}
          onLogout={handleLogout}
          orders={orders}
          products={products}
          activeTheme={activeTheme}
          onSelectTheme={handleSelectTheme}
          onOpenWhatsApp={() => setIsGlobalWhatsAppOpen(true)}
          onOpenKeyboardShortcuts={() => setIsKeyboardShortcutsOpen(true)}
          onOpenDomainSetup={() => setIsDomainSetupOpen(true)}
          isSidebarCollapsed={!isSidebarPinned}
          onToggleSidebarCollapse={handleToggleSidebarPin}
        />

        <main key={currentPage} className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto pb-16 animate-in fade-in duration-300 fill-mode-both">
          {/* Core Operations */}
          {currentPage === 'dashboard' && (
            <DashboardView
              orders={orders}
              merchants={merchants}
              products={products}
              crmCustomers={customers}
              onNavigate={navigateTo}
              onSelectOrderForInvoice={(o) => setInvoiceOrder(o)}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onSaveProduct={(prod) => {
                const exists = products.some((p) => p.id === prod.id);
                const next = exists
                  ? products.map((p) => (p.id === prod.id ? prod : p))
                  : [prod, ...products];
                updateProducts(next);
                addToast('success', `প্রোডাক্ট "${prod.name}" সেভ হয়েছে।`);
              }}
            />
          )}

          {currentPage === 'orders' && (
            <OrdersView
              orders={orders}
              config={config}
              onEditOrder={handleEditOrder}
              onDeleteOrder={handleDeleteOrder}
              onUpdateStatus={handleUpdateOrderStatus}
              onOpenInvoice={(o) => setInvoiceOrder(o)}
              onNewOrder={() => {
                setOrderToEdit(null);
                setCurrentPage('manualOrder');
              }}
              onOpenBulkCourier={(sel) => setBulkCourierOrders(sel)}
            />
          )}

          {currentPage === 'manualOrder' && (
            <ManualOrderView
              products={products}
              couriers={couriers}
              config={config}
              initialOrderToEdit={orderToEdit}
              onSaveOrder={handleSaveOrder}
              onCancel={() => {
                setOrderToEdit(null);
                setCurrentPage('orders');
              }}
            />
          )}

          {currentPage === 'pos' && (
            <PosBillingView
              products={products}
              posTransactions={posTransactions}
              config={config}
              userRole={userRole}
              onSaveTransaction={handleSavePosTransaction}
              onNavigateToExchange={() => setCurrentPage('exchange')}
            />
          )}

          {currentPage === 'preorders' && (
            <PreOrdersView
              preorders={preorders}
              userRole={userRole}
              onSavePreorder={handleSavePreorder}
              onDeletePreorder={handleDeletePreorder}
              onConvertToRegularOrder={(po) => {
                const newOrder: Order = {
                  id: orders.length > 0 ? Math.max(...orders.map((o) => o.id)) + 1 : 98450,
                  customer: po.customer,
                  phone: po.phone,
                  address: po.customerAddress || 'Showroom Collection / Adabor Outlet',
                  area: 'dhaka',
                  source: po.type === 'Online Preorder' ? 'Website' : 'Manual',
                  deliveryMethod: 'Home Delivery',
                  paymentMethod: 'Cash on Delivery',
                  items: [
                    {
                      productId: 1,
                      name: po.productName,
                      qty: 1,
                      price: po.totalPrice,
                      size: po.size,
                    },
                  ],
                  dressSize: po.size,
                  subtotal: po.totalPrice,
                  charge: 80,
                  discount: 0,
                  total: po.totalPrice + 80,
                  advance: po.advancePaid,
                  due: Math.max(0, po.totalPrice + 80 - po.advancePaid),
                  status: 'Processing',
                  courierService: config.defaultCourier || 'Steadfast Courier',
                  note: `প্রি-অর্ডার থেকে স্থানান্তরিত (Pre-Order #${po.id}) - সাইজ: ${po.size}`,
                  date: new Date().toISOString().slice(0, 10),
                };
                handleSaveOrder(newOrder);
                // Mark preorder as ready
                handleSavePreorder({ ...po, status: 'Ready to Dispatch' });
                addToast('success', `প্রি-অর্ডার #${po.id} মূল অর্ডার লিস্টে স্থানান্তরিত হয়েছে!`);
                setCurrentPage('orders');
              }}
            />
          )}

          {currentPage === 'returns' && (
            <ReturnsRefundsView
              returns={returns}
              products={products}
              onSaveReturn={handleSaveReturn}
              onUpdateStatus={handleUpdateReturnStatus}
              onDeleteReturn={handleDeleteReturn}
              onNavigateToExchange={() => setCurrentPage('exchange')}
            />
          )}

          {currentPage === 'exchange' && (
            <ExchangeView
              exchanges={exchanges}
              onSaveExchange={(rec) => {
                const next = [rec, ...exchanges];
                setExchanges(next);
                setStoredData('exchanges', next);
                addToast('success', `এক্সচেঞ্জ #${rec.orderId} সংরক্ষিত হয়েছে।`);
              }}
              onDeleteExchange={(id) => {
                const next = exchanges.filter((x) => x.id !== id);
                setExchanges(next);
                setStoredData('exchanges', next);
              }}
              onNavigateToReturns={() => setCurrentPage('returns')}
            />
          )}

          {/* Catalog & Inventory */}
          {currentPage === 'products' && (
            <ProductsView
              products={products}
              onSaveProduct={(prod) => {
                const exists = products.some((p) => p.id === prod.id);
                const next = exists
                  ? products.map((p) => (p.id === prod.id ? prod : p))
                  : [prod, ...products];
                updateProducts(next);
                addToast('success', `প্রোডাক্ট "${prod.name}" সেভ হয়েছে।`);
              }}
              onDeleteProduct={(id) => {
                const next = products.filter((p) => p.id !== id);
                updateProducts(next);
                addToast('info', 'প্রোডাক্ট মুছে ফেলা হয়েছে।');
              }}
            />
          )}

          {(currentPage === 'variants' || currentPage === 'bundles') && (
            <VariantsBundlesView
              products={products}
              variants={variants}
              bundles={bundles}
              onSaveVariant={handleSaveVariant}
              onDeleteVariant={handleDeleteVariant}
              onSaveBundle={handleSaveBundle}
              onDeleteBundle={handleDeleteBundle}
              initialTab={currentPage === 'variants' ? 'variants' : 'bundles'}
            />
          )}

          {(currentPage === 'stockAudit' || currentPage === 'priceHistory') && (
            <StockAuditView
              products={products}
              audits={stockAudits}
              priceHistory={priceHistory}
              onSaveAudit={handleSaveStockAudit}
              onSavePriceChange={handleSavePriceChange}
              initialTab={currentPage === 'stockAudit' ? 'stockAudit' : 'priceHistory'}
            />
          )}

          {currentPage === 'imageManager' && (
            <ImageManagerView
              products={products}
              onUploadImage={(dataUrl, name) => {
                addToast('success', `ছবি "${name}" আপলোড সফল হয়েছে!`);
              }}
            />
          )}

          {/* Logistics & Supply */}
          {currentPage === 'couriers' && (
            <CouriersView
              couriers={couriers}
              userRole={userRole}
              onSaveCourier={(c) => {
                const exists = couriers.some((item) => item.id === c.id);
                const next = exists
                  ? couriers.map((item) => (item.id === c.id ? c : item))
                  : [...couriers, c];
                updateCouriers(next);
                addToast('success', `কুরিয়ার "${c.name}" সেভ হয়েছে।`);
              }}
              onDeleteCourier={(id) => {
                const next = couriers.filter((c) => c.id !== id);
                updateCouriers(next);
              }}
            />
          )}

          {currentPage === 'codSettlement' && (
            <CodSettlementView
              settlements={codSettlements}
              onSaveSettlement={handleSaveCodSettlement}
            />
          )}

          {(currentPage === 'suppliers' || currentPage === 'warehouses') && (
            <SuppliersWarehousesView
              suppliers={suppliers}
              purchases={purchases}
              warehouses={warehouses}
              userRole={userRole}
              onSaveSupplier={handleSaveSupplier}
              onSavePurchase={(po) => {
                const next = [po, ...purchases];
                setPurchases(next);
                setStoredData('purchases', next);
                addToast('success', `পারচেজ অর্ডার #${po.invoiceNo} যুক্ত হয়েছে।`);
              }}
              onSaveWarehouse={handleSaveWarehouse}
              initialTab={currentPage === 'suppliers' ? 'suppliers' : 'warehouses'}
            />
          )}

          {currentPage === 'delivery' && (
            <DeliverySettingsView config={config} onSaveConfig={updateConfig} />
          )}

          {/* Finance & Accounts */}
          {(currentPage === 'reports' ||
            currentPage === 'accounting' ||
            currentPage === 'expenses' ||
            currentPage === 'reconciliation') && (
            <ReportsAccountingView
              orders={orders}
              expenses={expenses}
              reconciliations={reconciliations}
              config={config}
              onSaveExpense={handleSaveExpense}
              onSaveReconciliation={handleSaveReconciliation}
              initialTab={
                currentPage === 'reports'
                  ? 'reports'
                  : currentPage === 'accounting'
                  ? 'accounting'
                  : currentPage === 'expenses'
                  ? 'expenses'
                  : 'reconciliation'
              }
            />
          )}

          {/* Website Leads & Abandoned Cart Recovery */}
          {currentPage === 'websiteLeads' && (
            <WebsiteLeadsView
              leads={websiteLeads}
              onSaveLead={(lead) => {
                const exists = websiteLeads.some((l) => l.id === lead.id);
                const next = exists
                  ? websiteLeads.map((l) => (l.id === lead.id ? lead : l))
                  : [lead, ...websiteLeads];
                setWebsiteLeads(next);
                setStoredData('websiteLeads', next);
                addToast('success', 'ওয়েবসাইট ভিজিটর লিড সেভ হয়েছে।');
              }}
              onDeleteLead={(id) => {
                const next = websiteLeads.filter((l) => l.id !== id);
                setWebsiteLeads(next);
                setStoredData('websiteLeads', next);
                addToast('info', 'লিড মুছে ফেলা হয়েছে।');
              }}
              onConvertToOrder={(lead) => {
                setCurrentPage('manualOrder');
                addToast('info', `${lead.name}-এর জন্য অর্ডার প্রস্তুত করা হচ্ছে...`);
              }}
            />
          )}

          {/* CRM & Marketing */}
          {(currentPage === 'crm' ||
            currentPage === 'coupons' ||
            currentPage === 'flashSales' ||
            currentPage === 'giftCards' ||
            currentPage === 'loyalty' ||
            currentPage === 'affiliates' ||
            currentPage === 'marketing' ||
            currentPage === 'tickets') && (
            <CrmMarketingView
              customers={customers}
              coupons={coupons}
              flashSales={flashSales}
              giftCards={giftCards}
              loyalty={loyalty}
              affiliates={affiliates}
              campaigns={campaigns}
              tickets={tickets}
              userRole={userRole}
              onToggleBlacklist={handleToggleBlacklist}
              onSaveCoupon={handleSaveCoupon}
              onSaveCampaign={handleSaveCampaign}
              initialTab={
                currentPage === 'crm'
                  ? 'crm'
                  : currentPage === 'coupons'
                  ? 'coupons'
                  : currentPage === 'flashSales'
                  ? 'flashSales'
                  : currentPage === 'giftCards'
                  ? 'giftCards'
                  : currentPage === 'loyalty'
                  ? 'loyalty'
                  : currentPage === 'affiliates'
                  ? 'affiliates'
                  : currentPage === 'marketing'
                  ? 'marketing'
                  : 'tickets'
              }
            />
          )}

          {/* Storefront & Channels */}
          {currentPage === 'merchants' && (
            <MerchantsView
              merchants={merchants}
              onSaveMerchant={(m) => {
                const exists = merchants.some((item) => item.id === m.id);
                const next = exists
                  ? merchants.map((item) => (item.id === m.id ? m : item))
                  : [...merchants, m];
                updateMerchants(next);
                addToast('success', `মার্চেন্ট "${m.name}" সেভ হয়েছে।`);
              }}
              onDeleteMerchant={(id) => {
                const next = merchants.filter((m) => m.id !== id);
                updateMerchants(next);
              }}
            />
          )}

          {currentPage === 'websites' && (
            <WebsitesView
              websites={websites}
              merchants={merchants}
              onSaveWebsite={(w) => {
                const next = [...websites, w];
                updateWebsites(next);
                addToast('success', `ওয়েবসাইট "${w.name}" সেভ হয়েছে।`);
              }}
              onDeleteWebsite={(id) => {
                const next = websites.filter((w) => w.id !== id);
                updateWebsites(next);
              }}
            />
          )}

          {currentPage === 'landings' && (
            <LandingsView
              landings={landings}
              merchants={merchants}
              onSaveLanding={(l) => {
                const next = [...landings, l];
                updateLandings(next);
                addToast('success', `ল্যান্ডিং পেজ "${l.name}" সেভ হয়েছে।`);
              }}
              onDeleteLanding={(id) => {
                const next = landings.filter((l) => l.id !== id);
                updateLandings(next);
              }}
            />
          )}

          {(currentPage === 'wholesale' || currentPage === 'pixels' || currentPage === 'theme') && (
            <StorefrontChannelsView
              wholesaleBuyers={wholesaleBuyers}
              pixels={pixels}
              config={config}
              onSaveWholesale={handleSaveWholesale}
              onSavePixel={handleSavePixel}
              onSaveConfig={updateConfig}
              initialTab={
                currentPage === 'wholesale'
                  ? 'wholesale'
                  : currentPage === 'pixels'
                  ? 'pixels'
                  : 'theme'
              }
            />
          )}

          {/* Security & System */}
          {currentPage === 'staff' && (
            <StaffView
              staff={staff}
              onSaveStaff={(s) => {
                const exists = staff.some((item) => item.id === s.id);
                const next = exists
                  ? staff.map((item) => (item.id === s.id ? s : item))
                  : [...staff, s];
                updateStaff(next);
                addToast('success', `স্টাফ "${s.name}" সেভ হয়েছে।`);
              }}
              onDeleteStaff={(id) => {
                const next = staff.filter((s) => s.id !== id);
                updateStaff(next);
              }}
            />
          )}

          {(currentPage === 'approvals' ||
            currentPage === 'auditLogs' ||
            currentPage === 'loginAudit' ||
            currentPage === 'apiWebhooks' ||
            currentPage === 'healthMonitor' ||
            currentPage === 'documents' ||
            currentPage === 'privacy') && (
            <SecuritySystemView
              approvals={approvals}
              auditLogs={auditLogs}
              webhooks={webhooks}
              documents={documents}
              config={config}
              userRole={userRole}
              onUpdateApproval={handleUpdateApproval}
              onDeleteDocument={handleDeleteDocument}
              initialTab={
                currentPage === 'approvals'
                  ? 'approvals'
                  : currentPage === 'loginAudit'
                  ? 'loginAudit'
                  : currentPage === 'auditLogs'
                  ? 'auditLogs'
                  : currentPage === 'apiWebhooks'
                  ? 'apiWebhooks'
                  : currentPage === 'healthMonitor'
                  ? 'healthMonitor'
                  : currentPage === 'documents'
                  ? 'documents'
                  : 'privacy'
              }
            />
          )}

          {currentPage === 'settings' && (
            <SettingsView
              config={config}
              onUpdateCredentials={(newUser, newPass) => {
                const updated: SystemConfig = { ...config, user: newUser, password: newPass };
                setConfig(updated);
                setStoredData('config', updated);
                addToast('success', 'লগইন তথ্য সফলভাবে পরিবর্তিত হয়েছে।');
                setTimeout(() => handleLogout(), 1500);
                return true;
              }}
              onExportCSV={handleExportCSV}
              onClearAllData={handleClearAllData}
              onBackupJSON={handleBackupJSON}
              onRestoreJSON={handleRestoreJSON}
              onOpenDomainWizard={() => setIsDomainSetupOpen(true)}
            />
          )}
        </main>
      </div>
    </div>
  );
}
