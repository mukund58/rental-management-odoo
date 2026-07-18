export const adminMockSummaryStats = [
  { id: 'active', title: 'Active Rentals', value: '42', trend: '+12%', description: 'Equipment currently in possession of customers', path: '/admin/dashboard?status=Active' },
  { id: 'due-today', title: 'Rentals Due Today', value: '5', trend: '0%', description: 'Rentals scheduled for drop-off today', path: '/admin/dashboard?status=Due' },
  { id: 'pickups', title: 'Upcoming Pickups', value: '8', trend: '+8%', description: 'Handoff schedules booked for today', path: '/admin/dashboard?status=Pickup' },
  { id: 'returns', title: 'Upcoming Returns', value: '6', trend: '-2%', description: 'Return schedules booked for today', path: '/admin/dashboard?status=Return' },
  { id: 'overdue', title: 'Overdue Rentals', value: '3', trend: '+20%', description: 'Items not returned past return deadlines', path: '/admin/dashboard?status=Overdue' },
  { id: 'revenue', title: 'Total Revenue', value: '₹1,58,400', trend: '+15%', description: 'Accumulated rental charges collected', path: '/admin/dashboard?tab=financials' },
  { id: 'deposits', title: 'Security Deposits Held', value: '₹42,500', trend: '+5%', description: 'Refunding deposit guarantees in escrow', path: '/admin/dashboard?tab=financials' },
  { id: 'late-fees', title: 'Late Fee Collection', value: '₹6,800', trend: '+35%', description: 'Overdue penalties accrued', path: '/admin/dashboard?tab=financials' }
];

export const adminMockStatusOverview = [
  { label: 'Reserved', count: 4, color: 'info' },
  { label: 'Confirmed', count: 12, color: 'primary' },
  { label: 'Ready for Pickup', count: 8, color: 'warning' },
  { label: 'Picked Up', count: 15, color: 'secondary' },
  { label: 'Active Rental', count: 27, color: 'success' },
  { label: 'Return Due', count: 6, color: 'warning' },
  { label: 'Returned', count: 32, color: 'info' },
  { label: 'Completed', count: 148, color: 'success' },
  { label: 'Cancelled', count: 9, color: 'error' }
];

export const adminMockRentals = [
  { id: 'ORD-882201', customerName: 'Aarav Sharma', productName: 'Premium Camera Kit', productId: 'p4', rentalPeriod: '07/15 - 07/22', pickupDate: '15 Jul', returnDate: '22 Jul', deposit: 1200, status: 'Active', paymentStatus: 'Paid', email: 'aarav@example.com' },
  { id: 'ORD-882202', customerName: 'Ishaan Patel', productName: 'Mountain Bike', productId: 'p2', rentalPeriod: '07/12 - 07/19', pickupDate: '12 Jul', returnDate: '19 Jul', deposit: 500, status: 'Return Due', paymentStatus: 'Paid', email: 'ishaan@example.com' },
  { id: 'ORD-882203', customerName: 'Ananya Rao', productName: 'Gaming Console Bundle', productId: 'p3', rentalPeriod: '07/18 - 07/25', pickupDate: '18 Jul', returnDate: '25 Jul', deposit: 1500, status: 'Confirmed', paymentStatus: 'Paid', email: 'ananya@example.com' },
  { id: 'ORD-882204', customerName: 'Kabir Mehta', productName: 'Portable Projector', productId: 'p1', rentalPeriod: '07/10 - 07/17', pickupDate: '10 Jul', returnDate: '17 Jul', deposit: 800, status: 'Returned', paymentStatus: 'Paid', email: 'kabir@example.com' },
  { id: 'ORD-882205', customerName: 'Diya Sen', productName: 'Camping Tent', productId: 'p5', rentalPeriod: '07/14 - 07/21', pickupDate: '14 Jul', returnDate: '21 Jul', deposit: 400, status: 'Active', paymentStatus: 'Paid', email: 'diya@example.com' }
];

export const adminMockPickups = [
  { id: 'ORD-882203', customerName: 'Ananya Rao', productName: 'Gaming Console Bundle', time: '11:00 AM', location: 'BKC Hub Locker 04', assignedStaff: 'Rahul S.', status: 'Ready' },
  { id: 'ORD-882206', customerName: 'Dev Modi', productName: 'Pro Studio Microphone', time: '02:30 PM', location: 'Andheri West Counter', assignedStaff: 'Amit P.', status: 'Ready' },
  { id: 'ORD-882207', customerName: 'Tara Iyer', productName: 'Electric Scooter', time: '04:00 PM', location: 'BKC Hub Locker 12', assignedStaff: 'Rahul S.', status: 'Preparing' }
];

export const adminMockReturns = [
  { id: 'ORD-882202', customerName: 'Ishaan Patel', productName: 'Mountain Bike', time: '12:00 PM', deposit: 500, lateFee: 0, status: 'Pending Handoff' },
  { id: 'ORD-882208', customerName: 'Nisha Gill', productName: 'DJ Mixer Deck', time: '03:15 PM', deposit: 2500, lateFee: 350, status: 'Overdue Handoff' },
  { id: 'ORD-882209', customerName: 'Rohan Shah', productName: 'Hiking Pack Combo', time: '05:00 PM', deposit: 300, lateFee: 0, status: 'Pending Handoff' }
];

export const adminMockOverdues = [
  { id: 'ORD-882208', customerName: 'Nisha Gill', productName: 'DJ Mixer Deck', daysLate: 2, lateFee: 700, deposit: 2500, email: 'nisha@example.com' },
  { id: 'ORD-882210', customerName: 'Vikram Pal', productName: 'DSLR Gimbal Stabilizer', daysLate: 4, lateFee: 1200, deposit: 1000, email: 'vikram@example.com' },
  { id: 'ORD-882211', customerName: 'Riya Bose', productName: 'Smart Watch', daysLate: 1, lateFee: 150, deposit: 500, email: 'riya@example.com' }
];

export const adminMockAlerts = [
  { id: 'alert-1', type: 'error', message: 'Booking ORD-882210 is 4 days overdue. Accumulated late fee ₹1,200.' },
  { id: 'alert-2', type: 'warning', message: 'Low inventory alert: DSLR Cameras stock drops below threshold (1 unit remaining).' },
  { id: 'alert-3', type: 'info', message: 'Refund escrow payout pending: 4 completed orders awaiting deposit validations.' },
  { id: 'alert-4', type: 'warning', message: 'Return delay: Customer Rohan Shah reports dropoff delay of 2 hours.' }
];

export const adminMockTimeline = [
  { time: 'Just Now', title: 'Booking ORD-882212 Created', detail: 'Sujal Shah rented DSLR camera for 5 days.' },
  { time: '10 mins ago', title: 'Payment Confirmed', detail: 'Received ₹5,499 gateway transaction for console booking.' },
  { time: '35 mins ago', title: 'Pickup Completed', detail: 'Locker BKC-04 opened. Ananya Rao completed self-pickup.' },
  { time: '1 hour ago', title: 'Product Returned', detail: 'Projector unit ORD-882204 returned. Quality checks cleared.' },
  { time: '2 hours ago', title: 'Deposit Refunded', detail: '₹2,500 security deposit refunded to Vikram Pal.' },
  { time: '4 hours ago', title: 'Product Inventory Added', detail: '5 units of GoPro Hero 12 added to catalog.' }
];

// Charts Mock Datasets
export const adminMockRevenueChart = [
  { label: 'Jan', revenue: 65000, deposits: 18000 },
  { label: 'Feb', revenue: 82000, deposits: 22000 },
  { label: 'Mar', revenue: 95000, deposits: 26000 },
  { label: 'Apr', revenue: 110000, deposits: 31000 },
  { label: 'May', revenue: 135000, deposits: 38000 },
  { label: 'Jun', revenue: 158400, deposits: 42500 }
];

export const adminMockWeeklyRentals = [
  { day: 'Mon', count: 12 },
  { day: 'Tue', count: 19 },
  { day: 'Wed', count: 15 },
  { day: 'Thu', count: 22 },
  { day: 'Fri', count: 30 },
  { day: 'Sat', count: 42 },
  { day: 'Sun', count: 25 }
];

export const adminMockTopProducts = [
  { name: 'MacBook Pro', count: 86, rate: '₹450/day' },
  { name: 'DSLR Camera', count: 72, rate: '₹800/day' },
  { name: 'PS5 Console', count: 68, rate: '₹200/day' },
  { name: 'Mountain Bike', count: 45, rate: '₹150/day' }
];
