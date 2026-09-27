/**
 * TRIG GIATMARA KANGAR - Smartphone Repair Management Module
 * Comprehensive Repair Lifecycle, Multi-step Progress Tracker, Diagnosis & Quotation Engine,
 * Parts inventory integration, Tools Registry, and Customer CRM.
 */

const RepairModule = {
  currentFilter: 'ALL',
  searchQuery: '',

  render: function(subview = 'dashboard', params = {}) {
    const container = document.getElementById('main-content-view');
    if (!container) return;

    switch (subview) {
      case 'customers':
        this.renderCustomers(container);
        break;
      case 'jobs':
        this.renderRepairJobs(container, params);
        break;
      case 'tools':
        this.renderRepairTools(container);
        break;
      case 'diagnosis':
        this.renderDiagnosisView(container);
        break;
      case 'dashboard':
      default:
        this.renderRepairDashboard(container);
        break;
    }

    if (window.lucide) lucide.createIcons();
  },

  // 1. REPAIR DASHBOARD
  renderRepairDashboard: function(container) {
    const jobs = DB.get('repairJobs') || [];
    const tools = DB.get('tools') || [];
    const customers = DB.get('customers') || [];
    const settings = DB.get('settings') || {};
    const currency = settings.currencySymbol || 'RM';

    let totalRepairSales = 0;
    let totalRepairProfit = 0;
    let activeJobsCount = 0;
    let pendingApprovalCount = 0;

    jobs.forEach(j => {
      if (j.paymentStatus === 'PAID') {
        totalRepairSales += (parseFloat(j.totalSellingPrice) || 0);
        totalRepairProfit += (parseFloat(j.grossProfit) || 0);
      }
      if (!['COMPLETED', 'CANCELLED', 'UNREPAIRABLE'].includes(j.status)) {
        activeJobsCount++;
      }
      if (j.quotationStatus === 'PENDING_CUSTOMER_APPROVAL') {
        pendingApprovalCount++;
      }
    });

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Sub-Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold text-xl">
              <i data-lucide="smartphone"></i>
            </div>
            <div>
              <h1 class="text-xl font-bold text-slate-900">PENGURUSAN BAIKI SMARTPHONE GIATMARA</h1>
              <p class="text-xs text-slate-500">Bengkel TVET, Diagnosis Kerosakan, Alat Ganti & Perkhidmatan Pelanggan</p>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <button onclick="RepairModule.openNewJobModal()" class="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition">
              <i data-lucide="plus-circle" class="w-4 h-4"></i> Terima Job Baiki Baru
            </button>
            <button onclick="App.navigateTo('repair-tools')" class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition">
              <i data-lucide="wrench" class="w-4 h-4"></i> Senarai Alatan Bengkel
            </button>
          </div>
        </div>

        <!-- KPI 4-Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="card-kpi p-5 border-l-4 border-l-cyan-600">
            <span class="text-xs font-bold text-slate-500 uppercase">Jumlah Hasil Baiki</span>
            <div class="mt-2 text-2xl font-black font-mono text-slate-900">${currency} ${totalRepairSales.toFixed(2)}</div>
            <div class="mt-1 text-[11px] text-slate-500">Alat ganti & upah buruh</div>
          </div>

          <div class="card-kpi p-5 border-l-4 border-l-emerald-600">
            <span class="text-xs font-bold text-slate-500 uppercase">Untung Kasar Servis</span>
            <div class="mt-2 text-2xl font-black font-mono text-emerald-600">${currency} ${totalRepairProfit.toFixed(2)}</div>
            <div class="mt-1 text-[11px] text-slate-500">Margin: ${totalRepairSales > 0 ? ((totalRepairProfit/totalRepairSales)*100).toFixed(1) : 0}%</div>
          </div>

          <div class="card-kpi p-5 border-l-4 border-l-amber-500">
            <span class="text-xs font-bold text-slate-500 uppercase">Job Baiki Aktif</span>
            <div class="mt-2 text-2xl font-black font-mono text-amber-600">${activeJobsCount} Unit</div>
            <div class="mt-1 text-[11px] text-slate-500">Sedang di diagnosis / baiki</div>
          </div>

          <div class="card-kpi p-5 border-l-4 border-l-purple-500">
            <span class="text-xs font-bold text-slate-500 uppercase">Menunggu Kelulusan Pelanggan</span>
            <div class="mt-2 text-2xl font-black font-mono text-purple-600">${pendingApprovalCount} Job</div>
            <div class="mt-1 text-[11px] text-slate-500">Sebutharga dihantar</div>
          </div>
        </div>

        <!-- Submenu Navigation -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button onclick="App.navigateTo('repair-jobs')" class="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 text-center transition group shadow-sm">
            <div class="w-10 h-10 rounded-lg bg-cyan-50 group-hover:bg-cyan-100 text-cyan-600 flex items-center justify-center">
              <i data-lucide="cpu" class="w-5 h-5"></i>
            </div>
            <span class="text-xs font-bold text-slate-800">Senarai Job Baiki</span>
          </button>

          <button onclick="App.navigateTo('repair-customers')" class="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 text-center transition group shadow-sm">
            <div class="w-10 h-10 rounded-lg bg-blue-50 group-hover:bg-blue-100 text-blue-600 flex items-center justify-center">
              <i data-lucide="users" class="w-5 h-5"></i>
            </div>
            <span class="text-xs font-bold text-slate-800">Pengurusan Pelanggan</span>
          </button>

          <button onclick="App.navigateTo('repair-tools')" class="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 text-center transition group shadow-sm">
            <div class="w-10 h-10 rounded-lg bg-amber-50 group-hover:bg-amber-100 text-amber-600 flex items-center justify-center">
              <i data-lucide="wrench" class="w-5 h-5"></i>
            </div>
            <span class="text-xs font-bold text-slate-800">Alatan Bengkel</span>
          </button>

          <button onclick="App.navigateTo('pos-accessories')" class="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 text-center transition group shadow-sm">
            <div class="w-10 h-10 rounded-lg bg-emerald-50 group-hover:bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <i data-lucide="shopping-bag" class="w-5 h-5"></i>
            </div>
            <span class="text-xs font-bold text-slate-800">POS Jualan Aksesori</span>
          </button>
        </div>

        <!-- Active Repair Jobs List -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div class="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 class="font-bold text-slate-900 text-sm">Status Aliran Kerja Baiki Telefon Terkini</h3>
            <button onclick="App.navigateTo('repair-jobs')" class="text-xs text-blue-600 font-semibold hover:underline">Semua Job &rarr;</button>
          </div>
          <div class="divide-y divide-slate-100 mt-2">
            ${jobs.map(job => `
              <div class="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <span class="font-mono font-bold text-xs text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">${job.id}</span>
                    <span class="font-bold text-slate-900 text-sm">${job.deviceBrand} ${job.deviceModel}</span>
                    <span class="text-xs text-slate-500">(${job.deviceColour})</span>
                  </div>
                  <div class="text-xs text-slate-600">
                    Pelanggan: <b class="text-slate-800">${job.customerName}</b> (${job.customerPhone}) • Kerosakan: <span class="text-amber-700 font-semibold">${job.damageType}</span>
                  </div>
                  <div class="text-[11px] text-slate-400">
                    Juruteknik: ${job.technician} • Tarikh Terima: ${job.dateReceived}
                  </div>
                </div>

                <div class="flex flex-col md:items-end gap-2">
                  <div class="flex items-center gap-2">
                    <span class="font-mono font-black text-slate-900 text-sm">${currency} ${(job.totalSellingPrice || 0).toFixed(2)}</span>
                    <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${job.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-cyan-100 text-cyan-800'}">
                      ${job.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div class="flex items-center gap-1.5">
                    <button onclick="RepairModule.viewJobDetail('${job.id}')" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition flex items-center gap-1">
                      <i data-lucide="eye" class="w-3.5 h-3.5"></i> Perincian & Status
                    </button>
                    ${job.paymentStatus === 'PAID' ? `
                      <button onclick="ReceiptEngine.preview(DB.get('repairJobs').find(x => x.id === '${job.id}'), '80mm')" class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1">
                        <i data-lucide="receipt" class="w-3.5 h-3.5"></i> Resit
                      </button>
                    ` : `
                      <button onclick="RepairModule.openPaymentModal('${job.id}')" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1">
                        <i data-lucide="credit-card" class="w-3.5 h-3.5"></i> Bayaran
                      </button>
                    `}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },

  // 2. REPAIR JOBS MASTER LIST & PROGRESS TRACKER
  renderRepairJobs: function(container, params = {}) {
    const jobs = DB.get('repairJobs') || [];
    const settings = DB.get('settings') || {};
    const currency = settings.currencySymbol || 'RM';

    if (params.action === 'new') {
      setTimeout(() => this.openNewJobModal(), 100);
    }

    const statuses = ['ALL', 'RECEIVED', 'DIAGNOSIS', 'QUOTATION', 'REPAIRING', 'TESTING', 'READY_FOR_COLLECTION', 'COMPLETED'];

    let filteredJobs = jobs;
    if (this.currentFilter !== 'ALL') {
      filteredJobs = filteredJobs.filter(j => j.status === this.currentFilter);
    }
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      filteredJobs = filteredJobs.filter(j => j.id.toLowerCase().includes(q) || j.customerName.toLowerCase().includes(q) || j.deviceModel.toLowerCase().includes(q) || j.customerPhone.includes(q));
    }

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <div class="flex items-center gap-2 text-xs text-slate-500 font-semibold mb-1">
              <a href="javascript:void(0)" onclick="App.navigateTo('repair-dashboard')" class="hover:underline">Baiki Smartphone</a> &rarr; <span>Senarai Job</span>
            </div>
            <h1 class="text-xl font-bold text-slate-900">Senarai Job Baiki Telefon Bimbit</h1>
            <p class="text-xs text-slate-500">Pantau proses dari penerimaan, sebutharga, penukaran alat ganti hingga serahan.</p>
          </div>
          <button onclick="RepairModule.openNewJobModal()" class="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition">
            <i data-lucide="plus-circle" class="w-4 h-4"></i> Terima Job Baru
          </button>
        </div>

        <!-- Filter & Search Bar -->
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            ${statuses.map(st => `
              <button onclick="RepairModule.filterStatus('${st}')" class="px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${this.currentFilter === st ? 'bg-cyan-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}">
                ${st.replace(/_/g, ' ')}
              </button>
            `).join('')}
          </div>

          <div class="relative w-full md:w-72">
            <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3 top-3"></i>
            <input type="text" value="${this.searchQuery}" oninput="RepairModule.searchJobs(this.value)" placeholder="Cari Job ID, Pelanggan, Telefon..." class="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500">
          </div>
        </div>

        <!-- Jobs Table -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th class="p-4">Job ID & Tarikh</th>
                  <th class="p-4">Pelanggan & Tel</th>
                  <th class="p-4">Model & Kerosakan</th>
                  <th class="p-4 text-right">Kos / Jual</th>
                  <th class="p-4 text-right">Untung Kasar</th>
                  <th class="p-4 text-center">Bayaran</th>
                  <th class="p-4 text-center">Status Job</th>
                  <th class="p-4 text-center">Tindakan</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${filteredJobs.map(j => `
                  <tr class="hover:bg-slate-50 transition">
                    <td class="p-4">
                      <div class="font-mono font-bold text-cyan-700">${j.id}</div>
                      <div class="text-[10px] text-slate-400 mt-0.5">${j.dateReceived}</div>
                    </td>
                    <td class="p-4">
                      <div class="font-bold text-slate-900">${j.customerName}</div>
                      <div class="text-[11px] text-slate-500">${j.customerPhone}</div>
                    </td>
                    <td class="p-4">
                      <div class="font-bold text-slate-800">${j.deviceBrand} ${j.deviceModel}</div>
                      <div class="text-[11px] text-amber-700 font-semibold">${j.damageType}</div>
                    </td>
                    <td class="p-4 text-right">
                      <div class="font-mono font-bold text-slate-900">${currency} ${(j.totalSellingPrice || 0).toFixed(2)}</div>
                      <div class="text-[10px] text-slate-400">Kos: ${currency} ${(j.totalCost || 0).toFixed(2)}</div>
                    </td>
                    <td class="p-4 text-right font-mono font-bold text-emerald-600">
                      ${currency} ${(j.grossProfit || 0).toFixed(2)}
                    </td>
                    <td class="p-4 text-center">
                      <span class="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${j.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
                        ${j.paymentStatus || 'PENDING'}
                      </span>
                    </td>
                    <td class="p-4 text-center">
                      <span class="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${j.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-cyan-100 text-cyan-800'}">
                        ${j.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td class="p-4 text-center">
                      <div class="inline-flex items-center gap-1.5">
                        <button onclick="RepairModule.viewJobDetail('${j.id}')" class="p-1.5 text-cyan-700 hover:bg-cyan-50 rounded-lg transition" title="Lihat & Kemaskini">
                          <i data-lucide="sliders" class="w-4 h-4"></i>
                        </button>
                        ${j.paymentStatus === 'PAID' ? `
                          <button onclick="ReceiptEngine.preview(DB.get('repairJobs').find(x => x.id === '${j.id}'), '80mm')" class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Cetak Resit">
                            <i data-lucide="receipt" class="w-4 h-4"></i>
                          </button>
                        ` : ''}
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  filterStatus: function(st) {
    this.currentFilter = st;
    this.render('jobs');
  },

  searchJobs: function(q) {
    this.searchQuery = q;
    this.render('jobs');
  },

  // 3. NEW REPAIR JOB MODAL (Device Condition, Customer, Initial Issue)
  openNewJobModal: function() {
    const customers = DB.get('customers') || [];
    const users = DB.get('users') || [];
    const repairStaff = users.filter(u => u.role === 'REPAIR_STAFF' || u.role === 'SUPER_ADMIN');

    let modal = document.getElementById('repair-new-job-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'repair-new-job-modal';
      modal.className = 'fixed inset-0 z-50 flex items-center justify-center modal-backdrop p-4 overflow-y-auto';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 modal-animate-in max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between pb-4 border-b border-slate-200">
          <div class="flex items-center gap-2">
            <div class="w-9 h-9 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
              <i data-lucide="smartphone" class="w-5 h-5"></i>
            </div>
            <div>
              <h3 class="font-bold text-slate-900 text-base">Daftar Penerimaan Telefon Bimbit (Job Baru)</h3>
              <p class="text-xs text-slate-500">TRIG GIATMARA Kangar Smartphone Service Intake</p>
            </div>
          </div>
          <button onclick="document.getElementById('repair-new-job-modal').classList.add('hidden')" class="text-slate-400 hover:text-slate-700">
            <i data-lucide="x"></i>
          </button>
        </div>

        <form onsubmit="RepairModule.saveNewJob(event)" class="space-y-4 mt-4 text-xs">
          <!-- Section 1: Customer Details -->
          <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div class="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
              <i data-lucide="user" class="w-4 h-4 text-cyan-600"></i> Maklumat Pelanggan
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-slate-700 mb-1">Nama Penuh Pelanggan *</label>
                <input type="text" name="customerName" required placeholder="cth: Ahmad Farhan" class="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500">
              </div>
              <div>
                <label class="block font-bold text-slate-700 mb-1">No Telefon Pelanggan (Wajib) *</label>
                <input type="text" name="customerPhone" required placeholder="cth: 019-4455667" class="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 font-semibold">
              </div>
            </div>
          </div>

          <!-- Section 2: Device Details -->
          <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div class="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
              <i data-lucide="tablet" class="w-4 h-4 text-cyan-600"></i> Maklumat Peranti Telefon
            </div>
            <div class="grid grid-cols-3 gap-3">
              <div>
                <label class="block font-bold text-slate-700 mb-1">Jenama (Brand) *</label>
                <select name="deviceBrand" required class="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-800">
                  <option value="Samsung">Samsung</option>
                  <option value="Apple">Apple iPhone</option>
                  <option value="Xiaomi">Xiaomi / Redmi</option>
                  <option value="Oppo">Oppo</option>
                  <option value="Vivo">Vivo</option>
                  <option value="Realme">Realme</option>
                  <option value="Huawei">Huawei / Honor</option>
                  <option value="Infinix">Infinix / Tecno</option>
                  <option value="Lain-lain">Lain-lain</option>
                </select>
              </div>
              <div>
                <label class="block font-bold text-slate-700 mb-1">Model Telefon *</label>
                <input type="text" name="deviceModel" required placeholder="cth: Galaxy A55 5G" class="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-semibold">
              </div>
              <div>
                <label class="block font-bold text-slate-700 mb-1">Warna Peranti</label>
                <input type="text" name="deviceColour" placeholder="cth: Iceblue" class="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl">
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-slate-700 mb-1">No Siri / IMEI</label>
                <input type="text" name="serialNumber" placeholder="cth: 358921098712345" class="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono">
              </div>
              <div>
                <label class="block font-bold text-slate-700 mb-1">Juruteknik Bertanggungjawab</label>
                <select name="technician" class="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-semibold">
                  ${repairStaff.map(u => `
                    <option value="${u.name}">${u.name}</option>
                  `).join('')}
                </select>
              </div>
            </div>
          </div>

          <!-- Section 3: Before Repair Condition Checklist -->
          <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div class="font-bold text-slate-800 flex items-center justify-between text-xs">
              <span class="flex items-center gap-1.5"><i data-lucide="check-square" class="w-4 h-4 text-cyan-600"></i> Keadaan Fizikal Semasa Terima (Before Repair Condition)</span>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <label class="flex items-center gap-1.5 p-2 bg-white border border-slate-200 rounded-lg">
                <input type="checkbox" name="cond_screen" checked class="text-cyan-600"> Skrin Berfungsi
              </label>
              <label class="flex items-center gap-1.5 p-2 bg-white border border-slate-200 rounded-lg">
                <input type="checkbox" name="cond_body" checked class="text-cyan-600"> Body Elok
              </label>
              <label class="flex items-center gap-1.5 p-2 bg-white border border-slate-200 rounded-lg">
                <input type="checkbox" name="cond_cam" checked class="text-cyan-600"> Kamera Normal
              </label>
              <label class="flex items-center gap-1.5 p-2 bg-white border border-slate-200 rounded-lg">
                <input type="checkbox" name="cond_btn" checked class="text-cyan-600"> Butang Berfungsi
              </label>
              <label class="flex items-center gap-1.5 p-2 bg-white border border-slate-200 rounded-lg">
                <input type="checkbox" name="cond_port" checked class="text-cyan-600"> Port Cas Masuk
              </label>
              <label class="flex items-center gap-1.5 p-2 bg-white border border-slate-200 rounded-lg">
                <input type="checkbox" name="cond_spk" checked class="text-cyan-600"> Speaker Berbunyi
              </label>
              <label class="flex items-center gap-1.5 p-2 bg-white border border-slate-200 rounded-lg">
                <input type="checkbox" name="cond_mic" checked class="text-cyan-600"> Mikrofon Jelas
              </label>
              <label class="flex items-center gap-1.5 p-2 bg-white border border-slate-200 rounded-lg">
                <input type="checkbox" name="cond_water" class="text-rose-600"> Masuk Air
              </label>
            </div>
          </div>

          <!-- Section 4: Problem Reported & Damage Type -->
          <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div class="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
              <i data-lucide="alert-circle" class="w-4 h-4 text-cyan-600"></i> Masalah Dihadapi & Kategori
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-slate-700 mb-1">Kategori Kerosakan (Damage Type) *</label>
                <select name="damageType" required class="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold text-amber-900">
                  <option value="Broken Screen">Broken Screen (Skrin Pecah/Rosak)</option>
                  <option value="Battery Problem">Battery Problem (Bateri Kembung/Cepat Habis)</option>
                  <option value="Charging Problem">Charging Problem (Tidak Boleh Cas)</option>
                  <option value="Camera Problem">Camera Problem (Kamera Kabur/Rosak)</option>
                  <option value="Speaker Problem">Speaker / Audio Problem</option>
                  <option value="Software Problem">Software Problem (Bootloop / Hang)</option>
                  <option value="Water Damage">Water Damage (Masuk Air)</option>
                  <option value="Motherboard Problem">Motherboard Problem (IC/Short circuit)</option>
                  <option value="Other">Lain-lain Kerosakan</option>
                </select>
              </div>
              <div>
                <label class="block font-bold text-slate-700 mb-1">Anggaran Siap (Est Completion)</label>
                <input type="date" name="estCompletionDate" value="${new Date(Date.now() + 86400000).toISOString().split('T')[0]}" class="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl">
              </div>
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">Masalah Yang Dinyatakan Pelanggan *</label>
              <textarea name="problemReported" required rows="2" placeholder="cth: Skrin pecah terjatuh dari motor, lampu menyala tapi skrin gelap..." class="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500"></textarea>
            </div>
          </div>

          <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button type="button" onclick="document.getElementById('repair-new-job-modal').classList.add('hidden')" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition">
              Batal
            </button>
            <button type="submit" class="px-5 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl shadow-sm transition">
              Daftar Job Baiki
            </button>
          </div>
        </form>
      </div>
    `;

    modal.classList.remove('hidden');
    if (window.lucide) lucide.createIcons();
  },

  saveNewJob: function(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const jobs = DB.get('repairJobs') || [];
    const customers = DB.get('customers') || [];

    const custPhone = formData.get('customerPhone');
    const custName = formData.get('customerName');

    // Auto-create customer if not existing
    let cust = customers.find(c => c.phone === custPhone);
    if (!cust) {
      cust = {
        id: DB.generateId('CUST'),
        name: custName,
        phone: custPhone,
        email: '',
        address: '',
        dateRegistered: new Date().toISOString().split('T')[0],
        totalRepairs: 1,
        totalSpending: 0,
        outstandingPayment: 0
      };
      customers.push(cust);
    } else {
      cust.totalRepairs = (cust.totalRepairs || 0) + 1;
    }
    DB.save('customers', customers);

    const newJobId = DB.generateId('REP');
    const nowStr = new Date().toLocaleString('en-MY', { hour12: false });

    const newJob = {
      id: newJobId,
      customerId: cust.id,
      customerName: custName,
      customerPhone: custPhone,
      deviceBrand: formData.get('deviceBrand'),
      deviceModel: formData.get('deviceModel'),
      serialNumber: formData.get('serialNumber') || 'N/A',
      deviceColour: formData.get('deviceColour') || 'Standard',
      deviceCondition: {
        screen: formData.get('cond_screen') ? 'Normal' : 'Rosak/Pecah',
        body: formData.get('cond_body') ? 'Elok' : 'Calar/Kesan Jatuh',
        camera: formData.get('cond_cam') ? 'Normal' : 'Rosak',
        buttons: formData.get('cond_btn') ? 'Normal' : 'Rosak',
        chargingPort: formData.get('cond_port') ? 'Normal' : 'Ketat/Rosak',
        speaker: formData.get('cond_spk') ? 'Normal' : 'Perlah/Pecah',
        microphone: formData.get('cond_mic') ? 'Normal' : 'Tiada Suara',
        otherDamage: formData.get('cond_water') ? 'Kesan Masuk Air' : 'Tiada'
      },
      problemReported: formData.get('problemReported'),
      diagnosis: 'Menunggu pemeriksaan lanjutan juruteknik.',
      damageType: formData.get('damageType'),
      notes: '',
      dateReceived: nowStr,
      estCompletionDate: formData.get('estCompletionDate'),
      technician: formData.get('technician'),
      partsUsed: [],
      partsCost: 0.00,
      partsSelling: 0.00,
      labourCost: 30.00, // Standard base labour
      totalCost: 30.00,
      totalSellingPrice: 50.00,
      grossProfit: 20.00,
      status: 'RECEIVED', // Initial state
      quotationStatus: 'DRAFT',
      paymentStatus: 'PENDING',
      paymentMethod: null,
      paymentRef: null,
      paidAt: null,
      receiptNumber: null,
      warrantyExpiry: null
    };

    jobs.unshift(newJob);
    DB.save('repairJobs', jobs);

    DB.logAudit('REPAIR_STAFF', 'Daftar Job Baiki Baru', 'REPAIR', `Job ${newJobId} bagi peranti ${newJob.deviceBrand} ${newJob.deviceModel} (Pelanggan: ${custName}) didaftarkan.`);
    DB.addNotification('Job Baiki Baru Didaftarkan', `Peranti ${newJob.deviceBrand} ${newJob.deviceModel} diterima dari ${custName}.`, 'INFO', 'REPAIR');

    document.getElementById('repair-new-job-modal').classList.add('hidden');
    App.showToast(`Job ${newJobId} berjaya didaftarkan!`, 'success');
    this.render('jobs');
    this.viewJobDetail(newJobId);
  },

  // 4. DETAILED JOB VIEW, DIAGNOSIS, SPARE PARTS DEDUCTION & QUOTATION
  viewJobDetail: function(jobId) {
    const jobs = DB.get('repairJobs') || [];
    const inventory = DB.get('inventory') || [];
    const settings = DB.get('settings') || {};
    const currency = settings.currencySymbol || 'RM';

    const job = jobs.find(j => j.id === jobId);
    if (!job) return;

    // Filter spare parts inventory
    const sparePartsList = inventory.filter(i => i.category === 'Smartphone Spare Parts');

    const flowSteps = [
      { key: 'RECEIVED', label: '1. Diterima' },
      { key: 'DIAGNOSIS', label: '2. Diagnosis' },
      { key: 'QUOTATION', label: '3. Sebutharga' },
      { key: 'CUSTOMER_APPROVAL', label: '4. Kelulusan' },
      { key: 'REPAIRING', label: '5. Dibaiki' },
      { key: 'TESTING', label: '6. Pengujian' },
      { key: 'READY_FOR_COLLECTION', label: '7. Sedia Ambil' },
      { key: 'COMPLETED', label: '8. Selesai' }
    ];

    const currentStepIndex = flowSteps.findIndex(s => s.key === job.status);

    let modal = document.getElementById('repair-job-detail-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'repair-job-detail-modal';
      modal.className = 'fixed inset-0 z-50 flex items-center justify-center modal-backdrop p-4 overflow-y-auto';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-6 modal-animate-in max-h-[95vh] overflow-y-auto">
        <!-- Header -->
        <div class="flex items-center justify-between pb-4 border-b border-slate-200">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
              <i data-lucide="cpu"></i>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="font-mono font-black text-slate-900 text-lg">${job.id}</span>
                <span class="badge-status status-confirmed text-[10px]">${job.status.replace(/_/g, ' ')}</span>
              </div>
              <p class="text-xs text-slate-500">${job.deviceBrand} ${job.deviceModel} • Pelanggan: <b>${job.customerName}</b> (${job.customerPhone})</p>
            </div>
          </div>
          <button onclick="document.getElementById('repair-job-detail-modal').classList.add('hidden')" class="text-slate-400 hover:text-slate-700">
            <i data-lucide="x"></i>
          </button>
        </div>

        <!-- Visual Progress Tracker -->
        <div class="my-6 px-2">
          <div class="flex items-center justify-between">
            ${flowSteps.map((step, idx) => {
              const isPassed = idx <= currentStepIndex;
              const isActive = idx === currentStepIndex;
              return `
                <div class="timeline-step ${isPassed ? 'completed' : ''} ${isActive ? 'active' : ''}">
                  <div class="timeline-node">${idx + 1}</div>
                  <span class="text-[10px] font-bold mt-1.5 text-center ${isActive ? 'text-cyan-700' : (isPassed ? 'text-slate-800' : 'text-slate-400')}">${step.label}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- 2-Column Details Workspace -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
          <!-- Left Column (Diagnosis & Quotation) -->
          <div class="lg:col-span-7 space-y-4">
            <!-- Problem & Diagnosis Box -->
            <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div class="font-bold text-slate-900 flex items-center justify-between">
                <span class="flex items-center gap-1.5"><i data-lucide="clipboard-check" class="w-4 h-4 text-cyan-600"></i> Diagnosis & Kerosakan</span>
                <span class="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">${job.damageType}</span>
              </div>
              <div>
                <span class="text-slate-400 font-bold uppercase text-[10px]">Aduan Pelanggan:</span>
                <p class="text-slate-800 italic mt-0.5">"${job.problemReported}"</p>
              </div>

              <div>
                <label class="block font-bold text-slate-700 mb-1">Catatan Diagnosis Juruteknik:</label>
                <textarea id="job-diag-text" rows="2" class="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500">${job.diagnosis}</textarea>
              </div>
            </div>

            <!-- Spare Parts Used List & Picker -->
            <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div class="flex items-center justify-between font-bold text-slate-900">
                <span class="flex items-center gap-1.5"><i data-lucide="box" class="w-4 h-4 text-cyan-600"></i> Alat Ganti Digunakan (Spare Parts)</span>
                <span class="text-[11px] font-mono text-cyan-700 font-bold">${currency} ${(job.partsSelling || 0).toFixed(2)}</span>
              </div>

              <div class="space-y-2">
                ${(job.partsUsed && job.partsUsed.length > 0) ? job.partsUsed.map((p, pIdx) => `
                  <div class="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                    <div>
                      <div class="font-bold text-slate-900">${p.name}</div>
                      <div class="text-[10px] text-slate-500">Kos: ${currency} ${p.costPrice.toFixed(2)} | Jual: ${currency} ${p.sellingPrice.toFixed(2)} (x${p.quantity})</div>
                    </div>
                    <button onclick="RepairModule.removePartFromJob('${job.id}', ${pIdx})" class="text-rose-500 hover:text-rose-700 p-1">
                      <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                  </div>
                `).join('') : `
                  <div class="py-3 text-center text-slate-400 text-xs italic">Belum ada alat ganti ditambah.</div>
                `}
              </div>

              <!-- Add Spare Part Dropdown -->
              <div class="pt-2 border-t border-slate-200 flex items-center gap-2">
                <select id="part-picker-select" class="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium">
                  <option value="">-- Pilih Alat Ganti dari Inventori --</option>
                  ${sparePartsList.map(sp => `
                    <option value="${sp.id}">${sp.name} (Baki: ${sp.currentStock} ${sp.unit}) - Jual: ${currency} ${sp.sellingPrice.toFixed(2)}</option>
                  `).join('')}
                </select>
                <button onclick="RepairModule.addPartToJob('${job.id}')" class="px-3 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl transition flex items-center gap-1">
                  <i data-lucide="plus" class="w-4 h-4"></i> Tambah
                </button>
              </div>
            </div>

            <!-- Labour Charges & Financial Summary -->
            <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div class="font-bold text-slate-900 text-xs">Kos Upah & Sebutharga (Quotation)</div>
              <div class="flex items-center justify-between">
                <span>Upah Baiki / Labour (RM):</span>
                <input type="number" id="job-labour-input" step="5" min="0" value="${job.labourCost || 30}" oninput="RepairModule.recalcJobFinancials('${job.id}')" class="w-24 px-2 py-1 bg-white border border-slate-300 rounded-lg text-right font-mono font-bold">
              </div>
              <div class="flex items-center justify-between text-slate-600">
                <span>Jumlah Kos Keseluruhan (Parts + Labour):</span>
                <span class="font-mono font-bold text-slate-900">${currency} ${(job.totalCost || 0).toFixed(2)}</span>
              </div>
              <div class="flex items-center justify-between font-bold text-slate-900 border-t border-slate-200 pt-2 text-sm">
                <span>Harga Sebutharga (Selling Price):</span>
                <span class="font-mono text-cyan-700 font-black">${currency} ${(job.totalSellingPrice || 0).toFixed(2)}</span>
              </div>
              <div class="flex items-center justify-between text-emerald-700 font-semibold text-xs">
                <span>Anggaran Untung Kasar (Gross Profit):</span>
                <span class="font-mono font-bold">${currency} ${(job.grossProfit || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <!-- Right Column (Customer Approval, Status Changer & Payment) -->
          <div class="lg:col-span-5 space-y-4">
            <!-- Quotation Approval Box -->
            <div class="p-4 rounded-xl border ${job.quotationStatus === 'APPROVED' ? 'bg-emerald-50 border-emerald-200' : (job.quotationStatus === 'REJECTED' ? 'bg-rose-50 border-rose-200' : 'bg-amber-50 border-amber-200')} space-y-3">
              <div class="flex items-center justify-between font-bold">
                <span class="text-slate-900 text-xs">Status Sebutharga (Quotation)</span>
                <span class="badge-status ${job.quotationStatus === 'APPROVED' ? 'status-ready' : 'status-preparing'} text-[10px]">${job.quotationStatus}</span>
              </div>
              <p class="text-[11px] text-slate-600">Pelanggan perlu meluluskan sebutharga sebelum proses baikpulih fizikal dijalankan.</p>
              
              <div class="grid grid-cols-2 gap-2">
                <button onclick="RepairModule.approveQuotation('${job.id}', 'APPROVED')" class="py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-1 shadow-sm">
                  <i data-lucide="check" class="w-3.5 h-3.5"></i> LULUSKAN (APPROVE)
                </button>
                <button onclick="RepairModule.approveQuotation('${job.id}', 'REJECTED')" class="py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-1 shadow-sm">
                  <i data-lucide="x" class="w-3.5 h-3.5"></i> TOLAK (REJECT)
                </button>
              </div>
            </div>

            <!-- Advance Status Transition -->
            <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div class="font-bold text-slate-900 text-xs">Tukar Status Kerja Semasa</div>
              <select id="job-status-select" onchange="RepairModule.changeJobStatus('${job.id}', this.value)" class="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-cyan-800">
                ${flowSteps.map(st => `
                  <option value="${st.key}" ${job.status === st.key ? 'selected' : ''}>${st.label}</option>
                `).join('')}
                <option value="CANCELLED" ${job.status === 'CANCELLED' ? 'selected' : ''}>Dibatalkan (Cancelled)</option>
                <option value="UNREPAIRABLE" ${job.status === 'UNREPAIRABLE' ? 'selected' : ''}>Tidak Boleh Dibaiki (Unrepairable)</option>
              </select>
            </div>

            <!-- Payment & Receipt Action Card -->
            <div class="p-4 bg-slate-900 text-white rounded-xl space-y-3 shadow-md">
              <div class="flex items-center justify-between font-bold">
                <span class="text-xs">Status Pembayaran</span>
                <span class="px-2 py-0.5 rounded text-[10px] ${job.paymentStatus === 'PAID' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-amber-400 text-slate-950 font-bold'}">
                  ${job.paymentStatus || 'PENDING'}
                </span>
              </div>

              <div class="font-mono text-xl font-black text-cyan-400">
                ${currency} ${(job.totalSellingPrice || 0).toFixed(2)}
              </div>

              ${job.paymentStatus === 'PAID' ? `
                <div class="text-[11px] text-slate-300 space-y-1">
                  <div>Kaedah: <b>${job.paymentMethod}</b></div>
                  <div>No Resit: <b>${job.receiptNumber}</b></div>
                  <div>Jaminan: <b>${job.warrantyExpiry || '30 Hari'}</b></div>
                </div>
                <button onclick="ReceiptEngine.preview(DB.get('repairJobs').find(x => x.id === '${job.id}'), '80mm')" class="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-sm">
                  <i data-lucide="printer" class="w-4 h-4"></i> Cetak Resit & Jaminan
                </button>
              ` : `
                <button onclick="RepairModule.openPaymentModal('${job.id}')" class="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-sm">
                  <i data-lucide="credit-card" class="w-4 h-4"></i> Terima Bayaran Sekarang
                </button>
              `}
            </div>
          </div>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    if (window.lucide) lucide.createIcons();
  },

  addPartToJob: function(jobId) {
    const picker = document.getElementById('part-picker-select');
    const itemId = picker?.value;
    if (!itemId) {
      App.showToast('Sila pilih alat ganti dari senarai!', 'warning');
      return;
    }

    const inventory = DB.get('inventory') || [];
    const jobs = DB.get('repairJobs') || [];
    const item = inventory.find(i => i.id === itemId);
    const job = jobs.find(j => j.id === jobId);

    if (!item || !job) return;

    if (item.currentStock <= 0) {
      App.showToast('Alat ganti ini kehabisan stok!', 'error');
      return;
    }

    // Deduct 1 unit from inventory central ledger
    DB.deductInventory(item.id, 1, job.id, 'USED_FOR_REPAIR', `Digunakan untuk Job ${job.id} (${job.deviceBrand} ${job.deviceModel})`);

    // Add to job parts
    if (!job.partsUsed) job.partsUsed = [];
    job.partsUsed.push({
      invId: item.id,
      sku: item.sku,
      name: item.name,
      costPrice: item.costPrice,
      sellingPrice: item.sellingPrice,
      quantity: 1
    });

    this.recalculateJobTotals(job);
    DB.save('repairJobs', jobs);

    App.showToast(`Alat ganti ${item.name} ditambah dan stok ditolak.`, 'success');
    this.viewJobDetail(jobId);
  },

  removePartFromJob: function(jobId, partIndex) {
    const jobs = DB.get('repairJobs') || [];
    const job = jobs.find(j => j.id === jobId);
    if (!job || !job.partsUsed[partIndex]) return;

    const removedPart = job.partsUsed[partIndex];
    // Return stock back to inventory
    DB.addInventoryStock(removedPart.invId, 1, job.id, `Dipulangkan semula dari Job ${job.id}`);

    job.partsUsed.splice(partIndex, 1);
    this.recalculateJobTotals(job);
    DB.save('repairJobs', jobs);

    App.showToast('Alat ganti dikeluarkan dan dikembalikan ke stok.', 'info');
    this.viewJobDetail(jobId);
  },

  recalculateJobTotals: function(job) {
    let partsCost = 0;
    let partsSell = 0;
    (job.partsUsed || []).forEach(p => {
      partsCost += (p.costPrice * p.quantity);
      partsSell += (p.sellingPrice * p.quantity);
    });

    const labour = parseFloat(job.labourCost) || 0;
    job.partsCost = partsCost;
    job.partsSelling = partsSell;
    job.totalCost = partsCost + labour;
    job.totalSellingPrice = partsSell + labour;
    job.grossProfit = job.totalSellingPrice - job.totalCost;
  },

  recalcJobFinancials: function(jobId) {
    const jobs = DB.get('repairJobs') || [];
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;

    const labour = parseFloat(document.getElementById('job-labour-input')?.value) || 0;
    job.labourCost = labour;
    this.recalculateJobTotals(job);
    DB.save('repairJobs', jobs);
    this.viewJobDetail(jobId);
  },

  approveQuotation: function(jobId, decision) {
    const jobs = DB.get('repairJobs') || [];
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;

    job.quotationStatus = decision;
    if (decision === 'APPROVED') {
      job.status = 'REPAIRING';
      App.showToast('Sebutharga DILULUSKAN oleh pelanggan! Status kini REPAIRING.', 'success');
    } else {
      job.status = 'CANCELLED';
      App.showToast('Sebutharga DITOLAK oleh pelanggan.', 'info');
    }

    DB.save('repairJobs', jobs);
    DB.logAudit('REPAIR_STAFF', 'Keputusan Sebutharga', 'REPAIR', `Sebutharga Job ${job.id} ${decision}.`);
    this.viewJobDetail(jobId);
  },

  changeJobStatus: function(jobId, newStatus) {
    const jobs = DB.get('repairJobs') || [];
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;

    job.status = newStatus;
    const diagEl = document.getElementById('job-diag-text');
    if (diagEl) job.diagnosis = diagEl.value;

    DB.save('repairJobs', jobs);
    DB.logAudit('REPAIR_STAFF', 'Kemaskini Status Job Baiki', 'REPAIR', `Status Job ${jobId} ditukar kepada ${newStatus}.`);
    App.showToast(`Status Job ${jobId} dikemaskini kepada ${newStatus}.`, 'success');
    this.viewJobDetail(jobId);
  },

  // 5. REPAIR PAYMENT MODAL & RECEIPT CREATION
  openPaymentModal: function(jobId) {
    const jobs = DB.get('repairJobs') || [];
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;

    const settings = DB.get('settings') || {};
    const currency = settings.currencySymbol || 'RM';
    const totalAmount = job.totalSellingPrice || 0;

    let modal = document.getElementById('repair-payment-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'repair-payment-modal';
      modal.className = 'fixed inset-0 z-50 flex items-center justify-center modal-backdrop p-4 overflow-y-auto';
      document.body.appendChild(modal);
    }

    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=DUITNOW-REP-${job.id}-RM${totalAmount.toFixed(2)}`;

    modal.innerHTML = `
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 modal-animate-in">
        <div class="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h3 class="font-black text-slate-900 text-base">Terima Bayaran Baiki Smartphone</h3>
            <p class="text-xs text-slate-500">${job.id} • ${job.deviceBrand} ${job.deviceModel}</p>
          </div>
          <button onclick="document.getElementById('repair-payment-modal').classList.add('hidden')" class="text-slate-400 hover:text-slate-700">
            <i data-lucide="x"></i>
          </button>
        </div>

        <div class="my-4 space-y-3 text-xs">
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div class="flex justify-between font-bold text-slate-800">
              <span>Pelanggan: ${job.customerName}</span>
              <span class="font-mono text-cyan-700 text-base">${currency} ${totalAmount.toFixed(2)}</span>
            </div>
            <div class="text-[11px] text-slate-500 mt-1">Kerosakan: ${job.damageType} • Alat Ganti: ${job.partsUsed?.length || 0} unit</div>
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1.5">Pilih Kaedah Pembayaran</label>
            <div class="grid grid-cols-2 gap-2">
              <label class="p-3 border border-slate-200 rounded-xl flex items-center gap-2 cursor-pointer has-[:checked]:border-cyan-600 has-[:checked]:bg-cyan-50">
                <input type="radio" name="repairPayMethod" value="QR_PAYMENT" checked class="text-cyan-600">
                <div>
                  <div class="font-bold text-slate-900">QR DuitNow</div>
                  <div class="text-[10px] text-slate-500">Scan & Bayar</div>
                </div>
              </label>

              <label class="p-3 border border-slate-200 rounded-xl flex items-center gap-2 cursor-pointer has-[:checked]:border-cyan-600 has-[:checked]:bg-cyan-50">
                <input type="radio" name="repairPayMethod" value="CASH" class="text-cyan-600">
                <div>
                  <div class="font-bold text-slate-900">Tunai (Cash)</div>
                  <div class="text-[10px] text-slate-500">Kaunter Bengkel</div>
                </div>
              </div>
            </div>
          </div>

          <div class="p-4 bg-white border border-slate-200 rounded-xl text-center">
            <div class="text-[11px] text-slate-500 mb-2">Imbas Kod DuitNow untuk Bayaran Servis Baiki:</div>
            <img src="${qrCodeUrl}" alt="QR DuitNow" class="w-36 h-36 mx-auto rounded-lg border border-slate-200">
            <div class="mt-2 font-mono font-bold text-slate-900 text-sm">JUMLAH: ${currency} ${totalAmount.toFixed(2)}</div>
          </div>
        </div>

        <div class="flex flex-col gap-2 pt-3 border-t border-slate-200">
          <button onclick="RepairModule.processRepairPayment('${job.id}')" class="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-2">
            <i data-lucide="check-circle" class="w-4 h-4"></i> SIMULATE PAYMENT SUCCESS (Selesai & Jana Resit)
          </button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    if (window.lucide) lucide.createIcons();
  },

  processRepairPayment: function(jobId) {
    const jobs = DB.get('repairJobs') || [];
    const sales = DB.get('sales') || [];
    const customers = DB.get('customers') || [];
    const currentUser = Auth.getCurrentUser() || { name: 'Juruwang' };
    const nowStr = new Date().toLocaleString('en-MY', { hour12: false });

    const job = jobs.find(j => j.id === jobId);
    if (!job) return;

    const receiptNum = DB.generateId('REP');
    const payMethod = document.querySelector('input[name="repairPayMethod"]:checked')?.value || 'QR_PAYMENT';

    // Calculate 30-day warranty expiry date
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 30);
    const expiryStr = expiry.toISOString().split('T')[0];

    job.status = 'COMPLETED';
    job.paymentStatus = 'PAID';
    job.paymentMethod = payMethod;
    job.paymentRef = 'DUITNOW-REP-' + Date.now().toString().slice(-5);
    job.paidAt = nowStr;
    job.receiptNumber = receiptNum;
    job.warrantyExpiry = expiryStr;

    DB.save('repairJobs', jobs);

    // Update Customer spending
    const cust = customers.find(c => c.id === job.customerId || c.phone === job.customerPhone);
    if (cust) {
      cust.totalSpending = (cust.totalSpending || 0) + (job.totalSellingPrice || 0);
      DB.save('customers', customers);
    }

    // Insert Unified Sales Entry
    const newSale = {
      id: DB.generateId('SAL'),
      module: 'REPAIR',
      referenceId: job.id,
      receiptNumber: receiptNum,
      customer: job.customerName,
      itemsSummary: `Servis Baiki ${job.deviceBrand} ${job.deviceModel} (${job.damageType})`,
      costPrice: job.totalCost,
      sellingPrice: job.totalSellingPrice,
      profit: job.grossProfit,
      paymentMethod: payMethod,
      paymentStatus: 'PAID',
      date: nowStr.split(' ')[0],
      time: nowStr.split(' ')[1] || '',
      cashier: currentUser.name
    };
    sales.unshift(newSale);
    DB.save('sales', sales);

    DB.logAudit(currentUser.role, 'Terima Bayaran Repair', 'FINANCE', `Bayaran RM ${job.totalSellingPrice.toFixed(2)} diterima untuk Job ${job.id}.`);
    App.showToast(`Bayaran Job ${job.id} berjaya diterima!`, 'success');

    document.getElementById('repair-payment-modal')?.classList.add('hidden');
    document.getElementById('repair-job-detail-modal')?.classList.add('hidden');

    // Show Receipt Preview
    ReceiptEngine.preview(job, '80mm');
    this.render('jobs');
  },

  // 6. CUSTOMER MANAGEMENT
  renderCustomers: function(container) {
    const customers = DB.get('customers') || [];
    const settings = DB.get('settings') || {};
    const currency = settings.currencySymbol || 'RM';

    container.innerHTML = `
      <div class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <div class="flex items-center gap-2 text-xs text-slate-500 font-semibold mb-1">
              <a href="javascript:void(0)" onclick="App.navigateTo('repair-dashboard')" class="hover:underline">Baiki Smartphone</a> &rarr; <span>Pelanggan</span>
            </div>
            <h1 class="text-xl font-bold text-slate-900">Pengurusan Pelanggan (Customer CRM)</h1>
            <p class="text-xs text-slate-500">Sejarah servis, perbelanjaan dan rekod pelanggan TVET GIATMARA</p>
          </div>
          <button onclick="RepairModule.openCustomerModal()" class="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition">
            <i data-lucide="user-plus" class="w-4 h-4"></i> Tambah Pelanggan
          </button>
        </div>

        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th class="p-4">Customer ID & Nama</th>
                  <th class="p-4">No Telefon & Emel</th>
                  <th class="p-4">Alamat</th>
                  <th class="p-4 text-center">Jumlah Repair</th>
                  <th class="p-4 text-right">Jumlah Perbelanjaan</th>
                  <th class="p-4 text-center">Tarikh Daftar</th>
                  <th class="p-4 text-center">Tindakan</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${customers.map(c => `
                  <tr class="hover:bg-slate-50 transition">
                    <td class="p-4">
                      <div class="font-bold text-slate-900">${c.name}</div>
                      <div class="font-mono text-[10px] text-slate-400 font-semibold">${c.id}</div>
                    </td>
                    <td class="p-4 font-semibold text-slate-700">
                      <div>${c.phone}</div>
                      <div class="text-[10px] text-slate-400">${c.email || '-'}</div>
                    </td>
                    <td class="p-4 text-slate-500 max-w-xs truncate">${c.address || '-'}</td>
                    <td class="p-4 text-center font-mono font-bold text-cyan-700">${c.totalRepairs || 0} Kali</td>
                    <td class="p-4 text-right font-mono font-bold text-emerald-600">${currency} ${(c.totalSpending || 0).toFixed(2)}</td>
                    <td class="p-4 text-center text-slate-500 font-mono">${c.dateRegistered || '-'}</td>
                    <td class="p-4 text-center">
                      <button onclick="RepairModule.openCustomerModal('${c.id}')" class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit">
                        <i data-lucide="edit-2" class="w-4 h-4"></i>
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  openCustomerModal: function(customerId = null) {
    const customers = DB.get('customers') || [];
    const cust = customerId ? customers.find(c => c.id === customerId) : null;
    const isEdit = !!cust;

    let modal = document.getElementById('customer-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'customer-modal';
      modal.className = 'fixed inset-0 z-50 flex items-center justify-center modal-backdrop p-4 overflow-y-auto';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 modal-animate-in">
        <div class="flex items-center justify-between pb-4 border-b border-slate-200">
          <div class="flex items-center gap-2">
            <div class="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <i data-lucide="user" class="w-5 h-5"></i>
            </div>
            <h3 class="font-bold text-slate-900 text-base">${isEdit ? 'Kemaskini Pelanggan' : 'Daftar Pelanggan Baru'}</h3>
          </div>
          <button onclick="document.getElementById('customer-modal').classList.add('hidden')" class="text-slate-400 hover:text-slate-700">
            <i data-lucide="x"></i>
          </button>
        </div>

        <form onsubmit="RepairModule.saveCustomer(event, '${cust ? cust.id : ''}')" class="space-y-4 mt-4 text-xs">
          <div>
            <label class="block font-bold text-slate-700 mb-1">Nama Penuh *</label>
            <input type="text" name="name" value="${cust ? cust.name : ''}" required class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">No Telefon *</label>
            <input type="text" name="phone" value="${cust ? cust.phone : ''}" required class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">Emel</label>
            <input type="email" name="email" value="${cust ? cust.email : ''}" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">Alamat</label>
            <textarea name="address" rows="2" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">${cust ? cust.address : ''}</textarea>
          </div>

          <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button type="button" onclick="document.getElementById('customer-modal').classList.add('hidden')" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition">
              Batal
            </button>
            <button type="submit" class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition">
              Simpan Pelanggan
            </button>
          </div>
        </form>
      </div>
    `;

    modal.classList.remove('hidden');
    if (window.lucide) lucide.createIcons();
  },

  saveCustomer: function(e, existingId) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const customers = DB.get('customers') || [];

    if (existingId) {
      const idx = customers.findIndex(c => c.id === existingId);
      if (idx !== -1) {
        customers[idx].name = formData.get('name');
        customers[idx].phone = formData.get('phone');
        customers[idx].email = formData.get('email');
        customers[idx].address = formData.get('address');
        DB.save('customers', customers);
        App.showToast('Maklumat pelanggan dikemaskini!', 'success');
      }
    } else {
      const newCust = {
        id: DB.generateId('CUST'),
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        address: formData.get('address'),
        dateRegistered: new Date().toISOString().split('T')[0],
        totalRepairs: 0,
        totalSpending: 0,
        outstandingPayment: 0
      };
      customers.push(newCust);
      DB.save('customers', customers);
      App.showToast('Pelanggan baru berjaya didaftarkan!', 'success');
    }

    document.getElementById('customer-modal').classList.add('hidden');
    this.render('customers');
  },

  // 7. REPAIR TOOLS MANAGEMENT
  renderRepairTools: function(container) {
    const tools = DB.get('tools') || [];
    const settings = DB.get('settings') || {};
    const currency = settings.currencySymbol || 'RM';

    container.innerHTML = `
      <div class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <div class="flex items-center gap-2 text-xs text-slate-500 font-semibold mb-1">
              <a href="javascript:void(0)" onclick="App.navigateTo('repair-dashboard')" class="hover:underline">Baiki Smartphone</a> &rarr; <span>Alatan Bengkel</span>
            </div>
            <h1 class="text-xl font-bold text-slate-900">Pengurusan Alatan & Mesin Bengkel (Repair Tools)</h1>
            <p class="text-xs text-slate-500">Pantau keadaan fizikal alatan, lokasi stor, dan status penyelenggaraan.</p>
          </div>
          <button onclick="RepairModule.openToolModal()" class="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition">
            <i data-lucide="plus-circle" class="w-4 h-4"></i> Tambah Alatan Baru
          </button>
        </div>

        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th class="p-4">Tool ID & Nama Alatan</th>
                  <th class="p-4">Kategori & Jenama</th>
                  <th class="p-4">No Siri (Serial No)</th>
                  <th class="p-4 text-center">Kuantiti</th>
                  <th class="p-4">Lokasi Bengkel</th>
                  <th class="p-4 text-center">Keadaan (Condition)</th>
                  <th class="p-4 text-center">Status</th>
                  <th class="p-4 text-center">Tindakan</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${tools.map(t => `
                  <tr class="hover:bg-slate-50 transition">
                    <td class="p-4">
                      <div class="font-bold text-slate-900">${t.name}</div>
                      <div class="font-mono text-[10px] text-slate-400 font-semibold">${t.id}</div>
                    </td>
                    <td class="p-4">
                      <div class="font-semibold text-slate-700">${t.brand}</div>
                      <div class="text-[10px] text-slate-400">${t.category}</div>
                    </td>
                    <td class="p-4 font-mono text-slate-600 text-[11px]">${t.serialNumber || '-'}</td>
                    <td class="p-4 text-center font-mono font-bold text-slate-800">${t.quantity} Unit</td>
                    <td class="p-4 text-slate-600 font-medium">${t.location}</td>
                    <td class="p-4 text-center">
                      <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${t.condition === 'GOOD' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
                        ${t.condition}
                      </span>
                    </td>
                    <td class="p-4 text-center">
                      <span class="badge-status ${t.status === 'AVAILABLE' ? 'status-ready' : 'status-preparing'} text-[10px]">
                        ${t.status}
                      </span>
                    </td>
                    <td class="p-4 text-center">
                      <button onclick="RepairModule.openToolModal('${t.id}')" class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit">
                        <i data-lucide="edit-2" class="w-4 h-4"></i>
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  openToolModal: function(toolId = null) {
    const tools = DB.get('tools') || [];
    const item = toolId ? tools.find(t => t.id === toolId) : null;
    const isEdit = !!item;

    let modal = document.getElementById('repair-tool-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'repair-tool-modal';
      modal.className = 'fixed inset-0 z-50 flex items-center justify-center modal-backdrop p-4 overflow-y-auto';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 modal-animate-in">
        <div class="flex items-center justify-between pb-4 border-b border-slate-200">
          <div class="flex items-center gap-2">
            <div class="w-9 h-9 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
              <i data-lucide="wrench" class="w-5 h-5"></i>
            </div>
            <h3 class="font-bold text-slate-900 text-base">${isEdit ? 'Kemaskini Alatan Bengkel' : 'Tambah Alatan Bengkel Baru'}</h3>
          </div>
          <button onclick="document.getElementById('repair-tool-modal').classList.add('hidden')" class="text-slate-400 hover:text-slate-700">
            <i data-lucide="x"></i>
          </button>
        </div>

        <form onsubmit="RepairModule.saveTool(event, '${item ? item.id : ''}')" class="space-y-4 mt-4 text-xs">
          <div>
            <label class="block font-bold text-slate-700 mb-1">Nama Alatan / Mesin *</label>
            <input type="text" name="name" value="${item ? item.name : ''}" required class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 font-semibold" placeholder="cth: Digital Solder Station">
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Jenama (Brand) *</label>
              <input type="text" name="brand" value="${item ? item.brand : ''}" required class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" placeholder="cth: Quick / Sunshine">
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Kategori Alatan</label>
              <input type="text" name="category" value="${item ? item.category : 'Diagnostic & Power'}" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">No Siri (Serial Number)</label>
              <input type="text" name="serialNumber" value="${item ? item.serialNumber : ''}" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono">
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Kuantiti *</label>
              <input type="number" min="1" name="quantity" value="${item ? item.quantity : 1}" required class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold">
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Keadaan (Condition)</label>
              <select name="condition" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold">
                <option value="GOOD" ${item && item.condition === 'GOOD' ? 'selected' : ''}>GOOD (Baik)</option>
                <option value="FAIR" ${item && item.condition === 'FAIR' ? 'selected' : ''}>FAIR (Sederhana)</option>
                <option value="DAMAGED" ${item && item.condition === 'DAMAGED' ? 'selected' : ''}>DAMAGED (Rosak)</option>
                <option value="UNDER_MAINTENANCE" ${item && item.condition === 'UNDER_MAINTENANCE' ? 'selected' : ''}>UNDER MAINTENANCE</option>
              </select>
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Status Penggunaan</label>
              <select name="status" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold">
                <option value="AVAILABLE" ${item && item.status === 'AVAILABLE' ? 'selected' : ''}>AVAILABLE</option>
                <option value="IN_USE" ${item && item.status === 'IN_USE' ? 'selected' : ''}>IN USE</option>
                <option value="MAINTENANCE" ${item && item.status === 'MAINTENANCE' ? 'selected' : ''}>MAINTENANCE</option>
                <option value="DISPOSED" ${item && item.status === 'DISPOSED' ? 'selected' : ''}>DISPOSED</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Lokasi di Bengkel</label>
            <input type="text" name="location" value="${item ? item.location : 'Meja Bengkel 1'}" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
          </div>

          <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button type="button" onclick="document.getElementById('repair-tool-modal').classList.add('hidden')" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition">
              Batal
            </button>
            <button type="submit" class="px-5 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl shadow-sm transition">
              Simpan Alatan
            </button>
          </div>
        </form>
      </div>
    `;

    modal.classList.remove('hidden');
    if (window.lucide) lucide.createIcons();
  },

  saveTool: function(e, existingId) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const tools = DB.get('tools') || [];

    if (existingId) {
      const idx = tools.findIndex(t => t.id === existingId);
      if (idx !== -1) {
        tools[idx].name = formData.get('name');
        tools[idx].brand = formData.get('brand');
        tools[idx].category = formData.get('category');
        tools[idx].serialNumber = formData.get('serialNumber');
        tools[idx].quantity = parseInt(formData.get('quantity')) || 1;
        tools[idx].condition = formData.get('condition');
        tools[idx].status = formData.get('status');
        tools[idx].location = formData.get('location');
        DB.save('tools', tools);
        App.showToast('Alatan bengkel dikemaskini!', 'success');
      }
    } else {
      const newTool = {
        id: 'TOL-' + Math.floor(100 + Math.random() * 900),
        name: formData.get('name'),
        brand: formData.get('brand'),
        category: formData.get('category'),
        serialNumber: formData.get('serialNumber'),
        quantity: parseInt(formData.get('quantity')) || 1,
        purchaseDate: new Date().toISOString().split('T')[0],
        purchasePrice: 0.00,
        location: formData.get('location'),
        condition: formData.get('condition'),
        status: formData.get('status')
      };
      tools.push(newTool);
      DB.save('tools', tools);
      App.showToast('Alatan bengkel baru ditambah!', 'success');
    }

    document.getElementById('repair-tool-modal').classList.add('hidden');
    this.render('tools');
  }
};
