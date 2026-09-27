import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  CheckCircle,
  XCircle,
  Printer,
  X,
  Smartphone,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export const QuotationModal = ({ job, onClose, onApprove, onReject }) => {
  const { settings, showToast } = useApp();

  if (!job) return null;

  const handleApprove = () => {
    onApprove(job.id);
    onClose();
  };

  const handleReject = () => {
    onReject(job.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 animate-fade-in my-8 max-h-[90vh] overflow-y-auto text-xs">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-900">
                Sebut Harga Rasmi Pembaikan Telefon
              </h3>
              <p className="text-[11px] text-slate-500">
                Job ID: <span className="font-bold text-slate-900">{job.id}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Official Quotation Document Card */}
        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
          
          <div className="text-center pb-3 border-b border-dashed border-slate-300">
            <h4 className="font-black text-sm uppercase text-slate-900">{settings.businessName}</h4>
            <p className="text-[10px] font-bold text-slate-600">SMARTPHONE REPAIR & TECHNICAL SERVICES</p>
            <p className="text-[10px] text-slate-400">{settings.institution} • {settings.phone}</p>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-500">No. Sebut Harga / Job:</span>
              <span className="font-bold text-slate-900">{job.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Pelanggan:</span>
              <span className="font-bold text-slate-900">{job.customerName} ({job.customerPhone})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Model Telefon:</span>
              <span className="font-bold text-indigo-700">{job.deviceBrand} {job.deviceModel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Masalah / Kerosakan:</span>
              <span className="font-bold text-rose-700">{job.damageType}</span>
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="pt-2 border-t border-slate-200">
            <p className="font-bold text-slate-700 mb-2 uppercase text-[10px]">Perincian Caj & Alat Ganti:</p>
            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="pb-1 font-bold">Item Servis</th>
                  <th className="pb-1 text-center font-bold">Qty</th>
                  <th className="pb-1 text-right font-bold">Jumlah (RM)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(job.partsUsed || []).map((p, idx) => (
                  <tr key={idx}>
                    <td className="py-1.5 font-medium">{p.name}</td>
                    <td className="py-1.5 text-center">{p.quantity || 1}</td>
                    <td className="py-1.5 text-right font-bold">
                      RM {((p.sellingPrice || 0) * (p.quantity || 1)).toFixed(2)}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="py-1.5 font-medium text-slate-700">Upah Kerja & Ujian Kualiti (Labour)</td>
                  <td className="py-1.5 text-center">1</td>
                  <td className="py-1.5 text-right font-bold">
                    RM {Number(job.labourCost || 0).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Grand Total */}
          <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
            <span className="font-black text-slate-900 text-xs">JUMLAH KESELURUHAN (SEBUT HARGA):</span>
            <span className="font-black text-base text-blue-700">RM {job.sellingPrice.toFixed(2)}</span>
          </div>

          {/* Warranty note */}
          <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-200 text-[10px] text-blue-900">
            <span className="font-bold block">Jaminan Waranti GIATMARA:</span>
            {job.warrantyPeriod}
          </div>

          {/* Status Badge */}
          <div className="text-center">
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-bold text-[11px] ${
              job.quotationStatus === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
              job.quotationStatus === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
              'bg-amber-100 text-amber-800 animate-pulse'
            }`}>
              Status: {job.quotationStatus === 'PENDING' ? 'MENUNGGU KELULUSAN PELANGGAN' : job.quotationStatus}
            </span>
          </div>

        </div>

        {/* Approval Actions (Simulated) */}
        <div className="pt-4 space-y-2">
          <p className="text-[10px] text-slate-400 text-center font-semibold">
            Tindakan Simulasi Pelanggan (Approve / Reject):
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleReject}
              className="py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl border border-rose-200 transition flex items-center justify-center gap-1.5"
            >
              <XCircle className="w-4 h-4" />
              <span>Tolak (Reject)</span>
            </button>
            <button
              onClick={handleApprove}
              className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Luluskan (Approve)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
