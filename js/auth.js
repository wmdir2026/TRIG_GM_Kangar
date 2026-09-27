/**
 * TRIG GIATMARA KANGAR - Authentication & Role-Based Access Control
 */

const AUTH_STORAGE_KEY = 'trig_current_user';

const ROLE_PERMISSIONS = {
  SUPER_ADMIN: {
    title: 'Super Admin',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
    canManageUsers: true,
    canManageMenu: true,
    canManageInventory: true,
    canManageSuppliers: true,
    canManagePurchases: true,
    canManageReports: true,
    canManageSettings: true,
    canManageCafe: true,
    canManageRepair: true,
    canManagePOS: true,
    canApprovePurchases: true
  },
  MANAGER: {
    title: 'Pengurus Operasi',
    badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    canManageUsers: false,
    canManageMenu: true,
    canManageInventory: true,
    canManageSuppliers: true,
    canManagePurchases: true,
    canManageReports: true,
    canManageSettings: false,
    canManageCafe: true,
    canManageRepair: true,
    canManagePOS: true,
    canApprovePurchases: true
  },
  CAFE_STAFF: {
    title: 'Staf / Pelatih Café',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
    canManageUsers: false,
    canManageMenu: true,
    canManageInventory: false,
    canManageSuppliers: false,
    canManagePurchases: false,
    canManageReports: false,
    canManageSettings: false,
    canManageCafe: true,
    canManageRepair: false,
    canManagePOS: false,
    canApprovePurchases: false
  },
  REPAIR_STAFF: {
    title: 'Staf / Pelatih Baiki Smartphone',
    badgeClass: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    canManageUsers: false,
    canManageMenu: false,
    canManageInventory: true,
    canManageSuppliers: false,
    canManagePurchases: false,
    canManageReports: false,
    canManageSettings: false,
    canManageCafe: false,
    canManageRepair: true,
    canManagePOS: false,
    canApprovePurchases: false
  },
  CASHIER: {
    title: 'Juruwang Kaunter',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    canManageUsers: false,
    canManageMenu: false,
    canManageInventory: false,
    canManageSuppliers: false,
    canManagePurchases: false,
    canManageReports: true,
    canManageSettings: false,
    canManageCafe: true,
    canManageRepair: true,
    canManagePOS: true,
    canApprovePurchases: false
  },
  CUSTOMER: {
    title: 'Pelanggan / Portal QR',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
    canManageUsers: false,
    canManageMenu: false,
    canManageInventory: false,
    canManageSuppliers: false,
    canManagePurchases: false,
    canManageReports: false,
    canManageSettings: false,
    canManageCafe: false,
    canManageRepair: false,
    canManagePOS: false,
    canApprovePurchases: false
  }
};

const Auth = {
  // Current user state
  getCurrentUser: function() {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
      // Default to Super Admin on initial load for frictionless testing
      const defaultAdmin = DB.get('users').find(u => u.role === 'SUPER_ADMIN') || {
        id: 'usr_1',
        username: 'admin',
        name: 'Zulkifli bin Hashim',
        role: 'SUPER_ADMIN',
        email: 'admin@giatmara.edu.my'
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(defaultAdmin));
      return defaultAdmin;
    } catch (e) {
      return null;
    }
  },

  // Login handler
  login: function(username, password) {
    const users = DB.get('users');
    const user = users.find(u => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password);
    
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      DB.logAudit(user.role, 'Log Masuk Pengguna Berjaya', 'AUTH', `Pengguna ${user.name} (${user.username}) telah log masuk.`);
      window.dispatchEvent(new CustomEvent('trig_auth_change', { detail: { user } }));
      return { success: true, user };
    }
    return { success: false, message: 'Nama Pengguna atau Kata Laluan tidak tepat.' };
  },

  // Switch demo account directly
  switchRole: function(roleKey) {
    const users = DB.get('users');
    const user = users.find(u => u.role === roleKey);
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      DB.logAudit(user.role, 'Tukar Peranan Pengguna (Demo Switcher)', 'AUTH', `Beralih kepada peranan ${roleKey} (${user.name})`);
      window.dispatchEvent(new CustomEvent('trig_auth_change', { detail: { user } }));
      return user;
    }
    return null;
  },

  // Logout
  logout: function() {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      DB.logAudit(currentUser.role, 'Log Keluar Pengguna', 'AUTH', `Pengguna ${currentUser.name} telah log keluar.`);
    }
    localStorage.removeItem(AUTH_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('trig_auth_change', { detail: { user: null } }));
  },

  // Check permissions
  hasPermission: function(permKey) {
    const user = this.getCurrentUser();
    if (!user) return false;
    const roleConfig = ROLE_PERMISSIONS[user.role];
    if (!roleConfig) return false;
    return roleConfig[permKey] === true;
  },

  // Get Role details
  getRoleInfo: function(roleKey) {
    return ROLE_PERMISSIONS[roleKey] || { title: roleKey, badgeClass: 'bg-gray-100 text-gray-700' };
  }
};
