import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShoppingBag,
  UtensilsCrossed,
  Plus,
  Minus,
  Trash2,
  Search,
  CheckCircle,
  CreditCard,
  QrCode,
  DollarSign,
  User,
  Phone,
  Clock,
  Printer,
  Sparkles,
  X,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export const FoodOrderingPOS = () => {
  const {
    menu,
    tables,
    categories,
    createFoodOrder,
    openReceipt,
    settings,
    showToast,
    isMenuItemAvailableToday,
    getCurrentDayMalay,
    currentUser
  } = useApp();

  const isCafeAdminCashier = !currentUser || 
                             ['SUPER ADMIN', 'CAFE CASHIER', 'MANAGER CAFE', 'CAFE STAFF', 'ADMIN'].includes(currentUser?.role) ||
                             (currentUser?.role && (currentUser.role.includes('ADMIN') || currentUser.role.includes('CAFE')));

  const todayMalay = getCurrentDayMalay ? getCurrentDayMalay() : 'Hari Ini';

  const [orderType, setOrderType] = useState('DINE_IN'); // 'DINE_IN' or 'TAKEAWAY'
  const [selectedTable, setSelectedTable] = useState('M01');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [pickupTime, setPickupTime] = useState('Segera');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Cart State: [{ ...menuItem, quantity: 1, notes: '' }]
  const [cart, setCart] = useState([]);

  // Checkout Payment Modal
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('QR_PAYMENT');
  const [cashTendered, setCashTendered] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Audio Synthesizer Beep for POS Barcode Scanner
  const playPosBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1750, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    } catch (e) {
      // Audio fallback
    }
  };

  // Add to cart
  const handleAddToCart = (item) => {
    if (isMenuItemAvailableToday && !isMenuItemAvailableToday(item)) {
      showToast(`Item "${item.name}" tidak dimasak/dijual pada hari ${todayMalay}.`, 'warning');
      return;
    }

    if (item.status === 'OUT OF STOCK') {
      showToast('Item ini telah kehabisan stok.', 'warning');
      return;
    }

    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      } else {
        return [...prev, { ...item, quantity: 1, notes: '' }];
      }
    });
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

  const handleRemoveFromCart = (itemId) => {
    setCart(prev => prev.filter(i => i.id !== itemId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Global Barcode & QR Scanner Listener (Khusus untuk Admin Cafe Cashier)
  useEffect(() => {
    if (!isCafeAdminCashier) return;

    let scanBuffer = '';
    let lastKeyTime = Date.now();

    const handleGlobalKeyDown = (e) => {
      // Abaikan jika modal pembayaran sedang aktif
      if (isPaymentModalOpen) return;

      const currentTime = Date.now();
      const timeDiff = currentTime - lastKeyTime;
      lastKeyTime = currentTime;

      // Jika jeda menaip melebihi 250ms dan bukan kekunci Enter, reset buffer
      if (timeDiff > 250 && e.key !== 'Enter') {
        scanBuffer = '';
      }

      if (e.key === 'Enter') {
        const rawCode = scanBuffer.trim();
        if (rawCode) {
          // Bersihkan prefix jika ada (contoh: "TRIG-MENU:MENU-001" -> "MENU-001")
          const cleanCode = rawCode.replace(/^(TRIG-MENU:|MENU:|FOOD:)/i, '').trim().toLowerCase();
          const found = menu.find(m => 
            (m.id && m.id.toLowerCase() === cleanCode) ||
            (m.id && m.id.toLowerCase() === rawCode.toLowerCase()) ||
            (m.name && m.name.toLowerCase() === cleanCode) ||
            (m.name && m.name.toLowerCase() === rawCode.toLowerCase())
          );

          if (found) {
            e.preventDefault();
            const availableToday = isMenuItemAvailableToday ? isMenuItemAvailableToday(found) : true;
            if (!availableToday) {
              showToast(`Item "${found.name}" tidak dimasak hari ini (${todayMalay}).`, 'warning');
            } else if (found.status === 'OUT OF STOCK') {
              showToast(`Item "${found.name}" telah kehabisan stok.`, 'warning');
            } else {
              handleAddToCart(found);
              playPosBeep();
              showToast(`⚡ Imbasan Berjaya: Ditambah "${found.name}" ke troli!`, 'success');
            }
            scanBuffer = '';
            return;
          }
        }
        scanBuffer = '';
      } else if (e.key && e.key.length === 1) {
        // Kumpul setiap aksara daripada pengimbas kod bar
        scanBuffer += e.key;
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [menu, isMenuItemAvailableToday, todayMalay, isPaymentModalOpen, isCafeAdminCashier]);

  // Calculations
  const subtotal = cart.reduce((acc, it) => acc + (it.sellingPrice * it.quantity), 0);
  const discount = 0;
  const grandTotal = subtotal - discount;
  const cashAmount = parseFloat(cashTendered) || 0;
  const changeDue = Math.max(0, cashAmount - grandTotal);

  // Filtered Menu
  const filteredMenu = menu.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenCheckout = () => {
    if (cart.length === 0) {
      showToast('Sila masukkan sekurang-kurangnya satu hidangan ke troli.', 'warning');
      return;
    }
    if (orderType === 'DINE_IN' && !selectedTable) {
      showToast('Sila pilih nombor meja.', 'warning');
      return;
    }
    setCashTendered(grandTotal.toString());
    setIsPaymentModalOpen(true);
  };

  const handleConfirmPaymentAndOrder = () => {
    if (paymentMethod === 'CASH' && cashAmount < grandTotal) {
      showToast('Jumlah wang tunai tidak mencukupi.', 'error');
      return;
    }

    setIsSubmitting(true);

    const orderItems = cart.map(it => ({
      menuId: it.id,
      name: it.name,
      price: it.sellingPrice,
      costPrice: it.costPrice,
      quantity: it.quantity,
      subtotal: it.sellingPrice * it.quantity,
      notes: it.notes || ''
    }));

    const createdOrder = createFoodOrder({
      orderType,
      tableId: orderType === 'DINE_IN' ? selectedTable : null,
      customerName: customerName || (orderType === 'DINE_IN' ? `Pelanggan Meja ${selectedTable}` : 'Pelanggan Bungkus'),
      customerPhone,
      pickupTime,
      items: orderItems,
      paymentMethod
    });

    setIsSubmitting(false);
    setIsPaymentModalOpen(false);
    setCart([]);

    if (createdOrder) {
      // Promptly open receipt
      openReceipt(createdOrder);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      
      {/* Left 2 Cols: Menu Catalog */}
      <div className="lg:col-span-2 space-y-4">
        
        {/* Order Mode & Table Selector Bar */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Toggle Dine In / Takeaway */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-2xl">
            <button
              onClick={() => setOrderType('DINE_IN')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                orderType === 'DINE_IN'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-black shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>DINE-IN (Makan Sini)</span>
            </button>
            <button
              onClick={() => setOrderType('TAKEAWAY')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                orderType === 'TAKEAWAY'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-black shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>TAKEAWAY (Bungkus)</span>
            </button>
          </div>

          {/* Conditional Input */}
          {orderType === 'DINE_IN' ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-700">Pilih Meja:</span>
              <select
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                className="px-3 py-2 text-xs font-bold bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500/20"
              >
                {tables.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.id} - {t.name} ({t.status === 'AVAILABLE' ? 'Kosong' : 'Diduduki'})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                placeholder="Nama Pelanggan"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-none font-medium w-36"
              />
              <input
                type="text"
                placeholder="No. Tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-none font-medium w-28"
              />
            </div>
          )}

        </div>

        {/* Search & Category Filter */}
        <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Cari menu, imbas Barcode/QR..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const query = searchQuery.trim().toLowerCase();
                    if (!query) return;
                    const cleanCode = query.replace(/^(TRIG-MENU:|MENU:|FOOD:)/i, '').trim();
                    const matchedItem = menu.find(m => 
                      (m.id && m.id.toLowerCase() === cleanCode) ||
                      (m.id && m.id.toLowerCase() === query) ||
                      (m.name && m.name.toLowerCase() === cleanCode) ||
                      (m.name && m.name.toLowerCase() === query)
                    ) || (filteredMenu.length === 1 ? filteredMenu[0] : null);

                    if (matchedItem) {
                      handleAddToCart(matchedItem);
                      playPosBeep();
                      showToast(`⚡ Imbasan Berjaya: Ditambah "${matchedItem.name}" ke troli!`, 'success');
                      setSearchQuery('');
                    } else if (filteredMenu.length > 1) {
                      showToast(`Ditemui ${filteredMenu.length} padanan carian. Sila pilih item.`, 'info');
                    } else {
                      showToast(`Tiada menu dijumpai untuk carian "${searchQuery}".`, 'warning');
                    }
                  }
                }}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl outline-none font-medium"
              />
            </div>
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-700 text-xs font-black shrink-0">
              <Calendar className="w-3.5 h-3.5" />
              <span>Hari Ini: {todayMalay}</span>
            </div>
            {isCafeAdminCashier && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-800 text-xs font-bold shrink-0 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                <span>QR Scanner Aktif</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedCategory === 'ALL' ? 'bg-neutral-900 text-amber-400 font-black' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Semua Menu
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  selectedCategory === cat ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-black shadow-xs' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 max-h-[68vh] overflow-y-auto pr-1">
          {filteredMenu.map(item => {
            const availableToday = isMenuItemAvailableToday ? isMenuItemAvailableToday(item) : true;
            const isOutOfStock = item.status === 'OUT OF STOCK';
            const isInactive = item.status === 'INACTIVE';
            const canOrder = availableToday && !isOutOfStock && !isInactive;

            return (
              <div
                key={item.id}
                onClick={() => canOrder && handleAddToCart(item)}
                className={`bg-white rounded-2xl border transition-all flex flex-col justify-between group ${
                  canOrder
                    ? 'border-stone-200 shadow-xs cursor-pointer hover:shadow-lg hover:border-amber-400'
                    : 'border-stone-200/70 bg-stone-50/80 shadow-none cursor-not-allowed opacity-75'
                }`}
              >
                <div>
                  <div className="relative h-28 w-full bg-stone-100 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className={`w-full h-full object-cover transition duration-300 ${canOrder ? 'group-hover:scale-105' : 'grayscale-[35%]'}`}
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80";
                      }}
                    />
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-black bg-neutral-950/80 text-amber-400 border border-amber-500/30">
                      {item.category}
                    </span>

                    {!availableToday ? (
                      <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-[2px] flex flex-col items-center justify-center p-2 text-center z-10">
                        <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider">
                          Tidak Dimasak Hari Ini
                        </span>
                        <span className="text-[9px] font-bold text-stone-200 mt-0.5">
                          (Hari {todayMalay})
                        </span>
                        {item.availableDays && item.availableDays.length > 0 && (
                          <span className="text-[8px] text-stone-300 mt-1 line-clamp-1 px-1.5 py-0.5 bg-black/40 rounded">
                            Dijual: {item.availableDays.join(', ')}
                          </span>
                        )}
                      </div>
                    ) : isOutOfStock ? (
                      <span className="absolute inset-0 bg-black/60 flex items-center justify-center text-xs font-black text-white z-10">
                        HABIS STOK
                      </span>
                    ) : isInactive ? (
                      <span className="absolute inset-0 bg-stone-900/70 flex items-center justify-center text-xs font-black text-stone-300 z-10">
                        TIDAK AKTIF
                      </span>
                    ) : null}
                  </div>

                  <div className="p-3">
                    <h4 className="font-bold text-xs text-stone-900 line-clamp-1 leading-snug">
                      {item.name}
                    </h4>
                    <p className="text-[10px] text-stone-400 line-clamp-1 mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="p-3 pt-0 flex items-center justify-between">
                  <span className="text-xs font-black text-amber-700">
                    RM {item.sellingPrice.toFixed(2)}
                  </span>
                  <button
                    type="button"
                    disabled={!canOrder}
                    className={`p-1.5 rounded-lg transition font-black ${
                      canOrder
                        ? 'bg-amber-50 text-amber-800 group-hover:bg-amber-500 group-hover:text-neutral-950'
                        : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* QR Code Barcode Scanner Zone (Untuk Admin Cafe Cashier Sahaja) */}
                {isCafeAdminCashier && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      if (canOrder) {
                        handleAddToCart(item);
                        playPosBeep();
                        showToast(`⚡ Imbasan Berjaya: Ditambah "${item.name}" ke troli!`, 'success');
                      }
                    }}
                    className="mx-3 mb-3 p-2 bg-stone-50 hover:bg-amber-50/80 border border-stone-200 hover:border-amber-400 rounded-xl flex items-center gap-2.5 transition cursor-pointer group/qr shadow-2xs"
                    title={`Imbas QR ini menggunakan Barcode Scanner atau klik untuk terus masukkan ${item.name} ke troli`}
                  >
                    <div className="bg-white p-1 rounded-lg border border-stone-200 shadow-2xs shrink-0 flex items-center justify-center">
                      <QRCodeSVG
                        value={`TRIG-MENU:${item.id}`}
                        size={46}
                        level="M"
                        includeMargin={false}
                      />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center gap-1 text-[9px] font-black text-amber-700 uppercase tracking-wider">
                        <QrCode className="w-3 h-3 text-amber-600 shrink-0" />
                        <span>Imbas QR</span>
                      </div>
                      <div className="font-mono text-[10px] font-bold text-stone-800 truncate mt-0.5">
                        {item.id}
                      </div>
                      <div className="text-[8px] text-stone-400 font-medium truncate">
                        Halakan Barcode Scanner
                      </div>
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>

      </div>

      {/* Right 1 Col: Live Shopping Cart & Checkout */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-md p-5 flex flex-col justify-between h-full">
        <div>
          {/* Cart Header */}
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-500/10 text-amber-600 rounded-xl">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-black text-sm text-stone-900">Troli Pesanan</h3>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md uppercase">
                  {orderType === 'DINE_IN' ? `DINE-IN: MEJA ${selectedTable}` : `TAKEAWAY / BUNGKUS`}
                </span>
              </div>
            </div>

            {cart.length > 0 && (
              <button
                onClick={handleClearCart}
                className="text-[11px] text-rose-500 hover:text-rose-700 font-semibold"
              >
                Kosongkan
              </button>
            )}
          </div>

          {/* Cart Items List */}
          <div className="py-3 space-y-3 max-h-[38vh] overflow-y-auto pr-1">
            {cart.length === 0 ? (
              <div className="text-center py-12 text-stone-400 text-xs">
                <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-stone-300" />
                <p className="font-semibold text-stone-600">Troli masih kosong</p>
                <p className="text-[11px]">Pilih hidangan dari menu di sebelah kiri</p>
              </div>
            ) : (
              cart.map(item => (
                <div
                  key={item.id}
                  className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2 text-xs"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-stone-900">{item.name}</h4>
                      <span className="text-[11px] text-amber-700 font-semibold">
                        RM {item.sellingPrice.toFixed(2)} / unit
                      </span>
                    </div>
                    <span className="font-black text-stone-900">
                      RM {(item.sellingPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  {/* Quantity and Notes */}
                  <div className="flex items-center justify-between pt-1">
                    <input
                      type="text"
                      placeholder="Nota: cth. Kurang manis, pedas..."
                      value={item.notes || ''}
                      onChange={(e) => handleUpdateNotes(item.id, e.target.value)}
                      className="text-[10px] px-2 py-1 bg-white border border-stone-300 rounded-lg w-36 outline-none text-slate-950 font-bold placeholder:text-slate-600 focus:border-amber-500"
                    />

                    <div className="flex items-center gap-1.5 bg-white border border-stone-300 rounded-lg p-0.5">
                      <button
                        onClick={() => handleUpdateQty(item.id, -1)}
                        className="p-1 hover:bg-stone-100 rounded text-slate-900 font-black"
                      >
                        <Minus className="w-3 h-3 stroke-[2.5]" />
                      </button>
                      <span className="font-black text-xs px-1.5 text-slate-950">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQty(item.id, 1)}
                        className="p-1 hover:bg-stone-100 rounded text-slate-900 font-black"
                      >
                        <Plus className="w-3 h-3 stroke-[2.5]" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Cart Summary & Checkout Action */}
        <div className="pt-4 border-t border-stone-200 space-y-3">
          <div className="space-y-1.5 text-xs text-slate-900 font-bold">
            <div className="flex justify-between">
              <span className="text-slate-900 font-bold">Jumlah Kasar:</span>
              <span className="font-extrabold text-slate-950">RM {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-900 font-bold">Diskaun:</span>
              <span className="font-bold text-slate-900">- RM 0.00</span>
            </div>
            <div className="flex justify-between text-base font-black text-slate-950 pt-2 border-t border-stone-200">
              <span>JUMLAH BAYARAN:</span>
              <span className="text-amber-600">RM {grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleOpenCheckout}
            disabled={cart.length === 0}
            className={`w-full py-3 rounded-2xl text-xs font-black shadow-lg flex items-center justify-center gap-2 transition ${
              cart.length === 0
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 shadow-amber-500/20'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>Teruskan ke Pembayaran & Dapur</span>
          </button>
        </div>

      </div>

      {/* Payment Simulation Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-slate-200 animate-fade-in text-xs">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-black text-base text-slate-900">
                  Pembayaran Pesanan Café
                </h3>
                <span className="text-[11px] text-slate-500">
                  {orderType === 'DINE_IN' ? `Meja ${selectedTable}` : 'Takeaway'} • Jumlah: RM {grandTotal.toFixed(2)}
                </span>
              </div>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-2 gap-2.5 mb-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('QR_PAYMENT')}
                className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 font-bold transition ${
                  paymentMethod === 'QR_PAYMENT'
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <QrCode className="w-5 h-5" />
                <span>QR DuitNow (Simulasi)</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('CASH')}
                className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 font-bold transition ${
                  paymentMethod === 'CASH'
                    ? 'border-emerald-600 bg-emerald-50/70 text-emerald-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <DollarSign className="w-5 h-5" />
                <span>Tunai (Cash)</span>
              </button>
            </div>

            {/* QR Payment Simulation Body */}
            {paymentMethod === 'QR_PAYMENT' && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-3 mb-4">
                <p className="font-bold text-slate-800">
                  DuitNow QR Merchant TRIG GIATMARA Kangar
                </p>
                <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-200 inline-block">
                  <QRCodeSVG
                    value={`DUITNOW:TRIG-GIATMARA:RM${grandTotal.toFixed(2)}`}
                    size={130}
                    level="M"
                  />
                </div>
                <div className="text-[11px] text-slate-500">
                  Imbas menggunakan mana-mana Perbankan Dalam Talian / E-Wallet.
                  <br />
                  <span className="font-bold text-emerald-700">Jumlah: RM {grandTotal.toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* Cash Tendered */}
            {paymentMethod === 'CASH' && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 mb-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Wang Tunai Diterima (RM)
                  </label>
                  <input
                    type="number"
                    step="0.50"
                    min={grandTotal}
                    value={cashTendered}
                    onChange={(e) => setCashTendered(e.target.value)}
                    className="w-full px-3 py-2 text-sm font-black bg-white border border-slate-200 rounded-xl outline-none"
                  />
                </div>

                <div className="flex justify-between items-center p-2.5 bg-white rounded-xl border border-slate-200 font-bold">
                  <span className="text-slate-600">Baki Wang Pelanggan:</span>
                  <span className="text-emerald-700 font-black text-sm">
                    RM {changeDue.toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2">
              <button
                onClick={handleConfirmPaymentAndOrder}
                disabled={isSubmitting}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-md transition flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Simulasi Bayaran Berjaya (PAID) & Jana Resit</span>
              </button>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="w-full py-2 text-slate-500 hover:bg-slate-100 rounded-xl font-semibold"
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
