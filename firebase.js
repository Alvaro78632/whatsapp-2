import firebase from "firebase"
// import * as firebase from './firebase'

const firebaseConfig = {
    apiKey: "AIzaSyC99pE3I5UwEXACiOz9GJgjrEhi8lEajwA",
    authDomain: "whatsapp-2-8d7a4.firebaseapp.com",
    projectId: "whatsapp-2-8d7a4",
    storageBucket: "whatsapp-2-8d7a4.appspot.com",
    messagingSenderId: "819898392601",
    appId: "1:819898392601:web:64d46e60d58f5293e08a88",
    measurementId: "G-82S0Y0VGJY"
  };

const app = !firebase.apps.length
? firebase.initializeApp(firebaseConfig) 
: firebase.app();

// const app = firebase.initializeApp(firebaseConfig) 

const db = firebase.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db ,auth, provider }