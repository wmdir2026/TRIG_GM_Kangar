import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext';
import {
  UtensilsCrossed,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Image as ImageIcon,
  DollarSign,
  X,
  Calendar,
  Clock,
  Upload,
  ShieldCheck,
  Lock,
  Crop,
  Sparkles,
  Check,
  AlertTriangle,
  Info
} from 'lucide-react';

export const MenuManagement = () => {
  const {
    currentUser,
    menu,
    categories,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    updateMenuSchedule,
    DAYS_OF_WEEK = ['Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu', 'Ahad'],
    getCurrentDayMalay = () => {
      const map = ['Ahad', 'Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu'];
      return map[new Date().getDay()];
    },
    isMenuItemAvailableToday = (item) => {
      if (!item) return false;
      if (item.status === 'INACTIVE') return false;
      if (item.status === 'OUT OF STOCK') return false;
      const today = getCurrentDayMalay();
      if (!item.availableDays || !Array.isArray(item.availableDays) || item.availableDays.length === 0) {
        return true;
      }
      return item.availableDays.includes(today);
    },
    showToast
  } = useApp();

  // Role Permissions
  const isSuperAdmin = currentUser?.role === 'SUPER ADMIN';
  const isCafeManager =
    currentUser?.role === 'MANAGER CAFE' ||
    currentUser?.role === 'MANAGER' ||
    (currentUser?.role && currentUser.role.includes('CAFE') && currentUser.role.includes('MANAGER'));
  const canManageMenu = isSuperAdmin || isCafeManager;

  const todayMalay = getCurrentDayMalay();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Schedule Modal State (Manager Cafe)
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleTargetItem, setScheduleTargetItem] = useState(null);
  const [scheduleDays, setScheduleDays] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Rice',
    description: '',
    image: '',
    costPrice: '',
    sellingPrice: '',
    stock: '30',
    unit: 'Pinggan',
    status: 'AVAILABLE',
    availableDays: ['Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu', 'Ahad']
  });

  // Image Upload & 500x350 Dimension Validation State
  const [imageError, setImageError] = useState('');
  const [pendingImageRaw, setPendingImageRaw] = useState(null);
  const [imageDimensions, setImageDimensions] = useState(null);
  const fileInputRef = useRef(null);

  // Lock body scroll while modal is active
  useEffect(() => {
    if (isModalOpen || isScheduleModalOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isModalOpen, isScheduleModalOpen]);

  // Open Add Modal
  const handleOpenAdd = () => {
    if (!canManageMenu) {
      showToast('Akses Terhad: Hanya Super Admin dan Manager Café yang dibenarkan menambah menu.', 'error');
      return;
    }

    setEditingItem(null);
    setImageError('');
    setPendingImageRaw(null);
    setImageDimensions(null);
    setFormData({
      name: '',
      category: 'Rice',
      description: '',
      image: '',
      costPrice: '',
      sellingPrice: '',
      stock: '30',
      unit: 'Pinggan',
      status: 'AVAILABLE',
      availableDays: ['Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu', 'Ahad']
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (item) => {
    if (!canManageMenu) {
      showToast('Akses Terhad: Hanya Super Admin dan Manager Café yang dibenarkan mengemaskini menu.', 'error');
      return;
    }

    setEditingItem(item);
    setImageError('');
    setPendingImageRaw(null);
    setImageDimensions(item.image ? { width: 500, height: 350 } : null);
    setFormData({
      name: item.name || '',
      category: item.category || 'Rice',
      description: item.description || '',
      image: item.image || '',
      costPrice: item.costPrice !== undefined ? item.costPrice.toString() : '',
      sellingPrice: item.sellingPrice !== undefined ? item.sellingPrice.toString() : '',
      stock: item.stock !== undefined ? item.stock.toString() : '30',
      unit: item.unit || 'Pinggan',
      status: item.status || 'AVAILABLE',
      availableDays: item.availableDays && item.availableDays.length > 0
        ? [...item.availableDays]
        : ['Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu', 'Ahad']
    });
    setIsModalOpen(true);
  };

  // Open Schedule Modal (Only Manager Cafe & Super Admin)
  const handleOpenScheduleModal = (item) => {
    if (!isCafeManager && !isSuperAdmin) {
      showToast('Akses Ditolak: Hanya Manager Café yang mempunyai kuasa menetapkan jadual hari jualan.', 'error');
      return;
    }
    setScheduleTargetItem(item);
    setScheduleDays(item.availableDays && item.availableDays.length > 0
      ? [...item.availableDays]
      : ['Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu', 'Ahad']
    );
    setIsScheduleModalOpen(true);
  };

  // Save Schedule Days
  const handleSaveSchedule = (e) => {
    e.preventDefault();
    if (!scheduleTargetItem) return;

    if (scheduleDays.length === 0) {
      showToast('Sila pilih sekurang-kurangnya satu hari jualan atau tetapkan status ke INACTIVE.', 'warning');
      return;
    }

    updateMenuSchedule(scheduleTargetItem.id, scheduleDays);
    setIsScheduleModalOpen(false);
    setScheduleTargetItem(null);
  };

  // Toggle Day in Schedule
  const toggleScheduleDay = (day) => {
    setScheduleDays(prev => {
      if (prev.includes(day)) {
        return prev.filter(d => d !== day);
      } else {
        return [...prev, day];
      }
    });
  };

  // Toggle Day in Add/Edit Form
  const toggleFormDay = (day) => {
    setFormData(prev => {
      const current = prev.availableDays || [];
      if (current.includes(day)) {
        return { ...prev, availableDays: current.filter(d => d !== day) };
      } else {
        return { ...prev, availableDays: [...current, day] };
      }
    });
  };

  // Image Upload with Strict 500 x 350 Pixel Validation
  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Sila muat naik fail imej yang sah (JPG, PNG, WebP).', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      const img = new window.Image();
      img.onload = () => {
        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height;

        if (w !== 500 || h !== 350) {
          // Warning displayed prominently
          setImageError(`⚠️ AMARAN SAIZ GAMBAR: Saiz gambar yang anda muat naik ialah ${w} x ${h} pixel. Syarat ketetapan sistem: Saiz gambar MESTILAH TEPAT 500 x 350 pixel sahaja!`);
          setPendingImageRaw({ dataUrl, width: w, height: h });
          setImageDimensions({ width: w, height: h });
          showToast(`Amaran: Saiz gambar mestilah tepat 500 x 350 pixel! (Imej anda: ${w} x ${h} px)`, 'error');
        } else {
          setImageError('');
          setPendingImageRaw(null);
          setImageDimensions({ width: 500, height: 350 });
          setFormData(prev => ({ ...prev, image: dataUrl }));
          showToast('Gambar bersaiz tepat 500 x 350 pixel disahkan!', 'success');
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  // Auto-Crop to Exact 500 x 350 Pixel using Canvas
  const handleAutoCropTo500x350 = () => {
    if (!pendingImageRaw?.dataUrl) return;

    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 500;
      canvas.height = 350;
      const ctx = canvas.getContext('2d');

      const targetRatio = 500 / 350;
      const imgRatio = img.width / img.height;
      let srcW, srcH, srcX, srcY;

      if (imgRatio > targetRatio) {
        srcH = img.height;
        srcW = img.height * targetRatio;
        srcX = (img.width - srcW) / 2;
        srcY = 0;
      } else {
        srcW = img.width;
        srcH = img.width / targetRatio;
        srcX = 0;
        srcY = (img.height - srcH) / 2;
      }

      ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, 500, 350);
      const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.92);

      setFormData(prev => ({ ...prev, image: croppedDataUrl }));
      setImageError('');
      setPendingImageRaw(null);
      setImageDimensions({ width: 500, height: 350 });
      showToast('Gambar berjaya dilaraskan ke tepat 500 x 350 pixel!', 'success');
    };
    img.src = pendingImageRaw.dataUrl;
  };

  // Form Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canManageMenu) {
      showToast('Akses Ditolak: Hanya Super Admin dan Manager Café yang dibenarkan mengurus menu.', 'error');
      return;
    }

    if (!formData.name.trim()) {
      showToast('Sila masukkan nama hidangan menu.', 'error');
      return;
    }

    const cost = parseFloat(formData.costPrice);
    const selling = parseFloat(formData.sellingPrice);

    if (isNaN(cost) || isNaN(selling) || selling <= 0) {
      showToast('Sila lengkapkan harga kos dan harga jualan yang sah.', 'error');
      return;
    }

    // Image 500x350 check
    if (!formData.image) {
      showToast('Sila muat naik gambar makanan/minuman bersaiz tepat 500 x 350 pixel.', 'error');
      return;
    }

    if (imageError) {
      showToast('Sila pastikan gambar menepati saiz 500 x 350 pixel atau klik butang laraskan.', 'error');
      return;
    }

    const payload = {
      name: formData.name.trim(),
      category: formData.category,
      description: formData.description.trim(),
      image: formData.image,
      costPrice: cost,
      sellingPrice: selling,
      grossProfit: Math.max(0, selling - cost),
      stock: parseInt(formData.stock) || 0,
      unit: formData.unit.trim() || 'Pinggan',
      status: formData.status,
      availableDays: formData.availableDays && formData.availableDays.length > 0
        ? formData.availableDays
        : ['Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu', 'Ahad']
    };

    if (editingItem) {
      updateMenuItem(editingItem.id, payload);
    } else {
      addMenuItem(payload);
    }
    setIsModalOpen(false);
  };

  // Delete Menu Item
  const handleDelete = (item) => {
    if (!canManageMenu) {
      showToast('Akses Ditolak: Hanya Super Admin dan Manager Café yang dibenarkan memadam menu.', 'error');
      return;
    }

    if (window.confirm(`Adakah anda pasti mahu memadam menu "${item.name}" daripada sistem? Tindakan ini akan mengeluarkannya dari semua senarai POS dan pesanan pelanggan.`)) {
      deleteMenuItem(item.id);
    }
  };

  // Filtered list
  const filteredMenu = menu.filter(item => {
    const matchesSearch =
      (item.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.id || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'ALL' || item.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate live profit in form
  const formCost = parseFloat(formData.costPrice) || 0;
  const formSelling = parseFloat(formData.sellingPrice) || 0;
  const formProfit = Math.max(0, formSelling - formCost);
  const formMargin = formSelling > 0 ? ((formProfit / formSelling) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 mb-1 uppercase tracking-wider">
            <UtensilsCrossed className="w-4 h-4" />
            <span>Katalog & Pengurusan Menu Café • Masakan Komersial</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <span>PENGURUSAN MENU KURSUS MASAKAN</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Hanya <strong>Super Admin</strong> dan <strong>Manager Café</strong> yang dibenarkan menambah atau mengurangkan hidangan makanan/minuman dengan harga kos, harga jualan, dan untung. Ketersediaan hari jualan dikawal khas oleh Manager Café.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {canManageMenu ? (
            <button
              onClick={handleOpenAdd}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-600/20 transition cursor-pointer"
              title="Tambah menu hidangan makanan atau minuman baharu"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>+ Tambah Menu Baru</span>
            </button>
          ) : (
            <div className="px-3.5 py-2 bg-amber-50 border border-amber-200 rounded-xl text-[11px] font-bold text-amber-800 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Akses Terhad (Super Admin & Manager Sahaja)</span>
            </div>
          )}
        </div>
      </div>

      {/* Security Role Notice if not authorized */}
      {!canManageMenu && (
        <div className="p-3.5 bg-amber-500/10 border border-amber-400/40 rounded-2xl flex items-center gap-2 text-xs text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            Anda log masuk sebagai <strong>{currentUser?.name || 'Staf'} ({currentUser?.role || 'Pengguna'})</strong>. Fungsi penambahan, pengemaskinian, dan pemadaman menu dikunci khas untuk <strong>Super Admin</strong> dan <strong>Manager Café</strong>.
          </span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama menu, deskripsi atau ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-900"
          />
        </div>

        {/* Categories Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              selectedCategory === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua ({menu.length})
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900 cursor-pointer"
        >
          <option value="ALL">Semua Status</option>
          <option value="AVAILABLE">AVAILABLE (Ada)</option>
          <option value="OUT OF STOCK">OUT OF STOCK (Habis)</option>
          <option value="INACTIVE">INACTIVE (Tidak Aktif)</option>
        </select>
      </div>

      {/* Menu Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMenu.map(item => {
          const profit = item.grossProfit !== undefined ? item.grossProfit : (item.sellingPrice - item.costPrice);
          const margin = item.sellingPrice > 0 ? ((profit / item.sellingPrice) * 100).toFixed(1) : 0;
          const isSoldToday = isMenuItemAvailableToday(item);
          const activeDaysCount = item.availableDays?.length || 7;

          return (
            <div
              key={item.id}
              className={`bg-white rounded-3xl border shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition group ${
                !isSoldToday ? 'border-amber-200 bg-amber-50/15' : 'border-slate-200'
              }`}
            >
              <div>
                {/* Image & Badges */}
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80";
                    }}
                  />
                  
                  {/* Top Left: Category & ID */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-slate-900/80 backdrop-blur-md text-white">
                      {item.category}
                    </span>
                    <span className="px-2 py-1 rounded-full text-[10px] font-mono font-bold bg-white/90 backdrop-blur-md text-slate-800">
                      {item.id}
                    </span>
                  </div>

                  {/* Top Right: Status Badge */}
                  <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-wide ${
                      item.status === 'AVAILABLE' ? 'bg-emerald-500 text-white shadow-xs' :
                      item.status === 'OUT OF STOCK' ? 'bg-rose-500 text-white' :
                      'bg-slate-400 text-white'
                    }`}>
                      {item.status}
                    </span>

                    {/* Today Availability Badge */}
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-wider shadow-md uppercase ${
                      isSoldToday
                        ? 'bg-emerald-600 text-white'
                        : 'bg-rose-600 text-white animate-pulse'
                    }`}>
                      {isSoldToday ? `✓ Dijual Hari Ini (${todayMalay})` : `⛔ Tidak Dijual (${todayMalay})`}
                    </span>
                  </div>

                  {/* Image Resolution Tag */}
                  <div className="absolute bottom-2 left-3 bg-black/60 backdrop-blur-xs text-white text-[9px] px-2 py-0.5 rounded-md font-mono">
                    Saiz: 500 × 350 px
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-bold text-slate-900 text-base leading-snug">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {item.description || 'Tiada deskripsi ramuan.'}
                  </p>

                  {/* Schedule Days Tag List */}
                  <div className="mt-3 p-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="font-bold">Hari Jualan:</span>
                      <span className="font-semibold text-slate-800 truncate max-w-[150px]">
                        {activeDaysCount === 7
                          ? 'Setiap Hari (7 Hari)'
                          : item.availableDays?.join(', ') || 'Semua Hari'}
                      </span>
                    </div>

                    {/* Quick Button for Manager Cafe to manage schedule */}
                    {(isCafeManager || isSuperAdmin) && (
                      <button
                        type="button"
                        onClick={() => handleOpenScheduleModal(item)}
                        className="text-[10px] font-black text-emerald-700 hover:text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md cursor-pointer transition shrink-0"
                        title="Tukar hari jualan menu ini"
                      >
                        Ubah Hari
                      </button>
                    )}
                  </div>

                  {/* Financial Metrics (Kos, Jual, Untung) */}
                  <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-slate-50 rounded-xl">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Kos</span>
                      <p className="text-xs font-black text-slate-700">RM {item.costPrice?.toFixed(2)}</p>
                    </div>
                    <div className="p-2 bg-emerald-50 rounded-xl">
                      <span className="text-[10px] font-bold text-emerald-700 uppercase">Jualan</span>
                      <p className="text-xs font-black text-emerald-700">RM {item.sellingPrice?.toFixed(2)}</p>
                    </div>
                    <div className="p-2 bg-indigo-50 rounded-xl">
                      <span className="text-[10px] font-bold text-indigo-700 uppercase">Untung ({margin}%)</span>
                      <p className="text-xs font-black text-indigo-700">RM {profit?.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>Kuantiti Sedia Ada:</span>
                    <span className="font-bold text-slate-800">{item.stock} {item.unit || 'Unit'}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons (Super Admin & Manager Cafe Only) */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400">
                  Unit: {item.unit || 'Pinggan'}
                </span>

                <div className="flex items-center gap-1.5">
                  {/* Schedule Button */}
                  {(isCafeManager || isSuperAdmin) && (
                    <button
                      onClick={() => handleOpenScheduleModal(item)}
                      className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition cursor-pointer"
                      title="Tetapkan Jadual Hari Jualan (Manager Café)"
                    >
                      <Calendar className="w-4 h-4" />
                    </button>
                  )}

                  {/* Edit Button */}
                  {canManageMenu ? (
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition cursor-pointer"
                      title="Kemaskini Menu (Super Admin & Manager)"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  ) : null}

                  {/* Delete Button */}
                  {canManageMenu ? (
                    <button
                      onClick={() => handleDelete(item)}
                      className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                      title="Padam Menu (Super Admin & Manager)"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  ) : null}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* ================= MODAL 1: ADD / EDIT MENU (WITH 500x350 IMAGE VALIDATION) ================= */}
      {isModalOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fade-in overflow-hidden">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 border border-slate-200 max-h-[90vh] overflow-y-auto text-xs">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-2xl">
                  <UtensilsCrossed className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900">
                    {editingItem ? 'Kemaskini Menu Makanan & Minuman' : 'Tambah Menu Makanan & Minuman Baharu'}
                  </h3>
                  <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">
                    Kawalan Pentadbir: Super Admin & Manager Café
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Nama Menu */}
              <div>
                <label className="font-extrabold text-slate-900 block mb-1">Nama Menu Hidangan *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Nasi Ayam Istimewa GIATMARA"
                  className="w-full px-3.5 py-2.5 bg-white border-2 border-slate-300 rounded-xl focus:border-emerald-600 outline-none font-bold text-slate-950 placeholder:text-slate-400"
                />
              </div>

              {/* Kategori & Unit */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-extrabold text-slate-900 block mb-1">Kategori Hidangan *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-xl focus:border-emerald-600 outline-none font-bold text-slate-950 cursor-pointer"
                  >
                    {categories.map(c => (
                      <option key={c} value={c} className="text-slate-950 font-bold">{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-extrabold text-slate-900 block mb-1">Unit Hidangan</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="Pinggan, Gelas, Mangkuk, Set"
                    className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-xl focus:border-emerald-600 outline-none font-bold text-slate-950 placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Deskripsi */}
              <div>
                <label className="font-extrabold text-slate-900 block mb-1">Deskripsi & Keistimewaan Ramuan</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Huraian ramuan, rempah tradisi, dan hidangan sampingan..."
                  className="w-full px-3.5 py-2 bg-white border-2 border-slate-300 rounded-xl focus:border-emerald-600 outline-none font-medium text-slate-950 placeholder:text-slate-400 resize-none"
                />
              </div>

              {/* ================= SECTION: MUAT NAIK GAMBAR 500 x 350 PIXEL ================= */}
              <div className="p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-black text-slate-900 text-xs flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-emerald-600" />
                      <span>Muat Naik Gambar Makanan/Minuman</span>
                    </label>
                    <span className="text-[10px] text-slate-500 font-semibold block">
                      Ketetapan Rasmi Sistem: <strong className="text-emerald-700">Tepat 500 × 350 pixel sahaja</strong>
                    </span>
                  </div>

                  {formData.image && !imageError && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                      <Check className="w-3 h-3 stroke-[3]" />
                      <span>500 × 350 px Disahkan</span>
                    </span>
                  )}
                </div>

                {/* Upload Input & Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Pilih Gambar dari Komputer</span>
                  </button>

                  <span className="text-[10px] text-slate-400 text-center sm:text-left">
                    (Format: JPG, PNG, WebP)
                  </span>
                </div>

                {/* WARNING MESSAGE IF NOT 500x350 PIXEL */}
                {imageError && (
                  <div className="p-3 bg-rose-50 border-2 border-rose-300 rounded-xl text-rose-900 space-y-2 animate-pulse">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <p className="text-[11px] font-bold leading-snug">
                        {imageError}
                      </p>
                    </div>

                    {/* Auto-Crop Button Solution */}
                    {pendingImageRaw && (
                      <div className="pt-2 border-t border-rose-200 flex items-center justify-between">
                        <span className="text-[10px] text-rose-700 font-semibold">
                          Ingin sistem potong & laraskan secara automatik?
                        </span>
                        <button
                          type="button"
                          onClick={handleAutoCropTo500x350}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-black text-[10px] shadow-sm transition cursor-pointer flex items-center gap-1"
                        >
                          <Crop className="w-3.5 h-3.5" />
                          <span>✂️ Auto-Crop ke Tepat 500 × 350 px</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Preview Image Box */}
                {formData.image && (
                  <div className="relative rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-900 h-40 flex items-center justify-center">
                    <img
                      src={formData.image}
                      alt="Pratonton"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-xs text-white text-[9px] font-mono px-2 py-0.5 rounded-md">
                      Pratonton: 500 × 350 Pixel
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, image: '' }));
                        setImageDimensions(null);
                        setImageError('');
                        setPendingImageRaw(null);
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full transition cursor-pointer"
                      title="Buang gambar ini"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* ================= SECTION: JADUAL HARI JUALAN ================= */}
              <div className="p-3.5 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-black text-slate-900 text-xs flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Jadual Hari Jualan / Dimasak</span>
                  </label>
                  <span className="text-[10px] text-emerald-800 font-bold">
                    {formData.availableDays?.length || 0} / 7 Hari Dipilih
                  </span>
                </div>
                <p className="text-[10px] text-slate-500">
                  Tanda hari-hari di mana hidangan ini disediakan kepada pelanggan. Pada hari yang tidak dipilih, menu akan dinyahaktifkan secara automatik.
                </p>

                <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 pt-1">
                  {DAYS_OF_WEEK.map(day => {
                    const isChecked = formData.availableDays?.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleFormDay(day)}
                        className={`py-1.5 px-2 rounded-xl text-[10px] font-black text-center transition cursor-pointer border ${
                          isChecked
                            ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ================= SECTION: HARGA KOS, HARGA JUAL & UNTUNG ================= */}
              <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-300 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-black text-slate-900 text-xs">Penetapan Harga & Margin Keuntungan</span>
                  <span className="text-[10px] text-slate-500 font-semibold">* Wajib diisi</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-extrabold text-slate-900 block mb-1">Harga Kos Seunit (RM) *</label>
                    <input
                      type="number"
                      step="0.10"
                      min="0"
                      required
                      value={formData.costPrice}
                      onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                      placeholder="Contoh: 5.00"
                      className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-xl font-black text-slate-950 outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="font-extrabold text-slate-900 block mb-1">Harga Jualan Seunit (RM) *</label>
                    <input
                      type="number"
                      step="0.10"
                      min="0"
                      required
                      value={formData.sellingPrice}
                      onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                      placeholder="Contoh: 8.00"
                      className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-xl font-black text-emerald-800 outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                {/* Auto Calculated Gross Profit & Margin Display */}
                <div className="pt-2.5 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-800 font-bold">
                    Untung Kasar Seunit: <strong className="font-black text-emerald-700 text-sm">RM {formProfit.toFixed(2)}</strong>
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-900 font-black">
                    Margin Untung: {formMargin}%
                  </span>
                </div>
              </div>

              {/* Stok & Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-extrabold text-slate-900 block mb-1">Kuantiti Baki (Stok) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-xl font-black text-slate-950 outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="font-extrabold text-slate-900 block mb-1">Status Ketersediaan</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-white border-2 border-slate-300 rounded-xl font-bold text-slate-950 outline-none focus:border-emerald-600 cursor-pointer"
                  >
                    <option value="AVAILABLE" className="text-slate-950 font-bold">AVAILABLE (Ada)</option>
                    <option value="OUT OF STOCK" className="text-slate-950 font-bold">OUT OF STOCK (Habis)</option>
                    <option value="INACTIVE" className="text-slate-950 font-bold">INACTIVE (Nyahaktif)</option>
                  </select>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 font-black text-white bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>{editingItem ? 'Simpan Perubahan Menu' : 'Daftar Menu Baharu'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>,
        document.body
      )}

      {/* ================= MODAL 2: MANAGER CAFE SCHEDULE (PILIH HARI JUALAN) ================= */}
      {isScheduleModalOpen && scheduleTargetItem && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fade-in overflow-hidden">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-slate-200 text-xs">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-2xl">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900">
                    Tetapkan Hari Jualan / Dimasak
                  </h3>
                  <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">
                    Kuasa Khas: Manager Café
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target Item Info */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 mb-4 flex items-center gap-3">
              <img
                src={scheduleTargetItem.image}
                alt={scheduleTargetItem.name}
                className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80";
                }}
              />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-mono text-emerald-700 font-bold block">{scheduleTargetItem.id}</span>
                <h4 className="font-black text-xs text-slate-900 truncate">{scheduleTargetItem.name}</h4>
                <span className="text-[10px] text-slate-500">RM {scheduleTargetItem.sellingPrice?.toFixed(2)} • {scheduleTargetItem.category}</span>
              </div>
            </div>

            <form onSubmit={handleSaveSchedule} className="space-y-4">
              <div>
                <label className="font-black text-slate-900 block mb-1">
                  Pilih Hari-hari Hidangan Ini Dimasak / Dijual:
                </label>
                <p className="text-[10px] text-slate-500 mb-3">
                  Manager Café boleh memilih untuk unactive makanan ini pada hari tertentu. Pada hari yang tidak dipilih, menu ini tidak akan dipaparkan/boleh dipesan di POS, Phone Pelanggan & Tablet Pelayan.
                </p>

                {/* Day Checkboxes */}
                <div className="grid grid-cols-2 gap-2">
                  {DAYS_OF_WEEK.map(day => {
                    const isChecked = scheduleDays.includes(day);
                    const isToday = day === todayMalay;

                    return (
                      <div
                        key={day}
                        onClick={() => toggleScheduleDay(day)}
                        className={`p-2.5 rounded-xl border-2 flex items-center justify-between cursor-pointer transition ${
                          isChecked
                            ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-black'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}} // handled by parent div
                            className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                          />
                          <span className="text-xs">{day}</span>
                        </div>
                        {isToday && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-black">
                            Hari Ini
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                <button
                  type="button"
                  onClick={() => setScheduleDays(['Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu', 'Ahad'])}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold cursor-pointer transition"
                >
                  Semua Hari (7 Hari)
                </button>
                <button
                  type="button"
                  onClick={() => setScheduleDays(['Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat'])}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold cursor-pointer transition"
                >
                  Isnin - Jumaat
                </button>
                <button
                  type="button"
                  onClick={() => setScheduleDays(['Sabtu', 'Ahad'])}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold cursor-pointer transition"
                >
                  Sabtu - Ahad Sahaja
                </button>
                <button
                  type="button"
                  onClick={() => toggleScheduleDay(todayMalay)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition ${
                    scheduleDays.includes(todayMalay)
                      ? 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                      : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                  }`}
                >
                  {scheduleDays.includes(todayMalay) ? `⛔ Nyahaktif Hari Ini (${todayMalay})` : `✓ Aktifkan Hari Ini (${todayMalay})`}
                </button>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-black text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Simpan Jadual Hari Jualan</span>
                </button>
              </div>
            </form>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
};
