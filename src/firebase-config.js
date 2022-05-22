// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
import { getFirestore } from "firebase/firestore"
import { getAuth, GoogleAuthProvider } from "firebase/auth"

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

const firebaseConfig = {

  apiKey: "AIzaSyB0A-zEfSieA6RskIYHQrDF-aDWn_zJhi0",

  authDomain: "kuteblog-ca44d.firebaseapp.com",

  projectId: "kuteblog-ca44d",

  storageBucket: "kuteblog-ca44d.appspot.com",

  messagingSenderId: "882681355197",

  appId: "1:882681355197:web:1c1f4c0394225d063010d4"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)
export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()