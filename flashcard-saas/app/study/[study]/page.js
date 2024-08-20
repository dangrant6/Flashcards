// app/study/[study]/page.js
'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useParams, useRouter } from 'next/navigation';
import { Container, Card, CardContent, Typography, Box, Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import db from '../../../firebase';
import Navbar from '../../../components/navbar';
import { isValidFlashcard, updateFlashcardFields } from '../../../utils/flashcardSchema';
import { calculateNextReview } from '../../../utils/spacedRepetition';
import { keyframes } from '@emotion/react';

const popupAnimation = keyframes`
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); opacity: 0; }
`;

const ScorePopup = ({ score }) => (
  <Box
    sx={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      animation: `${popupAnimation} 1s ease-out`,
      zIndex: 9999,
    }}
  >
    <Typography variant="h2" color="success.main">
      +{score}
    </Typography>
  </Box>
);

export default function StudyPage() {
  const { user } = useUser();
  const params = useParams();
  const router = useRouter();
  const [flashcards, setFlashcards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [isCorrect, setIsCorrect] = useState(null);
  const [overrideDialogOpen, setOverrideDialogOpen] = useState(false);
  const [showScorePopup, setShowScorePopup] = useState(false);
  const [flashEffect, setFlashEffect] = useState(null);

  useEffect(() => {
    async function getFlashcards() {
      if (!user || !params.study) return;
      const setName = decodeURIComponent(params.study);
      const docRef = doc(db, 'users', user.id, 'flashcardSets', setName);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const fetchedFlashcards = docSnap.data().flashcards || [];
        const sortedFlashcards = fetchedFlashcards.sort((a, b) => 
          new Date(a.nextReviewDate || 0) - new Date(b.nextReviewDate || 0)
        );
        setFlashcards(sortedFlashcards);
      }
    }
    getFlashcards();
  }, [user, params.study]);

  const checkAnswer = () => {
    const currentCard = flashcards[currentCardIndex];
    const isAnswerCorrect = userAnswer.toLowerCase().trim() === currentCard.back.toLowerCase().trim();
    setIsCorrect(isAnswerCorrect);
    setShowAnswer(true);
    if (isAnswerCorrect) {
      setScore(prevScore => prevScore + 1);
      setShowScorePopup(true);
      setFlashEffect('correct');
      updateCardReview(currentCard, 5);
    } else {
      setFlashEffect('incorrect');
    }
    setTimeout(() => {
      setShowScorePopup(false);
      setFlashEffect(null);
    }, 1000);
  };

  const updateCardReview = async (card, confidenceRating) => {
    if (!isValidFlashcard(card)) {
      console.error('Invalid flashcard structure');
      return;
    }

    const nextReviewInfo = calculateNextReview(card, confidenceRating);
    const updatedCard = updateFlashcardFields(card, {
      confidenceRating,
      ...nextReviewInfo
    });

    const newFlashcards = [...flashcards];
    newFlashcards[currentCardIndex] = updatedCard;

    const setName = decodeURIComponent(params.study);
    const docRef = doc(db, 'users', user.id, 'flashcardSets', setName);
    await updateDoc(docRef, { flashcards: newFlashcards });
    setFlashcards(newFlashcards);
  };

  const handleNext = () => {
    setShowAnswer(false);
    setUserAnswer('');
    setIsCorrect(null);
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      // End of study session
      alert(`Study session complete! Your score: ${score}/${flashcards.length}`);
      router.push(`/flashcards/${params.study}`);
    }
  };

  const handleOverride = () => {
    setOverrideDialogOpen(true);
  };

  const confirmOverride = () => {
    setScore(score + 1);
    updateCardReview(flashcards[currentCardIndex], 5);
    setOverrideDialogOpen(false);
    handleNext();
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="md">
        <Box sx={{ mt: 4, mb: 4 }}>
          <Button onClick={() => router.push(`/flashcards/${params.study}`)} startIcon={<ArrowBack />}>
            Back to Flashcard Set
          </Button>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Study: {params.study ? decodeURIComponent(params.study) : 'Loading...'}
          </Typography>
          <Typography variant="h6" align="center">
            Score: {score}/{flashcards.length}
          </Typography>
        </Box>
        {flashcards.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Card 
              sx={{ 
                width: '100%', 
                mb: 2, 
                transition: 'background-color 0.3s ease',
                backgroundColor: flashEffect === 'correct' ? 'rgba(0, 255, 0, 0.1)' : 
                                flashEffect === 'incorrect' ? 'rgba(255, 0, 0, 0.1)' : 
                                'inherit'
              }}
            >
              <CardContent>
                <Typography variant="h5" align="center">
                  {flashcards[currentCardIndex].front}
                </Typography>
              </CardContent>
            </Card>
            <TextField
              fullWidth
              variant="outlined"
              label="Your Answer"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={showAnswer}
              sx={{ mb: 2 }}
            />
            {!showAnswer ? (
              <Button variant="contained" color="primary" onClick={checkAnswer}>
                Check Answer
              </Button>
            ) : (
              <Box sx={{ width: '100%', textAlign: 'center' }}>
                <Typography variant="h6" color={isCorrect ? 'success.main' : 'error.main'}>
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </Typography>
                <Typography variant="body1">
                  Correct Answer: {flashcards[currentCardIndex].back}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {!isCorrect && (
                    <Button variant="outlined" onClick={handleOverride} sx={{ mr: 1 }}>
                      Mark as Correct
                    </Button>
                  )}
                  <Button variant="contained" onClick={handleNext}>
                    Next Card
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        ) : (
          <Typography>No flashcards found in this set.</Typography>
        )}
      </Container>
      {showScorePopup && <ScorePopup score={1} />}
      <Dialog open={overrideDialogOpen} onClose={() => setOverrideDialogOpen(false)}>
        <DialogTitle>Override Answer</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to mark your answer as correct? This will give you a point and move to the next card.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOverrideDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmOverride}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}