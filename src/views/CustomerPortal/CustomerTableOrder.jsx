import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import giatmaraLogo from '../../assets/logo.png';
import {
  UtensilsCrossed,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Search,
  CheckCircle,
  QrCode,
  DollarSign,
  Flame,
  Star,
  Award,
  Bike,
  X,
  Lock,
  AlertTriangle,
  Clock,
  ChefHat,
  Receipt,
  Info,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Calendar
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export const CustomerTableOrder = () => {
  const {
    menu,
    tables,
    categories,
    createFoodOrder,
    foodOrders,
    updateFoodOrderStatus,
    cancelFoodOrder,
    selectedTableForCustomer,
    openReceipt,
    showToast,
    switchSystemMode,
    isMenuItemAvailableToday,
    getCurrentDayMalay
  } = useApp();

  const todayMalay = getCurrentDayMalay ? getCurrentDayMalay() : 'Hari Ini';

  const [tableId, setTableId] = useState(selectedTableForCustomer || 'M05');
  const [orderType, setOrderType] = useState('DINE_IN');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Right-side Panel State: 'cart' (Bakul Pesanan) or 'status' (Status Dapur)
  const [activeRightTab, setActiveRightTab] = useState('cart');
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('QR_PAYMENT');
  const [activeNoteItemId, setActiveNoteItemId] = useState(null);

  // Active orders for this table or takeaway session
  const activeOrders = (foodOrders || []).filter(o => {
    if (orderType === 'DINE_IN') {
      return o.tableId === tableId && o.orderStatus !== 'CANCELLED' && o.orderStatus !== 'COMPLETED';
    } else {
      return o.orderType === 'TAKEAWAY' && o.orderStatus !== 'CANCELLED' && o.orderStatus !== 'COMPLETED';
    }
  });

  // Calculate totals
  const totalCartCount = cart.reduce((acc, it) => acc + it.quantity, 0);
  const subtotal = cart.reduce((acc, it) => acc + (it.sellingPrice * it.quantity), 0);
  const grandTotal = subtotal;

  // Add to cart or increment quantity
  const handleAddToCart = (item) => {
    if (isMenuItemAvailableToday && !isMenuItemAvailableToday(item)) {
      showToast(`Maaf, hidangan "${item.name}" tidak dimasak/dijual pada hari ${todayMalay}.`, 'warning');
      return;
    }

    if (item.status === 'OUT OF STOCK') {
      showToast('Maaf, item ini telah habis stok.', 'warning');
      return;
    }

    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1, notes: '' }];
    });

    showToast(`Ditambah: ${item.name} (+1)`, 'info');
  };

  // Update item quantity
  const handleUpdateQty = (itemId, change) => {
    setCart(prev => prev.map(i => {
      if (i.id === itemId) {
        const newQty = i.quantity + change;
        return newQty > 0 ? { ...i, quantity: newQty } : null;
      }
      return i;
    }).filter(Boolean));
  };

  // Remove item completely from cart
  const handleRemoveItem = (itemId) => {
    const item = cart.find(i => i.id === itemId);
    setCart(prev => prev.filter(i => i.id !== itemId));
    if (item) {
      showToast(`${item.name} dikeluarkan daripada senarai.`, 'info');
    }
  };

  // Update notes for an item
  const handleUpdateNotes = (itemId, notes) => {
    setCart(prev => prev.map(i => i.id === itemId ? { ...i, notes } : i));
  };

  // Get current quantity of an item in cart
  const getItemCartQty = (itemId) => {
    const found = cart.find(i => i.id === itemId);
    return found ? found.quantity : 0;
  };

  // Submit order & payment
  const handleCheckoutSubmit = () => {
    if (cart.length === 0) {
      showToast('Sila pilih sekurang-kurangnya satu hidangan makanan/minuman.', 'warning');
      return;
    }

    const orderItems = cart.map(it => ({
      menuId: it.id,
      name: it.name,
      price: it.sellingPrice,
      costPrice: it.costPrice || 0,
      quantity: it.quantity,
      subtotal: it.sellingPrice * it.quantity,
      notes: it.notes || ''
    }));

    const newOrder = createFoodOrder({
      orderType,
      tableId: orderType === 'DINE_IN' ? tableId : null,
      customerName: customerName.trim() || (orderType === 'DINE_IN' ? `Pelanggan Meja ${tableId}` : 'Pelanggan Bungkus'),
      customerPhone: customerPhone.trim() || '-',
      items: orderItems,
      paymentMethod
    });

    // Clear cart and switch to Kitchen Status tab immediately
    setCart([]);
    setActiveRightTab('status');

    if (newOrder) {
      openReceipt(newOrder);
      showToast(`Pesanan ${newOrder.id} dihantar ke Dapur! Status: Menunggu Giliran.`, 'info');
    }
  };

  // Customer attempts to cancel or swap order
  const handleAttemptCancel = (order) => {
    // CRITICAL USER REQUIREMENT:
    // "Setelah dibayar dan pihak dapur telah mula memasak, pelanggan tidak boleh lagi membatalkan makanan/minuman yang telah di order atau menukar kepada makanan/minuman lain"
    if (order.orderStatus === 'PREPARING' || order.orderStatus === 'READY' || order.orderStatus === 'COMPLETED') {
      showToast('🔒 Pihak dapur telah mula memasak hidangan anda. Pesanan ini TIDAK BOLEH dibatalkan atau ditukar lagi demi kelancaran penyediaan!', 'error');
      return;
    }

    // Only allow if order is still 'NEW'
    if (window.confirm(`Adakah anda pasti ingin membatalkan pesanan ${order.id}?`)) {
      if (typeof cancelFoodOrder === 'function') {
        cancelFoodOrder(order.id, 'Dibatalkan oleh pelanggan di meja sebelum mula masak');
      } else {
        updateFoodOrderStatus(order.id, 'CANCELLED');
        showToast(`Pesanan ${order.id} telah dibatalkan.`, 'info');
      }
    }
  };

  // Filtered menu catalog
  const filteredMenu = menu.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const bestsellers = menu.slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 space-y-6 text-slate-100 font-sans pb-28">
      
      {/* Top Brand & Table Switcher Header */}
      <div className="bg-slate-900/90 backdrop-blur-md p-4 rounded-3xl border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="bg-white px-3 py-2 rounded-2xl shadow-md shrink-0">
            <img
              src={giatmaraLogo}
              alt="GIATMARA Logo"
              className="h-12 sm:h-14 w-auto object-contain"
              onError={(e) => { e.currentTarget.src = './logo.png'; }}
            />
          </div>
          <div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-black text-amber-400 font-['Cabinet_Grotesk',sans-serif] tracking-wide uppercase">
                TECHBYTE & FELÌCE CAFFÉ
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-extrabold text-white tracking-tight">
                  TRIG GIATMARA KANGAR
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-extrabold border border-amber-500/30">
                  MASAKAN ITALI • EAT & ENJOY
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Kursus Seni Masakan & Bakeri GIATMARA Perlis</p>
          </div>
        </div>

        {/* Back Button & Order Mode Switch */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => switchSystemMode('MAIN')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-black transition cursor-pointer shadow-md"
            title="Kembali ke Menu Paling Utama"
          >
            <span>← Menu Utama</span>
          </button>

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
                className="text-xs font-black px-2.5 py-1.5 bg-slate-800 text-amber-400 rounded-xl border border-slate-700 outline-none cursor-pointer"
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
      </div>

      {/* Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ================= LEFT COLUMN: MENU CATALOG & PROMOS (col-span-7 / 8) ================= */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          
          {/* Hero Showcase Banner */}
          <div className="relative rounded-3xl overflow-hidden bg-radial from-slate-900 via-slate-950 to-black border border-amber-500/20 p-6 sm:p-8 shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 items-center gap-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-black uppercase tracking-wider border border-amber-500/40">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sedia Dihidang Panas & Segar</span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight tracking-tight">
                  Delicious <br />
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-400 via-orange-400 to-amber-200">
                    MASAKAN ITALI & HIDANGAN
                  </span>
                </h1>

                <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-widest text-slate-300">
                  <span className="text-amber-400">HOT</span> • <span>FRESH</span> • <span className="text-orange-400">TASTY</span>
                </div>

                <p className="text-xs text-slate-400 max-w-md leading-relaxed">
                  Disediakan segar setiap hari oleh pelatih mahir Kursus Seni Masakan GIATMARA Kangar. Klik mana-mana kad menu untuk menambah ke pesanan.
                </p>

                <div className="flex items-center gap-3 pt-1">
                  <a
                    href="#menu-catalog"
                    className="px-5 py-2.5 bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black rounded-2xl text-xs shadow-lg shadow-amber-500/30 transition flex items-center gap-1.5"
                  >
                    <span>PILIH MENU &rarr;</span>
                  </a>
                  <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/80 border border-amber-500/30 text-amber-300 text-xs font-bold">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>100% FRESH & HALAL</span>
                  </div>
                </div>
              </div>

              {/* Hero Food Visual */}
              <div className="relative flex items-center justify-center">
                <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-linear-to-tr from-amber-500/20 via-orange-500/10 to-transparent p-3 flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80"
                    alt="Delicious Gourmet Food"
                    className="w-full h-full object-cover rounded-3xl shadow-2xl border-2 border-amber-500/30 rotate-2 hover:rotate-0 transition duration-500"
                  />
                  <div className="absolute -bottom-2 -left-2 bg-slate-950/90 border border-amber-500/40 text-amber-400 px-3 py-1.5 rounded-2xl shadow-xl flex items-center gap-1.5 text-xs font-black">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>PILIHAN POPULAR</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Category Icons & Search Bar */}
          <div className="bg-slate-900/90 p-4 rounded-3xl border border-slate-800 shadow-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
                PILIH KATEGORI HIDANGAN:
              </span>
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari makanan / minuman..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-amber-500 transition"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-black whitespace-nowrap bg-amber-500/15 border border-amber-500/40 text-amber-300 shrink-0">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Hari Ini: {todayMalay}</span>
              </div>

              <button
                onClick={() => setSelectedCategory('ALL')}
                className={`px-4 py-2 rounded-2xl text-xs font-black transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  selectedCategory === 'ALL'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <UtensilsCrossed className="w-3.5 h-3.5" />
                <span>SEMUA ({menu.length})</span>
              </button>

              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-2xl text-xs font-black transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
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

          {/* Popular Picks / Bestsellers */}
          {selectedCategory === 'ALL' && !searchQuery && (
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-3 text-center my-2">
                <div className="h-px bg-linear-to-r from-transparent via-amber-500 to-transparent w-24"></div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
                  — POPULAR PICKS • BESTSELLERS —
                </span>
                <div className="h-px bg-linear-to-r from-transparent via-amber-500 to-transparent w-24"></div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                {bestsellers.map(item => {
                  const qtyInCart = getItemCartQty(item.id);
                  const availableToday = isMenuItemAvailableToday ? isMenuItemAvailableToday(item) : true;
                  const isOutOfStock = item.status === 'OUT OF STOCK';
                  const isInactive = item.status === 'INACTIVE';
                  const canOrder = availableToday && !isOutOfStock && !isInactive;

                  return (
                    <div
                      key={item.id}
                      onClick={() => canOrder && handleAddToCart(item)}
                      className={`bg-slate-900 rounded-3xl border p-3 flex flex-col justify-between transition-all group shadow-lg relative overflow-hidden ${
                        qtyInCart > 0
                          ? 'border-amber-500 shadow-amber-500/10'
                          : canOrder
                          ? 'border-slate-800 hover:border-amber-500/60 hover:scale-[1.02] cursor-pointer'
                          : 'border-slate-800/60 bg-slate-950/70 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-500 text-slate-950 shadow-sm">
                        POPULAR
                      </div>

                      {qtyInCart > 0 && (
                        <div className="absolute top-2 right-2 z-10 px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500 text-slate-950 shadow-md flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>{qtyInCart} dlm pesanan</span>
                        </div>
                      )}

                      <div>
                        <div className="relative h-24 w-full bg-slate-950 rounded-2xl overflow-hidden mb-2">
                          <img
                            src={item.image}
                            alt={item.name}
                            className={`w-full h-full object-cover transition duration-300 ${canOrder ? 'group-hover:scale-105' : 'grayscale-[35%]'}`}
                            onError={(e) => {
                              e.currentTarget.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80";
                            }}
                          />
                          {!availableToday ? (
                            <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-[1px] flex flex-col items-center justify-center p-1.5 text-center">
                              <span className="text-[8px] font-black text-amber-400 uppercase tracking-wider">
                                Tidak Dijual
                              </span>
                              <span className="text-[7px] font-bold text-slate-300 mt-0.5">
                                Hari {todayMalay}
                              </span>
                            </div>
                          ) : isOutOfStock ? (
                            <div className="absolute inset-0 bg-black/75 flex items-center justify-center text-[9px] font-black text-rose-300">
                              HABIS STOK
                            </div>
                          ) : null}
                        </div>

                        <h3 className="font-black text-xs text-white line-clamp-1 group-hover:text-amber-400 transition">
                          {item.name}
                        </h3>
                        <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                          {item.description}
                        </p>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                        <span className="font-black text-amber-400 text-xs">
                          RM {item.sellingPrice.toFixed(2)}
                        </span>
                        <button
                          type="button"
                          disabled={!canOrder}
                          className={`w-6 h-6 rounded-xl font-black flex items-center justify-center transition shadow-xs ${
                            canOrder
                              ? 'bg-amber-500 group-hover:bg-amber-400 text-slate-950 cursor-pointer'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          }`}
                          title={canOrder ? "Tambah ke Pesanan" : "Tidak dijual hari ini"}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Full Menu Catalog Grid */}
          <div id="menu-catalog" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4 text-amber-400" />
                <span>Katalog Menu Hidangan ({filteredMenu.length} Pilihan)</span>
              </h2>
              <span className="text-[11px] text-slate-400 italic">
                Klik ikon/kad hidangan untuk menambah bilangan pesanan
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredMenu.map(item => {
                const qtyInCart = getItemCartQty(item.id);
                const availableToday = isMenuItemAvailableToday ? isMenuItemAvailableToday(item) : true;
                const isOutOfStock = item.status === 'OUT OF STOCK';
                const isInactive = item.status === 'INACTIVE';
                const canOrder = availableToday && !isOutOfStock && !isInactive;

                return (
                  <div
                    key={item.id}
                    onClick={() => canOrder && handleAddToCart(item)}
                    className={`bg-slate-900 rounded-3xl border overflow-hidden flex flex-col justify-between transition-all shadow-md group ${
                      qtyInCart > 0
                        ? 'border-amber-500 ring-1 ring-amber-500/50'
                        : canOrder
                        ? 'border-slate-800 hover:border-amber-500/50 hover:scale-[1.01] cursor-pointer'
                        : 'border-slate-800/60 bg-slate-950/70 opacity-65 cursor-not-allowed'
                    }`}
                  >
                    <div>
                      <div className="relative h-36 w-full bg-slate-950 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className={`w-full h-full object-cover transition duration-300 ${canOrder ? 'group-hover:scale-105' : 'grayscale-[35%]'}`}
                          onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80";
                          }}
                        />
                        <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[9px] font-black bg-slate-950/85 text-amber-400 border border-slate-800 backdrop-blur-xs">
                          {item.category}
                        </span>
                        <span className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-500 text-slate-950 shadow-md">
                          RM {item.sellingPrice.toFixed(2)}
                        </span>

                        {!availableToday ? (
                          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-[1px] flex flex-col items-center justify-center p-2 text-center z-10">
                            <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider">
                              Tidak Dimasak Hari Ini
                            </span>
                            <span className="text-[8px] font-bold text-slate-300 mt-0.5">
                              (Hari {todayMalay})
                            </span>
                            {item.availableDays && item.availableDays.length > 0 && (
                              <span className="text-[8px] text-slate-400 mt-1 line-clamp-1 px-1.5 py-0.5 bg-black/40 rounded">
                                Dijual: {item.availableDays.join(', ')}
                              </span>
                            )}
                          </div>
                        ) : isOutOfStock ? (
                          <div className="absolute inset-0 bg-black/75 flex items-center justify-center text-xs font-black text-rose-300 z-10">
                            HABIS STOK
                          </div>
                        ) : null}

                        {qtyInCart > 0 && (
                          <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-xl text-[10px] font-black bg-emerald-500 text-slate-950 shadow-lg flex items-center gap-1 animate-pulse">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{qtyInCart}x Dalam Pesanan</span>
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-black text-sm text-white leading-snug group-hover:text-amber-400 transition">
                            {item.name}
                          </h3>
                          {!availableToday && (
                            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              Off Hari {todayMalay}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 pt-0" onClick={(e) => e.stopPropagation()}>
                      {qtyInCart > 0 ? (
                        <div className="flex items-center justify-between bg-slate-950 p-1.5 rounded-2xl border border-amber-500/40">
                          <button
                            type="button"
                            onClick={() => handleUpdateQty(item.id, -1)}
                            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-rose-500/30 text-white hover:text-rose-400 flex items-center justify-center font-black transition cursor-pointer"
                            title="Kurang 1"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>

                          <div className="text-center px-2">
                            <span className="text-xs font-black text-amber-400 block">{qtyInCart}</span>
                            <span className="text-[9px] text-slate-400 font-bold">dipilih</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleAddToCart(item)}
                            disabled={!canOrder}
                            className="w-8 h-8 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center font-black transition cursor-pointer disabled:opacity-40"
                            title="Tambah 1 Lagi"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleAddToCart(item)}
                          disabled={!canOrder}
                          className={`w-full py-2.5 rounded-2xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
                            canOrder
                              ? 'bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-md shadow-amber-500/20 cursor-pointer'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          <Plus className="w-4 h-4" />
                          <span>
                            {!availableToday
                              ? `TIDAK DIJUAL HARI INI (${todayMalay})`
                              : isOutOfStock
                              ? 'HABIS STOK'
                              : 'TAMBAH KE PESANAN'}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Takeaway / Promo Delivery Banner */}
          <div className="rounded-3xl bg-linear-to-r from-amber-500 via-orange-500 to-amber-600 p-6 text-slate-950 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-slate-950 text-amber-400 flex items-center justify-center shadow-lg shrink-0">
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
                  Pesan awal melalui sistem ini untuk jimat masa tanpa perlu beratur panjang di kaunter.
                </p>
              </div>
            </div>

            <div className="bg-slate-950 text-white p-4 rounded-2xl text-center shrink-0 border border-amber-400/30">
              <span className="text-[10px] font-extrabold uppercase text-amber-400">DISKAUN PELATIH / STAF</span>
              <p className="text-2xl font-black text-amber-400">KOMBO JIMAT</p>
              <span className="text-[10px] font-mono text-slate-400">KOD: TRIG2026</span>
            </div>
          </div>

        </div>

        {/* ================= RIGHT COLUMN: PERSISTENT ORDER LIST & KITCHEN TRACKER (col-span-5 / 4) ================= */}
        <div id="cart-panel" className="lg:col-span-5 xl:col-span-4 sticky top-4 space-y-4">
          
          <div className="bg-slate-900/95 backdrop-blur-md rounded-3xl border-2 border-amber-500/40 p-4 sm:p-5 shadow-2xl space-y-4">
            
            {/* Header Tabs: Bakul Pesanan VS Status Dapur */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveRightTab('cart')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeRightTab === 'cart'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Bakul Pesanan</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  activeRightTab === 'cart' ? 'bg-slate-950 text-amber-400' : 'bg-slate-800 text-slate-300'
                }`}>
                  {totalCartCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveRightTab('status')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer relative ${
                  activeRightTab === 'status'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Flame className={`w-3.5 h-3.5 ${activeOrders.some(o => o.orderStatus === 'PREPARING') ? 'text-amber-400 animate-bounce' : ''}`} />
                <span>Status Dapur</span>
                {activeOrders.length > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    activeRightTab === 'status' ? 'bg-slate-950 text-amber-400' : 'bg-rose-500 text-white animate-pulse'
                  }`}>
                    {activeOrders.length}
                  </span>
                )}
              </button>
            </div>

            {/* Target Destination Indicator */}
            <div className="flex items-center justify-between px-2 py-1.5 bg-slate-950/70 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400 font-semibold">Destinasi Hidangan:</span>
              <span className="font-black text-amber-400 flex items-center gap-1">
                {orderType === 'DINE_IN' ? `🍽️ Makan Sini: Meja ${tableId}` : '🛍️ Pesanan Bungkus (Takeaway)'}
              </span>
            </div>

            {/* TAB 1: BAKUL PESANAN (CART & REVIEW) */}
            {activeRightTab === 'cart' && (
              <div className="space-y-4 animate-fade-in">
                
                {/* Header Action: Item Count & Clear */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="font-black text-sm text-white flex items-center gap-1.5">
                    <UtensilsCrossed className="w-4 h-4 text-amber-400" />
                    <span>Semakan Makanan & Minuman</span>
                  </h3>
                  {cart.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Kosongkan semua item dalam bakul pesanan anda?')) {
                          setCart([]);
                        }
                      }}
                      className="text-[11px] text-rose-400 hover:text-rose-300 font-bold transition cursor-pointer"
                    >
                      Kosongkan Bakul
                    </button>
                  )}
                </div>

                {/* Selected Items Scrollable List */}
                {cart.length === 0 ? (
                  <div className="py-10 px-4 text-center bg-slate-950/50 rounded-2xl border border-dashed border-slate-800 space-y-3">
                    <div className="w-12 h-12 rounded-full bg-slate-800/80 text-slate-400 flex items-center justify-center mx-auto">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-xs">Tiada Hidangan Dipilih Lagi</p>
                      <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
                        Klik pada mana-mana gambar atau butang (+) makanan di katalog sebelah kiri untuk menyemak pesanan di sini.
                      </p>
                    </div>
                    <a
                      href="#menu-catalog"
                      className="inline-block px-4 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-500/30 transition"
                    >
                      Lihat Katalog Menu
                    </a>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                    {cart.map(item => (
                      <div
                        key={item.id}
                        className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2 hover:border-slate-700 transition"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-11 h-11 rounded-xl object-cover border border-slate-800 shrink-0"
                              onError={(e) => {
                                e.currentTarget.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80";
                              }}
                            />
                            <div>
                              <h4 className="font-black text-xs text-white leading-tight">
                                {item.name}
                              </h4>
                              <p className="text-[10px] text-slate-400 mt-0.5">
                                RM {item.sellingPrice.toFixed(2)} / unit
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="font-black text-xs text-amber-400 block">
                              RM {(item.sellingPrice * item.quantity).toFixed(2)}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-slate-500 hover:text-rose-400 p-1 transition cursor-pointer"
                              title="Padam item ini"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Quantity Controls & Note Toggle */}
                        <div className="flex items-center justify-between pt-1 border-t border-slate-900">
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleUpdateQty(item.id, -1)}
                              className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-black transition cursor-pointer text-xs"
                              title="Kurang 1"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-7 text-center font-black text-xs text-white">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleUpdateQty(item.id, 1)}
                              className="w-6 h-6 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center font-black transition cursor-pointer text-xs"
                              title="Tambah 1"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => setActiveNoteItemId(activeNoteItemId === item.id ? null : item.id)}
                            className="text-[10px] font-bold text-amber-400/80 hover:text-amber-300 underline cursor-pointer"
                          >
                            {item.notes ? `Nota: "${item.notes}"` : '+ Tambah Nota'}
                          </button>
                        </div>

                        {/* Note Input Field */}
                        {activeNoteItemId === item.id && (
                          <div className="pt-1">
                            <input
                              type="text"
                              placeholder="Cth: Kurang pedas, tanpa ais, lebih kuah..."
                              value={item.notes || ''}
                              onChange={(e) => handleUpdateNotes(item.id, e.target.value)}
                              className="w-full px-2.5 py-1.5 text-[11px] bg-slate-900 border border-amber-500/40 rounded-xl text-white outline-none focus:border-amber-400"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Price Breakdown / Summary */}
                {cart.length > 0 && (
                  <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Jumlah Hidangan:</span>
                      <span className="font-bold text-white">{totalCartCount} item</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Subtotal:</span>
                      <span className="font-bold text-white">RM {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Cukai Perkhidmatan (SST):</span>
                      <span className="font-bold text-emerald-400">0% (Dikecualikan)</span>
                    </div>
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                      <span className="font-black text-sm text-white">TOTAL HARGA:</span>
                      <span className="font-black text-lg text-amber-400">
                        RM {grandTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Payment Selection and DuitNow QR Preview */}
                {cart.length > 0 && (
                  <div className="space-y-2.5">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                      Kaedah Pembayaran:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('QR_PAYMENT')}
                        className={`p-2.5 rounded-xl border font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer transition ${
                          paymentMethod === 'QR_PAYMENT'
                            ? 'border-amber-500 bg-amber-500/20 text-amber-400 shadow-md'
                            : 'border-slate-800 text-slate-400 bg-slate-950 hover:text-white'
                        }`}
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>DuitNow QR</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('CASH')}
                        className={`p-2.5 rounded-xl border font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer transition ${
                          paymentMethod === 'CASH'
                            ? 'border-amber-500 bg-amber-500/20 text-amber-400 shadow-md'
                            : 'border-slate-800 text-slate-400 bg-slate-950 hover:text-white'
                        }`}
                      >
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>Tunai di Kaunter</span>
                      </button>
                    </div>

                    {paymentMethod === 'QR_PAYMENT' && (
                      <div className="p-3 bg-slate-950 rounded-2xl border border-amber-500/30 text-center space-y-2">
                        <div className="p-2 bg-white rounded-xl shadow-md inline-block">
                          <QRCodeSVG
                            value={`DUITNOW:TECHBYTE-PASTA-TABLE-${tableId}:RM${grandTotal.toFixed(2)}`}
                            size={105}
                            level="M"
                          />
                        </div>
                        <p className="text-[10px] text-amber-400 font-bold">
                          Imbas & bayar terus: RM {grandTotal.toFixed(2)}
                        </p>
                        <p className="text-[9px] text-slate-400">
                          (Menyokong Maybank MAE, CIMB, TNG eWallet & Bank Islam)
                        </p>
                      </div>
                    )}

                    {/* Customer info (Optional) */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="Nama (Pilihan)"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-amber-500"
                      />
                      <input
                        type="text"
                        placeholder="No Tel (Pilihan)"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-amber-500"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="button"
                      onClick={handleCheckoutSubmit}
                      className="w-full py-3 bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 rounded-2xl font-black text-xs sm:text-sm shadow-xl shadow-amber-500/30 transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ChefHat className="w-4 h-4" />
                      <span>HANTAR KE DAPUR & BAYAR (RM {grandTotal.toFixed(2)}) &rarr;</span>
                    </button>
                  </div>
                )}

              </div>
            )}

            {/* TAB 2: STATUS DAPUR (LIVE STATUS & STRICT CANCELLATION LOCK) */}
            {activeRightTab === 'status' && (
              <div className="space-y-4 animate-fade-in">
                
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="font-black text-sm text-white flex items-center gap-1.5">
                    <ChefHat className="w-4 h-4 text-amber-400" />
                    <span>Status Dapur & Penyediaan</span>
                  </h3>
                  <span className="text-[11px] text-slate-400 font-bold">
                    {orderType === 'DINE_IN' ? `Meja ${tableId}` : 'Takeaway'}
                  </span>
                </div>

                {activeOrders.length === 0 ? (
                  <div className="py-10 px-4 text-center bg-slate-950/50 rounded-2xl border border-dashed border-slate-800 space-y-3">
                    <div className="w-12 h-12 rounded-full bg-slate-800/80 text-slate-400 flex items-center justify-center mx-auto">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-xs">Tiada Pesanan Aktif di Dapur</p>
                      <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
                        Setelah anda menghantar pesanan dan membuat bayaran di tab Bakul Pesanan, status masakan dapur akan dipaparkan di sini.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveRightTab('cart')}
                      className="px-4 py-1.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-black transition cursor-pointer"
                    >
                      Pilih Hidangan Sekarang
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeOrders.map(order => {
                      const isCooking = order.orderStatus === 'PREPARING';
                      const isReady = order.orderStatus === 'READY';
                      const isNew = order.orderStatus === 'NEW';

                      return (
                        <div
                          key={order.id}
                          className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 shadow-md"
                        >
                          {/* Order Header */}
                          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                            <div>
                              <span className="text-xs font-black text-amber-400">{order.id}</span>
                              <span className="text-[10px] text-slate-400 block font-mono">
                                Resit: {order.receiptNo}
                              </span>
                            </div>

                            {/* Status Badge */}
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
                              isNew ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse' :
                              isCooking ? 'bg-orange-500 text-slate-950 font-black shadow-md shadow-orange-500/40' :
                              isReady ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/40' :
                              'bg-slate-800 text-slate-300'
                            }`}>
                              {isCooking && <Flame className="w-3 h-3 text-slate-950" />}
                              {isReady && <CheckCircle2 className="w-3 h-3 text-slate-950" />}
                              <span>
                                {isNew ? 'MENUNGGU GILIRAN' :
                                 isCooking ? 'SEDANG DIMASAK' :
                                 isReady ? 'SEDIA DIHIDANG' : order.orderStatus}
                              </span>
                            </span>
                          </div>

                          {/* Progress Stepper Visual */}
                          <div className="grid grid-cols-3 gap-1.5 py-1 text-center text-[9px] font-black uppercase">
                            <div className={`p-1.5 rounded-lg border ${
                              isNew || isCooking || isReady
                                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                                : 'bg-slate-900 text-slate-600 border-slate-800'
                            }`}>
                              1. Diterima
                            </div>
                            <div className={`p-1.5 rounded-lg border ${
                              isCooking || isReady
                                ? 'bg-orange-500 text-slate-950 border-orange-400 font-extrabold shadow-sm'
                                : 'bg-slate-900 text-slate-600 border-slate-800'
                            }`}>
                              2. Dimasak 🔥
                            </div>
                            <div className={`p-1.5 rounded-lg border ${
                              isReady
                                ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold shadow-sm'
                                : 'bg-slate-900 text-slate-600 border-slate-800'
                            }`}>
                              3. Sedia Dihidang
                            </div>
                          </div>

                          {/* Ordered Items List */}
                          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 space-y-1 text-xs">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                              Hidangan Dipesan:
                            </span>
                            {order.items.map((it, idx) => (
                              <div key={idx} className="flex items-center justify-between text-slate-300 text-[11px]">
                                <span>{it.quantity}x {it.name}</span>
                                <span className="font-bold text-slate-400">
                                  RM {(it.price * it.quantity).toFixed(2)}
                                </span>
                              </div>
                            ))}
                            <div className="pt-1 border-t border-slate-800 flex justify-between font-black text-amber-400 text-xs">
                              <span>Jumlah Dibayar:</span>
                              <span>RM {order.grandTotal.toFixed(2)}</span>
                            </div>
                          </div>

                          {/* ================= CRITICAL STRICT LOCK NOTICE ================= */}
                          {/* "Setelah dibayar dan pihak dapur telah mula memasak, pelanggan tidak boleh lagi membatalkan makanan/minuman yang telah di order atau menukar kepada makanan/minuman lain" */}
                          {isCooking ? (
                            <div className="p-3 rounded-xl bg-linear-to-r from-rose-950/70 to-orange-950/70 border-2 border-rose-500/80 text-rose-200 text-xs space-y-1.5 shadow-lg">
                              <div className="flex items-center gap-1.5 text-rose-400 font-black text-xs">
                                <Lock className="w-4 h-4 text-rose-400 shrink-0" />
                                <span>PESANAN SEDANG DIMASAK (DIKUNCI)</span>
                              </div>
                              <p className="text-[11px] leading-relaxed text-rose-100">
                                Pihak dapur telah mula memasak hidangan anda. Pesanan ini <strong>TIDAK BOLEH DIBATALKAN</strong> atau <strong>DITUKAR</strong> kepada makanan/minuman lain demi kelancaran dan kualiti penyediaan.
                              </p>
                              
                              <button
                                type="button"
                                disabled
                                className="w-full py-2 bg-rose-900/60 text-rose-300 rounded-lg font-bold text-[11px] border border-rose-700/50 cursor-not-allowed flex items-center justify-center gap-1.5 opacity-90"
                              >
                                <Lock className="w-3.5 h-3.5 text-rose-400" />
                                <span>Batal & Tukar Tidak Dibenarkan</span>
                              </button>
                            </div>
                          ) : isReady ? (
                            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/60 text-emerald-200 text-xs space-y-1">
                              <div className="flex items-center gap-1.5 text-emerald-400 font-black">
                                <CheckCircle className="w-4 h-4" />
                                <span>HIDANGAN TELAH SIAP DIMASAK!</span>
                              </div>
                              <p className="text-[11px] text-emerald-100">
                                Makanan anda sedia dihidangkan ke meja atau boleh diambil di kaunter. Sila nikmati hidangan anda!
                              </p>
                            </div>
                          ) : isNew ? (
                            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-2">
                              <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                                <Clock className="w-3.5 h-3.5" />
                                <span>Pesanan baru diterima di dapur (Menunggu)</span>
                              </div>
                              <p className="text-[10px] text-slate-300">
                                Dapur belum memulakan masakan. Pembatalan hanya dibenarkan sebelum tukang masak memulakan penyediaan.
                              </p>
                              <button
                                type="button"
                                onClick={() => handleAttemptCancel(order)}
                                className="w-full py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 rounded-lg font-bold text-[10px] border border-rose-500/40 transition cursor-pointer"
                              >
                                Batal Pesanan Sebelum Masak
                              </button>
                            </div>
                          ) : null}

                          {/* Quick Actions: View Receipt & Add More Items */}
                          <div className="grid grid-cols-2 gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => openReceipt(order)}
                              className="py-2 px-3 bg-slate-900 hover:bg-slate-800 text-amber-300 rounded-xl font-bold text-[11px] border border-slate-700 transition flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <Receipt className="w-3.5 h-3.5" />
                              <span>Lihat Resit</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setActiveRightTab('cart')}
                              className="py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-black text-[11px] transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Tambah Order Baru</span>
                            </button>
                          </div>

                          {/* Interactive Kitchen Simulation Controls (For Easy Testing & Verification) */}
                          <div className="pt-2 border-t border-slate-800/80">
                            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1.5">
                              <span className="font-bold flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-amber-400" />
                                <span>Simulasi Status Dapur (Ujian Cepat):</span>
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  updateFoodOrderStatus(order.id, 'PREPARING');
                                  showToast(`Kru Dapur: Memulakan masakan bagi pesanan ${order.id}!`, 'info');
                                }}
                                className={`py-1 px-2 rounded-lg text-[10px] font-black border transition cursor-pointer flex items-center justify-center gap-1 ${
                                  isCooking
                                    ? 'bg-orange-500 text-slate-950 border-orange-400'
                                    : 'bg-slate-900 hover:bg-slate-800 text-orange-400 border-orange-500/40'
                                }`}
                              >
                                <Flame className="w-3 h-3" />
                                <span>Mula Masak (PREPARING)</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  updateFoodOrderStatus(order.id, 'READY');
                                  showToast(`Kru Dapur: Pesanan ${order.id} siap dimasak!`, 'info');
                                }}
                                className={`py-1 px-2 rounded-lg text-[10px] font-black border transition cursor-pointer flex items-center justify-center gap-1 ${
                                  isReady
                                    ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                                    : 'bg-slate-900 hover:bg-slate-800 text-emerald-400 border-emerald-500/40'
                                }`}
                              >
                                <CheckCircle className="w-3 h-3" />
                                <span>Siap Masak (READY)</span>
                              </button>
                            </div>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                )}

              </div>
            )}

          </div>

        </div>

      </div>

      {/* Floating Bottom Cart Bar for Mobile Screen (< lg) */}
      {cart.length > 0 && (
        <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40 animate-fade-in">
          <div className="bg-slate-950 text-white p-3.5 rounded-3xl shadow-2xl flex items-center justify-between border-2 border-amber-500">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
                  {totalCartCount}
                </span>
                <span className="font-bold text-xs">
                  {orderType === 'DINE_IN' ? `Meja ${tableId}` : 'Takeaway'}
                </span>
              </div>
              <p className="text-xs text-amber-400 font-black mt-0.5">
                Total: RM {grandTotal.toFixed(2)}
              </p>
            </div>

            <a
              href="#cart-panel"
              onClick={() => setActiveRightTab('cart')}
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-2xl text-xs shadow-lg shadow-amber-500/40 transition"
            >
              Semak Pesanan &rarr;
            </a>
          </div>
        </div>
      )}

    </div>
  );
};
