// app/flashcard/FlashcardContent.js
'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';
import { Container, Grid, Card, CardActionArea, CardContent, Typography, Box } from '@mui/material';
import { doc, collection, getDocs } from 'firebase/firestore';
import db from '../../firebase';

export default function FlashcardContent() {
  const { user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});
  const searchParams = useSearchParams();
  const setName = searchParams.get('id');

  useEffect(() => {
    async function getFlashcard() {
      if (!setName || !user) return;

      const colRef = collection(doc(db, 'users', user.id), 'flashcardSets', setName, 'flashcards');
      const docs = await getDocs(colRef);
      const flashcards = [];
      docs.forEach((doc) => {
        flashcards.push({ id: doc.id, ...doc.data() });
      });
      setFlashcards(flashcards);
    }
    getFlashcard();
  }, [setName, user]);

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <Container maxWidth="md">
      <Grid container spacing={3} sx={{ mt: 4 }}>
        {flashcards.map((flashcard) => (
          <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
            <Card>
              <CardActionArea onClick={() => handleCardClick(flashcard.id)}>
                <CardContent>
                  <Box
                    sx={{
                      transformStyle: 'preserve-3d',
                      transform: flipped[flashcard.id] ? 'rotateY(180deg)' : 'none',
                      transition: 'transform 0.6s',
                    }}
                  >
                    <div>
                      <Typography variant="h5" component="div">
                        {flipped[flashcard.id] ? flashcard.back : flashcard.front}
                      </Typography>
                    </div>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}