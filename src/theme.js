import { createTheme } from '@mui/material/styles';

export default createTheme({
  palette: {
    // #0da3a0
    primary: { main: '#1F5096' },
    secondary: { main: '#000000' },
    background: { default: '#f5f5f5' }
  },
  typography: {
    fontFamily: 'Poppins, Arial, sans-serif',
    h1: { fontWeight: 700, fontSize: '3rem' },
    h2: { fontWeight: 600, fontSize: '2rem' }
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '12px',
          padding: '8px 20px'
        }
      }
    }
  }
});