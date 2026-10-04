import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_SETTINGS,
  INITIAL_USERS,
  INITIAL_MENU_CATEGORIES,
  INITIAL_MENU,
  INITIAL_TABLES,
  INITIAL_FOOD_ORDERS,
  INITIAL_CUSTOMERS,
  INITIAL_REPAIR_JOBS,
  INITIAL_INVENTORY,
  INITIAL_REPAIR_TOOLS,
  INITIAL_SUPPLIERS,
  INITIAL_PURCHASE_REQUESTS,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_STOCK_TRANSACTIONS,
  INITIAL_SALES,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS
} from '../data/initialData';
import { realtimeSync } from '../services/realtimeSync';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Helper to load or fallback to initial
  const USERS_STORAGE_VERSION = 'v2.7_super_admin_pass_095059_verified';

  const loadStorage = (key, fallback) => {
    try {
      const saved = localStorage.getItem(`trig_${key}`);
      return saved ? JSON.parse(saved) : fallback;
    } catch (e) {
      console.error(`Error loading ${key} from storage:`, e);
      return fallback;
    }
  };

  const loadUsersStorage = () => {
    try {
      const v = localStorage.getItem('trig_users_storage_version');
      const saved = localStorage.getItem('trig_users');

      // Jika versi storan berubah atau pengguna belum dikemas kini
      if (v !== USERS_STORAGE_VERSION) {
        localStorage.setItem('trig_users_storage_version', USERS_STORAGE_VERSION);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            const upgraded = parsed.map(u => {
              if (u.username === 'admin' || u.role === 'SUPER ADMIN') {
                // Naik taraf admin123 atau kata laluan kosong kepada 095059
                if (!u.password || u.password === 'admin123') {
                  return { ...u, password: '095059' };
                }
              }
              return u;
            });
            localStorage.setItem('trig_users', JSON.stringify(upgraded));
            return upgraded;
          } catch (err) {
            localStorage.setItem('trig_users', JSON.stringify(INITIAL_USERS));
            return INITIAL_USERS;
          }
        }
        localStorage.setItem('trig_users', JSON.stringify(INITIAL_USERS));
        return INITIAL_USERS;
      }

      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map(u => {
          if (u.username === 'admin' || u.role === 'SUPER ADMIN') {
            if (!u.password || u.password === 'admin123') {
              return { ...u, password: '095059' };
            }
          }
          return u;
        });
      }
      return INITIAL_USERS;
    } catch (e) {
      return INITIAL_USERS;
    }
  };

  const loadCurrentUserStorage = () => {
    try {
      const isStaff = localStorage.getItem('trig_is_staff_logged_in') === 'true';
      const saved = localStorage.getItem('trig_currentUser');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Jika belum log masuk staf atau pengguna ialah pelanggan
        if (!isStaff && (parsed.role === 'SUPER ADMIN' || parsed.username === 'admin')) {
          const customerUser = INITIAL_USERS.find(u => u.role === 'CUSTOMER') || INITIAL_USERS[7];
          return customerUser;
        }
        return parsed;
      }
      return INITIAL_USERS.find(u => u.role === 'CUSTOMER') || INITIAL_USERS[7];
    } catch (e) {
      return INITIAL_USERS.find(u => u.role === 'CUSTOMER') || INITIAL_USERS[7];
    }
  };

  const loadSettingsStorage = () => {
    try {
      const saved = localStorage.getItem('trig_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.businessName || parsed.businessName === "TRIG GIATMARA KANGAR" || parsed.businessName.includes("PASTA CAFE") || parsed.businessName.includes("PASTA CAFÉ")) {
          parsed.businessName = "TECHBYTE & FELÌCE CAFFÉ";
          parsed.subName = "TRIG GIATMARA KANGAR";
        }
        return parsed;
      }
      return INITIAL_SETTINGS;
    } catch (e) {
      return INITIAL_SETTINGS;
    }
  };

  // State initialization
  const [settings, setSettings] = useState(() => loadSettingsStorage());
  const [users, setUsers] = useState(() => loadUsersStorage());
  const [currentUser, setCurrentUser] = useState(() => loadCurrentUserStorage()); // Default Super Admin (Wan Muhadir)
  const [categories, setCategories] = useState(() => loadStorage('categories', INITIAL_MENU_CATEGORIES));
  const [menu, setMenu] = useState(() => loadStorage('menu', INITIAL_MENU));
  const [tables, setTables] = useState(() => loadStorage('tables', INITIAL_TABLES));
  const [foodOrders, setFoodOrders] = useState(() => loadStorage('food_orders', INITIAL_FOOD_ORDERS));
  const [customers, setCustomers] = useState(() => loadStorage('customers', INITIAL_CUSTOMERS));
  const [repairJobs, setRepairJobs] = useState(() => loadStorage('repair_jobs', INITIAL_REPAIR_JOBS));
  const [inventory, setInventory] = useState(() => loadStorage('inventory', INITIAL_INVENTORY));
  const [repairTools, setRepairTools] = useState(() => loadStorage('repair_tools', INITIAL_REPAIR_TOOLS));
  const [suppliers, setSuppliers] = useState(() => loadStorage('suppliers', INITIAL_SUPPLIERS));
  const [purchaseRequests, setPurchaseRequests] = useState(() => loadStorage('purchase_requests', INITIAL_PURCHASE_REQUESTS));
  const [purchaseOrders, setPurchaseOrders] = useState(() => loadStorage('purchase_orders', INITIAL_PURCHASE_ORDERS));
  const [stockTransactions, setStockTransactions] = useState(() => loadStorage('stock_transactions', INITIAL_STOCK_TRANSACTIONS));
  const [sales, setSales] = useState(() => loadStorage('sales', INITIAL_SALES));
  const [notifications, setNotifications] = useState(() => loadStorage('notifications', INITIAL_NOTIFICATIONS));
  const [auditLogs, setAuditLogs] = useState(() => loadStorage('audit_logs', INITIAL_AUDIT_LOGS));

  // Global Accessory Discount & Promo Sale configured by Super Admin
  const DEFAULT_ACCESSORY_DISCOUNT = {
    isActive: true,
    percentage: 15,
    title: 'TAWARAN DISKAUN & JUALAN MURAH AKSESORI!',
    customText: 'Potongan harga istimewa sempena promosi bengkel GIATMARA Kangar. Jimat hebat untuk semua kabel, casing, tempered glass & charger terpilih!',
    updatedBy: 'Super Admin',
    updatedAt: new Date().toISOString()
  };
  const [accessoryDiscount, setAccessoryDiscount] = useState(() =>
    loadStorage('accessory_discount', DEFAULT_ACCESSORY_DISCOUNT)
  );

  // UI state
  const [currentTab, setCurrentTabState] = useState('main');
  const [activeSystemMode, setActiveSystemMode] = useState('MAIN'); // 'MAIN', 'PORTAL', 'MASAKAN', 'REPAIR', 'MANAGEMENT'
  const [selectedTableForCustomer, setSelectedTableForCustomer] = useState(null);
  const [toast, setToast] = useState(null);
  const [receiptData, setReceiptData] = useState(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [isStaffLoggedIn, setIsStaffLoggedIn] = useState(() => {
    try {
      return localStorage.getItem('trig_is_staff_logged_in') === 'true';
    } catch (e) {
      return false;
    }
  });

  const logoutStaff = () => {
    setIsStaffLoggedIn(false);
    localStorage.setItem('trig_is_staff_logged_in', 'false');
    const customerUser = users.find(u => u.role === 'CUSTOMER') || INITIAL_USERS[7];
    setCurrentUser(customerUser);
    localStorage.setItem('trig_currentUser', JSON.stringify(customerUser));
    switchSystemMode('MAIN');
    showToast('Log keluar berjaya. Anda kini berada di Menu Pelanggan Awam.', 'info');
  };

  // Tab switcher that automatically updates the system mode
  const setCurrentTab = (tab) => {
    setCurrentTabState(tab);
    if (tab === 'main') {
      setActiveSystemMode('MAIN');
    } else if (tab === 'portal') {
      setActiveSystemMode('PORTAL');
    } else if (['cafe-dashboard', 'menu', 'tables', 'qr-tables', 'food-ordering', 'kitchen', 'food-orders', 'customer-order', 'customer-phone-app', 'waiter-tablet-app'].includes(tab)) {
      setActiveSystemMode('MASAKAN');
    } else if (['repair-dashboard', 'customers', 'repair-jobs', 'repair-tools', 'accessories-pos', 'customer-repair-tracker', 'customer-repair-phone-app'].includes(tab)) {
      setActiveSystemMode('REPAIR');
    } else {
      setActiveSystemMode('MANAGEMENT');
    }
  };

  const switchSystemMode = (mode) => {
    setActiveSystemMode(mode);
    if (mode === 'MAIN') {
      setCurrentTabState('main');
    } else if (mode === 'PORTAL') {
      setCurrentTabState('portal');
    } else if (mode === 'MASAKAN') {
      setCurrentTabState('cafe-dashboard');
    } else if (mode === 'REPAIR') {
      setCurrentTabState('repair-dashboard');
    } else {
      setCurrentTabState('dashboard');
    }
  };

  // Real-time Cloud Synchronization State (MQTT & BroadcastChannel)
  const [syncStatus, setSyncStatus] = useState('connecting');

  // Realtime Sync Subscription for Cross-Device Synchronization (Android Phone <-> Android Tab)
  useEffect(() => {
    const unsubStatus = realtimeSync.onStatusChange(setSyncStatus);

    const unsubEvents = realtimeSync.subscribe((event) => {
      if (!event || !event.type) return;

      if (event.type === 'ORDER_CREATED') {
        const incomingOrder = event.payload?.order;
        if (!incomingOrder) return;

        setFoodOrders(prev => {
          if (prev.some(o => o.id === incomingOrder.id)) return prev;
          return [incomingOrder, ...prev];
        });

        if (incomingOrder.orderType === 'DINE_IN' && incomingOrder.tableId) {
          setTables(prev => prev.map(t => t.id === incomingOrder.tableId ? { ...t, status: 'OCCUPIED', activeOrderId: incomingOrder.id } : t));
        }

        if (event.payload?.sale) {
          setSales(prev => {
            if (prev.some(s => s.id === event.payload.sale.id)) return prev;
            return [event.payload.sale, ...prev];
          });
        }

        realtimeSync.playChime('new_order');
        showToast(`🔔 Pesanan Baru (${incomingOrder.orderType === 'DINE_IN' ? `Meja ${incomingOrder.tableId}` : 'Takeaway'}): ${incomingOrder.id}`, 'info');
      }

      else if (event.type === 'ORDER_STATUS_UPDATED') {
        const { orderId, newStatus } = event.payload || {};
        if (!orderId || !newStatus) return;

        const now = new Date().toISOString();
        setFoodOrders(prev => prev.map(o => {
          if (o.id === orderId) {
            return {
              ...o,
              orderStatus: newStatus,
              confirmedAt: newStatus === 'CONFIRMED' && !o.confirmedAt ? now : o.confirmedAt,
              preparedAt: (newStatus === 'READY' || newStatus === 'COMPLETED') && !o.preparedAt ? now : o.preparedAt,
              completedAt: newStatus === 'COMPLETED' ? now : o.completedAt
            };
          }
          return o;
        }));

        if (newStatus === 'COMPLETED' || newStatus === 'CANCELLED') {
          setTables(prev => prev.map(t => t.activeOrderId === orderId ? { ...t, status: 'AVAILABLE', activeOrderId: null } : t));
        }

        if (newStatus === 'READY') {
          realtimeSync.playChime('ready');
          showToast(`✅ Pesanan ${orderId} siap dimasak! Sedia dihidang.`, 'success');
        } else if (newStatus === 'PREPARING') {
          showToast(`🔥 Pesanan ${orderId} sedang dimasak di dapur.`, 'info');
        }
      }

      else if (event.type === 'ORDER_CANCELLED') {
        const { orderId, reason } = event.payload || {};
        if (!orderId) return;

        setFoodOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: 'CANCELLED', cancelReason: reason } : o));
        setTables(prev => prev.map(t => t.activeOrderId === orderId ? { ...t, status: 'AVAILABLE', activeOrderId: null } : t));
        showToast(`Pesanan ${orderId} dibatalkan.`, 'info');
      }

      else if (event.type === 'TABLE_UPDATED') {
        const { id, updated } = event.payload || {};
        if (!id) return;
        setTables(prev => prev.map(t => t.id === id ? { ...t, ...updated } : t));
      }
    });

    return () => {
      unsubStatus();
      unsubEvents();
    };
  }, []);

  // Sync to LocalStorage
  useEffect(() => { localStorage.setItem('trig_settings', JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem('trig_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('trig_currentUser', JSON.stringify(currentUser)); }, [currentUser]);
  useEffect(() => { localStorage.setItem('trig_categories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('trig_menu', JSON.stringify(menu)); }, [menu]);
  useEffect(() => { localStorage.setItem('trig_tables', JSON.stringify(tables)); }, [tables]);
  useEffect(() => { localStorage.setItem('trig_food_orders', JSON.stringify(foodOrders)); }, [foodOrders]);
  useEffect(() => { localStorage.setItem('trig_customers', JSON.stringify(customers)); }, [customers]);
  useEffect(() => { localStorage.setItem('trig_repair_jobs', JSON.stringify(repairJobs)); }, [repairJobs]);
  useEffect(() => { localStorage.setItem('trig_inventory', JSON.stringify(inventory)); }, [inventory]);
  useEffect(() => { localStorage.setItem('trig_repair_tools', JSON.stringify(repairTools)); }, [repairTools]);
  useEffect(() => { localStorage.setItem('trig_suppliers', JSON.stringify(suppliers)); }, [suppliers]);
  useEffect(() => { localStorage.setItem('trig_purchase_requests', JSON.stringify(purchaseRequests)); }, [purchaseRequests]);
  useEffect(() => { localStorage.setItem('trig_purchase_orders', JSON.stringify(purchaseOrders)); }, [purchaseOrders]);
  useEffect(() => { localStorage.setItem('trig_stock_transactions', JSON.stringify(stockTransactions)); }, [stockTransactions]);
  useEffect(() => { localStorage.setItem('trig_sales', JSON.stringify(sales)); }, [sales]);
  useEffect(() => { localStorage.setItem('trig_notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('trig_audit_logs', JSON.stringify(auditLogs)); }, [auditLogs]);
  useEffect(() => { localStorage.setItem('trig_is_staff_logged_in', String(isStaffLoggedIn)); }, [isStaffLoggedIn]);
  useEffect(() => { localStorage.setItem('trig_accessory_discount', JSON.stringify(accessoryDiscount)); }, [accessoryDiscount]);

  // Helper: Synchronize & Calculate Customer CRM stats strictly from valid, diagnosed repair jobs
  const calculateCustomerStats = (customer, currentRepairJobs) => {
    const cleanCustPhone = (customer.phone || '').replace(/[^0-9]/g, '');
    const linkedJobs = (currentRepairJobs || []).filter(j => {
      if (j.customerId && j.customerId === customer.id) return true;
      const jPhone = (j.customerPhone || '').replace(/[^0-9]/g, '');
      return (cleanCustPhone && jPhone && cleanCustPhone === jPhone) ||
             (j.customerName && customer.name && j.customerName.trim().toLowerCase() === customer.name.trim().toLowerCase());
    });

    const totalRepairs = linkedJobs.length;

    // IMPORTANT: Customer spending is ONLY counted for jobs that have been diagnosed by the technician (hasDiagnosis === true OR repairStatus !== 'RECEIVED')
    const diagnosedJobs = linkedJobs.filter(j => 
      j.hasDiagnosis === true || 
      (j.repairStatus && j.repairStatus !== 'RECEIVED' && Number(j.sellingPrice) > 0)
    );
    const totalSpending = diagnosedJobs.reduce((acc, j) => acc + (Number(j.sellingPrice) || 0), 0);

    const sortedJobs = [...linkedJobs].sort((a, b) => new Date(b.dateReceived || 0) - new Date(a.dateReceived || 0));
    const latestJob = sortedJobs[0];

    return {
      totalRepairs,
      totalSpending,
      lastRepair: latestJob ? new Date(latestJob.dateReceived).toISOString().split('T')[0] : (customer.lastRepair && customer.lastRepair !== '-' ? customer.lastRepair : '-'),
      lastJobId: latestJob ? latestJob.id : (customer.lastJobId && customer.lastJobId !== '-' ? customer.lastJobId : null),
      lastJobStatus: latestJob ? latestJob.repairStatus : (customer.lastJobStatus || '-')
    };
  };

  // Synchronize CRM Customers with Repair Jobs in real time whenever repairJobs changes or on initial mount
  useEffect(() => {
    setCustomers(prevCustomers => {
      let hasChanges = false;
      const updated = prevCustomers.map(cust => {
        const stats = calculateCustomerStats(cust, repairJobs);
        if (
          cust.totalRepairs !== stats.totalRepairs ||
          cust.totalSpending !== stats.totalSpending ||
          cust.lastRepair !== stats.lastRepair ||
          cust.lastJobId !== stats.lastJobId ||
          cust.lastJobStatus !== stats.lastJobStatus
        ) {
          hasChanges = true;
          return {
            ...cust,
            ...stats
          };
        }
        return cust;
      });
      return hasChanges ? updated : prevCustomers;
    });
  }, [repairJobs]);

  // Toast helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Audit Logger
  const logAudit = (action, module = 'SYSTEM') => {
    const newLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      user: currentUser ? `${currentUser.name} (${currentUser.role})` : 'System User',
      action,
      module,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Notification Creator
  const addNotification = ({ title, message, type = 'INFO', link = 'dashboard' }) => {
    const newNotif = {
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      title,
      message,
      type,
      isRead: false,
      timestamp: new Date().toISOString(),
      link
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // User Auth & Switcher
  const switchUser = (roleOrUsernameOrId, password = null, force = false) => {
    if (!roleOrUsernameOrId) return false;
    const target = String(roleOrUsernameOrId).toLowerCase().trim();
    const found = users.find(u => 
      u.id?.toLowerCase() === target ||
      u.username?.toLowerCase() === target ||
      u.role?.toLowerCase() === target ||
      u.name?.toLowerCase() === target
    );
    if (found) {
      // Kawalan Keselamatan: Hanya login betul (095059 atau Kata laluan aktif Super Admin) sahaja boleh masuk ke Super Admin
      if (found.role === 'SUPER ADMIN' && !force) {
        const activePass = found.password || '095059';
        const isMatch = (password === '095059') || (activePass !== 'admin123' && password === activePass);
        if (!isMatch) {
          showToast('Akses Ditolak: Kata laluan Super Admin tidak sah!', 'error');
          return false;
        }
      }

      setCurrentUser(found);
      const isStaff = found.role !== 'CUSTOMER';
      setIsStaffLoggedIn(isStaff);
      localStorage.setItem('trig_is_staff_logged_in', String(isStaff));
      localStorage.setItem('trig_currentUser', JSON.stringify(found));

      showToast(`Log masuk sebagai: ${found.name} (${found.role})`, 'info');
      logAudit(`Log masuk pengguna sebagai ${found.role}`, 'AUTH');
      if (found.role === 'CUSTOMER') {
        setCurrentTab('customer-order');
      } else if (found.role === 'CUSTOMER SERVICE') {
        setCurrentTab('waiter-tablet-app');
      } else if (found.role === 'CAFE STAFF') {
        setCurrentTab('kitchen');
      } else if (found.role === 'REPAIR STAFF') {
        setCurrentTab('repair-jobs');
      } else if (found.role === 'CAFE CASHIER' || found.role === 'CASHIER') {
        setCurrentTab('food-ordering');
      } else if (found.role === 'SMARTPHONE CASHIER') {
        setCurrentTab('accessories-pos');
      } else if (found.role === 'MANAGER CAFE') {
        setCurrentTab('cafe-dashboard');
      } else if (found.role === 'MANAGER SMARTPHONE REPAIR') {
        setCurrentTab('repair-dashboard');
      } else {
        setCurrentTab('dashboard');
      }
      return true;
    }
    return false;
  };

  // Open Receipt Modal
  const openReceipt = (data) => {
    setReceiptData(data);
    setIsReceiptModalOpen(true);
  };

  // ================= CAFÉ MODULE ACTIONS ================= //
  // Constants and Helpers for Menu Scheduling
  const DAYS_OF_WEEK = ['Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu', 'Ahad'];

  const getCurrentDayMalay = () => {
    // 0 = Ahad, 1 = Isnin, 2 = Selasa, 3 = Rabu, 4 = Khamis, 5 = Jumaat, 6 = Sabtu
    const map = ['Ahad', 'Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu'];
    return map[new Date().getDay()];
  };

  const isMenuItemAvailableToday = (item) => {
    if (!item) return false;
    if (item.status === 'INACTIVE') return false;
    if (item.status === 'OUT OF STOCK') return false;
    const today = getCurrentDayMalay();
    // Default: jika tiada availableDays atau kosong, ia dijual setiap hari
    if (!item.availableDays || !Array.isArray(item.availableDays) || item.availableDays.length === 0) {
      return true;
    }
    return item.availableDays.includes(today);
  };

  // Only Super Admin and Manager Cafe can add menu items
  const addMenuItem = (item) => {
    const isSuperAdmin = currentUser?.role === 'SUPER ADMIN';
    const isCafeManager =
      currentUser?.role === 'MANAGER CAFE' ||
      currentUser?.role === 'MANAGER' ||
      (currentUser?.role && currentUser.role.includes('CAFE') && currentUser.role.includes('MANAGER'));

    if (!isSuperAdmin && !isCafeManager) {
      showToast('Akses Ditolak: Hanya Super Admin dan Manager Café dibenarkan menambah item menu makanan/minuman.', 'error');
      return null;
    }

    const cost = parseFloat(item.costPrice) || 0;
    const selling = parseFloat(item.sellingPrice) || 0;
    const profit = Math.max(0, selling - cost);

    const newItem = {
      ...item,
      id: item.id || `MENU-${String(menu.length + 1).padStart(3, '0')}`,
      costPrice: cost,
      sellingPrice: selling,
      grossProfit: profit,
      status: item.status || 'AVAILABLE',
      availableDays: item.availableDays && item.availableDays.length > 0
        ? item.availableDays
        : ['Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu', 'Ahad'],
      createdAt: new Date().toISOString(),
      createdBy: currentUser ? `${currentUser.name} (${currentUser.role})` : 'Manager Café'
    };

    setMenu(prev => [newItem, ...prev]);
    logAudit(`Menambah item menu baru: "${newItem.name}" (Kos: RM ${cost.toFixed(2)}, Jual: RM ${selling.toFixed(2)}, Untung: RM ${profit.toFixed(2)}) oleh ${currentUser?.name || 'Admin'}`, 'CAFÉ');
    showToast(`Menu "${newItem.name}" berjaya ditambah! (Untung: RM ${profit.toFixed(2)})`, 'success');
    return newItem;
  };

  // Only Super Admin and Manager Cafe can update menu items
  const updateMenuItem = (id, updated) => {
    const isSuperAdmin = currentUser?.role === 'SUPER ADMIN';
    const isCafeManager =
      currentUser?.role === 'MANAGER CAFE' ||
      currentUser?.role === 'MANAGER' ||
      (currentUser?.role && currentUser.role.includes('CAFE') && currentUser.role.includes('MANAGER'));

    if (!isSuperAdmin && !isCafeManager) {
      showToast('Akses Ditolak: Hanya Super Admin dan Manager Café dibenarkan mengemaskini menu makanan.', 'error');
      return;
    }

    setMenu(prev => prev.map(m => {
      if (m.id === id) {
        const cost = updated.costPrice !== undefined ? parseFloat(updated.costPrice) : m.costPrice;
        const selling = updated.sellingPrice !== undefined ? parseFloat(updated.sellingPrice) : m.sellingPrice;
        const profit = Math.max(0, selling - cost);
        return {
          ...m,
          ...updated,
          costPrice: cost,
          sellingPrice: selling,
          grossProfit: profit
        };
      }
      return m;
    }));

    logAudit(`Mengemas kini menu: ${updated.name || id} oleh ${currentUser?.name || 'Admin'}`, 'CAFÉ');
    showToast('Menu makanan berjaya dikemaskini.');
  };

  // Only Super Admin and Manager Cafe can delete menu items
  const deleteMenuItem = (id) => {
    const isSuperAdmin = currentUser?.role === 'SUPER ADMIN';
    const isCafeManager =
      currentUser?.role === 'MANAGER CAFE' ||
      currentUser?.role === 'MANAGER' ||
      (currentUser?.role && currentUser.role.includes('CAFE') && currentUser.role.includes('MANAGER'));

    if (!isSuperAdmin && !isCafeManager) {
      showToast('Akses Ditolak: Hanya Super Admin dan Manager Café dibenarkan memadam menu makanan.', 'error');
      return;
    }

    const item = menu.find(m => m.id === id);
    setMenu(prev => prev.filter(m => m.id !== id));
    logAudit(`Memadam menu: ${item ? item.name : id} oleh ${currentUser?.name || 'Admin'}`, 'CAFÉ');
    showToast(`Menu ${item ? `"${item.name}"` : id} telah dipadam.`, 'info');
  };

  // Manager Cafe specific action: Set which days an item is sold / cooked
  const updateMenuSchedule = (id, availableDays) => {
    const isSuperAdmin = currentUser?.role === 'SUPER ADMIN';
    const isCafeManager =
      currentUser?.role === 'MANAGER CAFE' ||
      currentUser?.role === 'MANAGER' ||
      (currentUser?.role && currentUser.role.includes('CAFE') && currentUser.role.includes('MANAGER'));

    if (!isCafeManager && !isSuperAdmin) {
      showToast('Akses Ditolak: Hanya Manager Café yang mempunyai kuasa memilih hari jualan menu ini.', 'error');
      return;
    }

    const item = menu.find(m => m.id === id);
    setMenu(prev => prev.map(m => m.id === id ? { ...m, availableDays } : m));
    logAudit(`Manager Café (${currentUser?.name || 'Manager'}) menetapkan jadual jualan "${item?.name || id}": [${availableDays.join(', ')}]`, 'CAFÉ');
    showToast(`Jadual jualan "${item?.name || id}" berjaya dikemaskini!`, 'success');
  };

  const addTable = (tbl) => {
    const newId = tbl.id || `M${String(tables.length + 1).padStart(2, '0')}`;
    const newTable = {
      ...tbl,
      id: newId,
      status: tbl.status || 'AVAILABLE',
      activeOrderId: null
    };
    setTables(prev => [...prev, newTable]);
    logAudit(`Menambah meja baru: ${newTable.name || newId}`, 'CAFÉ');
    showToast(`Meja ${newId} berjaya didaftarkan.`);
  };

  const updateTable = (id, updated) => {
    setTables(prev => prev.map(t => t.id === id ? { ...t, ...updated } : t));
    realtimeSync.broadcast('TABLE_UPDATED', { id, updated });
    showToast(`Meja ${id} dikemaskini.`);
  };

  const deleteTable = (id) => {
    setTables(prev => prev.filter(t => t.id !== id));
    logAudit(`Memadam meja ${id}`, 'CAFÉ');
    showToast(`Meja ${id} dipadam.`, 'info');
  };

  // Place Food Order
  const createFoodOrder = ({ orderType, tableId, customerName, customerPhone, pickupTime, items, paymentMethod = 'CASH' }) => {
    if (!items || items.length === 0) {
      showToast('Sila pilih sekurang-kurangnya satu item menu.', 'error');
      return null;
    }

    const orderNum = foodOrders.length + 1;
    const orderId = `ORD-2026-${String(orderNum).padStart(4, '0')}`;
    const receiptNo = `CAF-2026-${String(orderNum).padStart(5, '0')}`;

    const subtotal = items.reduce((acc, it) => acc + (it.price * it.quantity), 0);
    const totalCost = items.reduce((acc, it) => acc + ((it.costPrice || 0) * it.quantity), 0);
    const grossProfit = subtotal - totalCost;

    const newOrder = {
      id: orderId,
      receiptNo,
      orderType,
      tableId: orderType === 'DINE_IN' ? tableId : null,
      customerName: customerName || (orderType === 'DINE_IN' ? `Pelanggan Meja ${tableId}` : 'Pelanggan Bungkus'),
      customerPhone: customerPhone || '-',
      pickupTime: orderType === 'TAKEAWAY' ? (pickupTime || 'Segera') : null,
      items,
      subtotal,
      discount: 0,
      tax: 0,
      grandTotal: subtotal,
      totalCost,
      grossProfit,
      paymentMethod,
      paymentStatus: 'PAID', // In POS/simulated payment, order creates as paid
      orderStatus: 'NEW',
      createdAt: new Date().toISOString(),
      confirmedAt: null,
      preparedAt: null,
      completedAt: null,
      cashierName: currentUser ? currentUser.name : 'NUR Atiqah'
    };

    setFoodOrders(prev => [newOrder, ...prev]);

    // Update Table status if Dine-In
    if (orderType === 'DINE_IN' && tableId) {
      setTables(prev => prev.map(t => t.id === tableId ? { ...t, status: 'OCCUPIED', activeOrderId: orderId } : t));
    }

    // Record Unified Sale
    const newSale = {
      id: `SAL-2026-${String(sales.length + 1).padStart(5, '0')}`,
      receiptNo,
      module: 'CAFÉ',
      referenceId: orderId,
      customerName: newOrder.customerName,
      itemsSummary: items.map(i => `${i.quantity}x ${i.name}`).join(', '),
      costPrice: totalCost,
      sellingPrice: subtotal,
      grossProfit,
      paymentMethod,
      paymentStatus: 'PAID',
      date: new Date().toISOString(),
      cashierName: newOrder.cashierName
    };
    setSales(prev => [newSale, ...prev]);

    // Broadcast across devices (Android Phone <-> Android Tab <-> PC)
    realtimeSync.broadcast('ORDER_CREATED', { order: newOrder, sale: newSale });

    // Add Kitchen notification
    addNotification({
      title: 'Pesanan Dapur Baru!',
      message: `${orderType === 'DINE_IN' ? `Meja ${tableId}` : 'Takeaway'} - ${items.length} item (${orderId})`,
      type: 'ORDER',
      link: 'kitchen'
    });

    logAudit(`Pesanan makanan ${orderId} dicipta (${orderType} - RM ${subtotal.toFixed(2)})`, 'CAFÉ');
    showToast(`Pesanan ${orderId} berjaya dihantar ke Dapur!`);

    return newOrder;
  };

  const updateFoodOrderStatus = (orderId, newStatus) => {
    const now = new Date().toISOString();
    let updatedOrder = null;

    setFoodOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        updatedOrder = {
          ...ord,
          orderStatus: newStatus,
          confirmedAt: newStatus === 'CONFIRMED' && !ord.confirmedAt ? now : ord.confirmedAt,
          preparedAt: (newStatus === 'READY' || newStatus === 'COMPLETED') && !ord.preparedAt ? now : ord.preparedAt,
          completedAt: newStatus === 'COMPLETED' ? now : ord.completedAt
        };
        return updatedOrder;
      }
      return ord;
    }));

    // If order is completed or cancelled, free the table
    if (newStatus === 'COMPLETED' || newStatus === 'CANCELLED') {
      const ord = foodOrders.find(o => o.id === orderId);
      if (ord && ord.tableId) {
        setTables(prev => prev.map(t => t.id === ord.tableId ? { ...t, status: 'AVAILABLE', activeOrderId: null } : t));
      }
    }

    // Broadcast status change across devices (Android Phone <-> Android Tab)
    realtimeSync.broadcast('ORDER_STATUS_UPDATED', { orderId, newStatus });

    logAudit(`Pesanan ${orderId} ditukar status kepada: ${newStatus}`, 'CAFÉ');
    showToast(`Status pesanan ${orderId} kini: ${newStatus}`);
  };

  const cancelFoodOrder = (orderId, reason = 'Permintaan Pelanggan') => {
    const order = foodOrders.find(o => o.id === orderId);
    if (!order) {
      showToast('Pesanan tidak ditemui.', 'error');
      return false;
    }

    // Peraturan: Setelah dibayar dan pihak dapur mula memasak, pesanan tidak boleh dibatalkan atau ditukar
    if (order.orderStatus === 'PREPARING' || order.orderStatus === 'READY' || order.orderStatus === 'COMPLETED') {
      showToast('Pihak dapur telah mula memasak hidangan anda. Pesanan ini TIDAK BOLEH dibatalkan atau ditukar lagi!', 'error');
      return false;
    }

    setFoodOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        return {
          ...ord,
          orderStatus: 'CANCELLED',
          cancelReason: reason,
          cancelledAt: new Date().toISOString()
        };
      }
      return ord;
    }));

    // Kosongkan meja jika dine-in
    if (order.tableId) {
      setTables(prev => prev.map(t => t.id === order.tableId ? { ...t, status: 'AVAILABLE', activeOrderId: null } : t));
    }

    // Broadcast cancellation across devices
    realtimeSync.broadcast('ORDER_CANCELLED', { orderId, reason });

    logAudit(`Pesanan makanan ${orderId} dibatalkan sebelum mula masak (${reason})`, 'CAFÉ');
    showToast(`Pesanan ${orderId} telah berjaya dibatalkan.`, 'info');
    return true;
  };

  // ================= SMARTPHONE REPAIR MODULE ACTIONS ================= //
  const addCustomer = (cust) => {
    const existingCustNums = (customers || []).map(c => {
      const match = c.id && c.id.match(/CUST-(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    });
    const maxCustNum = existingCustNums.length > 0 ? Math.max(...existingCustNums, 0) : 0;
    const newId = `CUST-${String(maxCustNum + 1).padStart(3, '0')}`;
    const newCust = {
      ...cust,
      id: newId,
      dateRegistered: new Date().toISOString().split('T')[0],
      totalRepairs: 0,
      totalSpending: 0,
      lastRepair: '-',
      lastJobId: '-',
      outstandingPayment: 0
    };
    setCustomers(prev => [newCust, ...prev]);
    logAudit(`Mendaftar pelanggan baiki baru: ${newCust.name}`, 'CUSTOMER');
    showToast(`Pelanggan ${newCust.name} didaftarkan.`);
    return newCust;
  };

  const updateCustomer = (id, updated) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updated } : c));
    showToast('Maklumat pelanggan dikemaskini.');
  };

  const deleteCustomer = (customerId) => {
    setCustomers(prev => prev.filter(c => c.id !== customerId));
    logAudit(`Memadam profil pelanggan CRM: ${customerId}`, 'CUSTOMER');
    showToast(`Profil pelanggan ${customerId} telah dipadam.`);
  };

  const deleteRepairJob = (jobId) => {
    // Kawalan Keselamatan & RBAC: Hanya SUPER ADMIN & MANAGER dibenarkan memadam job baiki
    if (currentUser?.role !== 'SUPER ADMIN' && currentUser?.role !== 'MANAGER') {
      showToast('Akses Ditolak: Hanya Super Admin dan Pengurus (Manager) dibenarkan memadam rekod pembaikan!', 'error');
      return false;
    }

    const jobToDelete = (repairJobs || []).find(j => j.id === jobId);
    if (!jobToDelete) {
      showToast('Rekod pembaikan tidak dijumpai.', 'error');
      return false;
    }

    const remainingJobs = (repairJobs || []).filter(j => j.id !== jobId);
    setRepairJobs(remainingJobs);

    // Update customer stats if linked
    setCustomers(prev => prev.map(c => {
      const isMatched = (jobToDelete.customerId && c.id === jobToDelete.customerId) ||
        ((jobToDelete.customerPhone || '').replace(/[^0-9]/g, '') === (c.phone || '').replace(/[^0-9]/g, '')) ||
        (jobToDelete.customerName && c.name && jobToDelete.customerName.trim().toLowerCase() === c.name.trim().toLowerCase());
      if (isMatched) {
        const stats = calculateCustomerStats(c, remainingJobs);
        return {
          ...c,
          ...stats
        };
      }
      return c;
    }));

    logAudit(`Memadam rekod job pembaikan ${jobId} (${jobToDelete.deviceBrand} ${jobToDelete.deviceModel} - ${jobToDelete.customerName})`, 'REPAIR');
    showToast(`Rekod pembaikan ${jobId} telah dipadam.`);
    return true;
  };

  const createRepairJob = (jobData) => {
    // Generate strictly unique, non-repeating Job ID (e.g. REP-2026-00001)
    const existingNums = (repairJobs || []).map(j => {
      const match = j.id && j.id.match(/REP-\d+-(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    });
    const maxNum = existingNums.length > 0 ? Math.max(...existingNums, 0) : 0;
    const nextNum = maxNum + 1;
    const jobId = `REP-2026-${String(nextNum).padStart(5, '0')}`;
    const receiptNo = jobId;

    // Check if diagnosis has been explicitly completed by admin/technician
    const hasDiagnosis = Boolean(jobData.hasDiagnosis);

    // Calculate costs (only calculate active selling price if diagnosis is done)
    const partsCost = (jobData.partsUsed || []).reduce((acc, p) => acc + ((p.costPrice || 0) * (p.quantity || 1)), 0);
    const partsSelling = (jobData.partsUsed || []).reduce((acc, p) => acc + ((p.sellingPrice || 0) * (p.quantity || 1)), 0);
    const labourCost = hasDiagnosis ? Number(jobData.labourCost || 0) : 0;
    const totalCost = partsCost + labourCost;
    const sellingPrice = hasDiagnosis ? Number(jobData.sellingPrice || (partsSelling + labourCost)) : 0;
    const grossProfit = hasDiagnosis ? (sellingPrice - partsCost) : 0;

    // Auto-link or auto-register into CRM Customers database
    const cleanPhone = (jobData.customerPhone || '').replace(/[^0-9]/g, '');
    let matchedCust = (customers || []).find(c => {
      if (jobData.customerId && c.id === jobData.customerId) return true;
      const cPhone = (c.phone || '').replace(/[^0-9]/g, '');
      return (cleanPhone && cPhone && cleanPhone === cPhone) ||
             (jobData.customerName && c.name && c.name.trim().toLowerCase() === jobData.customerName.trim().toLowerCase());
    });

    let assignedCustomerId = matchedCust ? matchedCust.id : jobData.customerId;

    if (matchedCust) {
      // Update existing customer in CRM (Do not add price to totalSpending if pending diagnosis)
      setCustomers(prev => prev.map(c => c.id === matchedCust.id ? {
        ...c,
        totalRepairs: (c.totalRepairs || 0) + 1,
        totalSpending: hasDiagnosis ? (c.totalSpending || 0) + sellingPrice : (c.totalSpending || 0),
        lastRepair: new Date().toISOString().split('T')[0],
        lastJobId: jobId,
        lastJobStatus: jobData.repairStatus || 'RECEIVED'
      } : c));
    } else if (jobData.customerName && jobData.customerPhone) {
      // Auto-register new customer in CRM with 0 spending until technician completes diagnosis
      const existingCustNums = (customers || []).map(c => {
        const match = c.id && c.id.match(/CUST-(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
      });
      const maxCustNum = existingCustNums.length > 0 ? Math.max(...existingCustNums, 0) : 0;
      const newCustId = `CUST-${String(maxCustNum + 1).padStart(3, '0')}`;
      assignedCustomerId = newCustId;

      const newCustomer = {
        id: newCustId,
        name: jobData.customerName.trim(),
        phone: jobData.customerPhone.trim(),
        email: jobData.customerEmail || '',
        address: jobData.customerAddress || '-',
        dateRegistered: new Date().toISOString().split('T')[0],
        totalRepairs: 1,
        totalSpending: hasDiagnosis ? sellingPrice : 0,
        lastRepair: new Date().toISOString().split('T')[0],
        lastJobId: jobId,
        lastJobStatus: jobData.repairStatus || 'RECEIVED',
        outstandingPayment: 0
      };
      setCustomers(prev => [newCustomer, ...prev]);
      logAudit(`Mendaftar pelanggan baiki baru secara automatik dari pendaftaran job: ${newCustomer.name} (${jobId})`, 'CUSTOMER');
    }

    const newJob = {
      ...jobData,
      id: jobId,
      receiptNo,
      customerId: assignedCustomerId,
      dateReceived: jobData.dateReceived || new Date().toISOString(),
      partsCost,
      labourCost,
      totalCost,
      sellingPrice,
      grossProfit,
      hasDiagnosis,
      quotationStatus: jobData.quotationStatus || 'PENDING',
      repairStatus: jobData.repairStatus || 'RECEIVED',
      paymentStatus: 'PENDING',
      paymentMethod: null,
      warrantyPeriod: jobData.warrantyPeriod || '30 Hari Waranti Servis GIATMARA',
      completedAt: null
    };

    setRepairJobs(prev => [newJob, ...prev]);

    // Add Notification
    addNotification({
      title: 'Job Baiki Baru Diterima!',
      message: `${newJob.deviceBrand} ${newJob.deviceModel} (${newJob.customerName}) - ${jobId}`,
      type: 'REPAIR',
      link: 'repair-jobs'
    });

    logAudit(`Menerima peranti untuk dibaiki ${jobId} (${newJob.deviceBrand} ${newJob.deviceModel})`, 'REPAIR');
    showToast(`Job pembaikan ${jobId} berjaya didaftarkan!`);
    return newJob;
  };

  const updateRepairJob = (id, updated) => {
    let nextJobsSnapshot = null;

    setRepairJobs(prev => {
      const nextJobs = prev.map(j => {
        if (j.id === id) {
          const merged = { ...j, ...updated };
          const hasDiag = merged.hasDiagnosis !== undefined ? Boolean(merged.hasDiagnosis) : Boolean(j.hasDiagnosis);
          const partsCost = (merged.partsUsed || []).reduce((acc, p) => acc + ((p.costPrice || 0) * (p.quantity || 1)), 0);
          const labourCost = Number(merged.labourCost || 0);
          const totalCost = partsCost + labourCost;
          const sellingPrice = Number(merged.sellingPrice || 0);
          const grossProfit = sellingPrice - partsCost;
          return {
            ...merged,
            partsCost,
            totalCost,
            sellingPrice,
            grossProfit,
            hasDiagnosis: hasDiag
          };
        }
        return j;
      });
      nextJobsSnapshot = nextJobs;
      return nextJobs;
    });

    // Real-time synchronization with CRM customers
    setCustomers(prev => prev.map(c => {
      const targetJob = (repairJobs || []).find(j => j.id === id);
      const isMatched = targetJob && (
        (targetJob.customerId && c.id === targetJob.customerId) ||
        ((targetJob.customerPhone || '').replace(/[^0-9]/g, '') === (c.phone || '').replace(/[^0-9]/g, '')) ||
        (targetJob.customerName && c.name && targetJob.customerName.trim().toLowerCase() === c.name.trim().toLowerCase())
      );
      if (isMatched) {
        const stats = calculateCustomerStats(c, nextJobsSnapshot || repairJobs);
        return {
          ...c,
          ...stats,
          ...(updated.customerName ? { name: updated.customerName.trim() } : {}),
          ...(updated.customerPhone ? { phone: updated.customerPhone.trim() } : {}),
          ...(updated.customerEmail ? { email: updated.customerEmail.trim() } : {}),
          ...(updated.customerAddress ? { address: updated.customerAddress.trim() } : {})
        };
      }
      return c;
    }));

    logAudit(`Mengemas kini butiran/diagnosis job baiki ${id}`, 'REPAIR');
    showToast(`Job ${id} berjaya dikemaskini.`);
  };

  const approveRepairQuotation = (jobId) => {
    const job = repairJobs.find(j => j.id === jobId);
    if (!job) return;

    // Deduct spare parts from central inventory
    if (job.partsUsed && job.partsUsed.length > 0) {
      job.partsUsed.forEach(part => {
        if (part.partId && part.source !== 'ONLINE' && !part.isManual) {
          adjustStock(part.partId, part.quantity || 1, 'USED_FOR_REPAIR', `${jobId} (${job.customerName})`);
        }
      });
    }

    setRepairJobs(prev => prev.map(j => j.id === jobId ? {
      ...j,
      quotationStatus: 'APPROVED',
      repairStatus: 'REPAIRING'
    } : j));

    logAudit(`Sebut harga ${jobId} DILULUSKAN oleh pelanggan. Status: REPAIRING & Stok alat ganti ditolak.`, 'REPAIR');
    showToast(`Sebut harga ${jobId} diluluskan! Memulakan pembaikan.`);
  };

  const rejectRepairQuotation = (jobId) => {
    setRepairJobs(prev => prev.map(j => j.id === jobId ? {
      ...j,
      quotationStatus: 'REJECTED',
      repairStatus: 'CANCELLED'
    } : j));
    logAudit(`Sebut harga ${jobId} DITOLAK oleh pelanggan.`, 'REPAIR');
    showToast(`Sebut harga ${jobId} telah ditolak.`, 'info');
  };

  const updateRepairStatus = (jobId, newStatus) => {
    const job = (repairJobs || []).find(j => j.id === jobId);
    if (job && job.repairStatus === 'RECEIVED' && newStatus !== 'RECEIVED' && newStatus !== 'CANCELLED' && (!job.hasDiagnosis || Number(job.sellingPrice || 0) <= 0)) {
      showToast('Status tidak boleh diubah! Sila lengkapkan ruangan "Diagnosis & Alat Ganti" dan simpan sebut harga terlebih dahulu.', 'warning');
      return;
    }

    const now = new Date().toISOString();
    setRepairJobs(prev => prev.map(j => j.id === jobId ? {
      ...j,
      repairStatus: newStatus,
      completedAt: (newStatus === 'READY FOR COLLECTION' || newStatus === 'COMPLETED') && !j.completedAt ? now : j.completedAt
    } : j));

    // Real-time synchronization of customer status in CRM
    const targetJob = (repairJobs || []).find(j => j.id === jobId);
    if (targetJob) {
      setCustomers(prev => prev.map(c => {
        const isMatched = (targetJob.customerId && c.id === targetJob.customerId) ||
          ((targetJob.customerPhone || '').replace(/[^0-9]/g, '') === (c.phone || '').replace(/[^0-9]/g, '')) ||
          (targetJob.customerName && c.name && targetJob.customerName.trim().toLowerCase() === c.name.trim().toLowerCase());
        if (isMatched) {
          return {
            ...c,
            lastJobStatus: newStatus,
            lastRepair: new Date().toISOString().split('T')[0],
            lastJobId: jobId
          };
        }
        return c;
      }));
    }

    if (newStatus === 'READY FOR COLLECTION') {
      const job = repairJobs.find(j => j.id === jobId);
      addNotification({
        title: 'Telefon Sedia Untuk Kutipan!',
        message: `${job ? `${job.deviceBrand} ${job.deviceModel}` : 'Peranti'} (${jobId}) telah siap & melepasi ujian.`,
        type: 'REPAIR',
        link: 'repair-jobs'
      });
    }

    logAudit(`Status job baiki ${jobId} ditukar kepada: ${newStatus}`, 'REPAIR');
    showToast(`Status ${jobId} dikemaskini kepada: ${newStatus}`);
  };

  const payRepairJob = (jobId, paymentMethod = 'CASH') => {
    const job = repairJobs.find(j => j.id === jobId);
    if (!job) return;

    const now = new Date().toISOString();

    setRepairJobs(prev => prev.map(j => j.id === jobId ? {
      ...j,
      paymentStatus: 'PAID',
      paymentMethod,
      repairStatus: 'COMPLETED',
      completedAt: j.completedAt || now
    } : j));

    // Update Customer payment record in CRM
    setCustomers(prev => prev.map(c => {
      const isMatched = (job.customerId && c.id === job.customerId) ||
        ((job.customerPhone || '').replace(/[^0-9]/g, '') === (c.phone || '').replace(/[^0-9]/g, ''));
      if (isMatched) {
        return {
          ...c,
          outstandingPayment: 0,
          lastJobStatus: 'COMPLETED'
        };
      }
      return c;
    }));

    // Record Unified Sale
    const newSale = {
      id: `SAL-2026-${String(sales.length + 1).padStart(5, '0')}`,
      receiptNo: job.receiptNo || job.id,
      module: 'REPAIR',
      referenceId: jobId,
      customerName: job.customerName,
      itemsSummary: `Baiki ${job.deviceBrand} ${job.deviceModel} (${job.damageType})`,
      costPrice: job.partsCost,
      sellingPrice: job.sellingPrice,
      grossProfit: job.grossProfit,
      paymentMethod,
      paymentStatus: 'PAID',
      date: now,
      cashierName: currentUser ? currentUser.name : 'Mohd Nabil'
    };
    setSales(prev => [newSale, ...prev]);

    logAudit(`Bayaran pembaikan ${jobId} diterima: RM ${job.sellingPrice.toFixed(2)} (${paymentMethod})`, 'PAYMENT');
    showToast(`Bayaran ${jobId} sebanyak RM ${job.sellingPrice.toFixed(2)} berjaya!`);

    // Open receipt preview
    openReceipt({
      type: 'REPAIR',
      job: { ...job, paymentStatus: 'PAID', paymentMethod },
      sale: newSale
    });
  };

  // ================= ACCESSORIES POS ACTIONS ================= //
  const sellAccessories = ({ items, customerName = 'Pelanggan Walk-in', paymentMethod = 'CASH' }) => {
    if (!items || items.length === 0) {
      showToast('Sila pilih sekurang-kurangnya satu aksesori.', 'error');
      return null;
    }

    const saleNum = sales.length + 1;
    const receiptNo = `ACC-2026-${String(saleNum).padStart(5, '0')}`;
    const subtotal = items.reduce((acc, it) => acc + (it.sellingPrice * it.quantity), 0);
    const totalCost = items.reduce((acc, it) => acc + (it.costPrice * it.quantity), 0);
    const grossProfit = subtotal - totalCost;

    // Deduct stock for each accessory
    items.forEach(it => {
      adjustStock(it.id, it.quantity, 'SOLD', `POS Aksesori (${receiptNo})`);
    });

    const newSale = {
      id: `SAL-2026-${String(saleNum).padStart(5, '0')}`,
      receiptNo,
      module: 'ACCESSORIES',
      referenceId: `POS-ACC-${Date.now().toString().slice(-4)}`,
      customerName,
      itemsSummary: items.map(i => `${i.quantity}x ${i.name}`).join(', '),
      costPrice: totalCost,
      sellingPrice: subtotal,
      grossProfit,
      paymentMethod,
      paymentStatus: 'PAID',
      date: new Date().toISOString(),
      cashierName: currentUser ? currentUser.name : 'Mohd Nabil'
    };

    setSales(prev => [newSale, ...prev]);

    logAudit(`Jualan aksesori ${receiptNo} selesai: RM ${subtotal.toFixed(2)}`, 'ACCESSORIES');
    showToast(`Jualan aksesori ${receiptNo} berjaya direkod!`);

    const receiptObj = {
      type: 'ACCESSORIES',
      receiptNo,
      items,
      subtotal,
      discount: 0,
      grandTotal: subtotal,
      paymentMethod,
      customerName,
      date: new Date().toISOString(),
      cashierName: newSale.cashierName
    };

    openReceipt(receiptObj);
    return newSale;
  };

  // ================= INVENTORY & PROCUREMENT ACTIONS ================= //
  const adjustStock = (itemId, changeQty, transactionType, reference = '') => {
    let beforeQty = 0;
    let afterQty = 0;
    let itemName = '';

    setInventory(prev => prev.map(item => {
      if (item.id === itemId) {
        beforeQty = item.currentStock;
        if (['STOCK_IN', 'RETURNED'].includes(transactionType)) {
          afterQty = beforeQty + changeQty;
        } else {
          afterQty = Math.max(0, beforeQty - changeQty);
        }
        itemName = item.name;

        // Auto trigger Low Stock alert if <= minStock
        const status = afterQty <= item.minStock ? (afterQty === 0 ? 'OUT_OF_STOCK' : 'LOW_STOCK') : 'IN_STOCK';

        if (afterQty <= item.minStock) {
          addNotification({
            title: 'Amaran Stok Rendah!',
            message: `Stok "${item.name}" berbaki ${afterQty} ${item.unit} (Min: ${item.minStock} ${item.unit}). Sila buat pesanan pembelian.`,
            type: 'STOCK',
            link: 'low-stock'
          });
        }

        return {
          ...item,
          currentStock: afterQty,
          status
        };
      }
      return item;
    }));

    // Record Stock Movement Transaction
    const newTx = {
      id: `TX-${Date.now().toString().slice(-5)}`,
      date: new Date().toISOString(),
      itemId,
      itemName,
      type: transactionType,
      quantity: changeQty,
      beforeQty,
      afterQty,
      reference: reference || 'Pelarasan Manual',
      user: currentUser ? currentUser.name : 'Sistem'
    };
    setStockTransactions(prev => [newTx, ...prev]);
  };

  const addInventoryItem = (item) => {
    const defaultPrefix = item.category?.includes('Café') ? 'CF' : item.category?.includes('Packaging') ? 'PKG' : item.category?.includes('Spare') ? 'SP' : 'ACC';
    const newId = item.id || `INV-${defaultPrefix}-${String(Date.now()).slice(-4)}`;
    const currentStock = Number(item.currentStock || 0);
    const minStock = Number(item.minStock || 5);
    const newItem = {
      ...item,
      id: newId,
      sku: item.sku || `${defaultPrefix}-${Date.now().toString().slice(-6)}`,
      category: item.category || 'Smartphone Accessories',
      brand: item.brand || 'Umum',
      model: item.model || 'Universal',
      unit: item.unit || 'Unit',
      location: item.location || 'Etalase Aksesori Hadapan',
      currentStock,
      minStock,
      costPrice: Number(item.costPrice || 0),
      sellingPrice: Number(item.sellingPrice || 0),
      status: currentStock <= minStock ? (currentStock <= 0 ? 'OUT_OF_STOCK' : 'LOW_STOCK') : 'IN_STOCK'
    };
    setInventory(prev => [newItem, ...prev]);

    // Record initial stock transaction to keep stock system in sync
    if (currentStock > 0) {
      const newTx = {
        id: `TX-${Date.now().toString().slice(-5)}`,
        date: new Date().toISOString(),
        itemId: newId,
        itemName: newItem.name,
        type: 'IN',
        quantity: currentStock,
        beforeQty: 0,
        afterQty: currentStock,
        reference: 'Pendaftaran Aksesori & Stok Awal',
        user: currentUser ? `${currentUser.name} (${currentUser.role})` : 'Staf Sistem'
      };
      setStockTransactions(prev => [newTx, ...prev]);
    }

    logAudit(`Menambah item aksesori/inventori baru: ${newItem.name} (${newItem.sku}) dengan stok ${currentStock} ${newItem.unit}`, 'INVENTORY');
    showToast(`Aksesori "${newItem.name}" berjaya didaftarkan dan stok ${currentStock} unit telah ditambah ke sistem!`, 'success');
    return newItem;
  };

  const updateInventoryItem = (id, updated) => {
    setInventory(prev => prev.map(it => {
      if (it.id === id) {
        const stock = updated.currentStock !== undefined ? Number(updated.currentStock) : it.currentStock;
        const minStock = updated.minStock !== undefined ? Number(updated.minStock) : it.minStock;
        const status = stock <= minStock ? (stock === 0 ? 'OUT_OF_STOCK' : 'LOW_STOCK') : 'IN_STOCK';
        return { ...it, ...updated, currentStock: stock, minStock, status };
      }
      return it;
    }));
    logAudit(`Mengemas kini item inventori: ${id}`, 'INVENTORY');
    showToast('Inventori dikemaskini.');
  };

  // Super Admin completely removes an accessory / inventory item
  const deleteInventoryItem = (id, reason = '') => {
    const item = inventory.find(it => it.id === id);
    if (!item) return;

    if (currentUser?.role !== 'SUPER ADMIN') {
      showToast('Akses Ditolak: Hanya Super Admin yang dibenarkan memadam item aksesori ini sepenuhnya.', 'error');
      return;
    }

    setInventory(prev => prev.filter(it => it.id !== id));
    logAudit(`Super Admin (${currentUser.name}) memadam item aksesori: "${item.name}" (${item.sku || id}) sepenuhnya. Ulasan/Sebab: ${reason || 'Tiada'}`, 'INVENTORY');
    showToast(`Aksesori "${item.name}" telah berjaya dipadam sepenuhnya oleh Super Admin.`, 'success');
  };

  // Manager or Super Admin requests removal with required reason/comment
  const requestRemoveInventoryItem = (id, reason) => {
    const item = inventory.find(it => it.id === id);
    if (!item) return;

    setInventory(prev => prev.map(it => {
      if (it.id === id) {
        return {
          ...it,
          removalRequested: true,
          removalReason: reason,
          removalRequestedBy: currentUser ? `${currentUser.name} (${currentUser.role})` : 'Manager Smartphone Repair',
          removalRequestedAt: new Date().toISOString(),
          removalStatus: 'PENDING_APPROVAL'
        };
      }
      return it;
    }));

    logAudit(`Permohonan padam aksesori: "${item.name}" (${id}) dihantar oleh ${currentUser?.name || 'Manager'}. Ulasan: ${reason}`, 'INVENTORY');
    showToast(`Permohonan membuang aksesori "${item.name}" telah direkodkan. Menunggu kelulusan Super Admin.`, 'info');
  };

  // Cancel / reject removal request
  const cancelRemoveInventoryItem = (id) => {
    setInventory(prev => prev.map(it => {
      if (it.id === id) {
        const copy = { ...it };
        delete copy.removalRequested;
        delete copy.removalReason;
        delete copy.removalRequestedBy;
        delete copy.removalRequestedAt;
        delete copy.removalStatus;
        return copy;
      }
      return it;
    }));

    logAudit(`Permohonan buang aksesori (${id}) dibatalkan oleh ${currentUser?.name || 'Admin'}`, 'INVENTORY');
    showToast('Permohonan membuang aksesori telah dibatalkan.');
  };

  // Super Admin: Configure store-wide accessory discount & cheap sale promo
  const updateAccessoryDiscount = (newDiscount) => {
    if (currentUser && currentUser.role !== 'SUPER ADMIN') {
      showToast('Akses Ditolak: Hanya Super Admin dibenarkan menetapkan tawaran diskaun aksesori.', 'error');
      return;
    }

    const updated = {
      ...accessoryDiscount,
      ...newDiscount,
      percentage: Math.max(0, Math.min(100, Number(newDiscount.percentage) || 0)),
      updatedBy: currentUser ? `${currentUser.name} (${currentUser.role})` : 'Super Admin',
      updatedAt: new Date().toISOString()
    };

    setAccessoryDiscount(updated);
    logAudit(`Super Admin (${currentUser?.name || 'Super Admin'}) mengemaskini tawaran diskaun aksesori: ${updated.isActive ? `Aktif (${updated.percentage}%)` : 'Dinyahaktifkan'} - "${updated.title}"`, 'PROMOTION');
    showToast(updated.isActive ? `Tawaran diskaun ${updated.percentage}% berjaya diaktifkan!` : 'Tawaran diskaun aksesori telah dinyahaktifkan.', 'success');
  };

  // Procurement: Purchase Request -> Manager Approval -> PO -> Stock Received
  const createPurchaseRequest = (prData) => {
    const prNum = purchaseRequests.length + 1;
    const prId = `PR-2026-${String(prNum).padStart(4, '0')}`;

    const totalAmount = (prData.items || []).reduce((acc, it) => acc + (it.quantity * it.unitCost), 0);

    const newPR = {
      ...prData,
      id: prId,
      requestDate: new Date().toISOString(),
      requesterName: currentUser ? `${currentUser.name} (${currentUser.role})` : 'Staf TRIG',
      totalAmount,
      status: 'PENDING_APPROVAL',
      managerRemarks: '',
      approvedBy: null,
      approvedAt: null
    };

    setPurchaseRequests(prev => [newPR, ...prev]);

    // Notify Manager
    addNotification({
      title: 'Permohonan Pembelian Baru!',
      message: `PR ${prId} (RM ${totalAmount.toFixed(2)}) memerlukan kelulusan Pengurus.`,
      type: 'APPROVAL',
      link: 'purchase-requests'
    });

    logAudit(`Membuat Permohonan Pembelian ${prId} (RM ${totalAmount.toFixed(2)})`, 'PROCUREMENT');
    showToast(`Permohonan Pembelian ${prId} dihantar untuk kelulusan.`);
    return newPR;
  };

  const approvePurchaseRequest = (prId, remarks = 'Diluluskan.') => {
    const pr = purchaseRequests.find(p => p.id === prId);
    if (!pr) return;

    const now = new Date().toISOString();
    setPurchaseRequests(prev => prev.map(p => p.id === prId ? {
      ...p,
      status: 'APPROVED',
      managerRemarks: remarks,
      approvedBy: currentUser ? currentUser.name : 'Muhammad Aizat (Pengurus Operasi)',
      approvedAt: now
    } : p));

    // Automatically generate PO
    const poNum = purchaseOrders.length + 1;
    const poId = `PO-2026-${String(poNum).padStart(4, '0')}`;
    const newPO = {
      id: poId,
      prId,
      poDate: now,
      supplierId: pr.supplierId,
      supplierName: pr.supplierName,
      items: pr.items,
      totalAmount: pr.totalAmount,
      expectedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'ORDERED',
      receivedDate: null,
      receivedBy: null
    };

    setPurchaseOrders(prev => [newPO, ...prev]);

    logAudit(`Pengurus meluluskan ${prId} dan menjana PO ${poId}`, 'PROCUREMENT');
    showToast(`PR ${prId} diluluskan! PO ${poId} telah dikeluarkan kepada pembekal.`);
  };

  const rejectPurchaseRequest = (prId, remarks = 'Ditolak.') => {
    setPurchaseRequests(prev => prev.map(p => p.id === prId ? {
      ...p,
      status: 'REJECTED',
      managerRemarks: remarks,
      approvedBy: currentUser ? currentUser.name : 'Muhammad Aizat (Pengurus Operasi)',
      approvedAt: new Date().toISOString()
    } : p));
    logAudit(`Pengurus menolak permohonan pembelian ${prId}`, 'PROCUREMENT');
    showToast(`PR ${prId} telah ditolak.`, 'info');
  };

  const receivePurchaseOrder = (poId) => {
    const po = purchaseOrders.find(p => p.id === poId);
    if (!po) return;

    const now = new Date().toISOString();
    setPurchaseOrders(prev => prev.map(p => p.id === poId ? {
      ...p,
      status: 'RECEIVED',
      receivedDate: now,
      receivedBy: currentUser ? currentUser.name : 'Staf Stor TRIG'
    } : p));

    // Update PR status
    if (po.prId) {
      setPurchaseRequests(prev => prev.map(p => p.id === po.prId ? { ...p, status: 'RECEIVED' } : p));
    }

    // Increment central inventory for each item
    (po.items || []).forEach(it => {
      adjustStock(it.itemId, it.quantity, 'STOCK_IN', `Terima PO ${poId}`);
    });

    logAudit(`Menerima barang untuk PO ${poId}. Stok inventori dikemaskini.`, 'PROCUREMENT');
    showToast(`Pesanan ${poId} telah diterima & stok dimasukkan ke inventori!`);
  };

  // ================= SUPPLIERS & TOOLS ================= //
  const addSupplier = (sup) => {
    const newId = `SUP-${String(suppliers.length + 1).padStart(3, '0')}`;
    const newSup = { ...sup, id: newId, totalPurchases: 0, status: 'ACTIVE' };
    setSuppliers(prev => [newSup, ...prev]);
    showToast(`Pembekal ${newSup.name} ditambah.`);
  };

  const updateSupplier = (id, updated) => {
    setSuppliers(prev => prev.map(s => s.id === id ? { ...s, ...updated } : s));
    showToast('Maklumat pembekal dikemaskini.');
  };

  const addRepairTool = (tool) => {
    const newId = `TOOL-${String(repairTools.length + 1).padStart(3, '0')}`;
    const newTool = { ...tool, id: newId };
    setRepairTools(prev => [newTool, ...prev]);
    showToast(`Peralatan ${newTool.name} didaftarkan.`);
  };

  const updateRepairTool = (id, updated) => {
    setRepairTools(prev => prev.map(t => t.id === id ? { ...t, ...updated } : t));
    logAudit(`Mengemas kini peralatan bengkel: ${id}`, 'REPAIR');
    showToast('Status peralatan dikemaskini.');
  };

  const deleteRepairTool = (id) => {
    const tool = repairTools.find(t => t.id === id);
    setRepairTools(prev => prev.filter(t => t.id !== id));
    logAudit(`Memadam peralatan bengkel: ${tool ? tool.name : id}`, 'REPAIR');
    showToast('Peralatan telah dipadam.', 'info');
  };

  // ================= USERS & SETTINGS ================= //
  const addUser = (usr) => {
    const newId = `USR-${String(users.length + 1).padStart(3, '0')}`;
    const newUser = { ...usr, id: newId, status: 'ACTIVE' };
    setUsers(prev => [...prev, newUser]);
    showToast(`Pengguna ${newUser.name} ditambah.`);
  };

  const updateUser = (id, updated) => {
    setUsers(prev => {
      const nextUsers = prev.map(u => u.id === id ? { ...u, ...updated } : u);
      localStorage.setItem('trig_users', JSON.stringify(nextUsers));
      return nextUsers;
    });

    if (currentUser?.id === id) {
      setCurrentUser(prev => {
        const nextCurrent = { ...prev, ...updated };
        localStorage.setItem('trig_currentUser', JSON.stringify(nextCurrent));
        return nextCurrent;
      });
    }

    if (updated.role === 'SUPER ADMIN' || updated.username === 'admin') {
      showToast('Kata laluan & data Super Admin berjaya dikemaskini. Password baru kini aktif!', 'success');
      logAudit('Super Admin mengemaskini kata laluan / profil akaun', 'AUTH');
    } else {
      showToast('Maklumat pengguna dikemaskini.', 'success');
    }
  };

  const deleteUser = (id) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    showToast('Pengguna dipadam.', 'info');
  };

  const updateSettingsData = (newSet) => {
    setSettings(prev => ({ ...prev, ...newSet }));
    logAudit('Mengemas kini tetapan sistem & profil perniagaan', 'SETTINGS');
    showToast('Tetapan sistem berjaya disimpan.');
  };

  // Notifications
  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    showToast('Semua notifikasi ditandakan telah dibaca.');
  };

  // Reset Demo Data
  const resetDemoData = () => {
    localStorage.clear();
    localStorage.setItem('trig_users_storage_version', USERS_STORAGE_VERSION);
    setSettings(INITIAL_SETTINGS);
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setCategories(INITIAL_MENU_CATEGORIES);
    setMenu(INITIAL_MENU);
    setTables(INITIAL_TABLES);
    setFoodOrders(INITIAL_FOOD_ORDERS);
    setCustomers(INITIAL_CUSTOMERS);
    setRepairJobs(INITIAL_REPAIR_JOBS);
    setInventory(INITIAL_INVENTORY);
    setRepairTools(INITIAL_REPAIR_TOOLS);
    setSuppliers(INITIAL_SUPPLIERS);
    setPurchaseRequests(INITIAL_PURCHASE_REQUESTS);
    setPurchaseOrders(INITIAL_PURCHASE_ORDERS);
    setStockTransactions(INITIAL_STOCK_TRANSACTIONS);
    setSales(INITIAL_SALES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setCurrentTab('dashboard');
    showToast('Semua data demo telah diset semula kepada keadaan asal!', 'info');
  };

  // KPI Calculations
  const todayStr = new Date().toISOString().split('T')[0];

  const todaySales = sales
    .filter(s => s.date.startsWith(todayStr))
    .reduce((acc, s) => acc + s.sellingPrice, 0);

  const cafeSales = sales
    .filter(s => s.module === 'CAFÉ')
    .reduce((acc, s) => acc + s.sellingPrice, 0);

  const repairSales = sales
    .filter(s => s.module === 'REPAIR')
    .reduce((acc, s) => acc + s.sellingPrice, 0);

  const accessoriesSales = sales
    .filter(s => s.module === 'ACCESSORIES')
    .reduce((acc, s) => acc + s.sellingPrice, 0);

  const totalSales = sales.reduce((acc, s) => acc + s.sellingPrice, 0);
  const totalCost = sales.reduce((acc, s) => acc + (s.costPrice || 0), 0);
  const totalProfit = sales.reduce((acc, s) => acc + (s.grossProfit || 0), 0);

  const activeFoodOrdersCount = foodOrders.filter(o => ['NEW', 'CONFIRMED', 'PREPARING', 'READY'].includes(o.orderStatus)).length;
  const activeRepairJobsCount = repairJobs.filter(j => !['COMPLETED', 'CANCELLED'].includes(j.repairStatus)).length;
  const lowStockCount = (inventory || []).filter(i => (i.currentStock || 0) <= (i.minStock || 0)).length;
  const pendingPurchasesCount = (purchaseRequests || []).filter(p => p.status === 'PENDING_APPROVAL').length;
  const unreadNotifCount = (notifications || []).filter(n => !n.isRead).length;
  const totalInventoryValue = (inventory || []).reduce((acc, i) => acc + ((i.currentStock || 0) * (i.costPrice || 0)), 0);

  const value = {
    settings,
    users,
    currentUser,
    setCurrentUser,
    switchUser,
    categories,
    menu,
    tables,
    foodOrders,
    customers,
    repairJobs,
    inventory,
    repairTools,
    suppliers,
    purchaseRequests,
    purchaseOrders,
    stockTransactions,
    sales,
    notifications,
    auditLogs,
    currentTab,
    setCurrentTab,
    activeSystemMode,
    switchSystemMode,
    selectedTableForCustomer,
    setSelectedTableForCustomer,
    toast,
    showToast,
    receiptData,
    isReceiptModalOpen,
    setIsReceiptModalOpen,
    openReceipt,
    isGlobalSearchOpen,
    setIsGlobalSearchOpen,
    isStaffLoggedIn,
    setIsStaffLoggedIn,
    logoutStaff,
    // Realtime Sync
    syncStatus,
    realtimeSync,
    // Operations
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    updateMenuSchedule,
    DAYS_OF_WEEK,
    getCurrentDayMalay,
    isMenuItemAvailableToday,
    addTable,
    updateTable,
    deleteTable,
    createFoodOrder,
    updateFoodOrderStatus,
    cancelFoodOrder,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    createRepairJob,
    updateRepairJob,
    deleteRepairJob,
    approveRepairQuotation,
    rejectRepairQuotation,
    updateRepairStatus,
    payRepairJob,
    sellAccessories,
    adjustStock,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    requestRemoveInventoryItem,
    cancelRemoveInventoryItem,
    accessoryDiscount,
    updateAccessoryDiscount,
    createPurchaseRequest,
    approvePurchaseRequest,
    rejectPurchaseRequest,
    receivePurchaseOrder,
    addSupplier,
    updateSupplier,
    addRepairTool,
    updateRepairTool,
    deleteRepairTool,
    addUser,
    updateUser,
    deleteUser,
    updateSettingsData,
    markNotificationRead,
    markAllNotificationsRead,
    resetDemoData,
    logAudit,
    // Live KPIs
    kpis: {
      todaySales,
      cafeSales,
      repairSales,
      accessoriesSales,
      totalSales,
      totalCost,
      totalProfit,
      totalInventoryValue,
      activeFoodOrdersCount,
      activeRepairJobsCount,
      lowStockCount,
      pendingPurchasesCount,
      unreadNotifCount
    }
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
