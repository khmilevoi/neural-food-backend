import dotenv from 'dotenv'
import cors from "cors";
import express from "express";
import { readFileSync } from "fs";
import https from "https";
import {generateLabelsFromFile} from "labels";

dotenv.config({
    path: "./.env"
});

const isLabels = process.argv[2] === "labels";

if(isLabels) {
    generateLabelsFromFile().then()
}

export const app = express();

app.use(cors());

app.use("/model", express.static("resources/model.json"));
app.use("/labels", express.static("resources/labels.json"));

export const server = https
  .createServer(
    {
      key: readFileSync("./security/key.pem", "utf8"),
      cert: readFileSync("./security/server.crt", "utf8"),
    },
    app
  )
  .listen(3000, () => {
    console.log("Started on 3000 port");
  });
