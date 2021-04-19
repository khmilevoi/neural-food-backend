const fs = require("fs/promises");
const Jimp = require("jimp");
const { config } = require("./config");

const { Log } = require("./log");

const log = new Log();

const main = async () => {
  const classes = await loadClasses();

  log.setNumbersOfGroups(classes.length);

  const [train, test] = await Promise.all([loadTrainData(), loadTestData()]);

  await saveString("train.csv", await toCSV(classes, train));
  await saveString("test.csv", await toCSV(classes, test));
};

const saveString = (name, content) => {
  return fs.writeFile(`./resources/data/${name}`, content);
};

const toCSV = async (classes, data) => {
  const items = [];

  for (let index = 0; index < classes.length; ++index) {
    const name = classes[index];
    const paths = data[name];

    log.nextGroup(name);

    const images = await loadImages(paths);

    items.push(images.map((image) => createCsvLine(index, image)));
  }

  const csvData = items.flat(Infinity);

  const lines = [
    createCsvHeader("label", "pixel", config.image.width * config.image.height),
    ...csvData,
  ];

  return lines.join("\n");
};

const createCsvHeader = (id, prefix, size) => {
  return `${id},${Array.from(
    Array(size),
    (_, index) => `${prefix}${index + 1}`
  )}`;
};

const createCsvLine = (id, image) => {
  return `${id},${image.join(",")}`;
};

const loadImages = async (paths) => {
  const images = [];
  log.setNumbersOfImages(paths.length);
  log.nextImage("none", 0);

  for (const path of paths) {
    log.nextImage(path);

    const image = await loadImage(path);

    images.push(image);
  }
  return images;
};

const loadImage = (path) => {
  return toPixelData(`./resources/images/${path}.jpg`);
};

const loadClasses = async () => {
  const data = await fs.readFile("./resources/meta/classes.txt");

  return data
    .toString()
    .split("\n")
    .filter((item) => item.trim() !== "");
};

const loadTrainData = async () => {
  return loadPaths("train");
};

const loadTestData = async () => {
  return loadPaths("test");
};

const loadPaths = async (name) => {
  const data = await fs.readFile(`./resources/meta/${name}.json`);

  return JSON.parse(data.toString());
};

const toPixelData = async (imgPath) => {
  const pixeldata = [];
  const image = await Jimp.read(imgPath);
  await image
    .resize(config.image.width, config.image.height)
    .greyscale()
    .invert()
    .scan(0, 0, config.image.width, config.image.height, (x, y, idx) => {
      let v = image.bitmap.data[idx];
      pixeldata.push(v);
    });

  const [name, type] = imgPath.split("/").reverse();

  await image.write(`./resources/prepared/${type}/${name}`);

  return pixeldata;
};

main();
