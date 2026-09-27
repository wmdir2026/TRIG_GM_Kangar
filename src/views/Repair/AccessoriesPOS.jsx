import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  SmartphoneNfc,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Search,
  CheckCircle,
  QrCode,
  DollarSign,
  Package,
  Sparkles,
  Receipt,
  X
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export const AccessoriesPOS = () => {
  const { inventory, sellAccessories, openReceipt, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [cart, setCart] = useState([]);

  // Payment Modal
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('QR_PAYMENT');
  const [cashTendered, setCashTendered] = useState('');

  // Filter only accessories from central inventory
  const accessories = inventory.filter(i => i.category === 'Smartphone Accessories');

  const filteredAccessories = accessories.filter(acc =>
    acc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    acc.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    acc.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToCart = (acc) => {
    if (acc.currentStock <= 0) {
      showToast('Stok aksesori ini telah habis.', 'warning');
      return;
    }

    setCart(prev => {
      const existing = prev.find(i => i.id === acc.id);
      if (existing) {
        if (existing.quantity >= acc.currentStock) {
          showToast(`Kuantiti melebihi baki stok semasa (${acc.currentStock}).`, 'warning');
          return prev;
        }
        return prev.map(i => i.id === acc.id ? { ...i, quantity: i.quantity + 1 } : i);
      } else {
        return [...prev, { ...acc, quantity: 1 }];
      }
    });
  };

  const handleUpdateQty = (accId, change) => {
    setCart(prev => prev.map(i => {
      if (i.id === accId) {
        const itemInStock = inventory.find(inv => inv.id === accId);
        const maxStock = itemInStock ? itemInStock.currentStock : 99;
        const newQty = i.quantity + change;
        if (newQty > maxStock) {
          showToast(`Maksimum stok ${maxStock} unit.`, 'warning');
          return i;
        }
        return newQty > 0 ? { ...i, quantity: newQty } : null;
      }
      return i;
    }).filter(Boolean));
  };

  const handleRemove = (accId) => {
    setCart(prev => prev.filter(i => i.id !== accId));
  };

  const subtotal = cart.reduce((acc, it) => acc + (it.sellingPrice * it.quantity), 0);
  const grandTotal = subtotal;
  const cashAmount = parseFloat(cashTendered) || 0;
  const changeDue = Math.max(0, cashAmount - grandTotal);

  const handleOpenCheckout = () => {
    if (cart.length === 0) {
      showToast('Sila pilih aksesori ke troli dahulu.', 'warning');
      return;
    }
    setCashTendered(grandTotal.toString());
    setIsPaymentModalOpen(true);
  };

  const handleCompleteSale = () => {
    if (paymentMethod === 'CASH' && cashAmount < grandTotal) {
      showToast('Wang tunai tidak mencukupi.', 'error');
      return;
    }

    sellAccessories({
      items: cart,
      customerName: customerName || 'Pelanggan Walk-In',
      paymentMethod
    });

    setCart([]);
    setIsPaymentModalOpen(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      
      {/* Left 2 Cols: Accessories Grid */}
      <div className="lg:col-span-2 space-y-4">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-950 text-white p-5 rounded-3xl border border-blue-500/20 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-cyan-300 border border-cyan-400/30 text-xs font-bold mb-1">
              <SmartphoneNfc className="w-3.5 h-3.5" />
              <span>JUALAN AKSESORI SMARTPHONE • PLANET SERVICE</span>
            </div>
            <h1 className="text-xl font-black text-white">
              TERMINAL POS AKSESORI SMARTPHONE
            </h1>
            <p className="text-xs text-blue-200 mt-0.5">
              Jualan casing, tempered glass, fast charger, power bank & kabel USB. Stok ditolak secara automatik dari inventori pusat.
            </p>
          </div>

          <div className="relative w-full sm:w-60">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari aksesori, SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900/80 border border-blue-400/30 rounded-xl outline-none font-medium text-white placeholder-slate-400 focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Accessories Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {filteredAccessories.map(acc => (
            <div
              key={acc.id}
              onClick={() => handleAddToCart(acc)}
              className={`bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:shadow-md hover:border-blue-400 cursor-pointer transition flex flex-col justify-between group ${
                acc.currentStock <= 0 ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-mono text-slate-400 font-bold">{acc.sku}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                    acc.currentStock <= 0 ? 'bg-rose-100 text-rose-700' :
                    acc.currentStock <= acc.minStock ? 'bg-amber-100 text-amber-700' :
                    'bg-cyan-100 text-cyan-800'
                  }`}>
                    Stok: {acc.currentStock} {acc.unit}
                  </span>
                </div>

                <h4 className="font-bold text-xs text-slate-900 line-clamp-2 leading-snug">
                  {acc.name}
                </h4>
                <p className="text-[10px] text-slate-400 mt-1">{acc.brand} • {acc.model}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Harga Jualan</span>
                  <span className="text-sm font-black text-blue-700">RM {acc.sellingPrice.toFixed(2)}</span>
                </div>
                <button
                  type="button"
                  className="p-1.5 rounded-lg bg-blue-50 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Right 1 Col: Cart & POS Checkout */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-5 flex flex-col justify-between h-full">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-black text-sm text-slate-900">Troli Jualan Aksesori</h3>
                <span className="text-[10px] text-slate-400">Kaunter Hadapan Bengkel</span>
              </div>
            </div>

            {cart.length > 0 && (
              <button
                onClick={() => setCart([])}
                className="text-[11px] text-rose-500 hover:text-rose-700 font-semibold"
              >
                Kosongkan
              </button>
            )}
          </div>

          {/* Customer Name */}
          <div className="my-3">
            <input
              type="text"
              placeholder="Nama Pelanggan (Pilihan)"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl outline-none font-bold text-slate-950 placeholder:text-slate-600 focus:border-blue-500"
            />
          </div>

          {/* Cart Items List */}
          <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-1">
            {cart.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                <Package className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="font-semibold text-slate-600">Tiada aksesori dalam troli</p>
                <p className="text-[11px]">Pilih aksesori di sebelah kiri untuk menambah ke jualan</p>
              </div>
            ) : (
              cart.map(item => (
                <div
                  key={item.id}
                  className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs"
                >
                  <div className="flex-1 pr-2">
                    <h4 className="font-bold text-slate-900 line-clamp-1">{item.name}</h4>
                    <span className="text-[11px] text-amber-700 font-semibold">
                      RM {item.sellingPrice.toFixed(2)} × {item.quantity} = RM {(item.sellingPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-lg p-0.5">
                    <button
                      onClick={() => handleUpdateQty(item.id, -1)}
                      className="p-1 hover:bg-slate-100 rounded text-slate-900 font-black"
                    >
                      <Minus className="w-3 h-3 stroke-[2.5]" />
                    </button>
                    <span className="font-black text-xs px-2 text-slate-950">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQty(item.id, 1)}
                      className="p-1 hover:bg-slate-100 rounded text-slate-900 font-black"
                    >
                      <Plus className="w-3 h-3 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Cart Total & Checkout Button */}
        {/* Cart Summary & Action */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex justify-between text-base font-black text-slate-950">
            <span>JUMLAH JUALAN:</span>
            <span className="text-blue-700">RM {grandTotal.toFixed(2)}</span>
          </div>

          <button
            onClick={handleOpenCheckout}
            disabled={cart.length === 0}
            className={`w-full py-3.5 rounded-2xl text-xs font-black text-white shadow-lg flex items-center justify-center gap-2 transition ${
              cart.length === 0
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/25'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>Terima Bayaran & Cetak Resit (ACC)</span>
          </button>
        </div>

      </div>

      {/* Payment Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 border border-slate-200 animate-fade-in text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-black text-base text-slate-900">Bayaran Jualan Aksesori</h3>
              <button onClick={() => setIsPaymentModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 mb-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('QR_PAYMENT')}
                className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 font-bold ${
                  paymentMethod === 'QR_PAYMENT'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-700'
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                <QrCode className="w-5 h-5" />
                <span>QR DuitNow</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('CASH')}
                className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 font-bold ${
                  paymentMethod === 'CASH'
                    ? 'border-emerald-600 bg-emerald-50/70 text-emerald-700'
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                <DollarSign className="w-5 h-5" />
                <span>Tunai (Cash)</span>
              </button>
            </div>

            {paymentMethod === 'QR_PAYMENT' ? (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2 mb-4">
                <p className="font-bold text-slate-800">DuitNow QR Merchant TRIG GIATMARA</p>
                <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-200 inline-block">
                  <QRCodeSVG value={`DUITNOW:TRIG-ACCESSORIES:RM${grandTotal.toFixed(2)}`} size={130} level="M" />
                </div>
                <p className="font-bold text-blue-700 text-sm">Jumlah: RM {grandTotal.toFixed(2)}</p>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 mb-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Wang Tunai (RM)</label>
                  <input
                    type="number"
                    step="0.50"
                    min={grandTotal}
                    value={cashTendered}
                    onChange={(e) => setCashTendered(e.target.value)}
                    className="w-full px-3 py-2 text-sm font-black bg-white border border-slate-200 rounded-xl"
                  />
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded-xl border border-slate-200 font-bold">
                  <span>Baki:</span>
                  <span className="text-emerald-700 font-black text-sm">RM {changeDue.toFixed(2)}</span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <button
                onClick={handleCompleteSale}
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md transition"
              >
                Sahkan Bayaran & Tolak Stok
              </button>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="w-full py-2 text-slate-500 hover:bg-slate-100 font-semibold rounded-xl"
              >
                Batal
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
