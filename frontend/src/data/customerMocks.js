export const customerMockAddresses = [
  {
    id: 'addr-1',
    label: 'Home',
    fullName: 'Aarav Sharma',
    phone: '+91 98765 43210',
    street: '12, Gulmohar Lane',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    country: 'India',
    isDefault: true,
  },
  {
    id: 'addr-2',
    label: 'Office',
    fullName: 'Aarav Sharma',
    phone: '+91 99887 66554',
    street: '45, Business Park',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560001',
    country: 'India',
    isDefault: false,
  },
];

export const customerMockOrders = [
  {
    id: 'ORD-1001',
    status: 'Active',
    statusKey: 'active',
    rentalStart: '2026-07-20',
    rentalEnd: '2026-07-24',
    totalAmount: 5400,
    productName: 'Premium Camera Kit',
    productImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'ORD-1002',
    status: 'Upcoming',
    statusKey: 'upcoming',
    rentalStart: '2026-08-10',
    rentalEnd: '2026-08-14',
    totalAmount: 7200,
    productName: 'Mountain Bike',
    productImage: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'ORD-1003',
    status: 'Completed',
    statusKey: 'completed',
    rentalStart: '2026-06-02',
    rentalEnd: '2026-06-05',
    totalAmount: 3600,
    productName: 'Gaming Console Bundle',
    productImage: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'ORD-1004',
    status: 'Cancelled',
    statusKey: 'cancelled',
    rentalStart: '2026-07-30',
    rentalEnd: '2026-08-03',
    totalAmount: 2400,
    productName: 'Portable Speaker',
    productImage: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80',
  },
];

export const customerMockPaymentMethods = [
  { id: 'card', label: 'Credit Card', description: 'Visa, Mastercard and Amex' },
  { id: 'debit', label: 'Debit Card', description: 'Instant debit card payment' },
  { id: 'upi', label: 'UPI', description: 'Pay via UPI apps' },
  { id: 'cash', label: 'Cash', description: 'Pay with cash on pickup or delivery' },
];

export const customerMockCoupons = [
  { code: 'SAVE10', label: 'Flat ₹500 off', discount: 500 },
  { code: 'RENT15', label: '15% off on rentals', discount: 0.15 },
];
