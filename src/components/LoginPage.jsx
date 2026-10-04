import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import giatmaraLogo from '../assets/logo.png';
import {
  Lock,
  Eye,
  EyeOff,
  User,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Coffee,
  Smartphone,
  CheckCircle2
} from 'lucide-react';

export const LoginPage = ({ onLoginSuccess }) => {
  const { users, switchUser, showToast } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleManualLogin = (e) => {
    e.preventDefault();
    const trimmedUser = username.trim().toLowerCase();
    const trimmedPass = password.trim();

    const found = users.find(u =>
      (u.username.toLowerCase() === trimmedUser || u.email.toLowerCase() === trimmedUser)
    );

    if (!found) {
      setErrorMsg('Username atau e-mel tidak sah.');
      return;
    }

    if (found.role === 'SUPER ADMIN' || found.username === 'admin') {
      const activePass = found.password || '095059';
      const isMatch = (trimmedPass === '095059') || (activePass !== 'admin123' && trimmedPass === activePass);
      if (trimmedUser === 'admin' && isMatch) {
        setErrorMsg('');
        switchUser(found.role, trimmedPass, true);
        if (onLoginSuccess) onLoginSuccess();
      } else {
        setErrorMsg('Kata laluan tidak sah untuk akaun Super Admin! Sila pastikan password adalah 095059 atau kata laluan baharu anda.');
      }
      return;
    }

    if (found.password === trimmedPass) {
      setErrorMsg('');
      switchUser(found.role);
      if (onLoginSuccess) onLoginSuccess();
    } else {
      setErrorMsg('Username atau kata laluan tidak sah. Sila guna akaun demo di bawah.');
    }
  };

  const handleQuickDemoLogin = (demo) => {
    if (demo.role === 'SUPER ADMIN' || demo.user === 'admin') {
      setUsername('admin');
      setPassword('');
      setErrorMsg('Akaun Super Admin memerlukan kata laluan (Password: 095059). Sila masukkan kata laluan di ruangan atas untuk log masuk.');
      return;
    }
    switchUser(demo.role);
    if (onLoginSuccess) onLoginSuccess();
  };

  const demoAccounts = [
    { role: 'SUPER ADMIN', user: 'admin', pass: '095059', label: 'Wan Muhadir (Super Admin)', color: 'bg-purple-600 hover:bg-purple-700' },
    { role: 'MANAGER CAFE', user: 'manager_cafe', pass: 'manager123', label: 'Muhammad Aizat (Pengurus Operasi)', color: 'bg-blue-600 hover:bg-blue-700' },
    { role: 'CAFE STAFF', user: 'cafe', pass: 'cafe123', label: 'Chef Nur Atiqah, Chef Aizat & Pelatih Masakan', color: 'bg-amber-600 hover:bg-amber-700' },
    { role: 'CAFE CASHIER', user: 'cashier_cafe', pass: 'cashier123', label: 'NUR Atiqah (Juruwang Cafe)', color: 'bg-emerald-600 hover:bg-emerald-700' },
    { role: 'MANAGER SMARTPHONE REPAIR', user: 'manager_repair', pass: 'manager123', label: 'En. Mohd Rizwan (Pengurus Operasi)', color: 'bg-indigo-600 hover:bg-indigo-700' },
    { role: 'REPAIR STAFF', user: 'repair', pass: 'repair123', label: 'Muhammad Faiz (Teknikal Smartphone)', color: 'bg-cyan-600 hover:bg-cyan-700' },
    { role: 'SMARTPHONE CASHIER', user: 'cashier_repair', pass: 'cashier123', label: 'Mohd Nabil (Juruwang Smartphone)', color: 'bg-teal-600 hover:bg-teal-700' },
    { role: 'CUSTOMER', user: 'pelanggan', pass: 'customer123', label: 'ROSYITA (Pelanggan Umum)', color: 'bg-slate-700 hover:bg-slate-800' }
  ];

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-fade-in">
        
        {/* Left Side: Brand & Visual */}
        <div className="bg-linear-to-br from-indigo-950 via-slate-900 to-blue-950 p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <div className="bg-white p-3 rounded-2xl inline-block shadow-lg">
              <img
                src={giatmaraLogo}
                alt="GIATMARA Malaysia"
                className="h-16 sm:h-20 w-auto object-contain"
                onError={(e) => { e.currentTarget.src = './logo.png'; }}
              />
            </div>
            <div>
              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-extrabold uppercase tracking-wider border border-amber-500/30">
                Program Keusahawanan TRIG
              </span>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-amber-400 font-['Cabinet_Grotesk',sans-serif] mt-2">
                TECHBYTE & FELÌCE CAFFÉ
              </h1>
              <p className="text-sm font-extrabold text-white tracking-wide">
                TRIG GIATMARA KANGAR
              </p>
              <p className="text-indigo-200 text-xs mt-1">
                Digital Business Management System
              </p>
            </div>

            <div className="space-y-3 pt-6 text-xs text-slate-300">
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10">
                <Coffee className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>1. Kursus Masakan: Café, QR Table, Kitchen Display & POS</span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10">
                <Smartphone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>2. Kursus Baiki Smartphone: Job REP, Diagnosis, Spare Parts & POS</span>
              </div>
            </div>
          </div>

          <div className="pt-6 relative z-10 text-[11px] text-slate-400 border-t border-slate-800 flex justify-between items-center">
            <span>© GIATMARA Kangar, Perlis</span>
            <span className="font-bold text-amber-400">Versi 2.6 Pro</span>
          </div>
        </div>

        {/* Right Side: Login Form & One-Click Demo Accounts */}
        <div className="p-8 flex flex-col justify-between space-y-6 text-xs">
          
          <div>
            <h2 className="text-lg font-black text-slate-900">Log Masuk Pengguna</h2>
            <p className="text-slate-500 text-xs mt-0.5">
              Sila masukkan kelayakan akaun atau pilih satu akaun demo di bawah:
            </p>

            {errorMsg && (
              <div className="p-3 my-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleManualLogin} className="space-y-3.5 mt-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Username / E-mel</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin / manager_cafe / cafe / repair / pelanggan"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Kata Laluan</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-1 cursor-pointer"
                    title={showPassword ? "Sembunyi kata laluan" : "Lihat kata laluan"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-md"
              >
                <span>LOG MASUK SISTEM</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* One Click Fast Switch Demo Accounts */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <span className="font-black text-[10px] uppercase tracking-wider text-slate-400 block">
              Akaun Demonstrasi Pantas (1-Click Demo Login):
            </span>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {demoAccounts.map(demo => (
                <button
                  key={demo.role}
                  type="button"
                  onClick={() => handleQuickDemoLogin(demo)}
                  className={`p-2 rounded-xl text-white font-bold text-left transition shadow-xs flex flex-col justify-between ${demo.color}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] opacity-90 uppercase font-black">{demo.role}</span>
                    {demo.role === 'SUPER ADMIN' && (
                      <span className="text-[8px] bg-red-950/80 px-1.5 py-0.5 rounded font-black border border-red-400/50">
                        🔒 KUNCI
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] truncate font-bold">{demo.label}</span>
                  <span className="text-[9px] opacity-75 font-mono">
                    {demo.role === 'SUPER ADMIN' ? `${demo.user} / (Perlu Password)` : `${demo.user} / ${demo.pass}`}
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
