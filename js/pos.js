/**
 * TRIG GIATMARA KANGAR - Smartphone Accessories POS Module
 * Fast counter POS for phone cases, tempered glass, cables, chargers, power banks, and accessories.
 */

const PosModule = {
  cart: [],
  searchQuery: '',

  render: function() {
    const container = document.getElementById('main-content-view');
    if (!container) return;

    const inventory = DB.get('inventory') || [];
    const settings = DB.get('settings') || {};
    const currency = settings.currencySymbol || 'RM';

    // Filter Smartphone Accessories
    let accessories = inventory.filter(i => i.category === 'Smartphone Accessories');
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      accessories = accessories.filter(a => a.name.toLowerCase().includes(q) || a.sku.toLowerCase().includes(q));
    }

    let subtotal = 0;
    this.cart.forEach(c => {
      subtotal += (c.sellingPrice * c.quantity);
    });

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <div class="flex items-center gap-2 text-xs text-slate-500 font-semibold mb-1">
              <span>Jualan Kaunter</span> &rarr; <span>POS Aksesori Smartphone</span>
            </div>
            <h1 class="text-xl font-bold text-slate-900">Sistem Jualan Kaunter Aksesori Telefon</h1>
            <p class="text-xs text-slate-500">Imbas/pilih aksesori, jana resit jualan dan kemaskini baki stok serta-merta.</p>
          </div>
          <div class="relative w-full sm:w-72">
            <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3 top-3"></i>
            <input type="text" value="${this.searchQuery}" oninput="PosModule.search(this.value)" placeholder="Cari kabel, tempered glass, casing..." class="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500">
          </div>
        </div>

        <!-- 2-Columns Layout: Catalog (70%) + Cart (30%) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <!-- Catalog Grid -->
          <div class="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            ${accessories.map(acc => {
              const inStock = acc.currentStock > 0;
              return `
                <div class="card-soft overflow-hidden flex flex-col justify-between hover:border-emerald-500 transition">
                  <div>
                    <div class="h-36 bg-slate-100 overflow-hidden relative">
                      <img src="${acc.image || 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400'}" class="w-full h-full object-cover">
                      <span class="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-white font-mono text-[10px] font-bold">
                        Baki: ${acc.currentStock}
                      </span>
                    </div>
                    <div class="p-3.5">
                      <div class="font-mono text-[10px] text-blue-700 font-bold">${acc.sku}</div>
                      <h4 class="font-bold text-slate-900 text-xs line-clamp-1 mt-0.5">${acc.name}</h4>
                      <div class="text-[11px] text-slate-500 mt-1">${acc.brand} • ${acc.model || 'Universal'}</div>
                    </div>
                  </div>

                  <div class="p-3.5 pt-0 flex items-center justify-between mt-2">
                    <div>
                      <span class="text-[10px] text-slate-400 font-semibold uppercase">Harga</span>
                      <div class="font-mono font-black text-emerald-600 text-sm">${currency} ${(acc.sellingPrice || 0).toFixed(2)}</div>
                    </div>
                    <button onclick="PosModule.addToCart('${acc.id}')" ${!inStock ? 'disabled' : ''} class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition active:scale-95">
                      <i data-lucide="plus" class="w-3.5 h-3.5"></i> ${inStock ? 'Tambah' : 'Habis'}
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <!-- POS Cart & Checkout Box -->
          <div class="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-lg p-5 sticky top-20 flex flex-col min-h-[480px]">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div class="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <i data-lucide="shopping-bag" class="w-4 h-4 text-emerald-600"></i>
                Troli Jualan Kaunter
              </div>
              ${this.cart.length > 0 ? `
                <button onclick="PosModule.clearCart()" class="text-xs text-rose-600 hover:underline font-semibold">Kosongkan</button>
              ` : ''}
            </div>

            <!-- Cart Items -->
            <div class="flex-1 overflow-y-auto divide-y divide-slate-100 max-h-64 my-2 pr-1">
              ${this.cart.length === 0 ? `
                <div class="py-12 text-center text-slate-400 text-xs">
                  <i data-lucide="shopping-bag" class="w-10 h-10 mx-auto text-slate-300 mb-2"></i>
                  Troli POS masih kosong.<br>Pilih aksesori dari senarai.
                </div>
              ` : this.cart.map((item, idx) => `
                <div class="py-2.5 flex items-center justify-between text-xs">
                  <div class="flex-1 pr-2">
                    <div class="font-bold text-slate-800 line-clamp-1">${item.name}</div>
                    <div class="text-[11px] text-slate-400 font-mono">${currency} ${item.sellingPrice.toFixed(2)} / unit</div>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                      <button onclick="PosModule.changeQty(${idx}, -1)" class="px-2 py-0.5 text-slate-600 hover:bg-slate-200 font-bold">-</button>
                      <span class="px-2 font-mono font-bold text-slate-900">${item.quantity}</span>
                      <button onclick="PosModule.changeQty(${idx}, 1)" class="px-2 py-0.5 text-slate-600 hover:bg-slate-200 font-bold">+</button>
                    </div>
                    <span class="font-mono font-bold text-slate-900 w-14 text-right">${currency} ${(item.sellingPrice * item.quantity).toFixed(2)}</span>
                    <button onclick="PosModule.removeItem(${idx})" class="text-slate-300 hover:text-rose-600 p-1">
                      <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- Checkout Form & Payment Trigger -->
            <div class="pt-4 border-t border-slate-200 space-y-3 text-xs">
              <div>
                <label class="block font-bold text-slate-700 mb-1">Nama Pelanggan / Catatan</label>
                <input type="text" id="pos-cust-name" placeholder="cth: Pelanggan Walk-In" value="Walk-in Customer" class="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
              </div>

              <div>
                <label class="block font-bold text-slate-700 mb-1">Kaedah Pembayaran</label>
                <div class="grid grid-cols-2 gap-2">
                  <label class="p-2 border border-slate-200 rounded-lg flex items-center gap-1.5 cursor-pointer has-[:checked]:border-emerald-600 has-[:checked]:bg-emerald-50">
                    <input type="radio" name="posPayMethod" value="CASH" checked class="text-emerald-600"> Tunai (Cash)
                  </label>
                  <label class="p-2 border border-slate-200 rounded-lg flex items-center gap-1.5 cursor-pointer has-[:checked]:border-emerald-600 has-[:checked]:bg-emerald-50">
                    <input type="radio" name="posPayMethod" value="QR_PAYMENT" class="text-emerald-600"> QR DuitNow
                  </label>
                </div>
              </div>

              <div class="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-100">
                <span>JUMLAH BAYARAN:</span>
                <span class="font-mono text-base text-emerald-600 font-black">${currency} ${subtotal.toFixed(2)}</span>
              </div>

              <button onclick="PosModule.completeSale()" ${this.cart.length === 0 ? 'disabled' : ''} class="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2">
                <i data-lucide="check-circle" class="w-4 h-4"></i> Sahkan & Selesai Jualan
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) lucide.createIcons();
  },

  search: function(q) {
    this.searchQuery = q;
    this.render();
  },

  addToCart: function(itemId) {
    const inventory = DB.get('inventory') || [];
    const item = inventory.find(i => i.id === itemId);
    if (!item) return;

    if (item.currentStock <= 0) {
      App.showToast('Stok aksesori ini habis!', 'error');
      return;
    }

    const existing = this.cart.find(c => c.id === itemId);
    if (existing) {
      if (existing.quantity >= item.currentStock) {
        App.showToast('Mencapai had kuantiti stok semasa!', 'warning');
        return;
      }
      existing.quantity += 1;
    } else {
      this.cart.push({
        id: item.id,
        sku: item.sku,
        name: item.name,
        costPrice: item.costPrice,
        sellingPrice: item.sellingPrice,
        quantity: 1
      });
    }

    App.showToast(`Ditambah ke troli POS: ${item.name}`, 'info');
    this.render();
  },

  changeQty: function(idx, delta) {
    if (this.cart[idx]) {
      this.cart[idx].quantity += delta;
      if (this.cart[idx].quantity <= 0) {
        this.cart.splice(idx, 1);
      }
    }
    this.render();
  },

  removeItem: function(idx) {
    this.cart.splice(idx, 1);
    this.render();
  },

  clearCart: function() {
    this.cart = [];
    this.render();
  },

  completeSale: function() {
    if (this.cart.length === 0) return;

    const sales = DB.get('sales') || [];
    const currentUser = Auth.getCurrentUser() || { name: 'Juruwang' };
    const receiptNum = DB.generateId('ACC');
    const posId = DB.generateId('POS');
    const custName = document.getElementById('pos-cust-name')?.value || 'Walk-in Customer';
    const payMethod = document.querySelector('input[name="posPayMethod"]:checked')?.value || 'CASH';
    const nowStr = new Date().toLocaleString('en-MY', { hour12: false });

    let totalCost = 0;
    let totalSelling = 0;

    // Deduct stock for each sold accessory
    this.cart.forEach(c => {
      totalCost += (c.costPrice * c.quantity);
      totalSelling += (c.sellingPrice * c.quantity);
      DB.deductInventory(c.id, c.quantity, receiptNum, 'SOLD', `Jualan kaunter POS kepada ${custName}`);
    });

    const profit = totalSelling - totalCost;

    const newSale = {
      id: DB.generateId('SAL'),
      module: 'ACCESSORIES',
      referenceId: posId,
      receiptNumber: receiptNum,
      customer: custName,
      itemsSummary: this.cart.map(c => `${c.quantity}x ${c.name}`).join(', '),
      costPrice: totalCost,
      sellingPrice: totalSelling,
      profit: profit,
      paymentMethod: payMethod,
      paymentStatus: 'PAID',
      date: nowStr.split(' ')[0],
      time: nowStr.split(' ')[1] || '',
      cashier: currentUser.name
    };

    sales.unshift(newSale);
    DB.save('sales', sales);

    DB.logAudit(currentUser.role, 'Jualan Kaunter Aksesori', 'FINANCE', `Jualan ${receiptNum} selesai. Jumlah RM ${totalSelling.toFixed(2)}.`);

    const receiptData = {
      type: 'ACCESSORIES',
      module: 'ACCESSORIES',
      id: posId,
      receiptNumber: receiptNum,
      customer: custName,
      itemsSummary: newSale.itemsSummary,
      sellingPrice: totalSelling,
      paymentMethod: payMethod,
      date: newSale.date,
      time: newSale.time,
      cashier: currentUser.name
    };

    this.cart = [];
    App.showToast('Jualan berjaya disahkan dan stok ditolak!', 'success');
    this.render();

    // Launch receipt preview modal
    ReceiptEngine.preview(receiptData, '80mm');
  }
};
