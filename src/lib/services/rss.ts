import Parser from 'rss-parser';

const parser = new Parser();

export interface Article {
  title: string;
  content: string; // or description/summary
  source: string;
  pubDate: string;
}

export async function fetchLatestArticles(feeds: { url: string; title: string }[]): Promise<Article[]> {
  const articles: Article[] = [];
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  for (const feed of feeds) {
    try {
      const parsedFeed = await parser.parseURL(feed.url);
      
      parsedFeed.items.forEach(item => {
        const pubDate = item.pubDate ? new Date(item.pubDate) : new Date();
        
        // Filter articles from the last 24 hours
        if (pubDate >= oneDayAgo) {
          articles.push({
            title: item.title || 'Untitled',
            content: item.contentSnippet || item.content || item.summary || '',
            source: feed.title,
            pubDate: pubDate.toISOString()
          });
        }
      });
    } catch (error) {
      console.error(`Error fetching feed ${feed.url}:`, error);
      // Continue with other feeds even if one fails
    }
  }

  return articles;
}
