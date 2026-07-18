import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, IconButton, TextField, InputAdornment, Paper, ToggleButtonGroup, ToggleButton, CircularProgress } from '@mui/material';
import { Search, List as ListIcon, LayoutGrid, Plus } from 'lucide-react';
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Rental Order</Typography>
          <Button variant="contained" color="secondary" startIcon={<Plus size={16} />} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}>
            New
          </Button>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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

      {/* Date Filters - Placeholder as per wireframe */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
        <Button variant="outlined" size="small" sx={{ borderRadius: 999, borderColor: '#f59e0b', color: '#f59e0b' }}>Today</Button>
        <Button variant="outlined" size="small" sx={{ borderRadius: 999, borderColor: '#8b5cf6', color: '#8b5cf6' }}>Pickup</Button>
        <Button variant="outlined" size="small" sx={{ borderRadius: 999, borderColor: '#ec4899', color: '#ec4899' }}>Return</Button>
        <Button variant="outlined" size="small" sx={{ borderRadius: 999, borderColor: '#10b981', color: '#10b981' }}>Late</Button>
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
