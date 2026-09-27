import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileCheck,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  PackageCheck,
  ArrowRight,
  Printer
} from 'lucide-react';

export const PurchaseOrders = () => {
  const { purchaseOrders, receivePurchaseOrder, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const filteredPOs = purchaseOrders.filter(po => {
    const matchesSearch =
      po.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (po.prId && po.prId.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = filterStatus === 'ALL' || po.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleReceive = (po) => {
    if (window.confirm(`Adakah anda mengesahkan semua barang untuk Pesanan Belian ${po.id} telah diterima dalam keadaan baik? Stok inventori akan dinaikkan serta merta.`)) {
      receivePurchaseOrder(po.id);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 mb-1 uppercase tracking-wider">
            <FileCheck className="w-4 h-4" />
            <span>Pesanan Rasmi Kepada Pembekal (Purchase Order)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            PESANAN BELIAN (PURCHASE ORDERS - PO)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Pantau status pesanan belian kepada vendor. Klik <strong>"Terima Stok"</strong> untuk memasukkan barang terus ke Inventori Pusat.
          </p>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari PO-2026-xxxxx, pembekal, PR ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
        >
          <option value="ALL">Semua Status PO</option>
          <option value="ORDERED">ORDERED (Sedang Dihantar)</option>
          <option value="RECEIVED">RECEIVED (Telah Diterima & Masuk Stok)</option>
        </select>
      </div>

      {/* PO Cards List */}
      <div className="space-y-4">
        {filteredPOs.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
            <FileCheck className="w-12 h-12 mx-auto mb-2 text-slate-300" />
            <p className="font-bold text-slate-700 text-sm">Tiada Rekod Pesanan Belian (PO)</p>
            <p className="text-slate-400 mt-1">PO dijana secara automatik apabila Pengurus meluluskan Permohonan Belian (PR).</p>
          </div>
        ) : (
          filteredPOs.map(po => {
            const isReceived = po.status === 'RECEIVED';

            return (
              <div
                key={po.id}
                className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition space-y-4"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 font-mono font-black text-xs border border-indigo-200">
                      {po.id}
                    </span>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm">{po.supplierName}</h3>
                      <span className="text-[11px] text-slate-500">
                        Berasaskan Rujukan: <span className="font-semibold text-purple-700">{po.prId}</span> • Tarikh PO: {new Date(po.poDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    isReceived ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800 animate-pulse'
                  }`}>
                    {isReceived ? 'STOK TELAH DITERIMA' : 'DIHANTAR KEPADA PEMBEKAL'}
                  </span>
                </div>

                {/* Items & Delivery Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="md:col-span-2 space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Item Dipesan:</span>
                    <div className="space-y-1.5">
                      {po.items.map((it, idx) => (
                        <div key={idx} className="p-2 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
                          <span className="font-semibold text-slate-800">{it.name} (x{it.quantity})</span>
                          <span className="font-bold text-slate-900">RM {it.subtotal.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Jangkaan & Penerimaan</span>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Jangkaan Sampai:</span>
                      <span className="font-semibold text-slate-800">{po.expectedDelivery || '2-3 Hari'}</span>
                    </div>
                    {isReceived && (
                      <div className="mt-2 pt-2 border-t border-slate-200 text-emerald-800 text-[11px]">
                        <span className="font-bold block">Diterima Pada:</span>
                        {new Date(po.receivedDate).toLocaleString()} ({po.receivedBy})
                      </div>
                    )}
                  </div>
                </div>

                {/* Total & Action */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-semibold">Jumlah Nilai Pesanan:</span>
                    <span className="text-base font-black text-slate-950">RM {po.totalAmount.toFixed(2)}</span>
                  </div>

                  {!isReceived && (
                    <button
                      onClick={() => handleReceive(po)}
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md transition flex items-center gap-2"
                    >
                      <PackageCheck className="w-4 h-4" />
                      <span>Sahkan Terima Barang & Tambah Stok</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
