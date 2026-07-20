import React, { useState } from 'react';
import { 
  Box, Typography, Button, TextField, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Select, MenuItem 
} from '@mui/material';
import { Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../routes/paths';

export const AdminAttributeCreate = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('Attribute name');
  const [displayType, setDisplayType] = useState('Radio');
  const [values, setValues] = useState([
    { id: 1, name: 'Default custom string' }
  ]);

  const handleAddValue = () => {
    setValues([...values, { id: Date.now(), name: 'New value' }]);
  };

  const handleValueChange = (id, newName) => {
    setValues(values.map(v => v.id === id ? { ...v, name: newName } : v));
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
        <Typography variant="h6" sx={{ fontWeight: 600, mr: 2 }}>Attributes / New</Typography>
        <IconButton size="small" sx={{ border: '1px solid #22c55e', color: '#22c55e', borderRadius: 1 }} onClick={() => navigate(PATHS.ADMIN_ATTRIBUTES)}>
          <Check size={18} />
        </IconButton>
        <IconButton size="small" sx={{ border: '1px solid #ef4444', color: '#ef4444', borderRadius: 1 }} onClick={() => navigate(PATHS.ADMIN_ATTRIBUTES)}>
          <X size={18} />
        </IconButton>
      </Box>

      {/* Form */}
      <Box sx={{ mb: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <TextField 
          fullWidth
          variant="standard"
          placeholder="e.g. Attribute name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ 
            input: { fontSize: '2rem', fontWeight: 600, color: 'white' },
            '& .MuiInput-underline:before': { borderBottomColor: 'rgba(255,255,255,0.2)' },
            '& .MuiInput-underline:hover:before': { borderBottomColor: '#22c55e' },
            '& .MuiInput-underline:after': { borderBottomColor: '#22c55e' }
          }}
        />

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ width: 150, fontWeight: 500, color: 'text.secondary' }}>Display Type</Typography>
          <Select 
            size="small" 
            variant="standard" 
            value={displayType}
            onChange={(e) => setDisplayType(e.target.value)}
            sx={{ 
              width: 200, 
              color: 'white',
              '& .MuiSelect-icon': { color: 'white' },
              '& .MuiInput-underline:before': { borderBottomColor: 'rgba(255,255,255,0.2)' },
            }}
          >
            <MenuItem value="Radio">Radio</MenuItem>
            <MenuItem value="Pills">Pills</MenuItem>
            <MenuItem value="Check Box">Check Box</MenuItem>
            <MenuItem value="Image">Image</MenuItem>
          </Select>
        </Box>
      </Box>

      {/* Values Section */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, borderBottom: '2px solid #22c55e', display: 'inline-block', pb: 0.5, color: 'white' }}>
          Attribute Values
        </Typography>
      </Box>

      <TableContainer sx={{ bgcolor: 'transparent' }}>
        <Table sx={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.1)', width: '50%' }}>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {values.map((row) => (
              <TableRow key={row.id}>
                <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)', py: 1 }}>
                  <TextField 
                    size="small"
                    variant="standard"
                    value={row.name}
                    onChange={(e) => handleValueChange(row.id, e.target.value)}
                    sx={{ width: '100%', input: { color: 'white' }, '& .MuiInput-underline:before': { borderBottomColor: 'transparent' } }}
                  />
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <Button 
                  onClick={handleAddValue}
                  sx={{ textTransform: 'none', color: '#c084fc', justifyContent: 'flex-start', p: 0, '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } }}
                >
                  Add a line
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

    </Box>
  );
};

export default AdminAttributeCreate;
