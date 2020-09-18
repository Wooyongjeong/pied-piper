import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyASWxN6Po-R6fmn5iMn9YD5P3-jbM6Bwu8",
    authDomain: "pied-piper-64e63.firebaseapp.com",
    databaseURL: "https://pied-piper-64e63.firebaseio.com",
    projectId: "pied-piper-64e63",
    storageBucket: "pied-piper-64e63.appspot.com",
    messagingSenderId: "380398836555",
    appId: "1:380398836555:web:db41a95a5539e088e8a6ce",
    measurementId: "G-1LENCRQP8D"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
