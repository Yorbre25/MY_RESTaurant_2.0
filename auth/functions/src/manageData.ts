/* eslint-disable no-debugger */
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

export function makeAdmin(email: string) {
  debugger;
  const users = readFile();
  const user = users.find((user:any) => user.email === email);
  if (user) {
    user.isAdmin = true;
    fs.writeFileSync(fileName, JSON.stringify(users, null, 4), "utf8");
  } else {
    throw new Error("User not found");
  }
}

export function checkIfAdmin(email: string): boolean {
  const users = readFile();
  const admin = users.find((user:any) => user.email === email && user.isAdmin);
  return admin ? true : false;
}
