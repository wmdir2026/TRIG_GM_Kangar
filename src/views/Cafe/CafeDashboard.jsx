import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Coffee,
  UtensilsCrossed,
  Grid,
  ChefHat,
  ShoppingBag,
  TrendingUp,
  DollarSign,
  QrCode,
  Clock,
  ArrowRight,
  Plus
} from 'lucide-react';

export const CafeDashboard = () => {
  const {
    menu,
    tables,
    foodOrders,
    kpis,
    setCurrentTab,
    setSelectedTableForCustomer
  } = useApp();

  const occupiedTables = tables.filter(t => t.status === 'OCCUPIED').length;
  const availableTables = tables.filter(t => t.status === 'AVAILABLE').length;
  const orderingTables = tables.filter(t => t.status === 'ORDERING').length;
  const cleaningTables = tables.filter(t => t.status === 'CLEANING').length;

  const totalTables = tables.length;
  const occupancyRate = totalTables > 0 ? ((occupiedTables / totalTables) * 100).toFixed(0) : 0;

  const activeOrders = foodOrders.filter(o => ['NEW', 'CONFIRMED', 'PREPARING', 'READY'].includes(o.orderStatus));

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-neutral-950 via-stone-900 to-amber-950 text-white p-6 rounded-3xl shadow-xl border border-amber-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold mb-2">
            <Coffee className="w-3.5 h-3.5" />
            <span>KURSUS MASAKAN • CAFÉ GIATMARA KANGAR</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <span>TASTYBITES CAFÉ MANAGEMENT</span>
            <span className="text-xs bg-amber-500 text-neutral-950 px-2 py-0.5 rounded-full font-black">HOT & FRESH</span>
          </h1>
          <p className="text-stone-300 text-xs sm:text-sm mt-1 max-w-xl">
            Pusat kawalan pesanan makanan gourmet, status dapur KDS, pengurusan meja dan jualan harian café.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setCurrentTab('food-ordering')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 rounded-xl text-xs font-black shadow-lg shadow-amber-500/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Order Baru (POS)</span>
          </button>
          <button
            onClick={() => setCurrentTab('kitchen')}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold shadow-md transition"
          >
            <ChefHat className="w-4 h-4" />
            <span>Paparan Dapur (KDS)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase">
            <span>Jumlah Jualan Café</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-emerald-700 mt-2">
            RM {kpis.cafeSales.toFixed(2)}
          </p>
          <span className="text-[11px] text-slate-500 font-medium">Daripada {foodOrders.length} pesanan</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase">
            <span>Kadar Meja Diduduki</span>
            <Grid className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
            {occupancyRate}%
          </p>
          <span className="text-[11px] text-slate-500 font-medium">{occupiedTables} daripada {totalTables} Meja Aktif</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase">
            <span>Pesanan Sedang Masak</span>
            <ChefHat className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-amber-600 mt-2">
            {activeOrders.length}
          </p>
          <span className="text-[11px] text-slate-500 font-medium">Dalam giliran penyediaan dapur</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase">
            <span>Jumlah Menu Makanan</span>
            <UtensilsCrossed className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-purple-700 mt-2">
            {menu.length}
          </p>
          <span className="text-[11px] text-slate-500 font-medium">Hidangan & Minuman Aktif</span>
        </div>
      </div>

      {/* Table Status Mini Overview */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">Status Susun Atur Meja Café (Live Floor Plan)</h3>
            <p className="text-xs text-slate-500">Klik mana-mana meja untuk buka menu pesanan QR atau urus meja</p>
          </div>
          <button
            onClick={() => setCurrentTab('tables')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            Urus Meja Penuh <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {tables.map(t => (
            <div
              key={t.id}
              onClick={() => {
                setSelectedTableForCustomer(t.id);
                setCurrentTab('customer-order');
              }}
              className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all hover:scale-[1.02] ${
                t.status === 'AVAILABLE' ? 'border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/50' :
                t.status === 'OCCUPIED' ? 'border-rose-200 bg-rose-50/50 hover:bg-rose-100/50' :
                t.status === 'ORDERING' ? 'border-amber-200 bg-amber-50/50 hover:bg-amber-100/50' :
                t.status === 'CLEANING' ? 'border-blue-200 bg-blue-50/50 hover:bg-blue-100/50' :
                'border-slate-200 bg-slate-50 opacity-60'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-black text-sm text-slate-900">{t.id}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  t.status === 'AVAILABLE' ? 'bg-emerald-200/70 text-emerald-800' :
                  t.status === 'OCCUPIED' ? 'bg-rose-200/70 text-rose-800' :
                  t.status === 'ORDERING' ? 'bg-amber-200/70 text-amber-800' :
                  t.status === 'CLEANING' ? 'bg-blue-200/70 text-blue-800' :
                  'bg-slate-200 text-slate-600'
                }`}>
                  {t.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">{t.name} ({t.capacity} Orang)</p>
              <p className="text-[10px] text-slate-400 truncate">{t.location}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => setCurrentTab('menu')}
          className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md cursor-pointer transition flex items-center gap-4 group"
        >
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:scale-110 transition">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-600 transition">Katalog Menu Makanan</h4>
            <p className="text-xs text-slate-500 mt-0.5">Tambah & kemaskini harga kos, harga jualan dan stok menu</p>
          </div>
        </div>

        <div
          onClick={() => setCurrentTab('qr-tables')}
          className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md cursor-pointer transition flex items-center gap-4 group"
        >
          <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:scale-110 transition">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition">Kod QR Setiap Meja</h4>
            <p className="text-xs text-slate-500 mt-0.5">Jana, muat turun dan cetak kod QR unik meja M01-M10</p>
          </div>
        </div>

        <div
          onClick={() => setCurrentTab('kitchen')}
          className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md cursor-pointer transition flex items-center gap-4 group"
        >
          <div className="p-3.5 bg-amber-50 text-amber-600 rounded-2xl group-hover:scale-110 transition">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm group-hover:text-amber-600 transition">Paparan Dapur (KDS)</h4>
            <p className="text-xs text-slate-500 mt-0.5">Terima pesanan, tukar status memasak dan siap dihidang</p>
          </div>
        </div>
      </div>

    </div>
  );
};
