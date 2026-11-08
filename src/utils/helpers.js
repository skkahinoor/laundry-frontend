export function calculateOrderTotals(order) {
  const items = order.items || [];
  const subtotal = items.reduce((acc, item) => acc + (Number(item.price || item.unit_price) * Number(item.qty || item.qty_or_kg)), 0);
  const discount = Number(order.discountAmount || order.discount_applied || 0);
  const netRevenue = Math.max(0, subtotal - discount);
  return { subtotal, discount, netRevenue };
}

export function calculateFinancials(orders, staffList) {
  let grossBillingBeforeDiscount = 0;
  let totalDiscountsGiven = 0;
  let totalRevenue = 0;

  (orders || []).forEach((order) => {
    const { subtotal, discount, netRevenue } = calculateOrderTotals(order);
    grossBillingBeforeDiscount += subtotal;
    totalDiscountsGiven += discount;
    totalRevenue += netRevenue;
  });

  const totalPayrollPaid = (staffList || [])
    .filter((s) => s.status === 'Paid')
    .reduce((acc, s) => acc + (Number(s.netPay !== undefined ? s.netPay : (s.baseSalary || s.base_salary || 0))), 0);

  const totalPayrollPending = (staffList || [])
    .filter((s) => s.status === 'Pending')
    .reduce((acc, s) => acc + (Number(s.netPay !== undefined ? s.netPay : (s.baseSalary || s.base_salary || 0))), 0);

  const totalPayrollBudget = totalPayrollPaid + totalPayrollPending;
  const actualProfitAfterPaidSalary = totalRevenue - totalPayrollPaid;
  const netMarginPercent = totalRevenue > 0 ? Math.round((actualProfitAfterPaidSalary / totalRevenue) * 100) : 0;

  return {
    grossBillingBeforeDiscount,
    totalDiscountsGiven,
    totalRevenue,
    totalPayrollPaid,
    totalPayrollPending,
    totalPayrollBudget,
    actualProfitAfterPaidSalary,
    netMarginPercent
  };
}

export function getRelativeDay(dateStr) {
  if (!dateStr) return 'Today';
  const today = new Date();
  const d = new Date(dateStr);

  const diffTime = Math.abs(today.setHours(0, 0, 0, 0) - d.setHours(0, 0, 0, 0));
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays === 2) return '2 Days Ago';
  return dateStr;
}

export function normalizeOrder(o) {
  if (!o) return null;
  const orderDate = o.order_date ? o.order_date.split('T')[0] : new Date().toISOString().split('T')[0];
  const items = (o.items || []).map((it) => ({
    id: it.id,
    serviceId: it.service_id || it.serviceId,
    name: it.service?.name || it.service_name || it.name || 'Laundry Service',
    qty: Number(it.qty_or_kg || it.qty || 1),
    price: Number(it.unit_price || it.price || 0),
    unit: it.unit || it.service?.pricing_type || 'per Kg',
  }));

  return {
    id: o.order_id_string || (typeof o.id === 'string' ? o.id : `WF-${o.id}`),
    numericId: o.id,
    order_id_string: o.order_id_string || (typeof o.id === 'string' ? o.id : `WF-${o.id}`),
    customerId: o.customer_id || o.customerId,
    customerName: o.customer?.name || o.customerName || 'Customer',
    customerPhone: o.customer?.phone || o.customerPhone || '-',
    stage: o.stage || 'placed',
    dayCategory: o.dayCategory || getRelativeDay(orderDate),
    orderDate: orderDate,
    createdAt: o.createdAt || (o.created_at ? new Date(o.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Today'),
    expectedDelivery: o.expected_delivery || o.expectedDelivery || 'In 48 Hours',
    assignedStaff: o.assigned_staff || o.assignedStaff || 'Ramesh Kumar',
    items: items,
    couponCode: o.coupon?.code || o.couponCode || '',
    discountAmount: Number(o.discount_applied || o.discountAmount || 0),
    totalAmount: Number(o.total_amount || 0),
    netRevenue: Number(o.final_amount || o.netRevenue || 0),
    paymentStatus: o.payment_status || o.paymentStatus || 'Pending COD',
    lastNotified: o.last_notified || o.lastNotified || 'Not sent yet',
    notifyCount: Number(o.notify_count || o.notifyCount || 0),
  };
}

export function normalizeService(s) {
  return {
    id: s.id,
    name: s.name,
    category: s.category || 'Daily Laundry',
    price: Number(s.price),
    unit: s.pricing_type || s.unit || 'per Kg',
    turnaround: s.turnaround || '48 Hours',
    active: s.is_active !== undefined ? Boolean(s.is_active) : (s.active !== undefined ? Boolean(s.active) : true),
    popular: Boolean(s.is_popular || s.popular),
  };
}

export function normalizeCoupon(c) {
  return {
    id: c.id,
    title: c.title || 'Discount Offer',
    code: c.code,
    category: c.category || 'Coupon Code',
    discountType: c.type || c.discountType || 'percentage',
    discountValue: Number(c.discount_amount !== undefined ? c.discount_amount : c.discountValue),
    minOrder: Number(c.min_order !== undefined ? c.min_order : c.minOrder),
    validTill: c.valid_till || c.validTill || '31 Dec 2026',
    description: c.description || '',
    active: c.is_active !== undefined ? Boolean(c.is_active) : (c.active !== undefined ? Boolean(c.active) : true),
  };
}

export function normalizeStaff(s) {
  const baseSalary = Number(s.base_salary !== undefined ? s.base_salary : (s.baseSalary || 0));
  const bonus = Number(s.bonus || 0);
  const deduction = Number(s.deduction || 0);
  const leaveDeductions = Number(s.leave_deductions || 0);
  const totalDeductions = Number(s.total_deductions !== undefined ? s.total_deductions : (deduction + leaveDeductions));
  const netPay = Number(s.net_payable !== undefined ? s.net_payable : Math.max(0, baseSalary + bonus - totalDeductions));

  return {
    id: s.id,
    name: s.name,
    role: s.staff_role || s.role || 'Washer & Stain Specialist',
    email: s.email || '',
    phone: s.phone || '-',
    address: s.address || 'Address on file',
    baseSalary: baseSalary,
    bonus: bonus,
    deduction: deduction,
    leaveDeductions: leaveDeductions,
    totalDeductions: totalDeductions,
    paidLeavesCount: Number(s.paid_leaves_count || 0),
    unpaidLeavesCount: Number(s.unpaid_leaves_count || 0),
    netPay: netPay,
    status: s.status || 'Pending',
    paidDate: s.paid_date || s.paidDate || '-',
    paymentMode: s.payment_mode || s.paymentMode || 'UPI Transfer',
    joiningDate: s.joining_date || s.joiningDate || '03 Nov 2026',
    payrollId: s.payroll_id,
    // Banking Details
    accountHolderName: s.account_holder_name || s.accountHolderName || s.name,
    bankName: s.bank_name || s.bankName || 'HDFC Bank',
    accountNumber: s.account_number || s.accountNumber || '',
    ifscCode: s.ifsc_code || s.ifscCode || '',
    upiId: s.upi_id || s.upiId || '',
  };
}
