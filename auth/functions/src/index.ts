/* eslint-disable no-debugger */
// import { app } from "firebase-admin";
import * as v2 from "firebase-functions/v2";
// import * as admin from "firebase-admin";
import {initializeApp} from "firebase/app";
import {getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword} from "firebase/auth";
// import {getFirestore,
//   collection,
//   doc, setDoc, getDocs} from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAsfx-2QWa8e1lX5Dv9TRf1WXdmsXNBAT0",
  authDomain: "my-rest-raurant-2.firebaseapp.com",
  projectId: "my-rest-raurant-2",
  storageBucket: "my-rest-raurant-2.appspot.com",
  messagingSenderId: "59314081117",
  appId: "1:59314081117:web:fac699fd4cf982ca6f6cb4",
  measurementId: "G-ZXHJN212BP",
};


initializeApp(firebaseConfig);
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

export const logIn = v2.https.onRequest((request, response) => {
//   debugger;
  const auth = getAuth();
  const email = request.body.email;
  const password = request.body.password;
  // USAR FIRESTORE PARA VALIDAR SI ES ADMIN
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      response.send(user);
    })
    .catch((error) => {
    //   const errorCode = error.code;
      const errorMessage = error.message;
      response.send(errorMessage);
    });
});

export const signUp = v2.https.onRequest((request, response) => {
//   debugger;
  const auth = getAuth();
  // const name = request.body.name;
  const email = request.body.email;
  const password = request.body.password;
  createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;
      response.send(user);
    })
    .catch((error) => {
      //   const errorCode = error.code;
      const errorMessage = error.message;
      response.send(errorMessage);
    });
});

