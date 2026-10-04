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
  Smartphone,
  Tablet,
  Check,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  Users,
  BellRing,
  LogOut,
  Calendar
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export const WaiterTabletApp = () => {
  const {
    menu,
    tables,
    categories,
    createFoodOrder,
    foodOrders,
    updateFoodOrderStatus,
    updateTable,
    selectedTableForCustomer,
    openReceipt,
    showToast,
    switchSystemMode,
    currentUser,
    syncStatus,
    realtimeSync,
    logoutStaff,
    isMenuItemAvailableToday,
    getCurrentDayMalay
  } = useApp();

  const todayMalay = getCurrentDayMalay ? getCurrentDayMalay() : 'Hari Ini';

  const [activeTableId, setActiveTableId] = useState(selectedTableForCustomer || 'M01');
  const [orderType, setOrderType] = useState('DINE_IN');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // Ticket Cart for active table
  const [ticketCart, setTicketCart] = useState([]);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isCustomerPairModalOpen, setIsCustomerPairModalOpen] = useState(false);
  const [activeTabMode, setActiveTabMode] = useState('order'); // 'order' or 'kitchen_status'

  // Get active order for current selected table
  const activeTableOrder = (foodOrders || []).find(o => 
    orderType === 'DINE_IN' 
      ? o.tableId === activeTableId && o.orderStatus !== 'CANCELLED' && o.orderStatus !== 'COMPLETED'
      : o.orderType === 'TAKEAWAY' && o.orderStatus !== 'CANCELLED' && o.orderStatus !== 'COMPLETED'
  );

  // Filtered menu
  const filteredMenu = menu.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const ticketSubtotal = ticketCart.reduce((acc, it) => acc + (it.sellingPrice * it.quantity), 0);
  const ticketGrandTotal = ticketSubtotal;

  // Add item to active table's ticket
  const handleAddToTicket = (item) => {
    if (isMenuItemAvailableToday && !isMenuItemAvailableToday(item)) {
      showToast(`Item "${item.name}" tidak dimasak/dijual pada hari ${todayMalay}.`, 'warning');
      return;
    }

    if (item.status === 'OUT OF STOCK') {
      showToast('Item ini habis stok.', 'warning');
      return;
    }

    setTicketCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1, notes: '' }];
    });
    showToast(`Ditambah: ${item.name} (+1)`, 'info');
  };

  const handleUpdateTicketQty = (itemId, change) => {
    setTicketCart(prev => prev.map(i => {
      if (i.id === itemId) {
        const newQty = i.quantity + change;
        return newQty > 0 ? { ...i, quantity: newQty } : null;
      }
      return i;
    }).filter(Boolean));
  };

  const handleRemoveFromTicket = (itemId) => {
    setTicketCart(prev => prev.filter(i => i.id !== itemId));
  };

  const handleAddQuickNote = (itemId, noteText) => {
    setTicketCart(prev => prev.map(i => {
      if (i.id === itemId) {
        const current = i.notes ? `${i.notes}, ${noteText}` : noteText;
        return { ...i, notes: current };
      }
      return i;
    }));
  };

  // Submit Order & Dispatch to Kitchen
  const handleSendToKitchen = (paymentMethod = 'CASH') => {
    if (ticketCart.length === 0) {
      showToast('Sila pilih hidangan makanan/minuman terlebih dahulu.', 'warning');
      return;
    }

    const orderItems = ticketCart.map(it => ({
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
      tableId: orderType === 'DINE_IN' ? activeTableId : null,
      customerName: customerName.trim() || (orderType === 'DINE_IN' ? `Pelanggan Meja ${activeTableId}` : 'Pelanggan Bungkus'),
      customerPhone: customerPhone.trim() || '-',
      items: orderItems,
      paymentMethod
    });

    setTicketCart([]);
    setCustomerName('');
    setCustomerPhone('');

    if (newOrder) {
      showToast(`Pesanan ${newOrder.id} dihantar terus ke Dapur!`, 'success');
      realtimeSync.playChime('new_order');
    }
  };

  // Free table once finished
  const handleFreeTable = (tblId) => {
    if (window.confirm(`Kosongkan Meja ${tblId} untuk pelanggan seterusnya?`)) {
      updateTable(tblId, { status: 'AVAILABLE', activeOrderId: null });
      showToast(`Meja ${tblId} kini kosong dan sedia untuk pelanggan baru.`, 'info');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none pb-4">
      
      {/* ================= TOP TABLET APP BAR ================= */}
      <header className="bg-slate-900 border-b border-amber-500/30 px-4 py-2.5 flex items-center justify-between shadow-lg shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (currentUser?.role === 'CUSTOMER SERVICE') {
                logoutStaff();
              } else {
                switchSystemMode('MAIN');
              }
            }}
            className="p-2 rounded-xl bg-slate-800 text-amber-400 hover:bg-slate-700 transition cursor-pointer"
            title="Kembali ke Menu Utama"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="bg-white p-1 rounded-xl shadow-xs">
            <img
              src={giatmaraLogo}
              alt="GIATMARA"
              className="h-8 w-auto object-contain"
              onError={(e) => { e.currentTarget.src = './logo.png'; }}
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-amber-400 uppercase tracking-wide">
                TECHBYTE & FELÌCE CAFFÉ
              </span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-black flex items-center gap-1">
                <Tablet className="w-3 h-3" />
                <span>POS TAB PELAYAN (STAFF)</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Pelayan: <strong>{currentUser ? currentUser.name : 'Pelatih Masakan (Pelayan)'}</strong> • Kompleks GIATMARA Kangar
            </p>
          </div>
        </div>

        {/* Status Sync Pill & Quick Actions */}
        <div className="flex items-center gap-3">
          {/* Cloud Sync Status */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold">
            <span className={`w-2.5 h-2.5 rounded-full ${syncStatus === 'connected' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
            <span className="text-[11px] text-slate-300">
              {syncStatus === 'connected' ? 'Cloud Sync: Online' : 'Cloud Sync: Menghubung...'}
            </span>
          </div>

          {/* Table QR Pairing Button for Customers */}
          <button
            onClick={() => setIsCustomerPairModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition shadow-md cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>Papar QR Meja Pelanggan</span>
          </button>

          {/* Log Keluar Button */}
          <button
            onClick={() => {
              if (currentUser?.role === 'CUSTOMER SERVICE') {
                logoutStaff();
              } else {
                switchSystemMode('MAIN');
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/70 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-500/40 text-xs font-bold transition shadow-md cursor-pointer"
            title="Log Keluar ke Menu Pelanggan Awam"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Log Keluar</span>
          </button>
        </div>
      </header>

      {/* ================= 3-COLUMN TABLET WORKSPACE ================= */}
      <div className="flex-1 grid grid-cols-12 gap-3 p-3 overflow-hidden">
        
        {/* ================= COLUMN 1: FLOOR MAP & TABLE SELECTOR (25% / 3 cols) ================= */}
        <div className="col-span-3 bg-slate-900/90 rounded-3xl border border-slate-800 p-3.5 flex flex-col justify-between shadow-xl overflow-hidden">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-black text-white flex items-center gap-1.5">
                <UtensilsCrossed className="w-3.5 h-3.5 text-amber-400" />
                <span>PETA MEJA RESTORAN</span>
              </span>
              <span className="text-[10px] text-slate-400 font-bold">
                {tables.filter(t => t.status === 'OCCUPIED').length} Diduduki / {tables.length} Meja
              </span>
            </div>

            {/* Mode Switcher: Dine-In vs Takeaway */}
            <div className="grid grid-cols-2 gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800">
              <button
                onClick={() => setOrderType('DINE_IN')}
                className={`py-1.5 rounded-xl text-xs font-black transition ${
                  orderType === 'DINE_IN' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400'
                }`}
              >
                Makan Sini
              </button>
              <button
                onClick={() => setOrderType('TAKEAWAY')}
                className={`py-1.5 rounded-xl text-xs font-black transition ${
                  orderType === 'TAKEAWAY' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400'
                }`}
              >
                Bungkus
              </button>
            </div>

            {/* Table Grid (M01 - M10) */}
            {orderType === 'DINE_IN' ? (
              <div className="grid grid-cols-2 gap-2 max-h-[calc(100vh-270px)] overflow-y-auto pr-1">
                {tables.map(t => {
                  const isSelected = activeTableId === t.id;
                  const isOccupied = t.status === 'OCCUPIED';
                  const activeOrd = foodOrders.find(o => o.tableId === t.id && o.orderStatus !== 'CANCELLED' && o.orderStatus !== 'COMPLETED');
                  const isCooking = activeOrd && activeOrd.orderStatus === 'PREPARING';
                  const isReady = activeOrd && activeOrd.orderStatus === 'READY';

                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveTableId(t.id)}
                      className={`p-3 rounded-2xl border-2 text-left transition relative flex flex-col justify-between h-24 ${
                        isSelected
                          ? 'border-amber-400 bg-amber-500/15 shadow-lg shadow-amber-500/20'
                          : isReady
                          ? 'border-emerald-500 bg-emerald-500/15'
                          : isCooking
                          ? 'border-orange-500 bg-orange-500/15'
                          : isOccupied
                          ? 'border-indigo-500 bg-indigo-500/10'
                          : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-black text-sm text-white">Meja {t.id}</span>
                        {isReady ? (
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                        ) : isCooking ? (
                          <Flame className="w-3.5 h-3.5 text-orange-400" />
                        ) : isOccupied ? (
                          <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-slate-600"></span>
                        )}
                      </div>

                      <div className="mt-1">
                        <span className={`text-[10px] font-black uppercase block leading-tight ${
                          isReady ? 'text-emerald-400' :
                          isCooking ? 'text-orange-400' :
                          isOccupied ? 'text-indigo-300' : 'text-slate-500'
                        }`}>
                          {isReady ? 'SIAP DIHIDANG' :
                           isCooking ? 'SEDANG DIMASAK' :
                           isOccupied ? 'MENUNGGU DAPUR' : 'KOSONG'}
                        </span>

                        {activeOrd && (
                          <span className="text-[9px] text-amber-400 font-mono font-bold">
                            RM {activeOrd.grandTotal.toFixed(2)} ({activeOrd.items.length} item)
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center space-y-2">
                <Bike className="w-8 h-8 text-amber-400 mx-auto" />
                <h4 className="font-black text-xs text-white">Pesanan Bungkus (Takeaway)</h4>
                <p className="text-[10px] text-slate-400">
                  Ambil pesanan untuk pelanggan yang ingin membawa pulang makanan.
                </p>
              </div>
            )}
          </div>

          {/* Quick Clear Table Button */}
          {orderType === 'DINE_IN' && (
            <div className="pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => handleFreeTable(activeTableId)}
                className="w-full py-2 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-rose-400 rounded-xl text-[11px] font-bold border border-slate-800 transition"
              >
                Set Semula / Kosongkan Meja {activeTableId}
              </button>
            </div>
          )}
        </div>

        {/* ================= COLUMN 2: FAST-TOUCH MENU ORDERING PAD (45% / 5 cols) ================= */}
        <div className="col-span-5 bg-slate-900/90 rounded-3xl border border-slate-800 p-3.5 flex flex-col shadow-xl overflow-hidden space-y-3">
          
          {/* Header & Search */}
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari makanan / minuman pantas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-amber-500"
              />
            </div>

            <button
              onClick={() => setActiveTabMode(activeTabMode === 'order' ? 'kitchen_status' : 'order')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
                activeTabMode === 'kitchen_status'
                  ? 'bg-orange-500 text-slate-950 shadow-md'
                  : 'bg-slate-950 text-slate-300 border border-slate-800'
              }`}
            >
              <ChefHat className="w-3.5 h-3.5" />
              <span>Pantau Dapur</span>
            </button>
          </div>

          {/* Quick Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none shrink-0">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-black whitespace-nowrap bg-amber-500/15 border border-amber-500/40 text-amber-300 shrink-0">
              <Calendar className="w-3 h-3 text-amber-400" />
              <span>Hari Ini: {todayMalay}</span>
            </div>

            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3 py-1 rounded-xl text-xs font-black whitespace-nowrap transition ${
                selectedCategory === 'ALL'
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-950 text-slate-400 border border-slate-800'
              }`}
            >
              Semua ({menu.length})
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-black whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Food Cards Grid (Optimized for Fast Tablet Tapping) */}
          <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-2 gap-2.5">
            {filteredMenu.map(item => {
              const inTicket = ticketCart.find(i => i.id === item.id);
              const qty = inTicket ? inTicket.quantity : 0;
              const availableToday = isMenuItemAvailableToday ? isMenuItemAvailableToday(item) : true;
              const isOutOfStock = item.status === 'OUT OF STOCK';
              const isInactive = item.status === 'INACTIVE';
              const canOrder = availableToday && !isOutOfStock && !isInactive;

              return (
                <div
                  key={item.id}
                  onClick={() => canOrder && handleAddToTicket(item)}
                  className={`bg-slate-950 rounded-2xl p-2.5 border transition flex flex-col justify-between ${
                    qty > 0
                      ? 'border-amber-400 bg-amber-500/10'
                      : canOrder
                      ? 'border-slate-800 hover:border-slate-700 cursor-pointer active:scale-[0.98]'
                      : 'border-slate-800/60 bg-slate-950/60 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-slate-900">
                      <img
                        src={item.image}
                        alt={item.name}
                        className={`w-full h-full object-cover ${canOrder ? '' : 'grayscale-[40%]'}`}
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80";
                        }}
                      />
                      {!availableToday && (
                        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-[1px] flex flex-col items-center justify-center p-0.5 text-center">
                          <span className="text-[7px] font-black text-amber-400 uppercase leading-none">
                            Off
                          </span>
                          <span className="text-[6px] font-bold text-slate-300 leading-none mt-0.5">
                            {todayMalay}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-[9px] font-black text-amber-400 uppercase tracking-wider block truncate">
                          {item.category}
                        </span>
                      </div>
                      <h4 className="font-black text-xs text-white truncate leading-tight mt-0.5">
                        {item.name}
                      </h4>
                      {!availableToday ? (
                        <span className="text-[8px] font-bold text-amber-300/80 block mt-0.5">
                          Tidak Dijual Hari Ini
                        </span>
                      ) : (
                        <span className="font-black text-xs text-amber-400 block mt-1">
                          RM {item.sellingPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Indicator or Add Button */}
                  <div className="mt-2 pt-1 border-t border-slate-900 flex items-center justify-between">
                    {qty > 0 ? (
                      <span className="text-[10px] font-black text-emerald-400 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>{qty} dlm tiket</span>
                      </span>
                    ) : canOrder ? (
                      <span className="text-[10px] text-slate-500 font-bold">Tekan untuk tambah</span>
                    ) : (
                      <span className="text-[9px] text-slate-500 font-bold">
                        {!availableToday ? `Off Hari ${todayMalay}` : isOutOfStock ? 'Habis Stok' : 'Tidak Aktif'}
                      </span>
                    )}

                    {canOrder ? (
                      <div className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs shadow-xs">
                        <Plus className="w-3.5 h-3.5" />
                      </div>
                    ) : (
                      <div className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-600 text-[8px] font-bold">
                        Off
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* ================= COLUMN 3: TICKET DISPATCH & BILLING (30% / 4 cols) ================= */}
        <div className="col-span-4 bg-slate-900/90 rounded-3xl border border-slate-800 p-3.5 flex flex-col justify-between shadow-xl overflow-hidden space-y-3">
          
          <div>
            {/* Ticket Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <h3 className="font-black text-sm text-white">
                  {orderType === 'DINE_IN' ? `TIKET MEJA ${activeTableId}` : 'TIKET BUNGKUS'}
                </h3>
                <span className="text-[10px] text-amber-400 font-bold">
                  {ticketCart.length} Item Baharu Dipilih
                </span>
              </div>

              {ticketCart.length > 0 && (
                <button
                  type="button"
                  onClick={() => setTicketCart([])}
                  className="text-[10px] text-rose-400 hover:text-rose-300 font-bold"
                >
                  Padam Semua
                </button>
              )}
            </div>

            {/* Existing Active Order Alert on this Table */}
            {activeTableOrder && (
              <div className="my-2 p-2.5 bg-slate-950 rounded-2xl border border-amber-500/40 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-black text-amber-400">Pesanan Aktif: {activeTableOrder.id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                    activeTableOrder.orderStatus === 'PREPARING' ? 'bg-orange-500 text-slate-950' :
                    activeTableOrder.orderStatus === 'READY' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {activeTableOrder.orderStatus}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-300">
                  <span>Jumlah: RM {activeTableOrder.grandTotal.toFixed(2)}</span>
                  <button
                    onClick={() => openReceipt(activeTableOrder)}
                    className="text-amber-400 underline font-bold"
                  >
                    Resit
                  </button>
                </div>
              </div>
            )}

            {/* Ticket Items List */}
            <div className="space-y-2 mt-2 max-h-[calc(100vh-360px)] overflow-y-auto pr-1">
              {ticketCart.length === 0 ? (
                <div className="py-8 text-center bg-slate-950 rounded-2xl border border-dashed border-slate-800">
                  <ShoppingBag className="w-8 h-8 text-slate-600 mx-auto mb-1" />
                  <p className="text-xs font-bold text-slate-400">Tiket Meja Kosong</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Tekan mana-mana menu di bahagian tengah untuk mengambil pesanan pelanggan.
                  </p>
                </div>
              ) : (
                ticketCart.map(item => (
                  <div
                    key={item.id}
                    className="p-2.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-black text-xs text-white leading-tight">{item.name}</h4>
                        <span className="text-[10px] text-slate-400">RM {item.sellingPrice.toFixed(2)} / unit</span>
                      </div>
                      <span className="font-black text-xs text-amber-400">
                        RM {(item.sellingPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>

                    {/* Quick Modifier Chips */}
                    <div className="flex items-center gap-1 overflow-x-auto pb-0.5 text-[9px]">
                      {['Kurang Manis', 'Pedas', 'Tanpa Ais', 'Panas'].map(mod => (
                        <button
                          key={mod}
                          onClick={() => handleAddQuickNote(item.id, mod)}
                          className="px-1.5 py-0.5 bg-slate-900 hover:bg-slate-800 text-slate-400 rounded-md border border-slate-800 whitespace-nowrap"
                        >
                          +{mod}
                        </button>
                      ))}
                    </div>

                    {item.notes && (
                      <p className="text-[10px] text-amber-400/90 italic">Nota: "{item.notes}"</p>
                    )}

                    {/* Controls */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-900">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleUpdateTicketQty(item.id, -1)}
                          className="w-6 h-6 rounded-lg bg-slate-800 text-white flex items-center justify-center font-black text-xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center font-black text-xs text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateTicketQty(item.id, 1)}
                          className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemoveFromTicket(item.id)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Ticket Footer & Actions */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            {ticketCart.length > 0 && (
              <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800 flex justify-between items-center text-xs">
                <span className="font-bold text-slate-300">TOTAL TIKET:</span>
                <span className="font-black text-base text-amber-400">
                  RM {ticketGrandTotal.toFixed(2)}
                </span>
              </div>
            )}

            {/* Primary Action Buttons for Waiter */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleSendToKitchen('CASH')}
                disabled={ticketCart.length === 0}
                className={`py-3 rounded-2xl font-black text-xs transition flex items-center justify-center gap-1.5 ${
                  ticketCart.length > 0
                    ? 'bg-linear-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/30 active:scale-95 cursor-pointer'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <ChefHat className="w-4 h-4" />
                <span>Hantar ke Dapur</span>
              </button>

              <button
                type="button"
                onClick={() => setIsQrModalOpen(true)}
                disabled={ticketCart.length === 0}
                className={`py-3 rounded-2xl font-black text-xs transition flex items-center justify-center gap-1.5 ${
                  ticketCart.length > 0
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg active:scale-95 cursor-pointer'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>Papar QR Meja</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* DuitNow QR Modal for Waiter to Show Customer at Table */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-sm text-center space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-black text-sm text-white">DuitNow QR: Meja {activeTableId}</h3>
              <button onClick={() => setIsQrModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-white rounded-2xl shadow-md inline-block">
              <QRCodeSVG
                value={`DUITNOW:TECHBYTE-PASTA-M${activeTableId}:RM${ticketGrandTotal.toFixed(2)}`}
                size={160}
                level="M"
              />
            </div>

            <div>
              <span className="text-xl font-black text-amber-400 block">RM {ticketGrandTotal.toFixed(2)}</span>
              <p className="text-[11px] text-slate-400 mt-1">
                Tunjukkan skrin tablet ini kepada pelanggan untuk imbas & bayar terus menggunakan Maybank, CIMB, atau TNG eWallet.
              </p>
            </div>

            <button
              onClick={() => {
                handleSendToKitchen('QR_PAYMENT');
                setIsQrModalOpen(false);
              }}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-xs transition"
            >
              Pelanggan Telah Selesai Bayar &rarr; Hantar ke Dapur
            </button>
          </div>
        </div>
      )}

      {/* Customer Pairing QR Modal */}
      {isCustomerPairModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-sm text-center space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-black text-sm text-white">Pautkan Telefon Pelanggan (Meja {activeTableId})</h3>
              <button onClick={() => setIsCustomerPairModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-white rounded-2xl shadow-md inline-block">
              <QRCodeSVG
                value={`https://wmdir2026.github.io/TRIG_GM_Kangar/?app=customer&table=${activeTableId}`}
                size={170}
                level="M"
              />
            </div>

            <div>
              <span className="text-xs font-black text-amber-400 block">IMBAS DENGAN TELEFON PELANGGAN</span>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Pelanggan akan terus membuka Aplikasi Pelanggan dengan Meja {activeTableId} pre-selected dan bersambung secara live ke tablet ini!
              </p>
            </div>

            <button
              onClick={() => setIsCustomerPairModalOpen(false)}
              className="w-full py-2 bg-slate-800 text-slate-300 rounded-xl font-bold text-xs hover:bg-slate-700 transition"
            >
              Tutup Paparan QR
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
export default WaiterTabletApp;
