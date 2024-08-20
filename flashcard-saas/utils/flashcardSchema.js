export function isValidFlashcard(flashcard) {
  return (
    flashcard &&
    typeof flashcard.front === 'string' &&
    typeof flashcard.back === 'string' &&
    typeof flashcard.interval === 'number' &&
    typeof flashcard.easeFactor === 'number' &&
    (flashcard.nextReviewDate instanceof Date || flashcard.nextReviewDate === null)
  );
}

export function initializeFlashcard(front, back) {
  return {
    front,
    back,
    interval: 0,
    easeFactor: 2.5,
    nextReviewDate: new Date(),
  };
}

export function updateFlashcardFields(flashcard, updates) {
  return { ...flashcard, ...updates };
}