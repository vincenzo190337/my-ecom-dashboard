export type Language = 'bn' | 'en';

export const STANDARD_SIZES = ['36', '38', '40', '42', '44', '46', '48'] as const;
export const MAX_SIZES = ['50', '52', '54', '56'] as const;
export const ALL_SIZES = ['36', '38', '40', '42', '44', '46', '48', '50', '52', '54', '56'] as const;
export type BoutiqueSize = typeof ALL_SIZES[number] | 'Free Size' | string;

export const BD_MOBILE_BANKING = ['bKash', 'Nagad', 'Rocket', 'Upay', 'Cellfin', 'Tap'] as const;
export const BD_BANKS = [
  'City Bank',
  'BRAC Bank',
  'Dutch-Bangla Bank (Nexus)',
  'Eastern Bank (EBL)',
  'Islami Bank',
  'Standard Chartered (SCB)',
  'Mutual Trust Bank (MTB)',
  'Prime Bank',
  'Pubali Bank',
  'Dhaka Bank',
] as const;

export const DISCOUNT_PERCENTAGES = [2, 5, 7, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80] as const;

export interface CourierFraudReport {
  phone: string;
  customerName?: string;
  totalParcels: number;
  delivered: number;
  cancelled: number;
  deliveryRate: number;
  courierBreakdown: {
    steadfast: { delivered: number; cancelled: number };
    pathao: { delivered: number; cancelled: number };
    redx: { delivered: number; cancelled: number };
    paperfly: { delivered: number; cancelled: number };
    ecourier: { delivered: number; cancelled: number };
  };
  riskLevel: 'Safe' | 'Moderate' | 'High';
  recommendation: string;
  notes: string[];
}

export type PageId =
  // Core
  | 'dashboard'
  | 'orders'
  | 'manualOrder'
  | 'pos'
  | 'preorders'
  | 'returns'
  | 'exchange'
  // Catalog & Inventory
  | 'products'
  | 'collections'
  | 'variants'
  | 'bundles'
  | 'stockAudit'
  | 'priceHistory'
  | 'imageManager'
  // Logistics & Suppliers
  | 'couriers'
  | 'codSettlement'
  | 'suppliers'
  | 'warehouses'
  | 'delivery'
  // Finance & Accounts
  | 'reports'
  | 'accounting'
  | 'reportsAccounting'
  | 'expenses'
  | 'reconciliation'
  // Customer & Marketing
  | 'crm'
  | 'websiteLeads'
  | 'coupons'
  | 'flashSales'
  | 'giftCards'
  | 'loyalty'
  | 'affiliates'
  | 'marketing'
  | 'tickets'
  // Storefront & Channels
  | 'merchants'
  | 'websites'
  | 'landings'
  | 'wholesale'
  | 'pixels'
  | 'theme'
  // Security & System
  | 'staff'
  | 'approvals'
  | 'auditLogs'
  | 'loginAudit'
  | 'apiWebhooks'
  | 'healthMonitor'
  | 'documents'
  | 'privacy'
  | 'settings';

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned'
  | 'Preorder';

export type DeliveryMethod = 'Courier' | 'Home Delivery' | 'Pickup';
export type PaymentMethod = 'Cash on Delivery' | 'bKash' | 'Nagad' | 'Bank Transfer' | 'Paid';
export type OrderSource = 'Website' | 'Facebook' | 'Instagram' | 'WhatsApp' | 'Phone' | 'Manual';
export type DeliveryArea = 'dhaka' | 'sub_dhaka' | 'outside' | 'custom';

export const PLUS_SIZES = ['50', '52', '54', '56', 'Plus Size'] as const;
export const PLUS_SIZE_SURCHARGE = 150;
export const isPlusSize = (size?: string): boolean => {
  if (!size) return false;
  const s = String(size).trim();
  return PLUS_SIZES.includes(s as any) || (parseInt(s, 10) >= 50 && !isNaN(parseInt(s, 10)));
};

export const OFFICIAL_CATEGORIES = [
  'Anarkali',
  'Angarkha',
  'Bexi Voile',
  'Block Print',
  'Classic Cotton',
  'Co-Ord Set',
  'Cotton Dress',
  'Curtain',
  'Embroidery Dress',
  'Kaftan',
  'Khadi Cotton',
  'Koti',
  'Kurti',
  'Linen',
  'Maslin Cotton',
  'Nosepin',
  'Pant',
  'Scarf',
  'Screen Print',
  'Sharee',
  'Shawl',
  'Silk Dress',
  'Tie Dye',
  'Uncategorized',
] as const;

export type ProductCategory = typeof OFFICIAL_CATEGORIES[number] | string;

export interface Merchant {
  id: number;
  name: string;
  owner: string;
  phone: string;
  email: string;
  status: 'Active' | 'Inactive';
  address?: string;
}

export interface Website {
  id: number;
  name: string;
  url: string;
  merchantId: number | null;
  status: 'Active' | 'Draft' | 'Inactive';
}

export interface LandingPage {
  id: number;
  name: string;
  slug: string;
  merchantId: number | null;
  offer: string;
  status: 'Draft' | 'Published' | 'Inactive';
}

export interface Product {
  id: number;
  name: string;
  category: ProductCategory;
  sku: string;
  description: string;
  price: number;
  offer: number;
  stock: number;
  costPrice?: number; // for Profit per order calculation
  image: string;
  status: 'Active' | 'Draft' | 'Out of stock' | 'Inactive';
  stitching?: 'Stitched' | 'Unstitched';
  fabric?: string;
  printType?: string;
  designs?: { designName: string; quantity: number }[];
}

export interface OrderItem {
  productId: number | null;
  name: string;
  price: number;
  qty: number;
  costPrice?: number;
  size?: string;
  image?: string;
  stitching?: 'Stitched' | 'Unstitched';
}

export interface Order {
  id: number;
  date: string;
  customer: string;
  phone: string;
  email?: string;
  address: string;
  shippingNote?: string;
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  source: OrderSource;
  area: DeliveryArea;
  dressSize?: string;
  customArea?: string;
  items: OrderItem[];
  subtotal: number;
  charge: number;
  discount: number;
  advance: number;
  total: number;
  due: number;
  status: OrderStatus;
  note?: string;
  courierService?: string;
  courierTrackingCode?: string;
  courierStatus?: 'Pending' | 'Sent to Courier' | 'In Transit' | 'Out for Delivery' | 'Delivered' | 'Cancelled' | 'Returned';
  courierConsignmentId?: string;
  courierSentAt?: string;
  profit?: number;
  isPrinted?: boolean;
  enteredBy?: string;
  orderType?: 'manual' | 'preorder' | 'approved';
  expectedDeliveryDate?: string;
  invoiceNo?: string;
  auditTrail?: { timestamp: string; action: string; user: string }[];
  packagingCost?: number;
}

export interface CourierService {
  id: number;
  name: string;
  contact: string;
  status: 'Active' | 'Inactive';
  apiKey?: string;
  storeId?: string;
  clientId?: string;
  token?: string;
  baseUrl?: string;
  extraParams?: string;
}

export interface ExchangeRecord {
  id: number;
  orderId: string;
  customer: string;
  phone: string;
  oldDress: string;
  newDress: string;
  charge: number;
  status: 'Requested' | 'Approved' | 'Picked Up' | 'Completed' | 'Rejected';
  note: string;
}

export interface StaffMember {
  id: number;
  name: string;
  email: string;
  role:
    | 'Admin'
    | 'Merchant'
    | 'Order Manager'
    | 'Product Manager'
    | 'Inventory & Stock Manager'
    | 'Delivery & Courier Manager'
    | 'Showroom POS Cashier'
    | 'Customer Support Executive'
    | 'Marketing & Growth'
    | 'Accounts Manager';
  permissions: {
    canEditOrders: boolean;
    canDeleteOrders: boolean;
    canApproveRefund: boolean;
    canViewProfit: boolean;
    canManageProducts: boolean;
    canSuperEdit?: boolean;
  };
  status: 'Active' | 'Inactive';
}

export interface SystemConfig {
  dhakaFee: number;
  outsideFee: number;
  subDhakaFee: number;
  whatsapp: string;
  user: string;
  password: string;
  storeName?: string;
  storeAddress?: string;
  currencySymbol?: string;
  defaultCourier?: string;
}

// 1. Showroom POS Transaction
export interface PosTransaction {
  id: string;
  date: string;
  cashier: string;
  customerName?: string;
  customerPhone?: string;
  items: { name: string; price: number; qty: number; size?: string; fabric?: string; stitching?: string }[];
  subtotal: number;
  discount: number;
  discountPercent?: number;
  total: number;
  paidAmount: number;
  changeAmount: number;
  paymentType: 'Cash' | 'bKash / Nagad' | 'Card';
  mfsProvider?: string;
  bankName?: string;
  transactionTrxId?: string;
  cardLast4?: string;
  notes?: string;
}

// 2. Pre-Order & Backorders
export interface PreOrder {
  id: number;
  customer: string;
  phone: string;
  productName: string;
  size: string;
  expectedDate: string;
  advancePaid: number;
  totalPrice: number;
  status: 'Awaiting Stock' | 'Stock Received' | 'Ready to Dispatch' | 'Delivered';
  type: 'Showroom Preorder' | 'Website Preorder' | 'Page Preorder' | 'Online Preorder';
  dressFabric?: string;
  customerAddress?: string;
  note?: string;
}

// Website Visitor Leads & Abandoned Cart Tracker
export interface WebsiteLead {
  id: number;
  name: string;
  phone: string;
  viewedDress: string;
  cartItems: { name: string; size: string; price: number }[];
  cartTotal: number;
  timestamp: string;
  activityType: 'Viewed Product' | 'Added to Cart' | 'Initiated Checkout';
  status: 'New Lead' | 'WhatsApp Contacted' | 'Converted to Order' | 'Dismissed';
  device?: string;
  notes?: string;
}

// 3. Returns & Refunds
export interface ReturnRefund {
  id: number;
  orderId: string;
  customer: string;
  phone: string;
  productName: string;
  refundAmount: number;
  refundMethod: 'bKash' | 'Nagad' | 'Bank' | 'Store Credit';
  reason: string;
  status: 'Pending' | 'Approved' | 'Refunded' | 'Rejected';
  approvedBy?: string;
}

// 4. Product Variants
export interface ProductVariant {
  id: number;
  productId: number;
  productName: string;
  color: string;
  size: string;
  sku: string;
  stock: number;
  priceModifier: number;
}

// 5. Product Bundles
export interface ProductBundle {
  id: number;
  name: string;
  bundlePrice: number;
  regularTotal: number;
  savings: number;
  includedProducts: string[];
  status: 'Active' | 'Inactive';
}

// 6. Stock Audit
export interface StockAuditRecord {
  id: number;
  date: string;
  productName: string;
  systemStock: number;
  physicalStock: number;
  difference: number;
  auditor: string;
  status: 'Balanced' | 'Discrepancy' | 'Adjusted';
  notes?: string;
}

// 7. Price History
export interface PriceChangeRecord {
  id: number;
  productId: number;
  productName: string;
  oldPrice: number;
  newPrice: number;
  changeDate: string;
  changedBy: string;
  reason: string;
}

// 8. COD Settlement
export interface CodSettlement {
  id: number;
  courierName: string;
  consignmentCount: number;
  totalCodDue: number;
  totalReceived: number;
  pendingCod: number;
  settlementDate: string;
  referenceId: string;
  status: 'Full Settled' | 'Partial' | 'Pending';
}

// 9. Suppliers & Purchases
export interface Supplier {
  id: number;
  companyName: string;
  contactPerson: string;
  phone: string;
  category: 'Fabrics' | 'Zari & Accessories' | 'Packaging Bags' | 'Stitching Unit';
  address: string;
  totalPurchased: number;
  dueBalance: number;
}

export interface PurchaseOrder {
  id: number;
  supplierId: number;
  supplierName: string;
  invoiceNo: string;
  date: string;
  itemName: string;
  quantity: number;
  totalCost: number;
  paidAmount: number;
  dueAmount: number;
  status: 'Received' | 'In Transit' | 'Ordered';
}

// 10. Multi-Store & Warehouses
export interface Warehouse {
  id: number;
  name: string;
  type: 'Central Hub' | 'Showroom Outlet' | 'Sorting Warehouse';
  manager: string;
  phone: string;
  location: string;
  totalItemStock: number;
  status: 'Active' | 'Maintenance';
}

// 11. Expense Manager
export interface ExpenseRecord {
  id: number;
  date: string;
  category: 'Fabric & Sewing' | 'Showroom Rent' | 'Staff Salary' | 'Facebook Ads' | 'Packaging' | 'Utility & Tea';
  amount: number;
  paidTo: string;
  method: 'Cash' | 'bKash' | 'Bank';
  receiptNo?: string;
  note?: string;
}

// 12. Payment Reconciliation
export interface ReconciliationRecord {
  id: number;
  date: string;
  channel: 'bKash Merchant' | 'Nagad Merchant' | 'Bank Deposit' | 'Courier COD Cash';
  gatewayRefTrx: string;
  systemOrderAmount: number;
  gatewayReceivedAmount: number;
  status: 'Matched' | 'Discrepancy' | 'Resolved';
  verifiedBy: string;
}

// 13. Customer CRM & Fraud Checker
export interface CrmCustomer {
  id: number;
  name: string;
  phone: string;
  email?: string;
  address: string;
  totalOrders: number;
  deliveredCount: number;
  cancelledCount: number;
  totalSpent: number;
  fraudRiskScore: 'Safe' | 'Moderate' | 'High Risk / Fraud';
  tags: string[];
  isBlacklisted: boolean;
  notes?: string;
}

// 14. Promo Codes & Discounts
export interface PromoCode {
  id: number;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxUsageLimit: number;
  usedCount: number;
  expiryDate: string;
  status: 'Active' | 'Expired' | 'Disabled';
}

// 15. Flash Sale Scheduler
export interface FlashSale {
  id: number;
  title: string;
  discountPercent: number;
  startTime: string;
  endTime: string;
  applicableCategory: string;
  status: 'Upcoming' | 'Live Now' | 'Ended';
}

// 16. Gift Cards & Store Credit
export interface GiftCard {
  id: number;
  code: string;
  customerName: string;
  customerPhone: string;
  balance: number;
  originalAmount: number;
  issuedDate: string;
  expiryDate: string;
  status: 'Active' | 'Redeemed' | 'Expired';
}

// 17. Loyalty Points
export interface LoyaltyAccount {
  id: number;
  customerName: string;
  customerPhone: string;
  points: number;
  tier: 'Silver' | 'Gold' | 'Platinum' | 'VIP';
  lifetimeEarned: number;
  lastUsedDate?: string;
}

// 18. Affiliates & Referrals
export interface AffiliatePartner {
  id: number;
  name: string;
  phone: string;
  affiliateCode: string;
  commissionRate: number; // e.g. 8%
  referredOrdersCount: number;
  totalSalesGenerated: number;
  earningsBalance: number;
  paidEarnings: number;
  status: 'Active' | 'Paused';
}

// 19. Marketing Campaigns (SMS, Email, WhatsApp)
export interface MarketingCampaign {
  id: number;
  name: string;
  channel: 'WhatsApp' | 'SMS' | 'Email';
  targetAudience: 'All Customers' | 'Repeat Buyers' | 'Abandoned Cart' | 'Dhaka Customers';
  messageTemplate: string;
  scheduledTime: string;
  sentCount: number;
  deliveredRate: string;
  status: 'Draft' | 'Scheduled' | 'Sent';
}

// 20. Customer Support Tickets & Complaints
export interface SupportTicket {
  id: number;
  orderId?: string;
  customerName: string;
  customerPhone: string;
  issueType: 'Late Delivery' | 'Wrong Size' | 'Damaged Fabric' | 'Refund Request' | 'General Query';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  assignedTo: string;
  createdDate: string;
  notes: string;
}

// 21. B2B / Wholesale Portal
export interface WholesaleBuyer {
  id: number;
  businessName: string;
  contactPerson: string;
  phone: string;
  district: string;
  creditLimit: number;
  outstandingDue: number;
  tierDiscount: number;
  status: 'Approved' | 'Pending Verification' | 'Suspended';
}

// 22. Pixel & Conversion Tracking
export interface TrackingPixel {
  id: number;
  platform: 'Facebook Meta Pixel' | 'Google Analytics 4' | 'TikTok Pixel' | 'Google Tag Manager';
  pixelId: string;
  eventTracking: string[];
  status: 'Active' | 'Paused';
}

// 23. Approval Workflow
export interface ApprovalRequest {
  id: number;
  requestType: 'High Discount' | 'Refund Approval' | 'Large Expense' | 'Manual Stock Adjustment';
  requestedBy: string;
  amountOrDetails: string;
  reason: string;
  requestDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  actionedBy?: string;
}

// 24. Audit Trail & Logs
export interface AuditLogEntry {
  id: number;
  timestamp: string;
  user: string;
  action: string;
  entity: string;
  details: string;
  ipAddress?: string;
  device?: string;
  browser?: string;
  role?: string;
}

// 25. API & Webhooks
export interface ApiWebhook {
  id: number;
  name: string;
  service: 'Steadfast Courier API' | 'Pathao Logistics API' | 'bKash Merchant Webhook' | 'SMS Gateway API';
  endpointUrl: string;
  apiKeyOrSecret: string;
  status: 'Connected' | 'Disconnected' | 'Error';
  lastTriggered?: string;
}

// 26. Document Center
export interface DocumentFile {
  id: number;
  title: string;
  category: 'Invoice' | 'Supplier Receipt' | 'Chalan Slip' | 'Trade License' | 'Tax Document';
  date: string;
  fileSize: string;
  uploadedBy: string;
}

// ALVINA-WOMENS-COLLECTION Tree Structure (All 24 Collections)
export interface AlvinaCategoryNode {
  id: string;
  name: string;
  banglaName?: string;
  fabrics: {
    fabric: string;
    prints: string[];
  }[];
}

export type CollectionDestination =
  | 'website_home'
  | 'pos_quick_bar'
  | 'flash_sale'
  | 'whatsapp_catalog'
  | 'facebook_shop'
  | 'landing_page'
  | 'preorder_special'
  | 'discount_campaign';

export interface AlvinaCollectionRecord {
  id: string;
  name: string;
  banglaName: string;
  code: string;
  assignedProductCount: number;
  destinations: CollectionDestination[];
  status: 'Active' | 'Hidden';
  bannerImage: string;
  description: string;
}

export const ALVINA_CATALOG_STRUCTURE: AlvinaCategoryNode[] = [
  {
    id: '01-THREE-PIECE',
    name: 'Three-Piece (থ্রি-পিস)',
    banglaName: 'থ্রি-পিস কালেকশন',
    fabrics: [
      { fabric: 'Cotton', prints: ['Block-Print', 'Screen-Print', 'Digital-Print', 'Floral-Print', 'Embroidery', 'Plain'] },
      { fabric: 'Lawn', prints: ['Block-Print', 'Screen-Print', 'Digital-Print', 'Embroidery', 'Plain'] },
      { fabric: 'Khadi-Cotton', prints: ['Block-Print', 'Screen-Print', 'Embroidery', 'Plain'] },
      { fabric: 'Linen', prints: ['Block-Print', 'Embroidery', 'Plain'] },
      { fabric: 'Muslin', prints: ['Digital-Print', 'Embroidery', 'Zari Work'] },
      { fabric: 'Rayon-Viscose', prints: ['Digital-Print', 'Floral-Print', 'Plain'] },
      { fabric: 'Silk', prints: ['Katan Motif', 'Digital-Print', 'Plain'] },
      { fabric: 'Jacquard', prints: ['Woven Motif', 'Embroidery'] },
      { fabric: 'Chiffon', prints: ['Floral-Print', 'Embroidery'] },
      { fabric: 'Georgette', prints: ['Stone Work', 'Embroidery', 'Digital-Print'] },
    ],
  },
  {
    id: '02-KURTI-AND-KURTA',
    name: 'Kurti & Kurta (কুর্তি ও কুর্তা)',
    banglaName: 'কুর্তি ও কুর্তা',
    fabrics: [
      { fabric: 'Cotton', prints: ['Block-Print', 'Screen-Print', 'Digital-Print', 'Floral-Print', 'Embroidery', 'Plain'] },
      { fabric: 'Khadi-Cotton', prints: ['Handloom', 'Block-Print', 'Plain'] },
      { fabric: 'Lawn', prints: ['Digital-Print', 'Embroidery'] },
      { fabric: 'Linen', prints: ['A-Line', 'Straight', 'Short', 'Long'] },
      { fabric: 'Rayon', prints: ['Anarkali-Kurti', 'Angrakha-Kurti', 'Floral'] },
    ],
  },
  {
    id: '03-SAREE',
    name: 'Saree (শাড়ি)',
    banglaName: 'শাড়ি ও জামদানি',
    fabrics: [
      { fabric: 'Jamdani', prints: ['Dhakai Jamdani', 'Resham Jamdani', 'Full Zari'] },
      { fabric: 'Tangail', prints: ['Taant', 'Cotton Jamdani', 'Soft Weave'] },
      { fabric: 'Muslin', prints: ['Hand Paint', 'Digital Print', 'Aanchal Work'] },
      { fabric: 'Cotton', prints: ['Block-Print', 'Screen-Print', 'Digital-Print', 'Floral-Print'] },
      { fabric: 'Silk', prints: ['Katan', 'Banarasi', 'Organza', 'Chiffon', 'Georgette'] },
    ],
  },
  {
    id: '04-ANARKALI',
    name: 'Anarkali (আনারকলি গাউন)',
    banglaName: 'আনারকলি',
    fabrics: [
      { fabric: 'Cotton', prints: ['Block-Print', 'Floral', 'Plain'] },
      { fabric: 'Khadi', prints: ['Festive', 'Embroidery'] },
      { fabric: 'Lawn', prints: ['Screen-Print', 'Digital-Print'] },
      { fabric: 'Rayon', prints: ['Party-Wear', 'Heavy Flare'] },
    ],
  },
  {
    id: '05-ANGRAKHA',
    name: 'Angrakha (আংরাখা)',
    banglaName: 'আংরাখা প্যাটার্ন',
    fabrics: [
      { fabric: 'Cotton', prints: ['Block-Print', 'Screen-Print', 'Embroidery'] },
      { fabric: 'Khadi', prints: ['Tie-Up Cord', 'Embroidery'] },
      { fabric: 'Lawn', prints: ['Summer Special', 'Pastel Print'] },
    ],
  },
  {
    id: '06-KAMEEZ-AND-SALWAR',
    name: 'Kameez & Salwar (কামিজ ও সালোয়ার)',
    banglaName: 'কামিজ ও সালোয়ার',
    fabrics: [
      { fabric: 'Cotton', prints: ['Printed', 'Embroidered', 'Plain'] },
      { fabric: 'Lawn', prints: ['Printed', 'Cutwork'] },
      { fabric: 'Khadi', prints: ['Traditional Weave'] },
      { fabric: 'Linen', prints: ['Comfort Fit', 'Pastel'] },
      { fabric: 'Muslin', prints: ['Festive Luxury'] },
    ],
  },
  {
    id: '07-CO-ORD-SETS',
    name: 'Co-Ord Sets (কো-অর্ড সেট)',
    banglaName: 'কো-অর্ড সেট',
    fabrics: [
      { fabric: 'Cotton', prints: ['Modern Printed', 'Geometric', 'Embroidery'] },
      { fabric: 'Linen', prints: ['Minimalist Plain', 'Stripes'] },
      { fabric: 'Rayon', prints: ['Boutique Floral', 'Casual Lounge'] },
    ],
  },
  {
    id: '08-MAXI-AND-DRESS',
    name: 'Maxi & Dress (ম্যাক্সি ও ড্রেস)',
    banglaName: 'ম্যাক্সি ও ড্রেস',
    fabrics: [
      { fabric: 'Cotton', prints: ['Block-Print', 'Screen-Print', 'Digital-Print', 'Floral-Print'] },
      { fabric: 'Khadi', prints: ['A-Line Maxi', 'Tiered Dress'] },
      { fabric: 'Lawn', prints: ['Anarkali Dress', 'Angrakha Dress', 'Kaftan Dress'] },
    ],
  },
  {
    id: '09-TOPS-AND-SHIRTS',
    name: 'Tops & Shirts (টপস ও শার্ট)',
    banglaName: 'টপস ও শার্ট',
    fabrics: [
      { fabric: 'Cotton', prints: ['Casual Fit', 'Button-Down', 'Tunic'] },
      { fabric: 'Linen', prints: ['Summer Relaxed', 'Office Chic'] },
    ],
  },
  {
    id: '10-BOTTOM-WEAR',
    name: 'Bottom Wear (প্যান্ট, পালাজ্জো ও লেগিংস)',
    banglaName: 'বটম ওয়্যার ও পালাজ্জো',
    fabrics: [
      { fabric: 'Cotton', prints: ['Cigarette Pant', 'Culottes', 'Dhoti Pant', 'Plain'] },
      { fabric: 'Linen', prints: ['Wide Leg', 'Straight Cut'] },
      { fabric: 'Lycra/Spandex', prints: ['Leggings', 'Stretch Fit'] },
    ],
  },
  {
    id: '11-ABAYA-AND-MODEST-WEAR',
    name: 'Abaya & Modest Wear (বোরকা ও আবায়া)',
    banglaName: 'আবায়া ও বোরকা',
    fabrics: [
      { fabric: 'Dubai Cherry', prints: ['Front Open', 'Closed Flare', 'Stone Lace'] },
      { fabric: 'Nida Fabric', prints: ['Embroidered Cuff', 'Belted Modest'] },
      { fabric: 'Georgette', prints: ['Layered Cape', 'Pastel Flow'] },
    ],
  },
  {
    id: '12-HIJAB-ORNA-DUPATTA',
    name: 'Hijab, Orna & Dupatta (হিজাব ও ওড়না)',
    banglaName: 'হিজাব, ওড়না ও দোপাট্টা',
    fabrics: [
      { fabric: 'Chiffon', prints: ['Georgette Hijab', 'Printed Dupatta'] },
      { fabric: 'Cotton', prints: ['Block-Printed Orna', 'Handloom Cotton'] },
      { fabric: 'Silk/Organza', prints: ['Festive Cutwork Dupatta', 'Zari Lace'] },
    ],
  },
  {
    id: '13-PARTY-AND-BRIDAL-WEAR',
    name: 'Party & Bridal Wear (পার্টি ও ব্রাইডাল)',
    banglaName: 'পার্টি ও ব্রাইডাল ওয়্যার',
    fabrics: [
      { fabric: 'Raw Silk', prints: ['Zardosi Embroidery', 'Heavy Karchupi'] },
      { fabric: 'Net & Organza', prints: ['Sequin Work', 'Gown Flare'] },
      { fabric: 'Velvet', prints: ['Royal Winter Bridal', 'Hand Embroidered'] },
    ],
  },
  {
    id: '14-NIGHTWEAR',
    name: 'Nightwear (নাইটওয়্যার ও লাউঞ্জ)',
    banglaName: 'নাইটওয়্যার ও কমফোর্ট ড্রেস',
    fabrics: [
      { fabric: 'Pure Cotton', prints: ['Nighty', 'Pyjama Set', 'Printed Lounge'] },
      { fabric: 'Satin', prints: ['Robe', 'Slip Dress', 'Soft Lounge'] },
    ],
  },
  {
    id: '15-WESTERN-WEAR',
    name: 'Western Wear (ওয়েস্টার্ন ওয়্যার)',
    banglaName: 'ওয়েস্টার্ন পোশাক',
    fabrics: [
      { fabric: 'Denim', prints: ['Jacket', 'Denim Shirt', 'Jeans'] },
      { fabric: 'Cotton Blend', prints: ['Blazers', 'Formal Jumpsuits'] },
    ],
  },
  {
    id: '16-SUMMER-COLLECTION',
    name: 'Summer Collection (সামার কালেকশন)',
    banglaName: 'সামার স্পেশাল কালেকশন',
    fabrics: [
      { fabric: 'Voile Cotton', prints: ['Cool Breathable', 'Pastel Floral'] },
      { fabric: 'Lawn', prints: ['Airy Prints', 'Soft Block'] },
    ],
  },
  {
    id: '17-WINTER-COLLECTION',
    name: 'Winter Collection (উইন্টার কালেকশন)',
    banglaName: 'শীতকালীন উইন্টার কালেকশন',
    fabrics: [
      { fabric: 'Cashmere & Wool', prints: ['Pashmina Shawl', 'Cardigans', 'Sweaters'] },
      { fabric: 'Velvet', prints: ['Embossed Kurti', 'Winter Cape'] },
    ],
  },
  {
    id: '18-MATERNITY-WEAR',
    name: 'Maternity Wear (মেটারনিটি ড্রেস)',
    banglaName: 'মেটারনিটি ওয়্যার',
    fabrics: [
      { fabric: 'Stretch Cotton', prints: ['Nursing Friendly', 'Adjustable Flare'] },
      { fabric: 'Rayon', prints: ['Soft Maxi', 'Relaxed Fit'] },
    ],
  },
  {
    id: '19-SPORTSWEAR',
    name: 'Sportswear & Activewear (অ্যাক্টিভওয়্যার)',
    banglaName: 'স্পোর্টস ও অ্যাক্টিভ ওয়্যার',
    fabrics: [
      { fabric: 'Dry-Fit', prints: ['Gym T-Shirt', 'Joggers', 'Sports Hoodie'] },
      { fabric: 'Spandex', prints: ['Stretch Yoga Pant', 'Track Jacket'] },
    ],
  },
  {
    id: '20-BLOUSE-AND-PETTICOAT',
    name: 'Blouse & Petticoat (ব্লাউজ ও পেটিকোট)',
    banglaName: 'রেডিমেড ব্লাউজ ও পেটিকোট',
    fabrics: [
      { fabric: 'Brocade Silk', prints: ['Designer Back Neck', 'Padded Fit'] },
      { fabric: 'Cotton', prints: ['Regular Daily Wear', 'Shaper Petticoat'] },
    ],
  },
  {
    id: '21-BAGS-AND-ACCESSORIES',
    name: 'Bags & Accessories (ব্যাগ ও এক্সেসরিজ)',
    banglaName: 'ব্যাগ ও লাইফস্টাইল এক্সেসরিজ',
    fabrics: [
      { fabric: 'Jute-Cotton', prints: ['Tote Bag', 'Embroidery Potli'] },
      { fabric: 'Faux Leather', prints: ['Handbag', 'Clutch', 'Party Purse'] },
    ],
  },
  {
    id: '22-NEW-ARRIVALS',
    name: 'New Arrivals (নতুন আগমনী ড্রেস)',
    banglaName: 'নিউ অ্যারাইভালস কালেকশন',
    fabrics: [
      { fabric: 'All Fabrics', prints: ['Latest 2026 Season Drops', 'Trending Styles'] },
    ],
  },
  {
    id: '23-BEST-SELLERS',
    name: 'Best Sellers (হিট ও টপ রেটেড)',
    banglaName: 'বেস্ট সেলার্স ও টপ ট্রেন্ডিং',
    fabrics: [
      { fabric: 'All Fabrics', prints: ['Highest Customer Demand', 'Restocked Favorites'] },
    ],
  },
  {
    id: '24-SALE-AND-OFFERS',
    name: 'Sale & Offers (অফার ও ডিসকাউন্ট)',
    banglaName: 'সেল ও স্পেশাল অফার জোন',
    fabrics: [
      { fabric: 'All Fabrics', prints: ['Flash Clearance', 'Combo Deals', 'Flat 30% to 50% Off'] },
    ],
  },
];
