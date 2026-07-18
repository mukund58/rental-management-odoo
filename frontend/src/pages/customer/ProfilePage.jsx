import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  Avatar,
  Switch,
  FormControlLabel,
  IconButton,
  Paper,
} from '@mui/material';
import {
  User,
  MapPin,
  CreditCard,
  Shield,
  Bell,
  Trash2,
  Edit2,
  Plus,
  Mail,
  Phone,
  CheckCircle,
  Key,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../../components/layout/Navbar';
import useAuth from '../../hooks/useAuth';
import { PATHS } from '../../routes/paths';
import { getCart } from '../../api/cartApi';

const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

const defaultAddressesList = [
  { id: 'addr-1', fullName: 'Sujal Shah', phone: '9876543210', street: 'BKC Business Hub, 5th Floor', city: 'Mumbai', state: 'Maharashtra', postalCode: '400051', country: 'India', isDefault: true },
  { id: 'addr-2', fullName: 'Sujal Shah', phone: '9876543210', street: '12-A Corporate Park, Bandra West', city: 'Mumbai', state: 'Maharashtra', postalCode: '400050', country: 'India', isDefault: false }
];

const defaultPaymentCards = [
  { id: 'pay-1', type: 'card', name: 'Sujal Shah', number: '•••• •••• •••• 4242', expiry: '12/28', isDefault: true },
  { id: 'pay-2', type: 'upi', name: 'Sujal Shah', number: 'sujal@okaxis', isDefault: false }
];

const ProfilePage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  // Tab State
  const [activeTab, setActiveTab] = useState(0);

  // User Profile State (from localStorage or defaults)
  const [userProfile, setUserProfile] = useState({
    fullName: 'Sujal Shah',
    email: 'sujal@example.com',
    phone: '9876543210',
    dob: '1998-05-15',
    gender: 'Male',
    avatar: '',
    memberSince: 'July 2026',
    status: 'Active',
  });

  const [editProfileMode, setEditProfileMode] = useState(false);
  const [tempProfile, setTempProfile] = useState({ ...userProfile });

  // Address State
  const [addresses, setAddresses] = useState(() => {
    return JSON.parse(localStorage.getItem('user_addresses')) || defaultAddressesList;
  });
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [addressForm, setAddressForm] = useState({ id: '', fullName: '', phone: '', street: '', city: '', state: '', postalCode: '', country: 'India' });
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  // Payment Method State
  const [payments, setPayments] = useState(() => {
    return JSON.parse(localStorage.getItem('user_payment_methods')) || defaultPaymentCards;
  });
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState({ id: '', type: 'card', name: '', number: '', expiry: '' });

  // Security Credentials State
  const [passwordForm, setPasswordForm] = useState({ current: '', newPassword: '', confirm: '' });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Notification Preferences State
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: true,
    pushAlerts: false,
    rentalReminders: true,
    pickupAlerts: true,
    returnReminders: true,
    promotions: false,
  });

  // Account Deletion States
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');

  // Orders statistics computation
  const ordersStats = useMemo(() => {
    const saved = JSON.parse(localStorage.getItem('rental_orders') || '[]');
    const total = saved.length + 4; // Add mock orders count
    const active = saved.filter(o => o.statusKey === 'active').length + 1; // plus 1 mock active
    const completed = saved.filter(o => o.statusKey === 'completed').length + 1; // plus 1 mock completed
    const cancelled = saved.filter(o => o.statusKey === 'cancelled').length + 1; // plus 1 mock cancelled

    const savedTotalCost = saved.reduce((acc, cur) => acc + (cur.totalAmount || 0), 0);
    const moneySpent = savedTotalCost + 18600; // Mock money spent fallback

    return { total, active, completed, cancelled, moneySpent };
  }, []);

  useEffect(() => {
    // Sync localStorage
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) {
      setUserProfile((prev) => ({
        ...prev,
        fullName: savedUser.fullName || prev.fullName,
        email: savedUser.email || prev.email,
        phone: savedUser.phone || prev.phone,
      }));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('user_addresses', JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    localStorage.setItem('user_payment_methods', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const items = await getCart();
        setCartCount(items.length);
      } catch (err) {
        console.warn('Could not fetch cart count:', err);
      }
    };
    fetchCart();
  }, []);

  const handleLogout = async () => {
    try { await logout(); } catch (err) { console.error(err); } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login', { replace: true });
    }
  };

  // Personal Info handlers
  const handleSaveProfile = () => {
    if (!tempProfile.fullName.trim()) {
      toast.error('Full Name is required.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(tempProfile.email)) {
      toast.error('Please enter a valid email.');
      return;
    }
    if (!/^\d{10}$/.test(tempProfile.phone)) {
      toast.error('Phone number must be exactly 10 digits.');
      return;
    }

    setUserProfile({ ...tempProfile });
    
    // Save to user storage
    const existingUser = JSON.parse(localStorage.getItem('user') || '{}');
    localStorage.setItem('user', JSON.stringify({ ...existingUser, fullName: tempProfile.fullName, email: tempProfile.email, phone: tempProfile.phone }));

    toast.success('Profile details saved successfully!');
    setEditProfileMode(false);
  };

  const handleCancelProfile = () => {
    setTempProfile({ ...userProfile });
    setEditProfileMode(false);
  };

  // Address handlers
  const handleOpenAddAddress = () => {
    setAddressForm({ id: '', fullName: '', phone: '', street: '', city: '', state: '', postalCode: '', country: 'India' });
    setIsEditingAddress(false);
    setAddressDialogOpen(true);
  };

  const handleOpenEditAddress = (addr) => {
    setAddressForm({ ...addr });
    setIsEditingAddress(true);
    setAddressDialogOpen(true);
  };

  const handleSaveAddress = () => {
    if (!addressForm.fullName.trim() || !addressForm.phone.trim() || !addressForm.street.trim() || !addressForm.city.trim() || !addressForm.state.trim() || !addressForm.postalCode.trim()) {
      toast.error('All fields are required.');
      return;
    }
    if (!/^\d{10}$/.test(addressForm.phone)) {
      toast.error('Please enter a 10-digit phone number.');
      return;
    }

    if (isEditingAddress) {
      setAddresses((prev) => prev.map((a) => (a.id === addressForm.id ? { ...addressForm } : a)));
      toast.success('Address updated.');
    } else {
      const newAddr = {
        ...addressForm,
        id: `addr-${Math.floor(1000 + Math.random() * 9000)}`,
        isDefault: addresses.length === 0,
      };
      setAddresses((prev) => [...prev, newAddr]);
      toast.success('Address saved.');
    }
    setAddressDialogOpen(false);
  };

  const handleDeleteAddress = (id) => {
    const matched = addresses.find((a) => a.id === id);
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    toast.error('Address deleted.');

    // If default deleted, set another default
    if (matched?.isDefault && addresses.length > 1) {
      setAddresses((prev) => prev.map((a, i) => (i === 0 ? { ...a, isDefault: true } : a)));
    }
  };

  const handleSetDefaultAddress = (id) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
    toast.success('Default address updated.');
  };

  // Payment handlers
  const handleOpenAddPayment = () => {
    setPaymentForm({ id: '', type: 'card', name: '', number: '', expiry: '' });
    setPaymentDialogOpen(true);
  };

  const handleSavePayment = () => {
    if (!paymentForm.name.trim() || !paymentForm.number.trim()) {
      toast.error('Name and number details are required.');
      return;
    }

    const newPay = {
      ...paymentForm,
      id: `pay-${Math.floor(1000 + Math.random() * 9000)}`,
      isDefault: payments.length === 0,
    };
    setPayments((prev) => [...prev, newPay]);
    toast.success('Payment method added successfully.');
    setPaymentDialogOpen(false);
  };

  const handleDeletePayment = (id) => {
    setPayments((prev) => prev.filter((p) => p.id !== id));
    toast.error('Payment method removed.');
  };

  const handleSetDefaultPayment = (id) => {
    setPayments((prev) => prev.map((p) => ({ ...p, isDefault: p.id === id })));
    toast.success('Default payment updated.');
  };

  // Security Credentials handlers
  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!passwordForm.current || !passwordForm.newPassword || !passwordForm.confirm) {
      toast.error('All fields are required to change password.');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirm) {
      toast.error('New password and confirmation do not match.');
      return;
    }
    toast.success('Password changed successfully!');
    setPasswordForm({ current: '', newPassword: '', confirm: '' });
  };

  // Account Termination handlers
  const handleDeleteAccount = () => {
    if (deleteConfirmationText.trim().toUpperCase() !== 'DELETE') {
      toast.error('Please type DELETE to confirm account termination.');
      return;
    }
    toast.success('Account successfully deleted. We are sorry to see you go!');
    setDeleteDialogOpen(false);
    
    // Clear storage & Logout
    localStorage.clear();
    navigate('/login', { replace: true });
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      <Navbar onSearchChange={() => {}} cartCount={cartCount} onLogout={handleLogout} />
      
      <Container maxWidth="lg" sx={{ pt: '94px', pb: 8 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, letterSpacing: '-0.02em' }}>Account Settings</Typography>

        <Grid container spacing={4}>
          
          {/* Left Column: Profile Card & Tabs List */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={3}>
              
              {/* Profile Card */}
              <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)' }}>
                <CardContent sx={{ p: 3.5, textAlign: 'center' }}>
                  <Avatar sx={{ width: 90, height: 90, mx: 'auto', mb: 2, bgcolor: 'primary.main', fontSize: '2rem', fontWeight: 800 }}>
                    {userProfile.fullName.charAt(0)}
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>{userProfile.fullName}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{userProfile.email}</Typography>

                  <Chip label={`Status: ${userProfile.status}`} color="success" size="small" sx={{ fontWeight: 700, mb: 3 }} />
                  <Divider sx={{ mb: 2 }} />

                  <Grid container spacing={1}>
                    <Grid size={4}>
                      <Typography variant="caption" color="text.secondary">Total</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{ordersStats.total}</Typography>
                    </Grid>
                    <Grid size={4}>
                      <Typography variant="caption" color="text.secondary">Active</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>{ordersStats.active}</Typography>
                    </Grid>
                    <Grid size={4}>
                      <Typography variant="caption" color="text.secondary">Member Since</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{userProfile.memberSince}</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Navigation Tabs Card */}
              <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)' }}>
                <Tabs
                  orientation="vertical"
                  value={activeTab}
                  onChange={(_, value) => setActiveTab(value)}
                  sx={{
                    '& .MuiTab-root': {
                      alignItems: 'flex-start',
                      fontWeight: 700,
                      textTransform: 'none',
                      py: 2,
                      px: 3,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      '&:last-child': { borderBottom: 'none' }
                    }
                  }}
                >
                  <Tab icon={<User size={18} style={{ marginRight: 8 }} />} iconPosition="start" label="Personal Details" />
                  <Tab icon={<MapPin size={18} style={{ marginRight: 8 }} />} iconPosition="start" label="Saved Addresses" />
                  <Tab icon={<CreditCard size={18} style={{ marginRight: 8 }} />} iconPosition="start" label="Payment Methods" />
                  <Tab icon={<Shield size={18} style={{ marginRight: 8 }} />} iconPosition="start" label="Security Settings" />
                  <Tab icon={<Bell size={18} style={{ marginRight: 8 }} />} iconPosition="start" label="Notification Feeds" />
                </Tabs>
              </Card>

              {/* View Orders redirect */}
              <Button variant="outlined" fullWidth onClick={() => navigate('/orders')} sx={{ borderRadius: 999, py: 1.1, textTransform: 'none', fontWeight: 700 }}>
                View My Orders
              </Button>
            </Stack>
          </Grid>

          {/* Right Column: Tab detail panels */}
          <Grid size={{ xs: 12, md: 8 }}>
            
            {/* Panel 0: Personal Details */}
            {activeTab === 0 && (
              <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)' }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>Personal Details</Typography>
                    {!editProfileMode && (
                      <Button startIcon={<Edit2 size={16} />} size="small" onClick={() => setEditProfileMode(true)}>
                        Edit
                      </Button>
                    )}
                  </Box>

                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        label="Full Name"
                        size="small"
                        fullWidth
                        disabled={!editProfileMode}
                        value={editProfileMode ? tempProfile.fullName : userProfile.fullName}
                        onChange={(e) => setTempProfile(prev => ({ ...prev, fullName: e.target.value }))}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        label="Email Address"
                        size="small"
                        fullWidth
                        disabled={!editProfileMode}
                        value={editProfileMode ? tempProfile.email : userProfile.email}
                        onChange={(e) => setTempProfile(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        label="Phone Number"
                        size="small"
                        fullWidth
                        disabled={!editProfileMode}
                        value={editProfileMode ? tempProfile.phone : userProfile.phone}
                        onChange={(e) => setTempProfile(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        label="Date of Birth"
                        size="small"
                        type="date"
                        fullWidth
                        disabled={!editProfileMode}
                        InputLabelProps={{ shrink: true }}
                        value={editProfileMode ? tempProfile.dob : userProfile.dob}
                        onChange={(e) => setTempProfile(prev => ({ ...prev, dob: e.target.value }))}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormControl fullWidth size="small" disabled={!editProfileMode}>
                        <InputLabel>Gender</InputLabel>
                        <Select
                          value={editProfileMode ? tempProfile.gender : userProfile.gender}
                          label="Gender"
                          onChange={(e) => setTempProfile(prev => ({ ...prev, gender: e.target.value }))}
                        >
                          <MenuItem value="Male">Male</MenuItem>
                          <MenuItem value="Female">Female</MenuItem>
                          <MenuItem value="Other">Other</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>

                  {editProfileMode && (
                    <Stack direction="row" spacing={1.5} sx={{ mt: 4, justifyContent: 'flex-end' }}>
                      <Button variant="outlined" size="small" onClick={handleCancelProfile} sx={{ borderRadius: 999 }}>
                        Cancel Changes
                      </Button>
                      <Button variant="contained" size="small" onClick={handleSaveProfile} sx={{ borderRadius: 999 }}>
                        Save Changes
                      </Button>
                    </Stack>
                  )}

                  <Divider sx={{ my: 4 }} />

                  {/* Summary Statistics */}
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2 }}>Rentals Stats Summary</Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6, sm: 4 }}>
                      <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary">Total Spent</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 800, color: 'primary.main', mt: 0.5 }}>{money.format(ordersStats.moneySpent)}</Typography>
                      </Paper>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 4 }}>
                      <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary">Completed Rentals</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 800, mt: 0.5 }}>{ordersStats.completed}</Typography>
                      </Paper>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 4 }}>
                      <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary">Favorite Category</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 800, mt: 0.5 }}>Electronics</Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            )}

            {/* Panel 1: Saved Addresses */}
            {activeTab === 1 && (
              <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)' }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>Saved Addresses</Typography>
                    <Button startIcon={<Plus size={16} />} size="small" onClick={handleOpenAddAddress} sx={{ borderRadius: 999 }}>
                      Add Address
                    </Button>
                  </Box>

                  {addresses.length === 0 ? (
                    <Box sx={{ py: 6, textAlign: 'center', color: 'text.secondary' }}>
                      <Typography variant="body1">No addresses saved yet.</Typography>
                    </Box>
                  ) : (
                    <Grid container spacing={2.5}>
                      {addresses.map((addr) => (
                        <Grid size={{ xs: 12, sm: 6 }} key={addr.id}>
                          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3.5, border: addr.isDefault ? '2px solid #4f46e5' : '1px solid #e2e8f0', position: 'relative' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{addr.fullName}</Typography>
                              <Stack direction="row" spacing={0.5}>
                                <IconButton size="small" onClick={() => handleOpenEditAddress(addr)}><Edit2 size={14} /></IconButton>
                                <IconButton size="small" onClick={() => handleDeleteAddress(addr.id)} color="error"><Trash2 size={14} /></IconButton>
                              </Stack>
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>{addr.street}</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>{addr.city}, {addr.state} - {addr.postalCode}</Typography>
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="caption" color="text.secondary">Phone: {addr.phone}</Typography>
                              {addr.isDefault ? (
                                <Chip label="Default" color="primary" size="small" sx={{ fontWeight: 700, fontSize: '0.65rem' }} />
                              ) : (
                                <Button size="small" onClick={() => handleSetDefaultAddress(addr.id)} sx={{ fontSize: '0.75rem', p: 0 }}>
                                  Set default
                                </Button>
                              )}
                            </Box>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Panel 2: Payment Methods */}
            {activeTab === 2 && (
              <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)' }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>Payment Methods</Typography>
                    <Button startIcon={<Plus size={16} />} size="small" onClick={handleOpenAddPayment} sx={{ borderRadius: 999 }}>
                      Add Method
                    </Button>
                  </Box>

                  {payments.length === 0 ? (
                    <Box sx={{ py: 6, textAlign: 'center', color: 'text.secondary' }}>
                      <Typography variant="body1">No payment options stored.</Typography>
                    </Box>
                  ) : (
                    <Stack spacing={2}>
                      {payments.map((pay) => (
                        <Paper key={pay.id} variant="outlined" sx={{ p: 2, borderRadius: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'grey.100', color: 'grey.600', display: 'flex' }}>
                              <CreditCard size={22} />
                            </Box>
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{pay.number}</Typography>
                              <Typography variant="caption" color="text.secondary">{pay.type.toUpperCase()} • Name: {pay.name} {pay.expiry && `• Exp: ${pay.expiry}`}</Typography>
                            </Box>
                          </Box>
                          
                          <Stack direction="row" spacing={1} alignItems="center">
                            {pay.isDefault ? (
                              <Chip label="Default" size="small" color="primary" sx={{ fontWeight: 700 }} />
                            ) : (
                              <Button size="small" onClick={() => handleSetDefaultPayment(pay.id)}>Set default</Button>
                            )}
                            <IconButton color="error" size="small" onClick={() => handleDeletePayment(pay.id)}>
                              <Trash2 size={16} />
                            </IconButton>
                          </Stack>
                        </Paper>
                      ))}
                    </Stack>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Panel 3: Security Settings */}
            {activeTab === 3 && (
              <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)' }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Account Security</Typography>
                  
                  <form onSubmit={handleChangePassword}>
                    <Stack spacing={2.5}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Change Password</Typography>
                      <TextField
                        label="Current Password"
                        size="small"
                        type="password"
                        fullWidth
                        value={passwordForm.current}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, current: e.target.value }))}
                      />
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            label="New Password"
                            size="small"
                            type="password"
                            fullWidth
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            label="Confirm New Password"
                            size="small"
                            type="password"
                            fullWidth
                            value={passwordForm.confirm}
                            onChange={(e) => setPasswordForm(prev => ({ ...prev, confirm: e.target.value }))}
                          />
                        </Grid>
                      </Grid>
                      <Button type="submit" variant="contained" size="small" sx={{ alignSelf: 'flex-start', borderRadius: 999, px: 3 }}>
                        Update Password
                      </Button>
                    </Stack>
                  </form>

                  <Divider sx={{ my: 4 }} />

                  <Stack spacing={2.5}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Security Preferences</Typography>
                    <FormControlLabel
                      control={<Switch checked={twoFactorEnabled} onChange={(e) => {
                        setTwoFactorEnabled(e.target.checked);
                        toast.success(`Two-Factor Authentication ${e.target.checked ? 'enabled' : 'disabled'}.`);
                      }} />}
                      label="Enable Two-Factor Authentication (2FA)"
                    />
                    <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Last Account Access Activity</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, mt: 0.5 }}>Logged in via Chrome (Windows) • Mumbai, IN</Typography>
                      <Typography variant="caption" color="text.secondary">Timestamp: Today at 11:42 PM</Typography>
                    </Box>
                    <Button variant="outlined" color="error" size="small" sx={{ alignSelf: 'flex-start', borderRadius: 999 }} onClick={() => toast.success('Logged out from all other active sessions.')}>
                      Logout From All Other Devices
                    </Button>
                  </Stack>

                  <Divider sx={{ my: 4 }} />

                  <Stack spacing={2}>
                    <Typography variant="subtitle2" color="error.main" sx={{ fontWeight: 700 }}>Danger Zone</Typography>
                    <Typography variant="body2" color="text.secondary">Terminating your account is permanent. All historical rental records, invoices, and address credentials will be deleted.</Typography>
                    <Button variant="contained" color="error" size="small" sx={{ alignSelf: 'flex-start', borderRadius: 999 }} onClick={() => setDeleteDialogOpen(true)}>
                      Delete Account
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            )}

            {/* Panel 4: Notification Preferences */}
            {activeTab === 4 && (
              <Card sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)' }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Notification Feeds Preferences</Typography>
                  <Stack spacing={2.5}>
                    {[
                      { key: 'emailAlerts', title: 'Email Notifications', desc: 'Receive summaries, rental confirmation updates, and billing invoices.' },
                      { key: 'smsAlerts', title: 'SMS/Whatsapp Notifications', desc: 'Receive immediate delivery details, otp verifications, and return deadlines.' },
                      { key: 'pushAlerts', title: 'In-app Push Notifications', desc: 'Real-time timeline reminders while browsing.' },
                      { key: 'rentalReminders', title: 'Rental Reminders', desc: 'Alert updates throughout the ongoing active renting period.' },
                      { key: 'pickupAlerts', title: 'Pickup Locker Codes Alert', desc: 'Locker passcode notification updates.' },
                      { key: 'returnReminders', title: 'Return Deadline warnings', desc: 'Alert warnings 24 hours before return schedule ends.' },
                      { key: 'promotions', title: 'Discount Alerts & Promotions', desc: 'Special coupon code deals and campaign releases.' }
                    ].map((pref) => (
                      <Box key={pref.key} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{pref.title}</Typography>
                          <Typography variant="caption" color="text.secondary">{pref.desc}</Typography>
                        </Box>
                        <Switch
                          checked={notifications[pref.key]}
                          onChange={(e) => {
                            const val = e.target.checked;
                            setNotifications((prev) => ({ ...prev, [pref.key]: val }));
                            toast.success(`Preference for ${pref.title} updated.`);
                          }}
                        />
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            )}

          </Grid>
        </Grid>
      </Container>

      {/* Address Dialog */}
      <Dialog open={addressDialogOpen} onClose={() => setAddressDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>{isEditingAddress ? 'Edit Address' : 'Add New Address'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2.5}>
            <TextField label="Full Name" size="small" fullWidth value={addressForm.fullName} onChange={(e) => setAddressForm(prev => ({ ...prev, fullName: e.target.value }))} />
            <TextField label="Phone Number" size="small" fullWidth value={addressForm.phone} onChange={(e) => setAddressForm(prev => ({ ...prev, phone: e.target.value }))} />
            <TextField label="Street/Locality" size="small" fullWidth value={addressForm.street} onChange={(e) => setAddressForm(prev => ({ ...prev, street: e.target.value }))} />
            <Grid container spacing={2}>
              <Grid size={6}>
                <TextField label="City" size="small" fullWidth value={addressForm.city} onChange={(e) => setAddressForm(prev => ({ ...prev, city: e.target.value }))} />
              </Grid>
              <Grid size={6}>
                <TextField label="State" size="small" fullWidth value={addressForm.state} onChange={(e) => setAddressForm(prev => ({ ...prev, state: e.target.value }))} />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid size={6}>
                <TextField label="Postal Code" size="small" fullWidth value={addressForm.postalCode} onChange={(e) => setAddressForm(prev => ({ ...prev, postalCode: e.target.value }))} />
              </Grid>
              <Grid size={6}>
                <TextField label="Country" size="small" fullWidth disabled value={addressForm.country} />
              </Grid>
            </Grid>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button variant="outlined" onClick={() => setAddressDialogOpen(false)} sx={{ borderRadius: 999 }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSaveAddress} sx={{ borderRadius: 999 }}>
            Save Address
          </Button>
        </DialogActions>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onClose={() => setPaymentDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Add Payment Method</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2.5}>
            <FormControl fullWidth size="small">
              <InputLabel>Type</InputLabel>
              <Select value={paymentForm.type} label="Type" onChange={(e) => setPaymentForm(prev => ({ ...prev, type: e.target.value }))}>
                <MenuItem value="card">Credit / Debit Card</MenuItem>
                <MenuItem value="upi">UPI ID</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Holder Name" size="small" fullWidth value={paymentForm.name} onChange={(e) => setPaymentForm(prev => ({ ...prev, name: e.target.value }))} />
            <TextField
              label={paymentForm.type === 'card' ? 'Card Number' : 'UPI ID'}
              size="small"
              fullWidth
              placeholder={paymentForm.type === 'card' ? '16 digit card number' : 'username@upi'}
              value={paymentForm.number}
              onChange={(e) => setPaymentForm(prev => ({ ...prev, number: e.target.value }))}
            />
            {paymentForm.type === 'card' && (
              <TextField label="Expiry (MM/YY)" size="small" fullWidth placeholder="MM/YY" value={paymentForm.expiry} onChange={(e) => setPaymentForm(prev => ({ ...prev, expiry: e.target.value }))} />
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button variant="outlined" onClick={() => setPaymentDialogOpen(false)} sx={{ borderRadius: 999 }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSavePayment} sx={{ borderRadius: 999 }}>
            Add Method
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle sx={{ fontWeight: 800, color: 'error.main' }}>Terminate Account Confirmation</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <Typography variant="body2">
              Are you sure you want to permanently delete your account? This action is immediate and cannot be undone. All active rental bookings will be terminated.
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              To verify, please type the word <strong>DELETE</strong> below:
            </Typography>
            <TextField
              placeholder="Type DELETE"
              size="small"
              fullWidth
              value={deleteConfirmationText}
              onChange={(e) => setDeleteConfirmationText(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button variant="outlined" onClick={() => setDeleteDialogOpen(false)} sx={{ borderRadius: 999 }}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleDeleteAccount} sx={{ borderRadius: 999 }}>
            Terminate Account
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default ProfilePage;
