// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCcPTSzm-8zq911Fd-WsWB6zp4-Z-rmpnY",
  authDomain: "appgim-f6b36.firebaseapp.com",
  projectId: "appgim-f6b36",
  storageBucket: "appgim-f6b36.firebasestorage.app",
  messagingSenderId: "1085532517987",
  appId: "1:1085532517987:web:b641f0d02a285e04c22a56",
  measurementId: "G-X0XE5FPL98"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);