import Parser from 'rss-parser';

const parser = new Parser();

export interface RSSItem {
  title: string;
  content: string;
  link: string;
  pubDate?: string;
}

export async function fetchFeedItems(url: string, limit = 3): Promise<RSSItem[]> {
  try {
    const feed = await parser.parseURL(url);
    
    // items is usually sorted by date in RSS, but we take first 'limit'
    return feed.items.slice(0, limit).map(item => ({
      title: item.title || 'Untitled',
      content: item.contentSnippet || item.content || '',
      link: item.link || '',
      pubDate: item.pubDate,
    }));
  } catch (error) {
    console.error(`Error fetching RSS feed ${url}:`, error);
    return [];
  }
}
