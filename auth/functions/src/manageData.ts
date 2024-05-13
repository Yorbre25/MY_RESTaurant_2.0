/* eslint-disable no-debugger */
import {User} from "./User";
import {Storage} from "@google-cloud/storage";

const storage = new Storage();
const bucketName = "userdata-bucket";
const fileName = "users.json";

async function getFile(): Promise<Buffer> {
  try {
    const [file] = await storage.bucket(bucketName).file(fileName).download();
    return file;
  } catch (error:any) {
    console.log("Error reading file" + error.message);
    throw new Error("Error reading file" + error.message);
  }
}

async function saveFile(file: any) {
  await storage.bucket(bucketName).file(fileName).save(file);
}

async function readFile(): Promise<User[]> {
  try {
    const file = await getFile();
    let users: User[] = [];
    if (file.length > 0) {
      users = JSON.parse(file.toString());
    }
    return users;
  } catch (error:any) {
    if (error.code === "ENOENT") {
      saveFile("[]");
      return readFile();
    }
    console.error("Error reading file: " + error.message);
    throw new Error("Error reading file: " + error.message);
  }
}

function addUser(users: User[], newUser: User) {
  users.push(newUser);
  const newData = JSON.stringify(users, null, 4);
  saveFile(newData);
}


export async function addUserData(user : User) {
  const users = await readFile();
  addUser(users, user);
}

export async function makeAdmin(email: string) {
  debugger;
  const users = await readFile();
  const user = users.find((user:any) => user.email === email);
  if (user) {
    user.isAdmin = true;
    const newData = JSON.stringify(users, null, 4);
    saveFile(newData);
  } else {
    throw new Error("User not found");
  }
}

export async function checkIfAdmin(email: string): Promise<boolean> {
  const users = await readFile();
  console.log(users);
  console.log("todo good en checkIfAdmin");
  const admin = users.find((user:any) =>
    user.email === email && user.isAdmin);
  return admin ? true : false;
}

export async function getUsers() {
  const users = await readFile();
  console.log(users);
  return users;
}
