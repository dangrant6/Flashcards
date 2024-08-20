// app/flashcards/page.js
'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import {
  Container, Grid, Card, CardActionArea, CardContent, Typography, Box, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Paper,
  Fade, useTheme
} from '@mui/material';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import db from '../../firebase';
import Navbar from '../../components/navbar';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

export default function Flashcards() {
  const { user } = useUser();
  const [flashcardSets, setFlashcardSets] = useState([]);
  const router = useRouter();
  const theme = useTheme();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editSetName, setEditSetName] = useState('');
  const [editSetIndex, setEditSetIndex] = useState(null);

  useEffect(() => {
    async function getFlashcardSets() {
      if (!user) return;
      const docRef = doc(db, 'users', user.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const collections = docSnap.data().flashcardSets || [];
        setFlashcardSets(collections);
      } else {
        await setDoc(docRef, { flashcardSets: [] });
      }
    }
    getFlashcardSets();
  }, [user]);

  const handleCardClick = (name) => {
    router.push(`/flashcards/${encodeURIComponent(name)}`);
  };

  const handleDeleteSet = async (index) => {
    if (confirm('Are you sure you want to delete this flashcard set?')) {
      const newSets = [...flashcardSets];
      const deletedSet = newSets.splice(index, 1)[0];
      
      const userDocRef = doc(db, 'users', user.id);
      await setDoc(userDocRef, { flashcardSets: newSets }, { merge: true });
      
      const setDocRef = doc(db, 'users', user.id, 'flashcardSets', deletedSet.name);
      await deleteDoc(setDocRef);

      setFlashcardSets(newSets);
    }
  };

  const handleEditSet = (index) => {
    setEditSetName(flashcardSets[index].name);
    setEditSetIndex(index);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (editSetName.trim() === '') return;

    const newSets = [...flashcardSets];
    const oldName = newSets[editSetIndex].name;
    newSets[editSetIndex].name = editSetName;

    const userDocRef = doc(db, 'users', user.id);
    await setDoc(userDocRef, { flashcardSets: newSets }, { merge: true });

    const oldSetDocRef = doc(db, 'users', user.id, 'flashcardSets', oldName);
    const newSetDocRef = doc(db, 'users', user.id, 'flashcardSets', editSetName);
    const setSnap = await getDoc(oldSetDocRef);
    if (setSnap.exists()) {
      await setDoc(newSetDocRef, setSnap.data());
      await deleteDoc(oldSetDocRef);
    }

    setFlashcardSets(newSets);
    setEditDialogOpen(false);
  };

  return (
    <Box sx={{ 
      backgroundColor: theme.palette.background.default,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" color="primary" fontWeight="bold">
            Your Flashcard Sets
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {flashcardSets.map((flashcardSet, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Fade in={true} timeout={500}>
                  <Card 
                    elevation={3}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: '15px',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: theme.shadows[10],
                      },
                    }}
                  >
                    <CardActionArea 
                      onClick={() => handleCardClick(flashcardSet.name)}
                      sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 3 }}
                    >
                      <Typography variant="h6" component="div" align="center" color="primary">
                        {flashcardSet.name}
                      </Typography>
                    </CardActionArea>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
                      <IconButton onClick={(e) => { e.stopPropagation(); handleEditSet(index); }} color="primary" size="small">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={(e) => { e.stopPropagation(); handleDeleteSet(index); }} color="error" size="small">
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Card>
                </Fade>
              </Grid>
            ))}
            <Grid item xs={12} sm={6} md={4}>
              <Fade in={true} timeout={500}>
                <Card 
                  elevation={3}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '15px',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: theme.shadows[10],
                    },
                  }}
                >
                  <CardActionArea 
                    onClick={() => router.push('/generate')}
                    sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 3 }}
                  >
                    <AddIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />
                    <Typography variant="h6" component="div" align="center" color="primary" sx={{ mt: 2 }}>
                      Create New Set
                    </Typography>
                  </CardActionArea>
                </Card>
              </Fade>
            </Grid>
          </Grid>
        </Paper>
      </Container>
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Set Name</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Set Name"
            type="text"
            fullWidth
            value={editSetName}
            onChange={(e) => setEditSetName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}