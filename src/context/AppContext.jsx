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

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Helper to load or fallback to initial
  const USERS_STORAGE_VERSION = 'v2.2_wan_muhadir';

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
      if (v !== USERS_STORAGE_VERSION) {
        localStorage.setItem('trig_users_storage_version', USERS_STORAGE_VERSION);
        localStorage.setItem('trig_users', JSON.stringify(INITIAL_USERS));
        localStorage.setItem('trig_currentUser', JSON.stringify(INITIAL_USERS[0]));
        return INITIAL_USERS;
      }
      const saved = localStorage.getItem('trig_users');
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch (e) {
      return INITIAL_USERS;
    }
  };

  const loadCurrentUserStorage = () => {
    try {
      const v = localStorage.getItem('trig_users_storage_version');
      if (v !== USERS_STORAGE_VERSION) {
        return INITIAL_USERS[0];
      }
      const saved = localStorage.getItem('trig_currentUser');
      return saved ? JSON.parse(saved) : INITIAL_USERS[0];
    } catch (e) {
      return INITIAL_USERS[0];
    }
  };

  // State initialization
  const [settings, setSettings] = useState(() => loadStorage('settings', INITIAL_SETTINGS));
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

  // UI state
  const [currentTab, setCurrentTabState] = useState('portal');
  const [activeSystemMode, setActiveSystemMode] = useState('PORTAL'); // 'PORTAL', 'MASAKAN', 'REPAIR', 'MANAGEMENT'
  const [selectedTableForCustomer, setSelectedTableForCustomer] = useState(null);
  const [toast, setToast] = useState(null);
  const [receiptData, setReceiptData] = useState(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);

  // Tab switcher that automatically updates the system mode
  const setCurrentTab = (tab) => {
    setCurrentTabState(tab);
    if (tab === 'portal') {
      setActiveSystemMode('PORTAL');
    } else if (['cafe-dashboard', 'menu', 'tables', 'qr-tables', 'food-ordering', 'kitchen', 'food-orders', 'customer-order'].includes(tab)) {
      setActiveSystemMode('MASAKAN');
    } else if (['repair-dashboard', 'customers', 'repair-jobs', 'repair-tools', 'accessories-pos', 'customer-repair-tracker'].includes(tab)) {
      setActiveSystemMode('REPAIR');
    } else {
      setActiveSystemMode('MANAGEMENT');
    }
  };

  const switchSystemMode = (mode) => {
    setActiveSystemMode(mode);
    if (mode === 'PORTAL') {
      setCurrentTabState('portal');
    } else if (mode === 'MASAKAN') {
      setCurrentTabState('cafe-dashboard');
    } else if (mode === 'REPAIR') {
      setCurrentTabState('repair-dashboard');
    } else {
      setCurrentTabState('dashboard');
    }
  };

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
  const switchUser = (roleOrUsernameOrId) => {
    if (!roleOrUsernameOrId) return false;
    const target = String(roleOrUsernameOrId).toLowerCase().trim();
    const found = users.find(u => 
      u.id?.toLowerCase() === target ||
      u.username?.toLowerCase() === target ||
      u.role?.toLowerCase() === target ||
      u.name?.toLowerCase() === target
    );
    if (found) {
      setCurrentUser(found);
      showToast(`Log masuk sebagai: ${found.name} (${found.role})`, 'info');
      logAudit(`Log masuk pengguna sebagai ${found.role}`, 'AUTH');
      if (found.role === 'CUSTOMER') {
        setCurrentTab('customer-order');
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
  const addMenuItem = (item) => {
    const newItem = {
      ...item,
      id: `MENU-${String(menu.length + 1).padStart(3, '0')}`,
      status: item.status || 'AVAILABLE'
    };
    setMenu(prev => [newItem, ...prev]);
    logAudit(`Menambah item menu baru: ${newItem.name}`, 'CAFÉ');
    showToast('Menu makanan berjaya ditambah!');
  };

  const updateMenuItem = (id, updated) => {
    setMenu(prev => prev.map(m => m.id === id ? { ...m, ...updated } : m));
    logAudit(`Mengemas kini menu: ${updated.name || id}`, 'CAFÉ');
    showToast('Menu berjaya dikemaskini.');
  };

  const deleteMenuItem = (id) => {
    const item = menu.find(m => m.id === id);
    setMenu(prev => prev.filter(m => m.id !== id));
    logAudit(`Memadam menu: ${item ? item.name : id}`, 'CAFÉ');
    showToast('Menu telah dipadam.', 'info');
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

    logAudit(`Pesanan ${orderId} ditukar status kepada: ${newStatus}`, 'CAFÉ');
    showToast(`Status pesanan ${orderId} kini: ${newStatus}`);
  };

  // ================= SMARTPHONE REPAIR MODULE ACTIONS ================= //
  const addCustomer = (cust) => {
    const newId = `CUST-${String(customers.length + 1).padStart(3, '0')}`;
    const newCust = {
      ...cust,
      id: newId,
      dateRegistered: new Date().toISOString().split('T')[0],
      totalRepairs: 0,
      totalSpending: 0,
      lastRepair: '-',
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

  const createRepairJob = (jobData) => {
    const jobNum = repairJobs.length + 1;
    const jobId = `REP-2026-${String(jobNum).padStart(5, '0')}`;
    const receiptNo = jobId;

    // Calculate costs
    const partsCost = (jobData.partsUsed || []).reduce((acc, p) => acc + ((p.costPrice || 0) * (p.quantity || 1)), 0);
    const partsSelling = (jobData.partsUsed || []).reduce((acc, p) => acc + ((p.sellingPrice || 0) * (p.quantity || 1)), 0);
    const labourCost = Number(jobData.labourCost || 0);
    const totalCost = partsCost + labourCost;
    const sellingPrice = Number(jobData.sellingPrice || (partsSelling + labourCost));
    const grossProfit = sellingPrice - partsCost;

    const newJob = {
      ...jobData,
      id: jobId,
      receiptNo,
      dateReceived: jobData.dateReceived || new Date().toISOString(),
      partsCost,
      labourCost,
      totalCost,
      sellingPrice,
      grossProfit,
      quotationStatus: jobData.quotationStatus || 'PENDING',
      repairStatus: jobData.repairStatus || 'RECEIVED',
      paymentStatus: 'PENDING',
      paymentMethod: null,
      warrantyPeriod: jobData.warrantyPeriod || '30 Hari Waranti Servis GIATMARA',
      completedAt: null
    };

    setRepairJobs(prev => [newJob, ...prev]);

    // Update customer history
    if (jobData.customerId) {
      setCustomers(prev => prev.map(c => c.id === jobData.customerId ? {
        ...c,
        totalRepairs: c.totalRepairs + 1,
        lastRepair: new Date().toISOString().split('T')[0]
      } : c));
    }

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
    setRepairJobs(prev => prev.map(j => {
      if (j.id === id) {
        const merged = { ...j, ...updated };
        const partsCost = (merged.partsUsed || []).reduce((acc, p) => acc + ((p.costPrice || 0) * (p.quantity || 1)), 0);
        const labourCost = Number(merged.labourCost || 0);
        const totalCost = partsCost + labourCost;
        const sellingPrice = Number(merged.sellingPrice || 0);
        const grossProfit = sellingPrice - partsCost;
        return {
          ...merged,
          partsCost,
          totalCost,
          grossProfit
        };
      }
      return j;
    }));
    logAudit(`Mengemas kini diagnosis/job baiki ${id}`, 'REPAIR');
    showToast(`Job ${id} dikemaskini.`);
  };

  const approveRepairQuotation = (jobId) => {
    const job = repairJobs.find(j => j.id === jobId);
    if (!job) return;

    // Deduct spare parts from central inventory
    if (job.partsUsed && job.partsUsed.length > 0) {
      job.partsUsed.forEach(part => {
        if (part.partId) {
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
    const now = new Date().toISOString();
    setRepairJobs(prev => prev.map(j => j.id === jobId ? {
      ...j,
      repairStatus: newStatus,
      completedAt: (newStatus === 'READY FOR COLLECTION' || newStatus === 'COMPLETED') && !j.completedAt ? now : j.completedAt
    } : j));

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

    // Update Customer spending
    if (job.customerId) {
      setCustomers(prev => prev.map(c => c.id === job.customerId ? {
        ...c,
        totalSpending: c.totalSpending + job.sellingPrice
      } : c));
    }

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
    const newId = `INV-${item.category.includes('Café') ? 'CF' : item.category.includes('Packaging') ? 'PKG' : item.category.includes('Spare') ? 'SP' : 'ACC'}-${String(inventory.length + 1).padStart(3, '0')}`;
    const newItem = {
      ...item,
      id: newId,
      currentStock: Number(item.currentStock || 0),
      minStock: Number(item.minStock || 5),
      costPrice: Number(item.costPrice || 0),
      sellingPrice: Number(item.sellingPrice || 0),
      status: Number(item.currentStock) <= Number(item.minStock) ? 'LOW_STOCK' : 'IN_STOCK'
    };
    setInventory(prev => [newItem, ...prev]);
    logAudit(`Menambah item inventori baru: ${newItem.name}`, 'INVENTORY');
    showToast('Item inventori berjaya ditambah!');
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
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updated } : u));
    showToast('Maklumat pengguna dikemaskini.');
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
    // Operations
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    addTable,
    updateTable,
    deleteTable,
    createFoodOrder,
    updateFoodOrderStatus,
    addCustomer,
    updateCustomer,
    createRepairJob,
    updateRepairJob,
    approveRepairQuotation,
    rejectRepairQuotation,
    updateRepairStatus,
    payRepairJob,
    sellAccessories,
    adjustStock,
    addInventoryItem,
    updateInventoryItem,
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
