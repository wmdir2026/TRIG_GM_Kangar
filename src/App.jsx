import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Toast } from './components/Toast';
import { ReceiptModal } from './components/ReceiptModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { LoginPage } from './components/LoginPage';

// Views
import { DashboardView } from './views/DashboardView';
import { CafeDashboard } from './views/Cafe/CafeDashboard';
import { MenuManagement } from './views/Cafe/MenuManagement';
import { TableManagement } from './views/Cafe/TableManagement';
import { QRTables } from './views/Cafe/QRTables';
import { FoodOrderingPOS } from './views/Cafe/FoodOrderingPOS';
import { KitchenDisplay } from './views/Cafe/KitchenDisplay';
import { FoodOrdersList } from './views/Cafe/FoodOrdersList';
import { RepairDashboard } from './views/Repair/RepairDashboard';
import { CustomerManagement } from './views/Repair/CustomerManagement';
import { RepairJobsList } from './views/Repair/RepairJobsList';
import { RepairTools } from './views/Repair/RepairTools';
import { AccessoriesPOS } from './views/Repair/AccessoriesPOS';
import { CentralInventory } from './views/Inventory/CentralInventory';
import { StockMovement } from './views/Inventory/StockMovement';
import { LowStockAlerts } from './views/Inventory/LowStockAlerts';
import { Suppliers } from './views/Inventory/Suppliers';
import { PurchaseRequests } from './views/Procurement/PurchaseRequests';
import { PurchaseOrders } from './views/Procurement/PurchaseOrders';
import { UnifiedSales } from './views/Finance/UnifiedSales';
import { FinancialDashboard } from './views/Finance/FinancialDashboard';
import { ReportsCenter } from './views/Reports/ReportsCenter';
import { CustomerTableOrder } from './views/CustomerPortal/CustomerTableOrder';
import { CustomerRepairTracker } from './views/CustomerPortal/CustomerRepairTracker';
import { UserManagement } from './views/System/UserManagement';
import { AuditTrail } from './views/System/AuditTrail';
import { SettingsView } from './views/System/SettingsView';
import { PortalLandingView } from './views/Portal/PortalLandingView';

const MainLayout = () => {
  const { currentTab, activeSystemMode, currentUser } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  if (isLoggedOut) {
    return <LoginPage onLoginSuccess={() => setIsLoggedOut(false)} />;
  }

  const renderActiveView = () => {
    // Portal / Main Landing Screen (Platform Muka Hadapan)
    if (activeSystemMode === 'PORTAL' || currentTab === 'portal') {
      return <PortalLandingView />;
    }

    switch (currentTab) {
      case 'dashboard':
        return <DashboardView />;
      
      // KURSUS MASAKAN & CAFÉ (TastyBites Theme)
      case 'cafe-dashboard':
        return <CafeDashboard />;
      case 'menu':
        return <MenuManagement />;
      case 'tables':
        return <TableManagement />;
      case 'qr-tables':
        return <QRTables />;
      case 'food-ordering':
        return <FoodOrderingPOS />;
      case 'kitchen':
        return <KitchenDisplay />;
      case 'food-orders':
        return <FoodOrdersList />;
      case 'customer-order':
        return <CustomerTableOrder />;

      // KURSUS BAIKI SMARTPHONE (Tech Blue Theme)
      case 'repair-dashboard':
        return <RepairDashboard />;
      case 'customers':
        return <CustomerManagement />;
      case 'repair-jobs':
        return <RepairJobsList />;
      case 'repair-tools':
        return <RepairTools />;
      case 'accessories-pos':
        return <AccessoriesPOS />;
      case 'customer-repair-tracker':
        return <CustomerRepairTracker />;

      // INVENTORY & PROCUREMENT
      case 'inventory':
        return <CentralInventory />;
      case 'stock-movement':
        return <StockMovement />;
      case 'low-stock':
        return <LowStockAlerts />;
      case 'suppliers':
        return <Suppliers />;
      case 'purchase-requests':
        return <PurchaseRequests />;
      case 'purchase-orders':
        return <PurchaseOrders />;

      // FINANCE & SALES
      case 'unified-sales':
        return <UnifiedSales />;
      case 'financial-dashboard':
        return <FinancialDashboard />;

      // REPORTS
      case 'reports':
        return <ReportsCenter />;

      // SYSTEM
      case 'users':
        return <UserManagement />;
      case 'audit-logs':
        return <AuditTrail />;
      case 'settings':
        return <SettingsView />;

      default:
        return <PortalLandingView />;
    }
  };

  const isPortalMode = activeSystemMode === 'PORTAL';

  const appBackground = 
    isPortalMode
      ? 'bg-[#040812] text-slate-100'
      : activeSystemMode === 'MASAKAN'
      ? 'bg-[#0b0c10] text-slate-100'
      : activeSystemMode === 'REPAIR'
      ? 'bg-[#07172e] text-slate-100'
      : 'bg-slate-100 text-slate-900';

  const footerStyle = 
    isPortalMode
      ? 'bg-slate-950/90 border-t border-slate-800 text-slate-400'
      : activeSystemMode === 'MASAKAN'
      ? 'bg-slate-950 border-t border-amber-500/20 text-slate-400'
      : activeSystemMode === 'REPAIR'
      ? 'bg-[#06152b] border-t border-cyan-500/20 text-slate-400'
      : 'bg-white border-t border-slate-200 text-slate-500';

  return (
    <div className={`min-h-screen flex font-sans transition-colors duration-300 ${appBackground}`}>
      
      {/* Sidebar Navigation - only rendered when a system is selected */}
      {!isPortalMode && (
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      )}

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all ${isPortalMode ? 'lg:pl-0' : 'lg:pl-72'}`}>
        
        {/* Top Navbar */}
        <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* Dynamic Page Content */}
        <main className={`flex-1 p-4 sm:p-6 lg:p-8 w-full mx-auto ${isPortalMode ? 'max-w-6xl' : 'max-w-7xl'}`}>
          {renderActiveView()}
        </main>

        {/* Global Footer */}
        <footer className={`px-6 py-4 text-xs flex flex-col sm:flex-row items-center justify-between gap-2 transition-colors ${footerStyle}`}>
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="GIATMARA" className="h-8 w-auto object-contain bg-white px-2 py-1 rounded-lg shadow-xs" />
            <p>
              <strong>TRIG GIATMARA KANGAR</strong> — {isPortalMode ? 'Platform Utama Digital Business' : activeSystemMode === 'MASAKAN' ? 'Sistem Kursus Masakan & Café' : activeSystemMode === 'REPAIR' ? 'Sistem Kursus Baiki Smartphone' : 'Digital Business Management System'}
            </p>
          </div>
          <p className="text-[11px] opacity-75">
            Kompleks GIATMARA Kangar, Perlis • Versi 2.6 Pro
          </p>
        </footer>
      </div>

      {/* Global Modals & Overlays */}
      <Toast />
      <ReceiptModal />
      <GlobalSearchModal />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
