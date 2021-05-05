import cors from "cors";
import express, {Request} from "express";
import http from "http";
import https from "https";
import {generateLabelsFromFile} from "labels";
import {fileMapper} from "./file-mapper";
import {createProxyMiddleware} from 'http-proxy-middleware'

const isLabels = process.argv[2] === "labels";

if (isLabels) {
    generateLabelsFromFile().then();
}

export const app = express();

app.use("/model/:file", createProxyMiddleware({
    target: "<TARGET>",
    router: (req) => {
        const {file} = req.params as {file: keyof typeof fileMapper}

        return fileMapper[file]
    }
}));

app.use(cors());
app.use("/labels", express.static("resources/labels.json"));

export const server = http
    .createServer(app)
    .listen(process.env.PORT || 3000, () => {
        console.log("Started on", process.env.PORT || 3000);
    });

const request = (url: string) => {
    return new Promise((resolve) => {
        https.request(url, res => resolve(res))
    })
}