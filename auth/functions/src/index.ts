/* eslint-disable no-debugger */
/* eslint-disable no-ex-assign */
import * as v2 from "firebase-functions/v2";
import {initializeApp} from "firebase/app";
import {getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail} from "firebase/auth";
import {addUserData,
  checkIfAdmin,
  makeAdmin} from "./manageData";
import {buildUser} from "./buildUser";
import {firebaseConfig} from "./firebaseConfig";
import {handleLogInError,
  handleSignUpError,
  handleResetPasswordError,
  handlePromoteToAdminError} from "./errorHandler";


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
      error = handleLogInError(error);
      response.status(error.code).send(error.message);
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
      error = handleSignUpError(error);
      response.status(error.code).send(error.message);
    });
});

export const resetPassword = v2.https.onRequest((request, response) => {
  const auth = getAuth();
  const email = request.body.email;
  sendPasswordResetEmail(auth, email)
    .then(() => {
      response.send("Email sent");
    })
    .catch((error) => {
      error = handleResetPasswordError(error);
      response.status(error.code).send(error.message);
    });
});

export const prmoteToAdmin = v2.https.onRequest((request, response) => {
  try {
    debugger;
    const email = request.body.email;
    makeAdmin(email);
    response.send("User is now an admin");
  } catch (error:any) {
    error = handlePromoteToAdminError(error);
    response.status(error.code).send(error.message);
  }
});

