import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${
            t.type === 'success'
              ? 'bg-[#181f1c] border-[#36c98b]/40 text-[#a3f3cf]'
              : t.type === 'error'
              ? 'bg-[#27151a] border-[#ff6b83]/40 text-[#ffb0bd]'
              : 'bg-[#1e172a] border-[#bd70df]/40 text-[#e9c7ff]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#36c98b] shrink-0" />}
            {t.type === 'error' && <AlertCircle className="w-5 h-5 text-[#ff6b83] shrink-0" />}
            {t.type === 'info' && <Info className="w-5 h-5 text-[#bd70df] shrink-0" />}
            <span className="text-sm font-medium">{t.text}</span>
          </div>
          <button
            onClick={() => onDismiss(t.id)}
            className="p-1 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
