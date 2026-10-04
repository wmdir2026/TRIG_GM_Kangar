import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext';
import {
  Wrench,
  Plus,
  Search,
  Filter,
  Smartphone,
  CheckCircle2,
  Clock,
  FileText,
  DollarSign,
  Receipt,
  Eye,
  AlertCircle,
  Play,
  Check,
  XCircle,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Edit2,
  Trash2,
  AlertTriangle,
  Lock,
  X
} from 'lucide-react';
import { NewRepairJobModal } from './NewRepairJobModal';
import { RepairDiagnosisModal } from './RepairDiagnosisModal';
import { QuotationModal } from './QuotationModal';

export const RepairJobsList = () => {
  const {
    currentUser,
    repairJobs,
    updateRepairJob,
    deleteRepairJob,
    updateRepairStatus,
    approveRepairQuotation,
    rejectRepairQuotation,
    payRepairJob,
    openReceipt,
    showToast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // RBAC Permission Check: Super Admin & Manager Smartphone Repair only
  const isAuthorizedToDelete = currentUser?.role === 'SUPER ADMIN' || currentUser?.role === 'MANAGER';

  // Helper to detect potential duplicate submissions (same customer phone/name & same device model)
  const getDuplicateJobs = (targetJob) => {
    if (!targetJob) return [];
    const cleanPhone = (targetJob.customerPhone || '').replace(/[^0-9]/g, '');
    const cleanName = (targetJob.customerName || '').trim().toLowerCase();
    const cleanModel = (targetJob.deviceModel || '').trim().toLowerCase();

    return (repairJobs || []).filter(j => {
      if (j.id === targetJob.id) return false;
      if (j.repairStatus === 'CANCELLED') return false;
      const jPhone = (j.customerPhone || '').replace(/[^0-9]/g, '');
      const samePhone = cleanPhone && jPhone && (cleanPhone === jPhone || cleanPhone.endsWith(jPhone) || jPhone.endsWith(cleanPhone));
      const sameName = cleanName && j.customerName && j.customerName.trim().toLowerCase() === cleanName;
      const sameModel = cleanModel && j.deviceModel && j.deviceModel.trim().toLowerCase() === cleanModel;
      return (samePhone || sameName) && sameModel;
    });
  };

  // Modals
  const [isNewJobModalOpen, setIsNewJobModalOpen] = useState(false);
  const [selectedJobForDiagnosis, setSelectedJobForDiagnosis] = useState(null);
  const [selectedJobForQuotation, setSelectedJobForQuotation] = useState(null);
  const [paymentJob, setPaymentJob] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('QR_PAYMENT');

  // Admin Edit Job Details Modal State (Admin can edit anytime if customer notifies errors)
  const [selectedJobForAdminEdit, setSelectedJobForAdminEdit] = useState(null);
  const [adminEditForm, setAdminEditForm] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    customerAddress: '',
    deviceBrand: 'Apple',
    deviceModel: '',
    deviceColor: '',
    imeiSerial: '',
    damageType: '',
    problemReported: '',
    diagnosis: '',
    labourCost: 0,
    sellingPrice: 0,
    notes: ''
  });

  // Delete Job Confirmation Dialog State
  const [jobToDelete, setJobToDelete] = useState(null);

  // Lock body scroll whenever an active modal is displayed
  useEffect(() => {
    if (selectedJobForAdminEdit || paymentJob || jobToDelete) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [selectedJobForAdminEdit, paymentJob, jobToDelete]);

  const handleOpenAdminEdit = (job) => {
    setSelectedJobForAdminEdit(job);
    setAdminEditForm({
      customerName: job.customerName || '',
      customerPhone: job.customerPhone || '',
      customerEmail: job.customerEmail || '',
      customerAddress: job.customerAddress || '',
      deviceBrand: job.deviceBrand || 'Apple',
      deviceModel: job.deviceModel || '',
      deviceColor: job.deviceColor || '',
      imeiSerial: job.imeiSerial || '',
      damageType: job.damageType || '',
      problemReported: job.problemReported || '',
      diagnosis: job.diagnosis || '',
      labourCost: job.labourCost || 0,
      sellingPrice: job.sellingPrice || 0,
      notes: job.notes || ''
    });
  };

  const handleSaveAdminEdit = (e) => {
    e.preventDefault();
    if (!selectedJobForAdminEdit) return;
    if (!adminEditForm.customerName.trim() || !adminEditForm.customerPhone.trim() || !adminEditForm.deviceModel.trim()) {
      showToast('Sila lengkapkan nama pelanggan, no. telefon dan model telefon.', 'warning');
      return;
    }

    updateRepairJob(selectedJobForAdminEdit.id, {
      customerName: adminEditForm.customerName.trim(),
      customerPhone: adminEditForm.customerPhone.trim(),
      customerEmail: adminEditForm.customerEmail.trim(),
      customerAddress: adminEditForm.customerAddress.trim(),
      deviceBrand: adminEditForm.deviceBrand,
      deviceModel: adminEditForm.deviceModel.trim(),
      deviceColor: adminEditForm.deviceColor.trim(),
      imeiSerial: adminEditForm.imeiSerial.trim(),
      damageType: adminEditForm.damageType,
      problemReported: adminEditForm.problemReported.trim(),
      diagnosis: adminEditForm.diagnosis.trim(),
      labourCost: Number(adminEditForm.labourCost || 0),
      sellingPrice: Number(adminEditForm.sellingPrice || 0),
      notes: adminEditForm.notes.trim()
    });

    setSelectedJobForAdminEdit(null);
    showToast(`Butiran job ${selectedJobForAdminEdit.id} berjaya dikemaskini oleh Admin.`, 'success');
  };

  const handleConfirmDeleteJob = () => {
    if (!jobToDelete) return;
    if (!isAuthorizedToDelete) {
      showToast('Akses Ditolak: Hanya Super Admin & Manager dibenarkan memadam job!', 'error');
      setJobToDelete(null);
      return;
    }
    deleteRepairJob(jobToDelete.id);
    setJobToDelete(null);
  };

  const duplicateJobsCount = (repairJobs || []).filter(j => getDuplicateJobs(j).length > 0).length;

  const filteredJobs = repairJobs.filter(job => {
    const matchesSearch =
      job.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.customerPhone.includes(searchQuery) ||
      job.deviceBrand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.deviceModel.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesStatus = true;
    if (filterStatus === 'DUPLICATES') {
      matchesStatus = getDuplicateJobs(job).length > 0;
    } else if (filterStatus !== 'ALL') {
      matchesStatus = job.repairStatus === filterStatus;
    }
    return matchesSearch && matchesStatus;
  });

  const handleNextStatus = (job) => {
    // Kunci langkah seterusnya sekiranya belum lengkap diagnosis & alat ganti
    if (!job.hasDiagnosis || Number(job.sellingPrice || 0) <= 0) {
      showToast('Langkah status seterusnya tidak aktif! Sila lengkapkan ruangan "Diagnosis & Alat Ganti" dan simpan sebut harga terlebih dahulu.', 'warning');
      return;
    }

    const flow = [
      'RECEIVED',
      'DIAGNOSIS',
      'QUOTATION',
      'REPAIRING',
      'TESTING',
      'READY FOR COLLECTION',
      'COMPLETED'
    ];
    const currentIndex = flow.indexOf(job.repairStatus);
    if (currentIndex !== -1 && currentIndex < flow.length - 1) {
      const next = flow[currentIndex + 1];
      updateRepairStatus(job.id, next);
    }
  };

  const handleOpenPayment = (job) => {
    setPaymentJob(job);
  };

  const handleConfirmPay = () => {
    if (!paymentJob) return;
    payRepairJob(paymentJob.id, paymentMethod);
    setPaymentJob(null);
  };

  const statusColors = {
    'RECEIVED': 'bg-slate-100 text-slate-700 border-slate-300',
    'DIAGNOSIS': 'bg-blue-100 text-blue-800 border-blue-300',
    'QUOTATION': 'bg-purple-100 text-purple-800 border-purple-300',
    'CUSTOMER APPROVAL': 'bg-purple-100 text-purple-800 border-purple-300',
    'REPAIRING': 'bg-amber-100 text-amber-800 border-amber-300',
    'TESTING': 'bg-cyan-100 text-cyan-800 border-cyan-300',
    'READY FOR COLLECTION': 'bg-emerald-100 text-emerald-800 border-emerald-300',
    'COMPLETED': 'bg-slate-200 text-slate-800 border-slate-300',
    'CANCELLED': 'bg-rose-100 text-rose-800 border-rose-300'
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-950 text-white p-6 rounded-3xl shadow-xl border border-blue-500/20">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-cyan-300 border border-cyan-400/30 text-xs font-bold mb-2">
            <Wrench className="w-3.5 h-3.5" />
            <span>KURSUS BAIKI SMARTPHONE • PLANET SERVICE TECH</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <span>JOB TICKETING & PEMBAIKAN</span>
            <span className="text-xs bg-cyan-400 text-slate-950 px-2 py-0.5 rounded-full font-black">DIAGNOSTIC SYSTEM</span>
          </h1>
          <p className="text-blue-200 text-xs sm:text-sm mt-1 max-w-xl">
            Pendaftaran peranti baharu, diagnosis kerosakan (Face ID, LCD, Bateri, Water Damage), sebut harga alat ganti & rekod jaminan.
          </p>
        </div>

        <button
          onClick={() => setIsNewJobModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 rounded-xl text-xs font-black shadow-lg shadow-cyan-500/20 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Terima Telefon Baru (Daftar Job)</span>
        </button>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari REP-2026-xxxxx, nama, jenama, model atau telefon..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
          >
            <option value="ALL">Semua Status Pembaikan</option>
            {duplicateJobsCount > 0 && (
              <option value="DUPLICATES">⚠️ Kemungkinan Job Pendua ({duplicateJobsCount})</option>
            )}
            <option value="RECEIVED">RECEIVED (Diterima)</option>
            <option value="DIAGNOSIS">DIAGNOSIS (Pemeriksaan)</option>
            <option value="QUOTATION">QUOTATION (Sebut Harga)</option>
            <option value="REPAIRING">REPAIRING (Dalam Kerja)</option>
            <option value="TESTING">TESTING (Ujian QC)</option>
            <option value="READY FOR COLLECTION">READY FOR COLLECTION (Sedia Diambil)</option>
            <option value="COMPLETED">COMPLETED (Selesai)</option>
            <option value="CANCELLED">CANCELLED (Dibatalkan)</option>
          </select>
        </div>
      </div>

      {/* Duplicate Jobs Warning Alert Banner */}
      {duplicateJobsCount > 0 && (
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-900 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 rounded-xl text-amber-700 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-black text-xs sm:text-sm text-amber-950 uppercase tracking-wide">
                ⚠️ Amaran: Dikesan {duplicateJobsCount} Job Berkemungkinan Pendua (Model & Pelanggan Sama)
              </h4>
              <p className="text-xs text-amber-800 mt-0.5">
                Sila semak butiran pembaikan untuk mengelakkan kerja baiki berganda. Hanya Super Admin & Pengurus (Manager) dibenarkan memadam job yang berulang atau permohonan yang dibatalkan.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setFilterStatus(filterStatus === 'DUPLICATES' ? 'ALL' : 'DUPLICATES')}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition shrink-0 cursor-pointer shadow-xs ${
              filterStatus === 'DUPLICATES'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-200 hover:bg-amber-300 text-amber-900'
            }`}
          >
            {filterStatus === 'DUPLICATES' ? 'Papar Semua Status' : `Tapis Job Pendua Sahaja (${duplicateJobsCount})`}
          </button>
        </div>
      )}

      {/* Repair Jobs Cards List */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
            <Smartphone className="w-12 h-12 mx-auto mb-2 text-slate-300" />
            <p className="font-bold text-slate-700 text-sm">Tiada Rekod Job Baiki Dijumpai</p>
            <p className="text-slate-400 mt-1">Gunakan butang "Terima Telefon Baru" di atas untuk memulakan pendaftaran.</p>
          </div>
        ) : (
          filteredJobs.map(job => {
            const isCompleted = job.repairStatus === 'COMPLETED';
            const isPaid = job.paymentStatus === 'PAID';
            const isDiagnosed = Boolean(job.hasDiagnosis) && Number(job.sellingPrice || 0) > 0;
            const duplicates = getDuplicateJobs(job);

            return (
              <div
                key={job.id}
                className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition space-y-4"
              >
                {/* Top Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 font-mono font-black text-xs border border-blue-200">
                      {job.id}
                    </span>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                        {job.deviceBrand} {job.deviceModel}
                      </h3>
                      <span className="text-[11px] text-slate-500">
                        Warna: {job.deviceColor || '-'} • IMEI: {job.imeiSerial || 'N/A'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                      statusColors[job.repairStatus] || 'bg-slate-100 text-slate-700'
                    }`}>
                      {job.repairStatus}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                      isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {isPaid ? 'BAYARAN: PAID' : 'BAYARAN: PENDING'}
                    </span>
                  </div>
                </div>

                {/* Duplicate Alert Notice inside Job Card */}
                {duplicates.length > 0 && (
                  <div className="p-3 bg-amber-50/90 rounded-2xl border border-amber-300 flex items-start gap-2.5 text-xs text-amber-900">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-amber-900 uppercase">
                          ⚠️ Kemungkinan Job Pendua (Model Sama: {job.deviceModel})
                        </span>
                        <span className="px-2 py-0.2 rounded-full bg-amber-200 text-amber-900 font-bold text-[10px]">
                          {duplicates.length} rekod sepadan
                        </span>
                      </div>
                      <p className="text-[11px] text-amber-800 mt-0.5">
                        Pelanggan ini juga mempunyai permohonan lain untuk model telefon yang sama: {duplicates.map(d => `${d.id} (${d.repairStatus})`).join(', ')}.
                        Sila semak kesahihan permohonan bersama pelanggan untuk mengelakkan pembaikan berulang.
                      </p>
                    </div>
                  </div>
                )}

                {/* Body Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  
                  {/* Customer Info */}
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Maklumat Pelanggan</span>
                    <p className="font-bold text-slate-900">{job.customerName}</p>
                    <p className="text-slate-600 font-medium">{job.customerPhone}</p>
                    <span className="text-[10px] text-slate-400 block mt-1">
                      Diterima: {new Date(job.dateReceived).toLocaleString()}
                    </span>
                  </div>

                  {/* Problem & Diagnosis */}
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Diagnosis Kerosakan</span>
                    <p className="font-bold text-rose-700">{job.damageType || 'Belum Ditetapkan'}</p>
                    <p className="text-[11px] text-slate-600 line-clamp-2">{job.problemReported}</p>
                    {job.diagnosis && (
                      <p className="text-[11px] text-indigo-700 italic mt-0.5 line-clamp-1">
                        Hasil: {job.diagnosis}
                      </p>
                    )}
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-1">
                    <span className="text-[10px] font-bold text-indigo-700 uppercase">Kos & Harga Jualan</span>
                    {job.hasDiagnosis || (job.repairStatus !== 'RECEIVED' && Number(job.sellingPrice) > 0) ? (
                      <>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-600">Alat Ganti:</span>
                          <span className="font-semibold">RM {job.partsCost.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-600">Upah Servis:</span>
                          <span className="font-semibold">RM {Number(job.labourCost || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs font-black text-slate-900 pt-1 border-t border-indigo-200/60">
                          <span>Harga Jualan (Total):</span>
                          <span className="text-blue-700">RM {job.sellingPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-[10px] font-bold text-emerald-700">
                          <span>Untung Kasar:</span>
                          <span>RM {job.grossProfit.toFixed(2)}</span>
                        </div>
                      </>
                    ) : (
                      <div className="py-2.5 text-center">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-100/90 text-amber-900 border border-amber-300 text-[11px] font-bold shadow-2xs">
                          <Wrench className="w-3.5 h-3.5 text-amber-600" />
                          <span>Menunggu Diagnosis & Sebut Harga</span>
                        </span>
                        <p className="text-[10px] text-slate-500 mt-1.5 leading-tight">
                          Harga belum dimasukkan ke CRM. Klik &quot;Diagnosis & Alat Ganti&quot; di bawah untuk mengira kos.
                        </p>
                      </div>
                    )}
                  </div>

                </div>

                {/* Action Buttons Row */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                  
                  <div className="flex flex-wrap items-center gap-1.5">
                    {/* Diagnosis Modal Button */}
                    <button
                      type="button"
                      onClick={() => setSelectedJobForDiagnosis(job)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                        !isDiagnosed
                          ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-black shadow-md border-2 border-amber-500'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                      title={!isDiagnosed ? 'Wajib Diisi: Lengkapkan diagnosis & alat ganti di sini' : 'Kemaskini diagnosis & alat ganti'}
                    >
                      <Wrench className={`w-3.5 h-3.5 ${!isDiagnosed ? 'text-slate-950 font-black' : 'text-slate-500'}`} />
                      <span>{!isDiagnosed ? 'Diagnosis & Alat Ganti (Wajib Diisi)' : 'Diagnosis & Alat Ganti'}</span>
                    </button>

                    {/* Quotation Button: Inactive until diagnosis & spare parts are completed */}
                    {isDiagnosed ? (
                      <button
                        type="button"
                        onClick={() => setSelectedJobForQuotation(job)}
                        className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl font-bold border border-purple-200 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        title={`Buka Sebut Harga (${job.quotationStatus})`}
                      >
                        <FileText className="w-3.5 h-3.5 text-purple-600" />
                        <span>Sebut Harga ({job.quotationStatus})</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="px-3 py-1.5 bg-slate-100 text-slate-400 rounded-xl font-bold border border-slate-200 flex items-center gap-1.5 cursor-not-allowed opacity-60"
                        title="Sebut harga tidak aktif. Sila lengkapkan ruangan 'Diagnosis & Alat Ganti' dan klik 'Simpan Diagnosis & Kemaskini Sebut Harga' terlebih dahulu."
                      >
                        <Lock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Sebut Harga (Terkunci)</span>
                      </button>
                    )}

                    {/* Admin Edit Job Details Button (Accessible at any stage) */}
                    <button
                      type="button"
                      onClick={() => handleOpenAdminEdit(job)}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl font-bold border border-blue-200 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      title="Kemaskini data pelanggan/peranti jika pelanggan memaklumkan kesilapan"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                      <span>Edit Butiran Job</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    
                    {/* Status Step Progression: Inactive until diagnosis & spare parts are completed */}
                    {!isCompleted && job.repairStatus !== 'CANCELLED' && (
                      isDiagnosed ? (
                        <button
                          type="button"
                          onClick={() => handleNextStatus(job)}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl font-bold border border-blue-200 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                          title="Tukar status kepada langkah seterusnya"
                        >
                          <Play className="w-3.5 h-3.5 text-blue-600" />
                          <span>Langkah Status Seterusnya &rarr;</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="px-3 py-1.5 bg-slate-100 text-slate-400 rounded-xl font-bold border border-slate-200 flex items-center gap-1.5 cursor-not-allowed opacity-60"
                          title="Langkah status tidak aktif. Sila lengkapkan ruangan 'Diagnosis & Alat Ganti' dan klik 'Simpan Diagnosis & Kemaskini Sebut Harga' terlebih dahulu."
                        >
                          <Lock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Langkah Seterusnya (Terkunci)</span>
                        </button>
                      )
                    )}

                    {/* Pay Button: Only available once diagnosis is completed and price > 0 */}
                    {!isPaid && isDiagnosed && (
                      <button
                        type="button"
                        onClick={() => handleOpenPayment(job)}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>Terima Bayaran (RM {job.sellingPrice.toFixed(2)})</span>
                      </button>
                    )}

                    {/* Receipt Button */}
                    {isPaid && (
                      <button
                        onClick={() => openReceipt({ type: 'REPAIR', job })}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>Cetak Resit Rasmi</span>
                      </button>
                    )}

                    {/* Delete Job Button (Restricted to Super Admin & Manager only) */}
                    {isAuthorizedToDelete ? (
                      <button
                        onClick={() => setJobToDelete(job)}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-bold border border-rose-200 transition flex items-center gap-1.5 cursor-pointer"
                        title="Padam rekod job pendua / tersalah key-in / dibatalkan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Padam</span>
                      </button>
                    ) : (
                      <button
                        disabled
                        className="px-3 py-1.5 bg-slate-100 text-slate-400 rounded-xl font-bold border border-slate-200 flex items-center gap-1.5 cursor-not-allowed opacity-60"
                        title="Akses Ditolak: Hanya Super Admin & Manager Smartphone Repair dibenarkan memadam job"
                      >
                        <Lock className="w-3 h-3" />
                        <span>Padam</span>
                      </button>
                    )}

                  </div>

                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Sub-Modals */}
      {isNewJobModalOpen && (
        <NewRepairJobModal onClose={() => setIsNewJobModalOpen(false)} />
      )}

      {selectedJobForDiagnosis && (
        <RepairDiagnosisModal
          job={selectedJobForDiagnosis}
          onClose={() => setSelectedJobForDiagnosis(null)}
        />
      )}

      {selectedJobForQuotation && (
        <QuotationModal
          job={selectedJobForQuotation}
          onClose={() => setSelectedJobForQuotation(null)}
          onApprove={(id) => approveRepairQuotation(id)}
          onReject={(id) => rejectRepairQuotation(id)}
        />
      )}

      {/* Payment Modal */}
      {paymentJob && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-hidden">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 border border-slate-200 text-xs animate-fade-in">
            <h3 className="font-black text-base text-slate-900 mb-1">
              Terima Bayaran Pembaikan
            </h3>
            <p className="text-slate-500 mb-4">
              Job: <span className="font-bold text-slate-900">{paymentJob.id}</span> ({paymentJob.deviceBrand} {paymentJob.deviceModel})
            </p>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 mb-4 text-center">
              <span className="text-[11px] text-slate-500 font-bold uppercase">Jumlah Perlu Dibayar</span>
              <p className="text-2xl font-black text-emerald-700 mt-1">
                RM {paymentJob.sellingPrice.toFixed(2)}
              </p>
            </div>

            <div className="space-y-2 mb-5">
              <label className="font-bold text-slate-700 block">Kaedah Bayaran:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('QR_PAYMENT')}
                  className={`py-2 rounded-xl border font-bold ${
                    paymentMethod === 'QR_PAYMENT'
                      ? 'bg-indigo-50 border-indigo-600 text-indigo-700'
                      : 'bg-white text-slate-600'
                  }`}
                >
                  DuitNow QR
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('CASH')}
                  className={`py-2 rounded-xl border font-bold ${
                    paymentMethod === 'CASH'
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-700'
                      : 'bg-white text-slate-600'
                  }`}
                >
                  Tunai (Cash)
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleConfirmPay}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition"
              >
                Sahkan Bayaran & Selesaikan Job
              </button>
              <button
                onClick={() => setPaymentJob(null)}
                className="w-full py-2 text-slate-500 hover:bg-slate-100 font-semibold rounded-xl"
              >
                Batal
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ================= MODAL 4: ADMIN EDIT BUTIRAN JOB ================= */}
      {selectedJobForAdminEdit && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm overflow-hidden">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 border border-slate-200 text-xs animate-fade-in max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900">
                    Kemaskini Butiran Job Baiki (Admin)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    No. Job: <span className="font-mono font-bold text-blue-700">{selectedJobForAdminEdit.id}</span> • Status: <span className="font-bold text-slate-700">{selectedJobForAdminEdit.repairStatus}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedJobForAdminEdit(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-[11px] text-slate-500 mb-4">
              Gunakan borang ini jika pelanggan memaklumkan kesilapan pengisian data asal atau memerlukan pembetulan rekod pembaikan.
            </p>

            <form onSubmit={handleSaveAdminEdit} className="space-y-4">
              
              {/* Seksyen Pelanggan */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                <span className="font-black text-[10px] text-slate-400 uppercase tracking-wider block">
                  Maklumat Pelanggan CRM
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Nama Pelanggan:</label>
                    <input
                      type="text"
                      required
                      value={adminEditForm.customerName}
                      onChange={(e) => setAdminEditForm({ ...adminEditForm, customerName: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-600 font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">No. Telefon:</label>
                    <input
                      type="tel"
                      required
                      value={adminEditForm.customerPhone}
                      onChange={(e) => setAdminEditForm({ ...adminEditForm, customerPhone: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-600 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">E-mel Pelanggan:</label>
                    <input
                      type="email"
                      placeholder="cth: pelanggan@email.com"
                      value={adminEditForm.customerEmail}
                      onChange={(e) => setAdminEditForm({ ...adminEditForm, customerEmail: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Alamat:</label>
                    <input
                      type="text"
                      placeholder="Bandar / Negeri"
                      value={adminEditForm.customerAddress}
                      onChange={(e) => setAdminEditForm({ ...adminEditForm, customerAddress: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-600"
                    />
                  </div>
                </div>
              </div>

              {/* Seksyen Telefon */}
              <div className="p-3.5 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-2.5">
                <span className="font-black text-[10px] text-blue-700 uppercase tracking-wider block">
                  Maklumat Telefon & Kerosakan
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Jenama Telefon:</label>
                    <select
                      value={adminEditForm.deviceBrand}
                      onChange={(e) => setAdminEditForm({ ...adminEditForm, deviceBrand: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none font-bold"
                    >
                      <option value="Apple">Apple iPhone</option>
                      <option value="Samsung">Samsung</option>
                      <option value="Xiaomi">Xiaomi / Redmi</option>
                      <option value="Oppo">Oppo</option>
                      <option value="Vivo">Vivo</option>
                      <option value="Realme">Realme</option>
                      <option value="Huawei">Huawei / Honor</option>
                      <option value="Lain-lain">Lain-lain Jenama</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Model Telefon:</label>
                    <input
                      type="text"
                      required
                      value={adminEditForm.deviceModel}
                      onChange={(e) => setAdminEditForm({ ...adminEditForm, deviceModel: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-600 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Warna Telefon:</label>
                    <input
                      type="text"
                      placeholder="cth: Midnight Blue"
                      value={adminEditForm.deviceColor}
                      onChange={(e) => setAdminEditForm({ ...adminEditForm, deviceColor: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">No. Siri / IMEI:</label>
                    <input
                      type="text"
                      placeholder="cth: 356891029384756"
                      value={adminEditForm.imeiSerial}
                      onChange={(e) => setAdminEditForm({ ...adminEditForm, imeiSerial: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Jenis Kerosakan Utama:</label>
                  <select
                    value={adminEditForm.damageType}
                    onChange={(e) => setAdminEditForm({ ...adminEditForm, damageType: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none"
                  >
                    <option value="Skrin Pecah / LCD Blank">Skrin Pecah / LCD Blank</option>
                    <option value="Bateri Rosak / Cepat Habis">Bateri Rosak / Cepat Habis</option>
                    <option value="Masuk Air (Water Damage)">Masuk Air (Water Damage)</option>
                    <option value="Port Pengecasan Tidak Boleh Caj">Port Pengecasan Tidak Boleh Caj</option>
                    <option value="Kamera Depan / Belakang Rosak">Kamera Depan / Belakang Rosak</option>
                    <option value="Speaker / Mic / Audio Rosak">Speaker / Mic / Audio Rosak</option>
                    <option value="Masalah Motherboard / IC">Masalah Motherboard / IC</option>
                    <option value="Lain-lain Kerosakan">Lain-lain Kerosakan</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Penerangan Masalah Diadu:</label>
                  <input
                    type="text"
                    value={adminEditForm.problemReported}
                    onChange={(e) => setAdminEditForm({ ...adminEditForm, problemReported: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Diagnosis / Catatan Juruteknik:</label>
                  <textarea
                    rows={2}
                    value={adminEditForm.diagnosis}
                    onChange={(e) => setAdminEditForm({ ...adminEditForm, diagnosis: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none"
                  />
                </div>
              </div>

              {/* Seksyen Kos & Upah */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="font-black text-[10px] text-slate-400 uppercase tracking-wider block">
                  Kos Upah & Harga Jualan (RM)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Kos Upah Servis (RM):</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={adminEditForm.labourCost}
                      onChange={(e) => setAdminEditForm({ ...adminEditForm, labourCost: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Harga Jualan Keseluruhan (RM):</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={adminEditForm.sellingPrice}
                      onChange={(e) => setAdminEditForm({ ...adminEditForm, sellingPrice: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none font-black text-blue-700"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition cursor-pointer"
                >
                  Simpan Perubahan (Admin)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedJobForAdminEdit(null)}
                  className="px-5 py-2.5 text-slate-500 hover:bg-slate-100 font-semibold rounded-xl cursor-pointer"
                >
                  Batal
                </button>
              </div>

            </form>

          </div>
        </div>,
        document.body
      )}

      {/* ================= MODAL 5: PENGESAHAN PADAM JOB (RBAC: SUPER ADMIN & MANAGER ONLY) ================= */}
      {jobToDelete && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-hidden">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 border border-slate-200 text-xs animate-fade-in space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-rose-50 text-rose-600 shadow-xs">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-base text-slate-900">
                  Padam Rekod Job Baiki?
                </h3>
                <span className="text-[10px] text-rose-700 font-black font-mono">
                  {jobToDelete.id}
                </span>
              </div>
            </div>

            <div className="p-3 bg-rose-50/50 rounded-2xl border border-rose-100 space-y-1.5 text-slate-700">
              <p className="font-bold text-slate-900">
                {jobToDelete.deviceBrand} {jobToDelete.deviceModel}
              </p>
              <p className="text-[11px] text-slate-600">
                Pelanggan: <strong>{jobToDelete.customerName}</strong> ({jobToDelete.customerPhone})
              </p>
              <p className="text-[11px] text-slate-500">
                Status Pembaikan: <span className="font-bold uppercase text-slate-800">{jobToDelete.repairStatus}</span>
              </p>
            </div>

            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-[11px] text-amber-900 space-y-1">
              <div className="flex items-center gap-1 font-black text-amber-950">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                <span>Kebenaran Super Admin & Manager</span>
              </div>
              <p className="leading-tight">
                Tindakan ini adalah khusus untuk memadam job berulang (repeat duplicate), kesilapan kemasukan data (wrong key-in), atau permohonan yang dibatalkan oleh pelanggan bagi memastikan permohonan yang tepat sahaja diteruskan.
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleConfirmDeleteJob}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-xl shadow-md transition cursor-pointer"
              >
                Ya, Sahkan Padam Rekod Ini
              </button>
              <button
                type="button"
                onClick={() => setJobToDelete(null)}
                className="w-full py-2 text-slate-600 hover:bg-slate-100 font-bold rounded-xl transition cursor-pointer"
              >
                Batal
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};
