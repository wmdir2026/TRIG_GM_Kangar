import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  UserCog,
  Plus,
  Search,
  ShieldCheck,
  User,
  Phone,
  Mail,
  Edit2,
  Trash2,
  Lock,
  X
} from 'lucide-react';

export const UserManagement = () => {
  const { users, addUser, updateUser, deleteUser, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    role: 'CAFE STAFF',
    email: '',
    phone: '',
    department: 'Kursus Seni Masakan'
  });

  const roles = [
    'SUPER ADMIN',
    'MANAGER CAFE',
    'MANAGER SMARTPHONE REPAIR',
    'MANAGER',
    'CAFE STAFF',
    'CAFE CASHIER',
    'REPAIR STAFF',
    'SMARTPHONE CASHIER',
    'CASHIER',
    'CUSTOMER SERVICE',
    'CUSTOMER'
  ];

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({
      username: '',
      password: '',
      name: '',
      role: 'CAFE STAFF',
      email: '',
      phone: '',
      department: 'Kursus Seni Masakan'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (u) => {
    setEditingUser(u);
    setFormData({
      username: u.username,
      password: u.password,
      name: u.name,
      role: u.role,
      email: u.email,
      phone: u.phone,
      department: u.department
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.name || !formData.password) {
      alert('Sila lengkapkan nama, username dan kata laluan.');
      return;
    }

    if (editingUser) {
      updateUser(editingUser.id, formData);
    } else {
      addUser(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (u) => {
    if (u.id === currentUser?.id) {
      alert('Anda tidak boleh memadam akaun yang sedang aktif digunakan.');
      return;
    }
    if (window.confirm(`Padam pengguna ${u.name} (${u.username})?`)) {
      deleteUser(u.id);
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 mb-1 uppercase tracking-wider">
            <UserCog className="w-4 h-4" />
            <span>Pentadbiran Akaun & Peranan Pengguna (RBAC)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            PENGURUSAN PENGGUNA SISTEM
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Urus akaun Super Admin, Pengurus, Staf Café, Staf Baiki Smartphone, Juruwang dan Pelanggan.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pengguna Baru</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari pengguna, nama, peranan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
          />
        </div>
        <span className="text-xs font-bold text-slate-500">{filteredUsers.length} Pengguna Berdaftar</span>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredUsers.map(user => (
          <div
            key={user.id}
            className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                    alt={user.name}
                    className="w-11 h-11 rounded-2xl object-cover ring-1 ring-slate-200"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 leading-tight">{user.name}</h3>
                    <span className="text-[10px] text-slate-400 font-mono">@{user.username}</span>
                  </div>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                  user.role === 'SUPER ADMIN' ? 'bg-purple-100 text-purple-800' :
                  user.role.includes('MANAGER') ? 'bg-blue-100 text-blue-800' :
                  user.role === 'CAFE STAFF' ? 'bg-amber-100 text-amber-800' :
                  user.role === 'REPAIR STAFF' ? 'bg-cyan-100 text-cyan-800' :
                  user.role.includes('CASHIER') ? 'bg-emerald-100 text-emerald-800' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {user.role}
                </span>
              </div>

              <div className="py-3 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-medium w-20">Jabatan:</span>
                  <span className="font-semibold text-slate-800">{user.department}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-medium w-20">E-mel:</span>
                  <span className="text-slate-700 truncate">{user.email || '-'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-medium w-20">No. Telefon:</span>
                  <span className="text-slate-700">{user.phone || '-'}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[10px] text-slate-400 font-mono font-bold">ID: {user.id}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(user)}
                  className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg"
                  title="Kemaskini"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(user)}
                  className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                  title="Padam Pengguna"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-slate-200 animate-fade-in text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-black text-base text-slate-900">
                {editingUser ? 'Kemaskini Pengguna' : 'Daftar Pengguna Baharu'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-extrabold text-slate-900 block mb-1 text-xs">Nama Penuh *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Wan Muhadir"
                  className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-xl font-bold text-slate-950 placeholder:text-slate-500 outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-extrabold text-slate-900 block mb-1 text-xs">Username (ID Log Masuk) *</label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="wanmuhadir"
                    className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-xl font-mono font-bold text-slate-950 placeholder:text-slate-500 outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="font-extrabold text-slate-900 block mb-1 text-xs">Kata Laluan (Password) *</label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-xl font-mono font-bold text-slate-950 placeholder:text-slate-500 outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="font-extrabold text-slate-900 block mb-1 text-xs">Peranan Akses (Role) *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-xl font-bold text-slate-950 outline-none focus:border-indigo-600"
                >
                  {roles.map(r => (
                    <option key={r} value={r} className="text-slate-950 font-bold bg-white">{r}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-extrabold text-slate-900 block mb-1 text-xs">No. Telefon</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="012-3456789"
                    className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-xl font-bold text-slate-950 placeholder:text-slate-500 outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="font-extrabold text-slate-900 block mb-1 text-xs">E-mel</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="nama@giatmara.edu.my"
                    className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-xl font-bold text-slate-950 placeholder:text-slate-500 outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="font-extrabold text-slate-900 block mb-1 text-xs">Jabatan / Kursus</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="Kursus Seni Masakan, Kursus Baiki Smartphone..."
                  className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-xl font-bold text-slate-950 placeholder:text-slate-500 outline-none focus:border-indigo-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md"
                >
                  {editingUser ? 'Simpan' : 'Daftar Pengguna'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
