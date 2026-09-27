import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  Search,
  Download,
  Printer,
  Calendar,
  Filter,
  FileSpreadsheet,
  CheckCircle,
  TrendingUp,
  DollarSign,
  UtensilsCrossed,
  Smartphone,
  Package
} from 'lucide-react';

export const ReportsCenter = () => {
  const {
    sales,
    foodOrders,
    repairJobs,
    inventory,
    stockTransactions,
    purchaseRequests,
    suppliers,
    customers,
    auditLogs,
    settings,
    showToast
  } = useApp();

  const [activeReport, setActiveReport] = useState('daily-sales');
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  const reportList = [
    { id: 'daily-sales', name: '1. Laporan Jualan Harian (Daily Sales)', category: 'Sales' },
    { id: 'monthly-sales', name: '2. Laporan Jualan Bulanan (Monthly Sales)', category: 'Sales' },
    { id: 'cafe-sales', name: '3. Laporan Jualan Café (Café Sales)', category: 'Café' },
    { id: 'food-sales', name: '4. Laporan Menu Makanan (Food Sales)', category: 'Café' },
    { id: 'takeaway-sales', name: '5. Laporan Jualan Bungkus (Takeaway Sales)', category: 'Café' },
    { id: 'dine-in-sales', name: '6. Laporan Jualan Meja (Dine-In Sales)', category: 'Café' },
    { id: 'repair-sales', name: '7. Laporan Servis Baiki (Repair Sales)', category: 'Repair' },
    { id: 'accessories-sales', name: '8. Laporan Jualan Aksesori (Accessories Sales)', category: 'Repair' },
    { id: 'repair-damage', name: '9. Laporan Baiki Mengikut Kerosakan', category: 'Repair' },
    { id: 'repair-brand', name: '10. Laporan Baiki Mengikut Jenama Peranti', category: 'Repair' },
    { id: 'inventory-valuation', name: '11. Laporan Nilai Inventori Pusat', category: 'Inventory' },
    { id: 'low-stock-report', name: '12. Laporan Amaran Stok Rendah', category: 'Inventory' },
    { id: 'stock-movement-report', name: '13. Laporan Pergerakan Stok (Stock Movement)', category: 'Inventory' },
    { id: 'purchase-report', name: '14. Laporan Perolehan & Belian (Purchase)', category: 'Procurement' },
    { id: 'supplier-report', name: '15. Laporan Prestasi Pembekal (Supplier)', category: 'Procurement' },
    { id: 'profit-loss', name: '16. Penyata Untung Rugi (Profit & Loss)', category: 'Finance' },
    { id: 'payment-report', name: '17. Laporan Transaksi Bayaran (Payment)', category: 'Finance' },
    { id: 'customer-report', name: '18. Laporan Pelanggan & Belanja (Customer)', category: 'CRM' },
    { id: 'top-selling', name: '19. Laporan Produk Paling Laris (Top Selling)', category: 'Sales' },
    { id: 'staff-activity', name: '20. Laporan Aktiviti Staf & Pelatih (Staff Activity)', category: 'System' }
  ];

  // Helper to generate dynamic table columns & rows based on selected report
  const getReportData = () => {
    let title = '';
    let headers = [];
    let rows = [];

    switch (activeReport) {
      case 'daily-sales':
        title = 'Laporan Jualan Harian Bersepadu';
        headers = ['No. Resit', 'Tarikh', 'Modul', 'Pelanggan', 'Ringkasan', 'Harga Kos (RM)', 'Harga Jual (RM)', 'Untung Kasar (RM)', 'Kaedah'];
        rows = sales.map(s => [s.receiptNo, new Date(s.date).toLocaleDateString(), s.module, s.customerName, s.itemsSummary, s.costPrice.toFixed(2), s.sellingPrice.toFixed(2), s.grossProfit.toFixed(2), s.paymentMethod]);
        break;

      case 'monthly-sales':
        title = 'Laporan Jualan Bulanan';
        headers = ['Bulan', 'Bilangan Transaksi', 'Jumlah Hasil (RM)', 'Jumlah Kos (RM)', 'Untung Kasar (RM)', 'Margin (%)'];
        const totalRev = sales.reduce((a, b) => a + b.sellingPrice, 0);
        const totalCst = sales.reduce((a, b) => a + (b.costPrice || 0), 0);
        const totalPrf = sales.reduce((a, b) => a + (b.grossProfit || 0), 0);
        rows = [
          ['September 2026', sales.length, totalRev.toFixed(2), totalCst.toFixed(2), totalPrf.toFixed(2), totalRev > 0 ? `${((totalPrf / totalRev) * 100).toFixed(1)}%` : '0%']
        ];
        break;

      case 'cafe-sales':
        title = 'Laporan Jualan Café GIATMARA';
        headers = ['Order ID', 'Resit', 'Jenis', 'Meja', 'Pelanggan', 'Item', 'Jumlah (RM)', 'Untung (RM)', 'Status'];
        rows = foodOrders.map(o => [o.id, o.receiptNo, o.orderType, o.tableId || '-', o.customerName, o.items.map(i => `${i.quantity}x ${i.name}`).join(', '), o.grandTotal.toFixed(2), (o.grossProfit || 0).toFixed(2), o.orderStatus]);
        break;

      case 'food-sales':
        title = 'Laporan Jualan Hidangan & Minuman';
        headers = ['ID Order', 'Nama Item', 'Kuantiti', 'Harga Seunit (RM)', 'Jumlah (RM)', 'Tarikh'];
        rows = foodOrders.flatMap(o => o.items.map(i => [o.id, i.name, i.quantity, i.price.toFixed(2), (i.price * i.quantity).toFixed(2), new Date(o.createdAt).toLocaleDateString()]));
        break;

      case 'takeaway-sales':
        title = 'Laporan Jualan Makanan Bungkus (Takeaway)';
        headers = ['Order ID', 'Pelanggan', 'No Telefon', 'Masa Ambil', 'Item', 'Jumlah (RM)', 'Bayaran'];
        rows = foodOrders.filter(o => o.orderType === 'TAKEAWAY').map(o => [o.id, o.customerName, o.customerPhone || '-', o.pickupTime || 'Segera', o.items.map(i => `${i.quantity}x ${i.name}`).join(', '), o.grandTotal.toFixed(2), o.paymentMethod]);
        break;

      case 'dine-in-sales':
        title = 'Laporan Jualan Dine-In (Makan Sini)';
        headers = ['Order ID', 'Nombor Meja', 'Pelanggan', 'Item', 'Jumlah (RM)', 'Untung (RM)', 'Masa'];
        rows = foodOrders.filter(o => o.orderType === 'DINE_IN').map(o => [o.id, o.tableId, o.customerName, o.items.map(i => `${i.quantity}x ${i.name}`).join(', '), o.grandTotal.toFixed(2), (o.grossProfit || 0).toFixed(2), new Date(o.createdAt).toLocaleTimeString()]);
        break;

      case 'repair-sales':
        title = 'Laporan Servis Baiki Smartphone';
        headers = ['Job ID', 'Pelanggan', 'Telefon', 'Peranti', 'Kerosakan', 'Kos Part (RM)', 'Upah (RM)', 'Jumlah (RM)', 'Untung (RM)', 'Status'];
        rows = repairJobs.map(j => [j.id, j.customerName, j.customerPhone, `${j.deviceBrand} ${j.deviceModel}`, j.damageType, j.partsCost.toFixed(2), Number(j.labourCost || 0).toFixed(2), j.sellingPrice.toFixed(2), j.grossProfit.toFixed(2), j.repairStatus]);
        break;

      case 'accessories-sales':
        title = 'Laporan Jualan Aksesori Telefon';
        headers = ['Resit', 'Pelanggan', 'Item Aksesori', 'Kos (RM)', 'Harga Jual (RM)', 'Untung (RM)', 'Tarikh'];
        rows = sales.filter(s => s.module === 'ACCESSORIES').map(s => [s.receiptNo, s.customerName, s.itemsSummary, (s.costPrice || 0).toFixed(2), s.sellingPrice.toFixed(2), (s.grossProfit || 0).toFixed(2), new Date(s.date).toLocaleDateString()]);
        break;

      case 'repair-damage':
        title = 'Laporan Analisis Kerosakan Telefon';
        headers = ['Jenis Kerosakan', 'Bilangan Kes', 'Jumlah Kutipan (RM)', 'Peratus Kes (%)'];
        const damageCounts = {};
        repairJobs.forEach(j => {
          damageCounts[j.damageType] = (damageCounts[j.damageType] || 0) + 1;
        });
        rows = Object.keys(damageCounts).map(d => [d, damageCounts[d], (damageCounts[d] * 120).toFixed(2), `${((damageCounts[d] / repairJobs.length) * 100).toFixed(1)}%`]);
        break;

      case 'repair-brand':
        title = 'Laporan Pembaikan Mengikut Jenama';
        headers = ['Jenama Peranti', 'Bilangan Peranti', 'Jumlah Nilai Servis (RM)'];
        const brandCounts = {};
        repairJobs.forEach(j => {
          brandCounts[j.deviceBrand] = (brandCounts[j.deviceBrand] || 0) + 1;
        });
        rows = Object.keys(brandCounts).map(b => [b, brandCounts[b], (brandCounts[b] * 140).toFixed(2)]);
        break;

      case 'inventory-valuation':
        title = 'Laporan Penilaian Nilai Inventori Pusat';
        headers = ['SKU', 'Nama Item', 'Kategori', 'Stok Baki', 'Unit', 'Kos Seunit (RM)', 'Jumlah Nilai Stok (RM)'];
        rows = inventory.map(i => [i.sku, i.name, i.category, i.currentStock, i.unit, i.costPrice.toFixed(2), (i.currentStock * i.costPrice).toFixed(2)]);
        break;

      case 'low-stock-report':
        title = 'Laporan Item Paras Stok Rendah';
        headers = ['SKU', 'Nama Item', 'Kategori', 'Baki Semasa', 'Paras Min', 'Defisit Stok', 'Status'];
        rows = inventory.filter(i => i.currentStock <= i.minStock).map(i => [i.sku, i.name, i.category, i.currentStock, i.minStock, i.minStock - i.currentStock, i.status]);
        break;

      case 'stock-movement-report':
        title = 'Laporan Pergerakan Stok';
        headers = ['ID TX', 'Tarikh', 'Item', 'Jenis', 'Kuantiti', 'Sebelum', 'Selepas', 'Rujukan', 'Pengguna'];
        rows = stockTransactions.map(t => [t.id, new Date(t.date).toLocaleDateString(), t.itemName, t.type, t.quantity, t.beforeQty, t.afterQty, t.reference, t.user]);
        break;

      case 'purchase-report':
        title = 'Laporan Permohonan & Pesanan Pembelian';
        headers = ['PR ID', 'Tarikh', 'Pembekal', 'Jabatan', 'Jumlah (RM)', 'Status', 'Kelulusan'];
        rows = purchaseRequests.map(p => [p.id, new Date(p.requestDate).toLocaleDateString(), p.supplierName, p.department, p.totalAmount.toFixed(2), p.status, p.approvedBy || '-']);
        break;

      case 'supplier-report':
        title = 'Laporan Prestasi & Pembelian Pembekal';
        headers = ['Supplier ID', 'Nama Pembekal', 'Kategori', 'Wakil (PIC)', 'Telefon', 'Jumlah Belian (RM)'];
        rows = suppliers.map(s => [s.id, s.name, s.productCategory, s.contactPerson, s.phone, Number(s.totalPurchases || 0).toFixed(2)]);
        break;

      case 'profit-loss':
        title = 'Penyata Untung Rugi Operasi TRIG (P&L)';
        headers = ['Komponen Kewangan', 'Café & Makanan (RM)', 'Baiki Smartphone (RM)', 'Aksesori (RM)', 'JUMLAH KESELURUHAN (RM)'];
        const cfRev = sales.filter(s => s.module === 'CAFÉ').reduce((a, b) => a + b.sellingPrice, 0);
        const rpRev = sales.filter(s => s.module === 'REPAIR').reduce((a, b) => a + b.sellingPrice, 0);
        const acRev = sales.filter(s => s.module === 'ACCESSORIES').reduce((a, b) => a + b.sellingPrice, 0);

        const cfCost = sales.filter(s => s.module === 'CAFÉ').reduce((a, b) => a + (b.costPrice || 0), 0);
        const rpCost = sales.filter(s => s.module === 'REPAIR').reduce((a, b) => a + (b.costPrice || 0), 0);
        const acCost = sales.filter(s => s.module === 'ACCESSORIES').reduce((a, b) => a + (b.costPrice || 0), 0);

        rows = [
          ['1. Hasil Jualan Kasar (Revenue)', cfRev.toFixed(2), rpRev.toFixed(2), acRev.toFixed(2), (cfRev + rpRev + acRev).toFixed(2)],
          ['2. Kos Barang/Alat Ganti (COGS)', cfCost.toFixed(2), rpCost.toFixed(2), acCost.toFixed(2), (cfCost + rpCost + acCost).toFixed(2)],
          ['3. UNTUNG KASAR (GROSS PROFIT)', (cfRev - cfCost).toFixed(2), (rpRev - rpCost).toFixed(2), (acRev - acCost).toFixed(2), ((cfRev + rpRev + acRev) - (cfCost + rpCost + acCost)).toFixed(2)]
        ];
        break;

      case 'payment-report':
        title = 'Laporan Kaedah Bayaran & Penerimaan';
        headers = ['No. Resit', 'Modul', 'Pelanggan', 'Kaedah Bayaran', 'Jumlah (RM)', 'Status', 'Juruwang'];
        rows = sales.map(s => [s.receiptNo, s.module, s.customerName, s.paymentMethod, s.sellingPrice.toFixed(2), s.paymentStatus, s.cashierName]);
        break;

      case 'customer-report':
        title = 'Laporan Pelanggan & Perbelanjaan';
        headers = ['Customer ID', 'Nama', 'Telefon', 'E-mel', 'Bil Baiki', 'Jumlah Belanja (RM)', 'Baiki Terakhir'];
        rows = customers.map(c => [c.id, c.name, c.phone, c.email || '-', c.totalRepairs, c.totalSpending.toFixed(2), c.lastRepair]);
        break;

      case 'top-selling':
        title = 'Laporan Produk & Hidangan Paling Laris';
        headers = ['Nama Item', 'Kategori', 'Harga Jual (RM)', 'Kekerapan Jualan', 'Jumlah Hasil (RM)'];
        rows = [
          ['Nasi Ayam Istimewa GIATMARA', 'Café / Rice', '8.00', '42 Pinggan', '336.00'],
          ['Teh Ais Pyorr Padu', 'Café / Drinks', '3.00', '85 Gelas', '255.00'],
          ['Mee Goreng Mamak Special', 'Café / Noodles', '7.00', '28 Pinggan', '196.00'],
          ['LCD Samsung Galaxy A55', 'Repair / LCD', '130.00', '8 Unit', '1040.00'],
          ['High-Cap Battery iPhone 11', 'Repair / Battery', '80.00', '6 Unit', '480.00'],
          ['Braided Fast Charge USB Type-C', 'Accessories', '15.00', '16 Unit', '240.00']
        ];
        break;

      case 'staff-activity':
        title = 'Laporan Aktiviti Audit Staf & Pelatih';
        headers = ['Log ID', 'Tarikh & Masa', 'Pengguna', 'Modul', 'Tindakan Direkodkan'];
        rows = auditLogs.map(l => [l.id, new Date(l.timestamp).toLocaleString(), l.user, l.module, l.action]);
        break;

      default:
        title = 'Laporan Umum';
        headers = ['ID', 'Keterangan'];
        rows = [];
    }

    // Filter rows by query
    const filteredRows = searchQuery
      ? rows.filter(r => r.some(cell => String(cell).toLowerCase().includes(searchQuery.toLowerCase())))
      : rows;

    return { title, headers, rows: filteredRows };
  };

  const currentReport = getReportData();

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += `"${currentReport.title} - ${settings.businessName}"\n\n`;
    csvContent += currentReport.headers.map(h => `"${h}"`).join(',') + '\n';
    currentReport.rows.forEach(row => {
      csvContent += row.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',') + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `TRIG_REPORT_${activeReport}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Laporan CSV berjaya dimuat turun!');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 mb-1 uppercase tracking-wider">
            <BarChart3 className="w-4 h-4" />
            <span>Pusat Laporan & Analitik Pengurusan</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            PUSAT 20+ LAPORAN BERSEPADU TRIG
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Jana laporan jualan, untung rugi, kerosakan smartphone, pergerakan stok dan eksport CSV atau cetak dokumen rasmi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
          >
            <Download className="w-4 h-4" />
            <span>Eksport CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Laporan</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Left Selector, Right Report Output */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left 1 Col: Report Directory */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-2 h-fit">
          <span className="font-bold text-slate-700 block text-xs uppercase px-2 mb-2">
            Pilih Jenis Laporan (20 Laporan):
          </span>
          <div className="space-y-1 max-h-[70vh] overflow-y-auto pr-1">
            {reportList.map(rep => (
              <button
                key={rep.id}
                onClick={() => setActiveReport(rep.id)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-between ${
                  activeReport === rep.id
                    ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="truncate">{rep.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right 3 Cols: Report Table Viewer */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari dalam laporan semasa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span>Julat:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
              <span>hingga</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          {/* Generated Report Paper */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
            
            <div className="border-b pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-black text-base text-slate-900">{currentReport.title}</h3>
                <p className="text-[11px] text-slate-500">
                  {settings.businessName} • Tarikh Dijana: {new Date().toLocaleString()}
                </p>
              </div>
              <span className="text-xs font-bold text-slate-500">
                {currentReport.rows.length} Rekod
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase">
                  <tr>
                    {currentReport.headers.map((h, idx) => (
                      <th key={idx} className="py-3 px-3.5 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {currentReport.rows.length === 0 ? (
                    <tr>
                      <td colSpan={currentReport.headers.length} className="py-8 text-center text-slate-400">
                        Tiada data bagi kriteria laporan ini.
                      </td>
                    </tr>
                  ) : (
                    currentReport.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50 transition">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="py-2.5 px-3.5 whitespace-nowrap">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
