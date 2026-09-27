/**
 * TRIG GIATMARA KANGAR - Inventory & Stock Movement Management
 * Centralized multi-category inventory, real-time audit ledger, low-stock threshold triggers, and supplier hub.
 */

const InventoryModule = {
  currentCategory: 'ALL',
  searchQuery: '',

  render: function(subview = 'list', params = {}) {
    const container = document.getElementById('main-content-view');
    if (!container) return;

    switch (subview) {
      case 'movements':
      case 'transactions':
        this.renderTransactions(container);
        break;
      case 'low':
      case 'low-stock':
        this.renderLowStock(container);
        break;
      case 'suppliers':
        this.renderSuppliers(container);
        break;
      case 'list':
      default:
        this.renderInventoryList(container);
        break;
    }

    if (window.lucide) lucide.createIcons();
  },

  // 1. INVENTORY MASTER LIST
  renderInventoryList: function(container) {
    const inventory = DB.get('inventory') || [];
    const settings = DB.get('settings') || {};
    const currency = settings.currencySymbol || 'RM';

    const categories = [
      'ALL',
      'Smartphone Spare Parts',
      'Smartphone Accessories',
      'Café Raw Materials',
      'Food Packaging'
    ];

    let filtered = inventory;
    if (this.currentCategory !== 'ALL') {
      filtered = filtered.filter(i => i.category === this.currentCategory);
    }
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(i => i.name.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q) || i.id.toLowerCase().includes(q));
    }

    const lowCount = inventory.filter(i => i.currentStock <= i.minStock).length;

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <div class="flex items-center gap-2 text-xs text-slate-500 font-semibold mb-1">
              <span>Pengurusan Inventori</span> &rarr; <span>Senarai Stok Pusat</span>
            </div>
            <h1 class="text-xl font-bold text-slate-900">Inventori Bersepadu & Kawalan Stok</h1>
            <p class="text-xs text-slate-500">Kawal alat ganti smartphone, aksesori, bahan mentah café dan pembungkusan.</p>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <button onclick="InventoryModule.openItemModal()" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition">
              <i data-lucide="plus-circle" class="w-4 h-4"></i> Tambah Item Stok
            </button>
            <button onclick="App.navigateTo('inventory-low')" class="px-4 py-2 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 rounded-xl text-xs font-bold flex items-center gap-1.5 transition">
              <i data-lucide="alert-triangle" class="w-4 h-4 text-rose-600"></i> Amaran Stok Rendah (${lowCount})
            </button>
          </div>
        </div>

        <!-- Filter & Search Bar -->
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            ${categories.map(c => `
              <button onclick="InventoryModule.filterCategory('${c}')" class="px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${this.currentCategory === c ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}">
                ${c}
              </button>
            `).join('')}
          </div>

          <div class="relative w-full md:w-72">
            <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3 top-3"></i>
            <input type="text" value="${this.searchQuery}" oninput="InventoryModule.searchItems(this.value)" placeholder="Cari nama item, SKU, ID..." class="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500">
          </div>
        </div>

        <!-- Table -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th class="p-4">SKU & Nama Item</th>
                  <th class="p-4">Kategori & Lokasi</th>
                  <th class="p-4">Pembekal</th>
                  <th class="p-4 text-right">Harga Kos</th>
                  <th class="p-4 text-right">Harga Jual</th>
                  <th class="p-4 text-center">Baki Stok</th>
                  <th class="p-4 text-center">Paras Min</th>
                  <th class="p-4 text-center">Status</th>
                  <th class="p-4 text-center">Tindakan</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${filtered.map(i => {
                  const isLow = i.currentStock <= i.minStock;
                  return `
                    <tr class="hover:bg-slate-50 transition ${isLow ? 'bg-rose-50/40' : ''}">
                      <td class="p-4">
                        <div class="font-bold text-slate-900">${i.name}</div>
                        <div class="font-mono text-[10px] text-blue-700 font-bold mt-0.5">SKU: ${i.sku}</div>
                      </td>
                      <td class="p-4">
                        <div class="font-semibold text-slate-700">${i.category}</div>
                        <div class="text-[10px] text-slate-400">${i.location || '-'}</div>
                      </td>
                      <td class="p-4 text-slate-600 text-[11px]">${i.supplier || '-'}</td>
                      <td class="p-4 text-right font-mono text-slate-700">${currency} ${(i.costPrice || 0).toFixed(2)}</td>
                      <td class="p-4 text-right font-mono font-bold text-slate-900">${i.sellingPrice > 0 ? currency + ' ' + i.sellingPrice.toFixed(2) : '-'}</td>
                      <td class="p-4 text-center">
                        <span class="font-mono font-black text-sm ${isLow ? 'text-rose-600 animate-pulse' : 'text-slate-900'}">
                          ${i.currentStock} ${i.unit}
                        </span>
                      </td>
                      <td class="p-4 text-center font-mono font-semibold text-slate-500">${i.minStock} ${i.unit}</td>
                      <td class="p-4 text-center">
                        <span class="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${isLow ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}">
                          ${isLow ? 'LOW STOCK' : 'AVAILABLE'}
                        </span>
                      </td>
                      <td class="p-4 text-center">
                        <div class="inline-flex items-center gap-1">
                          <button onclick="InventoryModule.openAdjustStockModal('${i.id}')" class="p-1.5 text-cyan-600 hover:bg-cyan-50 rounded-lg transition" title="Laras Stok">
                            <i data-lucide="sliders" class="w-4 h-4"></i>
                          </button>
                          <button onclick="InventoryModule.openItemModal('${i.id}')" class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit">
                            <i data-lucide="edit-2" class="w-4 h-4"></i>
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

  filterCategory: function(c) {
    this.currentCategory = c;
    this.render('list');
  },

  searchItems: function(q) {
    this.searchQuery = q;
    this.render('list');
  },

  // 2. STOCK MOVEMENT TRANSACTION LEDGER
  renderTransactions: function(container) {
    const txns = DB.get('inventoryTransactions') || [];

    container.innerHTML = `
      <div class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <div class="flex items-center gap-2 text-xs text-slate-500 font-semibold mb-1">
              <a href="javascript:void(0)" onclick="App.navigateTo('inventory-list')" class="hover:underline">Inventori</a> &rarr; <span>Pergerakan Stok</span>
            </div>
            <h1 class="text-xl font-bold text-slate-900">Lejar Pergerakan Stok (Stock Movement)</h1>
            <p class="text-xs text-slate-500">Audit keluar masuk stok: Belian, Repair, Jualan POS & Pelarasan.</p>
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th class="p-4">Tarikh & Masa</th>
                  <th class="p-4">Item & Nama</th>
                  <th class="p-4">Jenis Transaksi</th>
                  <th class="p-4 text-center">Kuantiti</th>
                  <th class="p-4 text-center">Sebelum &rarr; Selepas</th>
                  <th class="p-4">No Rujukan</th>
                  <th class="p-4">Pengguna (Staf)</th>
                  <th class="p-4">Catatan</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${txns.map(t => {
                  let badge = 'bg-slate-100 text-slate-700';
                  if (t.type === 'STOCK_IN') badge = 'bg-emerald-100 text-emerald-800';
                  if (t.type === 'USED_FOR_REPAIR') badge = 'bg-cyan-100 text-cyan-800';
                  if (t.type === 'SOLD') badge = 'bg-amber-100 text-amber-800';
                  if (t.type === 'DAMAGED' || t.type === 'STOCK_OUT') badge = 'bg-rose-100 text-rose-800';

                  return `
                    <tr class="hover:bg-slate-50 transition">
                      <td class="p-4 text-slate-500 font-mono text-[11px]">${t.date}</td>
                      <td class="p-4 font-bold text-slate-900">${t.itemName}</td>
                      <td class="p-4">
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${badge}">
                          ${t.type.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td class="p-4 text-center font-mono font-bold text-slate-900">
                        ${t.type === 'STOCK_IN' ? '+' : '-'}${t.quantity}
                      </td>
                      <td class="p-4 text-center font-mono text-slate-600">
                        ${t.stockBefore} &rarr; <b>${t.stockAfter}</b>
                      </td>
                      <td class="p-4 font-mono font-bold text-blue-700">${t.reference || '-'}</td>
                      <td class="p-4 text-slate-700 font-medium">${t.user}</td>
                      <td class="p-4 text-slate-500 italic max-w-xs truncate">${t.notes || '-'}</td>
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

  // 3. LOW STOCK ALERT SCREEN
  renderLowStock: function(container) {
    const inventory = DB.get('inventory') || [];
    const lowItems = inventory.filter(i => i.currentStock <= i.minStock);

    container.innerHTML = `
      <div class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-rose-50 border border-rose-200 p-6 rounded-2xl shadow-sm">
          <div>
            <div class="flex items-center gap-2 text-xs text-rose-700 font-bold mb-1">
              <i data-lucide="alert-triangle" class="w-4 h-4"></i> AMARAN PARAS STOK RENDAH
            </div>
            <h1 class="text-xl font-bold text-rose-950">Item Di Bawah Paras Minimum</h1>
            <p class="text-xs text-rose-800">Sistem mengesan ${lowItems.length} item yang memerlukan pesanan belian segera bagi memastikan operasi berjalan lancar.</p>
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th class="p-4">Item & SKU</th>
                  <th class="p-4">Kategori</th>
                  <th class="p-4">Pembekal Utama</th>
                  <th class="p-4 text-center">Baki Stok Semasa</th>
                  <th class="p-4 text-center">Paras Minimum</th>
                  <th class="p-4 text-center">Cadangan Tambah</th>
                  <th class="p-4 text-center">Tindakan</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${lowItems.map(item => `
                  <tr class="hover:bg-slate-50 transition bg-rose-50/20">
                    <td class="p-4">
                      <div class="font-bold text-slate-900">${item.name}</div>
                      <div class="font-mono text-[10px] text-slate-400 font-bold">SKU: ${item.sku}</div>
                    </td>
                    <td class="p-4 font-semibold text-slate-700">${item.category}</td>
                    <td class="p-4 text-slate-600">${item.supplier || '-'}</td>
                    <td class="p-4 text-center">
                      <span class="font-mono font-black text-rose-600 text-sm">${item.currentStock} ${item.unit}</span>
                    </td>
                    <td class="p-4 text-center font-mono font-semibold text-slate-700">${item.minStock} ${item.unit}</td>
                    <td class="p-4 text-center font-mono font-bold text-emerald-700">+${Math.max(5, item.minStock * 2)} ${item.unit}</td>
                    <td class="p-4 text-center">
                      <button onclick="ProcurementModule.createRequestFromItem('${item.id}')" class="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-sm transition flex items-center justify-center gap-1.5 mx-auto">
                        <i data-lucide="shopping-cart" class="w-3.5 h-3.5"></i> Buat Pesanan Belian (PR)
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

  // 4. SUPPLIER MANAGEMENT
  renderSuppliers: function(container) {
    const suppliers = DB.get('suppliers') || [];

    container.innerHTML = `
      <div class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <div class="flex items-center gap-2 text-xs text-slate-500 font-semibold mb-1">
              <a href="javascript:void(0)" onclick="App.navigateTo('inventory-list')" class="hover:underline">Inventori</a> &rarr; <span>Pembekal</span>
            </div>
            <h1 class="text-xl font-bold text-slate-900">Pengurusan Pembekal (Suppliers)</h1>
            <p class="text-xs text-slate-500">Senarai pembekal alat ganti smartphone, aksesori dan bahan makanan café.</p>
          </div>
          <button onclick="InventoryModule.openSupplierModal()" class="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition">
            <i data-lucide="plus-circle" class="w-4 h-4"></i> Tambah Pembekal Baru
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          ${suppliers.map(s => `
            <div class="card-soft p-5 border rounded-2xl flex flex-col justify-between space-y-4">
              <div>
                <div class="flex items-center justify-between">
                  <span class="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">${s.id}</span>
                  <span class="badge-status status-ready text-[9px]">${s.status}</span>
                </div>
                <h3 class="font-bold text-slate-900 text-sm mt-2">${s.name}</h3>
                <div class="text-xs text-slate-600 mt-0.5">Pegawai: <b>${s.contactPerson}</b></div>
                <div class="text-[11px] text-slate-500 mt-2 space-y-1">
                  <div>📞 ${s.phone}</div>
                  <div>✉ ${s.email}</div>
                  <div>📍 ${s.address}</div>
                </div>
                <div class="mt-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600">
                  <b>Kategori Bekalan:</b><br>${s.productCategory}
                </div>
              </div>

              <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button onclick="InventoryModule.openSupplierModal('${s.id}')" class="text-xs font-bold text-blue-600 hover:underline">
                  Kemaskini Profil &rarr;
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  // Modal Handlers
  openItemModal: function(itemId = null) {
    const inventory = DB.get('inventory') || [];
    const suppliers = DB.get('suppliers') || [];
    const item = itemId ? inventory.find(i => i.id === itemId) : null;
    const isEdit = !!item;

    let modal = document.getElementById('inventory-item-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'inventory-item-modal';
      modal.className = 'fixed inset-0 z-50 flex items-center justify-center modal-backdrop p-4 overflow-y-auto';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 modal-animate-in">
        <div class="flex items-center justify-between pb-4 border-b border-slate-200">
          <h3 class="font-bold text-slate-900 text-base">${isEdit ? 'Kemaskini Item Inventori' : 'Tambah Item Inventori Baru'}</h3>
          <button onclick="document.getElementById('inventory-item-modal').classList.add('hidden')" class="text-slate-400 hover:text-slate-700">
            <i data-lucide="x"></i>
          </button>
        </div>

        <form onsubmit="InventoryModule.saveItem(event, '${item ? item.id : ''}')" class="space-y-4 mt-4 text-xs">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">SKU Kod *</label>
              <input type="text" name="sku" value="${item ? item.sku : 'SKU-' + Date.now().toString().slice(-6)}" required class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold">
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Kategori Item *</label>
              <select name="category" required class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold">
                <option value="Smartphone Spare Parts" ${item && item.category === 'Smartphone Spare Parts' ? 'selected' : ''}>Smartphone Spare Parts</option>
                <option value="Smartphone Accessories" ${item && item.category === 'Smartphone Accessories' ? 'selected' : ''}>Smartphone Accessories</option>
                <option value="Café Raw Materials" ${item && item.category === 'Café Raw Materials' ? 'selected' : ''}>Café Raw Materials</option>
                <option value="Food Packaging" ${item && item.category === 'Food Packaging' ? 'selected' : ''}>Food Packaging</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Nama Item / Produk *</label>
            <input type="text" name="name" value="${item ? item.name : ''}" required placeholder="cth: LCD Samsung Galaxy A55" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold">
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Jenama (Brand)</label>
              <input type="text" name="brand" value="${item ? item.brand : ''}" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Model Bersesuaian</label>
              <input type="text" name="model" value="${item ? item.model : ''}" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Harga Kos (RM) *</label>
              <input type="number" step="0.10" min="0" name="costPrice" value="${item ? item.costPrice : 0}" required class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold">
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Harga Jualan (RM)</label>
              <input type="number" step="0.10" min="0" name="sellingPrice" value="${item ? item.sellingPrice : 0}" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-emerald-700">
            </div>
          </div>

          <div class="grid grid-cols-3 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Stok Semasa *</label>
              <input type="number" min="0" name="currentStock" value="${item ? item.currentStock : 10}" required class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold">
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Paras Minimum *</label>
              <input type="number" min="1" name="minStock" value="${item ? item.minStock : 5}" required class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-rose-700">
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Unit</label>
              <input type="text" name="unit" value="${item ? item.unit : 'Unit'}" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Pembekal</label>
              <select name="supplier" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium">
                ${suppliers.map(s => `
                  <option value="${s.name}" ${item && item.supplier === s.name ? 'selected' : ''}>${s.name}</option>
                `).join('')}
              </select>
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Lokasi Rak / Stor</label>
              <input type="text" name="location" value="${item ? item.location : 'Rak A-01'}" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
            </div>
          </div>

          <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button type="button" onclick="document.getElementById('inventory-item-modal').classList.add('hidden')" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition">
              Batal
            </button>
            <button type="submit" class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm transition">
              Simpan Item
            </button>
          </div>
        </form>
      </div>
    `;

    modal.classList.remove('hidden');
    if (window.lucide) lucide.createIcons();
  },

  saveItem: function(e, existingId) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inventory = DB.get('inventory') || [];

    const currentStock = parseInt(formData.get('currentStock')) || 0;
    const minStock = parseInt(formData.get('minStock')) || 5;

    if (existingId) {
      const idx = inventory.findIndex(i => i.id === existingId);
      if (idx !== -1) {
        inventory[idx] = {
          ...inventory[idx],
          sku: formData.get('sku'),
          category: formData.get('category'),
          name: formData.get('name'),
          brand: formData.get('brand'),
          model: formData.get('model'),
          costPrice: parseFloat(formData.get('costPrice')) || 0,
          sellingPrice: parseFloat(formData.get('sellingPrice')) || 0,
          currentStock: currentStock,
          minStock: minStock,
          unit: formData.get('unit'),
          supplier: formData.get('supplier'),
          location: formData.get('location'),
          status: currentStock <= minStock ? 'LOW_STOCK' : 'AVAILABLE'
        };
        DB.save('inventory', inventory);
        App.showToast('Item inventori dikemaskini!', 'success');
      }
    } else {
      const newItem = {
        id: 'INV-' + Date.now().toString().slice(-6),
        sku: formData.get('sku'),
        category: formData.get('category'),
        name: formData.get('name'),
        brand: formData.get('brand'),
        model: formData.get('model'),
        costPrice: parseFloat(formData.get('costPrice')) || 0,
        sellingPrice: parseFloat(formData.get('sellingPrice')) || 0,
        currentStock: currentStock,
        minStock: minStock,
        unit: formData.get('unit'),
        supplier: formData.get('supplier'),
        location: formData.get('location'),
        status: currentStock <= minStock ? 'LOW_STOCK' : 'AVAILABLE'
      };
      inventory.push(newItem);
      DB.save('inventory', inventory);
      App.showToast('Item inventori baru ditambah!', 'success');
    }

    document.getElementById('inventory-item-modal').classList.add('hidden');
    this.render('list');
  },

  openAdjustStockModal: function(itemId) {
    const inventory = DB.get('inventory') || [];
    const item = inventory.find(i => i.id === itemId);
    if (!item) return;

    let modal = document.getElementById('adjust-stock-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'adjust-stock-modal';
      modal.className = 'fixed inset-0 z-50 flex items-center justify-center modal-backdrop p-4';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 modal-animate-in">
        <h3 class="font-bold text-slate-900 text-base">Pelarasan Stok Item</h3>
        <p class="text-xs text-slate-500 mt-0.5">${item.name} (Baki Semasa: <b>${item.currentStock} ${item.unit}</b>)</p>

        <form onsubmit="InventoryModule.saveStockAdjustment(event, '${item.id}')" class="space-y-4 mt-4 text-xs">
          <div>
            <label class="block font-bold text-slate-700 mb-1">Jenis Pelarasan *</label>
            <select name="type" required class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold">
              <option value="STOCK_IN">STOCK IN (Tambah Stok Masuk)</option>
              <option value="ADJUSTMENT">ADJUSTMENT (Penetapan Semula Kiraan)</option>
              <option value="DAMAGED">DAMAGED (Stok Rosak/Pecah)</option>
              <option value="STOCK_OUT">STOCK OUT (Keluarkan Stok)</option>
            </select>
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Kuantiti *</label>
            <input type="number" min="1" name="quantity" required value="5" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold font-mono">
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Sebab / Catatan *</label>
            <input type="text" name="notes" required placeholder="cth: Pembelian runcit segera / stock take" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
          </div>

          <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button type="button" onclick="document.getElementById('adjust-stock-modal').classList.add('hidden')" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition">
              Batal
            </button>
            <button type="submit" class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm transition">
              Sahkan Pelarasan
            </button>
          </div>
        </form>
      </div>
    `;

    modal.classList.remove('hidden');
    if (window.lucide) lucide.createIcons();
  },

  saveStockAdjustment: function(e, itemId) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const type = formData.get('type');
    const qty = parseInt(formData.get('quantity')) || 0;
    const notes = formData.get('notes');

    if (type === 'STOCK_IN') {
      DB.addInventoryStock(itemId, qty, 'ADJ-MANUAL', notes);
    } else {
      DB.deductInventory(itemId, qty, 'ADJ-MANUAL', type, notes);
    }

    App.showToast('Pelarasan stok berjaya direkodkan!', 'success');
    document.getElementById('adjust-stock-modal').classList.add('hidden');
    this.render('list');
  },

  openSupplierModal: function(supplierId = null) {
    const suppliers = DB.get('suppliers') || [];
    const sup = supplierId ? suppliers.find(s => s.id === supplierId) : null;
    const isEdit = !!sup;

    let modal = document.getElementById('supplier-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'supplier-modal';
      modal.className = 'fixed inset-0 z-50 flex items-center justify-center modal-backdrop p-4';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 modal-animate-in">
        <h3 class="font-bold text-slate-900 text-base">${isEdit ? 'Kemaskini Pembekal' : 'Tambah Pembekal Baru'}</h3>
        <form onsubmit="InventoryModule.saveSupplier(event, '${sup ? sup.id : ''}')" class="space-y-4 mt-4 text-xs">
          <div>
            <label class="block font-bold text-slate-700 mb-1">Nama Syarikat Pembekal *</label>
            <input type="text" name="name" value="${sup ? sup.name : ''}" required class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold">
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">Nama Pegawai (Contact Person)</label>
            <input type="text" name="contactPerson" value="${sup ? sup.contactPerson : ''}" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">No Telefon *</label>
              <input type="text" name="phone" value="${sup ? sup.phone : ''}" required class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Emel</label>
              <input type="email" name="email" value="${sup ? sup.email : ''}" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
            </div>
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">Alamat</label>
            <textarea name="address" rows="2" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">${sup ? sup.address : ''}</textarea>
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">Kategori Produk Dibekalkan</label>
            <input type="text" name="productCategory" value="${sup ? sup.productCategory : ''}" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
          </div>

          <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button type="button" onclick="document.getElementById('supplier-modal').classList.add('hidden')" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition">
              Batal
            </button>
            <button type="submit" class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition">
              Simpan Pembekal
            </button>
          </div>
        </form>
      </div>
    `;

    modal.classList.remove('hidden');
    if (window.lucide) lucide.createIcons();
  },

  saveSupplier: function(e, existingId) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const suppliers = DB.get('suppliers') || [];

    if (existingId) {
      const idx = suppliers.findIndex(s => s.id === existingId);
      if (idx !== -1) {
        suppliers[idx] = {
          ...suppliers[idx],
          name: formData.get('name'),
          contactPerson: formData.get('contactPerson'),
          phone: formData.get('phone'),
          email: formData.get('email'),
          address: formData.get('address'),
          productCategory: formData.get('productCategory')
        };
        DB.save('suppliers', suppliers);
        App.showToast('Pembekal dikemaskini!', 'success');
      }
    } else {
      const newSup = {
        id: 'SUP-' + Math.floor(100 + Math.random() * 900),
        name: formData.get('name'),
        contactPerson: formData.get('contactPerson'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        address: formData.get('address'),
        productCategory: formData.get('productCategory'),
        notes: '',
        status: 'ACTIVE'
      };
      suppliers.push(newSup);
      DB.save('suppliers', suppliers);
      App.showToast('Pembekal baru ditambah!', 'success');
    }

    document.getElementById('supplier-modal').classList.add('hidden');
    this.render('suppliers');
  }
};
