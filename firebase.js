import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Tumhara Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyB9F05C2s-sOFrJnH-ONPfpOjpjZA2Fcl8",
    authDomain: "ai-attandance-102e6.firebaseapp.com",
    projectId: "ai-attandance-102e6",
    storageBucket: "ai-attandance-102e6.firebasestorage.app",
    messagingSenderId: "767770137734",
    appId: "1:767770137734:web:24bf9465aae5952d2c6d07",
    measurementId: "G-KYMGVRVGC2"
};

// Firebase initialize karo
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DB ko export karo taaki app.js use kar sake
export { db };