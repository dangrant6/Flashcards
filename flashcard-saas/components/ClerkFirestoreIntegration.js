// components/ClerkFirestoreIntegration.js
import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { doc, setDoc } from 'firebase/firestore';
import db from '../firebase'; // Adjust this import based on your project structure

"use client";

export default function ClerkFirestoreIntegration() {
  const { user } = useUser();

  useEffect(() => {
    async function updateUserDocument() {
      if (user) {
        console.log('Clerk user authenticated:', user.id);
        const userDocRef = doc(db, 'users', user.id);
        try {
          await setDoc(userDocRef, { clerkUserId: user.id }, { merge: true });
          console.log('User document created/updated in Firestore');
        } catch (error) {
          console.error('Error updating Firestore:', error);
        }
      }
    }
    
    updateUserDocument();
  }, [user]);

  return null; // This component doesn't render anything
}