import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  History,
  Search,
  Filter,
  User,
  Clock,
  Layers,
  ShieldCheck
} from 'lucide-react';

export const AuditTrail = () => {
  const { auditLogs } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModule, setFilterModule] = useState('ALL');

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.module.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesModule = filterModule === 'ALL' || log.module === filterModule;
    return matchesSearch && matchesModule;
  });

  const moduleColors = {
    'CAFÉ': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'REPAIR': 'bg-blue-100 text-blue-800 border-blue-200',
    'INVENTORY': 'bg-amber-100 text-amber-800 border-amber-200',
    'PROCUREMENT': 'bg-purple-100 text-purple-800 border-purple-200',
    'SALES': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    'PAYMENT': 'bg-teal-100 text-teal-800 border-teal-200',
    'CUSTOMER': 'bg-pink-100 text-pink-800 border-pink-200',
    'AUTH': 'bg-cyan-100 text-cyan-800 border-cyan-200',
    'SETTINGS': 'bg-slate-100 text-slate-800 border-slate-200',
    'SYSTEM': 'bg-slate-900 text-white border-slate-900'
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 mb-1 uppercase tracking-wider">
            <History className="w-4 h-4" />
            <span>Jejak Audit & Rekod Keselamatan Aktiviti</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            JEJAK AUDIT AKTIVITI SISTEM (AUDIT TRAIL)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Merekod setiap tindakan staf: pendaftaran produk, kemaskini status job baiki, penerimaan bayaran, kelulusan perolehan dan tetapan sistem.
          </p>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari tindakan, nama staf, modul..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
          />
        </div>

        <select
          value={filterModule}
          onChange={(e) => setFilterModule(e.target.value)}
          className="text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
        >
          <option value="ALL">Semua Modul</option>
          <option value="CAFÉ">CAFÉ & MAKANAN</option>
          <option value="REPAIR">REPAIR SMARTPHONE</option>
          <option value="INVENTORY">INVENTORI</option>
          <option value="PROCUREMENT">PEROLEHAN (PR/PO)</option>
          <option value="SALES">JUALAN & POS</option>
          <option value="PAYMENT">BAYARAN</option>
          <option value="CUSTOMER">PELANGGAN</option>
          <option value="AUTH">LOG MASUK (AUTH)</option>
          <option value="SETTINGS">TETAPAN</option>
        </select>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold">
              <tr>
                <th className="py-3.5 px-4">Log ID & Tarikh Masa</th>
                <th className="py-3.5 px-4">Pengguna & Peranan</th>
                <th className="py-3.5 px-4">Modul</th>
                <th className="py-3.5 px-4">Tindakan / Aktiviti Direkodkan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-slate-900 block">{log.id}</span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-bold text-slate-900">
                    {log.user}
                  </td>

                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                      moduleColors[log.module] || 'bg-slate-100 text-slate-700'
                    }`}>
                      {log.module}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-[11px] text-slate-800 leading-relaxed">
                    {log.action}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
