import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import giatmaraLogo from '../assets/logo.png';
import {
  Search,
  Bell,
  User,
  QrCode,
  LogOut,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  UtensilsCrossed,
  Smartphone,
  ShieldCheck,
  RefreshCw,
  Menu as MenuIcon,
  LayoutDashboard,
  Layers,
  Flame,
  Cpu
} from 'lucide-react';

export const Navbar = ({ onToggleSidebar }) => {
  const {
    currentUser,
    users,
    switchUser,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    currentTab,
    setCurrentTab,
    activeSystemMode,
    switchSystemMode,
    setSelectedTableForCustomer,
    tables,
    setIsGlobalSearchOpen,
    resetDemoData,
    isStaffLoggedIn,
    logoutStaff
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isQrSimOpen, setIsQrSimOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleSimulateScan = (tableId) => {
    setSelectedTableForCustomer(tableId);
    setCurrentTab('customer-order');
    setIsQrSimOpen(false);
  };

  // Theming classes based on activeSystemMode
  const navbarStyle = 
    activeSystemMode === 'PORTAL'
      ? 'bg-slate-950/95 border-b border-slate-800 text-white shadow-xl'
      : activeSystemMode === 'MASAKAN'
      ? 'bg-slate-950/95 border-b border-amber-500/30 text-white shadow-xl'
      : activeSystemMode === 'REPAIR'
      ? 'bg-[#0a1e3b]/95 border-b border-cyan-500/30 text-white shadow-xl'
      : 'bg-white/95 border-b border-slate-200/80 text-slate-900 shadow-xs';

  return (
    <header className={`sticky top-0 z-30 backdrop-blur-md transition-all duration-300 ${navbarStyle}`}>
      <div className="px-4 sm:px-6 lg:px-8 flex items-center justify-between min-h-16 sm:min-h-20 py-2">
        
        {/* Left: Sidebar Toggle & Brand Title */}
        <div className="flex items-center gap-3">
          {isStaffLoggedIn && activeSystemMode !== 'PORTAL' && (
            <button
              onClick={onToggleSidebar}
              className={`p-2 -ml-2 rounded-xl lg:hidden transition ${
                activeSystemMode !== 'MANAGEMENT'
                  ? 'text-slate-300 hover:text-white hover:bg-white/10'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              aria-label="Toggle navigation"
            >
              <MenuIcon className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={() => isStaffLoggedIn ? switchSystemMode('PORTAL') : switchSystemMode('MAIN')}
              className="bg-white p-1.5 rounded-2xl shadow-md inline-flex items-center justify-center hover:scale-105 transition shrink-0"
              title={isStaffLoggedIn ? "Platform Staf Utama" : "Menu Paling Utama"}
            >
              <img
                src={giatmaraLogo}
                alt="GIATMARA Malaysia"
                className="h-10 sm:h-12 w-auto object-contain"
                onError={(e) => { e.currentTarget.src = './logo.png'; }}
              />
            </button>
            <div className="border-l border-slate-700/40 pl-3">
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-2">
                  <span className={`font-black text-xs sm:text-sm tracking-tight leading-tight uppercase ${
                    activeSystemMode !== 'MANAGEMENT' ? 'text-amber-400' : 'text-amber-600'
                  }`}>
                    TECHBYTE & PASTA CAFE
                  </span>
                  
                  {/* Active Module Indicator Badge (Staff vs Customer) */}
                  {!isStaffLoggedIn ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-black rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      PELANGGAN
                    </span>
                  ) : (
                    <>
                      {activeSystemMode === 'MAIN' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-black rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          MENU UTAMA
                        </span>
                      )}

                      {activeSystemMode === 'PORTAL' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-black rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          PLATFORM UTAMA
                        </span>
                      )}

                      {activeSystemMode === 'MASAKAN' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-black rounded-full bg-amber-500 text-slate-950 shadow-sm animate-fade-in">
                          <Flame className="w-3 h-3" /> MASAKAN
                        </span>
                      )}

                      {activeSystemMode === 'REPAIR' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-black rounded-full bg-cyan-400 text-slate-950 shadow-sm animate-fade-in">
                          <Cpu className="w-3 h-3" /> BAIKI SMARTPHONE
                        </span>
                      )}

                      {activeSystemMode === 'MANAGEMENT' && (
                        <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                          HUB PENGURUSAN
                        </span>
                      )}
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-0.5">
                  <button
                    onClick={() => switchSystemMode('MAIN')}
                    className={`font-extrabold text-[11px] sm:text-xs tracking-tight leading-none text-left hover:underline ${
                      activeSystemMode !== 'MANAGEMENT' ? 'text-white' : 'text-slate-900'
                    }`}
                    title="Klik untuk ke Menu Paling Utama TechByte & Pasta Cafe"
                  >
                    TRIG GIATMARA KANGAR
                  </button>
                </div>
              </div>
              <p className={`text-[10px] hidden md:block mt-0.5 ${
                activeSystemMode !== 'MANAGEMENT' ? 'text-slate-400' : 'text-slate-500'
              }`}>
                {!isStaffLoggedIn ? 'Pusat Keusahawanan Digital & Latihan GIATMARA • Portal Pelanggan' :
                 activeSystemMode === 'MAIN' ? 'Pusat Keusahawanan Digital & Latihan GIATMARA' :
                 activeSystemMode === 'PORTAL' ? 'Pilih Sistem Operasi Kursus GIATMARA' :
                 activeSystemMode === 'MASAKAN' ? 'Sistem Operasi Café & Pengurusan Makanan (TastyBites Theme)' :
                 activeSystemMode === 'REPAIR' ? 'Sistem Perkhidmatan Baiki Telefon & Alat Ganti (Tech Blue Theme)' :
                 'Digital Business Management System • GIATMARA Kangar'}
              </p>
            </div>
          </div>
        </div>

        {/* Center: Navigation Buttons */}
        <div className="hidden sm:flex items-center gap-2">
          {activeSystemMode !== 'MAIN' && (
            <button
              onClick={() => switchSystemMode('MAIN')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition duration-200 hover:scale-[1.02]"
              title="Ke Menu Paling Utama TechByte & Pasta Cafe"
            >
              <span>🍽️📱</span>
              <span>Menu Utama</span>
            </button>
          )}

          {/* Quick Android Apps Buttons - Menyesuaikan mengikut ruangan (Ruangan Baiki vs Ruangan Masakan) */}
          {activeSystemMode === 'REPAIR' || currentTab === 'customer-repair-tracker' || currentTab === 'customer-repair-phone-app' ? (
            <button
              onClick={() => setCurrentTab('customer-repair-phone-app')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-black transition hover:scale-102 cursor-pointer shadow-xs"
              title="Buka Aplikasi Pelanggan Baiki Telefon Bimbit (Android Phone)"
            >
              <span>📱</span>
              <span className="hidden md:inline">Apps Baiki Telefon Bimbit</span>
            </button>
          ) : activeSystemMode === 'MASAKAN' || currentTab === 'customer-order' || currentTab === 'customer-phone-app' ? (
            <button
              onClick={() => setCurrentTab('customer-phone-app')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-black transition hover:scale-102 cursor-pointer"
              title="Buka Aplikasi Pelanggan Makanan Café (Android Phone)"
            >
              <span>🍝</span>
              <span className="hidden md:inline">Apps Pelanggan Café</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => setCurrentTab('customer-phone-app')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-black transition hover:scale-102 cursor-pointer"
                title="Buka Aplikasi Pelanggan Makanan Café (Android Phone)"
              >
                <span>🍝</span>
                <span className="hidden md:inline">Apps Pelanggan Café</span>
              </button>
              <button
                onClick={() => setCurrentTab('customer-repair-phone-app')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-black transition hover:scale-102 cursor-pointer shadow-xs"
                title="Buka Aplikasi Pelanggan Baiki Telefon Bimbit (Android Phone)"
              >
                <span>📱</span>
                <span className="hidden md:inline">Apps Baiki Telefon</span>
              </button>
            </>
          )}

          {/* Ikon Apps Tab Pelayan HANYA KELUAR jika pengguna memilih ADMIN - CUSTOMER SERVICES atau SUPER ADMIN */}
          {isStaffLoggedIn && (currentUser?.role === 'CUSTOMER SERVICE' || currentUser?.role === 'SUPER ADMIN') && (
            <button
              onClick={() => setCurrentTab('waiter-tablet-app')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 text-xs font-black transition hover:scale-102 cursor-pointer"
              title="Buka Aplikasi Pelayan (Android Tab)"
            >
              <span>📟</span>
              <span className="hidden md:inline">Apps Tab Pelayan</span>
            </button>
          )}

          {/* HANYA PAPARKAN PLATFORM STAF DI RUANGAN TENGAH ATAS JIKA ADMIN / STAF TELAH LOGIN (Bukan Customer Service) */}
          {isStaffLoggedIn && activeSystemMode !== 'PORTAL' && currentUser?.role !== 'CUSTOMER SERVICE' && (
            <button
              onClick={() => switchSystemMode('PORTAL')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-slate-800 via-slate-900 to-indigo-950 hover:from-slate-700 hover:to-indigo-900 text-white border border-white/20 shadow-md text-xs font-bold transition duration-200 hover:scale-[1.02] cursor-pointer"
              title="Platform Pengurusan Staf & Operasi"
            >
              <span className="text-sm">🏠</span>
              <span>Platform Staf</span>
            </button>
          )}
        </div>

        {/* Right: Actions, Search, Notifications, User Switcher (HANYA UNTUK ADMIN / STAF LOGGED IN) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isStaffLoggedIn ? (
            <>
              {/* Quick Table QR Simulator Button (Cafe) */}
              {activeSystemMode === 'MASAKAN' && (
                <div className="relative">
                  <button
                    onClick={() => setIsQrSimOpen(!isQrSimOpen)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-black text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-xl transition shadow-md shadow-amber-500/20"
                    title="Simulasi imbasan QR code meja café oleh pelanggan"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Simulasi QR Meja</span>
                  </button>

                  {isQrSimOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-slate-900 text-white rounded-2xl shadow-2xl border border-amber-500/30 p-3 z-50 animate-fade-in">
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                        <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                          <UtensilsCrossed className="w-3.5 h-3.5" />
                          Pilih Meja Café (QR)
                        </span>
                        <span className="text-[10px] text-slate-400">Scan Simulator</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto">
                        {tables.map(t => (
                          <button
                            key={t.id}
                            onClick={() => handleSimulateScan(t.id)}
                            className="flex items-center justify-between p-2 text-left rounded-lg text-xs bg-slate-950 hover:bg-amber-500/20 hover:text-amber-300 border border-slate-800 transition"
                          >
                            <span className="font-bold">{t.id}</span>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                              t.status === 'AVAILABLE' ? 'bg-emerald-500/20 text-emerald-400' :
                              t.status === 'OCCUPIED' ? 'bg-rose-500/20 text-rose-400' :
                              'bg-amber-500/20 text-amber-400'
                            }`}>
                              {t.status === 'AVAILABLE' ? 'Kosong' : 'Diguna'}
                            </span>
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => {
                          setSelectedTableForCustomer(null);
                          setCurrentTab('customer-order');
                          setIsQrSimOpen(false);
                        }}
                        className="w-full mt-2 py-1.5 text-center text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition"
                      >
                        Order Bungkus (Takeaway)
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Quick New Repair Shortcut (Repair Mode) */}
              {activeSystemMode === 'REPAIR' && (
                <button
                  onClick={() => setCurrentTab('repair-jobs')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition shadow-md shadow-cyan-400/20"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Job Baiki Baru</span>
                </button>
              )}

              {/* Global Search Button */}
              <button
                onClick={() => setIsGlobalSearchOpen(true)}
                className={`p-2 rounded-xl transition ${
                  activeSystemMode !== 'MANAGEMENT'
                    ? 'text-slate-300 hover:text-white hover:bg-white/10'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title="Cari rekod (Ctrl + K)"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Notifications Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className={`relative p-2 rounded-xl transition ${
                    activeSystemMode !== 'MANAGEMENT'
                      ? 'text-slate-300 hover:text-white hover:bg-white/10'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                  aria-label="Notifikasi"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white font-bold text-[9px] rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {isNotifOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 animate-fade-in">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900">Pemberitahuan Sistem</span>
                        {unreadCount > 0 && (
                          <span className="px-1.5 py-0.5 text-[10px] font-bold bg-rose-100 text-rose-700 rounded-full">
                            {unreadCount} Baru
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllNotificationsRead}
                          className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                          Tanda Semua Dibaca
                        </button>
                      )}
                    </div>

                    <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                      {notifications.length === 0 ? (
                        <div className="text-center py-6 text-slate-400 text-xs">
                          Tiada notifikasi baru.
                        </div>
                      ) : (
                        notifications.map(n => (
                          <div
                            key={n.id}
                            onClick={() => {
                              markNotificationRead(n.id);
                              if (n.link) setCurrentTab(n.link);
                              setIsNotifOpen(false);
                            }}
                            className={`p-2.5 rounded-xl border text-xs cursor-pointer transition flex items-start gap-2.5 ${
                              n.isRead
                                ? 'bg-slate-50/60 border-slate-100 text-slate-600'
                                : 'bg-indigo-50/40 border-indigo-100 text-slate-900 font-medium'
                            }`}
                          >
                            <div className="mt-0.5">
                              {n.type === 'STOCK' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                              {n.type === 'ORDER' && <UtensilsCrossed className="w-4 h-4 text-emerald-500" />}
                              {n.type === 'REPAIR' && <Smartphone className="w-4 h-4 text-blue-500" />}
                              {n.type === 'APPROVAL' && <ShieldCheck className="w-4 h-4 text-purple-500" />}
                              {!['STOCK', 'ORDER', 'REPAIR', 'APPROVAL'].includes(n.type) && <Sparkles className="w-4 h-4 text-slate-400" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold leading-tight">{n.title}</p>
                              <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{n.message}</p>
                              <span className="text-[9px] text-slate-400 mt-1 block">
                                {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Ikon Pemilihan Admin (User Profile & Account Switcher Dropdown) */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`flex items-center gap-2 p-1.5 rounded-xl transition border ${
                    activeSystemMode !== 'MANAGEMENT'
                      ? 'hover:bg-white/10 border-transparent text-white'
                      : 'hover:bg-slate-100 border-transparent text-slate-800'
                  }`}
                  title="Pilihan Akaun Admin & Staf"
                >
                  <img
                    src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                    alt={currentUser?.name}
                    className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-300"
                  />
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-bold leading-none">
                      {currentUser?.name?.split(' ')[0]} {currentUser?.name?.split(' ')[1] || ''}
                    </p>
                    <span className="text-[10px] opacity-80">
                      {currentUser?.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60 hidden lg:block" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 p-3.5 z-50 animate-fade-in max-h-[85vh] overflow-y-auto">
                    
                    <div className="pb-2.5 mb-2.5 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{currentUser?.name}</p>
                      <p className="text-[11px] text-slate-500 font-medium">{currentUser?.email}</p>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          Peranan: {currentUser?.role}
                        </span>
                      </div>
                    </div>

                    <div className="mb-2">
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                        TUKAR AKAUN DEMO (FAST SWITCH)
                      </p>
                      <div className="space-y-1.5">
                        {users.filter(u => u.role !== 'CUSTOMER').map(u => (
                          <button
                            key={u.id}
                            onClick={() => {
                              switchUser(u.username || u.role);
                              setIsUserMenuOpen(false);
                            }}
                            className={`w-full flex items-center justify-between p-2 rounded-xl text-xs text-left transition gap-2 ${
                              currentUser?.id === u.id
                                ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-100 shadow-xs'
                                : 'hover:bg-slate-100 text-slate-700 border border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0 pr-1">
                              <span className={`w-2 h-2 rounded-full shrink-0 ${currentUser?.id === u.id ? 'bg-indigo-600 ring-2 ring-indigo-200' : 'bg-emerald-500'}`}></span>
                              <span className="text-[11px] truncate font-semibold">{u.name}</span>
                            </div>
                            <span className="text-[9px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold shrink-0 whitespace-nowrap border border-slate-200">
                              {u.role}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 space-y-1.5">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logoutStaff();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl font-bold transition cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log Keluar Staf (Kembali ke Pelanggan)</span>
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm('Adakah anda pasti untuk mengeset semula semua data demo?')) {
                            resetDemoData();
                            setIsUserMenuOpen(false);
                          }
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] text-slate-500 hover:bg-slate-100 rounded-lg font-medium transition"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Reset Data Demo</span>
                      </button>
                    </div>

                  </div>
                )}
              </div>
            </>
          ) : (
            /* PELANGGAN AWAM (TIADA AKSES ADMIN & TIADA DROPDOWN ADMIN) */
            <button
              onClick={() => switchSystemMode('MAIN')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition cursor-pointer"
              title="Kembali ke Menu Paling Utama"
            >
              <span>← Menu Utama</span>
            </button>
          )}
        </div>

      </div>

      {/* Mobile Switcher Bar - Hanya dipaparkan untuk Staf / Admin */}
      {isStaffLoggedIn && (
        <div className="flex md:hidden items-center justify-around py-2 px-3 border-t border-slate-800/40 bg-slate-950 text-xs font-black">
          <button
            onClick={() => switchSystemMode('MASAKAN')}
            className={`px-3 py-1 rounded-xl transition ${
              activeSystemMode === 'MASAKAN' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
            }`}
          >
            🍔 MASAKAN
          </button>
          <button
            onClick={() => switchSystemMode('REPAIR')}
            className={`px-3 py-1 rounded-xl transition ${
              activeSystemMode === 'REPAIR' ? 'bg-cyan-400 text-slate-950' : 'text-slate-400'
            }`}
          >
            📱 REPAIR
          </button>
          <button
            onClick={() => switchSystemMode('MANAGEMENT')}
            className={`px-3 py-1 rounded-xl transition ${
              activeSystemMode === 'MANAGEMENT' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            🏢 UTAMA
          </button>
        </div>
      )}

    </header>
  );
};
