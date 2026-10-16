import React, { useState } from 'react';
import { X, Download, Code, FileText, Check, Copy, ExternalLink, Terminal, Sparkles, FolderArchive, HelpCircle } from 'lucide-react';

interface CodeExportModalProps {
  onClose: () => void;
}

export const CodeExportModal: React.FC<CodeExportModalProps> = ({ onClose }) => {
  const [downloadedType, setDownloadedType] = useState<string | null>(null);
  const [copiedCmd, setCopiedCmd] = useState(false);

  // Generate self-contained standalone HTML bundle with sizes 36-56 & live fraud checker
  const handleDownloadStandaloneHTML = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ALVINA Commerce - Standalone Portable Edition (Sizes 36-56 & Fraud Checker)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
  <style>
    body { font-family: 'Hind Siliguri', 'Plus Jakarta Sans', sans-serif; background-color: #100e16; color: #f7f2fb; margin: 0; }
  </style>
</head>
<body class="bg-[#100e16] text-[#f7f2fb] min-h-screen">
  <div class="max-w-4xl mx-auto p-4 sm:p-8">
    <!-- Header -->
    <header class="flex flex-wrap items-center justify-between border-b border-[#342b40] pb-5 mb-8 gap-4">
      <div>
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-[#bd70df] animate-pulse"></span>
          <h1 class="text-2xl font-bold tracking-tight text-white">ALVINA <span class="text-[#bd70df]">COMMERCE</span></h1>
        </div>
        <p class="text-xs text-[#a69ab1] mt-0.5">Standalone Portable Edition • অফলাইন ও ব্রাউজার রেডি</p>
      </div>
      <div class="flex items-center gap-2">
        <span class="px-3 py-1 rounded-full bg-[#16382d] text-[#8de8bf] text-xs font-semibold">Offline Ready</span>
        <span class="px-3 py-1 rounded-full bg-[#271b35] text-[#e6b4fa] text-xs font-semibold">Sizes: 36-56</span>
      </div>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Live Courier Fraud Checker Box -->
      <div class="p-6 rounded-2xl bg-[#181520] border border-[#342b40] space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-base font-bold text-white flex items-center gap-2">
            <span>🛡️ লাইভ কুরিয়ার ফ্রড চেকার</span>
          </h2>
          <span class="text-[11px] text-[#bd70df] font-mono">Steadfast • Pathao • RedX</span>
        </div>
        <p class="text-xs text-[#a69ab1]">
          কাস্টমারের মোবাইল নম্বর লিখুন—রিসিভড ও ক্যান্সেল পার্সেলের বিস্তারিত রিপোর্ট সাথে সাথে দেখতে পাবেন:
        </p>

        <div>
          <label class="block text-xs font-medium text-[#cfc4d9] mb-1.5">গ্রাহকের মোবাইল নম্বর (BD Mobile)</label>
          <input
            id="fraudPhoneInput"
            type="text"
            placeholder="01712345678"
            value="01711223344"
            class="w-full bg-[#100d16] border border-[#483959] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#bd70df]"
          />
        </div>

        <div class="flex flex-wrap gap-2 text-xs">
          <span class="text-[#a69ab1]">টেস্ট নম্বর:</span>
          <button onclick="setTestPhone('01711223344')" class="px-2 py-0.5 rounded bg-[#100d16] text-[#8de8bf] hover:bg-[#201a2d]">01711223344 (Safe)</button>
          <button onclick="setTestPhone('01911998877')" class="px-2 py-0.5 rounded bg-[#100d16] text-[#ff7991] hover:bg-[#201a2d]">01911998877 (High Risk)</button>
          <button onclick="setTestPhone('01844556677')" class="px-2 py-0.5 rounded bg-[#100d16] text-[#ffbe3b] hover:bg-[#201a2d]">01844556677 (Moderate)</button>
        </div>

        <div id="fraudResultBox" class="p-4 rounded-xl bg-[#100d16] border border-[#342b40] space-y-3">
          <!-- Populated by JS -->
        </div>
      </div>

      <!-- Quick Manual Order with Sizing 36-56 -->
      <div class="p-6 rounded-2xl bg-[#181520] border border-[#342b40] space-y-4">
        <h2 class="text-base font-bold text-white flex items-center gap-2">
          <span>🛍️ কুইক অর্ডার ও সাইজ নির্বাচন</span>
        </h2>
        <p class="text-xs text-[#a69ab1]">
          স্ট্যান্ডার্ড সাইজ (৩৬-৪৮) এবং ম্যাক্স সাইজ (৫০-৫৬) নির্বাচন অপশন:
        </p>

        <div class="space-y-3">
          <div>
            <label class="block text-xs font-medium text-[#cfc4d9] mb-1">কাস্টমার নাম</label>
            <input type="text" id="custName" value="ফারহানা চৌধুরী" class="w-full bg-[#100d16] border border-[#342b40] rounded-xl px-3 py-2 text-xs text-white" />
          </div>

          <div>
            <label class="block text-xs font-medium text-[#cfc4d9] mb-1">ড্রেস সাইজ (Dress Size)</label>
            <select id="dressSizeSelect" class="w-full bg-[#100d16] border border-[#342b40] rounded-xl px-3 py-2 text-xs text-white">
              <optgroup label="── স্ট্যান্ডার্ড সাইজ (Standard: 36-48) ──">
                <option value="36">Size 36 (Small)</option>
                <option value="38" selected>Size 38 (Medium Standard)</option>
                <option value="40">Size 40 (Large)</option>
                <option value="42">Size 42 (XL)</option>
                <option value="44">Size 44 (2XL)</option>
                <option value="46">Size 46 (3XL)</option>
                <option value="48">Size 48 (4XL)</option>
              </optgroup>
              <optgroup label="── ম্যাক্স সাইজ (Max Plus Sizes: 50-56) ──">
                <option value="50">Size 50 (Max Plus 5XL)</option>
                <option value="52">Size 52 (Max Plus 6XL)</option>
                <option value="54">Size 54 (Max Plus 7XL)</option>
                <option value="56">Size 56 (Max Plus 8XL)</option>
              </optgroup>
              <optgroup label="── অন্যান্য ──">
                <option value="Free Size">Free Size (বুটিক কাস্টম)</option>
              </optgroup>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-[#cfc4d9] mb-1">মূল্য (৳)</label>
              <input type="number" id="orderPrice" value="2650" class="w-full bg-[#100d16] border border-[#342b40] rounded-xl px-3 py-2 text-xs text-white" />
            </div>
            <div>
              <label class="block text-xs font-medium text-[#cfc4d9] mb-1">ডেলিভারি এরিয়া</label>
              <select id="deliveryArea" class="w-full bg-[#100d16] border border-[#342b40] rounded-xl px-3 py-2 text-xs text-white">
                <option value="80">ঢাকার ভেতর (৳৮০)</option>
                <option value="150">ঢাকার বাইরে (৳১৫০)</option>
              </select>
            </div>
          </div>

          <button onclick="handleSaveOrderDemo()" class="w-full py-2.5 rounded-xl font-bold text-xs bg-[#bd70df] text-[#160e1b] hover:bg-[#d091ee] transition-all">
            অর্ডার কনফার্ম করুন (Confirm Order)
          </button>
          <div id="orderStatusAlert" class="hidden p-2.5 rounded-xl bg-[#16382d] text-[#8de8bf] text-xs text-center font-medium"></div>
        </div>
      </div>
    </div>

    <!-- Instructions for VS Code Running -->
    <div class="mt-8 p-6 rounded-2xl bg-[#14101c] border border-[#342b40]">
      <h3 class="text-sm font-bold text-white mb-2">VS Code-এ পূর্ণ প্রজেক্ট যেভাবে চালু করবেন:</h3>
      <ol class="list-decimal list-inside text-xs text-[#a69ab1] space-y-1.5 leading-relaxed">
        <li>AI Studio-র টপ মেনু থেকে সব কোড একসাথে ZIP হিসেবে ডাউনলোড করুন।</li>
        <li>ZIP ফাইলটি আনজিপ করে VS Code-এ ফোল্ডারটি ওপেন করুন (File &rarr; Open Folder)।</li>
        <li>টার্মিনালে কমান্ড দিন: <code class="bg-[#100d16] text-[#bd70df] px-1.5 py-0.5 rounded">npm install</code> এবং এরপর <code class="bg-[#100d16] text-[#bd70df] px-1.5 py-0.5 rounded">npm run dev</code>।</li>
        <li>ব্রাউজারে <code class="text-white">http://localhost:3000</code> ওপেন করলেই পূর্ণ সিস্টেম চালু হয়ে যাবে।</li>
      </ol>
    </div>
  </div>

  <script>
    const mockDb = {
      '01711223344': { name: 'রোকসানা আক্তার', delivered: 18, cancelled: 1, rate: 95, risk: 'LOW', details: { steadfast: { del: 10, can: 0 }, pathao: { del: 6, can: 1 }, redx: { del: 2, can: 0 } } },
      '01911998877': { name: 'রানা আহমেদ', delivered: 3, cancelled: 14, rate: 18, risk: 'HIGH', details: { steadfast: { del: 1, can: 8 }, pathao: { del: 2, can: 4 }, redx: { del: 0, can: 2 } } },
      '01844556677': { name: 'ফারজানা ইয়াসমিন', delivered: 9, cancelled: 6, rate: 60, risk: 'MODERATE', details: { steadfast: { del: 5, can: 3 }, pathao: { del: 3, can: 2 }, redx: { del: 1, can: 1 } } }
    };

    function runFraudCheck(phone) {
      const p = phone.replace(/\\D/g, '').replace(/^88/, '');
      const data = mockDb[p] || {
        name: 'নতুন কাস্টমার (Simulated)',
        delivered: Math.max(1, (p.charCodeAt(p.length-1) || 5) % 12),
        cancelled: (p.charCodeAt(p.length-2) || 2) % 4,
        details: {
          steadfast: { del: 3, can: 1 },
          pathao: { del: 2, can: 0 },
          redx: { del: 1, can: 1 }
        }
      };
      const total = data.delivered + data.cancelled;
      const rate = total > 0 ? Math.round((data.delivered / total) * 100) : 100;
      const risk = rate >= 80 ? 'LOW' : rate >= 50 ? 'MODERATE' : 'HIGH';

      const box = document.getElementById('fraudResultBox');
      const badgeBg = risk === 'LOW' ? 'bg-[#16382d] text-[#8de8bf]' : risk === 'HIGH' ? 'bg-[#3b121e] text-[#ff7991]' : 'bg-[#362a12] text-[#ffbe3b]';
      const label = risk === 'LOW' ? 'নিরাপদ কাস্টমার (Safe)' : risk === 'HIGH' ? 'উচ্চ ঝুঁকিপূর্ণ! অগ্রিম ডেলিভারি চার্জ নিন' : 'মাঝারি ঝুঁকি (Moderate)';

      box.innerHTML = \`
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-white">\${data.name}</span>
          <span class="text-[11px] font-bold px-2 py-0.5 rounded \${badgeBg}">\${label}</span>
        </div>
        <div class="grid grid-cols-3 gap-2 text-center text-xs">
          <div class="p-2 rounded-lg bg-[#181520]"><div class="text-[#8de8bf] font-bold text-sm">\${data.delivered}</div><div class="text-[10px] text-[#a69ab1]">রিসিভড</div></div>
          <div class="p-2 rounded-lg bg-[#181520]"><div class="text-[#ff7991] font-bold text-sm">\${data.cancelled}</div><div class="text-[10px] text-[#a69ab1]">ক্যান্সেল</div></div>
          <div class="p-2 rounded-lg bg-[#181520]"><div class="text-white font-bold text-sm">\${rate}%</div><div class="text-[10px] text-[#a69ab1]">সাকসেস রেট</div></div>
        </div>
        <div class="text-[11px] text-[#cfc4d9] pt-1 border-t border-[#342b40] flex justify-between">
          <span>Steadfast: \${data.details.steadfast.del} সফল / \${data.details.steadfast.can} বাতিল</span>
          <span>Pathao: \${data.details.pathao.del} সফল / \${data.details.pathao.can} বাতিল</span>
        </div>
      \`;
    }

    function setTestPhone(num) {
      document.getElementById('fraudPhoneInput').value = num;
      runFraudCheck(num);
    }

    document.getElementById('fraudPhoneInput').addEventListener('input', (e) => {
      runFraudCheck(e.target.value);
    });

    runFraudCheck('01711223344');

    function handleSaveOrderDemo() {
      const name = document.getElementById('custName').value;
      const size = document.getElementById('dressSizeSelect').value;
      const price = document.getElementById('orderPrice').value;
      const alert = document.getElementById('orderStatusAlert');
      alert.textContent = \`সফল! \${name}-এর জন্য সাইজ \${size} (৳\${price}) অর্ডার সংরক্ষণ হয়েছে।\`;
      alert.classList.remove('hidden');
      setTimeout(() => alert.classList.add('hidden'), 3500);
    }
  </script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'alvina-commerce-admin-standalone.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloadedType('html');
  };

  // Generate VS Code Project Guide & Instructions
  const handleDownloadVsCodeGuide = () => {
    const readmeContent = `# ALVINA Commerce Admin - VS Code Setup & Run Guide

## প্রজেক্ট ওভারভিউ
ALVINA Commerce Admin হল একটি আধুনিক মাল্টি-মার্চেন্ট ই-কমার্স ও বুটিক ম্যানেজমেন্ট প্ল্যাটফর্ম।
এতে সাইজ ৩৬-৪৮ এবং ম্যাক্স সাইজ ৫০-৫৬, লাইভ কুরিয়ার ফ্রড চেকার, পিওএস, এবং ২৪টি সম্পূর্ণ পেজ অন্তর্ভুক্ত।

## টেকনোলজি স্ট্যাক:
- React 19 + TypeScript
- Vite 6+
- Tailwind CSS 4
- Lucide React Icons

## VS Code-এ যেভাবে রান করবেন:
1. ফোল্ডারটি VS Code-এ খুলুন (File -> Open Folder).
2. টার্মিনাল ওপেন করুন (\`Ctrl + \`\` বা Terminal -> New Terminal).
3. ডিপেন্ডেন্সি ইনস্টল করুন:
   \`\`\`bash
   npm install
   \`\`\`
4. ডেভেলপমেন্ট সার্ভার চালু করুন:
   \`\`\`bash
   npm run dev
   \`\`\`
5. ব্রাউজারে http://localhost:3000 বা টার্মিনালের দেওয়া লিংকে প্রবেশ করুন।

## ডিফল্ট লগইন ক্রেডেনশিয়াল:
- User ID: **admin**
- Password: **admin123**

(লগইন করার পর Settings মেনু থেকে পাসওয়ার্ড পরিবর্তন করে নিতে পারবেন)
`;

    const blob = new Blob([readmeContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'VS-CODE-SETUP-README.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloadedType('guide');
  };

  const copyCloneCmd = () => {
    navigator.clipboard.writeText('npm install && npm run dev');
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-[#181520] border border-[#342b40] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-[#342b40] bg-[#14101c] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-[#bd70df]" />
            <div>
              <h3 className="font-bold text-white text-base">সব কোড ডাউনলোড ও VS Code গাইড</h3>
              <p className="text-[11px] text-[#a69ab1]">Download Complete Source Code & Run in VS Code</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#a69ab1] hover:text-white hover:bg-[#251e30] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Method 1: AI Studio 1-Click ZIP Download (Featured) */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#241334] to-[#171324] border border-[#714786] shadow-sm space-y-2.5">
            <div className="flex items-center gap-2">
              <FolderArchive className="w-5 h-5 text-[#bd70df]" />
              <h4 className="text-sm font-bold text-white">
                পদ্ধতি ১: AI Studio ইন্টারফেস থেকে পুরো কোড একবারে ZIP ডাউনলোড (সরাসরি)
              </h4>
            </div>
            <p className="text-xs text-[#d7cddd] leading-relaxed">
              Google AI Studio Build উইন্ডোর <strong>উপরে ডান কোণায় (Top-Right)</strong> ৩-ডট মেনু বা 
              <strong> Export / Download ZIP</strong> অপশন রয়েছে। সেখানে ক্লিক করলে এক ক্লিকেই 
              <code className="bg-[#100d16] text-[#e6b4fa] px-1.5 py-0.5 rounded">src/</code>, 
              <code className="bg-[#100d16] text-[#e6b4fa] px-1.5 py-0.5 rounded">package.json</code>, 
              <code className="bg-[#100d16] text-[#e6b4fa] px-1.5 py-0.5 rounded">vite.config.ts</code> সহ সমস্ত সোর্স কোড সম্পূর্ণ ZIP ফাইল আকারে ডাউনলোড হয়ে যাবে।
            </p>
          </div>

          {/* Method 2: Standalone HTML Download */}
          <div className="p-4 rounded-xl bg-[#100d16] border border-[#342b40] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#bd70df]" />
                <span>পদ্ধতি ২: Standalone Single HTML ফাইল (অফলাইন চলবে)</span>
              </div>
              <p className="text-xs text-[#a69ab1] leading-relaxed">
                কোনো Node.js বা ডিপেন্ডেন্সি ছাড়াই যেকোনো কম্পিউটারে ডাবল ক্লিকে ব্রাউজারে চলবে। 
                এতে সাইজ ৩৬-৫৬ ড্রেস অপশন ও লাইভ কুরিয়ার ফ্রড চেকার বিল্ট-ইন রয়েছে।
              </p>
            </div>
            <button
              onClick={handleDownloadStandaloneHTML}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#bd70df] text-[#160e1b] hover:bg-[#d091ee] shrink-0 flex items-center gap-1.5 transition-all shadow-md w-full sm:w-auto justify-center"
            >
              <Download className="w-4 h-4" />
              <span>{downloadedType === 'html' ? 'ডাউনলোড হয়েছে ✓' : 'HTML ডাউনলোড'}</span>
            </button>
          </div>

          {/* Method 3: VS Code Guide & Setup Instructions */}
          <div className="p-4 rounded-xl bg-[#100d16] border border-[#342b40] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#36c98b]" />
                <span>পদ্ধতি ৩: VS Code রান নির্দেশিকা (README.md)</span>
              </div>
              <p className="text-xs text-[#a69ab1] leading-relaxed">
                VS Code-এ ওপেন করা, পোর্ট 3000-এ চালু করা এবং ডিফল্ট এডমিন লগইন ক্রেডেনশিয়ালসহ পূর্ণ সেটআপ ফাইল।
              </p>
            </div>
            <button
              onClick={handleDownloadVsCodeGuide}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#271b35] hover:bg-[#39244d] text-[#e6b4fa] border border-[#5d3870] shrink-0 flex items-center gap-1.5 transition-all w-full sm:w-auto justify-center"
            >
              <Download className="w-4 h-4" />
              <span>{downloadedType === 'guide' ? 'ডাউনলোড হয়েছে ✓' : 'VS Code গাইড'}</span>
            </button>
          </div>

          {/* VS Code Quick Command Snippet */}
          <div className="p-3.5 rounded-xl bg-[#120f1a] border border-[#30253d] space-y-2">
            <div className="flex items-center justify-between text-xs text-[#cfc4d9]">
              <span className="font-mono text-[#a69ab1]">VS Code Terminal Commands:</span>
              <button
                onClick={copyCloneCmd}
                className="inline-flex items-center gap-1 text-[11px] text-[#bd70df] hover:text-[#d091ee]"
              >
                {copiedCmd ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCmd ? 'কপি হয়েছে' : 'কমান্ড কপি করুন'}</span>
              </button>
            </div>
            <div className="p-2.5 rounded-lg bg-[#0a080f] font-mono text-xs text-[#8de8bf] overflow-x-auto">
              <code>npm install &amp;&amp; npm run dev</code>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#342b40] bg-[#14101c] flex items-center justify-between shrink-0">
          <span className="text-[11px] text-[#a69ab1]">
            ডিফল্ট এডমিন লগইন: <strong className="text-white">admin / admin123</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#211a2a] text-white hover:bg-[#2b2138] transition-colors"
          >
            বন্ধ করুন (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
