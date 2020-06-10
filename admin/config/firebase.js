import * as firebase from 'firebase';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBLG6FenqQlciOp_msrJDvk9Bfxv0sLAlY",
  authDomain: "smserviceapp.firebaseapp.com",
  databaseURL: "https://smserviceapp.firebaseio.com",
  projectId: "smserviceapp",
  storageBucket: "smserviceapp.appspot.com",
  messagingSenderId: "989525021699",
  appId: "1:989525021699:web:50e2b574a1dad04207ea36",
  measurementId: "G-3CY15BLDNN"
};

firebase.initializeApp(firebaseConfig);


export const database = firebase.database();
export const auth = firebase.auth();
export const storage = firebase.storage();
