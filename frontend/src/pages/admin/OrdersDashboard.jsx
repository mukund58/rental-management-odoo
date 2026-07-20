import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, IconButton, TextField, InputAdornment, Paper, ToggleButtonGroup, ToggleButton, CircularProgress, Select, MenuItem } from '@mui/material';
import { Search, List as ListIcon, LayoutGrid, Plus, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getOrders } from '../../api/checkoutApi';
import OrdersList from '../../components/admin/orders/OrdersList';
import OrdersKanban from '../../components/admin/orders/OrdersKanban';

export const OrdersDashboard = () => {
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'kanban'
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getOrders();
      setOrders(data || []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setViewMode(newView);
    }
  };

  const filteredOrders = orders.filter(order =>
    order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customer?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignitems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignitems: 'center', gap: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Rental Order</Typography>
          <IconButton size="small" sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}><Settings size={18} /></IconButton>
          <Button
            variant="contained"
            sx={{ bgcolor: '#c084fc', '&:hover': { bgcolor: '#a855f7' }, borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3 }}
            onClick={() => navigate('/dashboard/orders/new')}
          >
            New
          </Button>
        </Box>
        <Box sx={{ display: 'flex', alignitems: 'center', gap: 2 }}>
          <TextField
            size="small"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} />
                </InputAdornment>
              ),
              sx: { borderRadius: 999, bgcolor: 'background.paper', width: 250 }
            }}
          />
          <Box sx={{ display: 'flex', alignitems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary', mr: 1 }}>View Switcher</Typography>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={handleViewChange}
              size="small"
              sx={{ bgcolor: 'background.paper', borderRadius: 2, '& .MuiToggleButton-root': { border: 'none' } }}
            >
              <ToggleButton value="list" sx={{ borderRadius: 2 }}>
                <ListIcon size={18} />
              </ToggleButton>
              <ToggleButton value="kanban" sx={{ borderRadius: 2 }}>
                <LayoutGrid size={18} />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>
      </Box>

      {/* Stats and Filters Row */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignitems: 'center', mb: 3 }}>

        {/* Left Pills */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" sx={{ borderRadius: 2, borderColor: '#d97706', color: '#d97706', flexDirection: 'column', py: 0.5, px: 2, minWidth: 80, '&:hover': { bgcolor: 'rgba(217, 119, 6, 0.1)' } }}>
            <Typography variant="caption" sx={{ fontWeight: 800, lineHeight: 1 }}>2</Typography>
            <Typography variant="caption" sx={{ fontWeight: 600, textTransform: 'none' }}>Today</Typography>
          </Button>
          <Button variant="contained" sx={{ borderRadius: 2, bgcolor: '#8b5cf6', color: 'white', flexDirection: 'column', py: 0.5, px: 2, minWidth: 80, '&:hover': { bgcolor: '#7c3aed' } }}>
            <Typography variant="caption" sx={{ fontWeight: 800, lineHeight: 1 }}>3</Typography>
            <Typography variant="caption" sx={{ fontWeight: 600, textTransform: 'none' }}>Pickup</Typography>
          </Button>
          <Button variant="contained" sx={{ borderRadius: 2, bgcolor: '#a855f7', color: 'white', flexDirection: 'column', py: 0.5, px: 2, minWidth: 80, '&:hover': { bgcolor: '#9333ea' } }}>
            <Typography variant="caption" sx={{ fontWeight: 800, lineHeight: 1 }}>3</Typography>
            <Typography variant="caption" sx={{ fontWeight: 600, textTransform: 'none' }}>Return</Typography>
          </Button>
          <Button variant="contained" sx={{ borderRadius: 2, bgcolor: '#be185d', color: 'white', flexDirection: 'column', py: 0.5, px: 2, minWidth: 80, '&:hover': { bgcolor: '#9f1239' } }}>
            <Typography variant="caption" sx={{ fontWeight: 800, lineHeight: 1 }}>1</Typography>
            <Typography variant="caption" sx={{ fontWeight: 600, textTransform: 'none' }}>Late</Typography>
          </Button>
        </Box>

        {/* Right Stats */}
        <Box sx={{ display: 'flex', alignitems: 'center', gap: 3 }}>
          <Box sx={{ display: 'flex', alignitems: 'center', gap: 1 }}>
            <Select
              size="small"
              defaultValue="7days"
              sx={{ borderRadius: 2, '& .MuiOutlinedInput-notchedOutline': { border: '1px solid', borderColor: 'divider' } }}
            >
              <MenuItem value="7days">Last 7 Days</MenuItem>
              <MenuItem value="30days">Last 30 Days</MenuItem>
            </Select>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', lineHeight: 1 }}>Sales</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>$1945</Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', lineHeight: 1 }}>Late Fees</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>$235</Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', lineHeight: 1 }}>Deposit</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>$710</Typography>
          </Box>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden', bgcolor: 'background.paper' }}>
          {viewMode === 'list' ? (
            <OrdersList orders={filteredOrders} />
          ) : (
            <OrdersKanban orders={filteredOrders} />
          )}
        </Paper>
      )}
    </Box>
  );
};

export default OrdersDashboard;
