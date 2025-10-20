// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA1-x24mDIebpvRC6FthbWvK1lXMaEPLUg",
  authDomain: "crossword--25.firebaseapp.com",
  projectId: "crossword--25",
  storageBucket: "crossword--25.firebasestorage.app",
  messagingSenderId: "1047114940255",
  appId: "1:1047114940255:web:7264fce491405d178c40ea",
  measurementId: "G-TLSWNESD2Z"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);


export async function signInWithGoogle() {
const result = await signInWithPopup(auth, provider);
return result.user;
}


export async function ensureUserProfile(uid, profile) {
const ref = doc(db, 'users', uid);
const snap = await getDoc(ref);
if (!snap.exists()) {
await setDoc(ref, profile);
}
}

