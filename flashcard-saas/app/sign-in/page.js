// app/sign-in/page.js

import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import { SignIn } from '@clerk/nextjs';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import ClerkFirestoreIntegration from '@/components/ClerkFirestoreIntegration';

export default function SignInPage() {
  return (
    <Box 
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(45deg, #3f51b5 30%, #757de8 90%)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Navbar />
      <ClerkFirestoreIntegration />
      <Container 
        maxWidth="sm" 
        sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '15px',
            padding: '2rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ color: '#3f51b5', marginBottom: '2rem' }}>
            Sign In to Memora
          </Typography>
          <SignIn routing="hash" />
          <Box sx={{ textAlign: 'center', marginTop: '1rem' }}>
            <Typography variant="body2">
              Don't have an account?{' '}
              <Link href="/sign-up" passHref>
                <Button color="primary">Sign Up</Button>
              </Link>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}