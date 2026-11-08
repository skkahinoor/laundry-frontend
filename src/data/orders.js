const INITIAL_ORDERS = [
  {
    id: 'WF-1041',
    customerId: 'cust-1',
    customerName: 'Rohit Sharma',
    customerPhone: '+91 98765 43210',
    stage: 'placed',
    dayCategory: 'Today',
    orderDate: '2026-11-03',
    createdAt: 'Today, 09:30 AM',
    expectedDelivery: 'Tomorrow, 06:00 PM',
    assignedStaff: 'Ramesh Kumar',
    items: [
      { serviceId: 'srv-2', name: 'Wash & Steam Iron', qty: 8, price: 129, unit: 'per Kg' },
      { serviceId: 'srv-3', name: 'Dry Cleaning - Men Suit (2 Pc)', qty: 2, price: 450, unit: 'per Set' }
    ],
    couponCode: 'FESTIVE25',
    discountAmount: 483,
    paymentStatus: 'Paid (UPI)',
    lastNotified: 'Today, 09:35 AM via WhatsApp',
    notifyCount: 1
  },
  {
    id: 'WF-1042',
    customerId: 'cust-6',
    customerName: 'Ananya Chatterjee',
    customerPhone: '+91 91234 88776',
    stage: 'placed',
    dayCategory: 'Today',
    orderDate: '2026-11-03',
    createdAt: 'Today, 10:15 AM',
    expectedDelivery: '05 Nov, 07:00 PM',
    assignedStaff: 'Meena Devi',
    items: [
      { serviceId: 'srv-1', name: 'Wash & Fold (Regular)', qty: 10, price: 89, unit: 'per Kg' },
      { serviceId: 'srv-4', name: 'Dry Cleaning - Silk / Designer Saree', qty: 3, price: 380, unit: 'per Pc' }
    ],
    couponCode: 'FIRSTWASH20',
    discountAmount: 406,
    paymentStatus: 'Paid (UPI)',
    lastNotified: 'Today, 10:16 AM via WhatsApp',
    notifyCount: 1
  },
  {
    id: 'WF-1043',
    customerId: 'cust-3',
    customerName: 'Aman Gupta',
    customerPhone: '+91 97112 23344',
    stage: 'placed',
    dayCategory: 'Today',
    orderDate: '2026-11-03',
    createdAt: 'Today, 11:05 AM',
    expectedDelivery: 'Tomorrow, 05:00 PM',
    assignedStaff: 'Deepak Paswan',
    items: [
      { serviceId: 'srv-7', name: 'Express 24-Hr Super Wash & Iron', qty: 6, price: 199, unit: 'per Kg' },
      { serviceId: 'srv-8', name: 'Sneaker & Shoe Deep Cleaning', qty: 2, price: 299, unit: 'per Pair' }
    ],
    couponCode: 'HOLIDAY150',
    discountAmount: 150,
    paymentStatus: 'Pending COD',
    lastNotified: 'Today, 11:10 AM via WhatsApp',
    notifyCount: 1
  },
  {
    id: 'WF-1044',
    customerId: 'cust-5',
    customerName: 'Vikramaditya Nair',
    customerPhone: '+91 96543 21890',
    stage: 'placed',
    dayCategory: 'Today',
    orderDate: '2026-11-03',
    createdAt: 'Today, 11:50 AM',
    expectedDelivery: 'Tomorrow, 08:00 PM',
    assignedStaff: 'Ramesh Kumar',
    items: [
      { serviceId: 'srv-6', name: 'Steam Press Only', qty: 15, price: 20, unit: 'per Pc' },
      { serviceId: 'srv-3', name: 'Dry Cleaning - Men Suit (2 Pc)', qty: 1, price: 450, unit: 'per Set' }
    ],
    couponCode: '',
    discountAmount: 0,
    paymentStatus: 'Paid (UPI)',
    lastNotified: 'Not sent yet',
    notifyCount: 0
  },
  {
    id: 'WF-1045',
    customerId: 'cust-2',
    customerName: 'Priya Verma',
    customerPhone: '+91 98234 56789',
    stage: 'picked_up',
    dayCategory: 'Today',
    orderDate: '2026-11-03',
    createdAt: 'Today, 08:40 AM',
    expectedDelivery: 'Tomorrow, 07:30 PM',
    assignedStaff: 'Deepak Paswan',
    items: [
      { serviceId: 'srv-4', name: 'Dry Cleaning - Silk / Designer Saree', qty: 6, price: 380, unit: 'per Pc' },
      { serviceId: 'srv-5', name: 'Heavy Blanket / Quilt Spa (Double)', qty: 3, price: 399, unit: 'per Pc' }
    ],
    couponCode: 'FESTIVE25',
    discountAmount: 869,
    paymentStatus: 'Paid (UPI)',
    lastNotified: 'Today, 09:20 AM via WhatsApp',
    notifyCount: 2
  },
  {
    id: 'WF-1046',
    customerId: 'cust-4',
    customerName: 'Neha Kapoor',
    customerPhone: '+91 99887 76655',
    stage: 'washing',
    dayCategory: 'Yesterday',
    orderDate: '2026-11-02',
    createdAt: 'Yesterday, 03:20 PM',
    expectedDelivery: 'Today, 06:00 PM',
    assignedStaff: 'Ramesh Kumar',
    items: [
      { serviceId: 'srv-2', name: 'Wash & Steam Iron', qty: 14, price: 129, unit: 'per Kg' },
      { serviceId: 'srv-5', name: 'Heavy Blanket / Quilt Spa (Double)', qty: 4, price: 399, unit: 'per Pc' }
    ],
    couponCode: 'BLANKET100',
    discountAmount: 100,
    paymentStatus: 'Paid (UPI)',
    lastNotified: 'Today, 10:00 AM via WhatsApp',
    notifyCount: 3
  },
  {
    id: 'WF-1047',
    customerId: 'cust-1',
    customerName: 'Rohit Sharma',
    customerPhone: '+91 98765 43210',
    stage: 'washing',
    dayCategory: 'Yesterday',
    orderDate: '2026-11-02',
    createdAt: 'Yesterday, 05:10 PM',
    expectedDelivery: 'Today, 08:00 PM',
    assignedStaff: 'Ramesh Kumar',
    items: [
      { serviceId: 'srv-1', name: 'Wash & Fold (Regular)', qty: 9, price: 89, unit: 'per Kg' }
    ],
    couponCode: '',
    discountAmount: 0,
    paymentStatus: 'Pending COD',
    lastNotified: 'Yesterday, 06:00 PM via WhatsApp',
    notifyCount: 2
  },
  {
    id: 'WF-1048',
    customerId: 'cust-2',
    customerName: 'Priya Verma',
    customerPhone: '+91 98234 56789',
    stage: 'ironing',
    dayCategory: 'Yesterday',
    orderDate: '2026-11-02',
    createdAt: 'Yesterday, 11:15 AM',
    expectedDelivery: 'Today, 05:00 PM',
    assignedStaff: 'Suresh Yadav',
    items: [
      { serviceId: 'srv-3', name: 'Dry Cleaning - Men Suit (2 Pc)', qty: 4, price: 450, unit: 'per Set' },
      { serviceId: 'srv-6', name: 'Steam Press Only', qty: 12, price: 20, unit: 'per Pc' }
    ],
    couponCode: 'FESTIVE25',
    discountAmount: 510,
    paymentStatus: 'Paid (UPI)',
    lastNotified: 'Today, 11:30 AM via WhatsApp',
    notifyCount: 3
  },
  {
    id: 'WF-1049',
    customerId: 'cust-4',
    customerName: 'Neha Kapoor',
    customerPhone: '+91 99887 76655',
    stage: 'ready',
    dayCategory: '2 Days Ago',
    orderDate: '2026-11-01',
    createdAt: '2 Days Ago, 04:00 PM',
    expectedDelivery: 'Today, 04:00 PM',
    assignedStaff: 'Deepak Paswan',
    items: [
      { serviceId: 'srv-2', name: 'Wash & Steam Iron', qty: 18, price: 129, unit: 'per Kg' },
      { serviceId: 'srv-4', name: 'Dry Cleaning - Silk / Designer Saree', qty: 5, price: 380, unit: 'per Pc' }
    ],
    couponCode: 'FESTIVE25',
    discountAmount: 1055,
    paymentStatus: 'Paid (UPI)',
    lastNotified: 'Today, 01:00 PM via WhatsApp',
    notifyCount: 4
  },
  {
    id: 'WF-1050',
    customerId: 'cust-5',
    customerName: 'Vikramaditya Nair',
    customerPhone: '+91 96543 21890',
    stage: 'delivered',
    dayCategory: '2 Days Ago',
    orderDate: '2026-11-01',
    createdAt: '2 Days Ago, 10:00 AM',
    expectedDelivery: 'Delivered Yesterday',
    assignedStaff: 'Deepak Paswan',
    items: [
      { serviceId: 'srv-3', name: 'Dry Cleaning - Men Suit (2 Pc)', qty: 6, price: 450, unit: 'per Set' },
      { serviceId: 'srv-7', name: 'Express 24-Hr Super Wash & Iron', qty: 14, price: 199, unit: 'per Kg' },
      { serviceId: 'srv-8', name: 'Sneaker & Shoe Deep Cleaning', qty: 4, price: 299, unit: 'per Pair' }
    ],
    couponCode: 'HOLIDAY150',
    discountAmount: 150,
    paymentStatus: 'Paid (Card)',
    lastNotified: 'Yesterday, 06:30 PM via WhatsApp',
    notifyCount: 5
  }
];

export default INITIAL_ORDERS;
