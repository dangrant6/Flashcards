// components/navbar.js
'use client';

import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Container } from '@mui/material';
import Link from 'next/link';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Brightness4 as DarkModeIcon, Brightness7 as LightModeIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useTheme as useCustomTheme } from '../app/ThemeContext';

const Navbar = () => {
  const { mode, colorMode } = useCustomTheme();
  const theme = useTheme();

  return (
    <AppBar 
      position="static" 
      color="default" 
      elevation={1}
      sx={{
        backgroundColor: mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(18, 18, 18, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${mode === 'light' ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.12)'}`,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              fontWeight: 'bold',
              color: theme.palette.text.primary,
            }}
          >
            FlashMaster
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button color="inherit" component={Link} href="/" sx={{ color: theme.palette.text.primary }}>
              Home
            </Button>
            <Button color="inherit" component={Link} href="/generate" sx={{ color: theme.palette.text.primary }}>
              Generate Flashcards
            </Button>
            <Button color="inherit" component={Link} href="/flashcards" sx={{ color: theme.palette.text.primary }}>
              My Flashcards
            </Button>
            <IconButton 
              sx={{ 
                ml: 1,
                color: theme.palette.text.primary,
              }} 
              onClick={colorMode.toggleColorMode}
            >
              {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
            <SignedOut>
              <Button 
                color="inherit" 
                component={Link} 
                href="/sign-in" 
                sx={{ 
                  color: theme.palette.text.primary,
                }}
              >
                Login
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                component={Link} 
                href="/sign-up" 
                sx={{ ml: 1 }}
              >
                Sign Up
              </Button>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;