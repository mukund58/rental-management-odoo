import React from 'react';
import { Box, Button, Typography, Stack, Divider } from '@mui/material';

const OrderStatusBar = ({ status, onUpdateStatus }) => {
  // Mapping status enum to visual states
  // Assuming 1 = Draft (Quotation), 2 = QuotationSent, 3+ = Sale Order

  const steps = [
    { label: 'Quotation', key: 'Draft', value: 1 },
    { label: 'Quotation Sent', key: 'QuotationSent', value: 2 },
    { label: 'Sale Order', key: 'SaleOrder', value: 3 }, // Maps to Reserved/Active
  ];

  let currentStepIndex = 0;
  if (status === 2) currentStepIndex = 1;
  else if (status >= 3) currentStepIndex = 2;

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignitems: 'center',
      borderBottom: '1px solid',
      borderColor: 'divider',
      pb: 2,
      mb: 3
    }}>
      <Stack direction="row" spacing={1}>
        {status === 1 && (
          <Button variant="contained" color="secondary" onClick={() => onUpdateStatus(2)}>
            Send by Email
          </Button>
        )}
        {(status === 1 || status === 2) && (
          <Button variant="contained" color="primary" onClick={() => onUpdateStatus(3)}>
            Confirm
          </Button>
        )}
        <Button variant="outlined" color="inherit">Print</Button>
        {status < 5 && (
          <Button variant="outlined" color="inherit" onClick={() => onUpdateStatus(6)}>Cancel</Button>
        )}
      </Stack>

      <Box sx={{ display: 'flex', bgcolor: 'background.default', borderRadius: 1, overflow: 'hidden' }}>
        {steps.map((step, index) => {
          const isActive = index === currentStepIndex;
          const isPassed = index < currentStepIndex;

          return (
            <Box
              key={step.key}
              sx={{
                px: 3,
                py: 1,
                display: 'flex',
                alignitems: 'center',
                position: 'relative',
                bgcolor: isActive ? 'primary.main' : 'transparent',
                color: isActive ? 'primary.contrastText' : (isPassed ? 'text.primary' : 'text.disabled'),
                fontWeight: isActive ? 700 : 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: isActive ? 'primary.main' : 'action.hover'
                },
                // Arrow shape
                '&::after': index < steps.length - 1 ? {
                  content: '""',
                  position: 'absolute',
                  right: -10,
                  top: 0,
                  bottom: 0,
                  width: 10,
                  bgcolor: isActive ? 'primary.main' : 'transparent',
                  clipPath: 'polygon(0 0, 100% 50%, 0 100%)',
                  zIndex: 1
                } : {}
              }}
            >
              {step.label}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default OrderStatusBar;
