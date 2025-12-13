import fs from 'fs';
import path from 'path';

export interface Feed {
  id: string;
  url: string;
  title: string;
  addedAt: string;
}

export interface Podcast {
  id: string;
  title: string;
  createdAt: string;
  audioFilePath: string;
  durationSeconds: number;
  articlesIncluded: number;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const FEEDS_FILE = path.join(DATA_DIR, 'feeds.json');
const PODCASTS_FILE = path.join(DATA_DIR, 'podcasts.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readData<T>(filePath: string): T[] {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data) as T[];
  } catch (error) {
    console.error(`Error reading data from ${filePath}:`, error);
    return [];
  }
}

function writeData<T>(filePath: string, data: T[]): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error(`Error writing data to ${filePath}:`, error);
  }
}

export const getFeeds = (): Feed[] => readData<Feed>(FEEDS_FILE);
export const saveFeeds = (feeds: Feed[]): void => writeData<Feed>(FEEDS_FILE, feeds);

export const getPodcasts = (): Podcast[] => readData<Podcast>(PODCASTS_FILE);
export const savePodcasts = (podcasts: Podcast[]): void => writeData<Podcast>(PODCASTS_FILE, podcasts);
