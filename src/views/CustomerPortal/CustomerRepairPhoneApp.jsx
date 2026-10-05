import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import giatmaraLogo from '../../assets/logo.png';
import {
  Smartphone,
  Search,
  Wrench,
  ShieldCheck,
  Receipt,
  Phone,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Sparkles,
  Package,
  Plus,
  ChevronRight,
  AlertCircle,
  Calendar,
  BadgeCheck,
  RefreshCw,
  ShoppingBag,
  Cpu,
  Info,
  ExternalLink,
  MessageCircle,
  Tag,
  Edit2,
  AlertTriangle,
  X,
  Flame,
  Percent
} from 'lucide-react';

export const CustomerRepairPhoneApp = () => {
  const {
    repairJobs,
    createRepairJob,
    updateRepairJob,
    inventory,
    openReceipt,
    showToast,
    switchSystemMode,
    setCurrentTab,
    syncStatus,
    realtimeSync,
    accessoryDiscount
  } = useApp();

  const [activeTab, setActiveTab] = useState('tracker'); // 'tracker', 'booking', 'accessories'
  
  // Tracker State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedJob, setSearchedJob] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Booking Form State
  const [bookName, setBookName] = useState('');
  const [bookPhone, setBookPhone] = useState('');
  const [bookBrand, setBookBrand] = useState('Apple');
  const [bookModel, setBookModel] = useState('');
  const [bookDamage, setBookDamage] = useState('Skrin Pecah / LCD Blank');
  const [bookNotes, setBookNotes] = useState('');
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [bookingSuccessJob, setBookingSuccessJob] = useState(null);

  // Duplicate Submission Alert & Customer Self-Edit State
  const [duplicateAlertJob, setDuplicateAlertJob] = useState(null);
  const [isCustomerEditOpen, setIsCustomerEditOpen] = useState(false);
  const [customerEditForm, setCustomerEditForm] = useState({
    name: '',
    phone: '',
    brand: 'Apple',
    model: '',
    damage: 'Skrin Pecah / LCD Blank',
    notes: ''
  });

  // Open Customer Edit Modal (Only allowed when repairStatus is RECEIVED)
  const handleOpenCustomerEdit = (job) => {
    if (job.repairStatus !== 'RECEIVED') {
      showToast(`Pindaan data terkunci kerana status telah masuk ke fasa ${job.repairStatus}.`, 'error');
      return;
    }
    setCustomerEditForm({
      name: job.customerName || '',
      phone: job.customerPhone || '',
      brand: job.deviceBrand || 'Apple',
      model: job.deviceModel || '',
      damage: job.damageType || 'Skrin Pecah / LCD Blank',
      notes: job.notes || job.problemReported || ''
    });
    setIsCustomerEditOpen(true);
  };

  // Save Customer Edit
  const handleSaveCustomerEdit = (e) => {
    e.preventDefault();
    if (!customerEditForm.name.trim() || !customerEditForm.phone.trim() || !customerEditForm.model.trim()) {
      showToast('Sila lengkapkan nama, telefon dan model telefon anda.', 'warning');
      return;
    }

    if (!searchedJob) return;

    if (searchedJob.repairStatus !== 'RECEIVED') {
      showToast('Pindaan tidak dibenarkan kerana status telah masuk ke fasa pemeriksaan/diagnosis.', 'error');
      setIsCustomerEditOpen(false);
      return;
    }

    const updatedData = {
      customerName: customerEditForm.name.trim(),
      customerPhone: customerEditForm.phone.trim(),
      deviceBrand: customerEditForm.brand,
      deviceModel: customerEditForm.model.trim(),
      damageType: customerEditForm.damage,
      notes: customerEditForm.notes.trim(),
      problemReported: customerEditForm.damage + (customerEditForm.notes.trim() ? ` - ${customerEditForm.notes.trim()}` : ''),
      diagnosis: `Pendaftaran Dalam Talian (Dikemaskini Pelanggan): ${customerEditForm.notes.trim() || 'Pemeriksaan penuh diperlukan.'}`
    };

    updateRepairJob(searchedJob.id, updatedData);
    setSearchedJob(prev => ({ ...prev, ...updatedData }));
    setIsCustomerEditOpen(false);
    showToast(`Butiran permohonan ${searchedJob.id} berjaya dikemaskini!`, 'success');
  };

  // Accessories Search & Filter
  const [accSearch, setAccSearch] = useState('');

  // Handle Tracker Search
  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    const q = searchQuery.trim().toLowerCase();
    const found = (repairJobs || []).find(j =>
      j.id.toLowerCase() === q ||
      j.customerPhone?.replace(/[^0-9]/g, '').includes(q.replace(/[^0-9]/g, '')) ||
      (j.imeiSerial && j.imeiSerial.toLowerCase() === q)
    );

    setSearchedJob(found || null);
    setHasSearched(true);
    if (!found) {
      showToast('Tiada rekod pembaikan dijumpai.', 'warning');
    } else {
      showToast(`Rekod ${found.id} dijumpai!`, 'info');
    }
  };

  // Quick chips search
  const handleSelectDemoJob = (jobId) => {
    setSearchQuery(jobId);
    const found = (repairJobs || []).find(j => j.id.toLowerCase() === jobId.toLowerCase());
    setSearchedJob(found || null);
    setHasSearched(true);
  };

  // Stepper logic
  const steps = [
    { key: 'RECEIVED', label: 'Diterima', desc: 'Peranti diserah di kaunter' },
    { key: 'DIAGNOSIS', label: 'Diagnosis', desc: 'Pemeriksaan teknikal pelatih' },
    { key: 'QUOTATION', label: 'Sebut Harga', desc: 'Anggaran kos & alat ganti' },
    { key: 'REPAIRING', label: 'Membaiki', desc: 'Pemasangan komponen baru' },
    { key: 'TESTING', label: 'Ujian QC', desc: 'Ujian kualiti & ketahanan' },
    { key: 'READY', label: 'Sedia Ambil', desc: 'Siap & boleh diambil' },
    { key: 'COMPLETED', label: 'Selesai', desc: 'Diserahkan kepada pelanggan' }
  ];

  const getStepIndex = (status) => {
    if (!status) return 0;
    const s = status.toUpperCase();
    if (s === 'RECEIVED') return 0;
    if (s === 'DIAGNOSIS') return 1;
    if (s === 'QUOTATION') return 2;
    if (s === 'REPAIRING') return 3;
    if (s === 'TESTING') return 4;
    if (s === 'READY' || s === 'READY FOR COLLECTION') return 5;
    if (s === 'COMPLETED') return 6;
    return 0;
  };

  const currentStepIndex = searchedJob ? getStepIndex(searchedJob.repairStatus) : -1;

  // Handle New Repair Booking Submission
  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!bookName.trim() || !bookPhone.trim() || !bookModel.trim()) {
      showToast('Sila lengkapkan nama, nombor telefon dan model telefon anda.', 'warning');
      return;
    }

    const cleanPhone = bookPhone.replace(/[^0-9]/g, '');
    const cleanModel = bookModel.trim().toLowerCase();

    // Kawalan: Pelanggan hanya boleh menghantar sekali untuk model telefon yang sama selagi job belum selesai/batal
    const existingDuplicateJob = (repairJobs || []).find(j => {
      if (['COMPLETED', 'CANCELLED'].includes(j.repairStatus)) return false;
      const jPhone = (j.customerPhone || '').replace(/[^0-9]/g, '');
      const samePhone = cleanPhone && jPhone && (cleanPhone === jPhone || cleanPhone.endsWith(jPhone) || jPhone.endsWith(cleanPhone));
      const sameName = j.customerName && bookName && j.customerName.trim().toLowerCase() === bookName.trim().toLowerCase();
      const sameModel = j.deviceModel && cleanModel && j.deviceModel.trim().toLowerCase() === cleanModel;
      return (samePhone || sameName) && sameModel;
    });

    if (existingDuplicateJob) {
      setDuplicateAlertJob(existingDuplicateJob);
      showToast(`Permohonan servis untuk model ${existingDuplicateJob.deviceModel} telah wujud (${existingDuplicateJob.id})!`, 'warning');
      return;
    }

    setIsSubmittingBooking(true);

    const newJob = createRepairJob({
      customerName: bookName.trim(),
      customerPhone: bookPhone.trim(),
      deviceBrand: bookBrand,
      deviceModel: bookModel.trim(),
      damageType: bookDamage,
      problemReported: `${bookDamage}${bookNotes.trim() ? ` - ${bookNotes.trim()}` : ''}`,
      diagnosis: `Pendaftaran Dalam Talian (Pautan Pelanggan): ${bookNotes.trim() || 'Pemeriksaan teknikal penuh diperlukan.'}`,
      labourCost: 0,
      partsCost: 0,
      totalCost: 0,
      sellingPrice: 0,
      hasDiagnosis: false,
      repairStatus: 'RECEIVED',
      quotationStatus: 'PENDING',
      notes: bookNotes.trim()
    });

    setIsSubmittingBooking(false);

    if (newJob) {
      setBookingSuccessJob(newJob);
      setSearchedJob(newJob);
      setHasSearched(true);
      setSearchQuery(newJob.id);
      showToast(`Permohonan servis ${newJob.id} berjaya dihantar!`, 'success');
    }
  };

  // Accessories list from inventory
  const accessories = (inventory || []).filter(item => 
    item.category === 'Smartphone Accessories' &&
    (item.name.toLowerCase().includes(accSearch.toLowerCase()) || item.brand?.toLowerCase().includes(accSearch.toLowerCase()))
  );

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-24 shadow-2xl border-x border-cyan-500/20">
      
      {/* ================= TOP BAR ================= */}
      <div className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md px-4 py-3 border-b border-cyan-500/30 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => switchSystemMode('MAIN')}
            className="p-2 rounded-xl bg-slate-800 text-cyan-400 hover:bg-slate-700 transition cursor-pointer"
            title="Kembali ke Menu Paling Utama"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="bg-white p-1 rounded-xl shadow-xs">
            <img
              src={giatmaraLogo}
              alt="GIATMARA"
              className="h-7 w-auto object-contain"
              onError={(e) => { e.currentTarget.src = './logo.png'; }}
            />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-cyan-400 tracking-wide uppercase">
                TECHBYTE REPAIR
              </span>
              <span className="px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[9px] font-black">
                PAUTAN PELANGGAN
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-semibold leading-tight">
              Bengkel Baiki Smartphone • GIATMARA Kangar
            </p>
          </div>
        </div>

        {/* Live MQTT Status Pill */}
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-[10px] font-bold">
          <span className={`w-2 h-2 rounded-full ${syncStatus === 'connected' ? 'bg-cyan-400 animate-pulse' : 'bg-amber-400'}`}></span>
          <span className="text-slate-300 hidden xs:inline">
            {syncStatus === 'connected' ? 'Live Sync' : 'Menghubung'}
          </span>
        </div>
      </div>

      {/* ================= TOP TABS SWITCHER (TRACKER / BOOKING / ACC) ================= */}
      <div className="p-3 bg-slate-900/60 border-b border-slate-800 shrink-0">
        <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('tracker')}
            className={`py-2 px-1 text-center rounded-xl text-xs font-black transition cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1 ${
              activeTab === 'tracker'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Semak Status</span>
          </button>

          <button
            onClick={() => setActiveTab('booking')}
            className={`py-2 px-1 text-center rounded-xl text-xs font-black transition cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1 ${
              activeTab === 'booking'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Daftar Baiki</span>
          </button>

          <button
            onClick={() => setActiveTab('accessories')}
            className={`py-2 px-1 text-center rounded-xl text-xs font-black transition cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1 ${
              activeTab === 'accessories'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Aksesori</span>
          </button>
        </div>
      </div>

      {/* ================= TAB 1: SEMAKAN STATUS PEMBAIKAN (LIVE TRACKER) ================= */}
      {activeTab === 'tracker' && (
        <div className="p-4 space-y-4 animate-fade-in flex-1">
          
          {/* Hero Banner Card */}
          <div className="bg-gradient-to-br from-slate-900 via-blue-950/80 to-slate-900 border border-cyan-500/30 rounded-2xl p-4 shadow-xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-28 h-28 bg-cyan-500/15 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shrink-0">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wide">
                  Semak Status Baiki Telefon
                </h3>
                <p className="text-[11px] text-cyan-200/80">
                  Pantau kerja baikpulih telefon pintar anda secara terus & masa nyata.
                </p>
              </div>
            </div>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Masukkan No. Job (cth: REP-2026-00001) / No. Tel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-24 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:border-cyan-400 outline-none transition"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs shadow-md transition cursor-pointer"
              >
                Semak
              </button>
            </div>

            {/* Quick Demo Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 text-[11px] text-slate-400">
              <span className="text-[10px] uppercase font-bold text-slate-500 shrink-0">Contoh:</span>
              <button
                type="button"
                onClick={() => handleSelectDemoJob('REP-2026-00001')}
                className="px-2 py-0.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 font-mono font-bold border border-slate-800 shrink-0"
              >
                REP-2026-00001 (Ahmad)
              </button>
              <button
                type="button"
                onClick={() => handleSelectDemoJob('REP-2026-00002')}
                className="px-2 py-0.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 font-mono font-bold border border-slate-800 shrink-0"
              >
                REP-2026-00002 (Siti)
              </button>
            </div>
          </form>

          {/* Search Result Display */}
          {hasSearched && !searchedJob && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 text-center space-y-2 animate-fade-in">
              <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
              <h4 className="text-xs font-bold text-white">Tiada Rekod Dijumpai</h4>
              <p className="text-[11px] text-slate-400">
                Sila pastikan nombor rujukan job atau nombor telefon adalah sama seperti yang didaftarkan semasa penyerahan telefon.
              </p>
            </div>
          )}

          {searchedJob && (
            <div className="space-y-4 animate-fade-in">
              
              {/* Job Card Overview */}
              <div className="bg-slate-900 rounded-2xl border border-cyan-500/40 p-4 shadow-xl space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-black">
                      {searchedJob.id}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(searchedJob.dateReceived).toLocaleDateString('ms-MY')}
                    </span>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    searchedJob.repairStatus === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                    searchedJob.repairStatus === 'READY' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse' :
                    searchedJob.repairStatus === 'REPAIRING' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {searchedJob.repairStatus}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-black text-white">
                    {searchedJob.deviceBrand} {searchedJob.deviceModel}
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Pemilik: <strong>{searchedJob.customerName}</strong> ({searchedJob.customerPhone})
                  </p>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Masalah Diperiksa:</span>
                    <span className="font-bold text-rose-400">{searchedJob.damageType}</span>
                  </div>
                  {searchedJob.diagnosis && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Diagnosis Juruteknik:</span>
                      <span className="font-semibold text-slate-200 text-right">{searchedJob.diagnosis}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-1.5 border-t border-slate-800 font-bold">
                    <span className="text-slate-300">Caj Pembaikan:</span>
                    {searchedJob.hasDiagnosis || (searchedJob.repairStatus !== 'RECEIVED' && Number(searchedJob.sellingPrice) > 0) ? (
                      <span className="text-cyan-400 font-black text-sm">RM {searchedJob.sellingPrice?.toFixed(2) || '0.00'}</span>
                    ) : (
                      <span className="text-amber-400 font-bold text-[11px] bg-amber-950/60 border border-amber-500/40 px-2 py-0.5 rounded-lg">
                        ⏳ Menunggu Diagnosis & Sebut Harga
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Status Bayaran:</span>
                    <span className={`font-bold ${searchedJob.paymentStatus === 'PAID' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {searchedJob.paymentStatus === 'PAID' ? '✅ TELAH DIBAYAR' : '⏳ BELUM BAYAR (DI KAUNTER)'}
                    </span>
                  </div>
                </div>

                {/* Receipt button if paid */}
                {searchedJob.paymentStatus === 'PAID' && (
                  <button
                    onClick={() => openReceipt({ type: 'REPAIR', job: searchedJob })}
                    className="w-full py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>Papar Resit Rasmi & Kad Waranti</span>
                  </button>
                )}

                {/* Customer Edit or Lock Indicator */}
                {searchedJob.repairStatus === 'RECEIVED' ? (
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => handleOpenCustomerEdit(searchedJob)}
                      className="w-full py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Kemaskini / Edit Butiran Permohonan</span>
                    </button>
                    <p className="text-[10px] text-cyan-200/70 text-center mt-1">
                      💡 Anda boleh mengemas kini data sekiranya berlaku kesilapan sebelum proses diagnosis bermula.
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
                    <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                      <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" />
                      <span>Pindaan Data Terkunci (Fasa {searchedJob.repairStatus})</span>
                    </div>
                    <p className="text-[10px] leading-tight text-slate-400">
                      Status pembaikan telah mencapai tahap pemeriksaan/kerja pembaikan. Pelanggan tidak dibenarkan mengedit permohonan secara kendiri lagi. Sila maklumkan kepada admin/juruteknik kaunter jika terdapat sebarang kesilapan data.
                    </p>
                  </div>
                )}
              </div>

              {/* Live Timeline Stepper */}
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-black text-white flex items-center gap-1.5 uppercase">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Kemajuan Kerja Pembaikan</span>
                  </span>
                  <span className="text-[10px] text-cyan-400 font-bold font-mono">
                    Langkah {currentStepIndex + 1} / {steps.length}
                  </span>
                </div>

                <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                  {steps.map((step, idx) => {
                    const isDone = currentStepIndex > idx;
                    const isCurrent = currentStepIndex === idx;
                    const isPending = currentStepIndex < idx;

                    return (
                      <div key={step.key} className="flex items-start gap-3 relative z-10">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 transition ${
                          isDone ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/30 shadow-md' :
                          isCurrent ? 'bg-cyan-400 text-slate-950 ring-4 ring-cyan-500/20 animate-pulse font-black' :
                          'bg-slate-800 text-slate-500 border border-slate-700'
                        }`}>
                          {isDone ? '✓' : idx + 1}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-black ${
                            isCurrent ? 'text-cyan-400' : isDone ? 'text-emerald-300' : 'text-slate-500'
                          }`}>
                            {step.label} {isCurrent && <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 ml-1">Kini</span>}
                          </p>
                          <p className="text-[10px] text-slate-400 leading-tight">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* ================= TAB 2: DAFTAR SERVIS BAIKI BARU (BOOKING) ================= */}
      {activeTab === 'booking' && (
        <div className="p-4 space-y-4 animate-fade-in flex-1">
          
          <div className="bg-gradient-to-br from-slate-900 via-blue-950/80 to-slate-900 border border-cyan-500/30 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shrink-0">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wide">
                  Daftar Permohonan Servis Telefon
                </h3>
                <p className="text-[11px] text-cyan-200/80">
                  Hantar maklumat kerosakan peranti untuk semakan & diagnosis juruteknik GIATMARA.
                </p>
              </div>
            </div>
          </div>

          {bookingSuccessJob && (
            <div className="bg-emerald-950/80 border border-emerald-500/50 rounded-2xl p-4 space-y-2 animate-fade-in">
              <div className="flex items-center gap-2 text-emerald-300 font-black text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Pendaftaran Berjaya! No. Rujukan:</span>
              </div>
              <p className="text-lg font-mono font-black text-white">
                {bookingSuccessJob.id}
              </p>
              <p className="text-[11px] text-emerald-200/90 leading-relaxed">
                Sila simpan nombor ini dan bawa peranti anda ke bengkel <strong>GIATMARA Kangar</strong>. Anda boleh menjejak status kemajuan pada bila-bila masa di tab "Semak Status".
              </p>
              <button
                type="button"
                onClick={() => {
                  setBookingSuccessJob(null);
                  setActiveTab('tracker');
                }}
                className="w-full py-2 mt-1 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md transition"
              >
                Lihat Kemajuan Job Ini →
              </button>
            </div>
          )}

          <form onSubmit={handleBookingSubmit} className="bg-slate-900 rounded-2xl border border-slate-800 p-4 space-y-3 shadow-xl">
            <h4 className="text-xs font-black text-white uppercase tracking-wider pb-2 border-b border-slate-800">
              Maklumat Pemilik & Telefon
            </h4>

            {/* Nama & Telefon */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">Nama Pelanggan:</label>
              <input
                type="text"
                required
                placeholder="Nama Penuh (cth: Roslan bin Ahmad)"
                value={bookName}
                onChange={(e) => setBookName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white outline-none focus:border-cyan-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">Nombor Telefon / WhatsApp:</label>
              <input
                type="tel"
                required
                placeholder="cth: 012-3456789"
                value={bookPhone}
                onChange={(e) => setBookPhone(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white outline-none focus:border-cyan-400"
              />
            </div>

            {/* Jenama & Model */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">Jenama Telefon:</label>
                <select
                  value={bookBrand}
                  onChange={(e) => setBookBrand(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-bold text-white outline-none focus:border-cyan-400 cursor-pointer shadow-inner"
                  style={{ color: '#ffffff', backgroundColor: '#020617' }}
                >
                  <option value="Apple" className="bg-slate-900 text-white py-1">Apple iPhone</option>
                  <option value="Samsung" className="bg-slate-900 text-white py-1">Samsung</option>
                  <option value="Xiaomi" className="bg-slate-900 text-white py-1">Xiaomi / Redmi</option>
                  <option value="Oppo" className="bg-slate-900 text-white py-1">Oppo</option>
                  <option value="Vivo" className="bg-slate-900 text-white py-1">Vivo</option>
                  <option value="Realme" className="bg-slate-900 text-white py-1">Realme</option>
                  <option value="Huawei" className="bg-slate-900 text-white py-1">Huawei / Honor</option>
                  <option value="Lain-lain" className="bg-slate-900 text-white py-1">Lain-lain Jenama</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">Model Telefon:</label>
                <input
                  type="text"
                  required
                  placeholder="cth: iPhone 13, A54"
                  value={bookModel}
                  onChange={(e) => setBookModel(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Kategori Kerosakan */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">Jenis Kerosakan Utama:</label>
              <select
                value={bookDamage}
                onChange={(e) => setBookDamage(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-bold text-white outline-none focus:border-cyan-400 cursor-pointer shadow-inner"
                style={{ color: '#ffffff', backgroundColor: '#020617' }}
              >
                <option value="Skrin Pecah / LCD Blank" className="bg-slate-900 text-white py-1">Skrin Pecah / LCD Blank / Sentuhan Rosak</option>
                <option value="Bateri Rosak / Cepat Habis" className="bg-slate-900 text-white py-1">Bateri Cepat Habis / Kembung</option>
                <option value="Masuk Air (Water Damage)" className="bg-slate-900 text-white py-1">Masuk Air (Water Damage)</option>
                <option value="Port Pengecasan Tidak Boleh Caj" className="bg-slate-900 text-white py-1">Port Pengecasan Tidak Masuk / Rosak</option>
                <option value="Kamera Depan / Belakang Rosak" className="bg-slate-900 text-white py-1">Kamera Depan / Belakang Rosak</option>
                <option value="Speaker / Mic / Audio Rosak" className="bg-slate-900 text-white py-1">Speaker / Mic / Tiada Bunyi</option>
                <option value="Masalah Motherboard / IC" className="bg-slate-900 text-white py-1">Mati Total / Masalah Motherboard</option>
                <option value="Lain-lain Kerosakan" className="bg-slate-900 text-white py-1">Lain-lain Masalah</option>
              </select>
            </div>

            {/* Nota Tambahan */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">Penerangan Simptom / Catatan Tambahan:</label>
              <textarea
                rows={2}
                placeholder="cth: Jatuh semalam, skrin tak menyala tapi bergetar..."
                value={bookNotes}
                onChange={(e) => setBookNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white outline-none focus:border-cyan-400"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingBooking}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider shadow-lg transition cursor-pointer"
            >
              {isSubmittingBooking ? 'Menghantar...' : 'Hantar Permohonan Baiki'}
            </button>
          </form>

        </div>
      )}

      {/* ================= TAB 3: KATALOG AKSESORI TELEFON ================= */}
      {activeTab === 'accessories' && (() => {
        const isDiscountActive = Boolean(accessoryDiscount?.isActive && Number(accessoryDiscount?.percentage) > 0);
        const discountPercentage = isDiscountActive ? Number(accessoryDiscount.percentage) : 0;
        const getDiscountedPrice = (price) => isDiscountActive ? Math.max(0, price * (1 - discountPercentage / 100)) : price;

        return (
          <div className="p-4 space-y-4 animate-fade-in flex-1">
            
            {/* PROMINENT TAWARAN DISKAUN & JUALAN MURAH BANNER (DIBESARKAN UNTUK MENARIK MINAT PELANGGAN) */}
            {isDiscountActive ? (
              <div className="bg-gradient-to-r from-amber-500 via-rose-600 to-indigo-900 border-2 border-amber-300 rounded-3xl p-5 shadow-2xl relative overflow-hidden animate-fade-in">
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-amber-200 text-[10px] font-black uppercase tracking-wider">
                      <Flame className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
                      <span>TAWARAN DISKAUN & JUALAN MURAH</span>
                    </div>
                    {/* Teks Tajuk Tawaran Diskaun Dibesarkan dengan font yang menarik */}
                    <h2 className="text-xl sm:text-2xl font-black text-amber-300 tracking-tight drop-shadow-md leading-tight">
                      {accessoryDiscount.title || 'PROMOSI JUALAN MURAH AKSESORI!'}
                    </h2>
                    <p className="text-xs text-amber-100 font-medium leading-snug">
                      {accessoryDiscount.description || 'Dapatkan pelbagai pilihan aksesori telefon tulen & berkualiti pada harga promosi jimat berganda.'}
                    </p>
                  </div>

                  <div className="text-center bg-slate-950/50 backdrop-blur-md p-3.5 rounded-2xl border border-amber-300/40 shrink-0">
                    <span className="block text-3xl sm:text-4xl font-black text-amber-300 leading-none drop-shadow-lg">
                      {discountPercentage}%
                    </span>
                    <span className="text-[9px] font-black text-white uppercase tracking-wider block mt-1">
                      DISKAUN
                    </span>
                    <span className="text-[8px] text-amber-200 font-semibold block">
                      Semua Item
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-slate-900 via-blue-950/80 to-slate-900 border border-cyan-500/30 rounded-2xl p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shrink-0">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-wide">
                      Aksesori & Alat Ganti Telefon
                    </h3>
                    <p className="text-[11px] text-cyan-200/80">
                      Koleksi aksesori berkualiti tinggi tersedia di kaunter TRIG GIATMARA Kangar.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Search Box */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari kabel, casing, charger, powerbank..."
                value={accSearch}
                onChange={(e) => setAccSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400"
              />
            </div>

            {/* Accessories Grid */}
            <div className="space-y-2.5">
              {accessories.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 bg-slate-900 rounded-2xl border border-slate-800">
                  Tiada aksesori dijumpai.
                </div>
              ) : (
                accessories.map((acc) => {
                  const effectivePrice = getDiscountedPrice(acc.sellingPrice);
                  const hasDiscount = isDiscountActive && acc.sellingPrice > effectivePrice;

                  return (
                    <div
                      key={acc.id}
                      className={`bg-slate-900 p-3.5 rounded-2xl border transition flex items-center justify-between gap-3 shadow-md ${
                        hasDiscount ? 'border-amber-400/50 hover:border-amber-300' : 'border-slate-800 hover:border-cyan-500/50'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-11 h-11 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-xl shrink-0">
                          {acc.name.toLowerCase().includes('cable') || acc.name.toLowerCase().includes('kabel') ? '🔌' :
                           acc.name.toLowerCase().includes('case') ? '🛡️' :
                           acc.name.toLowerCase().includes('glass') ? '📱' :
                           acc.name.toLowerCase().includes('charger') ? '⚡' :
                           acc.name.toLowerCase().includes('power') ? '🔋' : '📦'}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-cyan-500/20 text-cyan-300 font-bold uppercase">
                              {acc.brand}
                            </span>
                            <span className="text-[9px] text-slate-500 font-mono">
                              {acc.sku}
                            </span>
                            {hasDiscount && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-rose-600 text-white font-black animate-pulse">
                                🔥 JIMAT {discountPercentage}%
                              </span>
                            )}
                          </div>
                          <h5 className="text-xs font-black text-white truncate mt-0.5">
                            {acc.name}
                          </h5>
                          <span className="text-[10px] text-slate-400 block truncate">
                            {acc.model} • Stok: {acc.currentStock || acc.quantity || 15} unit
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        {hasDiscount ? (
                          <div>
                            <span className="text-[10px] line-through text-slate-400 block font-mono">
                              RM {acc.sellingPrice?.toFixed(2)}
                            </span>
                            <span className="text-sm font-black text-amber-300 block font-mono">
                              RM {effectivePrice.toFixed(2)}
                            </span>
                            <span className="text-[9px] text-emerald-400 font-bold block">
                              Jimat RM {(acc.sellingPrice - effectivePrice).toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs font-black text-cyan-400 block font-mono">
                            RM {acc.sellingPrice?.toFixed(2)}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => showToast(`Sila kunjungi kaunter GIATMARA untuk membeli ${acc.name}.`, 'info')}
                          className={`mt-1.5 px-2.5 py-1 rounded-lg font-black text-[10px] transition cursor-pointer ${
                            hasDiscount
                              ? 'bg-gradient-to-r from-amber-400 to-rose-500 hover:from-amber-300 hover:to-rose-400 text-slate-950 shadow-md'
                              : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                          }`}
                        >
                          Beli di Kaunter
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>
        );
      })()}

      {/* ================= ANDROID BOTTOM NAVIGATION BAR ================= */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-cyan-500/30 py-2 px-4 shadow-2xl">
        <div className="max-w-md mx-auto grid grid-cols-3 gap-2">
          
          <button
            onClick={() => setActiveTab('tracker')}
            className={`py-1.5 flex flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-black transition cursor-pointer ${
              activeTab === 'tracker' ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Semak Status</span>
          </button>

          <button
            onClick={() => setActiveTab('booking')}
            className={`py-1.5 flex flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-black transition cursor-pointer ${
              activeTab === 'booking' ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Daftar Baiki</span>
          </button>

          <button
            onClick={() => setActiveTab('accessories')}
            className={`py-1.5 flex flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-black transition cursor-pointer ${
              activeTab === 'accessories' ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Aksesori</span>
          </button>

        </div>
      </div>

      {/* ================= MODAL 1: PERINGATAN PERMOHONAN PENDUA (DUPLICATE JOB ALERT) ================= */}
      {duplicateAlertJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-amber-500/50 rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl text-xs text-white animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black text-sm text-white">Permohonan Aktif Telah Wujud!</h4>
                <span className="text-[10px] text-amber-300 font-bold uppercase">Satu Job Sahaja Bagi Model Sama</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Anda telah pun menghantar permohonan servis untuk model telefon <strong className="text-cyan-300">{duplicateAlertJob.deviceBrand} {duplicateAlertJob.deviceModel}</strong> dengan rujukan:
              </p>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-cyan-500/30 font-mono">
                <span className="text-cyan-400 font-black text-xs">{duplicateAlertJob.id}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold uppercase">
                  {duplicateAlertJob.repairStatus}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Bagi mengelakkan pendaftaran berganda, pelanggan hanya dibenarkan menghantar satu permohonan untuk model telefon yang sama. Sekiranya terdapat kesilapan pengisian data, anda boleh mengemaskini maklumat tersebut di menu Semakan Status.
              </p>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  const targetJob = duplicateAlertJob;
                  setDuplicateAlertJob(null);
                  setSearchedJob(targetJob);
                  setSearchQuery(targetJob.id);
                  setHasSearched(true);
                  setActiveTab('tracker');
                  if (targetJob.repairStatus === 'RECEIVED') {
                    handleOpenCustomerEdit(targetJob);
                  }
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Lihat & Edit Job Ini ({duplicateAlertJob.id})</span>
              </button>

              <button
                type="button"
                onClick={() => setDuplicateAlertJob(null)}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition cursor-pointer"
              >
                Tutup / Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: KEMASKINI / EDIT PERMOHONAN PELANGGAN (CUSTOMER SELF-EDIT) ================= */}
      {isCustomerEditOpen && searchedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xs">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl p-5 max-w-md w-full space-y-4 shadow-2xl text-xs text-white animate-fade-in max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-white">Kemaskini Butiran Permohonan</h3>
                  <span className="text-[10px] text-cyan-400 font-mono font-bold">{searchedJob.id}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCustomerEditOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[11px] text-slate-400">
              Sila betulkan sebarang kesilapan pengisian data di bawah sebelum pemeriksaan teknikal dimulakan oleh pelatih GIATMARA.
            </p>

            <form onSubmit={handleSaveCustomerEdit} className="space-y-3">
              {/* Nama */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">Nama Pelanggan:</label>
                <input
                  type="text"
                  required
                  value={customerEditForm.name}
                  onChange={(e) => setCustomerEditForm({ ...customerEditForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white outline-none focus:border-cyan-400 font-medium"
                />
              </div>

              {/* No Tel */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">Nombor Telefon / WhatsApp:</label>
                <input
                  type="tel"
                  required
                  value={customerEditForm.phone}
                  onChange={(e) => setCustomerEditForm({ ...customerEditForm, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white outline-none focus:border-cyan-400 font-medium"
                />
              </div>

              {/* Jenama & Model */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">Jenama Telefon:</label>
                  <select
                    value={customerEditForm.brand}
                    onChange={(e) => setCustomerEditForm({ ...customerEditForm, brand: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-bold text-white outline-none focus:border-cyan-400 cursor-pointer"
                    style={{ color: '#ffffff', backgroundColor: '#020617' }}
                  >
                    <option value="Apple" className="bg-slate-900 text-white">Apple iPhone</option>
                    <option value="Samsung" className="bg-slate-900 text-white">Samsung</option>
                    <option value="Xiaomi" className="bg-slate-900 text-white">Xiaomi / Redmi</option>
                    <option value="Oppo" className="bg-slate-900 text-white">Oppo</option>
                    <option value="Vivo" className="bg-slate-900 text-white">Vivo</option>
                    <option value="Realme" className="bg-slate-900 text-white">Realme</option>
                    <option value="Huawei" className="bg-slate-900 text-white">Huawei / Honor</option>
                    <option value="Lain-lain" className="bg-slate-900 text-white">Lain-lain Jenama</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300">Model Telefon:</label>
                  <input
                    type="text"
                    required
                    value={customerEditForm.model}
                    onChange={(e) => setCustomerEditForm({ ...customerEditForm, model: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white outline-none focus:border-cyan-400 font-medium"
                  />
                </div>
              </div>

              {/* Kerosakan */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">Jenis Kerosakan Utama:</label>
                <select
                  value={customerEditForm.damage}
                  onChange={(e) => setCustomerEditForm({ ...customerEditForm, damage: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-bold text-white outline-none focus:border-cyan-400 cursor-pointer"
                  style={{ color: '#ffffff', backgroundColor: '#020617' }}
                >
                  <option value="Skrin Pecah / LCD Blank" className="bg-slate-900 text-white">Skrin Pecah / LCD Blank / Sentuhan Rosak</option>
                  <option value="Bateri Rosak / Cepat Habis" className="bg-slate-900 text-white">Bateri Cepat Habis / Kembung</option>
                  <option value="Masuk Air (Water Damage)" className="bg-slate-900 text-white">Masuk Air (Water Damage)</option>
                  <option value="Port Pengecasan Tidak Boleh Caj" className="bg-slate-900 text-white">Port Pengecasan Tidak Masuk / Rosak</option>
                  <option value="Kamera Depan / Belakang Rosak" className="bg-slate-900 text-white">Kamera Depan / Belakang Rosak</option>
                  <option value="Speaker / Mic / Audio Rosak" className="bg-slate-900 text-white">Speaker / Mic / Tiada Bunyi</option>
                  <option value="Masalah Motherboard / IC" className="bg-slate-900 text-white">Mati Total / Masalah Motherboard</option>
                  <option value="Lain-lain Kerosakan" className="bg-slate-900 text-white">Lain-lain Masalah</option>
                </select>
              </div>

              {/* Catatan / Simptom */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">Penerangan Simptom / Catatan Tambahan:</label>
                <textarea
                  rows={2}
                  value={customerEditForm.notes}
                  onChange={(e) => setCustomerEditForm({ ...customerEditForm, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white outline-none focus:border-cyan-400 font-medium"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-md transition cursor-pointer"
                >
                  Simpan Pembetulan
                </button>
                <button
                  type="button"
                  onClick={() => setIsCustomerEditOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition cursor-pointer"
                >
                  Batal
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
