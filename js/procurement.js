/**
 * TRIG GIATMARA KANGAR - Procurement & Purchase Management Module
 * Complete Procurement Workflow:
 * Low Stock -> Purchase Request (PR) -> Manager Approval -> Purchase Order (PO) -> Receive Stock -> Automatic Inventory & Ledger Update.
 */

const ProcurementModule = {
  render: function(subview = 'requests') {
    const container = document.getElementById('main-content-view');
    if (!container) return;

    const prs = DB.get('purchaseRequests') || [];
    const settings = DB.get('settings') || {};
    const currency = settings.currencySymbol || 'RM';

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <div class="flex items-center gap-2 text-xs text-slate-500 font-semibold mb-1">
              <span>Perolehan & Belian</span> &rarr; <span>Pesanan Belian (PR & PO)</span>
            </div>
            <h1 class="text-xl font-bold text-slate-900">Pengurusan Perolehan & Pesanan Belian</h1>
            <p class="text-xs text-slate-500">Aliran kerja kelulusan permohonan belian stok dari pembekal sehingga penerimaan stok di stor.</p>
          </div>
          <button onclick="ProcurementModule.openNewPRModal()" class="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition">
            <i data-lucide="plus-circle" class="w-4 h-4"></i> Buka Permohonan Belian (PR Baru)
          </button>
        </div>

        <!-- Workflow Banner Diagram -->
        <div class="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-5 rounded-2xl shadow-sm">
          <div class="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">ALIRAN PROSES PEROLEHAN TVET GIATMARA</div>
          <div class="grid grid-cols-2 md:grid-cols-5 gap-2 text-center text-xs font-semibold">
            <div class="p-2.5 bg-white/10 rounded-xl">1. Stok Rendah / Keperluan</div>
            <div class="p-2.5 bg-white/10 rounded-xl">2. Permohonan (PR)</div>
            <div class="p-2.5 bg-white/10 rounded-xl">3. Kelulusan Pengurus</div>
            <div class="p-2.5 bg-white/10 rounded-xl">4. Pesanan Rasmi (PO)</div>
            <div class="p-2.5 bg-emerald-500/30 border border-emerald-400/40 rounded-xl text-emerald-300">5. Terima Stok & Kemaskini Inventori</div>
          </div>
        </div>

        <!-- PR Table -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th class="p-4">No PR / PO & Tarikh</th>
                  <th class="p-4">Tajuk Permohonan</th>
                  <th class="p-4">Pembekal</th>
                  <th class="p-4">Pemohon</th>
                  <th class="p-4 text-right">Jumlah Belian</th>
                  <th class="p-4 text-center">Status Aliran</th>
                  <th class="p-4 text-center">Tindakan</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${prs.map(pr => {
                  let badge = 'bg-amber-100 text-amber-800';
                  if (pr.status === 'APPROVED' || pr.status === 'ORDERED') badge = 'bg-blue-100 text-blue-800';
                  if (pr.status === 'RECEIVED') badge = 'bg-emerald-100 text-emerald-800';
                  if (pr.status === 'CANCELLED') badge = 'bg-rose-100 text-rose-800';

                  return `
                    <tr class="hover:bg-slate-50 transition">
                      <td class="p-4">
                        <div class="font-mono font-bold text-indigo-700">${pr.id}</div>
                        <div class="text-[10px] text-slate-400 mt-0.5">${pr.dateRequested}</div>
                      </td>
                      <td class="p-4">
                        <div class="font-bold text-slate-900">${pr.title}</div>
                        <div class="text-[11px] text-slate-500 mt-0.5">
                          ${pr.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                        </div>
                      </td>
                      <td class="p-4 font-semibold text-slate-700">${pr.supplierName}</td>
                      <td class="p-4 text-slate-600 font-medium">${pr.requestedBy}</td>
                      <td class="p-4 text-right font-mono font-bold text-slate-900">${currency} ${pr.totalAmount.toFixed(2)}</td>
                      <td class="p-4 text-center">
                        <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${badge}">
                          ${pr.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td class="p-4 text-center">
                        <div class="inline-flex items-center gap-1.5">
                          ${pr.status === 'PENDING_APPROVAL' && Auth.hasPermission('canApprovePurchases') ? `
                            <button onclick="ProcurementModule.approveRequest('${pr.id}')" class="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs transition shadow-sm">
                              Luluskan
                            </button>
                          ` : ''}

                          ${(pr.status === 'APPROVED' || pr.status === 'ORDERED') ? `
                            <button onclick="ProcurementModule.receiveStock('${pr.id}')" class="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs transition shadow-sm flex items-center gap-1">
                              <i data-lucide="package-check" class="w-3.5 h-3.5"></i> Terima Stok
                            </button>
                          ` : ''}

                          ${pr.status === 'RECEIVED' ? `
                            <span class="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                              <i data-lucide="check" class="w-3.5 h-3.5"></i> Stok Diterima
                            </span>
                          ` : ''}
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

    if (window.lucide) lucide.createIcons();
  },

  createRequestFromItem: function(itemId) {
    const inventory = DB.get('inventory') || [];
    const suppliers = DB.get('suppliers') || [];
    const item = inventory.find(i => i.id === itemId);
    if (!item) return;

    const supplier = suppliers.find(s => s.name === item.supplier) || suppliers[0];
    const qty = Math.max(5, item.minStock * 2);
    const totalCost = qty * item.costPrice;

    const newPR = {
      id: DB.generateId('PR'),
      title: `Pesanan Tambahan Stok Segera: ${item.name}`,
      supplierId: supplier ? supplier.id : 'SUP-001',
      supplierName: item.supplier || (supplier ? supplier.name : 'TechParts Utara'),
      requestedBy: Auth.getCurrentUser() ? Auth.getCurrentUser().name : 'Staf TRIG',
      dateRequested: new Date().toLocaleString('en-MY', { hour12: false }),
      items: [
        {
          itemId: item.id,
          name: item.name,
          sku: item.sku,
          quantity: qty,
          unitCost: item.costPrice,
          totalCost: totalCost
        }
      ],
      totalAmount: totalCost,
      status: 'PENDING_APPROVAL',
      approvedBy: null,
      dateApproved: null,
      poNumber: null,
      notes: `Permohonan automatik dijana akibat paras stok rendah (${item.currentStock} / Min: ${item.minStock}).`
    };

    const prs = DB.get('purchaseRequests') || [];
    prs.unshift(newPR);
    DB.save('purchaseRequests', prs);

    DB.addNotification(
      'Permohonan Belian Baru Dibuka',
      `PR ${newPR.id} bernilai RM ${totalCost.toFixed(2)} untuk ${item.name} menanti kelulusan Pengurus.`,
      'ACTION',
      'PROCUREMENT'
    );

    App.showToast(`Permohonan ${newPR.id} berjaya dibuat!`, 'success');
    App.navigateTo('procurement-requests');
  },

  openNewPRModal: function() {
    const inventory = DB.get('inventory') || [];
    const suppliers = DB.get('suppliers') || [];

    let modal = document.getElementById('new-pr-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'new-pr-modal';
      modal.className = 'fixed inset-0 z-50 flex items-center justify-center modal-backdrop p-4 overflow-y-auto';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 modal-animate-in">
        <div class="flex items-center justify-between pb-4 border-b border-slate-200">
          <h3 class="font-bold text-slate-900 text-base">Buka Permohonan Pesanan Belian (PR)</h3>
          <button onclick="document.getElementById('new-pr-modal').classList.add('hidden')" class="text-slate-400 hover:text-slate-700">
            <i data-lucide="x"></i>
          </button>
        </div>

        <form onsubmit="ProcurementModule.saveNewPR(event)" class="space-y-4 mt-4 text-xs">
          <div>
            <label class="block font-bold text-slate-700 mb-1">Tajuk Permohonan *</label>
            <input type="text" name="title" required placeholder="cth: Pesanan Stok LCD Samsung & Battery" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold">
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Pilih Pembekal Utama *</label>
            <select name="supplierName" required class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800">
              ${suppliers.map(s => `<option value="${s.name}">${s.name} (${s.productCategory})</option>`).join('')}
            </select>
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Pilih Item Stok *</label>
            <select name="itemId" required class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium">
              ${inventory.map(i => `<option value="${i.id}">${i.name} (Kos: RM ${i.costPrice.toFixed(2)})</option>`).join('')}
            </select>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Kuantiti Tambahan *</label>
              <input type="number" min="1" name="quantity" value="10" required class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold font-mono">
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Catatan</label>
              <input type="text" name="notes" placeholder="cth: Bekalan latihan semester baru" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
            </div>
          </div>

          <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button type="button" onclick="document.getElementById('new-pr-modal').classList.add('hidden')" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition">
              Batal
            </button>
            <button type="submit" class="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm transition">
              Hantar Permohonan (PR)
            </button>
          </div>
        </form>
      </div>
    `;

    modal.classList.remove('hidden');
    if (window.lucide) lucide.createIcons();
  },

  saveNewPR: function(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inventory = DB.get('inventory') || [];
    const suppliers = DB.get('suppliers') || [];
    const prs = DB.get('purchaseRequests') || [];

    const itemId = formData.get('itemId');
    const item = inventory.find(i => i.id === itemId);
    const supplierName = formData.get('supplierName');
    const supplier = suppliers.find(s => s.name === supplierName) || suppliers[0];
    const qty = parseInt(formData.get('quantity')) || 1;
    const unitCost = item ? item.costPrice : 0;
    const totalCost = qty * unitCost;

    const newPR = {
      id: DB.generateId('PR'),
      title: formData.get('title'),
      supplierId: supplier ? supplier.id : 'SUP-001',
      supplierName: supplierName,
      requestedBy: Auth.getCurrentUser() ? Auth.getCurrentUser().name : 'Staf TRIG',
      dateRequested: new Date().toLocaleString('en-MY', { hour12: false }),
      items: [
        {
          itemId: item ? item.id : 'INV-001',
          name: item ? item.name : 'Item',
          sku: item ? item.sku : '-',
          quantity: qty,
          unitCost: unitCost,
          totalCost: totalCost
        }
      ],
      totalAmount: totalCost,
      status: 'PENDING_APPROVAL',
      approvedBy: null,
      dateApproved: null,
      poNumber: null,
      notes: formData.get('notes')
    };

    prs.unshift(newPR);
    DB.save('purchaseRequests', prs);

    App.showToast(`Permohonan ${newPR.id} berjaya dihantar!`, 'success');
    document.getElementById('new-pr-modal').classList.add('hidden');
    this.render();
  },

  approveRequest: function(prId) {
    App.confirm(`Adakah anda pasti mahu meluluskan Permohonan Belian ${prId}?`, () => {
      const prs = DB.get('purchaseRequests') || [];
      const pr = prs.find(p => p.id === prId);
      if (!pr) return;

      pr.status = 'APPROVED';
      pr.approvedBy = Auth.getCurrentUser() ? Auth.getCurrentUser().name : 'Pengurus Operasi';
      pr.dateApproved = new Date().toLocaleString('en-MY', { hour12: false });
      pr.poNumber = 'PO-' + pr.id.replace('PR-', '');

      DB.save('purchaseRequests', prs);
      DB.logAudit('MANAGER', 'Luluskan Permohonan Belian', 'PROCUREMENT', `PR ${prId} diluluskan. No PO: ${pr.poNumber}.`);
      App.showToast(`PR ${prId} DILULUSKAN! Pesanan Rasmi ${pr.poNumber} dijana.`, 'success');
      ProcurementModule.render();
    });
  },

  receiveStock: function(prId) {
    App.confirm(`Sahkan penerimaan fizikal barang bagi pesanan ${prId}? Stok inventori akan ditambah secara automatik.`, () => {
      const prs = DB.get('purchaseRequests') || [];
      const pr = prs.find(p => p.id === prId);
      if (!pr) return;

      // Increment inventory stock for each item in PR
      pr.items.forEach(it => {
        DB.addInventoryStock(it.itemId, it.quantity, pr.poNumber || pr.id, `Penerimaan stok dari pembekal ${pr.supplierName}`);
      });

      pr.status = 'RECEIVED';
      DB.save('purchaseRequests', prs);
      DB.logAudit('SUPER_ADMIN', 'Terima Stok Pembekal', 'INVENTORY', `Penerimaan barang bagi ${pr.poNumber || pr.id} selesai. Stok telah dikemaskini.`);

      App.showToast(`Stok ${pr.id} berjaya diterima dan ditambah ke lejar inventori!`, 'success');
      ProcurementModule.render();
    });
  }
};
