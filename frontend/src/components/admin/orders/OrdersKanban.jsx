import React from 'react';
import { Box, Grid, Card, CardContent, Typography, Chip, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

const getStatusColor = (status) => {
  switch (status) {
    case 1:
    case 'Draft':
      return { bg: '#e0e7ff', color: '#4f46e5' };
    case 2:
    case 'QuotationSent':
      return { bg: '#dbeafe', color: '#2563eb' };
    case 3:
    case 'Reserved':
      return { bg: '#dcfce7', color: '#16a34a' };
    case 4:
    case 'PickedUp':
      return { bg: '#fef3c7', color: '#d97706' };
    case 5:
    case 'Returned':
      return { bg: '#f3f4f6', color: '#4b5563' };
    case 6:
    case 'Cancelled':
      return { bg: '#fee2e2', color: '#dc2626' };
    case 7:
    case 'Late':
      return { bg: '#ffedd5', color: '#ea580c' };
    default:
      return { bg: '#f1f5f9', color: '#64748b' };
  }
};

const OrdersKanban = ({ orders }) => {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 2, bgcolor: '#f8fafc', minHeight: '600px' }}>
      <Grid container spacing={2}>
        {orders.map((order) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={order.id}>
            <Card 
              sx={{ 
                borderRadius: 2, 
                border: '1px solid', 
                borderColor: 'divider', 
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                }
              }}
              onClick={() => navigate(`/dashboard/orders/${order.id}`)}
            >
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>{order.customer}</Typography>
                    <Typography variant="body2" color="text.secondary">{order.orderNumber}</Typography>
                  </Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {money.format(order.totalAmount)}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    {order.pickupDate ? new Date(order.pickupDate).toLocaleDateString() : '-'} to {order.returnDate ? new Date(order.returnDate).toLocaleDateString() : '-'}
                  </Typography>
                  <Chip 
                    label={order.status === 1 ? 'Quotation' : order.status === 2 ? 'Quotation Sent' : order.status} 
                    size="small"
                    sx={{ 
                      bgcolor: getStatusColor(order.status).bg, 
                      color: getStatusColor(order.status).color,
                      fontWeight: 600,
                      borderRadius: 1,
                      fontSize: '0.7rem',
                      height: 24
                    }} 
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default OrdersKanban;
