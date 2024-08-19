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
            default: mode === 'light' ? '#FFFAF0' : '#121212', // Creamy white for light mode
            paper: mode === 'light' ? '#FFF8E1' : '#1e1e1e',
          },
          text: {
            primary: mode === 'light' ? '#333333' : '#ffffff',
            secondary: mode === 'light' ? '#555555' : '#aaaaaa',
          },
        },
        components: {
          MuiContainer: {
            styleOverrides: {
              root: {
                backgroundColor: 'transparent', // Override the default Container background
              },
            },
          },
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                backgroundColor: mode === 'light' ? '#FFFAF0' : '#121212', // Set the body background color
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