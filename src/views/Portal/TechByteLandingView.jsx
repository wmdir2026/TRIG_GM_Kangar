import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import giatmaraLogo from '../../assets/logo.png';
import woodSignImg from '../../assets/landing/techbyte_wood_sign.jpg';
import cardPastaImg from '../../assets/landing/card_masakan_itali.jpg';
import cardRepairImg from '../../assets/landing/card_baiki_smartphone.jpg';
import cardInfoImg from '../../assets/landing/card_jom_makan.jpg';
import ambientBgImg from '../../assets/landing/cafe_ambient_bg.jpg';

import {
  UtensilsCrossed,
  Wrench,
  ShieldCheck,
  Lock,
  UserCheck,
  ArrowRight,
  Sparkles,
  Coffee,
  Smartphone,
  Tablet,
  ChevronRight,
  Info,
  X,
  Users,
  LogOut,
  ExternalLink
} from 'lucide-react';

export const TechByteLandingView = () => {
  const {
    setCurrentTab,
    switchSystemMode,
    currentUser,
    setCurrentUser,
    switchUser,
    users,
    showToast,
    isStaffLoggedIn,
    setIsStaffLoggedIn,
    logoutStaff
  } = useApp();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [customUsername, setCustomUsername] = useState('');
  const [customPassword, setCustomPassword] = useState('');

  // Handle direct navigation to Customer Cafe Food Ordering (PELANGGAN)
  const handleGoToCustomerCafe = () => {
    setIsStaffLoggedIn(false);
    const customerUser = (users || []).find(u => u.role === 'CUSTOMER') || {
      id: "USR-008",
      name: "ROSYITA (Pelanggan Umum)",
      role: "CUSTOMER",
      email: "rosyita.customer@gmail.com"
    };
    if (typeof setCurrentUser === 'function') {
      setCurrentUser(customerUser);
    }
    setCurrentTab('customer-order');
    showToast('Selamat datang ke Menu Tempahan Makanan Café TechByte & Pasta!', 'info');
  };

  // Handle direct navigation to Customer Smartphone Repair Tracker (PELANGGAN)
  const handleGoToCustomerRepair = () => {
    setIsStaffLoggedIn(false);
    const customerUser = (users || []).find(u => u.role === 'CUSTOMER') || {
      id: "USR-008",
      name: "ROSYITA (Pelanggan Umum)",
      role: "CUSTOMER",
      email: "rosyita.customer@gmail.com"
    };
    if (typeof setCurrentUser === 'function') {
      setCurrentUser(customerUser);
    }
    setCurrentTab('customer-repair-tracker');
    showToast('Selamat datang ke Portal Semakan & Servis Baiki Smartphone!', 'info');
  };

  // Handle Login select (ADMIN / STAF)
  const handleSelectUser = (user) => {
    setIsStaffLoggedIn(true);
    switchUser(user.id);
    setIsLoginModalOpen(false);
    switchSystemMode('PORTAL');
    showToast(`Log masuk berjaya! Selamat datang ${user.name} (${user.role}).`, 'success');
  };

  // Handle manual login
  const handleManualLogin = (e) => {
    e.preventDefault();
    const found = (users || []).find(
      u => u.username.toLowerCase() === customUsername.trim().toLowerCase() &&
           u.password === customPassword.trim()
    );

    if (found) {
      handleSelectUser(found);
    } else {
      showToast('Nama pengguna atau kata laluan tidak sah!', 'error');
    }
  };

  return (
    <div className="relative min-h-[90vh] -mt-4 sm:-mt-6 lg:-mt-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex flex-col justify-between overflow-hidden bg-cover bg-center text-white"
         style={{ backgroundImage: `url(${ambientBgImg})` }}
    >
      {/* Dark Ambient Overlays & Warm Lights */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950/85 via-black/75 to-stone-950/90 pointer-events-none" />
      <div className="absolute -top-32 left-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-32 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content Wrapper */}
      <div className="relative z-10 max-w-7xl mx-auto w-full space-y-8 sm:space-y-10">

        {/* ========================================================================= */}
        {/* TOP HEADER SECTION: GIATMARA LOGO | WOODEN SIGNBOARD | LOGIN ADMIN BUTTON */}
        {/* ========================================================================= */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-6 pb-2">
          
          {/* Left: Original GIATMARA Malaysia Logo Card */}
          <div className="flex flex-col items-center md:items-start shrink-0">
            <div className="bg-white px-4 py-2.5 rounded-2xl shadow-2xl border-2 border-white/80 inline-flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
              <img
                src={giatmaraLogo}
                alt="GIATMARA Malaysia Original Logo"
                className="h-12 sm:h-14 w-auto object-contain"
                onError={(e) => { e.currentTarget.src = './logo.png'; }}
              />
            </div>
            <div className="mt-2 text-center md:text-left">
              <span className="font-black text-sm sm:text-base tracking-widest text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                GIATMARA KANGAR
              </span>
              <p className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                Perlis, Malaysia
              </p>
            </div>
          </div>

          {/* Center: Iconic Wooden Banner Signboard & Tagline Pill */}
          <div className="flex flex-col items-center text-center max-w-xl mx-auto">
            <div className="relative group transform hover:scale-[1.02] transition-transform duration-300">
              <img
                src={woodSignImg}
                alt="TECHBYTE & PASTA CAFE"
                className="w-full max-w-[480px] sm:max-w-[540px] h-auto object-contain rounded-2xl shadow-2xl drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
              />
            </div>
            
            {/* Tagline Pill Bar */}
            <div className="mt-3 inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-5 py-2 rounded-full bg-stone-950/90 border border-amber-500/40 shadow-xl backdrop-blur-md text-[11px] sm:text-xs font-black tracking-wider text-amber-300 uppercase">
              <span>MAKAN</span>
              <span className="text-white/40">•</span>
              <span>MINUM</span>
              <span className="text-white/40">•</span>
              <span className="text-cyan-400">BAIKPULIH</span>
              <span className="text-white/40">•</span>
              <span>SANTAI</span>
              <span className="text-white/40">•</span>
              <span>SEMBANG</span>
              <span className="text-white/40">•</span>
              <span className="text-emerald-400">PLAN DIRI ANDA</span>
            </div>
          </div>

          {/* Right: Circular LOGIN ADMIN Button (Matching uploaded image) */}
          <div className="flex flex-col items-center md:items-end shrink-0">
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="group relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-b from-blue-700 via-blue-900 to-[#071630] border-3 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.6)] hover:shadow-[0_0_35px_rgba(6,182,212,0.9)] hover:scale-105 active:scale-95 transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer p-2 overflow-hidden"
              title="Klik untuk Log Masuk Staf / Pentadbiran (Super Admin, Manager Cafe, Staf Masakan, Juruwang, Manager Repair, Staf Teknikal)"
            >
              {/* Subtle inner pulse / light beam */}
              <div className="absolute inset-0 bg-gradient-to-t from-cyan-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              {/* User + Padlock Icon */}
              <div className="relative mb-1">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white border border-white/40 shadow-inner group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-5 h-5 text-cyan-300" />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-amber-400 text-stone-950 p-0.5 rounded-full shadow-xs">
                  <Lock className="w-2.5 h-2.5" />
                </div>
              </div>

              {/* Text: LOGIN ADMIN */}
              <span className="font-black text-xs sm:text-sm tracking-wider text-white leading-none">
                LOGIN
              </span>
              <span className="font-extrabold text-[9px] sm:text-[10px] tracking-widest text-cyan-300 uppercase leading-tight mt-0.5">
                ADMIN / STAF
              </span>
            </button>

            {/* Current logged-in status hint (Hanya jika admin/staf sedang log masuk) */}
            {isStaffLoggedIn && currentUser && (
              <div className="mt-2 text-center md:text-right">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-black/60 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {currentUser?.name?.split(' ')[0]} ({currentUser?.role})
                </span>
                <div className="mt-1 flex items-center gap-2 justify-center md:justify-end">
                  <button
                    onClick={() => switchSystemMode('PORTAL')}
                    className="text-[10px] text-cyan-300 hover:text-cyan-200 underline font-black cursor-pointer"
                  >
                    Platform Staf →
                  </button>
                  <span className="text-white/30">•</span>
                  <button
                    onClick={logoutStaff}
                    className="text-[10px] text-rose-400 hover:text-rose-300 underline font-black cursor-pointer"
                  >
                    Log Keluar
                  </button>
                </div>
              </div>
            )}
          </div>

        </header>


        {/* ========================================================================= */}
        {/* 3 MAIN INTERACTIVE DISPLAY CARDS (EXACT REPLICATION) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch pt-2">
          
          {/* --------------------------------------------------------------------- */}
          {/* CARD 1 (LEFT): MASAKAN ITALI — KLIK TERUS KE PESANAN MAKANAN PELANGGAN */}
          {/* --------------------------------------------------------------------- */}
          <div
            onClick={handleGoToCustomerCafe}
            className="group relative rounded-3xl overflow-hidden border-2 border-amber-500/80 shadow-[0_0_30px_rgba(245,158,11,0.35)] hover:shadow-[0_0_45px_rgba(245,158,11,0.7)] hover:border-amber-400 transition-all duration-300 cursor-pointer transform hover:-translate-y-2 flex flex-col justify-between bg-stone-950/60"
            role="button"
            tabIndex={0}
            title="Klik untuk membuka menu pesanan makanan Itali, Dine-in & Takeaway"
          >
            {/* Image Artwork from uploaded design */}
            <div className="relative overflow-hidden w-full">
              <img
                src={cardPastaImg}
                alt="Masakan Itali TechByte Cafe"
                className="w-full h-auto object-cover transform group-hover:scale-[1.04] transition-transform duration-500"
              />
              {/* Subtle hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Click Action Indicator Banner */}
            <div className="p-4 bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-stone-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4" />
                <span>Pesan Makanan Itali (Klik Sini)</span>
              </div>
              <div className="w-7 h-7 rounded-full bg-stone-950 text-amber-400 flex items-center justify-center font-black group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>


          {/* --------------------------------------------------------------------- */}
          {/* CARD 2 (CENTER): BAIKPULIH TELEFON BIMBIT — KLIK KE SEMAKAN / BAIKI */}
          {/* --------------------------------------------------------------------- */}
          <div
            onClick={handleGoToCustomerRepair}
            className="group relative rounded-3xl overflow-hidden border-2 border-cyan-400/80 shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_45px_rgba(6,182,212,0.8)] hover:border-cyan-300 transition-all duration-300 cursor-pointer transform hover:-translate-y-2 flex flex-col justify-between bg-slate-950/60"
            role="button"
            tabIndex={0}
            title="Klik untuk menyemak status pembaikan peranti telefon atau daftar servis"
          >
            {/* Image Artwork from uploaded design */}
            <div className="relative overflow-hidden w-full">
              <img
                src={cardRepairImg}
                alt="Baikpulih Telefon Bimbit TechByte"
                className="w-full h-auto object-cover transform group-hover:scale-[1.04] transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Click Action Indicator Banner */}
            <div className="p-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 text-stone-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-2 text-white">
                <Wrench className="w-4 h-4 text-cyan-300" />
                <span className="text-white">Baiki & Semak Telefon (Klik Sini)</span>
              </div>
              <div className="w-7 h-7 rounded-full bg-white text-blue-900 flex items-center justify-center font-black group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>


          {/* --------------------------------------------------------------------- */}
          {/* CARD 3 (RIGHT): JOM MAKAN MINUM SAMBIL MEMBAIKI TELEFON ANDA */}
          {/* --------------------------------------------------------------------- */}
          <div className="group relative rounded-3xl overflow-hidden border-2 border-amber-500/80 shadow-[0_0_30px_rgba(245,158,11,0.35)] hover:shadow-[0_0_45px_rgba(245,158,11,0.7)] hover:border-amber-400 transition-all duration-300 flex flex-col justify-between bg-stone-950/60">
            
            {/* Image Artwork from uploaded design */}
            <div className="relative overflow-hidden w-full">
              <img
                src={cardInfoImg}
                alt="Jom Makan Minum Sambil Membaiki Telefon Anda"
                className="w-full h-auto object-cover transform group-hover:scale-[1.03] transition-transform duration-500"
              />
            </div>

            {/* Dual Quick Action Buttons at the bottom */}
            <div className="p-3 bg-stone-950/95 border-t border-amber-500/40 grid grid-cols-2 gap-2">
              <button
                onClick={handleGoToCustomerCafe}
                className="px-3 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-stone-950 font-black text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-1.5 transition-transform hover:scale-102"
              >
                <span>🍝</span>
                <span>Pesan Makan</span>
              </button>
              <button
                onClick={handleGoToCustomerRepair}
                className="px-3 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-stone-950 font-black text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-1.5 transition-transform hover:scale-102"
              >
                <span>📱</span>
                <span>Baiki Telefon</span>
              </button>
            </div>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* ANDROID APPS SHOWCASE: PHONE (PELANGGAN) & TAB (PEKERJA / PELAYAN) */}
        {/* ========================================================================= */}
        <div className="bg-stone-950/85 backdrop-blur-md rounded-3xl border border-amber-500/30 p-5 sm:p-6 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-stone-800 pb-3">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40 shrink-0">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-wide">
                  Aplikasi Mudah Alih Android (Real-Time Cloud Sync)
                </h3>
                <p className="text-xs text-slate-400">
                  Dua aplikasi diselaraskan secara langsung melalui rangkaian awam GitHub Pages
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>MQTT Real-Time Connected</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* APP 1: ANDROID PHONE UNTUK PELANGGAN */}
            <div
              onClick={() => setCurrentTab('customer-phone-app')}
              className="bg-slate-900/90 rounded-2xl p-4 border border-amber-500/40 hover:border-amber-400 transition-all hover:scale-[1.01] cursor-pointer group shadow-lg flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                    ANDROID PHONE • PELANGGAN
                  </span>
                  <span className="text-xs text-amber-400 font-mono font-bold">?app=customer</span>
                </div>
                <h4 className="text-base font-black text-white group-hover:text-amber-400 transition">
                  Aplikasi Pelanggan (Android Phone)
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Pelanggan boleh mengimbas QR kod meja atau memilih nombor meja, memesan makanan & minuman, membuat bayaran DuitNow QR, serta menjejaki status masakan dapur secara langsung dengan kunci pembatalan automatik.
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <span className="text-xs font-black text-amber-400 flex items-center gap-1">
                  <span>Buka Apps Pelanggan</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="text-[10px] text-slate-500 font-bold">Responsif Skrin Telefon</span>
              </div>
            </div>

            {/* APP 2: ANDROID TAB UNTUK PEKERJA / PELAYAN */}
            <div
              onClick={() => setCurrentTab('waiter-tablet-app')}
              className="bg-slate-900/90 rounded-2xl p-4 border border-indigo-500/40 hover:border-indigo-400 transition-all hover:scale-[1.01] cursor-pointer group shadow-lg flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500 text-white text-[10px] font-black uppercase tracking-wider">
                    ANDROID TAB • PELAYAN
                  </span>
                  <span className="text-xs text-indigo-400 font-mono font-bold">?app=waiter</span>
                </div>
                <h4 className="text-base font-black text-white group-hover:text-indigo-400 transition">
                  Aplikasi Pelayan / Tablet (Android Tab)
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Direka khas untuk kru pelayan mengambil pesanan terus di meja pelanggan menggunakan skrin tablet 3-zon: Peta visual meja, papan sentuh menu pantas, penghantaran tiket dapur serta kutipan bayaran tunai / QR.
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <span className="text-xs font-black text-indigo-400 flex items-center gap-1">
                  <span>Buka Apps Pelayan</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="text-[10px] text-slate-500 font-bold">Format Skrin Lebar Tablet</span>
              </div>
            </div>

          </div>
        </div>

      </div>


      {/* ========================================================================= */}
      {/* STAFF / ADMIN LOGIN MODAL */}
      {/* ========================================================================= */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative space-y-6 text-white max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Header */}
            <div className="text-center space-y-3">
              <div className="bg-white p-3 rounded-2xl shadow-xl inline-flex items-center justify-center mx-auto">
                <img
                  src={giatmaraLogo}
                  alt="GIATMARA Malaysia"
                  className="h-12 w-auto object-contain"
                  onError={(e) => { e.currentTarget.src = './logo.png'; }}
                />
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Log Masuk Pengurusan & Staf Operasi
              </h2>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Sila pilih akaun staf bertugas atau masukkan nama pengguna untuk membuka menu pengurusan dalaman mengikut peranan masing-masing:
              </p>
            </div>

            {/* Quick 1-Click Role Login Cards */}
            <div className="space-y-3">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 block">
                Pilih Akaun Staf (1-Klik untuk Ujian / Demonstrasi):
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(users || []).map((u) => {
                  const isSuperAdmin = u.role === 'SUPER ADMIN';
                  const isCafe = u.role.includes('CAFE');
                  const isRepair = u.role.includes('REPAIR') || u.role.includes('SMARTPHONE');

                  return (
                    <button
                      key={u.id}
                      onClick={() => handleSelectUser(u)}
                      className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-3 hover:scale-[1.02] cursor-pointer ${
                        isSuperAdmin
                          ? 'bg-gradient-to-r from-red-950/60 to-slate-900 border-red-500/50 hover:border-red-400'
                          : isCafe
                          ? 'bg-gradient-to-r from-amber-950/60 to-slate-900 border-amber-500/50 hover:border-amber-400'
                          : isRepair
                          ? 'bg-gradient-to-r from-blue-950/60 to-slate-900 border-cyan-500/50 hover:border-cyan-400'
                          : 'bg-slate-800 border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/20 flex items-center justify-center overflow-hidden shrink-0 text-lg">
                        {isSuperAdmin ? '👑' : isCafe ? '☕' : '📱'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-extrabold text-xs text-white truncate">
                          {u.name}
                        </h4>
                        <span className={`text-[10px] font-black uppercase block ${
                          isSuperAdmin ? 'text-red-400' : isCafe ? 'text-amber-400' : 'text-cyan-400'
                        }`}>
                          {u.role}
                        </span>
                        <span className="text-[9px] text-slate-400 block truncate">
                          {isSuperAdmin
                            ? 'Akses Semua 3 Modul (Unlimit)'
                            : isCafe
                            ? 'Akses Modul Pengurusan Café'
                            : 'Akses Modul Baiki Smartphone'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Manual Form Login */}
            <div className="border-t border-slate-800 pt-4">
              <span className="text-[11px] font-bold text-slate-400 block mb-2">
                Atau log masuk menggunakan Nama Pengguna:
              </span>
              <form onSubmit={handleManualLogin} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Nama Pengguna (cth: admin, cafe, repair)"
                    value={customUsername}
                    onChange={(e) => setCustomUsername(e.target.value)}
                    className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white outline-none focus:border-amber-400"
                  />
                  <input
                    type="password"
                    placeholder="Kata Laluan"
                    value={customPassword}
                    onChange={(e) => setCustomPassword(e.target.value)}
                    className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white outline-none focus:border-amber-400"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-stone-950 font-black text-xs uppercase tracking-wider shadow-lg transition"
                >
                  Log Masuk ke Platform Pengurusan
                </button>
              </form>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
