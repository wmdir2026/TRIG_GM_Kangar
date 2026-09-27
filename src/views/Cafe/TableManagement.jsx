import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Grid,
  Plus,
  QrCode,
  Users,
  MapPin,
  Edit2,
  Trash2,
  ExternalLink,
  Printer,
  Download,
  CheckCircle,
  XCircle,
  Sparkles,
  UtensilsCrossed,
  X
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export const TableManagement = () => {
  const {
    tables,
    addTable,
    updateTable,
    deleteTable,
    setCurrentTab,
    setSelectedTableForCustomer,
    settings,
    showToast
  } = useApp();

  const [selectedTableQR, setSelectedTableQR] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState(null);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    capacity: 4,
    location: 'Zon Hadapan Café (Air-Cond)',
    status: 'AVAILABLE'
  });

  const handleOpenAdd = () => {
    setEditingTable(null);
    setFormData({
      id: `M${String(tables.length + 1).padStart(2, '0')}`,
      name: `Meja ${String(tables.length + 1).padStart(2, '0')}`,
      capacity: 4,
      location: 'Zon Tengah Café',
      status: 'AVAILABLE'
    });
    setIsEditModalOpen(true);
  };

  const handleOpenEdit = (table) => {
    setEditingTable(table);
    setFormData({
      id: table.id,
      name: table.name,
      capacity: table.capacity,
      location: table.location,
      status: table.status
    });
    setIsEditModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingTable) {
      updateTable(editingTable.id, formData);
    } else {
      addTable(formData);
    }
    setIsEditModalOpen(false);
  };

  const handleDelete = (t) => {
    if (window.confirm(`Padam Meja ${t.id} (${t.name})?`)) {
      deleteTable(t.id);
    }
  };

  const handleSimulateCustomerOrder = (tableId) => {
    setSelectedTableForCustomer(tableId);
    setCurrentTab('customer-order');
  };

  const statusConfig = {
    AVAILABLE: { bg: 'bg-emerald-50 border-emerald-300 text-emerald-900', badge: 'bg-emerald-100 text-emerald-800' },
    OCCUPIED: { bg: 'bg-rose-50 border-rose-300 text-rose-900', badge: 'bg-rose-100 text-rose-800' },
    ORDERING: { bg: 'bg-amber-50 border-amber-300 text-amber-900', badge: 'bg-amber-100 text-amber-800' },
    CLEANING: { bg: 'bg-blue-50 border-blue-300 text-blue-900', badge: 'bg-blue-100 text-blue-800' },
    INACTIVE: { bg: 'bg-slate-100 border-slate-300 text-slate-500 opacity-60', badge: 'bg-slate-200 text-slate-700' }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 mb-1 uppercase tracking-wider">
            <Grid className="w-4 h-4" />
            <span>Susun Atur & Pengurusan Meja</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            PENGURUSAN MEJA CAFÉ GIATMARA
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Pantau status meja (Kosong, Diguna, Memesan, Pembersihan), cetak QR Code meja unik dan lancarkan simulasi pesanan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentTab('qr-tables')}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold border border-indigo-200 transition"
          >
            <QrCode className="w-4 h-4" />
            <span>Galeri QR Penuh</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Meja</span>
          </button>
        </div>
      </div>

      {/* Status Legend */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-white rounded-2xl border border-slate-200 text-xs">
        <span className="font-bold text-slate-500 mr-2">Petunjuk Status:</span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span> AVAILABLE (Kosong)
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 font-bold text-[11px]">
          <span className="w-2 h-2 rounded-full bg-rose-500"></span> OCCUPIED (Ada Pelanggan)
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px]">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span> ORDERING (Sedang Memesan)
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 font-bold text-[11px]">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span> CLEANING (Pembersihan)
        </span>
      </div>

      {/* Visual Floor Layout Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {tables.map(table => {
          const cfg = statusConfig[table.status] || statusConfig.AVAILABLE;

          return (
            <div
              key={table.id}
              className={`rounded-3xl border-2 p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-all ${cfg.bg}`}
            >
              <div>
                {/* Card Top */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-10 h-10 rounded-2xl bg-slate-900 text-white font-black text-sm flex items-center justify-center shadow-xs">
                      {table.id}
                    </span>
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900">{table.name}</h3>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
                        <Users className="w-3 h-3" /> Muatan: {table.capacity} Orang
                      </span>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${cfg.badge}`}>
                    {table.status}
                  </span>
                </div>

                {/* Location */}
                <div className="mt-3.5 flex items-center gap-1.5 text-xs text-slate-600 bg-white/70 p-2 rounded-xl border border-slate-200/50">
                  <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span className="truncate">{table.location}</span>
                </div>

                {/* Active order info if occupied */}
                {table.activeOrderId && (
                  <div className="mt-2 text-[11px] p-2 rounded-xl bg-amber-500/10 border border-amber-300/50 text-amber-900 font-semibold flex items-center justify-between">
                    <span>Order: {table.activeOrderId}</span>
                    <button
                      onClick={() => setCurrentTab('kitchen')}
                      className="text-indigo-700 underline text-[10px]"
                    >
                      Dapur &rarr;
                    </button>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-slate-200/60 space-y-2">
                <button
                  onClick={() => handleSimulateCustomerOrder(table.id)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Simulasi Order Meja Ini</span>
                </button>

                <div className="grid grid-cols-3 gap-1 text-xs">
                  <button
                    onClick={() => setSelectedTableQR(table)}
                    className="py-1.5 px-2 bg-white hover:bg-slate-100 text-slate-700 rounded-lg font-semibold border border-slate-200 flex items-center justify-center gap-1"
                    title="Lihat Kod QR"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>QR</span>
                  </button>
                  <button
                    onClick={() => handleOpenEdit(table)}
                    className="py-1.5 px-2 bg-white hover:bg-slate-100 text-slate-700 rounded-lg font-semibold border border-slate-200 flex items-center justify-center gap-1"
                    title="Kemaskini Status Meja"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(table)}
                    className="py-1.5 px-2 bg-white hover:bg-rose-50 text-rose-600 rounded-lg font-semibold border border-slate-200 flex items-center justify-center gap-1"
                    title="Padam Meja"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Padam</span>
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* QR Code Preview Modal */}
      {selectedTableQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 border border-slate-200 text-center animate-fade-in">
            
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-xs text-slate-400 uppercase">Kod QR Pesanan Meja</span>
              <button
                onClick={() => setSelectedTableQR(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black text-lg flex items-center justify-center mb-2 shadow-sm">
                {selectedTableQR.id}
              </div>
              <h3 className="font-black text-lg text-slate-900">{selectedTableQR.name}</h3>
              <p className="text-xs text-slate-500 mb-4">{settings.businessName}</p>

              {/* QR Code SVG */}
              <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-200">
                <QRCodeSVG
                  value={`https://giatmara-kangar-trig.app/?table=${selectedTableQR.id}`}
                  size={160}
                  level="H"
                />
              </div>

              <span className="text-[11px] text-slate-400 mt-3">
                Imbas untuk terus membuka Menu Digital Café GIATMARA
              </span>
            </div>

            <div className="mt-5 space-y-2">
              <button
                onClick={() => handleSimulateCustomerOrder(selectedTableQR.id)}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition"
              >
                Buka Menu Pelanggan (Simulasi)
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Pelekat QR Meja</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Add / Edit Table Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-slate-200 animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">
                {editingTable ? `Kemaskini Meja ${editingTable.id}` : 'Daftar Meja Baru'}
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">ID Meja *</label>
                  <input
                    type="text"
                    required
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    placeholder="M01, M02..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold uppercase"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nama Paparan *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Meja 01"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Muatan Kerusi</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 4 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Status Meja</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value="AVAILABLE">AVAILABLE (Kosong)</option>
                    <option value="OCCUPIED">OCCUPIED (Diduduki)</option>
                    <option value="ORDERING">ORDERING (Memesan)</option>
                    <option value="CLEANING">CLEANING (Pembersihan)</option>
                    <option value="INACTIVE">INACTIVE (Tutup)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Lokasi / Zon Café</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Zon Hadapan, Zon Tingkap, Ruang VIP..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md"
                >
                  {editingTable ? 'Simpan' : 'Daftar Meja'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
