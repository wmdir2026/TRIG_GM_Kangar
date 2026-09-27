import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  QrCode,
  Printer,
  ExternalLink,
  Download,
  UtensilsCrossed,
  Sparkles,
  Info
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export const QRTables = () => {
  const { tables, settings, setCurrentTab, setSelectedTableForCustomer } = useApp();

  const handleSimulate = (tableId) => {
    setSelectedTableForCustomer(tableId);
    setCurrentTab('customer-order');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 mb-1 uppercase tracking-wider">
            <QrCode className="w-4 h-4" />
            <span>Pelekat & Kod QR Meja Café</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            GALERI KOD QR MEJA PELANGGAN
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Setiap meja mempunyai kod QR unik (M01 - M10). Pelanggan boleh mengimbas untuk membuka menu digital dan membuat pesanan secara langsung dari meja masing-masing.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak Semua Pelekat QR</span>
        </button>
      </div>

      {/* Demo Notice */}
      <div className="p-4 bg-indigo-50/80 border border-indigo-200 rounded-2xl flex items-start gap-3 text-xs text-indigo-950">
        <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block">Simulasi Imbasan QR Pantas:</span>
          Anda tidak memerlukan telefon pintar atau kamera untuk demo ini. Cukup klik butang <strong>"Uji Buka Menu Meja Ini"</strong> pada mana-mana kad meja di bawah untuk mencuba aliran pesanan pelanggan sebenar.
        </div>
      </div>

      {/* QR Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tables.map(table => (
          <div
            key={table.id}
            className="bg-white rounded-3xl border-2 border-slate-200 p-6 flex flex-col items-center text-center shadow-xs hover:shadow-lg transition-all group"
          >
            {/* Header / Table Badge */}
            <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white font-black text-xl flex items-center justify-center mb-3 shadow-md group-hover:bg-indigo-600 transition">
              {table.id}
            </div>
            
            <h3 className="font-black text-base text-slate-900">{table.name}</h3>
            <p className="text-[11px] font-bold text-slate-500">{settings.businessName}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{table.location}</p>

            {/* QR Code Container */}
            <div className="my-5 p-4 bg-slate-50 rounded-2xl border border-slate-200 shadow-inner">
              <QRCodeSVG
                value={`https://giatmara-kangar-trig.app/?table=${table.id}`}
                size={140}
                level="H"
                includeMargin={false}
              />
            </div>

            <div className="text-[11px] text-slate-600 font-semibold mb-4">
              <span>Muatan: {table.capacity} Orang</span> • <span className="text-indigo-600">Scan to Order</span>
            </div>

            {/* Action Buttons */}
            <div className="w-full space-y-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => handleSimulate(table.id)}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center justify-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Uji Buka Menu Meja {table.id}</span>
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
