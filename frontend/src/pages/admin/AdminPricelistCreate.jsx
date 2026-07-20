import React, { useState } from 'react';
import { 
  Box, Typography, Button, TextField, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, 
  DialogContent, DialogActions, RadioGroup, FormControlLabel, Radio, 
  Checkbox, InputAdornment
} from '@mui/material';
import { Check, X, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../routes/paths';

export const AdminPricelistCreate = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('My Price list');
  const [rules, setRules] = useState([
    { id: 1, applyOn: 'All Products', minQty: '0.00', validity: '2026-01-01 to 2026-12-31', selectable: false, unitPrice: '10% Discount' }
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  
  // Modal State
  const [ruleProducts, setRuleProducts] = useState('');
  const [priceType, setPriceType] = useState('discount');
  const [priceValue, setPriceValue] = useState('0.00');
  const [minQty, setMinQty] = useState('0.00');
  const [validity, setValidity] = useState('');
  const [selectable, setSelectable] = useState(false);

  const handleSaveRule = () => {
    const newRule = {
      id: Date.now(),
      applyOn: ruleProducts || 'All Products',
      minQty: minQty,
      validity: validity || 'No limit',
      selectable: selectable,
      unitPrice: priceType === 'discount' ? `${priceValue}% Discount` : `$${priceValue}`
    };
    setRules([...rules, newRule]);
    setModalOpen(false);
    // Reset modal
    setRuleProducts('');
    setPriceType('discount');
    setPriceValue('0.00');
    setMinQty('0.00');
    setValidity('');
    setSelectable(false);
  };

  return (
    <Box sx={{ width: '100%', p: 3, maxWidth: 1400, mx: 'auto', minHeight: '100vh', color: 'white' }}>
      
      {/* Top Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <Button 
          variant="contained" 
          sx={{ bgcolor: '#c084fc', '&:hover': { bgcolor: '#a855f7' }, borderRadius: 2 }}
        >
          New
        </Button>
        <Typography variant="h6" sx={{ fontWeight: 600, mr: 2 }}>Price List / New</Typography>
        <IconButton size="small" sx={{ border: '1px solid #22c55e', color: '#22c55e', borderRadius: 1 }} onClick={() => navigate(PATHS.ADMIN_PRICELISTS)}>
          <Check size={18} />
        </IconButton>
        <IconButton size="small" sx={{ border: '1px solid #ef4444', color: '#ef4444', borderRadius: 1 }} onClick={() => navigate(PATHS.ADMIN_PRICELISTS)}>
          <X size={18} />
        </IconButton>
      </Box>

      {/* Form */}
      <Box sx={{ mb: 6 }}>
        <TextField 
          fullWidth
          variant="standard"
          placeholder="e.g. My Price list"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ 
            input: { fontSize: '2rem', fontWeight: 600, color: 'white' },
            '& .MuiInput-underline:before': { borderBottomColor: 'rgba(255,255,255,0.2)' },
            '& .MuiInput-underline:hover:before': { borderBottomColor: '#22c55e' },
            '& .MuiInput-underline:after': { borderBottomColor: '#22c55e' }
          }}
        />
      </Box>

      {/* Rules Section */}
      <Box sx={{ mb: 2 }}>
        <Button variant="outlined" sx={{ borderRadius: 4, textTransform: 'none', borderColor: 'rgba(255,255,255,0.3)', color: 'white', px: 3 }}>
          Rule
        </Button>
      </Box>

      <TableContainer sx={{ bgcolor: 'transparent' }}>
        <Table sx={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Apply On</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Min. Qty</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Validity</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Selectable</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Unit Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rules.map((row) => (
              <TableRow key={row.id}>
                <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.applyOn}</TableCell>
                <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.minQty}</TableCell>
                <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.validity}</TableCell>
                <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <Checkbox checked={row.selectable} readOnly size="small" sx={{ color: 'white', p: 0 }} />
                </TableCell>
                <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.unitPrice}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={5} sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <Button 
                  onClick={() => setModalOpen(true)}
                  sx={{ textTransform: 'none', color: '#c084fc', justifyContent: 'flex-start', p: 0, '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } }}
                >
                  Add a line
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create Pricelist Rule Modal */}
      <Dialog 
        open={modalOpen} 
        onClose={() => setModalOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: '#1e293b', // dark tailwind slate
            color: 'white',
            minWidth: 500,
            border: '1px solid rgba(255,255,255,0.1)'
          }
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)', fontWeight: 600 }}>
          Create Pricelist Rules
        </DialogTitle>
        <DialogContent sx={{ py: 3, display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ width: 120 }}>Products</Typography>
            <TextField 
              size="small" 
              variant="standard" 
              value={ruleProducts}
              onChange={(e) => setRuleProducts(e.target.value)}
              sx={{ flexGrow: 1, input: { color: 'white' }, '& .MuiInput-underline:before': { borderBottomColor: 'rgba(255,255,255,0.3)' } }} 
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ width: 120 }}>Price Type</Typography>
            <RadioGroup row value={priceType} onChange={(e) => setPriceType(e.target.value)}>
              <FormControlLabel value="discount" control={<Radio sx={{ color: '#c084fc', '&.Mui-checked': { color: '#c084fc' } }} />} label="Discount" />
              <FormControlLabel value="fixed" control={<Radio sx={{ color: '#c084fc', '&.Mui-checked': { color: '#c084fc' } }} />} label="Fixed Price" />
            </RadioGroup>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ width: 120 }}>
              {priceType === 'discount' ? 'Discount' : 'Fixed Price'}
            </Typography>
            <TextField 
              size="small" 
              variant="standard" 
              value={priceValue}
              onChange={(e) => setPriceValue(e.target.value)}
              sx={{ width: 100, input: { color: 'white' }, '& .MuiInput-underline:before': { borderBottomColor: 'rgba(255,255,255,0.3)' } }} 
            />
            {priceType === 'discount' && <Typography sx={{ ml: 2, color: 'text.secondary', fontSize: '0.9rem' }}>% on sales price</Typography>}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ width: 120 }}>Min Qty</Typography>
            <TextField 
              size="small" 
              variant="standard" 
              value={minQty}
              onChange={(e) => setMinQty(e.target.value)}
              sx={{ width: 100, input: { color: 'white' }, '& .MuiInput-underline:before': { borderBottomColor: 'rgba(255,255,255,0.3)' } }} 
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ width: 120 }}>Validity</Typography>
            <TextField 
              size="small" 
              variant="standard"
              value={validity}
              onChange={(e) => setValidity(e.target.value)}
              sx={{ flexGrow: 1, input: { color: 'white' }, '& .MuiInput-underline:before': { borderBottomColor: 'rgba(255,255,255,0.3)' } }} 
            />
            <Typography sx={{ ml: 2, color: 'text.secondary', fontSize: '0.8rem' }}>Opens calendar to select the date or date range</Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ width: 120 }}>Selectable</Typography>
            <Checkbox 
              checked={selectable} 
              onChange={(e) => setSelectable(e.target.checked)}
              sx={{ color: 'rgba(255,255,255,0.3)', '&.Mui-checked': { color: '#c084fc' } }} 
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <Button onClick={() => setModalOpen(false)} sx={{ color: 'white' }}>Cancel</Button>
          <Button onClick={handleSaveRule} variant="contained" sx={{ bgcolor: '#c084fc', '&:hover': { bgcolor: '#a855f7' } }}>
            Save & Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminPricelistCreate;
