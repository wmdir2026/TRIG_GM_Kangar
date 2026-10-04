import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  X,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Send,
  Info,
  Clock,
  Tag,
  Percent,
  Flame
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export const AccessoriesPOS = () => {
  const {
    currentUser,
    inventory,
    sellAccessories,
    openReceipt,
    showToast,
    addInventoryItem,
    deleteInventoryItem,
    requestRemoveInventoryItem,
    cancelRemoveInventoryItem,
    accessoryDiscount,
    updateAccessoryDiscount
  } = useApp();

  // Role Permissions Check
  const isSuperAdmin = currentUser?.role === 'SUPER ADMIN';
  const isManager =
    currentUser?.role === 'MANAGER' ||
    currentUser?.role === 'MANAGER SMARTPHONE REPAIR' ||
    (currentUser?.role && currentUser.role.includes('MANAGER'));
  const canManageAccessories = isSuperAdmin || isManager;

  const [searchQuery, setSearchQuery] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [cart, setCart] = useState([]);

  // Store-wide Discount Modal State (Super Admin Only)
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [discountForm, setDiscountForm] = useState({
    isActive: false,
    percentage: 10,
    title: 'PROMOSI JUALAN MURAH AKSESORI',
    description: 'Tawaran diskaun istimewa sempena promosi bengkel GIATMARA Kangar untuk semua aksesori telefon.'
  });

  // Sync discount form when global discount state updates
  useEffect(() => {
    if (accessoryDiscount) {
      setDiscountForm({
        isActive: Boolean(accessoryDiscount.isActive),
        percentage: Number(accessoryDiscount.percentage) || 10,
        title: accessoryDiscount.title || 'PROMOSI JUALAN MURAH AKSESORI',
        description: accessoryDiscount.description || 'Tawaran diskaun istimewa sempena promosi bengkel GIATMARA Kangar untuk semua aksesori telefon.'
      });
    }
  }, [accessoryDiscount]);

  // Discount calculation helpers
  const isDiscountActive = Boolean(accessoryDiscount?.isActive && Number(accessoryDiscount?.percentage) > 0);
  const discountPercentage = isDiscountActive ? Number(accessoryDiscount.percentage) : 0;

  const getDiscountedPrice = (price) => {
    if (!isDiscountActive) return price;
    return Math.max(0, price * (1 - (discountPercentage / 100)));
  };

  // Payment Modal
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('QR_PAYMENT');
  const [cashTendered, setCashTendered] = useState('');

  // Add Accessory Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    name: '',
    sku: '',
    brand: '',
    model: '',
    currentStock: 15,
    minStock: 5,
    costPrice: '',
    sellingPrice: '',
    unit: 'Unit',
    location: 'Etalase Aksesori Hadapan Rak A'
  });

  // Remove Accessory Modal State
  const [selectedAccForRemoval, setSelectedAccForRemoval] = useState(null);
  const [removalReason, setRemovalReason] = useState('');

  // Lock body scroll while any modal is open
  useEffect(() => {
    if (isPaymentModalOpen || isAddModalOpen || selectedAccForRemoval || isDiscountModalOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isPaymentModalOpen, isAddModalOpen, selectedAccForRemoval, isDiscountModalOpen]);

  // Filter only accessories from central inventory
  const accessories = (inventory || []).filter(i => i.category === 'Smartphone Accessories');

  const filteredAccessories = accessories.filter(acc =>
    (acc.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (acc.sku || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (acc.brand || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingRemovalsCount = accessories.filter(acc => acc.removalStatus === 'PENDING_APPROVAL').length;

  // Cart actions
  const handleAddToCart = (acc) => {
    if (acc.currentStock <= 0) {
      showToast('Stok aksesori ini telah habis.', 'warning');
      return;
    }

    const effectiveSellingPrice = Number(getDiscountedPrice(acc.sellingPrice).toFixed(2));

    setCart(prev => {
      const existing = prev.find(i => i.id === acc.id);
      if (existing) {
        if (existing.quantity >= acc.currentStock) {
          showToast(`Kuantiti melebihi baki stok semasa (${acc.currentStock}).`, 'warning');
          return prev;
        }
        return prev.map(i => i.id === acc.id ? { ...i, quantity: i.quantity + 1 } : i);
      } else {
        return [...prev, {
          ...acc,
          originalPrice: acc.sellingPrice,
          sellingPrice: effectiveSellingPrice,
          isDiscounted: isDiscountActive,
          discountPercentage: discountPercentage,
          quantity: 1
        }];
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

  // Add Accessory Handlers
  const handleOpenAddModal = () => {
    const suggestedSku = `ACC-${Date.now().toString().slice(-4)}`;
    setAddForm({
      name: '',
      sku: suggestedSku,
      brand: '',
      model: '',
      currentStock: 15,
      minStock: 5,
      costPrice: '',
      sellingPrice: '',
      unit: 'Unit',
      location: 'Etalase Aksesori Hadapan Rak A'
    });
    setIsAddModalOpen(true);
  };

  const handleSaveNewAccessory = (e) => {
    e.preventDefault();
    if (!addForm.name.trim()) {
      showToast('Sila masukkan nama aksesori.', 'error');
      return;
    }
    const cost = parseFloat(addForm.costPrice) || 0;
    const sell = parseFloat(addForm.sellingPrice) || 0;
    if (sell <= 0) {
      showToast('Sila masukkan harga jualan yang sah (lebih dari RM 0).', 'error');
      return;
    }

    addInventoryItem({
      name: addForm.name.trim(),
      sku: (addForm.sku || `ACC-${Date.now().toString().slice(-4)}`).trim().toUpperCase(),
      category: 'Smartphone Accessories',
      brand: addForm.brand.trim() || 'ProTech',
      model: addForm.model.trim() || 'Universal Fit',
      currentStock: Number(addForm.currentStock) || 0,
      minStock: Number(addForm.minStock) || 3,
      costPrice: cost,
      sellingPrice: sell,
      unit: addForm.unit || 'Unit',
      location: addForm.location || 'Etalase Aksesori Hadapan',
      supplierId: 'SUP-004'
    });

    setIsAddModalOpen(false);
  };

  // Remove Accessory Handlers
  const handleOpenRemovalModal = (acc) => {
    setSelectedAccForRemoval(acc);
    setRemovalReason(acc.removalReason || '');
  };

  // Super Admin: Remove completely
  const handleConfirmSuperAdminDelete = (e) => {
    if (e) e.preventDefault();
    if (!selectedAccForRemoval) return;
    if (!removalReason.trim()) {
      showToast('Sila isi ruangan ulasan / sebab pembuangan aksesori.', 'error');
      return;
    }

    const accId = selectedAccForRemoval.id;
    deleteInventoryItem(accId, removalReason.trim());
    setCart(prev => prev.filter(i => i.id !== accId));
    setSelectedAccForRemoval(null);
    setRemovalReason('');
  };

  // Manager: Request removal with comment (pending Super Admin)
  const handleConfirmManagerRequest = (e) => {
    if (e) e.preventDefault();
    if (!selectedAccForRemoval) return;
    if (!removalReason.trim()) {
      showToast('Sila isi ruangan ulasan / sebab pembuangan aksesori.', 'error');
      return;
    }

    requestRemoveInventoryItem(selectedAccForRemoval.id, removalReason.trim());
    setSelectedAccForRemoval(null);
    setRemovalReason('');
  };

  // Super Admin or Manager: Cancel / reject removal request
  const handleCancelRemovalRequest = () => {
    if (!selectedAccForRemoval) return;
    cancelRemoveInventoryItem(selectedAccForRemoval.id);
    setSelectedAccForRemoval(null);
    setRemovalReason('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      
      {/* Left 2 Cols: Accessories Grid */}
      <div className="lg:col-span-2 space-y-4">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-950 text-white p-5 sm:p-6 rounded-3xl border border-blue-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-cyan-300 border border-cyan-400/30 text-xs font-bold mb-1">
              <SmartphoneNfc className="w-3.5 h-3.5" />
              <span>JUALAN AKSESORI SMARTPHONE • PLANET SERVICE</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>TERMINAL POS AKSESORI SMARTPHONE</span>
            </h1>
            <p className="text-xs text-blue-200 mt-1 max-w-xl">
              Jualan casing, tempered glass, fast charger, power bank & kabel USB. Stok ditolak secara automatik dari inventori pusat.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {/* Search Input */}
            <div className="relative w-full sm:w-56">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari aksesori, SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900/80 border border-blue-400/30 rounded-xl outline-none font-medium text-white placeholder-slate-400 focus:border-cyan-400"
              />
            </div>

            {/* Manage Discount Button (Super Admin Only) */}
            {isSuperAdmin && (
              <button
                type="button"
                onClick={() => setIsDiscountModalOpen(true)}
                className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 transition cursor-pointer shrink-0"
                title="Tetapkan tawaran diskaun & jualan murah bagi semua item aksesori"
              >
                <Tag className="w-4 h-4 stroke-[2.5]" />
                <span>% Tawaran Diskaun {isDiscountActive ? `(${discountPercentage}%)` : '(Tutup)'}</span>
              </button>
            )}

            {/* Add Accessory Button (Super Admin & Manager only) */}
            {canManageAccessories && (
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="flex items-center justify-center gap-1.5 px-4 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition cursor-pointer shrink-0"
                title="Daftar item aksesori baharu dan tambah baki stok ke sistem"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>+ Tambah Aksesori</span>
              </button>
            )}
          </div>
        </div>

        {/* Super Admin Notice: Pending Removals Alert */}
        {pendingRemovalsCount > 0 && isSuperAdmin && (
          <div className="p-3.5 bg-amber-500/10 border border-amber-400/40 rounded-2xl flex items-center justify-between text-xs text-amber-200">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                Terdapat <strong className="text-amber-300 font-bold">{pendingRemovalsCount} item aksesori</strong> sedang menunggu ulasan dan kelulusan padam daripada anda (Super Admin).
              </span>
            </div>
            <span className="text-[10px] font-black bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">
              Tindakan Diperlukan
            </span>
          </div>
        )}

        {/* PROMINENT ACCESSORY DISCOUNT SALE BANNER */}
        {isDiscountActive && (
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500 via-rose-600 to-indigo-900 text-white shadow-xl border-2 border-amber-300 relative overflow-hidden animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-amber-200 text-[10px] font-black tracking-widest uppercase flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
                    <span>TAWARAN DISKAUN & JUALAN MURAH</span>
                  </span>
                  <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                    SEMUA AKSESORI SMARTPHONE
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-amber-300 tracking-tight drop-shadow-md">
                  {accessoryDiscount.title || 'TAWARAN DISKAUN & JUALAN MURAH HEBAT!'}
                </h2>
                <p className="text-xs text-amber-100 font-medium max-w-xl leading-relaxed">
                  {accessoryDiscount.description || 'Dapatkan aksesori smartphone berkualiti tinggi anda hari ini dengan harga promosi jimat berganda di TRIG GIATMARA Kangar.'}
                </p>
              </div>

              <div className="shrink-0 flex items-center sm:flex-col justify-end text-right bg-slate-950/40 backdrop-blur-md p-3.5 rounded-2xl border border-amber-300/40 min-w-[130px]">
                <div className="flex items-baseline justify-end gap-0.5">
                  <span className="text-3xl sm:text-4xl font-black text-amber-300 tracking-tighter drop-shadow-lg leading-none">
                    {discountPercentage}%
                  </span>
                </div>
                <span className="text-[10px] font-black text-white uppercase tracking-wider block mt-1">
                  POTONGAN HARGA
                </span>
                <span className="text-[9px] text-amber-200/80 font-semibold block">
                  Semua Item Terpilih
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Accessories Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAccessories.length === 0 ? (
            <div className="col-span-full bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500 text-xs">
              <Package className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p className="font-bold text-slate-700 text-sm">Tiada aksesori ditemui</p>
              <p className="text-[11px] mt-1">Cuba kata kunci lain atau gunakan butang "+ Tambah Aksesori" di atas.</p>
            </div>
          ) : (
            filteredAccessories.map(acc => {
              const isPending = acc.removalStatus === 'PENDING_APPROVAL';
              const effectivePrice = getDiscountedPrice(acc.sellingPrice);
              const hasItemDiscount = isDiscountActive && acc.sellingPrice > effectivePrice;

              return (
                <div
                  key={acc.id}
                  onClick={() => handleAddToCart(acc)}
                  className={`bg-white rounded-2xl border p-4 shadow-xs hover:shadow-md transition flex flex-col justify-between group relative cursor-pointer ${
                    isPending
                      ? 'border-amber-300 ring-2 ring-amber-300/60 bg-amber-50/20'
                      : hasItemDiscount
                      ? 'border-rose-200 hover:border-rose-400 ring-1 ring-rose-300/40'
                      : 'border-slate-200 hover:border-blue-400'
                  } ${acc.currentStock <= 0 ? 'opacity-60' : ''}`}
                >
                  <div>
                    {/* Top Bar: SKU, Stock, and Remove Button */}
                    <div className="flex justify-between items-start mb-2 gap-1.5">
                      <span className="text-[10px] font-mono text-slate-400 font-bold truncate max-w-[120px]" title={acc.sku}>
                        {acc.sku}
                      </span>
                      
                      <div className="flex items-center gap-1.5 shrink-0">
                        {hasItemDiscount && (
                          <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-rose-600 text-white animate-pulse">
                            -{discountPercentage}%
                          </span>
                        )}

                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                          acc.currentStock <= 0 ? 'bg-rose-100 text-rose-700' :
                          acc.currentStock <= acc.minStock ? 'bg-amber-100 text-amber-700' :
                          'bg-cyan-100 text-cyan-800'
                        }`}>
                          Stok: {acc.currentStock} {acc.unit}
                        </span>

                        {/* Trash Button (Manager & Super Admin only) */}
                        {canManageAccessories && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenRemovalModal(acc);
                            }}
                            className={`p-1 rounded-lg transition cursor-pointer shrink-0 ${
                              isPending
                                ? 'bg-amber-100 text-amber-800 hover:bg-amber-200 ring-1 ring-amber-400'
                                : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                            }`}
                            title={
                              isPending
                                ? `Menunggu Kelulusan Super Admin: ${acc.removalReason || 'Klik untuk tindakan'}`
                                : isSuperAdmin
                                ? 'Padam Aksesori Sepenuhnya (Super Admin)'
                                : 'Mohon Buang Aksesori (Manager)'
                            }
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Pending Removal Warning Alert Banner on Card */}
                    {isPending && (
                      <div className="mb-2 p-1.5 bg-amber-50 border border-amber-300 rounded-xl text-[10px] text-amber-900 leading-tight">
                        <div className="flex items-center gap-1 font-black">
                          <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                          <span>Menunggu Kelulusan Padam</span>
                        </div>
                        {acc.removalReason && (
                          <p className="line-clamp-1 italic text-amber-800 mt-0.5 text-[9px]">
                            "{acc.removalReason}"
                          </p>
                        )}
                      </div>
                    )}

                    <h4 className="font-bold text-xs text-slate-900 line-clamp-2 leading-snug">
                      {acc.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {acc.brand} • {acc.model}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Harga Jualan</span>
                      {hasItemDiscount ? (
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xs font-bold text-slate-400 line-through">
                            RM {acc.sellingPrice.toFixed(2)}
                          </span>
                          <span className="text-sm font-black text-rose-600 font-mono">
                            RM {effectivePrice.toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm font-black text-blue-700">RM {acc.sellingPrice.toFixed(2)}</span>
                      )}
                      {hasItemDiscount && (
                        <span className="text-[9px] font-bold text-emerald-600 block">
                          Jimat RM {(acc.sellingPrice - effectivePrice).toFixed(2)}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      disabled={acc.currentStock <= 0}
                      className={`p-1.5 rounded-lg transition ${
                        acc.currentStock <= 0
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : hasItemDiscount
                          ? 'bg-rose-50 text-rose-700 group-hover:bg-rose-600 group-hover:text-white cursor-pointer'
                          : 'bg-blue-50 text-blue-700 group-hover:bg-blue-600 group-hover:text-white cursor-pointer'
                      }`}
                      title="Tambah ke troli jualan"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  </div>

                </div>
              );
            })
          )}
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
                className="text-[11px] text-rose-500 hover:text-rose-700 font-semibold cursor-pointer"
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
                      type="button"
                      onClick={() => handleUpdateQty(item.id, -1)}
                      className="p-1 hover:bg-slate-100 rounded text-slate-900 font-black cursor-pointer"
                    >
                      <Minus className="w-3 h-3 stroke-[2.5]" />
                    </button>
                    <span className="font-black text-xs px-2 text-slate-950">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => handleUpdateQty(item.id, 1)}
                      className="p-1 hover:bg-slate-100 rounded text-slate-900 font-black cursor-pointer"
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
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex justify-between text-base font-black text-slate-950">
            <span>JUMLAH JUALAN:</span>
            <span className="text-blue-700">RM {grandTotal.toFixed(2)}</span>
          </div>

          <button
            type="button"
            onClick={handleOpenCheckout}
            disabled={cart.length === 0}
            className={`w-full py-3.5 rounded-2xl text-xs font-black text-white shadow-lg flex items-center justify-center gap-2 transition ${
              cart.length === 0
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/25 cursor-pointer'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>Terima Bayaran & Cetak Resit (ACC)</span>
          </button>
        </div>

      </div>

      {/* ================= MODAL 1: TAMBAH AKSESORI BAHARU ================= */}
      {isAddModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm overflow-hidden">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 border border-slate-200 text-xs animate-fade-in max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-50 text-cyan-700">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900">
                    Tambah Aksesori Baharu ke POS & Sistem Stok
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Kebenaran: <span className="font-bold text-blue-700">{currentUser?.role || 'Pengurus / Super Admin'}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-cyan-50/60 rounded-2xl border border-cyan-200/60 mb-4 text-[11px] text-cyan-950 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-cyan-900">
                <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                <span>Penyelarasan Stok Automatik:</span>
              </div>
              <p>
                Setiap penambahan aksesori di sini akan <strong>secara automatik didaftarkan ke inventori pusat</strong> dan baki kuantiti dimasukkan ke dalam rekod stok.
              </p>
            </div>

            <form onSubmit={handleSaveNewAccessory} className="space-y-4">
              
              <div>
                <label className="font-bold text-slate-700 block mb-1 text-[11px]">
                  Nama Aksesori *
                </label>
                <input
                  type="text"
                  required
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  placeholder="Cth: Baseus 65W Fast Charging USB-C to Type-C Cable"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1 text-[11px]">
                    Kod SKU / Barcode *
                  </label>
                  <input
                    type="text"
                    required
                    value={addForm.sku}
                    onChange={(e) => setAddForm({ ...addForm, sku: e.target.value.toUpperCase() })}
                    placeholder="Cth: ACC-CBL-65W"
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1 text-[11px]">
                    Jenama / Brand *
                  </label>
                  <input
                    type="text"
                    required
                    value={addForm.brand}
                    onChange={(e) => setAddForm({ ...addForm, brand: e.target.value })}
                    placeholder="Cth: Baseus / ProTech / Anker"
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1 text-[11px]">
                    Model / Keserasian
                  </label>
                  <input
                    type="text"
                    value={addForm.model}
                    onChange={(e) => setAddForm({ ...addForm, model: e.target.value })}
                    placeholder="Cth: Universal Type-C / iPhone 15"
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1 text-[11px]">
                    Unit Ukuran
                  </label>
                  <select
                    value={addForm.unit}
                    onChange={(e) => setAddForm({ ...addForm, unit: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-blue-600"
                  >
                    <option value="Unit">Unit</option>
                    <option value="Pcs">Pcs</option>
                    <option value="Set">Set</option>
                    <option value="Kotak">Kotak</option>
                    <option value="Pek">Pek</option>
                  </select>
                </div>
              </div>

              {/* Harga & Stok */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <span className="font-black text-[10px] text-slate-500 uppercase tracking-wider block">
                  Harga & Kuantiti Stok Awal
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1 text-[10px]">
                      Kuantiti Stok *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={addForm.currentStock}
                      onChange={(e) => setAddForm({ ...addForm, currentStock: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1 text-[10px]">
                      Had Min Stok
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={addForm.minStock}
                      onChange={(e) => setAddForm({ ...addForm, minStock: parseInt(e.target.value) || 1 })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1 text-[10px]">
                      Harga Kos (RM)
                    </label>
                    <input
                      type="number"
                      step="0.10"
                      min="0"
                      required
                      value={addForm.costPrice}
                      onChange={(e) => setAddForm({ ...addForm, costPrice: e.target.value })}
                      placeholder="0.00"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-blue-700 block mb-1 text-[10px]">
                      Harga Jual (RM) *
                    </label>
                    <input
                      type="number"
                      step="0.10"
                      min="0.10"
                      required
                      value={addForm.sellingPrice}
                      onChange={(e) => setAddForm({ ...addForm, sellingPrice: e.target.value })}
                      placeholder="0.00"
                      className="w-full px-3 py-2 bg-white border-2 border-blue-400 rounded-xl text-xs font-black text-blue-700 outline-none focus:border-blue-600"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1 text-[11px]">
                  Lokasi Simpanan di Bengkel / Kaunter
                </label>
                <input
                  type="text"
                  value={addForm.location}
                  onChange={(e) => setAddForm({ ...addForm, location: e.target.value })}
                  placeholder="Cth: Etalase Aksesori Hadapan Rak A"
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-600"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Daftar Aksesori & Tambah Stok</span>
                </button>
              </div>

            </form>

          </div>
        </div>,
        document.body
      )}

      {/* ================= MODAL 2: BUANG / PADAM AKSESORI (KOMEN & RBAC SUPER ADMIN) ================= */}
      {selectedAccForRemoval && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm overflow-hidden">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 text-xs animate-fade-in max-h-[90vh] overflow-y-auto space-y-4">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900">
                    {isSuperAdmin ? 'Padam Item Aksesori Sepenuhnya' : 'Permohonan Buang Item Aksesori'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    No. SKU: <span className="font-mono font-bold text-slate-800">{selectedAccForRemoval.sku}</span> • ID: {selectedAccForRemoval.id}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAccForRemoval(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Accessory Info Card */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 text-slate-700">
              <h4 className="font-black text-xs text-slate-900 leading-snug">
                {selectedAccForRemoval.name}
              </h4>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1">
                <span>Jenama: <strong className="text-slate-800">{selectedAccForRemoval.brand}</strong></span>
                <span>Baki Stok: <strong className="text-blue-700">{selectedAccForRemoval.currentStock} {selectedAccForRemoval.unit}</strong></span>
                <span>Harga Jualan: <strong className="text-emerald-700">RM {selectedAccForRemoval.sellingPrice.toFixed(2)}</strong></span>
              </div>
            </div>

            {/* Existing Pending Request Details (if any) */}
            {selectedAccForRemoval.removalStatus === 'PENDING_APPROVAL' && (
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-300 text-amber-900 space-y-1.5">
                <div className="flex items-center gap-1.5 font-black text-amber-950">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Permohonan Sedang Menunggu Kelulusan Super Admin</span>
                </div>
                <p className="text-[11px]">
                  Dimohon oleh: <strong>{selectedAccForRemoval.removalRequestedBy || 'Manager'}</strong>
                </p>
                <div className="p-2 bg-white/80 rounded-xl border border-amber-200 text-[11px] italic">
                  "{selectedAccForRemoval.removalReason}"
                </div>
              </div>
            )}

            {/* Mandatory Comment / Reason Textarea */}
            <div className="space-y-1.5">
              <label className="font-extrabold text-slate-900 block text-xs">
                Ruang Komen / Sebab Mengapa Aksesori Ini Ingin Dibuang *
              </label>
              <textarea
                rows="3"
                required
                value={removalReason}
                onChange={(e) => setRemovalReason(e.target.value)}
                placeholder="Nyatakan sebab kenapa aksesori ini ingin di-remove (cth: Stok rosak dalam simpanan, model lapuk tidak dikeluarkan lagi, silap daftar maklumat SKU, tamat waranti)..."
                className="w-full px-3.5 py-2.5 bg-white border-2 border-slate-300 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 outline-none focus:border-rose-500 resize-none"
              />

              {/* Quick Reason Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-slate-400 font-bold mr-1">Cadangan Sebab:</span>
                {[
                  'Stok rosak fizikal / defek',
                  'Model lapuk / tiada permintaan',
                  'Kesilapan pendaftaran SKU',
                  'Tamat tempoh waranti pembekal'
                ].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setRemovalReason(chip)}
                    className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold transition cursor-pointer"
                  >
                    + {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Role Notice & Authorization Rules */}
            {isSuperAdmin ? (
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-[11px] text-emerald-900 space-y-1">
                <div className="flex items-center gap-1.5 font-black text-emerald-950">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Kebenaran Super Admin (Kuasa Penuh)</span>
                </div>
                <p className="leading-tight">
                  Sebagai Super Admin, anda berkuasa mutlak untuk <strong>memadam aksesori ini sepenuhnya</strong> dari Terminal POS dan sistem Inventori Pusat berserta catatan ulasan di atas.
                </p>
              </div>
            ) : (
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-[11px] text-amber-900 space-y-1">
                <div className="flex items-center gap-1.5 font-black text-amber-950">
                  <Lock className="w-4 h-4 text-amber-600" />
                  <span>Akses Pengurus (Manager Smartphone Repair)</span>
                </div>
                <p className="leading-tight">
                  Ulasan komen anda akan dihantar sebagai permohonan pembuangan item. <strong>Hanya Super Admin sahaja dapat remove sepenuhnya aksesori ini</strong> daripada pangkalan sistem.
                </p>
              </div>
            )}

            {/* Action Buttons based on Role */}
            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedAccForRemoval(null)}
                className="w-full sm:w-auto px-4 py-2.5 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                Batal
              </button>

              {/* Reject / Cancel pending removal button (Super Admin only, if item is pending) */}
              {isSuperAdmin && selectedAccForRemoval.removalStatus === 'PENDING_APPROVAL' && (
                <button
                  type="button"
                  onClick={handleCancelRemovalRequest}
                  className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer"
                  title="Batalkan status permohonan padam dan kekalkan aksesori"
                >
                  Tolak Permohonan
                </button>
              )}

              {/* Action Submit Button */}
              {isSuperAdmin ? (
                <button
                  type="button"
                  disabled={!removalReason.trim()}
                  onClick={handleConfirmSuperAdminDelete}
                  className={`w-full sm:flex-1 py-2.5 text-white font-black rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    !removalReason.trim()
                      ? 'bg-rose-300 cursor-not-allowed'
                      : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Padam Aksesori Sepenuhnya (Super Admin)</span>
                </button>
              ) : (
                <button
                  type="button"
                  disabled={!removalReason.trim()}
                  onClick={handleConfirmManagerRequest}
                  className={`w-full sm:flex-1 py-2.5 text-white font-black rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    !removalReason.trim()
                      ? 'bg-amber-300 cursor-not-allowed'
                      : 'bg-amber-600 hover:bg-amber-700'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span>Hantar Permohonan Buang (Kepada Super Admin)</span>
                </button>
              )}
            </div>

          </div>
        </div>,
        document.body
      )}

      {/* ================= MODAL 3: BAYARAN JUALAN POS AKSESORI ================= */}
      {isPaymentModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-hidden">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 border border-slate-200 animate-fade-in text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-black text-base text-slate-900">Bayaran Jualan Aksesori</h3>
              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 mb-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('QR_PAYMENT')}
                className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 font-bold cursor-pointer ${
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
                className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 font-bold cursor-pointer ${
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
                type="button"
                onClick={handleCompleteSale}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition cursor-pointer"
              >
                Sahkan Bayaran & Tolak Stok
              </button>
              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(false)}
                className="w-full py-2 text-slate-500 hover:bg-slate-100 font-semibold rounded-xl cursor-pointer"
              >
                Batal
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

      {/* ================= MODAL 4: TETAPAN TAWARAN DISKAUN & JUALAN MURAH (SUPER ADMIN ONLY) ================= */}
      {isDiscountModalOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fade-in overflow-hidden">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-slate-200 text-xs max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-gradient-to-br from-amber-500 to-rose-600 text-white rounded-2xl shadow-md">
                  <Tag className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900">
                    Tetapan Tawaran Diskaun & Jualan Murah
                  </h3>
                  <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">
                    Kuasa Mutlak Super Admin
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDiscountModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const pct = Number(discountForm.percentage) || 0;
                if (discountForm.isActive && (pct <= 0 || pct > 99)) {
                  showToast('Sila masukkan peratus diskaun antara 1% hingga 99%.', 'error');
                  return;
                }
                updateAccessoryDiscount(discountForm);
                setIsDiscountModalOpen(false);
              }}
              className="space-y-4"
            >
              {/* Status Toggle Switch */}
              <div className="p-3.5 rounded-2xl border-2 flex items-center justify-between bg-slate-50 transition border-slate-200">
                <div>
                  <span className="font-black text-slate-900 block text-xs">
                    Status Tawaran Diskaun
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {discountForm.isActive
                      ? 'Promosi sedang AKTIF pada semua aksesori'
                      : 'Promosi sedang DINYAHAKTIFKAN'}
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={discountForm.isActive}
                    onChange={(e) => setDiscountForm({ ...discountForm, isActive: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* Peratus Diskaun */}
              <div>
                <label className="font-extrabold text-slate-900 block mb-1 text-xs">
                  Peratus Diskaun Diberikan (%) *
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      min="1"
                      max="99"
                      required={discountForm.isActive}
                      value={discountForm.percentage}
                      onChange={(e) => setDiscountForm({ ...discountForm, percentage: Math.max(0, Math.min(99, Number(e.target.value))) })}
                      placeholder="10"
                      className="w-full pl-3 pr-8 py-2 bg-white border-2 border-slate-300 rounded-xl font-black text-slate-950 text-base outline-none focus:border-amber-500"
                    />
                    <Percent className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                {/* Quick Selection Chips */}
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  {[5, 10, 15, 20, 25, 30, 50].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => setDiscountForm({ ...discountForm, percentage: rate })}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition cursor-pointer ${
                        Number(discountForm.percentage) === rate
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {rate}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Tajuk Tawaran Diskaun */}
              <div>
                <label className="font-extrabold text-slate-900 block mb-1 text-xs">
                  Tajuk Tawaran Promosi Diskaun *
                </label>
                <input
                  type="text"
                  required
                  value={discountForm.title}
                  onChange={(e) => setDiscountForm({ ...discountForm, title: e.target.value })}
                  placeholder="Contoh: PROMOSI JUALAN MURAH MEGA GIATMARA"
                  className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-xl font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:border-amber-500"
                />
              </div>

              {/* Teks Tawaran & Ulasan Jualan Murah */}
              <div>
                <label className="font-extrabold text-slate-900 block mb-1 text-xs">
                  Teks Tawaran & Penerangan Promosi (Untuk Pelanggan & Staf) *
                </label>
                <textarea
                  required
                  rows={3}
                  value={discountForm.description}
                  onChange={(e) => setDiscountForm({ ...discountForm, description: e.target.value })}
                  placeholder="Contoh: Dapatkan aksesori smartphone berkualiti tinggi sempena promosi bengkel dengan diskaun hebat untuk semua casing, tempered glass dan charger..."
                  className="w-full px-3 py-2.5 bg-white border-2 border-slate-300 rounded-xl font-medium text-slate-900 placeholder:text-slate-400 outline-none focus:border-amber-500 leading-relaxed"
                />
                <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                  <Info className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>
                    Teks dan peratus diskaun ini akan dipaparkan serta-merta di paparan POS Terminal dan di Tab Aksesori Portal Pelanggan.
                  </span>
                </p>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsDiscountModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-black text-white bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 rounded-xl shadow-lg shadow-amber-500/25 transition cursor-pointer flex items-center gap-1.5"
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>Simpan & Kuatkuasakan Tawaran</span>
                </button>
              </div>

            </form>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
};
