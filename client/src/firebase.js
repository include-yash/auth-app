// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "auth-app-cb185.firebaseapp.com",
  projectId: "auth-app-cb185",
  storageBucket: "auth-app-cb185.appspot.com",
  messagingSenderId: "592468469628",
  appId: "1:592468469628:web:8820d4024fc4987cc526f9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);