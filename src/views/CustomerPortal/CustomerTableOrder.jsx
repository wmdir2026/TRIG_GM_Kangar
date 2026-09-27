import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  UtensilsCrossed,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Search,
  CheckCircle,
  QrCode,
  Sparkles,
  DollarSign,
  Coffee,
  Flame,
  Star,
  Award,
  Bike,
  Tag,
  X
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export const CustomerTableOrder = () => {
  const {
    menu,
    tables,
    categories,
    createFoodOrder,
    selectedTableForCustomer,
    settings,
    openReceipt,
    showToast
  } = useApp();

  const [tableId, setTableId] = useState(selectedTableForCustomer || 'M05');
  const [orderType, setOrderType] = useState('DINE_IN');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [cart, setCart] = useState([]);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('QR_PAYMENT');

  const handleAddToCart = (item) => {
    if (item.status === 'OUT OF STOCK') {
      showToast('Item ini habis.', 'warning');
      return;
    }

    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1, notes: '' }];
    });
    showToast(`Ditambah: ${item.name}`);
  };

  const handleUpdateQty = (itemId, change) => {
    setCart(prev => prev.map(i => {
      if (i.id === itemId) {
        const newQty = i.quantity + change;
        return newQty > 0 ? { ...i, quantity: newQty } : null;
      }
      return i;
    }).filter(Boolean));
  };

  const handleUpdateNotes = (itemId, notes) => {
    setCart(prev => prev.map(i => i.id === itemId ? { ...i, notes } : i));
  };

  const subtotal = cart.reduce((acc, it) => acc + (it.sellingPrice * it.quantity), 0);
  const grandTotal = subtotal;

  const filteredMenu = menu.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const bestsellers = menu.slice(0, 4);

  const handleCheckoutSubmit = () => {
    if (cart.length === 0) return;

    const orderItems = cart.map(it => ({
      menuId: it.id,
      name: it.name,
      price: it.sellingPrice,
      costPrice: it.costPrice,
      quantity: it.quantity,
      subtotal: it.sellingPrice * it.quantity,
      notes: it.notes || ''
    }));

    const newOrder = createFoodOrder({
      orderType,
      tableId: orderType === 'DINE_IN' ? tableId : null,
      customerName: customerName || (orderType === 'DINE_IN' ? `Pelanggan Meja ${tableId}` : 'Pelanggan Bungkus'),
      customerPhone,
      items: orderItems,
      paymentMethod
    });

    setIsCheckoutModalOpen(false);
    setCart([]);

    if (newOrder) {
      openReceipt(newOrder);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-24 text-slate-100 font-sans">
      
      {/* Top Brand & Table Switcher Header */}
      <div className="bg-slate-900/90 backdrop-blur-md p-4 rounded-3xl border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="bg-white px-3 py-2 rounded-2xl shadow-md shrink-0">
            <img src="/logo.png" alt="GIATMARA Logo" className="h-12 sm:h-14 w-auto object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-black text-white tracking-tight">
                CAFÉ TRIG GIATMARA KANGAR
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-extrabold border border-amber-500/30">
                EAT • ENJOY • REPEAT
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Kursus Seni Masakan & Bakeri GIATMARA Perlis</p>
          </div>
        </div>

        {/* Order Mode & Table Select */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setOrderType('DINE_IN')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                orderType === 'DINE_IN'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              DINE-IN
            </button>
            <button
              onClick={() => setOrderType('TAKEAWAY')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                orderType === 'TAKEAWAY'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              TAKEAWAY
            </button>
          </div>

          {orderType === 'DINE_IN' && (
            <select
              value={tableId}
              onChange={(e) => setTableId(e.target.value)}
              className="text-xs font-black px-2.5 py-1.5 bg-slate-800 text-amber-400 rounded-xl border border-slate-700 outline-none"
            >
              {tables.map(t => (
                <option key={t.id} value={t.id}>
                  Meja {t.id}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Hero Showcase Banner (TastyBites Style from Image 1) */}
      <div className="relative rounded-3xl overflow-hidden bg-radial from-slate-900 via-slate-950 to-black border border-amber-500/20 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 items-center gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-black uppercase tracking-wider border border-amber-500/40">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Craving Something Delicious?</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
              Delicious <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-400 via-orange-400 to-amber-200">
                MASAKAN & HIDANGAN
              </span>
            </h1>

            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-slate-300">
              <span className="text-amber-400">HOT</span> • <span>FRESH</span> • <span className="text-orange-400">TASTY</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed">
              Disediakan segar setiap hari oleh pelatih mahir Kursus Seni Masakan GIATMARA Kangar dengan bahan premium dan resipi tradisi.
            </p>

            <div className="flex items-center gap-4 pt-2">
              <a
                href="#menu-catalog"
                className="px-6 py-3 bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black rounded-2xl text-xs sm:text-sm shadow-lg shadow-amber-500/30 transition flex items-center gap-2"
              >
                <span>ORDER NOW &rarr;</span>
              </a>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/80 border border-amber-500/30 text-amber-300 text-xs font-bold">
                <Award className="w-4 h-4 text-amber-400" />
                <span>100% FRESH & HALAL</span>
              </div>
            </div>
          </div>

          {/* Hero Food Visual */}
          <div className="relative flex items-center justify-center">
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full bg-linear-to-tr from-amber-500/20 via-orange-500/10 to-transparent p-4 flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80"
                alt="Delicious Burger / Gourmet Food"
                className="w-full h-full object-cover rounded-3xl shadow-2xl border-2 border-amber-500/30 rotate-2 hover:rotate-0 transition duration-500"
              />
              <div className="absolute -bottom-2 -left-2 bg-slate-950/90 border border-amber-500/40 text-amber-400 px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-black">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>MENU PILIHAN RAMAI</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Icons Showcase (Pills like Image 1) */}
      <div className="bg-slate-900/90 p-4 rounded-3xl border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between px-2">
          <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
            PILIH KATEGORI HIDANGAN:
          </span>
          <div className="relative w-48 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari hidangan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition whitespace-nowrap flex items-center gap-2 ${
              selectedCategory === 'ALL'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>SEMUA ({menu.length})</span>
          </button>

          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition whitespace-nowrap flex items-center gap-2 ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>{cat}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Popular Picks / BESTSELLERS Section (From Image 1) */}
      {selectedCategory === 'ALL' && !searchQuery && (
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-3 text-center my-4">
            <div className="h-px bg-linear-to-r from-transparent via-amber-500 to-transparent w-24"></div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
              — POPULAR PICKS • OUR BESTSELLERS —
            </span>
            <div className="h-px bg-linear-to-r from-transparent via-amber-500 to-transparent w-24"></div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {bestsellers.map(item => (
              <div
                key={item.id}
                onClick={() => handleAddToCart(item)}
                className="bg-slate-900 rounded-3xl border border-slate-800 p-3.5 flex flex-col justify-between hover:border-amber-500/60 transition-all hover:scale-[1.02] cursor-pointer group shadow-lg relative overflow-hidden"
              >
                <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-500 text-slate-950 shadow-sm">
                  BEST SELLER
                </div>

                <div>
                  <div className="relative h-28 w-full bg-slate-950 rounded-2xl overflow-hidden mb-2.5">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>

                  <h3 className="font-black text-xs text-white line-clamp-1 group-hover:text-amber-400 transition">
                    {item.name}
                  </h3>
                  <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                    {item.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="font-black text-amber-400 text-xs">
                    RM {item.sellingPrice.toFixed(2)}
                  </span>
                  <button
                    type="button"
                    className="w-7 h-7 rounded-xl bg-amber-500 group-hover:bg-amber-400 text-slate-950 font-black flex items-center justify-center transition shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full Menu Catalog Section */}
      <div id="menu-catalog" className="space-y-4">
        <h2 className="text-base font-black text-white flex items-center gap-2">
          <UtensilsCrossed className="w-4 h-4 text-amber-400" />
          <span>Katalog Menu Hidangan Café ({filteredMenu.length} Pilihan)</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMenu.map(item => (
            <div
              key={item.id}
              className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-amber-500/50 transition-all shadow-md group"
            >
              <div>
                <div className="relative h-36 w-full bg-slate-950 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80";
                    }}
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-black bg-slate-950/80 text-amber-400 border border-slate-800">
                    {item.category}
                  </span>
                  <span className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950">
                    RM {item.sellingPrice.toFixed(2)}
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="font-black text-sm text-white leading-snug group-hover:text-amber-400 transition">
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button
                  onClick={() => handleAddToCart(item)}
                  disabled={item.status === 'OUT OF STOCK'}
                  className={`w-full py-2.5 rounded-2xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
                    item.status === 'OUT OF STOCK'
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-md shadow-amber-500/20'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>{item.status === 'OUT OF STOCK' ? 'Habis Stok' : 'TAMBAH KE PESANAN'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Takeaway / Promo Delivery Banner (From Image 1) */}
      <div className="rounded-3xl bg-linear-to-r from-amber-500 via-orange-500 to-amber-600 p-6 text-slate-950 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-slate-950 text-amber-400 flex items-center justify-center shadow-lg">
            <Bike className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-slate-950 text-white px-2 py-0.5 rounded-md">
              HUNGRY? ORDER TAKEAWAY!
            </span>
            <h3 className="text-xl sm:text-2xl font-black mt-1 leading-tight">
              Tempahan Makanan Bungkus Sedia Diambil
            </h3>
            <p className="text-xs font-bold text-slate-900 mt-0.5">
              Pesan awal melalui sistem ini untuk jimat masa tanpa perlu menunggu giliran.
            </p>
          </div>
        </div>

        <div className="bg-slate-950 text-white p-4 rounded-2xl text-center shrink-0 border border-amber-400/30">
          <span className="text-[10px] font-extrabold uppercase text-amber-400">DISKAUN PELATIH / STAF</span>
          <p className="text-2xl font-black text-amber-400">KOMBO JIMAT</p>
          <span className="text-[10px] font-mono text-slate-400">KOD: TRIG2026</span>
        </div>
      </div>

      {/* Floating Bottom Cart Bar (Sticky) */}
      {cart.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 max-w-lg mx-auto z-40 animate-fade-in">
          <div className="bg-slate-950 text-white p-4 rounded-3xl shadow-2xl flex items-center justify-between border-2 border-amber-500">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
                  {cart.reduce((a, b) => a + b.quantity, 0)}
                </span>
                <span className="font-bold text-sm">
                  {orderType === 'DINE_IN' ? `Meja ${tableId}` : 'Takeaway'}
                </span>
              </div>
              <p className="text-xs text-amber-400 font-black mt-0.5">
                Jumlah: RM {grandTotal.toFixed(2)}
              </p>
            </div>

            <button
              onClick={() => setIsCheckoutModalOpen(true)}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-2xl text-xs shadow-lg shadow-amber-500/40 transition"
            >
              Hantar & Bayar &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 rounded-3xl shadow-2xl max-w-md w-full p-6 border border-slate-700 animate-fade-in text-xs max-h-[90vh] overflow-y-auto text-slate-200">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <h3 className="font-black text-base text-white">Sahkan Pesanan Makanan</h3>
                <span className="text-[11px] text-amber-400 font-bold">
                  {orderType === 'DINE_IN' ? `Dine-In: Meja ${tableId}` : 'Bungkus / Takeaway'}
                </span>
              </div>
              <button onClick={() => setIsCheckoutModalOpen(false)} className="p-1 text-slate-400 hover:text-white rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="space-y-2 mb-4">
              <span className="font-bold text-slate-400 block text-[11px] uppercase">Senarai Hidangan:</span>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {cart.map(it => (
                  <div key={it.id} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">{it.name} (x{it.quantity})</p>
                      {it.notes && <span className="text-[10px] text-amber-400/80 italic">Nota: {it.notes}</span>}
                    </div>
                    <span className="font-black text-amber-400">
                      RM {(it.sellingPrice * it.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/30 flex items-center justify-between mb-4">
              <span className="font-bold text-slate-300">JUMLAH BESAR:</span>
              <span className="text-base font-black text-amber-400">RM {grandTotal.toFixed(2)}</span>
            </div>

            {/* Payment Method */}
            <div className="space-y-2 mb-4">
              <span className="font-bold text-slate-300 block">Pilih Kaedah Pembayaran:</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('QR_PAYMENT')}
                  className={`p-2.5 rounded-xl border-2 font-bold flex flex-col items-center gap-1 ${
                    paymentMethod === 'QR_PAYMENT' ? 'border-amber-500 bg-amber-500/20 text-amber-400' : 'border-slate-800 text-slate-400 bg-slate-950'
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  <span>DuitNow QR</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('CASH')}
                  className={`p-2.5 rounded-xl border-2 font-bold flex flex-col items-center gap-1 ${
                    paymentMethod === 'CASH' ? 'border-amber-500 bg-amber-500/20 text-amber-400' : 'border-slate-800 text-slate-400 bg-slate-950'
                  }`}
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Tunai (Kaunter)</span>
                </button>
              </div>
            </div>

            {paymentMethod === 'QR_PAYMENT' && (
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-center space-y-2 mb-4">
                <p className="font-bold text-slate-300 text-xs">DuitNow QR Merchant TRIG GIATMARA</p>
                <div className="p-2 bg-white rounded-xl shadow-xs inline-block">
                  <QRCodeSVG value={`DUITNOW:TRIG-TABLE-${tableId}:RM${grandTotal.toFixed(2)}`} size={110} level="M" />
                </div>
                <p className="text-[10px] text-amber-400 font-bold">Imbas & bayar terus dari meja</p>
              </div>
            )}

            {/* Submit */}
            <div className="space-y-2">
              <button
                onClick={handleCheckoutSubmit}
                className="w-full py-3 bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 rounded-2xl font-black shadow-lg shadow-amber-500/30 transition"
              >
                HANTAR KE DAPUR & SAHKAN BAYARAN
              </button>
              <button
                onClick={() => setIsCheckoutModalOpen(false)}
                className="w-full py-2 text-slate-400 hover:text-white rounded-xl font-semibold"
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
