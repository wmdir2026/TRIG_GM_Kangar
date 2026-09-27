import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Receipt,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  Calendar,
  UtensilsCrossed,
  Smartphone,
  Sparkles,
  Printer,
  ChevronRight
} from 'lucide-react';

export const UnifiedSales = () => {
  const { sales, openReceipt, foodOrders, repairJobs } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterModule, setFilterModule] = useState('ALL');

  const filteredSales = sales.filter(s => {
    const matchesSearch =
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.receiptNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.itemsSummary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesModule = filterModule === 'ALL' || s.module === filterModule;
    return matchesSearch && matchesModule;
  });

  const totalRevenue = filteredSales.reduce((acc, s) => acc + s.sellingPrice, 0);
  const totalCost = filteredSales.reduce((acc, s) => acc + (s.costPrice || 0), 0);
  const totalProfit = filteredSales.reduce((acc, s) => acc + (s.grossProfit || 0), 0);

  const handleOpenSaleReceipt = (sale) => {
    if (sale.module === 'CAFÉ') {
      const ord = foodOrders.find(o => o.id === sale.referenceId || o.receiptNo === sale.receiptNo);
      if (ord) {
        openReceipt(ord);
        return;
      }
    } else if (sale.module === 'REPAIR') {
      const job = repairJobs.find(j => j.id === sale.referenceId || j.receiptNo === sale.receiptNo);
      if (job) {
        openReceipt({ type: 'REPAIR', job });
        return;
      }
    }

    // Generic receipt fallback
    openReceipt({
      type: sale.module,
      receiptNo: sale.receiptNo,
      customerName: sale.customerName,
      items: [{ name: sale.itemsSummary, quantity: 1, sellingPrice: sale.sellingPrice }],
      subtotal: sale.sellingPrice,
      grandTotal: sale.sellingPrice,
      paymentMethod: sale.paymentMethod,
      date: sale.date,
      cashierName: sale.cashierName
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 mb-1 uppercase tracking-wider">
            <Receipt className="w-4 h-4" />
            <span>Penyata Transaksi Bersepadu Semua Modul</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            JUALAN BERSEPADU (UNIFIED SALES)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Menggabungkan semua transaksi perniagaan dari Café GIATMARA, Servis Baiki Smartphone dan Jualan Aksesori Telefon.
          </p>
        </div>
      </div>

      {/* Summary KPI Strips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Jumlah Hasil Jualan</span>
          <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1">RM {totalRevenue.toFixed(2)}</p>
          <span className="text-[11px] text-slate-500 font-medium">{filteredSales.length} Transaksi Selesai</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Jumlah Kos Barang/Servis</span>
          <p className="text-xl sm:text-2xl font-black text-slate-700 mt-1">RM {totalCost.toFixed(2)}</p>
          <span className="text-[11px] text-slate-500 font-medium">Bahan Mentah & Alat Ganti</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Jumlah Untung Kasar</span>
          <p className="text-xl sm:text-2xl font-black text-emerald-700 mt-1">RM {totalProfit.toFixed(2)}</p>
          <span className="text-[11px] text-emerald-600 font-bold">
            Margin: {totalRevenue > 0 ? `${((totalProfit / totalRevenue) * 100).toFixed(1)}%` : '0%'}
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari resit SAL-, CAF-, REP-, ACC-, pelanggan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['ALL', 'CAFÉ', 'REPAIR', 'ACCESSORIES'].map(mod => (
            <button
              key={mod}
              onClick={() => setFilterModule(mod)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                filterModule === mod
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {mod === 'ALL' ? 'Semua Bidang' : mod}
            </button>
          ))}
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold">
              <tr>
                <th className="py-3.5 px-4">ID Jualan & Resit</th>
                <th className="py-3.5 px-4">Modul Perniagaan</th>
                <th className="py-3.5 px-4">Pelanggan</th>
                <th className="py-3.5 px-4">Ringkasan Item</th>
                <th className="py-3.5 px-4">Harga Kos</th>
                <th className="py-3.5 px-4">Harga Jualan</th>
                <th className="py-3.5 px-4">Untung Kasar</th>
                <th className="py-3.5 px-4">Bayaran</th>
                <th className="py-3.5 px-4">Juruwang</th>
                <th className="py-3.5 px-4 text-center">Resit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredSales.map(sale => (
                <tr key={sale.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">{sale.id}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{sale.receiptNo}</span>
                  </td>

                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      sale.module === 'CAFÉ' ? 'bg-emerald-100 text-emerald-800' :
                      sale.module === 'REPAIR' ? 'bg-blue-100 text-blue-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {sale.module === 'CAFÉ' && <UtensilsCrossed className="w-3 h-3" />}
                      {sale.module === 'REPAIR' && <Smartphone className="w-3 h-3" />}
                      {sale.module === 'ACCESSORIES' && <Sparkles className="w-3 h-3" />}
                      <span>{sale.module}</span>
                    </span>
                  </td>

                  <td className="py-3 px-4 font-bold text-slate-900">
                    {sale.customerName}
                  </td>

                  <td className="py-3 px-4 max-w-xs truncate text-[11px] text-slate-600">
                    {sale.itemsSummary}
                  </td>

                  <td className="py-3 px-4 font-semibold text-slate-500">
                    RM {(sale.costPrice || 0).toFixed(2)}
                  </td>

                  <td className="py-3 px-4 font-black text-slate-900">
                    RM {sale.sellingPrice.toFixed(2)}
                  </td>

                  <td className="py-3 px-4 font-black text-emerald-700">
                    RM {(sale.grossProfit || 0).toFixed(2)}
                  </td>

                  <td className="py-3 px-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {sale.paymentMethod || 'TUNAI'}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-[11px] text-slate-500">
                    {sale.cashierName || (sale.module === 'CAFÉ' ? 'NUR Atiqah' : 'Mohd Nabil')}
                  </td>

                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleOpenSaleReceipt(sale)}
                      className="p-1.5 text-xs text-indigo-600 hover:bg-indigo-50 rounded-lg inline-flex items-center gap-1 font-semibold"
                      title="Pratonton Resit Rasmi"
                    >
                      <Receipt className="w-4 h-4" />
                      <span>Resit</span>
                    </button>
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
