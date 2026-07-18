import React from 'react';
import { TextField } from '@mui/material';

export const Input = React.forwardRef(({ errorMessage, helperText, error, ...props }, ref) => {
  return (
    <TextField
      ref={ref}
      error={error || !!errorMessage}
      helperText={errorMessage || helperText}
      fullWidth
      variant="outlined"
      {...props}
    />
  );
});

Input.displayName = 'Input';
export default Input;
