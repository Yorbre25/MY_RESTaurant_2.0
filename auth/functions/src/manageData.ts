/* eslint-disable require-jsdoc */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint linebreak-style: ["error", "windows"]*/
import * as fs from "fs";
import {User} from "./User";

const fileName = "users.json";

function readFile():any {
  let users: User[] = [];
  try {
    const file = fs.readFileSync(fileName);
    if (file.length > 0) {
      users = JSON.parse(file.toString());
    }
    return users;
  } catch (error: any) {
    if (error.code === "ENOENT") {
      fs.writeFileSync(fileName, "[]");
      return readFile();
    }
    throw new Error("Error reading file" + error.message);
  }
}

function addUser(users: User[], newUser: User) {
  users.push(newUser);
  fs.writeFileSync(fileName, JSON.stringify(users, null, 4), "utf8");
}


export function addUserData(user : User) {
  const users = readFile();
  addUser(users, user);
}

export function checkIfAdmin(email: string): boolean {
  const users = readFile();
  const admin = users.find((user:any) => user.email === email && user.isAdmin);
  return admin ? true : false;
}
