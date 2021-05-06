import cors from "cors";
import express, {Request} from "express";
import {fileMapper} from "file-mapper";
import http from "http";
import https from "https";
import {generateLabelsFromFile} from "labels";


const isLabels = process.argv[2] === "labels";

if (isLabels) {
    generateLabelsFromFile().then();
}

export const app = express();

app.get("/model/:file", (req: Request<{ file: keyof typeof fileMapper }>, res) => {
    const {file} = req.params;
    const proxy = fileMapper[file];
    
    if (proxy) {
        const [ext] = file.split(".").reverse();
        
        res.setHeader("Content-type", contentTypeByExtension(ext));
        
        https.get(proxy, externalRes => {
            const body: Buffer[] = [];
            
            externalRes.on("data", chunk => body.push(chunk));
            
            externalRes.on("end", () => {
                const buffer = Buffer.concat(body);
                res.setHeader("Content-Length", buffer.length)
                res.status(200);
                res.end(buffer);
            });
        });
    } else {
        res.status(404);
        res.end();
    }
});

const contentTypeByExtension = (ext: string) => {
    if (ext === "bin") {
        return "application/x-binary";
    }
    
    if (ext === "json") {
        return "application/json";
    }
    
    return "text/plain";
};

app.use(cors());
app.use("/labels", express.static("resources/labels.json"));

export const server = http
    .createServer(app)
    .listen(process.env.PORT || 3000, () => {
        console.log("Started on", process.env.PORT || 3000);
    });
