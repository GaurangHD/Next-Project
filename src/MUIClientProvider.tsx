'use client';

import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { useEffect, useState } from 'react';

const theme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#2563eb', // Tailwind blue-600
      },
      background: {
        default: '#f9fafb', // Tailwind gray-50
        paper: '#ffffff',
      },
    },
    shape: {
      borderRadius: 12,
    },
    typography: {
      fontFamily: ['Inter', 'sans-serif'].join(','),
    },
  });
  

export default function MUIClientProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; 

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
