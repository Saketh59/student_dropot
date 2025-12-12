import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2c3e50', // Dark blue
      light: '#3d566e',
      dark: '#1e2b37',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#e74c3c', // Red
      light: '#ec7063',
      dark: '#a93226',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#f39c12', // Orange
      light: '#f5b041',
      dark: '#d68910',
      contrastText: '#ffffff',
    },
    success: {
      main: '#2ecc71', // Green
      light: '#58d68d',
      dark: '#27ae60',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#2c3e50',
      secondary: '#7f8c8d',
    },
  },
  typography: {
    fontFamily: [
      'Poppins',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.3,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    subtitle1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    subtitle2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 24px 0 rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '& fieldset': {
              borderColor: '#dfe6e9',
            },
            '&:hover fieldset': {
              borderColor: '#b2bec3',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#2c3e50',
              borderWidth: 1,
            },
          },
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0 2px 4px 0 rgba(0,0,0,0.05)',
    '0 4px 8px 0 rgba(0,0,0,0.05)',
    '0 6px 12px 0 rgba(0,0,0,0.05)',
    '0 8px 16px 0 rgba(0,0,0,0.05)',
    '0 10px 20px 0 rgba(0,0,0,0.05)',
    '0 12px 24px 0 rgba(0,0,0,0.05)',
    '0 14px 28px 0 rgba(0,0,0,0.05)',
    '0 16px 32px 0 rgba(0,0,0,0.05)',
    '0 18px 36px 0 rgba(0,0,0,0.05)',
    '0 20px 40px 0 rgba(0,0,0,0.05)',
    '0 22px 44px 0 rgba(0,0,0,0.05)',
    '0 24px 48px 0 rgba(0,0,0,0.05)',
    '0 26px 52px 0 rgba(0,0,0,0.05)',
    '0 28px 56px 0 rgba(0,0,0,0.05)',
    '0 30px 60px 0 rgba(0,0,0,0.05)',
    '0 32px 64px 0 rgba(0,0,0,0.05)',
    '0 34px 68px 0 rgba(0,0,0,0.05)',
    '0 36px 72px 0 rgba(0,0,0,0.05)',
    '0 38px 76px 0 rgba(0,0,0,0.05)',
    '0 40px 80px 0 rgba(0,0,0,0.05)',
    '0 42px 84px 0 rgba(0,0,0,0.05)',
    '0 44px 88px 0 rgba(0,0,0,0.05)',
    '0 46px 92px 0 rgba(0,0,0,0.05)',
    '0 48px 96px 0 rgba(0,0,0,0.05)',
  ],
});

export default theme;
