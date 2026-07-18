import React from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, FormGroup, FormControlLabel, Checkbox, Slider, MenuItem, TextField } from '@mui/material';
import { ChevronDown } from 'lucide-react';

const ALL_BRANDS = ['IKEA', 'Dell', 'Sony', 'Epson', 'Featherlite', 'BenQ', 'Sleepwell', 'ASUS'];

const ALL_COLORS = [
  { hex: '#000000', name: 'Black' },
  { hex: '#ffffff', name: 'White' },
  { hex: '#94a3b8', name: 'Silver' },
  { hex: '#475569', name: 'Charcoal' },
  { hex: '#3b82f6', name: 'Blue' },
  { hex: '#ef4444', name: 'Red' },
  { hex: '#10b981', name: 'Green' },
  { hex: '#b45309', name: 'Oak' },
];

const ALL_DURATIONS = ['All Durations', '1 Month', '6 Month', '1 Year', '2 Years', '3 Years'];

export const SidebarFilters = ({
  selectedBrands,
  onBrandChange,
  selectedColor,
  onColorChange,
  selectedDuration,
  onDurationChange,
  priceRange,
  onPriceChange,
}) => {
  const handleBrandToggle = (brand) => {
    if (selectedBrands.includes(brand)) {
      onBrandChange(selectedBrands.filter((b) => b !== brand));
    } else {
      onBrandChange([...selectedBrands, brand]);
    }
  };

  const handlePriceSliderChange = (event, newValue) => {
    onPriceChange(newValue);
  };

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
      {/* Title */}
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, px: 1 }}>
        Filters
      </Typography>

      {/* Brand Accordion */}
      <Accordion defaultExpanded elevation={0} disableGutters sx={{ '&:before': { display: 'none' }, borderBottom: '1px solid', borderColor: 'divider' }}>
        <AccordionSummary expandIcon={<ChevronDown size={18} />} sx={{ px: 1 }}>
          <Typography sx={{ fontWeight: 600 }}>Brand</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 1, pb: 2 }}>
          <FormGroup>
            {ALL_BRANDS.map((brand) => (
              <FormControlLabel
                key={brand}
                control={
                  <Checkbox
                    checked={selectedBrands.includes(brand)}
                    onChange={() => handleBrandToggle(brand)}
                    size="small"
                  />
                }
                label={<Typography variant="body2">{brand}</Typography>}
                sx={{ mb: 0.5 }}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      {/* Color Accordion */}
      <Accordion defaultExpanded elevation={0} disableGutters sx={{ '&:before': { display: 'none' }, borderBottom: '1px solid', borderColor: 'divider' }}>
        <AccordionSummary expandIcon={<ChevronDown size={18} />} sx={{ px: 1 }}>
          <Typography sx={{ fontWeight: 600 }}>Color</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 1, pb: 2 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
            {ALL_COLORS.map((color) => {
              const isSelected = selectedColor === color.hex;
              return (
                <Box
                  key={color.hex}
                  onClick={() => onColorChange(isSelected ? '' : color.hex)}
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    backgroundColor: color.hex,
                    cursor: 'pointer',
                    border: color.hex === '#ffffff' ? '1px solid #cbd5e1' : 'none',
                    outline: isSelected ? '2px solid' : 'none',
                    outlineColor: 'primary.main',
                    outlineOffset: 2,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.15)',
                    },
                  }}
                  title={color.name}
                />
              );
            })}
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Duration Accordion */}
      <Accordion defaultExpanded elevation={0} disableGutters sx={{ '&:before': { display: 'none' }, borderBottom: '1px solid', borderColor: 'divider' }}>
        <AccordionSummary expandIcon={<ChevronDown size={18} />} sx={{ px: 1 }}>
          <Typography sx={{ fontWeight: 600 }}>Duration</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 1, pb: 2 }}>
          <TextField
            select
            fullWidth
            size="small"
            value={selectedDuration}
            onChange={(e) => onDurationChange(e.target.value)}
            slotProps={{
              select: {
                displayEmpty: false,
              }
            }}
          >
            {ALL_DURATIONS.map((dur) => (
              <MenuItem key={dur} value={dur}>
                {dur}
              </MenuItem>
            ))}
          </TextField>
        </AccordionDetails>
      </Accordion>

      {/* Price Accordion */}
      <Accordion defaultExpanded elevation={0} disableGutters sx={{ '&:before': { display: 'none' }, borderBottom: '1px solid', borderColor: 'divider' }}>
        <AccordionSummary expandIcon={<ChevronDown size={18} />} sx={{ px: 1 }}>
          <Typography sx={{ fontWeight: 600 }}>Price Range</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 1.5, pb: 2 }}>
          <Slider
            value={priceRange}
            onChange={handlePriceSliderChange}
            valueLabelDisplay="auto"
            min={0}
            max={250000}
            step={5000}
            sx={{ mt: 1 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              ₹{priceRange[0].toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ₹{priceRange[1].toLocaleString()}
            </Typography>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default SidebarFilters;
