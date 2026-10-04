import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  CheckCircle2,
  Globe,
  ShoppingCart,
  Layers,
  ArrowRight,
  ShieldCheck,
  Info
} from 'lucide-react';

export const RepairDiagnosisModal = ({ job, onClose }) => {
  const { inventory, updateRepairJob, addInventoryItem, showToast } = useApp();

  const [diagnosis, setDiagnosis] = useState(job.diagnosis || '');
  const [damageType, setDamageType] = useState(job.damageType || 'Broken Screen');
  const [notes, setNotes] = useState(job.notes || '');
  const [labourCost, setLabourCost] = useState(job.labourCost !== undefined ? job.labourCost : 30);
  const [warrantyPeriod, setWarrantyPeriod] = useState(job.warrantyPeriod || '30 Hari Waranti Servis GIATMARA');

  // Selected spare parts list
  const [partsUsed, setPartsUsed] = useState(job.partsUsed || []);

  // Option 1: Existing Central Inventory Spare Parts Selection
  const [selectedStockPartId, setSelectedStockPartId] = useState('');
  const [stockPartQty, setStockPartQty] = useState(1);

  // Option 2: Manual Entry (Online Order / External Supplier)
  const [manualPartName, setManualPartName] = useState('');
  const [manualPartQty, setManualPartQty] = useState(1);
  const [manualCostPrice, setManualCostPrice] = useState('');
  const [manualSellingPrice, setManualSellingPrice] = useState('');
  const [manualSaveToStock, setManualSaveToStock] = useState(false);
  const [manualExtraQty, setManualExtraQty] = useState(1);

  // Available spare parts in inventory
  const sparePartsInStock = (inventory || []).filter(i => i.category === 'Smartphone Spare Parts');

  // Handle Add from Central Stock
  const handleAddStockPart = () => {
    if (!selectedStockPartId) {
      showToast('Sila pilih alat ganti dari senarai inventori.', 'warning');
      return;
    }
    const item = inventory.find(i => i.id === selectedStockPartId);
    if (!item) return;

    const qty = parseInt(stockPartQty) || 1;
    if (qty <= 0) {
      showToast('Sila masukkan kuantiti yang sah (sekurang-kurangnya 1).', 'warning');
      return;
    }

    if (qty > (item.currentStock || 0)) {
      showToast(`Stok untuk "${item.name}" hanya berbaki ${item.currentStock || 0} unit.`, 'warning');
      return;
    }

    if (partsUsed.some(p => p.partId === item.id)) {
      showToast('Alat ganti ini telah dimasukkan dalam senarai.', 'warning');
      return;
    }

    setPartsUsed(prev => [
      ...prev,
      {
        partId: item.id,
        name: item.name,
        costPrice: Number(item.costPrice || 0),
        sellingPrice: Number(item.sellingPrice || 0),
        quantity: qty,
        source: 'STOCK',
        sku: item.sku,
        isManual: false
      }
    ]);

    setSelectedStockPartId('');
    setStockPartQty(1);
    showToast(`Alat ganti "${item.name}" berjaya ditambah!`, 'success');
  };

  // Handle Add Manual (Online Order)
  const handleAddManualPart = () => {
    if (!manualPartName.trim()) {
      showToast('Sila masukkan nama atau model alat ganti.', 'warning');
      return;
    }

    const qty = parseInt(manualPartQty) || 1;
    const cost = parseFloat(manualCostPrice);
    const selling = parseFloat(manualSellingPrice);

    if (isNaN(cost) || cost < 0) {
      showToast('Sila masukkan harga kos seunit yang sah.', 'warning');
      return;
    }

    if (isNaN(selling) || selling < 0) {
      showToast('Sila masukkan harga jual seunit yang sah.', 'warning');
      return;
    }

    const extraQty = manualSaveToStock ? (parseInt(manualExtraQty) || 0) : 0;
    const uniqueId = `ONL-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

    setPartsUsed(prev => [
      ...prev,
      {
        partId: uniqueId,
        name: manualPartName.trim(),
        costPrice: cost,
        sellingPrice: selling,
        quantity: qty,
        source: 'ONLINE',
        isManual: true,
        saveToStock: manualSaveToStock,
        extraStockQuantity: extraQty
      }
    ]);

    // Reset manual form
    setManualPartName('');
    setManualPartQty(1);
    setManualCostPrice('');
    setManualSellingPrice('');
    setManualSaveToStock(false);
    setManualExtraQty(1);
    showToast('Alat ganti pesanan online berjaya ditambah!', 'success');
  };

  // Handle Remove Part from list
  const handleRemovePart = (partId) => {
    setPartsUsed(prev => prev.filter(p => p.partId !== partId));
  };

  // Calculations
  const partsCost = partsUsed.reduce((acc, p) => acc + ((p.costPrice || 0) * (p.quantity || 1)), 0);
  const partsSelling = partsUsed.reduce((acc, p) => acc + ((p.sellingPrice || 0) * (p.quantity || 1)), 0);
  const labour = parseFloat(labourCost) || 0;
  const totalCost = partsCost + labour;
  const totalSelling = partsSelling + labour;
  const grossProfit = totalSelling - partsCost; // Untung kasar projek baiki (Jual - Kos alat ganti)

  // Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. Pastikan catatan hasil diagnosis diisi dengan lengkap
    if (!diagnosis || !diagnosis.trim() || diagnosis.trim().length < 5) {
      showToast('Sila isikan catatan hasil diagnosis teknikal dengan lengkap (sekurang-kurangnya 5 aksara).', 'warning');
      return;
    }

    // 2. Pastikan sebut harga mempunyai nilai harga yang sah (alat ganti atau upah servis)
    if (totalSelling <= 0) {
      showToast('Sila masukkan alat ganti atau tetapkan upah servis untuk menghasilkan sebut harga yang sah.', 'warning');
      return;
    }

    // Check if any manual parts have extra stock to register into central inventory
    const partsToRegister = partsUsed.filter(p => p.source === 'ONLINE' && p.saveToStock && p.extraStockQuantity > 0);
    if (partsToRegister.length > 0 && typeof addInventoryItem === 'function') {
      partsToRegister.forEach(p => {
        addInventoryItem({
          name: p.name,
          category: 'Smartphone Spare Parts',
          brand: job.deviceBrand || 'Umum',
          sku: `SP-ONL-${Date.now().toString().slice(-4)}`,
          unit: 'Unit',
          currentStock: Number(p.extraStockQuantity),
          minStock: 1,
          costPrice: Number(p.costPrice),
          sellingPrice: Number(p.sellingPrice),
          description: `Lebihan pesanan online dari Job ${job.id} (${job.customerName})`
        });
      });
      showToast(`${partsToRegister.length} alat ganti lebihan berjaya didaftarkan ke Inventori Pusat!`, 'info');
    }

    updateRepairJob(job.id, {
      diagnosis: diagnosis.trim(),
      damageType,
      notes: (notes || '').trim(),
      partsUsed,
      partsCost,
      labourCost: labour,
      totalCost,
      sellingPrice: totalSelling,
      grossProfit,
      warrantyPeriod,
      hasDiagnosis: true,
      isDiagnosed: true,
      quotationStatus: job.quotationStatus === 'PENDING' ? 'READY' : job.quotationStatus,
      repairStatus: job.repairStatus === 'RECEIVED' ? 'DIAGNOSIS' : job.repairStatus
    });

    showToast(`Diagnosis & sebut harga RM ${totalSelling.toFixed(2)} berjaya disimpan! Ikon Sebut Harga dan Langkah Seterusnya kini diaktifkan.`, 'success');
    onClose();
  };

  // Lock body scroll while modal is open to prevent page drift/jumping
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm overflow-hidden">
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full p-5 sm:p-7 border border-slate-200 animate-fade-in max-h-[90vh] overflow-y-auto text-xs">
        
        {/* ================= MODAL HEADER ================= */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl shadow-xs">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-slate-900 leading-tight">
                Diagnosis Kerosakan & Pemilihan Alat Ganti
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Job ID: <span className="font-mono font-bold text-blue-600">{job.id}</span> • Peranti: <span className="font-bold text-slate-800">{job.deviceBrand} {job.deviceModel}</span> • Pemilik: <span className="font-bold text-slate-800">{job.customerName}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* ================= SECTION 1: DIAGNOSIS & WARRANTY ================= */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-extrabold text-slate-900 block mb-1 text-xs">
                  Jenis Kerosakan (Damage Type) *
                </label>
                <select
                  value={damageType}
                  onChange={(e) => setDamageType(e.target.value)}
                  className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-xl font-bold text-slate-950 outline-none focus:border-blue-600 cursor-pointer"
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
                <label className="font-extrabold text-slate-900 block mb-1 text-xs">
                  Jaminan Servis (Warranty)
                </label>
                <input
                  type="text"
                  value={warrantyPeriod}
                  onChange={(e) => setWarrantyPeriod(e.target.value)}
                  placeholder="cth: 30 Hari Waranti Servis GIATMARA"
                  className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-xl outline-none font-bold text-slate-950 placeholder:text-slate-500 focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="font-extrabold text-slate-900 block mb-1 text-xs">
                Catatan Hasil Diagnosis Teknikal *
              </label>
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

          {/* ================= SECTION 2: 2-COLUMN SPARE PARTS & PRICING ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* ---------------- LEFT COLUMN (7 COLS): INPUT OPTIONS ---------------- */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Card 1: Option A - Central Stock Selection */}
              <div className="p-4 bg-blue-50/50 rounded-2xl border-2 border-blue-200/80 space-y-3 shadow-xs">
                <div className="flex items-center justify-between border-b border-blue-200/60 pb-2">
                  <span className="font-black text-blue-950 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-blue-600" />
                    <span>1. ALAT GANTI DARI STOK SEDIA ADA (INVENTORI PUSAT)</span>
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    Stok Tersedia
                  </span>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Pilih Alat Ganti Dari Inventori Pusat:
                    </label>
                    <select
                      value={selectedStockPartId}
                      onChange={(e) => setSelectedStockPartId(e.target.value)}
                      className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-xl font-bold text-slate-950 outline-none focus:border-blue-600 cursor-pointer"
                    >
                      <option value="" className="text-slate-950 font-bold bg-white">-- Pilih Spare Part Dari Inventori --</option>
                      {sparePartsInStock.map(p => (
                        <option
                          key={p.id}
                          value={p.id}
                          disabled={p.currentStock <= 0}
                          className="text-slate-950 font-bold bg-white"
                        >
                          {p.name} [Baki: {p.currentStock} {p.unit}] — Kos: RM {p.costPrice.toFixed(2)} | Jual: RM {p.sellingPrice.toFixed(2)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-28">
                      <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Kuantiti:</label>
                      <input
                        type="number"
                        min="1"
                        value={stockPartQty}
                        onChange={(e) => setStockPartQty(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border-2 border-slate-300 rounded-xl font-bold text-slate-950 text-center outline-none focus:border-blue-600"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleAddStockPart}
                      className="flex-1 mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Tambah Dari Stok</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Card 2: Option B - Manual Entry for Online Order / External Supplier */}
              <div className="p-4 bg-amber-50/50 rounded-2xl border-2 border-amber-300/80 space-y-3 shadow-xs">
                <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                  <div>
                    <span className="font-black text-amber-950 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-amber-600" />
                      <span>2. ISI MANUAL (ORDER ONLINE / PEMBEKAL LUAR)</span>
                    </span>
                    <p className="text-[10px] text-amber-800/80 mt-0.5">
                      Untuk model peranti yang tiada dalam stok simpanan (cth: Infinix, Tecno, Poco, dll).
                    </p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 shrink-0">
                    Pesanan Khas
                  </span>
                </div>

                <div className="space-y-3">
                  {/* Nama Spare Part */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-800 block mb-1">
                      Nama Alat Ganti / Model Telefon *
                    </label>
                    <input
                      type="text"
                      placeholder="cth: LCD Screen Infinix Hot 10 Play / Bateri Vivo Y20..."
                      value={manualPartName}
                      onChange={(e) => setManualPartName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-xl font-bold text-slate-950 placeholder:text-slate-400 outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Kuantiti, Kos & Jual */}
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-700 block mb-1">
                        Kuantiti Guna:
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={manualPartQty}
                        onChange={(e) => setManualPartQty(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border-2 border-slate-300 rounded-xl font-bold text-slate-950 text-center outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-700 block mb-1">
                        Kos Seunit (RM) *:
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        placeholder="cth: 65.00"
                        value={manualCostPrice}
                        onChange={(e) => setManualCostPrice(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border-2 border-slate-300 rounded-xl font-bold text-slate-950 outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-700 block mb-1">
                        Jual Seunit (RM) *:
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        placeholder="cth: 120.00"
                        value={manualSellingPrice}
                        onChange={(e) => setManualSellingPrice(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border-2 border-slate-300 rounded-xl font-bold text-slate-950 outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Live Profit Hint */}
                  {manualCostPrice && manualSellingPrice && (
                    <div className="flex items-center justify-between text-[11px] bg-white p-2 rounded-xl border border-amber-200">
                      <span className="text-slate-600 font-semibold">Anggaran Untung Kasar Seunit:</span>
                      <span className={`font-mono font-black ${parseFloat(manualSellingPrice) - parseFloat(manualCostPrice) >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                        RM {(parseFloat(manualSellingPrice) - parseFloat(manualCostPrice)).toFixed(2)}
                      </span>
                    </div>
                  )}

                  {/* Checkbox: Save Extra to Stock */}
                  <div className="p-2.5 bg-amber-100/60 rounded-xl border border-amber-200/80 space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={manualSaveToStock}
                        onChange={(e) => setManualSaveToStock(e.target.checked)}
                        className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                      />
                      <span className="font-extrabold text-amber-950 text-[11px]">
                        Beli online lebihan & simpan baki ke dalam inventori stok bengkel
                      </span>
                    </label>

                    {manualSaveToStock && (
                      <div className="pl-6 pt-1 flex items-center gap-3">
                        <span className="text-[11px] font-bold text-slate-700">
                          Baki unit disimpan ke stok:
                        </span>
                        <input
                          type="number"
                          min="1"
                          value={manualExtraQty}
                          onChange={(e) => setManualExtraQty(e.target.value)}
                          className="w-20 px-2 py-1 bg-white border-2 border-amber-300 rounded-lg font-bold text-slate-950 text-center outline-none"
                        />
                        <span className="text-[10px] text-emerald-700 font-bold">
                          ✓ Automatik didaftar ke Inventori Pusat
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Add Manual Button */}
                  <button
                    type="button"
                    onClick={handleAddManualPart}
                    className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-black rounded-xl flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Tambah Spare Part Manual (Pesanan Online)</span>
                  </button>
                </div>
              </div>

            </div>

            {/* ---------------- RIGHT COLUMN (5 COLS): ITEMIZED LIST & CALCULATIONS ---------------- */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              
              {/* Itemized Selected Parts List */}
              <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-200 flex-1 flex flex-col space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="font-black text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    <span>SENARAI ALAT GANTI DIPILIH</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 font-extrabold text-[10px]">
                    {partsUsed.length} item
                  </span>
                </div>

                {/* Parts List Scrollable Container */}
                <div className="space-y-2 flex-1 max-h-72 overflow-y-auto pr-1">
                  {partsUsed.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 italic bg-white rounded-xl border border-dashed border-slate-300 space-y-1">
                      <p className="font-bold text-slate-600">Tiada alat ganti dipilih</p>
                      <p className="text-[10px] text-slate-400">
                        Sila pilih dari stok inventori atau isi pesanan online di sebelah kiri untuk menambah sebut harga.
                      </p>
                    </div>
                  ) : (
                    partsUsed.map((p, idx) => (
                      <div
                        key={p.partId || idx}
                        className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition space-y-1.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={`text-[9px] px-1.5 py-0.2 rounded-md font-black uppercase ${
                                p.source === 'ONLINE'
                                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                  : 'bg-blue-100 text-blue-900 border border-blue-300'
                              }`}>
                                {p.source === 'ONLINE' ? '🌐 Order Online' : '🏢 Stok Pusat'}
                              </span>
                              <span className="font-black text-slate-900 text-xs truncate">
                                {p.name}
                              </span>
                            </div>

                            <p className="text-[11px] text-slate-500 mt-1 font-medium">
                              Kuantiti: <strong className="text-slate-900">{p.quantity || 1} unit</strong>
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemovePart(p.partId)}
                            className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg transition shrink-0 cursor-pointer"
                            title="Padam item ini"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Price Details */}
                        <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                          <span className="text-slate-500">
                            Kos: <span className="font-mono">RM {((p.costPrice || 0) * (p.quantity || 1)).toFixed(2)}</span>
                          </span>
                          <span className="font-black text-slate-900 font-mono">
                            Jual: RM {((p.sellingPrice || 0) * (p.quantity || 1)).toFixed(2)}
                          </span>
                        </div>

                        {/* Extra Stock Badge if saved */}
                        {p.saveToStock && p.extraStockQuantity > 0 && (
                          <div className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                            <span>📦 Lebihan +{p.extraStockQuantity} unit akan disimpan ke inventori</span>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Card 4: Cost vs Selling Price vs Profit Live Calculation */}
              <div className="p-4 bg-indigo-50/70 rounded-2xl border-2 border-indigo-200/80 space-y-3 shadow-xs">
                <span className="font-black text-indigo-950 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                  <span>KIRAAN KOS, UPAH BURUH & JUMLAH SEBUT HARGA</span>
                </span>

                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2.5 bg-white rounded-xl border border-indigo-100 text-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Kos Alat Ganti</span>
                    <p className="text-xs sm:text-sm font-black text-slate-900 mt-0.5 font-mono">
                      RM {partsCost.toFixed(2)}
                    </p>
                  </div>

                  <div className="p-2 bg-white rounded-xl border border-indigo-100 text-center">
                    <label className="text-[10px] font-bold text-slate-700 uppercase block mb-0.5">
                      Upah Servis (RM)
                    </label>
                    <input
                      type="number"
                      step="5"
                      min="0"
                      value={labourCost}
                      onChange={(e) => setLabourCost(e.target.value)}
                      className="w-full font-black text-xs sm:text-sm text-slate-900 outline-none text-center font-mono border-b border-indigo-300 focus:border-indigo-600"
                    />
                  </div>

                  <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-sm text-center">
                    <span className="text-[10px] font-bold text-blue-100 uppercase block">Jumlah Sebut Harga</span>
                    <p className="text-xs sm:text-sm font-black mt-0.5 font-mono">
                      RM {totalSelling.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs font-bold text-emerald-800 pt-1 border-t border-indigo-100">
                  <span>Anggaran Untung Kasar Projek Baiki:</span>
                  <span className="text-sm font-black font-mono">RM {grossProfit.toFixed(2)}</span>
                </div>
              </div>

            </div>

          </div>

          {/* ================= MODAL SUBMIT BUTTONS ================= */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 font-bold rounded-xl transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-7 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition cursor-pointer"
            >
              Simpan Diagnosis & Kemaskini Sebut Harga
            </button>
          </div>

        </form>

      </div>
    </div>,
    document.body
  );
};
