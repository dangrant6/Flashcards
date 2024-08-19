// utils/flashcardSchema.js

export const initializeFlashcard = (front, back) => ({
    front,
    back,
    nextReviewDate: new Date(), // Review immediately
    interval: 0,
    easeFactor: 2.5, // Start with default ease factor
    confidenceRating: 0 // Not rated yet
  });
  
  export const isValidFlashcard = (flashcard) => {
    return (
      typeof flashcard.front === 'string' &&
      typeof flashcard.back === 'string' &&
      flashcard.nextReviewDate instanceof Date &&
      typeof flashcard.interval === 'number' &&
      typeof flashcard.easeFactor === 'number' &&
      typeof flashcard.confidenceRating === 'number'
    );
  };
  
  export const updateFlashcardFields = (flashcard, updates) => {
    return {
      ...flashcard,
      ...updates,
      nextReviewDate: updates.nextReviewDate instanceof Date ? updates.nextReviewDate : flashcard.nextReviewDate,
      interval: typeof updates.interval === 'number' ? updates.interval : flashcard.interval,
      easeFactor: typeof updates.easeFactor === 'number' ? updates.easeFactor : flashcard.easeFactor,
      confidenceRating: typeof updates.confidenceRating === 'number' ? updates.confidenceRating : flashcard.confidenceRating
    };
  };