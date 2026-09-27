import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Layers,
  Plus,
  Search,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Edit2,
  Trash2,
  X
} from 'lucide-react';

export const RepairTools = () => {
  const { repairTools, addRepairTool, updateRepairTool, deleteRepairTool } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Soldering & Desoldering',
    brand: '',
    serialNumber: '',
    quantity: 1,
    purchaseDate: new Date().toISOString().split('T')[0],
    purchasePrice: '',
    location: 'Bengkel Baiki Smartphone - Meja Stesen 1-6',
    condition: 'GOOD',
    status: 'AVAILABLE'
  });

  const handleOpenAdd = () => {
    setEditingTool(null);
    setFormData({
      name: '',
      category: 'Soldering & Desoldering',
      brand: '',
      serialNumber: '',
      quantity: 1,
      purchaseDate: new Date().toISOString().split('T')[0],
      purchasePrice: '',
      location: 'Bengkel Baiki Smartphone - Meja Stesen 1-6',
      condition: 'GOOD',
      status: 'AVAILABLE'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tool) => {
    setEditingTool(tool);
    setFormData({
      name: tool.name,
      category: tool.category,
      brand: tool.brand,
      serialNumber: tool.serialNumber,
      quantity: tool.quantity,
      purchaseDate: tool.purchaseDate || new Date().toISOString().split('T')[0],
      purchasePrice: tool.purchasePrice || '',
      location: tool.location,
      condition: tool.condition,
      status: tool.status
    });
    setIsModalOpen(true);
  };

  const handleDelete = (tool) => {
    if (window.confirm(`Adakah anda pasti ingin memadam ${tool.name}?`)) {
      if (deleteRepairTool) {
        deleteRepairTool(tool.id);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    const payload = {
      ...formData,
      quantity: parseInt(formData.quantity) || 1,
      purchasePrice: parseFloat(formData.purchasePrice) || 0
    };

    if (editingTool) {
      updateRepairTool(editingTool.id, payload);
    } else {
      addRepairTool(payload);
    }
    setIsModalOpen(false);
  };

  const filteredTools = repairTools.filter(t => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.serialNumber && t.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCondition = selectedCondition === 'ALL' || t.condition === selectedCondition;
    return matchesSearch && matchesCondition;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 mb-1 uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>Peralatan & Mesin Bengkel Baiki</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            PENGURUSAN PERALATAN BENGKEL SMARTPHONE
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Pantau inventori alat pembaikan, mesin hot air, mikroskop stereo 4K, pemisah LCD dan stesen pematerian pelatih.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          <span>Daftar Peralatan Baru</span>
        </button>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari peralatan, jenama, no. siri..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
          />
        </div>

        <select
          value={selectedCondition}
          onChange={(e) => setSelectedCondition(e.target.value)}
          className="text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
        >
          <option value="ALL">Semua Keadaan</option>
          <option value="GOOD">GOOD (Elok/Sempurna)</option>
          <option value="FAIR">FAIR (Sederhana)</option>
          <option value="DAMAGED">DAMAGED (Rosak)</option>
          <option value="UNDER_MAINTENANCE">UNDER MAINTENANCE (Diselenggara)</option>
        </select>
      </div>

      {/* Tools Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold">
              <tr>
                <th className="py-3.5 px-4">Peralatan & ID</th>
                <th className="py-3.5 px-4">Kategori & Jenama</th>
                <th className="py-3.5 px-4">No. Siri / Model</th>
                <th className="py-3.5 px-4 text-center">Kuantiti</th>
                <th className="py-3.5 px-4">Lokasi Bengkel</th>
                <th className="py-3.5 px-4">Keadaan</th>
                <th className="py-3.5 px-4">Status Penggunaan</th>
                <th className="py-3.5 px-4 text-center">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredTools.map(tool => (
                <tr key={tool.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">{tool.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{tool.id}</span>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-800 block">{tool.category}</span>
                    <span className="text-[10px] text-slate-500">{tool.brand}</span>
                  </td>

                  <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                    {tool.serialNumber || '-'}
                  </td>

                  <td className="py-3 px-4 text-center font-black text-slate-900">
                    {tool.quantity} Unit
                  </td>

                  <td className="py-3 px-4 text-[11px] text-slate-500 max-w-xs truncate">
                    {tool.location}
                  </td>

                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      tool.condition === 'GOOD' ? 'bg-emerald-100 text-emerald-800' :
                      tool.condition === 'FAIR' ? 'bg-amber-100 text-amber-800' :
                      'bg-rose-100 text-rose-800'
                    }`}>
                      {tool.condition}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      tool.status === 'AVAILABLE' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                      tool.status === 'IN_USE' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {tool.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(tool)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200 hover:border-blue-600 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                        title="Kemaskini Peralatan"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(tool)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        title="Padam Peralatan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Tool Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 animate-fade-in text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-black text-base text-slate-900">
                {editingTool ? 'Kemaskini Peralatan Bengkel' : 'Daftar Peralatan Bengkel Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-extrabold text-slate-900 block mb-1">Nama Peralatan / Mesin *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Quick 858D SMD Hot Air Rework Station"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-950 placeholder:text-slate-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-extrabold text-slate-900 block mb-1">Kategori *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-950 outline-none"
                  >
                    <option value="Soldering & Desoldering" className="text-slate-950 font-bold">Soldering & Desoldering</option>
                    <option value="Diagnostics & Inspection" className="text-slate-950 font-bold">Diagnostics & Inspection (Mikroskop)</option>
                    <option value="Screen Repair & Refurbishment" className="text-slate-950 font-bold">Screen Repair (Pemisah LCD)</option>
                    <option value="Hand Tools" className="text-slate-950 font-bold">Hand Tools (Pemutar Skru/Pinset)</option>
                    <option value="Power Diagnostics" className="text-slate-950 font-bold">Power Diagnostics (DC Power Supply)</option>
                  </select>
                </div>

                <div>
                  <label className="font-extrabold text-slate-900 block mb-1">Jenama (Brand)</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="Quick, OSS, Relife..."
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-950 placeholder:text-slate-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-extrabold text-slate-900 block mb-1">No. Siri</label>
                  <input
                    type="text"
                    value={formData.serialNumber}
                    onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                    placeholder="Siri / SN"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-950 placeholder:text-slate-500 outline-none"
                  />
                </div>

                <div>
                  <label className="font-extrabold text-slate-900 block mb-1">Kuantiti</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-black text-slate-950 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-extrabold text-slate-900 block mb-1">Keadaan Alat</label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-950 outline-none"
                  >
                    <option value="GOOD" className="text-slate-950 font-bold">GOOD (Baik & Elok)</option>
                    <option value="FAIR" className="text-slate-950 font-bold">FAIR (Sederhana)</option>
                    <option value="DAMAGED" className="text-slate-950 font-bold">DAMAGED (Rosak)</option>
                    <option value="UNDER_MAINTENANCE" className="text-slate-950 font-bold">UNDER MAINTENANCE (Diselenggara)</option>
                  </select>
                </div>

                <div>
                  <label className="font-extrabold text-slate-900 block mb-1">Status Penggunaan</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-950 outline-none"
                  >
                    <option value="AVAILABLE" className="text-slate-950 font-bold">AVAILABLE (Tersedia)</option>
                    <option value="IN_USE" className="text-slate-950 font-bold">IN USE (Sedang Diguna)</option>
                    <option value="MAINTENANCE" className="text-slate-950 font-bold">MAINTENANCE (Penyelenggaraan)</option>
                    <option value="DISPOSED" className="text-slate-950 font-bold">DISPOSED (Dilupuskan)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-extrabold text-slate-900 block mb-1">Lokasi di Bengkel</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Meja Stesen 1-6, Stesen Diagnosis..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-950 placeholder:text-slate-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md"
                >
                  {editingTool ? 'Simpan' : 'Daftar Alat'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
