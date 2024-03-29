// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-b507b.firebaseapp.com",
  projectId: "mern-blog-b507b",
  storageBucket: "mern-blog-b507b.appspot.com",
  messagingSenderId: "138259218935",
  appId: "1:138259218935:web:a89e82aeb7be2a38026ef2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
