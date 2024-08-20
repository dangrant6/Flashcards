// app/generate/page.js
'use client';

import React, { useState, useMemo } from 'react';
import {
  ThemeProvider, createTheme, CssBaseline,
  Container, TextField, Button, Typography, Box, Grid, Card, CardContent,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  useMediaQuery, IconButton, Paper, Divider, CircularProgress
} from '@mui/material';
import { useUser } from '@clerk/nextjs';
import { collection, doc, writeBatch, getDoc, setDoc } from 'firebase/firestore';
import db from '../../firebase';
import Navbar from '../../components/navbar';
import { Brightness4 as DarkModeIcon, Brightness7 as LightModeIcon, Add as AddIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useTheme as useCustomTheme } from '../ThemeContext';
import { initializeFlashcard } from '../../utils/flashcardSchema';
import axios from 'axios';

export default function Generate() {
  const { mode, colorMode } = useCustomTheme();
  const theme = useTheme();
  const [flashcards, setFlashcards] = useState([]);
  const [setName, setSetName] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [frontText, setFrontText] = useState('');
  const [backText, setBackText] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = useUser();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) {
      alert('Please enter a prompt for AI generation.');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await axios.post('/api/ai-generate', { prompt: aiPrompt });
      const { front, back } = response.data;
      setFrontText(front);
      setBackText(back);
      setAiPrompt('');
    } catch (error) {
      console.error('Error generating flashcard:', error);
      alert('An error occurred while generating the flashcard. Please try again.');
    } finally {
      setIsGenerating(false);
    }
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
    <Box sx={{ 
      backgroundColor: theme.palette.background.default,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Navbar>
        <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
          {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Navbar>
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" color="primary" fontWeight="bold">
            Create Flashcards
          </Typography>
          <Box sx={{ mb: 4 }}>
            <TextField
              fullWidth
              variant="outlined"
              label="AI Prompt"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              onClick={handleAIGenerate}
              disabled={isGenerating}
              sx={{
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 'bold',
                borderRadius: '25px',
                textTransform: 'none',
              }}
            >
              {isGenerating ? <CircularProgress size={24} /> : 'Generate with AI'}
            </Button>
          </Box>
          <Divider sx={{ my: 4 }} />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                label="Front Text"
                value={frontText}
                onChange={(e) => setFrontText(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                label="Back Text"
                value={backText}
                onChange={(e) => setBackText(e.target.value)}
              />
            </Grid>
          </Grid>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddFlashcard}
            fullWidth
            startIcon={<AddIcon />}
            sx={{
              mt: 3,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 'bold',
              borderRadius: '25px',
              textTransform: 'none',
            }}
          >
            Add Flashcard
          </Button>
        </Paper>

        {flashcards.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom fontWeight="bold" color="primary">
              Preview Flashcards
            </Typography>
            <Grid container spacing={3} sx={{ mt: 2 }}>
              {flashcards.map((flashcard, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '15px',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 6,
                    },
                  }}>
                    <CardContent>
                      <Typography variant="h6" color="primary">Front:</Typography>
                      <Typography color="text.secondary" sx={{ mb: 2 }}>{flashcard.front}</Typography>
                      <Typography variant="h6" color="primary">Back:</Typography>
                      <Typography color="text.secondary">{flashcard.back}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
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
                  textTransform: 'none',
                }}
              >
                Save Flashcards
              </Button>
            </Box>
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
    </Box>
  );
}