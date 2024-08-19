// app/study/[setName]/page.js

'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useParams, useRouter } from 'next/navigation';
import { Container, Card, CardContent, Typography, Box, Button, Rating } from '@mui/material';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import db from '../../../firebase';
import { isValidFlashcard, updateFlashcardFields } from '../../../utils/flashcardSchema';
import { calculateNextReview } from '../../../utils/spacedRepetition';

export default function StudyMode() {
  const { user } = useUser();
  const params = useParams();
  const router = useRouter();
  const [flashcards, setFlashcards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [confidenceRating, setConfidenceRating] = useState(0);

  useEffect(() => {
    async function getFlashcards() {
      if (!user || !params.setName) return;
      const setName = decodeURIComponent(params.setName);
      const docRef = doc(db, 'users', user.id, 'flashcardSets', setName);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const fetchedFlashcards = docSnap.data().flashcards || [];
        // Sort flashcards by nextReviewDate
        const sortedFlashcards = fetchedFlashcards.sort((a, b) => 
          new Date(a.nextReviewDate) - new Date(b.nextReviewDate)
        );
        setFlashcards(sortedFlashcards);
      }
    }
    getFlashcards();
  }, [user, params.setName]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleConfidenceRating = async (newValue) => {
    setConfidenceRating(newValue);
    const currentFlashcard = flashcards[currentCardIndex];
    
    if (!isValidFlashcard(currentFlashcard)) {
      console.error('Invalid flashcard structure');
      return;
    }
  
    const nextReviewInfo = calculateNextReview(currentFlashcard, newValue);
    const updatedFlashcard = updateFlashcardFields(currentFlashcard, {
      confidenceRating: newValue,
      ...nextReviewInfo
    });
    
    const setName = decodeURIComponent(params.setName);
    const docRef = doc(db, 'users', user.id, 'flashcardSets', setName);
    
    const newFlashcards = [...flashcards];
    newFlashcards[currentCardIndex] = updatedFlashcard;
    
    await updateDoc(docRef, { flashcards: newFlashcards });
    setFlashcards(newFlashcards);
    
    // Move to next card
    handleNext();
  };

  const handleNext = () => {
    setIsFlipped(false);
    setConfidenceRating(0);
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Study Mode: {params.setName ? decodeURIComponent(params.setName) : 'Loading...'}
      </Typography>
      {flashcards.length > 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Card onClick={handleFlip} sx={{ width: '100%', height: 300, cursor: 'pointer' }}>
            <CardContent>
              <Typography variant="h5">
                {isFlipped ? flashcards[currentCardIndex].back : flashcards[currentCardIndex].front}
              </Typography>
            </CardContent>
          </Card>
          {isFlipped && (
            <Box sx={{ mt: 2 }}>
              <Typography component="legend">Rate your confidence:</Typography>
              <Rating
                name="confidence-rating"
                value={confidenceRating}
                onChange={(event, newValue) => {
                  handleConfidenceRating(newValue);
                }}
              />
            </Box>
          )}
          <Box sx={{ mt: 2 }}>
            <Button onClick={handleNext} variant="contained">Next Card</Button>
          </Box>
        </Box>
      ) : (
        <Typography>No flashcards found in this set.</Typography>
      )}
    </Container>
  );
}