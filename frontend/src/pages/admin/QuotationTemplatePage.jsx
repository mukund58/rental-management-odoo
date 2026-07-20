import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Grid, Divider, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, InputAdornment, IconButton } from '@mui/material';
import { Search, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const QuotationTemplatePage = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('Home Rental Furniture');
  const [activeTab, setActiveTab] = useState('Lines');

  const templates = ['Home Rental Furniture', 'Office Rental Furniture'];

  return (
    <Box sx={{ width: '100%', p: 3, maxWidth: 1200, mx: 'auto', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, alignItems: 'center' }}>
        <Button 
          variant="contained" 
          sx={{ display: 'none', bgcolor: '#c084fc', '&:hover': { bgcolor: '#a855f7' }, borderRadius: 2 }}
          onClick={() => { setSelectedTemplate(''); toast.success('Created new template draft.'); }}
        >
          New
        </Button>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>Quotation Template</Typography>
        
        {/* If selected */}
        {selectedTemplate && (
          <Box sx={{ display: 'flex', flexDirection: 'column', ml: 4 }}>
            <Typography variant="body2" color="text.secondary">Home Rental Furniture</Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
              <Box sx={{ width: 16, height: 16, bgcolor: '#22c55e', border: '2px solid white', outline: '1px solid #22c55e', borderRadius: '2px' }} />
              <Box sx={{ width: 16, height: 16, bgcolor: '#ef4444', border: '2px solid white', outline: '1px solid #ef4444', borderRadius: '2px', position: 'relative' }}>
                <Box sx={{ position: 'absolute', top: 1, left: 1, width: 10, height: 10, borderBottom: '2px solid white', borderRight: '2px solid white', transform: 'rotate(45deg)' }} />
              </Box>
            </Box>
          </Box>
        )}
        
        <TextField
          size="small"
          placeholder="Search..."
          InputProps={{
            startAdornment: <InputAdornment position="start"><Search size={16} /></InputAdornment>,
            sx: { bgcolor: 'background.paper' }
          }}
          sx={{ ml: 'auto', width: 250 }}
        />
      </Box>

      {/* Main Grid */}
      <Grid container spacing={3} sx={{ flexGrow: 1 }}>
        {/* Left List */}
        <Grid item xs={12} md={3}>
          <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden', height: '100%' }}>
            <Box sx={{ bgcolor: 'action.hover', p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography sx={{ fontWeight: 600 }}>Template</Typography>
            </Box>
            {templates.map(tmpl => (
              <Box 
                key={tmpl}
                onClick={() => setSelectedTemplate(tmpl)}
                sx={{ 
                  p: 2, 
                  cursor: 'pointer', 
                  bgcolor: selectedTemplate === tmpl ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
                  borderLeft: selectedTemplate === tmpl ? '3px solid #3b82f6' : '3px solid transparent',
                  '&:hover': { bgcolor: 'action.hover' }
                }}
              >
                <Typography sx={{ fontWeight: selectedTemplate === tmpl ? 600 : 400 }}>{tmpl}</Typography>
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Right Details */}
        <Grid item xs={12} md={9}>
          <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, height: '100%', p: 4 }}>
            
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography sx={{ fontWeight: 600, mb: 1 }}>Template</Typography>
                <TextField 
                  size="small" 
                  fullWidth 
                  value={selectedTemplate} 
                  sx={{ mb: 2, '& .MuiOutlinedInput-notchedOutline': { borderBottom: '2px solid #22c55e', borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0 } }} 
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography sx={{ fontWeight: 600, mb: 2, borderBottom: '1px solid', borderColor: 'divider', pb: 1 }}>Confirmation</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography sx={{ width: 150 }}>Quotation Validity</Typography>
                  <TextField size="small" sx={{ width: 60, mx: 1 }} />
                  <Typography>Days</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ width: 150 }}>Payment Terms</Typography>
                  <TextField size="small" sx={{ width: 60, mx: 1 }} />
                  <Typography>%</Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Tabs */}
            <Box sx={{ mt: 4, display: 'flex', borderBottom: '1px solid', borderColor: 'divider' }}>
              <Box 
                onClick={() => setActiveTab('Lines')}
                sx={{ 
                  px: 3, py: 1, 
                  cursor: 'pointer',
                  bgcolor: activeTab === 'Lines' ? '#1e40af' : 'transparent',
                  color: activeTab === 'Lines' ? 'white' : 'text.primary',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderBottom: 'none'
                }}
              >
                Lines
              </Box>
              <Box 
                onClick={() => setActiveTab('Builder')}
                sx={{ 
                  px: 3, py: 1, 
                  cursor: 'pointer',
                  bgcolor: activeTab === 'Builder' ? '#1e40af' : 'transparent',
                  color: activeTab === 'Builder' ? 'white' : 'text.primary',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderBottom: 'none',
                  borderLeft: 'none'
                }}
              >
                Quote Builder
              </Box>
            </Box>

            {/* Table */}
            <TableContainer sx={{ border: '1px solid', borderColor: 'divider', borderTop: 'none' }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: 'action.hover' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Quantity</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Unit</TableCell>
                    <TableCell sx={{ width: 50 }}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ height: 100 }}></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>
                      <IconButton sx={{ display: 'none' }} size="small" onClick={() => toast.success('Item deleted')}><Trash2 size={16} /></IconButton>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default QuotationTemplatePage;
