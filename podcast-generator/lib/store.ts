import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

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
  duration: number;
  audioPath: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  transcript?: string;
}

export interface Database {
  feeds: Feed[];
  podcasts: Podcast[];
}

function readDb(): Database {
  if (!fs.existsSync(DB_PATH)) {
    return { feeds: [], podcasts: [] };
  }
  const data = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(data);
}

function writeDb(data: Database): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

export const db = {
  getFeeds: (): Feed[] => {
    return readDb().feeds;
  },
  addFeed: (feed: Feed): void => {
    const data = readDb();
    data.feeds.push(feed);
    writeDb(data);
  },
  deleteFeed: (id: string): void => {
    const data = readDb();
    data.feeds = data.feeds.filter((f) => f.id !== id);
    writeDb(data);
  },
  getPodcasts: (): Podcast[] => {
    return readDb().podcasts;
  },
  getPodcast: (id: string): Podcast | undefined => {
      return readDb().podcasts.find(p => p.id === id);
  },
  addPodcast: (podcast: Podcast): void => {
    const data = readDb();
    data.podcasts.push(podcast);
    writeDb(data);
  },
  updatePodcast: (id: string, updates: Partial<Podcast>): void => {
    const data = readDb();
    const index = data.podcasts.findIndex((p) => p.id === id);
    if (index !== -1) {
      data.podcasts[index] = { ...data.podcasts[index], ...updates };
      writeDb(data);
    }
  },
};
