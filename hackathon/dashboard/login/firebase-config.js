import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";

import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAupV_FRjDQ9kOjqL3RgGIMUnKDGR0dtFw",
    authDomain: "login-3105f.firebaseapp.com",
    projectId: "login-3105f",
    storageBucket: "login-3105f.firebasestorage.app",
    messagingSenderId: "11569568424",
    appId: "1:11569568424:web:b64f2b122110fb909a409d",
    measurementId: "G-53E8GZMCSY"
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// export { auth };
