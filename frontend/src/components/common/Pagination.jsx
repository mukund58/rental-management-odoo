import React from 'react';
import { Pagination as MuiPagination, Stack } from '@mui/material';

/**
 * Reusable Pagination component wrapping Material UI Pagination with custom styling
 * @param {Object} props
 * @param {number} props.page - Current active page (1-indexed)
 * @param {number} props.count - Total pages
 * @param {Function} props.onChange - Event handler for page change: (event, newPage) => void
 */
export const Pagination = ({ page, count, onChange }) => {
  if (count <= 1) return null;

  return (
    <Stack spacing={2} alignItems="center" sx={{ mt: 5, mb: 3 }}>
      <MuiPagination
        count={count}
        page={page}
        onChange={onChange}
        variant="outlined"
        shape="rounded"
        color="primary"
        size="large"
        sx={{
          '& .MuiPaginationItem-root': {
            borderRadius: '8px',
            border: '1px solid',
            borderColor: 'divider',
            fontWeight: 650,
            backgroundColor: 'background.paper',
            transition: 'all 0.2s',
            '&:hover': {
              backgroundColor: 'action.hover',
              borderColor: 'primary.light',
            },
            '&.Mui-selected': {
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
              border: 'none',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            },
          },
        }}
      />
    </Stack>
  );
};

export default Pagination;
