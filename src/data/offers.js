const INITIAL_OFFERS = [
  {
    id: 'off-1',
    title: 'Diwali & Shaadi Season Mega Glow',
    code: 'FESTIVE25',
    category: 'Festive Offer',
    discountType: 'percentage',
    discountValue: 25,
    minOrder: 600,
    validTill: '30 Nov 2026',
    description: 'Flat 25% OFF on Dry Cleaning, Sarees, Suits & Curtain washes.',
    active: true
  },
  {
    id: 'off-2',
    title: 'Long Weekend Holiday Bag Deal',
    code: 'HOLIDAY150',
    category: 'Holiday Offer',
    discountType: 'flat',
    discountValue: 150,
    minOrder: 799,
    validTill: '15 Dec 2026',
    description: 'Flat ₹150 OFF on travel laundry bags above ₹799.',
    active: true
  },
  {
    id: 'off-3',
    title: 'First Customer Welcome Coupon',
    code: 'FIRSTWASH20',
    category: 'Coupon Code',
    discountType: 'percentage',
    discountValue: 20,
    minOrder: 300,
    validTill: '31 Dec 2026',
    description: 'Instant 20% discount for new customers on their first order.',
    active: true
  },
  {
    id: 'off-4',
    title: 'Winter Blanket Combo Special',
    code: 'BLANKET100',
    category: 'Special Discount',
    discountType: 'flat',
    discountValue: 100,
    minOrder: 500,
    validTill: '20 Jan 2027',
    description: 'Save ₹100 when getting 2 or more blankets/quilts cleaned.',
    active: true
  }
];

export default INITIAL_OFFERS;
