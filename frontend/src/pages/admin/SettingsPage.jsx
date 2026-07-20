import React, { useState } from 'react';
import { Box, Typography, Paper, Checkbox, FormControlLabel, TextField, InputAdornment, Button, Divider, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../routes/paths';

export const SettingsPage = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    enableLateFee: true,
    lateFeeRate: 20,
    enableVariants: true,
    enablePriceList: false
  });

  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setSettings({ ...settings, [field]: value });
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto', pb: 8 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Settings</Typography>

      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden', bgcolor: 'background.paper', mb: 4 }}>
        
        {/* Pickup & Return Section */}
        <Box sx={{ p: 2, bgcolor: 'action.hover', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Pickup & Return</Typography>
        </Box>
        <Box sx={{ p: 3 }}>
          <FormControlLabel
            control={<Checkbox checked={settings.enableLateFee} onChange={handleChange('enableLateFee')} />}
            label={
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>Late Fee/Overdue Penalty</Typography>
                <Typography variant="caption" color="text.secondary">Manage your late fee or overdue charges</Typography>
              </Box>
            }
            sx={{ mb: 2, alignItems: 'flex-start' }}
          />
          {settings.enableLateFee && (
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 4, gap: 1 }}>
              <Typography color="error.main" sx={{ fontWeight: 600 }}>Late Fees $</Typography>
              <TextField 
                size="small"
                type="number"
                value={settings.lateFeeRate}
                onChange={handleChange('lateFeeRate')}
                sx={{ width: 100 }}
              />
              <Typography color="error.main" sx={{ fontWeight: 600 }}>per hour late</Typography>
            </Box>
          )}
        </Box>

        {/* Product Section */}
        <Box sx={{ p: 2, bgcolor: 'action.hover', borderTop: '1px solid', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Product</Typography>
        </Box>
        <Box sx={{ p: 3 }}>
          <Stack direction="row" spacing={8}>
            <Box>
              <FormControlLabel
                control={<Checkbox checked={settings.enableVariants} onChange={handleChange('enableVariants')} />}
                label={<Typography sx={{ fontWeight: 600 }}>Variants</Typography>}
              />
              {settings.enableVariants && (
                <Typography 
                  color="success.main" 
                  sx={{ ml: 4, cursor: 'pointer', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}
                  onClick={() => navigate(PATHS.ADMIN_ATTRIBUTES)}
                >
                  ➔ Attributes
                </Typography>
              )}
            </Box>
            
            <Box>
              <FormControlLabel
                control={<Checkbox checked={settings.enablePriceList} onChange={handleChange('enablePriceList')} />}
                label={<Typography sx={{ fontWeight: 600 }}>Price List</Typography>}
              />
              {settings.enablePriceList && (
                <Typography 
                  color="success.main" 
                  sx={{ ml: 4, cursor: 'pointer', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}
                  onClick={() => navigate(PATHS.ADMIN_PRICELISTS)}
                >
                  ➔ Pricelists
                </Typography>
              )}
            </Box>
          </Stack>
        </Box>
      </Paper>

      <Button variant="contained" size="large">Save Settings</Button>
    </Box>
  );
};

export default SettingsPage;
