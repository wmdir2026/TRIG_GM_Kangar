import React from 'react';
import { useApp } from '../../context/AppContext';
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
  BadgeAlert
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
    currentUser
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

  return (
    <div className="space-y-8 animate-fade-in py-4">
      
      {/* Hero Welcome Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-slate-800 shadow-2xl p-6 sm:p-10 text-white text-center">
        {/* Decorative background glow */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          
          {/* Logo & Sub-tag */}
          <div className="flex flex-col items-center gap-3">
            <div className="bg-white p-3 sm:p-4 rounded-3xl shadow-xl inline-flex items-center justify-center">
              <img
                src="/logo.png"
                alt="GIATMARA Malaysia"
                className="h-14 sm:h-20 w-auto object-contain"
              />
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-inner">
              <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-amber-300">
                PROGRAM KEUSAHAWANAN TRIG GIATMARA KANGAR
              </span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            Digital Business Management System
          </h1>

          <p className="text-slate-300 text-xs sm:text-base leading-relaxed max-w-2xl mx-auto font-normal">
            Platform bersepadu pengurusan operasi perniagaan latihan keusahawanan GIATMARA Kangar. Sila pilih sistem di bawah untuk memulakan operasi dan mengakses modul berkaitan:
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Sistem Aktif & Sedia Digunakan
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              Log Masuk: {currentUser?.name} ({currentUser?.role})
            </span>
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
              onClick={() => switchSystemMode('MASAKAN')}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-neutral-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-transform duration-200 group-hover:scale-[1.02]"
            >
              <span>Masuk Sistem Masakan (Café)</span>
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
              onClick={() => switchSystemMode('REPAIR')}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-transform duration-200 group-hover:scale-[1.02]"
            >
              <span>Masuk Sistem Baiki Smartphone</span>
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
              onClick={() => switchSystemMode('MANAGEMENT')}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-transform duration-200 group-hover:scale-[1.02]"
            >
              <span>Masuk Pusat Pengurusan & Laporan</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
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
