import React, { useState } from 'react';
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
  X
} from 'lucide-react';

export const CustomerManagement = () => {
  const { customers, addCustomer, updateCustomer, repairJobs, setCurrentTab } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setFormData({ name: '', phone: '', email: '', address: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cust) => {
    setEditingCustomer(cust);
    setFormData({
      name: cust.name,
      phone: cust.phone,
      email: cust.email,
      address: cust.address
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('Sila masukkan nama dan nombor telefon pelanggan.');
      return;
    }

    if (editingCustomer) {
      updateCustomer(editingCustomer.id, formData);
    } else {
      addCustomer(formData);
    }
    setIsModalOpen(false);
  };

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery) ||
    (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    c.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-purple-600 mb-1 uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>Pangkalan Pelanggan & Sejarah Pembaikan</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            PENGURUSAN PELANGGAN SMARTPHONE
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Rekod maklumat pelanggan, nombor telefon, jumlah peranti yang dibaiki dan jumlah perbelanjaan.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          <span>Daftar Pelanggan Baru</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama pelanggan, no. telefon, e-mel atau ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
          />
        </div>
        <span className="text-xs font-bold text-slate-500">
          {filteredCustomers.length} Rekod Pelanggan
        </span>
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold">
              <tr>
                <th className="py-3.5 px-4">ID & Pelanggan</th>
                <th className="py-3.5 px-4">Hubungan</th>
                <th className="py-3.5 px-4">Alamat</th>
                <th className="py-3.5 px-4 text-center">Jumlah Baiki</th>
                <th className="py-3.5 px-4">Jumlah Belanja (RM)</th>
                <th className="py-3.5 px-4">Baiki Terakhir</th>
                <th className="py-3.5 px-4 text-center">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-slate-400">
                    Tiada rekod pelanggan dijumpai.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map(cust => (
                  <tr key={cust.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">{cust.name}</span>
                      <span className="text-[10px] text-purple-700 font-mono font-bold">{cust.id}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-slate-900 font-bold">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{cust.phone}</span>
                      </div>
                      {cust.email && (
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3" />
                          <span>{cust.email}</span>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 max-w-xs truncate text-[11px] text-slate-500">
                      {cust.address || '-'}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-800 font-black">
                        {cust.totalRepairs}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-black text-slate-900">
                        RM {cust.totalSpending.toFixed(2)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-[11px] text-slate-500">
                      {cust.lastRepair || '-'}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleOpenEdit(cust)}
                        className="p-1.5 text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
                        title="Kemaskini Profil"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-slate-200 animate-fade-in text-xs">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-black text-base text-slate-900">
                {editingCustomer ? 'Kemaskini Maklumat Pelanggan' : 'Daftar Pelanggan Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-extrabold text-slate-900 block mb-1 text-xs">Nama Penuh Pelanggan *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Ahmad bin Daud"
                  className="w-full px-3.5 py-2 bg-white border-2 border-slate-300 rounded-xl font-bold text-slate-950 placeholder:text-slate-500 outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-extrabold text-slate-900 block mb-1 text-xs">No. Telefon / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="019-1234567"
                    className="w-full px-3.5 py-2 bg-white border-2 border-slate-300 rounded-xl font-bold text-slate-950 placeholder:text-slate-500 outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="font-extrabold text-slate-900 block mb-1 text-xs">E-mel</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="nama@gmail.com"
                    className="w-full px-3.5 py-2 bg-white border-2 border-slate-300 rounded-xl font-bold text-slate-950 placeholder:text-slate-500 outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="font-extrabold text-slate-900 block mb-1 text-xs">Alamat Kediaman / Lokasi</label>
                <textarea
                  rows="2"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="No Rumah, Jalan, Bandar, Poskod..."
                  className="w-full px-3.5 py-2 bg-white border-2 border-slate-300 rounded-xl font-bold text-slate-950 placeholder:text-slate-500 outline-none resize-none focus:border-blue-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md"
                >
                  {editingCustomer ? 'Simpan' : 'Daftar Pelanggan'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
