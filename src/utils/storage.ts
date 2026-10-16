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
} from '../data/initialData';

export function getStoredData<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem('alvina_v2_' + key);
    if (!item) return defaultValue;
    return JSON.parse(item) as T;
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return defaultValue;
  }
}

export function setStoredData<T>(key: string, value: T): void {
  try {
    localStorage.setItem('alvina_v2_' + key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
}

export function initializeStorage() {
  const checkAndSet = (key: string, def: any) => {
    if (!localStorage.getItem('alvina_v2_' + key)) {
      setStoredData(key, def);
    }
  };

  checkAndSet('config', INITIAL_CONFIG);
  checkAndSet('merchants', INITIAL_MERCHANTS);
  checkAndSet('websites', INITIAL_WEBSITES);
  checkAndSet('landings', INITIAL_LANDINGS);
  checkAndSet('products', INITIAL_PRODUCTS);
  checkAndSet('orders', INITIAL_ORDERS);
  checkAndSet('couriers', INITIAL_COURIERS);
  checkAndSet('exchanges', INITIAL_EXCHANGES);
  checkAndSet('staff', INITIAL_STAFF);

  // New modules
  checkAndSet('pos', INITIAL_POS_TRANSACTIONS);
  checkAndSet('preorders', INITIAL_PREORDERS);
  checkAndSet('returns', INITIAL_RETURNS);
  checkAndSet('variants', INITIAL_VARIANTS);
  checkAndSet('bundles', INITIAL_BUNDLES);
  checkAndSet('stockAudit', INITIAL_STOCK_AUDITS);
  checkAndSet('priceHistory', INITIAL_PRICE_HISTORY);
  checkAndSet('codSettlement', INITIAL_COD_SETTLEMENTS);
  checkAndSet('suppliers', INITIAL_SUPPLIERS);
  checkAndSet('purchases', INITIAL_PURCHASES);
  checkAndSet('warehouses', INITIAL_WAREHOUSES);
  checkAndSet('expenses', INITIAL_EXPENSES);
  checkAndSet('reconciliation', INITIAL_RECONCILIATION);
  checkAndSet('crm', INITIAL_CRM_CUSTOMERS);
  checkAndSet('coupons', INITIAL_PROMO_CODES);
  checkAndSet('flashSales', INITIAL_FLASH_SALES);
  checkAndSet('giftCards', INITIAL_GIFT_CARDS);
  checkAndSet('loyalty', INITIAL_LOYALTY);
  checkAndSet('affiliates', INITIAL_AFFILIATES);
  checkAndSet('marketing', INITIAL_CAMPAIGNS);
  checkAndSet('tickets', INITIAL_TICKETS);
  checkAndSet('wholesale', INITIAL_WHOLESALE);
  checkAndSet('pixels', INITIAL_PIXELS);
  checkAndSet('approvals', INITIAL_APPROVALS);
  checkAndSet('auditLogs', INITIAL_AUDIT_LOGS);
  checkAndSet('apiWebhooks', INITIAL_WEBHOOKS);
  checkAndSet('documents', INITIAL_DOCUMENTS);
}
