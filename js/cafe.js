/**
 * TRIG GIATMARA KANGAR - Café & Culinary Management Module
 * Comprehensive POS, QR Table Ordering, Menu Engineering, Kitchen Display System (KDS), and Table Floor Plan.
 */

const CafeModule = {
  cart: [],
  selectedOrderType: 'DINE_IN', // 'DINE_IN' or 'TAKEAWAY'
  selectedTableId: 'M01',
  takeawayCustomer: { name: '', phone: '', pickupTime: '' },
  activeCategoryFilter: 'ALL',
  searchQuery: '',

  // Initialize or Render Submodules
  render: function(subview = 'dashboard', params = {}) {
    const container = document.getElementById('main-content-view');
    if (!container) return;

    if (params.table) {
      this.selectedTableId = params.table;
      this.selectedOrderType = 'DINE_IN';
    }

    switch (subview) {
      case 'menu':
        this.renderMenuManagement(container);
        break;
      case 'tables':
        this.renderTableManagement(container);
        break;
      case 'qr-tables':
        this.renderQRTables(container);
        break;
      case 'pos':
      case 'order':
        this.renderFoodOrdering(container, params);
        break;
      case 'orders':
        this.renderOrdersList(container);
        break;
      case 'kitchen':
        this.renderKitchenDisplay(container);
        break;
      case 'dashboard':
      default:
        this.renderCafeDashboard(container);
        break;
    }

    if (window.lucide) lucide.createIcons();
  },

  // 1. CAFÉ DASHBOARD
  renderCafeDashboard: function(container) {
    const orders = DB.get('orders') || [];
    const menu = DB.get('menu') || [];
    const tables = DB.get('tables') || [];
    const settings = DB.get('settings') || {};
    const currency = settings.currencySymbol || 'RM';

    let totalCafeSales = 0;
    let totalCafeProfit = 0;
    let activeKitchenOrders = 0;
    let occupiedTables = tables.filter(t => t.status === 'OCCUPIED' || t.status === 'ORDERING').length;

    orders.forEach(o => {
      totalCafeSales += (parseFloat(o.total) || 0);
      totalCafeProfit += (parseFloat(o.profit) || 0);
      if (['NEW', 'CONFIRMED', 'PREPARING'].includes(o.orderStatus)) {
        activeKitchenOrders++;
      }
    });

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Sub-Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xl">
              <i data-lucide="coffee"></i>
            </div>
            <div>
              <h1 class="text-xl font-bold text-slate-900">PENGURUSAN CAFÉ GIATMARA KANGAR</h1>
              <p class="text-xs text-slate-500">Operasi Dapur, Meja QR, Pesanan Makanan & Latihan Kulinari</p>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <button onclick="App.navigateTo('cafe-pos')" class="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition">
              <i data-lucide="plus-circle" class="w-4 h-4"></i> Buat Pesanan
            </button>
            <button onclick="App.navigateTo('cafe-kitchen')" class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition">
              <i data-lucide="chef-hat" class="w-4 h-4"></i> Kitchen Display (${activeKitchenOrders})
            </button>
          </div>
        </div>

        <!-- KPI Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="card-kpi p-5 border-l-4 border-l-amber-500">
            <span class="text-xs font-bold text-slate-500 uppercase">Jumlah Jualan Café</span>
            <div class="mt-2 text-2xl font-black font-mono text-slate-900">${currency} ${totalCafeSales.toFixed(2)}</div>
            <div class="mt-1 text-[11px] text-slate-500">Hasil keseluruhan pesanan</div>
          </div>

          <div class="card-kpi p-5 border-l-4 border-l-emerald-500">
            <span class="text-xs font-bold text-slate-500 uppercase">Untung Kasar Café</span>
            <div class="mt-2 text-2xl font-black font-mono text-emerald-600">${currency} ${totalCafeProfit.toFixed(2)}</div>
            <div class="mt-1 text-[11px] text-slate-500">Margin: ${totalCafeSales > 0 ? ((totalCafeProfit/totalCafeSales)*100).toFixed(1) : 0}%</div>
          </div>

          <div class="card-kpi p-5 border-l-4 border-l-orange-500">
            <span class="text-xs font-bold text-slate-500 uppercase">Pesanan Dapur Aktif</span>
            <div class="mt-2 text-2xl font-black font-mono text-orange-600">${activeKitchenOrders}</div>
            <div class="mt-1 text-[11px] text-slate-500">Sedang disediakan di dapur</div>
          </div>

          <div class="card-kpi p-5 border-l-4 border-l-blue-500">
            <span class="text-xs font-bold text-slate-500 uppercase">Meja Berpenghuni</span>
            <div class="mt-2 text-2xl font-black font-mono text-blue-600">${occupiedTables} / ${tables.length}</div>
            <div class="mt-1 text-[11px] text-slate-500">Kadar Penggunaan Meja</div>
          </div>
        </div>

        <!-- Quick Access Submenu Navigation -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button onclick="App.navigateTo('cafe-menu')" class="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 text-center transition group shadow-sm">
            <div class="w-10 h-10 rounded-lg bg-amber-50 group-hover:bg-amber-100 text-amber-600 flex items-center justify-center">
              <i data-lucide="book-open" class="w-5 h-5"></i>
            </div>
            <span class="text-xs font-bold text-slate-800">Urus Menu</span>
          </button>

          <button onclick="App.navigateTo('cafe-tables')" class="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 text-center transition group shadow-sm">
            <div class="w-10 h-10 rounded-lg bg-blue-50 group-hover:bg-blue-100 text-blue-600 flex items-center justify-center">
              <i data-lucide="layout-grid" class="w-5 h-5"></i>
            </div>
            <span class="text-xs font-bold text-slate-800">Susun Atur Meja</span>
          </button>

          <button onclick="App.navigateTo('cafe-qr-tables')" class="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 text-center transition group shadow-sm">
            <div class="w-10 h-10 rounded-lg bg-purple-50 group-hover:bg-purple-100 text-purple-600 flex items-center justify-center">
              <i data-lucide="qr-code" class="w-5 h-5"></i>
            </div>
            <span class="text-xs font-bold text-slate-800">QR Code Meja</span>
          </button>

          <button onclick="App.navigateTo('cafe-pos')" class="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 text-center transition group shadow-sm">
            <div class="w-10 h-10 rounded-lg bg-emerald-50 group-hover:bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <i data-lucide="shopping-cart" class="w-5 h-5"></i>
            </div>
            <span class="text-xs font-bold text-slate-800">Food Ordering POS</span>
          </button>

          <button onclick="App.navigateTo('cafe-kitchen')" class="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 text-center transition group shadow-sm">
            <div class="w-10 h-10 rounded-lg bg-orange-50 group-hover:bg-orange-100 text-orange-600 flex items-center justify-center">
              <i data-lucide="chef-hat" class="w-5 h-5"></i>
            </div>
            <span class="text-xs font-bold text-slate-800">Kitchen Display</span>
          </button>

          <button onclick="App.navigateTo('cafe-orders')" class="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 text-center transition group shadow-sm">
            <div class="w-10 h-10 rounded-lg bg-slate-100 group-hover:bg-slate-200 text-slate-700 flex items-center justify-center">
              <i data-lucide="clipboard-list" class="w-5 h-5"></i>
            </div>
            <span class="text-xs font-bold text-slate-800">Senarai Pesanan</span>
          </button>
        </div>

        <!-- Recent Orders & Table Map Preview -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div class="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 class="font-bold text-slate-900 text-sm">Pesanan Terkini Memerlukan Tindakan</h3>
              <button onclick="App.navigateTo('cafe-orders')" class="text-xs text-blue-600 font-semibold hover:underline">Semua Pesanan &rarr;</button>
            </div>
            <div class="divide-y divide-slate-100 mt-2">
              ${orders.filter(o => o.orderStatus !== 'COMPLETED').slice(0, 5).map(o => `
                <div class="py-3.5 flex items-center justify-between">
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="font-mono font-bold text-xs text-slate-900">${o.id}</span>
                      <span class="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                        ${o.orderType === 'DINE_IN' ? (o.tableName || o.tableId) : 'Bungkus (' + (o.customerName || 'Takeaway') + ')'}
                      </span>
                    </div>
                    <div class="text-xs text-slate-500 mt-1">
                      ${o.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="font-mono font-bold text-xs text-slate-900">${currency} ${(o.total || 0).toFixed(2)}</div>
                    <span class="badge-status status-${o.orderStatus.toLowerCase()} text-[10px] mt-1">${o.orderStatus}</span>
                  </div>
                </div>
              `).join('') || '<div class="py-8 text-center text-xs text-slate-400">Tiada pesanan aktif pada masa ini.</div>'}
            </div>
          </div>

          <!-- Quick Floor Layout Widget -->
          <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 class="font-bold text-slate-900 text-sm">Status Meja Semasa</h3>
              <button onclick="App.navigateTo('cafe-tables')" class="text-xs text-blue-600 font-semibold hover:underline">Urus &rarr;</button>
            </div>
            <div class="grid grid-cols-2 gap-2 mt-4 flex-1">
              ${tables.slice(0, 8).map(t => `
                <div onclick="CafeModule.openTableAction('${t.id}')" class="p-2.5 rounded-xl border border-slate-200 flex flex-col items-center justify-center text-center cursor-pointer transition hover:border-amber-400 ${t.status === 'OCCUPIED' ? 'bg-rose-50 border-rose-200' : (t.status === 'ORDERING' ? 'bg-amber-50 border-amber-200' : 'bg-slate-50')}">
                  <span class="font-bold text-xs text-slate-800">${t.id}</span>
                  <span class="text-[10px] text-slate-500">${t.capacity} Orang</span>
                  <span class="badge-status status-${t.status.toLowerCase()} text-[9px] mt-1 py-0 px-1.5">${t.status}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // 2. MENU MANAGEMENT (CRUD, Cost, Selling, Profit Margin)
  renderMenuManagement: function(container) {
    const menu = DB.get('menu') || [];
    const settings = DB.get('settings') || {};
    const currency = settings.currencySymbol || 'RM';

    const categories = ['ALL', 'Rice', 'Noodles', 'Main Dish', 'Drinks', 'Dessert', 'Combo', 'Others'];
    
    // Filter
    let filteredMenu = menu;
    if (this.activeCategoryFilter !== 'ALL') {
      filteredMenu = filteredMenu.filter(m => m.category === this.activeCategoryFilter);
    }
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      filteredMenu = filteredMenu.filter(m => m.name.toLowerCase().includes(q) || m.id.toLowerCase().includes(q));
    }

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <div class="flex items-center gap-2 text-xs text-slate-500 font-semibold mb-1">
              <a href="javascript:void(0)" onclick="App.navigateTo('cafe-dashboard')" class="hover:underline">Café GIATMARA</a> &rarr; <span>Menu Management</span>
            </div>
            <h1 class="text-xl font-bold text-slate-900">Pengurusan Menu & Kos Masakan</h1>
            <p class="text-xs text-slate-500">Kira Gross Profit, Margin % dan Kawalan Stok Sajian</p>
          </div>
          <button onclick="CafeModule.openMenuModal()" class="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition">
            <i data-lucide="plus-circle" class="w-4 h-4"></i> Tambah Menu Baru
          </button>
        </div>

        <!-- Filter & Search Bar -->
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <!-- Category Tabs -->
          <div class="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            ${categories.map(cat => `
              <button onclick="CafeModule.filterCategory('${cat}')" class="px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${this.activeCategoryFilter === cat ? 'bg-amber-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}">
                ${cat}
              </button>
            `).join('')}
          </div>

          <!-- Search Input -->
          <div class="relative w-full md:w-64">
            <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3 top-3"></i>
            <input type="text" value="${this.searchQuery}" oninput="CafeModule.searchMenu(this.value)" placeholder="Cari nama menu atau ID..." class="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500">
          </div>
        </div>

        <!-- Menu Table -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th class="p-4">Menu & Imej</th>
                  <th class="p-4">Kategori</th>
                  <th class="p-4 text-right">Kos (Cost)</th>
                  <th class="p-4 text-right">Harga Jual</th>
                  <th class="p-4 text-right">Untung (Profit)</th>
                  <th class="p-4 text-right">Margin %</th>
                  <th class="p-4 text-center">Baki Sajian</th>
                  <th class="p-4 text-center">Status</th>
                  <th class="p-4 text-center">Tindakan</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${filteredMenu.map(item => {
                  const cost = parseFloat(item.costPrice) || 0;
                  const sell = parseFloat(item.sellingPrice) || 0;
                  const profit = sell - cost;
                  const margin = sell > 0 ? ((profit / sell) * 100).toFixed(1) : 0;

                  return `
                    <tr class="hover:bg-slate-50 transition">
                      <td class="p-4">
                        <div class="flex items-center gap-3">
                          <img src="${item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'}" class="w-12 h-12 object-cover rounded-xl border border-slate-200" alt="${item.name}">
                          <div>
                            <div class="font-bold text-slate-900 text-xs">${item.name}</div>
                            <div class="font-mono text-[10px] text-slate-400 font-semibold">${item.id}</div>
                            <div class="text-[11px] text-slate-500 line-clamp-1 max-w-xs mt-0.5">${item.description || '-'}</div>
                          </div>
                        </div>
                      </td>
                      <td class="p-4 font-semibold text-slate-700">
                        <span class="px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 text-[11px] font-bold">${item.category}</span>
                      </td>
                      <td class="p-4 text-right font-mono text-slate-600">${currency} ${cost.toFixed(2)}</td>
                      <td class="p-4 text-right font-mono font-bold text-slate-900">${currency} ${sell.toFixed(2)}</td>
                      <td class="p-4 text-right font-mono font-bold text-emerald-600">${currency} ${profit.toFixed(2)}</td>
                      <td class="p-4 text-right">
                        <span class="px-2 py-0.5 rounded-full font-mono text-[11px] font-bold ${margin >= 40 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
                          ${margin}%
                        </span>
                      </td>
                      <td class="p-4 text-center font-mono font-bold text-slate-800">${item.availableQty || 0}</td>
                      <td class="p-4 text-center">
                        <span class="badge-status ${item.status === 'AVAILABLE' ? 'status-ready' : 'status-cancelled'} text-[10px]">
                          ${item.status}
                        </span>
                      </td>
                      <td class="p-4 text-center">
                        <div class="inline-flex items-center gap-1">
                          <button onclick="CafeModule.openMenuModal('${item.id}')" class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit">
                            <i data-lucide="edit-2" class="w-4 h-4"></i>
                          </button>
                          <button onclick="CafeModule.deleteMenu('${item.id}')" class="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition" title="Padam">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                          </button>
                        </div>
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

  filterCategory: function(cat) {
    this.activeCategoryFilter = cat;
    this.render('menu');
  },

  searchMenu: function(q) {
    this.searchQuery = q;
    this.render('menu');
  },

  // Open Add/Edit Menu Modal
  openMenuModal: function(menuId = null) {
    const menuList = DB.get('menu') || [];
    const item = menuId ? menuList.find(m => m.id === menuId) : null;
    const isEdit = !!item;

    let modal = document.getElementById('cafe-menu-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'cafe-menu-modal';
      modal.className = 'fixed inset-0 z-50 flex items-center justify-center modal-backdrop p-4 overflow-y-auto';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 modal-animate-in">
        <div class="flex items-center justify-between pb-4 border-b border-slate-200">
          <div class="flex items-center gap-2">
            <div class="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <i data-lucide="utensils" class="w-5 h-5"></i>
            </div>
            <h3 class="font-bold text-slate-900 text-base">${isEdit ? 'Kemaskini Menu Masakan' : 'Tambah Menu Masakan Baru'}</h3>
          </div>
          <button onclick="document.getElementById('cafe-menu-modal').classList.add('hidden')" class="text-slate-400 hover:text-slate-700">
            <i data-lucide="x"></i>
          </button>
        </div>

        <form onsubmit="CafeModule.saveMenu(event, '${item ? item.id : ''}')" class="space-y-4 mt-4 text-xs">
          <div>
            <label class="block font-bold text-slate-700 mb-1">Nama Menu Sajian *</label>
            <input type="text" name="name" value="${item ? item.name : ''}" required class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none" placeholder="cth: Nasi Ayam Madu GIATMARA">
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Kategori *</label>
              <select name="category" required class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-semibold">
                ${['Rice', 'Noodles', 'Main Dish', 'Drinks', 'Dessert', 'Combo', 'Others'].map(c => `
                  <option value="${c}" ${item && item.category === c ? 'selected' : ''}>${c}</option>
                `).join('')}
              </select>
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Status Ketersediaan</label>
              <select name="status" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-semibold">
                <option value="AVAILABLE" ${item && item.status === 'AVAILABLE' ? 'selected' : ''}>AVAILABLE</option>
                <option value="OUT_OF_STOCK" ${item && item.status === 'OUT_OF_STOCK' ? 'selected' : ''}>OUT OF STOCK</option>
                <option value="INACTIVE" ${item && item.status === 'INACTIVE' ? 'selected' : ''}>INACTIVE</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Kos Bahan (RM) *</label>
              <input type="number" step="0.10" min="0" id="menu-cost" name="costPrice" value="${item ? item.costPrice : '4.00'}" required oninput="CafeModule.recalcMargin()" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono font-bold">
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Harga Jualan (RM) *</label>
              <input type="number" step="0.10" min="0" id="menu-sell" name="sellingPrice" value="${item ? item.sellingPrice : '7.00'}" required oninput="CafeModule.recalcMargin()" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono font-bold text-slate-900">
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Kuantiti Baki *</label>
              <input type="number" min="0" name="availableQty" value="${item ? item.availableQty : '30'}" required class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono font-bold">
            </div>
          </div>

          <!-- Live Margin Calculation Preview -->
          <div class="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs">
            <div>
              <span class="text-amber-900 font-semibold">Gross Profit: </span>
              <b id="live-profit" class="font-mono text-emerald-700">RM 3.00</b>
            </div>
            <div>
              <span class="text-amber-900 font-semibold">Margin Untung: </span>
              <b id="live-margin" class="font-mono text-amber-800">42.9%</b>
            </div>
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Penerangan / Ramuan</label>
            <textarea name="description" rows="2" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none" placeholder="Penerangan ringkas sajian...">${item ? item.description : ''}</textarea>
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">URL Imej Makanan</label>
            <input type="url" name="image" value="${item ? item.image : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600'}" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono text-[11px]">
          </div>

          <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button type="button" onclick="document.getElementById('cafe-menu-modal').classList.add('hidden')" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition">
              Batal
            </button>
            <button type="submit" class="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-sm transition">
              ${isEdit ? 'Kemaskini Menu' : 'Simpan Menu'}
            </button>
          </div>
        </form>
      </div>
    `;

    modal.classList.remove('hidden');
    this.recalcMargin();
    if (window.lucide) lucide.createIcons();
  },

  recalcMargin: function() {
    const cost = parseFloat(document.getElementById('menu-cost')?.value) || 0;
    const sell = parseFloat(document.getElementById('menu-sell')?.value) || 0;
    const profit = sell - cost;
    const margin = sell > 0 ? ((profit / sell) * 100).toFixed(1) : 0;

    const profitEl = document.getElementById('live-profit');
    const marginEl = document.getElementById('live-margin');
    if (profitEl) profitEl.innerText = `RM ${profit.toFixed(2)}`;
    if (marginEl) marginEl.innerText = `${margin}%`;
  },

  saveMenu: function(e, existingId) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const menuList = DB.get('menu') || [];
    const cost = parseFloat(formData.get('costPrice')) || 0;
    const sell = parseFloat(formData.get('sellingPrice')) || 0;

    if (sell < 0 || cost < 0) {
      App.showToast('Harga tidak boleh negatif!', 'error');
      return;
    }

    if (existingId) {
      const idx = menuList.findIndex(m => m.id === existingId);
      if (idx !== -1) {
        menuList[idx] = {
          ...menuList[idx],
          name: formData.get('name'),
          category: formData.get('category'),
          description: formData.get('description'),
          image: formData.get('image'),
          costPrice: cost,
          sellingPrice: sell,
          availableQty: parseInt(formData.get('availableQty')) || 0,
          status: formData.get('status')
        };
        DB.save('menu', menuList);
        DB.logAudit('SUPER_ADMIN', 'Kemaskini Menu Café', 'CAFE', `Menu ${existingId} (${formData.get('name')}) dikemaskini.`);
        App.showToast('Menu berjaya dikemaskini!', 'success');
      }
    } else {
      const newMenu = {
        id: 'MNU-' + Math.floor(100 + Math.random() * 900),
        name: formData.get('name'),
        category: formData.get('category'),
        description: formData.get('description'),
        image: formData.get('image'),
        costPrice: cost,
        sellingPrice: sell,
        availableQty: parseInt(formData.get('availableQty')) || 0,
        status: formData.get('status')
      };
      menuList.push(newMenu);
      DB.save('menu', menuList);
      DB.logAudit('SUPER_ADMIN', 'Tambah Menu Baru', 'CAFE', `Menu baru ${newMenu.id} (${newMenu.name}) ditambah.`);
      App.showToast('Menu baru berjaya ditambah!', 'success');
    }

    document.getElementById('cafe-menu-modal').classList.add('hidden');
    this.render('menu');
  },

  deleteMenu: function(menuId) {
    App.confirm('Adakah anda pasti mahu memadamkan menu ini?', () => {
      let menuList = DB.get('menu') || [];
      menuList = menuList.filter(m => m.id !== menuId);
      DB.save('menu', menuList);
      DB.logAudit('SUPER_ADMIN', 'Padam Menu Masakan', 'CAFE', `Menu ${menuId} dipadamkan.`);
      App.showToast('Menu berjaya dipadam.', 'info');
      CafeModule.render('menu');
    });
  },

  // 3. TABLE MANAGEMENT & VISUAL FLOOR PLAN
  renderTableManagement: function(container) {
    const tables = DB.get('tables') || [];

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <div class="flex items-center gap-2 text-xs text-slate-500 font-semibold mb-1">
              <a href="javascript:void(0)" onclick="App.navigateTo('cafe-dashboard')" class="hover:underline">Café GIATMARA</a> &rarr; <span>Table Management</span>
            </div>
            <h1 class="text-xl font-bold text-slate-900">Pengurusan & Susun Atur Meja Café</h1>
            <p class="text-xs text-slate-500">Pantau status M01 - M10, lokasi, kapasiti dan pautan QR</p>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="CafeModule.openTableModal()" class="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition">
              <i data-lucide="plus" class="w-4 h-4"></i> Tambah Meja
            </button>
            <button onclick="App.navigateTo('cafe-qr-tables')" class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition">
              <i data-lucide="qr-code" class="w-4 h-4"></i> Papar QR Semua Meja
            </button>
          </div>
        </div>

        <!-- Visual Table Floor Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          ${tables.map(t => {
            let bgStyle = 'bg-white border-slate-200';
            if (t.status === 'OCCUPIED') bgStyle = 'bg-rose-50/50 border-rose-200';
            if (t.status === 'ORDERING') bgStyle = 'bg-amber-50/50 border-amber-200';
            if (t.status === 'CLEANING') bgStyle = 'bg-purple-50/50 border-purple-200';

            return `
              <div class="card-soft p-5 border rounded-2xl flex flex-col justify-between ${bgStyle} relative group">
                <div>
                  <div class="flex items-center justify-between">
                    <span class="font-black text-lg text-slate-900 font-mono">${t.id}</span>
                    <span class="badge-status status-${t.status.toLowerCase()} text-[10px]">${t.status}</span>
                  </div>
                  <div class="mt-2 text-xs font-bold text-slate-700">${t.name}</div>
                  <div class="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <i data-lucide="users" class="w-3.5 h-3.5 text-slate-400"></i> Kapasiti: <b>${t.capacity} Orang</b>
                  </div>
                  <div class="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <i data-lucide="map-pin" class="w-3.5 h-3.5 text-slate-400"></i> ${t.location}
                  </div>
                </div>

                <div class="mt-5 pt-3 border-t border-slate-200 flex flex-col gap-1.5">
                  <div class="grid grid-cols-2 gap-1.5">
                    <button onclick="CafeModule.openTableOrder('${t.id}')" class="px-2 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1">
                      <i data-lucide="utensils" class="w-3.5 h-3.5"></i> Order
                    </button>
                    <button onclick="CafeModule.showTableQR('${t.id}')" class="px-2 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1">
                      <i data-lucide="qr-code" class="w-3.5 h-3.5"></i> QR
                    </button>
                  </div>
                  
                  <div class="flex items-center justify-between pt-1">
                    <select onchange="CafeModule.updateTableStatus('${t.id}', this.value)" class="text-[11px] py-1 px-2 border border-slate-200 rounded-lg bg-white font-semibold text-slate-700">
                      <option value="AVAILABLE" ${t.status === 'AVAILABLE' ? 'selected' : ''}>AVAILABLE</option>
                      <option value="OCCUPIED" ${t.status === 'OCCUPIED' ? 'selected' : ''}>OCCUPIED</option>
                      <option value="ORDERING" ${t.status === 'ORDERING' ? 'selected' : ''}>ORDERING</option>
                      <option value="CLEANING" ${t.status === 'CLEANING' ? 'selected' : ''}>CLEANING</option>
                      <option value="INACTIVE" ${t.status === 'INACTIVE' ? 'selected' : ''}>INACTIVE</option>
                    </select>
                    <button onclick="CafeModule.openTableModal('${t.id}')" class="p-1 text-slate-400 hover:text-blue-600">
                      <i data-lucide="settings" class="w-3.5 h-3.5"></i>
                    </button>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },

  updateTableStatus: function(tableId, newStatus) {
    const tables = DB.get('tables') || [];
    const tbl = tables.find(t => t.id === tableId);
    if (tbl) {
      tbl.status = newStatus;
      DB.save('tables', tables);
      DB.logAudit('CAFE_STAFF', 'Tukar Status Meja', 'CAFE', `Status Meja ${tableId} ditukar kepada ${newStatus}.`);
      App.showToast(`Status meja ${tableId} kini ${newStatus}`, 'success');
      this.render('tables');
    }
  },

  openTableModal: function(tableId = null) {
    const tables = DB.get('tables') || [];
    const item = tableId ? tables.find(t => t.id === tableId) : null;
    const isEdit = !!item;

    let modal = document.getElementById('cafe-table-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'cafe-table-modal';
      modal.className = 'fixed inset-0 z-50 flex items-center justify-center modal-backdrop p-4 overflow-y-auto';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 modal-animate-in">
        <div class="flex items-center justify-between pb-4 border-b border-slate-200">
          <div class="flex items-center gap-2">
            <div class="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <i data-lucide="layout-grid" class="w-5 h-5"></i>
            </div>
            <h3 class="font-bold text-slate-900 text-base">${isEdit ? 'Kemaskini Meja' : 'Tambah Meja Baru'}</h3>
          </div>
          <button onclick="document.getElementById('cafe-table-modal').classList.add('hidden')" class="text-slate-400 hover:text-slate-700">
            <i data-lucide="x"></i>
          </button>
        </div>

        <form onsubmit="CafeModule.saveTable(event, '${item ? item.id : ''}')" class="space-y-4 mt-4 text-xs">
          <div>
            <label class="block font-bold text-slate-700 mb-1">ID Meja (cth: M11) *</label>
            <input type="text" name="id" value="${item ? item.id : 'M' + (tables.length + 1).toString().padStart(2, '0')}" required ${isEdit ? 'readonly' : ''} class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold">
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">Nama / Label Meja *</label>
            <input type="text" name="name" value="${item ? item.name : 'Meja M' + (tables.length + 1).toString().padStart(2, '0')}" required class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold">
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Kapasiti (Orang) *</label>
              <input type="number" min="1" max="20" name="capacity" value="${item ? item.capacity : 4}" required class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold">
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Status Awal</label>
              <select name="status" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold">
                <option value="AVAILABLE" ${item && item.status === 'AVAILABLE' ? 'selected' : ''}>AVAILABLE</option>
                <option value="OCCUPIED" ${item && item.status === 'OCCUPIED' ? 'selected' : ''}>OCCUPIED</option>
                <option value="ORDERING" ${item && item.status === 'ORDERING' ? 'selected' : ''}>ORDERING</option>
                <option value="CLEANING" ${item && item.status === 'CLEANING' ? 'selected' : ''}>CLEANING</option>
                <option value="INACTIVE" ${item && item.status === 'INACTIVE' ? 'selected' : ''}>INACTIVE</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">Zon / Lokasi Meja</label>
            <input type="text" name="location" value="${item ? item.location : 'Ruang Dalam Café (Aircond)'}" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
          </div>

          <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button type="button" onclick="document.getElementById('cafe-table-modal').classList.add('hidden')" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition">
              Batal
            </button>
            <button type="submit" class="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-sm transition">
              Simpan Meja
            </button>
          </div>
        </form>
      </div>
    `;

    modal.classList.remove('hidden');
    if (window.lucide) lucide.createIcons();
  },

  saveTable: function(e, existingId) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const tables = DB.get('tables') || [];

    if (existingId) {
      const idx = tables.findIndex(t => t.id === existingId);
      if (idx !== -1) {
        tables[idx].name = formData.get('name');
        tables[idx].capacity = parseInt(formData.get('capacity')) || 4;
        tables[idx].location = formData.get('location');
        tables[idx].status = formData.get('status');
        DB.save('tables', tables);
        App.showToast('Meja dikemaskini!', 'success');
      }
    } else {
      const newTbl = {
        id: formData.get('id'),
        name: formData.get('name'),
        capacity: parseInt(formData.get('capacity')) || 4,
        location: formData.get('location'),
        status: formData.get('status'),
        activeOrderId: null
      };
      tables.push(newTbl);
      DB.save('tables', tables);
      App.showToast('Meja baru ditambah!', 'success');
    }

    document.getElementById('cafe-table-modal').classList.add('hidden');
    this.render('tables');
  },

  // 4. QR TABLE DISPLAY & SIMULATION
  renderQRTables: function(container) {
    const tables = DB.get('tables') || [];

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <div class="flex items-center gap-2 text-xs text-slate-500 font-semibold mb-1">
              <a href="javascript:void(0)" onclick="App.navigateTo('cafe-dashboard')" class="hover:underline">Café GIATMARA</a> &rarr; <span>QR Code Meja</span>
            </div>
            <h1 class="text-xl font-bold text-slate-900">QR Code Sistem Pesanan Meja Café</h1>
            <p class="text-xs text-slate-500">Cetak kod QR untuk setiap meja bagi membolehkan pelanggan scan & terus membuat pesanan makanan.</p>
          </div>
          <button onclick="window.print()" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition no-print">
            <i data-lucide="printer" class="w-4 h-4"></i> Cetak Semua QR Meja
          </button>
        </div>

        <!-- Grid QR Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          ${tables.map(t => {
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(window.location.origin + window.location.pathname + '?mode=customer&table=' + t.id)}`;
            return `
              <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center space-y-3">
                <div class="font-bold text-xs uppercase tracking-wider text-slate-500">TRIG GIATMARA KANGAR</div>
                <div class="font-black text-xl text-slate-900 font-mono">${t.name}</div>
                <div class="p-2 bg-white rounded-xl border border-slate-200 shadow-inner">
                  <img src="${qrUrl}" alt="QR ${t.id}" class="w-32 h-32 object-contain">
                </div>
                <div class="text-[11px] text-slate-500">
                  <span>${t.location}</span><br>
                  <span class="font-semibold text-slate-700">Kapasiti: ${t.capacity} Orang</span>
                </div>
                
                <div class="w-full pt-2 flex flex-col gap-1.5 no-print">
                  <button onclick="CafeModule.openTableOrder('${t.id}')" class="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-1">
                    <i data-lucide="external-link" class="w-3.5 h-3.5"></i> Buka Menu (Simulasi Scan)
                  </button>
                  <div class="grid grid-cols-2 gap-1 text-[11px]">
                    <button onclick="CafeModule.showTableQR('${t.id}')" class="py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg">
                      Lihat QR
                    </button>
                    <button onclick="window.print()" class="py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg">
                      Cetak QR
                    </button>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },

  showTableQR: function(tableId) {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(window.location.origin + window.location.pathname + '?mode=customer&table=' + tableId)}`;
    
    let modal = document.getElementById('qr-single-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'qr-single-modal';
      modal.className = 'fixed inset-0 z-50 flex items-center justify-center modal-backdrop p-4';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center modal-animate-in">
        <div class="font-bold text-sm text-slate-500 uppercase">TRIG GIATMARA KANGAR</div>
        <h3 class="font-black text-2xl text-slate-900 font-mono mt-1">MEJA ${tableId}</h3>
        <p class="text-xs text-slate-500 mt-1">Imbas untuk melihat menu dan membuat pesanan makanan.</p>

        <div class="my-5 p-3 bg-white border border-slate-200 rounded-2xl inline-block shadow-sm">
          <img src="${qrUrl}" alt="QR ${tableId}" class="w-48 h-48 mx-auto">
        </div>

        <div class="flex flex-col gap-2">
          <button onclick="CafeModule.openTableOrder('${tableId}'); document.getElementById('qr-single-modal').classList.add('hidden')" class="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5">
            <i data-lucide="play" class="w-4 h-4"></i> Buka Menu Meja Ini Sekarang
          </button>
          <button onclick="window.print()" class="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5">
            <i data-lucide="printer" class="w-4 h-4"></i> Cetak Format Kad Meja
          </button>
          <button onclick="document.getElementById('qr-single-modal').classList.add('hidden')" class="text-xs text-slate-400 hover:text-slate-700 py-1">
            Tutup
          </button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    if (window.lucide) lucide.createIcons();
  },

  openTableOrder: function(tableId) {
    this.selectedTableId = tableId;
    this.selectedOrderType = 'DINE_IN';
    App.navigateTo('cafe-pos', { table: tableId });
  },

  // 5. FOOD ORDERING & POS (Dine-in / Takeaway, Menu Cards, Cart, Payment)
  renderFoodOrdering: function(container, params = {}) {
    const menu = DB.get('menu') || [];
    const tables = DB.get('tables') || [];
    const settings = DB.get('settings') || {};
    const currency = settings.currencySymbol || 'RM';

    if (params.table) this.selectedTableId = params.table;

    // Filter available menu
    let availableMenu = menu.filter(m => m.status === 'AVAILABLE');
    if (this.activeCategoryFilter !== 'ALL') {
      availableMenu = availableMenu.filter(m => m.category === this.activeCategoryFilter);
    }
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      availableMenu = availableMenu.filter(m => m.name.toLowerCase().includes(q));
    }

    const categories = ['ALL', 'Rice', 'Noodles', 'Main Dish', 'Drinks', 'Dessert', 'Combo'];

    // Cart calculations
    let subtotal = 0;
    this.cart.forEach(item => {
      subtotal += (item.unitPrice * item.quantity);
    });
    const discount = 0.00;
    const grandTotal = Math.max(0, subtotal - discount);

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Header Mode & Dine-In / Takeaway Switcher -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold uppercase tracking-wide">
                CAFÉ GIATMARA ORDERING PORTAL
              </span>
            </div>
            <h1 class="text-xl font-black text-slate-900 mt-1">PESANAN MAKANAN & MINUMAN</h1>
            <p class="text-xs text-slate-500">Pilih sajian dan buat pesanan terus untuk Dapur Café</p>
          </div>

          <!-- Dine-In or Takeaway Selector -->
          <div class="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
            <button onclick="CafeModule.setOrderType('DINE_IN')" class="px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${this.selectedOrderType === 'DINE_IN' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
              <i data-lucide="utensils" class="w-3.5 h-3.5"></i> DINE-IN (Makan Sini)
            </button>
            <button onclick="CafeModule.setOrderType('TAKEAWAY')" class="px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${this.selectedOrderType === 'TAKEAWAY' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
              <i data-lucide="shopping-bag" class="w-3.5 h-3.5"></i> TAKEAWAY (Bungkus)
            </button>
          </div>
        </div>

        <!-- Details Bar based on type -->
        <div class="bg-amber-50/70 border border-amber-200 p-4 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
          ${this.selectedOrderType === 'DINE_IN' ? `
            <div class="flex items-center gap-3">
              <span class="font-bold text-amber-950 flex items-center gap-1.5">
                <i data-lucide="table" class="w-4 h-4 text-amber-600"></i> Meja Dipilih:
              </span>
              <select onchange="CafeModule.selectTable(this.value)" class="px-3 py-1.5 bg-white border border-amber-300 rounded-lg font-bold font-mono text-slate-900 focus:outline-none">
                ${tables.map(t => `
                  <option value="${t.id}" ${this.selectedTableId === t.id ? 'selected' : ''}>${t.name} (${t.location} - ${t.capacity} org)</option>
                `).join('')}
              </select>
            </div>
            <span class="text-amber-800 text-[11px] font-medium">* Pesanan akan dihantar terus ke nombor meja yang dipilih.</span>
          ` : `
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full">
              <div>
                <label class="block font-bold text-blue-900 text-[11px] mb-0.5">Nama Pelanggan *</label>
                <input type="text" id="takeaway-name" value="${this.takeawayCustomer.name}" oninput="CafeModule.takeawayCustomer.name = this.value" placeholder="cth: Cikgu Roslan" class="w-full px-3 py-1.5 bg-white border border-blue-200 rounded-lg text-xs font-semibold focus:outline-none">
              </div>
              <div>
                <label class="block font-bold text-blue-900 text-[11px] mb-0.5">No Telefon *</label>
                <input type="text" id="takeaway-phone" value="${this.takeawayCustomer.phone}" oninput="CafeModule.takeawayCustomer.phone = this.value" placeholder="cth: 019-1234567" class="w-full px-3 py-1.5 bg-white border border-blue-200 rounded-lg text-xs font-semibold focus:outline-none">
              </div>
              <div>
                <label class="block font-bold text-blue-900 text-[11px] mb-0.5">Masa Ambil (Pickup Time)</label>
                <input type="time" id="takeaway-time" value="${this.takeawayCustomer.pickupTime || '13:00'}" oninput="CafeModule.takeawayCustomer.pickupTime = this.value" class="w-full px-3 py-1.5 bg-white border border-blue-200 rounded-lg text-xs font-semibold focus:outline-none">
              </div>
            </div>
          `}
        </div>

        <!-- Main Workspace: 2-Columns (Menu Grid 65% + Cart 35%) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <!-- Left: Menu Grid -->
          <div class="lg:col-span-8 space-y-4">
            <!-- Filter & Search -->
            <div class="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
              <div class="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                ${categories.map(c => `
                  <button onclick="CafeModule.setPOSCategory('${c}')" class="px-3 py-1 rounded-lg text-xs font-bold transition whitespace-nowrap ${this.activeCategoryFilter === c ? 'bg-amber-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}">
                    ${c}
                  </button>
                `).join('')}
              </div>
              <div class="relative w-full sm:w-56">
                <i data-lucide="search" class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5"></i>
                <input type="text" value="${this.searchQuery}" oninput="CafeModule.searchPOS(this.value)" placeholder="Cari sajian..." class="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-amber-500">
              </div>
            </div>

            <!-- Menu Cards Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              ${availableMenu.map(m => `
                <div class="card-soft overflow-hidden flex flex-col justify-between hover:border-amber-400 transition">
                  <div>
                    <div class="relative h-36 overflow-hidden bg-slate-100">
                      <img src="${m.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'}" alt="${m.name}" class="w-full h-full object-cover transition hover:scale-105 duration-300">
                      <span class="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-white font-mono text-[10px] font-bold">
                        ${m.category}
                      </span>
                    </div>
                    <div class="p-3.5">
                      <h4 class="font-bold text-slate-900 text-xs line-clamp-1">${m.name}</h4>
                      <p class="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-tight">${m.description || '-'}</p>
                    </div>
                  </div>

                  <div class="p-3.5 pt-0 flex items-center justify-between mt-2">
                    <div>
                      <span class="text-[10px] text-slate-400 font-semibold uppercase">Harga</span>
                      <div class="font-mono font-black text-amber-600 text-sm">${currency} ${(m.sellingPrice || 0).toFixed(2)}</div>
                    </div>
                    <button onclick="CafeModule.addToCart('${m.id}')" class="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition active:scale-95">
                      <i data-lucide="plus" class="w-3.5 h-3.5"></i> Tambah
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Right: Cart & Order Summary -->
          <div class="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-lg p-5 sticky top-20 flex flex-col min-h-[500px]">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div class="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <i data-lucide="shopping-cart" class="w-4 h-4 text-amber-500"></i>
                Troli Pesanan (${this.cart.reduce((a, b) => a + b.quantity, 0)} Item)
              </div>
              ${this.cart.length > 0 ? `
                <button onclick="CafeModule.clearCart()" class="text-xs text-rose-600 hover:underline font-semibold">Kosongkan</button>
              ` : ''}
            </div>

            <!-- Target destination badge -->
            <div class="my-3 p-2.5 rounded-xl text-xs font-bold flex items-center justify-between ${this.selectedOrderType === 'DINE_IN' ? 'bg-amber-50 text-amber-900 border border-amber-200' : 'bg-blue-50 text-blue-900 border border-blue-200'}">
              <span>${this.selectedOrderType === 'DINE_IN' ? '📍 DINE-IN: ' + this.selectedTableId : '🛍 TAKEAWAY: ' + (this.takeawayCustomer.name || 'Bungkus')}</span>
              <span class="text-[10px] uppercase">${this.selectedOrderType}</span>
            </div>

            <!-- Cart Items List -->
            <div class="flex-1 overflow-y-auto divide-y divide-slate-100 max-h-72 my-2 pr-1">
              ${this.cart.length === 0 ? `
                <div class="py-12 text-center text-slate-400 text-xs">
                  <i data-lucide="shopping-basket" class="w-10 h-10 mx-auto text-slate-300 mb-2"></i>
                  Troli masih kosong.<br>Sila pilih menu dari senarai sebelah.
                </div>
              ` : this.cart.map((item, idx) => `
                <div class="py-2.5 flex items-center justify-between text-xs">
                  <div class="flex-1 pr-2">
                    <div class="font-bold text-slate-800">${item.name}</div>
                    <div class="text-[11px] text-slate-400 font-mono">${currency} ${item.unitPrice.toFixed(2)} / unit</div>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                      <button onclick="CafeModule.changeCartQty(${idx}, -1)" class="px-2 py-0.5 text-slate-600 hover:bg-slate-200 font-bold">-</button>
                      <span class="px-2 font-mono font-bold text-slate-900">${item.quantity}</span>
                      <button onclick="CafeModule.changeCartQty(${idx}, 1)" class="px-2 py-0.5 text-slate-600 hover:bg-slate-200 font-bold">+</button>
                    </div>
                    <span class="font-mono font-bold text-slate-900 w-16 text-right">${currency} ${(item.unitPrice * item.quantity).toFixed(2)}</span>
                    <button onclick="CafeModule.removeCartItem(${idx})" class="text-slate-300 hover:text-rose-600 p-1">
                      <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- Price Breakdown & Checkout -->
            <div class="pt-4 border-t border-slate-200 space-y-2 text-xs">
              <div class="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span class="font-mono font-semibold">${currency} ${subtotal.toFixed(2)}</span>
              </div>
              <div class="flex justify-between text-slate-600">
                <span>Diskaun:</span>
                <span class="font-mono font-semibold text-rose-600">- ${currency} ${discount.toFixed(2)}</span>
              </div>
              <div class="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-100">
                <span>Jumlah Keseluruhan:</span>
                <span class="font-mono text-base text-amber-600 font-black">${currency} ${grandTotal.toFixed(2)}</span>
              </div>

              <button onclick="CafeModule.openCheckoutModal()" ${this.cart.length === 0 ? 'disabled' : ''} class="w-full mt-3 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2">
                <i data-lucide="credit-card" class="w-4 h-4"></i> Sahkan & Bayar (${currency} ${grandTotal.toFixed(2)})
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  setOrderType: function(type) {
    this.selectedOrderType = type;
    this.render('pos');
  },

  selectTable: function(tableId) {
    this.selectedTableId = tableId;
    this.render('pos');
  },

  setPOSCategory: function(c) {
    this.activeCategoryFilter = c;
    this.render('pos');
  },

  searchPOS: function(q) {
    this.searchQuery = q;
    this.render('pos');
  },

  addToCart: function(menuId) {
    const menuList = DB.get('menu') || [];
    const item = menuList.find(m => m.id === menuId);
    if (!item) return;

    const existing = this.cart.find(c => c.menuId === menuId);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.cart.push({
        menuId: item.id,
        name: item.name,
        unitPrice: item.sellingPrice,
        costPrice: item.costPrice,
        quantity: 1
      });
    }

    App.showToast(`Ditambah: ${item.name}`, 'info');
    this.render('pos');
  },

  changeCartQty: function(index, delta) {
    if (this.cart[index]) {
      this.cart[index].quantity += delta;
      if (this.cart[index].quantity <= 0) {
        this.cart.splice(index, 1);
      }
    }
    this.render('pos');
  },

  removeCartItem: function(index) {
    this.cart.splice(index, 1);
    this.render('pos');
  },

  clearCart: function() {
    this.cart = [];
    this.render('pos');
  },

  // 6. CHECKOUT & PAYMENT MODAL
  openCheckoutModal: function() {
    if (this.cart.length === 0) {
      App.showToast('Troli anda kosong!', 'warning');
      return;
    }

    if (this.selectedOrderType === 'TAKEAWAY') {
      const name = document.getElementById('takeaway-name')?.value || this.takeawayCustomer.name;
      const phone = document.getElementById('takeaway-phone')?.value || this.takeawayCustomer.phone;
      if (!name || !phone) {
        App.showToast('Sila masukkan Nama & No Telefon Pelanggan untuk Takeaway!', 'warning');
        return;
      }
      this.takeawayCustomer.name = name;
      this.takeawayCustomer.phone = phone;
      this.takeawayCustomer.pickupTime = document.getElementById('takeaway-time')?.value || this.takeawayCustomer.pickupTime;
    }

    const settings = DB.get('settings') || {};
    const currency = settings.currencySymbol || 'RM';

    let subtotal = 0;
    this.cart.forEach(item => {
      subtotal += (item.unitPrice * item.quantity);
    });
    const grandTotal = subtotal;

    let modal = document.getElementById('cafe-checkout-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'cafe-checkout-modal';
      modal.className = 'fixed inset-0 z-50 flex items-center justify-center modal-backdrop p-4 overflow-y-auto';
      document.body.appendChild(modal);
    }

    const qrPaymentPlaceholder = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=DUITNOW-TRIG-GIATMARA-RM${grandTotal.toFixed(2)}`;

    modal.innerHTML = `
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 modal-animate-in">
        <div class="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h3 class="font-black text-slate-900 text-base">Pembayaran & Pengesahan Pesanan</h3>
            <p class="text-xs text-slate-500">TRIG GIATMARA KANGAR Café POS</p>
          </div>
          <button onclick="document.getElementById('cafe-checkout-modal').classList.add('hidden')" class="text-slate-400 hover:text-slate-700">
            <i data-lucide="x"></i>
          </button>
        </div>

        <div class="my-4 space-y-3 text-xs">
          <!-- Order Summary Card -->
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div class="flex justify-between font-bold text-slate-800">
              <span>Jenis: ${this.selectedOrderType === 'DINE_IN' ? 'DINE-IN (' + this.selectedTableId + ')' : 'TAKEAWAY / BUNGKUS'}</span>
              <span class="font-mono text-amber-600 text-sm">${currency} ${grandTotal.toFixed(2)}</span>
            </div>
            ${this.selectedOrderType === 'TAKEAWAY' ? `
              <div class="text-[11px] text-slate-500 mt-1">Nama: <b>${this.takeawayCustomer.name}</b> (${this.takeawayCustomer.phone}) • Ambil: ${this.takeawayCustomer.pickupTime || 'Segera'}</div>
            ` : ''}
            <div class="text-[11px] text-slate-600 mt-2 border-t border-slate-200 pt-1.5">
              ${this.cart.map(c => `${c.quantity}x ${c.name}`).join(', ')}
            </div>
          </div>

          <!-- Select Payment Method -->
          <div>
            <label class="block font-bold text-slate-700 mb-1.5">Pilih Kaedah Pembayaran</label>
            <div class="grid grid-cols-2 gap-2">
              <label class="p-3 border border-slate-200 rounded-xl flex items-center gap-2 cursor-pointer has-[:checked]:border-amber-500 has-[:checked]:bg-amber-50">
                <input type="radio" name="payMethod" value="QR_PAYMENT" checked onchange="CafeModule.togglePaymentUi(this.value)" class="text-amber-500">
                <div>
                  <div class="font-bold text-slate-900">QR DuitNow</div>
                  <div class="text-[10px] text-slate-500">Imbas Kod QR</div>
                </div>
              </label>

              <label class="p-3 border border-slate-200 rounded-xl flex items-center gap-2 cursor-pointer has-[:checked]:border-amber-500 has-[:checked]:bg-amber-50">
                <input type="radio" name="payMethod" value="CASH" onchange="CafeModule.togglePaymentUi(this.value)" class="text-amber-500">
                <div>
                  <div class="font-bold text-slate-900">Tunai (Cash)</div>
                  <div class="text-[10px] text-slate-500">Bayar di Kaunter</div>
                </div>
              </label>
            </div>
          </div>

          <!-- QR Payment Simulation Box -->
          <div id="qr-payment-box" class="p-4 bg-white border border-slate-200 rounded-xl text-center">
            <div class="text-[11px] text-slate-500 mb-2">Imbas Kod QR DuitNow Merchant GIATMARA Kangar:</div>
            <img src="${qrPaymentPlaceholder}" alt="QR DuitNow" class="w-36 h-36 mx-auto rounded-lg border border-slate-200">
            <div class="mt-2 font-mono font-bold text-slate-900 text-sm">JUMLAH: ${currency} ${grandTotal.toFixed(2)}</div>
            <p class="text-[10px] text-slate-400 mt-1">Gunakan butang di bawah untuk simulasi pembayaran berjaya.</p>
          </div>

          <!-- Cash Payment Box (hidden by default) -->
          <div id="cash-payment-box" class="p-3 bg-slate-50 border border-slate-200 rounded-xl hidden space-y-2">
            <div class="flex justify-between items-center">
              <label class="font-bold text-slate-700">Jumlah Diterima (RM):</label>
              <input type="number" id="cash-received" value="${grandTotal.toFixed(2)}" oninput="CafeModule.calcCashChange(${grandTotal})" class="w-28 px-2 py-1 bg-white border border-slate-300 rounded font-mono font-bold text-right">
            </div>
            <div class="flex justify-between items-center text-slate-700">
              <span>Baki Tunai (Change):</span>
              <span id="cash-change" class="font-mono font-bold text-emerald-700">RM 0.00</span>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-2 pt-3 border-t border-slate-200">
          <button onclick="CafeModule.processOrderSubmission('PAID')" class="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-2">
            <i data-lucide="check-circle" class="w-4 h-4"></i> SIMULATE PAYMENT SUCCESS (Bayar & Hantar ke Dapur)
          </button>
          <button onclick="CafeModule.processOrderSubmission('PENDING')" class="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition">
            Hantar Pesanan (Bayar Nanti di Kaunter)
          </button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    if (window.lucide) lucide.createIcons();
  },

  togglePaymentUi: function(method) {
    const qrBox = document.getElementById('qr-payment-box');
    const cashBox = document.getElementById('cash-payment-box');
    if (method === 'CASH') {
      qrBox?.classList.add('hidden');
      cashBox?.classList.remove('hidden');
    } else {
      qrBox?.classList.remove('hidden');
      cashBox?.classList.add('hidden');
    }
  },

  calcCashChange: function(total) {
    const received = parseFloat(document.getElementById('cash-received')?.value) || 0;
    const change = Math.max(0, received - total);
    const changeEl = document.getElementById('cash-change');
    if (changeEl) changeEl.innerText = `RM ${change.toFixed(2)}`;
  },

  // Final Order Processing & Ledger recording
  processOrderSubmission: function(paymentStatus = 'PAID') {
    const orders = DB.get('orders') || [];
    const sales = DB.get('sales') || [];
    const tables = DB.get('tables') || [];
    const currentUser = Auth.getCurrentUser() || { name: 'Pelanggan QR' };

    const orderId = DB.generateId('ORD');
    const receiptNum = DB.generateId('CAF');
    const nowStr = new Date().toLocaleString('en-MY', { hour12: false });

    let subtotal = 0;
    let totalCost = 0;
    const orderItems = this.cart.map(c => {
      const lineCost = (c.costPrice || 0) * c.quantity;
      const lineTotal = c.unitPrice * c.quantity;
      subtotal += lineTotal;
      totalCost += lineCost;
      return {
        menuId: c.menuId,
        name: c.name,
        quantity: c.quantity,
        unitPrice: c.unitPrice,
        costPrice: c.costPrice || 0,
        subtotal: lineTotal
      };
    });

    const profit = subtotal - totalCost;

    const newOrder = {
      id: orderId,
      receiptNumber: receiptNum,
      orderType: this.selectedOrderType,
      tableId: this.selectedOrderType === 'DINE_IN' ? this.selectedTableId : null,
      tableName: this.selectedOrderType === 'DINE_IN' ? `Meja ${this.selectedTableId}` : 'Takeaway',
      customerName: this.selectedOrderType === 'DINE_IN' ? `Pelanggan Meja ${this.selectedTableId}` : (this.takeawayCustomer.name || 'Takeaway'),
      customerPhone: this.selectedOrderType === 'TAKEAWAY' ? this.takeawayCustomer.phone : '',
      pickupTime: this.selectedOrderType === 'TAKEAWAY' ? this.takeawayCustomer.pickupTime : '',
      items: orderItems,
      subtotal: subtotal,
      discount: 0.00,
      total: subtotal,
      totalCost: totalCost,
      profit: profit,
      paymentMethod: document.querySelector('input[name="payMethod"]:checked')?.value || 'QR_PAYMENT',
      paymentStatus: paymentStatus,
      paymentRef: 'DUITNOW-CAF-' + Date.now().toString().slice(-5),
      orderStatus: 'NEW', // Order Flow starts as NEW
      orderTime: nowStr,
      prepTime: null,
      readyTime: null,
      completedTime: null,
      cashier: currentUser.name
    };

    orders.unshift(newOrder);
    DB.save('orders', orders);

    // If DINE_IN, mark table as OCCUPIED
    if (this.selectedOrderType === 'DINE_IN') {
      const tbl = tables.find(t => t.id === this.selectedTableId);
      if (tbl) {
        tbl.status = 'OCCUPIED';
        tbl.activeOrderId = orderId;
        DB.save('tables', tables);
      }
    }

    // Record Unified Sales Entry if PAID
    if (paymentStatus === 'PAID') {
      const newSale = {
        id: DB.generateId('SAL'),
        module: 'CAFÉ',
        referenceId: orderId,
        receiptNumber: receiptNum,
        customer: newOrder.customerName,
        itemsSummary: orderItems.map(i => `${i.quantity}x ${i.name}`).join(', '),
        costPrice: totalCost,
        sellingPrice: subtotal,
        profit: profit,
        paymentMethod: newOrder.paymentMethod,
        paymentStatus: 'PAID',
        date: nowStr.split(' ')[0],
        time: nowStr.split(' ')[1] || '',
        cashier: currentUser.name
      };
      sales.unshift(newSale);
      DB.save('sales', sales);
    }

    // Send Notification to Kitchen
    DB.addNotification(
      'Pesanan Dapur Baru Diterima',
      `Pesanan ${orderId} (${newOrder.tableName}) mengandungi ${orderItems.length} item telah masuk ke Kitchen Display.`,
      'INFO',
      'CAFE'
    );

    DB.logAudit(currentUser.role, 'Pesanan Café Dihantar', 'CAFE', `Pesanan ${orderId} (${receiptNum}) dihantar. Jumlah: RM ${subtotal.toFixed(2)}.`);

    // Reset cart & close checkout modal
    this.cart = [];
    document.getElementById('cafe-checkout-modal')?.classList.add('hidden');

    App.showToast('Pesanan berjaya dihantar ke dapur!', 'success');

    // Prompt receipt preview
    ReceiptEngine.preview(newOrder, '80mm');
    this.render('orders');
  },

  // 7. KITCHEN ORDER DISPLAY (KDS)
  activeKitchenFilter: 'ALL',

  renderKitchenDisplay: function(container) {
    const orders = DB.get('orders') || [];
    const settings = DB.get('settings') || {};
    const currency = settings.currencySymbol || 'RM';

    let kitchenOrders = orders;
    if (this.activeKitchenFilter !== 'ALL') {
      kitchenOrders = kitchenOrders.filter(o => o.orderStatus === this.activeKitchenFilter);
    } else {
      // Exclude completed/cancelled in general view unless requested
      kitchenOrders = kitchenOrders.filter(o => ['NEW', 'CONFIRMED', 'PREPARING', 'READY'].includes(o.orderStatus));
    }

    const filters = ['ALL', 'NEW', 'PREPARING', 'READY', 'COMPLETED'];

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl shadow-md">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-2xl">
              <i data-lucide="chef-hat"></i>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span class="text-xs text-amber-400 font-bold uppercase tracking-wider">LIVE KITCHEN DISPLAY SYSTEM (KDS)</span>
              </div>
              <h1 class="text-xl font-black tracking-tight">Dapur & Operasi Sajian GIATMARA</h1>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button onclick="CafeModule.render('kitchen')" class="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1">
              <i data-lucide="refresh-cw" class="w-4 h-4"></i> Muat Semula
            </button>
            <button onclick="App.navigateTo('cafe-pos')" class="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm">
              <i data-lucide="plus" class="w-4 h-4"></i> Tambah Order
            </button>
          </div>
        </div>

        <!-- Filter Tabs -->
        <div class="flex items-center gap-2 overflow-x-auto pb-1">
          ${filters.map(f => `
            <button onclick="CafeModule.setKitchenFilter('${f}')" class="px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${this.activeKitchenFilter === f ? 'bg-amber-500 text-slate-950 shadow-sm' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'}">
              ${f === 'ALL' ? 'Semua Aktif Dapur' : f}
            </button>
          `).join('')}
        </div>

        <!-- Kitchen Order Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          ${kitchenOrders.length === 0 ? `
            <div class="col-span-full py-16 text-center bg-white rounded-2xl border border-slate-200">
              <i data-lucide="utensils-crossed" class="w-12 h-12 mx-auto text-slate-300 mb-3"></i>
              <h3 class="font-bold text-slate-800 text-sm">Tiada Pesanan Menunggu di Dapur</h3>
              <p class="text-xs text-slate-500 mt-1">Semua hidangan telah siap disediakan dan dihantar.</p>
            </div>
          ` : kitchenOrders.map(o => {
            let cardHeaderBg = 'bg-blue-600 text-white';
            if (o.orderStatus === 'PREPARING') cardHeaderBg = 'bg-amber-500 text-slate-950';
            if (o.orderStatus === 'READY') cardHeaderBg = 'bg-emerald-600 text-white';

            return `
              <div class="bg-white rounded-2xl border-2 ${o.orderStatus === 'NEW' ? 'border-blue-500 shadow-md animate-soft-pulse' : 'border-slate-200'} overflow-hidden flex flex-col justify-between shadow-sm">
                <!-- Card Header with Table / Takeaway indicator -->
                <div>
                  <div class="p-4 ${cardHeaderBg} flex items-center justify-between">
                    <div>
                      <div class="font-mono font-black text-base">${o.id}</div>
                      <div class="text-xs font-semibold opacity-90">${o.orderTime}</div>
                    </div>
                    <div class="text-right">
                      <div class="font-black text-sm uppercase px-2.5 py-0.5 rounded-lg bg-black/20 backdrop-blur-sm">
                        ${o.orderType === 'DINE_IN' ? '🍽 ' + (o.tableName || o.tableId) : '🛍 TAKEAWAY'}
                      </div>
                      ${o.orderType === 'TAKEAWAY' ? `<div class="text-[10px] font-medium mt-0.5">${o.customerName} (${o.customerPhone})</div>` : ''}
                    </div>
                  </div>

                  <!-- Item List -->
                  <div class="p-4 space-y-2.5">
                    <div class="text-xs font-bold text-slate-400 uppercase tracking-wider">Senarai Sajian:</div>
                    <div class="space-y-2">
                      ${o.items.map(it => `
                        <div class="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <div class="flex items-center gap-2.5">
                            <span class="w-6 h-6 rounded-lg bg-amber-100 text-amber-900 font-mono font-black text-xs flex items-center justify-center">
                              ${it.quantity}
                            </span>
                            <span class="font-bold text-slate-900 text-xs">${it.name}</span>
                          </div>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                </div>

                <!-- Footer Actions based on state -->
                <div class="p-4 bg-slate-50 border-t border-slate-100 flex flex-col gap-2">
                  <div class="flex justify-between items-center text-xs">
                    <span class="text-slate-500">Status Semasa:</span>
                    <span class="badge-status status-${o.orderStatus.toLowerCase()} text-[10px]">${o.orderStatus}</span>
                  </div>

                  <div class="grid grid-cols-2 gap-2 mt-1">
                    ${o.orderStatus === 'NEW' ? `
                      <button onclick="CafeModule.updateOrderStatus('${o.id}', 'PREPARING')" class="col-span-2 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm">
                        <i data-lucide="chef-hat" class="w-4 h-4"></i> TERIMA & MULA MASAK
                      </button>
                    ` : o.orderStatus === 'PREPARING' ? `
                      <button onclick="CafeModule.updateOrderStatus('${o.id}', 'READY')" class="col-span-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm">
                        <i data-lucide="bell" class="w-4 h-4"></i> SAJIAN SIAP (READY)
                      </button>
                    ` : o.orderStatus === 'READY' ? `
                      <button onclick="CafeModule.updateOrderStatus('${o.id}', 'COMPLETED')" class="col-span-2 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm">
                        <i data-lucide="check" class="w-4 h-4"></i> SELESAI HANTAR / DIAMBIL
                      </button>
                    ` : `
                      <button onclick="ReceiptEngine.preview(DB.get('orders').find(x => x.id === '${o.id}'), '80mm')" class="col-span-2 py-2 bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1">
                        <i data-lucide="receipt" class="w-4 h-4"></i> Cetak Resit
                      </button>
                    `}
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },

  setKitchenFilter: function(f) {
    this.activeKitchenFilter = f;
    this.render('kitchen');
  },

  updateOrderStatus: function(orderId, newStatus) {
    const orders = DB.get('orders') || [];
    const tables = DB.get('tables') || [];
    const nowStr = new Date().toLocaleString('en-MY', { hour12: false });
    const order = orders.find(o => o.id === orderId);

    if (order) {
      order.orderStatus = newStatus;
      if (newStatus === 'PREPARING') order.prepTime = nowStr;
      if (newStatus === 'READY') order.readyTime = nowStr;
      if (newStatus === 'COMPLETED') {
        order.completedTime = nowStr;
        // Release table if Dine-in
        if (order.tableId) {
          const tbl = tables.find(t => t.id === order.tableId);
          if (tbl) {
            tbl.status = 'CLEANING'; // Set to CLEANING for hygiene
            tbl.activeOrderId = null;
            DB.save('tables', tables);
          }
        }
      }

      DB.save('orders', orders);
      DB.logAudit('CAFE_STAFF', 'Kemaskini Status Pesanan Makanan', 'CAFE', `Pesanan ${orderId} kini berstatus ${newStatus}.`);
      App.showToast(`Pesanan ${orderId} dikemaskini kepada ${newStatus}!`, 'success');
      this.render('kitchen');
    }
  },

  // 8. ORDERS MASTER LIST
  renderOrdersList: function(container) {
    const orders = DB.get('orders') || [];
    const settings = DB.get('settings') || {};
    const currency = settings.currencySymbol || 'RM';

    container.innerHTML = `
      <div class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <div class="flex items-center gap-2 text-xs text-slate-500 font-semibold mb-1">
              <a href="javascript:void(0)" onclick="App.navigateTo('cafe-dashboard')" class="hover:underline">Café GIATMARA</a> &rarr; <span>Senarai Pesanan</span>
            </div>
            <h1 class="text-xl font-bold text-slate-900">Senarai Keseluruhan Pesanan Makanan</h1>
            <p class="text-xs text-slate-500">Jejak status masa nyata, rekod bayaran dan cetakan semula resit</p>
          </div>
          <button onclick="App.navigateTo('cafe-pos')" class="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition">
            <i data-lucide="plus-circle" class="w-4 h-4"></i> Pesanan Baru
          </button>
        </div>

        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th class="p-4">No Pesanan & Tarikh</th>
                  <th class="p-4">Jenis & Meja/Pelanggan</th>
                  <th class="p-4">Item Sajian</th>
                  <th class="p-4 text-right">Jumlah (RM)</th>
                  <th class="p-4 text-center">Bayaran</th>
                  <th class="p-4 text-center">Status Pesanan</th>
                  <th class="p-4 text-center">Tindakan</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${orders.map(o => `
                  <tr class="hover:bg-slate-50 transition">
                    <td class="p-4">
                      <div class="font-mono font-bold text-slate-900">${o.id}</div>
                      <div class="text-[10px] text-slate-400 mt-0.5">${o.orderTime}</div>
                    </td>
                    <td class="p-4">
                      <span class="px-2.5 py-1 rounded-md text-[11px] font-bold ${o.orderType === 'DINE_IN' ? 'bg-amber-100 text-amber-900' : 'bg-blue-100 text-blue-900'}">
                        ${o.orderType === 'DINE_IN' ? '🍽 ' + (o.tableName || o.tableId) : '🛍 ' + (o.customerName || 'Takeaway')}
                      </span>
                    </td>
                    <td class="p-4">
                      <div class="text-slate-700 line-clamp-2 max-w-xs">
                        ${o.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                      </div>
                    </td>
                    <td class="p-4 text-right font-mono font-bold text-slate-900">
                      ${currency} ${(o.total || 0).toFixed(2)}
                    </td>
                    <td class="p-4 text-center">
                      <span class="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${o.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
                        ${o.paymentStatus || 'PENDING'}
                      </span>
                    </td>
                    <td class="p-4 text-center">
                      <span class="badge-status status-${o.orderStatus.toLowerCase()} text-[10px]">
                        ${o.orderStatus}
                      </span>
                    </td>
                    <td class="p-4 text-center">
                      <div class="inline-flex items-center gap-1.5">
                        <button onclick="ReceiptEngine.preview(DB.get('orders').find(x => x.id === '${o.id}'), '80mm')" class="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition" title="Cetak Resit">
                          <i data-lucide="receipt" class="w-4 h-4"></i>
                        </button>
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
  }
};
