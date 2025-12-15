import Parser from 'rss-parser';

const parser = new Parser();

export interface Article {
  title: string;
  content: string;
  link: string;
  pubDate: string;
  source: string;
}

export async function fetchRSSFeed(url: string, limit: number = 3): Promise<Article[]> {
  try {
    const feed = await parser.parseURL(url);
    const items = feed.items.slice(0, limit);

    return items.map((item) => ({
      title: item.title || 'Untitled',
      content: item.contentSnippet || item.content || '',
      link: item.link || '',
      pubDate: item.pubDate || new Date().toISOString(),
      source: feed.title || 'Unknown Source',
    }));
  } catch (error) {
    console.error(`Error fetching RSS feed from ${url}:`, error);
    return [];
  }
}

export async function fetchMultipleFeeds(urls: string[], limitPerFeed: number = 3): Promise<Article[]> {
  const promises = urls.map((url) => fetchRSSFeed(url, limitPerFeed));
  const results = await Promise.all(promises);
  return results.flat().sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
}
