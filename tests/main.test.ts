import { app } from "bootstrap";
import fs from "fs/promises";
import path from "path";
import request from "supertest";

const createMockFile = (name: string, content: string) => {
  return fs.writeFile(path.join("resources", name), content);
};

describe("main", function () {
  beforeAll(async () => {
    const dirs = await fs.readdir(".");

    if (!dirs.includes("resources")) {
      await fs.mkdir("resources");
    }

    const files = await fs.readdir("resources");

    if (!files.includes("model.json")) {
      await createMockFile("model.json", JSON.stringify({}));
    }

    if (!files.includes("labels.txt")) {
      await createMockFile("labels.txt", ["1", "2"].join("\n"));
    }
  });

  it("should load model", async function () {
    const response = await request(app).get("/model");

    expect(response.status).toBe(200);
  });

  it("should load labels", async function () {
    const response = await request(app).get("/labels");

    expect(response.body.list.length).not.toBeUndefined();
    expect(response.status).toBe(200);
  });
});
