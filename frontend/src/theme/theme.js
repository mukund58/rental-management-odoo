import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { lightPalette, darkPalette } from './palette';
import { typography } from './typography';

export const createAppTheme = (mode) => {
  const theme = createTheme({
    palette: mode === 'light' ? lightPalette : darkPalette,
    typography,
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            borderRadius: '8px',
            padding: '8px 16px',
            textTransform: 'none',
            fontWeight: 600,
            transition: 'all 0.2s ease-in-out',
          },
          containedPrimary: {
            background: mode === 'light' 
              ? 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' 
              : 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
            color: '#ffffff',
            '&:hover': {
              boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.4)',
              transform: 'translateY(-1px)',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
            boxShadow: mode === 'light' 
              ? '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)' 
              : '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)',
            border: `1px solid ${mode === 'light' ? '#f1f5f9' : '#1f2937'}`,
            backgroundImage: 'none',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            transition: 'all 0.2s ease-in-out',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: mode === 'light' ? '#e2e8f0' : '#374151',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: mode === 'light' ? '#94a3b8' : '#4b5563',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: mode === 'light' ? '#4f46e5' : '#6366f1',
              borderWidth: '2px',
            },
          },
        },
      },
      MuiFormLabel: {
        styleOverrides: {
          root: {
            fontSize: '0.875rem',
            color: mode === 'light' ? '#64748b' : '#9ca3af',
            '&.Mui-focused': {
              color: mode === 'light' ? '#4f46e5' : '#6366f1',
            },
          },
        },
      },
    },
  });

  return responsiveFontSizes(theme);
};
