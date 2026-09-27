import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Coffee,
  Grid,
  QrCode,
  ShoppingBag,
  ChefHat,
  ListOrdered,
  Smartphone,
  Users,
  Wrench,
  FileSpreadsheet,
  Layers,
  Package,
  ArrowLeftRight,
  AlertTriangle,
  Truck,
  FileText,
  FileCheck,
  Receipt,
  TrendingUp,
  BarChart3,
  UserCog,
  History,
  Settings,
  X,
  Sparkles,
  SmartphoneNfc,
  Flame,
  Cpu
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const {
    currentTab,
    setCurrentTab,
    currentUser,
    activeSystemMode,
    switchSystemMode,
    kpis
  } = useApp();

  const userRole = currentUser?.role || 'SUPER ADMIN';

  // Define section groups per mode
  const masakanSections = [
    {
      title: "OPERASI KURSUS MASAKAN",
      items: [
        { id: 'cafe-dashboard', label: 'Dashboard Café', icon: Coffee, roles: ['SUPER ADMIN', 'MANAGER', 'CAFE STAFF'] },
        { id: 'menu', label: 'Pengurusan Menu Makanan', icon: UtensilsCrossed, roles: ['SUPER ADMIN', 'MANAGER', 'CAFE STAFF'] },
        { id: 'tables', label: 'Pengurusan Meja (M01-M10)', icon: Grid, roles: ['SUPER ADMIN', 'MANAGER', 'CAFE STAFF'] },
        { id: 'qr-tables', label: 'Kod QR Meja Café', icon: QrCode, roles: ['SUPER ADMIN', 'MANAGER', 'CAFE STAFF'] },
        { id: 'food-ordering', label: 'Order Makanan (POS)', icon: ShoppingBag, roles: ['SUPER ADMIN', 'MANAGER', 'CAFE STAFF', 'CASHIER'] },
        {
          id: 'kitchen',
          label: 'Paparan Dapur (KDS)',
          icon: ChefHat,
          roles: ['SUPER ADMIN', 'MANAGER', 'CAFE STAFF'],
          badge: kpis.activeFoodOrdersCount > 0 ? kpis.activeFoodOrdersCount : null,
          badgeColor: 'bg-amber-500 text-slate-950'
        },
        { id: 'food-orders', label: 'Senarai Pesanan Makanan', icon: ListOrdered, roles: ['SUPER ADMIN', 'MANAGER', 'CAFE STAFF', 'CASHIER'] },
      ]
    },
    {
      title: "PORTAL PELANGGAN CAFÉ",
      items: [
        { id: 'customer-order', label: 'Menu Pelanggan (QR Meja)', icon: QrCode, roles: ['SUPER ADMIN', 'CUSTOMER', 'CAFE STAFF', 'MANAGER'] },
      ]
    }
  ];

  const repairSections = [
    {
      title: "OPERASI BAIKI SMARTPHONE",
      items: [
        { id: 'repair-dashboard', label: 'Dashboard Baiki Telefon', icon: Smartphone, roles: ['SUPER ADMIN', 'MANAGER', 'REPAIR STAFF'] },
        { id: 'customers', label: 'Pangkalan Pelanggan CRM', icon: Users, roles: ['SUPER ADMIN', 'MANAGER', 'REPAIR STAFF', 'CASHIER'] },
        {
          id: 'repair-jobs',
          label: 'Job Baiki (REP-2026)',
          icon: Wrench,
          roles: ['SUPER ADMIN', 'MANAGER', 'REPAIR STAFF', 'CASHIER'],
          badge: kpis.activeRepairJobsCount > 0 ? kpis.activeRepairJobsCount : null,
          badgeColor: 'bg-cyan-400 text-slate-950'
        },
        { id: 'repair-tools', label: 'Peralatan & Mesin Bengkel', icon: Layers, roles: ['SUPER ADMIN', 'MANAGER', 'REPAIR STAFF'] },
        { id: 'accessories-pos', label: 'Jualan Aksesori (POS)', icon: SmartphoneNfc, roles: ['SUPER ADMIN', 'MANAGER', 'REPAIR STAFF', 'CASHIER'] },
      ]
    },
    {
      title: "PORTAL AWAM / PELANGGAN",
      items: [
        { id: 'customer-repair-tracker', label: 'Semak Status Pembaikan', icon: Smartphone, roles: ['SUPER ADMIN', 'CUSTOMER', 'REPAIR STAFF', 'MANAGER'] },
      ]
    }
  ];

  const managementSections = [
    {
      title: "PENGURUSAN UTAMA",
      items: [
        { id: 'dashboard', label: 'Dashboard Utama', icon: LayoutDashboard, roles: ['SUPER ADMIN', 'MANAGER', 'CASHIER'] },
        { id: 'unified-sales', label: 'Jualan Bersepadu', icon: Receipt, roles: ['SUPER ADMIN', 'MANAGER', 'CASHIER'] },
        { id: 'financial-dashboard', label: 'Prestasi Kewangan', icon: TrendingUp, roles: ['SUPER ADMIN', 'MANAGER'] },
      ]
    },
    {
      title: "INVENTORI & PEMBELIAN",
      items: [
        { id: 'inventory', label: 'Inventori Pusat', icon: Package, roles: ['SUPER ADMIN', 'MANAGER', 'CAFE STAFF', 'REPAIR STAFF'] },
        { id: 'stock-movement', label: 'Pergerakan Stok', icon: ArrowLeftRight, roles: ['SUPER ADMIN', 'MANAGER'] },
        {
          id: 'low-stock',
          label: 'Amaran Stok Rendah',
          icon: AlertTriangle,
          roles: ['SUPER ADMIN', 'MANAGER', 'CAFE STAFF', 'REPAIR STAFF'],
          badge: kpis.lowStockCount > 0 ? kpis.lowStockCount : null,
          badgeColor: 'bg-amber-500 text-slate-950'
        },
        { id: 'suppliers', label: 'Senarai Pembekal', icon: Truck, roles: ['SUPER ADMIN', 'MANAGER'] },
        {
          id: 'purchase-requests',
          label: 'Permohonan Beli (PR)',
          icon: FileText,
          roles: ['SUPER ADMIN', 'MANAGER', 'CAFE STAFF', 'REPAIR STAFF'],
          badge: kpis.pendingPurchasesCount > 0 ? kpis.pendingPurchasesCount : null,
          badgeColor: 'bg-purple-500 text-white'
        },
        { id: 'purchase-orders', label: 'Pesanan Belian (PO)', icon: FileCheck, roles: ['SUPER ADMIN', 'MANAGER'] },
      ]
    },
    {
      title: "LAPORAN & SISTEM",
      items: [
        { id: 'reports', label: 'Pusat 20+ Laporan', icon: BarChart3, roles: ['SUPER ADMIN', 'MANAGER'] },
        { id: 'users', label: 'Pengguna & Peranan', icon: UserCog, roles: ['SUPER ADMIN'] },
        { id: 'audit-logs', label: 'Jejak Audit Aktiviti', icon: History, roles: ['SUPER ADMIN', 'MANAGER'] },
        { id: 'settings', label: 'Tetapan Sistem', icon: Settings, roles: ['SUPER ADMIN', 'MANAGER'] },
      ]
    }
  ];

  const currentSections = 
    activeSystemMode === 'MASAKAN'
      ? masakanSections
      : activeSystemMode === 'REPAIR'
      ? repairSections
      : managementSections;

  const sidebarTheme = 
    activeSystemMode === 'MASAKAN'
      ? 'bg-slate-950 text-slate-300 border-amber-500/20'
      : activeSystemMode === 'REPAIR'
      ? 'bg-[#06152b] text-slate-300 border-cyan-500/20'
      : 'bg-slate-900 text-slate-300 border-slate-800';

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 flex flex-col border-r transition-all duration-300 ease-in-out lg:translate-x-0 shadow-2xl ${sidebarTheme} ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-white/10 bg-black/30">
          <div className="flex items-center justify-between">
            <div className="bg-white p-2.5 rounded-2xl shadow-md inline-flex items-center justify-center">
              <img
                src="/logo.png"
                alt="GIATMARA Logo"
                className="h-12 sm:h-14 w-auto object-contain"
              />
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-3">
            <h1 className="text-white font-black text-sm tracking-tight leading-none">
              {activeSystemMode === 'MASAKAN' && 'CAFÉ & MASAKAN'}
              {activeSystemMode === 'REPAIR' && 'BAIKE SMARTPHONE'}
              {activeSystemMode === 'MANAGEMENT' && 'TRIG GIATMARA KANGAR'}
            </h1>
            <span className={`text-[10px] font-extrabold tracking-wider uppercase mt-1 block ${
              activeSystemMode === 'MASAKAN' ? 'text-amber-400' :
              activeSystemMode === 'REPAIR' ? 'text-cyan-400' :
              'text-indigo-400'
            }`}>
              {activeSystemMode === 'MASAKAN' && 'TastyBites Gourmet System'}
              {activeSystemMode === 'REPAIR' && 'Planet Service Tech System'}
              {activeSystemMode === 'MANAGEMENT' && 'Central Management Hub'}
            </span>
          </div>
        </div>

        {/* Back to Portal Hub Button */}
        <div className="p-3 bg-black/40 border-b border-white/10">
          <button
            onClick={() => {
              switchSystemMode('PORTAL');
              if (isOpen) onClose();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-slate-800 via-slate-900 to-indigo-950 hover:from-slate-700 hover:to-indigo-900 text-white text-xs font-black border border-indigo-500/30 shadow-md transition group"
          >
            <span className="text-sm group-hover:-translate-x-1 transition-transform">🏠</span>
            <span>Kembali ke Platform Utama</span>
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {currentSections.map((section, idx) => {
            const isRoleAuthorized = (itemRoles, role) => {
              if (!role) return false;
              if (role === 'SUPER ADMIN') return true;
              if (itemRoles.includes(role)) return true;
              if (itemRoles.includes('MANAGER') && role.includes('MANAGER')) return true;
              if (itemRoles.includes('CASHIER') && role.includes('CASHIER')) return true;
              if (itemRoles.includes('CAFE STAFF') && (role === 'CAFE STAFF' || role === 'MANAGER CAFE')) return true;
              if (itemRoles.includes('REPAIR STAFF') && (role === 'REPAIR STAFF' || role === 'MANAGER SMARTPHONE REPAIR')) return true;
              return false;
            };

            const visibleItems = section.items.filter(item =>
              isRoleAuthorized(item.roles, userRole)
            );

            if (visibleItems.length === 0) return null;

            return (
              <div key={idx} className="space-y-1">
                <p className={`px-3 text-[10px] font-extrabold uppercase tracking-wider ${
                  activeSystemMode === 'MASAKAN' ? 'text-amber-500/80' :
                  activeSystemMode === 'REPAIR' ? 'text-cyan-400/80' :
                  'text-slate-500'
                }`}>
                  {section.title}
                </p>
                <div className="space-y-0.5 mt-1">
                  {visibleItems.map(item => {
                    const Icon = item.icon;
                    const isActive = currentTab === item.id;

                    const activeItemClass = 
                      activeSystemMode === 'MASAKAN'
                        ? 'bg-linear-to-r from-amber-500 to-orange-500 text-slate-950 font-black shadow-md shadow-amber-500/30'
                        : activeSystemMode === 'REPAIR'
                        ? 'bg-linear-to-r from-blue-600 to-cyan-500 text-slate-950 font-black shadow-md shadow-blue-500/30'
                        : 'bg-linear-to-r from-indigo-600 to-blue-600 text-white font-bold shadow-md shadow-indigo-600/30';

                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setCurrentTab(item.id);
                          if (window.innerWidth < 1024) onClose();
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                          isActive
                            ? activeItemClass
                            : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon
                            className={`w-4 h-4 transition-colors ${
                              isActive
                                ? 'text-slate-950'
                                : 'text-slate-400 group-hover:text-slate-200'
                            }`}
                          />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={`px-1.5 py-0.2 text-[10px] font-black rounded-full ${item.badgeColor}`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-white/10 bg-black/40 text-[11px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>TRIG Versi 2.6 Pro</span>
          </div>
          <span className="text-[10px] text-slate-500 font-bold">GIATMARA</span>
        </div>
      </aside>
    </>
  );
};
