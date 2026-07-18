import React from 'react';
import { Card as MuiCard, CardContent, CardHeader } from '@mui/material';

export const Card = ({ children, title, subtitle, action, sx, ...props }) => {
  return (
    <MuiCard sx={{ overflow: 'visible', ...sx }} {...props}>
      {(title || subtitle || action) && (
        <CardHeader 
          title={title} 
          subheader={subtitle} 
          action={action} 
          titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
          subheaderTypographyProps={{ variant: 'body2' }}
        />
      )}
      <CardContent>{children}</CardContent>
    </MuiCard>
  );
};

export default Card;
