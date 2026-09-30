import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import giatmaraLogo from '../../assets/logo.png';
import {
  Smartphone,
  Search,
  CheckCircle2,
  Clock,
  Wrench,
  ShieldCheck,
  Receipt,
  Phone,
  ArrowLeft
} from 'lucide-react';

export const CustomerRepairTracker = () => {
  const { repairJobs, openReceipt, settings, switchSystemMode } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchedJob, setSearchedJob] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const q = searchQuery.trim().toLowerCase();
    const found = repairJobs.find(j =>
      j.id.toLowerCase() === q ||
      j.customerPhone.replace(/[^0-9]/g, '').includes(q.replace(/[^0-9]/g, '')) ||
      (j.imeiSerial && j.imeiSerial.toLowerCase() === q)
    );

    setSearchedJob(found || null);
    setHasSearched(true);
  };

  const steps = [
    'RECEIVED',
    'DIAGNOSIS',
    'QUOTATION',
    'REPAIRING',
    'TESTING',
    'READY FOR COLLECTION',
    'COMPLETED'
  ];

  const currentStepIndex = searchedJob ? steps.indexOf(searchedJob.repairStatus) : -1;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-12">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-cyan-500/30 text-white p-6 rounded-3xl shadow-xl text-center space-y-4">
        
        {/* Top Back & Brand Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-xl shadow-md shrink-0">
              <img
                src={giatmaraLogo}
                alt="GIATMARA Logo"
                className="h-9 w-auto object-contain"
                onError={(e) => { e.currentTarget.src = './logo.png'; }}
              />
            </div>
            <div className="text-left">
              <span className="text-sm sm:text-base font-black text-amber-400 font-['Cabinet_Grotesk',sans-serif] tracking-wider uppercase block leading-tight">
                TECHBYTE & PASTA CAFE
              </span>
              <span className="text-[11px] font-extrabold text-white tracking-tight uppercase leading-tight block">
                TRIG GIATMARA KANGAR
              </span>
            </div>
          </div>

          <button
            onClick={() => switchSystemMode('MAIN')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-black transition cursor-pointer shadow-md"
            title="Kembali ke Menu Paling Utama"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Menu Utama</span>
          </button>
        </div>

        <div className="space-y-1">
          <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 mx-auto flex items-center justify-center text-cyan-300">
            <Smartphone className="w-6 h-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            SEMAKAN STATUS PEMBAIKAN TELEFON PINTAR
          </h1>
          <p className="text-xs text-cyan-200/90 max-w-lg mx-auto">
            Masukkan No. Job Baiki (cth: <strong>REP-2026-00001</strong>) atau No. Telefon untuk semakan diagnosis dan status siap secara masa nyata.
          </p>
        </div>
      </div>

      {/* Search Bar Form */}
      <form onSubmit={handleSearch} className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            required
            placeholder="Masukkan No Job (REP-2026-00001) atau No Telefon (019-4567812)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-3 text-xs bg-slate-50 border border-slate-200 rounded-2xl outline-none font-medium text-slate-900"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold shadow-md transition"
        >
          Semak Status
        </button>
      </form>

      {/* Quick Demo Suggestions */}
      <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
        <span>Contoh untuk demo:</span>
        <button
          onClick={() => { setSearchQuery('REP-2026-00001'); }}
          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg font-mono font-bold text-slate-700"
        >
          REP-2026-00001 (Ahmad)
        </button>
        <button
          onClick={() => { setSearchQuery('REP-2026-00002'); }}
          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg font-mono font-bold text-slate-700"
        >
          REP-2026-00002 (Siti Sarah)
        </button>
      </div>

      {/* Result Display */}
      {hasSearched && !searchedJob && (
        <div className="bg-white p-10 rounded-3xl border border-slate-200 text-center text-xs text-slate-400">
          <p className="font-bold text-slate-700 text-sm">Tiada Rekod Pembaikan Dijumpai</p>
          <p className="text-slate-400 mt-1">Sila pastikan No. Job atau No. Telefon yang dimasukkan adalah tepat.</p>
        </div>
      )}

      {searchedJob && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-md space-y-6 animate-fade-in text-xs">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
            <div>
              <span className="px-3 py-1 rounded-xl bg-blue-50 text-blue-700 font-mono font-black text-xs border border-blue-200">
                {searchedJob.id}
              </span>
              <h2 className="font-black text-slate-900 text-base sm:text-lg mt-1">
                {searchedJob.deviceBrand} {searchedJob.deviceModel}
              </h2>
              <p className="text-slate-500">
                Pemilik: <span className="font-bold text-slate-800">{searchedJob.customerName}</span> • Tarikh Diterima: {new Date(searchedJob.dateReceived).toLocaleDateString()}
              </p>
            </div>

            <div className="text-right">
              <span className="px-3 py-1.5 rounded-full text-xs font-black uppercase bg-blue-100 text-blue-900 border border-blue-200">
                {searchedJob.repairStatus}
              </span>
            </div>
          </div>

          {/* Visual Progress Stepper */}
          <div className="py-2">
            <p className="font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-4">
              KEMAJUAN PROSES PEMBAIKAN:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              {['Pemeriksaan/Diagnosis', 'Sebut Harga', 'Kerja Baiki & QC', 'Sedia Untuk Ambil'].map((stepName, idx) => {
                const stepActive = currentStepIndex >= idx * 2;
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-2xl border transition ${
                      stepActive
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-400 font-medium'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full mx-auto mb-1.5 flex items-center justify-center font-bold text-xs bg-white shadow-2xs">
                      {idx + 1}
                    </div>
                    <span>{stepName}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Job Details Card */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Masalah Diperiksa:</span>
              <span className="font-bold text-rose-700">{searchedJob.damageType}</span>
            </div>
            {searchedJob.diagnosis && (
              <div className="flex justify-between">
                <span className="text-slate-500">Diagnosis Juruteknik:</span>
                <span className="font-medium text-slate-800">{searchedJob.diagnosis}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-slate-200 text-sm">
              <span className="font-black text-slate-900">Jumlah Caj Pembaikan:</span>
              <span className="font-black text-blue-700">RM {searchedJob.sellingPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500">Status Bayaran:</span>
              <span className={`font-bold ${searchedJob.paymentStatus === 'PAID' ? 'text-emerald-700' : 'text-rose-600'}`}>
                {searchedJob.paymentStatus === 'PAID' ? 'TELAH DIBAYAR (LULUS)' : 'BELUM BAYAR (SEMASA KUTIPAN)'}
              </span>
            </div>
          </div>

          {/* Receipt Action if Paid */}
          {searchedJob.paymentStatus === 'PAID' && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => openReceipt({ type: 'REPAIR', job: searchedJob })}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xs transition flex items-center gap-2"
              >
                <Receipt className="w-4 h-4" />
                <span>Lihat & Cetak Resit Rasmi</span>
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
