import React, { useState } from 'react';
import { Box, Typography, Paper, TextField, Button, Grid, Stack, RadioGroup, FormControlLabel, Radio, Avatar } from '@mui/material';

export const UserSettingsPage = () => {
  const [activeTab, setActiveTab] = useState('work');
  const [role, setRole] = useState('admin');

  return (
    <Box sx={{ width: '100%', maxWidth: 900, mx: 'auto', pb: 8 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Settings</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto', bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 999, px: 2, py: 0.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>Admin</Typography>
        </Box>
      </Box>

      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <Button variant="contained" color="secondary" sx={{ borderRadius: 2 }}>Save</Button>
        <Button variant="outlined" color="inherit" sx={{ borderRadius: 2 }}>Discard</Button>
      </Stack>

      <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', mb: 4 }}>
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ width: 120, fontWeight: 600 }}>Name</Typography>
                <TextField size="small" fullWidth defaultValue="Admin User" />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ width: 120, fontWeight: 600 }}>Email</Typography>
                <TextField size="small" fullWidth defaultValue="admin@example.com" />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ width: 120, fontWeight: 600 }}>Phone</Typography>
                <TextField size="small" fullWidth />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ width: 120, fontWeight: 600 }}>Company Name</Typography>
                <TextField size="small" fullWidth />
              </Box>
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Typography sx={{ width: 120, fontWeight: 600, pt: 1 }}>Company Logo</Typography>
                <Button variant="contained" component="label" size="small" color="secondary">
                  Upload
                  <input hidden accept="image/*" type="file" />
                </Button>
                <Avatar sx={{ ml: 2, width: 64, height: 64 }} variant="rounded">Logo</Avatar>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ width: 120, fontWeight: 600 }}>GST In</Typography>
                <TextField size="small" fullWidth />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Typography sx={{ width: 120, fontWeight: 600, pt: 1 }}>Address</Typography>
                <TextField size="small" fullWidth multiline rows={3} />
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', gap: 1, borderBottom: '1px solid', borderColor: 'divider', mb: 3 }}>
          <Button 
            variant={activeTab === 'work' ? 'contained' : 'text'} 
            onClick={() => setActiveTab('work')}
            disableElevation
            sx={{ borderRadius: '8px 8px 0 0', textTransform: 'none' }}
          >
            Work Information
          </Button>
          <Button 
            variant={activeTab === 'security' ? 'contained' : 'text'} 
            onClick={() => setActiveTab('security')}
            disableElevation
            sx={{ borderRadius: '8px 8px 0 0', textTransform: 'none' }}
          >
            Security
          </Button>
        </Box>

        {activeTab === 'work' && (
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Role:</Typography>
            <RadioGroup row value={role} onChange={(e) => setRole(e.target.value)}>
              <FormControlLabel value="admin" control={<Radio size="small" />} label="Admin" />
              <FormControlLabel value="vendor" control={<Radio size="small" />} label="Vendor" />
              <FormControlLabel value="customer" control={<Radio size="small" />} label="Customer" />
            </RadioGroup>
            
            <Paper variant="outlined" sx={{ p: 2, mt: 3, bgcolor: 'action.hover', borderLeft: '4px solid', borderColor: 'primary.main' }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Note</Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                - Settings should only be visible to admin user.
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                - For all the non-admin users this user information page should only be visible under profile section.
              </Typography>
            </Paper>
          </Box>
        )}

        {activeTab === 'security' && (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography sx={{ fontWeight: 600 }}>Change Password:</Typography>
              <Button variant="contained" color="secondary" size="small">Change Password</Button>
            </Box>
          </Box>
        )}

      </Paper>
    </Box>
  );
};

export default UserSettingsPage;
