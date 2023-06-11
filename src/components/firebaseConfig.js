// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore';
// import { getStorage } from 'firebase/storage'
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBW_fj-tOboODH3qGIaz19xDAUJWrCBV-s",
  authDomain: "chatnow-b54ff.firebaseapp.com",
  projectId: "chatnow-b54ff",
  storageBucket: "chatnow-b54ff.appspot.com",
  messagingSenderId: "762374597867",
  appId: "1:762374597867:web:16abd2c3dbda0fcd3462ae",
  measurementId: "G-4EW4XNGP1M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
// export const storage = getStorage(app);
// const analytics = getAnalytics(app);