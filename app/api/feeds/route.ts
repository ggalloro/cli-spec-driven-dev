import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getFeeds, saveFeeds, Feed } from '@/lib/storage';
import { fetchFeedTitle } from '@/lib/rss';

export async function GET() {
  const feeds = getFeeds();
  return NextResponse.json(feeds);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const title = await fetchFeedTitle(url);
    const newFeed: Feed = {
      id: uuidv4(),
      url,
      title,
      addedAt: new Date().toISOString(),
    };

    const feeds = getFeeds();
    feeds.push(newFeed);
    saveFeeds(feeds);

    return NextResponse.json(newFeed, { status: 201 });
  } catch (error) {
    console.error('Error adding feed:', error);
    return NextResponse.json({ error: 'Failed to add feed' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const feeds = getFeeds();
    const filteredFeeds = feeds.filter(feed => feed.id !== id);
    
    if (feeds.length === filteredFeeds.length) {
         return NextResponse.json({ error: 'Feed not found' }, { status: 404 });
    }

    saveFeeds(filteredFeeds);
    return NextResponse.json({ message: 'Feed deleted successfully' });
}
