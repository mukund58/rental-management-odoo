import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Checkbox, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, InputAdornment, Paper } from '@mui/material';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../routes/paths';

const mockAttributes = [
  { id: 1, name: 'Brand', displayType: 'Radio' },
  { id: 2, name: 'Color', displayType: 'Pills' },
];

export const AttributesPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState([]);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(mockAttributes.map(a => a.id));
      return;
    }
    setSelected([]);
  };

  const handleSelect = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const filteredAttributes = mockAttributes.filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Box sx={{ p: 4, maxWidth: 1000, mx: 'auto', width: '100%' }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Attributes</Typography>
      
      <Box sx={{ display: 'flex', gap: 4, mb: 4, alignItems: 'center' }}>
        <Button 
          variant="contained" 
          onClick={() => navigate(PATHS.ADMIN_ATTRIBUTE_CREATE)}
          sx={{ 
            bgcolor: '#c084fc', // pinkish-purple from wireframe
            '&:hover': { bgcolor: '#a855f7' },
            color: 'white',
            fontWeight: 600,
            px: 4
          }}
        >
          New
        </Button>
        <TextField
          size="small"
          placeholder="Search attributes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={18} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', bgcolor: 'transparent' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selected.length > 0 && selected.length < mockAttributes.length}
                  checked={mockAttributes.length > 0 && selected.length === mockAttributes.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '1rem' }}>Attributes</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '1rem' }} align="right">Display Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAttributes.map((row) => {
              const isSelected = selected.indexOf(row.id) !== -1;
              return (
                <TableRow 
                  key={row.id} 
                  hover 
                  selected={isSelected}
                  onClick={() => navigate(PATHS.ADMIN_ATTRIBUTE_CREATE)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                    <Checkbox checked={isSelected} onChange={() => handleSelect(row.id)} />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{row.name}</TableCell>
                  <TableCell align="right">{row.displayType}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AttributesPage;
