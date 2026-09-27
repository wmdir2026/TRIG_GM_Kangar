import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Lock,
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
  const [errorMsg, setErrorMsg] = useState('');

  const handleManualLogin = (e) => {
    e.preventDefault();
    const found = users.find(u =>
      (u.username.toLowerCase() === username.trim().toLowerCase() || u.email.toLowerCase() === username.trim().toLowerCase()) &&
      u.password === password.trim()
    );

    if (found) {
      switchUser(found.role);
      if (onLoginSuccess) onLoginSuccess();
    } else {
      setErrorMsg('Username atau kata laluan tidak sah. Sila guna akaun demo di bawah.');
    }
  };

  const handleQuickDemoLogin = (roleName) => {
    switchUser(roleName);
    if (onLoginSuccess) onLoginSuccess();
  };

  const demoAccounts = [
    { role: 'SUPER ADMIN', user: 'admin', pass: 'admin123', label: 'Wan Muhadir (Super Admin)', color: 'bg-purple-600 hover:bg-purple-700' },
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
                src="/logo.png"
                alt="GIATMARA Malaysia"
                className="h-16 sm:h-20 w-auto object-contain"
              />
            </div>
            <div>
              <span className="px-2.5 py-1 rounded-full bg-white/10 text-amber-300 text-[10px] font-extrabold uppercase tracking-wider">
                Program Keusahawanan TRIG
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-2">
                TRIG GIATMARA KANGAR
              </h1>
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
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono"
                  />
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
                  onClick={() => handleQuickDemoLogin(demo.user)}
                  className={`p-2 rounded-xl text-white font-bold text-left transition shadow-xs flex flex-col justify-between ${demo.color}`}
                >
                  <span className="text-[9px] opacity-90 uppercase font-black">{demo.role}</span>
                  <span className="text-[10px] truncate font-bold">{demo.label}</span>
                  <span className="text-[9px] opacity-75 font-mono">{demo.user} / {demo.pass}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
