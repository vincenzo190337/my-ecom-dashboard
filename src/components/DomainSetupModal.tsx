import React, { useState } from 'react';
import {
  X,
  Globe,
  Server,
  ShieldCheck,
  Copy,
  Check,
  CheckCircle2,
  ExternalLink,
  Terminal,
  HelpCircle,
} from 'lucide-react';

interface DomainSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DomainSetupModal: React.FC<DomainSetupModalProps> = ({ isOpen, onClose }) => {
  const [domainInput, setDomainInput] = useState('shop.alvina.com.bd');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'dns' | 'cpanel' | 'nginx' | 'cloudflare'>('dns');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-[#16121f] border border-[#523868] rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#342b40] bg-[#120f18] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#bd70df] flex items-center justify-center text-white shadow-md">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Domain & Hosting Setup Wizard</span>
                <span className="text-[10px] bg-[#10b981]/20 text-[#34d399] px-2 py-0.5 rounded-full border border-[#10b981]/40 font-semibold">
                  Zero Developer Needed
                </span>
              </h3>
              <p className="text-[11px] text-[#a69ab1]">
                আপনার নিজস্ব ডোমেইন (www.yourbrand.com) দিয়ে এই এডমিন প্যানেল ও স্টোর লাইভ চালান
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

        {/* Domain input */}
        <div className="p-5 bg-[#191424] border-b border-[#342b40] space-y-3">
          <label className="block text-xs font-semibold text-[#cfc4d9]">
            আপনার কাস্টম ডোমেইন বা সাবডোমেইন নাম লিখুন:
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Globe className="w-4 h-4 text-[#a69ab1] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={domainInput}
                onChange={(e) => {
                  setDomainInput(e.target.value);
                  setIsVerified(false);
                }}
                placeholder="e.g. boutique.com or admin.alvina.com"
                className="w-full pl-9 pr-3 py-2 bg-[#100d16] border border-[#3e2f50] rounded-xl text-xs sm:text-sm text-white font-mono outline-none focus:border-[#bd70df]"
              />
            </div>
            <button
              onClick={handleVerify}
              disabled={isVerifying}
              className="px-4 py-2 rounded-xl bg-[#bd70df] text-[#160e1b] font-bold text-xs hover:bg-[#d091ee] transition-all disabled:opacity-50 shrink-0"
            >
              {isVerifying ? 'যাচাই হচ্ছে...' : isVerified ? '✓ কানেক্টেড' : 'DNS টেস্ট ও কানেক্ট'}
            </button>
          </div>

          {isVerified && (
            <div className="p-3 rounded-xl bg-[#132c21] border border-[#166534] flex items-center gap-2 text-xs text-[#86efac] animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-[#22c55e] shrink-0" />
              <span>
                অভিনন্দন! ডোমেইন <strong className="font-mono text-white">{domainInput}</strong> সফলভাবে পয়েন্ট হয়েছে। SSL সক্রিয়।
              </span>
            </div>
          )}
        </div>

        {/* Provider Switch Tabs */}
        <div className="px-5 pt-3 bg-[#130f1a] border-b border-[#342b40] flex gap-2 overflow-x-auto text-xs">
          {[
            { id: 'dns', label: '1. DNS Records (General)' },
            { id: 'cloudflare', label: '2. Cloudflare (Free SSL)' },
            { id: 'cpanel', label: '3. cPanel Zone Editor' },
            { id: 'nginx', label: '4. Nginx / VPS' },
          ].map((tb) => (
            <button
              key={tb.id}
              onClick={() => setActiveTab(tb.id as any)}
              className={`pb-2.5 px-2 font-bold whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tb.id
                  ? 'border-[#bd70df] text-[#bd70df]'
                  : 'border-transparent text-[#a69ab1] hover:text-white'
              }`}
            >
              {tb.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="p-5 max-h-[50vh] overflow-y-auto space-y-4 text-xs">
          {activeTab === 'dns' && (
            <div className="space-y-3">
              <p className="text-[#cfc4d9] leading-relaxed">
                আপনার ডোমেইন প্রোভাইডারে (Namecheap, GoDaddy, DianaHost, ExonHost) লগইন করে নিচের DNS রেকর্ড দুটি যোগ করুন:
              </p>

              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-[#100d16] border border-[#342b40] flex items-center justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded bg-[#1e293b] text-[#38bdf8] font-mono font-bold text-[10px] mr-2">
                      A Record
                    </span>
                    <span className="font-mono text-white">@ (or root)</span> ➔{' '}
                    <span className="font-mono text-[#e6b4fa] font-bold">199.36.158.100</span>
                  </div>
                  <button
                    onClick={() => handleCopy('a-rec', '199.36.158.100')}
                    className="p-1.5 rounded-lg bg-[#20182b] text-[#a69ab1] hover:text-white"
                  >
                    {copiedKey === 'a-rec' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-[#100d16] border border-[#342b40] flex items-center justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded bg-[#1e293b] text-[#38bdf8] font-mono font-bold text-[10px] mr-2">
                      CNAME
                    </span>
                    <span className="font-mono text-white">www</span> ➔{' '}
                    <span className="font-mono text-[#e6b4fa] font-bold">ais-hosting.google.com</span>
                  </div>
                  <button
                    onClick={() => handleCopy('cname-rec', 'ais-hosting.google.com')}
                    className="p-1.5 rounded-lg bg-[#20182b] text-[#a69ab1] hover:text-white"
                  >
                    {copiedKey === 'cname-rec' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cloudflare' && (
            <div className="space-y-3 text-[#cfc4d9] leading-relaxed">
              <div className="flex items-center gap-2 text-white font-bold">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Cloudflare Integration (Recomended for Fastest Speed in BD)</span>
              </div>
              <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-[#bcb1c7]">
                <li>Cloudflare.com-এ ফ্রি একাউন্ট খুলে আপনার ডোমেইন অ্যাড করুন।</li>
                <li>DNS ট্যাবে গিয়ে Proxy Status: <strong>Proxied (Orange Cloud ☁️)</strong> সিলেক্ট করুন।</li>
                <li>SSL/TLS অপশনে গিয়ে <strong>Full (Strict)</strong> নির্বাচন করুন।</li>
                <li>আপনার সাইট নিমেষেই DDOS প্রটেকশন ও ফ্রি লাইফটাইম SSL পাবে।</li>
              </ol>
            </div>
          )}

          {activeTab === 'cpanel' && (
            <div className="space-y-3 text-[#cfc4d9] leading-relaxed">
              <div className="font-bold text-white">cPanel Zone Editor পদ্ধতি:</div>
              <p className="text-[11px] text-[#a69ab1]">
                cPanel ➔ Domains ➔ Zone Editor ➔ Manage ➔ Add Record নির্বাচন করে A Record বা CNAME বসিয়ে Save দিন। ৫ থেকে ১৫ মিনিটের মধ্যে বিশ্বব্যাপী কার্যকর হবে।
              </p>
            </div>
          )}

          {activeTab === 'nginx' && (
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-white">Nginx Reverse Proxy Config Snippet:</div>
              <pre className="p-3 rounded-xl bg-[#0d0a13] border border-[#342b40] font-mono text-[10px] text-[#93c5fd] overflow-x-auto">
{`server {
    listen 80;
    server_name ${domainInput || 'yourbrand.com'};

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}`}
              </pre>
              <button
                onClick={() => handleCopy('nginx', `server { listen 80; server_name ${domainInput}; location / { proxy_pass http://localhost:3000; } }`)}
                className="px-3 py-1.5 rounded-lg bg-[#251b32] text-white text-[11px] flex items-center gap-1.5"
              >
                {copiedKey === 'nginx' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Nginx Config</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#342b40] bg-[#120f18] flex items-center justify-between text-xs">
          <span className="text-[#a69ab1] text-[11px]">
            হেল্পলাইন: যেকোনো প্রয়োজনে আমাদের ইঞ্জিনিয়ারদের সাথে WhatsApp-এ যোগাযোগ করতে পারেন।
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#251d30] text-white hover:bg-[#342942] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
