import React, { useState } from 'react';
import { Box, InputBase, IconButton } from '@mui/material';
import { Search } from 'lucide-react';

/**
 * Reusable SearchBar component with an input field and a search icon button.
 * @param {Object} props
 * @param {Function} props.onSearch - Callback function called when search value changes or form is submitted
 */
export const SearchBar = ({ onSearch }) => {
  const [value, setValue] = useState('');

  const handleChange = (e) => {
    setValue(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        maxWidth: 420,
        height: 40,
        bgcolor: '#f1f5f9',
        border: '1px solid',
        borderColor: 'transparent',
        borderRadius: '50px',
        pl: 2.5,
        pr: 0.5,
        transition: 'all 0.3s ease',
        '&:focus-within': {
          borderColor: 'primary.main',
          bgcolor: 'background.paper',
          boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.15)',
        },
      }}
    >
      <InputBase
        placeholder="Search products..."
        value={value}
        onChange={handleChange}
        fullWidth
        sx={{
          fontSize: '0.875rem',
          fontWeight: 500,
          color: 'text.primary',
        }}
      />
      <IconButton
        type="submit"
        size="small"
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          p: 0.8,
          '&:hover': {
            bgcolor: 'primary.dark',
          },
        }}
      >
        <Search size={14} />
      </IconButton>
    </Box>
  );
};

export default SearchBar;
