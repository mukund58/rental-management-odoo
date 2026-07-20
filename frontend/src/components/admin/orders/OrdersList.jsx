import React from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton, Typography } from '@mui/material';
import { MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

const getStatusColor = (status) => {
  switch (status) {
    case 1:
    case 'Reserved':
      return { bg: '#dcfce7', color: '#16a34a' };
    case 2:
    case 'PickedUp':
      return { bg: '#fef3c7', color: '#d97706' };
    case 3:
    case 'Returned':
      return { bg: '#f3f4f6', color: '#4b5563' };
    case 4:
    case 'Cancelled':
      return { bg: '#fee2e2', color: '#dc2626' };
    case 5:
    case 'Late':
      return { bg: '#ffedd5', color: '#ea580c' };
    default:
      return { bg: '#f1f5f9', color: '#64748b' };
  }
};

const OrdersList = ({ orders }) => {
  const navigate = useNavigate();

  return (
    <TableContainer>
      <Table sx={{ minWidth: 650 }} aria-label="orders table">
        <TableHead sx={{ bgcolor: 'action.hover' }}>
          <TableRow>
            <TableCell padding="checkbox"></TableCell>
            <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Order Reference</TableCell>
            <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Customer</TableCell>
            <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Pickup Date</TableCell>
            <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Return Date</TableCell>
            <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Total</TableCell>
            <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Payment Status</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((row) => (
            <TableRow
              key={row.id}
              hover
              onClick={() => navigate(`/dashboard/orders/${row.id}`)}
              sx={{ cursor: 'pointer', '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell padding="checkbox">
                {/* Checkbox placeholder */}
              </TableCell>
              <TableCell component="th" scope="row" sx={{ fontWeight: 600 }}>
                {row.orderNumber}
              </TableCell>
              <TableCell>{row.customer}</TableCell>
              <TableCell>
                <Chip 
                  label={row.status === 1 ? 'Reserved' : row.status === 2 ? 'PickedUp' : row.status === 3 ? 'Returned' : row.status === 4 ? 'Cancelled' : row.status === 5 ? 'Late' : row.status} 
                  size="small"
                  sx={{ 
                    bgcolor: getStatusColor(row.status).bg, 
                    color: getStatusColor(row.status).color,
                    fontWeight: 600,
                    borderRadius: 1
                  }} 
                />
              </TableCell>
              <TableCell>{row.pickupDate ? new Date(row.pickupDate).toLocaleDateString() : '-'}</TableCell>
              <TableCell>{row.returnDate ? new Date(row.returnDate).toLocaleDateString() : '-'}</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>{money.format(row.totalAmount)}</TableCell>
              <TableCell>
                {/* Placeholder for payment status as per wireframe */}
                <Chip label="Invoiced" size="small" sx={{ bgcolor: '#dbeafe', color: '#2563eb', fontWeight: 600, borderRadius: 1 }} />
              </TableCell>
              <TableCell align="right">
                <IconButton size="small" onClick={(e) => e.stopPropagation()}>
                  <MoreVertical size={18} />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrdersList;
