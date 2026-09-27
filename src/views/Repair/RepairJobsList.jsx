import React, { useState } from 'react';
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
  ShieldCheck
} from 'lucide-react';
import { NewRepairJobModal } from './NewRepairJobModal';
import { RepairDiagnosisModal } from './RepairDiagnosisModal';
import { QuotationModal } from './QuotationModal';

export const RepairJobsList = () => {
  const {
    repairJobs,
    updateRepairStatus,
    approveRepairQuotation,
    rejectRepairQuotation,
    payRepairJob,
    openReceipt,
    showToast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Modals
  const [isNewJobModalOpen, setIsNewJobModalOpen] = useState(false);
  const [selectedJobForDiagnosis, setSelectedJobForDiagnosis] = useState(null);
  const [selectedJobForQuotation, setSelectedJobForQuotation] = useState(null);
  const [paymentJob, setPaymentJob] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('QR_PAYMENT');

  const filteredJobs = repairJobs.filter(job => {
    const matchesSearch =
      job.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.customerPhone.includes(searchQuery) ||
      job.deviceBrand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.deviceModel.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || job.repairStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleNextStatus = (job) => {
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
                  </div>

                </div>

                {/* Action Buttons Row */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                  
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      onClick={() => setSelectedJobForDiagnosis(job)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition flex items-center gap-1.5"
                    >
                      <Wrench className="w-3.5 h-3.5 text-slate-500" />
                      <span>Diagnosis & Alat Ganti</span>
                    </button>

                    <button
                      onClick={() => setSelectedJobForQuotation(job)}
                      className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl font-bold border border-purple-200 transition flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Sebut Harga ({job.quotationStatus})</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    
                    {/* Status Step Progression */}
                    {!isCompleted && job.repairStatus !== 'CANCELLED' && (
                      <button
                        onClick={() => handleNextStatus(job)}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl font-bold border border-blue-200 transition flex items-center gap-1.5"
                      >
                        <Play className="w-3 h-3" />
                        <span>Langkah Status Seterusnya &rarr;</span>
                      </button>
                    )}

                    {/* Pay Button */}
                    {!isPaid && (
                      <button
                        onClick={() => handleOpenPayment(job)}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs transition flex items-center gap-1.5"
                      >
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>Terima Bayaran (RM {job.sellingPrice.toFixed(2)})</span>
                      </button>
                    )}

                    {/* Receipt Button */}
                    {isPaid && (
                      <button
                        onClick={() => openReceipt({ type: 'REPAIR', job })}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xs transition flex items-center gap-1.5"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>Cetak Resit Rasmi</span>
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
      {paymentJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
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
        </div>
      )}

    </div>
  );
};
