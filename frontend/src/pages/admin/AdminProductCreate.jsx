import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Button, TextField, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, RadioGroup, Radio, FormControlLabel, Switch, Select, MenuItem, InputAdornment, CircularProgress, FormControl, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Check, X, Image as ImageIcon, Settings, ClipboardPaste } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadProductImage, createProduct } from '../../api/productApi';
import { getCategories } from '../../api/authApi';
import { API_URL } from '../../constants/env';

export const AdminProductCreate = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('General');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const fileInputRef = useRef(null);

  // Form state
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    deposit: '',
    imageUrl: '',
    categoryId: '',
    stockQuantity: 0,
    isActive: true,
    productType: 'Goods',
  });

  useEffect(() => {
    getCategories()
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(() => toast.error('Failed to load categories'));
  }, []);

  const setField = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  // ---- Image upload helpers ----
  const uploadFile = async (file) => {
    try {
      setUploading(true);
      const data = await uploadProductImage(file);
      if (data && data.url) {
        setField('imageUrl', data.url);
        toast.success('Image uploaded successfully');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await uploadFile(file);
  };

  const handlePasteClick = async (e) => {
    e.stopPropagation();
    try {
      const clipboardItems = await navigator.clipboard.read();
      for (const clipboardItem of clipboardItems) {
        const imageTypes = clipboardItem.types.filter(t => t.startsWith('image/'));
        if (imageTypes.length > 0) {
          const blob = await clipboardItem.getType(imageTypes[0]);
          const file = new File([blob], 'pasted-image.png', { type: blob.type });
          await uploadFile(file);
          return;
        }
      }
      toast.error('No image found in clipboard');
    } catch (err) {
      toast.error('Failed to read clipboard. Check browser permissions.');
    }
  };

  useEffect(() => {
    const handleGlobalPaste = (e) => {
      if (e.clipboardData?.files?.length > 0) {
        const file = e.clipboardData.files[0];
        if (file.type.startsWith('image/')) {
          e.preventDefault();
          uploadFile(file);
        }
      }
    };
    window.addEventListener('paste', handleGlobalPaste);
    return () => window.removeEventListener('paste', handleGlobalPaste);
  }, []);

  // ---- Save product ----
  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Product name is required'); return; }
    if (!form.categoryId) { toast.error('Please select a category'); return; }
    if (!form.price) { toast.error('Sales price is required'); return; }

    try {
      setSaving(true);
      await createProduct({
        name: form.name,
        description: form.description || '',
        price: parseFloat(form.price) || 0,
        deposit: parseFloat(form.deposit) || 0,
        imageUrl: form.imageUrl || null,
        categoryId: form.categoryId,
        stockQuantity: parseInt(form.stockQuantity) || 0,
        isActive: form.isActive,
      });
      toast.success('Product created successfully!');
      navigate(-1);
    } catch (err) {
      console.error(err);
      toast.error('Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const imageFullUrl = form.imageUrl
    ? `${API_URL.replace('/api', '')}${form.imageUrl}`
    : null;

  return (
    <Box sx={{ width: '100%', p: 3, maxWidth: 1200, mx: 'auto', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Top Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button
          variant="contained"
          sx={{ bgcolor: '#c084fc', '&:hover': { bgcolor: '#a855f7' }, borderRadius: 2 }}
          onClick={() => setForm(prev => ({ ...prev, name: '', description: '', price: '', deposit: '', imageUrl: '', stockQuantity: 0, isActive: true }))}
        >
          New
        </Button>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>Product</Typography>
        <IconButton size="small" color="success" sx={{ border: '1px solid', borderRadius: 1 }} onClick={handleSave} disabled={saving}>
          {saving ? <CircularProgress size={16} /> : <Check size={16} />}
        </IconButton>
        <IconButton size="small" color="error" sx={{ border: '1px solid', borderRadius: 1 }} onClick={() => navigate(-1)}>
          <X size={16} />
        </IconButton>
      </Box>

      <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', mb: 4 }}>

        {/* Name and Image */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, md: 9 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Product Name *</Typography>
            <TextField
              fullWidth
              placeholder="e.g. HP Laptop"
              value={form.name}
              onChange={e => setField('name', e.target.value)}
              variant="standard"
              slotProps={{
                htmlInput: { sx: { fontSize: '1.5rem', fontWeight: 600 } }
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
            <Box
              onClick={() => fileInputRef.current?.click()}
              sx={{ width: 120, height: 120, border: '2px dashed', borderColor: 'divider', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', cursor: 'pointer', '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' }, overflow: 'hidden' }}
            >
              {uploading ? (
                <CircularProgress size={24} />
              ) : imageFullUrl ? (
                <img src={imageFullUrl} alt="Product" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <ImageIcon size={40} color="#94a3b8" />
              )}
            </Box>
            <IconButton
              onClick={handlePasteClick}
              color="primary"
              size="small"
              sx={{ bgcolor: 'background.paper', boxShadow: 1, '&:hover': { bgcolor: 'action.hover' } }}
              title="Paste Image from Clipboard (or Ctrl+V)"
            >
              <ClipboardPaste size={18} />
            </IconButton>
            <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileChange} />
          </Grid>
        </Grid>

        {/* Tabs */}
        <Box sx={{ display: 'flex', gap: 1, borderBottom: '2px solid', borderColor: 'divider', mb: 4 }}>
          {['General Information', 'Attributes & Variants', 'Sales'].map(tab => (
            <Box
              key={tab}
              onClick={() => setActiveTab(tab.split(' ')[0])}
              sx={{
                px: 2, py: 1,
                cursor: 'pointer',
                borderBottom: activeTab === tab.split(' ')[0] ? '2px solid #3b82f6' : '2px solid transparent',
                mb: '-2px',
                color: activeTab === tab.split(' ')[0] ? '#3b82f6' : 'text.primary',
                fontWeight: activeTab === tab.split(' ')[0] ? 600 : 500,
                userSelect: 'none',
              }}
            >
              {tab}
            </Box>
          ))}
        </Box>

        {/* General Tab */}
        {activeTab === 'General' && (
          <Grid container spacing={6}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Typography sx={{ width: 150, fontWeight: 600 }}>Product Type</Typography>
                <RadioGroup row value={form.productType} onChange={e => setField('productType', e.target.value)}>
                  <FormControlLabel value="Goods" control={<Radio size="small" />} label="Goods" />
                  <FormControlLabel value="Service" control={<Radio size="small" />} label="Service" />
                </RadioGroup>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Typography sx={{ width: 150, fontWeight: 600 }}>Category *</Typography>
                <FormControl size="small" sx={{ width: 200 }}>
                  <Select
                    value={form.categoryId}
                    onChange={e => setField('categoryId', e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>Select category</MenuItem>
                    {categories.map(cat => (
                      <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Typography sx={{ width: 150, fontWeight: 600 }}>Stock Quantity</Typography>
                <TextField
                  size="small"
                  sx={{ width: 150 }}
                  type="number"
                  value={form.stockQuantity}
                  onChange={e => setField('stockQuantity', e.target.value)}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Typography sx={{ width: 150, fontWeight: 600 }}>Sales Price *</Typography>
                <TextField
                  size="small"
                  sx={{ width: 150 }}
                  type="number"
                  value={form.price}
                  onChange={e => setField('price', e.target.value)}
                  slotProps={{ input: { startAdornment: <InputAdornment position="start">₹</InputAdornment> } }}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Typography sx={{ width: 150, fontWeight: 600 }}>Deposit</Typography>
                <TextField
                  size="small"
                  sx={{ width: 150 }}
                  type="number"
                  value={form.deposit}
                  onChange={e => setField('deposit', e.target.value)}
                  slotProps={{ input: { startAdornment: <InputAdornment position="start">₹</InputAdornment> } }}
                />
              </Box>
              <Box sx={{ mb: 3 }}>
                <Typography sx={{ fontWeight: 600, mb: 1 }}>Description</Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Product description..."
                  value={form.description}
                  onChange={e => setField('description', e.target.value)}
                />
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Typography sx={{ fontWeight: 600 }}>Published</Typography>
                <Switch color="primary" checked={form.isActive} onChange={e => setField('isActive', e.target.checked)} />
              </Box>
              <Typography variant="caption" color="text.secondary">
                Only Admin should have the right to publish or unpublish a product
              </Typography>
              {form.productType === 'Service' && (
                <Box sx={{ mt: 4, p: 2, bgcolor: 'rgba(59, 130, 246, 0.05)', borderRadius: 2, borderLeft: '4px solid #3b82f6' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    If the vendor wants to add deposit or downpayment with the product then the vendor needs to create product(type Service) named deposit/downpayment and add it to the invoice.
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        )}

        {/* Attributes Tab */}
        {activeTab === 'Attributes' && (
          <Box>
            <TableContainer sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: 'action.hover' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Attributes</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Values</TableCell>
                    <TableCell sx={{ width: 80 }}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary" display="block">Name of the Attributes (Brand, color, size...)</Typography>
                      <TextField size="small" defaultValue="Color" fullWidth sx={{ mt: 1 }} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary" display="block">List of possible values (e.g. Red, Green, Blue...)</Typography>
                      <TextField size="small" defaultValue="Black, White, Silver" fullWidth sx={{ mt: 1 }} />
                    </TableCell>
                    <TableCell sx={{ verticalAlign: 'bottom' }}>
                      <Button variant="outlined" size="small" startIcon={<Settings size={14} />} sx={{ mb: 0.5 }}>Configure</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} sx={{ py: 2 }}>
                      <Button variant="text" sx={{ fontWeight: 600, textTransform: 'none' }}>Add a line</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Sales Tab */}
        {activeTab === 'Sales' && (
          <Grid container spacing={6}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 3 }}>Rental</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Typography sx={{ width: 150, fontWeight: 600 }}>Periodicity</Typography>
                <Select size="small" defaultValue="Hours" sx={{ width: 150 }}>
                  <MenuItem value="Hours">Hours</MenuItem>
                  <MenuItem value="Days">Days</MenuItem>
                  <MenuItem value="Weeks">Weeks</MenuItem>
                  <MenuItem value="Months">Months</MenuItem>
                </Select>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Typography sx={{ width: 150, fontWeight: 600 }}>Pickups</Typography>
                <TextField size="small" sx={{ width: 150 }} defaultValue="10:00 H" />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Typography sx={{ width: 150, fontWeight: 600 }}>Return</Typography>
                <TextField size="small" sx={{ width: 150 }} defaultValue="19:00 H" />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Typography sx={{ width: 150, fontWeight: 600 }}>Late Fees</Typography>
                <TextField
                  size="small"
                  sx={{ width: 100, mr: 1 }}
                  slotProps={{ input: { startAdornment: <InputAdornment position="start">₹</InputAdornment> } }}
                />
                <Typography variant="body2">per hour late</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 3 }}>Rental Deposit</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Typography sx={{ width: 150, fontWeight: 600 }}>Security Deposit</Typography>
                <TextField
                  size="small"
                  sx={{ width: 150 }}
                  type="number"
                  value={form.deposit}
                  onChange={e => setField('deposit', e.target.value)}
                  slotProps={{ input: { startAdornment: <InputAdornment position="start">₹</InputAdornment> } }}
                />
              </Box>
            </Grid>
          </Grid>
        )}

      </Paper>
    </Box>
  );
};

export default AdminProductCreate;
