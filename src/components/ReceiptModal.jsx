import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Printer,
  X,
  Download,
  Copy,
  CheckCircle,
  FileText,
  Smartphone,
  Coffee,
  Sparkles,
  QrCode
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export const ReceiptModal = () => {
  const { receiptData, isReceiptModalOpen, setIsReceiptModalOpen, settings, showToast } = useApp();
  const [printFormat, setPrintFormat] = useState('80mm'); // '80mm', '58mm', 'a4'

  if (!isReceiptModalOpen || !receiptData) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    let text = `==============================\n${settings.businessName}\n${settings.institution}\n==============================\n`;
    if (receiptData.type === 'REPAIR') {
      const job = receiptData.job;
      text += `RESIT SERVIS BAIKI TELEFON\nNo. Resit: ${job.receiptNo || job.id}\nTarikh: ${new Date(job.completedAt || job.dateReceived).toLocaleString()}\nPelanggan: ${job.customerName} (${job.customerPhone})\nPeranti: ${job.deviceBrand} ${job.deviceModel}\nKerosakan: ${job.damageType}\n------------------------------\n`;
      (job.partsUsed || []).forEach(p => {
        text += `${p.name} (x${p.quantity || 1}): RM ${((p.sellingPrice || 0) * (p.quantity || 1)).toFixed(2)}\n`;
      });
      text += `Upah Buruh/Servis: RM ${Number(job.labourCost || 0).toFixed(2)}\n`;
      text += `JUMLAH BESAR: RM ${Number(job.sellingPrice).toFixed(2)}\nKaedah Bayaran: ${job.paymentMethod || 'TUNAI'} (LULUS/PAID)\nWaranti: ${job.warrantyPeriod}\n==============================\n${settings.repairReceiptFooter}`;
    } else {
      // Café or Accessories
      const isCafe = receiptData.type !== 'ACCESSORIES';
      text += `${isCafe ? 'RESIT CAFÉ & MAKANAN' : 'RESIT JUALAN AKSESORI'}\nNo. Resit: ${receiptData.receiptNo || receiptData.id}\nTarikh: ${new Date(receiptData.date || Date.now()).toLocaleString()}\nPelanggan: ${receiptData.customerName || 'Pelanggan Walk-in'}\n`;
      if (receiptData.tableId) text += `Meja: ${receiptData.tableId} (Dine-In)\n`;
      text += `------------------------------\n`;
      (receiptData.items || []).forEach(it => {
        text += `${it.name} x${it.quantity}: RM ${(it.price ? it.price * it.quantity : (it.sellingPrice || 0) * it.quantity).toFixed(2)}\n`;
      });
      text += `JUMLAH: RM ${Number(receiptData.grandTotal || receiptData.subtotal).toFixed(2)}\nKaedah: ${receiptData.paymentMethod || 'TUNAI'} (PAID)\n==============================\n${settings.cafeReceiptFooter}`;
    }

    navigator.clipboard.writeText(text);
    showToast('Teks resit berjaya disalin ke papan keratan.');
  };

  const isRepair = receiptData.type === 'REPAIR';
  const job = receiptData.job || {};
  const isAccessories = receiptData.type === 'ACCESSORIES';

  const receiptNumber = isRepair ? (job.receiptNo || job.id) : (receiptData.receiptNo || receiptData.id);
  const transactionDate = isRepair ? (job.completedAt || job.dateReceived) : (receiptData.date || receiptData.createdAt || new Date().toISOString());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 flex flex-col max-h-[90vh] animate-fade-in">
        
        {/* Modal Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            {isRepair ? (
              <Smartphone className="w-5 h-5 text-blue-400" />
            ) : isAccessories ? (
              <Sparkles className="w-5 h-5 text-amber-400" />
            ) : (
              <Coffee className="w-5 h-5 text-emerald-400" />
            )}
            <span className="font-bold text-sm">
              Pratonton Resit Rasmi ({isRepair ? 'Baiki Telefon' : isAccessories ? 'Jualan Aksesori' : 'Café GIATMARA'})
            </span>
          </div>
          <button
            onClick={() => setIsReceiptModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selector Bar */}
        <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 flex items-center justify-between no-print text-xs">
          <span className="font-semibold text-slate-600">Format Cetakan:</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPrintFormat('80mm')}
              className={`px-2.5 py-1 rounded-lg font-bold transition ${
                printFormat === '80mm' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
            >
              Thermal 80mm
            </button>
            <button
              onClick={() => setPrintFormat('58mm')}
              className={`px-2.5 py-1 rounded-lg font-bold transition ${
                printFormat === '58mm' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
            >
              Thermal 58mm
            </button>
            <button
              onClick={() => setPrintFormat('a4')}
              className={`px-2.5 py-1 rounded-lg font-bold transition ${
                printFormat === 'a4' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
            >
              Kertas A4
            </button>
          </div>
        </div>

        {/* Receipt Container */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-100 flex justify-center">
          <div
            id="printable-receipt"
            className={`bg-white shadow-lg border border-slate-200 p-6 text-slate-900 font-mono transition-all ${
              printFormat === '58mm' ? 'w-[280px] text-[11px]' :
              printFormat === '80mm' ? 'w-[360px] text-xs' :
              'w-full text-xs'
            }`}
          >
            {/* Header */}
            <div className="text-center pb-4 border-b-2 border-dashed border-slate-300">
              <div className="mx-auto mb-2 flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="GIATMARA Logo"
                  className="h-14 w-auto object-contain mx-auto"
                />
              </div>
              <h2 className="font-black text-sm sm:text-base uppercase tracking-tight text-slate-950 mt-1">
                {settings.businessName}
              </h2>
              <p className="text-[11px] font-bold text-slate-600">
                {isRepair ? 'PERKHIDMATAN MEMBAIKI SMARTPHONE' : 'CAFÉ & FOOD SERVICES'}
              </p>
              <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                {settings.institution}<br />
                {settings.address}<br />
                Tel: {settings.phone}
              </p>
            </div>

            {/* Metadata */}
            <div className="py-3 border-b border-dashed border-slate-300 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">No. Resit:</span>
                <span className="font-bold text-slate-900">{receiptNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tarikh & Masa:</span>
                <span>{new Date(transactionDate).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Pelanggan:</span>
                <span className="font-semibold text-slate-900">
                  {isRepair ? job.customerName : (receiptData.customerName || 'Pelanggan Walk-in')}
                </span>
              </div>

              {/* Cafe Specific Meta */}
              {!isRepair && receiptData.orderType && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Jenis Pesanan:</span>
                  <span className="font-bold text-indigo-700">
                    {receiptData.orderType === 'DINE_IN' ? `Dine-In (Meja ${receiptData.tableId})` : 'Bungkus / Takeaway'}
                  </span>
                </div>
              )}

              {/* Repair Specific Meta */}
              {isRepair && (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Peranti:</span>
                    <span className="font-bold text-slate-900">{job.deviceBrand} {job.deviceModel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Kerosakan:</span>
                    <span className="text-rose-700 font-semibold">{job.damageType}</span>
                  </div>
                  {job.imeiSerial && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">IMEI/Siri:</span>
                      <span className="text-[10px] text-slate-600">{job.imeiSerial}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-500">Juruteknik:</span>
                    <span>{job.technician || 'Pelatih TRIG'}</span>
                  </div>
                </>
              )}
            </div>

            {/* Items Table */}
            <div className="py-3 border-b-2 border-dashed border-slate-300">
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="pb-1.5 font-bold">Item / Servis</th>
                    <th className="pb-1.5 text-center font-bold">Qty</th>
                    <th className="pb-1.5 text-right font-bold">Jumlah</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isRepair ? (
                    <>
                      {(job.partsUsed || []).map((p, idx) => (
                        <tr key={idx}>
                          <td className="py-1.5 pr-2 font-medium">{p.name}</td>
                          <td className="py-1.5 text-center">{p.quantity || 1}</td>
                          <td className="py-1.5 text-right font-bold">
                            RM {(((p.sellingPrice || 0)) * (p.quantity || 1)).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td className="py-1.5 pr-2 font-medium text-slate-700">Upah Servis & Pemasangan</td>
                        <td className="py-1.5 text-center">1</td>
                        <td className="py-1.5 text-right font-bold">
                          RM {Number(job.labourCost || 0).toFixed(2)}
                        </td>
                      </tr>
                    </>
                  ) : (
                    (receiptData.items || []).map((it, idx) => {
                      const itemPrice = it.price !== undefined ? it.price : it.sellingPrice;
                      return (
                        <tr key={idx}>
                          <td className="py-1.5 pr-2">
                            <span className="font-semibold block">{it.name}</span>
                            {it.notes && <span className="text-[9px] text-slate-500 italic">Note: {it.notes}</span>}
                          </td>
                          <td className="py-1.5 text-center">{it.quantity}</td>
                          <td className="py-1.5 text-right font-bold">
                            RM {(itemPrice * it.quantity).toFixed(2)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="py-3 border-b border-dashed border-slate-300 space-y-1.5 text-[11px]">
              <div className="flex justify-between text-slate-600">
                <span>Jumlah Kasar:</span>
                <span>RM {Number(isRepair ? job.sellingPrice : (receiptData.subtotal || receiptData.grandTotal)).toFixed(2)}</span>
              </div>
              {Number(receiptData.discount || 0) > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Diskaun:</span>
                  <span>- RM {Number(receiptData.discount).toFixed(2)}</span>
                </div>
              )}
              {Number(receiptData.tax || 0) > 0 && (
                <div className="flex justify-between text-slate-500">
                  <span>Cukai:</span>
                  <span>RM {Number(receiptData.tax).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black text-slate-950 pt-1 border-t border-slate-200">
                <span>JUMLAH BESAR:</span>
                <span className="text-base text-indigo-900">
                  RM {Number(isRepair ? job.sellingPrice : (receiptData.grandTotal || receiptData.subtotal)).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Payment Method & Status */}
            <div className="py-2.5 border-b border-dashed border-slate-300 flex items-center justify-between text-[11px]">
              <div>
                <span className="text-slate-500">Kaedah Bayaran: </span>
                <span className="font-bold text-slate-800">
                  {isRepair ? (job.paymentMethod || 'DuitNow QR') : (receiptData.paymentMethod || 'TUNAI')}
                </span>
              </div>
              <div className="flex items-center gap-1 text-emerald-700 font-black bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>LULUS / PAID</span>
              </div>
            </div>

            {/* Warranty / Repair Notice */}
            {isRepair && job.warrantyPeriod && (
              <div className="py-2 bg-blue-50/80 rounded-lg p-2 my-2 border border-blue-200 text-[10px] text-blue-900 leading-tight">
                <span className="font-bold block">Jaminan Waranti:</span>
                {job.warrantyPeriod}. Tidak termasuk kerosakan fizikal, cecair atau ubah suai luar.
              </div>
            )}

            {/* QR Code Verification Simulation */}
            <div className="py-3 flex flex-col items-center justify-center text-center">
              <QRCodeSVG
                value={`TRIG-GIATMARA-RECEIPT:${receiptNumber}:${isRepair ? job.sellingPrice : (receiptData.grandTotal || receiptData.subtotal)}`}
                size={80}
                level="M"
              />
              <span className="text-[9px] text-slate-400 mt-1">Imbas untuk semak ketulenan resit</span>
            </div>

            {/* Footer */}
            <div className="text-center pt-2 text-[10px] text-slate-500 leading-relaxed">
              <p className="font-semibold whitespace-pre-line">
                {isRepair ? settings.repairReceiptFooter : settings.cafeReceiptFooter}
              </p>
              <p className="text-[9px] text-slate-400 mt-2 font-mono">
                Juruwang: {receiptData.cashierName || (isRepair ? 'Mohd Nabil' : 'NUR Atiqah')} • ID: {receiptNumber}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between no-print">
          <button
            onClick={handleCopyText}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
          >
            <Copy className="w-4 h-4" />
            <span>Salin Teks Resit</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsReceiptModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Tutup
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Resit Sekarang</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
