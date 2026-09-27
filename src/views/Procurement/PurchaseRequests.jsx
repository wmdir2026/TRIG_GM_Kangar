import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Building2,
  DollarSign,
  Package,
  Trash2,
  X
} from 'lucide-react';

export const PurchaseRequests = () => {
  const {
    purchaseRequests,
    createPurchaseRequest,
    approvePurchaseRequest,
    rejectPurchaseRequest,
    suppliers,
    inventory,
    currentUser,
    setCurrentTab,
    showToast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || '');
  const [department, setDepartment] = useState('Kursus Baiki Smartphone');
  const [purpose, setPurpose] = useState('');
  const [items, setItems] = useState([]);

  // Selected item row
  const [selectedInventoryId, setSelectedInventoryId] = useState('');
  const [itemQty, setItemQty] = useState('5');

  const isManagerOrAdmin = currentUser?.role === 'SUPER ADMIN' || currentUser?.role?.includes('MANAGER');

  const handleAddItemToPR = () => {
    if (!selectedInventoryId) return;
    const inv = inventory.find(i => i.id === selectedInventoryId);
    if (!inv) return;

    const qty = parseInt(itemQty) || 1;
    setItems(prev => [
      ...prev,
      {
        itemId: inv.id,
        name: inv.name,
        quantity: qty,
        unitCost: inv.costPrice,
        subtotal: qty * inv.costPrice
      }
    ]);
    setSelectedInventoryId('');
    setItemQty('5');
  };

  const handleRemovePRItem = (index) => {
    setItems(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmitPR = (e) => {
    e.preventDefault();
    if (items.length === 0) {
      showToast('Sila masukkan sekurang-kurangnya satu item ke dalam PR.', 'warning');
      return;
    }

    const sup = suppliers.find(s => s.id === supplierId) || suppliers[0];

    createPurchaseRequest({
      supplierId: sup.id,
      supplierName: sup.name,
      department,
      purpose: purpose || 'Keperluan penambahan stok operasi latihan TRIG.',
      items
    });

    setIsModalOpen(false);
    setItems([]);
    setPurpose('');
  };

  const filteredPRs = purchaseRequests.filter(pr => {
    const matchesSearch =
      pr.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pr.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pr.requesterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pr.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || pr.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-purple-600 mb-1 uppercase tracking-wider">
            <FileText className="w-4 h-4" />
            <span>Aliran Kerja Perolehan & Kelulusan</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            PERMOHONAN PEMBELIAN (PURCHASE REQUEST - PR)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Staf & Pelatih memohon pembelian stok → Pengurus meluluskan → Pesanan Pembelian (PO) dikeluarkan automatik.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          <span>Bina Permohonan Belian (PR Baru)</span>
        </button>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari PR-2026-xxxxx, pembekal, pemohon..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
        >
          <option value="ALL">Semua Status PR</option>
          <option value="PENDING_APPROVAL">PENDING APPROVAL (Menunggu Kelulusan)</option>
          <option value="APPROVED">APPROVED (Telah Diluluskan)</option>
          <option value="ORDERED">ORDERED (PO Dikeluarkan)</option>
          <option value="RECEIVED">RECEIVED (Stok Diterima)</option>
          <option value="REJECTED">REJECTED (Ditolak)</option>
        </select>
      </div>

      {/* PR Cards List */}
      <div className="space-y-4">
        {filteredPRs.map(pr => {
          const isPending = pr.status === 'PENDING_APPROVAL';

          return (
            <div
              key={pr.id}
              className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition space-y-4"
            >
              {/* Top Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 font-mono font-black text-xs border border-purple-200">
                    {pr.id}
                  </span>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">{pr.supplierName}</h3>
                    <span className="text-[11px] text-slate-500">
                      Jabatan: {pr.department} • Pemohon: <span className="font-semibold text-slate-700">{pr.requesterName}</span>
                    </span>
                  </div>
                </div>

                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  pr.status === 'PENDING_APPROVAL' ? 'bg-amber-100 text-amber-800 animate-pulse' :
                  pr.status === 'APPROVED' ? 'bg-purple-100 text-purple-800' :
                  pr.status === 'RECEIVED' ? 'bg-emerald-100 text-emerald-800' :
                  pr.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {pr.status}
                </span>
              </div>

              {/* Items List & Purpose */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="md:col-span-2 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Senarai Item Ditempah:</span>
                  <div className="space-y-1.5">
                    {pr.items.map((it, idx) => (
                      <div key={idx} className="p-2 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
                        <span className="font-semibold text-slate-800">{it.name} (x{it.quantity})</span>
                        <span className="font-bold text-slate-900">RM {it.subtotal.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Tujuan / Catatan Permohonan</span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{pr.purpose}</p>
                  {pr.approvedBy && (
                    <div className="mt-2 pt-2 border-t border-slate-200 text-[10px] text-purple-800 font-semibold">
                      Diluluskan Oleh: {pr.approvedBy}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Total & Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-semibold">Jumlah Anggaran Belian:</span>
                  <span className="text-base font-black text-slate-950">RM {pr.totalAmount.toFixed(2)}</span>
                </div>

                {isPending && isManagerOrAdmin && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => rejectPurchaseRequest(pr.id, 'Ditolak semasa semakan Pengurus.')}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-bold border border-rose-200 transition flex items-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Tolak PR</span>
                    </button>
                    <button
                      onClick={() => approvePurchaseRequest(pr.id, 'Diluluskan untuk pesanan pembelian segera.')}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md transition flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Luluskan PR & Jana PO Otomatik</span>
                    </button>
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Create PR Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 animate-fade-in text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-black text-base text-slate-900">
                Bina Permohonan Pembelian (PR) Baharu
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitPR} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Pilih Pembekal *</label>
                  <select
                    value={supplierId}
                    onChange={(e) => setSupplierId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold outline-none"
                  >
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Jabatan / Kursus *</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold outline-none"
                  >
                    <option value="Kursus Baiki Smartphone">Kursus Baiki Smartphone</option>
                    <option value="Kursus Masakan & Café">Kursus Masakan & Café</option>
                    <option value="Pengurusan Operasi TRIG">Pengurusan Operasi TRIG</option>
                  </select>
                </div>
              </div>

              {/* Add Item Row */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <label className="font-bold text-slate-700 block">Pilih Item dari Inventori:</label>
                <div className="flex gap-2">
                  <select
                    value={selectedInventoryId}
                    onChange={(e) => setSelectedInventoryId(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl outline-none"
                  >
                    <option value="">-- Pilih Item Inventori --</option>
                    {inventory.map(i => (
                      <option key={i.id} value={i.id}>
                        {i.name} (Kos: RM {i.costPrice.toFixed(2)})
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    value={itemQty}
                    onChange={(e) => setItemQty(e.target.value)}
                    className="w-16 px-2 py-1.5 bg-white border border-slate-200 rounded-xl font-bold text-center"
                    placeholder="Qty"
                  />
                  <button
                    type="button"
                    onClick={handleAddItemToPR}
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl"
                  >
                    Tambah
                  </button>
                </div>

                {/* Items in PR */}
                <div className="space-y-1 pt-2">
                  {items.map((it, idx) => (
                    <div key={idx} className="p-2 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                      <span>{it.name} (x{it.quantity}) - RM {it.subtotal.toFixed(2)}</span>
                      <button type="button" onClick={() => handleRemovePRItem(idx)} className="text-rose-500 hover:text-rose-700">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tujuan Pembelian (Justifikasi)</label>
                <textarea
                  rows="2"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="Cth: Stok LCD Samsung A55 dan iPhone 11 habis untuk amali latihan pelatih..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none resize-none font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-semibold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md"
                >
                  Hantar PR untuk Kelulusan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
