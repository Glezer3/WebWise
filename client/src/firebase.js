// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "webwise-d5c73.firebaseapp.com",
  projectId: "webwise-d5c73",
  storageBucket: "webwise-d5c73.appspot.com",
  messagingSenderId: "100097644620",
  appId: "1:100097644620:web:bc18f0ab53893257bbbce9",
  measurementId: "G-JE7LLYJSFR"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);