import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  Smartphone,
  DollarSign,
  Calendar,
  Edit2,
  X,
  History,
  Trash2,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Receipt,
  FileText,
  ChevronRight,
  ShieldCheck,
  Lock
} from 'lucide-react';

export const CustomerManagement = () => {
  const {
    currentUser,
    customers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    repairJobs,
    deleteRepairJob,
    openReceipt,
    showToast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  
  // Edit / Add Customer Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  // Repair History Modal State
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedHistoryCustomer, setSelectedHistoryCustomer] = useState(null);

  // Delete Job Confirmation Dialog State
  const [jobToDelete, setJobToDelete] = useState(null);

  // Delete Customer Confirmation Dialog State
  const [customerToDelete, setCustomerToDelete] = useState(null);

  // Lock body scroll when any modal is open to prevent page drift/jumping
  useEffect(() => {
    if (isEditModalOpen || isHistoryModalOpen || jobToDelete || customerToDelete) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isEditModalOpen, isHistoryModalOpen, jobToDelete, customerToDelete]);

  // RBAC Permission Check: Super Admin & Manager Smartphone Repair only
  const isAuthorizedToDelete = currentUser?.role === 'SUPER ADMIN' || currentUser?.role === 'MANAGER';

  // Helper to detect if a customer has multiple jobs with the same device model
  const getCustomerDuplicateModels = (cust) => {
    if (!cust) return [];
    const custJobs = getCustomerJobs(cust);
    const modelCounts = {};
    custJobs.forEach(j => {
      if (j.repairStatus === 'CANCELLED') return;
      const m = (j.deviceModel || '').trim().toLowerCase();
      if (m) {
        if (!modelCounts[m]) modelCounts[m] = { count: 0, modelName: j.deviceModel, brand: j.deviceBrand };
        modelCounts[m].count += 1;
      }
    });
    return Object.values(modelCounts).filter(item => item.count > 1);
  };

  // Helper to retrieve all repair jobs linked to a customer
  const getCustomerJobs = (cust) => {
    if (!cust) return [];
    const cleanCustPhone = (cust.phone || '').replace(/[^0-9]/g, '');
    return (repairJobs || []).filter(j => {
      if (j.customerId && j.customerId === cust.id) return true;
      const cleanJobPhone = (j.customerPhone || '').replace(/[^0-9]/g, '');
      if (cleanCustPhone && cleanJobPhone && cleanCustPhone === cleanJobPhone) return true;
      if (j.customerName && cust.name && j.customerName.trim().toLowerCase() === cust.name.trim().toLowerCase()) return true;
      return false;
    }).sort((a, b) => new Date(b.dateReceived || 0) - new Date(a.dateReceived || 0));
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setFormData({ name: '', phone: '', email: '', address: '' });
    setIsEditModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (cust) => {
    setEditingCustomer(cust);
    setFormData({
      name: cust.name || '',
      phone: cust.phone || '',
      email: cust.email || '',
      address: cust.address && cust.address !== '-' ? cust.address : ''
    });
    setIsEditModalOpen(true);
  };

  // Open History Modal
  const handleOpenHistory = (cust) => {
    setSelectedHistoryCustomer(cust);
    setIsHistoryModalOpen(true);
  };

  // Handle Form Submit (Add / Edit)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      showToast('Sila masukkan nama dan nombor telefon pelanggan.', 'warning');
      return;
    }

    if (editingCustomer) {
      updateCustomer(editingCustomer.id, {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        address: formData.address.trim() || '-'
      });
      // Also update selected history customer if open
      if (selectedHistoryCustomer && selectedHistoryCustomer.id === editingCustomer.id) {
        setSelectedHistoryCustomer({
          ...selectedHistoryCustomer,
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          address: formData.address.trim() || '-'
        });
      }
    } else {
      addCustomer({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        address: formData.address.trim() || '-'
      });
    }
    setIsEditModalOpen(false);
  };

  // Confirm delete individual repair job
  const handleConfirmDeleteJob = () => {
    if (!jobToDelete) return;
    if (!isAuthorizedToDelete) {
      showToast('Akses Ditolak: Hanya Super Admin & Manager dibenarkan memadam rekod job pembaikan!', 'error');
      setJobToDelete(null);
      return;
    }
    deleteRepairJob(jobToDelete.id);
    setJobToDelete(null);
  };

  // Confirm delete customer
  const handleConfirmDeleteCustomer = () => {
    if (!customerToDelete) return;
    deleteCustomer(customerToDelete.id);
    if (selectedHistoryCustomer && selectedHistoryCustomer.id === customerToDelete.id) {
      setIsHistoryModalOpen(false);
    }
    setCustomerToDelete(null);
  };

  // Filter customers by search query
  const filteredCustomers = (customers || []).filter(c =>
    (c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.phone || '').includes(searchQuery) ||
    (c.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.id || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* ================= PAGE HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-purple-600 mb-1 uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>Pangkalan Pelanggan & Sejarah Pembaikan CRM</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            PENGURUSAN PELANGGAN SMARTPHONE
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Rekod pangkalan pelanggan berpusat, kemaskini e-mel/alamat, penjejakan kos baiki, dan sejarah pembaikan lengkap mengikut No. Job.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Daftar Pelanggan Baru</span>
        </button>
      </div>

      {/* ================= SEARCH & STATS BAR ================= */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama pelanggan, no. telefon, e-mel atau ID (cth: CUST-001)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-purple-600 font-medium"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-600 shrink-0">
          <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
            {filteredCustomers.length} Rekod Pelanggan
          </span>
          <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
            {(repairJobs || []).length} Rekod Job Pembaikan
          </span>
          {(() => {
            const custWithDuplicates = (customers || []).filter(c => getCustomerDuplicateModels(c).length > 0).length;
            if (custWithDuplicates > 0) {
              return (
                <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-300 font-bold flex items-center gap-1.5 shadow-2xs">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>{custWithDuplicates} Pelanggan Berkemungkinan Job Pendua</span>
                </span>
              );
            }
            return null;
          })()}
        </div>
      </div>

      {/* ================= CUSTOMER CRM TABLE ================= */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[11px]">
              <tr>
                <th className="py-3.5 px-4">ID & Pelanggan</th>
                <th className="py-3.5 px-4">Hubungan</th>
                <th className="py-3.5 px-4">Alamat</th>
                <th className="py-3.5 px-4 text-center">Jumlah Baiki</th>
                <th className="py-3.5 px-4">Jumlah Belanja (RM)</th>
                <th className="py-3.5 px-4">Baiki Terakhir (No Job)</th>
                <th className="py-3.5 px-4 text-center">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-bold text-slate-700">Tiada rekod pelanggan dijumpai</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Cuba kata carian lain atau daftar pelanggan baru.</p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map(cust => {
                  const custJobs = getCustomerJobs(cust);
                  const duplicateModels = getCustomerDuplicateModels(cust);
                  const totalRepairsCount = custJobs.length > 0 ? custJobs.length : (cust.totalRepairs || 0);
                  
                  // Hanya kira perbelanjaan bagi job yang telah selesai diagnosis & sebut harga
                  const diagnosedJobs = custJobs.filter(j => j.hasDiagnosis || (j.repairStatus && j.repairStatus !== 'RECEIVED' && Number(j.sellingPrice) > 0));
                  const totalSpendingAmount = custJobs.length > 0
                    ? diagnosedJobs.reduce((acc, j) => acc + (Number(j.sellingPrice) || 0), 0)
                    : (cust.totalSpending || 0);
                  const hasPendingJobs = custJobs.some(j => !j.hasDiagnosis && j.repairStatus === 'RECEIVED');
                  
                  const latestJob = custJobs[0];
                  const lastRepairDate = latestJob
                    ? new Date(latestJob.dateReceived).toISOString().split('T')[0]
                    : (cust.lastRepair && cust.lastRepair !== '-' ? cust.lastRepair : '-');
                  const lastJobId = latestJob ? latestJob.id : (cust.lastJobId && cust.lastJobId !== '-' ? cust.lastJobId : null);

                  return (
                    <tr key={cust.id} className="hover:bg-slate-50/80 transition">
                      {/* ID & Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-black text-slate-900 block text-xs">{cust.name}</span>
                          {duplicateModels.length > 0 && (
                            <span
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black shadow-2xs"
                              title={`Dikesan kemungkinan job berulang bagi model: ${duplicateModels.map(m => m.modelName).join(', ')}`}
                            >
                              <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                              <span>Kemungkinan Job Pendua ({duplicateModels.map(m => m.modelName).join(', ')})</span>
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] text-purple-700 font-mono font-black px-1.5 py-0.2 rounded bg-purple-50 border border-purple-200">
                            {cust.id}
                          </span>
                          {cust.dateRegistered && (
                            <span className="text-[10px] text-slate-400">
                              Daftar: {cust.dateRegistered}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Phone & Email */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-slate-900 font-bold">
                          <Phone className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                          <span>{cust.phone}</span>
                        </div>
                        {cust.email ? (
                          <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate max-w-[160px]">{cust.email}</span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(cust)}
                            className="text-[10px] text-purple-600 hover:underline font-semibold flex items-center gap-0.5 mt-0.5"
                          >
                            + Tambah e-mel
                          </button>
                        )}
                      </td>

                      {/* Address */}
                      <td className="py-3.5 px-4 max-w-xs">
                        {cust.address && cust.address !== '-' ? (
                          <div className="flex items-start gap-1 text-[11px] text-slate-600">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                            <span className="line-clamp-2">{cust.address}</span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(cust)}
                            className="text-[10px] text-purple-600 hover:underline font-semibold flex items-center gap-0.5"
                          >
                            + Tambah alamat
                          </button>
                        )}
                      </td>

                      {/* Total Repairs Badge */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleOpenHistory(cust)}
                          title="Klik untuk melihat sejarah pembaikan"
                          className="inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-black text-xs border border-blue-200 transition cursor-pointer shadow-2xs"
                        >
                          <Smartphone className="w-3 h-3" />
                          <span>{totalRepairsCount}</span>
                        </button>
                      </td>

                      {/* Total Spending */}
                      <td className="py-3.5 px-4">
                        {totalSpendingAmount > 0 ? (
                          <div>
                            <span className="font-black text-slate-900 font-mono text-xs block">
                              RM {totalSpendingAmount.toFixed(2)}
                            </span>
                            <span className="text-[10px] text-slate-400">Kos Keseluruhan</span>
                            {hasPendingJobs && (
                              <span className="inline-block mt-0.5 px-2 py-0.2 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-bold">
                                ⏳ Ada Job Menunggu Diagnosis
                              </span>
                            )}
                          </div>
                        ) : (
                          <div>
                            <span className={`font-black font-mono text-xs block ${hasPendingJobs ? 'text-amber-600' : 'text-slate-900'}`}>
                              RM 0.00
                            </span>
                            {hasPendingJobs ? (
                              <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                                ⏳ Menunggu Diagnosis & Sebut Harga
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400">Kos Keseluruhan</span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Last Repair & Job ID */}
                      <td className="py-3.5 px-4">
                        <div className="text-[11px] font-bold text-slate-800">
                          {lastRepairDate}
                        </div>
                        {lastJobId ? (
                          <button
                            type="button"
                            onClick={() => handleOpenHistory(cust)}
                            className="inline-flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 font-mono font-black text-[10px] border border-blue-200 transition cursor-pointer"
                            title="Buka sejarah job ini"
                          >
                            <span>{lastJobId}</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">Tiada Rekod</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {/* History Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenHistory(cust)}
                            className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                            title={`Lihat Sejarah Pembaikan (${totalRepairsCount} Rekod)`}
                          >
                            <History className="w-4 h-4" />
                          </button>

                          {/* Edit Profile Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(cust)}
                            className="p-1.5 text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition cursor-pointer"
                            title="Kemaskini Profil (Nama, Tel, E-mel, Alamat)"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Delete Customer Button */}
                          <button
                            type="button"
                            onClick={() => setCustomerToDelete(cust)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                            title="Padam Profil Pelanggan"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL 1: EDIT / TAMBAH PELANGGAN ================= */}
      {isEditModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-hidden">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-slate-200 animate-fade-in text-xs max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900">
                    {editingCustomer ? 'Kemaskini Maklumat Pelanggan CRM' : 'Daftar Pelanggan Baru'}
                  </h3>
                  {editingCustomer && (
                    <span className="text-[10px] text-purple-700 font-mono font-bold">
                      {editingCustomer.id}
                    </span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-extrabold text-slate-900 block mb-1 text-xs">
                  Nama Penuh Pelanggan *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Ahmad bin Daud"
                  className="w-full px-3.5 py-2.5 bg-white border-2 border-slate-300 rounded-xl font-bold text-slate-950 placeholder:text-slate-400 outline-none focus:border-purple-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-extrabold text-slate-900 block mb-1 text-xs">
                    No. Telefon / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="019-1234567"
                    className="w-full px-3.5 py-2.5 bg-white border-2 border-slate-300 rounded-xl font-bold text-slate-950 placeholder:text-slate-400 outline-none focus:border-purple-600"
                  />
                </div>
                <div>
                  <label className="font-extrabold text-slate-900 block mb-1 text-xs">
                    E-mel Pelanggan
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="nama@gmail.com"
                    className="w-full px-3.5 py-2.5 bg-white border-2 border-slate-300 rounded-xl font-bold text-slate-950 placeholder:text-slate-400 outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="font-extrabold text-slate-900 block mb-1 text-xs">
                  Alamat Kediaman / Lokasi
                </label>
                <textarea
                  rows="3"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="No Rumah, Jalan, Bandar, Poskod, Negeri..."
                  className="w-full px-3.5 py-2.5 bg-white border-2 border-slate-300 rounded-xl font-bold text-slate-950 placeholder:text-slate-400 outline-none resize-none focus:border-purple-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md transition cursor-pointer"
                >
                  {editingCustomer ? 'Simpan Perubahan' : 'Daftar Pelanggan'}
                </button>
              </div>
            </form>

          </div>
        </div>,
        document.body
      )}

      {/* ================= MODAL 2: SEJARAH PEMBAIKAN PELANGGAN ================= */}
      {isHistoryModalOpen && selectedHistoryCustomer && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm overflow-hidden">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full p-5 sm:p-6 border border-slate-200 animate-fade-in max-h-[90vh] overflow-y-auto text-xs">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600 shadow-xs">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base sm:text-lg text-slate-900">
                    Sejarah Pembaikan Telefon Pelanggan
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Pelanggan: <strong className="text-slate-900">{selectedHistoryCustomer.name}</strong> ({selectedHistoryCustomer.id})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsHistoryModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Details Summary Banner */}
            {(() => {
              const custJobs = getCustomerJobs(selectedHistoryCustomer);
              const diagnosedJobs = custJobs.filter(j => j.hasDiagnosis || (j.repairStatus && j.repairStatus !== 'RECEIVED' && Number(j.sellingPrice) > 0));
              const totalSpending = diagnosedJobs.reduce((acc, j) => acc + (Number(j.sellingPrice) || 0), 0);
              const hasPendingJobs = custJobs.some(j => !j.hasDiagnosis && j.repairStatus === 'RECEIVED');

              return (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-slate-900">{selectedHistoryCustomer.name}</span>
                        <span className="px-2 py-0.2 rounded-md bg-purple-100 text-purple-800 font-mono font-black text-[10px]">
                          {selectedHistoryCustomer.id}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-slate-500 text-[11px]">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <strong>{selectedHistoryCustomer.phone}</strong>
                        </span>
                        {selectedHistoryCustomer.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span>{selectedHistoryCustomer.email}</span>
                          </span>
                        )}
                        {selectedHistoryCustomer.address && selectedHistoryCustomer.address !== '-' && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{selectedHistoryCustomer.address}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-center px-3 py-1.5 bg-blue-50 rounded-xl border border-blue-200">
                        <span className="text-[10px] text-blue-700 font-bold block uppercase">Jumlah Job</span>
                        <span className="text-sm font-black text-blue-900 font-mono">{custJobs.length}</span>
                      </div>
                      <div className="text-center px-3 py-1.5 bg-emerald-50 rounded-xl border border-emerald-200">
                        <span className="text-[10px] text-emerald-700 font-bold block uppercase">Jumlah Belanja</span>
                        <span className="text-sm font-black text-emerald-900 font-mono">RM {totalSpending.toFixed(2)}</span>
                        {hasPendingJobs && (
                          <span className="block text-[9px] text-amber-700 font-bold mt-0.5">
                            (Belum termasuk job menunggu diagnosis)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Duplicate Models Warning Alert inside History Modal */}
                  {(() => {
                    const dupModels = getCustomerDuplicateModels(selectedHistoryCustomer);
                    if (dupModels.length > 0) {
                      return (
                        <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-300 flex items-start gap-2.5 text-xs text-amber-900 shadow-2xs">
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-black text-amber-950 uppercase tracking-wide">
                              ⚠️ Peringatan Admin: Dikesan Rekod Job Model Berulang
                            </span>
                            <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                              Pelanggan ini mempunyai rekod permohonan berulang bagi model: <strong>{dupModels.map(m => `${m.brand} ${m.modelName} (${m.count} rekod)`).join(', ')}</strong>.
                              Sila semak sama ada ia permohonan berulang (repeat/tersalah key-in). Hanya Super Admin & Pengurus (Manager) dibenarkan memadam job berulang bagi memastikan hanya permohonan yang tepat diproses.
                            </p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}

                  {/* Jobs List Header */}
                  <div className="flex items-center justify-between pt-1">
                    <h4 className="font-black text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span>Senarai Job Pembaikan Yang Pernah Didaftarkan</span>
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      Setiap kali pelanggan datang, nombor job baharu dijana tanpa berulang.
                    </span>
                  </div>

                  {/* Jobs Table */}
                  <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 text-slate-600 uppercase font-bold text-[10px]">
                          <tr>
                            <th className="py-2.5 px-3">No. Job</th>
                            <th className="py-2.5 px-3">Tarikh</th>
                            <th className="py-2.5 px-3">Model / Jenama</th>
                            <th className="py-2.5 px-3">Kerosakan / Masalah</th>
                            <th className="py-2.5 px-3 text-center">Status Baiki</th>
                            <th className="py-2.5 px-3 text-right">Kos / Harga</th>
                            <th className="py-2.5 px-3 text-center">Status Bayar</th>
                            <th className="py-2.5 px-3 text-center">Tindakan</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                          {custJobs.length === 0 ? (
                            <tr>
                              <td colSpan="8" className="py-8 text-center text-slate-400">
                                <p className="font-bold text-slate-600">Tiada sejarah pembaikan untuk pelanggan ini.</p>
                                <p className="text-[10px] text-slate-400 mt-0.5">
                                  Job baru akan dipaparkan di sini apabila pelanggan mendaftar servis baiki telefon.
                                </p>
                              </td>
                            </tr>
                          ) : (
                            custJobs.map(job => (
                              <tr key={job.id} className="hover:bg-slate-50 transition">
                                {/* Job ID */}
                                <td className="py-3 px-3">
                                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono font-black text-xs border border-blue-200">
                                    {job.id}
                                  </span>
                                </td>

                                {/* Date */}
                                <td className="py-3 px-3 text-[11px] text-slate-600">
                                  {new Date(job.dateReceived).toLocaleDateString('ms-MY')}
                                </td>

                                {/* Device */}
                                <td className="py-3 px-3 font-bold text-slate-900">
                                  <span className="block">{job.deviceBrand} {job.deviceModel}</span>
                                  {(() => {
                                    const dupModels = getCustomerDuplicateModels(selectedHistoryCustomer);
                                    const isDup = dupModels.some(d => d.modelName.trim().toLowerCase() === (job.deviceModel || '').trim().toLowerCase());
                                    if (isDup) {
                                      return (
                                        <span className="inline-block px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300 text-[9px] font-bold mt-0.5">
                                          ⚠️ Model Berulang
                                        </span>
                                      );
                                    }
                                    return null;
                                  })()}
                                </td>

                                {/* Damage */}
                                <td className="py-3 px-3 max-w-xs truncate text-[11px] text-rose-700 font-semibold">
                                  {job.damageType || job.problemReported || '-'}
                                </td>

                                {/* Repair Status */}
                                <td className="py-3 px-3 text-center">
                                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                    job.repairStatus === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                                    job.repairStatus === 'READY' || job.repairStatus === 'READY FOR COLLECTION' ? 'bg-cyan-100 text-cyan-800' :
                                    job.repairStatus === 'REPAIRING' ? 'bg-amber-100 text-amber-800' :
                                    job.repairStatus === 'DIAGNOSIS' ? 'bg-purple-100 text-purple-800' :
                                    'bg-slate-200 text-slate-700'
                                  }`}>
                                    {job.repairStatus}
                                  </span>
                                </td>

                                {/* Price */}
                                <td className="py-3 px-3 text-right">
                                  {job.hasDiagnosis || (job.repairStatus !== 'RECEIVED' && Number(job.sellingPrice) > 0) ? (
                                    <span className="font-black font-mono text-slate-900">
                                      RM {Number(job.sellingPrice || 0).toFixed(2)}
                                    </span>
                                  ) : (
                                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                      ⏳ Menunggu Diagnosis
                                    </span>
                                  )}
                                </td>

                                {/* Payment Status */}
                                <td className="py-3 px-3 text-center">
                                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                    job.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                  }`}>
                                    {job.paymentStatus === 'PAID' ? 'LULUS (PAID)' : 'BELUM BAYAR'}
                                  </span>
                                </td>

                                {/* Action: Delete Job or View Receipt */}
                                <td className="py-3 px-3 text-center">
                                  <div className="flex items-center justify-center gap-1.5">
                                    {job.paymentStatus === 'PAID' && (
                                      <button
                                        type="button"
                                        onClick={() => openReceipt({ type: 'REPAIR', job })}
                                        className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                                        title="Papar Resit"
                                      >
                                        <Receipt className="w-3.5 h-3.5" />
                                      </button>
                                    )}

                                    {/* Delete History Job Button (Super Admin & Manager only) */}
                                    {isAuthorizedToDelete ? (
                                      <button
                                        type="button"
                                        onClick={() => setJobToDelete(job)}
                                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                        title={`Buang rekod pembaikan ${job.id} ini (Super Admin & Manager)`}
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    ) : (
                                      <button
                                        disabled
                                        className="p-1.5 text-slate-300 rounded-lg cursor-not-allowed opacity-60"
                                        title="Akses Ditolak: Hanya Super Admin & Manager Smartphone Repair dibenarkan memadam job"
                                      >
                                        <Lock className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Close Modal Footer */}
                  <div className="flex items-center justify-end pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsHistoryModalOpen(false)}
                      className="px-5 py-2 font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              );
            })()}

          </div>
        </div>,
        document.body
      )}

      {/* ================= MODAL 3: PENGESAHAN BUANG REKOD PEMBAIKAN ================= */}
      {jobToDelete && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-hidden">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 border border-slate-200 animate-fade-in text-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-black text-slate-900">Padam Rekod Job Baiki?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Adakah anda pasti ingin memadam rekod job <strong className="text-slate-900 font-mono">{jobToDelete.id}</strong> ({jobToDelete.deviceBrand} {jobToDelete.deviceModel}) bagi pelanggan <strong className="text-slate-900">{jobToDelete.customerName}</strong>?
              </p>
            </div>

            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-[11px] text-amber-900 space-y-1">
              <div className="flex items-center gap-1 font-black text-amber-950">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                <span>Kebenaran Super Admin & Manager</span>
              </div>
              <p className="leading-tight">
                Tindakan ini untuk memadam job berulang (repeat), kesilapan kemasukan data (wrong key-in), atau permohonan yang dibatalkan oleh pelanggan bagi memastikan pangkalan data permohonan kekal tepat.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setJobToDelete(null)}
                className="flex-1 py-2.5 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteJob}
                className="flex-1 py-2.5 font-black text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md transition cursor-pointer"
              >
                Ya, Buang Rekod
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ================= MODAL 4: PENGESAHAN PADAM PELANGGAN ================= */}
      {customerToDelete && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-hidden">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 border border-slate-200 animate-fade-in text-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-black text-slate-900">Padam Profil Pelanggan?</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Adakah anda pasti ingin memadam rekod pelanggan <strong className="text-slate-900">{customerToDelete.name}</strong> ({customerToDelete.id}) dari pangkalan CRM?
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCustomerToDelete(null)}
                className="flex-1 py-2.5 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteCustomer}
                className="flex-1 py-2.5 font-black text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md transition cursor-pointer"
              >
                Ya, Padam
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};
