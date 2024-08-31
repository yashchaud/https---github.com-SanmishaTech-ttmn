// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, deleteUser, updateProfile } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore"; // Importing the Firestore service
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyARXfNSve_ANJH9xR9VeJCAZ5b3ikegvcw",
  authDomain: "ttmn-65f37.firebaseapp.com",
  projectId: "ttmn-65f37",
  storageBucket: "ttmn-65f37.appspot.com",
  messagingSenderId: "497841936728",
  appId: "1:497841936728:web:bee90b9b3c2d0f63f96d2d",
  measurementId: "G-R1FCV94GLD",
};
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const firestore = getFirestore(app); // Initialize Firestore with your Firebase app
export { deleteUser, updateProfile };
