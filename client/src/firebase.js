// Firebase 클라이언트 초기화
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCXQe_48c4O1e4SQ0C07KOjuf1S1LO_7WI",
  authDomain: "haru-assistant-a314b.firebaseapp.com",
  projectId: "haru-assistant-a314b",
  storageBucket: "haru-assistant-a314b.firebasestorage.app",
  messagingSenderId: "693683195092",
  appId: "1:693683195092:web:9388308b9fa089182f7f41",
  measurementId: "G-5WT4RJV7T2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };