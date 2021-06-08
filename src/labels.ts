import fs from "fs/promises";
import SerpApi from "google-search-results-nodejs";
import https from "https";

const search = new SerpApi.GoogleSearch(process.env.SERP_API);

const loadImage = (url: string) => {
  return new Promise<Buffer>((resolve) => {
    https.get(url, (response) => {
      const chunks: Buffer[] = [];

      response.on("data", (chunk) => chunks.push(chunk));

      response.on("end", () => {
        resolve(Buffer.concat(chunks));
      });
    });
  });
};

const getImages = (name: string) => {
  const params: SerpApi.Params = {
    q: name,
    tbm: "isch",
    ijn: "0",
  };

  return new Promise<SerpApi.ImageDescriptor[]>((resolve) => {
    search.json(params, (data) => {
      resolve(data.images_results);
    });
  });
};

const generateLabels = async (labels: string[]) => {
  const sorted = labels.sort();

  const promises = sorted.map(async (name) => {
    const [image] = await getImages(name);

    const buffer = await loadImage(image.thumbnail)
    
    return buffer.toString("base64");
  });

  const images = await Promise.all(promises);

  return images.map((image, index) => {
    const name = sorted[index];

    return {
      title: name,
      image: image,
    };
  });
};

export const generateLabelsFromFile = async () => {
  const source = await fs.readFile("./resources/label-list.txt");
  const labels = source.toString().trim().split("\n");

  const result = await generateLabels(labels);

  await fs.writeFile("./resources/labels.json", JSON.stringify(result));
};
