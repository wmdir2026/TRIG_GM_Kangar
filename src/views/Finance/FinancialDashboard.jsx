import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  DollarSign,
  PieChart,
  BarChart3,
  Calendar,
  UtensilsCrossed,
  Smartphone,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

export const FinancialDashboard = () => {
  const { sales } = useApp();
  const [period, setPeriod] = useState('ALL'); // 'TODAY', 'WEEK', 'MONTH', 'ALL'

  const totalRevenue = sales.reduce((acc, s) => acc + s.sellingPrice, 0);
  const totalCost = sales.reduce((acc, s) => acc + (s.costPrice || 0), 0);
  const grossProfit = sales.reduce((acc, s) => acc + (s.grossProfit || 0), 0);
  const marginPercent = totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100).toFixed(1) : 0;

  const cafeSales = sales.filter(s => s.module === 'CAFÉ').reduce((acc, s) => acc + s.sellingPrice, 0);
  const repairSales = sales.filter(s => s.module === 'REPAIR').reduce((acc, s) => acc + s.sellingPrice, 0);
  const accSales = sales.filter(s => s.module === 'ACCESSORIES').reduce((acc, s) => acc + s.sellingPrice, 0);

  const cafeProfit = sales.filter(s => s.module === 'CAFÉ').reduce((acc, s) => acc + (s.grossProfit || 0), 0);
  const repairProfit = sales.filter(s => s.module === 'REPAIR').reduce((acc, s) => acc + (s.grossProfit || 0), 0);
  const accProfit = sales.filter(s => s.module === 'ACCESSORIES').reduce((acc, s) => acc + (s.grossProfit || 0), 0);

  // Revenue vs Cost vs Profit Chart
  const comparisonData = {
    labels: ['Café & Makanan', 'Baiki Smartphone', 'Aksesori Telefon'],
    datasets: [
      {
        label: 'Hasil Jualan (RM)',
        data: [cafeSales, repairSales, accSales],
        backgroundColor: '#6366f1',
        borderRadius: 8
      },
      {
        label: 'Kos Terlibat (RM)',
        data: [cafeSales - cafeProfit, repairSales - repairProfit, accSales - accProfit],
        backgroundColor: '#94a3b8',
        borderRadius: 8
      },
      {
        label: 'Untung Kasar (RM)',
        data: [cafeProfit, repairProfit, accProfit],
        backgroundColor: '#10b981',
        borderRadius: 8
      }
    ]
  };

  const doughnutData = {
    labels: ['Untung Café', 'Untung Baiki', 'Untung Aksesori'],
    datasets: [
      {
        data: [cafeProfit || 1, repairProfit || 1, accProfit || 1],
        backgroundColor: ['#10b981', '#3b82f6', '#f59e0b']
      }
    ]
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 mb-1 uppercase tracking-wider">
            <TrendingUp className="w-4 h-4" />
            <span>Prestasi Kewangan & Untung Rugi Operasi</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            FINANCIAL & PROFIT DASHBOARD
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Analisis perolehan kasar, perbelanjaan kos bahan/alat ganti, dan margin keuntungan Program Keusahawanan TRIG.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl">
          {['TODAY', 'WEEK', 'MONTH', 'ALL'].map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                period === p ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {p === 'TODAY' ? 'Hari Ini' : p === 'WEEK' ? 'Minggu Ini' : p === 'MONTH' ? 'Bulan Ini' : 'Keseluruhan'}
            </button>
          ))}
        </div>
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Jumlah Hasil (Revenue)</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            RM {totalRevenue.toFixed(2)}
          </p>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Café: RM {cafeSales.toFixed(2)}</span>
            <span>Baiki: RM {repairSales.toFixed(2)}</span>
          </div>
        </div>

        {/* Total Cost */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Jumlah Kos (COGS)</span>
            <div className="p-2 bg-slate-100 text-slate-600 rounded-xl">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-700 mt-2">
            RM {totalCost.toFixed(2)}
          </p>
          <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 font-medium">
            Kos alat ganti & bahan mentah masakan
          </div>
        </div>

        {/* Gross Profit */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Untung Kasar (Gross Profit)</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-700 mt-2">
            RM {grossProfit.toFixed(2)}
          </p>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Margin Keuntungan Purata:</span>
            <span className="font-black text-emerald-700">{marginPercent}%</span>
          </div>
        </div>

      </div>

      {/* Comparison Chart & Breakdown Doughnut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-1">
            Perbandingan Hasil, Kos & Keuntungan Mengikut Bidang (RM)
          </h3>
          <p className="text-xs text-slate-500 mb-4">Pecahan prestasi kewangan setiap kursus perniagaan</p>
          <div className="h-72">
            <Bar
              data={comparisonData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: { y: { beginAtZero: true } }
              }}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">Sumbangan Keuntungan Kasar</h3>
            <p className="text-xs text-slate-500">Pecahan untung mengikut modul</p>
          </div>
          <div className="h-52 my-3">
            <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
          <div className="space-y-2 text-xs pt-2 border-t border-slate-100">
            <div className="flex justify-between">
              <span className="text-slate-600">Untung Café:</span>
              <span className="font-bold text-emerald-700">RM {cafeProfit.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Untung Baiki Telefon:</span>
              <span className="font-bold text-blue-700">RM {repairProfit.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Untung Aksesori:</span>
              <span className="font-bold text-amber-700">RM {accProfit.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
