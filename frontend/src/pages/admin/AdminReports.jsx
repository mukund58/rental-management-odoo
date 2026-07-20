import React, { useState } from 'react';
import { Box, Typography, Button, IconButton, TextField, Popover, Menu, MenuItem, Select, FormControl, InputLabel, ToggleButton, ToggleButtonGroup, Paper } from '@mui/material';
import { Settings, BarChart2, PieChart, LineChart, Printer, Download, Upload } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 550 },
  { name: 'Apr', value: 450 },
  { name: 'May', value: 470 },
];

export const AdminReports = () => {
  const [chartType, setChartType] = useState('bar');
  const [settingsAnchor, setSettingsAnchor] = useState(null);
  const [criteria, setCriteria] = useState('Analysis');

  const handleChartChange = (event, newType) => {
    if (newType !== null) {
      setChartType(newType);
    }
  };

  return (
    <Box sx={{ p: 4, width: '100%', maxWidth: 1200, mx: 'auto', bgcolor: '#0f172a', color: 'white', minHeight: '100vh', borderRadius: { xs: 0, md: 4 } }}>
      
      {/* Header Toolbar */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4, borderBottom: '1px solid #334155', pb: 3, flexWrap: 'wrap' }}>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>Reports</Typography>
          <IconButton 
            sx={{ bgcolor: 'white', color: 'black', '&:hover': { bgcolor: '#e2e8f0' }, borderRadius: 1 }}
            onClick={(e) => setSettingsAnchor(e.currentTarget)}
          >
            <Settings size={20} />
          </IconButton>
        </Box>

        <Menu
          anchorEl={settingsAnchor}
          open={Boolean(settingsAnchor)}
          onClose={() => setSettingsAnchor(null)}
          PaperProps={{ sx: { bgcolor: '#1e293b', color: 'white', minWidth: 150, border: '1px solid #334155' } }}
        >
          <MenuItem onClick={() => setSettingsAnchor(null)} sx={{ gap: 2 }}>
            <Printer size={16} /> Print <Typography variant="caption" color="gray" sx={{ ml: 'auto' }}>PDF</Typography>
          </MenuItem>
          <MenuItem onClick={() => setSettingsAnchor(null)} sx={{ gap: 2 }}>
            <Upload size={16} /> Import <Typography variant="caption" color="gray" sx={{ ml: 'auto' }}>Excel & csv</Typography>
          </MenuItem>
          <MenuItem onClick={() => setSettingsAnchor(null)} sx={{ gap: 2 }}>
            <Download size={16} /> Export
          </MenuItem>
        </Menu>

        <Select
          value={criteria}
          onChange={(e) => setCriteria(e.target.value)}
          size="small"
          sx={{ 
            bgcolor: '#a855f7', 
            color: 'white', 
            borderRadius: 8,
            px: 2,
            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
            '& .MuiSelect-icon': { color: 'white' },
            fontWeight: 600
          }}
        >
          <MenuItem value="Analysis">Criteria for Analysis</MenuItem>
          <MenuItem value="Revenue">Revenue</MenuItem>
          <MenuItem value="Orders">Orders</MenuItem>
        </Select>

        <TextField
          placeholder="Insert a sheet"
          size="small"
          sx={{ 
            bgcolor: '#1e293b',
            borderRadius: 8,
            input: { color: 'white', px: 3 },
            '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
          }}
        />

        <Box sx={{ ml: 'auto' }}>
          <ToggleButtonGroup
            value={chartType}
            exclusive
            onChange={handleChartChange}
            size="small"
            sx={{ bgcolor: '#1e293b', p: 0.5, borderRadius: 2 }}
          >
            <ToggleButton value="bar" sx={{ color: 'white', border: 'none', '&.Mui-selected': { bgcolor: 'white', color: 'black' } }}>
              <BarChart2 size={18} />
            </ToggleButton>
            <ToggleButton value="pie" sx={{ color: 'white', border: 'none', '&.Mui-selected': { bgcolor: 'white', color: 'black' } }}>
              <PieChart size={18} />
            </ToggleButton>
            <ToggleButton value="line" sx={{ color: 'white', border: 'none', '&.Mui-selected': { bgcolor: 'white', color: 'black' } }}>
              <LineChart size={18} />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

      </Box>

      {/* Chart Area */}
      <Box sx={{ height: 400, width: '100%', mt: 6 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} axisLine={{ stroke: '#fff', strokeWidth: 2 }} tickLine={{ stroke: '#fff', strokeWidth: 2 }} />
            <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} axisLine={{ stroke: '#fff', strokeWidth: 2 }} tickLine={{ stroke: '#fff', strokeWidth: 2 }} />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: 8, color: 'white' }} />
            <Bar dataKey="value" fill="#1d4ed8" radius={[10, 10, 10, 10]} barSize={50} />
          </BarChart>
        </ResponsiveContainer>
      </Box>

    </Box>
  );
};

export default AdminReports;
