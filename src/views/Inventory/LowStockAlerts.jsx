import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  AlertTriangle,
  Package,
  Plus,
  ArrowRight,
  Truck,
  CheckCircle2,
  FileText
} from 'lucide-react';

export const LowStockAlerts = () => {
  const { inventory, createPurchaseRequest, suppliers, setCurrentTab, showToast } = useApp();

  const lowStockItems = inventory.filter(i => i.currentStock <= i.minStock);

  const handleQuickPR = (item) => {
    const defaultQty = Math.max(5, item.minStock * 2);
    const supplier = suppliers.find(s => s.id === item.supplierId) || suppliers[0];

    createPurchaseRequest({
      supplierId: supplier ? supplier.id : 'SUP-001',
      supplierName: supplier ? supplier.name : 'Pembekal Utama',
      department: item.category.includes('Café') ? 'Kursus Masakan & Café' : 'Kursus Baiki Smartphone',
      items: [
        {
          itemId: item.id,
          name: item.name,
          quantity: defaultQty,
          unitCost: item.costPrice,
          subtotal: defaultQty * item.costPrice
        }
      ],
      purpose: `Penambahan stok segera untuk "${item.name}" (Stok semasa: ${item.currentStock} ${item.unit} <= Paras min: ${item.minStock} ${item.unit})`
    });

    setCurrentTab('purchase-requests');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-amber-500/10 border border-amber-300 p-6 rounded-3xl shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800 mb-1 uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Sistem Amaran Stok Minimum Automatik</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-amber-950">
            AMARAN PARAS STOK RENDAH ({lowStockItems.length} ITEM)
          </h1>
          <p className="text-xs text-amber-900/80 mt-1 max-w-2xl">
            Item berikut telah mencapai atau berada di bawah paras minimum keselamatan stok. Sila klik <strong>"Jana Permohonan Beli (PR)"</strong> untuk membuat pesanan penambahan stok kepada Pengurus.
          </p>
        </div>

        <button
          onClick={() => setCurrentTab('purchase-requests')}
          className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md transition"
        >
          <FileText className="w-4 h-4" />
          <span>Lihat Semua PR</span>
        </button>
      </div>

      {/* Low Stock Items Grid */}
      {lowStockItems.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
          <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-emerald-500" />
          <p className="font-bold text-slate-800 text-sm">Semua Paras Stok Mencukupi!</p>
          <p className="text-slate-500 mt-1">Tiada item yang berada di bawah paras minimum buat masa ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {lowStockItems.map(item => {
            const isOut = item.currentStock === 0;

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl border-2 border-amber-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="font-mono font-bold text-xs text-slate-500">{item.sku}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      isOut ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white animate-pulse'
                    }`}>
                      {isOut ? 'HABIS (0 STOK)' : 'STOK RENDAH'}
                    </span>
                  </div>

                  <div className="py-3 space-y-1">
                    <h3 className="font-bold text-slate-900 text-sm leading-snug">{item.name}</h3>
                    <p className="text-[11px] text-slate-500">{item.category} • {item.brand}</p>
                    <p className="text-[10px] text-slate-400">Lokasi: {item.location}</p>
                  </div>

                  {/* Stock Metrics Card */}
                  <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-100 grid grid-cols-2 gap-2 text-center my-2 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Baki Semasa</span>
                      <p className="text-base font-black text-rose-600 mt-0.5">
                        {item.currentStock} {item.unit}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Paras Minimum</span>
                      <p className="text-base font-black text-slate-800 mt-0.5">
                        {item.minStock} {item.unit}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Harga Kos Seunit:</span>
                    <span className="font-bold text-slate-900">RM {item.costPrice.toFixed(2)}</span>
                  </div>

                  <button
                    onClick={() => handleQuickPR(item)}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Jana Permohonan Beli (PR Pantas)</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
