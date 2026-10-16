import React from 'react';
import { X, Command, Keyboard, Zap } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Alt + N', action: 'Create New Order (নতুন অর্ডার ফর্ম খুলুন)', tag: 'Order' },
    { key: 'Alt + D', action: 'Go to Dashboard Overview (ড্যাশবোর্ড ডিরেক্ট)', tag: 'Nav' },
    { key: 'Alt + O', action: 'Open Order Management (সকল অর্ডার তালিকা)', tag: 'Nav' },
    { key: 'Alt + P', action: 'Open Showroom POS Billing (পিওএস বিলিং কাউন্টার)', tag: 'POS' },
    { key: '/', action: 'Focus Search Bar (সার্চ বারে দ্রুত কার্সার রাখুন)', tag: 'Search' },
    { key: 'Esc', action: 'Close Modal / Dropdown / Drawer (যেকোনো পপআপ বন্ধ করুন)', tag: 'System' },
    { key: 'Alt + L', action: 'Toggle Language (বাংলা ⇄ English)', tag: 'Language' },
    { key: '?', action: 'Show this Shortcuts Cheatsheet (শর্টকাট তালিকা দেখুন)', tag: 'Help' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-[#16121f] border border-[#523868] rounded-2xl shadow-2xl overflow-hidden my-6">
        <div className="p-4 sm:p-5 border-b border-[#342b40] bg-[#120f18] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#bd70df]/20 text-[#bd70df] flex items-center justify-center">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Lightning-Fast Keyboard Shortcuts</span>
                <span className="text-[10px] bg-[#bd70df]/20 text-[#e6b4fa] px-2 py-0.5 rounded-full border border-[#bd70df]/40 font-mono">
                  Alt+Keys
                </span>
              </h3>
              <p className="text-[11px] text-[#a69ab1]">
                মাউস ছাড়া দ্রুততম গতিতে অর্ডার ও বিলিং সম্পাদন করুন
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

        <div className="p-5 max-h-[65vh] overflow-y-auto space-y-2">
          {shortcuts.map((sc, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2.5 rounded-xl bg-[#191424] border border-[#342b40] hover:border-[#bd70df]/40 transition-colors text-xs"
            >
              <div className="text-[#cfc4d9] font-medium pr-3">{sc.action}</div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] text-[#a69ab1] uppercase font-semibold hidden sm:inline">
                  {sc.tag}
                </span>
                <kbd className="px-2.5 py-1 rounded-lg bg-[#110d18] border border-[#48375c] text-[#f7dcff] font-mono font-bold text-xs shadow-inner">
                  {sc.key}
                </kbd>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-[#342b40] bg-[#120f18] flex items-center justify-between text-xs">
          <span className="text-[11px] text-[#a69ab1]">
            টিপস: যেকোনো সময় কীবোর্ডের <kbd className="px-1.5 py-0.5 rounded bg-[#20182b] border border-[#443358] text-white">?</kbd> চাপলে এই উইন্ডো আসবে
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#bd70df] text-[#160e1b] font-bold hover:bg-[#d091ee] transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
