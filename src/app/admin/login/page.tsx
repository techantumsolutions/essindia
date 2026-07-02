'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Monitor, 
  Lock, 
  User, 
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Eye,
  EyeOff
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate auth
    setTimeout(() => {
      const form = e.target as HTMLFormElement;
      const username = (form.elements.namedItem('username') as HTMLInputElement).value;
      const password = (form.elements.namedItem('password') as HTMLInputElement).value;

      if (username === 'admin@essindia.com' && password === 'admin123') {
        // Set mock session cookie for middleware
        document.cookie = "mock-admin-session=true; path=/; max-age=604800; SameSite=Lax";
        setIsLoading(false);
        router.push('/admin/dashboard');
      } else {
        setError('Invalid credentials. Please try again.');
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#4B2A63] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-400/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/10 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        {/* Brand Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 mb-6 shadow-2xl">
            <Monitor className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Admin Portal</h1>
          <p className="text-white/50 font-medium mt-2">ESS India Enterprise Suite</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-[32px] p-8 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.4)] border border-white/10">
          <form onSubmit={handleLogin} className="space-y-6">
            
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-rose-50 border border-rose-100 text-rose-600 px-4 py-3 rounded-xl text-[13px] font-bold text-center"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Account ID</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#4B2A63] transition-colors" />
                <input 
                  name="username"
                  type="email" 
                  placeholder="admin@essindia.com"
                  required
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-[#4B2A63]/10 focus:bg-white focus:ring-4 focus:ring-[#4B2A63]/5 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-slate-900 transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Passkey</label>
                <button type="button" className="text-[11px] font-bold text-[#4B2A63] hover:underline">Forgot?</button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#4B2A63] transition-colors" />
                <input 
                  name="password"
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  required
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-[#4B2A63]/10 focus:bg-white focus:ring-4 focus:ring-[#4B2A63]/5 rounded-2xl pl-12 pr-12 py-4 text-sm font-bold text-slate-900 transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#4B2A63] transition-colors focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#4B2A63] hover:bg-[#3B198F] text-white rounded-2xl h-14 font-bold text-[16px] shadow-xl shadow-[#4B2A63]/20 transition-all hover:scale-[1.02] active:scale-[0.98] mt-4 gap-3 cursor-pointer"
            >
              {isLoading ? (
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <RotateCcw className="w-5 h-5" />
                </motion.div>
              ) : (
                <>
                  Secure Access
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </form>

          {/* Footer Info */}
          <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-center gap-2 text-slate-400">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[12px] font-medium tracking-tight">Enterprise Grade Security Enabled</span>
          </div>
        </div>

        {/* Demo Hint */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-white/30 text-[11px] mt-8 font-medium uppercase tracking-[0.2em]"
        >
          Protected by ESS Global Security Services
        </motion.p>
      </motion.div>
    </div>
  );
}
