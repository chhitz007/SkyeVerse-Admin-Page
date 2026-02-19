import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBPW9j8Eqys7n3kLFBqMCFyZFdSEDJBnas",
    authDomain: "skyeverse-root.firebaseapp.com",
    projectId: "skyeverse-root",
    storageBucket: "skyeverse-root.firebasestorage.app",
    messagingSenderId: "650984507278",
    appId: "1:650984507278:web:b8b861695498ad63c186df"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
