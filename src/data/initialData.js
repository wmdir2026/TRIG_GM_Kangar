import giatmaraLogo from '../assets/logo.png';

// Initial Seed Data for TRIG GIATMARA KANGAR Digital Business Management System

export const INITIAL_SETTINGS = {
  businessName: "TECHBYTE & PASTA CAFE",
  subName: "TRIG GIATMARA KANGAR",
  tagline: "Digital Business Management System",
  institution: "GIATMARA Kangar, Perlis",
  businessType: "Training & Entrepreneurship Business",
  address: "Kompleks GIATMARA Kangar, Jalan Kangar-Alor Setar, 01000 Kangar, Perlis",
  phone: "+60 4-976 1234 / +60 19-456 7890",
  email: "trig.kangar@giatmara.edu.my",
  website: "https://giatmara.edu.my/kangar-trig",
  currency: "MYR",
  currencySymbol: "RM",
  taxRate: 0, // 0% for training café
  serviceChargeRate: 0,
  cafeReceiptFooter: "TERIMA KASIH KERANA BERKUNJUNG KE CAFÉ GIATMARA KANGAR!\nSemoga menjamu selera dengan gembira. Sila datang lagi.",
  repairReceiptFooter: "TERIMA KASIH KERANA MENGGUNAKAN PERKHIDMATAN BAIKI SMARTPHONE GIATMARA KANGAR.\nJaminan servis 30 hari untuk alat ganti yang ditukar. Sila simpan resit ini.",
  logoUrl: giatmaraLogo
};

export const INITIAL_USERS = [
  {
    id: "USR-001",
    username: "admin",
    password: "admin123",
    name: "Wan Muhadir (Super Admin)",
    role: "SUPER ADMIN",
    email: "wanmuhadir@giatmara.edu.my",
    phone: "012-4455667",
    department: "Pentadbiran & Pengurusan TRIG",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    status: "ACTIVE"
  },
  {
    id: "USR-002",
    username: "manager_cafe",
    password: "manager123",
    name: "Muhammad Aizat (Pengurus Operasi)",
    role: "MANAGER CAFE",
    email: "aizat.cafe@giatmara.edu.my",
    phone: "013-9876543",
    department: "Pengurusan Kursus Masakan & Café TRIG",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    status: "ACTIVE"
  },
  {
    id: "USR-003",
    username: "cafe",
    password: "cafe123",
    name: "Chef Nur Atiqah, Chef Aizat & Pelatih Masakan",
    role: "CAFE STAFF",
    email: "cafe.kangar@giatmara.edu.my",
    phone: "017-5544332",
    department: "Kursus Seni Masakan & Bakeri",
    avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&auto=format&fit=crop&q=80",
    status: "ACTIVE"
  },
  {
    id: "USR-004",
    username: "cashier_cafe",
    password: "cashier123",
    name: "NUR Atiqah (Juruwang Cafe)",
    role: "CAFE CASHIER",
    email: "atiqah.cafe@giatmara.edu.my",
    phone: "011-2233445",
    department: "Kaunter Jualan & Bayaran Café",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    status: "ACTIVE"
  },
  {
    id: "USR-005",
    username: "manager_repair",
    password: "manager123",
    name: "En. Mohd Rizwan (Pengurus Operasi)",
    role: "MANAGER SMARTPHONE REPAIR",
    email: "rizwan.repair@giatmara.edu.my",
    phone: "019-3344556",
    department: "Pengurusan Baiki Smartphone TRIG",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
    status: "ACTIVE"
  },
  {
    id: "USR-006",
    username: "repair",
    password: "repair123",
    name: "Muhammad Faiz (Teknikal Smartphone)",
    role: "REPAIR STAFF",
    email: "faiz.repair@giatmara.edu.my",
    phone: "019-8877665",
    department: "Kursus Baiki Smartphone & Elektronik",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    status: "ACTIVE"
  },
  {
    id: "USR-007",
    username: "cashier_repair",
    password: "cashier123",
    name: "Mohd Nabil (Juruwang Smartphone)",
    role: "SMARTPHONE CASHIER",
    email: "nabil.repair@giatmara.edu.my",
    phone: "018-7766554",
    department: "Kaunter Jualan Smartphone",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    status: "ACTIVE"
  },
  {
    id: "USR-008",
    username: "pelanggan",
    password: "customer123",
    name: "ROSYITA (Pelanggan Umum)",
    role: "CUSTOMER",
    email: "rosyita.customer@gmail.com",
    phone: "012-3456789",
    department: "Pelanggan Café & Baiki Telefon",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    status: "ACTIVE"
  }
];

export const INITIAL_MENU_CATEGORIES = [
  "Main Dish",
  "Rice",
  "Noodles",
  "Drinks",
  "Dessert",
  "Combo",
  "Others"
];

export const INITIAL_MENU = [
  {
    id: "MENU-001",
    name: "Nasi Ayam Istimewa GIATMARA",
    category: "Rice",
    description: "Nasi wangi aromatik bersama ayam panggang madu rempah tradisi, sup herba, sambal cili khas dan kicap pekat.",
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500&auto=format&fit=crop&q=80",
    costPrice: 5.00,
    sellingPrice: 8.00,
    stock: 45,
    status: "AVAILABLE",
    unit: "Pinggan"
  },
  {
    id: "MENU-002",
    name: "Mee Goreng Mamak Special",
    category: "Noodles",
    description: "Mee kuning digoreng kuali panas bersama cucur rangup, tauhu, ayam empuk, taugeh segar dan perahan limau kasturi.",
    image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=500&auto=format&fit=crop&q=80",
    costPrice: 4.00,
    sellingPrice: 7.00,
    stock: 35,
    status: "AVAILABLE",
    unit: "Pinggan"
  },
  {
    id: "MENU-003",
    name: "Nasi Goreng Kampung Power",
    category: "Rice",
    description: "Nasi goreng berasaskan cili padi kampung, kangkung segar, ikan bilis Langkawi rangup dan telur mata bersarang.",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&auto=format&fit=crop&q=80",
    costPrice: 4.50,
    sellingPrice: 8.00,
    stock: 30,
    status: "AVAILABLE",
    unit: "Pinggan"
  },
  {
    id: "MENU-004",
    name: "Teh Ais Pyorr Padu",
    category: "Drinks",
    description: "Teh wangi pekat ditarik buih gebu bersama susu sejat berkrim, dihidang dingin melepaskan dahaga.",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=80",
    costPrice: 1.20,
    sellingPrice: 3.00,
    stock: 120,
    status: "AVAILABLE",
    unit: "Gelas"
  },
  {
    id: "MENU-005",
    name: "Milo Ais Kaw Leleh",
    category: "Drinks",
    description: "Minuman coklat malt kegemaran Malaysia dibancuh kaw dengan taburan serbuk milo pekat di atas.",
    image: "https://images.unsplash.com/photo-1517578239113-b03992dcdd25?w=500&auto=format&fit=crop&q=80",
    costPrice: 1.50,
    sellingPrice: 3.50,
    stock: 90,
    status: "AVAILABLE",
    unit: "Gelas"
  },
  {
    id: "MENU-006",
    name: "Chicken Chop Black Pepper Sauce",
    category: "Main Dish",
    description: "Peha ayam rangup digoreng emas, dihidang bersama kentang goreng rangup, coleslaw segar dan sos lada hitam Sarawak.",
    image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=500&auto=format&fit=crop&q=80",
    costPrice: 7.50,
    sellingPrice: 13.00,
    stock: 25,
    status: "AVAILABLE",
    unit: "Set"
  },
  {
    id: "MENU-007",
    name: "Kuey Teow Sup Daging Lembu Tempatan",
    category: "Noodles",
    description: "Kuey teow lembut dalam sup herba renek 4 jam bersama hirisan daging lembu empuk, bebola daging dan bawang goreng.",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=80",
    costPrice: 5.20,
    sellingPrice: 8.50,
    stock: 20,
    status: "AVAILABLE",
    unit: "Mangkuk"
  },
  {
    id: "MENU-008",
    name: "Waffle Crispy Coklat & Kacang",
    category: "Dessert",
    description: "Waffle panas dibakar rangup di luar lembut di dalam, disalut lelehan coklat hazelnut dan taburan kacang panggang.",
    image: "https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=500&auto=format&fit=crop&q=80",
    costPrice: 2.80,
    sellingPrice: 6.00,
    stock: 18,
    status: "AVAILABLE",
    unit: "Keping"
  },
  {
    id: "MENU-009",
    name: "Set Kombo Pelatih: Nasi Ayam + Teh Ais",
    category: "Combo",
    description: "Pakej jimat paling popular: 1 Nasi Ayam Istimewa + 1 Gelas Teh Ais Padu.",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80",
    costPrice: 6.00,
    sellingPrice: 10.00,
    stock: 50,
    status: "AVAILABLE",
    unit: "Set"
  }
];

export const INITIAL_TABLES = [
  { id: "M01", name: "Meja 01", capacity: 4, location: "Zon Hadapan Café (Air-Cond)", status: "OCCUPIED", activeOrderId: "ORD-2026-0001" },
  { id: "M02", name: "Meja 02", capacity: 4, location: "Zon Hadapan Café (Air-Cond)", status: "AVAILABLE", activeOrderId: null },
  { id: "M03", name: "Meja 03", capacity: 2, location: "Zon Tepi Tingkap", status: "ORDERING", activeOrderId: "ORD-2026-0003" },
  { id: "M04", name: "Meja 04", capacity: 6, location: "Zon Tengah / Keluarga", status: "AVAILABLE", activeOrderId: null },
  { id: "M05", name: "Meja 05", capacity: 4, location: "Zon Tengah / Pelajar", status: "OCCUPIED", activeOrderId: "ORD-2026-0002" },
  { id: "M06", name: "Meja 06", capacity: 4, location: "Zon Luar / Terbuka", status: "CLEANING", activeOrderId: null },
  { id: "M07", name: "Meja 07", capacity: 2, location: "Zon Luar / Terbuka", status: "AVAILABLE", activeOrderId: null },
  { id: "M08", name: "Meja 08", capacity: 8, location: "Zon VIP / Mesyuarat", status: "AVAILABLE", activeOrderId: null },
  { id: "M09", name: "Meja 09", capacity: 4, location: "Zon Sudut Santai", status: "AVAILABLE", activeOrderId: null },
  { id: "M10", name: "Meja 10", capacity: 4, location: "Zon Sudut Santai", status: "INACTIVE", activeOrderId: null }
];

export const INITIAL_FOOD_ORDERS = [
  {
    id: "ORD-2026-0001",
    receiptNo: "CAF-2026-00001",
    orderType: "DINE_IN",
    tableId: "M01",
    customerName: "Encik Razak",
    customerPhone: "013-4422113",
    pickupTime: null,
    items: [
      { menuId: "MENU-001", name: "Nasi Ayam Istimewa GIATMARA", price: 8.00, costPrice: 5.00, quantity: 2, subtotal: 16.00, notes: "Ayam lebih garing" },
      { menuId: "MENU-004", name: "Teh Ais Pyorr Padu", price: 3.00, costPrice: 1.20, quantity: 2, subtotal: 6.00, notes: "Kurang manis" }
    ],
    subtotal: 22.00,
    discount: 0,
    tax: 0,
    grandTotal: 22.00,
    totalCost: 12.40,
    grossProfit: 9.60,
    paymentMethod: "QR_PAYMENT",
    paymentStatus: "PAID",
    orderStatus: "PREPARING", // NEW, CONFIRMED, PREPARING, READY, SERVED, COMPLETED, CANCELLED
    createdAt: "2026-09-27T10:15:00",
    confirmedAt: "2026-09-27T10:16:00",
    preparedAt: null,
    completedAt: null,
    cashierName: "NUR Atiqah"
  },
  {
    id: "ORD-2026-0002",
    receiptNo: "CAF-2026-00002",
    orderType: "DINE_IN",
    tableId: "M05",
    customerName: "Pelatih Kursus Elektrik",
    customerPhone: "019-7788990",
    pickupTime: null,
    items: [
      { menuId: "MENU-002", name: "Mee Goreng Mamak Special", price: 7.00, costPrice: 4.00, quantity: 1, subtotal: 7.00, notes: "Pedas lebih" },
      { menuId: "MENU-005", name: "Milo Ais Kaw Leleh", price: 3.50, costPrice: 1.50, quantity: 1, subtotal: 3.50, notes: "" }
    ],
    subtotal: 10.50,
    discount: 0,
    tax: 0,
    grandTotal: 10.50,
    totalCost: 5.50,
    grossProfit: 5.00,
    paymentMethod: "CASH",
    paymentStatus: "PAID",
    orderStatus: "READY",
    createdAt: "2026-09-27T10:30:00",
    confirmedAt: "2026-09-27T10:31:00",
    preparedAt: "2026-09-27T10:42:00",
    completedAt: null,
    cashierName: "NUR Atiqah"
  },
  {
    id: "ORD-2026-0003",
    receiptNo: "CAF-2026-00003",
    orderType: "TAKEAWAY",
    tableId: null,
    customerName: "Cikgu Salmah",
    customerPhone: "017-6655441",
    pickupTime: "11:15 AM",
    items: [
      { menuId: "MENU-003", name: "Nasi Goreng Kampung Power", price: 8.00, costPrice: 4.50, quantity: 3, subtotal: 24.00, notes: "Bungkus asing-asing" },
      { menuId: "MENU-004", name: "Teh Ais Pyorr Padu", price: 3.00, costPrice: 1.20, quantity: 3, subtotal: 9.00, notes: "Ikat tepi" }
    ],
    subtotal: 33.00,
    discount: 0,
    tax: 0,
    grandTotal: 33.00,
    totalCost: 17.10,
    grossProfit: 15.90,
    paymentMethod: "QR_PAYMENT",
    paymentStatus: "PAID",
    orderStatus: "CONFIRMED",
    createdAt: "2026-09-27T10:45:00",
    confirmedAt: "2026-09-27T10:46:00",
    preparedAt: null,
    completedAt: null,
    cashierName: "NUR Atiqah"
  },
  {
    id: "ORD-2026-0004",
    receiptNo: "CAF-2026-00004",
    orderType: "DINE_IN",
    tableId: "M04",
    customerName: "Encik Farhan & Keluarga",
    customerPhone: "012-9988776",
    pickupTime: null,
    items: [
      { menuId: "MENU-006", name: "Chicken Chop Black Pepper Sauce", price: 13.00, costPrice: 7.50, quantity: 2, subtotal: 26.00, notes: "Sos asing" },
      { menuId: "MENU-008", name: "Waffle Crispy Coklat & Kacang", price: 6.00, costPrice: 2.80, quantity: 2, subtotal: 12.00, notes: "" },
      { menuId: "MENU-005", name: "Milo Ais Kaw Leleh", price: 3.50, costPrice: 1.50, quantity: 2, subtotal: 7.00, notes: "" }
    ],
    subtotal: 45.00,
    discount: 0,
    tax: 0,
    grandTotal: 45.00,
    totalCost: 23.60,
    grossProfit: 21.40,
    paymentMethod: "CASH",
    paymentStatus: "PAID",
    orderStatus: "COMPLETED",
    createdAt: "2026-09-27T08:30:00",
    confirmedAt: "2026-09-27T08:32:00",
    preparedAt: "2026-09-27T08:48:00",
    completedAt: "2026-09-27T09:15:00",
    cashierName: "NUR Atiqah"
  }
];

export const INITIAL_CUSTOMERS = [
  {
    id: "CUST-001",
    name: "Ahmad bin Daud",
    phone: "019-4567812",
    email: "ahmad.daud@gmail.com",
    address: "No 14, Taman Sena Indah, 01000 Kangar, Perlis",
    dateRegistered: "2026-01-15",
    totalRepairs: 2,
    totalSpending: 290.00,
    lastRepair: "2026-09-26",
    outstandingPayment: 0
  },
  {
    id: "CUST-002",
    name: "Siti Sarah binti Zainal",
    phone: "013-8877112",
    email: "sitisarah99@yahoo.com",
    address: "Lot 220, Kampung Seriab, 01000 Kangar, Perlis",
    dateRegistered: "2026-02-10",
    totalRepairs: 1,
    totalSpending: 160.00,
    lastRepair: "2026-09-27",
    outstandingPayment: 0
  },
  {
    id: "CUST-003",
    name: "Chong Wei Ming",
    phone: "016-5544991",
    email: "chongwm@outlook.com",
    address: "No 88, Jalan Jubli Perak, 01000 Kangar, Perlis",
    dateRegistered: "2026-03-02",
    totalRepairs: 3,
    totalSpending: 420.00,
    lastRepair: "2026-09-25",
    outstandingPayment: 0
  },
  {
    id: "CUST-004",
    name: "Muthusamy a/l Raman",
    phone: "017-3322119",
    email: "muthu_raman@gmail.com",
    address: "No 5, Taman Guru Jaya, 01000 Kangar, Perlis",
    dateRegistered: "2026-04-18",
    totalRepairs: 1,
    totalSpending: 80.00,
    lastRepair: "2026-09-20",
    outstandingPayment: 0
  },
  {
    id: "CUST-005",
    name: "Cikgu Nurul Hidayah",
    phone: "012-7711334",
    email: "nurul.hidayah@moe.gov.my",
    address: "Kolej Vokasional Kangar, 01000 Kangar, Perlis",
    dateRegistered: "2026-09-26",
    totalRepairs: 1,
    totalSpending: 130.00,
    lastRepair: "2026-09-26",
    outstandingPayment: 0
  }
];

export const INITIAL_REPAIR_JOBS = [
  {
    id: "REP-2026-00001",
    receiptNo: "REP-2026-00001",
    customerId: "CUST-001",
    customerName: "Ahmad bin Daud",
    customerPhone: "019-4567812",
    deviceBrand: "Samsung",
    deviceModel: "Galaxy A55 5G",
    imeiSerial: "358941109845210",
    deviceColor: "Awesome Iceblue",
    conditionChecklist: {
      screenCondition: "DAMAGED", // Retak teruk & garis hitam
      bodyCondition: "FAIR", // Sedikit calar tepi
      cameraCondition: "GOOD",
      buttons: "GOOD",
      chargingPort: "GOOD",
      speaker: "GOOD",
      microphone: "GOOD",
      waterDamageIndicator: "NO",
      otherDamage: "Casing belakang calar halus"
    },
    problemReported: "Skrin pecah selepas terjatuh atas simen, paparan hitam berkelip dan touch screen tidak berfungsi.",
    diagnosis: "LCD Panel + Touch Digitizer retak dalaman. Motherboard & bateri dalam keadaan baik voltan stabil.",
    damageType: "Broken Screen",
    notes: "Tukar set LCD original OEM Samsung Galaxy A55. Perlu pasang tempered glass percuma.",
    technician: "Muhammad Faiz (Teknikal Smartphone)",
    dateReceived: "2026-09-26T14:30:00",
    estimatedCompletionDate: "2026-09-27T16:00:00",
    partsUsed: [
      { partId: "INV-SP-001", name: "LCD Screen Replacement Samsung Galaxy A55", costPrice: 85.00, sellingPrice: 130.00, quantity: 1 }
    ],
    labourCost: 30.00,
    partsCost: 85.00,
    totalCost: 115.00,
    sellingPrice: 160.00,
    grossProfit: 45.00,
    quotationStatus: "APPROVED", // PENDING, APPROVED, REJECTED
    repairStatus: "TESTING", // RECEIVED -> DIAGNOSIS -> QUOTATION -> CUSTOMER APPROVAL -> REPAIRING -> TESTING -> READY FOR COLLECTION -> COMPLETED
    paymentStatus: "PENDING", // PENDING, PAID
    paymentMethod: null,
    warrantyPeriod: "30 Hari Waranti Servis GIATMARA",
    completedAt: null
  },
  {
    id: "REP-2026-00002",
    receiptNo: "REP-2026-00002",
    customerId: "CUST-002",
    customerName: "Siti Sarah binti Zainal",
    customerPhone: "013-8877112",
    deviceBrand: "Apple",
    deviceModel: "iPhone 11",
    imeiSerial: "354012098712345",
    deviceColor: "Black",
    conditionChecklist: {
      screenCondition: "GOOD",
      bodyCondition: "GOOD",
      cameraCondition: "GOOD",
      buttons: "GOOD",
      chargingPort: "GOOD",
      speaker: "GOOD",
      microphone: "GOOD",
      waterDamageIndicator: "NO",
      otherDamage: "Bateri menggelembung sedikit (Battery Health 68%)"
    },
    problemReported: "Bateri cepat habis kurang 2 jam dan telefon tiba-tiba mati bila buka kamera.",
    diagnosis: "Bateri degrade teruk (Health 68%), internal resistance tinggi menyebabkan shutdown.",
    damageType: "Battery Problem",
    notes: "Tukar bateri High Capacity iPhone 11 + reprogram battery health status.",
    technician: "Muhammad Faiz (Teknikal Smartphone)",
    dateReceived: "2026-09-27T09:00:00",
    estimatedCompletionDate: "2026-09-27T12:00:00",
    partsUsed: [
      { partId: "INV-SP-002", name: "High-Capacity Battery iPhone 11 (3110mAh)", costPrice: 45.00, sellingPrice: 80.00, quantity: 1 }
    ],
    labourCost: 25.00,
    partsCost: 45.00,
    totalCost: 70.00,
    sellingPrice: 105.00,
    grossProfit: 35.00,
    quotationStatus: "APPROVED",
    repairStatus: "READY FOR COLLECTION",
    paymentStatus: "PAID",
    paymentMethod: "QR_PAYMENT",
    warrantyPeriod: "90 Hari Waranti Bateri",
    completedAt: "2026-09-27T11:30:00"
  },
  {
    id: "REP-2026-00003",
    receiptNo: "REP-2026-00003",
    customerId: "CUST-003",
    customerName: "Chong Wei Ming",
    customerPhone: "016-5544991",
    deviceBrand: "Xiaomi / Redmi",
    deviceModel: "Redmi Note 12",
    imeiSerial: "867123049811223",
    deviceColor: "Ice Blue",
    conditionChecklist: {
      screenCondition: "GOOD",
      bodyCondition: "GOOD",
      cameraCondition: "GOOD",
      buttons: "GOOD",
      chargingPort: "DAMAGED", // Pin longgar & berkarat
      speaker: "GOOD",
      microphone: "FAIR",
      waterDamageIndicator: "YES",
      otherDamage: "Kesan lembapan pada port bawah"
    },
    problemReported: "Tidak boleh caj langsung walaupun tukar cable baru.",
    diagnosis: "Sub-board charging port Type-C pin patah dan kesan kakisan cecair.",
    damageType: "Charging Problem",
    notes: "Tukar set charging sub-board original IC fast charge.",
    technician: "Muhammad Faiz (Teknikal Smartphone)",
    dateReceived: "2026-09-27T10:00:00",
    estimatedCompletionDate: "2026-09-28T14:00:00",
    partsUsed: [
      { partId: "INV-SP-003", name: "Charging Port Flex Board Redmi Note 12", costPrice: 18.00, sellingPrice: 40.00, quantity: 1 }
    ],
    labourCost: 20.00,
    partsCost: 18.00,
    totalCost: 38.00,
    sellingPrice: 60.00,
    grossProfit: 22.00,
    quotationStatus: "PENDING",
    repairStatus: "QUOTATION",
    paymentStatus: "PENDING",
    paymentMethod: null,
    warrantyPeriod: "30 Hari Waranti Servis",
    completedAt: null
  }
];

export const INITIAL_INVENTORY = [
  // CAFÉ RAW MATERIALS & PACKAGING
  {
    id: "INV-CF-001",
    sku: "CF-BERAS-WNG-10KG",
    name: "Beras Wangi AAA (10kg)",
    category: "Café Raw Materials",
    brand: "Jasmine Super Special",
    model: "10kg Bag",
    supplierId: "SUP-001",
    costPrice: 38.00,
    sellingPrice: 0.00,
    currentStock: 8,
    minStock: 3,
    unit: "Beg",
    location: "Stor Kering Café Rak A1",
    status: "IN_STOCK"
  },
  {
    id: "INV-CF-002",
    sku: "CF-AYAM-SEGAR-1KG",
    name: "Ayam Segar Standard (Potong 8)",
    category: "Café Raw Materials",
    brand: "Pembekal Tempatan Perlis",
    model: "Standard 1.8kg",
    supplierId: "SUP-001",
    costPrice: 14.50,
    sellingPrice: 0.00,
    currentStock: 15,
    minStock: 5,
    unit: "Ekor",
    location: "Chiller Utama Café",
    status: "IN_STOCK"
  },
  {
    id: "INV-CF-003",
    sku: "CF-MEE-KNG-500G",
    name: "Mee Kuning Basah Segar",
    category: "Café Raw Materials",
    brand: "Cap Kunci Emas",
    model: "500g Pek",
    supplierId: "SUP-001",
    costPrice: 2.20,
    sellingPrice: 0.00,
    currentStock: 22,
    minStock: 8,
    unit: "Pek",
    location: "Chiller Sayur Café",
    status: "IN_STOCK"
  },
  {
    id: "INV-CF-004",
    sku: "CF-MILO-SERBUK-2KG",
    name: "Serbuk Coklat Milo Activ-Go (2kg)",
    category: "Café Raw Materials",
    brand: "Nestle",
    model: "2kg Pouch",
    supplierId: "SUP-001",
    costPrice: 39.90,
    sellingPrice: 0.00,
    currentStock: 6,
    minStock: 2,
    unit: "Pek",
    location: "Stor Kering Café Rak B2",
    status: "IN_STOCK"
  },
  {
    id: "INV-PKG-001",
    sku: "PKG-BOX-KRAFT-LUNCH",
    name: "Kotak Makanan Biodegradable Kraft Box",
    category: "Food Packaging",
    brand: "EcoPack Malaysia",
    model: "Medium 100pcs",
    supplierId: "SUP-003",
    costPrice: 32.00,
    sellingPrice: 0.00,
    currentStock: 4,
    minStock: 5,
    unit: "Kotak (100pcs)",
    location: "Stor Pembungkusan Rak C1",
    status: "LOW_STOCK"
  },

  // SMARTPHONE SPARE PARTS
  {
    id: "INV-SP-001",
    sku: "SP-LCD-SAMS-A55",
    name: "LCD Screen Replacement Samsung Galaxy A55 5G (OEM Super AMOLED)",
    category: "Smartphone Spare Parts",
    brand: "Samsung Parts OEM",
    model: "SM-A556B",
    supplierId: "SUP-002",
    costPrice: 85.00,
    sellingPrice: 130.00,
    currentStock: 2, // Low stock trigger demo
    minStock: 5,
    unit: "Unit",
    location: "Kabinet Komponen Baiki - Rak SP1",
    status: "LOW_STOCK"
  },
  {
    id: "INV-SP-002",
    sku: "SP-BAT-IP11-3110",
    name: "High-Capacity Battery iPhone 11 (3110mAh)",
    category: "Smartphone Spare Parts",
    brand: "Apple High-Tier Cell",
    model: "A2111 / A2223",
    supplierId: "SUP-002",
    costPrice: 45.00,
    sellingPrice: 80.00,
    currentStock: 8,
    minStock: 3,
    unit: "Unit",
    location: "Kabinet Komponen Baiki - Rak SP2",
    status: "IN_STOCK"
  },
  {
    id: "INV-SP-003",
    sku: "SP-PORT-REDMI-N12",
    name: "Charging Port Flex Board Redmi Note 12 Type-C Fast Charge",
    category: "Smartphone Spare Parts",
    brand: "Redmi Service Parts",
    model: "Note 12 4G/5G",
    supplierId: "SUP-002",
    costPrice: 18.00,
    sellingPrice: 40.00,
    currentStock: 10,
    minStock: 4,
    unit: "Unit",
    location: "Laci Komponen Mikro 03",
    status: "IN_STOCK"
  },
  {
    id: "INV-SP-004",
    sku: "SP-LCD-IP13-OLED",
    name: "OLED Screen Display iPhone 13 Pro 120Hz",
    category: "Smartphone Spare Parts",
    brand: "iFix Pro Grade",
    model: "iPhone 13 Pro",
    supplierId: "SUP-002",
    costPrice: 190.00,
    sellingPrice: 280.00,
    currentStock: 1,
    minStock: 3,
    unit: "Unit",
    location: "Kabinet Komponen Baiki - Rak SP1",
    status: "LOW_STOCK"
  },
  {
    id: "INV-SP-005",
    sku: "SP-CAM-SAMS-S22",
    name: "Main Camera Module 50MP Samsung S22",
    category: "Smartphone Spare Parts",
    brand: "Samsung Original Refurb",
    model: "Galaxy S22",
    supplierId: "SUP-002",
    costPrice: 75.00,
    sellingPrice: 120.00,
    currentStock: 4,
    minStock: 2,
    unit: "Unit",
    location: "Laci Optik & Sensor",
    status: "IN_STOCK"
  },

  // SMARTPHONE ACCESSORIES
  {
    id: "INV-ACC-001",
    sku: "ACC-CBL-TYPEC-60W",
    name: "Braided Fast Charge USB Type-C to Type-C 60W Cable (1.2m)",
    category: "Smartphone Accessories",
    brand: "ProTech Accessories",
    model: "PT-C60W",
    supplierId: "SUP-004",
    costPrice: 8.00,
    sellingPrice: 15.00,
    currentStock: 20,
    minStock: 8,
    unit: "Unit",
    location: "Etalase Aksesori Hadapan Rak A",
    status: "IN_STOCK"
  },
  {
    id: "INV-ACC-002",
    sku: "ACC-CASE-CLEAR-MAG",
    name: "Shockproof Magnetic Clear Case Armor (All Models)",
    category: "Smartphone Accessories",
    brand: "ArmorShield",
    model: "Universal Fit iPhone/Samsung",
    supplierId: "SUP-004",
    costPrice: 10.00,
    sellingPrice: 20.00,
    currentStock: 15,
    minStock: 6,
    unit: "Unit",
    location: "Etalase Aksesori Hadapan Rak B",
    status: "IN_STOCK"
  },
  {
    id: "INV-ACC-003",
    sku: "ACC-TG-9H-PRIVACY",
    name: "9H Privacy Tempered Glass Screen Protector with Easy Installer",
    category: "Smartphone Accessories",
    brand: "GlassPro Tech",
    model: "9H HD/Privacy",
    supplierId: "SUP-004",
    costPrice: 5.00,
    sellingPrice: 12.00,
    currentStock: 25,
    minStock: 10,
    unit: "Unit",
    location: "Etalase Aksesori Hadapan Rak C",
    status: "IN_STOCK"
  },
  {
    id: "INV-ACC-004",
    sku: "ACC-CHG-GAN-65W",
    name: "GaN 65W 3-Port Fast Wall Charger (2x USB-C + 1x USB-A)",
    category: "Smartphone Accessories",
    brand: "PowerVolt Tech",
    model: "PV-GAN65",
    supplierId: "SUP-004",
    costPrice: 38.00,
    sellingPrice: 69.00,
    currentStock: 12,
    minStock: 4,
    unit: "Unit",
    location: "Etalase Aksesori Hadapan Rak D",
    status: "IN_STOCK"
  },
  {
    id: "INV-ACC-005",
    sku: "ACC-PB-20000-PD",
    name: "Power Bank 20,000mAh 22.5W Fast Charging LED Display",
    category: "Smartphone Accessories",
    brand: "MaxPower Pro",
    model: "MP-20K-PD",
    supplierId: "SUP-004",
    costPrice: 42.00,
    sellingPrice: 79.00,
    currentStock: 3,
    minStock: 5,
    unit: "Unit",
    location: "Etalase Aksesori Hadapan Rak D",
    status: "LOW_STOCK"
  },

  // REPAIR TOOLS
  {
    id: "INV-TL-001",
    sku: "TL-HOT-AIR-858D",
    name: "Quick 858D SMD Hot Air Rework Station Digital",
    category: "Repair Tools",
    brand: "Quick Original",
    model: "858D ESD Safe",
    supplierId: "SUP-004",
    costPrice: 160.00,
    sellingPrice: 0.00,
    currentStock: 6,
    minStock: 2,
    unit: "Set",
    location: "Meja Kerja Bengkel Baiki Stesen 1-6",
    status: "IN_STOCK"
  }
];

export const INITIAL_REPAIR_TOOLS = [
  {
    id: "TOOL-001",
    name: "Quick 858D SMD Hot Air Rework Station",
    category: "Soldering & Desoldering",
    brand: "Quick",
    serialNumber: "QK858-2025-0811",
    quantity: 6,
    purchaseDate: "2025-06-10",
    purchasePrice: 160.00,
    location: "Bengkel Baiki Smartphone - Meja Stesen 1-6",
    condition: "GOOD", // GOOD, FAIR, DAMAGED, UNDER_MAINTENANCE
    status: "AVAILABLE" // AVAILABLE, IN_USE, MAINTENANCE, DISPOSED
  },
  {
    id: "TOOL-002",
    name: "T12-X Digital Soldering Iron Station (Fast Heat)",
    category: "Soldering & Desoldering",
    brand: "OSS Team",
    serialNumber: "OSS-T12-9901",
    quantity: 6,
    purchaseDate: "2025-06-10",
    purchasePrice: 145.00,
    location: "Bengkel Baiki Smartphone - Meja Stesen 1-6",
    condition: "GOOD",
    status: "IN_USE"
  },
  {
    id: "TOOL-003",
    name: "Trinocular Stereo Microscope 7X-45X with 4K HDMI Camera",
    category: "Diagnostics & Inspection",
    brand: "Relife Professional",
    serialNumber: "RL-M3T-4K-001",
    quantity: 2,
    purchaseDate: "2025-08-15",
    purchasePrice: 1250.00,
    location: "Stesen Diagnosis Utama Bengkel",
    condition: "GOOD",
    status: "AVAILABLE"
  },
  {
    id: "TOOL-004",
    name: "LCD Screen Heating Separator Machine (Vacuum Pump)",
    category: "Screen Repair & Refurbishment",
    brand: "Sunshine Tools",
    serialNumber: "SS-918K-4421",
    quantity: 2,
    purchaseDate: "2025-07-20",
    purchasePrice: 280.00,
    location: "Meja Pembaikan Skrin Bengkel",
    condition: "GOOD",
    status: "AVAILABLE"
  },
  {
    id: "TOOL-005",
    name: "Precision Magnetic Screwdriver 128-in-1 Toolkit",
    category: "Hand Tools",
    brand: "Jakemy Precision",
    serialNumber: "JM-8187-SET1",
    quantity: 10,
    purchaseDate: "2025-05-05",
    purchasePrice: 55.00,
    location: "Rak Kotak Perkakas Individu Pelatih",
    condition: "FAIR",
    status: "IN_USE"
  },
  {
    id: "TOOL-006",
    name: "DC Regulated Power Supply 30V 5A Short Circuit Detector",
    category: "Power Diagnostics",
    brand: "KORAD Tech",
    serialNumber: "KD3005D-119",
    quantity: 4,
    purchaseDate: "2025-06-12",
    purchasePrice: 240.00,
    location: "Stesen Ujian Voltan & Motherboard",
    condition: "GOOD",
    status: "AVAILABLE"
  }
];

export const INITIAL_SUPPLIERS = [
  {
    id: "SUP-001",
    name: "Pembekal Makanan & Bahan Basah Utara Sdn Bhd",
    contactPerson: "Encik Fauzi Harun",
    phone: "019-4433221",
    email: "fauzi.pembekalutara@gmail.com",
    address: "Kawasan Perusahaan Ringan Jejawi, 02600 Arau, Perlis",
    productCategory: "Café Raw Materials & Groceries",
    notes: "Penghantaran setiap Isnin & Khamis pagi jam 8.00 pagi.",
    status: "ACTIVE",
    totalPurchases: 4850.00
  },
  {
    id: "SUP-002",
    name: "Mega Smartphone Parts & LCD Supplier KL",
    contactPerson: "Mr. Kelvin Tan",
    phone: "012-3344882",
    email: "sales@megasmartphoneparts.com.my",
    address: "Level 4, Plaza Low Yat, Jalan Bukit Bintang, 55100 Kuala Lumpur",
    productCategory: "Smartphone Spare Parts & Screens",
    notes: "Penghantaran kurier express 24 jam terus ke GIATMARA Kangar.",
    status: "ACTIVE",
    totalPurchases: 8920.00
  },
  {
    id: "SUP-003",
    name: "Kangar Eco Packaging & Disposables Enterprise",
    contactPerson: "Puan Zaiton Kassim",
    phone: "013-5599223",
    email: "zaiton.ecopack@yahoo.com",
    address: "No 12, Pusat Perniagaan Sena, 01000 Kangar, Perlis",
    productCategory: "Food Packaging & Boxes",
    notes: "Pembekal kotak makanan mesra alam dan cawan kertas.",
    status: "ACTIVE",
    totalPurchases: 1450.00
  },
  {
    id: "SUP-004",
    name: "ProTech Electronic Tools & Mobile Accessories Ltd",
    contactPerson: "Encik Wan Shahril",
    phone: "017-8899123",
    email: "shahril@protech-tools.com",
    address: "Bayan Lepas Industrial Park Phase 3, 11900 Bayan Lepas, Pulau Pinang",
    productCategory: "Repair Tools & Phone Accessories",
    notes: "Alat perkakas bengkel berkualiti tinggi dan aksesori telefon tahan lasak.",
    status: "ACTIVE",
    totalPurchases: 6300.00
  }
];

export const INITIAL_PURCHASE_REQUESTS = [
  {
    id: "PR-2026-0001",
    requestDate: "2026-09-26T11:00:00",
    requesterName: "Muhammad Faiz (Teknikal Smartphone)",
    department: "Kursus Baiki Smartphone",
    supplierId: "SUP-002",
    supplierName: "Mega Smartphone Parts & LCD Supplier KL",
    items: [
      { itemId: "INV-SP-001", name: "LCD Screen Replacement Samsung Galaxy A55 5G", quantity: 5, unitCost: 85.00, subtotal: 425.00 },
      { itemId: "INV-SP-004", name: "OLED Screen Display iPhone 13 Pro 120Hz", quantity: 3, unitCost: 190.00, subtotal: 570.00 }
    ],
    totalAmount: 995.00,
    purpose: "Stok LCD Samsung A55 dan iPhone 13 Pro telah mencecah paras minimum amaran stok rendah.",
    status: "PENDING_APPROVAL", // DRAFT, PENDING_APPROVAL, APPROVED, ORDERED, RECEIVED, CANCELLED
    managerRemarks: "",
    approvedBy: null,
    approvedAt: null
  },
  {
    id: "PR-2026-0002",
    requestDate: "2026-09-25T09:30:00",
    requesterName: "Chef Nur Atiqah",
    department: "Kursus Masakan & Café",
    supplierId: "SUP-003",
    supplierName: "Kangar Eco Packaging & Disposables Enterprise",
    items: [
      { itemId: "INV-PKG-001", name: "Kotak Makanan Biodegradable Kraft Box", quantity: 10, unitCost: 32.00, subtotal: 320.00 }
    ],
    totalAmount: 320.00,
    purpose: "Keperluan kotak bungkus takeaway untuk tempahan jamuan hari keusahawanan.",
    status: "APPROVED",
    managerRemarks: "Diluluskan untuk pembelian segera.",
    approvedBy: "Muhammad Aizat (Pengurus Operasi)",
    approvedAt: "2026-09-25T14:00:00"
  }
];

export const INITIAL_PURCHASE_ORDERS = [
  {
    id: "PO-2026-0001",
    prId: "PR-2026-0002",
    poDate: "2026-09-25T15:00:00",
    supplierId: "SUP-003",
    supplierName: "Kangar Eco Packaging & Disposables Enterprise",
    items: [
      { itemId: "INV-PKG-001", name: "Kotak Makanan Biodegradable Kraft Box", quantity: 10, unitCost: 32.00, subtotal: 320.00 }
    ],
    totalAmount: 320.00,
    expectedDelivery: "2026-09-28",
    status: "ORDERED", // ORDERED, RECEIVED, CANCELLED
    receivedDate: null,
    receivedBy: null
  }
];

export const INITIAL_STOCK_TRANSACTIONS = [
  {
    id: "TX-001",
    date: "2026-09-25T10:00:00",
    itemId: "INV-SP-001",
    itemName: "LCD Screen Replacement Samsung Galaxy A55",
    type: "STOCK_IN",
    quantity: 5,
    beforeQty: 0,
    afterQty: 5,
    reference: "PO-2026-0000 (Terima Stok)",
    user: "Wan Muhadir"
  },
  {
    id: "TX-002",
    date: "2026-09-26T15:00:00",
    itemId: "INV-SP-001",
    itemName: "LCD Screen Replacement Samsung Galaxy A55",
    type: "USED_FOR_REPAIR",
    quantity: 1,
    beforeQty: 5,
    afterQty: 4,
    reference: "REP-2026-00001 (Ahmad)",
    user: "Muhammad Faiz"
  },
  {
    id: "TX-003",
    date: "2026-09-27T08:00:00",
    itemId: "INV-SP-001",
    itemName: "LCD Screen Replacement Samsung Galaxy A55",
    type: "USED_FOR_REPAIR",
    quantity: 2,
    beforeQty: 4,
    afterQty: 2,
    reference: "REP-2026-00004 & Demo",
    user: "Muhammad Faiz"
  },
  {
    id: "TX-004",
    date: "2026-09-26T16:00:00",
    itemId: "INV-ACC-001",
    itemName: "Braided Fast Charge USB Type-C to Type-C 60W Cable",
    type: "SOLD",
    quantity: 2,
    beforeQty: 22,
    afterQty: 20,
    reference: "SAL-2026-00002 (POS Jualan Aksesori)",
    user: "Mohd Nabil"
  }
];

export const INITIAL_SALES = [
  {
    id: "SAL-2026-00001",
    receiptNo: "CAF-2026-00004",
    module: "CAFÉ",
    referenceId: "ORD-2026-0004",
    customerName: "Encik Farhan & Keluarga",
    itemsSummary: "2x Chicken Chop, 2x Waffle, 2x Milo Ais",
    costPrice: 23.60,
    sellingPrice: 45.00,
    grossProfit: 21.40,
    paymentMethod: "CASH",
    paymentStatus: "PAID",
    date: "2026-09-27T09:15:00",
    cashierName: "NUR Atiqah"
  },
  {
    id: "SAL-2026-00002",
    receiptNo: "ACC-2026-00001",
    module: "ACCESSORIES",
    referenceId: "POS-ACC-001",
    customerName: "Pelajar Institut",
    itemsSummary: "2x Braided Fast Charge Type-C Cable",
    costPrice: 16.00,
    sellingPrice: 30.00,
    grossProfit: 14.00,
    paymentMethod: "QR_PAYMENT",
    paymentStatus: "PAID",
    date: "2026-09-26T16:00:00",
    cashierName: "Mohd Nabil"
  },
  {
    id: "SAL-2026-00003",
    receiptNo: "REP-2026-00002",
    module: "REPAIR",
    referenceId: "REP-2026-00002",
    customerName: "Siti Sarah binti Zainal",
    itemsSummary: "Tukar Bateri iPhone 11 (High Cap) + Servis",
    costPrice: 45.00, // labour is internal
    sellingPrice: 105.00,
    grossProfit: 60.00, // (105 - 45 parts)
    paymentMethod: "QR_PAYMENT",
    paymentStatus: "PAID",
    date: "2026-09-27T11:35:00",
    cashierName: "Mohd Nabil"
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: "NOTIF-001",
    title: "Pesanan Makanan Baru Diterima!",
    message: "Meja M05 membuat pesanan ORD-2026-0002 (Mee Goreng + Milo Ais). Sila sediakan di dapur.",
    type: "ORDER",
    isRead: false,
    timestamp: "2026-09-27T10:30:00",
    link: "kitchen"
  },
  {
    id: "NOTIF-002",
    title: "Amaran Stok Rendah!",
    message: "Stok 'LCD Samsung Galaxy A55' berbaki 2 unit (Paras minimum: 5 unit). Sila buat Permohonan Pembelian.",
    type: "STOCK",
    isRead: false,
    timestamp: "2026-09-27T08:15:00",
    link: "low-stock"
  },
  {
    id: "NOTIF-003",
    title: "Kelulusan Pembelian Diperlukan",
    message: "Permohonan Pembelian PR-2026-0001 (RM 995.00) dari Kursus Baiki Smartphone sedang menunggu kelulusan Pengurus.",
    type: "APPROVAL",
    isRead: false,
    timestamp: "2026-09-26T11:05:00",
    link: "purchase-requests"
  },
  {
    id: "NOTIF-004",
    title: "Job Baiki Sedia Untuk Diambil",
    message: "iPhone 11 pelanggan Siti Sarah (REP-2026-00002) siap dibaiki & diuji. Sedia untuk kutipan & bayaran.",
    type: "REPAIR",
    isRead: true,
    timestamp: "2026-09-27T11:30:00",
    link: "repair-jobs"
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: "LOG-001",
    user: "Wan Muhadir (Super Admin)",
    action: "Memulakan sistem TRIG GIATMARA KANGAR & menjana data simulasi operasi.",
    module: "SYSTEM",
    timestamp: "2026-09-27T08:00:00"
  },
  {
    id: "LOG-002",
    user: "Chef Nur Atiqah (Cafe Staff)",
    action: "Menukar status pesanan ORD-2026-0002 kepada PREPARING di Paparan Dapur.",
    module: "CAFÉ",
    timestamp: "2026-09-27T10:31:00"
  },
  {
    id: "LOG-003",
    user: "Muhammad Faiz (Repair Staff)",
    action: "Mengemas kini status pembaikan REP-2026-00001 ke TESTING selepas pemasangan LCD baru.",
    module: "REPAIR",
    timestamp: "2026-09-27T10:45:00"
  },
  {
    id: "LOG-004",
    user: "Muhammad Aizat (Manager Cafe)",
    action: "Meluluskan Permohonan Pembelian PR-2026-0002 untuk Kotak Makanan EcoPack.",
    module: "PROCUREMENT",
    timestamp: "2026-09-25T14:00:00"
  },
  {
    id: "LOG-005",
    user: "NUR Atiqah (Cafe Cashier)",
    action: "Menyelesaikan transaksi jualan SAL-2026-00001 bernilai RM 45.00 secara Tunai.",
    module: "SALES",
    timestamp: "2026-09-27T09:15:00"
  }
];
