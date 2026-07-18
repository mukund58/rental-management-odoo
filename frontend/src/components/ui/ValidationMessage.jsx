import React from 'react';
import { Typography } from '@mui/material';

export const ValidationMessage = ({ message, severity = 'error' }) => {
  if (!message) return null;

  return (
    <Typography
      variant="caption"
      sx={{
        color: severity === 'error' ? 'error.main' : 'warning.main',
        fontWeight: 500,
        mt: 0.5,
        display: 'block',
      }}
    >
      {message}
    </Typography>
  );
};

export default ValidationMessage;
