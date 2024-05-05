/* eslint-disable require-jsdoc */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint linebreak-style: ["error", "windows"]*/
import {User} from "./User";

export function buildUser(body: any):User {
  try {
    const user = {
      email: body.email,
      name: body.name,
      isAdmin: false,
    };
    return user;
  } catch (error:any) {
    throw new Error("Error building user" + error.message);
  }
}
