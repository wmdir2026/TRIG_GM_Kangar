import React from 'react';
import { useApp } from '../context/AppContext';
import {
  DollarSign,
  TrendingUp,
  UtensilsCrossed,
  Smartphone,
  Sparkles,
  AlertTriangle,
  Clock,
  CheckCircle2,
  FileText,
  ShoppingBag,
  ArrowUpRight,
  ArrowRight,
  PackageCheck,
  ChevronRight,
  Receipt
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const DashboardView = () => {
  const {
    kpis,
    sales,
    foodOrders,
    repairJobs,
    inventory,
    purchaseRequests,
    setCurrentTab,
    openReceipt
  } = useApp();

  // Dynamic Sales by Module calculation
  const cafeTotal = sales.filter(s => s.module === 'CAFÉ').reduce((acc, s) => acc + s.sellingPrice, 0);
  const repairTotal = sales.filter(s => s.module === 'REPAIR').reduce((acc, s) => acc + s.sellingPrice, 0);
  const accTotal = sales.filter(s => s.module === 'ACCESSORIES').reduce((acc, s) => acc + s.sellingPrice, 0);

  // Chart 1: Sales by Module Doughnut
  const doughnutData = {
    labels: ['Café & Makanan', 'Baiki Smartphone', 'Jualan Aksesori'],
    datasets: [
      {
        data: [cafeTotal || 1, repairTotal || 1, accTotal || 1],
        backgroundColor: ['#10b981', '#3b82f6', '#f59e0b'],
        borderWidth: 0,
        hoverOffset: 4
      }
    ]
  };

  // Chart 2: 7-Day Performance Bar Chart
  const days = ['Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu', 'Ahad'];
  const barData = {
    labels: days,
    datasets: [
      {
        label: 'Hasil Jualan (RM)',
        data: [120, 240, 190, 310, 480, 520, (kpis.todaySales || 180)],
        backgroundColor: '#6366f1',
        borderRadius: 8
      },
      {
        label: 'Untung Kasar (RM)',
        data: [65, 130, 95, 170, 260, 290, (kpis.totalProfit > 0 ? kpis.totalProfit * 0.4 : 95)],
        backgroundColor: '#10b981',
        borderRadius: 8
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { font: { size: 11, weight: 'bold' } }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#f1f5f9' },
        ticks: { font: { size: 10 } }
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 10 } }
      }
    }
  };

  const lowStockItems = inventory.filter(i => i.currentStock <= i.minStock);
  const pendingPRs = purchaseRequests.filter(p => p.status === 'PENDING_APPROVAL');

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold mb-2 backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Program Keusahawanan TRIG GIATMARA Kangar</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              BUSINESS PERFORMANCE DASHBOARD
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
              Pantauan bersepadu operasi Kursus Masakan (Café & Katering) dan Kursus Baiki Smartphone (Servis & Aksesori).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setCurrentTab('food-ordering')}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md transition"
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>POS Café</span>
            </button>
            <button
              onClick={() => setCurrentTab('repair-jobs')}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md transition"
            >
              <Smartphone className="w-4 h-4" />
              <span>Job Baiki</span>
            </button>
            <button
              onClick={() => setCurrentTab('accessories-pos')}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold shadow-md transition"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>POS Aksesori</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Sales Today */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Jualan Hari Ini
            </span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
            RM {kpis.todaySales.toFixed(2)}
          </p>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Aktif dikemaskini secara langsung</span>
          </div>
        </div>

        {/* Café Sales */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Jualan Café
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-emerald-700 mt-2">
            RM {kpis.cafeSales.toFixed(2)}
          </p>
          <div className="mt-2 text-[11px] text-slate-500 flex justify-between">
            <span>Dine-In & Takeaway</span>
            <span className="font-bold text-slate-700">{foodOrders.length} Pesanan</span>
          </div>
        </div>

        {/* Repair Sales */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Jualan Servis Baiki
            </span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Smartphone className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-blue-700 mt-2">
            RM {kpis.repairSales.toFixed(2)}
          </p>
          <div className="mt-2 text-[11px] text-slate-500 flex justify-between">
            <span>Alat Ganti & Upah</span>
            <span className="font-bold text-slate-700">{repairJobs.length} Peranti</span>
          </div>
        </div>

        {/* Total Gross Profit */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Jumlah Untung Kasar
            </span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-purple-700 mt-2">
            RM {kpis.totalProfit.toFixed(2)}
          </p>
          <div className="mt-2 text-[11px] text-slate-500 flex justify-between">
            <span>Margin Kasar Purata:</span>
            <span className="font-bold text-purple-800">
              {kpis.totalSales > 0 ? `${((kpis.totalProfit / kpis.totalSales) * 100).toFixed(1)}%` : '0%'}
            </span>
          </div>
        </div>

      </div>

      {/* Secondary Quick Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          onClick={() => setCurrentTab('kitchen')}
          className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between cursor-pointer hover:bg-emerald-100/70 transition"
        >
          <div>
            <p className="text-[11px] font-bold text-emerald-800 uppercase">Pesanan Dapur Aktif</p>
            <p className="text-lg font-black text-emerald-950">{kpis.activeFoodOrdersCount} Order</p>
          </div>
          <Clock className="w-5 h-5 text-emerald-600" />
        </div>

        <div
          onClick={() => setCurrentTab('repair-jobs')}
          className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center justify-between cursor-pointer hover:bg-blue-100/70 transition"
        >
          <div>
            <p className="text-[11px] font-bold text-blue-800 uppercase">Job Baiki Dalam Proses</p>
            <p className="text-lg font-black text-blue-950">{kpis.activeRepairJobsCount} Unit</p>
          </div>
          <Smartphone className="w-5 h-5 text-blue-600" />
        </div>

        <div
          onClick={() => setCurrentTab('low-stock')}
          className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center justify-between cursor-pointer hover:bg-amber-100/70 transition"
        >
          <div>
            <p className="text-[11px] font-bold text-amber-800 uppercase">Amaran Stok Rendah</p>
            <p className="text-lg font-black text-amber-950">{kpis.lowStockCount} Item</p>
          </div>
          <AlertTriangle className="w-5 h-5 text-amber-600" />
        </div>

        <div
          onClick={() => setCurrentTab('purchase-requests')}
          className="p-3.5 bg-purple-50/70 border border-purple-200 rounded-xl flex items-center justify-between cursor-pointer hover:bg-purple-100/70 transition"
        >
          <div>
            <p className="text-[11px] font-bold text-purple-800 uppercase">PR Menunggu Kelulusan</p>
            <p className="text-lg font-black text-purple-950">{kpis.pendingPurchasesCount} Permohonan</p>
          </div>
          <FileText className="w-5 h-5 text-purple-600" />
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Bar Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Trend Prestasi Jualan & Keuntungan (7 Hari)
              </h3>
              <p className="text-xs text-slate-500">Perbandingan perolehan dan keuntungan kasar operasi</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
              Minggu Semasa
            </span>
          </div>
          <div className="h-64">
            <Bar data={barData} options={chartOptions} />
          </div>
        </div>

        {/* Business Module Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Pecahan Hasil Mengikut Modul
            </h3>
            <p className="text-xs text-slate-500">Sumbangan setiap bidang perniagaan</p>
          </div>
          <div className="h-48 my-2 flex items-center justify-center">
            <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                Café & Makanan
              </span>
              <span className="font-bold text-slate-900">RM {cafeTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                Baiki Smartphone
              </span>
              <span className="font-bold text-slate-900">RM {repairTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                Aksesori Telefon
              </span>
              <span className="font-bold text-slate-900">RM {accTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Live Operational Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Café Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-sm">Pesanan Café Terkini</h3>
            </div>
            <button
              onClick={() => setCurrentTab('food-orders')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {foodOrders.slice(0, 4).map(o => (
              <div
                key={o.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{o.id}</span>
                    <span className="font-bold px-1.5 py-0.2 text-[10px] rounded bg-emerald-100 text-emerald-700">
                      {o.orderType === 'DINE_IN' ? `Meja ${o.tableId}` : 'Takeaway'}
                    </span>
                    <span className="text-slate-600 font-medium">{o.customerName}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {o.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-black text-slate-900 block">RM {o.grandTotal.toFixed(2)}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                    o.orderStatus === 'COMPLETED' ? 'bg-slate-200 text-slate-700' :
                    o.orderStatus === 'READY' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {o.orderStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Repair Jobs */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-sm">Job Baiki Telefon Terkini</h3>
            </div>
            <button
              onClick={() => setCurrentTab('repair-jobs')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {repairJobs.slice(0, 4).map(j => (
              <div
                key={j.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-blue-700">{j.id}</span>
                    <span className="font-semibold text-slate-900">{j.deviceBrand} {j.deviceModel}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Pelanggan: {j.customerName} • {j.damageType}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-black text-slate-900 block">RM {j.sellingPrice.toFixed(2)}</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    {j.repairStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Low Stock & Procurement Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Low Stock Items Alert Card */}
        <div className="bg-white p-5 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2 text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Amaran Stok Minimum ({lowStockItems.length})
            </span>
            <button
              onClick={() => setCurrentTab('low-stock')}
              className="text-xs text-amber-700 font-bold hover:underline"
            >
              Urus Stok &rarr;
            </button>
          </div>

          <div className="space-y-2">
            {lowStockItems.length === 0 ? (
              <p className="text-xs text-slate-500">Semua paras stok mencukupi.</p>
            ) : (
              lowStockItems.map(it => (
                <div
                  key={it.id}
                  className="p-2.5 bg-white rounded-xl border border-amber-200 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-slate-900">{it.name}</p>
                    <p className="text-[11px] text-slate-500">
                      Baki: <span className="font-black text-rose-600">{it.currentStock} {it.unit}</span> (Min: {it.minStock} {it.unit})
                    </p>
                  </div>
                  <button
                    onClick={() => setCurrentTab('purchase-requests')}
                    className="px-2.5 py-1 text-[11px] font-bold bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg transition"
                  >
                    Mohon Beli
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pending PRs Card */}
        <div className="bg-white p-5 rounded-2xl border border-purple-200 bg-purple-50/20 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2 text-purple-900">
              <FileText className="w-4 h-4 text-purple-600" />
              Permohonan Belian Menunggu Pengurus ({pendingPRs.length})
            </span>
            <button
              onClick={() => setCurrentTab('purchase-requests')}
              className="text-xs text-purple-700 font-bold hover:underline"
            >
              Kelulusan PR &rarr;
            </button>
          </div>

          <div className="space-y-2">
            {pendingPRs.length === 0 ? (
              <p className="text-xs text-slate-500">Tiada permohonan belian yang belum diproses.</p>
            ) : (
              pendingPRs.map(pr => (
                <div
                  key={pr.id}
                  className="p-2.5 bg-white rounded-xl border border-purple-200 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-purple-900">{pr.id}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 font-semibold">{pr.department}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{pr.purpose}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-slate-900 block">RM {pr.totalAmount.toFixed(2)}</span>
                    <button
                      onClick={() => setCurrentTab('purchase-requests')}
                      className="px-2 py-0.5 text-[10px] font-bold text-purple-700 hover:underline"
                    >
                      Semak & Kelulusan
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
