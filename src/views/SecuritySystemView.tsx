import React, { useState, useEffect } from 'react';
import {
  ApprovalRequest,
  AuditLogEntry,
  ApiWebhook,
  DocumentFile,
  SystemConfig,
} from '../types';
import {
  FileCheck,
  ScrollText,
  Webhook,
  Activity,
  FolderArchive,
  Lock,
  Check,
  X,
  FileText,
  AlertTriangle,
  Download,
  Trash2,
} from 'lucide-react';

interface SecuritySystemViewProps {
  approvals: ApprovalRequest[];
  auditLogs: AuditLogEntry[];
  webhooks: ApiWebhook[];
  documents: DocumentFile[];
  config: SystemConfig;
  userRole?: string;
  onUpdateApproval: (id: number, status: 'Approved' | 'Rejected') => void;
  onDeleteDocument: (id: number) => void;
  onUpdateDocument?: (doc: DocumentFile) => void;
  onSaveDocument?: (doc: DocumentFile) => void;
  initialTab?: 'approvals' | 'auditLogs' | 'loginAudit' | 'apiWebhooks' | 'healthMonitor' | 'documents' | 'privacy';
}

export const SecuritySystemView: React.FC<SecuritySystemViewProps> = ({
  approvals,
  auditLogs,
  webhooks,
  documents,
  config,
  userRole = 'Admin',
  onUpdateApproval,
  onDeleteDocument,
  onUpdateDocument,
  onSaveDocument,
  initialTab = 'approvals',
}) => {
  const [tab, setTab] = useState(initialTab);
  const [editingDoc, setEditingDoc] = useState<DocumentFile | null>(null);

  const canSuperEdit = userRole === 'Admin' || userRole === 'Merchant';
  const isAdmin = userRole === 'Admin';

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            {tab === 'approvals' && <FileCheck className="w-5 h-5 text-[#bd70df]" />}
            {tab === 'auditLogs' && <ScrollText className="w-5 h-5 text-[#bd70df]" />}
            {tab === 'apiWebhooks' && <Webhook className="w-5 h-5 text-[#bd70df]" />}
            {tab === 'healthMonitor' && <Activity className="w-5 h-5 text-[#bd70df]" />}
            {tab === 'documents' && <FolderArchive className="w-5 h-5 text-[#bd70df]" />}
            {tab === 'privacy' && <Lock className="w-5 h-5 text-[#bd70df]" />}
            <span>
              {tab === 'approvals' && 'অনুমোদন ওয়ার্কফ্লো (Manager Approval Workflow)'}
              {tab === 'auditLogs' && 'অডিট ট্রেইল ও চেঞ্জ লগ (Audit Trail & Activity Logs)'}
              {tab === 'apiWebhooks' && 'এপিআই ও ওয়েবহুক ম্যানেজার (API & Webhook Manager)'}
              {tab === 'healthMonitor' && 'সিস্টেম হেলথ মনিটর (System Health & Uptime)'}
              {tab === 'documents' && 'ডকুমেন্ট ও ফাইল সেন্টার (Document Center)'}
              {tab === 'privacy' && 'ডাটা প্রাইভেসি ও কমপ্লায়েন্স (Data Privacy Tools)'}
            </span>
          </h2>
          <p className="text-xs text-[#a69ab1]">
            প্রতিষ্ঠানের অভ্যন্তরীণ নিরাপত্তা, সিদ্ধান্ত অনুমোদন, এপিআই সংযোগ এবং অডিট ট্র্যাকিং
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-[#100d16] p-1 rounded-xl border border-[#342b40] overflow-x-auto">
          {[
            { id: 'approvals', label: 'Approvals' },
            { id: 'auditLogs', label: 'Audit Trail' },
            { id: 'loginAudit', label: 'লগইন ও ডিভাইস (Admin)' },
            { id: 'apiWebhooks', label: 'APIs & Webhooks' },
            { id: 'healthMonitor', label: 'Health' },
            { id: 'documents', label: 'Documents' },
            { id: 'privacy', label: 'Privacy' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                tab === t.id ? 'bg-[#bd70df] text-[#160e1b]' : 'text-[#bcb1c7] hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. APPROVAL WORKFLOW TAB */}
      {tab === 'approvals' && (
        <div className="rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[#342b40] flex items-center justify-between">
            <span className="font-bold text-white text-sm">
              বড় ডিসকাউন্ট, রিফান্ড ও খরচের অনুমোদন রিকোয়েস্ট
            </span>
            <span className="text-xs text-[#a69ab1]">মোট {approvals.length} টি রিকোয়েস্ট</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#14101c] border-b border-[#342b40] text-[#a69ab1]">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Request Type</th>
                  <th className="py-2.5 px-3">Requested By</th>
                  <th className="py-2.5 px-3">Details / Amount</th>
                  <th className="py-2.5 px-3">Reason</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#282033]">
                {approvals.map((ap) => (
                  <tr key={ap.id} className="hover:bg-[#201927]">
                    <td className="py-3 px-3 font-mono text-[#a69ab1]">{ap.requestDate}</td>
                    <td className="py-3 px-3 font-semibold text-white">
                      <span className="px-2 py-0.5 rounded bg-[#271b35] text-[#e6b4fa]">
                        {ap.requestType}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#f7dcff]">{ap.requestedBy}</td>
                    <td className="py-3 px-3 font-medium text-white">{ap.amountOrDetails}</td>
                    <td className="py-3 px-3 text-[#a69ab1] max-w-xs">{ap.reason}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          ap.status === 'Approved'
                            ? 'bg-[#16382d] text-[#8de8bf]'
                            : ap.status === 'Rejected'
                            ? 'bg-[#44202a] text-[#ff9aaa]'
                            : 'bg-[#2b2518] text-[#fcd34d]'
                        }`}
                      >
                        {ap.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {ap.status === 'Pending' ? (
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => onUpdateApproval(ap.id, 'Approved')}
                            className="px-2 py-1 rounded bg-[#16382d] text-[#8de8bf] hover:bg-[#255845] font-semibold flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => onUpdateApproval(ap.id, 'Rejected')}
                            className="px-2 py-1 rounded bg-[#44202a] text-[#ff9aaa] hover:bg-[#67313e] font-semibold flex items-center gap-1"
                          >
                            <X className="w-3 h-3" />
                            <span>Reject</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-[#a69ab1]">Actioned</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. AUDIT TRAIL TAB */}
      {tab === 'auditLogs' && (
        <div className="rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[#342b40] flex items-center justify-between">
            <span className="font-bold text-white text-sm">কে, কখন, কী পরিবর্তন করেছে তার অডিট লগ</span>
            <span className="text-xs text-[#a69ab1]">অটো-রেকর্ডকৃত সিকিউরিটি লগ</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#14101c] border-b border-[#342b40] text-[#a69ab1]">
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">User</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Entity Affected</th>
                  <th className="py-2.5 px-3">Details</th>
                  <th className="py-2.5 px-3">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#282033]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#201927]">
                    <td className="py-3 px-3 font-mono text-[#a69ab1]">{log.timestamp}</td>
                    <td className="py-3 px-3 font-semibold text-white">
                      <span className="px-2 py-0.5 rounded bg-[#271b35] text-[#bd70df]">
                        {log.user}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#f7dcff] font-medium">{log.action}</td>
                    <td className="py-3 px-3 font-mono text-white">{log.entity}</td>
                    <td className="py-3 px-3 text-[#d7cddd]">{log.details}</td>
                    <td className="py-3 px-3 font-mono text-[#a69ab1]">{log.ipAddress || 'Internal'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. APIS & WEBHOOKS TAB */}
      {tab === 'apiWebhooks' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {webhooks.map((wh) => (
            <div key={wh.id} className="p-5 rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white text-sm">{wh.name}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#16382d] text-[#8de8bf] font-semibold">
                  {wh.status}
                </span>
              </div>
              <div className="space-y-1 text-xs">
                <span className="text-[#a69ab1]">Endpoint URL:</span>
                <div className="font-mono text-[11px] text-[#e6b4fa] bg-[#100d16] p-2 rounded-lg truncate">
                  {wh.endpointUrl}
                </div>
              </div>
              <div className="flex justify-between items-center text-[11px] text-[#a69ab1] pt-2 border-t border-[#342b40]">
                <span>সার্ভিস: {wh.service}</span>
                <span>সর্বশেষ ট্রিগার: {wh.lastTriggered}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. HEALTH MONITOR TAB */}
      {tab === 'healthMonitor' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#181520] border border-[#342b40]">
              <span className="text-xs text-[#a69ab1]">সিস্টেম স্ট্যাটাস</span>
              <div className="text-xl font-bold text-[#36c98b] mt-1 flex items-center gap-1.5">
                <Check className="w-5 h-5" />
                <span>100% Operational</span>
              </div>
              <span className="text-[11px] text-[#a69ab1] mt-1 block">সকল সার্ভিস সচল রয়েছে</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#181520] border border-[#342b40]">
              <span className="text-xs text-[#a69ab1]">ব্যর্থ অর্ডার রেট (Failed Orders)</span>
              <div className="text-xl font-bold text-white font-mono mt-1 tabular-nums">0%</div>
              <span className="text-[11px] text-[#36c98b] mt-1 block">সব সাবমিশন সফল</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#181520] border border-[#342b40]">
              <span className="text-xs text-[#a69ab1]">API লেটেন্সি (Avg Latency)</span>
              <div className="text-xl font-bold text-[#bd70df] font-mono mt-1 tabular-nums">42 ms</div>
              <span className="text-[11px] text-[#a69ab1] mt-1 block">তাত্ক্ষণিক রেসপন্স</span>
            </div>

            <div className="p-5 rounded-2xl bg-[#181520] border border-[#342b40]">
              <span className="text-xs text-[#a69ab1]">লোকাল স্টোরেজ ব্যবহার</span>
              <div className="text-xl font-bold text-white font-mono mt-1 tabular-nums">1.8 MB / 5 MB</div>
              <span className="text-[11px] text-[#36c98b] mt-1 block">যথেষ্ট ধারণক্ষমতা অবশিষ্ট</span>
            </div>
          </div>
        </div>
      )}

      {/* 5. DOCUMENTS TAB */}
      {tab === 'documents' && (
        <div className="rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[#342b40] font-bold text-white text-sm">
            সংরক্ষিত অফিসিয়াল চালন, লাইসেন্স ও ট্যাক্স ফাইলসমূহ
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#14101c] border-b border-[#342b40] text-[#a69ab1]">
                  <th className="py-2.5 px-3">Document Title</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">File Size</th>
                  <th className="py-2.5 px-3">Uploaded By</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#282033]">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-[#201927]">
                    <td className="py-3 px-3 font-semibold text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#bd70df]" />
                      <span>{doc.title}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-[#271b35] text-[#e6b4fa]">
                        {doc.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[#a69ab1]">{doc.date}</td>
                    <td className="py-3 px-3 font-mono text-white">{doc.fileSize}</td>
                    <td className="py-3 px-3 text-[#d7cddd]">{doc.uploadedBy}</td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {canSuperEdit && (
                          <button
                            onClick={() => setEditingDoc({ ...doc })}
                            className="px-2 py-1 rounded bg-[#271b35] text-[#e6b4fa] hover:bg-[#bd70df] hover:text-[#160e1b] text-[11px] font-bold"
                            title="সুপার এডিট ডকুমেন্ট"
                          >
                            সুপার এডিট
                          </button>
                        )}
                        <button
                          onClick={() => onDeleteDocument(doc.id)}
                          className="p-1 rounded text-[#ff6b83] hover:bg-[#351822]"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* LOGIN ACTIVITY & DEVICE TRACKING (ADMIN ONLY) */}
      {tab === 'loginAudit' && (
        <div className="space-y-4">
          {!isAdmin ? (
            <div className="p-8 rounded-2xl bg-[#1b1016] border border-[#6b253e] text-center space-y-2">
              <Lock className="w-8 h-8 text-[#ff809b] mx-auto" />
              <h3 className="text-base font-bold text-white">অ্যাক্সেস সীমাবদ্ধ (Admin Only)</h3>
              <p className="text-xs text-[#a69ab1]">
                এই ড্যাশবোর্ডে কে কখন লগইন করেছে এবং কোন ডিভাইস ব্যবহার করেছে তা শুধুমাত্র প্রধান অ্যাডমিন দেখতে পারবেন।
              </p>
            </div>
          ) : (
            <div className="rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm overflow-hidden">
              <div className="p-4 border-b border-[#342b40] flex items-center justify-between">
                <div>
                  <span className="font-bold text-white text-sm">
                    কে কখন কোন ডিভাইস থেকে লগইন করেছে (Login Activity & Device Tracking)
                  </span>
                  <p className="text-xs text-[#a69ab1]">
                    ডিভাইস, ব্রাউজার, আইপি অ্যাড্রেস ও লোকেশন সিকিউরিটি ট্রেইল (শুধু অ্যাডমিনের জন্য দৃশ্যমান)
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-lg bg-[#16382d] text-[#8de8bf] font-bold">
                  Admin Verified
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#14101c] border-b border-[#342b40] text-[#a69ab1]">
                      <th className="py-2.5 px-3">ব্যবহারকারী (User)</th>
                      <th className="py-2.5 px-3">রোল (Role)</th>
                      <th className="py-2.5 px-3">ডিভাইস ও ওএস (Device)</th>
                      <th className="py-2.5 px-3">ব্রাউজার (Browser)</th>
                      <th className="py-2.5 px-3">আইপি অ্যাড্রেস (IP)</th>
                      <th className="py-2.5 px-3">লগইন সময় (Timestamp)</th>
                      <th className="py-2.5 px-3">স্ট্যাটাস</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#282033]">
                    {[
                      {
                        user: config.user || 'admin',
                        role: 'Super Admin',
                        device: 'Windows 11 PC (Desktop)',
                        browser: 'Google Chrome 124.0',
                        ip: '172.16.0.2',
                        time: new Date().toISOString().slice(0, 16).replace('T', ' '),
                        status: 'সক্রিয় সেশন (Active)',
                      },
                      {
                        user: 'farhana_merchant',
                        role: 'Merchant Owner',
                        device: 'Apple iPhone 15 Pro (iOS 17.4)',
                        browser: 'Mobile Safari',
                        ip: '103.114.98.42 (Dhaka, Adabor)',
                        time: new Date(Date.now() - 3600000 * 2).toISOString().slice(0, 16).replace('T', ' '),
                        status: 'লগআউট সম্পন্ন',
                      },
                      {
                        user: 'shirin_showroom',
                        role: 'POS Cashier',
                        device: 'Samsung Galaxy Tab S9 (Android 14)',
                        browser: 'Chrome Mobile',
                        ip: '103.205.71.12 (Dhanmondi Outlet)',
                        time: new Date(Date.now() - 3600000 * 5).toISOString().slice(0, 16).replace('T', ' '),
                        status: 'সেশন সমাপ্ত',
                      },
                      {
                        user: 'tasnim_order_mgr',
                        role: 'Order Manager',
                        device: 'MacBook Air M2 (macOS Sonoma)',
                        browser: 'Brave Browser',
                        ip: '118.179.223.88 (Uttara Branch)',
                        time: new Date(Date.now() - 86400000).toISOString().slice(0, 16).replace('T', ' '),
                        status: 'সেশন সমাপ্ত',
                      },
                    ].map((entry, idx) => (
                      <tr key={idx} className="hover:bg-[#201927]">
                        <td className="py-3 px-3 font-semibold text-white">{entry.user}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded bg-[#271b35] text-[#e6b4fa] font-bold">
                            {entry.role}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-[#f3ebf8] font-medium">{entry.device}</td>
                        <td className="py-3 px-3 text-[#a69ab1]">{entry.browser}</td>
                        <td className="py-3 px-3 font-mono text-[#93c5fd]">{entry.ip}</td>
                        <td className="py-3 px-3 font-mono text-[#a69ab1]">{entry.time}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              entry.status.includes('Active')
                                ? 'bg-[#16382d] text-[#8de8bf]'
                                : 'bg-[#1e293b] text-[#93c5fd]'
                            }`}
                          >
                            {entry.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Super Edit Document Modal */}
      {editingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#16121f] border border-[#714786] rounded-2xl p-5 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#342b40]">
              <h3 className="font-bold text-white text-sm">সুপার এডিট: ডকুমেন্ট ({editingDoc.title})</h3>
              <button onClick={() => setEditingDoc(null)} className="text-[#a69ab1] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-[#cfc4d9] mb-1">ডকুমেন্টের নাম *</label>
                <input
                  value={editingDoc.title}
                  onChange={(e) => setEditingDoc({ ...editingDoc, title: e.target.value })}
                  className="w-full px-3 py-2 bg-[#100d16] border border-[#342b40] rounded-xl text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-[#cfc4d9] mb-1">ক্যাটাগরি</label>
                <select
                  value={editingDoc.category}
                  onChange={(e) => setEditingDoc({ ...editingDoc, category: e.target.value as any })}
                  className="w-full px-3 py-2 bg-[#100d16] border border-[#342b40] rounded-xl text-white outline-none"
                >
                  <option value="Invoice">Invoice (চালান / ইনভয়েস)</option>
                  <option value="Supplier Receipt">Supplier Receipt (সাপ্লায়ার রসিদ)</option>
                  <option value="Chalan Slip">Chalan Slip (কুরিয়ার চালান)</option>
                  <option value="Trade License">Trade License (ট্রেড লাইসেন্স)</option>
                  <option value="Tax Document">Tax Document (ট্যাক্স ও ভ্যাট)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#cfc4d9] mb-1">তারিখ</label>
                  <input
                    type="date"
                    value={editingDoc.date}
                    onChange={(e) => setEditingDoc({ ...editingDoc, date: e.target.value })}
                    className="w-full px-3 py-2 bg-[#100d16] border border-[#342b40] rounded-xl text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#cfc4d9] mb-1">ফাইল সাইজ</label>
                  <input
                    value={editingDoc.fileSize}
                    onChange={(e) => setEditingDoc({ ...editingDoc, fileSize: e.target.value })}
                    className="w-full px-3 py-2 bg-[#100d16] border border-[#342b40] rounded-xl text-white font-mono outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[#cfc4d9] mb-1">আপলোডকারী স্টাফ</label>
                <input
                  value={editingDoc.uploadedBy}
                  onChange={(e) => setEditingDoc({ ...editingDoc, uploadedBy: e.target.value })}
                  className="w-full px-3 py-2 bg-[#100d16] border border-[#342b40] rounded-xl text-white outline-none"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2 border-t border-[#342b40]">
                <button
                  type="button"
                  onClick={() => setEditingDoc(null)}
                  className="px-4 py-2 rounded-xl text-[#a69ab1] hover:text-white"
                >
                  বাতিল
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onUpdateDocument) onUpdateDocument(editingDoc);
                    setEditingDoc(null);
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

      {/* 6. PRIVACY TAB */}
      {tab === 'privacy' && (
        <div className="p-6 rounded-2xl bg-[#181520] border border-[#342b40] shadow-sm space-y-4 max-w-xl text-xs">
          <h3 className="font-bold text-white text-base pb-2 border-b border-[#342b40]">
            কাস্টমার ডাটা প্রাইভেসি ও রিটেনশন পলিসি
          </h3>
          <p className="text-[#a69ab1] leading-relaxed">
            গ্রাহকের ফোন নম্বর, ঠিকানা এবং ক্রয় ইতিহাস সুরক্ষিত রাখা এবং গ্রাহকের অনুরোধে ডাটা এক্সপোর্ট
            বা মুছে ফেলার ব্যবস্থা।
          </p>
          <div className="space-y-3 pt-2">
            <div className="p-3.5 rounded-xl bg-[#100d16] border border-[#342b40] flex justify-between items-center">
              <div>
                <div className="font-semibold text-white">Customer Data Export Request</div>
                <div className="text-[#a69ab1] text-[11px]">আইনসম্মত উপায়ে কাস্টমার প্রোফাইল এক্সপোর্ট</div>
              </div>
              <button
                onClick={() => alert('Customer GDPR Data Package Exported!')}
                className="px-3 py-1.5 rounded-lg bg-[#271b35] text-[#bd70df] font-semibold"
              >
                Export JSON
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-[#100d16] border border-[#342b40] flex justify-between items-center">
              <div>
                <div className="font-semibold text-white">Right to be Forgotten (Delete Data)</div>
                <div className="text-[#a69ab1] text-[11px]">নির্দিষ্ট ফোন নম্বরের অর্ডার ইতিহাস গোপন করা</div>
              </div>
              <button
                onClick={() => alert('Anonymize & Deletion Protocol triggered!')}
                className="px-3 py-1.5 rounded-lg bg-[#351822] text-[#ff9aaa] font-semibold"
              >
                Anonymize
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
