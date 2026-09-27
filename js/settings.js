/**
 * TRIG GIATMARA KANGAR - Settings & System Configuration Module
 * Manages Business Information, Tax/Charges, User Access, System Audit Trail, and Demo Reset.
 */

const SettingsModule = {
  render: function(subview = 'business') {
    const container = document.getElementById('main-content-view');
    if (!container) return;

    switch (subview) {
      case 'users':
        this.renderUserManagement(container);
        break;
      case 'audit':
        this.renderAuditTrail(container);
        break;
      case 'business':
      default:
        this.renderBusinessSettings(container);
        break;
    }

    if (window.lucide) lucide.createIcons();
  },

  // 1. BUSINESS SETTINGS
  renderBusinessSettings: function(container) {
    const settings = DB.get('settings') || {};

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <div class="flex items-center gap-2 text-xs text-slate-500 font-semibold mb-1">
              <span>Sistem</span> &rarr; <span>Tetapan Perniagaan</span>
            </div>
            <h1 class="text-xl font-bold text-slate-900">Tetapan & Profil Perniagaan</h1>
            <p class="text-xs text-slate-500">Konfigurasi maklumat rasmi TRIG GIATMARA Kangar, kepala surat resit dan terma jaminan.</p>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="SettingsModule.confirmResetDemo()" class="px-4 py-2 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 rounded-xl text-xs font-bold flex items-center gap-1.5 transition">
              <i data-lucide="rotate-ccw" class="w-4 h-4"></i> Reset Data Demo
            </button>
          </div>
        </div>

        <!-- Settings Form Card -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-3xl">
          <form onsubmit="SettingsModule.saveBusinessSettings(event)" class="space-y-4 text-xs">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Nama Perniagaan / Institusi (Business Name) *</label>
              <input type="text" name="businessName" value="${settings.businessName || 'TRIG GIATMARA KANGAR'}" required class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900">
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-slate-700 mb-1">Jenis Perniagaan</label>
                <input type="text" name="businessType" value="${settings.businessType || 'Latihan & Keusahawanan TVET'}" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold">
              </div>
              <div>
                <label class="block font-bold text-slate-700 mb-1">Mata Wang (Currency)</label>
                <input type="text" name="currencySymbol" value="${settings.currencySymbol || 'RM'}" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold">
              </div>
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">Alamat Premis / Kampus</label>
              <textarea name="address" rows="2" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">${settings.address || ''}</textarea>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-slate-700 mb-1">No Telefon Pejabat</label>
                <input type="text" name="phone" value="${settings.phone || ''}" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold">
              </div>
              <div>
                <label class="block font-bold text-slate-700 mb-1">Emel Rasmi</label>
                <input type="email" name="email" value="${settings.email || ''}" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold">
              </div>
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">Mesej Penghargaan Kaki Resit (Receipt Footer)</label>
              <textarea name="receiptFooter" rows="2" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">${settings.receiptFooter || ''}</textarea>
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">Terma Jaminan Baiki Smartphone (Warranty Policy)</label>
              <textarea name="warrantyTerms" rows="2" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">${settings.warrantyTerms || ''}</textarea>
            </div>

            <div class="pt-4 border-t border-slate-200 flex justify-end">
              <button type="submit" class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition">
                Simpan Tetapan
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  },

  saveBusinessSettings: function(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const settings = DB.get('settings') || {};

    const updated = {
      ...settings,
      businessName: formData.get('businessName'),
      businessType: formData.get('businessType'),
      currencySymbol: formData.get('currencySymbol'),
      address: formData.get('address'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      receiptFooter: formData.get('receiptFooter'),
      warrantyTerms: formData.get('warrantyTerms')
    };

    DB.save('settings', updated);
    DB.logAudit('SUPER_ADMIN', 'Kemaskini Tetapan Perniagaan', 'SYSTEM', 'Profil perniagaan & kepala resit dikemaskini.');
    App.showToast('Tetapan perniagaan berjaya disimpan!', 'success');
  },

  confirmResetDemo: function() {
    App.confirm('Adakah anda pasti mahu RESET SEMULA data demo? Semua rekod jualan, order dan permohonan baru akan dikembalikan kepada tetapan awal.', () => {
      DB.resetDemoData();
      App.showToast('Data demo berjaya dikembalikan kepada tetapan kilang!', 'info');
      setTimeout(() => window.location.reload(), 600);
    });
  },

  // 2. USER MANAGEMENT
  renderUserManagement: function(container) {
    const users = DB.get('users') || [];

    container.innerHTML = `
      <div class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <div class="flex items-center gap-2 text-xs text-slate-500 font-semibold mb-1">
              <span>Sistem</span> &rarr; <span>Pengurusan Pengguna</span>
            </div>
            <h1 class="text-xl font-bold text-slate-900">Pengurusan Akses & Peranan Pengguna (RBAC)</h1>
            <p class="text-xs text-slate-500">Kawal akaun Super Admin, Pengurus, Staf Café, Staf Repair dan Juruwang.</p>
          </div>
          <button onclick="SettingsModule.openUserModal()" class="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition">
            <i data-lucide="user-plus" class="w-4 h-4"></i> Tambah Pengguna Baru
          </button>
        </div>

        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th class="p-4">Nama Pengguna & Username</th>
                  <th class="p-4">Peranan (Role)</th>
                  <th class="p-4">Emel & Telefon</th>
                  <th class="p-4 text-center">Status</th>
                  <th class="p-4 text-center">Tindakan</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${users.map(u => {
                  const rInfo = Auth.getRoleInfo(u.role);
                  return `
                    <tr class="hover:bg-slate-50 transition">
                      <td class="p-4">
                        <div class="font-bold text-slate-900">${u.name}</div>
                        <div class="font-mono text-[10px] text-slate-400 font-bold">@${u.username}</div>
                      </td>
                      <td class="p-4">
                        <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${rInfo.badgeClass}">
                          ${rInfo.title}
                        </span>
                      </td>
                      <td class="p-4 text-slate-600">
                        <div>${u.email}</div>
                        <div class="text-[10px] text-slate-400">${u.phone || '-'}</div>
                      </td>
                      <td class="p-4 text-center">
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          AKTIF
                        </span>
                      </td>
                      <td class="p-4 text-center">
                        <button onclick="SettingsModule.openUserModal('${u.id}')" class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit">
                          <i data-lucide="edit-2" class="w-4 h-4"></i>
                        </button>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  openUserModal: function(userId = null) {
    const users = DB.get('users') || [];
    const user = userId ? users.find(u => u.id === userId) : null;
    const isEdit = !!user;

    let modal = document.getElementById('user-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'user-modal';
      modal.className = 'fixed inset-0 z-50 flex items-center justify-center modal-backdrop p-4';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 modal-animate-in">
        <h3 class="font-bold text-slate-900 text-base">${isEdit ? 'Kemaskini Akaun Pengguna' : 'Daftar Pengguna Baru'}</h3>
        <form onsubmit="SettingsModule.saveUser(event, '${user ? user.id : ''}')" class="space-y-4 mt-4 text-xs">
          <div>
            <label class="block font-bold text-slate-700 mb-1">Nama Penuh *</label>
            <input type="text" name="name" value="${user ? user.name : ''}" required class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold">
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Username *</label>
              <input type="text" name="username" value="${user ? user.username : ''}" required ${isEdit ? 'readonly' : ''} class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono">
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Kata Laluan (Password) *</label>
              <input type="password" name="password" value="${user ? user.password : '123456'}" required class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono">
            </div>
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">Peranan (Role) *</label>
            <select name="role" required class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold">
              <option value="SUPER_ADMIN" ${user && user.role === 'SUPER_ADMIN' ? 'selected' : ''}>SUPER ADMIN (Akses Penuh)</option>
              <option value="MANAGER" ${user && user.role === 'MANAGER' ? 'selected' : ''}>MANAGER (Kelulusan PR & Laporan)</option>
              <option value="CAFE_STAFF" ${user && user.role === 'CAFE_STAFF' ? 'selected' : ''}>CAFE STAFF (Dapur & Order Café)</option>
              <option value="REPAIR_STAFF" ${user && user.role === 'REPAIR_STAFF' ? 'selected' : ''}>REPAIR STAFF (Bengkel Smartphone)</option>
              <option value="CASHIER" ${user && user.role === 'CASHIER' ? 'selected' : ''}>CASHIER (Juruwang & POS)</option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Emel</label>
              <input type="email" name="email" value="${user ? user.email : ''}" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">No Telefon</label>
              <input type="text" name="phone" value="${user ? user.phone : ''}" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
            </div>
          </div>

          <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button type="button" onclick="document.getElementById('user-modal').classList.add('hidden')" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition">
              Batal
            </button>
            <button type="submit" class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition">
              Simpan Pengguna
            </button>
          </div>
        </form>
      </div>
    `;

    modal.classList.remove('hidden');
    if (window.lucide) lucide.createIcons();
  },

  saveUser: function(e, existingId) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const users = DB.get('users') || [];

    if (existingId) {
      const idx = users.findIndex(u => u.id === existingId);
      if (idx !== -1) {
        users[idx] = {
          ...users[idx],
          name: formData.get('name'),
          password: formData.get('password'),
          role: formData.get('role'),
          email: formData.get('email'),
          phone: formData.get('phone')
        };
        DB.save('users', users);
        App.showToast('Pengguna dikemaskini!', 'success');
      }
    } else {
      const newUser = {
        id: 'usr_' + (users.length + 1),
        username: formData.get('username').toLowerCase().trim(),
        name: formData.get('name'),
        password: formData.get('password'),
        role: formData.get('role'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        active: true
      };
      users.push(newUser);
      DB.save('users', users);
      App.showToast('Pengguna baru ditambah!', 'success');
    }

    document.getElementById('user-modal').classList.add('hidden');
    this.render('users');
  },

  // 3. AUDIT TRAIL
  renderAuditTrail: function(container) {
    const logs = DB.get('auditLogs') || [];

    container.innerHTML = `
      <div class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <div class="flex items-center gap-2 text-xs text-slate-500 font-semibold mb-1">
              <span>Sistem</span> &rarr; <span>Jejak Audit</span>
            </div>
            <h1 class="text-xl font-bold text-slate-900">Jejak Audit & Log Aktiviti Sistem (Audit Trail)</h1>
            <p class="text-xs text-slate-500">Merekodkan setiap tindakan kritikal pengguna, tarikh dan modul berkaitan.</p>
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th class="p-4">Tarikh & Masa</th>
                  <th class="p-4">Pengguna / Peranan</th>
                  <th class="p-4">Modul</th>
                  <th class="p-4">Tindakan</th>
                  <th class="p-4">Perincian Transaksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${logs.map(l => `
                  <tr class="hover:bg-slate-50 transition">
                    <td class="p-4 font-mono text-[11px] text-slate-500">${l.timestamp}</td>
                    <td class="p-4">
                      <div class="font-bold text-slate-900">${l.user}</div>
                      <div class="text-[10px] text-slate-400 font-semibold">${l.role}</div>
                    </td>
                    <td class="p-4">
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800">
                        ${l.module}
                      </span>
                    </td>
                    <td class="p-4 font-bold text-slate-800">${l.action}</td>
                    <td class="p-4 text-slate-600">${l.details}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }
};
