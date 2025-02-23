import { auth } from "./firebase-config.js";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    GoogleAuthProvider, 
    signInWithPopup 
} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";

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
const database = getDatabase(app)

// Register Function
document.querySelector(".sign-up-container button").addEventListener("click", async (e) => {
    e.preventDefault();
    const email = document.querySelector(".sign-up-container input[name='email']").value;
    const password = document.querySelector(".sign-up-container input[type='password']").value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        alert("Registration Successful");
        console.log(userCredential.user);
    } catch (error) {
        alert(error.message);
    }
});

// Login Function
document.querySelector(".sign-in-container button").addEventListener("click", async (e) => {
    e.preventDefault();
    const email = document.querySelector(".sign-in-container input[name='email']").value;
    const password = document.querySelector(".sign-in-container input[type='password']").value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        alert("Successful Login");
        localStorage.setItem('uid',userCredential.user.uid)
        console.log(userCredential)

        // Redirect to main index.html inside the hackathon folder
        window.location.href = "../index.html";
    } catch (error) {
        console.log(error)
        alert(error.message);
    }
});

// Google Login
document.querySelectorAll(".social-container a").forEach((googleBtn) => {
    googleBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            alert("Google Sign-In Successful");
            localStorage.setItem('uid',result.user.uid)

            // Redirect to main index.html inside the hackathon folder
            window.location.href = "../index.html";
        } catch (error) {
            alert(error.message);
        }
    });
});

// Logout (Optional)
document.querySelector("#logoutButton")?.addEventListener("click", async () => {
    try {
        await signOut(auth);
        localStorage.removeItem('uid')
        alert("Logged Out");
    } catch (error) {
        alert(error.message);
    }
});
