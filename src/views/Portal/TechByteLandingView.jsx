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
  ExternalLink,
  Eye,
  EyeOff,
  Download,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  HelpCircle,
  Play
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
  const [isSuperAdminPromptOpen, setIsSuperAdminPromptOpen] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminPasswordError, setAdminPasswordError] = useState('');
  const [showAdminPassModal, setShowAdminPassModal] = useState(false);

  // Handle direct navigation to Customer Cafe Food Ordering (Format Paparan Telefon)
  const handleOpenCustomerCafe = () => {
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
    setCurrentTab('customer-phone-app');
    showToast('Paparan pelanggan Menu Pesanan Makanan Cafe dibuka.', 'info');
  };

  // Handle direct navigation to Customer Repair (Format Paparan Telefon)
  const handleOpenCustomerRepair = () => {
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
    setCurrentTab('customer-repair-phone-app');
    showToast('Paparan pelanggan Menu Baiki telefon Bimbit dibuka.', 'info');
  };

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
    showToast('Selamat datang ke Menu Tempahan Makanan Café TechByte & Felìce Caffé!', 'info');
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
  const handleSelectUser = (user, isAuthVerified = false) => {
    // Jika Super Admin dipilih tanpa pengesahan kata laluan, buka dialog pengesahan kata laluan
    if ((user.role === 'SUPER ADMIN' || user.username === 'admin') && !isAuthVerified) {
      setAdminPasswordInput('');
      setAdminPasswordError('');
      setIsSuperAdminPromptOpen(true);
      return;
    }

    const activePass = (user.role === 'SUPER ADMIN' || user.username === 'admin') ? (user.password || '095059') : null;
    const success = switchUser(user.id, activePass, true);
    if (!success) {
      showToast('Akses ditolak atau gagal menukar pengguna!', 'error');
      return;
    }

    setIsStaffLoggedIn(true);
    setIsLoginModalOpen(false);
    setIsSuperAdminPromptOpen(false);
    setCustomUsername('');
    setCustomPassword('');

    if (user.role === 'CUSTOMER SERVICE') {
      setCurrentTab('waiter-tablet-app');
      showToast(`Log masuk berjaya! Selamat datang ${user.name} (Pautan Tab Pelayan sahaja).`, 'success');
      return;
    }
    switchSystemMode('PORTAL');
    showToast(`Log masuk berjaya! Selamat datang ${user.name} (${user.role}).`, 'success');
  };

  // Pengesahan Kata Laluan Khas untuk Super Admin (Menggunakan password aktif dari profil atau 095059)
  const handleConfirmSuperAdminPassword = (e) => {
    e.preventDefault();
    const input = adminPasswordInput.trim();
    const superAdminUser = (users || []).find(u => u.role === 'SUPER ADMIN' || u.username === 'admin') || {
      id: "USR-001",
      username: "admin",
      password: "095059",
      name: "Wan Muhadir (Super Admin)",
      role: "SUPER ADMIN"
    };
    const activePass = superAdminUser?.password || '095059';

    // 095059 sentiasa diterima, dan kata laluan baharu yang disimpan turut diterima
    const isMatch = (input === '095059') || (activePass !== 'admin123' && input === activePass);

    if (isMatch) {
      setAdminPasswordError('');
      // Jika kata laluan lama tersimpan sebagai admin123, kemas kini secara automatik
      if (superAdminUser.password === 'admin123') {
        superAdminUser.password = '095059';
      }
      handleSelectUser(superAdminUser, true);
    } else {
      setAdminPasswordError('Kata laluan tidak sah! Sila masukkan kata laluan 095059 atau kata laluan baharu anda.');
      showToast('Kata laluan tidak sah untuk Super Admin!', 'error');
    }
  };

  // Handle manual login
  const handleManualLogin = (e) => {
    e.preventDefault();
    const trimmedUser = customUsername.trim().toLowerCase();
    const trimmedPass = customPassword.trim();

    if (!trimmedUser || !trimmedPass) {
      showToast('Sila masukkan Nama Pengguna dan Kata Laluan!', 'warning');
      return;
    }

    const found = (users || []).find(
      u => u.username.toLowerCase() === trimmedUser || u.email?.toLowerCase() === trimmedUser
    );

    if (!found) {
      showToast('Nama pengguna tidak sah / tidak dijumpai!', 'error');
      return;
    }

    // Kawalan khas bagi Super Admin: Semak dengan kata laluan 095059 atau kata laluan aktif pengguna
    if (found.role === 'SUPER ADMIN' || found.username === 'admin') {
      const activePass = found.password || '095059';
      const isMatch = (trimmedPass === '095059') || (activePass !== 'admin123' && trimmedPass === activePass);

      if (trimmedUser === found.username.toLowerCase() && isMatch) {
        if (found.password === 'admin123') {
          found.password = '095059';
        }
        handleSelectUser(found, true);
      } else {
        showToast('Kata laluan tidak sah untuk Super Admin! Sila semak semula kata laluan anda.', 'error');
      }
      return;
    }

    // Bagi akaun staf operasi lain
    if (found.password === trimmedPass) {
      handleSelectUser(found, true);
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
                alt="TECHBYTE & FELÌCE CAFFÉ"
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
            {isStaffLoggedIn && currentUser && currentUser.role !== 'CUSTOMER' && (
              <div className="mt-2 text-center md:text-right">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-black/60 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {currentUser?.name?.split(' ')[0]} ({currentUser?.role})
                </span>
                <div className="mt-1 flex items-center gap-2 justify-center md:justify-end">
                  {currentUser?.role === 'CUSTOMER SERVICE' ? (
                    <button
                      onClick={() => setCurrentTab('waiter-tablet-app')}
                      className="text-[10px] text-indigo-300 hover:text-indigo-200 underline font-black cursor-pointer"
                    >
                      Buka Tab Pelayan →
                    </button>
                  ) : (
                    <button
                      onClick={() => switchSystemMode('PORTAL')}
                      className="text-[10px] text-cyan-300 hover:text-cyan-200 underline font-black cursor-pointer"
                    >
                      Platform Staf →
                    </button>
                  )}
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
        {/* PAUTAN MUDAH ALIH PELANGGAN (CAFE & BAIKI TELEFON) */}
        {/* ========================================================================= */}
        <div className="bg-stone-950/85 backdrop-blur-md rounded-3xl border border-amber-500/30 p-5 sm:p-6 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-stone-800 pb-3">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40 shrink-0">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-wide">
                  Pautan Mudah Alih Pelanggan
                </h3>
                <p className="text-xs text-slate-400">
                  Dua pautan awam diselaraskan secara langsung melalui rangkaian cloud MQTT GitHub Pages
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
            
            {/* PAUTAN 1: MENU PESANAN MAKANAN CAFE */}
            <div
              onClick={handleOpenCustomerCafe}
              className="bg-slate-900/90 rounded-2xl p-4 border border-amber-500/40 hover:border-amber-400 transition-all hover:scale-[1.01] cursor-pointer group shadow-lg flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                    PAUTAN MENU CAFÉ
                  </span>
                  <span className="text-xs text-amber-400 font-mono font-bold">?app=customer</span>
                </div>
                <h4 className="text-base font-black text-white group-hover:text-amber-400 transition">
                  Menu Pesanan Makanan Cafe
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Pelanggan boleh imbas QR meja, memesan makanan & minuman Itali, bayaran DuitNow QR, serta pantau status masakan dapur secara langsung.
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <span className="text-xs font-black text-amber-400 flex items-center gap-1.5 group-hover:text-amber-300 transition">
                  <span>Klik di sini</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </span>
                <span className="text-[10px] text-slate-500 font-bold">Format Skrin Telefon</span>
              </div>
            </div>

            {/* PAUTAN 2: MENU BAIKI TELEFON BIMBIT */}
            <div
              onClick={handleOpenCustomerRepair}
              className="bg-slate-900/90 rounded-2xl p-4 border border-cyan-500/40 hover:border-cyan-400 transition-all hover:scale-[1.01] cursor-pointer group shadow-lg flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-400 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                    PAUTAN MENU BAIKI
                  </span>
                  <span className="text-xs text-cyan-300 font-mono font-bold">?app=repair</span>
                </div>
                <h4 className="text-base font-black text-white group-hover:text-cyan-300 transition">
                  Menu Baiki telefon Bimbit
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Semak status live kerja baikpulih telefon pintar (timeline 7-peringkat), pendaftaran permohonan servis baru & katalog aksesori.
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <span className="text-xs font-black text-cyan-300 flex items-center gap-1.5 group-hover:text-cyan-200 transition">
                  <span>Klik di sini</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </span>
                <span className="text-[10px] text-slate-500 font-bold">Format Skrin Telefon</span>
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
                {(users || [])
                  .filter(u => u.role !== 'CUSTOMER')
                  .map((u) => {
                    const isSuperAdmin = u.role === 'SUPER ADMIN';
                    const isCustomerService = u.role === 'CUSTOMER SERVICE';
                    const isCafe = u.role.includes('CAFE');
                    const isRepair = u.role.includes('REPAIR') || u.role.includes('SMARTPHONE');

                    return (
                      <button
                        key={u.id}
                        onClick={() => handleSelectUser(u)}
                        className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-3 hover:scale-[1.02] cursor-pointer relative ${
                          isSuperAdmin
                            ? 'bg-gradient-to-r from-red-950/80 via-slate-900 to-red-950/40 border-red-500/60 hover:border-red-400 shadow-lg shadow-red-950/40'
                            : isCustomerService
                            ? 'bg-gradient-to-r from-indigo-950/70 to-slate-900 border-indigo-500/50 hover:border-indigo-400 shadow-indigo-500/10'
                            : isCafe
                            ? 'bg-gradient-to-r from-amber-950/60 to-slate-900 border-amber-500/50 hover:border-amber-400'
                            : isRepair
                            ? 'bg-gradient-to-r from-blue-950/60 to-slate-900 border-cyan-500/50 hover:border-cyan-400'
                            : 'bg-slate-800 border-slate-700 hover:border-slate-500'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full border flex items-center justify-center overflow-hidden shrink-0 text-lg ${
                          isSuperAdmin ? 'bg-red-900/60 border-red-400 text-xl' : 'bg-slate-800 border-white/20'
                        }`}>
                          {isSuperAdmin ? '👑' : isCustomerService ? '📟' : isCafe ? '☕' : '📱'}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="font-extrabold text-xs text-white truncate">
                              {u.name}
                            </h4>
                            {isSuperAdmin && (
                              <span className="text-[8px] px-1.5 py-0.5 rounded bg-red-500/30 text-red-200 border border-red-500/50 font-bold inline-flex items-center gap-0.5">
                                <Lock className="w-2.5 h-2.5" /> DIKUNCI
                              </span>
                            )}
                          </div>
                          <span className={`text-[10px] font-black uppercase block ${
                            isSuperAdmin ? 'text-red-400' : isCustomerService ? 'text-indigo-400' : isCafe ? 'text-amber-400' : 'text-cyan-400'
                          }`}>
                            {u.role}
                          </span>
                          <span className="text-[9px] text-slate-400 block truncate">
                            {isSuperAdmin
                              ? 'ID: admin • Wajib Masukkan Kata Laluan'
                              : isCustomerService
                              ? 'Akses Pautan Tab Pelayan Sahaja'
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
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-300">
                  Atau log masuk menggunakan ID Pengguna & Kata Laluan:
                </span>
                <span className="text-[10px] text-amber-400 font-semibold">
                  Super Admin: ID "admin"
                </span>
              </div>
              <form onSubmit={handleManualLogin} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      placeholder="ID Pengguna (cth: admin)"
                      value={customUsername}
                      onChange={(e) => setCustomUsername(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      placeholder="Kata Laluan (Password)"
                      value={customPassword}
                      onChange={(e) => setCustomPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white outline-none focus:border-amber-400"
                    />
                  </div>
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

      {/* ========================================================================= */}
      {/* SUPER ADMIN PASSWORD VERIFICATION PROMPT MODAL */}
      {/* ========================================================================= */}
      {isSuperAdminPromptOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border-2 border-red-500/70 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative text-white space-y-5">
            
            {/* Close Button */}
            <button
              onClick={() => {
                setIsSuperAdminPromptOpen(false);
                setAdminPasswordInput('');
                setAdminPasswordError('');
              }}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-red-950/90 border border-red-500/60 flex items-center justify-center text-2xl shadow-xl shrink-0">
                👑
              </div>
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <span>Pengesahan Super Admin</span>
                  <Lock className="w-4 h-4 text-red-400" />
                </h3>
                <p className="text-xs text-slate-300">
                  ID Log Masuk (Username): <strong className="text-amber-400 font-mono">admin</strong>
                </p>
              </div>
            </div>

            {/* Notice */}
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-900/60 text-xs text-slate-200 leading-relaxed">
              Ruangan <strong>Super Admin</strong> dilindungi kata laluan. Hanya log masuk yang betul dibenarkan masuk ke kawalan penuh sistem.
            </div>

            {/* Error Message */}
            {adminPasswordError && (
              <div className="p-3 bg-red-500/20 border border-red-500 text-red-200 text-xs rounded-xl font-bold animate-shake">
                {adminPasswordError}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleConfirmSuperAdminPassword} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-300 block">
                    Kata Laluan (Password):
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowAdminPassModal(!showAdminPassModal)}
                    className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {showAdminPassModal ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showAdminPassModal ? 'Sembunyi' : 'Lihat'}</span>
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showAdminPassModal ? "text" : "password"}
                    autoFocus
                    value={adminPasswordInput}
                    onChange={(e) => {
                      setAdminPasswordInput(e.target.value);
                      setAdminPasswordError('');
                    }}
                    placeholder="Masukkan Kata Laluan (cth: 095059)"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white font-mono outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsSuperAdminPromptOpen(false);
                    setAdminPasswordInput('');
                    setAdminPasswordError('');
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider shadow-lg transition flex items-center justify-center gap-1.5"
                >
                  <span>Sahkan & Masuk</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
