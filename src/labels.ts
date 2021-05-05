import SerpApi from 'google-search-results-nodejs'
import fs from 'fs/promises'

const search = new SerpApi.GoogleSearch("d0f12a55372c985edd4c9a27bfb57b29cea0b4ac05c041ce5ed043796485eee8")

const getImages = (name: string) => {
    const params: SerpApi.Params = {
        q: name,
        tbm: "isch",
        ijn: "0"
    }
    
    return new Promise<SerpApi.ImageDescriptor[]>(resolve => {
        search.json(params, data => {
            resolve(data.images_results)
        })
    })
}

const generateLabels = async (labels: string[]) => {
    const sorted = labels.sort()
    
    const promises = sorted.map(async (name) => {
      const [image] = await getImages(name);

      return image;
    });
    
    const images = await Promise.all(promises);
    
    return images.map((image, index) => {
        const name = sorted[index];
        
        return {
            title: name,
            image: image.thumbnail
        }
    })
}

export const generateLabelsFromFile = async () => {
    const source = await fs.readFile("./resources/label-list.txt");
    const labels = source.toString().trim().split("\n");
    
    const result = await generateLabels(labels);
    
    await fs.writeFile("./resources/labels.json", JSON.stringify(result));
}
