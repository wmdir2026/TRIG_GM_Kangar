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
  Clock,
  ChefHat,
  Receipt,
  Info,
  CheckCircle2,
  Wifi,
  WifiOff,
  Smartphone,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Calendar
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export const CustomerPhoneApp = () => {
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
    setCurrentTab,
    syncStatus,
    isMenuItemAvailableToday,
    getCurrentDayMalay
  } = useApp();

  const todayMalay = getCurrentDayMalay ? getCurrentDayMalay() : 'Hari Ini';

  const [tableId, setTableId] = useState(selectedTableForCustomer || 'M05');
  const [orderType, setOrderType] = useState('DINE_IN');
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Cart & Review State
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('QR_PAYMENT');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [activeNoteItemId, setActiveNoteItemId] = useState(null);

  // Active view: 'menu' or 'status'
  const [activeScreen, setActiveScreen] = useState('menu');

  // Active orders for this table or takeaway
  const activeOrders = (foodOrders || []).filter(o => {
    if (orderType === 'DINE_IN') {
      return o.tableId === tableId && o.orderStatus !== 'CANCELLED' && o.orderStatus !== 'COMPLETED';
    } else {
      return o.orderType === 'TAKEAWAY' && o.orderStatus !== 'CANCELLED' && o.orderStatus !== 'COMPLETED';
    }
  });

  const totalCartCount = cart.reduce((acc, it) => acc + it.quantity, 0);
  const subtotal = cart.reduce((acc, it) => acc + (it.sellingPrice * it.quantity), 0);
  const grandTotal = subtotal;

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
    showToast(`+1 ${item.name}`, 'info');
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

  const handleRemoveItem = (itemId) => {
    const item = cart.find(i => i.id === itemId);
    setCart(prev => prev.filter(i => i.id !== itemId));
    if (item) {
      showToast(`${item.name} dipadam daripada bakul.`, 'info');
    }
  };

  const getItemCartQty = (itemId) => {
    const found = cart.find(i => i.id === itemId);
    return found ? found.quantity : 0;
  };

  const handleCheckoutSubmit = () => {
    if (cart.length === 0) return;

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

    setCart([]);
    setIsCartOpen(false);
    setActiveScreen('status');

    if (newOrder) {
      openReceipt(newOrder);
      showToast(`Pesanan ${newOrder.id} berjaya dihantar ke Dapur!`, 'info');
    }
  };

  const handleAttemptCancel = (order) => {
    if (order.orderStatus === 'PREPARING' || order.orderStatus === 'READY' || order.orderStatus === 'COMPLETED') {
      showToast('🔒 Pihak dapur telah mula memasak hidangan anda. Pesanan TIDAK BOLEH dibatalkan atau ditukar!', 'error');
      return;
    }

    if (window.confirm(`Adakah anda pasti ingin membatalkan pesanan ${order.id}?`)) {
      if (typeof cancelFoodOrder === 'function') {
        cancelFoodOrder(order.id, 'Dibatalkan oleh pelanggan di telefon');
      } else {
        updateFoodOrderStatus(order.id, 'CANCELLED');
      }
    }
  };

  const filteredMenu = menu.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-24 shadow-2xl border-x border-slate-800">
      
      {/* Android Top App Bar */}
      <div className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md px-4 py-3 border-b border-amber-500/30 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => switchSystemMode('MAIN')}
            className="p-1.5 rounded-xl bg-slate-800 text-amber-400 hover:bg-slate-700 transition"
            title="Kembali ke Menu Paling Utama"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          <div className="bg-white p-1 rounded-xl shadow-xs shrink-0">
            <img
              src={giatmaraLogo}
              alt="GIATMARA"
              className="h-7 w-auto object-contain"
              onError={(e) => { e.currentTarget.src = './logo.png'; }}
            />
          </div>

          <div>
            <span className="text-xs font-black text-amber-400 block leading-tight tracking-wide uppercase">
              TECHBYTE & FELÌCE CAFFÉ
            </span>
            <span className="text-[10px] font-bold text-slate-400 block leading-none">
              Pautan Pelanggan (Format Telefon)
            </span>
          </div>
        </div>

        {/* Real-time Cloud Sync Pill */}
        <div className="flex items-center gap-1.5">
          <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black border ${
            syncStatus === 'connected'
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
              : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
          }`}>
            <span className={`w-2 h-2 rounded-full ${syncStatus === 'connected' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
            <span>{syncStatus === 'connected' ? 'Sync' : 'Auto'}</span>
          </span>
        </div>
      </div>

      {/* Table Selector & Order Mode Bar */}
      <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <button
          onClick={() => setIsTableModalOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-950 hover:bg-slate-800 rounded-xl border border-amber-500/40 text-xs font-black text-amber-400 transition"
        >
          <UtensilsCrossed className="w-3.5 h-3.5" />
          <span>{orderType === 'DINE_IN' ? `Meja ${tableId} (Tukar Meja)` : 'Pesanan Bungkus'}</span>
        </button>

        {/* Screen Switcher (Menu vs Status) */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveScreen('menu')}
            className={`px-3 py-1 rounded-lg text-[11px] font-black transition ${
              activeScreen === 'menu' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
            }`}
          >
            Menu
          </button>
          <button
            onClick={() => setActiveScreen('status')}
            className={`px-3 py-1 rounded-lg text-[11px] font-black transition relative ${
              activeScreen === 'status' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
            }`}
          >
            Status
            {activeOrders.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 absolute -top-0.5 -right-0.5 animate-ping"></span>
            )}
          </button>
        </div>
      </div>

      {/* ================= SCREEN 1: MENU CATALOG ================= */}
      {activeScreen === 'menu' && (
        <div className="flex-1 space-y-4 p-4 animate-fade-in">
          
          {/* Quick Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari hidangan lazat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-white outline-none focus:border-amber-500 transition shadow-inner"
            />
          </div>

          {/* Category Chips (Horizontal Scroll) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black whitespace-nowrap bg-amber-500/15 border border-amber-500/40 text-amber-300 shrink-0">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>Hari Ini: {todayMalay}</span>
            </div>

            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-black whitespace-nowrap transition ${
                selectedCategory === 'ALL'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                  : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              Semua ({menu.length})
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-black whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                    : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Food Cards Grid (Mobile 1 or 2 Columns) */}
          <div className="space-y-3">
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
                  className={`bg-slate-900 rounded-2xl p-3 border transition flex items-center justify-between gap-3 shadow-md ${
                    qtyInCart > 0
                      ? 'border-amber-500 bg-slate-900/90'
                      : canOrder
                      ? 'border-slate-800 hover:border-slate-700'
                      : 'border-slate-800/60 bg-slate-950/70 opacity-60 cursor-not-allowed'
                  } ${canOrder ? 'active:scale-[0.98] cursor-pointer' : ''}`}
                >
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-950 shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className={`w-full h-full object-cover transition ${canOrder ? '' : 'grayscale-[40%]'}`}
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80";
                      }}
                    />
                    {!availableToday ? (
                      <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-[1px] flex flex-col items-center justify-center p-1 text-center">
                        <span className="text-[8px] font-black text-amber-400 uppercase tracking-wider">
                          Tidak Dijual
                        </span>
                        <span className="text-[7px] font-bold text-slate-300">
                          Hari {todayMalay}
                        </span>
                      </div>
                    ) : isOutOfStock ? (
                      <div className="absolute inset-0 bg-black/75 flex items-center justify-center text-[9px] font-black text-rose-300">
                        HABIS STOK
                      </div>
                    ) : null}

                    {qtyInCart > 0 && (
                      <span className="absolute bottom-1 right-1 bg-emerald-500 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-md shadow-md">
                        {qtyInCart}x
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider">
                        {item.category}
                      </span>
                      {!availableToday && (
                        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Tidak Dimasak Hari {todayMalay}
                        </span>
                      )}
                    </div>
                    <h4 className="font-black text-xs text-white truncate mt-0.5">
                      {item.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                      {item.description}
                    </p>
                    <span className="font-black text-xs text-amber-400 block mt-1">
                      RM {item.sellingPrice.toFixed(2)}
                    </span>
                  </div>

                  <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
                    {qtyInCart > 0 ? (
                      <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-amber-500/50">
                        <button
                          type="button"
                          onClick={() => handleUpdateQty(item.id, -1)}
                          className="w-6 h-6 rounded-lg bg-slate-800 text-white flex items-center justify-center font-black"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center font-black text-xs text-amber-400">
                          {qtyInCart}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAddToCart(item)}
                          disabled={!canOrder}
                          className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black disabled:opacity-40"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    ) : canOrder ? (
                      <button
                        type="button"
                        onClick={() => handleAddToCart(item)}
                        className="w-9 h-9 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black flex items-center justify-center shadow-md transition"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    ) : (
                      <div className="px-2 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-[9px] font-bold text-slate-500 text-center">
                        {!availableToday ? 'Off Hari Ini' : 'Habis'}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ================= SCREEN 2: LIVE KITCHEN STATUS TRACKER ================= */}
      {activeScreen === 'status' && (
        <div className="flex-1 p-4 space-y-4 animate-fade-in">
          
          <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800 space-y-2">
            <h3 className="font-black text-sm text-white flex items-center gap-2">
              <ChefHat className="w-4 h-4 text-amber-400" />
              <span>Status Masakan & Dapur (Real-Time)</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              {orderType === 'DINE_IN' ? `Pesanan Meja ${tableId}` : 'Pesanan Bungkus / Takeaway'}
            </p>
          </div>

          {activeOrders.length === 0 ? (
            <div className="py-12 px-4 text-center bg-slate-900/60 rounded-3xl border border-dashed border-slate-800 space-y-3">
              <Clock className="w-10 h-10 text-slate-500 mx-auto" />
              <div>
                <p className="font-bold text-white text-xs">Tiada Pesanan Aktif</p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
                  Sila pilih hidangan lazat di tab Menu dan hantar pesanan anda ke dapur.
                </p>
              </div>
              <button
                onClick={() => setActiveScreen('menu')}
                className="px-4 py-2 bg-amber-500 text-slate-950 font-black rounded-xl text-xs transition"
              >
                Pilih Menu Sekarang
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
                    className="bg-slate-900 p-4 rounded-3xl border border-slate-800 space-y-3 shadow-xl"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <div>
                        <span className="text-xs font-black text-amber-400">{order.id}</span>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          Resit: {order.receiptNo}
                        </span>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
                        isNew ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse' :
                        isCooking ? 'bg-orange-500 text-slate-950 font-black shadow-md shadow-orange-500/40' :
                        isReady ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/40' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {isCooking && <Flame className="w-3 h-3" />}
                        {isReady && <CheckCircle2 className="w-3 h-3" />}
                        <span>
                          {isNew ? 'MENUNGGU GILIRAN' :
                           isCooking ? 'SEDANG DIMASAK' :
                           isReady ? 'SEDIA DIHIDANG' : order.orderStatus}
                        </span>
                      </span>
                    </div>

                    {/* Stepper */}
                    <div className="grid grid-cols-3 gap-1.5 text-center text-[9px] font-black uppercase">
                      <div className={`p-1.5 rounded-lg border ${
                        isNew || isCooking || isReady ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' : 'bg-slate-950 text-slate-600 border-slate-800'
                      }`}>
                        1. Diterima
                      </div>
                      <div className={`p-1.5 rounded-lg border ${
                        isCooking || isReady ? 'bg-orange-500 text-slate-950 border-orange-400' : 'bg-slate-950 text-slate-600 border-slate-800'
                      }`}>
                        2. Dimasak 🔥
                      </div>
                      <div className={`p-1.5 rounded-lg border ${
                        isReady ? 'bg-emerald-500 text-slate-950 border-emerald-400' : 'bg-slate-950 text-slate-600 border-slate-800'
                      }`}>
                        3. Sedia Diambil
                      </div>
                    </div>

                    {/* Items */}
                    <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800 space-y-1 text-xs">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between text-slate-300 text-[11px]">
                          <span>{it.quantity}x {it.name}</span>
                          <span className="font-bold text-slate-400">RM {(it.price * it.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="pt-1 border-t border-slate-800 flex justify-between font-black text-amber-400 text-xs">
                        <span>Total:</span>
                        <span>RM {order.grandTotal.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* ================= STRICT CANCELLATION LOCK BANNER ================= */}
                    {isCooking ? (
                      <div className="p-3 rounded-2xl bg-linear-to-r from-rose-950/80 to-orange-950/80 border-2 border-rose-500/80 text-rose-200 text-xs space-y-1.5 shadow-lg">
                        <div className="flex items-center gap-1.5 text-rose-400 font-black text-xs">
                          <Lock className="w-4 h-4 text-rose-400 shrink-0" />
                          <span>PESANAN SEDANG DIMASAK (DIKUNCI)</span>
                        </div>
                        <p className="text-[10px] leading-relaxed text-rose-100">
                          Pihak dapur telah mula memasak hidangan anda. Pesanan ini <strong>TIDAK BOLEH DIBATALKAN</strong> atau <strong>DITUKAR</strong> demi kelancaran penyediaan.
                        </p>
                        <button
                          type="button"
                          disabled
                          className="w-full py-1.5 bg-rose-900/60 text-rose-300 rounded-xl font-bold text-[10px] border border-rose-700/50 cursor-not-allowed flex items-center justify-center gap-1"
                        >
                          <Lock className="w-3 h-3 text-rose-400" />
                          <span>Batal & Tukar Tidak Dibenarkan</span>
                        </button>
                      </div>
                    ) : isReady ? (
                      <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/60 text-emerald-200 text-xs space-y-1">
                        <div className="flex items-center gap-1.5 text-emerald-400 font-black">
                          <CheckCircle className="w-4 h-4" />
                          <span>HIDANGAN SIAP DIMASAK!</span>
                        </div>
                        <p className="text-[10px] text-emerald-100">
                          Makanan sedia dihidangkan ke meja anda atau boleh diambil di kaunter. Selamat menjamu selera!
                        </p>
                      </div>
                    ) : isNew ? (
                      <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-1.5">
                        <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Menunggu giliran di dapur</span>
                        </div>
                        <p className="text-[10px] text-slate-300">
                          Dapur belum memulakan masakan. Pembatalan hanya boleh dibuat sebelum dapur mula memasak.
                        </p>
                        <button
                          type="button"
                          onClick={() => handleAttemptCancel(order)}
                          className="w-full py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 rounded-xl font-bold text-[10px] border border-rose-500/40 transition"
                        >
                          Batal Pesanan Sebelum Masak
                        </button>
                      </div>
                    ) : null}

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => openReceipt(order)}
                        className="py-2 bg-slate-800 text-amber-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>Lihat Resit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveScreen('menu')}
                        className="py-2 bg-amber-500 text-slate-950 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah Order</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* Floating Bottom Cart Bar */}
      {cart.length > 0 && activeScreen === 'menu' && (
        <div className="fixed bottom-3 left-4 right-4 max-w-md mx-auto z-40 animate-fade-in">
          <div className="bg-slate-900 border-2 border-amber-500 p-3 rounded-2xl shadow-2xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
                {totalCartCount}
              </span>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block leading-none">
                  {orderType === 'DINE_IN' ? `Meja ${tableId}` : 'Takeaway'}
                </span>
                <span className="text-xs font-black text-amber-400 leading-tight">
                  RM {grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="px-4 py-2 bg-linear-to-r from-amber-500 to-orange-500 text-slate-950 font-black rounded-xl text-xs shadow-md shadow-amber-500/30 transition flex items-center gap-1.5"
            >
              <span>Semak Pesanan &rarr;</span>
            </button>
          </div>
        </div>
      )}

      {/* Mobile Cart / Checkout Bottom Sheet Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border-t-2 border-amber-500 rounded-t-3xl p-5 w-full max-w-md max-h-[85vh] overflow-y-auto space-y-4 text-slate-100">
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <h3 className="font-black text-sm text-white">Semakan Pesanan</h3>
                <span className="text-[10px] text-amber-400 font-bold">
                  {orderType === 'DINE_IN' ? `Makan Sini: Meja ${tableId}` : 'Bungkus / Takeaway'}
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
              {cart.map(item => (
                <div key={item.id} className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-black text-xs text-white leading-tight">{item.name}</h4>
                      <span className="text-[10px] text-slate-400">RM {item.sellingPrice.toFixed(2)} / unit</span>
                    </div>
                    <span className="font-black text-xs text-amber-400">
                      RM {(item.sellingPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-900">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleUpdateQty(item.id, -1)}
                        className="w-6 h-6 rounded-lg bg-slate-800 text-white flex items-center justify-center font-black text-xs"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center font-black text-xs text-white">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQty(item.id, 1)}
                        className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex justify-between items-center text-xs">
              <span className="font-bold text-slate-300">TOTAL BAYARAN:</span>
              <span className="font-black text-base text-amber-400">RM {grandTotal.toFixed(2)}</span>
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 block">Pilih Pembayaran:</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('QR_PAYMENT')}
                  className={`p-2.5 rounded-xl border text-xs font-black flex items-center justify-center gap-1.5 ${
                    paymentMethod === 'QR_PAYMENT' ? 'border-amber-500 bg-amber-500/20 text-amber-400' : 'border-slate-800 bg-slate-950 text-slate-400'
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>DuitNow QR</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('CASH')}
                  className={`p-2.5 rounded-xl border text-xs font-black flex items-center justify-center gap-1.5 ${
                    paymentMethod === 'CASH' ? 'border-amber-500 bg-amber-500/20 text-amber-400' : 'border-slate-800 bg-slate-950 text-slate-400'
                  }`}
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Tunai (Kaunter)</span>
                </button>
              </div>

              {paymentMethod === 'QR_PAYMENT' && (
                <div className="p-3 bg-slate-950 rounded-2xl border border-amber-500/30 text-center space-y-1.5">
                  <div className="p-2 bg-white rounded-xl shadow-xs inline-block">
                    <QRCodeSVG value={`DUITNOW:TECHBYTE-PASTA-M${tableId}:RM${grandTotal.toFixed(2)}`} size={95} level="M" />
                  </div>
                  <p className="text-[10px] text-amber-400 font-bold">Imbas & bayar terus: RM {grandTotal.toFixed(2)}</p>
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              onClick={handleCheckoutSubmit}
              className="w-full py-3 bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-400 text-slate-950 rounded-2xl font-black text-xs shadow-lg shadow-amber-500/30 transition flex items-center justify-center gap-2"
            >
              <ChefHat className="w-4 h-4" />
              <span>HANTAR KE DAPUR & SAHKAN BAYARAN</span>
            </button>

          </div>
        </div>
      )}

      {/* Table Selection Modal */}
      {isTableModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-5 w-full max-w-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-black text-sm text-white">Pilih Meja Anda</h3>
              <button onClick={() => setIsTableModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setOrderType('DINE_IN')}
                className={`py-2 rounded-xl text-xs font-black border ${
                  orderType === 'DINE_IN' ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                Makan Sini (Dine-In)
              </button>
              <button
                onClick={() => { setOrderType('TAKEAWAY'); setIsTableModalOpen(false); }}
                className={`py-2 rounded-xl text-xs font-black border ${
                  orderType === 'TAKEAWAY' ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                Bungkus (Takeaway)
              </button>
            </div>

            {orderType === 'DINE_IN' && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 block">Pilih Nombor Meja:</span>
                <div className="grid grid-cols-5 gap-2">
                  {tables.map(t => (
                    <button
                      key={t.id}
                      onClick={() => { setTableId(t.id); setIsTableModalOpen(false); }}
                      className={`p-2.5 rounded-xl font-black text-xs border text-center transition ${
                        tableId === t.id ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-950 text-slate-300 border-slate-800'
                      }`}
                    >
                      {t.id}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
export default CustomerPhoneApp;
