import React, { useState } from 'react';
import { Product } from '../types';
import { Image as ImageIcon, Upload, Copy, Check, Eye, Trash2, X } from 'lucide-react';

interface ImageManagerViewProps {
  products: Product[];
  onUploadImage: (dataUrl: string, name: string) => void;
}

export const ImageManagerView: React.FC<ImageManagerViewProps> = ({
  products,
  onUploadImage,
}) => {
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const [previewImg, setPreviewImg] = useState<string | null>(null);

  // Default gallery collection including the generated assets
  const galleryItems = [
    {
      title: 'Luxury Organza Embroidered Three Piece',
      path: '/src/assets/images/fashion_organza_dress_1791729125639.jpg',
      category: 'Three Piece',
      size: '1.2 MB',
    },
    {
      title: 'Handblock Printed Premium Cotton Kurti',
      path: '/src/assets/images/fashion_cotton_kurti_1791729138136.jpg',
      category: 'Kurti',
      size: '980 KB',
    },
    {
      title: 'Emerald Festive Silk Co-ord Set',
      path: '/src/assets/images/fashion_silk_coord_1791729152610.jpg',
      category: 'Co-ord Set',
      size: '1.4 MB',
    },
    {
      title: 'Royal Flared Anarkali Festive Gown',
      path: '/src/assets/images/fashion_anarkali_gown_1791729166627.jpg',
      category: 'Anarkali',
      size: '1.8 MB',
    },
    // Also include any custom uploaded product images
    ...products
      .filter((p) => p.image && !p.image.includes('src/assets/images'))
      .map((p) => ({
        title: p.name,
        path: p.image,
        category: p.category,
        size: 'Custom Upload',
      })),
  ];

  const handleCopy = (path: string) => {
    navigator.clipboard.writeText(path);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2.5 * 1024 * 1024) {
      alert('ছবির সাইজ ২.৫ মেগাবাইটের কম রাখুন');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      onUploadImage(reader.result as string, file.name);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      <div className="p-4 sm:p-5 rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[#bd70df]" />
            <span>ইমেজ ও মিডিয়া গ্যালারি ম্যানেজার (Image Manager)</span>
          </h2>
          <p className="text-xs text-[#a69ab1]">
            ওয়েবসাইট, ল্যান্ডিং পেজ ও ফেসবুক ক্যাটালগের জন্য হাই-রেজ্যুলেশন প্রোডাক্ট ফটোগ্রাফি
          </p>
        </div>

        <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#bd70df] text-[#160e1b] hover:bg-[#d091ee] cursor-pointer transition-colors">
          <Upload className="w-4 h-4" />
          <span>নতুন ছবি আপলোড (Upload Media)</span>
          <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>

      {/* Grid of Images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {galleryItems.map((item, i) => (
          <div
            key={i}
            className="rounded-2xl bg-[#181520] border border-[#342b40] overflow-hidden flex flex-col justify-between group hover:border-[#714786] transition-all"
          >
            <div className="relative aspect-square bg-[#100d16] overflow-hidden">
              <img
                src={item.path}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => setPreviewImg(item.path)}
                  className="p-2 rounded-xl bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm transition-colors"
                  title="View full"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleCopy(item.path)}
                  className="p-2 rounded-xl bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm transition-colors"
                  title="Copy Path"
                >
                  {copiedPath === item.path ? (
                    <Check className="w-4 h-4 text-[#36c98b]" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="p-3.5 space-y-2">
              <div className="text-xs font-semibold text-white truncate">{item.title}</div>
              <div className="flex items-center justify-between text-[11px] text-[#a69ab1]">
                <span className="px-1.5 py-0.5 rounded bg-[#271b35] text-[#e6b4fa]">
                  {item.category}
                </span>
                <span>{item.size}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Full preview modal */}
      {previewImg && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewImg(null)}
        >
          <div className="relative max-w-2xl w-full bg-[#181520] border border-[#342b40] rounded-2xl overflow-hidden p-2">
            <button
              onClick={() => setPreviewImg(null)}
              className="absolute top-4 right-4 z-10 p-1.5 rounded-xl bg-black/60 text-white hover:bg-black/80"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={previewImg}
              alt="Preview"
              className="w-full max-h-[80vh] object-contain rounded-xl"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}
    </div>
  );
};
