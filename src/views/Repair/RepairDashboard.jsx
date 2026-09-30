import React from 'react';
import { useApp } from '../../context/AppContext';
import giatmaraLogo from '../../assets/logo.png';
import {
  Smartphone,
  Wrench,
  Users,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  ArrowRight,
  Layers,
  Sparkles,
  Cpu,
  ShieldCheck,
  Eye,
  BatteryCharging,
  Droplets,
  Tv,
  Camera,
  Activity,
  Award
} from 'lucide-react';

export const RepairDashboard = () => {
  const {
    repairJobs,
    customers,
    kpis,
    setCurrentTab
  } = useApp();

  const inDiagnosis = repairJobs.filter(j => j.repairStatus === 'DIAGNOSIS' || j.repairStatus === 'RECEIVED').length;
  const pendingApproval = repairJobs.filter(j => j.quotationStatus === 'PENDING').length;
  const inRepairing = repairJobs.filter(j => j.repairStatus === 'REPAIRING' || j.repairStatus === 'TESTING').length;
  const readyCollection = repairJobs.filter(j => j.repairStatus === 'READY FOR COLLECTION').length;
  const completedJobs = repairJobs.filter(j => j.repairStatus === 'COMPLETED').length;

  // Diagnostic Guide Cards based on Image 2 (Planet Service Tech Blue Style)
  const diagnosticGuides = [
    { title: 'LCD HANDPHONE BERGARIS', subtitle: 'Penyebab: Kena impak/tekanan. Solusi: Tukar panel LCD/OLED berkualiti tinggi.', icon: Tv, badge: 'KES POPULAR' },
    { title: 'BAHAYA IPHONE KENA AIR LAUT', subtitle: 'Litar pintas & kakisan garam! Rawatan ultrasound & pembersihan PCB segera.', icon: Droplets, badge: 'KECEMASAN' },
    { title: 'MASALAH FACE ID TRUEDEPTH', subtitle: 'Dot projector & sensor inframerah rosak. Pembaikan mikroskopis & re-soldering.', icon: Eye, badge: 'KERJA MIKRO' },
    { title: 'BATERI CEPAT TERKURAS', subtitle: 'Battery health bawah 75%. Tukar sel High Capacity & reprogram cip bateri.', icon: BatteryCharging, badge: 'SERVIS PANTAS' },
    { title: 'KAMERA BLANK / HITAM', subtitle: 'Flex cable kamera koyak / IC image processor gagal voltan.', icon: Camera, badge: 'DIAGNOSIS' },
    { title: 'GREEN SCREEN / WHITE SCREEN', subtitle: 'Masalah ribbon display refresh rate. Boleh dibaiki tanpa tukar seluruh skrin!', icon: Activity, badge: 'TEKNOLOGI BARU' },
    { title: 'STUCK DI LOGO APPLE / ANDROID', subtitle: 'Software firmware crash / NAND Flash memory perlu diprogram semula.', icon: Cpu, badge: 'SOFTWARE' },
    { title: 'FREE KONSULTASI PENGECEKAN', subtitle: 'Pemeriksaan voltan multimeter & mikroskop 4K percuma oleh pelatih mahir.', icon: ShieldCheck, badge: 'PERCUMA' }
  ];

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* Header Banner (Cobalt Blue Tech Theme from Image 2) */}
      <div className="bg-linear-to-r from-blue-950 via-blue-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl shadow-2xl border-2 border-blue-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="bg-white px-3 py-2 rounded-2xl shadow-md shrink-0">
                <img
                  src={giatmaraLogo}
                  alt="GIATMARA Logo"
                  className="h-12 sm:h-14 w-auto object-contain"
                  onError={(e) => { e.currentTarget.src = './logo.png'; }}
                />
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-black uppercase tracking-wider border border-blue-400/30">
                KURSUS BAIKI SMARTPHONE & ELEKTRONIK
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight text-white">
              SMARTPHONE REPAIR MANAGEMENT SYSTEM
            </h1>
            <p className="text-xs sm:text-sm text-blue-200 max-w-xl leading-relaxed">
              Pusat kawalan teknikal diagnosis kerosakan peranti, sebut harga alat ganti, pengurusan bengkel dan jaminan servis 30 hari.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-950/80 border border-blue-400/40 rounded-xl text-blue-300 text-xs font-bold">
                <Award className="w-4 h-4 text-cyan-400" />
                <span>TEKNISI CERTIFIED GIATMARA</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-950/80 border border-blue-400/40 rounded-xl text-blue-300 text-xs font-bold">
                <Wrench className="w-4 h-4 text-cyan-400" />
                <span>TOOLS LENGKAP & MIKROSKOP 4K</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setCurrentTab('repair-jobs')}
              className="flex items-center gap-2 px-5 py-3 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-slate-950 font-black rounded-2xl text-xs shadow-lg shadow-blue-500/30 transition"
            >
              <Plus className="w-4 h-4" />
              <span>TERIMA TELEFON (JOB BARU)</span>
            </button>
            <button
              onClick={() => setCurrentTab('accessories-pos')}
              className="flex items-center gap-2 px-4 py-3 bg-blue-800/80 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold border border-blue-400/30 shadow-md transition"
            >
              <Smartphone className="w-4 h-4 text-cyan-300" />
              <span>POS Aksesori</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-3xl border-2 border-blue-100 shadow-xs hover:border-blue-300 transition">
          <div className="flex justify-between items-center text-xs font-black text-blue-600 uppercase tracking-wider">
            <span>Jumlah Hasil Servis</span>
            <DollarSign className="w-4 h-4" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
            RM {kpis.repairSales.toFixed(2)}
          </p>
          <span className="text-[11px] text-slate-500 font-medium">Dari {repairJobs.length} Job Pembaikan</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border-2 border-amber-100 shadow-xs hover:border-amber-300 transition">
          <div className="flex justify-between items-center text-xs font-black text-amber-600 uppercase tracking-wider">
            <span>Job Sedang Dibaiki</span>
            <Wrench className="w-4 h-4" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-amber-600 mt-2">
            {inRepairing}
          </p>
          <span className="text-[11px] text-slate-500 font-medium">Dalam kerja penggantian/ujian</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border-2 border-emerald-100 shadow-xs hover:border-emerald-300 transition">
          <div className="flex justify-between items-center text-xs font-black text-emerald-600 uppercase tracking-wider">
            <span>Sedia Untuk Ambil</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-emerald-700 mt-2">
            {readyCollection}
          </p>
          <span className="text-[11px] text-slate-500 font-medium">Lulus QC & sedia diserah</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border-2 border-purple-100 shadow-xs hover:border-purple-300 transition">
          <div className="flex justify-between items-center text-xs font-black text-purple-600 uppercase tracking-wider">
            <span>Pelanggan Berdaftar</span>
            <Users className="w-4 h-4" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-purple-700 mt-2">
            {customers.length}
          </p>
          <span className="text-[11px] text-slate-500 font-medium">Pangkalan data CRM</span>
        </div>
      </div>

      {/* Tech Blue Diagnostic Knowledge Cards (From Image 2) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-600" />
            <h2 className="text-sm sm:text-base font-black text-slate-900 uppercase tracking-tight">
              PANDUAN DIAGNOSIS & SIMPTOM KEROSAKAN POPULAR BENGKEL
            </h2>
          </div>
          <button
            onClick={() => setCurrentTab('repair-jobs')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            Lihat Semua Job &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {diagnosticGuides.map((guide, idx) => {
            const Icon = guide.icon;
            return (
              <div
                key={idx}
                className="bg-linear-to-b from-blue-900 to-blue-950 text-white rounded-3xl p-4 border border-blue-500/30 shadow-md hover:shadow-xl hover:border-cyan-400 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-800/80 border border-blue-400/40 flex items-center justify-center text-cyan-300 group-hover:scale-110 transition">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-cyan-400 text-slate-950 uppercase">
                      {guide.badge}
                    </span>
                  </div>

                  <h3 className="font-black text-xs text-white leading-snug tracking-tight">
                    {guide.title}
                  </h3>
                  <p className="text-[11px] text-blue-200 mt-1.5 leading-relaxed">
                    {guide.subtitle}
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-blue-800/80 flex items-center justify-between text-[10px] text-cyan-300 font-bold">
                  <span>GIATMARA Kangar Service</span>
                  <span>Siap 1-2 Jam</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Repair Pipeline Stepper Visual */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <h3 className="font-black text-slate-900 text-sm mb-1 uppercase tracking-tight">
          Aliran Pembaikan Peranti Bengkel (Repair Pipeline)
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Status semasa peranti pelanggan yang sedang dirawat di bengkel latihan TRIG.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">1. Pendaftaran & Diagnosis</span>
            <p className="text-xl font-black text-slate-900 mt-1">{inDiagnosis}</p>
            <span className="text-[10px] text-slate-500">Pemeriksaan fizikal</span>
          </div>

          <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-200 text-center">
            <span className="text-[10px] font-bold text-purple-600 uppercase">2. Sebut Harga</span>
            <p className="text-xl font-black text-purple-900 mt-1">{pendingApproval}</p>
            <span className="text-[10px] text-purple-700">Tunggu kelulusan</span>
          </div>

          <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-center">
            <span className="text-[10px] font-bold text-amber-600 uppercase">3. Kerja Baiki & Uji</span>
            <p className="text-xl font-black text-amber-900 mt-1">{inRepairing}</p>
            <span className="text-[10px] text-amber-700">Tukar spare parts</span>
          </div>

          <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
            <span className="text-[10px] font-bold text-emerald-600 uppercase">4. Sedia Diambil</span>
            <p className="text-xl font-black text-emerald-900 mt-1">{readyCollection}</p>
            <span className="text-[10px] text-emerald-700">QC Passed</span>
          </div>

          <div className="p-3.5 bg-blue-50 rounded-2xl border border-blue-200 text-center">
            <span className="text-[10px] font-bold text-blue-600 uppercase">5. Selesai & Waranti</span>
            <p className="text-xl font-black text-blue-900 mt-1">{completedJobs}</p>
            <span className="text-[10px] text-blue-700">Resit 30 Hari</span>
          </div>
        </div>
      </div>

    </div>
  );
};
