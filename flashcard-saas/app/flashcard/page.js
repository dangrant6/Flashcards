// app/flashcard/page.js
import dynamic from 'next/dynamic';
import Navbar from '../../components/navbar';

const FlashcardContent = dynamic(() => import('./FlashcardContent'), {
  ssr: false,
});

export default function FlashcardPage() {
  return (
    <>
      <Navbar />
      <FlashcardContent />
    </>
  );
}