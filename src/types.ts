/* eslint-disable @typescript-eslint/no-explicit-any */
// Types for Star Wars API (only the parts we use in the app)
export type Hero = {
  name: string;
  url: string;
  films: string[];
  starships: string[];
  [k: string]: any;
};

export type Film = {
  title: string;
  url: string;
  starships: string[];
  [k: string]: any;
};

export type Starship = {
  name: string;
  url: string;
  [k: string]: any;
};