import React from 'react';
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Slider,
  MenuItem,
  TextField,
  Divider
} from '@mui/material';
import filtersData from '../../data/filters';

/**
 * RentX Sidebar Filters component (260px wide layout)
 * @param {Object} props
 * @param {Array<string>} props.selectedBrands - Selected brand list
 * @param {Function} props.onBrandChange - Brand toggle event callback
 * @param {string} props.selectedColor - Currently selected color name
 * @param {Function} props.onColorChange - Color click event callback
 * @param {string} props.selectedDuration - Current duration value
 * @param {Function} props.onDurationChange - Duration change event callback
 * @param {Array<number>} props.priceRange - Current price range values: [min, max]
 * @param {Function} props.onPriceChange - Price range slider event callback
 */
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
    <Box sx={{ width: '100%', maxWidth: 280, display: 'flex', flexDirection: 'column', gap: 2.5, mx: 'auto' }}>
      {/* Title */}
      <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>
        Filters
      </Typography>

      <Divider />

      {/* Brand Section */}
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
          Brand
        </Typography>
        <FormGroup>
          {filtersData.brands.map((brand) => (
            <FormControlLabel
              key={brand}
              control={
                <Checkbox
                  checked={selectedBrands.includes(brand)}
                  onChange={() => handleBrandToggle(brand)}
                  size="small"
                  sx={{
                    color: 'divider',
                    '&.Mui-checked': {
                      color: 'primary.main',
                    },
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                  {brand}
                </Typography>
              }
              sx={{ mb: 0.25 }}
            />
          ))}
        </FormGroup>
      </Box>

      <Divider />

      {/* Color Section */}
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
          Color
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
          {filtersData.colors.map((color) => {
            const isSelected = selectedColor === color.name;
            return (
              <Box
                key={color.name}
                onClick={() => onColorChange(isSelected ? '' : color.name)}
                sx={{
                  width: 26,
                  height: 26,
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
      </Box>

      <Divider />

      {/* Rental Duration Section */}
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
          Rental Duration
        </Typography>
        <TextField
          select
          fullWidth
          size="small"
          value={selectedDuration}
          onChange={(e) => onDurationChange(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              fontWeight: 500,
              fontSize: '0.875rem',
            },
          }}
        >
          {filtersData.durations.map((dur) => (
            <MenuItem key={dur} value={dur} sx={{ fontWeight: 550, fontSize: '0.875rem' }}>
              {dur === 'All Durations' ? 'All Durations' : dur}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Divider />

      {/* Price Range Section */}
      <Box sx={{ px: 0.5 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
          Price Range
        </Typography>
        <Slider
          value={priceRange}
          onChange={handlePriceSliderChange}
          valueLabelDisplay="auto"
          min={filtersData.priceRange.min}
          max={filtersData.priceRange.max}
          step={1000}
          sx={{
            color: 'primary.main',
            height: 5,
            '& .MuiSlider-thumb': {
              width: 16,
              height: 16,
              backgroundColor: '#fff',
              border: '3px solid currentColor',
            },
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
            ₹{priceRange[0].toLocaleString()}
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
            ₹{priceRange[1].toLocaleString()}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default SidebarFilters;
