import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBpFTcgAn0yVqbePVFfTYd_HLfIJvSof4M",
  authDomain: "petsforhome-f9b8b.firebaseapp.com",
  projectId: "petsforhome-f9b8b",
  storageBucket: "petsforhome-f9b8b.appspot.com",
  messagingSenderId: "101006896078",
  appId: "1:101006896078:web:2b959177fb1a504775999f"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

export { db, auth };
