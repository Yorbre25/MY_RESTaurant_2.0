/* eslint-disable no-debugger */
import * as v2 from "firebase-functions/v2";
// import {firebaseConfig}
import {initializeApp} from "firebase/app";
import {getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail} from "firebase/auth";
import {addUserData, checkIfAdmin} from "./manageData";
import {buildUser} from "./buildUser";
import {firebaseConfig} from "./firebaseConfig";


initializeApp(firebaseConfig);

export const logIn = v2.https.onRequest((request, response) => {
  const auth = getAuth();
  const password = request.body.password;
  const email = request.body.email;
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const isAdmin = checkIfAdmin(email);
      response.send({user, isAdmin});
    })
    .catch((error) => {
      const errorMessage = error.message;
      response.send(errorMessage);
    });
});

export const signUp = v2.https.onRequest((request, response) => {
  const auth = getAuth();
  const newUser = buildUser(request.body);
  const password = request.body.password;
  createUserWithEmailAndPassword(auth, newUser.email, password)
    .then(async (userCredential) => {
      addUserData(newUser);
      const user = userCredential.user;
      response.send(user);
    })
    .catch((error) => {
      const errorMessage = error.message;
      response.send(errorMessage);
    });
});

export const resetPassword = v2.https.onRequest((request, response) => {
  const auth = getAuth();
  const email = request.body.data.email;
  sendPasswordResetEmail(auth, email)
    .then(() => {
      response.send("Email sent");
    })
    .catch((error) => {
      const errorMessage = error.message;
      response.status(500).send(errorMessage);
    });
});
