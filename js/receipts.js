/**
 * TRIG GIATMARA KANGAR - Centralized Receipt & Invoice Engine
 * Supports 80mm Thermal, 58mm Thermal, and A4 Official Formats.
 */

const ReceiptEngine = {
  currentReceiptData: null,
  currentReceiptFormat: '80mm', // '80mm', '58mm', 'a4'

  // Open Preview Modal
  preview: function(receiptData, format = '80mm') {
    this.currentReceiptData = receiptData;
    this.currentReceiptFormat = format;
    this.renderModal();
  },

  // Generate Receipt HTML content
  generateHtml: function(data, format = '80mm') {
    const settings = DB.get('settings') || {};
    const currency = settings.currencySymbol || 'RM';
    const isA4 = format === 'a4';
    const paperClass = isA4 ? 'receipt-paper-a4' : (format === '58mm' ? 'receipt-paper-58mm' : 'receipt-paper-80mm');

    let content = '';

    if (data.type === 'CAFE' || data.module === 'CAFÉ') {
      content = this.generateCafeReceipt(data, settings, currency, isA4);
    } else if (data.type === 'REPAIR' || data.module === 'REPAIR') {
      content = this.generateRepairReceipt(data, settings, currency, isA4);
    } else if (data.type === 'ACCESSORIES' || data.module === 'ACCESSORIES') {
      content = this.generateAccessoriesReceipt(data, settings, currency, isA4);
    } else {
      content = this.generateGeneralReceipt(data, settings, currency, isA4);
    }

    return `<div class="${paperClass}" id="printable-receipt-sheet">${content}</div>`;
  },

  // 1. Café Receipt
  generateCafeReceipt: function(order, settings, currency, isA4) {
    const isDineIn = order.orderType === 'DINE_IN';
    const itemsHtml = order.items.map(item => `
      <tr class="border-b border-dashed border-gray-200">
        <td class="py-1 text-left">
          <div class="font-medium">${item.name}</div>
          <div class="text-xs text-gray-500">${item.quantity} x ${currency} ${(item.unitPrice || 0).toFixed(2)}</div>
        </td>
        <td class="py-1 text-right font-medium align-top">
          ${currency} ${(item.subtotal || item.quantity * item.unitPrice).toFixed(2)}
        </td>
      </tr>
    `).join('');

    return `
      <div class="text-center mb-3">
        <div class="font-bold text-base tracking-tight uppercase">${settings.businessName || 'TRIG GIATMARA KANGAR'}</div>
        <div class="text-xs text-gray-600 font-medium">CAFÉ & KULINARI TVET GIATMARA</div>
        <div class="text-[10px] text-gray-500 mt-0.5 leading-tight">${settings.address}</div>
        <div class="text-[10px] text-gray-500">Tel: ${settings.phone}</div>
        <div class="receipt-divider my-2"></div>
        <div class="font-bold text-xs uppercase tracking-wider text-slate-800">
          ${order.receiptNumber || 'RESIT JUALAN CAFÉ'}
        </div>
      </div>

      <div class="text-[11px] mb-2 space-y-0.5">
        <div class="flex justify-between"><span>No Pesanan:</span><span class="font-bold">${order.id}</span></div>
        <div class="flex justify-between"><span>Tarikh/Masa:</span><span>${order.orderTime || new Date().toLocaleString('en-MY')}</span></div>
        <div class="flex justify-between">
          <span>Jenis Pesanan:</span>
          <span class="font-bold px-1 rounded ${isDineIn ? 'bg-amber-100 text-amber-900' : 'bg-blue-100 text-blue-900'}">
            ${isDineIn ? 'DINE-IN (' + (order.tableName || order.tableId) + ')' : 'TAKEAWAY / BUNGKUS'}
          </span>
        </div>
        ${!isDineIn && order.customerName ? `
          <div class="flex justify-between"><span>Pelanggan:</span><span>${order.customerName} (${order.customerPhone || '-'})</span></div>
          <div class="flex justify-between"><span>Masa Ambil:</span><span>${order.pickupTime || 'Segera'}</span></div>
        ` : ''}
        <div class="flex justify-between"><span>Juruwang / Staf:</span><span>${order.cashier || 'Staf Café'}</span></div>
      </div>

      <div class="receipt-divider my-2"></div>

      <table class="w-full text-[11px] mb-2">
        <thead>
          <tr class="border-b border-gray-300 text-gray-600">
            <th class="text-left py-1 font-semibold">Item & Kuantiti</th>
            <th class="text-right py-1 font-semibold">Jumlah</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div class="receipt-divider my-2"></div>

      <div class="text-[11px] space-y-1">
        <div class="flex justify-between"><span>Jumlah Kasar:</span><span>${currency} ${(order.subtotal || order.total).toFixed(2)}</span></div>
        ${order.discount ? `<div class="flex justify-between text-rose-600"><span>Diskaun:</span><span>-${currency} ${order.discount.toFixed(2)}</span></div>` : ''}
        <div class="flex justify-between font-bold text-sm border-t border-b border-slate-900 py-1 my-1">
          <span>JUMLAH BERSIH:</span>
          <span>${currency} ${(order.total || 0).toFixed(2)}</span>
        </div>
        <div class="flex justify-between text-[11px] pt-1">
          <span>Kaedah Bayaran:</span>
          <span class="font-semibold uppercase">${order.paymentMethod === 'QR_PAYMENT' ? 'QR DUITNOW' : (order.paymentMethod || 'CASH')}</span>
        </div>
        <div class="flex justify-between text-[11px]">
          <span>Status Bayaran:</span>
          <span class="font-bold ${order.paymentStatus === 'PAID' ? 'text-emerald-700' : 'text-amber-600'}">${order.paymentStatus || 'PAID'}</span>
        </div>
        ${order.paymentRef ? `<div class="flex justify-between text-[10px] text-gray-500"><span>No Rujukan:</span><span>${order.paymentRef}</span></div>` : ''}
      </div>

      <div class="receipt-divider-double my-3"></div>

      <div class="text-center text-[10px] text-gray-600 space-y-1">
        <p class="font-semibold">TERIMA KASIH KERANA BERKUNJUNG!</p>
        <p>Sila datang lagi ke Café GIATMARA Kangar.</p>
        <p class="text-[9px] text-gray-400">Dijana secara automatik oleh TRIG Management System</p>
      </div>
    `;
  },

  // 2. Smartphone Repair Receipt & Warranty Invoice
  generateRepairReceipt: function(job, settings, currency, isA4) {
    const partsRows = (job.partsUsed && job.partsUsed.length > 0) ? job.partsUsed.map(p => `
      <tr class="border-b border-dashed border-gray-200">
        <td class="py-1 text-left">
          <div class="font-medium">${p.name}</div>
          <div class="text-xs text-gray-500">SKU: ${p.sku || '-'} (x${p.quantity || 1})</div>
        </td>
        <td class="py-1 text-right font-medium align-top">
          ${currency} ${((p.sellingPrice || 0) * (p.quantity || 1)).toFixed(2)}
        </td>
      </tr>
    `).join('') : `<tr><td colspan="2" class="py-1 text-gray-400 italic text-center">Tiada alat ganti fizikal (Servis/Software)</td></tr>`;

    return `
      <div class="text-center mb-3">
        <div class="font-bold text-base tracking-tight uppercase">${settings.businessName || 'TRIG GIATMARA KANGAR'}</div>
        <div class="text-xs text-blue-700 font-bold tracking-wider">SMARTPHONE REPAIR & TECH SERVICE</div>
        <div class="text-[10px] text-gray-500 mt-0.5 leading-tight">${settings.address}</div>
        <div class="text-[10px] text-gray-500">Tel: ${settings.phone} | Email: ${settings.email}</div>
        <div class="receipt-divider my-2"></div>
        <div class="font-bold text-xs uppercase tracking-wider bg-slate-900 text-white py-1 px-2 rounded inline-block">
          RESIT & KAD JAMINAN REPAIR
        </div>
      </div>

      <div class="text-[11px] mb-2 space-y-0.5">
        <div class="flex justify-between"><span>No Resit:</span><span class="font-bold">${job.receiptNumber || job.id}</span></div>
        <div class="flex justify-between"><span>No Job Repair:</span><span class="font-mono font-bold text-blue-700">${job.id}</span></div>
        <div class="flex justify-between"><span>Tarikh Resit:</span><span>${job.paidAt || job.dateReceived || new Date().toLocaleString('en-MY')}</span></div>
        <div class="flex justify-between"><span>Pelanggan:</span><span class="font-semibold">${job.customerName}</span></div>
        <div class="flex justify-between"><span>No Telefon:</span><span>${job.customerPhone}</span></div>
        <div class="flex justify-between"><span>Juruteknik:</span><span>${job.technician || 'Pelatih TRIG'}</span></div>
      </div>

      <div class="bg-slate-50 p-2 rounded border border-slate-200 text-[10.5px] mb-2 space-y-0.5">
        <div class="font-bold text-slate-800 border-b border-slate-200 pb-0.5 mb-1">MAKLUMAT PERANTI</div>
        <div class="flex justify-between"><span>Peranti:</span><span class="font-bold text-slate-900">${job.deviceBrand} ${job.deviceModel}</span></div>
        <div class="flex justify-between"><span>Warna / IMEI:</span><span>${job.deviceColour || '-'} | ${job.serialNumber || '-'}</span></div>
        <div class="flex justify-between"><span>Kategori Kerosakan:</span><span class="font-medium text-amber-700">${job.damageType}</span></div>
        <div class="text-gray-600 mt-1"><span>Diagnosis:</span> <i>${job.diagnosis || job.problemReported}</i></div>
      </div>

      <table class="w-full text-[11px] mb-2">
        <thead>
          <tr class="border-b border-gray-300 text-gray-600">
            <th class="text-left py-1 font-semibold">Alat Ganti / Servis</th>
            <th class="text-right py-1 font-semibold">Harga</th>
          </tr>
        </thead>
        <tbody>
          ${partsRows}
          <tr class="border-b border-dashed border-gray-200">
            <td class="py-1 text-left font-medium">Upah Baiki & Diagnostik (Labour)</td>
            <td class="py-1 text-right font-medium">${currency} ${(job.labourCost || 0).toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      <div class="text-[11px] space-y-1">
        <div class="flex justify-between font-bold text-sm border-t border-b border-slate-900 py-1 my-1">
          <span>JUMLAH DIBAYAR:</span>
          <span class="text-emerald-700">${currency} ${(job.totalSellingPrice || 0).toFixed(2)}</span>
        </div>
        <div class="flex justify-between text-[11px]">
          <span>Kaedah Bayaran:</span>
          <span class="font-semibold uppercase">${job.paymentMethod === 'QR_PAYMENT' ? 'QR DUITNOW' : (job.paymentMethod || 'CASH')}</span>
        </div>
        <div class="flex justify-between text-[11px]">
          <span>Status Bayaran:</span>
          <span class="font-bold text-emerald-700">${job.paymentStatus || 'PAID'}</span>
        </div>
        <div class="flex justify-between text-[11px]">
          <span>Tempoh Jaminan (Warranty):</span>
          <span class="font-bold text-blue-700">${job.warrantyExpiry ? job.warrantyExpiry + ' (30 Hari)' : '30 Hari dari tarikh resit'}</span>
        </div>
      </div>

      <div class="receipt-divider my-2"></div>

      <div class="text-center text-[9.5px] text-gray-500 space-y-1">
        <p class="font-semibold text-slate-700">${settings.warrantyTerms}</p>
        <p>Sila kemukakan resit ini sekiranya terdapat sebarang tuntutan jaminan.</p>
        <p class="font-bold text-slate-800">TERIMA KASIH ATAS SOKONGAN ANDA KEPADA TVET GIATMARA</p>
      </div>
    `;
  },

  // 3. Phone Accessories POS Receipt
  generateAccessoriesReceipt: function(sale, settings, currency, isA4) {
    return `
      <div class="text-center mb-3">
        <div class="font-bold text-base tracking-tight uppercase">${settings.businessName || 'TRIG GIATMARA KANGAR'}</div>
        <div class="text-xs text-gray-600 font-medium">JUALAN AKSESORI SMARTPHONE</div>
        <div class="text-[10px] text-gray-500 mt-0.5 leading-tight">${settings.address}</div>
        <div class="text-[10px] text-gray-500">Tel: ${settings.phone}</div>
        <div class="receipt-divider my-2"></div>
        <div class="font-bold text-xs uppercase tracking-wider text-slate-800">
          ${sale.receiptNumber || sale.id}
        </div>
      </div>

      <div class="text-[11px] mb-2 space-y-0.5">
        <div class="flex justify-between"><span>No Rujukan:</span><span class="font-bold">${sale.referenceId || sale.id}</span></div>
        <div class="flex justify-between"><span>Tarikh/Masa:</span><span>${sale.date} ${sale.time || ''}</span></div>
        <div class="flex justify-between"><span>Pelanggan:</span><span>${sale.customer || 'Walk-in Customer'}</span></div>
        <div class="flex justify-between"><span>Juruwang:</span><span>${sale.cashier || 'Juruwang'}</span></div>
      </div>

      <div class="receipt-divider my-2"></div>

      <div class="text-[11px] py-2">
        <div class="font-semibold text-slate-800 mb-1">Item Dibeli:</div>
        <div class="text-slate-600 text-xs">${sale.itemsSummary}</div>
      </div>

      <div class="receipt-divider my-2"></div>

      <div class="text-[11px] space-y-1">
        <div class="flex justify-between font-bold text-sm border-t border-b border-slate-900 py-1 my-1">
          <span>JUMLAH:</span>
          <span>${currency} ${(sale.sellingPrice || 0).toFixed(2)}</span>
        </div>
        <div class="flex justify-between text-[11px]">
          <span>Kaedah Bayaran:</span>
          <span class="font-semibold uppercase">${sale.paymentMethod || 'CASH'}</span>
        </div>
        <div class="flex justify-between text-[11px]">
          <span>Status:</span>
          <span class="font-bold text-emerald-700">PAID</span>
        </div>
      </div>

      <div class="receipt-divider-double my-3"></div>

      <div class="text-center text-[10px] text-gray-600 space-y-1">
        <p class="font-semibold">TERIMA KASIH ATAS BELIAN ANDA</p>
        <p>Aksesori berkualiti jaminan GIATMARA Kangar.</p>
      </div>
    `;
  },

  // 4. General Sales Fallback
  generateGeneralReceipt: function(sale, settings, currency, isA4) {
    return this.generateAccessoriesReceipt(sale, settings, currency, isA4);
  },

  // Render Modal in DOM
  renderModal: function() {
    let modalEl = document.getElementById('receipt-preview-modal');
    if (!modalEl) {
      modalEl = document.createElement('div');
      modalEl.id = 'receipt-preview-modal';
      modalEl.className = 'fixed inset-0 z-50 flex items-center justify-center modal-backdrop p-4 overflow-y-auto';
      document.body.appendChild(modalEl);
    }

    const htmlContent = this.generateHtml(this.currentReceiptData, this.currentReceiptFormat);

    modalEl.innerHTML = `
      <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 modal-animate-in max-h-[95vh] flex flex-col">
        <!-- Header Controls -->
        <div class="flex items-center justify-between pb-4 border-b border-gray-200">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <i data-lucide="receipt"></i>
            </div>
            <div>
              <h3 class="font-bold text-slate-800 text-lg">Pratonton Resit & Invois</h3>
              <p class="text-xs text-gray-500">TRIG GIATMARA Kangar Digital Printing Engine</p>
            </div>
          </div>
          
          <div class="flex items-center gap-2">
            <!-- Format Selector -->
            <div class="inline-flex rounded-lg border border-gray-200 p-0.5 bg-gray-50 text-xs font-semibold">
              <button onclick="ReceiptEngine.changeFormat('80mm')" class="px-2.5 py-1 rounded-md transition ${this.currentReceiptFormat === '80mm' ? 'bg-white text-slate-900 shadow-sm' : 'text-gray-500 hover:text-slate-800'}">
                80mm Thermal
              </button>
              <button onclick="ReceiptEngine.changeFormat('58mm')" class="px-2.5 py-1 rounded-md transition ${this.currentReceiptFormat === '58mm' ? 'bg-white text-slate-900 shadow-sm' : 'text-gray-500 hover:text-slate-800'}">
                58mm Mini
              </button>
              <button onclick="ReceiptEngine.changeFormat('a4')" class="px-2.5 py-1 rounded-md transition ${this.currentReceiptFormat === 'a4' ? 'bg-white text-slate-900 shadow-sm' : 'text-gray-500 hover:text-slate-800'}">
                A4 Official
              </button>
            </div>

            <button onclick="ReceiptEngine.closeModal()" class="text-gray-400 hover:text-gray-700 p-1 rounded-lg">
              <i data-lucide="x"></i>
            </button>
          </div>
        </div>

        <!-- Receipt Body Container -->
        <div class="flex-1 overflow-y-auto py-6 bg-slate-100 rounded-lg my-4 flex justify-center items-start border border-slate-200">
          <div id="receipt-print-area">
            ${htmlContent}
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="flex items-center justify-between pt-3 border-t border-gray-200">
          <div class="text-xs text-gray-500 flex items-center gap-1.5">
            <i data-lucide="printer" class="w-4 h-4 text-gray-400"></i>
            Format Terpilih: <b>${this.currentReceiptFormat.toUpperCase()}</b>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="ReceiptEngine.closeModal()" class="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
              Tutup
            </button>
            <button onclick="ReceiptEngine.downloadReceipt()" class="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition flex items-center gap-1.5">
              <i data-lucide="download" class="w-4 h-4"></i> Muat Turun
            </button>
            <button onclick="ReceiptEngine.printReceipt()" class="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition flex items-center gap-2">
              <i data-lucide="printer" class="w-4 h-4"></i> Cetak Resit Sekarang
            </button>
          </div>
        </div>
      </div>
    `;

    modalEl.classList.remove('hidden');
    if (window.lucide) lucide.createIcons();
  },

  changeFormat: function(newFormat) {
    this.currentReceiptFormat = newFormat;
    this.renderModal();
  },

  closeModal: function() {
    const modalEl = document.getElementById('receipt-preview-modal');
    if (modalEl) modalEl.classList.add('hidden');
  },

  printReceipt: function() {
    window.print();
  },

  downloadReceipt: function() {
    const printArea = document.getElementById('receipt-print-area');
    if (!printArea) return;
    const blob = new Blob([`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Resit TRIG GIATMARA KANGAR</title>
        <link rel="stylesheet" href="${window.location.origin}/css/style.css">
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="p-8 bg-gray-50 flex justify-center">
        ${printArea.innerHTML}
      </body>
      </html>
    `], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Resit-TRIG-${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
    App.showToast('Resit berjaya dimuat turun!', 'success');
  }
};
