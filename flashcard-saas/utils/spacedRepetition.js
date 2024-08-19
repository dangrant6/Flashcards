// utils/spacedRepetition.js

export function calculateNextReview(flashcard, confidenceRating) {
    let { interval, easeFactor } = flashcard;
    
    if (confidenceRating >= 3) {
      if (interval === 0) {
        interval = 1;
      } else if (interval === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }
      
      easeFactor = easeFactor + (0.1 - (5 - confidenceRating) * (0.08 + (5 - confidenceRating) * 0.02));
    } else {
      interval = 1;
      easeFactor = Math.max(1.3, easeFactor - 0.2);
    }
    
    easeFactor = Math.max(1.3, Math.min(2.5, easeFactor));
    
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + interval);
    
    return {
      nextReviewDate,
      interval,
      easeFactor
    };
  }