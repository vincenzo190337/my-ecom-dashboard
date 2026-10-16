import React, { useState, useEffect } from 'react';
import { Lock, User, ArrowRight, Sparkles } from 'lucide-react';

interface LoginViewProps {
  onLogin: (user: string, pass: string) => boolean;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showSplash, setShowSplash] = useState(true);

  // Elegant visual intro animation: ALVINA emblem floating in with glowing aura
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1400);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = onLogin(user.trim(), password);
    if (!success) {
      setError('User ID অথবা Password ভুল হয়েছে। অনুগ্রহ করে সঠিক তথ্য দিন।');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#0c0912] via-[#160f21] to-[#0d0a14] relative overflow-hidden select-none">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-[#bd70df]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-[#60277d]/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Floating Logo Splash Screen */}
      {showSplash ? (
        <div className="flex flex-col items-center justify-center space-y-5 animate-in fade-in duration-500 z-50">
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#69298a] via-[#bd70df] to-[#f4b8ff] p-0.5 shadow-2xl shadow-[#bd70df]/40 animate-pulse">
              <div className="w-full h-full bg-[#160e22] rounded-[22px] flex items-center justify-center border border-[#e6b4fa]/30">
                <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-[#f3d4ff] to-[#bd70df] font-['Plus_Jakarta_Sans'] tracking-wider">
                  A
                </span>
              </div>
            </div>
            {/* Pulsating ring */}
            <div className="absolute -inset-3 rounded-3xl border border-[#bd70df]/40 animate-ping pointer-events-none opacity-40" />
          </div>

          <div className="text-center space-y-1">
            <h1 className="text-3xl font-extrabold tracking-widest text-white font-['Plus_Jakarta_Sans'] drop-shadow-md">
              ALVINA
            </h1>
            <p className="text-xs uppercase tracking-[0.28em] text-[#d99ff5] font-semibold">
              Boutique & Fashion Commerce
            </p>
          </div>

          <div className="flex items-center gap-1.5 pt-2">
            <span className="w-2 h-2 rounded-full bg-[#bd70df] animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 rounded-full bg-[#bd70df] animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 rounded-full bg-[#bd70df] animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      ) : (
        /* Real Authentic Login Card */
        <div className="relative w-full max-w-md bg-[#16111f]/95 backdrop-blur-2xl border border-[#403052] rounded-3xl p-8 sm:p-9 shadow-2xl shadow-black/80 animate-in fade-in zoom-in-95 duration-500 z-10">
          {/* Logo on top of Card */}
          <div className="text-center mb-7">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#69298a] to-[#bd70df] p-0.5 shadow-lg shadow-[#bd70df]/30 mb-3.5">
              <div className="w-full h-full bg-[#140e1d] rounded-[14px] flex items-center justify-center">
                <span className="text-2xl font-bold text-white font-['Plus_Jakarta_Sans']">A</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl font-bold tracking-tight text-white font-['Plus_Jakarta_Sans']">
                ALVINA
              </span>
              <span className="text-2xl font-bold text-[#bd70df] font-['Plus_Jakarta_Sans']">
                ADMIN
              </span>
            </div>
            <p className="text-xs font-semibold text-[#bd70df] tracking-wider uppercase mt-1">
              Store Management Portal
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-[#351822] border border-[#6b2a3a] text-xs text-[#ff9aaa] font-medium text-center animate-in shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#cfc4d9] mb-1.5">ইউজার আইডি / ইমেইল</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#a69ab1] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  autoFocus
                  autoComplete="username"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  placeholder="admin (বা আপনার ইউজারনেম)"
                  className="w-full pl-10 pr-3.5 py-3 bg-[#100c17] border border-[#3f314f] rounded-xl text-xs sm:text-sm text-white placeholder:text-[#6e637a] focus:border-[#bd70df] focus:ring-1 focus:ring-[#bd70df] outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#cfc4d9] mb-1.5">পাসওয়ার্ড</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#a69ab1] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="পাসওয়ার্ড লিখুন..."
                  className="w-full pl-10 pr-3.5 py-3 bg-[#100c17] border border-[#3f314f] rounded-xl text-xs sm:text-sm text-white placeholder:text-[#6e637a] focus:border-[#bd70df] focus:ring-1 focus:ring-[#bd70df] outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-[#a855d0] to-[#bd70df] text-[#120b17] hover:from-[#ba6ee0] hover:to-[#ce85ee] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#bd70df]/25 cursor-pointer active:scale-[0.98] mt-2"
            >
              <span>লগইন করুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
