// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {

  apiKey: "AIzaSyDvfeuGgx_jgGnhsA-zVX3SqzR14afbgp0",

  authDomain: "chat-6b730.firebaseapp.com",

  databaseURL: "https://chat-6b730-default-rtdb.asia-southeast1.firebasedatabase.app",

  projectId: "chat-6b730",

  storageBucket: "chat-6b730.appspot.com",

  messagingSenderId: "184086105188",

  appId: "1:184086105188:web:e4f604b7baa242341ae371",

  measurementId: "G-ZT55R2KZN7"

};




// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
