import cors from "cors";
import express from "express";
import * as firebase from "firebase-admin";
import fsSync from "fs";
import fs from "fs/promises";
import http from "http";
import path from "path";


const createModelFolder = () => {
  const files = fsSync.readdirSync("./");
  
  if (!files.includes("model")) {
    fsSync.mkdirSync("./model");
  }
};
createModelFolder();

const createStorage = () => {
  
  const file = process.env.ADMINSDK ?? "{}";
  
  const credential = JSON.parse(JSON.parse(`"${file}"`));
  
  firebase.initializeApp({
    credential: firebase.credential.cert(credential),
    storageBucket: "gs://neural-food-model.appspot.com",
  });
  
  return firebase.storage().bucket();
}

const storage = createStorage();

export const app = express();

app.use(cors());

app.get<{ file: string }>("/model/:file", async (req, res) => {
  const { file } = req.params;
  
  const files = await fs.readdir('./model');
  
  const pathToFile = path.resolve(`./model/${file}`)
  
  if (!files.includes(file)) {
    const response = storage.file(file);
    
    await response.download({
      destination: pathToFile
    });
  }
  
  res.download(pathToFile);
});

app.use("/labels", express.static("resources/labels.json"));
app.use("/meta", express.static("meta.json"));

export const server = http
  .createServer(app)
  .listen(process.env.PORT || 3000, () => {
    console.log("Started on", process.env.PORT || 3000);
  });
