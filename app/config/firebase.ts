import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAW4eFXrZoxCd6NPRhdLw0obfTPqoQRxHA",
  authDomain: "socialmedia-app-a02cb.firebaseapp.com",
  projectId: "socialmedia-app-a02cb",
  storageBucket: "socialmedia-app-a02cb.firebasestorage.app",
  messagingSenderId: "46512357142",
  appId: "1:46512357142:web:ca47a9cdb682cda4375a37",
  measurementId: "G-PZE3D0J76K",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const provider = new GoogleAuthProvider();

export default app;
