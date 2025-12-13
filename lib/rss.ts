import Parser from 'rss-parser';

const parser = new Parser();

export interface Article {
  title: string;
  content: string;
  link: string;
  pubDate?: string;
}

export async function fetchLatestArticles(feedUrl: string, limit: number = 5): Promise<Article[]> {
  try {
    const feed = await parser.parseURL(feedUrl);
    
    // Transform items to a cleaner Article format
    const articles: Article[] = feed.items.slice(0, limit).map((item) => ({
      title: item.title || 'No Title',
      // Prefer contentSnippet, then content, then summary
      content: item.contentSnippet || item.content || item.summary || '', 
      link: item.link || '',
      pubDate: item.pubDate,
    }));

    return articles;
  } catch (error) {
    console.error(`Error fetching RSS feed from ${feedUrl}:`, error);
    throw new Error(`Failed to fetch RSS feed: ${feedUrl}`);
  }
}

export async function fetchFeedTitle(feedUrl: string): Promise<string> {
    try {
        const feed = await parser.parseURL(feedUrl);
        return feed.title || 'Unknown Feed';
    } catch (error) {
        console.error(`Error fetching feed title from ${feedUrl}:`, error);
        return 'Unknown Feed';
    }
}
