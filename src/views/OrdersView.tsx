import React, { useState, useRef, useEffect } from 'react';
import { Order, OrderStatus, SystemConfig, Language } from '../types';
import {
  Search,
  Plus,
  Printer,
  MessageSquare,
  Edit2,
  Trash2,
  Filter,
  Truck,
  CheckSquare,
  Square,
  ArrowUpDown,
  Phone,
  MoreVertical,
  Send,
  RefreshCw,
  ArrowLeftRight,
  RotateCcw,
  CheckCircle2,
  Copy,
  Clock,
  ExternalLink,
  Download,
  Image,
  User,
  Ban,
  Tag,
  TrendingUp,
  SlidersHorizontal,
  Sparkles,
  Zap,
  Languages,
} from 'lucide-react';
import { ParcelTrackingTimelineModal } from '../components/ParcelTrackingTimelineModal';
import { CustomerProfileDrawer } from '../components/CustomerProfileDrawer';
import { WhatsAppTemplatesModal } from '../components/WhatsAppTemplatesModal';
import { OrderAuditTrailModal } from '../components/OrderAuditTrailModal';
import { sounds } from '../utils/soundEffects';

interface OrdersViewProps {
  orders: Order[];
  config: SystemConfig;
  onEditOrder: (order: Order) => void;
  onDeleteOrder: (orderId: number) => void;
  onUpdateStatus: (orderId: number, status: OrderStatus) => void;
  onOpenInvoice: (order: Order, format?: string) => void;
  onNewOrder: () => void;
  onOpenBulkCourier: (orders: Order[]) => void;
  onUpdateOrder?: (order: Order) => void;
  onNavigateToExchange?: (order: Order) => void;
  onNavigateToReturn?: (order: Order) => void;
  lang?: Language;
  onToggleLanguage?: () => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  config,
  onEditOrder,
  onDeleteOrder,
  onUpdateStatus,
  onOpenInvoice,
  onNewOrder,
  onOpenBulkCourier,
  onUpdateOrder,
  onNavigateToExchange,
  onNavigateToReturn,
  lang = 'bn',
  onToggleLanguage,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [active3DotOrderId, setActive3DotOrderId] = useState<number | null>(null);
  const [copiedTrackingId, setCopiedTrackingId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'detailed' | 'simple'>('detailed');

  // Interactive Modals
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [selectedCustomerPhone, setSelectedCustomerPhone] = useState<string | null>(null);
  const [whatsAppModalOrder, setWhatsAppModalOrder] = useState<Order | null>(null);
  const [auditOrder, setAuditOrder] = useState<Order | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);
  const isBn = lang === 'bn';

  // Close 3-dot dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActive3DotOrderId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSendToCourier = (order: Order) => {
    const courier = order.courierService || config.defaultCourier || 'Steadfast Courier';
    const prefix = courier.toLowerCase().includes('pathao') ? 'PTH' : courier.toLowerCase().includes('redx') ? 'RDX' : 'ST';
    const trackingCode = `${prefix}-${order.id}-${Math.floor(1000 + Math.random() * 9000)}`;
    const consignmentId = `CN-${Math.floor(100000 + Math.random() * 900000)}`;

    const updatedOrder: Order = {
      ...order,
      courierService: courier,
      courierTrackingCode: trackingCode,
      courierConsignmentId: consignmentId,
      courierStatus: 'In Transit',
      courierSentAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      status: 'Shipped',
    };

    sounds.playBeep();
    if (onUpdateOrder) {
      onUpdateOrder(updatedOrder);
    } else {
      onUpdateStatus(order.id, 'Shipped');
    }
    setActive3DotOrderId(null);
  };

  const handleUpdateCourierStatus = (order: Order, courierStatus: Order['courierStatus']) => {
    let orderStatus: OrderStatus = order.status;
    if (courierStatus === 'Delivered') {
      orderStatus = 'Delivered';
      sounds.playCashRegister();
    } else if (courierStatus === 'Returned') {
      orderStatus = 'Returned';
      sounds.playBeep();
    } else if (courierStatus === 'In Transit' || courierStatus === 'Out for Delivery') {
      orderStatus = 'Shipped';
      sounds.playBeep();
    } else if (courierStatus === 'Cancelled') {
      orderStatus = 'Cancelled';
      sounds.playBeep();
    }

    const updatedOrder: Order = {
      ...order,
      courierStatus,
      status: orderStatus,
    };

    if (onUpdateOrder) {
      onUpdateOrder(updatedOrder);
    } else {
      onUpdateStatus(order.id, orderStatus);
    }
    setActive3DotOrderId(null);
  };

  const statuses: OrderStatus[] = [
    'Pending',
    'Confirmed',
    'Processing',
    'Shipped',
    'Delivered',
    'Cancelled',
    'Returned',
    'Preorder',
  ];

  const handlePrintOrder = (order: Order, format?: string) => {
    sounds.playBeep();
    const updated: Order = {
      ...order,
      isPrinted: true,
    };
    if (onUpdateOrder) {
      onUpdateOrder(updated);
    }
    onOpenInvoice(updated, format);
  };

  const exportOrderAsImage = (order: Order) => {
    sounds.playBeep();
    const canvas = document.createElement('canvas');
    canvas.width = 650;
    canvas.height = 700;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#181024';
    ctx.fillRect(0, 0, canvas.width, 95);

    ctx.fillStyle = '#bd70df';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('ALVINA COMMERCE', 30, 45);

    ctx.fillStyle = '#cfc4d9';
    ctx.font = '13px sans-serif';
    ctx.fillText('Official Customer Receipt Memo', 30, 72);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText(`ORDER #${order.id}`, 480, 48);

    ctx.fillStyle = '#181024';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(`Date: ${new Date(order.date).toLocaleDateString()}`, 30, 130);
    ctx.fillText(`Customer: ${order.customer}`, 30, 160);
    ctx.fillText(`Phone: ${order.phone}`, 30, 190);
    ctx.fillText(`Address: ${order.address}`, 30, 220);
    ctx.fillText(`Courier: ${order.courierService || 'Steadfast Courier'}`, 30, 250);

    ctx.strokeStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.moveTo(30, 275);
    ctx.lineTo(620, 275);
    ctx.stroke();

    ctx.font = 'bold 15px sans-serif';
    ctx.fillText('Items Ordered:', 30, 310);

    let y = 340;
    order.items.forEach((item) => {
      ctx.font = '14px sans-serif';
      ctx.fillText(`• ${item.name} ${item.size ? `(Size: ${item.size})` : ''} x${item.qty}`, 40, y);
      ctx.fillText(`৳${item.price * item.qty}`, 520, y);
      y += 30;
    });

    ctx.strokeStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.moveTo(30, y + 10);
    ctx.lineTo(620, y + 10);
    ctx.stroke();

    y += 45;
    ctx.font = '14px sans-serif';
    ctx.fillText(`Subtotal: ৳${order.subtotal}`, 430, y);
    y += 25;
    ctx.fillText(`Delivery Charge: ৳${order.charge}`, 430, y);
    y += 25;
    ctx.fillText(`Total: ৳${order.total}`, 430, y);
    y += 35;

    ctx.fillStyle = '#16a34a';
    ctx.fillRect(400, y - 24, 210, 40);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(`Due COD: ৳${order.due}`, 420, y + 2);

    const link = document.createElement('a');
    link.download = `Alvina_Order_${order.id}.jpg`;
    link.href = canvas.toDataURL('image/jpeg', 0.95);
    link.click();
    setActive3DotOrderId(null);
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toString().includes(searchTerm) ||
      o.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.phone.includes(searchTerm) ||
      (o.invoiceNo && o.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (o.courierConsignmentId && o.courierConsignmentId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      o.items.some((i) => i.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === filteredOrders.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredOrders.map((o) => o.id));
    }
  };

  const handleBulkStatusChange = (newStatus: OrderStatus) => {
    if (newStatus === 'Delivered') {
      sounds.playCashRegister();
    } else {
      sounds.playBeep();
    }
    selectedIds.forEach((id) => {
      onUpdateStatus(id, newStatus);
    });
    setSelectedIds([]);
  };

  const handleBulkPrintStickers = () => {
    sounds.playBeep();
    if (selectedIds.length === 0) return;
    const firstSelected = orders.find((o) => o.id === selectedIds[0]);
    if (firstSelected) {
      handlePrintOrder(firstSelected, 'sticker4x6');
    }
  };

  const selectedOrdersList = orders.filter((o) => selectedIds.includes(o.id));

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-[#bd70df] uppercase tracking-wider">
                Order Operations Suite
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1e2f4f] text-[#60a5fa] border border-[#3b82f6]/40">
                {orders.length} Total Orders
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 mt-0.5">
              <span>ORDER MANAGEMENT & DISPATCH</span>
              <span className="text-xs text-[#a69ab1] font-normal">
                (অর্ডার পরিচালনা ও পার্সেল শিপিং)
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* View Mode Toggle (Simple View vs Full Details) */}
            <div className="flex items-center bg-[#100d16] p-1 rounded-xl border border-[#342b40] text-xs">
              <button
                type="button"
                onClick={() => setViewMode('simple')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  viewMode === 'simple'
                    ? 'bg-[#bd70df] text-[#160e1b] shadow-sm'
                    : 'text-[#a69ab1] hover:text-white'
                }`}
                title="Easy Mode: Clean & Essential columns only"
              >
                ⚡ Simple View (সহজ মোড)
              </button>
              <button
                type="button"
                onClick={() => setViewMode('detailed')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  viewMode === 'detailed'
                    ? 'bg-[#bd70df] text-[#160e1b] shadow-sm'
                    : 'text-[#a69ab1] hover:text-white'
                }`}
                title="Advanced Mode: Profit, Consignment, Audit, Courier status"
              >
                📊 Full Details (অ্যাডভান্সড)
              </button>
            </div>

            {/* Language toggle button */}
            {onToggleLanguage && (
              <button
                onClick={onToggleLanguage}
                className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-[#1b1524] hover:bg-[#2c2038] text-white border border-[#483959] transition-all flex items-center gap-1"
                title="Switch Language"
              >
                <Languages className="w-3.5 h-3.5 text-[#bd70df]" />
                <span>{isBn ? 'বাংলা' : 'EN'}</span>
              </button>
            )}

            <button
              onClick={() => {
                sounds.playBeep();
                onNewOrder();
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#bd70df] text-[#160e1b] hover:bg-[#d091ee] transition-all shadow-md active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>+ New Order (নতুন অর্ডার)</span>
            </button>
          </div>
        </div>

        {/* Search Bar + Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-[#2e2338]">
          <div className="relative flex-1 max-w-lg">
            <Search className="w-4 h-4 text-[#a69ab1] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Order ID, Phone, Customer, Consignment CN, or Dress name..."
              className="w-full pl-9 pr-3 py-2 bg-[#100d16] border border-[#342b40] rounded-xl text-xs text-white placeholder:text-[#6d5f7b] focus:border-[#bd70df] outline-none"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-[#a69ab1]">
            <span>Found: <strong className="text-white font-mono">{filteredOrders.length}</strong> orders</span>
          </div>
        </div>

        {/* Status Filter Tabs (Under Search Bar per user request) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setStatusFilter('All')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-bold transition-colors ${
              statusFilter === 'All'
                ? 'bg-[#bd70df] text-[#160e1b]'
                : 'bg-[#100d16] text-[#bcb1c7] hover:text-white border border-[#342b40]'
            }`}
          >
            All Orders ({orders.length})
          </button>
          {statuses.map((st) => {
            const count = orders.filter((o) => o.status === st).length;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
                  statusFilter === st
                    ? 'bg-[#bd70df] text-[#160e1b] font-bold shadow-sm'
                    : 'bg-[#100d16] text-[#bcb1c7] hover:text-white border border-[#342b40]'
                }`}
              >
                {st} ({count})
              </button>
            );
          })}
        </div>

        {/* Selected Items Bulk Bar (with 1-Click Send All to Courier & Print All Stickers) */}
        {selectedIds.length > 0 && (
          <div className="p-3 rounded-xl bg-gradient-to-r from-[#2a1738] to-[#1c1226] border border-[#714786] flex flex-wrap items-center justify-between gap-3 text-xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#bd70df] animate-ping" />
              <span className="text-[#f7dcff] font-bold">
                {selectedIds.length} orders selected (নির্বাচিত)
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => onOpenBulkCourier(selectedOrdersList)}
                className="px-3 py-1.5 rounded-lg bg-[#10b981] text-[#062419] font-bold flex items-center gap-1.5 shadow-sm hover:brightness-110"
                title="Send all selected orders to courier"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>🚚 Send All to Courier</span>
              </button>

              <button
                onClick={handleBulkPrintStickers}
                className="px-3 py-1.5 rounded-lg bg-[#bd70df] text-[#160e1b] font-bold flex items-center gap-1.5 shadow-sm hover:bg-[#d091ee]"
                title="Batch print 4x6 thermal parcel stickers"
              >
                <Tag className="w-3.5 h-3.5" />
                <span>🏷️ Print Thermal Stickers</span>
              </button>

              <div className="flex items-center gap-1 bg-[#100d16] p-0.5 rounded-lg border border-[#443454]">
                <span className="text-[#a69ab1] px-1 text-[10px]">Status:</span>
                {['Confirmed', 'Processing', 'Shipped', 'Delivered'].map((st) => (
                  <button
                    key={st}
                    onClick={() => handleBulkStatusChange(st as OrderStatus)}
                    className="px-2 py-1 rounded text-[11px] font-semibold bg-[#181520] hover:bg-[#392449] text-white"
                  >
                    {st}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setSelectedIds([])}
                className="px-2.5 py-1 text-xs text-[#ff9aaa] hover:underline"
              >
                Deselect
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Orders Table Container */}
      <div className="rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#14101c] border-b border-[#342b40] text-[#a69ab1]">
                <th className="py-3 px-3 w-8">
                  <button onClick={selectAll} className="text-[#a69ab1] hover:text-white" title="Select all orders">
                    {selectedIds.length > 0 && selectedIds.length === filteredOrders.length ? (
                      <CheckSquare className="w-4 h-4 text-[#bd70df]" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-3 font-semibold whitespace-nowrap">Order ID & Date</th>
                <th className="py-3 px-3 font-semibold whitespace-nowrap">Invoice</th>
                <th className="py-3 px-3 font-semibold">Customer & Address</th>
                <th className="py-3 px-3 font-semibold">Product</th>
                <th className="py-3 px-3 font-semibold whitespace-nowrap">Size & Qty</th>

                {viewMode === 'detailed' && (
                  <>
                    <th className="py-3 px-3 font-semibold whitespace-nowrap">Print Status</th>
                    <th className="py-3 px-3 font-semibold whitespace-nowrap">Courier & Consignment</th>
                    <th className="py-3 px-3 font-semibold whitespace-nowrap">Entry User</th>
                    <th className="py-3 px-3 font-semibold whitespace-nowrap">Source</th>
                  </>
                )}

                <th className="py-3 px-3 font-semibold whitespace-nowrap">Shipping & COD</th>

                {viewMode === 'detailed' && (
                  <th className="py-3 px-3 font-semibold whitespace-nowrap">Net Profit (লাভ)</th>
                )}

                <th className="py-3 px-3 font-semibold whitespace-nowrap">Status</th>
                <th className="py-3 px-3 font-semibold text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#282033]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={viewMode === 'detailed' ? 14 : 9} className="py-12 text-center text-[#a69ab1]">
                    No orders found. Click "+ New Order" to create one.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o, idx) => {
                  const isSelected = selectedIds.includes(o.id);
                  const dateStr = new Date(o.date).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  });
                  const invoiceId = o.invoiceNo || `INV-${o.id}`;
                  const consignmentId = o.courierConsignmentId || (o.courierTrackingCode ? `CN-${o.courierTrackingCode.slice(-6)}` : 'Pending CN');
                  const entryUser = o.enteredBy || config.user || 'Admin';

                  // Live Profit Calculation
                  const estimatedCost = o.items.reduce(
                    (sum, it) => sum + (it.costPrice || (it.price * 0.55)),
                    0
                  );
                  const netProfit = Math.max(0, o.total - estimatedCost - o.charge - 40);
                  const profitMargin = Math.round((netProfit / (o.total || 1)) * 100);

                  return (
                    <tr
                      key={`order-${o.id}-${idx}`}
                      className={`hover:bg-[#201927] transition-colors ${
                        isSelected ? 'bg-[#291e32]' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-3">
                        <button
                          onClick={() => toggleSelect(o.id)}
                          className="text-[#a69ab1] hover:text-white"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-[#bd70df]" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* 1. Order ID & Date */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="font-mono font-bold text-white text-sm">#{o.id}</div>
                        <div className="text-[11px] text-[#a69ab1] mt-0.5">{dateStr}</div>
                      </td>

                      {/* 2. Invoice */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handlePrintOrder(o, 'sticker4x6')}
                          className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-lg bg-[#271b36] hover:bg-[#3d2454] text-[#e6b4fa] border border-[#5d3870] transition-colors"
                          title="Click to print 4x6 Thermal Sticker"
                        >
                          {invoiceId}
                        </button>
                      </td>

                      {/* 3. Customer Info (Clicking opens 360 Customer Profile Drawer) */}
                      <td className="py-3 px-3 max-w-xs">
                        <button
                          type="button"
                          onClick={() => setSelectedCustomerPhone(o.phone)}
                          className="font-semibold text-white hover:text-[#bd70df] text-left truncate block transition-colors group"
                          title="Click to view Customer 360° Profile & Lifetime Spend"
                        >
                          <span className="group-hover:underline">{o.customer}</span>
                          <span className="text-[10px] text-[#bd70df] ml-1.5 opacity-80 group-hover:opacity-100">👤 360°</span>
                        </button>
                        <div
                          onClick={() => setSelectedCustomerPhone(o.phone)}
                          className="font-mono text-[#d6c7e3] flex items-center gap-1 mt-0.5 text-[11px] cursor-pointer hover:text-white"
                        >
                          <Phone className="w-3 h-3 text-[#bd70df]" />
                          <span>{o.phone}</span>
                        </div>
                        <div className="text-[11px] text-[#a69ab1] truncate mt-0.5" title={o.address}>
                          {o.address}
                        </div>
                      </td>

                      {/* 4. Product */}
                      <td className="py-3 px-3 max-w-[180px]">
                        <div className="space-y-0.5">
                          {o.items.map((item, idx) => (
                            <div key={idx} className="text-[#d7cddd] leading-tight truncate" title={item.name}>
                              <span className="font-medium text-white">{item.name}</span>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* 5. Size & Quantity */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="space-y-0.5">
                          {o.items.map((item, idx) => (
                            <div key={idx} className="text-xs font-mono text-[#cfc4d9]">
                              <span>{item.size ? `Size: ${item.size}` : 'Standard'}</span>
                              <span className="text-[#bd70df] font-bold ml-1">×{item.qty}</span>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Detailed Mode Columns */}
                      {viewMode === 'detailed' && (
                        <>
                          {/* 6. Print Status */}
                          <td className="py-3 px-3 whitespace-nowrap">
                            {o.isPrinted ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#143326] text-[#4ade80] border border-[#22c55e]/40 shadow-sm">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Printed ✓</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#332512] text-[#fcd34d] border border-[#f59e0b]/40">
                                <Clock className="w-3 h-3" />
                                <span>Not Printed</span>
                              </span>
                            )}
                          </td>

                          {/* 7. Courier & Consignment ID (Clicking opens Live Tracking Timeline) */}
                          <td className="py-3 px-3 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => setTrackingOrder(o)}
                              className="font-semibold text-white flex items-center gap-1 hover:text-[#bd70df] transition-colors text-left"
                              title="Click to view Real-Time Courier Journey Stepper"
                            >
                              <Truck className="w-3 h-3 text-[#bd70df]" />
                              <span>{o.courierService || config.defaultCourier || 'Courier'}</span>
                            </button>
                            <div
                              onClick={() => setTrackingOrder(o)}
                              className="text-[11px] font-mono text-[#bd70df] mt-0.5 flex items-center gap-1 cursor-pointer hover:underline"
                            >
                              <span>{consignmentId}</span>
                              <span className="text-[9px] px-1 py-0.2 rounded bg-[#271b35] text-[#e6b4fa]">Live ➔</span>
                            </div>
                          </td>

                          {/* 8. Entry User */}
                          <td className="py-3 px-3 whitespace-nowrap">
                            <div className="flex items-center gap-1.5 text-xs text-[#d7cddd]">
                              <User className="w-3 h-3 text-[#bd70df]" />
                              <span className="font-medium text-white">{entryUser}</span>
                            </div>
                          </td>

                          {/* 9. Source */}
                          <td className="py-3 px-3 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded-lg bg-[#251833] text-[#bd70df] border border-[#482b5e] font-medium text-[11px]">
                              {o.source}
                            </span>
                          </td>
                        </>
                      )}

                      {/* 10. Shipping & Due COD */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="font-mono font-bold text-sm text-[#bd70df] tabular-nums">
                          ৳{o.total}
                        </div>
                        <div className="text-[10px] font-semibold text-[#ff9aaa] tabular-nums">
                          Due COD: ৳{o.due}
                        </div>
                      </td>

                      {/* 11. Net Profit per Order (Live Calculation) */}
                      {viewMode === 'detailed' && (
                        <td className="py-3 px-3 whitespace-nowrap">
                          <div className="font-mono font-bold text-xs text-[#36c98b] tabular-nums">
                            +৳{netProfit}
                          </div>
                          <div className="text-[10px] text-[#a69ab1] font-mono">
                            {profitMargin}% margin
                          </div>
                        </td>
                      )}

                      {/* 12. Status */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <select
                          value={o.status}
                          onChange={(e) => {
                            const newSt = e.target.value as OrderStatus;
                            if (newSt === 'Delivered') {
                              sounds.playCashRegister();
                            } else {
                              sounds.playBeep();
                            }
                            onUpdateStatus(o.id, newSt);
                          }}
                          className={`text-xs px-2.5 py-1 rounded-full border outline-none font-semibold cursor-pointer shadow-sm ${
                            o.status === 'Delivered'
                              ? 'bg-[#16382d] text-[#8de8bf] border-[#255845]'
                              : o.status === 'Cancelled'
                              ? 'bg-[#44202a] text-[#ff9aaa] border-[#6b2a3a]'
                              : o.status === 'Shipped'
                              ? 'bg-[#1c2e4a] text-[#93c5fd] border-[#2b4c7e]'
                              : o.status === 'Returned'
                              ? 'bg-[#3b1d22] text-[#fca5a5] border-[#7f1d1d]'
                              : o.status === 'Preorder'
                              ? 'bg-[#3b2b10] text-[#fde68a] border-[#855318]'
                              : 'bg-[#34213d] text-[#e3b7f3] border-[#553265]'
                          }`}
                        >
                          {statuses.map((st) => (
                            <option key={st} value={st} className="bg-[#181520] text-white">
                              {st}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* 13. Actions (3-Dot Action Button) */}
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <div className="relative inline-block text-left">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActive3DotOrderId(active3DotOrderId === o.id ? null : o.id);
                            }}
                            className={`p-1.5 rounded-lg border transition-all ${
                              active3DotOrderId === o.id
                                ? 'bg-[#bd70df] text-[#120b17] border-[#bd70df]'
                                : 'text-[#d6c7e3] bg-[#221a2c] hover:bg-[#322344] border-[#443358]'
                            }`}
                            title="Actions (3-Dot Menu)"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {/* 3-Dot Action Dropdown Menu */}
                          {active3DotOrderId === o.id && (
                            <div
                              ref={menuRef}
                              className="absolute right-0 mt-1.5 w-64 rounded-2xl bg-[#171221] border border-[#5d3a78] shadow-2xl p-2 z-50 text-left space-y-1 animate-in fade-in zoom-in-95"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="px-2.5 py-1.5 border-b border-[#342b40] flex items-center justify-between">
                                <span className="text-[11px] font-bold text-white">Order #{o.id}</span>
                                <span className="text-[10px] text-[#bd70df] font-mono">৳{o.total}</span>
                              </div>

                              {/* 1. Print 4x6 Thermal Parcel Sticker */}
                              <button
                                type="button"
                                onClick={() => {
                                  handlePrintOrder(o, 'sticker4x6');
                                  setActive3DotOrderId(null);
                                }}
                                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-[#7a2e9e] to-[#a344cb] hover:brightness-110 transition-all shadow-sm"
                              >
                                <Tag className="w-3.5 h-3.5 text-white" />
                                <span>Print 4x6 Thermal Sticker</span>
                              </button>

                              {/* 2. WhatsApp Automation Hub */}
                              <button
                                type="button"
                                onClick={() => {
                                  setWhatsAppModalOrder(o);
                                  setActive3DotOrderId(null);
                                }}
                                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#25D366] hover:bg-[#25D366]/10 transition-colors"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>WhatsApp Message Hub (4 Tpls)</span>
                              </button>

                              {/* 3. Live Courier Tracking Timeline */}
                              <button
                                type="button"
                                onClick={() => {
                                  setTrackingOrder(o);
                                  setActive3DotOrderId(null);
                                }}
                                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#d7cddd] hover:text-white hover:bg-[#251833] transition-colors"
                              >
                                <Truck className="w-3.5 h-3.5 text-[#60a5fa]" />
                                <span>Live Parcel Timeline</span>
                              </button>

                              {/* 4. Customer 360 Profile */}
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedCustomerPhone(o.phone);
                                  setActive3DotOrderId(null);
                                }}
                                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#d7cddd] hover:text-white hover:bg-[#251833] transition-colors"
                              >
                                <User className="w-3.5 h-3.5 text-[#e879f9]" />
                                <span>Customer 360° Profile</span>
                              </button>

                              {/* 5. Order Audit Trail & History Log */}
                              <button
                                type="button"
                                onClick={() => {
                                  setAuditOrder(o);
                                  setActive3DotOrderId(null);
                                }}
                                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#d7cddd] hover:text-white hover:bg-[#251833] transition-colors"
                              >
                                <Clock className="w-3.5 h-3.5 text-[#38bdf8]" />
                                <span>Order Audit Trail (অডিট ট্রেইল)</span>
                              </button>

                              {/* 5. Edit Order */}
                              <button
                                type="button"
                                onClick={() => {
                                  onEditOrder(o);
                                  setActive3DotOrderId(null);
                                }}
                                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#d7cddd] hover:text-white hover:bg-[#251833] transition-colors"
                              >
                                <Edit2 className="w-3.5 h-3.5 text-[#f59e0b]" />
                                <span>Edit Order</span>
                              </button>

                              {/* 6. Export as JPG */}
                              <button
                                type="button"
                                onClick={() => exportOrderAsImage(o)}
                                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#d7cddd] hover:text-white hover:bg-[#251833] transition-colors"
                              >
                                <Download className="w-3.5 h-3.5 text-[#34d399]" />
                                <span>Export Order as JPG</span>
                              </button>

                              {/* 7. Send to Connected Courier */}
                              <button
                                type="button"
                                onClick={() => handleSendToCourier(o)}
                                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#93c5fd] hover:bg-[#1a2942] transition-colors"
                              >
                                <Send className="w-3.5 h-3.5" />
                                <span>Send to {o.courierService || config.defaultCourier || 'Courier'}</span>
                              </button>

                              {/* Delete Order */}
                              <div className="pt-1 border-t border-[#342b40]/60">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (window.confirm(`Are you sure you want to delete order #${o.id}?`)) {
                                      sounds.playBeep();
                                      onDeleteOrder(o.id);
                                    }
                                    setActive3DotOrderId(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#f87171] hover:bg-[#3d131f] transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Delete Order</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Modals */}
      <ParcelTrackingTimelineModal
        order={trackingOrder}
        onClose={() => setTrackingOrder(null)}
      />

      <CustomerProfileDrawer
        customerPhone={selectedCustomerPhone}
        orders={orders}
        onClose={() => setSelectedCustomerPhone(null)}
      />

      <WhatsAppTemplatesModal
        order={whatsAppModalOrder}
        config={config}
        isOpen={Boolean(whatsAppModalOrder)}
        onClose={() => setWhatsAppModalOrder(null)}
      />

      <OrderAuditTrailModal
        order={auditOrder}
        isOpen={Boolean(auditOrder)}
        onClose={() => setAuditOrder(null)}
        onAddAuditLog={(orderId, log) => {
          if (onUpdateOrder && auditOrder) {
            const currentTrail = auditOrder.auditTrail || [];
            const updated = {
              ...auditOrder,
              auditTrail: [log, ...currentTrail],
            };
            setAuditOrder(updated);
            onUpdateOrder(updated);
          }
        }}
      />
    </div>
  );
};
