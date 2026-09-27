import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  X,
  Smartphone,
  Coffee,
  User,
  Package,
  Truck,
  ArrowRight,
  Receipt
} from 'lucide-react';

export const GlobalSearchModal = () => {
  const {
    isGlobalSearchOpen,
    setIsGlobalSearchOpen,
    foodOrders,
    repairJobs,
    customers,
    inventory,
    suppliers,
    sales,
    setCurrentTab,
    openReceipt
  } = useApp();

  const [query, setQuery] = useState('');

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsGlobalSearchOpen(prev => !prev);
      } else if (e.key === 'Escape' && isGlobalSearchOpen) {
        setIsGlobalSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGlobalSearchOpen, setIsGlobalSearchOpen]);

  if (!isGlobalSearchOpen) return null;

  const q = query.trim().toLowerCase();

  const matchedOrders = q
    ? foodOrders.filter(
        o =>
          o.id.toLowerCase().includes(q) ||
          o.receiptNo.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          (o.customerPhone && o.customerPhone.includes(q)) ||
          (o.tableId && o.tableId.toLowerCase().includes(q))
      )
    : [];

  const matchedRepairs = q
    ? repairJobs.filter(
        j =>
          j.id.toLowerCase().includes(q) ||
          j.customerName.toLowerCase().includes(q) ||
          (j.customerPhone && j.customerPhone.includes(q)) ||
          j.deviceBrand.toLowerCase().includes(q) ||
          j.deviceModel.toLowerCase().includes(q) ||
          (j.imeiSerial && j.imeiSerial.includes(q))
      )
    : [];

  const matchedCustomers = q
    ? customers.filter(
        c =>
          c.name.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          c.id.toLowerCase().includes(q)
      )
    : [];

  const matchedInventory = q
    ? inventory.filter(
        i =>
          i.name.toLowerCase().includes(q) ||
          i.sku.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q)
      )
    : [];

  const matchedSuppliers = q
    ? suppliers.filter(
        s =>
          s.name.toLowerCase().includes(q) ||
          s.contactPerson.toLowerCase().includes(q) ||
          s.phone.includes(q)
      )
    : [];

  const hasResults =
    matchedOrders.length > 0 ||
    matchedRepairs.length > 0 ||
    matchedCustomers.length > 0 ||
    matchedInventory.length > 0 ||
    matchedSuppliers.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[80vh] animate-fade-in">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari pesanan makanan, job baiki (REP-), no. telefon, pelanggan, SKU, pembekal..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent border-none outline-none text-sm sm:text-base font-medium text-slate-800 placeholder:text-slate-400"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsGlobalSearchOpen(false)}
            className="px-2.5 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-200 rounded-lg transition"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-4 space-y-4">
          {!query ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              <Search className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="font-semibold text-slate-600">Pusat Carian Pantas TRIG GIATMARA</p>
              <p className="mt-1 text-slate-400">
                Taip nama pelanggan, ID resit, model telefon, atau perkataan kunci untuk mencari.
              </p>
            </div>
          ) : !hasResults ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              Tiada rekod sepadan dengan carian "{query}".
            </div>
          ) : (
            <>
              {/* Food Orders Results */}
              {matchedOrders.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Coffee className="w-3.5 h-3.5 text-emerald-500" />
                    Pesanan Café ({matchedOrders.length})
                  </p>
                  <div className="space-y-1.5">
                    {matchedOrders.map(o => (
                      <div
                        key={o.id}
                        className="p-2.5 bg-slate-50 hover:bg-emerald-50/60 rounded-xl border border-slate-200 transition flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900">{o.id}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-700">
                              {o.orderType === 'DINE_IN' ? `Meja ${o.tableId}` : 'Takeaway'}
                            </span>
                            <span className="text-xs text-slate-600 font-medium">{o.customerName}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {o.items.map(i => `${i.quantity}x ${i.name}`).join(', ')} • RM {o.grandTotal.toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              openReceipt(o);
                              setIsGlobalSearchOpen(false);
                            }}
                            className="p-1.5 text-xs text-indigo-600 hover:bg-indigo-50 rounded-lg"
                            title="Buka Resit"
                          >
                            <Receipt className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setCurrentTab('food-orders');
                              setIsGlobalSearchOpen(false);
                            }}
                            className="p-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Repair Jobs Results */}
              {matchedRepairs.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-blue-500" />
                    Job Baiki Smartphone ({matchedRepairs.length})
                  </p>
                  <div className="space-y-1.5">
                    {matchedRepairs.map(j => (
                      <div
                        key={j.id}
                        className="p-2.5 bg-slate-50 hover:bg-blue-50/60 rounded-xl border border-slate-200 transition flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-blue-700">{j.id}</span>
                            <span className="text-xs font-semibold text-slate-900">
                              {j.deviceBrand} {j.deviceModel}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-100 text-blue-800">
                              {j.repairStatus}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Pelanggan: {j.customerName} ({j.customerPhone}) • {j.damageType}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setCurrentTab('repair-jobs');
                            setIsGlobalSearchOpen(false);
                          }}
                          className="p-1.5 text-xs text-blue-600 hover:bg-blue-100 rounded-lg"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Customers Results */}
              {matchedCustomers.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-purple-500" />
                    Pelanggan ({matchedCustomers.length})
                  </p>
                  <div className="space-y-1.5">
                    {matchedCustomers.map(c => (
                      <div
                        key={c.id}
                        onClick={() => {
                          setCurrentTab('customers');
                          setIsGlobalSearchOpen(false);
                        }}
                        className="p-2.5 bg-slate-50 hover:bg-purple-50/60 rounded-xl border border-slate-200 cursor-pointer transition flex items-center justify-between"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-900">{c.name} ({c.id})</p>
                          <p className="text-[11px] text-slate-500">{c.phone} • {c.email || 'Tiada e-mel'}</p>
                        </div>
                        <span className="text-xs font-semibold text-purple-600">Lihat Profil &rarr;</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Inventory Results */}
              {matchedInventory.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-amber-500" />
                    Inventori & Alat Ganti ({matchedInventory.length})
                  </p>
                  <div className="space-y-1.5">
                    {matchedInventory.map(i => (
                      <div
                        key={i.id}
                        onClick={() => {
                          setCurrentTab('inventory');
                          setIsGlobalSearchOpen(false);
                        }}
                        className="p-2.5 bg-slate-50 hover:bg-amber-50/60 rounded-xl border border-slate-200 cursor-pointer transition flex items-center justify-between"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-900">{i.name}</p>
                          <p className="text-[11px] text-slate-500">
                            SKU: {i.sku} • Stok Semasa: <span className="font-bold text-slate-800">{i.currentStock} {i.unit}</span> (Min: {i.minStock})
                          </p>
                        </div>
                        <span className="text-xs font-bold text-indigo-700">RM {i.costPrice.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suppliers Results */}
              {matchedSuppliers.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-cyan-500" />
                    Pembekal ({matchedSuppliers.length})
                  </p>
                  <div className="space-y-1.5">
                    {matchedSuppliers.map(s => (
                      <div
                        key={s.id}
                        onClick={() => {
                          setCurrentTab('suppliers');
                          setIsGlobalSearchOpen(false);
                        }}
                        className="p-2.5 bg-slate-50 hover:bg-cyan-50/60 rounded-xl border border-slate-200 cursor-pointer transition flex items-center justify-between"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-900">{s.name}</p>
                          <p className="text-[11px] text-slate-500">PIC: {s.contactPerson} • {s.phone}</p>
                        </div>
                        <span className="text-xs text-cyan-700 font-semibold">&rarr;</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
};
