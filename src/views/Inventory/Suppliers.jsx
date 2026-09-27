import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Truck,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  FileText,
  DollarSign,
  Edit2,
  X
} from 'lucide-react';

export const Suppliers = () => {
  const { suppliers, addSupplier, updateSupplier } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    productCategory: 'Smartphone Spare Parts & Screens',
    notes: ''
  });

  const handleOpenAdd = () => {
    setEditingSupplier(null);
    setFormData({
      name: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      productCategory: 'Smartphone Spare Parts & Screens',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sup) => {
    setEditingSupplier(sup);
    setFormData({
      name: sup.name,
      contactPerson: sup.contactPerson,
      phone: sup.phone,
      email: sup.email,
      address: sup.address,
      productCategory: sup.productCategory,
      notes: sup.notes
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('Sila lengkapkan nama syarikat pembekal dan nombor telefon.');
      return;
    }

    if (editingSupplier) {
      updateSupplier(editingSupplier.id, formData);
    } else {
      addSupplier(formData);
    }
    setIsModalOpen(false);
  };

  const filteredSuppliers = suppliers.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-600 mb-1 uppercase tracking-wider">
            <Truck className="w-4 h-4" />
            <span>Pengurusan Rakan Pembekal & Vendor</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            SENARAI PEMBEKAL TRIG GIATMARA
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Direktori pembekal bahan mentah café, alat ganti skrin/bateri smartphone, kotak makanan dan alatan bengkel.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          <span>Daftar Pembekal Baru</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari pembekal, wakil jualan, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
          />
        </div>
        <span className="text-xs font-bold text-slate-500">{filteredSuppliers.length} Pembekal Berdaftar</span>
      </div>

      {/* Supplier Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredSuppliers.map(sup => (
          <div
            key={sup.id}
            className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-700 font-bold text-xs flex items-center justify-center border border-cyan-200">
                    {sup.id}
                  </span>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{sup.name}</h3>
                    <span className="text-[10px] font-semibold text-cyan-700 bg-cyan-50 px-2 py-0.2 rounded-full">
                      {sup.productCategory}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleOpenEdit(sup)}
                  className="p-1.5 text-slate-400 hover:text-cyan-600 rounded-lg"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>

              <div className="py-3 space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-medium w-24">Wakil (PIC):</span>
                  <span className="font-bold text-slate-900">{sup.contactPerson}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-medium w-24">No. Telefon:</span>
                  <span className="font-bold text-slate-900 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" /> {sup.phone}
                  </span>
                </div>
                {sup.email && (
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-medium w-24">E-mel:</span>
                    <span className="text-slate-700 flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-400" /> {sup.email}
                    </span>
                  </div>
                )}
                <div className="flex items-start gap-2">
                  <span className="text-slate-400 font-medium w-24 shrink-0">Alamat:</span>
                  <span className="text-[11px] text-slate-500">{sup.address}</span>
                </div>
                {sup.notes && (
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-600 italic">
                    Nota: {sup.notes}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Jumlah Pesanan Belian:</span>
              <span className="font-black text-slate-900">RM {Number(sup.totalPurchases || 0).toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 animate-fade-in text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-black text-base text-slate-900">
                {editingSupplier ? 'Kemaskini Maklumat Pembekal' : 'Daftar Pembekal Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-extrabold text-slate-900 block mb-1 text-xs">Nama Syarikat / Perniagaan Pembekal *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Mega Smartphone Parts & LCD Supplier KL"
                  className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-xl font-bold text-slate-950 placeholder:text-slate-500 outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-extrabold text-slate-900 block mb-1 text-xs">Nama Wakil Jualan (Contact Person)</label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    placeholder="Mr. Kelvin Tan"
                    className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-xl font-bold text-slate-950 placeholder:text-slate-500 outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="font-extrabold text-slate-900 block mb-1 text-xs">No. Telefon *</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="012-3344882"
                    className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-xl font-bold text-slate-950 placeholder:text-slate-500 outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-extrabold text-slate-900 block mb-1 text-xs">E-mel Pembekal</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="sales@pembekal.com"
                    className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-xl font-bold text-slate-950 placeholder:text-slate-500 outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="font-extrabold text-slate-900 block mb-1 text-xs">Kategori Barangan</label>
                  <input
                    type="text"
                    value={formData.productCategory}
                    onChange={(e) => setFormData({ ...formData, productCategory: e.target.value })}
                    placeholder="Bahan Mentah, LCD, Alatan..."
                    className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-xl font-bold text-slate-950 placeholder:text-slate-500 outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="font-extrabold text-slate-900 block mb-1 text-xs">Alamat Premis / Gudang</label>
                <textarea
                  rows="2"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Alamat penghantaran..."
                  className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-xl font-bold text-slate-950 placeholder:text-slate-500 resize-none outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="font-extrabold text-slate-900 block mb-1 text-xs">Catatan Tambahan (cth: Jadual hantar, terma)</label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Penghantaran Isnin & Khamis..."
                  className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-xl font-bold text-slate-950 placeholder:text-slate-500 outline-none focus:border-indigo-600"
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
                  className="px-5 py-2 font-bold text-white bg-cyan-600 hover:bg-cyan-700 rounded-xl shadow-md"
                >
                  {editingSupplier ? 'Simpan' : 'Daftar Pembekal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
