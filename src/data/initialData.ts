import {
  Merchant,
  Website,
  LandingPage,
  Product,
  Order,
  CourierService,
  ExchangeRecord,
  StaffMember,
  SystemConfig,
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
} from '../types';

export const INITIAL_CONFIG: SystemConfig = {
  dhakaFee: 80,
  subDhakaFee: 100,
  outsideFee: 150,
  whatsapp: '01956591199',
  user: 'admin',
  password: 'admin123',
  storeName: "ALVINA Women's Collection",
  storeAddress: 'Mohammadpur, Adabor, Dhaka-1207',
  currencySymbol: '৳',
  defaultCourier: 'Steadfast Courier',
};

export const INITIAL_MERCHANTS: Merchant[] = [
  {
    id: 101,
    name: 'ALVINA Women Wear (Main)',
    owner: 'Farhana Sultana',
    phone: '01956591199',
    email: 'info@alvinawomen.com',
    status: 'Active',
    address: 'Road 11, Banani, Dhaka',
  },
  {
    id: 102,
    name: 'ALVINA Signature Boutique',
    owner: 'Shirin Akter',
    phone: '01844556677',
    email: 'signature@alvina.com.bd',
    status: 'Active',
    address: 'Shimanto Square, Dhanmondi, Dhaka',
  },
  {
    id: 103,
    name: 'ALVINA Outlet Uttara',
    owner: 'Rashid Khan',
    phone: '01711223344',
    email: 'uttara@alvina.com.bd',
    status: 'Active',
    address: 'Sector 3, Uttara, Dhaka',
  },
];

export const INITIAL_WEBSITES: Website[] = [
  {
    id: 201,
    name: 'ALVINA Official Boutique Store',
    url: 'https://alvinawomen.com',
    merchantId: 101,
    status: 'Active',
  },
  {
    id: 202,
    name: 'ALVINA Signature Collections',
    url: 'https://signature.alvina.com.bd',
    merchantId: 102,
    status: 'Active',
  },
];

export const INITIAL_LANDINGS: LandingPage[] = [
  {
    id: 301,
    name: 'Eid Exclusive Three Piece Collection',
    slug: 'eid-three-piece-collection',
    merchantId: 101,
    offer: 'Flat 15% Off + Free Delivery Inside Dhaka',
    status: 'Published',
  },
  {
    id: 302,
    name: 'Summer Cotton Kurti & Co-ord Fest',
    slug: 'summer-kurti-coord-fest',
    merchantId: 102,
    offer: 'Buy 2 Get 200৳ Voucher',
    status: 'Published',
  },
  {
    id: 303,
    name: 'Wedding Royal Anarkali Edition',
    slug: 'wedding-anarkali-edition',
    merchantId: 101,
    offer: 'Pre-order 10% Advance Booking',
    status: 'Draft',
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 401,
    name: 'Luxury Organza Embroidered Three Piece',
    category: 'Three Piece',
    sku: 'ALV-ORG-001',
    description: 'প্রিমিয়াম কোয়ালিটি অর্গানজা ফেব্রিক, সূক্ষ্ম জরি সুতা ও সিকোয়েন্স কাজ করা ওড়না এবং আরামদায়ক কটন ইনারসহ সালোয়ার কামিজ সেট।',
    price: 3650,
    offer: 3250,
    costPrice: 2100,
    stock: 24,
    image: '/src/assets/images/fashion_organza_dress_1791729125639.jpg',
    status: 'Active',
  },
  {
    id: 402,
    name: 'Handblock Printed Premium Cotton Kurti',
    category: 'Kurti',
    sku: 'ALV-KRT-104',
    description: '১০০% খাঁটি সুতি ফেব্রিক, ট্রেন্ডি হ্যান্ডব্লক প্রিন্ট ও গলার হ্যান্ড এমব্রয়ডারি ডিজাইন। প্রতিদিনের ব্যবহারে অত্যন্ত আরামদায়ক।',
    price: 1650,
    offer: 1450,
    costPrice: 850,
    stock: 45,
    image: '/src/assets/images/fashion_cotton_kurti_1791729138136.jpg',
    status: 'Active',
  },
  {
    id: 403,
    name: 'Emerald Festive Silk Co-ord Set',
    category: 'Co-ord Set',
    sku: 'ALV-CRD-209',
    description: 'এক্সক্লুসিভ র সিল্ক টু-পিস কো-অর্ড সেট। আধুনিক ভি-নেক কাট ও কনট্রাস্ট সাইড প্যানেলিং। পার্টি ও ফ্যামিলি গেট-টুগেদারের জন্য সেরা।',
    price: 2850,
    offer: 2550,
    costPrice: 1550,
    stock: 18,
    image: '/src/assets/images/fashion_silk_coord_1791729152610.jpg',
    status: 'Active',
  },
  {
    id: 404,
    name: 'Royal Flared Anarkali Festive Gown',
    category: 'Anarkali',
    sku: 'ALV-ANR-310',
    description: 'রয়েল ফ্লেয়ার্ড ভেলভেট ও জর্জেট আনাকলি গাউন। ভারী জরি ও মিরর ওয়ার্ক নেকলাইন এবং চারদিকে ঝালর লেস যুক্ত দুপাট্টা।',
    price: 5200,
    offer: 4800,
    costPrice: 3100,
    stock: 12,
    image: '/src/assets/images/fashion_anarkali_gown_1791729166627.jpg',
    status: 'Active',
  },
];

export const INITIAL_COURIERS: CourierService[] = [
  { id: 501, name: 'Steadfast Courier', contact: '09678-045045 / merchant portal', status: 'Active' },
  { id: 502, name: 'Pathao Courier', contact: '09610-003030 / hub delivery', status: 'Active' },
  { id: 503, name: 'RedX Logistics', contact: '09612-223344 / daily pickup', status: 'Active' },
  { id: 504, name: 'eCourier BD', contact: '09642-112233', status: 'Active' },
  { id: 505, name: 'Paperfly Delivery', contact: '09666-774433', status: 'Active' },
  { id: 506, name: 'Carry Bee', contact: '01894-888999', status: 'Active' },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 98412,
    date: new Date(Date.now() - 3600000 * 2).toISOString(),
    customer: 'Tanjina Akter',
    phone: '01711987654',
    email: 'tanjina@gmail.com',
    address: 'House 14, Road 7, Dhanmondi, Dhaka',
    shippingNote: 'বিকেলে ডেলিভারি দিলে ভালো হয়, বাসায় দারোয়ান থাকবে।',
    deliveryMethod: 'Courier',
    paymentMethod: 'Cash on Delivery',
    source: 'Facebook',
    area: 'dhaka',
    dressSize: 'M',
    items: [
      {
        productId: 401,
        name: 'Luxury Organza Embroidered Three Piece',
        price: 3250,
        costPrice: 2100,
        qty: 1,
        size: 'M',
      },
    ],
    subtotal: 3250,
    charge: 80,
    discount: 100,
    advance: 0,
    total: 3230,
    due: 3230,
    status: 'Processing',
    courierService: 'Steadfast Courier',
    profit: 1050,
    note: 'Facebook Inbox Order - Size M Confirmed on phone',
  },
  {
    id: 98411,
    date: new Date(Date.now() - 3600000 * 8).toISOString(),
    customer: 'Sadia Islam Mim',
    phone: '01844123987',
    email: 'sadia.mim@outlook.com',
    address: 'Flat 4B, Green Road, Farmgate, Dhaka',
    shippingNote: 'দয়া করে সিকিউর প্যাকেট করে পাঠাবেন।',
    deliveryMethod: 'Home Delivery',
    paymentMethod: 'bKash',
    source: 'Website',
    area: 'dhaka',
    dressSize: 'L',
    items: [
      {
        productId: 402,
        name: 'Handblock Printed Premium Cotton Kurti',
        price: 1450,
        costPrice: 850,
        qty: 2,
        size: 'L',
      },
    ],
    subtotal: 2900,
    charge: 80,
    discount: 180,
    advance: 500,
    total: 2800,
    due: 2300,
    status: 'Shipped',
    courierService: 'Pathao Courier',
    profit: 1020,
    note: 'bKash TrxID: 9X8A76BQ advance 500 received',
  },
  {
    id: 98410,
    date: new Date(Date.now() - 3600000 * 22).toISOString(),
    customer: 'Nusrat Jahan Chowdhury',
    phone: '01912554433',
    email: 'nusrat.ctg@yahoo.com',
    address: 'GEC Circle, Nasirabad, Chattogram',
    shippingNote: 'চট্টগ্রাম জিইসি এরিয়া',
    deliveryMethod: 'Courier',
    paymentMethod: 'Cash on Delivery',
    source: 'Instagram',
    area: 'outside',
    dressSize: 'XL',
    items: [
      {
        productId: 403,
        name: 'Emerald Festive Silk Co-ord Set',
        price: 2550,
        costPrice: 1550,
        qty: 1,
        size: 'XL',
      },
    ],
    subtotal: 2550,
    charge: 150,
    discount: 0,
    advance: 200,
    total: 2700,
    due: 2500,
    status: 'Delivered',
    courierService: 'Steadfast Courier',
    profit: 1000,
    note: 'Customer confirmed parcel received with satisfaction',
  },
  {
    id: 98409,
    date: new Date(Date.now() - 3600000 * 30).toISOString(),
    customer: 'Farhana Rahman Shumi',
    phone: '01678990011',
    address: 'Zindabazar, Sylhet City',
    deliveryMethod: 'Courier',
    paymentMethod: 'Cash on Delivery',
    source: 'WhatsApp',
    area: 'outside',
    dressSize: 'Free Size',
    items: [
      {
        productId: 404,
        name: 'Royal Flared Anarkali Festive Gown',
        price: 4800,
        costPrice: 3100,
        qty: 1,
        size: 'Free Size',
      },
    ],
    subtotal: 4800,
    charge: 150,
    discount: 250,
    advance: 1000,
    total: 4700,
    due: 3700,
    status: 'Confirmed',
    courierService: 'RedX Logistics',
    profit: 1450,
    note: 'Advance bKash 1000 received for outside Dhaka delivery',
  },
  {
    id: 98408,
    date: new Date(Date.now() - 3600000 * 48).toISOString(),
    customer: 'Sumaiya Kabir',
    phone: '01723445566',
    address: 'Sector 7, Uttara, Dhaka',
    deliveryMethod: 'Home Delivery',
    paymentMethod: 'Cash on Delivery',
    source: 'Phone',
    area: 'dhaka',
    dressSize: 'M',
    items: [
      {
        productId: 401,
        name: 'Luxury Organza Embroidered Three Piece',
        price: 3250,
        costPrice: 2100,
        qty: 1,
        size: 'M',
      },
    ],
    subtotal: 3250,
    charge: 80,
    discount: 0,
    advance: 0,
    total: 3330,
    due: 3330,
    status: 'Delivered',
    courierService: 'Pathao Courier',
    profit: 1150,
    note: 'COD collected successfully',
  },
];

export const INITIAL_EXCHANGES: ExchangeRecord[] = [
  {
    id: 601,
    orderId: '98408',
    customer: 'Sumaiya Kabir',
    phone: '01723445566',
    oldDress: 'Organza Three Piece (Size M)',
    newDress: 'Organza Three Piece (Size L)',
    charge: 80,
    status: 'Completed',
    note: 'Customer requested size replacement from M to L. Steadfast reverse courier completed.',
  },
];

export const INITIAL_STAFF: StaffMember[] = [
  {
    id: 701,
    name: 'Admin Manager',
    email: 'admin@alvinawomen.com',
    role: 'Admin',
    permissions: {
      canEditOrders: true,
      canDeleteOrders: true,
      canApproveRefund: true,
      canViewProfit: true,
      canManageProducts: true,
    },
    status: 'Active',
  },
  {
    id: 702,
    name: 'Tasnim Hasan',
    email: 'tasnim@alvinawomen.com',
    role: 'Order Manager',
    permissions: {
      canEditOrders: true,
      canDeleteOrders: false,
      canApproveRefund: false,
      canViewProfit: true,
      canManageProducts: true,
    },
    status: 'Active',
  },
  {
    id: 703,
    name: 'Rimi Chowdhury',
    email: 'rimi@alvinawomen.com',
    role: 'Customer Support Executive',
    permissions: {
      canEditOrders: true,
      canDeleteOrders: false,
      canApproveRefund: false,
      canViewProfit: false,
      canManageProducts: false,
    },
    status: 'Active',
  },
  {
    id: 704,
    name: 'Mahfuz Alam',
    email: 'mahfuz@alvinawomen.com',
    role: 'Product Manager',
    permissions: {
      canEditOrders: false,
      canDeleteOrders: false,
      canApproveRefund: false,
      canViewProfit: false,
      canManageProducts: true,
    },
    status: 'Active',
  },
];

// Showroom POS initial records
export const INITIAL_POS_TRANSACTIONS: PosTransaction[] = [
  {
    id: 'POS-2026-104',
    date: new Date(Date.now() - 3600000 * 3).toISOString(),
    cashier: 'Tasnim Hasan',
    customerName: 'Mehnaz Parveen',
    customerPhone: '01715443322',
    items: [
      { name: 'Luxury Organza Embroidered Three Piece', price: 3250, qty: 1, size: 'M' },
    ],
    subtotal: 3250,
    discount: 150,
    total: 3100,
    paidAmount: 3100,
    changeAmount: 0,
    paymentType: 'Cash',
  },
  {
    id: 'POS-2026-103',
    date: new Date(Date.now() - 3600000 * 6).toISOString(),
    cashier: 'Tasnim Hasan',
    customerName: 'Shaila Sharmin',
    customerPhone: '01819334455',
    items: [
      { name: 'Handblock Printed Premium Cotton Kurti', price: 1450, qty: 2, size: 'L' },
    ],
    subtotal: 2900,
    discount: 0,
    total: 2900,
    paidAmount: 2900,
    changeAmount: 0,
    paymentType: 'bKash / Nagad',
  },
];

// Pre-Orders & Backorders
export const INITIAL_PREORDERS: PreOrder[] = [
  {
    id: 801,
    type: 'Showroom Preorder',
    customer: 'Lamia Tabassum',
    phone: '01923456789',
    productName: 'Royal Flared Anarkali Festive Gown (Emerald Green)',
    size: '42',
    expectedDate: '2026-10-25',
    advancePaid: 1500,
    totalPrice: 4800,
    status: 'Awaiting Stock',
    note: 'Special custom sizing ordered from embroidery unit',
  },
  {
    id: 802,
    type: 'Online Preorder',
    customer: 'Tahmina Akhter',
    phone: '01711224466',
    productName: 'Emerald Festive Silk Co-ord Set',
    size: '38',
    expectedDate: '2026-10-18',
    advancePaid: 1000,
    totalPrice: 2550,
    status: 'Stock Received',
    note: 'Customer asked to hold until Saturday',
  },
];

// Returns & Refunds
export const INITIAL_RETURNS: ReturnRefund[] = [
  {
    id: 901,
    orderId: '98402',
    customer: 'Dr. Shahana Begum',
    phone: '01819223344',
    productName: 'Handblock Printed Cotton Kurti',
    refundAmount: 1450,
    refundMethod: 'bKash',
    reason: 'Customer ordered wrong color by mistake',
    status: 'Refunded',
    approvedBy: 'Admin Manager',
  },
  {
    id: 902,
    orderId: '98405',
    customer: 'Farzana Haque',
    phone: '01799887766',
    productName: 'Luxury Organza Three Piece',
    refundAmount: 3250,
    refundMethod: 'bKash',
    reason: 'Defect in inner cloth stitch',
    status: 'Pending',
  },
];

// Product Variants
export const INITIAL_VARIANTS: ProductVariant[] = [
  { id: 1001, productId: 401, productName: 'Luxury Organza Three Piece', color: 'Pastel Peach', size: 'M', sku: 'ALV-ORG-PCH-M', stock: 8, priceModifier: 0 },
  { id: 1002, productId: 401, productName: 'Luxury Organza Three Piece', color: 'Pastel Peach', size: 'L', sku: 'ALV-ORG-PCH-L', stock: 10, priceModifier: 0 },
  { id: 1003, productId: 401, productName: 'Luxury Organza Three Piece', color: 'Lavender Rose', size: 'M', sku: 'ALV-ORG-LAV-M', stock: 6, priceModifier: 0 },
  { id: 1004, productId: 402, productName: 'Handblock Printed Cotton Kurti', color: 'Ivory Blue', size: 'S', sku: 'ALV-KRT-BLU-S', stock: 15, priceModifier: 0 },
  { id: 1005, productId: 402, productName: 'Handblock Printed Cotton Kurti', color: 'Ivory Blue', size: 'M', sku: 'ALV-KRT-BLU-M', stock: 20, priceModifier: 0 },
  { id: 1006, productId: 403, productName: 'Emerald Festive Silk Co-ord Set', color: 'Deep Emerald', size: 'Free Size', sku: 'ALV-CRD-EMR-FS', stock: 18, priceModifier: 0 },
];

// Product Bundles
export const INITIAL_BUNDLES: ProductBundle[] = [
  {
    id: 1101,
    name: 'Eid Festive Wardrobe Combo (Three Piece + Kurti)',
    bundlePrice: 4200,
    regularTotal: 4700,
    savings: 500,
    includedProducts: ['Luxury Organza Three Piece', 'Handblock Cotton Kurti'],
    status: 'Active',
  },
  {
    id: 1102,
    name: 'Party Elegance Duo (Anarkali Gown + Silk Co-ord)',
    bundlePrice: 6800,
    regularTotal: 7350,
    savings: 550,
    includedProducts: ['Royal Flared Anarkali Festive Gown', 'Emerald Festive Silk Co-ord Set'],
    status: 'Active',
  },
];

// Stock Audit
export const INITIAL_STOCK_AUDITS: StockAuditRecord[] = [
  {
    id: 1201,
    date: '2026-10-10',
    productName: 'Luxury Organza Embroidered Three Piece',
    systemStock: 25,
    physicalStock: 24,
    difference: -1,
    auditor: 'Mahfuz Alam',
    status: 'Discrepancy',
    notes: 'One piece shifted to photoshoot display window',
  },
  {
    id: 1202,
    date: '2026-10-09',
    productName: 'Handblock Printed Premium Cotton Kurti',
    systemStock: 45,
    physicalStock: 45,
    difference: 0,
    auditor: 'Mahfuz Alam',
    status: 'Balanced',
    notes: 'Physical count verified in Banani showroom inventory',
  },
];

// Price History
export const INITIAL_PRICE_HISTORY: PriceChangeRecord[] = [
  {
    id: 1301,
    productId: 401,
    productName: 'Luxury Organza Embroidered Three Piece',
    oldPrice: 3850,
    newPrice: 3650,
    changeDate: '2026-10-01',
    changedBy: 'Admin Manager',
    reason: 'Pre-Eid campaign promotional markdown',
  },
  {
    id: 1302,
    productId: 404,
    productName: 'Royal Flared Anarkali Festive Gown',
    oldPrice: 4950,
    newPrice: 5200,
    changeDate: '2026-09-20',
    changedBy: 'Admin Manager',
    reason: 'Increased fabric raw material & zari embroidery stitching cost',
  },
];

// COD Settlements
export const INITIAL_COD_SETTLEMENTS: CodSettlement[] = [
  {
    id: 1401,
    courierName: 'Steadfast Courier',
    consignmentCount: 14,
    totalCodDue: 42800,
    totalReceived: 42800,
    pendingCod: 0,
    settlementDate: '2026-10-10',
    referenceId: 'ST-STLM-88912',
    status: 'Full Settled',
  },
  {
    id: 1402,
    courierName: 'Pathao Courier',
    consignmentCount: 9,
    totalCodDue: 26500,
    totalReceived: 21000,
    pendingCod: 5500,
    settlementDate: '2026-10-09',
    referenceId: 'PTH-DISB-44120',
    status: 'Partial',
  },
  {
    id: 1403,
    courierName: 'RedX Logistics',
    consignmentCount: 6,
    totalCodDue: 18400,
    totalReceived: 0,
    pendingCod: 18400,
    settlementDate: '2026-10-11',
    referenceId: 'REDX-CYCLE-12',
    status: 'Pending',
  },
];

// Suppliers
export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 1501,
    companyName: 'Narayanganj Pure Silk & Organza Mills',
    contactPerson: 'Haji Shamsul Haque',
    phone: '01712-445566',
    category: 'Fabrics',
    address: 'Tanbazar, Narayanganj',
    totalPurchased: 340000,
    dueBalance: 25000,
  },
  {
    id: 1502,
    companyName: 'Chawkbazar Zari & Lace Emporium',
    contactPerson: 'Kamrul Islam',
    phone: '01819-778899',
    category: 'Zari & Accessories',
    address: 'Chawkbazar, Old Dhaka',
    totalPurchased: 125000,
    dueBalance: 0,
  },
  {
    id: 1503,
    companyName: 'Green Pack Premium Box & Poly',
    contactPerson: 'Zakir Hossain',
    phone: '01911-332211',
    category: 'Packaging Bags',
    address: 'Arambagh, Dhaka',
    totalPurchased: 65000,
    dueBalance: 4500,
  },
];

export const INITIAL_PURCHASES: PurchaseOrder[] = [
  {
    id: 1601,
    supplierId: 1501,
    supplierName: 'Narayanganj Pure Silk & Organza Mills',
    invoiceNo: 'NSM-PO-409',
    date: '2026-10-05',
    itemName: 'Grade-A Organza Fabric (200 Yards)',
    quantity: 200,
    totalCost: 56000,
    paidAmount: 56000,
    dueAmount: 0,
    status: 'Received',
  },
  {
    id: 1602,
    supplierId: 1503,
    supplierName: 'Green Pack Premium Box & Poly',
    invoiceNo: 'GP-BOX-882',
    date: '2026-10-08',
    itemName: 'Custom Matte Boutique Polybags with Logo (2000 pcs)',
    quantity: 2000,
    totalCost: 18000,
    paidAmount: 13500,
    dueAmount: 4500,
    status: 'Received',
  },
];

// Multi-Store & Warehouses
export const INITIAL_WAREHOUSES: Warehouse[] = [
  {
    id: 1701,
    name: 'Central Banani Hub & Showroom',
    type: 'Central Hub',
    manager: 'Farhana Sultana',
    phone: '01956591199',
    location: 'Banani Road 11, Dhaka',
    totalItemStock: 340,
    status: 'Active',
  },
  {
    id: 1702,
    name: 'Dhanmondi Shimanto Square Outlet',
    type: 'Showroom Outlet',
    manager: 'Shirin Akter',
    phone: '01844556677',
    location: 'Shimanto Square, Dhanmondi',
    totalItemStock: 185,
    status: 'Active',
  },
  {
    id: 1703,
    name: 'Uttara Dispatch & Storage Depot',
    type: 'Sorting Warehouse',
    manager: 'Rashid Khan',
    phone: '01711223344',
    location: 'Sector 3, Uttara, Dhaka',
    totalItemStock: 120,
    status: 'Active',
  },
];

// Expenses
export const INITIAL_EXPENSES: ExpenseRecord[] = [
  { id: 1801, date: '2026-10-10', category: 'Facebook Ads', amount: 8500, paidTo: 'Meta Ads Manager (Credit Card)', method: 'Bank', receiptNo: 'FB-ADS-OCT-1', note: 'Eid campaign boost targeting Dhaka and Chittagong' },
  { id: 1802, date: '2026-10-08', category: 'Packaging', amount: 4500, paidTo: 'Green Pack Packaging', method: 'bKash', receiptNo: 'TRX-99812A', note: 'Bubble wrap and premium mailer delivery bags' },
  { id: 1803, date: '2026-10-05', category: 'Showroom Rent', amount: 45000, paidTo: 'Banani Building Authority', method: 'Bank', receiptNo: 'RENT-OCT-26', note: 'Monthly showroom advance' },
  { id: 1804, date: '2026-10-02', category: 'Utility & Tea', amount: 1800, paidTo: 'Showroom Caretaker & Tea boy', method: 'Cash', note: 'Guest hospitality & showroom tea' },
];

// Payment Reconciliation
export const INITIAL_RECONCILIATION: ReconciliationRecord[] = [
  { id: 1901, date: '2026-10-10', channel: 'bKash Merchant', gatewayRefTrx: 'BK-TRX-884102', systemOrderAmount: 2800, gatewayReceivedAmount: 2758, status: 'Matched', verifiedBy: 'Tasnim Hasan' },
  { id: 1902, date: '2026-10-09', channel: 'Courier COD Cash', gatewayRefTrx: 'ST-COD-99124', systemOrderAmount: 3230, gatewayReceivedAmount: 3230, status: 'Matched', verifiedBy: 'Tasnim Hasan' },
  { id: 1903, date: '2026-10-08', channel: 'Nagad Merchant', gatewayRefTrx: 'NGD-TRX-11029', systemOrderAmount: 2500, gatewayReceivedAmount: 2470, status: 'Matched', verifiedBy: 'Admin Manager' },
];

// CRM Customers & Fraud Checker
export const INITIAL_CRM_CUSTOMERS: CrmCustomer[] = [
  {
    id: 2001,
    name: 'Tanjina Akter',
    phone: '01711987654',
    email: 'tanjina@gmail.com',
    address: 'Dhanmondi, Dhaka',
    totalOrders: 6,
    deliveredCount: 6,
    cancelledCount: 0,
    totalSpent: 18900,
    fraudRiskScore: 'Safe',
    tags: ['VIP Regular', 'Three-Piece Fan', 'Quick Payment'],
    isBlacklisted: false,
    notes: 'Very trustworthy customer, never returns parcel.',
  },
  {
    id: 2002,
    name: 'Nusrat Jahan Chowdhury',
    phone: '01912554433',
    email: 'nusrat.ctg@yahoo.com',
    address: 'Chattogram',
    totalOrders: 4,
    deliveredCount: 4,
    cancelledCount: 0,
    totalSpent: 11200,
    fraudRiskScore: 'Safe',
    tags: ['Chittagong Buyer', 'Silk Co-ords'],
    isBlacklisted: false,
  },
  {
    id: 2003,
    name: 'Rana Ahmed (Reported)',
    phone: '01988001122',
    address: 'Mirpur 10, Dhaka',
    totalOrders: 3,
    deliveredCount: 0,
    cancelledCount: 3,
    totalSpent: 0,
    fraudRiskScore: 'High Risk / Fraud',
    tags: ['Fake Orders', 'Unreachable Rider'],
    isBlacklisted: true,
    notes: 'Phone switched off on rider arrival twice. Blacklisted.',
  },
];

// Promo Codes
export const INITIAL_PROMO_CODES: PromoCode[] = [
  { id: 2101, code: 'EIDEXCLUSIVE', discountType: 'percentage', discountValue: 10, minOrderValue: 2000, maxUsageLimit: 200, usedCount: 42, expiryDate: '2026-11-15', status: 'Active' },
  { id: 2102, code: 'ALVINA200', discountType: 'fixed', discountValue: 200, minOrderValue: 2500, maxUsageLimit: 150, usedCount: 88, expiryDate: '2026-10-31', status: 'Active' },
  { id: 2103, code: 'BOISHAKHI', discountType: 'percentage', discountValue: 15, minOrderValue: 3000, maxUsageLimit: 100, usedCount: 100, expiryDate: '2026-05-01', status: 'Expired' },
];

// Flash Sales
export const INITIAL_FLASH_SALES: FlashSale[] = [
  { id: 2201, title: 'Friday Midnight Exclusive Flash Sale', discountPercent: 20, startTime: '2026-10-16 20:00', endTime: '2026-10-16 23:59', applicableCategory: 'Three Piece', status: 'Upcoming' },
  { id: 2202, title: 'Flash Hour - Kurti Mania', discountPercent: 15, startTime: '2026-10-11 14:00', endTime: '2026-10-11 18:00', applicableCategory: 'Kurti', status: 'Live Now' },
];

// Gift Cards
export const INITIAL_GIFT_CARDS: GiftCard[] = [
  { id: 2301, code: 'ALV-GIFT-5000-X9', customerName: 'Sabrina Mostofa', customerPhone: '01811554433', balance: 2500, originalAmount: 5000, issuedDate: '2026-10-01', expiryDate: '2027-01-01', status: 'Active' },
  { id: 2302, code: 'ALV-GIFT-2000-M2', customerName: 'Fariha Anjum', customerPhone: '01712998877', balance: 2000, originalAmount: 2000, issuedDate: '2026-10-05', expiryDate: '2027-02-01', status: 'Active' },
];

// Loyalty Accounts
export const INITIAL_LOYALTY: LoyaltyAccount[] = [
  { id: 2401, customerName: 'Tanjina Akter', customerPhone: '01711987654', points: 450, tier: 'VIP', lifetimeEarned: 850, lastUsedDate: '2026-10-05' },
  { id: 2402, customerName: 'Nusrat Jahan Chowdhury', customerPhone: '01912554433', points: 280, tier: 'Gold', lifetimeEarned: 350 },
  { id: 2403, customerName: 'Sadia Islam Mim', customerPhone: '01844123987', points: 140, tier: 'Silver', lifetimeEarned: 140 },
];

// Affiliate Partners
export const INITIAL_AFFILIATES: AffiliatePartner[] = [
  { id: 2501, name: 'Sanjida Fashion Blog', phone: '01722889900', affiliateCode: 'SANJIDA_ALV', commissionRate: 8, referredOrdersCount: 18, totalSalesGenerated: 58200, earningsBalance: 1650, paidEarnings: 3000, status: 'Active' },
  { id: 2502, name: 'Dhaka Stylist Mim', phone: '01933776655', affiliateCode: 'MIM_STYLE', commissionRate: 7, referredOrdersCount: 9, totalSalesGenerated: 27400, earningsBalance: 1918, paidEarnings: 0, status: 'Active' },
];

// Marketing Campaigns
export const INITIAL_CAMPAIGNS: MarketingCampaign[] = [
  {
    id: 2601,
    name: 'Eid Exclusive New Arrival Blast',
    channel: 'WhatsApp',
    targetAudience: 'All Customers',
    messageTemplate: '🌸 ALVINA Women Wear: আমাদের নতুন এক্সক্লুসিভ অর্গানজা ও সিল্ক কালেকশন এসে গেছে! ভিজিট করুন: alvinawomen.com',
    scheduledTime: '2026-10-12 11:00 AM',
    sentCount: 1250,
    deliveredRate: '98.4%',
    status: 'Sent',
  },
  {
    id: 2602,
    name: 'Cart Reminder / Discount Code SMS',
    channel: 'SMS',
    targetAudience: 'Abandoned Cart',
    messageTemplate: 'ALVINA: আপনার পছন্দের ড্রেসটি এখনো ব্যাগে রয়েছে! আজই অর্ডার করুন এবং ALVINA200 কোড দিয়ে ২০০৳ ছাড় পান।',
    scheduledTime: '2026-10-14 05:00 PM',
    sentCount: 320,
    deliveredRate: '99.1%',
    status: 'Scheduled',
  },
];

// Support Tickets
export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 2701,
    orderId: '98412',
    customerName: 'Tanjina Akter',
    customerPhone: '01711987654',
    issueType: 'Late Delivery',
    priority: 'Medium',
    status: 'In Progress',
    assignedTo: 'Rimi Chowdhury',
    createdDate: '2026-10-11',
    notes: 'Steadfast rider got delayed in Dhanmondi traffic; customer notified.',
  },
  {
    id: 2702,
    orderId: '98408',
    customerName: 'Sumaiya Kabir',
    customerPhone: '01723445566',
    issueType: 'Wrong Size',
    priority: 'High',
    status: 'Resolved',
    assignedTo: 'Rimi Chowdhury',
    createdDate: '2026-10-09',
    notes: 'Size replacement from M to L approved and dispatched via reverse courier.',
  },
];

// Wholesale Buyers
export const INITIAL_WHOLESALE: WholesaleBuyer[] = [
  { id: 2801, businessName: 'Rongon Boutique Sylhet', contactPerson: 'Kazi Mahbub', phone: '01711-889977', district: 'Sylhet', creditLimit: 150000, outstandingDue: 35000, tierDiscount: 22, status: 'Approved' },
  { id: 2802, businessName: 'Priyotoma Fashion Bogura', contactPerson: 'Moniruzzaman', phone: '01812-334455', district: 'Bogura', creditLimit: 100000, outstandingDue: 0, tierDiscount: 20, status: 'Approved' },
];

// Tracking Pixels
export const INITIAL_PIXELS: TrackingPixel[] = [
  { id: 2901, platform: 'Facebook Meta Pixel', pixelId: '984210948211029', eventTracking: ['PageView', 'AddToCart', 'InitiateCheckout', 'Purchase'], status: 'Active' },
  { id: 2902, platform: 'Google Analytics 4', pixelId: 'G-ALVINA9842', eventTracking: ['page_view', 'purchase', 'view_item'], status: 'Active' },
  { id: 2903, platform: 'TikTok Pixel', pixelId: 'C8849J12K899', eventTracking: ['CompletePayment', 'AddToCart'], status: 'Paused' },
];

// Approval Requests
export const INITIAL_APPROVALS: ApprovalRequest[] = [
  { id: 3001, requestType: 'High Discount', requestedBy: 'Tasnim Hasan', amountOrDetails: 'Special discount 500৳ for VIP customer order #98415', reason: 'Customer buying 3 sets at once for family wedding', requestDate: '2026-10-11', status: 'Approved', actionedBy: 'Admin Manager' },
  { id: 3002, requestType: 'Refund Approval', requestedBy: 'Rimi Chowdhury', amountOrDetails: 'Refund 3250৳ for Order #98405 (Inner stitch issue)', reason: 'Customer returned parcel and verified by showroom', requestDate: '2026-10-11', status: 'Pending' },
  { id: 3003, requestType: 'Large Expense', requestedBy: 'Mahfuz Alam', amountOrDetails: 'Fabric advance 25,000৳ for Narayanganj Silk Mills', reason: 'Raw material booking for wedding season', requestDate: '2026-10-10', status: 'Approved', actionedBy: 'Admin Manager' },
];

// Audit Trail & Logs
export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  { id: 3101, timestamp: '2026-10-11 11:24 AM', user: 'admin', action: 'Update Order Status', entity: 'Order #98412', details: 'Status changed from Pending to Processing', ipAddress: '103.112.44.12' },
  { id: 3102, timestamp: '2026-10-11 10:15 AM', user: 'admin', action: 'Approval Granted', entity: 'Approval #3001', details: 'High discount request approved for Order #98415', ipAddress: '103.112.44.12' },
  { id: 3103, timestamp: '2026-10-10 04:30 PM', user: 'tasnim', action: 'POS Transaction', entity: 'POS-2026-104', details: 'Cash memo generated 3100৳ for Mehnaz Parveen' },
  { id: 3104, timestamp: '2026-10-10 02:15 PM', user: 'admin', action: 'COD Settlement', entity: 'Steadfast Settlement', details: 'Full settlement verified for 42,800 BDT' },
];

// API & Webhooks
export const INITIAL_WEBHOOKS: ApiWebhook[] = [
  { id: 3201, name: 'Steadfast Courier API', service: 'Steadfast Courier API', endpointUrl: 'https://portal.steadfast.com.bd/api/v1/create_order', apiKeyOrSecret: 'sf_live_sec_8849201948', status: 'Connected', lastTriggered: '2026-10-11 10:30 AM' },
  { id: 3202, name: 'Pathao Logistics API', service: 'Pathao Logistics API', endpointUrl: 'https://api.pathao.com/aladdin/api/v1/orders', apiKeyOrSecret: 'pth_oauth_token_bearer', status: 'Connected', lastTriggered: '2026-10-11 08:45 AM' },
  { id: 3203, name: 'bKash Merchant Instant Webhook', service: 'bKash Merchant Webhook', endpointUrl: 'https://alvinawomen.com/api/bkash-webhook', apiKeyOrSecret: 'bk_live_app_key_99182', status: 'Connected', lastTriggered: '2026-10-11 11:00 AM' },
  { id: 3204, name: 'Bulk SMS Gateway API', service: 'SMS Gateway API', endpointUrl: 'https://sms.greenweb.com.bd/api.php', apiKeyOrSecret: 'gw_sms_token_48102', status: 'Connected', lastTriggered: '2026-10-10 05:00 PM' },
];

// Documents
export const INITIAL_DOCUMENTS: DocumentFile[] = [
  { id: 3301, title: 'Steadfast Settlement Memo Oct 10.pdf', category: 'Chalan Slip', date: '2026-10-10', fileSize: '1.4 MB', uploadedBy: 'Admin Manager' },
  { id: 3302, title: 'Narayanganj Silk Mill Fabric Purchase Invoice.pdf', category: 'Supplier Receipt', date: '2026-10-05', fileSize: '2.1 MB', uploadedBy: 'Mahfuz Alam' },
  { id: 3303, title: 'Banani Showroom Trade License 2026-27.pdf', category: 'Trade License', date: '2026-07-01', fileSize: '3.6 MB', uploadedBy: 'Admin Manager' },
  { id: 3304, title: 'Monthly Tax Return Submission Proof.pdf', category: 'Tax Document', date: '2026-09-30', fileSize: '980 KB', uploadedBy: 'Admin Manager' },
];

// Website Leads & Dropped Cart Visitors
export const INITIAL_WEBSITE_LEADS: WebsiteLead[] = [
  {
    id: 501,
    name: 'তানজিলা হক (Tanzila)',
    phone: '01712495831',
    viewedDress: 'ALVINA Luxury Cotton Three Piece - Block Print',
    cartItems: [
      { name: 'ALVINA Luxury Cotton Three Piece - Block Print', size: '38', price: 2850 },
    ],
    cartTotal: 2850,
    timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    activityType: 'Initiated Checkout',
    status: 'WhatsApp Contacted',
    notes: 'চেকআউট পেজে গিয়ে ফোন নম্বর লিখেছে কিন্তু অর্ডার কনফার্ম করেনি',
  },
  {
    id: 502,
    name: 'ফারজানা আক্তার (Farjana)',
    phone: '01894120934',
    viewedDress: 'Lawn Embroidered Collection - Royal Purple',
    cartItems: [
      { name: 'Lawn Embroidered Collection - Royal Purple', size: '42', price: 3400 },
    ],
    cartTotal: 3400,
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    activityType: 'Added to Cart',
    status: 'New Lead',
    notes: 'কার্টে ড্রেস অ্যাড করে রেখেছে, সাইজ ৪২ প্রয়োজন',
  },
  {
    id: 503,
    name: 'নাবিল আহমেদ (Nabila)',
    phone: '01923485120',
    viewedDress: 'Khadi Cotton Screen Print Dress',
    cartItems: [],
    cartTotal: 2600,
    timestamp: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
    activityType: 'Viewed Product',
    status: 'WhatsApp Contacted',
    notes: 'ড্রেস পেজ ৩ বার ভিউ করেছে এবং সাইজ চার্ট চেক করেছে',
  },
  {
    id: 504,
    name: 'সাদিয়া ইসলাম (Sadia)',
    phone: '01683920194',
    viewedDress: 'Jamdani Luxury Saree - Gold Zari',
    cartItems: [
      { name: 'Jamdani Luxury Saree - Gold Zari', size: 'Free', price: 4950 },
    ],
    cartTotal: 4950,
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    activityType: 'Initiated Checkout',
    status: 'Converted to Order',
    notes: 'পরে ফোন দিয়ে অর্ডার কনফার্ম করা হয়েছে',
  },
];
