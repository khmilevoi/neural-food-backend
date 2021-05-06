import cors from "cors";
import express from "express";
import http from "http";
import {generateLabelsFromFile} from "labels";


const isLabels = process.argv[2] === "labels";

if (isLabels) {
    generateLabelsFromFile().then();
}

export const app = express();

app.use(cors());

app.use("/model", express.static("resources/model"));
app.use("/labels", express.static("resources/labels.json"));

export const server = http
    .createServer(app)
    .listen(process.env.PORT || 3000, () => {
        console.log("Started on", process.env.PORT || 3000);
    });
