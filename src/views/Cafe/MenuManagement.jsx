import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  UtensilsCrossed,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Image,
  DollarSign,
  X
} from 'lucide-react';

export const MenuManagement = () => {
  const { menu, categories, addMenuItem, updateMenuItem, deleteMenuItem } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Rice',
    description: '',
    image: '',
    costPrice: '',
    sellingPrice: '',
    stock: '',
    unit: 'Pinggan',
    status: 'AVAILABLE'
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      category: 'Rice',
      description: '',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
      costPrice: '',
      sellingPrice: '',
      stock: '30',
      unit: 'Pinggan',
      status: 'AVAILABLE'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      description: item.description,
      image: item.image,
      costPrice: item.costPrice,
      sellingPrice: item.sellingPrice,
      stock: item.stock,
      unit: item.unit || 'Pinggan',
      status: item.status
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.sellingPrice || !formData.costPrice) {
      alert('Sila lengkapkan maklumat nama menu, harga kos dan harga jualan.');
      return;
    }

    const payload = {
      ...formData,
      costPrice: parseFloat(formData.costPrice),
      sellingPrice: parseFloat(formData.sellingPrice),
      stock: parseInt(formData.stock) || 0
    };

    if (editingItem) {
      updateMenuItem(editingItem.id, payload);
    } else {
      addMenuItem(payload);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (item) => {
    if (window.confirm(`Adakah anda pasti mahu memadam menu "${item.name}"?`)) {
      deleteMenuItem(item.id);
    }
  };

  // Filtered list
  const filteredMenu = menu.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'ALL' || item.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate live profit in form
  const formCost = parseFloat(formData.costPrice) || 0;
  const formSelling = parseFloat(formData.sellingPrice) || 0;
  const formProfit = formSelling - formCost;
  const formMargin = formSelling > 0 ? ((formProfit / formSelling) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 mb-1 uppercase tracking-wider">
            <UtensilsCrossed className="w-4 h-4" />
            <span>Katalog & Pengurusan Menu Café</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            PENGURUSAN MENU KURSUS MASAKAN
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Urus hidangan makanan, minuman, harga kos, harga jualan, margin keuntungan dan ketersediaan stok.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Menu Baru</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama menu, deskripsi atau ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        {/* Categories Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              selectedCategory === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua ({menu.length})
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        >
          <option value="ALL">Semua Status</option>
          <option value="AVAILABLE">AVAILABLE (Ada)</option>
          <option value="OUT OF STOCK">OUT OF STOCK (Habis)</option>
          <option value="INACTIVE">INACTIVE (Tidak Aktif)</option>
        </select>
      </div>

      {/* Menu Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMenu.map(item => {
          const profit = item.sellingPrice - item.costPrice;
          const margin = item.sellingPrice > 0 ? ((profit / item.sellingPrice) * 100).toFixed(1) : 0;

          return (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition group"
            >
              <div>
                {/* Image & Badges */}
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80";
                    }}
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-slate-900/80 backdrop-blur-md text-white">
                      {item.category}
                    </span>
                    <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-md text-slate-800">
                      {item.id}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-wide ${
                      item.status === 'AVAILABLE' ? 'bg-emerald-500 text-white shadow-xs' :
                      item.status === 'OUT OF STOCK' ? 'bg-rose-500 text-white' :
                      'bg-slate-400 text-white'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-bold text-slate-900 text-base leading-snug">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Financial Metrics */}
                  <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-slate-50 rounded-xl">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Kos</span>
                      <p className="text-xs font-black text-slate-700">RM {item.costPrice.toFixed(2)}</p>
                    </div>
                    <div className="p-2 bg-emerald-50 rounded-xl">
                      <span className="text-[10px] font-bold text-emerald-700 uppercase">Jualan</span>
                      <p className="text-xs font-black text-emerald-700">RM {item.sellingPrice.toFixed(2)}</p>
                    </div>
                    <div className="p-2 bg-indigo-50 rounded-xl">
                      <span className="text-[10px] font-bold text-indigo-700 uppercase">Untung ({margin}%)</span>
                      <p className="text-xs font-black text-indigo-700">RM {profit.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>Kuantiti Sedia Ada:</span>
                    <span className="font-bold text-slate-800">{item.stock} {item.unit || 'Unit'}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400">
                  Unit: {item.unit || 'Pinggan'}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition"
                    title="Kemaskini Menu"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                    title="Padam Menu"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Add / Edit Menu Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 animate-fade-in max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">
                {editingItem ? 'Kemaskini Menu Makanan' : 'Tambah Menu Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-extrabold text-slate-900 block mb-1">Nama Menu Hidangan *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Nasi Ayam Istimewa GIATMARA"
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none font-bold text-slate-950 placeholder:text-slate-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-extrabold text-slate-900 block mb-1">Kategori *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none font-bold text-slate-950"
                  >
                    {categories.map(c => (
                      <option key={c} value={c} className="text-slate-950 font-bold">{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-extrabold text-slate-900 block mb-1">Unit Hidangan</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="Pinggan, Gelas, Set, Mangkuk"
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl outline-none font-bold text-slate-950 placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-extrabold text-slate-900 block mb-1">Deskripsi Menu</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Huraian ramuan, rempah dan keistimewaan hidangan..."
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl outline-none font-bold text-slate-950 placeholder:text-slate-500 resize-none"
                />
              </div>

              <div>
                <label className="font-extrabold text-slate-900 block mb-1">URL Gambar Makanan</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl outline-none font-bold text-slate-950 placeholder:text-slate-500"
                />
              </div>

              {/* Price & Auto Calculation */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-300">
                <div>
                  <label className="font-extrabold text-slate-900 block mb-1">Harga Kos (RM) *</label>
                  <input
                    type="number"
                    step="0.10"
                    min="0"
                    required
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                    placeholder="Contoh: 5.00"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-black text-slate-950 placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <label className="font-extrabold text-slate-900 block mb-1">Harga Jualan (RM) *</label>
                  <input
                    type="number"
                    step="0.10"
                    min="0"
                    required
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                    placeholder="Contoh: 8.00"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-black text-emerald-800 placeholder:text-slate-500"
                  />
                </div>

                <div className="col-span-2 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                  <span className="text-slate-800 font-bold">
                    Untung Kasar: <span className="font-black text-indigo-700">RM {formProfit.toFixed(2)}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-900 font-black">
                    Margin: {formMargin}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-extrabold text-slate-900 block mb-1">Kuantiti Baki (Stok) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl font-black text-slate-950"
                  />
                </div>
                <div>
                  <label className="font-extrabold text-slate-900 block mb-1">Status Ketersediaan</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-950"
                  >
                    <option value="AVAILABLE" className="text-slate-950 font-bold">AVAILABLE (Ada)</option>
                    <option value="OUT OF STOCK" className="text-slate-950 font-bold">OUT OF STOCK (Habis)</option>
                    <option value="INACTIVE" className="text-slate-950 font-bold">INACTIVE (Nyahaktif)</option>
                  </select>
                </div>
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
                  className="px-5 py-2 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md"
                >
                  {editingItem ? 'Simpan Perubahan' : 'Daftar Menu'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
