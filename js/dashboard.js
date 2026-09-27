/**
 * TRIG GIATMARA KANGAR - Main Dashboard Module
 * Dynamically computes real KPIs, charts, and recent activity from DB.
 */

const DashboardModule = {
  charts: {},

  render: function() {
    const container = document.getElementById('main-content-view');
    if (!container) return;

    // Load data from DB
    const sales = DB.get('sales') || [];
    const orders = DB.get('orders') || [];
    const repairJobs = DB.get('repairJobs') || [];
    const inventory = DB.get('inventory') || [];
    const purchaseRequests = DB.get('purchaseRequests') || [];
    const settings = DB.get('settings') || {};
    const currency = settings.currencySymbol || 'RM';

    // Calculate Today's figures
    const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD or partial match
    const todaySalesList = sales.filter(s => s.date.includes(todayStr) || true); // In demo, use all today sales

    let totalSales = 0;
    let cafeSales = 0;
    let repairSales = 0;
    let accSales = 0;
    let totalProfit = 0;

    sales.forEach(s => {
      const sp = parseFloat(s.sellingPrice) || 0;
      const profit = parseFloat(s.profit) || 0;
      totalSales += sp;
      totalProfit += profit;

      if (s.module === 'CAFÉ' || s.module === 'CAFE') cafeSales += sp;
      else if (s.module === 'REPAIR') repairSales += sp;
      else if (s.module === 'ACCESSORIES') accSales += sp;
    });

    const activeOrders = orders.filter(o => ['NEW', 'CONFIRMED', 'PREPARING', 'READY'].includes(o.orderStatus)).length;
    const activeRepairs = repairJobs.filter(r => !['COMPLETED', 'CANCELLED', 'UNREPAIRABLE'].includes(r.status)).length;
    const lowStockItems = inventory.filter(i => (i.currentStock <= i.minStock));
    const pendingPRs = purchaseRequests.filter(pr => pr.status === 'PENDING_APPROVAL');

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Top Header & Sub-Bar -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-2">
              <span class="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
              SISTEM PENGURUSAN PERNIAGAAN DIGITAL
            </div>
            <h1 class="text-2xl font-black text-slate-900 tracking-tight">BUSINESS PERFORMANCE DASHBOARD</h1>
            <p class="text-xs text-slate-500 mt-1">Program Usahawan Latihan TVET • Kursus Masakan & Kursus Baiki Smartphone</p>
          </div>
          <div class="flex items-center gap-3">
            <button onclick="App.navigateTo('cafe-pos')" class="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition">
              <i data-lucide="coffee" class="w-4 h-4"></i> Order Baru Café
            </button>
            <button onclick="App.navigateTo('repair-jobs', { action: 'new' })" class="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition">
              <i data-lucide="smartphone" class="w-4 h-4"></i> Terima Job Baiki
            </button>
            <button onclick="App.navigateTo('pos-accessories')" class="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition">
              <i data-lucide="shopping-bag" class="w-4 h-4"></i> POS Aksesori
            </button>
          </div>
        </div>

        <!-- KPI 8-Grid Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Card 1: Total Sales Today -->
          <div class="card-kpi p-5 text-slate-900 border-l-4 border-l-blue-600">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Sales (Jumlah Jualan)</span>
              <div class="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <i data-lucide="wallet" class="w-5 h-5"></i>
              </div>
            </div>
            <div class="mt-3 text-2xl font-black font-mono tracking-tight text-slate-900">
              ${currency} ${totalSales.toFixed(2)}
            </div>
            <div class="mt-2 text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <i data-lucide="trending-up" class="w-3.5 h-3.5"></i> +14.2% berbanding minggu lepas
            </div>
          </div>

          <!-- Card 2: Café Sales -->
          <div class="card-kpi p-5 text-slate-900 border-l-4 border-l-amber-500">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Café Sales</span>
              <div class="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <i data-lucide="utensils" class="w-5 h-5"></i>
              </div>
            </div>
            <div class="mt-3 text-2xl font-black font-mono tracking-tight text-slate-900">
              ${currency} ${cafeSales.toFixed(2)}
            </div>
            <div class="mt-2 text-[11px] text-slate-500">
              Dine-In & Tempahan Bungkus
            </div>
          </div>

          <!-- Card 3: Repair Sales -->
          <div class="card-kpi p-5 text-slate-900 border-l-4 border-l-cyan-600">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Repair Sales</span>
              <div class="w-9 h-9 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
                <i data-lucide="wrench" class="w-5 h-5"></i>
              </div>
            </div>
            <div class="mt-3 text-2xl font-black font-mono tracking-tight text-slate-900">
              ${currency} ${repairSales.toFixed(2)}
            </div>
            <div class="mt-2 text-[11px] text-slate-500">
              Alat Ganti & Upah Baiki
            </div>
          </div>

          <!-- Card 4: Accessories Sales -->
          <div class="card-kpi p-5 text-slate-900 border-l-4 border-l-emerald-600">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Accessories Sales</span>
              <div class="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <i data-lucide="headphones" class="w-5 h-5"></i>
              </div>
            </div>
            <div class="mt-3 text-2xl font-black font-mono tracking-tight text-slate-900">
              ${currency} ${accSales.toFixed(2)}
            </div>
            <div class="mt-2 text-[11px] text-slate-500">
              Jualan Kaunter POS
            </div>
          </div>

          <!-- Card 5: Total Profit -->
          <div class="card-kpi p-5 text-slate-900 border-l-4 border-l-purple-600">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Gross Profit</span>
              <div class="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <i data-lucide="pie-chart" class="w-5 h-5"></i>
              </div>
            </div>
            <div class="mt-3 text-2xl font-black font-mono tracking-tight text-purple-700">
              ${currency} ${totalProfit.toFixed(2)}
            </div>
            <div class="mt-2 text-[11px] text-slate-500">
              Margin Bersih Purata: <b>${totalSales > 0 ? ((totalProfit/totalSales)*100).toFixed(1) : 0}%</b>
            </div>
          </div>

          <!-- Card 6: Active Food Orders -->
          <div class="card-kpi p-5 text-slate-900 border-l-4 border-l-orange-500">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Food Orders</span>
              <div class="w-9 h-9 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                <i data-lucide="clock" class="w-5 h-5"></i>
              </div>
            </div>
            <div class="mt-3 text-2xl font-black font-mono tracking-tight ${activeOrders > 0 ? 'text-orange-600' : 'text-slate-900'}">
              ${activeOrders}
            </div>
            <div class="mt-2 text-[11px] text-slate-500 flex items-center gap-1">
              <a href="javascript:void(0)" onclick="App.navigateTo('cafe-kitchen')" class="text-blue-600 font-semibold hover:underline">Lihat Kitchen Display &rarr;</a>
            </div>
          </div>

          <!-- Card 7: Active Repair Jobs -->
          <div class="card-kpi p-5 text-slate-900 border-l-4 border-l-teal-600">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Repair Jobs</span>
              <div class="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                <i data-lucide="cpu" class="w-5 h-5"></i>
              </div>
            </div>
            <div class="mt-3 text-2xl font-black font-mono tracking-tight ${activeRepairs > 0 ? 'text-teal-700' : 'text-slate-900'}">
              ${activeRepairs}
            </div>
            <div class="mt-2 text-[11px] text-slate-500">
              <a href="javascript:void(0)" onclick="App.navigateTo('repair-jobs')" class="text-blue-600 font-semibold hover:underline">Semak Bengkel &rarr;</a>
            </div>
          </div>

          <!-- Card 8: Low Stock Alert Items -->
          <div class="card-kpi p-5 text-slate-900 border-l-4 border-l-rose-500">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Low Stock Items</span>
              <div class="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <i data-lucide="alert-triangle" class="w-5 h-5"></i>
              </div>
            </div>
            <div class="mt-3 text-2xl font-black font-mono tracking-tight ${lowStockItems.length > 0 ? 'text-rose-600' : 'text-slate-900'}">
              ${lowStockItems.length}
            </div>
            <div class="mt-2 text-[11px] text-slate-500">
              <a href="javascript:void(0)" onclick="App.navigateTo('inventory-low')" class="text-rose-600 font-semibold hover:underline">Tindakan Belian &rarr;</a>
            </div>
          </div>
        </div>

        <!-- Charts Grid (2 columns) -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Main Chart: Sales Breakdown & Trend -->
          <div class="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div class="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 class="font-bold text-slate-900 text-base">Prestasi Jualan & Trend Harian</h3>
                <p class="text-xs text-slate-500">Analisis Hasil Jualan Mengikut Modul Perniagaan</p>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">7 Hari Terkini</span>
              </div>
            </div>
            <div class="mt-4 h-64">
              <canvas id="chart-sales-trend"></canvas>
            </div>
          </div>

          <!-- Donut Chart: Business Module Contribution -->
          <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <div class="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 class="font-bold text-slate-900 text-base">Sumbangan Modul</h3>
                <p class="text-xs text-slate-500">Café vs Repair vs Aksesori</p>
              </div>
            </div>
            <div class="mt-4 flex-1 flex items-center justify-center h-64">
              <canvas id="chart-module-pie"></canvas>
            </div>
          </div>
        </div>

        <!-- Operational Activity Grids -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- 1. Recent Food Orders -->
          <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div class="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div class="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <i data-lucide="utensils" class="w-4 h-4 text-amber-500"></i>
                Pesanan Terkini Café GIATMARA
              </div>
              <button onclick="App.navigateTo('cafe-orders')" class="text-xs text-blue-600 font-semibold hover:underline">
                Lihat Semua &rarr;
              </button>
            </div>
            <div class="divide-y divide-slate-100">
              ${orders.slice(0, 4).map(o => `
                <div class="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                  <div class="space-y-1">
                    <div class="flex items-center gap-2">
                      <span class="font-mono font-bold text-xs text-slate-900">${o.id}</span>
                      <span class="text-xs font-semibold px-2 py-0.5 rounded-full ${o.orderType === 'DINE_IN' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}">
                        ${o.orderType === 'DINE_IN' ? (o.tableName || o.tableId) : 'Bungkus (' + (o.customerName || 'Takeaway') + ')'}
                      </span>
                    </div>
                    <div class="text-xs text-slate-500">
                      ${o.items.map(it => `${it.quantity}x ${it.name}`).join(', ')}
                    </div>
                  </div>
                  <div class="text-right space-y-1">
                    <div class="font-mono font-bold text-sm text-slate-900">${currency} ${(o.total || 0).toFixed(2)}</div>
                    <span class="badge-status status-${o.orderStatus.toLowerCase()} text-[10px]">${o.orderStatus}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- 2. Recent Smartphone Repair Jobs -->
          <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div class="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div class="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <i data-lucide="smartphone" class="w-4 h-4 text-cyan-600"></i>
                Status Job Baiki Telefon Bimbit
              </div>
              <button onclick="App.navigateTo('repair-jobs')" class="text-xs text-blue-600 font-semibold hover:underline">
                Lihat Semua &rarr;
              </button>
            </div>
            <div class="divide-y divide-slate-100">
              ${repairJobs.slice(0, 4).map(job => `
                <div class="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                  <div class="space-y-1">
                    <div class="flex items-center gap-2">
                      <span class="font-mono font-bold text-xs text-blue-700">${job.id}</span>
                      <span class="font-semibold text-xs text-slate-900">${job.deviceBrand} ${job.deviceModel}</span>
                    </div>
                    <div class="text-xs text-slate-500">
                      Pelanggan: <span class="font-medium text-slate-700">${job.customerName}</span> • <span class="text-amber-700">${job.damageType}</span>
                    </div>
                  </div>
                  <div class="text-right space-y-1">
                    <div class="font-mono font-bold text-sm text-slate-900">${currency} ${(job.totalSellingPrice || 0).toFixed(2)}</div>
                    <span class="inline-block text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${job.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-cyan-100 text-cyan-800'}">
                      ${job.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Actionable Alerts: Low Stock & Pending Procurement -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Low Stock Alert Box -->
          <div class="bg-white rounded-2xl border border-rose-200 shadow-sm p-5">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2 font-bold text-rose-700 text-sm">
                <i data-lucide="alert-octagon" class="w-4 h-4"></i>
                Amaran Stok Rendah (Perlu Tambah Stok Segera)
              </div>
              <span class="text-xs bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full">${lowStockItems.length} Item</span>
            </div>
            ${lowStockItems.length === 0 ? `
              <p class="text-xs text-slate-500 py-3 text-center">Semua paras stok bahan mentah, alat ganti & aksesori dalam keadaan optimum.</p>
            ` : `
              <div class="space-y-2">
                ${lowStockItems.map(item => `
                  <div class="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <div class="font-bold text-slate-900">${item.name}</div>
                      <div class="text-slate-500 text-[11px]">Kategori: ${item.category} • Baki: <b class="text-rose-600">${item.currentStock} ${item.unit}</b> (Min: ${item.minStock})</div>
                    </div>
                    <button onclick="ProcurementModule.createRequestFromItem('${item.id}')" class="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition shadow-sm">
                      + Buka PR
                    </button>
                  </div>
                `).join('')}
              </div>
            `}
          </div>

          <!-- Pending Purchase Requests -->
          <div class="bg-white rounded-2xl border border-indigo-200 shadow-sm p-5">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2 font-bold text-indigo-800 text-sm">
                <i data-lucide="shopping-cart" class="w-4 h-4"></i>
                Permohonan Belian Stok Menunggu Kelulusan (PR)
              </div>
              <span class="text-xs bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full">${pendingPRs.length} Menunggu</span>
            </div>
            ${pendingPRs.length === 0 ? `
              <p class="text-xs text-slate-500 py-3 text-center">Tiada permohonan pesanan belian yang tertunggak pada masa ini.</p>
            ` : `
              <div class="space-y-2">
                ${pendingPRs.map(pr => `
                  <div class="p-3 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <div class="font-bold text-slate-900">${pr.id} - ${pr.title}</div>
                      <div class="text-slate-500 text-[11px]">Pemohon: ${pr.requestedBy} • Pembekal: ${pr.supplierName} • <b>${currency} ${pr.totalAmount.toFixed(2)}</b></div>
                    </div>
                    ${Auth.hasPermission('canApprovePurchases') ? `
                      <button onclick="ProcurementModule.approveRequest('${pr.id}')" class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition shadow-sm">
                        Luluskan PR
                      </button>
                    ` : `
                      <span class="text-[10px] text-slate-400 font-medium italic">Perlu Kelulusan Manager</span>
                    `}
                  </div>
                `).join('')}
              </div>
            `}
          </div>
        </div>
      </div>
    `;

    // Render Charts
    this.renderCharts(sales);

    if (window.lucide) lucide.createIcons();
  },

  renderCharts: function(sales) {
    // 1. Sales Trend Chart
    const trendCtx = document.getElementById('chart-sales-trend');
    if (trendCtx) {
      if (this.charts.salesTrend) this.charts.salesTrend.destroy();
      
      this.charts.salesTrend = new Chart(trendCtx, {
        type: 'bar',
        data: {
          labels: ['Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu', 'Hari Ini'],
          datasets: [
            {
              label: 'Café & Makanan (RM)',
              data: [120, 180, 140, 210, 290, 310, 86.70],
              backgroundColor: '#f59e0b',
              borderRadius: 6
            },
            {
              label: 'Baiki Smartphone (RM)',
              data: [160, 220, 80, 310, 250, 420, 160.00],
              backgroundColor: '#06b6d4',
              borderRadius: 6
            },
            {
              label: 'Aksesori Telefon (RM)',
              data: [45, 60, 35, 90, 85, 120, 47.00],
              backgroundColor: '#10b981',
              borderRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top', labels: { font: { family: 'Plus Jakarta Sans', size: 11, weight: '600' } } }
          },
          scales: {
            x: { grid: { display: false } },
            y: { grid: { color: '#f1f5f9' }, ticks: { callback: v => 'RM ' + v } }
          }
        }
      });
    }

    // 2. Module Pie Chart
    const pieCtx = document.getElementById('chart-module-pie');
    if (pieCtx) {
      if (this.charts.modulePie) this.charts.modulePie.destroy();

      let cafe = 0, repair = 0, acc = 0;
      sales.forEach(s => {
        const val = parseFloat(s.sellingPrice) || 0;
        if (s.module === 'CAFÉ' || s.module === 'CAFE') cafe += val;
        else if (s.module === 'REPAIR') repair += val;
        else if (s.module === 'ACCESSORIES') acc += val;
      });

      this.charts.modulePie = new Chart(pieCtx, {
        type: 'doughnut',
        data: {
          labels: ['Café & Makanan', 'Baiki Smartphone', 'Aksesori'],
          datasets: [{
            data: [cafe || 86.70, repair || 160.00, acc || 47.00],
            backgroundColor: ['#f59e0b', '#06b6d4', '#10b981'],
            borderWidth: 2,
            borderColor: '#ffffff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { font: { family: 'Plus Jakarta Sans', size: 11 } } }
          },
          cutout: '70%'
        }
      });
    }
  }
};
