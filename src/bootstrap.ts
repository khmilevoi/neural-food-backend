import cors from "cors";
import express, {Request} from "express";
import http from "http";
import https from "https";
import {generateLabelsFromFile} from "labels";
import {fileMapper} from "file-mapper";


const isLabels = process.argv[2] === "labels";

if (isLabels) {
    generateLabelsFromFile().then();
}

export const app = express();

app.get("/model/:file", (req: Request<{ file: keyof typeof fileMapper }>, res) => {
    const {file} = req.params;
    const proxy = fileMapper[file]
    
    if (proxy) {
        https.get(proxy, externalRes => {
            const body: Buffer[] = [];
            
            externalRes.on("data", chunk => body.push(chunk));
            
            externalRes.on("end", () => res.end(Buffer.concat(body)));
        });
    } else {
        res.status(404);
        res.end();
    }
});

app.use(cors());
app.use("/labels", express.static("resources/labels.json"));

export const server = http
    .createServer(app)
    .listen(process.env.PORT || 3000, () => {
        console.log("Started on", process.env.PORT || 3000);
    });
