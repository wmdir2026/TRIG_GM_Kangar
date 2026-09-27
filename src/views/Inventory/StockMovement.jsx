import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeftRight,
  Search,
  Filter,
  Calendar,
  User,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Layers
} from 'lucide-react';

export const StockMovement = () => {
  const { stockTransactions } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  const filteredTx = stockTransactions.filter(tx => {
    const matchesSearch =
      tx.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.reference && tx.reference.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (tx.user && tx.user.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === 'ALL' || tx.type === filterType;
    return matchesSearch && matchesType;
  });

  const typeConfig = {
    'STOCK_IN': { label: 'STOCK IN (Masuk)', color: 'bg-emerald-100 text-emerald-800' },
    'STOCK_OUT': { label: 'STOCK OUT (Keluar)', color: 'bg-rose-100 text-rose-800' },
    'USED_FOR_REPAIR': { label: 'USED FOR REPAIR (Guna Baiki)', color: 'bg-blue-100 text-blue-800' },
    'SOLD': { label: 'SOLD (Jualan POS)', color: 'bg-amber-100 text-amber-800' },
    'ADJUSTMENT': { label: 'ADJUSTMENT (Pelarasan)', color: 'bg-purple-100 text-purple-800' },
    'DAMAGED': { label: 'DAMAGED (Rosak)', color: 'bg-rose-100 text-rose-800' },
    'RETURNED': { label: 'RETURNED (Pulang)', color: 'bg-cyan-100 text-cyan-800' }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 mb-1 uppercase tracking-wider">
            <ArrowLeftRight className="w-4 h-4" />
            <span>Audit Jejak Pergerakan Stok</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            LOG PERGERAKAN STOK INVENTORI
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Rekod lengkap setiap transaksi stok masuk (PO), penggunaan alat ganti baiki, jualan aksesori dan pelarasan audit.
          </p>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari transaksi, item, rujukan, pengguna..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
        >
          <option value="ALL">Semua Jenis Transaksi</option>
          <option value="STOCK_IN">STOCK IN (Stok Masuk)</option>
          <option value="USED_FOR_REPAIR">USED FOR REPAIR (Alat Ganti Baiki)</option>
          <option value="SOLD">SOLD (Jualan Aksesori)</option>
          <option value="STOCK_OUT">STOCK OUT (Stok Keluar)</option>
          <option value="ADJUSTMENT">ADJUSTMENT (Pelarasan Audit)</option>
          <option value="DAMAGED">DAMAGED (Rosak)</option>
        </select>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold">
              <tr>
                <th className="py-3.5 px-4">ID & Tarikh</th>
                <th className="py-3.5 px-4">Item Komponen</th>
                <th className="py-3.5 px-4">Jenis Transaksi</th>
                <th className="py-3.5 px-4 text-center">Kuantiti</th>
                <th className="py-3.5 px-4 text-center">Baki Sebelum</th>
                <th className="py-3.5 px-4 text-center">Baki Selepas</th>
                <th className="py-3.5 px-4">Rujukan / Catatan</th>
                <th className="py-3.5 px-4">Pengguna</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredTx.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-10 text-center text-slate-400">
                    Tiada log pergerakan stok dijumpai.
                  </td>
                </tr>
              ) : (
                filteredTx.map(tx => {
                  const cfg = typeConfig[tx.type] || { label: tx.type, color: 'bg-slate-100 text-slate-700' };

                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block">{tx.id}</span>
                        <span className="text-[10px] text-slate-400">{new Date(tx.date).toLocaleString()}</span>
                      </td>

                      <td className="py-3 px-4 font-bold text-slate-900">
                        {tx.itemName}
                      </td>

                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${cfg.color}`}>
                          {cfg.label}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center font-black text-slate-900 text-xs">
                        {['STOCK_IN', 'RETURNED'].includes(tx.type) ? `+${tx.quantity}` : `-${tx.quantity}`}
                      </td>

                      <td className="py-3 px-4 text-center text-slate-500 font-semibold">
                        {tx.beforeQty}
                      </td>

                      <td className="py-3 px-4 text-center font-black text-indigo-700">
                        {tx.afterQty}
                      </td>

                      <td className="py-3 px-4 text-[11px] text-slate-600 max-w-xs truncate">
                        {tx.reference || '-'}
                      </td>

                      <td className="py-3 px-4 text-[11px] text-slate-500 font-medium">
                        {tx.user || 'Sistem'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
