import React, { useState, useEffect } from 'react';
import { ProductVariant, ProductBundle, Product, STANDARD_SIZES, MAX_SIZES } from '../types';
import { Layers, Sparkles, Plus, Trash2, X, Check } from 'lucide-react';

interface VariantsBundlesViewProps {
  products: Product[];
  variants: ProductVariant[];
  bundles: ProductBundle[];
  onSaveVariant: (v: ProductVariant) => void;
  onDeleteVariant: (id: number) => void;
  onSaveBundle: (b: ProductBundle) => void;
  onDeleteBundle: (id: number) => void;
  initialTab?: 'variants' | 'bundles';
}

export const VariantsBundlesView: React.FC<VariantsBundlesViewProps> = ({
  products,
  variants,
  bundles,
  onSaveVariant,
  onDeleteVariant,
  onSaveBundle,
  onDeleteBundle,
  initialTab = 'variants',
}) => {
  const [activeTab, setActiveTab] = useState<'variants' | 'bundles'>(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Variant Form State
  const [isVariantOpen, setIsVariantOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number>(products[0]?.id || 401);
  const [variantColor, setVariantColor] = useState('Pastel Pink');
  const [variantSize, setVariantSize] = useState('38');
  const [variantSku, setVariantSku] = useState('ALV-VAR-01');
  const [variantStock, setVariantStock] = useState<number>(10);

  // Bundle Form State
  const [isBundleOpen, setIsBundleOpen] = useState(false);
  const [bundleName, setBundleName] = useState('');
  const [bundlePrice, setBundlePrice] = useState<number>(4500);
  const [regularTotal, setRegularTotal] = useState<number>(5200);
  const [selectedProdNames, setSelectedProdNames] = useState<string[]>([]);

  const handleAddVariant = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find((p) => p.id === selectedProductId) || products[0];
    const newVar: ProductVariant = {
      id: Date.now(),
      productId: prod.id,
      productName: prod.name,
      color: variantColor.trim(),
      size: variantSize,
      sku: variantSku.trim(),
      stock: Math.max(0, variantStock),
      priceModifier: 0,
    };
    onSaveVariant(newVar);
    setIsVariantOpen(false);
  };

  const handleAddBundle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bundleName.trim() || selectedProdNames.length === 0) {
      alert('বান্ডেলের নাম ও অন্তত একটি পণ্য নির্বাচন করুন!');
      return;
    }

    const newBundle: ProductBundle = {
      id: Date.now(),
      name: bundleName.trim(),
      bundlePrice: Math.max(0, bundlePrice),
      regularTotal: Math.max(0, regularTotal),
      savings: Math.max(0, regularTotal - bundlePrice),
      includedProducts: selectedProdNames,
      status: 'Active',
    };

    onSaveBundle(newBundle);
    setIsBundleOpen(false);
    setBundleName('');
    setSelectedProdNames([]);
  };

  const toggleBundleProduct = (name: string) => {
    setSelectedProdNames((prev) =>
      prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name]
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation Tabs */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            {activeTab === 'variants' ? (
              <Layers className="w-5 h-5 text-[#bd70df]" />
            ) : (
              <Sparkles className="w-5 h-5 text-[#bd70df]" />
            )}
            <span>
              {activeTab === 'variants'
                ? 'প্রোডাক্ট ভ্যারিয়েন্ট ম্যানেজার (Product Variants)'
                : 'বান্ডেল ও কম্বো বিল্ডার (Bundle & Combo Builder)'}
            </span>
          </h2>
          <p className="text-xs text-[#a69ab1]">
            রং ও সাইজ ভ্যারিয়েন্টের আলাদা বারকোড এবং আকর্ষণীয় ডিসকাউন্ট কম্বো প্যাক অফার
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-[#100d16] p-1 rounded-xl border border-[#342b40]">
            <button
              onClick={() => setActiveTab('variants')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'variants'
                  ? 'bg-[#bd70df] text-[#160e1b]'
                  : 'text-[#bcb1c7] hover:text-white'
              }`}
            >
              Variants ({variants.length})
            </button>
            <button
              onClick={() => setActiveTab('bundles')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'bundles'
                  ? 'bg-[#bd70df] text-[#160e1b]'
                  : 'text-[#bcb1c7] hover:text-white'
              }`}
            >
              Bundles ({bundles.length})
            </button>
          </div>

          {activeTab === 'variants' ? (
            <button
              onClick={() => setIsVariantOpen(!isVariantOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#bd70df] text-[#160e1b] hover:bg-[#d091ee]"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন ভ্যারিয়েন্ট</span>
            </button>
          ) : (
            <button
              onClick={() => setIsBundleOpen(!isBundleOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#bd70df] text-[#160e1b] hover:bg-[#d091ee]"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন বান্ডেল কম্বো</span>
            </button>
          )}
        </div>
      </div>

      {/* VARIANTS TAB */}
      {activeTab === 'variants' && (
        <div className="space-y-4">
          {isVariantOpen && (
            <div className="p-5 rounded-2xl bg-[#1b1524] border border-[#714786] shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#342b40]">
                <h3 className="font-bold text-white text-sm">নতুন প্রোডাক্ট ভ্যারিয়েন্ট যোগ করুন</h3>
                <button
                  onClick={() => setIsVariantOpen(false)}
                  className="text-[#a69ab1] hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddVariant} className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="block text-[#cfc4d9] mb-1">পণ্য নির্বাচন *</label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white outline-none"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[#cfc4d9] mb-1">রং / কালার (Color) *</label>
                  <input
                    required
                    value={variantColor}
                    onChange={(e) => setVariantColor(e.target.value)}
                    placeholder="e.g. Royal Navy Blue"
                    className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#cfc4d9] mb-1">সাইজ (Size: 36-48 স্ট্যান্ডার্ড, 50-56 ম্যাক্স) *</label>
                  <select
                    value={variantSize}
                    onChange={(e) => setVariantSize(e.target.value)}
                    className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white outline-none"
                  >
                    <optgroup label="স্ট্যান্ডার্ড সাইজ (36 - 48)">
                      {STANDARD_SIZES.map((sz) => (
                        <option key={sz} value={sz}>
                          সাইজ {sz}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="ম্যাক্স / প্লাস সাইজ (50 - 56)">
                      {MAX_SIZES.map((sz) => (
                        <option key={sz} value={sz}>
                          ম্যাক্স সাইজ {sz}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="অন্যান্য">
                      <option value="Free Size">Free Size (বডি ৪২-৪৮)</option>
                    </optgroup>
                  </select>
                </div>
                <div>
                  <label className="block text-[#cfc4d9] mb-1">ভ্যারিয়েন্ট SKU</label>
                  <input
                    value={variantSku}
                    onChange={(e) => setVariantSku(e.target.value)}
                    className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[#cfc4d9] mb-1">স্টক পরিমাণ</label>
                  <input
                    type="number"
                    min={0}
                    value={variantStock}
                    onChange={(e) => setVariantStock(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white outline-none font-mono"
                  />
                </div>
                <div className="col-span-full pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#bd70df] text-[#160e1b] hover:bg-[#d091ee]"
                  >
                    ভ্যারিয়েন্ট সেভ করুন
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#14101c] border-b border-[#342b40] text-[#a69ab1]">
                    <th className="py-2.5 px-3">Product Name</th>
                    <th className="py-2.5 px-3">Color</th>
                    <th className="py-2.5 px-3">Size</th>
                    <th className="py-2.5 px-3">Variant SKU</th>
                    <th className="py-2.5 px-3">Stock Qty</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#282033]">
                  {variants.map((v) => (
                    <tr key={v.id} className="hover:bg-[#201927]">
                      <td className="py-3 px-3 font-semibold text-white">{v.productName}</td>
                      <td className="py-3 px-3 text-[#f7dcff]">{v.color}</td>
                      <td className="py-3 px-3 font-mono font-bold text-[#bd70df]">{v.size}</td>
                      <td className="py-3 px-3 font-mono text-[#a69ab1]">{v.sku}</td>
                      <td className="py-3 px-3 font-mono tabular-nums text-white">
                        <span className={v.stock <= 5 ? 'text-[#ff6b83] font-bold' : ''}>
                          {v.stock} pcs
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => onDeleteVariant(v.id)}
                          className="p-1 rounded text-[#ff6b83] hover:bg-[#351822]"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* BUNDLES TAB */}
      {activeTab === 'bundles' && (
        <div className="space-y-4">
          {isBundleOpen && (
            <div className="p-5 rounded-2xl bg-[#1b1524] border border-[#714786] shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#342b40]">
                <h3 className="font-bold text-white text-sm">নতুন বান্ডেল কম্বো প্যাক তৈরি</h3>
                <button
                  onClick={() => setIsBundleOpen(false)}
                  className="text-[#a69ab1] hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddBundle} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[#cfc4d9] mb-1">বান্ডেলের নাম *</label>
                    <input
                      required
                      value={bundleName}
                      onChange={(e) => setBundleName(e.target.value)}
                      placeholder="e.g. Wedding Festive Couple Duo"
                      className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[#cfc4d9] mb-1">কম্বো অফার মূল্য (৳) *</label>
                    <input
                      type="number"
                      min={0}
                      value={bundlePrice}
                      onChange={(e) => setBundlePrice(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[#cfc4d9] mb-1">আগের মোট মূল্য (৳)</label>
                    <input
                      type="number"
                      min={0}
                      value={regularTotal}
                      onChange={(e) => setRegularTotal(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-[#100d16] border border-[#40344c] rounded-xl text-white outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#cfc4d9] mb-1">অন্তর্ভুক্ত প্রোডাক্ট সিলেক্ট করুন:</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {products.map((p) => {
                      const isChecked = selectedProdNames.includes(p.name);
                      return (
                        <div
                          key={p.id}
                          onClick={() => toggleBundleProduct(p.name)}
                          className={`p-2 rounded-xl border cursor-pointer transition-colors flex items-center justify-between ${
                            isChecked
                              ? 'bg-[#35203f] border-[#bd70df] text-white'
                              : 'bg-[#100d16] border-[#342b40] text-[#a69ab1]'
                          }`}
                        >
                          <span className="truncate">{p.name}</span>
                          {isChecked && <Check className="w-3.5 h-3.5 text-[#bd70df]" />}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#bd70df] text-[#160e1b] hover:bg-[#d091ee]"
                  >
                    বান্ডেল সেভ করুন
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {bundles.map((b) => (
              <div
                key={b.id}
                className="p-5 rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-white text-sm">{b.name}</h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#16382d] text-[#8de8bf]">
                      {b.status}
                    </span>
                  </div>

                  <div className="mt-3 space-y-1 text-xs text-[#bcb1c7]">
                    <span className="text-[11px] font-semibold text-[#cfc4d9] block">আইটেমসমূহ:</span>
                    {b.includedProducts.map((pName, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-white">
                        <span className="text-[#bd70df]">✓</span>
                        <span>{pName}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#342b40] flex items-center justify-between">
                  <div>
                    <div className="font-mono text-lg font-bold text-[#bd70df] tabular-nums">
                      ৳{b.bundlePrice}
                    </div>
                    <div className="text-[11px] text-[#a69ab1] line-through tabular-nums">
                      নরমাল: ৳{b.regularTotal}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-[#36c98b] bg-[#1a2e24] px-2 py-1 rounded-lg">
                      গ্রাহক সাশ্রয়: ৳{b.savings}
                    </span>
                    <button
                      onClick={() => onDeleteBundle(b.id)}
                      className="block text-right mt-2 text-[11px] text-[#ff9aaa] hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
