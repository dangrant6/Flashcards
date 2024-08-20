// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCEjygA6w5lXqAX0wtFXnCEukpIFJuUoT4",
  authDomain: "flashcards-2c1a5.firebaseapp.com",
  projectId: "flashcards-2c1a5",
  storageBucket: "flashcards-2c1a5.appspot.com",
  messagingSenderId: "583666050726",
  appId: "1:583666050726:web:252bddf83fc169721cb667",
  measurementId: "G-9BYZM5CZLM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export default db;