import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ListOrdered,
  Search,
  Filter,
  Receipt,
  Eye,
  CheckCircle,
  Clock,
  Printer,
  ChevronRight,
  UtensilsCrossed,
  ShoppingBag
} from 'lucide-react';

export const FoodOrdersList = () => {
  const { foodOrders, updateFoodOrderStatus, openReceipt } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const filteredOrders = foodOrders.filter(ord => {
    const matchesSearch =
      ord.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.receiptNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ord.tableId && ord.tableId.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === 'ALL' || ord.orderType === filterType;
    const matchesStatus = filterStatus === 'ALL' || ord.orderStatus === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 mb-1 uppercase tracking-wider">
            <ListOrdered className="w-4 h-4" />
            <span>Senarai Pesanan & Transaksi Café</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            REKOD PESANAN MAKANAN & MINUMAN
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Pantau semua pesanan Dine-In dan Takeaway, sejarah penyediaan, status bayaran dan cetakan semula resit.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari ID pesanan, resit, nama atau meja..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
          >
            <option value="ALL">Semua Jenis (Dine-In & Takeaway)</option>
            <option value="DINE_IN">Dine-In (Makan Sini)</option>
            <option value="TAKEAWAY">Takeaway (Bungkus)</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
          >
            <option value="ALL">Semua Status</option>
            <option value="NEW">NEW (Baru)</option>
            <option value="CONFIRMED">CONFIRMED (Disahkan)</option>
            <option value="PREPARING">PREPARING (Memasak)</option>
            <option value="READY">READY (Sedia)</option>
            <option value="COMPLETED">COMPLETED (Selesai)</option>
            <option value="CANCELLED">CANCELLED (Batal)</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold">
              <tr>
                <th className="py-3.5 px-4">Order ID & Resit</th>
                <th className="py-3.5 px-4">Jenis & Meja</th>
                <th className="py-3.5 px-4">Pelanggan</th>
                <th className="py-3.5 px-4">Item Pesanan</th>
                <th className="py-3.5 px-4">Jumlah (RM)</th>
                <th className="py-3.5 px-4">Untung (RM)</th>
                <th className="py-3.5 px-4">Bayaran</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-10 text-center text-slate-400">
                    Tiada rekod pesanan dijumpai.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(ord => (
                  <tr key={ord.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block">{ord.id}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{ord.receiptNo}</span>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        ord.orderType === 'DINE_IN'
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {ord.orderType === 'DINE_IN' ? `Meja ${ord.tableId}` : 'Takeaway'}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-900 block">{ord.customerName}</span>
                      <span className="text-[10px] text-slate-400">{ord.customerPhone || '-'}</span>
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <p className="line-clamp-2 text-[11px] text-slate-600">
                        {ord.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                      </p>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-black text-slate-900 text-xs">
                        RM {ord.grandTotal.toFixed(2)}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-bold text-indigo-700">
                        RM {(ord.grossProfit || 0).toFixed(2)}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {ord.paymentMethod || 'TUNAI'} (PAID)
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        ord.orderStatus === 'NEW' ? 'bg-rose-100 text-rose-800' :
                        ord.orderStatus === 'PREPARING' ? 'bg-amber-100 text-amber-800' :
                        ord.orderStatus === 'READY' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {ord.orderStatus}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => openReceipt(ord)}
                        className="p-1.5 text-xs text-indigo-600 hover:bg-indigo-50 rounded-lg inline-flex items-center gap-1 font-semibold transition"
                        title="Buka Resit"
                      >
                        <Receipt className="w-4 h-4" />
                        <span>Resit</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
