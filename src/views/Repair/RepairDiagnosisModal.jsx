import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wrench,
  Package,
  Plus,
  Trash2,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  X,
  CheckCircle2
} from 'lucide-react';

export const RepairDiagnosisModal = ({ job, onClose }) => {
  const { inventory, updateRepairJob, showToast } = useApp();

  const [diagnosis, setDiagnosis] = useState(job.diagnosis || '');
  const [damageType, setDamageType] = useState(job.damageType || 'Broken Screen');
  const [notes, setNotes] = useState(job.notes || '');
  const [labourCost, setLabourCost] = useState(job.labourCost || 30);
  const [warrantyPeriod, setWarrantyPeriod] = useState(job.warrantyPeriod || '30 Hari Waranti Servis GIATMARA');

  // Selected spare parts
  const [partsUsed, setPartsUsed] = useState(job.partsUsed || []);
  const [selectedPartId, setSelectedPartId] = useState('');

  // Available spare parts in inventory
  const sparePartsInStock = inventory.filter(i => i.category === 'Smartphone Spare Parts');

  const handleAddPart = () => {
    if (!selectedPartId) return;
    const item = inventory.find(i => i.id === selectedPartId);
    if (!item) return;

    if (partsUsed.some(p => p.partId === item.id)) {
      showToast('Alat ganti ini telah dimasukkan.', 'warning');
      return;
    }

    setPartsUsed(prev => [
      ...prev,
      {
        partId: item.id,
        name: item.name,
        costPrice: item.costPrice,
        sellingPrice: item.sellingPrice,
        quantity: 1
      }
    ]);
    setSelectedPartId('');
  };

  const handleRemovePart = (partId) => {
    setPartsUsed(prev => prev.filter(p => p.partId !== partId));
  };

  // Calculations
  const partsCost = partsUsed.reduce((acc, p) => acc + (p.costPrice * (p.quantity || 1)), 0);
  const partsSelling = partsUsed.reduce((acc, p) => acc + (p.sellingPrice * (p.quantity || 1)), 0);
  const labour = parseFloat(labourCost) || 0;
  const totalCost = partsCost + labour;
  const totalSelling = partsSelling + labour;
  const grossProfit = totalSelling - partsCost; // internal gross margin

  const handleSubmit = (e) => {
    e.preventDefault();

    updateRepairJob(job.id, {
      diagnosis,
      damageType,
      notes,
      partsUsed,
      partsCost,
      labourCost: labour,
      totalCost,
      sellingPrice: totalSelling,
      grossProfit,
      warrantyPeriod,
      repairStatus: job.repairStatus === 'RECEIVED' ? 'DIAGNOSIS' : job.repairStatus
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 border border-slate-200 animate-fade-in my-8 max-h-[90vh] overflow-y-auto text-xs">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-900">
                Diagnosis Kerosakan & Pemilihan Alat Ganti
              </h3>
              <p className="text-[11px] text-slate-500">
                Job ID: <span className="font-bold text-slate-900">{job.id}</span> ({job.deviceBrand} {job.deviceModel})
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Section 1: Diagnosis Details */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-extrabold text-slate-900 block mb-1 text-xs">Jenis Kerosakan (Damage Type) *</label>
                <select
                  value={damageType}
                  onChange={(e) => setDamageType(e.target.value)}
                  className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-xl font-bold text-slate-950 outline-none focus:border-blue-600"
                >
                  <option value="Broken Screen" className="text-slate-950 font-bold bg-white">Broken Screen (Skrin Pecah/LCD Rosak)</option>
                  <option value="Battery Problem" className="text-slate-950 font-bold bg-white">Battery Problem (Bateri Kembung/Degrade)</option>
                  <option value="Charging Problem" className="text-slate-950 font-bold bg-white">Charging Problem (Port Caj/Sub-Board)</option>
                  <option value="Camera Problem" className="text-slate-950 font-bold bg-white">Camera Problem (Kamera Kabur/Gagal)</option>
                  <option value="Speaker Problem" className="text-slate-950 font-bold bg-white">Speaker Problem (Tiada Suara/Pecah)</option>
                  <option value="Software Problem" className="text-slate-950 font-bold bg-white">Software Problem (Bootloop/Flash)</option>
                  <option value="Water Damage" className="text-slate-950 font-bold bg-white">Water Damage (Masuk Air/Litar Pintas)</option>
                  <option value="Motherboard Problem" className="text-slate-950 font-bold bg-white">Motherboard Problem (IC/PMIC Rosak)</option>
                  <option value="Other" className="text-slate-950 font-bold bg-white">Lain-lain Kerosakan</option>
                </select>
              </div>

              <div>
                <label className="font-extrabold text-slate-900 block mb-1 text-xs">Jaminan Servis (Warranty)</label>
                <input
                  type="text"
                  value={warrantyPeriod}
                  onChange={(e) => setWarrantyPeriod(e.target.value)}
                  className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-xl outline-none font-bold text-slate-950 placeholder:text-slate-500 focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="font-extrabold text-slate-900 block mb-1 text-xs">Catatan Hasil Diagnosis Teknikal *</label>
              <textarea
                rows="2"
                required
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="Keputusan pemeriksaan multimeter, mikroskop, voltan atau ujian fungsi peranti..."
                className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-xl outline-none font-bold text-slate-950 placeholder:text-slate-500 resize-none focus:border-blue-600"
              />
            </div>
          </div>

          {/* Section 2: Spare Parts Selection */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <span className="font-black text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-blue-600" />
              Alat Ganti Digunakan (Ditolak dari Inventori Pusat)
            </span>

            <div className="flex gap-2">
              <select
                value={selectedPartId}
                onChange={(e) => setSelectedPartId(e.target.value)}
                className="flex-1 px-3 py-2 bg-white border-2 border-slate-300 rounded-xl font-bold text-slate-950 outline-none focus:border-blue-600"
              >
                <option value="" className="text-slate-950 font-bold bg-white">-- Pilih Spare Part Dari Inventori --</option>
                {sparePartsInStock.map(p => (
                  <option key={p.id} value={p.id} disabled={p.currentStock <= 0} className="text-slate-950 font-bold bg-white">
                    {p.name} [Stok: {p.currentStock} {p.unit}] - Kos: RM {p.costPrice.toFixed(2)} | Jual: RM {p.sellingPrice.toFixed(2)}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAddPart}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center gap-1 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Part</span>
              </button>
            </div>

            {/* List of Added Spare Parts */}
            <div className="space-y-1.5">
              {partsUsed.length === 0 ? (
                <p className="text-[11px] text-slate-400 italic py-2">
                  Tiada alat ganti dipilih (cth: untuk servis software atau pembersihan sahaja).
                </p>
              ) : (
                partsUsed.map(p => (
                  <div
                    key={p.partId}
                    className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-bold text-slate-900">{p.name}</p>
                      <span className="text-[10px] text-slate-500">
                        Kos: RM {p.costPrice.toFixed(2)} • Harga Pelanggan: RM {p.sellingPrice.toFixed(2)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemovePart(p.partId)}
                      className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Section 3: Cost vs Selling Price vs Profit Live Calculation */}
          <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-200 space-y-3">
            <span className="font-black text-indigo-950 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
              Kiraan Kos, Upah Buruh & Untung Kasar Sebut Harga
            </span>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-2.5 bg-white rounded-xl border border-indigo-100">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Kos Alat Ganti</span>
                <p className="text-sm font-black text-slate-900 mt-0.5">RM {partsCost.toFixed(2)}</p>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-indigo-100">
                <label className="text-[10px] font-bold text-slate-700 uppercase block mb-0.5">Upah Servis (RM)</label>
                <input
                  type="number"
                  step="5"
                  min="0"
                  value={labourCost}
                  onChange={(e) => setLabourCost(e.target.value)}
                  className="w-full font-black text-sm text-slate-900 outline-none"
                />
              </div>

              <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-xs">
                <span className="text-[10px] font-bold text-indigo-200 uppercase">Jumlah Sebut Harga</span>
                <p className="text-sm font-black mt-0.5">RM {totalSelling.toFixed(2)}</p>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs font-bold text-emerald-800 pt-1">
              <span>Anggaran Untung Kasar Projek Baiki:</span>
              <span className="text-sm font-black">RM {grossProfit.toFixed(2)}</span>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-semibold rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition"
            >
              Simpan Diagnosis & Kemaskini Sebut Harga
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
