// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
    signInWithPopup,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider()

//Example of using onAuthStateChanged to monitor the authentication state:
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;
    console.log("User signed in:", uid);
    // ...
  } else {
    // User is signed out
    console.log("User signed out");
    // ...
  }
});

const handleGoogleSignIn = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    // This gives you a Google AuthResponse.  You'll likely want to use `result.user.uid`
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken; //Optional
    const user = result.user;
    console.log(user);
    // Access user information: user.displayName, user.email, user.uid, etc.
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    // Handle the error appropriately
  }
};

// Sign-up
const signUp = (email, password) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up successfully.
      const user = userCredential.user;
      console.log("User created:", user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Sign-up error:", errorCode, errorMessage);
      // ... handle error
    });
};

// Sign-in
const signIn = (email, password) => {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in successfully.
      const user = userCredential.user;
      console.log("User signed in:", user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Sign-in error:", errorCode, errorMessage);
      // ... handle error
    });
};

// Sign-out
const signOutUser = () => {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      console.log("User signed out");
    })
    .catch((error) => {
      // An error happened.
      console.error("Sign-out error:", error);
    });
};

export {auth, signIn, signUp, signOutUser, handleGoogleSignIn};