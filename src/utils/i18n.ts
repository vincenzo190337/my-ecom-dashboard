export type Language = 'bn' | 'en';

export const BOUTIQUE_SIZES = [
  '36',
  '38',
  '40',
  '42',
  '44',
  '46',
  '48',
  '50',
  '52',
  '54',
  '56',
  'Free Size',
] as const;

export interface TranslationDict {
  [key: string]: {
    bn: string;
    en: string;
  };
}

export const translations: TranslationDict = {
  // Top bar & Common
  dashboard: { bn: 'ড্যাশবোর্ড', en: 'Dashboard' },
  orders: { bn: 'অর্ডার সমূহ', en: 'Orders' },
  manualOrder: { bn: 'ম্যানুয়াল অর্ডার', en: 'Manual Order' },
  pos: { bn: 'শোরুম পিওএস', en: 'Showroom POS' },
  preorders: { bn: 'প্রি-অর্ডার', en: 'Pre-Orders' },
  returns: { bn: 'রিটার্ন ও রিফান্ড', en: 'Returns & Refunds' },
  exchange: { bn: 'ড্রেস এক্সচেঞ্জ', en: 'Exchanges' },
  products: { bn: 'প্রোডাক্টস', en: 'Products' },
  variants: { bn: 'প্রোডাক্ট ভ্যারিয়েন্ট', en: 'Product Variants' },
  bundles: { bn: 'বান্ডেল ও কম্বো', en: 'Bundle Builder' },
  stockAudit: { bn: 'স্টক অডিট', en: 'Stock Audit' },
  priceHistory: { bn: 'মূল্য ইতিহাস', en: 'Price History' },
  imageManager: { bn: 'মিডিয়া গ্যালারি', en: 'Image Gallery' },
  couriers: { bn: 'কুরিয়ার সার্ভিস', en: 'Courier Services' },
  codSettlement: { bn: 'সিওডি সেটেলমেন্ট', en: 'COD Settlement' },
  suppliers: { bn: 'সাপ্লায়ার ও পারচেজ', en: 'Suppliers & Purchases' },
  warehouses: { bn: 'ওয়্যারহাউজ', en: 'Warehouses' },
  delivery: { bn: 'ডেলিভারি সেটিংস', en: 'Delivery Settings' },
  reports: { bn: 'রিপোর্টস ও এনালিটিক্স', en: 'Reports & Analytics' },
  accounting: { bn: 'লাভ-ক্ষতির হিসাব', en: 'Accounting & P/L' },
  expenses: { bn: 'খরচের হিসাব', en: 'Expense Manager' },
  reconciliation: { bn: 'পেমেন্ট রিকনসিলিয়েশন', en: 'Payment Reconciliation' },
  crm: { bn: 'কাস্টমার ও ফ্রড চেকার', en: 'Customer CRM & Fraud' },
  coupons: { bn: 'প্রোমো কোড ও ছাড়', en: 'Promo Codes' },
  flashSales: { bn: 'ফ্ল্যাশ সেল', en: 'Flash Sales' },
  giftCards: { bn: 'গিফট কার্ড', en: 'Gift Cards' },
  loyalty: { bn: 'লয়ালটি রিওয়ার্ডস', en: 'Loyalty Points' },
  affiliates: { bn: 'অ্যাফিলিয়েট পার্টনার্স', en: 'Affiliates & Referral' },
  marketing: { bn: 'ক্যাম্পেইন ও নোটিফিকেশন', en: 'Marketing Campaigns' },
  tickets: { bn: 'সাপোর্ট টিকিট', en: 'Support Tickets' },
  merchants: { bn: 'মার্চেন্টস', en: 'Merchants' },
  websites: { bn: 'ওয়েবসাইটস', en: 'Websites' },
  landings: { bn: 'ল্যান্ডিং পেজ', en: 'Landing Pages' },
  wholesale: { bn: 'পাইকারি বিটুবি', en: 'B2B Wholesale' },
  pixels: { bn: 'পিক্সেল ট্র্যাকিং', en: 'Pixel Tracking' },
  theme: { bn: 'থিম ও কারেন্সি', en: 'Theme & Currency' },
  staff: { bn: 'স্টাফ ও রোলস', en: 'Staff & Roles' },
  approvals: { bn: 'অনুমোদন ওয়ার্কফ্লো', en: 'Approval Workflow' },
  auditLogs: { bn: 'অডিট ট্রেইল', en: 'Audit Trail' },
  apiWebhooks: { bn: 'এপিআই ও ওয়েবহুক', en: 'API & Webhooks' },
  healthMonitor: { bn: 'সিস্টেম হেলথ', en: 'Health Monitor' },
  documents: { bn: 'ডকুমেন্ট সেন্টার', en: 'Document Center' },
  privacy: { bn: 'ডাটা প্রাইভেসি', en: 'Data Privacy' },
  settings: { bn: 'সেটিংস', en: 'Settings' },

  // Fraud checker labels
  fraudTitle: { bn: 'লাইভ ফ্রড ও কুরিয়ার রিটার্ন চেকার', en: 'Live Fraud & Courier Return Inspector' },
  fraudInputPlaceholder: { bn: 'কাস্টমারের ফোন নম্বর দিন (017... / 019...)', en: 'Enter customer phone number...' },
  checkNow: { bn: 'যাচাই করুন', en: 'Check Now' },
  totalParcels: { bn: 'মোট পার্সেল', en: 'Total Parcels' },
  receivedParcels: { bn: 'সফল ডেলিভারি (Received)', en: 'Successfully Delivered' },
  cancelledParcels: { bn: 'বাতিল / রিটার্ন (Cancelled)', en: 'Cancelled / Returned' },
  successRate: { bn: 'ডেলিভারি সাকসেস রেট', en: 'Delivery Success Rate' },
  courierBreakdown: { bn: 'কুরিয়ার ভিত্তিক বাতিল/রিটার্ন হিসাব', en: 'Courier Cancellation Breakdown' },
  riskSafe: { bn: 'নিরাপদ কাস্টমার - পার্সেল নিশ্চিত করুন', en: 'Safe Customer - Verified to Dispatch' },
  riskModerate: { bn: 'মাঝারি ঝুঁকি - ফোন দিয়ে কনফার্ম করুন', en: 'Moderate Risk - Confirm on Call' },
  riskHigh: { bn: 'উচ্চ ঝুঁকি (ফেক/রিটার্ন প্রবণ) - অগ্রিম ডেলিভারি চার্জ নিন', en: 'High Risk / Serial Returner - Collect Advance Fee' },

  // Common UI words
  newOrder: { bn: 'নতুন অর্ডার', en: 'New Order' },
  exportCsv: { bn: 'Export CSV', en: 'Export CSV' },
  vsCodeHtml: { bn: 'VS Code / HTML', en: 'VS Code / HTML' },
  logout: { bn: 'লগআউট', en: 'Logout' },
  today: { bn: 'আজ', en: 'Today' },
  save: { bn: 'সেভ করুন', en: 'Save' },
  cancel: { bn: 'বাতিল', en: 'Cancel' },
  delete: { bn: 'মুছুন', en: 'Delete' },
  edit: { bn: 'এডিট', en: 'Edit' },
  status: { bn: 'স্ট্যাটাস', en: 'Status' },
  actions: { bn: 'অ্যাকশন', en: 'Actions' },
  searchPlaceholder: { bn: 'অনুসন্ধান করুন...', en: 'Search...' },
};

export function t(key: string, lang: Language): string {
  if (translations[key] && translations[key][lang]) {
    return translations[key][lang];
  }
  return key;
}
