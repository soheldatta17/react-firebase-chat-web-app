// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "@firebase/firestore";


const firebaseConfig = {

  apiKey: "AIzaSyCPhNGjB0jsHW1pRx0jPCZ92ixzivMWSCw",

  authDomain: "sports-23788.firebaseapp.com",

  projectId: "sports-23788",

  storageBucket: "sports-23788.appspot.com",

  messagingSenderId: "369133702550",

  appId: "1:369133702550:web:39e4ff8aef3bcf746761b7",

  measurementId: "G-BR34XKS6Y3"

};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();