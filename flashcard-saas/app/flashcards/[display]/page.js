// app/flashcards/[display]/page.js
'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useParams, useRouter } from 'next/navigation';
import { Container, Card, CardContent, Typography, Box, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { ArrowBack, ArrowForward, Delete, Edit } from '@mui/icons-material';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import db from '../../../firebase';
import Navbar from '../../../components/navbar';
import { useTheme } from '@mui/material/styles';

export default function FlashcardSet() {
  const { user } = useUser();
  const params = useParams();
  const router = useRouter();
  const theme = useTheme();
  const [flashcards, setFlashcards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFront, setEditFront] = useState('');
  const [editBack, setEditBack] = useState('');

  useEffect(() => {
    async function getFlashcards() {
      if (!user || !params.display) return;
      const setName = decodeURIComponent(params.display);
      const docRef = doc(db, 'users', user.id, 'flashcardSets', setName);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const fetchedFlashcards = docSnap.data().flashcards || [];
        setFlashcards(fetchedFlashcards);
      }
    }
    getFlashcards();
  }, [user, params.display]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length);
  };

  const handleDeleteCard = async () => {
    if (confirm('Are you sure you want to delete this flashcard?')) {
      const newFlashcards = flashcards.filter((_, index) => index !== currentCardIndex);
      const setName = decodeURIComponent(params.display);
      const docRef = doc(db, 'users', user.id, 'flashcardSets', setName);
      await setDoc(docRef, { flashcards: newFlashcards }, { merge: true });
      setFlashcards(newFlashcards);
      if (currentCardIndex >= newFlashcards.length) {
        setCurrentCardIndex(newFlashcards.length - 1);
      }
    }
  };

  const handleEditCard = () => {
    setEditFront(flashcards[currentCardIndex].front);
    setEditBack(flashcards[currentCardIndex].back);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (editFront.trim() === '' || editBack.trim() === '') return;

    const newFlashcards = [...flashcards];
    newFlashcards[currentCardIndex] = { front: editFront, back: editBack };

    const setName = decodeURIComponent(params.display);
    const docRef = doc(db, 'users', user.id, 'flashcardSets', setName);
    await setDoc(docRef, { flashcards: newFlashcards }, { merge: true });

    setFlashcards(newFlashcards);
    setEditDialogOpen(false);
  };

  const handleStudyClick = () => {
    router.push(`/study/${encodeURIComponent(params.display)}`);
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="md">
        <Box sx={{ mt: 4, mb: 4 }}>
          <Button onClick={() => router.push('/flashcards')} startIcon={<ArrowBack />}>
            Back to Sets
          </Button>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            {params.display ? decodeURIComponent(params.display) : 'Loading...'}
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleStudyClick}
            sx={{ mt: 2, display: 'block', margin: '0 auto' }}
          >
            Study this Set
          </Button>
        </Box>
        {flashcards.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Card 
              onClick={handleFlip}
              sx={{
                width: '100%',
                height: 300,
                cursor: 'pointer',
                perspective: '1000px',
                backgroundColor: 'transparent',
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  textAlign: 'center',
                  transition: 'transform 0.6s',
                  transformStyle: 'preserve-3d',
                  boxShadow: theme.shadows[3],
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                <CardContent
                  sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h5">
                    {flashcards[currentCardIndex].front}
                  </Typography>
                </CardContent>
                <CardContent
                  sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  <Typography variant="h5">
                    {flashcards[currentCardIndex].back}
                  </Typography>
                </CardContent>
              </Box>
            </Card>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <IconButton onClick={handlePrevious}>
                <ArrowBack />
              </IconButton>
              <Typography sx={{ mx: 2 }}>
                {currentCardIndex + 1} / {flashcards.length}
              </Typography>
              <IconButton onClick={handleNext}>
                <ArrowForward />
              </IconButton>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <IconButton onClick={handleEditCard}>
                <Edit />
              </IconButton>
              <IconButton onClick={handleDeleteCard}>
                <Delete />
              </IconButton>
            </Box>
          </Box>
        ) : (
          <Typography>No flashcards found in this set.</Typography>
        )}
      </Container>
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Flashcard</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Front"
            type="text"
            fullWidth
            value={editFront}
            onChange={(e) => setEditFront(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Back"
            type="text"
            fullWidth
            value={editBack}
            onChange={(e) => setEditBack(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}