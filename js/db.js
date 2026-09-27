/**
 * TRIG GIATMARA KANGAR - Database & State Management Layer
 * Uses localStorage as persistent mock database with fully populated seed data,
 * real relational queries, auto ID generation, stock deduction, and audit trail logging.
 */

const DB_KEY_PREFIX = 'trig_giatmara_';

// Initial Database Seeds
const SEED_DATA = {
  settings: {
    businessName: 'TRIG GIATMARA KANGAR',
    subTitle: 'Digital Business Management System',
    businessType: 'Latihan & Keusahawanan TVET GIATMARA',
    address: 'GIATMARA Kangar, Jalan Pengkalan Asam, 01000 Kangar, Perlis',
    phone: '04-976 1234',
    email: 'trig.kangar@giatmara.edu.my',
    taxRate: 0, // % SST / Service tax
    serviceChargeRate: 0,
    currency: 'MYR',
    currencySymbol: 'RM',
    receiptFooter: 'TERIMA KASIH KERANA BERKUNJUNG / MENGGUNAKAN PERKHIDMATAN KAMI.\nSila datang lagi & simpan resit ini untuk rujukan.',
    warrantyTerms: 'Jaminan perkhidmatan repair adalah selama 30 hari untuk alat ganti yang sama kecuali kerosakan fizikal / masuk air.'
  },

  users: [
    { id: 'usr_1', username: 'admin', password: 'admin123', name: 'Zulkifli bin Hashim', role: 'SUPER_ADMIN', email: 'admin@giatmara.edu.my', phone: '012-4567890', active: true },
    { id: 'usr_2', username: 'manager', password: 'manager123', name: 'Pn. Noraini bt Saad', role: 'MANAGER', email: 'manager@giatmara.edu.my', phone: '013-9876543', active: true },
    { id: 'usr_3', username: 'cafe', password: 'cafe123', name: 'Chef Hafiz (Pelatih Kuliner)', role: 'CAFE_STAFF', email: 'cafe@giatmara.edu.my', phone: '017-1122334', active: true },
    { id: 'usr_4', username: 'repair', password: 'repair123', name: 'Azman (Pelatih Baiki Smartphone)', role: 'REPAIR_STAFF', email: 'repair@giatmara.edu.my', phone: '019-5566778', active: true },
    { id: 'usr_5', username: 'cashier', password: 'cashier123', name: 'Siti Aminah (Juruwang)', role: 'CASHIER', email: 'cashier@giatmara.edu.my', phone: '011-2233445', active: true }
  ],

  categories: [
    { id: 'cat_rice', name: 'Rice', type: 'cafe' },
    { id: 'cat_noodles', name: 'Noodles', type: 'cafe' },
    { id: 'cat_main', name: 'Main Dish', type: 'cafe' },
    { id: 'cat_drinks', name: 'Drinks', type: 'cafe' },
    { id: 'cat_dessert', name: 'Dessert', type: 'cafe' },
    { id: 'cat_combo', name: 'Combo', type: 'cafe' },
    { id: 'cat_others_cafe', name: 'Others', type: 'cafe' },
    { id: 'cat_spareparts', name: 'Smartphone Spare Parts', type: 'inventory' },
    { id: 'cat_accessories', name: 'Smartphone Accessories', type: 'inventory' },
    { id: 'cat_tools', name: 'Repair Tools', type: 'inventory' },
    { id: 'cat_raw', name: 'Café Raw Materials', type: 'inventory' },
    { id: 'cat_packaging', name: 'Food Packaging', type: 'inventory' }
  ],

  menu: [
    {
      id: 'MNU-001',
      name: 'Nasi Ayam Crispy GIATMARA',
      category: 'Rice',
      description: 'Nasi ayam beraroma dihidang bersama ayam goreng rangup, sup herba, sambal cili padu dan kicap istimewa.',
      image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600&auto=format&fit=crop&q=80',
      costPrice: 5.00,
      sellingPrice: 8.00,
      availableQty: 45,
      status: 'AVAILABLE'
    },
    {
      id: 'MNU-002',
      name: 'Mee Goreng Mamak Spesial',
      category: 'Noodles',
      description: 'Mee kuning digoreng basah bersama cucur, tauhu, telur, daging lembu dan sayuran segar.',
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80',
      costPrice: 4.00,
      sellingPrice: 7.00,
      availableQty: 30,
      status: 'AVAILABLE'
    },
    {
      id: 'MNU-003',
      name: 'Nasi Goreng Kampung Udang Lipan',
      category: 'Rice',
      description: 'Nasi goreng kampung aroma ikan bilis rangup, kangkung, cili padi dan telur mata.',
      image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&auto=format&fit=crop&q=80',
      costPrice: 4.50,
      sellingPrice: 8.00,
      availableQty: 25,
      status: 'AVAILABLE'
    },
    {
      id: 'MNU-004',
      name: 'Teh Ais Madu Padu',
      category: 'Drinks',
      description: 'Teh tarik kaw cincau sejuk segar bersusu pekat manis.',
      image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&auto=format&fit=crop&q=80',
      costPrice: 1.20,
      sellingPrice: 3.00,
      availableQty: 100,
      status: 'AVAILABLE'
    },
    {
      id: 'MNU-005',
      name: 'Milo Ais Kaw Dinosaur',
      category: 'Drinks',
      description: 'Minuman coklat malt kegemaran rakyat dengan taburan serbuk milo ekstra di atas.',
      image: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=600&auto=format&fit=crop&q=80',
      costPrice: 1.50,
      sellingPrice: 3.50,
      availableQty: 80,
      status: 'AVAILABLE'
    },
    {
      id: 'MNU-006',
      name: 'Kuey Teow Kerang Berapi',
      category: 'Noodles',
      description: 'Char kuey teow basah aroma asap kuali bersama kerang segar dan udang.',
      image: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=600&auto=format&fit=crop&q=80',
      costPrice: 4.20,
      sellingPrice: 7.50,
      availableQty: 20,
      status: 'AVAILABLE'
    },
    {
      id: 'MNU-007',
      name: 'Waffle Coklat Pisang',
      category: 'Dessert',
      description: 'Waffle rangup panas dengan limpahan coklat Nutella dan hirisan pisang segar.',
      image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=600&auto=format&fit=crop&q=80',
      costPrice: 3.00,
      sellingPrice: 6.00,
      availableQty: 15,
      status: 'AVAILABLE'
    },
    {
      id: 'MNU-008',
      name: 'Set Kombo Jimat Pelajar (Nasi Ayam + Teh Ais)',
      category: 'Combo',
      description: 'Pilihan jimat lengkap Nasi Ayam Crispy bersama segelas Teh Ais Padu.',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
      costPrice: 5.80,
      sellingPrice: 9.90,
      availableQty: 40,
      status: 'AVAILABLE'
    }
  ],

  tables: [
    { id: 'M01', name: 'Meja M01', capacity: 2, location: 'Ruang Dalam Café (Aircond)', status: 'AVAILABLE', activeOrderId: null },
    { id: 'M02', name: 'Meja M02', capacity: 4, location: 'Ruang Dalam Café (Aircond)', status: 'OCCUPIED', activeOrderId: 'ORD-2026-00012' },
    { id: 'M03', name: 'Meja M03', capacity: 4, location: 'Ruang Dalam Café (Aircond)', status: 'AVAILABLE', activeOrderId: null },
    { id: 'M04', name: 'Meja M04', capacity: 6, location: 'Ruang Utama Lobi', status: 'AVAILABLE', activeOrderId: null },
    { id: 'M05', name: 'Meja M05', capacity: 4, location: 'Ruang Utama Lobi', status: 'ORDERING', activeOrderId: null },
    { id: 'M06', name: 'Meja M06', capacity: 2, location: 'Veranda Terbuka Café', status: 'AVAILABLE', activeOrderId: null },
    { id: 'M07', name: 'Meja M07', capacity: 4, location: 'Veranda Terbuka Café', status: 'CLEANING', activeOrderId: null },
    { id: 'M08', name: 'Meja M08', capacity: 6, location: 'Veranda Terbuka Café', status: 'AVAILABLE', activeOrderId: null },
    { id: 'M09', name: 'Meja M09', capacity: 8, location: 'Bilik Mesyuarat / VIP', status: 'AVAILABLE', activeOrderId: null },
    { id: 'M10', name: 'Meja M10', capacity: 4, location: 'Bilik Mesyuarat / VIP', status: 'AVAILABLE', activeOrderId: null }
  ],

  customers: [
    {
      id: 'CUST-001',
      name: 'Ahmad Farhan bin Razak',
      phone: '019-4455667',
      email: 'ahmad.farhan@gmail.com',
      address: 'No 14, Taman Sena Indah, 01000 Kangar, Perlis',
      dateRegistered: '2026-09-15',
      totalRepairs: 2,
      totalSpending: 245.00,
      outstandingPayment: 0
    },
    {
      id: 'CUST-002',
      name: 'Siti Nurhaliza bt Ismail',
      phone: '012-3344556',
      email: 'siti.ismail@yahoo.com',
      address: 'Lot 102, Kampung Seriab, 01000 Kangar, Perlis',
      dateRegistered: '2026-09-18',
      totalRepairs: 1,
      totalSpending: 80.00,
      outstandingPayment: 0
    },
    {
      id: 'CUST-003',
      name: 'Muhammad Danial bin Zaki',
      phone: '017-8899001',
      email: 'danial.zaki@gmail.com',
      address: 'No 8, Jalan Jejawi Sematang, 02600 Arau, Perlis',
      dateRegistered: '2026-09-22',
      totalRepairs: 1,
      totalSpending: 130.00,
      outstandingPayment: 0
    },
    {
      id: 'CUST-004',
      name: 'Nurul Huda bt Othman',
      phone: '013-5566778',
      email: 'huda.othman@outlook.com',
      address: 'Kuarters Guru SMK Derma, 01000 Kangar, Perlis',
      dateRegistered: '2026-09-25',
      totalRepairs: 0,
      totalSpending: 0,
      outstandingPayment: 0
    }
  ],

  inventory: [
    // Smartphone Spare Parts
    {
      id: 'INV-SP-001',
      sku: 'SP-LCD-SAMA55',
      name: 'LCD Display Screen Samsung Galaxy A55 5G',
      category: 'Smartphone Spare Parts',
      brand: 'Samsung',
      model: 'Galaxy A55',
      supplier: 'TechParts Utara Sdn Bhd',
      costPrice: 85.00,
      sellingPrice: 130.00,
      currentStock: 2, // Low stock on purpose for testing alert!
      minStock: 5,
      unit: 'Unit',
      location: 'Rak Sparepart A-01',
      status: 'LOW_STOCK'
    },
    {
      id: 'INV-SP-002',
      sku: 'SP-BAT-IPH11',
      name: 'Battery High Capacity iPhone 11 (3110mAh)',
      category: 'Smartphone Spare Parts',
      brand: 'Apple',
      model: 'iPhone 11',
      supplier: 'Borneo Mobile Supply',
      costPrice: 45.00,
      sellingPrice: 80.00,
      currentStock: 8,
      minStock: 5,
      unit: 'Unit',
      location: 'Rak Sparepart A-02',
      status: 'AVAILABLE'
    },
    {
      id: 'INV-SP-003',
      sku: 'SP-PRT-RED12',
      name: 'Charging Port Board Redmi Note 12',
      category: 'Smartphone Spare Parts',
      brand: 'Xiaomi',
      model: 'Redmi Note 12',
      supplier: 'TechParts Utara Sdn Bhd',
      costPrice: 18.00,
      sellingPrice: 40.00,
      currentStock: 10,
      minStock: 4,
      unit: 'Unit',
      location: 'Laci Komponen B-03',
      status: 'AVAILABLE'
    },
    {
      id: 'INV-SP-004',
      sku: 'SP-CAM-IP12P',
      name: 'Main Rear Camera Module iPhone 12 Pro',
      category: 'Smartphone Spare Parts',
      brand: 'Apple',
      model: 'iPhone 12 Pro',
      supplier: 'Borneo Mobile Supply',
      costPrice: 110.00,
      sellingPrice: 170.00,
      currentStock: 3,
      minStock: 3,
      unit: 'Unit',
      location: 'Rak Sparepart A-03',
      status: 'AVAILABLE'
    },
    {
      id: 'INV-SP-005',
      sku: 'SP-SPK-OPPOA78',
      name: 'Earpiece Speaker & Buzzer Oppo A78',
      category: 'Smartphone Spare Parts',
      brand: 'Oppo',
      model: 'A78 5G',
      supplier: 'TechParts Utara Sdn Bhd',
      costPrice: 12.00,
      sellingPrice: 35.00,
      currentStock: 7,
      minStock: 4,
      unit: 'Unit',
      location: 'Laci Komponen B-04',
      status: 'AVAILABLE'
    },

    // Smartphone Accessories
    {
      id: 'INV-ACC-001',
      sku: 'ACC-CBL-TYPEC',
      name: 'Fast Charging USB-C to USB-C Cable 65W (1.2m)',
      category: 'Smartphone Accessories',
      brand: 'TRIG ProGear',
      model: 'Universal Type-C',
      supplier: 'Borneo Mobile Supply',
      costPrice: 8.00,
      sellingPrice: 15.00,
      currentStock: 20,
      minStock: 10,
      unit: 'Pcs',
      location: 'Display Showcase Depan',
      status: 'AVAILABLE',
      image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'INV-ACC-002',
      sku: 'ACC-CSE-MAGIPH',
      name: 'Shockproof Magnetic Silicone Phone Case',
      category: 'Smartphone Accessories',
      brand: 'ShieldMax',
      model: 'iPhone 13 / 14 / 15 Series',
      supplier: 'Borneo Mobile Supply',
      costPrice: 10.00,
      sellingPrice: 20.00,
      currentStock: 15,
      minStock: 8,
      unit: 'Pcs',
      location: 'Display Showcase Depan',
      status: 'AVAILABLE',
      image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'INV-ACC-003',
      sku: 'ACC-TG-9HPRIV',
      name: 'Tempered Glass 9H Privacy & Anti-Spy Guard',
      category: 'Smartphone Accessories',
      brand: 'GlassPro',
      model: 'Universal Android & iPhone',
      supplier: 'Borneo Mobile Supply',
      costPrice: 5.00,
      sellingPrice: 12.00,
      currentStock: 25,
      minStock: 10,
      unit: 'Pcs',
      location: 'Display Showcase Depan',
      status: 'AVAILABLE',
      image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'INV-ACC-004',
      sku: 'ACC-PB-10KPD',
      name: 'Power Bank 10,000mAh 22.5W Fast Delivery LED',
      category: 'Smartphone Accessories',
      brand: 'VoltCharge',
      model: 'Slim 10000',
      supplier: 'TechParts Utara Sdn Bhd',
      costPrice: 28.00,
      sellingPrice: 49.00,
      currentStock: 12,
      minStock: 5,
      unit: 'Unit',
      location: 'Display Showcase Depan',
      status: 'AVAILABLE',
      image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'INV-ACC-005',
      sku: 'ACC-ADAPT-20W',
      name: 'PD 20W Fast Charger Adapter Dual Port (USB-A + Type-C)',
      category: 'Smartphone Accessories',
      brand: 'VoltCharge',
      model: 'PD-20W Dual',
      supplier: 'TechParts Utara Sdn Bhd',
      costPrice: 14.00,
      sellingPrice: 28.00,
      currentStock: 18,
      minStock: 6,
      unit: 'Pcs',
      location: 'Display Showcase Depan',
      status: 'AVAILABLE',
      image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80'
    },

    // Café Raw Materials & Packaging
    {
      id: 'INV-RAW-001',
      sku: 'RAW-RCE-BERAS',
      name: 'Beras Wangi Super Spesial (10kg)',
      category: 'Café Raw Materials',
      brand: 'Jasmine',
      model: '10kg Gred A',
      supplier: 'F&B Raw Resources Perlis',
      costPrice: 38.00,
      sellingPrice: 0.00,
      currentStock: 6,
      minStock: 3,
      unit: 'Beg',
      location: 'Stor Dapur Café',
      status: 'AVAILABLE'
    },
    {
      id: 'INV-RAW-002',
      sku: 'RAW-AYAM-FRSH',
      name: 'Ayam Segar Standard (Dipotong 8)',
      category: 'Café Raw Materials',
      brand: 'Ladang Tempatan',
      model: 'Segar Harian',
      supplier: 'F&B Raw Resources Perlis',
      costPrice: 16.50,
      sellingPrice: 0.00,
      currentStock: 14,
      minStock: 5,
      unit: 'Ekor',
      location: 'Chiller Utama Dapur',
      status: 'AVAILABLE'
    },
    {
      id: 'INV-PKG-001',
      sku: 'PKG-BOX-KRAFT',
      name: 'Kotak Makanan Kraft Paper Biodegradable (100pcs)',
      category: 'Food Packaging',
      brand: 'EcoPack',
      model: 'Size L 850ml',
      supplier: 'F&B Raw Resources Perlis',
      costPrice: 22.00,
      sellingPrice: 0.00,
      currentStock: 4,
      minStock: 3,
      unit: 'Pek',
      location: 'Stor Dapur Café',
      status: 'AVAILABLE'
    }
  ],

  tools: [
    {
      id: 'TOL-001',
      name: 'Stesen Pateri Pintar Digital (Smart Solder Station)',
      category: 'Soldering & Microelectronics',
      brand: 'Quick 861DW Pro',
      serialNumber: 'SN-QCK-2025-998',
      quantity: 3,
      purchaseDate: '2025-10-12',
      purchasePrice: 480.00,
      location: 'Meja Kerja Bengkel 1',
      condition: 'GOOD',
      status: 'AVAILABLE'
    },
    {
      id: 'TOL-002',
      name: 'Hot Air Rework SMD Heat Gun',
      category: 'Hot Air Station',
      brand: 'Atten ST-862D',
      serialNumber: 'SN-ATN-88214',
      quantity: 2,
      purchaseDate: '2025-11-04',
      purchasePrice: 550.00,
      location: 'Meja Kerja Bengkel 2',
      condition: 'GOOD',
      status: 'IN_USE'
    },
    {
      id: 'TOL-003',
      name: 'Mikroskop Trinokular HD Stereo 7X-45X',
      category: 'Optical & Inspection',
      brand: 'Relife RL-M3T',
      serialNumber: 'SN-RLF-2025-412',
      quantity: 2,
      purchaseDate: '2025-08-20',
      purchasePrice: 850.00,
      location: 'Meja Diagnosis Utama',
      condition: 'GOOD',
      status: 'AVAILABLE'
    },
    {
      id: 'TOL-004',
      name: 'Precision Screwdriver Repair Kit 128-in-1',
      category: 'Hand Tools',
      brand: 'Jakemy Pro',
      serialNumber: 'SN-JKM-5510',
      quantity: 5,
      purchaseDate: '2026-01-15',
      purchasePrice: 75.00,
      location: 'Laci Alatan Pelatih A-D',
      condition: 'GOOD',
      status: 'AVAILABLE'
    },
    {
      id: 'TOL-005',
      name: 'DC Power Supply 30V 5A Short Killer',
      category: 'Diagnostic & Power',
      brand: 'Sunshine P-3005D',
      serialNumber: 'SN-SUN-9901',
      quantity: 2,
      purchaseDate: '2025-12-01',
      purchasePrice: 240.00,
      location: 'Meja Diagnosis Utama',
      condition: 'GOOD',
      status: 'AVAILABLE'
    }
  ],

  suppliers: [
    {
      id: 'SUP-001',
      name: 'TechParts Utara Sdn Bhd',
      contactPerson: 'En. Khairul Anuar',
      phone: '014-7788990',
      email: 'khairul@techparts.com.my',
      address: 'Kawasan Perindustrian Ringan Jejawi, 02600 Arau, Perlis',
      productCategory: 'Smartphone Spare Parts & Repair Equipment',
      notes: 'Pembekal alat ganti smartphone gred OEM & Original dengan jaminan return 14 hari.',
      status: 'ACTIVE'
    },
    {
      id: 'SUP-002',
      name: 'Borneo Mobile Supply',
      contactPerson: 'Pn. Jennifer Wong',
      phone: '016-2233889',
      email: 'sales@borneomobile.com',
      address: 'Plaza Low Yat Level 3, Jalan Bukit Bintang, KL (Branch Alor Setar)',
      productCategory: 'Smartphone Accessories & High-Grade Batteries',
      notes: 'Pembekal aksesori berkualiti tinggi, cables, casing dan power bank.',
      status: 'ACTIVE'
    },
    {
      id: 'SUP-003',
      name: 'F&B Raw Resources Perlis',
      contactPerson: 'Hj. Salleh bin Ismail',
      phone: '019-3322110',
      email: 'order@perlisrawresources.com',
      address: 'Pasar Borong Sena, 01000 Kangar, Perlis',
      productCategory: 'Café Raw Materials & Packaging',
      notes: 'Pembekal bahan mentah basah & kering harian untuk Café GIATMARA.',
      status: 'ACTIVE'
    }
  ],

  repairJobs: [
    {
      id: 'REP-2026-00001',
      customerId: 'CUST-001',
      customerName: 'Ahmad Farhan bin Razak',
      customerPhone: '019-4455667',
      deviceBrand: 'Samsung',
      deviceModel: 'Galaxy A55 5G',
      serialNumber: '358921098712345',
      deviceColour: 'Awesome Iceblue',
      deviceCondition: {
        screen: 'Retak teruk / tiada paparan',
        body: 'Calar halus biasa',
        camera: 'Berfungsi baik',
        buttons: 'Normal',
        chargingPort: 'Normal',
        speaker: 'Normal',
        microphone: 'Normal',
        otherDamage: 'Tiada kesan bengkok'
      },
      problemReported: 'Skrin pecah terjatuh dari motosikal, lampu menyala tetapi tiada display gambar.',
      diagnosis: 'LCD display panel rosak (internal bleeding). Motherboard & touch sensor masih elok. Perlu tukar set LCD baru.',
      damageType: 'Broken Screen',
      notes: 'Pelanggan minta pasang tempered glass percuma jika ambil pakej skrin.',
      dateReceived: '2026-09-26 09:30',
      estCompletionDate: '2026-09-26 16:30',
      technician: 'Azman (Pelatih Baiki Smartphone)',
      partsUsed: [
        {
          invId: 'INV-SP-001',
          sku: 'SP-LCD-SAMA55',
          name: 'LCD Display Screen Samsung Galaxy A55 5G',
          costPrice: 85.00,
          sellingPrice: 130.00,
          quantity: 1
        }
      ],
      partsCost: 85.00,
      partsSelling: 130.00,
      labourCost: 30.00,
      totalCost: 115.00,
      totalSellingPrice: 160.00,
      grossProfit: 45.00,
      status: 'READY_FOR_COLLECTION', // Progression status
      quotationStatus: 'APPROVED',
      paymentStatus: 'PAID',
      paymentMethod: 'QR_PAYMENT',
      paymentRef: 'DUITNOW-REP-88912',
      paidAt: '2026-09-26 14:10',
      receiptNumber: 'REP-2026-00001',
      warrantyExpiry: '2026-10-26'
    },
    {
      id: 'REP-2026-00002',
      customerId: 'CUST-002',
      customerName: 'Siti Nurhaliza bt Ismail',
      customerPhone: '012-3344556',
      deviceBrand: 'Apple',
      deviceModel: 'iPhone 11',
      serialNumber: 'F2LZX889N4',
      deviceColour: 'Purple',
      deviceCondition: {
        screen: 'Elok',
        body: 'Elok dijaga',
        camera: 'Normal',
        buttons: 'Normal',
        chargingPort: 'Normal',
        speaker: 'Normal',
        microphone: 'Normal',
        otherDamage: 'Bateri kembung sedikit menolak skrin'
      },
      problemReported: 'Bateri cepat habis (Battery Health 68%) & telefon cepat panas.',
      diagnosis: 'Battery degradation teruk. Perlu ganti bateri berkualiti tinggi baru.',
      damageType: 'Battery Problem',
      notes: 'Selesai diagnosis pantas.',
      dateReceived: '2026-09-26 11:15',
      estCompletionDate: '2026-09-26 17:00',
      technician: 'Azman (Pelatih Baiki Smartphone)',
      partsUsed: [
        {
          invId: 'INV-SP-002',
          sku: 'SP-BAT-IPH11',
          name: 'Battery High Capacity iPhone 11 (3110mAh)',
          costPrice: 45.00,
          sellingPrice: 80.00,
          quantity: 1
        }
      ],
      partsCost: 45.00,
      partsSelling: 80.00,
      labourCost: 20.00,
      totalCost: 65.00,
      totalSellingPrice: 100.00,
      grossProfit: 35.00,
      status: 'REPAIRING',
      quotationStatus: 'APPROVED',
      paymentStatus: 'PENDING',
      paymentMethod: null,
      paymentRef: null,
      paidAt: null,
      receiptNumber: null,
      warrantyExpiry: null
    },
    {
      id: 'REP-2026-00003',
      customerId: 'CUST-003',
      customerName: 'Muhammad Danial bin Zaki',
      customerPhone: '017-8899001',
      deviceBrand: 'Xiaomi',
      deviceModel: 'Redmi Note 12',
      serialNumber: 'XIAO99281923',
      deviceColour: 'Onyx Gray',
      deviceCondition: {
        screen: 'Sedikit calar',
        body: 'Kesan jatuh bucu bawah',
        camera: 'Normal',
        buttons: 'Normal',
        chargingPort: 'Pin charger longgar & terbakar',
        speaker: 'Kotor',
        microphone: 'Normal',
        otherDamage: 'Port USB tidak detect arus'
      },
      problemReported: 'Tidak boleh cas bateri langsung walaupun guna cable baru.',
      diagnosis: 'Charging port board short-circuit akibat dimasuki habuk lembap.',
      damageType: 'Charging Problem',
      notes: 'Menunggu kelulusan quotation dari pelanggan.',
      dateReceived: '2026-09-26 14:00',
      estCompletionDate: '2026-09-27 12:00',
      technician: 'Azman (Pelatih Baiki Smartphone)',
      partsUsed: [
        {
          invId: 'INV-SP-003',
          sku: 'SP-PRT-RED12',
          name: 'Charging Port Board Redmi Note 12',
          costPrice: 18.00,
          sellingPrice: 40.00,
          quantity: 1
        }
      ],
      partsCost: 18.00,
      partsSelling: 40.00,
      labourCost: 20.00,
      totalCost: 38.00,
      totalSellingPrice: 60.00,
      grossProfit: 22.00,
      status: 'QUOTATION',
      quotationStatus: 'PENDING_CUSTOMER_APPROVAL',
      paymentStatus: 'PENDING',
      paymentMethod: null,
      paymentRef: null,
      paidAt: null,
      receiptNumber: null,
      warrantyExpiry: null
    }
  ],

  orders: [
    {
      id: 'ORD-2026-00010',
      receiptNumber: 'CAF-2026-00010',
      orderType: 'DINE_IN',
      tableId: 'M01',
      tableName: 'Meja M01',
      customerName: 'Pelanggan Meja M01',
      customerPhone: '',
      pickupTime: '',
      items: [
        { menuId: 'MNU-001', name: 'Nasi Ayam Crispy GIATMARA', quantity: 2, unitPrice: 8.00, costPrice: 5.00, subtotal: 16.00 },
        { menuId: 'MNU-004', name: 'Teh Ais Madu Padu', quantity: 2, unitPrice: 3.00, costPrice: 1.20, subtotal: 6.00 }
      ],
      subtotal: 22.00,
      discount: 0.00,
      total: 22.00,
      totalCost: 12.40,
      profit: 9.60,
      paymentMethod: 'CASH',
      paymentStatus: 'PAID',
      paymentRef: 'CASH-REC-101',
      orderStatus: 'COMPLETED',
      orderTime: '2026-09-26 11:20',
      prepTime: '2026-09-26 11:25',
      readyTime: '2026-09-26 11:35',
      completedTime: '2026-09-26 11:45',
      cashier: 'Siti Aminah (Juruwang)'
    },
    {
      id: 'ORD-2026-00011',
      receiptNumber: 'CAF-2026-00011',
      orderType: 'TAKEAWAY',
      tableId: null,
      tableName: 'Bungkus / Takeaway',
      customerName: 'Cikgu Roslan',
      customerPhone: '019-2233445',
      pickupTime: '13:00',
      items: [
        { menuId: 'MNU-008', name: 'Set Kombo Jimat Pelajar (Nasi Ayam + Teh Ais)', quantity: 3, unitPrice: 9.90, costPrice: 5.80, subtotal: 29.70 },
        { menuId: 'MNU-007', name: 'Waffle Coklat Pisang', quantity: 1, unitPrice: 6.00, costPrice: 3.00, subtotal: 6.00 }
      ],
      subtotal: 35.70,
      discount: 0.00,
      total: 35.70,
      totalCost: 20.40,
      profit: 15.30,
      paymentMethod: 'QR_PAYMENT',
      paymentStatus: 'PAID',
      paymentRef: 'DUITNOW-CAF-9901',
      orderStatus: 'COMPLETED',
      orderTime: '2026-09-26 12:40',
      prepTime: '2026-09-26 12:45',
      readyTime: '2026-09-26 12:55',
      completedTime: '2026-09-26 13:05',
      cashier: 'Siti Aminah (Juruwang)'
    },
    {
      id: 'ORD-2026-00012',
      receiptNumber: null,
      orderType: 'DINE_IN',
      tableId: 'M02',
      tableName: 'Meja M02',
      customerName: 'Pelanggan Meja M02 (Pelajar GIATMARA)',
      customerPhone: '',
      pickupTime: '',
      items: [
        { menuId: 'MNU-002', name: 'Mee Goreng Mamak Spesial', quantity: 2, unitPrice: 7.00, costPrice: 4.00, subtotal: 14.00 },
        { menuId: 'MNU-005', name: 'Milo Ais Kaw Dinosaur', quantity: 2, unitPrice: 3.50, costPrice: 1.50, subtotal: 7.00 },
        { menuId: 'MNU-003', name: 'Nasi Goreng Kampung Udang Lipan', quantity: 1, unitPrice: 8.00, costPrice: 4.50, subtotal: 8.00 }
      ],
      subtotal: 29.00,
      discount: 0.00,
      total: 29.00,
      totalCost: 15.50,
      profit: 13.50,
      paymentMethod: 'QR_PAYMENT',
      paymentStatus: 'PAID',
      paymentRef: 'DUITNOW-ORD-8819',
      orderStatus: 'PREPARING', // Active in kitchen!
      orderTime: '2026-09-26 14:15',
      prepTime: '2026-09-26 14:18',
      readyTime: null,
      completedTime: null,
      cashier: 'Chef Hafiz (Pelatih Kuliner)'
    }
  ],

  sales: [
    // Unified Sales Master Ledger
    {
      id: 'SAL-2026-00001',
      module: 'CAFÉ',
      referenceId: 'ORD-2026-00010',
      receiptNumber: 'CAF-2026-00010',
      customer: 'Pelanggan Meja M01',
      itemsSummary: '2x Nasi Ayam Crispy, 2x Teh Ais Madu',
      costPrice: 12.40,
      sellingPrice: 22.00,
      profit: 9.60,
      paymentMethod: 'CASH',
      paymentStatus: 'PAID',
      date: '2026-09-26',
      time: '11:45',
      cashier: 'Siti Aminah'
    },
    {
      id: 'SAL-2026-00002',
      module: 'CAFÉ',
      referenceId: 'ORD-2026-00011',
      receiptNumber: 'CAF-2026-00011',
      customer: 'Cikgu Roslan',
      itemsSummary: '3x Set Kombo Jimat, 1x Waffle Coklat',
      costPrice: 20.40,
      sellingPrice: 35.70,
      profit: 15.30,
      paymentMethod: 'QR_PAYMENT',
      paymentStatus: 'PAID',
      date: '2026-09-26',
      time: '13:05',
      cashier: 'Siti Aminah'
    },
    {
      id: 'SAL-2026-00003',
      module: 'REPAIR',
      referenceId: 'REP-2026-00001',
      receiptNumber: 'REP-2026-00001',
      customer: 'Ahmad Farhan bin Razak',
      itemsSummary: 'LCD Samsung Galaxy A55 Replacement + Labour',
      costPrice: 115.00,
      sellingPrice: 160.00,
      profit: 45.00,
      paymentMethod: 'QR_PAYMENT',
      paymentStatus: 'PAID',
      date: '2026-09-26',
      time: '14:10',
      cashier: 'Azman'
    },
    {
      id: 'SAL-2026-00004',
      module: 'ACCESSORIES',
      referenceId: 'POS-2026-00001',
      receiptNumber: 'ACC-2026-00001',
      customer: 'Ahmad Farhan bin Razak',
      itemsSummary: '1x Tempered Glass 9H Privacy, 1x USB-C Cable 65W',
      costPrice: 13.00,
      sellingPrice: 27.00,
      profit: 14.00,
      paymentMethod: 'CASH',
      paymentStatus: 'PAID',
      date: '2026-09-26',
      time: '14:12',
      cashier: 'Siti Aminah'
    },
    {
      id: 'SAL-2026-00005',
      module: 'ACCESSORIES',
      referenceId: 'POS-2026-00002',
      receiptNumber: 'ACC-2026-00002',
      customer: 'Walk-in Customer (Pelajar)',
      itemsSummary: '1x Magnetic Silicone Phone Case',
      costPrice: 10.00,
      sellingPrice: 20.00,
      profit: 10.00,
      paymentMethod: 'QR_PAYMENT',
      paymentStatus: 'PAID',
      date: '2026-09-26',
      time: '14:30',
      cashier: 'Siti Aminah'
    }
  ],

  inventoryTransactions: [
    {
      id: 'TXN-001',
      date: '2026-09-20 09:00',
      itemId: 'INV-SP-001',
      itemName: 'LCD Display Screen Samsung Galaxy A55 5G',
      type: 'STOCK_IN',
      quantity: 5,
      stockBefore: 0,
      stockAfter: 5,
      reference: 'PO-2026-0001',
      notes: 'Penerimaan bekalan baru dari TechParts Utara',
      user: 'Zulkifli (Admin)'
    },
    {
      id: 'TXN-002',
      date: '2026-09-26 14:05',
      itemId: 'INV-SP-001',
      itemName: 'LCD Display Screen Samsung Galaxy A55 5G',
      type: 'USED_FOR_REPAIR',
      quantity: 1,
      stockBefore: 3,
      stockAfter: 2,
      reference: 'REP-2026-00001',
      notes: 'Digunakan untuk repair Samsung A55 pelanggan Ahmad Farhan',
      user: 'Azman (Repair Staff)'
    },
    {
      id: 'TXN-003',
      date: '2026-09-26 14:12',
      itemId: 'INV-ACC-003',
      itemName: 'Tempered Glass 9H Privacy & Anti-Spy Guard',
      type: 'SOLD',
      quantity: 1,
      stockBefore: 26,
      stockAfter: 25,
      reference: 'ACC-2026-00001',
      notes: 'Jualan POS Kaunter',
      user: 'Siti Aminah (Cashier)'
    },
    {
      id: 'TXN-004',
      date: '2026-09-26 14:12',
      itemId: 'INV-ACC-001',
      itemName: 'Fast Charging USB-C to USB-C Cable 65W',
      type: 'SOLD',
      quantity: 1,
      stockBefore: 21,
      stockAfter: 20,
      reference: 'ACC-2026-00001',
      notes: 'Jualan POS Kaunter',
      user: 'Siti Aminah (Cashier)'
    }
  ],

  purchaseRequests: [
    {
      id: 'PR-2026-0001',
      title: 'Pesanan Tambahan Spare Parts LCD Samsung & iPhone',
      supplierId: 'SUP-001',
      supplierName: 'TechParts Utara Sdn Bhd',
      requestedBy: 'Azman (Repair Staff)',
      dateRequested: '2026-09-26 10:00',
      items: [
        {
          itemId: 'INV-SP-001',
          name: 'LCD Display Screen Samsung Galaxy A55 5G',
          sku: 'SP-LCD-SAMA55',
          quantity: 5,
          unitCost: 85.00,
          totalCost: 425.00
        },
        {
          itemId: 'INV-SP-003',
          name: 'Charging Port Board Redmi Note 12',
          sku: 'SP-PRT-RED12',
          quantity: 5,
          unitCost: 18.00,
          totalCost: 90.00
        }
      ],
      totalAmount: 515.00,
      status: 'PENDING_APPROVAL', // PENDING_APPROVAL -> APPROVED -> ORDERED -> RECEIVED -> CANCELLED
      approvedBy: null,
      dateApproved: null,
      poNumber: null,
      notes: 'Stok LCD Samsung A55 kini tinggal 2 unit (bawah paras minimum 5).'
    }
  ],

  notifications: [
    {
      id: 'NOTIF-001',
      title: 'Stok Rendah dikesan!',
      message: 'LCD Display Samsung Galaxy A55 kini berbaki 2 unit sahaja (Min: 5 unit). Sila buat Pesanan Belian.',
      type: 'WARNING',
      module: 'INVENTORY',
      time: '2026-09-26 14:05',
      read: false
    },
    {
      id: 'NOTIF-002',
      title: 'Pesanan Dapur Baru Diterima',
      message: 'Pesanan #ORD-2026-00012 dari Meja M02 telah dihantar ke Kitchen Display.',
      type: 'INFO',
      module: 'CAFE',
      time: '2026-09-26 14:15',
      read: false
    },
    {
      id: 'NOTIF-003',
      title: 'Permohonan Belian Perlu Kelulusan',
      message: 'Permohonan PR-2026-0001 bernilai RM 515.00 menanti kelulusan Pengurus.',
      type: 'ACTION',
      module: 'PROCUREMENT',
      time: '2026-09-26 10:00',
      read: false
    },
    {
      id: 'NOTIF-004',
      title: 'Job Repair Sedia Diambil',
      message: 'Samsung Galaxy A55 pelanggan Ahmad Farhan (REP-2026-00001) telah siap dibaiki.',
      type: 'SUCCESS',
      module: 'REPAIR',
      time: '2026-09-26 14:10',
      read: true
    }
  ],

  auditLogs: [
    { id: 'AUD-001', timestamp: '2026-09-26 09:00:15', user: 'admin', role: 'SUPER_ADMIN', action: 'Sistem Dimulakan & Database Diselaraskan', module: 'SYSTEM', details: 'Initial bootstrap completed.' },
    { id: 'AUD-002', timestamp: '2026-09-26 09:30:22', user: 'repair', role: 'REPAIR_STAFF', action: 'Daftar Job Baiki Baru', module: 'REPAIR', details: 'Job ID: REP-2026-00001 untuk pelanggan Ahmad Farhan.' },
    { id: 'AUD-003', timestamp: '2026-09-26 14:05:10', user: 'repair', role: 'REPAIR_STAFF', action: 'Guna Alat Ganti & Tolak Stok', module: 'INVENTORY', details: 'Tolak 1 unit LCD Samsung A55 untuk REP-2026-00001.' },
    { id: 'AUD-004', timestamp: '2026-09-26 14:10:45', user: 'cashier', role: 'CASHIER', action: 'Terima Pembayaran Repair', module: 'FINANCE', details: 'Terima RM160.00 via QR Payment untuk REP-2026-00001.' },
    { id: 'AUD-005', timestamp: '2026-09-26 14:15:20', user: 'cafe', role: 'CAFE_STAFF', action: 'Order Makanan Meja M02 Diterima', module: 'CAFE', details: 'Order #ORD-2026-00012 sedang dimasak.' }
  ]
};

// Database Service Helper Object
const DB = {
  // Initialize Database
  init: function(forceReset = false) {
    if (forceReset || !localStorage.getItem(DB_KEY_PREFIX + 'initialized')) {
      console.log('🔄 Initializing TRIG GIATMARA KANGAR Database Seeds...');
      for (const [key, val] of Object.entries(SEED_DATA)) {
        localStorage.setItem(DB_KEY_PREFIX + key, JSON.stringify(val));
      }
      localStorage.setItem(DB_KEY_PREFIX + 'initialized', 'true');
      localStorage.setItem(DB_KEY_PREFIX + 'last_init_time', new Date().toISOString());
      this.logAudit('SUPER_ADMIN', 'Database Reinitialized', 'SYSTEM', 'Sample demo dataset loaded successfully.');
    }
  },

  // Generic Get Collection
  get: function(collectionName) {
    try {
      const data = localStorage.getItem(DB_KEY_PREFIX + collectionName);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error(`Error loading collection ${collectionName}`, e);
      return [];
    }
  },

  // Generic Save Collection
  save: function(collectionName, data) {
    try {
      localStorage.setItem(DB_KEY_PREFIX + collectionName, JSON.stringify(data));
      // Dispatch custom event for UI reactivity across modules
      window.dispatchEvent(new CustomEvent('trig_db_change', { detail: { collection: collectionName } }));
      return true;
    } catch (e) {
      console.error(`Error saving collection ${collectionName}`, e);
      return false;
    }
  },

  // Reset to Factory Demo Seeds
  resetDemoData: function() {
    this.init(true);
    window.dispatchEvent(new CustomEvent('trig_db_change', { detail: { collection: 'all' } }));
  },

  // Audit Log
  logAudit: function(role, action, module, details) {
    const logs = this.get('auditLogs');
    const user = Auth.getCurrentUser() ? Auth.getCurrentUser().name : 'System';
    const newLog = {
      id: 'AUD-' + Date.now().toString().slice(-6),
      timestamp: new Date().toLocaleString('en-MY', { hour12: false }),
      user: user,
      role: role || (Auth.getCurrentUser() ? Auth.getCurrentUser().role : 'SUPER_ADMIN'),
      action: action,
      module: module,
      details: details
    };
    logs.unshift(newLog);
    if (logs.length > 200) logs.pop();
    this.save('auditLogs', logs);
  },

  // Notifications
  addNotification: function(title, message, type = 'INFO', module = 'SYSTEM') {
    const notifs = this.get('notifications');
    const newNotif = {
      id: 'NOTIF-' + Date.now().toString().slice(-6),
      title: title,
      message: message,
      type: type,
      module: module,
      time: new Date().toLocaleString('en-MY', { hour12: false }),
      read: false
    };
    notifs.unshift(newNotif);
    this.save('notifications', notifs);
  },

  // Automatic ID Generators
  generateId: function(prefix) {
    const currentYear = new Date().getFullYear();
    const rand = Math.floor(10000 + Math.random() * 90000);
    return `${prefix}-${currentYear}-${rand}`;
  },

  // Auto-deduct inventory with transaction log
  deductInventory: function(itemId, qtyToDeduct, referenceId, reasonType, userNote) {
    const inventory = this.get('inventory');
    const txns = this.get('inventoryTransactions');
    const item = inventory.find(i => i.id === itemId);
    
    if (!item) {
      console.warn(`Item ID ${itemId} not found in inventory.`);
      return false;
    }

    const before = item.currentStock;
    const after = Math.max(0, before - qtyToDeduct);
    item.currentStock = after;

    // Check low stock
    if (item.currentStock <= item.minStock) {
      item.status = 'LOW_STOCK';
      this.addNotification(
        `Amaran Stok Rendah: ${item.name}`,
        `Stok terkini baki ${item.currentStock} ${item.unit} (Paras minimum: ${item.minStock}). Sila buat Pesanan Belian (PR).`,
        'WARNING',
        'INVENTORY'
      );
    } else {
      item.status = 'AVAILABLE';
    }

    // Record Stock Movement Transaction
    const user = Auth.getCurrentUser() ? Auth.getCurrentUser().name : 'System';
    const txn = {
      id: 'TXN-' + Date.now().toString().slice(-6),
      date: new Date().toLocaleString('en-MY', { hour12: false }),
      itemId: item.id,
      itemName: item.name,
      type: reasonType, // 'USED_FOR_REPAIR', 'SOLD', 'STOCK_OUT', 'DAMAGED'
      quantity: qtyToDeduct,
      stockBefore: before,
      stockAfter: after,
      reference: referenceId,
      notes: userNote || `Tolak stok bagi transaksi ${referenceId}`,
      user: user
    };

    txns.unshift(txn);
    this.save('inventory', inventory);
    this.save('inventoryTransactions', txns);
    return true;
  },

  // Add stock to inventory (e.g. upon PO received or Stock In)
  addInventoryStock: function(itemId, qtyToAdd, referenceId, userNote) {
    const inventory = this.get('inventory');
    const txns = this.get('inventoryTransactions');
    const item = inventory.find(i => i.id === itemId);

    if (!item) return false;

    const before = item.currentStock;
    const after = before + qtyToAdd;
    item.currentStock = after;

    if (item.currentStock > item.minStock) {
      item.status = 'AVAILABLE';
    }

    const user = Auth.getCurrentUser() ? Auth.getCurrentUser().name : 'System';
    const txn = {
      id: 'TXN-' + Date.now().toString().slice(-6),
      date: new Date().toLocaleString('en-MY', { hour12: false }),
      itemId: item.id,
      itemName: item.name,
      type: 'STOCK_IN',
      quantity: qtyToAdd,
      stockBefore: before,
      stockAfter: after,
      reference: referenceId,
      notes: userNote || `Penerimaan stok bagi ${referenceId}`,
      user: user
    };

    txns.unshift(txn);
    this.save('inventory', inventory);
    this.save('inventoryTransactions', txns);
    return true;
  }
};

// Auto-run init on load
DB.init();
