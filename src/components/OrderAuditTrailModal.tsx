import React, { useState } from 'react';
import { Order } from '../types';
import { X, Clock, ShieldCheck, User, Plus, CheckCircle2, FileText, Send, Tag } from 'lucide-react';

interface OrderAuditTrailModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onAddAuditLog?: (orderId: number, log: { timestamp: string; action: string; user: string }) => void;
}

export const OrderAuditTrailModal: React.FC<OrderAuditTrailModalProps> = ({
  order,
  isOpen,
  onClose,
  onAddAuditLog,
}) => {
  const [newAction, setNewAction] = useState('');
  const [actorName, setActorName] = useState('Admin');

  if (!isOpen || !order) return null;

  // Build simulated default audit logs if order doesn't have custom ones
  const defaultLogs = [
    {
      timestamp: `${new Date(order.date).toLocaleDateString('bn-BD')} 10:15 AM`,
      action: `Order #${order.id} entered via ${order.source || 'Manual Web'}`,
      user: 'Salma (Entry Staff)',
    },
    {
      timestamp: `${new Date(order.date).toLocaleDateString('bn-BD')} 10:30 AM`,
      action: `Status marked as "${order.status}" and verified by phone`,
      user: 'Admin',
    },
    {
      timestamp: `${new Date(order.date).toLocaleDateString('bn-BD')} 11:00 AM`,
      action: `Consignment created for ${order.courierService || 'Steadfast Courier'} [${order.courierConsignmentId || `CN-${order.id}-904`}]`,
      user: 'Logistics Manager',
    },
    {
      timestamp: `${new Date(order.date).toLocaleDateString('bn-BD')} 11:15 AM`,
      action: '4x6 Thermal Courier Sticker generated and printed',
      user: 'Dispatch Operator',
    },
  ];

  const auditLogs = order.auditTrail && order.auditTrail.length > 0 ? order.auditTrail : defaultLogs;

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAction.trim()) return;

    const newLog = {
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      action: newAction.trim(),
      user: actorName.trim() || 'Admin',
    };

    if (onAddAuditLog) {
      onAddAuditLog(order.id, newLog);
    }
    setNewAction('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#16121f] border border-[#3d2f4d] rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#342b40] bg-[#120f18] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#bd70df]/20 flex items-center justify-center text-[#bd70df]">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">অর্ডার অডিট ট্রেইল ও টাইমস্ট্যাম্প লগ</h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-[#251733] text-[#bd70df] font-bold">
                  #{order.id}
                </span>
              </div>
              <p className="text-xs text-[#a69ab1] mt-0.5">
                কে কবে কী করেছে - স্বচ্ছতা এবং কোনো সমস্যা হলে ট্র্যাক করার জন্য অডিট হিস্ট্রি
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#a69ab1] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Quick Summary Bar */}
        <div className="px-5 py-3 bg-[#1d1727] border-b border-[#342b40] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-[#a69ab1]">গ্রাহক: </span>
            <span className="text-white font-semibold">{order.customer}</span>
            <span className="text-[#a69ab1] font-mono ml-2">({order.phone})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#a69ab1]">বর্তমান অবস্থা: </span>
            <span className="px-2 py-0.5 rounded-full font-bold bg-[#bd70df]/20 text-[#e6b4fa] border border-[#bd70df]/40">
              {order.status}
            </span>
          </div>
        </div>

        {/* Audit Timeline */}
        <div className="p-5 max-h-[380px] overflow-y-auto space-y-4">
          <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#342b40]">
            {auditLogs.map((log, index) => (
              <div key={index} className="relative group">
                {/* Dot */}
                <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-[#1b1524] border-2 border-[#bd70df] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#bd70df]" />
                </div>

                <div className="p-3.5 rounded-xl bg-[#1b1524] border border-[#342b40] group-hover:border-[#bd70df]/50 transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-mono text-[#a69ab1] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#bd70df]" />
                      {log.timestamp}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-[#271b35] text-[#e879f9] text-[11px] font-semibold flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {log.user}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-white mt-2 leading-relaxed">
                    {log.action}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add custom audit note */}
        <form onSubmit={handleAddLog} className="p-4 bg-[#120f18] border-t border-[#342b40] space-y-3">
          <div className="text-xs font-semibold text-[#d7cddd] flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5 text-[#bd70df]" />
            <span>নতুন অডিট নোট / অ্যাকশন যোগ করুন</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              value={actorName}
              onChange={(e) => setActorName(e.target.value)}
              placeholder="কর্মচারীর নাম (যেমন: Admin)"
              className="px-3 py-2 rounded-xl bg-[#1a1424] border border-[#342b40] text-xs text-white placeholder-[#7d6f8a] focus:outline-none focus:border-[#bd70df]"
            />
            <input
              type="text"
              value={newAction}
              onChange={(e) => setNewAction(e.target.value)}
              placeholder="কী পরিবর্তন বা কাজ করা হয়েছে লিখুন..."
              className="sm:col-span-2 px-3 py-2 rounded-xl bg-[#1a1424] border border-[#342b40] text-xs text-white placeholder-[#7d6f8a] focus:outline-none focus:border-[#bd70df]"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!newAction.trim()}
              className="px-4 py-1.5 rounded-xl text-xs font-bold bg-[#bd70df] text-[#120a17] hover:bg-[#d091ee] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span>নোট যুক্ত করুন (Log Action)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
