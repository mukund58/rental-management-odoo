import React from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../routes/paths';

export const PricelistsPage = () => {
  const navigate = useNavigate();

  // Mock data for the table
  const pricelists = [
    { id: 1, name: 'My Price list' },
  ];

  return (
    <Box sx={{ width: '100%', p: 3, maxWidth: 1400, mx: 'auto', minHeight: '100vh' }}>
      {/* Top Header */}
      <Box sx={{ display: 'flex', alignitems: 'center', gap: 2, mb: 4 }}>
        <Button
          variant="contained"
          sx={{ bgcolor: '#c084fc', '&:hover': { bgcolor: '#a855f7' }, borderRadius: 2 }}
          onClick={() => navigate(PATHS.ADMIN_PRICELIST_CREATE)}
        >
          New
        </Button>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>Price List</Typography>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, fontSize: '1rem', py: 2 }}>Pricelists</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pricelists.map((row) => (
              <TableRow
                key={row.id}
                hover
                onClick={() => navigate(PATHS.ADMIN_PRICELIST_CREATE)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell sx={{ fontWeight: 500 }}>{row.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PricelistsPage;
