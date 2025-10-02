// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, doc, collection, setDoc, getDoc, updateDoc } from "firebase/firestore";
//sets up Authentication
import { getAuth } from "firebase/auth"; //



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDHOq__gt6HEkEkCDfxquDCpSheirR5qEA",
  authDomain: "bingelog-e89f5.firebaseapp.com",
  projectId: "bingelog-e89f5",
  storageBucket: "bingelog-e89f5.firebasestorage.app",
  messagingSenderId: "1027526846013",
  appId: "1:1027526846013:web:ac40efa1ca0b6c4e50ec54",
  measurementId: "G-N05RJMX3YG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export helpers so other files can use them
const db = getFirestore(app);
export const auth = getAuth(app);

//export app, db, and auth to be used in app in othe modules
export {app, db};

