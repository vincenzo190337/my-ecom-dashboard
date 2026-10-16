import React, { useState } from 'react';
import {
  Product,
  ProductCategory,
  STANDARD_SIZES,
  MAX_SIZES,
  ALL_SIZES,
  ALVINA_CATALOG_STRUCTURE,
} from '../types';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Upload,
  Image as ImageIcon,
  Check,
  X,
  AlertTriangle,
  Layers,
  Sparkles,
  Scissors,
  CheckCircle2,
  ListOrdered,
  LayoutGrid,
} from 'lucide-react';

interface ProductsViewProps {
  products: Product[];
  userRole?: string;
  onSaveProduct: (product: Product) => void;
  onDeleteProduct: (productId: number) => void;
}

export const ProductsView: React.FC<ProductsViewProps> = ({
  products,
  userRole = 'Admin',
  onSaveProduct,
  onDeleteProduct,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [stitchingFilter, setStitchingFilter] = useState<'All' | 'Stitched' | 'Unstitched'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive' | 'Out of stock'>('All');
  const [viewLayout, setViewLayout] = useState<'serial' | 'grid'>('serial');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Anarkali');
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [offer, setOffer] = useState<number | ''>('');
  const [stock, setStock] = useState<number>(30);
  const [stitching, setStitching] = useState<'Stitched' | 'Unstitched'>('Stitched');
  const [fabric, setFabric] = useState('Cotton');
  const [printType, setPrintType] = useState('Block-Print');
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['38', '40', '42']);
  const [image, setImage] = useState('');
  const [status, setStatus] = useState<'Active' | 'Draft' | 'Out of stock' | 'Inactive'>('Active');

  // Design-wise piece breakdown (e.g. Screen print 20 pcs, Block print 23 pcs)
  const [designs, setDesigns] = useState<{ designName: string; quantity: number }[]>([
    { designName: 'Screen Print', quantity: 15 },
    { designName: 'Block Print', quantity: 15 },
  ]);

  // ALL 24 OFFICIAL CATEGORIES (User Spec)
  const categories: ProductCategory[] = [
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
  ];

  const handleToggleProductStatus = (p: Product) => {
    const nextStatus = p.status === 'Active' ? 'Inactive' : 'Active';
    onSaveProduct({
      ...p,
      status: nextStatus,
    });
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesStitching =
      stitchingFilter === 'All' || (p.stitching || 'Stitched') === stitchingFilter;
    const matchesStatus =
      statusFilter === 'All'
        ? true
        : statusFilter === 'Active'
        ? p.status === 'Active'
        : statusFilter === 'Inactive'
        ? p.status === 'Inactive' || p.status === 'Draft'
        : p.stock <= 0;
    return matchesSearch && matchesCat && matchesStitching && matchesStatus;
  });

  const openAddForm = () => {
    setEditingId(null);
    setName('');
    setCategory('Anarkali');
    setSku('ALV-' + Math.floor(100 + Math.random() * 900));
    setDescription('');
    setPrice('');
    setOffer('');
    setStock(30);
    setStitching('Stitched');
    setFabric('Cotton');
    setPrintType('Block-Print');
    setSelectedSizes(['38', '40', '42']);
    setDesigns([
      { designName: 'Screen Print', quantity: 15 },
      { designName: 'Block Print', quantity: 15 },
    ]);
    setImage('');
    setStatus('Active');
    setIsFormOpen(true);
  };

  const openEditForm = (p: Product) => {
    setEditingId(p.id);
    setName(p.name);
    setCategory(p.category);
    setSku(p.sku);
    setDescription(p.description);
    setPrice(p.price);
    setOffer(p.offer);
    setStock(p.stock);
    setStitching(p.stitching || 'Stitched');
    setFabric(p.fabric || 'Cotton');
    setPrintType(p.printType || 'Block-Print');
    setImage(p.image);
    setStatus(p.status);
    if (p.designs && p.designs.length > 0) {
      setDesigns(p.designs);
    } else {
      setDesigns([
        { designName: 'Screen Print', quantity: Math.round(p.stock * 0.5) },
        { designName: 'Block Print', quantity: Math.round(p.stock * 0.5) },
      ]);
    }
    setIsFormOpen(true);
  };

  // 100MB Image Upload Handler
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('অনুগ্রহ করে শুধুমাত্র ইমেজ ফাইল নির্বাচন করুন (JPG, PNG, WEBP)');
      return;
    }
    // 100 MB Limit check
    const max100Mb = 100 * 1024 * 1024;
    if (file.size > max100Mb) {
      alert('ছবির সাইজ ১০০ মেগাবাইট (100 MB) এর কম রাখুন।');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAddDesignRow = () => {
    setDesigns([...designs, { designName: 'Floral Print', quantity: 10 }]);
  };

  const handleUpdateDesign = (idx: number, field: 'designName' | 'quantity', val: any) => {
    setDesigns(
      designs.map((d, i) =>
        i === idx ? { ...d, [field]: field === 'quantity' ? Math.max(0, Number(val)) : val } : d
      )
    );
  };

  const handleRemoveDesign = (idx: number) => {
    setDesigns(designs.filter((_, i) => i !== idx));
  };

  const toggleSize = (sz: string) => {
    setSelectedSizes((prev) =>
      prev.includes(sz) ? prev.filter((s) => s !== sz) : [...prev, sz]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || price === '' || Number(price) < 0) {
      alert('সঠিক প্রোডাক্ট নাম ও মূল্য আবশ্যক।');
      return;
    }

    // Auto-calculate stock from design quantities if provided
    const totalDesignStock = designs.reduce((sum, d) => sum + d.quantity, 0);
    const finalStock = totalDesignStock > 0 ? totalDesignStock : Number(stock) || 0;

    const newProd: Product = {
      id: editingId ? editingId : Date.now(),
      name: name.trim(),
      category,
      sku: sku.trim() || 'ALV-' + Date.now().toString().slice(-4),
      description: description.trim() || `ফেব্রিক: ${fabric}, প্রিন্ট: ${printType}. সাইজ: ${selectedSizes.join(', ')}`,
      price: Number(price),
      offer: offer === '' ? 0 : Number(offer),
      stock: finalStock,
      image: image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
      status,
      stitching,
      fabric,
      printType,
      designs,
    };

    onSaveProduct(newProd);
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar with Search & Stitching Tabs */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-[#bd70df]" />
              <span>ALL INVENTORY & PRODUCTS</span>
              <span className="text-xs text-[#a69ab1] font-normal">(ইনভেন্টরি স্টক ও প্রোডাক্টস)</span>
            </h2>
            <p className="text-xs text-[#a69ab1]">
              Manage stitched & unstitched fabrics, numeric size variants (36-56), and design piece breakdowns
            </p>
          </div>

          <button
            onClick={openAddForm}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#bd70df] text-[#160e1b] hover:bg-[#d091ee] transition-all self-start sm:self-auto shadow-md"
          >
            <Plus className="w-4 h-4 font-bold" />
            <span>+ Add New Product</span>
            <span className="text-[10px] font-normal opacity-85 hidden sm:inline">(নতুন প্রোডাক্ট)</span>
          </button>
        </div>

        {/* Stitching 2-Option Tabs + Search + Category Filter */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-2 border-t border-[#2d2438]">
          {/* Stitched vs Unstitched 2 Options */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-[#a69ab1] font-semibold flex items-center gap-1">
              <Scissors className="w-3.5 h-3.5 text-[#bd70df]" />
              <span>Stock Type:</span>
              <span className="text-[10px] text-[#7d708a]">(স্টক ধরন)</span>
            </span>
            <div className="flex bg-[#100d16] p-1 rounded-xl border border-[#342b40] gap-1">
              <button
                onClick={() => setStitchingFilter('All')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  stitchingFilter === 'All'
                    ? 'bg-[#bd70df] text-[#160e1b] font-bold'
                    : 'text-[#bcb1c7] hover:text-white'
                }`}
              >
                All ({products.length})
              </button>
              <button
                onClick={() => setStitchingFilter('Stitched')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  stitchingFilter === 'Stitched'
                    ? 'bg-[#bd70df] text-[#160e1b] font-bold'
                    : 'text-[#bcb1c7] hover:text-white'
                }`}
              >
                <span>Stitched</span>
                <span className="text-[10px] opacity-80 ml-1">(স্টিচড)</span>
                <span className="ml-1 text-[11px] opacity-75">({products.filter((p) => p.stitching !== 'Unstitched').length})</span>
              </button>
              <button
                onClick={() => setStitchingFilter('Unstitched')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  stitchingFilter === 'Unstitched'
                    ? 'bg-[#3b82f6] text-white font-bold'
                    : 'text-[#bcb1c7] hover:text-white'
                }`}
              >
                <span>Unstitched / Fabric</span>
                <span className="text-[10px] opacity-80 ml-1">(আনস্টিচড / গজ কাপড়)</span>
                <span className="ml-1 text-[11px] opacity-75">({products.filter((p) => p.stitching === 'Unstitched').length})</span>
              </button>
            </div>
          </div>

          {/* TWO LAYOUT OPTIONS: Sequential List vs Grid Cards */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-[#100d16] p-1 rounded-xl border border-[#342b40]">
              <button
                type="button"
                onClick={() => setViewLayout('serial')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewLayout === 'serial'
                    ? 'bg-[#bd70df] text-[#160e1b] shadow-sm'
                    : 'text-[#cfc4d9] hover:text-white'
                }`}
                title="Sequential List View (সোজা সিরিয়াল)"
              >
                <ListOrdered className="w-4 h-4" />
                <span>Sequential List</span>
                <span className="text-[10px] font-normal opacity-80 hidden md:inline">(সোজা সিরিয়াল)</span>
              </button>
              <button
                type="button"
                onClick={() => setViewLayout('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewLayout === 'grid'
                    ? 'bg-[#bd70df] text-[#160e1b] shadow-sm'
                    : 'text-[#cfc4d9] hover:text-white'
                }`}
                title="Grid Cards View (গ্রিড ভিউ)"
              >
                <LayoutGrid className="w-4 h-4" />
                <span>Grid Cards</span>
                <span className="text-[10px] font-normal opacity-80 hidden md:inline">(গ্রিড)</span>
              </button>
            </div>

            <div className="flex items-center gap-2 flex-1 max-w-xs">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#a69ab1] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="নাম বা SKU..."
                  className="w-full pl-9 pr-3 py-1.5 bg-[#100d16] border border-[#342b40] rounded-xl text-xs text-white outline-none focus:border-[#bd70df]"
                />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-[#100d16] border border-[#342b40] rounded-xl text-xs text-white outline-none"
              >
                <option value="All">সকল ক্যাটাগরি</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Product Status Filter in English with Bengali subtitles */}
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-[#2d2438]">
          <span className="text-xs text-[#a69ab1] font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#36c98b]" />
            <span>Product Status:</span>
            <span className="text-[10px] text-[#7d708a]">(প্রোডাক্ট স্ট্যাটাস)</span>
          </span>
          <div className="flex bg-[#100d16] p-1 rounded-xl border border-[#342b40] gap-1 flex-wrap">
            <button
              type="button"
              onClick={() => setStatusFilter('All')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                statusFilter === 'All' ? 'bg-[#bd70df] text-[#160e1b] font-bold' : 'text-[#bcb1c7] hover:text-white'
              }`}
            >
              All ({products.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('Active')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                statusFilter === 'Active'
                  ? 'bg-[#16382d] text-[#8de8bf] border border-[#255845]'
                  : 'text-[#8de8bf]/80 hover:text-[#8de8bf]'
              }`}
            >
              <span>🟢 Active</span>
              <span className="text-[10px] opacity-80 ml-1 font-normal">(সক্রিয়)</span>
              <span className="ml-1 text-[11px] opacity-75">({products.filter((p) => p.status === 'Active').length})</span>
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('Inactive')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                statusFilter === 'Inactive'
                  ? 'bg-[#3b212e] text-[#fca5a5] border border-[#6b2a3a]'
                  : 'text-[#fca5a5]/80 hover:text-[#fca5a5]'
              }`}
            >
              <span>⚪ Inactive</span>
              <span className="text-[10px] opacity-80 ml-1 font-normal">(নিষ্ক্রিয়)</span>
              <span className="ml-1 text-[11px] opacity-75">({products.filter((p) => p.status === 'Inactive' || p.status === 'Draft').length})</span>
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('Out of stock')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                statusFilter === 'Out of stock'
                  ? 'bg-rose-950 text-rose-300 border border-rose-700'
                  : 'text-rose-400/80 hover:text-rose-400'
              }`}
            >
              <span>🔴 Out of Stock</span>
              <span className="text-[10px] opacity-80 ml-1 font-normal">(স্টক শেষ)</span>
              <span className="ml-1 text-[11px] opacity-75">({products.filter((p) => p.stock <= 0).length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* OPTION 1: সোজা সিরিয়াল (Straight Serial List / Sequential Table View) */}
      {viewLayout === 'serial' && (
        <div className="rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[#342b40] flex items-center justify-between">
            <div>
              <span className="font-bold text-white text-sm flex items-center gap-2">
                <ListOrdered className="w-4 h-4 text-[#bd70df]" />
                <span>SEQUENTIAL PRODUCT CATALOG</span>
                <span className="text-xs text-[#a69ab1] font-normal">(সোজা সিরিয়াল প্রোডাক্ট তালিকা)</span>
              </span>
              <p className="text-[11px] text-[#a69ab1]">Complete serial inventory listing with SKU, stitching type, stock, and live status</p>
            </div>
            <span className="text-xs font-mono text-[#a69ab1]">Total {filteredProducts.length} Items</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#14101c] border-b border-[#342b40] text-[#a69ab1]">
                  <th className="py-3 px-3 text-center w-14">SL No <span className="block text-[10px] text-[#7d708a] font-normal">সিরিয়াল</span></th>
                  <th className="py-3 px-3">Photo <span className="block text-[10px] text-[#7d708a] font-normal">ছবি</span></th>
                  <th className="py-3 px-3">Product Name & SKU <span className="block text-[10px] text-[#7d708a] font-normal">নাম ও কোড</span></th>
                  <th className="py-3 px-3">Category <span className="block text-[10px] text-[#7d708a] font-normal">ক্যাটাগরি</span></th>
                  <th className="py-3 px-3">Stitch Type <span className="block text-[10px] text-[#7d708a] font-normal">ধরন</span></th>
                  <th className="py-3 px-3">Design Breakdown <span className="block text-[10px] text-[#7d708a] font-normal">ডিজাইন পিস</span></th>
                  <th className="py-3 px-3 text-center">Stock <span className="block text-[10px] text-[#7d708a] font-normal">মজুদ</span></th>
                  <th className="py-3 px-3">Price & Offer <span className="block text-[10px] text-[#7d708a] font-normal">মূল্য</span></th>
                  <th className="py-3 px-3">Status <span className="block text-[10px] text-[#7d708a] font-normal">স্ট্যাটাস</span></th>
                  <th className="py-3 px-3 text-right">Actions <span className="block text-[10px] text-[#7d708a] font-normal">অ্যাকশন</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#282033]">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-10 text-center text-[#a69ab1]">
                      কোনো প্রোডাক্ট খুঁজে পাওয়া যায়নি।
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p, index) => {
                    const activePrice = p.offer > 0 ? p.offer : p.price;
                    const serialNumber = String(index + 1).padStart(2, '0');
                    return (
                      <tr key={p.id} className="hover:bg-[#201927] transition-colors">
                        {/* Serial Number */}
                        <td className="py-3 px-3 text-center font-mono font-bold text-[#bd70df] text-xs">
                          #{serialNumber}
                        </td>

                        {/* Image Thumbnail */}
                        <td className="py-3 px-3">
                          <div className="w-11 h-11 rounded-lg overflow-hidden bg-[#100d16] border border-[#3b2b48] shrink-0">
                            {p.image ? (
                              <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-5 h-5 text-[#453655]" />
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Name and SKU */}
                        <td className="py-3 px-3 max-w-xs">
                          <div className="font-bold text-white text-xs">{p.name}</div>
                          <div className="text-[11px] font-mono text-[#a69ab1]">SKU: {p.sku}</div>
                        </td>

                        {/* Category */}
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-lg bg-[#271b35] text-[#e6b4fa] font-semibold text-[11px]">
                            {p.category}
                          </span>
                        </td>

                        {/* Stitching */}
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              p.stitching === 'Unstitched'
                                ? 'bg-[#1e293b] text-[#93c5fd] border border-[#334155]'
                                : 'bg-[#271b35] text-[#e6b4fa] border border-[#503067]'
                            }`}
                          >
                            {p.stitching === 'Unstitched' ? 'আনস্টিচড' : 'স্টিচড'}
                          </span>
                        </td>

                        {/* Designs / Pieces */}
                        <td className="py-3 px-3 max-w-xs">
                          {p.designs && p.designs.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {p.designs.map((d, i) => (
                                <span
                                  key={i}
                                  className="text-[10px] px-1.5 py-0.5 rounded bg-[#130f1a] text-[#d7cddd] border border-[#31253e]"
                                >
                                  {d.designName}: <b>{d.quantity}</b>
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-[#7d6f8a] text-[11px]">—</span>
                          )}
                        </td>

                        {/* Stock */}
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`font-mono font-bold text-xs px-2 py-0.5 rounded-full ${
                              p.stock > 10
                                ? 'bg-[#16382d] text-[#8de8bf]'
                                : p.stock > 0
                                ? 'bg-[#3b2a1a] text-[#fbbf24]'
                                : 'bg-[#44202a] text-[#ff9aaa]'
                            }`}
                          >
                            {p.stock} পিস
                          </span>
                        </td>

                        {/* Price & Offer */}
                        <td className="py-3 px-3">
                          <div className="font-mono font-bold text-[#36c98b] text-xs">
                            ৳{activePrice.toLocaleString()}
                          </div>
                          {p.offer > 0 && (
                            <div className="text-[10px] text-[#a69ab1] line-through font-mono">
                              ৳{p.price.toLocaleString()}
                            </div>
                          )}
                        </td>

                        {/* Status Toggle Button */}
                        <td className="py-3 px-3">
                          <button
                            type="button"
                            onClick={() => handleToggleProductStatus(p)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all border ${
                              p.status === 'Active'
                                ? 'bg-[#16382d] text-[#8de8bf] border-[#255845] hover:bg-[#205240]'
                                : 'bg-[#2a2233] text-[#cfc4d9] border-[#443852] hover:bg-[#392e45]'
                            }`}
                            title="ক্লিক করে Active / Inactive স্ট্যাটাস পরিবর্তন করুন"
                          >
                            {p.status === 'Active' ? '🟢 সক্রিয়' : '⚪ নিষ্ক্রিয়'}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openEditForm(p)}
                              className="p-1.5 rounded-lg bg-[#271b35] text-[#e6b4fa] hover:bg-[#bd70df] hover:text-[#160e1b] transition-colors"
                              title="এডিট করুন"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDeleteProduct(p.id)}
                              className="p-1.5 rounded-lg text-[#ff6b83] hover:bg-[#351822] transition-colors"
                              title="ডিলিট"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
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
      )}

      {/* OPTION 2: এখন যেরকম আছে (Current Card Grid View) */}
      {viewLayout === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((p) => {
            const activePrice = p.offer > 0 ? p.offer : p.price;
            return (
              <div
                key={p.id}
                className="rounded-2xl bg-[#181520] border border-[#342b40] hover:border-[#bd70df] overflow-hidden flex flex-col justify-between transition-all group shadow-sm"
              >
                <div>
                  {/* Image */}
                  <div className="aspect-[4/3] bg-[#120e18] relative overflow-hidden flex items-center justify-center">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <Package className="w-10 h-10 text-[#453655]" />
                    )}
                    {/* Active/Inactive Toggle Button on Card */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleProductStatus(p);
                      }}
                      className={`absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold transition-all border shadow-md cursor-pointer ${
                        p.status === 'Active'
                          ? 'bg-[#16382d] text-[#8de8bf] border-[#255845] hover:bg-[#205240]'
                          : 'bg-[#2a2233] text-[#cfc4d9] border-[#443852] hover:bg-[#392e45]'
                      }`}
                      title="ক্লিক করে Active / Inactive পরিবর্তন করুন"
                    >
                      {p.status === 'Active' ? '🟢 Active' : '⚪ Inactive'}
                    </button>
                    <span
                      className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        p.stitching === 'Unstitched'
                          ? 'bg-[#1e293b] text-[#93c5fd] border border-[#334155]'
                          : 'bg-[#271b35] text-[#e6b4fa] border border-[#503067]'
                      }`}
                    >
                      {p.stitching === 'Unstitched' ? 'আনস্টিচড' : 'স্টিচড'}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-[#a69ab1]">
                      <span className="font-mono">{p.sku}</span>
                      <span className="px-2 py-0.5 rounded bg-[#100d16] text-[#bd70df] font-semibold">
                        {p.category}
                      </span>
                    </div>

                    <h3 className="font-bold text-white text-sm line-clamp-2">{p.name}</h3>

                    {/* Design Segregation / Pieces */}
                    {p.designs && p.designs.length > 0 && (
                      <div className="p-2 rounded-lg bg-[#120e18] border border-[#2b2235] space-y-1">
                        <span className="text-[10px] text-[#a69ab1] font-semibold block">
                          ডিজাইনভিত্তিক স্টক সংখ্যা:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {p.designs.map((d, i) => (
                            <span
                              key={i}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-[#1f1728] text-[#e0cfed] border border-[#3c2d4e]"
                            >
                              {d.designName}: <b>{d.quantity} পিস</b>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Pricing */}
                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="text-base font-bold text-white font-mono">
                        ৳{activePrice.toLocaleString()}
                      </span>
                      {p.offer > 0 && (
                        <span className="text-xs text-[#a69ab1] line-through font-mono">
                          ৳{p.price.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-3 bg-[#130f1a] border-t border-[#2e2439] flex items-center justify-between">
                  <span className="text-xs font-mono text-[#a69ab1]">
                    মোট স্টক: <b className="text-white">{p.stock} পিস</b>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditForm(p)}
                      className="p-1.5 rounded-lg bg-[#271b35] text-[#e6b4fa] hover:bg-[#bd70df] hover:text-[#160e1b] transition-colors"
                      title="এডিট করুন"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteProduct(p.id)}
                      className="p-1.5 rounded-lg text-[#ff6b83] hover:bg-[#351822] transition-colors"
                      title="ডিলিট"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-[#16121f] border border-[#714786] rounded-2xl p-5 shadow-2xl space-y-4 text-xs max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#342b40]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Package className="w-4 h-4 text-[#bd70df]" />
                <span>{editingId ? 'প্রোডাক্ট তথ্য এডিট' : 'নতুন প্রোডাক্ট ও স্টক এন্ট্রি'}</span>
              </h3>
              <button onClick={() => setIsFormOpen(false)} className="text-[#a69ab1] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Stitching Option: Stitched vs Unstitched */}
              <div className="p-3 rounded-xl bg-[#120e18] border border-[#3b2f4a]">
                <label className="block text-[#cfc4d9] font-bold mb-1.5">
                  ড্রেস স্টিচিং ধরন (Stitching Option) *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setStitching('Stitched')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                      stitching === 'Stitched'
                        ? 'bg-[#bd70df] text-[#160e1b] border-[#bd70df]'
                        : 'bg-[#181422] text-[#a69ab1] border-[#382b48]'
                    }`}
                  >
                    স্টিচড (Stitched / তৈরি রেডি ড্রেস)
                  </button>
                  <button
                    type="button"
                    onClick={() => setStitching('Unstitched')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                      stitching === 'Unstitched'
                        ? 'bg-[#3b82f6] text-white border-[#3b82f6]'
                        : 'bg-[#181422] text-[#a69ab1] border-[#382b48]'
                    }`}
                  >
                    আনস্টিচড (Unstitched / গজ ও সেলাইবিহীন)
                  </button>
                </div>
              </div>

              {/* Product Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#cfc4d9] mb-1 font-medium">প্রোডাক্টের নাম *</label>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Three-Piece Cotton Block Print"
                    className="w-full px-3 py-2 bg-[#100d16] border border-[#3b2f4a] rounded-xl text-white outline-none focus:border-[#bd70df]"
                  />
                </div>
                <div>
                  <label className="block text-[#cfc4d9] mb-1 font-medium">ক্যাটাগরি</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#100d16] border border-[#3b2f4a] rounded-xl text-white outline-none focus:border-[#bd70df]"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Fabric & Print Type (ALVINA Tree) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#cfc4d9] mb-1 font-medium">ফেব্রিক / কাপড়</label>
                  <select
                    value={fabric}
                    onChange={(e) => setFabric(e.target.value)}
                    className="w-full px-3 py-2 bg-[#100d16] border border-[#3b2f4a] rounded-xl text-white outline-none"
                  >
                    <option value="Cotton">Cotton (সুতি)</option>
                    <option value="Lawn">Lawn (লন)</option>
                    <option value="Khadi-Cotton">Khadi Cotton (খাদি)</option>
                    <option value="Linen">Linen (লিনেন)</option>
                    <option value="Muslin">Muslin (মসলিন)</option>
                    <option value="Silk">Silk (সিল্ক/কাতান)</option>
                    <option value="Georgette">Georgette (জর্জেট)</option>
                    <option value="Organza">Organza (অরগাঞ্জা)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#cfc4d9] mb-1 font-medium">প্রিন্ট / ডিজাইন টাইপ</label>
                  <select
                    value={printType}
                    onChange={(e) => setPrintType(e.target.value)}
                    className="w-full px-3 py-2 bg-[#100d16] border border-[#3b2f4a] rounded-xl text-white outline-none"
                  >
                    <option value="Block-Print">Block-Print (ব্লক প্রিন্ট)</option>
                    <option value="Screen-Print">Screen-Print (স্ক্রিন প্রিন্ট)</option>
                    <option value="Digital-Print">Digital-Print (ডিজিটাল প্রিন্ট)</option>
                    <option value="Floral-Print">Floral-Print (ফ্লোরাল প্রিন্ট)</option>
                    <option value="Embroidery">Embroidery (এমব্রয়ডারি)</option>
                    <option value="Plain">Plain (প্লেন একরঙা)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#cfc4d9] mb-1 font-medium">SKU কোড</label>
                  <input
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="ALV-301"
                    className="w-full px-3 py-2 bg-[#100d16] border border-[#3b2f4a] rounded-xl text-white font-mono outline-none"
                  />
                </div>
              </div>

              {/* Dedicated Box for Total Product Stock Quantity (Requested by User) */}
              <div className="p-3.5 rounded-xl bg-[#181324] border-2 border-[#bd70df]/50 space-y-1.5 shadow-md">
                <label className="block text-xs font-bold text-white flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-[#bd70df]" />
                    <span>মোট প্রোডাক্ট স্টক সংখ্যা (Total Product Stock Quantity) *</span>
                  </span>
                  <span className="text-[11px] text-[#bd70df] font-mono">বাধ্যতামূলক ফিল্ড</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={0}
                    required
                    value={stock}
                    onChange={(e) => setStock(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    placeholder="যেমন: 50"
                    className="flex-1 px-3.5 py-2.5 bg-[#100c17] border border-[#5d3b76] rounded-xl text-white font-bold text-base focus:border-[#bd70df] outline-none"
                  />
                  <span className="text-xs font-bold text-[#e6b4fa] font-mono">পিস (Pieces)</span>
                </div>
                <p className="text-[11px] text-[#a69ab1]">
                  দোকানে বা গুদামে মোট যতগুলো পিস ড্রেস রয়েছে তা এই বক্সে সরাসরি লিখুন।
                </p>
              </div>

              {/* Design Breakdown - Optional (ঐচ্ছিক) */}
              <div className="p-3.5 rounded-xl bg-[#120e18] border border-[#3b2f4a] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#cfc4d9] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#f59e0b]" />
                    <span>ডিজাইনভিত্তিক পিস হিসাব (Design Breakdown - ঐচ্ছিক / Optional)</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleAddDesignRow}
                    className="text-[11px] text-[#bd70df] hover:underline flex items-center gap-1 font-bold"
                  >
                    <Plus className="w-3 h-3" />
                    <span>+ ডিজাইন রো যোগ করুন</span>
                  </button>
                </div>

                <div className="space-y-1.5">
                  {designs.map((row, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        value={row.designName}
                        onChange={(e) => handleUpdateDesign(idx, 'designName', e.target.value)}
                        placeholder="যেমন: Screen Print / Block Print"
                        className="flex-1 px-3 py-1.5 bg-[#181422] border border-[#3b2f4a] rounded-lg text-white text-xs outline-none"
                      />
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min={0}
                          value={row.quantity}
                          onChange={(e) => handleUpdateDesign(idx, 'quantity', e.target.value)}
                          className="w-20 px-2 py-1.5 bg-[#181422] border border-[#3b2f4a] rounded-lg text-white font-mono text-xs outline-none"
                        />
                        <span className="text-[#a69ab1] text-[11px]">পিস</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveDesign(idx)}
                        className="p-1 rounded text-[#ff6b83] hover:bg-[#351822]"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active vs Inactive Toggle */}
              <div className="p-3 rounded-xl bg-[#120e18] border border-[#3b2f4a]">
                <label className="block text-[#cfc4d9] font-bold mb-1.5">
                  প্রোডাক্ট স্ট্যাটাস (Product Active / Inactive Status) *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setStatus('Active')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                      status === 'Active'
                        ? 'bg-[#16382d] text-[#8de8bf] border-[#255845] shadow-sm'
                        : 'bg-[#181422] text-[#a69ab1] border-[#382b48]'
                    }`}
                  >
                    🟢 সক্রিয় / Active (বিক্রয় চালু)
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('Inactive')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                      status === 'Inactive' || status === 'Draft'
                        ? 'bg-[#3b212e] text-[#fca5a5] border-[#6b2a3a] shadow-sm'
                        : 'bg-[#181422] text-[#a69ab1] border-[#382b48]'
                    }`}
                  >
                    ⚪ নিষ্ক্রিয় / Inactive (সাময়িক বন্ধ)
                  </button>
                </div>
              </div>

              {/* Numeric Sizes 36-56 with Plus Size +150 TK badge */}
              <div>
                <label className="block text-[#cfc4d9] mb-1.5 font-bold flex items-center justify-between">
                  <span>সাইজ নির্বাচন করুন (৩৬-৪৮ স্ট্যান্ডার্ড, ৫০-৫৬ প্লাস সাইজ) *</span>
                  <span className="text-[10px] text-[#e6b4fa] font-semibold bg-[#2e1d3d] px-2 py-0.5 rounded border border-[#5d387a]">
                    প্লাস সাইজ (৫০-৫৬): +৳১৫০ স্বয়ংক্রিয় সারচার্জ
                  </span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_SIZES.map((sz) => {
                    const isSelected = selectedSizes.includes(sz);
                    const isPlus = parseInt(sz, 10) >= 50;
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => toggleSize(sz)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                          isSelected
                            ? isPlus
                              ? 'bg-gradient-to-r from-[#bd70df] to-[#f472b6] text-white shadow-sm ring-1 ring-white/30'
                              : 'bg-[#bd70df] text-[#160e1b] shadow-sm'
                            : isPlus
                            ? 'bg-[#22162a] text-[#f472b6] border border-[#5d2b63]'
                            : 'bg-[#100d16] text-[#cfc4d9] border border-[#3b2f4a]'
                        }`}
                        title={isPlus ? `সাইজ ${sz} (প্লাস সাইজ: +৳150)` : `সাইজ ${sz}`}
                      >
                        {sz} {isPlus ? '(+৳150)' : ''}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#cfc4d9] mb-1 font-medium">রেগুলার মূল্য (৳) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={price}
                    onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="3500"
                    className="w-full px-3 py-2 bg-[#100d16] border border-[#3b2f4a] rounded-xl text-white font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#cfc4d9] mb-1 font-medium">অফার মূল্য (৳)</label>
                  <input
                    type="number"
                    min={0}
                    value={offer}
                    onChange={(e) => setOffer(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="3200"
                    className="w-full px-3 py-2 bg-[#100d16] border border-[#3b2f4a] rounded-xl text-white font-mono outline-none"
                  />
                </div>
              </div>

              {/* 100MB Image Upload */}
              <div>
                <label className="block text-[#cfc4d9] mb-1.5 font-bold flex items-center justify-between">
                  <span>প্রোডাক্টের ছবি আপলোড (সর্বোচ্চ ১০০ মেগাবাইট / 100 MB সাপোর্ট)</span>
                  <span className="text-[10px] text-[#bd70df]">Max: 100 MB</span>
                </label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-[#271b35] hover:bg-[#3d2454] text-[#e6b4fa] border border-[#714786] rounded-xl font-semibold transition-all">
                    <Upload className="w-4 h-4 text-[#bd70df]" />
                    <span>ফাইল সিলেক্ট করুন (100MB পর্যন্ত)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>
                  {image && (
                    <div className="w-12 h-12 rounded-xl bg-[#1b1524] overflow-hidden border border-[#503567]">
                      <img src={image} alt="preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#342b40]">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl text-[#a69ab1] hover:text-white"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#bd70df] text-[#160e1b] font-bold hover:bg-[#d091ee]"
                >
                  {editingId ? 'আপডেট সেভ করুন' : 'প্রোডাক্ট সংরক্ষণ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
