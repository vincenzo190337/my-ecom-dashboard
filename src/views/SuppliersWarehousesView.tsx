import React, { useState, useEffect } from 'react';
import { Supplier, PurchaseOrder, Warehouse } from '../types';
import { Boxes, Building2, Plus, X, Phone, MapPin, Trash2 } from 'lucide-react';

interface SuppliersWarehousesViewProps {
  suppliers: Supplier[];
  purchases: PurchaseOrder[];
  warehouses: Warehouse[];
  userRole?: string;
  onSaveSupplier: (s: Supplier) => void;
  onUpdateSupplier?: (s: Supplier) => void;
  onSavePurchase: (po: PurchaseOrder) => void;
  onUpdatePurchase?: (po: PurchaseOrder) => void;
  onSaveWarehouse: (w: Warehouse) => void;
  initialTab?: 'suppliers' | 'warehouses';
}

export const SuppliersWarehousesView: React.FC<SuppliersWarehousesViewProps> = ({
  suppliers,
  purchases,
  warehouses,
  userRole = 'Admin',
  onSaveSupplier,
  onUpdateSupplier,
  onSavePurchase,
  onUpdatePurchase,
  onSaveWarehouse,
  initialTab = 'suppliers',
}) => {
  const [tab, setTab] = useState<'suppliers' | 'warehouses'>(initialTab);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);
  const [isSupplierModal, setIsSupplierModal] = useState(false);
  const [isWarehouseModal, setIsWarehouseModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [editingPurchase, setEditingPurchase] = useState<PurchaseOrder | null>(null);

  const canSuperEdit = userRole === 'Admin' || userRole === 'Merchant';

  // Supplier Form State
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState<Supplier['category']>('Fabrics');
  const [address, setAddress] = useState('');

  // Warehouse Form State
  const [warehouseName, setWarehouseName] = useState('');
  const [warehouseType, setWarehouseType] = useState<Warehouse['type']>('Showroom Outlet');
  const [manager, setManager] = useState('');
  const [wPhone, setWPhone] = useState('');
  const [location, setLocation] = useState('');

  const handleSupplierSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !phone.trim()) {
      alert('সাপ্লায়ার কোম্পানি নাম ও ফোন নম্বর দিন!');
      return;
    }
    const newSupp: Supplier = {
      id: Date.now(),
      companyName: companyName.trim(),
      contactPerson: contactPerson.trim() || 'Manager',
      phone: phone.trim(),
      category,
      address: address.trim(),
      totalPurchased: 0,
      dueBalance: 0,
    };
    onSaveSupplier(newSupp);
    setIsSupplierModal(false);
    setCompanyName('');
    setPhone('');
  };

  const handleWarehouseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!warehouseName.trim() || !location.trim()) {
      alert('ওয়্যারহাউজ বা আউটলেটের নাম এবং ঠিকানা আবশ্যক!');
      return;
    }
    const newWh: Warehouse = {
      id: Date.now(),
      name: warehouseName.trim(),
      type: warehouseType,
      manager: manager.trim() || 'Store Incharge',
      phone: wPhone.trim() || '01956591199',
      location: location.trim(),
      totalItemStock: 50,
      status: 'Active',
    };
    onSaveWarehouse(newWh);
    setIsWarehouseModal(false);
    setWarehouseName('');
    setLocation('');
  };

  return (
    <div className="space-y-6">
      <div className="p-4 sm:p-5 rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            {tab === 'suppliers' ? (
              <Boxes className="w-5 h-5 text-[#bd70df]" />
            ) : (
              <Building2 className="w-5 h-5 text-[#bd70df]" />
            )}
            <span>
              {tab === 'suppliers'
                ? 'সাপ্লায়ার ও কাঁচামাল ক্রয় (Suppliers & Purchases)'
                : 'মাল্টি-ব্রাঞ্চ শোরুম ও ওয়্যারহাউজ (Multi-Store & Warehouse)'}
            </span>
          </h2>
          <p className="text-xs text-[#a69ab1]">
            ফ্যাব্রিক ও এক্সেসরিজ সরবরাহকারী প্রতিষ্ঠান, পারচেজ অর্ডার এবং বিভিন্ন ব্রাঞ্চের স্টক
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-[#100d16] p-1 rounded-xl border border-[#342b40]">
            <button
              onClick={() => setTab('suppliers')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                tab === 'suppliers'
                  ? 'bg-[#bd70df] text-[#160e1b]'
                  : 'text-[#bcb1c7] hover:text-white'
              }`}
            >
              Suppliers ({suppliers.length})
            </button>
            <button
              onClick={() => setTab('warehouses')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                tab === 'warehouses'
                  ? 'bg-[#bd70df] text-[#160e1b]'
                  : 'text-[#bcb1c7] hover:text-white'
              }`}
            >
              Warehouses ({warehouses.length})
            </button>
          </div>

          {tab === 'suppliers' ? (
            <button
              onClick={() => setIsSupplierModal(!isSupplierModal)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#bd70df] text-[#160e1b] hover:bg-[#d091ee]"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন সাপ্লায়ার</span>
            </button>
          ) : (
            <button
              onClick={() => setIsWarehouseModal(!isWarehouseModal)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#bd70df] text-[#160e1b] hover:bg-[#d091ee]"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন আউটলেট/হাব</span>
            </button>
          )}
        </div>
      </div>

      {/* Supplier Modal */}
      {isSupplierModal && (
        <div className="p-5 rounded-2xl bg-[#1b1524] border border-[#714786] shadow-xl space-y-3 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#342b40]">
            <h3 className="font-bold text-white text-sm">নতুন কাঁচামাল সাপ্লায়ার যুক্ত করুন</h3>
            <button onClick={() => setIsSupplierModal(false)} className="text-[#a69ab1]">
              <X className="w-4 h-4" />
            </button>
          </div>
          <form onSubmit={handleSupplierSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[#cfc4d9] mb-1">কোম্পানি / মিলের নাম *</label>
              <input
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Narayanganj Silk Mill"
                className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-[#cfc4d9] mb-1">যোগাযোগকারী ব্যক্তি</label>
              <input
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="Manager / Owner Name"
                className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-[#cfc4d9] mb-1">মোবাইল নম্বর *</label>
              <input
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="017XXXXXXXX"
                className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-[#cfc4d9] mb-1">ক্যাটাগরি</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white outline-none"
              >
                <option value="Fabrics">Fabrics (কাপড় ও সুতা)</option>
                <option value="Zari & Accessories">Zari & Accessories (জরি, লেইস ও বোতাম)</option>
                <option value="Packaging Bags">Packaging Bags (ব্যাগ ও কার্টন)</option>
                <option value="Stitching Unit">Stitching Unit (সেলাই ও দর্জি কারখানা)</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[#cfc4d9] mb-1">ঠিকানা</label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Tanbazar, Narayanganj / Islampur, Dhaka"
                className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white outline-none"
              />
            </div>
            <div className="col-span-full pt-1">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#bd70df] text-[#160e1b] hover:bg-[#d091ee]"
              >
                সাপ্লায়ার সেভ করুন
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Warehouse Modal */}
      {isWarehouseModal && (
        <div className="p-5 rounded-2xl bg-[#1b1524] border border-[#714786] shadow-xl space-y-3 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#342b40]">
            <h3 className="font-bold text-white text-sm">নতুন আউটলেট বা ওয়্যারহাউজ</h3>
            <button onClick={() => setIsWarehouseModal(false)} className="text-[#a69ab1]">
              <X className="w-4 h-4" />
            </button>
          </div>
          <form onSubmit={handleWarehouseSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[#cfc4d9] mb-1">শাখার নাম *</label>
              <input
                required
                value={warehouseName}
                onChange={(e) => setWarehouseName(e.target.value)}
                placeholder="Dhanmondi Branch"
                className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-[#cfc4d9] mb-1">টাইপ</label>
              <select
                value={warehouseType}
                onChange={(e) => setWarehouseType(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white outline-none"
              >
                <option value="Showroom Outlet">Showroom Outlet (শোরুম শাখা)</option>
                <option value="Central Hub">Central Hub (প্রধান হাব)</option>
                <option value="Sorting Warehouse">Sorting Warehouse (ডেলিভারি গুদাম)</option>
              </select>
            </div>
            <div>
              <label className="block text-[#cfc4d9] mb-1">ম্যানেজার / ইনচার্জ</label>
              <input
                value={manager}
                onChange={(e) => setManager(e.target.value)}
                placeholder="Incharge Name"
                className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-[#cfc4d9] mb-1">ফোন নম্বর</label>
              <input
                value={wPhone}
                onChange={(e) => setWPhone(e.target.value)}
                placeholder="017XXXXXXXX"
                className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white outline-none font-mono"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[#cfc4d9] mb-1">ঠিকানা / লোকেশন *</label>
              <input
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Shimanto Square, Road 2, Dhanmondi, Dhaka"
                className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white outline-none"
              />
            </div>
            <div className="col-span-full pt-1">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#bd70df] text-[#160e1b] hover:bg-[#d091ee]"
              >
                শাখা সেভ করুন
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Content depending on tab */}
      {tab === 'suppliers' ? (
        <div className="space-y-5">
          <div className="rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#14101c] border-b border-[#342b40] text-[#a69ab1]">
                    <th className="py-2.5 px-3">Company / Mill</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Contact Person & Phone</th>
                    <th className="py-2.5 px-3">Address</th>
                    <th className="py-2.5 px-3">Total Purchased</th>
                    <th className="py-2.5 px-3">Due Balance</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#282033]">
                  {suppliers.map((s) => (
                    <tr key={s.id} className="hover:bg-[#201927]">
                      <td className="py-3 px-3 font-semibold text-white">{s.companyName}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-[#271b35] text-[#e6b4fa] font-medium">
                          {s.category}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[#f7dcff]">
                        <div>{s.contactPerson}</div>
                        <div className="text-[11px] font-mono text-[#a69ab1]">{s.phone}</div>
                      </td>
                      <td className="py-3 px-3 text-[#a69ab1] max-w-xs truncate">{s.address}</td>
                      <td className="py-3 px-3 font-mono font-semibold text-white tabular-nums">
                        ৳{s.totalPurchased.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-[#ff9aaa] tabular-nums">
                        {s.dueBalance > 0 ? `৳${s.dueBalance.toLocaleString()}` : 'Cleared'}
                      </td>
                      <td className="py-3 px-3 text-right">
                        {canSuperEdit && (
                          <button
                            onClick={() => setEditingSupplier({ ...s })}
                            className="px-2 py-1 rounded bg-[#271b35] text-[#e6b4fa] hover:bg-[#bd70df] hover:text-[#160e1b] font-semibold text-[11px] transition-all"
                            title="সুপার এডিট"
                          >
                            সুপার এডিট
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Purchase Orders */}
          <div className="rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm overflow-hidden">
            <div className="p-4 border-b border-[#342b40]">
              <h3 className="font-bold text-white text-sm">সাম্প্রতিক পারচেজ অর্ডার (Purchase Orders)</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#14101c] border-b border-[#342b40] text-[#a69ab1]">
                    <th className="py-2.5 px-3">Invoice No</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Supplier</th>
                    <th className="py-2.5 px-3">Item Purchased</th>
                    <th className="py-2.5 px-3">Total Cost</th>
                    <th className="py-2.5 px-3">Paid / Due</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#282033]">
                  {purchases.map((po) => (
                    <tr key={po.id} className="hover:bg-[#201927]">
                      <td className="py-3 px-3 font-mono font-bold text-white">{po.invoiceNo}</td>
                      <td className="py-3 px-3 font-mono text-[#a69ab1]">{po.date}</td>
                      <td className="py-3 px-3 text-white">{po.supplierName}</td>
                      <td className="py-3 px-3 text-[#d7cddd]">{po.itemName}</td>
                      <td className="py-3 px-3 font-mono font-bold text-[#bd70df] tabular-nums">
                        ৳{po.totalCost.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px] tabular-nums">
                        <span className="text-[#36c98b]">Paid: ৳{po.paidAmount}</span>
                        {po.dueAmount > 0 && (
                          <span className="text-[#ff9aaa] block">Due: ৳{po.dueAmount}</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[11px] bg-[#16382d] text-[#8de8bf]">
                          {po.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        {canSuperEdit && (
                          <button
                            onClick={() => setEditingPurchase({ ...po })}
                            className="px-2 py-1 rounded bg-[#271b35] text-[#e6b4fa] hover:bg-[#bd70df] hover:text-[#160e1b] font-semibold text-[11px] transition-all"
                            title="সুপার এডিট পারচেজ"
                          >
                            সুপার এডিট
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Super Edit Supplier Modal */}
          {editingSupplier && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="w-full max-w-md bg-[#16121f] border border-[#714786] rounded-2xl p-5 shadow-2xl space-y-4 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-[#342b40]">
                  <h3 className="font-bold text-white text-sm">সুপার এডিট: সাপ্লায়ার ({editingSupplier.companyName})</h3>
                  <button onClick={() => setEditingSupplier(null)} className="text-[#a69ab1] hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[#cfc4d9] mb-1">কোম্পানির নাম</label>
                    <input
                      value={editingSupplier.companyName}
                      onChange={(e) => setEditingSupplier({ ...editingSupplier, companyName: e.target.value })}
                      className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#cfc4d9] mb-1">যোগাযোগ ব্যক্তি</label>
                      <input
                        value={editingSupplier.contactPerson}
                        onChange={(e) => setEditingSupplier({ ...editingSupplier, contactPerson: e.target.value })}
                        className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[#cfc4d9] mb-1">ফোন</label>
                      <input
                        value={editingSupplier.phone}
                        onChange={(e) => setEditingSupplier({ ...editingSupplier, phone: e.target.value })}
                        className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white font-mono outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#cfc4d9] mb-1">মোট কেনা (৳)</label>
                      <input
                        type="number"
                        value={editingSupplier.totalPurchased}
                        onChange={(e) => setEditingSupplier({ ...editingSupplier, totalPurchased: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white font-mono outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[#cfc4d9] mb-1">বাকি (৳)</label>
                      <input
                        type="number"
                        value={editingSupplier.dueBalance}
                        onChange={(e) => setEditingSupplier({ ...editingSupplier, dueBalance: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white font-mono outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[#cfc4d9] mb-1">ঠিকানা</label>
                    <input
                      value={editingSupplier.address}
                      onChange={(e) => setEditingSupplier({ ...editingSupplier, address: e.target.value })}
                      className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white outline-none"
                    />
                  </div>
                  <div className="pt-2 flex justify-end gap-2 border-t border-[#342b40]">
                    <button
                      type="button"
                      onClick={() => setEditingSupplier(null)}
                      className="px-4 py-2 rounded-xl text-[#a69ab1] hover:text-white"
                    >
                      বাতিল
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (onUpdateSupplier) onUpdateSupplier(editingSupplier);
                        else onSaveSupplier(editingSupplier);
                        setEditingSupplier(null);
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

          {/* Super Edit Purchase Modal */}
          {editingPurchase && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="w-full max-w-md bg-[#16121f] border border-[#714786] rounded-2xl p-5 shadow-2xl space-y-4 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-[#342b40]">
                  <h3 className="font-bold text-white text-sm">সুপার এডিট: পারচেজ ইনভয়েস ({editingPurchase.invoiceNo})</h3>
                  <button onClick={() => setEditingPurchase(null)} className="text-[#a69ab1] hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#cfc4d9] mb-1">আইটেম বিবরণ</label>
                      <input
                        value={editingPurchase.itemName}
                        onChange={(e) => setEditingPurchase({ ...editingPurchase, itemName: e.target.value })}
                        className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[#cfc4d9] mb-1">সাপ্লায়ার নাম</label>
                      <input
                        value={editingPurchase.supplierName}
                        onChange={(e) => setEditingPurchase({ ...editingPurchase, supplierName: e.target.value })}
                        className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[#cfc4d9] mb-1">মোট খরচ (৳)</label>
                      <input
                        type="number"
                        value={editingPurchase.totalCost}
                        onChange={(e) => setEditingPurchase({ ...editingPurchase, totalCost: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white font-mono outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[#cfc4d9] mb-1">পরিশোধ (৳)</label>
                      <input
                        type="number"
                        value={editingPurchase.paidAmount}
                        onChange={(e) => setEditingPurchase({ ...editingPurchase, paidAmount: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white font-mono outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[#cfc4d9] mb-1">বাকি (৳)</label>
                      <input
                        type="number"
                        value={editingPurchase.dueAmount}
                        onChange={(e) => setEditingPurchase({ ...editingPurchase, dueAmount: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white font-mono outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[#cfc4d9] mb-1">স্ট্যাটাস</label>
                    <select
                      value={editingPurchase.status}
                      onChange={(e) => setEditingPurchase({ ...editingPurchase, status: e.target.value as any })}
                      className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white outline-none"
                    >
                      <option value="Received">Received (মাল বুঝে পেয়েছি)</option>
                      <option value="In Transit">In Transit (পথে রয়েছে)</option>
                      <option value="Ordered">Ordered (অর্ডার করা হয়েছে)</option>
                    </select>
                  </div>
                  <div className="pt-2 flex justify-end gap-2 border-t border-[#342b40]">
                    <button
                      type="button"
                      onClick={() => setEditingPurchase(null)}
                      className="px-4 py-2 rounded-xl text-[#a69ab1] hover:text-white"
                    >
                      বাতিল
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (onUpdatePurchase) onUpdatePurchase(editingPurchase);
                        else onSavePurchase(editingPurchase);
                        setEditingPurchase(null);
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
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {warehouses.map((w) => (
            <div
              key={w.id}
              className="p-5 rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-white text-sm">{w.name}</h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#16382d] text-[#8de8bf]">
                    {w.status}
                  </span>
                </div>
                <div className="text-[11px] text-[#bd70df] font-medium mt-1">{w.type}</div>

                <div className="mt-3 space-y-1.5 text-xs text-[#a69ab1]">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#bd70df] shrink-0" />
                    <span className="text-white">{w.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#bd70df] shrink-0" />
                    <span>
                      {w.manager} ({w.phone})
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#342b40] flex items-center justify-between">
                <span className="text-xs text-[#a69ab1]">বর্তমান স্টক ধারণক্ষমতা:</span>
                <span className="font-mono font-bold text-white tabular-nums text-sm">
                  {w.totalItemStock} pcs
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
