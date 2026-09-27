import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Building2,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  Receipt,
  RefreshCw,
  Save,
  CheckCircle,
  AlertTriangle,
  Sparkles
} from 'lucide-react';

export const SettingsView = () => {
  const { settings, updateSettingsData, resetDemoData, showToast } = useApp();

  const [formData, setFormData] = useState({ ...settings });
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettingsData(formData);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 mb-1 uppercase tracking-wider">
            <Settings className="w-4 h-4" />
            <span>Konfigurasi & Profil Perniagaan</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            TETAPAN SISTEM TRIG GIATMARA KANGAR
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Kemaskini profil institusi, alamat perniagaan, nota resit rasmi dan pengurusan data demo.
          </p>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        
        {/* Section 1: Business Information */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building2 className="w-4 h-4 text-indigo-600" />
            <h3 className="font-black text-sm text-slate-900 uppercase">
              1. Maklumat Perniagaan & Institusi
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Nama Perniagaan (Business Name) *</label>
              <input
                type="text"
                required
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-black text-slate-900 outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Institusi Latihan</label>
              <input
                type="text"
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">No. Telefon / WhatsApp Pejabat</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">E-mel Rasmi Sistem</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Alamat Premis / Kompleks GIATMARA</label>
            <textarea
              rows="2"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none resize-none"
            />
          </div>
        </div>

        {/* Section 2: Financial & Currency Settings */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <h3 className="font-black text-sm text-slate-900 uppercase">
              2. Mata Wang & Cukai (Finance Settings)
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Mata Wang (Currency)</label>
              <input
                type="text"
                value={formData.currency}
                disabled
                className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl font-mono font-bold text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Simbol Mata Wang</label>
              <input
                type="text"
                value={formData.currencySymbol}
                disabled
                className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Kadar Caj Perkhidmatan (%)</label>
              <input
                type="number"
                min="0"
                value={formData.serviceChargeRate}
                onChange={(e) => setFormData({ ...formData, serviceChargeRate: parseFloat(e.target.value) || 0 })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Receipt Footers */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Receipt className="w-4 h-4 text-purple-600" />
            <h3 className="font-black text-sm text-slate-900 uppercase">
              3. Nota Kaki Resit Rasmi (Receipt Footers)
            </h3>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Nota Kaki Resit Café & Makanan:</label>
            <textarea
              rows="2"
              value={formData.cafeReceiptFooter}
              onChange={(e) => setFormData({ ...formData, cafeReceiptFooter: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none resize-none font-mono"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Nota Kaki Resit Baiki Smartphone & Waranti:</label>
            <textarea
              rows="2"
              value={formData.repairReceiptFooter}
              onChange={(e) => setFormData({ ...formData, repairReceiptFooter: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none resize-none font-mono"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg transition"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Semua Tetapan</span>
          </button>
        </div>

      </form>

      {/* Section 4: Danger Zone / Reset Demo Data */}
      <div className="bg-rose-50/70 border-2 border-rose-200 rounded-3xl p-6 space-y-3">
        <div className="flex items-center gap-2 text-rose-900">
          <AlertTriangle className="w-5 h-5 text-rose-600" />
          <h3 className="font-black text-sm uppercase">Zon Data Demo & Pengesetan Semula</h3>
        </div>
        <p className="text-xs text-rose-800/80 leading-relaxed">
          Mengosongkan semua perubahan dan mengembalikan sistem ke data contoh asal yang lengkap (Sample Menu, Tables M01-M10, Repair Jobs, Inventory, Suppliers, Sales, Audit Logs).
        </p>

        <button
          onClick={() => setIsResetConfirmOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md transition"
        >
          <RefreshCw className="w-4 h-4" />
          <span>RESET SEMUA DATA DEMO (KEMBALI KE ASAL)</span>
        </button>
      </div>

      {/* Reset Confirmation Dialog */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 border border-slate-200 text-center animate-fade-in text-xs space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h4 className="font-black text-base text-slate-900">Sahkan Reset Data Demo?</h4>
              <p className="text-slate-500 mt-1">
                Semua rekod pesanan baharu, job baiki dan pelarasan stok akan dipadam dan disetkan semula ke keadaan awal demonstrasi.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  resetDemoData();
                  setIsResetConfirmOpen(false);
                }}
                className="py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md"
              >
                Ya, Reset Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
