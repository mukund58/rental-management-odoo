import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

export const Loader = ({ message = 'Loading...', size = 40, ...props }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        gap: 2,
        minHeight: '200px',
      }}
      {...props}
    >
      <CircularProgress size={size} thickness={4} />
      {message && (
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default Loader;
