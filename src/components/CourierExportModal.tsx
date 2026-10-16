import React, { useState } from 'react';
import { Order } from '../types';
import { X, Copy, Check, Truck } from 'lucide-react';

interface CourierExportModalProps {
  orders: Order[];
  onClose: () => void;
  onCopySuccess: () => void;
}

export const CourierExportModal: React.FC<CourierExportModalProps> = ({
  orders,
  onClose,
  onCopySuccess,
}) => {
  const [copied, setCopied] = useState(false);
  const [format, setFormat] = useState<'steadfast' | 'pathao' | 'plain'>('steadfast');

  // Format orders based on common Bangladesh courier bulk format
  const generateBulkText = () => {
    if (format === 'steadfast') {
      // Invoice, Customer Name, Phone, Address, COD, Notes
      const header = 'Invoice\tRecipient Name\tRecipient Phone\tRecipient Address\tCOD Amount\tNote';
      const rows = orders.map((o) => {
        const items = o.items.map((i) => `${i.name} (x${i.qty})`).join(', ');
        return `#${o.id}\t${o.customer}\t${o.phone}\t${o.address.replace(/\n|\r/g, ' ')}\t${o.due}\t${items}${
          o.shippingNote ? ' - ' + o.shippingNote : ''
        }`;
      });
      return [header, ...rows].join('\n');
    } else if (format === 'pathao') {
      // Item Type, Recipient Name, Recipient Phone, Recipient Address, Delivery Area, Amount to Collect, Item Description
      const header = 'Recipient Name,Phone,Address,Area,COD Amount,Items';
      const rows = orders.map((o) => {
        const items = o.items.map((i) => `${i.name} x${i.qty}`).join('; ');
        return `"${o.customer}","${o.phone}","${o.address.replace(/"/g, '""')}","${
          o.area === 'dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'
        }",${o.due},"${items}"`;
      });
      return [header, ...rows].join('\n');
    } else {
      // Plain readable text for messaging or rider dispatch
      return orders
        .map(
          (o, i) =>
            `--- [Parcel #${i + 1}] Order ID: #${o.id} ---\n` +
            `Customer: ${o.customer}\n` +
            `Phone: ${o.phone}\n` +
            `Address: ${o.address}\n` +
            `Items: ${o.items.map((p) => `${p.name} (x${p.qty})`).join(', ')}\n` +
            `Cash to Collect (COD): ৳${o.due}\n` +
            `Note: ${o.shippingNote || 'None'}\n`
        )
        .join('\n');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateBulkText());
    setCopied(true);
    onCopySuccess();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-[#181520] border border-[#342b40] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between p-4 border-b border-[#342b40] bg-[#14101c]">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#bd70df]" />
            <h3 className="font-semibold text-white">Courier Bulk Consignment Data</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#a69ab1] hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-[#342b40] bg-[#1a1424] flex items-center gap-2">
          <span className="text-xs text-[#a69ab1]">Format:</span>
          <button
            onClick={() => setFormat('steadfast')}
            className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
              format === 'steadfast'
                ? 'bg-[#bd70df] text-[#160e1b] font-bold'
                : 'text-[#a69ab1] hover:text-white bg-[#100e16]'
            }`}
          >
            Steadfast (TSV / Excel)
          </button>
          <button
            onClick={() => setFormat('pathao')}
            className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
              format === 'pathao'
                ? 'bg-[#bd70df] text-[#160e1b] font-bold'
                : 'text-[#a69ab1] hover:text-white bg-[#100e16]'
            }`}
          >
            Pathao / CSV
          </button>
          <button
            onClick={() => setFormat('plain')}
            className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
              format === 'plain'
                ? 'bg-[#bd70df] text-[#160e1b] font-bold'
                : 'text-[#a69ab1] hover:text-white bg-[#100e16]'
            }`}
          >
            Rider Text Format
          </button>
        </div>

        <div className="p-4 flex-1 overflow-auto">
          <p className="text-xs text-[#a69ab1] mb-2">
            নির্বাচিত {orders.length} টি অর্ডারের কুরিয়ার ডেলিভারি ডাটা নিচে তৈরি করা হয়েছে। এক ক্লিকে
            কপি করে Steadfast / Pathao মার্চেন্ট পোর্টালে পেস্ট করতে পারেন:
          </p>
          <textarea
            readOnly
            value={generateBulkText()}
            rows={12}
            className="w-full bg-[#100d16] text-[#eee5f3] font-mono text-xs p-3 rounded-xl border border-[#342b40] focus:border-[#bd70df] outline-none select-all"
          />
        </div>

        <div className="p-4 border-t border-[#342b40] bg-[#14101c] flex items-center justify-between">
          <span className="text-xs text-[#a69ab1]">মোট পার্সেল: {orders.length} টি</span>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[#bd70df] text-[#160e1b] hover:bg-[#d091ee] transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'কপি হয়েছে (Copied)' : 'Copy All to Clipboard'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium bg-[#211b2b] text-[#d7cddd] hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
