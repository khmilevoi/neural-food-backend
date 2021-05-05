declare module "google-search-results-nodejs" {
  namespace SerpApi {
    export type Params = {
      q: string;
      tbm: string;
      ijn: string;
    };

    export type ImageDescriptor = {
      source: string,
      original: string,
      thumbnail: string
    };

    export type Data = {
      images_results: ImageDescriptor[];
    };

    export type Callback<D> = (data: D) => void;

    export class GoogleSearch {
      json: (params: Params, callback: Callback<Data>) => void;

      constructor(secret_key?: string);
    }
  }

  export = SerpApi;
}
