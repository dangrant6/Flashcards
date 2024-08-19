// app/sign-up/page.js

import React from 'react';
import { Container, Box, Typography, AppBar, Toolbar, Button } from '@mui/material';
import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';
import Navbar from '../../components/navbar';
import ClerkFirestoreIntegration from '@/components/ClerkFirestoreIntegration';

export default function SignUpPage() {
  return (
    <>
      <Navbar />
      <ClerkFirestoreIntegration />
    <Container maxWidth="sm">
      {/* Navigation Bar */}
      <AppBar position="static" sx={{ backgroundColor: '#3f51b5' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Flashcard SaaS
          </Typography>
          <Button color="inherit" component={Link} href="/sign-in">
            Sign In
          </Button>
        </Toolbar>
      </AppBar>

      {/* Sign-Up Section */}
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={{ textAlign: 'center', my: 4 }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Sign Up
        </Typography>
        <SignUp routing="hash" />
      </Box>
    </Container>
    </>
  );
}
