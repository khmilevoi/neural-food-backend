import cors from "cors";
import express from "express";
import fs from "fs/promises";


export const app = express();

app.use(cors());

app.use('/model', express.static("resources/model.json"))

app.get("/labels", async (req, res) => {
    const buffer = await fs.readFile("resources/labels.txt")
    const source = buffer.toString();
    
    const labels = source.split("\n");
    
    res.status(200);
    res.send({
        list: labels.filter(item => item.trim() !== "")
    })
})

export const server = app.listen(3000, () => {
    console.log("Started on 3000 port")
})
