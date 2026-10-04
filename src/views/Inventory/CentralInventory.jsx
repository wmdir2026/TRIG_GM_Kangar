import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext';
import {
  Package,
  Plus,
  Search,
  Filter,
  ArrowLeftRight,
  AlertTriangle,
  Edit2,
  CheckCircle,
  Truck,
  Layers,
  X,
  Trash2,
  Clock,
  ShieldCheck,
  Send,
  Info
} from 'lucide-react';

export const CentralInventory = () => {
  const {
    currentUser,
    inventory,
    addInventoryItem,
    updateInventoryItem,
    adjustStock,
    suppliers,
    showToast,
    deleteInventoryItem,
    requestRemoveInventoryItem,
    cancelRemoveInventoryItem
  } = useApp();

  // Role permissions
  const isSuperAdmin = currentUser?.role === 'SUPER ADMIN';
  const isManager =
    currentUser?.role === 'MANAGER' ||
    currentUser?.role === 'MANAGER SMARTPHONE REPAIR' ||
    (currentUser?.role && currentUser.role.includes('MANAGER'));
  const canManageAccessories = isSuperAdmin || isManager;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Modals
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [adjustTargetItem, setAdjustTargetItem] = useState(null);
  const [adjustQty, setAdjustQty] = useState('');
  const [adjustType, setAdjustType] = useState('STOCK_IN');
  const [adjustRef, setAdjustRef] = useState('');

  // Remove Accessory / Inventory Item Modal State
  const [selectedItemForRemoval, setSelectedItemForRemoval] = useState(null);
  const [removalReason, setRemovalReason] = useState('');

  // Lock body scroll while modal is active
  useEffect(() => {
    if (selectedItemForRemoval || isItemModalOpen || isAdjustModalOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [selectedItemForRemoval, isItemModalOpen, isAdjustModalOpen]);

  // Item Form State
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    category: 'Smartphone Spare Parts',
    brand: '',
    model: '',
    supplierId: suppliers[0]?.id || '',
    costPrice: '',
    sellingPrice: '',
    currentStock: '',
    minStock: 5,
    unit: 'Unit',
    location: 'Kabinet Komponen Baiki'
  });

  const categories = [
    'ALL',
    'Café Raw Materials',
    'Food Packaging',
    'Smartphone Spare Parts',
    'Smartphone Accessories',
    'Repair Tools'
  ];

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      sku: `SKU-${Date.now().toString().slice(-4)}`,
      name: '',
      category: 'Smartphone Spare Parts',
      brand: '',
      model: '',
      supplierId: suppliers[0]?.id || '',
      costPrice: '',
      sellingPrice: '',
      currentStock: '10',
      minStock: 5,
      unit: 'Unit',
      location: 'Stor Utama'
    });
    setIsItemModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      sku: item.sku,
      name: item.name,
      category: item.category,
      brand: item.brand,
      model: item.model,
      supplierId: item.supplierId,
      costPrice: item.costPrice,
      sellingPrice: item.sellingPrice,
      currentStock: item.currentStock,
      minStock: item.minStock,
      unit: item.unit,
      location: item.location
    });
    setIsItemModalOpen(true);
  };

  const handleOpenAdjust = (item) => {
    setAdjustTargetItem(item);
    setAdjustQty('5');
    setAdjustType('STOCK_IN');
    setAdjustRef('Penerimaan Stok Baharu');
    setIsAdjustModalOpen(true);
  };

  const handleItemSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.costPrice) {
      alert('Sila lengkapkan maklumat item inventori.');
      return;
    }

    if (editingItem) {
      updateInventoryItem(editingItem.id, formData);
    } else {
      addInventoryItem(formData);
    }
    setIsItemModalOpen(false);
  };

  const handleAdjustSubmit = (e) => {
    e.preventDefault();
    const qty = parseInt(adjustQty) || 0;
    if (qty <= 0) {
      showToast('Kuantiti pelarasan mestilah lebih daripada 0.', 'warning');
      return;
    }

    adjustStock(adjustTargetItem.id, qty, adjustType, adjustRef);
    setIsAdjustModalOpen(false);
    showToast(`Stok "${adjustTargetItem.name}" berjaya diselaraskan.`);
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 mb-1 uppercase tracking-wider">
            <Package className="w-4 h-4" />
            <span>Pusat Kawalan Stok & Inventori Bersepadu</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            INVENTORI PUSAT TRIG GIATMARA
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Mengurus stok Bahan Mentah Café, Pembungkusan, Alat Ganti Smartphone (LCD/Bateri/Port), Aksesori dan Peralatan Bengkel.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Item Inventori</span>
        </button>
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari item, SKU, jenama..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'ALL' ? `Semua (${inventory.length})` : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold">
              <tr>
                <th className="py-3.5 px-4">Item & SKU</th>
                <th className="py-3.5 px-4">Kategori & Jenama</th>
                <th className="py-3.5 px-4">Lokasi Stor</th>
                <th className="py-3.5 px-4 text-center">Stok Semasa</th>
                <th className="py-3.5 px-4">Paras Min</th>
                <th className="py-3.5 px-4">Harga Kos (RM)</th>
                <th className="py-3.5 px-4">Harga Jual (RM)</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredInventory.map(item => {
                const isLow = item.currentStock <= item.minStock;
                const isOut = item.currentStock === 0;

                const isPendingRemoval = item.removalStatus === 'PENDING_APPROVAL';

                return (
                  <tr key={item.id} className={`hover:bg-slate-50/80 transition ${isPendingRemoval ? 'bg-amber-50/30' : ''}`}>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block">{item.name}</span>
                      <span className="text-[10px] text-indigo-700 font-mono font-semibold">{item.sku}</span>

                      {/* Display removal request comment if pending approval */}
                      {isPendingRemoval && item.removalReason && (
                        <div className="mt-1.5 p-2 bg-rose-50 border border-rose-200 rounded-xl text-[10px] text-rose-900 leading-tight">
                          <span className="font-black text-rose-700">Permohonan Buang Aksesori:</span>
                          <p className="italic mt-0.5 font-medium">"{item.removalReason}"</p>
                          <span className="text-[9px] text-rose-500 font-semibold block mt-0.5">
                            Oleh: {item.removalRequestedBy || 'Manager'} • {item.removalRequestedAt ? new Date(item.removalRequestedAt).toLocaleDateString('ms-MY') : ''}
                          </span>
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800 block">{item.category}</span>
                      <span className="text-[10px] text-slate-500">{item.brand} {item.model ? `• ${item.model}` : ''}</span>
                    </td>

                    <td className="py-3 px-4 text-[11px] text-slate-500 max-w-xs truncate">
                      {item.location || '-'}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full font-black text-xs ${
                        isOut ? 'bg-rose-100 text-rose-800' :
                        isLow ? 'bg-amber-100 text-amber-800 animate-pulse' :
                        'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}>
                        {item.currentStock} {item.unit}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-[11px] text-slate-500">
                      {item.minStock} {item.unit}
                    </td>

                    <td className="py-3 px-4 font-bold text-slate-800">
                      RM {item.costPrice.toFixed(2)}
                    </td>

                    <td className="py-3 px-4 font-bold text-emerald-700">
                      {item.sellingPrice > 0 ? `RM ${item.sellingPrice.toFixed(2)}` : '-'}
                    </td>

                    <td className="py-3 px-4">
                      {isPendingRemoval ? (
                        <div className="flex flex-col gap-1 items-start">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-600 text-white uppercase inline-flex items-center gap-1 shadow-xs animate-pulse">
                            <AlertTriangle className="w-3 h-3 shrink-0" />
                            <span>MENUNGGU PADAM (SUPER ADMIN)</span>
                          </span>
                        </div>
                      ) : (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          isOut ? 'bg-rose-500 text-white' :
                          isLow ? 'bg-amber-500 text-white' :
                          'bg-emerald-100 text-emerald-800'
                        }`}>
                          {item.status}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5 flex-wrap">
                        {isPendingRemoval ? (
                          <>
                            {isSuperAdmin ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (window.confirm(`Adakah anda pasti mahu memadam aksesori "${item.name}" ini sepenuhnya daripada inventori?`)) {
                                      deleteInventoryItem(item.id, item.removalReason || 'Diluluskan Super Admin');
                                    }
                                  }}
                                  className="px-2.5 py-1 text-[11px] font-black bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-xs flex items-center gap-1 transition cursor-pointer"
                                  title="Padam Aksesori Sepenuhnya (Hanya Super Admin)"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Padam (Super Admin)</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => cancelRemoveInventoryItem(item.id)}
                                  className="px-2 py-1 text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition cursor-pointer"
                                  title="Tolak / Batal permohonan padam"
                                >
                                  Tolak
                                </button>
                              </>
                            ) : (
                              <span className="px-2 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-[10px] font-bold inline-flex items-center gap-1">
                                <Clock className="w-3 h-3 text-amber-600 shrink-0" />
                                <span>Menunggu Super Admin</span>
                              </span>
                            )}
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleOpenAdjust(item)}
                              className="px-2.5 py-1 text-[11px] font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition"
                              title="Laras Stok Manual"
                            >
                              Laras Stok
                            </button>
                            <button
                              onClick={() => handleOpenEdit(item)}
                              className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg"
                              title="Kemaskini Butiran Item"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            {/* Tombol Buang Item (Manager & Super Admin) */}
                            {canManageAccessories && (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedItemForRemoval(item);
                                  setRemovalReason('');
                                }}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                title={isSuperAdmin ? 'Padam Aksesori (Super Admin)' : 'Mohon Buang Aksesori (Manager)'}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Item Modal */}
      {isItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 animate-fade-in text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-black text-base text-slate-900">
                {editingItem ? 'Kemaskini Item Inventori' : 'Tambah Item Inventori Baharu'}
              </h3>
              <button onClick={() => setIsItemModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleItemSubmit} className="space-y-4">
              <div>
                <label className="font-extrabold text-slate-900 block mb-1 text-xs">Nama Item / Komponen *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: LCD Screen Replacement Samsung Galaxy A55"
                  className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-xl font-bold text-slate-950 placeholder:text-slate-500 outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-extrabold text-slate-900 block mb-1 text-xs">Kategori Inventori *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-xl font-bold text-slate-950 outline-none focus:border-indigo-600"
                  >
                    <option value="Café Raw Materials" className="text-slate-950 font-bold bg-white">Café Raw Materials (Bahan Masakan)</option>
                    <option value="Food Packaging" className="text-slate-950 font-bold bg-white">Food Packaging (Kotak Makanan)</option>
                    <option value="Smartphone Spare Parts" className="text-slate-950 font-bold bg-white">Smartphone Spare Parts (LCD/Bateri)</option>
                    <option value="Smartphone Accessories" className="text-slate-950 font-bold bg-white">Smartphone Accessories (Aksesori)</option>
                    <option value="Repair Tools" className="text-slate-950 font-bold bg-white">Repair Tools (Peralatan)</option>
                  </select>
                </div>

                <div>
                  <label className="font-extrabold text-slate-900 block mb-1 text-xs">Kod SKU *</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-xl font-mono uppercase font-bold text-slate-950 placeholder:text-slate-500 outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-extrabold text-slate-900 block mb-1 text-xs">Jenama (Brand)</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="Samsung, Jasmine, EcoPack..."
                    className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-xl font-bold text-slate-950 placeholder:text-slate-500 outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="font-extrabold text-slate-900 block mb-1 text-xs">Model / Varian</label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    placeholder="SM-A556B / 10kg"
                    className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-xl font-bold text-slate-950 placeholder:text-slate-500 outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-extrabold text-slate-900 block mb-1 text-xs">Harga Kos (RM) *</label>
                  <input
                    type="number"
                    step="0.10"
                    min="0"
                    required
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                    placeholder="85.00"
                    className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-xl font-bold text-slate-950 placeholder:text-slate-500 outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="font-extrabold text-slate-900 block mb-1 text-xs">Harga Jualan (RM)</label>
                  <input
                    type="number"
                    step="0.10"
                    min="0"
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                    placeholder="130.00"
                    className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-xl font-bold text-slate-950 placeholder:text-slate-500 outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-extrabold text-slate-900 block mb-1 text-xs">Stok Semasa</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.currentStock}
                    onChange={(e) => setFormData({ ...formData, currentStock: e.target.value })}
                    className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-xl font-bold text-slate-950 outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="font-extrabold text-slate-900 block mb-1 text-xs">Paras Min Stok</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.minStock}
                    onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                    className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-xl font-bold text-slate-950 outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="font-extrabold text-slate-900 block mb-1 text-xs">Unit</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="Unit, Beg, Pek..."
                    className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-xl font-bold text-slate-950 placeholder:text-slate-500 outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="font-extrabold text-slate-900 block mb-1 text-xs">Lokasi Stor / Rak</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Kabinet Baiki Rak SP1, Stor Kering A1..."
                  className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-xl font-bold text-slate-950 placeholder:text-slate-500 outline-none focus:border-indigo-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsItemModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md"
                >
                  {editingItem ? 'Simpan Perubahan' : 'Daftar Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Adjust Stock Modal */}
      {isAdjustModalOpen && adjustTargetItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 border border-slate-200 animate-fade-in text-xs">
            <h3 className="font-black text-base text-slate-900 mb-1">Pelarasan Stok Manual</h3>
            <p className="text-slate-500 mb-3">
              Item: <span className="font-bold text-slate-900">{adjustTargetItem.name}</span>
              <br />
              Stok Semasa: <span className="font-black text-indigo-700">{adjustTargetItem.currentStock} {adjustTargetItem.unit}</span>
            </p>

            <form onSubmit={handleAdjustSubmit} className="space-y-3">
              <div>
                <label className="font-extrabold text-slate-900 block mb-1 text-xs">Jenis Pelarasan *</label>
                <select
                  value={adjustType}
                  onChange={(e) => setAdjustType(e.target.value)}
                  className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-xl font-bold text-slate-950 outline-none focus:border-indigo-600"
                >
                  <option value="STOCK_IN" className="text-slate-950 font-bold bg-white">STOCK IN (Tambah Stok Masuk)</option>
                  <option value="STOCK_OUT" className="text-slate-950 font-bold bg-white">STOCK OUT (Kurangkan Stok Keluar)</option>
                  <option value="ADJUSTMENT" className="text-slate-950 font-bold bg-white">ADJUSTMENT (Pelarasan Audit)</option>
                  <option value="DAMAGED" className="text-slate-950 font-bold bg-white">DAMAGED (Stok Rosak/Lupus)</option>
                  <option value="RETURNED" className="text-slate-950 font-bold bg-white">RETURNED (Pemulangan Pembekal)</option>
                </select>
              </div>

              <div>
                <label className="font-extrabold text-slate-900 block mb-1 text-xs">Kuantiti *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(e.target.value)}
                  className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-xl font-black text-sm text-slate-950 outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="font-extrabold text-slate-900 block mb-1 text-xs">Rujukan / Sebab</label>
                <input
                  type="text"
                  value={adjustRef}
                  onChange={(e) => setAdjustRef(e.target.value)}
                  placeholder="Kira stok fizikal, terima tambahan..."
                  className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-xl font-bold text-slate-950 placeholder:text-slate-500 outline-none focus:border-indigo-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAdjustModalOpen(false)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md"
                >
                  Sahkan Pelarasan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Remove / Delete Item Modal (Super Admin & Manager) */}
      {selectedItemForRemoval && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-slate-200 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl ${isSuperAdmin ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                  {isSuperAdmin ? <Trash2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900">
                    {isSuperAdmin ? 'Padam Aksesori Sepenuhnya' : 'Permohonan Buang Aksesori'}
                  </h3>
                  <span className="text-[10px] text-slate-500 font-semibold">
                    {isSuperAdmin ? 'Kuasa Mutlak Super Admin' : 'Memerlukan Kelulusan Super Admin'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedItemForRemoval(null);
                  setRemovalReason('');
                }}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Item Details Card */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 mb-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded">
                  {selectedItemForRemoval.sku}
                </span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">
                  Stok: {selectedItemForRemoval.currentStock} {selectedItemForRemoval.unit}
                </span>
              </div>
              <h4 className="font-extrabold text-xs text-slate-900">
                {selectedItemForRemoval.name}
              </h4>
              <p className="text-[10px] text-slate-500">
                {selectedItemForRemoval.brand} • {selectedItemForRemoval.model} • RM {selectedItemForRemoval.sellingPrice?.toFixed(2)}
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!removalReason.trim()) {
                  showToast('Sila isi ulasan / sebab pembuangan aksesori.', 'error');
                  return;
                }

                if (isSuperAdmin) {
                  deleteInventoryItem(selectedItemForRemoval.id, removalReason.trim());
                } else {
                  requestRemoveInventoryItem(selectedItemForRemoval.id, removalReason.trim());
                }

                setSelectedItemForRemoval(null);
                setRemovalReason('');
              }}
              className="space-y-4"
            >
              <div>
                <label className="font-extrabold text-slate-900 block mb-1.5 text-xs">
                  Ulasan / Sebab Pembuangan Aksesori <span className="text-rose-600">* (Wajib Diisi)</span>:
                </label>
                <textarea
                  required
                  rows={3}
                  value={removalReason}
                  onChange={(e) => setRemovalReason(e.target.value)}
                  placeholder="Contoh: Stok rosak fizikal / model telefon lapuk tidak lagi digunakan / pembekal tamatkan jualan..."
                  className="w-full px-3 py-2.5 bg-white border-2 border-slate-300 rounded-xl font-medium text-slate-900 placeholder:text-slate-400 outline-none focus:border-rose-500"
                />
                <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                  <Info className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>
                    {isSuperAdmin
                      ? 'Catatan ulasan ini akan disimpan ke dalam rekod Audit Trail sistem secara kekal.'
                      : 'Permohonan akan dihantar dan dipaparkan di bawah status "MENUNGGU PADAM (SUPER ADMIN)".'}
                  </span>
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedItemForRemoval(null);
                    setRemovalReason('');
                  }}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 font-black text-white rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5 ${
                    isSuperAdmin
                      ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                      : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20'
                  }`}
                >
                  {isSuperAdmin ? (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Padam Sepenuhnya (Super Admin)</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Hantar Permohonan Buang</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};
