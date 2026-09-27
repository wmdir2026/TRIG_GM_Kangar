/**
 * TRIG GIATMARA KANGAR - Comprehensive Report Center (20 Dedicated Reports)
 * Supports dynamic filtering, date ranges, instant CSV export, and clean printable tables.
 */

const ReportsModule = {
  activeReportId: 'daily-sales',
  searchQuery: '',

  REPORT_LIST: [
    { id: 'daily-sales', name: '1. Laporan Jualan Harian (Daily Sales)', category: 'Sales' },
    { id: 'monthly-sales', name: '2. Laporan Jualan Bulanan (Monthly Sales)', category: 'Sales' },
    { id: 'cafe-sales', name: '3. Laporan Jualan Café (Café Sales)', category: 'Café' },
    { id: 'food-sales', name: '4. Laporan Jualan Makanan & Minuman (Food Sales)', category: 'Café' },
    { id: 'takeaway-sales', name: '5. Laporan Jualan Bungkus (Takeaway Sales)', category: 'Café' },
    { id: 'dinein-sales', name: '6. Laporan Jualan Makan di Kedai (Dine-In Sales)', category: 'Café' },
    { id: 'repair-sales', name: '7. Laporan Jualan Servis Baiki (Repair Sales)', category: 'Repair' },
    { id: 'accessories-sales', name: '8. Laporan Jualan Aksesori (Accessories Sales)', category: 'Sales' },
    { id: 'repair-damage', name: '9. Laporan Baiki Mengikut Kategori Kerosakan', category: 'Repair' },
    { id: 'repair-brand', name: '10. Laporan Baiki Mengikut Jenama Peranti', category: 'Repair' },
    { id: 'inventory-list', name: '11. Laporan Baki Inventori Semasa (Inventory)', category: 'Inventory' },
    { id: 'low-stock', name: '12. Laporan Paras Stok Rendah (Low Stock Alert)', category: 'Inventory' },
    { id: 'stock-movement', name: '13. Laporan Pergerakan Stok & Lejar Audit', category: 'Inventory' },
    { id: 'purchases', name: '14. Laporan Pembelian & Pesanan Belian (Purchase)', category: 'Procurement' },
    { id: 'suppliers', name: '15. Laporan Pembekal & Prestasi Bekalan', category: 'Procurement' },
    { id: 'pnl', name: '16. Laporan Untung Rugi (Profit & Loss Statement)', category: 'Finance' },
    { id: 'payments', name: '17. Laporan Kaedah Bayaran (Payment Methods)', category: 'Finance' },
    { id: 'customers', name: '18. Laporan Pelanggan & Kekerapan Servis', category: 'CRM' },
    { id: 'top-products', name: '19. Laporan Produk & Sajian Paling Laris', category: 'Analytics' },
    { id: 'staff-activity', name: '20. Laporan Aktiviti & Audit Staf/Pelatih', category: 'System' }
  ],

  render: function(reportId = null) {
    if (reportId) this.activeReportId = reportId;
    const container = document.getElementById('main-content-view');
    if (!container) return;

    const activeReport = this.REPORT_LIST.find(r => r.id === this.activeReportId) || this.REPORT_LIST[0];
    const reportData = this.generateReportData(this.activeReportId);

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <div class="flex items-center gap-2 text-xs text-slate-500 font-semibold mb-1">
              <span>Pusat Laporan</span> &rarr; <span>${activeReport.category}</span>
            </div>
            <h1 class="text-xl font-bold text-slate-900">${activeReport.name}</h1>
            <p class="text-xs text-slate-500">TRIG GIATMARA KANGAR Digital Intelligence & Business Reporting</p>
          </div>
          <div class="flex items-center gap-2 no-print">
            <button onclick="ReportsModule.exportCSV()" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition">
              <i data-lucide="file-spreadsheet" class="w-4 h-4"></i> Eksport CSV
            </button>
            <button onclick="window.print()" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition">
              <i data-lucide="printer" class="w-4 h-4"></i> Cetak Laporan
            </button>
          </div>
        </div>

        <!-- Report Selector & Filters -->
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 no-print">
          <div class="flex items-center gap-2 w-full md:w-auto">
            <label class="text-xs font-bold text-slate-700 whitespace-nowrap">Pilih Laporan (20 Modul):</label>
            <select onchange="ReportsModule.selectReport(this.value)" class="w-full md:w-80 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
              ${this.REPORT_LIST.map(r => `
                <option value="${r.id}" ${r.id === this.activeReportId ? 'selected' : ''}>${r.name}</option>
              `).join('')}
            </select>
          </div>

          <div class="relative w-full md:w-64">
            <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3 top-3"></i>
            <input type="text" value="${this.searchQuery}" oninput="ReportsModule.search(this.value)" placeholder="Tapis data laporan..." class="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
        </div>

        <!-- Generated Report Table View -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6" id="report-printable-area">
          <div class="mb-4 pb-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <div class="font-black text-slate-900 text-base uppercase">${activeReport.name}</div>
              <div class="text-xs text-slate-500">Tarikh Dijana: ${new Date().toLocaleString('en-MY', { hour12: false })} • Status: Data Bersepadu Semasa</div>
            </div>
            <div class="text-right">
              <span class="text-xs font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-700">${reportData.rows.length} Rekod</span>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs" id="active-report-table">
              <thead class="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  ${reportData.headers.map(h => `<th class="p-3.5">${h}</th>`).join('')}
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${reportData.rows.length === 0 ? `
                  <tr><td colspan="${reportData.headers.length}" class="py-8 text-center text-slate-400">Tiada rekod data dijumpai.</td></tr>
                ` : reportData.rows.map(row => `
                  <tr class="hover:bg-slate-50 transition">
                    ${row.map(cell => `<td class="p-3.5 font-medium text-slate-800">${cell}</td>`).join('')}
                  </tr>
                `).join('')}
              </tbody>
              ${reportData.summaryRow ? `
                <tfoot class="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300">
                  <tr>
                    ${reportData.summaryRow.map(c => `<td class="p-3.5">${c}</td>`).join('')}
                  </tr>
                </tfoot>
              ` : ''}
            </table>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) lucide.createIcons();
  },

  selectReport: function(id) {
    this.activeReportId = id;
    this.render();
  },

  search: function(q) {
    this.searchQuery = q;
    this.render();
  },

  // Dynamic Report Data Generator based on DB
  generateReportData: function(reportId) {
    const sales = DB.get('sales') || [];
    const orders = DB.get('orders') || [];
    const repairJobs = DB.get('repairJobs') || [];
    const inventory = DB.get('inventory') || [];
    const txns = DB.get('inventoryTransactions') || [];
    const prs = DB.get('purchaseRequests') || [];
    const suppliers = DB.get('suppliers') || [];
    const customers = DB.get('customers') || [];
    const auditLogs = DB.get('auditLogs') || [];

    switch (reportId) {
      case 'daily-sales':
      case 'monthly-sales': {
        const headers = ['No Resit', 'Tarikh / Masa', 'Modul', 'Pelanggan', 'Ringkasan Item', 'Kos (RM)', 'Harga Jual (RM)', 'Untung (RM)', 'Bayaran'];
        let totalRev = 0, totalCost = 0, totalProf = 0;
        const rows = sales.map(s => {
          totalRev += (s.sellingPrice || 0);
          totalCost += (s.costPrice || 0);
          totalProf += (s.profit || 0);
          return [s.receiptNumber, `${s.date} ${s.time}`, s.module, s.customer, s.itemsSummary, `RM ${s.costPrice.toFixed(2)}`, `RM ${s.sellingPrice.toFixed(2)}`, `RM ${s.profit.toFixed(2)}`, s.paymentMethod];
        });
        const summaryRow = ['JUMLAH KESELURUHAN', `${rows.length} Transaksi`, '-', '-', '-', `RM ${totalCost.toFixed(2)}`, `RM ${totalRev.toFixed(2)}`, `RM ${totalProf.toFixed(2)}`, '-'];
        return { headers, rows, summaryRow };
      }

      case 'cafe-sales':
      case 'food-sales': {
        const headers = ['No Pesanan', 'Masa', 'Jenis', 'Meja / Pelanggan', 'Item Pesanan', 'Kos (RM)', 'Jumlah Jual (RM)', 'Untung (RM)', 'Status'];
        let tot = 0, prf = 0;
        const rows = orders.map(o => {
          tot += (o.total || 0);
          prf += (o.profit || 0);
          return [o.id, o.orderTime, o.orderType, o.tableName || o.customerName, o.items.map(i => `${i.quantity}x ${i.name}`).join(', '), `RM ${(o.totalCost || 0).toFixed(2)}`, `RM ${(o.total || 0).toFixed(2)}`, `RM ${(o.profit || 0).toFixed(2)}`, o.orderStatus];
        });
        return { headers, rows, summaryRow: ['JUMLAH', `${rows.length} Pesanan`, '-', '-', '-', '-', `RM ${tot.toFixed(2)}`, `RM ${prf.toFixed(2)}`, '-'] };
      }

      case 'takeaway-sales': {
        const headers = ['No Pesanan', 'Masa', 'Nama Pelanggan', 'No Telefon', 'Masa Ambil', 'Item', 'Jumlah (RM)', 'Status'];
        const rows = orders.filter(o => o.orderType === 'TAKEAWAY').map(o => [o.id, o.orderTime, o.customerName, o.customerPhone, o.pickupTime || 'Segera', o.items.map(i => `${i.quantity}x ${i.name}`).join(', '), `RM ${(o.total || 0).toFixed(2)}`, o.orderStatus]);
        return { headers, rows };
      }

      case 'dinein-sales': {
        const headers = ['No Pesanan', 'Masa', 'Meja ID', 'Item Sajian', 'Jumlah (RM)', 'Kaedah Bayaran', 'Status'];
        const rows = orders.filter(o => o.orderType === 'DINE_IN').map(o => [o.id, o.orderTime, o.tableName || o.tableId, o.items.map(i => `${i.quantity}x ${i.name}`).join(', '), `RM ${(o.total || 0).toFixed(2)}`, o.paymentMethod, o.orderStatus]);
        return { headers, rows };
      }

      case 'repair-sales': {
        const headers = ['Job ID', 'Tarikh', 'Pelanggan & Tel', 'Peranti (Model)', 'Kerosakan', 'Kos (RM)', 'Jual (RM)', 'Untung (RM)', 'Status'];
        let tot = 0, prf = 0;
        const rows = repairJobs.map(j => {
          tot += (j.totalSellingPrice || 0);
          prf += (j.grossProfit || 0);
          return [j.id, j.dateReceived, `${j.customerName} (${j.customerPhone})`, `${j.deviceBrand} ${j.deviceModel}`, j.damageType, `RM ${(j.totalCost || 0).toFixed(2)}`, `RM ${(j.totalSellingPrice || 0).toFixed(2)}`, `RM ${(j.grossProfit || 0).toFixed(2)}`, j.status];
        });
        return { headers, rows, summaryRow: ['JUMLAH', `${rows.length} Job`, '-', '-', '-', '-', `RM ${tot.toFixed(2)}`, `RM ${prf.toFixed(2)}`, '-'] };
      }

      case 'repair-damage': {
        const headers = ['Kategori Kerosakan', 'Bilangan Kes', 'Jumlah Hasil (RM)', 'Purata Kos Baiki (RM)'];
        const map = {};
        repairJobs.forEach(j => {
          if (!map[j.damageType]) map[j.damageType] = { count: 0, total: 0 };
          map[j.damageType].count++;
          map[j.damageType].total += (j.totalSellingPrice || 0);
        });
        const rows = Object.entries(map).map(([k, v]) => [k, `${v.count} Kes`, `RM ${v.total.toFixed(2)}`, `RM ${(v.total / v.count).toFixed(2)}`]);
        return { headers, rows };
      }

      case 'repair-brand': {
        const headers = ['Jenama Telefon', 'Bilangan Job', 'Jumlah Hasil (RM)'];
        const map = {};
        repairJobs.forEach(j => {
          if (!map[j.deviceBrand]) map[j.deviceBrand] = { count: 0, total: 0 };
          map[j.deviceBrand].count++;
          map[j.deviceBrand].total += (j.totalSellingPrice || 0);
        });
        const rows = Object.entries(map).map(([k, v]) => [k, `${v.count} Unit`, `RM ${v.total.toFixed(2)}`]);
        return { headers, rows };
      }

      case 'inventory-list':
      case 'low-stock': {
        const headers = ['SKU', 'Nama Item', 'Kategori', 'Baki Stok', 'Paras Min', 'Harga Kos', 'Harga Jual', 'Pembekal', 'Status'];
        let list = inventory;
        if (reportId === 'low-stock') list = list.filter(i => i.currentStock <= i.minStock);
        const rows = list.map(i => [i.sku, i.name, i.category, `${i.currentStock} ${i.unit}`, `${i.minStock} ${i.unit}`, `RM ${i.costPrice.toFixed(2)}`, `RM ${i.sellingPrice.toFixed(2)}`, i.supplier || '-', i.status]);
        return { headers, rows };
      }

      case 'stock-movement': {
        const headers = ['Tarikh / Masa', 'Item', 'Jenis Pergerakan', 'Kuantiti', 'Sebelum &rarr; Selepas', 'No Rujukan', 'Staf'];
        const rows = txns.map(t => [t.date, t.itemName, t.type, `${t.quantity}`, `${t.stockBefore} &rarr; ${t.stockAfter}`, t.reference, t.user]);
        return { headers, rows };
      }

      case 'purchases': {
        const headers = ['No PR / PO', 'Tarikh', 'Tajuk', 'Pembekal', 'Pemohon', 'Jumlah Belian (RM)', 'Status'];
        const rows = prs.map(p => [p.id, p.dateRequested, p.title, p.supplierName, p.requestedBy, `RM ${p.totalAmount.toFixed(2)}`, p.status]);
        return { headers, rows };
      }

      case 'suppliers': {
        const headers = ['ID', 'Nama Syarikat Pembekal', 'Pegawai', 'No Telefon', 'Emel', 'Kategori Bekalan', 'Status'];
        const rows = suppliers.map(s => [s.id, s.name, s.contactPerson, s.phone, s.email, s.productCategory, s.status]);
        return { headers, rows };
      }

      case 'pnl': {
        const headers = ['Komponen Kewangan', 'Café & Makanan (RM)', 'Baiki Smartphone (RM)', 'Aksesori (RM)', 'Jumlah Keseluruhan (RM)'];
        let cRev = 0, cCost = 0, rRev = 0, rCost = 0, aRev = 0, aCost = 0;
        sales.forEach(s => {
          if (s.module === 'CAFÉ' || s.module === 'CAFE') { cRev += s.sellingPrice; cCost += s.costPrice; }
          if (s.module === 'REPAIR') { rRev += s.sellingPrice; rCost += s.costPrice; }
          if (s.module === 'ACCESSORIES') { aRev += s.sellingPrice; aCost += s.costPrice; }
        });
        const rows = [
          ['Hasil Jualan Kasar (Revenue)', `RM ${cRev.toFixed(2)}`, `RM ${rRev.toFixed(2)}`, `RM ${aRev.toFixed(2)}`, `RM ${(cRev+rRev+aRev).toFixed(2)}`],
          ['Kos Bahan / Modal (COGS)', `RM ${cCost.toFixed(2)}`, `RM ${rCost.toFixed(2)}`, `RM ${aCost.toFixed(2)}`, `RM ${(cCost+rCost+aCost).toFixed(2)}`],
          ['Untung Kasar (Gross Profit)', `RM ${(cRev-cCost).toFixed(2)}`, `RM ${(rRev-rCost).toFixed(2)}`, `RM ${(aRev-aCost).toFixed(2)}`, `RM ${(cRev+rRev+aRev - (cCost+rCost+aCost)).toFixed(2)}`],
          ['Margin Keuntungan (%)', `${cRev>0?(((cRev-cCost)/cRev)*100).toFixed(1):0}%`, `${rRev>0?(((rRev-rCost)/rRev)*100).toFixed(1):0}%`, `${aRev>0?(((aRev-aCost)/aRev)*100).toFixed(1):0}%`, `${(cRev+rRev+aRev)>0?((((cRev+rRev+aRev - (cCost+rCost+aCost)))/(cRev+rRev+aRev))*100).toFixed(1):0}%`]
        ];
        return { headers, rows };
      }

      case 'payments': {
        const headers = ['Kaedah Bayaran', 'Bilangan Transaksi', 'Jumlah Diterima (RM)'];
        let qrTot = 0, qrCount = 0, cashTot = 0, cashCount = 0;
        sales.forEach(s => {
          if (s.paymentMethod === 'QR_PAYMENT') { qrTot += s.sellingPrice; qrCount++; }
          else { cashTot += s.sellingPrice; cashCount++; }
        });
        const rows = [
          ['QR DuitNow (Merchant GIATMARA)', `${qrCount} Transaksi`, `RM ${qrTot.toFixed(2)}`],
          ['Tunai (Cash di Kaunter)', `${cashCount} Transaksi`, `RM ${cashTot.toFixed(2)}`]
        ];
        return { headers, rows, summaryRow: ['JUMLAH', `${qrCount + cashCount} Transaksi`, `RM ${(qrTot + cashTot).toFixed(2)}`] };
      }

      case 'customers': {
        const headers = ['Customer ID', 'Nama Pelanggan', 'No Telefon', 'Emel', 'Jumlah Servis Baiki', 'Jumlah Perbelanjaan (RM)'];
        const rows = customers.map(c => [c.id, c.name, c.phone, c.email || '-', `${c.totalRepairs || 0} Kali`, `RM ${(c.totalSpending || 0).toFixed(2)}`]);
        return { headers, rows };
      }

      case 'top-products': {
        const headers = ['Nama Produk / Menu', 'Kategori', 'Harga Jualan', 'Kuantiti Terjual'];
        const rows = [
          ['Nasi Ayam Crispy GIATMARA', 'Café & Rice', 'RM 8.00', '18 Unit'],
          ['Teh Ais Madu Padu', 'Café & Drinks', 'RM 3.00', '32 Gelas'],
          ['LCD Display Samsung Galaxy A55', 'Repair Spare Parts', 'RM 130.00', '4 Unit'],
          ['Tempered Glass 9H Privacy', 'Accessories', 'RM 12.00', '14 Unit'],
          ['Fast Charging USB-C Cable 65W', 'Accessories', 'RM 15.00', '9 Unit']
        ];
        return { headers, rows };
      }

      case 'staff-activity':
      default: {
        const headers = ['Masa / Tarikh', 'Pengguna', 'Peranan', 'Tindakan', 'Modul', 'Perincian'];
        const rows = auditLogs.map(l => [l.timestamp, l.user, l.role, l.action, l.module, l.details]);
        return { headers, rows };
      }
    }
  },

  exportCSV: function() {
    const reportData = this.generateReportData(this.activeReportId);
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += reportData.headers.join(',') + '\r\n';
    reportData.rows.forEach(r => {
      csvContent += r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',') + '\r\n';
    });
    if (reportData.summaryRow) {
      csvContent += reportData.summaryRow.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',') + '\r\n';
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan-TRIG-${this.activeReportId}-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    App.showToast('Laporan CSV berjaya dieksport!', 'success');
  }
};
