'use client';

import React, { useState, useMemo } from 'react';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { 
  ThemeProvider, createTheme, CssBaseline,
  AppBar, Toolbar, Typography, Button, Container, Box, Grid, Card, CardContent, 
  CardActions, useMediaQuery, IconButton
} from '@mui/material';
import { 
  LightbulbOutlined as LightbulbIcon, 
  CloudOutlined as CloudIcon, 
  DevicesOutlined as DevicesIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon
} from '@mui/icons-material';

export default function HomePage() {
  const [mode, setMode] = useState('light');
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
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
            default: mode === 'light' ? '#ffffff' : '#121212',
            paper: mode === 'light' ? '#f5f5f5' : '#1e1e1e',
          },
          text: {
            primary: mode === 'light' ? '#333333' : '#ffffff',
            secondary: mode === 'light' ? '#555555' : '#aaaaaa',
          },
        },
      }),
    [mode],
  );

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const cardStyle = {
    height: '100%', 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    textAlign: 'center', 
    p: 2,
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-5px)',
    },
    background: theme.palette.background.paper,
    borderRadius: '20px',
    boxShadow: mode === 'light'
      ? '0 10px 20px rgba(93, 78, 123, 0.1), 0 6px 6px rgba(93, 78, 123, 0.1)'
      : '0 10px 20px rgba(156, 137, 184, 0.1), 0 6px 6px rgba(156, 137, 184, 0.1)',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '-50%',
      left: '-50%',
      width: '200%',
      height: '200%',
      background: 'radial-gradient(circle, rgba(93, 78, 123, 0.1) 0%, rgba(93, 78, 123, 0) 70%)',
      opacity: 0,
      transition: 'opacity 0.3s ease-in-out',
    },
    '&:hover::before': {
      opacity: 1,
    },
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: theme.palette.background.default,
      }}>
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
                Memora
              </Typography>
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
                    ml: 1,
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
            </Toolbar>
          </Container>
        </AppBar>

        <Container maxWidth="lg" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', py: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant={isMobile ? 'h4' : 'h3'} component="h1" gutterBottom fontWeight="bold" color="text.primary">
              Study Any Subject with Memora
            </Typography>
            <Typography variant="h6" component="h2" gutterBottom color="text.secondary">
              Generate flashcards with AI and study anywhere, anytime
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              color="primary"
              component={Link} 
              href="/generate"
              sx={{ 
                mt: 2,
                px: 4,
                py: 1,
                fontSize: '1rem',
                borderRadius: '25px',
                boxShadow: '0 4px 6px rgba(93, 78, 123, 0.25)',
                '&:hover': {
                  boxShadow: '0 6px 8px rgba(93, 78, 123, 0.3)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Start Learning Now
            </Button>
          </Box>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            {[
              { icon: <LightbulbIcon />, title: 'AI-Powered', description: 'Instant flashcard generation' },
              { icon: <CloudIcon />, title: 'Cloud Sync', description: 'Access anywhere, anytime' },
              { icon: <DevicesIcon />, title: 'Multi-Device', description: 'Seamless cross-device study' },
            ].map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={cardStyle}>
                  <Box 
                    sx={{ 
                      mb: 1, 
                      color: theme.palette.primary.main,
                      borderRadius: '50%',
                      p: 1,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <CardContent sx={{ p: 1 }}>
                    <Typography gutterBottom variant="h6" component="div" fontWeight="bold">
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" component="h2" gutterBottom fontWeight="bold" color="text.primary">
              Pricing
            </Typography>
            <Grid container spacing={3} justifyContent="center">
              {[
                { title: 'Free', price: '$0', features: ['Basic flashcards', 'Limited storage', 'Web access'] },
                { title: 'Pro', price: '$1', features: ['AI generation', 'Unlimited storage', 'Priority support'] },
              ].map((plan, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card 
                    sx={{
                      ...cardStyle,
                      backgroundColor: index === 1 ? theme.palette.primary.main : theme.palette.background.paper,
                      color: index === 1 ? theme.palette.primary.contrastText : theme.palette.text.primary,
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Typography gutterBottom variant="h6" component="div" fontWeight="bold">
                        {plan.title}
                      </Typography>
                      <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
                        {plan.price}
                        <Typography variant="caption" component="span">/month</Typography>
                      </Typography>
                      {plan.features.map((feature, featureIndex) => (
                        <Typography key={featureIndex} variant="body2" sx={{ mb: 0.5 }}>
                          • {feature}
                        </Typography>
                      ))}
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'center', p: 1 }}>
                      <Button 
                        variant={index === 1 ? "contained" : "outlined"} 
                        color={index === 1 ? "secondary" : "primary"}
                        onClick={index === 1 ? handleProPlanCheckout : undefined}
                        size="small"
                        sx={{
                          borderRadius: '20px',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 6px rgba(93, 78, 123, 0.2)',
                          },
                        }}
                      >
                        {index === 0 ? 'Get Started' : 'Upgrade Now'}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );

  async function handleProPlanCheckout() {
    const checkoutSession = await fetch('/api/checkout_sessions', {
      method: 'POST',
      headers: { origin: 'http://localhost:3000' },
    });
    const checkoutSessionJson = await checkoutSession.json();

    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    });

    if (error) {
      console.warn(error.message);
    }
  }
}