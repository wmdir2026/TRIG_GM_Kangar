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
  ArrowLeft,
  ShoppingBag,
  Package,
  Tag,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Info,
  Edit2,
  AlertTriangle,
  X,
  Flame,
  Percent
} from 'lucide-react';

export const CustomerRepairTracker = () => {
  const {
    repairJobs,
    createRepairJob,
    updateRepairJob,
    inventory,
    openReceipt,
    settings,
    switchSystemMode,
    setCurrentTab,
    showToast,
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
      if (typeof showToast === 'function') {
        showToast(`Pindaan data terkunci kerana status telah masuk ke fasa ${job.repairStatus}.`, 'error');
      }
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
      if (typeof showToast === 'function') {
        showToast('Sila lengkapkan nama, telefon dan model telefon anda.', 'warning');
      }
      return;
    }

    if (!searchedJob) return;

    if (searchedJob.repairStatus !== 'RECEIVED') {
      if (typeof showToast === 'function') {
        showToast('Pindaan tidak dibenarkan kerana status telah masuk ke fasa pemeriksaan/diagnosis.', 'error');
      }
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

    if (typeof updateRepairJob === 'function') {
      updateRepairJob(searchedJob.id, updatedData);
    }
    setSearchedJob(prev => ({ ...prev, ...updatedData }));
    setIsCustomerEditOpen(false);
    if (typeof showToast === 'function') {
      showToast(`Butiran permohonan ${searchedJob.id} berjaya dikemaskini!`, 'success');
    }
  };

  // Accessories Search & Filter
  const [accSearch, setAccSearch] = useState('');

  // Handle Search
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
      if (typeof showToast === 'function') showToast('Tiada rekod pembaikan dijumpai.', 'warning');
    } else {
      if (typeof showToast === 'function') showToast(`Rekod ${found.id} dijumpai!`, 'info');
    }
  };

  // Quick Demo Search
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
    { key: 'READY', label: 'Sedia Ambil', desc: 'Siap & sedia diambil' },
    { key: 'COMPLETED', label: 'Selesai', desc: 'Diserahkan kepada pemilik' }
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

  // Handle New Booking Submission
  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!bookName.trim() || !bookPhone.trim() || !bookModel.trim()) {
      if (typeof showToast === 'function') {
        showToast('Sila lengkapkan nama, nombor telefon dan model telefon anda.', 'warning');
      }
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
      if (typeof showToast === 'function') {
        showToast(`Permohonan servis untuk model ${existingDuplicateJob.deviceModel} telah wujud (${existingDuplicateJob.id})!`, 'warning');
      }
      return;
    }

    setIsSubmittingBooking(true);

    let newJob = null;
    if (typeof createRepairJob === 'function') {
      newJob = createRepairJob({
        customerName: bookName.trim(),
        customerPhone: bookPhone.trim(),
        deviceBrand: bookBrand,
        deviceModel: bookModel.trim(),
        damageType: bookDamage,
        problemReported: `${bookDamage}${bookNotes.trim() ? ` - ${bookNotes.trim()}` : ''}`,
        diagnosis: `Pendaftaran Dalam Talian (Portal Web Pelanggan): ${bookNotes.trim() || 'Pemeriksaan teknikal penuh diperlukan.'}`,
        labourCost: 0,
        partsCost: 0,
        totalCost: 0,
        sellingPrice: 0,
        hasDiagnosis: false,
        repairStatus: 'RECEIVED',
        quotationStatus: 'PENDING',
        notes: bookNotes.trim()
      });
    }

    setIsSubmittingBooking(false);

    if (newJob) {
      setBookingSuccessJob(newJob);
      setSearchedJob(newJob);
      setHasSearched(true);
      setSearchQuery(newJob.id);
      if (typeof showToast === 'function') {
        showToast(`Permohonan servis ${newJob.id} berjaya dihantar!`, 'success');
      }
    }
  };

  // Filter accessories list from inventory
  const accessories = (inventory || []).filter(item => 
    item.category === 'Smartphone Accessories' &&
    (item.name.toLowerCase().includes(accSearch.toLowerCase()) || item.brand?.toLowerCase().includes(accSearch.toLowerCase()))
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-16 px-3 sm:px-4">
      
      {/* ================= HEADER CARD ================= */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-cyan-500/30 text-white p-5 sm:p-6 rounded-3xl shadow-2xl text-center space-y-4 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Back & Brand Bar */}
        <div className="flex flex-wrap items-center justify-between pb-4 border-b border-white/10 gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-2xl shadow-md shrink-0">
              <img
                src={giatmaraLogo}
                alt="GIATMARA Logo"
                className="h-9 w-auto object-contain"
                onError={(e) => { e.currentTarget.src = './logo.png'; }}
              />
            </div>
            <div className="text-left">
              <span className="text-sm sm:text-base font-black text-amber-400 font-['Cabinet_Grotesk',sans-serif] tracking-wider uppercase block leading-tight">
                TECHBYTE & FELÌCE CAFFÉ
              </span>
              <span className="text-[11px] font-extrabold text-white tracking-tight uppercase leading-tight block">
                TRIG GIATMARA KANGAR
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentTab('customer-repair-phone-app')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-black transition cursor-pointer shadow-md"
              title="Buka Aplikasi Telefon Pintar (Format Android Phone)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Apps Baiki Telefon</span>
            </button>

            <button
              onClick={() => switchSystemMode('MAIN')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-black transition cursor-pointer shadow-md"
              title="Kembali ke Menu Paling Utama"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Menu Utama</span>
            </button>
          </div>
        </div>

        {/* Dynamic Title based on Active Tab */}
        <div className="space-y-1.5 pt-1">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 mx-auto flex items-center justify-center text-cyan-300 shadow-lg">
            {activeTab === 'tracker' && <Smartphone className="w-6 h-6" />}
            {activeTab === 'booking' && <Wrench className="w-6 h-6" />}
            {activeTab === 'accessories' && <ShoppingBag className="w-6 h-6" />}
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase">
            {activeTab === 'tracker' && 'SEMAKAN STATUS PEMBAIKAN TELEFON PINTAR'}
            {activeTab === 'booking' && 'DAFTAR PERMOHONAN SERVIS TELEFON'}
            {activeTab === 'accessories' && 'KATALOG AKSESORI & ALAT GANTI TELEFON'}
          </h1>
          <p className="text-xs text-cyan-200/90 max-w-xl mx-auto leading-relaxed">
            {activeTab === 'tracker' && 'Masukkan No. Job Baiki (cth: REP-2026-00001) atau No. Telefon untuk semakan diagnosis dan status siap secara masa nyata.'}
            {activeTab === 'booking' && 'Hantar maklumat kerosakan peranti anda untuk semakan diagnosis dan anggaran sebut harga juruteknik GIATMARA Kangar.'}
            {activeTab === 'accessories' && 'Koleksi aksesori tulen berkualiti tinggi dan alat ganti tersedia di kaunter TECHBYTE GIATMARA Kangar.'}
          </p>
        </div>
      </div>

      {/* ================= 3 CORE TABS SWITCHER ================= */}
      <div className="bg-slate-900/95 border border-slate-800 p-1.5 rounded-2xl shadow-xl">
        <div className="grid grid-cols-3 gap-2">
          
          {/* TAB 1 BUTTON: SEMAK STATUS */}
          <button
            type="button"
            onClick={() => setActiveTab('tracker')}
            className={`py-3 px-3 sm:px-5 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'tracker'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Search className="w-4 h-4 shrink-0" />
            <span>Semak Status</span>
          </button>

          {/* TAB 2 BUTTON: DAFTAR BAIKI */}
          <button
            type="button"
            onClick={() => setActiveTab('booking')}
            className={`py-3 px-3 sm:px-5 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'booking'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Wrench className="w-4 h-4 shrink-0" />
            <span>Daftar Baiki</span>
          </button>

          {/* TAB 3 BUTTON: AKSESORI */}
          <button
            type="button"
            onClick={() => setActiveTab('accessories')}
            className={`py-3 px-3 sm:px-5 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'accessories'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span>Aksesori</span>
          </button>

        </div>
      </div>

      {/* ================= TAB 1 CONTENT: SEMAKAN STATUS PEMBAIKAN ================= */}
      {activeTab === 'tracker' && (
        <div className="space-y-5 animate-fade-in">
          
          {/* Search Bar Form */}
          <form onSubmit={handleSearch} className="bg-slate-900/90 border border-slate-800 p-2 sm:p-2.5 rounded-3xl shadow-xl flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                placeholder="Masukkan No Job (REP-2026-00001) atau No Telefon (019-4567812)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 text-xs sm:text-sm bg-slate-950 border border-slate-700 rounded-2xl outline-none font-bold text-white placeholder-slate-400 focus:border-cyan-400 transition"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-2xl text-xs sm:text-sm font-black shadow-lg transition cursor-pointer shrink-0"
            >
              Semak Status
            </button>
          </form>

          {/* Quick Demo Suggestions */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-slate-500">Contoh untuk demo:</span>
            <button
              type="button"
              onClick={() => handleSelectDemoJob('REP-2026-00001')}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl font-mono font-bold text-cyan-300 transition cursor-pointer"
            >
              REP-2026-00001 (Ahmad)
            </button>
            <button
              type="button"
              onClick={() => handleSelectDemoJob('REP-2026-00002')}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl font-mono font-bold text-cyan-300 transition cursor-pointer"
            >
              REP-2026-00002 (Siti Sarah)
            </button>
          </div>

          {/* Result Display: Not Found */}
          {hasSearched && !searchedJob && (
            <div className="bg-slate-900/90 p-8 rounded-3xl border border-slate-800 text-center space-y-2 animate-fade-in shadow-xl">
              <AlertCircle className="w-9 h-9 text-amber-400 mx-auto" />
              <p className="font-bold text-white text-sm sm:text-base">Tiada Rekod Pembaikan Dijumpai</p>
              <p className="text-slate-400 text-xs max-w-md mx-auto">
                Sila pastikan No. Job (cth: REP-2026-00001) atau nombor telefon yang dimasukkan adalah sama seperti yang didaftarkan semasa penyerahan telefon.
              </p>
            </div>
          )}

          {/* Result Display: Job Found */}
          {searchedJob && (
            <div className="bg-slate-900/95 rounded-3xl border border-cyan-500/30 p-6 shadow-2xl space-y-6 animate-fade-in text-xs">
              
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-800 gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 font-mono font-black text-xs border border-cyan-500/40">
                      {searchedJob.id}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Tarikh Diterima: {new Date(searchedJob.dateReceived).toLocaleDateString('ms-MY')}
                    </span>
                  </div>
                  <h2 className="font-black text-white text-lg sm:text-xl mt-1">
                    {searchedJob.deviceBrand} {searchedJob.deviceModel}
                  </h2>
                  <p className="text-slate-400 text-xs">
                    Pemilik: <span className="font-bold text-white">{searchedJob.customerName}</span> ({searchedJob.customerPhone})
                  </p>
                </div>

                <div className="sm:text-right">
                  <span className={`inline-block px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                    searchedJob.repairStatus === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                    searchedJob.repairStatus === 'READY' || searchedJob.repairStatus === 'READY FOR COLLECTION' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse' :
                    searchedJob.repairStatus === 'REPAIRING' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                    'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}>
                    {searchedJob.repairStatus}
                  </span>
                </div>
              </div>

              {/* Visual Progress Stepper (7-Stage Full Progression) */}
              <div className="space-y-3">
                <p className="font-black text-cyan-300 uppercase tracking-wider text-[11px] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span>KEMAJUAN PROSES PEMBAIKAN (LANGKAH {currentStepIndex + 1} / {steps.length})</span>
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                  {steps.map((step, idx) => {
                    const isDone = currentStepIndex > idx;
                    const isCurrent = currentStepIndex === idx;

                    return (
                      <div
                        key={step.key}
                        className={`p-3 rounded-2xl border text-center transition ${
                          isCurrent
                            ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-400/50'
                            : isDone
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                            : 'bg-slate-950/60 border-slate-800 text-slate-500'
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-full mx-auto mb-1.5 flex items-center justify-center font-black text-xs ${
                          isCurrent
                            ? 'bg-cyan-400 text-slate-950 shadow-md font-black'
                            : isDone
                            ? 'bg-emerald-500 text-slate-950 font-black'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {isDone ? '✓' : idx + 1}
                        </div>
                        <span className="font-extrabold block text-xs truncate">{step.label}</span>
                        <span className="text-[10px] text-slate-400 block line-clamp-1 mt-0.5">{step.desc}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Job Details Card */}
              <div className="p-4 sm:p-5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Masalah Diperiksa:</span>
                  <span className="font-bold text-rose-400">{searchedJob.damageType}</span>
                </div>
                {searchedJob.diagnosis && (
                  <div className="flex justify-between items-start text-xs pt-1 border-t border-slate-800/80">
                    <span className="text-slate-400">Diagnosis Juruteknik:</span>
                    <span className="font-medium text-slate-200 text-right max-w-sm">{searchedJob.diagnosis}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-sm">
                  <span className="font-black text-white">Jumlah Caj Pembaikan:</span>
                  {searchedJob.hasDiagnosis || (searchedJob.repairStatus !== 'RECEIVED' && Number(searchedJob.sellingPrice) > 0) ? (
                    <span className="font-black text-cyan-400 font-mono text-base">RM {searchedJob.sellingPrice?.toFixed(2)}</span>
                  ) : (
                    <span className="text-amber-400 font-bold text-xs bg-amber-950/60 border border-amber-500/40 px-2.5 py-1 rounded-lg">
                      ⏳ Menunggu Diagnosis & Sebut Harga
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-center text-[11px] pt-1">
                  <span className="text-slate-400">Status Bayaran:</span>
                  <span className={`font-black ${searchedJob.paymentStatus === 'PAID' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {searchedJob.paymentStatus === 'PAID' ? 'TELAH DIBAYAR (LULUS)' : 'BELUM BAYAR (SEMASA KUTIPAN)'}
                  </span>
                </div>
              </div>

              {/* Receipt Action if Paid */}
              {searchedJob.paymentStatus === 'PAID' && (
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => openReceipt({ type: 'REPAIR', job: searchedJob })}
                    className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-xl font-bold text-xs shadow-lg transition flex items-center gap-2 cursor-pointer"
                  >
                    <Receipt className="w-4 h-4" />
                    <span>Lihat & Cetak Resit Rasmi</span>
                  </button>
                </div>
              )}

              {/* Customer Edit or Lock Indicator */}
              <div className="pt-3 border-t border-slate-800">
                {searchedJob.repairStatus === 'RECEIVED' ? (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-slate-950/60 rounded-2xl border border-cyan-500/30">
                    <div>
                      <p className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                        <Edit2 className="w-4 h-4 text-cyan-400" />
                        <span>Kesilapan Data Semasa Pendaftaran?</span>
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Anda dibenarkan membetulkan nama, telefon, model, atau kerosakan selagi status masih Diterima (RECEIVED).
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenCustomerEdit(searchedJob)}
                      className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 rounded-xl font-black text-xs transition cursor-pointer flex items-center gap-2 shrink-0 shadow-sm"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Kemaskini / Edit Butiran Permohonan</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 w-full space-y-1">
                    <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                      <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Pindaan Maklumat Terkunci (Fasa: {searchedJob.repairStatus})</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Status pembaikan telah melepasi fasa penerimaan awal dan kini dalam proses diagnosis / pembaikan teknikal. Sebarang pindaan maklumat tidak lagi boleh dilakukan secara kendiri oleh pelanggan. Sila berhubung terus dengan juruteknik atau admin kaunter sekiranya terdapat pembetulan data penting.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      )}

      {/* ================= TAB 2 CONTENT: DAFTAR PERMOHONAN SERVIS BAIKI ================= */}
      {activeTab === 'booking' && (
        <div className="space-y-5 animate-fade-in">
          
          {/* Booking Success Banner */}
          {bookingSuccessJob && (
            <div className="bg-emerald-950/80 border border-emerald-500/50 rounded-3xl p-5 space-y-3 animate-fade-in shadow-xl">
              <div className="flex items-center gap-2 text-emerald-300 font-black text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Pendaftaran Berjaya! No. Rujukan Job: {bookingSuccessJob.id}</span>
              </div>
              <p className="text-xs text-emerald-200/90 leading-relaxed">
                Permohonan pembaikan anda telah dimasukkan ke dalam sistem. Sila serahkan peranti di kaunter TECHBYTE GIATMARA Kangar bersama nombor rujukan ini untuk pemeriksaan teknikal lanjut.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('tracker');
                  setSearchQuery(bookingSuccessJob.id);
                  setSearchedJob(bookingSuccessJob);
                  setHasSearched(true);
                }}
                className="py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md transition cursor-pointer flex items-center gap-2"
              >
                <span>Lihat Status & Kemajuan Job Ini ({bookingSuccessJob.id})</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Booking Form Card */}
          <form onSubmit={handleBookingSubmit} className="bg-slate-900/95 rounded-3xl border border-slate-800 p-6 sm:p-7 space-y-5 shadow-2xl">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider">
                  Borang Permohonan Servis Baiki Peranti
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Isi maklumat peranti anda di bawah untuk diagnosis awal juruteknik.
                </p>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                Pantas & Telus
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Nama Pelanggan */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Nama Penuh Pelanggan *</label>
                <input
                  type="text"
                  required
                  placeholder="cth: Malik Dinar / Roslan Ahmad"
                  value={bookName}
                  onChange={(e) => setBookName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm font-bold text-white placeholder-slate-500 outline-none focus:border-cyan-400 transition"
                />
              </div>

              {/* No. Telefon */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Nombor Telefon / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  placeholder="cth: 012-3456789"
                  value={bookPhone}
                  onChange={(e) => setBookPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm font-bold text-white placeholder-slate-500 outline-none focus:border-cyan-400 transition"
                />
              </div>

              {/* Jenama Telefon */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Jenama Telefon *</label>
                <select
                  value={bookBrand}
                  onChange={(e) => setBookBrand(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm font-bold text-white outline-none focus:border-cyan-400 cursor-pointer shadow-inner"
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

              {/* Model Telefon */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Model Telefon *</label>
                <input
                  type="text"
                  required
                  placeholder="cth: iPhone 13 Pro, Galaxy A54, Poco F5"
                  value={bookModel}
                  onChange={(e) => setBookModel(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm font-bold text-white placeholder-slate-500 outline-none focus:border-cyan-400 transition"
                />
              </div>

            </div>

            {/* Jenis Kerosakan Utama */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Jenis Kerosakan Utama *</label>
              <select
                value={bookDamage}
                onChange={(e) => setBookDamage(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm font-bold text-white outline-none focus:border-cyan-400 cursor-pointer shadow-inner"
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

            {/* Penerangan Simptom / Catatan Tambahan */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Penerangan Simptom / Catatan Tambahan</label>
              <textarea
                rows={3}
                placeholder="cth: Telefon terjatuh semalam, skrin tiada paparan tetapi bergetar apabila dicas..."
                value={bookNotes}
                onChange={(e) => setBookNotes(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm font-medium text-white placeholder-slate-500 outline-none focus:border-cyan-400 transition"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmittingBooking}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-sm uppercase tracking-wider shadow-xl transition cursor-pointer"
            >
              {isSubmittingBooking ? 'Sedang Menghantar...' : 'Hantar Permohonan Baiki'}
            </button>
          </form>

        </div>
      )}

      {/* ================= TAB 3 CONTENT: KATALOG AKSESORI TELEFON ================= */}
      {activeTab === 'accessories' && (() => {
        const isDiscountActive = Boolean(accessoryDiscount?.isActive && Number(accessoryDiscount?.percentage) > 0);
        const discountPercentage = isDiscountActive ? Number(accessoryDiscount.percentage) : 0;
        const getDiscountedPrice = (price) => isDiscountActive ? Math.max(0, price * (1 - discountPercentage / 100)) : price;

        return (
          <div className="space-y-5 animate-fade-in">
            
            {/* PROMINENT TAWARAN DISKAUN & JUALAN MURAH BANNER (DIBESARKAN UNTUK MENARIK MINAT PELANGGAN) */}
            {isDiscountActive && (
              <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-500 via-rose-600 to-indigo-900 border-2 border-amber-300 text-white shadow-2xl relative overflow-hidden animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-amber-200 text-[10px] font-black uppercase tracking-wider">
                      <Flame className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
                      <span>TAWARAN DISKAUN & JUALAN MURAH</span>
                    </div>
                    {/* Teks Tawaran Diskaun Dibesarkan dengan font yang menarik */}
                    <h2 className="text-xl sm:text-2xl font-black text-amber-300 tracking-tight drop-shadow-md leading-tight">
                      {accessoryDiscount.title || 'PROMOSI JUALAN MURAH AKSESORI!'}
                    </h2>
                    <p className="text-xs sm:text-sm text-amber-100 font-medium leading-relaxed max-w-2xl">
                      {accessoryDiscount.description || 'Dapatkan pelbagai pilihan aksesori telefon tulen & berkualiti pada harga promosi jimat berganda di GIATMARA Kangar.'}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center sm:flex-col justify-end text-right bg-slate-950/50 backdrop-blur-md p-4 rounded-2xl border border-amber-300/40 min-w-[130px]">
                    <span className="block text-3xl sm:text-4xl font-black text-amber-300 leading-none drop-shadow-lg">
                      {discountPercentage}%
                    </span>
                    <span className="text-[10px] font-black text-white uppercase tracking-wider block mt-1">
                      DISKAUN HEBAT
                    </span>
                    <span className="text-[9px] text-amber-200/90 font-bold block">
                      Semua Aksesori
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Search Bar for Accessories */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari kabel, casing, charger, powerbank, screen protector..."
                value={accSearch}
                onChange={(e) => setAccSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs sm:text-sm font-medium text-white placeholder-slate-500 outline-none focus:border-cyan-400 shadow-xl transition"
              />
            </div>

            {/* Accessories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {accessories.length === 0 ? (
                <div className="col-span-full p-12 text-center text-xs text-slate-400 bg-slate-900/90 rounded-3xl border border-slate-800 space-y-2">
                  <ShoppingBag className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="font-bold text-white text-sm">Tiada Aksesori Dijumpai</p>
                  <p className="text-slate-500">Cuba kata kunci lain seperti kabel, charger atau casing.</p>
                </div>
              ) : (
                accessories.map((acc) => {
                  const effectivePrice = getDiscountedPrice(acc.sellingPrice);
                  const hasDiscount = isDiscountActive && acc.sellingPrice > effectivePrice;

                  return (
                    <div
                      key={acc.id}
                      className={`bg-slate-900/90 p-4 rounded-2xl border transition-all hover:scale-[1.01] flex flex-col justify-between gap-3 shadow-lg ${
                        hasDiscount ? 'border-amber-400/50 hover:border-amber-300 ring-1 ring-amber-400/20' : 'border-slate-800 hover:border-cyan-500/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                          {acc.name.toLowerCase().includes('cable') || acc.name.toLowerCase().includes('kabel') ? '🔌' :
                           acc.name.toLowerCase().includes('case') ? '🛡️' :
                           acc.name.toLowerCase().includes('glass') ? '📱' :
                           acc.name.toLowerCase().includes('charger') ? '⚡' :
                           acc.name.toLowerCase().includes('power') ? '🔋' : '📦'}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[9px] px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-extrabold uppercase border border-cyan-500/30">
                              {acc.brand || 'TECHBYTE'}
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
                          <h4 className="text-sm font-black text-white truncate mt-1">
                            {acc.name}
                          </h4>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">
                            {acc.model} • Stok: <strong className="text-slate-300">{acc.currentStock || acc.quantity || 15} unit</strong>
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-500 block">Harga Kaunter:</span>
                          {hasDiscount ? (
                            <div>
                              <span className="text-[10px] line-through text-slate-400 block font-mono">
                                RM {acc.sellingPrice?.toFixed(2)}
                              </span>
                              <span className="text-sm sm:text-base font-black text-amber-300 font-mono">
                                RM {effectivePrice.toFixed(2)}
                              </span>
                              <span className="text-[9px] text-emerald-400 font-bold block">
                                Jimat RM {(acc.sellingPrice - effectivePrice).toFixed(2)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm sm:text-base font-black text-cyan-400 font-mono">
                              RM {acc.sellingPrice?.toFixed(2)}
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => showToast(`Sila kunjungi kaunter GIATMARA Kangar untuk membeli ${acc.name}.`, 'info')}
                          className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition cursor-pointer shadow-md ${
                            hasDiscount
                              ? 'bg-gradient-to-r from-amber-400 to-rose-500 hover:from-amber-300 hover:to-rose-400 text-slate-950'
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

      {/* ================= MODAL 1: PERINGATAN PERMOHONAN PENDUA (DUPLICATE JOB ALERT) ================= */}
      {duplicateAlertJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-amber-500/50 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-xs text-white animate-fade-in">
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
          <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl text-xs text-white animate-fade-in max-h-[90vh] overflow-y-auto">
            
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
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
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
