/**
 * TRIG GIATMARA KANGAR - Unified Finance & Sales Master Ledger
 * Integrates Café Sales, Smartphone Repair, and Phone Accessories POS into a unified financial ledger.
 */

const FinanceModule = {
  activeModuleFilter: 'ALL',
  searchQuery: '',
  dateRange: 'ALL', // 'TODAY', 'WEEK', 'MONTH', 'ALL'

  render: function(subview = 'sales') {
    const container = document.getElementById('main-content-view');
    if (!container) return;

    if (subview === 'profit' || subview === 'analytics') {
      this.renderFinancialAnalytics(container);
    } else {
      this.renderUnifiedSales(container);
    }

    if (window.lucide) lucide.createIcons();
  },

  // 1. UNIFIED SALES MASTER LEDGER
  renderUnifiedSales: function(container) {
    const sales = DB.get('sales') || [];
    const settings = DB.get('settings') || {};
    const currency = settings.currencySymbol || 'RM';

    const modules = ['ALL', 'CAFÉ', 'REPAIR', 'ACCESSORIES'];

    let filtered = sales;
    if (this.activeModuleFilter !== 'ALL') {
      filtered = filtered.filter(s => s.module === this.activeModuleFilter || (this.activeModuleFilter === 'CAFÉ' && s.module === 'CAFE'));
    }
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(s => s.id.toLowerCase().includes(q) || s.receiptNumber.toLowerCase().includes(q) || s.customer.toLowerCase().includes(q) || s.itemsSummary.toLowerCase().includes(q));
    }

    let totalRev = 0;
    let totalCost = 0;
    let totalProf = 0;

    filtered.forEach(s => {
      totalRev += (parseFloat(s.sellingPrice) || 0);
      totalCost += (parseFloat(s.costPrice) || 0);
      totalProf += (parseFloat(s.profit) || 0);
    });

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <div class="flex items-center gap-2 text-xs text-slate-500 font-semibold mb-1">
              <span>Kewangan & Jualan</span> &rarr; <span>Lejar Jualan Bersepadu</span>
            </div>
            <h1 class="text-xl font-bold text-slate-900">Lejar Jualan Bersepadu (Unified Sales Master)</h1>
            <p class="text-xs text-slate-500">Gabungan transaksi Café, Servis Baiki Smartphone & Jualan Aksesori.</p>
          </div>
          <button onclick="FinanceModule.render('profit')" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition">
            <i data-lucide="bar-chart-2" class="w-4 h-4"></i> Analisis Kewangan & Untung Kasar
          </button>
        </div>

        <!-- Financial Summary Header Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="card-kpi p-5 border-l-4 border-l-blue-600">
            <span class="text-xs font-bold text-slate-500 uppercase">Jumlah Hasil (Revenue)</span>
            <div class="mt-2 text-2xl font-black font-mono text-slate-900">${currency} ${totalRev.toFixed(2)}</div>
            <div class="mt-1 text-[11px] text-slate-500">${filtered.length} Transaksi Direkodkan</div>
          </div>

          <div class="card-kpi p-5 border-l-4 border-l-slate-400">
            <span class="text-xs font-bold text-slate-500 uppercase">Jumlah Kos Bahan / Alat (Cost)</span>
            <div class="mt-2 text-2xl font-black font-mono text-slate-700">${currency} ${totalCost.toFixed(2)}</div>
            <div class="mt-1 text-[11px] text-slate-500">Kos barangan & bahan</div>
          </div>

          <div class="card-kpi p-5 border-l-4 border-l-emerald-600">
            <span class="text-xs font-bold text-slate-500 uppercase">Untung Kasar (Gross Profit)</span>
            <div class="mt-2 text-2xl font-black font-mono text-emerald-600">${currency} ${totalProf.toFixed(2)}</div>
            <div class="mt-1 text-[11px] text-slate-500">Margin: ${totalRev > 0 ? ((totalProf/totalRev)*100).toFixed(1) : 0}%</div>
          </div>
        </div>

        <!-- Filter & Search Bar -->
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            ${modules.map(m => `
              <button onclick="FinanceModule.filterModule('${m}')" class="px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${this.activeModuleFilter === m ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}">
                ${m === 'ALL' ? 'Semua Modul' : m}
              </button>
            `).join('')}
          </div>

          <div class="relative w-full md:w-72">
            <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3 top-3"></i>
            <input type="text" value="${this.searchQuery}" oninput="FinanceModule.searchSales(this.value)" placeholder="Cari No Resit, Pelanggan, Item..." class="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
        </div>

        <!-- Master Sales Table -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th class="p-4">No Resit & Tarikh</th>
                  <th class="p-4">Modul Perniagaan</th>
                  <th class="p-4">Pelanggan</th>
                  <th class="p-4">Ringkasan Item / Servis</th>
                  <th class="p-4 text-right">Kos</th>
                  <th class="p-4 text-right">Harga Jualan</th>
                  <th class="p-4 text-right">Untung Kasar</th>
                  <th class="p-4 text-center">Bayaran</th>
                  <th class="p-4 text-center">Tindakan</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${filtered.map(s => {
                  let badgeMod = 'bg-amber-100 text-amber-800';
                  if (s.module === 'REPAIR') badgeMod = 'bg-cyan-100 text-cyan-800';
                  if (s.module === 'ACCESSORIES') badgeMod = 'bg-emerald-100 text-emerald-800';

                  return `
                    <tr class="hover:bg-slate-50 transition">
                      <td class="p-4">
                        <div class="font-mono font-bold text-slate-900">${s.receiptNumber || s.id}</div>
                        <div class="text-[10px] text-slate-400 mt-0.5">${s.date} ${s.time}</div>
                      </td>
                      <td class="p-4">
                        <span class="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase ${badgeMod}">
                          ${s.module}
                        </span>
                      </td>
                      <td class="p-4 font-bold text-slate-800">${s.customer}</td>
                      <td class="p-4 text-slate-600 max-w-xs truncate">${s.itemsSummary}</td>
                      <td class="p-4 text-right font-mono text-slate-500">${currency} ${(s.costPrice || 0).toFixed(2)}</td>
                      <td class="p-4 text-right font-mono font-bold text-slate-900">${currency} ${(s.sellingPrice || 0).toFixed(2)}</td>
                      <td class="p-4 text-right font-mono font-bold text-emerald-600">${currency} ${(s.profit || 0).toFixed(2)}</td>
                      <td class="p-4 text-center">
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${s.paymentMethod === 'QR_PAYMENT' ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-700'}">
                          ${s.paymentMethod}
                        </span>
                      </td>
                      <td class="p-4 text-center">
                        <button onclick="FinanceModule.previewSaleReceipt('${s.id}')" class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Cetak Resit">
                          <i data-lucide="receipt" class="w-4 h-4"></i>
                        </button>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  filterModule: function(m) {
    this.activeModuleFilter = m;
    this.render('sales');
  },

  searchSales: function(q) {
    this.searchQuery = q;
    this.render('sales');
  },

  previewSaleReceipt: function(saleId) {
    const sales = DB.get('sales') || [];
    const orders = DB.get('orders') || [];
    const repairJobs = DB.get('repairJobs') || [];

    const sale = sales.find(s => s.id === saleId);
    if (!sale) return;

    if (sale.module === 'CAFÉ' || sale.module === 'CAFE') {
      const ord = orders.find(o => o.id === sale.referenceId || o.receiptNumber === sale.receiptNumber);
      if (ord) {
        ReceiptEngine.preview(ord, '80mm');
        return;
      }
    } else if (sale.module === 'REPAIR') {
      const rep = repairJobs.find(r => r.id === sale.referenceId || r.receiptNumber === sale.receiptNumber);
      if (rep) {
        ReceiptEngine.preview(rep, '80mm');
        return;
      }
    }

    // Fallback accessories/general
    ReceiptEngine.preview(sale, '80mm');
  },

  // 2. FINANCIAL ANALYTICS & PROFIT BREAKDOWN
  renderFinancialAnalytics: function(container) {
    const sales = DB.get('sales') || [];
    const settings = DB.get('settings') || {};
    const currency = settings.currencySymbol || 'RM';

    let cafeRev = 0, cafeCost = 0, cafeProf = 0;
    let repairRev = 0, repairCost = 0, repairProf = 0;
    let accRev = 0, accCost = 0, accProf = 0;

    sales.forEach(s => {
      const sp = parseFloat(s.sellingPrice) || 0;
      const cp = parseFloat(s.costPrice) || 0;
      const pr = parseFloat(s.profit) || 0;

      if (s.module === 'CAFÉ' || s.module === 'CAFE') {
        cafeRev += sp; cafeCost += cp; cafeProf += pr;
      } else if (s.module === 'REPAIR') {
        repairRev += sp; repairCost += cp; repairProf += pr;
      } else if (s.module === 'ACCESSORIES') {
        accRev += sp; accCost += cp; accProf += pr;
      }
    });

    const totalRev = cafeRev + repairRev + accRev;
    const totalCost = cafeCost + repairCost + accCost;
    const totalProf = cafeProf + repairProf + accProf;

    container.innerHTML = `
      <div class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <div class="flex items-center gap-2 text-xs text-slate-500 font-semibold mb-1">
              <a href="javascript:void(0)" onclick="FinanceModule.render('sales')" class="hover:underline">Kewangan</a> &rarr; <span>Analisis Prestasi Untung</span>
            </div>
            <h1 class="text-xl font-bold text-slate-900">Analisis Prestasi Kewangan & Margin Keuntungan</h1>
            <p class="text-xs text-slate-500">Perbandingan hasil, kos bahan dan keuntungan bersih mengikut cabang perniagaan.</p>
          </div>
        </div>

        <!-- 3 Module Breakdown Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <!-- Café -->
          <div class="card-soft p-5 border-l-4 border-l-amber-500 space-y-3">
            <div class="flex items-center justify-between">
              <span class="font-bold text-slate-900 text-sm">Cabang Café & Kulinari</span>
              <span class="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold"><i data-lucide="coffee"></i></span>
            </div>
            <div class="space-y-1 text-xs">
              <div class="flex justify-between"><span>Hasil Jualan:</span><b class="font-mono">${currency} ${cafeRev.toFixed(2)}</b></div>
              <div class="flex justify-between text-slate-500"><span>Kos Bahan Mentah:</span><span class="font-mono">${currency} ${cafeCost.toFixed(2)}</span></div>
              <div class="flex justify-between text-emerald-700 font-bold border-t border-slate-100 pt-1">
                <span>Untung Kasar:</span>
                <span class="font-mono">${currency} ${cafeProf.toFixed(2)}</span>
              </div>
              <div class="text-[10px] text-slate-400 text-right">Margin: ${cafeRev > 0 ? ((cafeProf/cafeRev)*100).toFixed(1) : 0}%</div>
            </div>
          </div>

          <!-- Smartphone Repair -->
          <div class="card-soft p-5 border-l-4 border-l-cyan-600 space-y-3">
            <div class="flex items-center justify-between">
              <span class="font-bold text-slate-900 text-sm">Servis Baiki Smartphone</span>
              <span class="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold"><i data-lucide="smartphone"></i></span>
            </div>
            <div class="space-y-1 text-xs">
              <div class="flex justify-between"><span>Hasil Servis:</span><b class="font-mono">${currency} ${repairRev.toFixed(2)}</b></div>
              <div class="flex justify-between text-slate-500"><span>Kos Alat Ganti & Upah:</span><span class="font-mono">${currency} ${repairCost.toFixed(2)}</span></div>
              <div class="flex justify-between text-emerald-700 font-bold border-t border-slate-100 pt-1">
                <span>Untung Kasar:</span>
                <span class="font-mono">${currency} ${repairProf.toFixed(2)}</span>
              </div>
              <div class="text-[10px] text-slate-400 text-right">Margin: ${repairRev > 0 ? ((repairProf/repairRev)*100).toFixed(1) : 0}%</div>
            </div>
          </div>

          <!-- Accessories -->
          <div class="card-soft p-5 border-l-4 border-l-emerald-600 space-y-3">
            <div class="flex items-center justify-between">
              <span class="font-bold text-slate-900 text-sm">Jualan Aksesori Telefon</span>
              <span class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold"><i data-lucide="headphones"></i></span>
            </div>
            <div class="space-y-1 text-xs">
              <div class="flex justify-between"><span>Hasil Jualan:</span><b class="font-mono">${currency} ${accRev.toFixed(2)}</b></div>
              <div class="flex justify-between text-slate-500"><span>Kos Modal Stok:</span><span class="font-mono">${currency} ${accCost.toFixed(2)}</span></div>
              <div class="flex justify-between text-emerald-700 font-bold border-t border-slate-100 pt-1">
                <span>Untung Kasar:</span>
                <span class="font-mono">${currency} ${accProf.toFixed(2)}</span>
              </div>
              <div class="text-[10px] text-slate-400 text-right">Margin: ${accRev > 0 ? ((accProf/accRev)*100).toFixed(1) : 0}%</div>
            </div>
          </div>
        </div>

        <!-- Total Overview Card -->
        <div class="bg-slate-900 text-white p-6 rounded-2xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 class="font-bold text-lg text-cyan-400">RUMUSAN KESELURUHAN PRESTASI PERNIAGAAN</h3>
            <p class="text-xs text-slate-300 mt-1">TRIG GIATMARA Kangar Digital Business Enterprise Model</p>
          </div>
          <div class="grid grid-cols-3 gap-6 text-center">
            <div>
              <div class="text-xs text-slate-400">Jumlah Hasil</div>
              <div class="text-xl font-black font-mono mt-1 text-white">${currency} ${totalRev.toFixed(2)}</div>
            </div>
            <div>
              <div class="text-xs text-slate-400">Jumlah Kos</div>
              <div class="text-xl font-black font-mono mt-1 text-slate-300">${currency} ${totalCost.toFixed(2)}</div>
            </div>
            <div>
              <div class="text-xs text-emerald-400 font-bold">Untung Bersih Keseluruhan</div>
              <div class="text-2xl font-black font-mono mt-1 text-emerald-400">${currency} ${totalProf.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
};
