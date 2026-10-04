import React from 'react';
import { useApp } from '../../context/AppContext';
import giatmaraLogo from '../../assets/logo.png';
import {
  UtensilsCrossed,
  Wrench,
  Building2,
  Coffee,
  Smartphone,
  Layers,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Package,
  QrCode,
  Users,
  ChefHat,
  SmartphoneNfc,
  BarChart3,
  FileCheck2,
  Clock,
  CheckCircle2,
  Activity,
  Flame,
  Cpu,
  BadgeAlert,
  Printer,
  BookOpen,
  FileDown
} from 'lucide-react';

export const PortalLandingView = () => {
  const {
    switchSystemMode,
    kpis,
    menu,
    tables,
    repairJobs,
    inventory,
    repairTools,
    foodOrders,
    customers,
    currentUser,
    showToast
  } = useApp();

  const safeRepairJobs = repairJobs || [];
  const safeTables = tables || [];
  const safeInventory = inventory || [];
  const safeMenu = menu || [];
  const safeFoodOrders = foodOrders || [];
  const safeCustomers = customers || [];
  const safeRepairTools = repairTools || [];

  const activeRepairCount = safeRepairJobs.filter(j => j.repairStatus !== 'COMPLETED' && j.repairStatus !== 'CANCELLED').length;
  const occupiedTablesCount = safeTables.filter(t => t.status === 'OCCUPIED').length;
  const accessoriesCount = safeInventory.filter(i => i.category === 'Smartphone Accessories').length;

  // Role-Based Access Control logic
  const isSuperAdmin = currentUser?.role === 'SUPER ADMIN';
  const canAccessCafe = isSuperAdmin || ['MANAGER CAFE', 'CAFE STAFF', 'CAFE CASHIER'].includes(currentUser?.role);
  const canAccessRepair = isSuperAdmin || ['MANAGER SMARTPHONE REPAIR', 'REPAIR STAFF', 'SMARTPHONE CASHIER'].includes(currentUser?.role);
  const canAccessManagement = isSuperAdmin;

  const handleEnterCafe = () => {
    if (canAccessCafe) {
      switchSystemMode('MASAKAN');
    } else {
      showToast('Akses Terhad: Modul Café khusus untuk Staf Cafe & Super Admin sahaja.', 'warning');
    }
  };

  const handleEnterRepair = () => {
    if (canAccessRepair) {
      switchSystemMode('REPAIR');
    } else {
      showToast('Akses Terhad: Modul Baiki Smartphone khusus untuk Staf Teknikal & Super Admin sahaja.', 'warning');
    }
  };

  const handleEnterManagement = () => {
    if (canAccessManagement) {
      switchSystemMode('MANAGEMENT');
    } else {
      showToast('Akses Terhad: Pusat Kawalan, Inventori & Kewangan eksklusif untuk Super Admin (Wan Muhadir) sahaja.', 'warning');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in py-4">
      
      {/* Hero Welcome Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-slate-800 shadow-2xl p-6 sm:p-10 text-white text-center">
        {/* Decorative background glow */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          
          {/* Logo & Sub-tag with TechByte & Felìce Caffé Above TRIG GIATMARA Kangar */}
          <div className="flex flex-col items-center gap-3">
            <div className="bg-white p-3 sm:p-4 rounded-3xl shadow-xl inline-flex items-center justify-center">
              <img
                src={giatmaraLogo}
                alt="GIATMARA Malaysia"
                className="h-14 sm:h-20 w-auto object-contain"
                onError={(e) => { e.currentTarget.src = './logo.png'; }}
              />
            </div>
            <div className="text-center space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-amber-400 font-['Cabinet_Grotesk',sans-serif] tracking-wider uppercase">
                TECHBYTE & FELÌCE CAFFÉ
              </h2>
              <p className="text-xs sm:text-sm font-extrabold text-white tracking-widest uppercase">
                TRIG GIATMARA KANGAR
              </p>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
            Platform Pengurusan Staf & Operasi
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto font-normal">
            Selamat datang, <strong className="text-amber-300">{currentUser?.name}</strong> ({currentUser?.role}). Sila pilih modul di bawah mengikut bidang kuasa dan peranan operasi anda:
          </p>

          {/* Quick Switch to Main Landing & Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => switchSystemMode('MAIN')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-stone-950 font-black text-xs uppercase tracking-wider shadow-lg transition-transform hover:scale-105 cursor-pointer"
              title="Buka Menu Paling Utama TechByte & Felìce Caffé"
            >
              <span>🍽️📱</span>
              <span>Menu Paling Utama (Pelanggan)</span>
            </button>

            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              Peranan: {currentUser?.role} {isSuperAdmin ? '(Akses Penuh)' : ''}
            </span>

            <a
              href="./posters.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600/30 hover:bg-red-600/50 text-red-300 border border-red-500/40 text-xs font-bold transition"
            >
              <span>🖨️ Poster A4</span>
            </a>

            <a
              href="./manual.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 text-xs font-bold transition"
            >
              <span>📖 Buku Manual</span>
            </a>
          </div>

        </div>
      </div>

      {/* 3 Main Choice Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        
        {/* CARD 1: KURSUS MASAKAN (TastyBites Theme) */}
        <div className="relative group rounded-3xl bg-gradient-to-b from-neutral-900 via-stone-900 to-black border-2 border-amber-500/30 hover:border-amber-400 shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 flex flex-col justify-between overflow-hidden">
          
          {/* Top Banner Accent */}
          <div className="h-2 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600" />

          <div className="p-6 sm:p-7 space-y-5">
            
            {/* Tag & Icon */}
            <div className="flex items-center justify-between">
              <div className="p-3.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-inner">
                <UtensilsCrossed className="w-7 h-7" />
              </div>
              <span className="px-3 py-1 rounded-full text-[10px] font-black bg-amber-500 text-neutral-950 uppercase tracking-wider">
                HOT • FRESH • TASTY
              </span>
            </div>

            {/* Title & Description */}
            <div>
              <span className="text-[11px] font-black tracking-widest text-amber-400 uppercase block mb-1">
                KURSUS SENI MASAKAN & BAKERI
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white group-hover:text-amber-300 transition">
                Sistem Pengurusan Café & Makanan
              </h2>
              <p className="text-stone-300 text-xs mt-2 leading-relaxed">
                Operasi penjualan makanan & minuman, pesanan Dine-In meja M01–M10, bungkus (Takeaway), QR kod pesanan meja pelanggan, POS kaunter & paparan dapur (KDS).
              </p>
            </div>

            {/* Feature Checklist */}
            <div className="space-y-2 pt-2 border-t border-stone-800 text-xs text-stone-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Pesanan Meja QR Pelanggan (Self-Order)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Terminal POS Café & Cetakan Resit</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Paparan Pesanan Dapur Masa Nyata (KDS)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Pengurusan Menu & Status Meja Café</span>
              </div>
            </div>

            {/* Live Stats Preview */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-stone-950/80 rounded-2xl border border-stone-800 text-center">
              <div>
                <span className="text-[10px] text-stone-400 block font-semibold">Jualan</span>
                <span className="text-xs font-black text-amber-400">RM {(kpis?.cafeSales || 0).toFixed(0)}</span>
              </div>
              <div>
                <span className="text-[10px] text-stone-400 block font-semibold">Menu</span>
                <span className="text-xs font-black text-white">{safeMenu.length} Item</span>
              </div>
              <div>
                <span className="text-[10px] text-stone-400 block font-semibold">Meja Aktif</span>
                <span className="text-xs font-black text-amber-400">{occupiedTablesCount}/{safeTables.length}</span>
              </div>
            </div>

          </div>

          {/* Action Button */}
          <div className="p-6 pt-0">
            <button
              onClick={handleEnterCafe}
              className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-transform duration-200 group-hover:scale-[1.02] cursor-pointer ${
                canAccessCafe
                  ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-neutral-950 shadow-amber-500/25'
                  : 'bg-slate-800 text-slate-400 border border-slate-700 opacity-70 hover:opacity-100'
              }`}
            >
              <span>{canAccessCafe ? 'Masuk Sistem Masakan (Café)' : '🔒 Terhad: Staf Cafe & Super Admin'}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

        </div>

        {/* CARD 2: KURSUS BAIKI SMARTPHONE (Planet Service Tech Blue Theme) */}
        <div className="relative group rounded-3xl bg-gradient-to-b from-slate-950 via-[#06152b] to-[#040e1e] border-2 border-blue-500/40 hover:border-cyan-400 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/15 transition-all duration-300 flex flex-col justify-between overflow-hidden">
          
          {/* Top Banner Accent */}
          <div className="h-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600" />

          <div className="p-6 sm:p-7 space-y-5">
            
            {/* Tag & Icon */}
            <div className="flex items-center justify-between">
              <div className="p-3.5 rounded-2xl bg-blue-500/20 text-cyan-400 border border-cyan-500/30 shadow-inner">
                <Wrench className="w-7 h-7" />
              </div>
              <span className="px-3 py-1 rounded-full text-[10px] font-black bg-cyan-400 text-slate-950 uppercase tracking-wider">
                DIAGNOSTIC & REPAIR
              </span>
            </div>

            {/* Title & Description */}
            <div>
              <span className="text-[11px] font-black tracking-widest text-cyan-400 uppercase block mb-1">
                KURSUS BAIKI SMARTPHONE & TABLET
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white group-hover:text-cyan-300 transition">
                Sistem Pembaikan & Servis Telefon
              </h2>
              <p className="text-slate-300 text-xs mt-2 leading-relaxed">
                Pendaftaran job pembaikan, diagnosis kerosakan (Face ID, LCD, Bateri, Water Damage), sebut harga alat ganti, POS aksesori & semakan jaminan pelanggan.
              </p>
            </div>

            {/* Feature Checklist */}
            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Pendaftaran Tiket Job Baiki (REP-2026)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Kad Diagnosis Kerosakan Perkakasan</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Sebut Harga Rasmi & Kelulusan Pelanggan</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>POS Aksesori & Cetakan Resit Jaminan</span>
              </div>
            </div>

            {/* Live Stats Preview */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-slate-900/90 rounded-2xl border border-slate-800 text-center">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Job Aktif</span>
                <span className="text-xs font-black text-cyan-400">{activeRepairCount} Job</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Aksesori</span>
                <span className="text-xs font-black text-white">{accessoriesCount} SKU</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Mesin Alatan</span>
                <span className="text-xs font-black text-cyan-400">{safeRepairTools.length} Unit</span>
              </div>
            </div>

          </div>

          {/* Action Button */}
          <div className="p-6 pt-0">
            <button
              onClick={handleEnterRepair}
              className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-transform duration-200 group-hover:scale-[1.02] cursor-pointer ${
                canAccessRepair
                  ? 'bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:from-cyan-300 hover:to-blue-400 text-slate-950 shadow-cyan-500/25'
                  : 'bg-slate-800 text-slate-400 border border-slate-700 opacity-70 hover:opacity-100'
              }`}
            >
              <span>{canAccessRepair ? 'Masuk Sistem Baiki Smartphone' : '🔒 Terhad: Staf Repair & Super Admin'}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

        </div>

        {/* CARD 3: PUSAT PENGURUSAN, INVENTORI & LAPORAN */}
        <div className="relative group rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-indigo-500/30 hover:border-emerald-400 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col justify-between overflow-hidden">
          
          {/* Top Banner Accent */}
          <div className="h-2 bg-gradient-to-r from-indigo-500 via-teal-400 to-emerald-500" />

          <div className="p-6 sm:p-7 space-y-5">
            
            {/* Tag & Icon */}
            <div className="flex items-center justify-between">
              <div className="p-3.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shadow-inner">
                <Building2 className="w-7 h-7" />
              </div>
              <span className="px-3 py-1 rounded-full text-[10px] font-black bg-emerald-500 text-slate-950 uppercase tracking-wider">
                ADMIN & AUDIT
              </span>
            </div>

            {/* Title & Description */}
            <div>
              <span className="text-[11px] font-black tracking-widest text-emerald-400 uppercase block mb-1">
                PENGURUSAN PUSAT & LAPORAN
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white group-hover:text-emerald-300 transition">
                Pusat Kawalan, Inventori & Kewangan
              </h2>
              <p className="text-slate-300 text-xs mt-2 leading-relaxed">
                Kawalan stok berpusat 5 kategori, sistem pesanan belian (PR/PO), 20+ laporan jualan & kewangan (P&L), pengurusan pengguna RBAC & audit trail.
              </p>
            </div>

            {/* Feature Checklist */}
            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Inventori Pusat & Amaran Stok Rendah</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Modul Perolehan Belian (PR & PO)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>20+ Laporan Bersepadu & Eksport CSV</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Pengurusan Pengguna RBAC & Audit Trail</span>
              </div>
            </div>

            {/* Live Stats Preview */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-slate-950/80 rounded-2xl border border-slate-800 text-center">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Nilai Stok</span>
                <span className="text-xs font-black text-emerald-400">RM {(kpis?.totalInventoryValue || 0).toFixed(0)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Total Jualan</span>
                <span className="text-xs font-black text-white">RM {(kpis?.totalSales || 0).toFixed(0)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Stok Rendah</span>
                <span className="text-xs font-black text-rose-400">{kpis?.lowStockCount || 0} Item</span>
              </div>
            </div>

          </div>

          {/* Action Button */}
          <div className="p-6 pt-0">
            <button
              onClick={handleEnterManagement}
              className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-transform duration-200 group-hover:scale-[1.02] cursor-pointer ${
                canAccessManagement
                  ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-500/25'
                  : 'bg-slate-800 text-slate-400 border border-slate-700 opacity-70 hover:opacity-100'
              }`}
            >
              <span>{canAccessManagement ? 'Masuk Pusat Pengurusan & Laporan (Akses Penuh)' : '🔒 Eksklusif: Super Admin (Wan Muhadir)'}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* DOKUMENTASI & BAHAN PROMOSI RASMI (KHAS UNTUK ADMIN & STAF) */}
      {/* ========================================================================= */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-black text-amber-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Bahan Promosi & Dokumentasi Operasi</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white">
              Pusat Bahan Iklan & Manual Sistem POS (Khusus Admin & Staf)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Cetak poster promosi bersaiz A4 untuk dipamerkan dan rujukan buku manual rasmi pengoperasian sistem.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-bold self-start sm:self-auto">
            Akses Staf / Admin
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Card 1: Poster A4 */}
          <div className="bg-gradient-to-br from-red-950/40 via-slate-950 to-slate-900 p-5 rounded-2xl border border-red-500/30 flex flex-col justify-between space-y-4 hover:border-red-400 transition-all shadow-lg group">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-red-600/20 text-red-400 border border-red-500/30 rounded-xl">
                  <Printer className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 bg-red-600 text-white rounded-full">
                  SAIZ RASMI A4
                </span>
              </div>
              <h4 className="text-base font-black text-white group-hover:text-red-300 transition">
                Koleksi Poster Iklan A4 Rasmi
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Mengandungi 3 set poster promosi A4 sedia cetak: Poster Keseluruhan Sistem POS TRIG, Poster Masakan & Café, serta Poster Kursus Baiki Smartphone.
              </p>
            </div>

            <a
              href="./posters.html"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-2 transition hover:scale-[1.02]"
            >
              <Printer className="w-4 h-4" />
              <span>Buka & Cetak Poster A4 →</span>
            </a>
          </div>

          {/* Card 2: Buku Manual */}
          <div className="bg-gradient-to-br from-amber-950/40 via-slate-950 to-slate-900 p-5 rounded-2xl border border-amber-500/30 flex flex-col justify-between space-y-4 hover:border-amber-400 transition-all shadow-lg group">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl">
                  <BookOpen className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 bg-amber-500 text-slate-950 rounded-full">
                  VERSI 2.6 PRO
                </span>
              </div>
              <h4 className="text-base font-black text-white group-hover:text-amber-300 transition">
                Buku Manual Panduan Sistem POS
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Dokumentasi operasi lengkap merangkumi pesanan pelanggan, paparan dapur KDS, pendaftaran kerja pembaikan, pengurusan inventori, sebut harga & 20+ laporan kewangan.
              </p>
            </div>

            <a
              href="./manual.html"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-2 transition hover:scale-[1.02]"
            >
              <BookOpen className="w-4 h-4" />
              <span>Buka & Baca Buku Manual (PDF) →</span>
            </a>
          </div>

        </div>
      </div>

      {/* Bottom Ecosystem Overview Bar */}
      <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-300">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-xl">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">Status Ekosistem Digital TRIG GIATMARA Kangar</h4>
            <p className="text-slate-400 text-xs">Semua modul disambung secara automatik melalui pangkalan data setempat (LocalStorage DB).</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-center">
          <div className="px-3 py-1.5 bg-slate-800 rounded-xl">
            <span className="text-[10px] text-slate-400 block">Jumlah Pelanggan</span>
            <span className="font-bold text-white">{safeCustomers.length} Orang</span>
          </div>
          <div className="px-3 py-1.5 bg-slate-800 rounded-xl">
            <span className="text-[10px] text-slate-400 block">Pesanan Café</span>
            <span className="font-bold text-amber-400">{safeFoodOrders.length} Pesanan</span>
          </div>
          <div className="px-3 py-1.5 bg-slate-800 rounded-xl">
            <span className="text-[10px] text-slate-400 block">Job Baiki Telefon</span>
            <span className="font-bold text-cyan-400">{safeRepairJobs.length} Rekod</span>
          </div>
        </div>
      </div>

    </div>
  );
};
