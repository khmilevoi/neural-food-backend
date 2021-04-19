const fs = require("fs/promises");
const Jimp = require("jimp");
const {config} = require("./config");

const main = async () => {
    const classes = await loadClasses();

    console.log("data loading")

    const [train, test] = await Promise.all([loadTrainData(), loadTestData()]);

    console.log("saving");

    await Promise.all([
        saveString("train.csv", await toCSV(classes, train)),
        saveString("test.csv", await toCSV(classes, test)),
    ]);
};

const saveString = (name, content) => {
    return fs.writeFile(`./resources/data/${name}`, content);
};

const toCSV = async (classes, data) => {
    const promises = classes.map(async (name, index) => {
        const paths = data[name];

        const images = await loadImages(paths);

        console.log("name", index);

        return images.map((image) => createCsvLine(index, image));
    });

    const csvData = (await Promise.all(promises)).flat(Infinity);

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
    const promises = paths.slice(0, 10).map((path) => loadImage(path));

    return await Promise.all(promises);
};

const loadImage = (path) => {
    return toPixelData(`./resources/images/${path}.jpg`);
};

const loadClasses = async () => {
    const data = await fs.readFile("./resources/meta/classes.txt");

    return data.toString().split("\n").filter(item => item.trim() !== "");
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

    image.write(`./resources/prepared/${type}/${name}`);

    return pixeldata;
};

main();
