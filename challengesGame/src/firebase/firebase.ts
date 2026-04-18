import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCUySEbfCqgugK8Ln8lCjeiq3yuzsy7tS8",
  authDomain: "parcialmobile.firebaseapp.com",
  projectId: "parcialmobile",
  storageBucket: "parcialmobile.firebasestorage.app",
  messagingSenderId: "762845023785",
  appId: "1:762845023785:web:b1e29cc744719afc3d5638",
  measurementId: "G-7CFS976W78"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);




