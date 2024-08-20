// app/ThemeContext.js
'use client';

import React, { createContext, useContext, useState, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const ThemeContext = createContext();

export function CustomThemeProvider({ children }) {
  const [mode, setMode] = useState('light');

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#5D4E7B', // Dark hazy purple
          },
          secondary: {
            main: '#9C89B8', // Lighter purple
          },
          background: {
            default: mode === 'light' ? '#F5F5F5' : '#121212', // Light gray for light mode
            paper: mode === 'light' ? '#FFFFFF' : '#1E1E1E',
          },
          text: {
            primary: mode === 'light' ? '#333333' : '#FFFFFF',
            secondary: mode === 'light' ? '#555555' : '#AAAAAA',
          },
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                backgroundColor: mode === 'light' ? '#F5F5F5' : '#121212',
                backgroundImage: 'none', // Explicitly remove any background image
              },
            },
          },
          MuiContainer: {
            styleOverrides: {
              root: {
                backgroundColor: 'transparent', // Ensure container doesn't add its own background
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                backgroundColor: mode === 'light' ? '#FFFFFF' : '#1E1E1E',
                boxShadow: mode === 'light' 
                  ? '0 2px 4px rgba(0,0,0,0.1)' 
                  : '0 2px 4px rgba(255,255,255,0.1)',
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, colorMode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}