import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext';
import {
  Smartphone,
  User,
  Phone,
  ShieldCheck,
  CheckSquare,
  AlertTriangle,
  X,
  Plus
} from 'lucide-react';

export const NewRepairJobModal = ({ onClose }) => {
  const { customers, addCustomer, createRepairJob, showToast } = useApp();

  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || '');

  // New customer inputs
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');

  // Device Info
  const [deviceBrand, setDeviceBrand] = useState('Samsung');
  const [deviceModel, setDeviceModel] = useState('');
  const [imeiSerial, setImeiSerial] = useState('');
  const [deviceColor, setDeviceColor] = useState('');
  const [problemReported, setProblemReported] = useState('');

  // Condition Checklist (Before Repair Condition)
  const [conditionChecklist, setConditionChecklist] = useState({
    screenCondition: 'DAMAGED',
    bodyCondition: 'GOOD',
    cameraCondition: 'GOOD',
    buttons: 'GOOD',
    chargingPort: 'GOOD',
    speaker: 'GOOD',
    microphone: 'GOOD',
    waterDamageIndicator: 'NO',
    otherDamage: ''
  });

  const handleCheckbox = (key, val) => {
    setConditionChecklist(prev => ({ ...prev, [key]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let customer = null;
    if (isNewCustomer) {
      if (!newCustName || !newCustPhone) {
        alert('Sila lengkapkan nama dan telefon pelanggan baharu.');
        return;
      }
      customer = addCustomer({
        name: newCustName,
        phone: newCustPhone,
        email: newCustEmail,
        address: '-'
      });
    } else {
      customer = customers.find(c => c.id === selectedCustomerId);
    }

    if (!customer) {
      alert('Sila pilih atau daftar pelanggan.');
      return;
    }

    if (!deviceModel || !problemReported) {
      alert('Sila masukkan model telefon dan aduan kerosakan pelanggan.');
      return;
    }

    createRepairJob({
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      deviceBrand,
      deviceModel,
      imeiSerial,
      deviceColor,
      conditionChecklist,
      problemReported,
      technician: 'Muhammad Faiz (Teknikal Smartphone)',
      repairStatus: 'RECEIVED',
      quotationStatus: 'PENDING',
      labourCost: 0,
      partsUsed: [],
      partsCost: 0,
      totalCost: 0,
      sellingPrice: 0,
      hasDiagnosis: false
    });

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
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 border border-slate-200 animate-fade-in max-h-[90vh] overflow-y-auto text-xs">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-900">
                Pendaftaran Penerimaan Telefon Baharu
              </h3>
              <p className="text-[11px] text-slate-500">
                TRIG GIATMARA KANGAR • Format ID Automatik: REP-2026-xxxxx
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Section 1: Customer Selection */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-black text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-purple-600" />
                1. Maklumat Pelanggan
              </span>
              <button
                type="button"
                onClick={() => setIsNewCustomer(!isNewCustomer)}
                className="text-purple-600 hover:underline font-bold text-[11px]"
              >
                {isNewCustomer ? '← Pilih Pelanggan Sedia Ada' : '+ Daftar Pelanggan Baru'}
              </button>
            </div>

            {!isNewCustomer ? (
              <div>
                <label className="font-extrabold text-slate-900 block mb-1 text-xs">Pilih Pelanggan Sedia Ada:</label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-xl font-bold text-slate-950 outline-none focus:border-blue-600"
                >
                  {customers.map(c => (
                    <option key={c.id} value={c.id} className="text-slate-950 font-bold bg-white">
                      {c.name} ({c.phone}) - {c.totalRepairs} Pembaikan
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 sm:col-span-1">
                  <label className="font-extrabold text-slate-900 block mb-1 text-xs">Nama Penuh *</label>
                  <input
                    type="text"
                    required
                    value={newCustName}
                    onChange={(e) => setNewCustName(e.target.value)}
                    placeholder="Ahmad bin Daud"
                    className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-xl outline-none font-bold text-slate-950 placeholder:text-slate-500 focus:border-blue-600"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="font-extrabold text-slate-900 block mb-1 text-xs">No. Telefon *</label>
                  <input
                    type="text"
                    required
                    value={newCustPhone}
                    onChange={(e) => setNewCustPhone(e.target.value)}
                    placeholder="019-1234567"
                    className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-xl outline-none font-bold text-slate-950 placeholder:text-slate-500 focus:border-blue-600"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Device Specification */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
            <span className="font-black text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-blue-600" />
              2. Spesifikasi Peranti Telefon
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="font-extrabold text-slate-900 block mb-1 text-xs">Jenama (Brand) *</label>
                <select
                  value={deviceBrand}
                  onChange={(e) => setDeviceBrand(e.target.value)}
                  className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-xl font-bold text-slate-950 outline-none focus:border-blue-600"
                >
                  <option value="Samsung" className="text-slate-950 font-bold bg-white">Samsung</option>
                  <option value="Apple" className="text-slate-950 font-bold bg-white">Apple (iPhone)</option>
                  <option value="Xiaomi / Redmi" className="text-slate-950 font-bold bg-white">Xiaomi / Redmi</option>
                  <option value="Oppo" className="text-slate-950 font-bold bg-white">Oppo</option>
                  <option value="Vivo" className="text-slate-950 font-bold bg-white">Vivo</option>
                  <option value="Realme" className="text-slate-950 font-bold bg-white">Realme</option>
                  <option value="Huawei / Honor" className="text-slate-950 font-bold bg-white">Huawei / Honor</option>
                  <option value="Infinix / Tecno" className="text-slate-950 font-bold bg-white">Infinix / Tecno</option>
                  <option value="Lain-lain" className="text-slate-950 font-bold bg-white">Lain-lain</option>
                </select>
              </div>

              <div>
                <label className="font-extrabold text-slate-900 block mb-1 text-xs">Model Telefon *</label>
                <input
                  type="text"
                  required
                  value={deviceModel}
                  onChange={(e) => setDeviceModel(e.target.value)}
                  placeholder="Contoh: Galaxy A55 5G"
                  className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-xl outline-none font-bold text-slate-950 placeholder:text-slate-500 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="font-extrabold text-slate-900 block mb-1 text-xs">Warna Peranti</label>
                <input
                  type="text"
                  value={deviceColor}
                  onChange={(e) => setDeviceColor(e.target.value)}
                  placeholder="Black, Blue, Silver..."
                  className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-xl outline-none font-bold text-slate-950 placeholder:text-slate-500 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="font-extrabold text-slate-900 block mb-1 text-xs">IMEI / No. Siri</label>
                <input
                  type="text"
                  value={imeiSerial}
                  onChange={(e) => setImeiSerial(e.target.value)}
                  placeholder="15 Digit IMEI / SN"
                  className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-xl outline-none font-mono font-bold text-slate-950 placeholder:text-slate-500 focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="font-extrabold text-slate-900 block mb-1 text-xs">Aduan Masalah / Simptom Pelanggan *</label>
              <textarea
                rows="2"
                required
                value={problemReported}
                onChange={(e) => setProblemReported(e.target.value)}
                placeholder="Huraikan apa yang rosak mengikut maklumat pelanggan (cth: Skrin pecah, bateri kembung, tak boleh caj)..."
                className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-xl outline-none font-bold text-slate-950 placeholder:text-slate-500 resize-none focus:border-blue-600"
              />
            </div>
          </div>

          {/* Section 3: Before Repair Condition Checklist */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
            <span className="font-black text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              3. Pemeriksaan Keadaan Fizikal Semasa Terima (Checklist)
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div>
                <label className="font-extrabold text-slate-800 block mb-1 text-[11px]">Keadaan Skrin (LCD):</label>
                <select
                  value={conditionChecklist.screenCondition}
                  onChange={(e) => handleCheckbox('screenCondition', e.target.value)}
                  className="w-full p-2 bg-white border-2 border-slate-300 rounded-lg font-bold text-slate-950 outline-none"
                >
                  <option value="GOOD" className="text-slate-950 font-bold bg-white">GOOD (Baik)</option>
                  <option value="FAIR" className="text-slate-950 font-bold bg-white">FAIR (Calar Halus)</option>
                  <option value="DAMAGED" className="text-slate-950 font-bold bg-white">DAMAGED (Pecah/Retak)</option>
                </select>
              </div>

              <div>
                <label className="font-extrabold text-slate-800 block mb-1 text-[11px]">Badan & Bingkai (Body):</label>
                <select
                  value={conditionChecklist.bodyCondition}
                  onChange={(e) => handleCheckbox('bodyCondition', e.target.value)}
                  className="w-full p-2 bg-white border-2 border-slate-300 rounded-lg font-bold text-slate-950 outline-none"
                >
                  <option value="GOOD" className="text-slate-950 font-bold bg-white">GOOD (Mulus)</option>
                  <option value="FAIR" className="text-slate-950 font-bold bg-white">FAIR (Calar)</option>
                  <option value="DAMAGED" className="text-slate-950 font-bold bg-white">DAMAGED (Kemek/Bengkok)</option>
                </select>
              </div>

              <div>
                <label className="font-extrabold text-slate-800 block mb-1 text-[11px]">Kamera Depan/Belakang:</label>
                <select
                  value={conditionChecklist.cameraCondition}
                  onChange={(e) => handleCheckbox('cameraCondition', e.target.value)}
                  className="w-full p-2 bg-white border-2 border-slate-300 rounded-lg font-bold text-slate-950 outline-none"
                >
                  <option value="GOOD" className="text-slate-950 font-bold bg-white">GOOD (Jelas)</option>
                  <option value="FAIR" className="text-slate-950 font-bold bg-white">FAIR (Kabur)</option>
                  <option value="DAMAGED" className="text-slate-950 font-bold bg-white">DAMAGED (Kaca Pecah/Rosak)</option>
                </select>
              </div>

              <div>
                <label className="font-extrabold text-slate-800 block mb-1 text-[11px]">Port Pengecasan:</label>
                <select
                  value={conditionChecklist.chargingPort}
                  onChange={(e) => handleCheckbox('chargingPort', e.target.value)}
                  className="w-full p-2 bg-white border-2 border-slate-300 rounded-lg font-bold text-slate-950 outline-none"
                >
                  <option value="GOOD" className="text-slate-950 font-bold bg-white">GOOD (Ketat)</option>
                  <option value="FAIR" className="text-slate-950 font-bold bg-white">FAIR (Kotor)</option>
                  <option value="DAMAGED" className="text-slate-950 font-bold bg-white">DAMAGED (Longgar/Patah)</option>
                </select>
              </div>

              <div>
                <label className="font-extrabold text-slate-800 block mb-1 text-[11px]">Butang Kuasa & Suara:</label>
                <select
                  value={conditionChecklist.buttons}
                  onChange={(e) => handleCheckbox('buttons', e.target.value)}
                  className="w-full p-2 bg-white border-2 border-slate-300 rounded-lg font-bold text-slate-950 outline-none"
                >
                  <option value="GOOD" className="text-slate-950 font-bold bg-white">GOOD (Klik Berfungsi)</option>
                  <option value="DAMAGED" className="text-slate-950 font-bold bg-white">DAMAGED (Tenggelam/Mati)</option>
                </select>
              </div>

              <div>
                <label className="font-extrabold text-slate-800 block mb-1 text-[11px]">Pembesar Suara:</label>
                <select
                  value={conditionChecklist.speaker}
                  onChange={(e) => handleCheckbox('speaker', e.target.value)}
                  className="w-full p-2 bg-white border-2 border-slate-300 rounded-lg font-bold text-slate-950 outline-none"
                >
                  <option value="GOOD" className="text-slate-950 font-bold bg-white">GOOD (Jelas)</option>
                  <option value="DAMAGED" className="text-slate-950 font-bold bg-white">DAMAGED (Pecah/Senyap)</option>
                </select>
              </div>

              <div>
                <label className="font-extrabold text-slate-800 block mb-1 text-[11px]">Kesan Masuk Air:</label>
                <select
                  value={conditionChecklist.waterDamageIndicator}
                  onChange={(e) => handleCheckbox('waterDamageIndicator', e.target.value)}
                  className="w-full p-2 bg-white border-2 border-slate-300 rounded-lg font-bold text-rose-700 outline-none"
                >
                  <option value="NO" className="text-slate-950 font-bold bg-white">NO (Tiada Lembapan)</option>
                  <option value="YES" className="text-rose-700 font-bold bg-white">YES (Kesan Cecair Merah)</option>
                </select>
              </div>

              <div>
                <label className="font-extrabold text-slate-800 block mb-1 text-[11px]">Kerosakan Lain:</label>
                <input
                  type="text"
                  value={conditionChecklist.otherDamage}
                  onChange={(e) => handleCheckbox('otherDamage', e.target.value)}
                  placeholder="Cth: Casing calar..."
                  className="w-full p-2 bg-white border-2 border-slate-300 rounded-lg font-bold text-slate-950 placeholder:text-slate-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
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
              Daftar Job Pembaikan (Jana ID)
            </button>
          </div>

        </form>

      </div>
    </div>,
    document.body
  );
};
