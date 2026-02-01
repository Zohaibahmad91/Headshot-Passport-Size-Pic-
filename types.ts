
export enum AppState {
  HOME = 'HOME',
  PROCESSING = 'PROCESSING',
  RESULT = 'RESULT'
}

export enum PhotoMode {
  HEADSHOT = 'HEADSHOT',
  PASSPORT = 'PASSPORT'
}

export interface ProcessingOptions {
  background: string;
  attire: string;
  enhancementLevel: number;
}

export interface GeneratedImage {
  url: string;
  type: PhotoMode;
}
