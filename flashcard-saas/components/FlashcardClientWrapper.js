// components/FlashcardClientWrapper.js
'use client';

import { useSearchParams } from 'next/navigation';
import Flashcard from '../app/flashcard/page';  // Adjust the import path as needed

export default function FlashcardClientWrapper() {
  const searchParams = useSearchParams();
  return <Flashcard searchParams={searchParams} />;
}