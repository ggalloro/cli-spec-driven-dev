import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { v4 as uuidv4 } from 'uuid';
import { db, Feed } from '@/lib/store';

const parser = new Parser();

export async function GET() {
  try {
    const feeds = db.getFeeds();
    return NextResponse.json(feeds);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch feeds' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Validate URL and fetch title
    let feedTitle = 'Unknown Feed';
    try {
      const feed = await parser.parseURL(url);
      feedTitle = feed.title || 'Unknown Feed';
    } catch (err) {
      return NextResponse.json({ error: 'Invalid RSS feed URL' }, { status: 400 });
    }

    const newFeed: Feed = {
      id: uuidv4(),
      url,
      title: feedTitle,
      addedAt: new Date().toISOString(),
    };

    db.addFeed(newFeed);

    return NextResponse.json(newFeed, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add feed' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Feed ID is required' }, { status: 400 });
    }

    db.deleteFeed(id);

    return NextResponse.json({ message: 'Feed deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete feed' }, { status: 500 });
  }
}
