import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ChefHat,
  Clock,
  CheckCircle2,
  UtensilsCrossed,
  MapPin,
  ShoppingBag,
  Flame,
  Check,
  BellRing,
  Volume2,
  Filter
} from 'lucide-react';

export const KitchenDisplay = () => {
  const { foodOrders, updateFoodOrderStatus, showToast } = useApp();
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Filter orders
  const kitchenOrders = foodOrders.filter(o => {
    if (filterStatus === 'ALL') return o.orderStatus !== 'CANCELLED';
    return o.orderStatus === filterStatus;
  });

  const handlePlayChime = () => {
    showToast('🔔 Chime dapur dibunyikan!', 'info');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'NEW':
        return 'border-rose-400 bg-rose-50/70 text-rose-900';
      case 'CONFIRMED':
      case 'PREPARING':
        return 'border-amber-400 bg-amber-50/70 text-amber-900';
      case 'READY':
        return 'border-emerald-400 bg-emerald-50/70 text-emerald-900';
      case 'COMPLETED':
        return 'border-slate-300 bg-slate-50 text-slate-600';
      default:
        return 'border-slate-300 bg-white text-slate-700';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-1 uppercase tracking-wider">
            <ChefHat className="w-4 h-4" />
            <span>KITCHEN ORDER DISPLAY (KDS)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black">
            PAPARAN PESANAN DAPUR CAFÉ
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Paparan masa nyata pesanan makanan dan minuman untuk pelatih kursus masakan dan staf dapur.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePlayChime}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 transition"
          >
            <Volume2 className="w-4 h-4 text-amber-400" />
            <span>Uji Loceng Dapur</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-2 bg-white rounded-2xl border border-slate-200 shadow-xs">
        {['ALL', 'NEW', 'PREPARING', 'READY', 'COMPLETED'].map(status => {
          const count = foodOrders.filter(o => status === 'ALL' ? o.orderStatus !== 'CANCELLED' : o.orderStatus === status).length;
          return (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                filterStatus === status
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{status === 'ALL' ? 'Semua Pesanan' : status}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                filterStatus === status ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Orders Grid */}
      {kitchenOrders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
          <ChefHat className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p className="font-bold text-slate-700 text-sm">Tiada Pesanan Aktif di Dapur</p>
          <p className="text-slate-400 mt-1">Semua pesanan makanan telah selesai atau belum diterima.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {kitchenOrders.map(order => {
            const isDineIn = order.orderType === 'DINE_IN';
            const cardBg = getStatusColor(order.orderStatus);

            return (
              <div
                key={order.id}
                className={`rounded-3xl border-2 p-5 flex flex-col justify-between shadow-xs transition-all ${cardBg}`}
              >
                <div>
                  {/* Order Card Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                    <div>
                      <span className="text-base font-black tracking-tight text-slate-950">
                        {order.id}
                      </span>
                      <div className="text-[11px] text-slate-500 font-semibold flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>Masa Pesan: {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      order.orderStatus === 'NEW' ? 'bg-rose-500 text-white animate-pulse' :
                      order.orderStatus === 'PREPARING' ? 'bg-amber-500 text-white' :
                      order.orderStatus === 'READY' ? 'bg-emerald-500 text-white' :
                      'bg-slate-300 text-slate-800'
                    }`}>
                      {order.orderStatus}
                    </span>
                  </div>

                  {/* Destination Highlight: TABLE or TAKEAWAY */}
                  <div className="my-3 p-3 rounded-2xl bg-white/90 border border-slate-200 shadow-2xs">
                    {isDineIn ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-indigo-600" />
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">HANTAR KE MEJA:</span>
                            <p className="font-black text-base text-indigo-900 leading-tight">
                              TABLE {order.tableId}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-slate-600">{order.customerName}</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="w-5 h-5 text-emerald-600" />
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">PESANAN BUNGKUS:</span>
                            <p className="font-black text-sm text-emerald-900 leading-tight">
                              {order.customerName}
                            </p>
                          </div>
                        </div>
                        <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                          Ambil: {order.pickupTime || 'Segera'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Items Ticket */}
                  <div className="space-y-2 py-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      SENARAI HIDANGAN DAPUR:
                    </p>
                    <div className="space-y-1.5">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 bg-white/80 rounded-xl border border-slate-200 flex items-start justify-between text-xs"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-lg bg-slate-900 text-white font-black text-xs flex items-center justify-center">
                                {item.quantity}×
                              </span>
                              <span className="font-bold text-slate-900 text-sm">{item.name}</span>
                            </div>
                            {item.notes && (
                              <p className="text-[11px] text-rose-600 font-bold italic mt-1 ml-8">
                                ⚠ Nota: "{item.notes}"
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Status Advancement Action Buttons */}
                <div className="pt-4 mt-3 border-t border-slate-200/80 space-y-2">
                  {order.orderStatus === 'NEW' && (
                    <button
                      onClick={() => updateFoodOrderStatus(order.id, 'PREPARING')}
                      className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-2"
                    >
                      <Flame className="w-4 h-4" />
                      <span>TERIMA & MULA MASAK (PREPARING)</span>
                    </button>
                  )}

                  {order.orderStatus === 'PREPARING' && (
                    <button
                      onClick={() => updateFoodOrderStatus(order.id, 'READY')}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>SIAP DIMASAK (READY TO SERVE)</span>
                    </button>
                  )}

                  {order.orderStatus === 'READY' && (
                    <button
                      onClick={() => updateFoodOrderStatus(order.id, 'COMPLETED')}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>SELESAI DIHANTAR (COMPLETED)</span>
                    </button>
                  )}

                  {order.orderStatus === 'COMPLETED' && (
                    <div className="text-center py-1 text-[11px] font-bold text-slate-500">
                      Pesanan telah selesai & dihidangkan.
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
