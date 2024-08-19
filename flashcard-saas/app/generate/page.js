// app/generate/page.js
'use client';

import React, { useState, useMemo } from 'react';
import {
  ThemeProvider, createTheme, CssBaseline,
  Container, TextField, Button, Typography, Box, Grid, Card, CardContent,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  useMediaQuery, IconButton
} from '@mui/material';
import { useUser } from '@clerk/nextjs';
import { collection, doc, writeBatch, getDoc, setDoc } from 'firebase/firestore';
import db from '../../firebase';
import Navbar from '../../components/navbar';
import { Brightness4 as DarkModeIcon, Brightness7 as LightModeIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useTheme as useCustomTheme } from '../ThemeContext';
import { initializeFlashcard } from '../../utils/flashcardSchema';

export default function Generate() {
  const { mode } = useCustomTheme();
  const theme = useTheme();
  const [flashcards, setFlashcards] = useState([]);
  const [setName, setSetName] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [frontText, setFrontText] = useState('');
  const [backText, setBackText] = useState('');
  const { user } = useUser();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  const handleAddFlashcard = () => {
    if (!frontText.trim() || !backText.trim()) {
      alert('Please enter both the front and back text for the flashcard.');
      return;
    }
  
    const newFlashcard = initializeFlashcard(frontText, backText);
    setFlashcards([...flashcards, newFlashcard]);
    setFrontText('');
    setBackText('');
  };

  const saveFlashcards = async () => {
    if (!setName.trim()) {
      alert('Please enter a name for your flashcard set.');
      return;
    }

    try {
      const userDocRef = doc(db, 'users', user.id);
      const userDocSnap = await getDoc(userDocRef);

      const batch = writeBatch(db);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const updatedSets = [...(userData.flashcardSets || []), { name: setName }];
        batch.update(userDocRef, { flashcardSets: updatedSets });
      } else {
        batch.set(userDocRef, { flashcardSets: [{ name: setName }] });
      }

      const setDocRef = doc(collection(userDocRef, 'flashcardSets'), setName);
      batch.set(setDocRef, { flashcards });

      await batch.commit();

      alert('Flashcards saved successfully!');
      handleCloseDialog();
      setSetName('');
      setFlashcards([]);
    } catch (error) {
      console.error('Error saving flashcards:', error);
      alert('An error occurred while saving flashcards. Please try again.');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar>
        <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
          {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Navbar>
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" color="text.primary">
            Create Flashcards
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                value={frontText}
                onChange={(e) => setFrontText(e.target.value)}
                label="Front Text"
                fullWidth
                variant="outlined"
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                value={backText}
                onChange={(e) => setBackText(e.target.value)}
                label="Back Text"
                fullWidth
                variant="outlined"
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddFlashcard}
            fullWidth
            sx={{
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 'bold',
              borderRadius: '25px',
              boxShadow: '0 4px 6px rgba(93, 78, 123, 0.25)',
              '&:hover': {
                boxShadow: '0 6px 8px rgba(93, 78, 123, 0.3)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            Add Flashcard
          </Button>
        </Box>
        {flashcards.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom fontWeight="bold" color="text.primary">
              Preview Flashcards
            </Typography>
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleOpenDialog}
                sx={{
                  py: 1.5,
                  px: 4,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  borderRadius: '25px',
                  boxShadow: '0 4px 6px rgba(156, 137, 184, 0.25)',
                  '&:hover': {
                    boxShadow: '0 6px 8px rgba(156, 137, 184, 0.3)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Save Flashcards
              </Button>
            </Box>
            <Grid container spacing={3} sx={{ mt: 2 }}>
              {flashcards.map((flashcard, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '20px',
                    boxShadow: mode === 'light'
                      ? '0 10px 20px rgba(93, 78, 123, 0.1), 0 6px 6px rgba(93, 78, 123, 0.1)'
                      : '0 10px 20px rgba(156, 137, 184, 0.1), 0 6px 6px rgba(156, 137, 184, 0.1)',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                    },
                  }}>
                    <CardContent>
                      <Typography variant="h6" color="text.primary">Front:</Typography>
                      <Typography color="text.secondary">{flashcard.front}</Typography>
                      <Typography variant="h6" sx={{ mt: 2 }} color="text.primary">Back:</Typography>
                      <Typography color="text.secondary">{flashcard.back}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
        <Dialog open={dialogOpen} onClose={handleCloseDialog}>
          <DialogTitle sx={{ bgcolor: theme.palette.primary.main, color: theme.palette.primary.contrastText }}>
            Save Flashcard Set
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ color: theme.palette.text.secondary, mt: 2 }}>
              Please enter a name for your flashcard set.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Set Name"
              type="text"
              fullWidth
              value={setName}
              onChange={(e) => setSetName(e.target.value)}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} sx={{ color: theme.palette.primary.main }}>Cancel</Button>
            <Button onClick={saveFlashcards} variant="contained" color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
}