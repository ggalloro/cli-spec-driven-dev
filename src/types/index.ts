export interface Feed {
  id: string;
  url: string;
  title: string;
}

export interface Article {
  title: string;
  link: string;
  content: string; // or description
  pubDate: string;
  source: string;
}

export interface Podcast {
  id: string;
  title: string;
  createdAt: string; // ISO Date
  duration: number; // Seconds
  filePath: string; // Relative path to public/ or storage/
  summary: string; // Brief text summary of what's inside
}

export interface GenerateRequest {
  feedUrls: string[];
}
