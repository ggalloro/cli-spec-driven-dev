import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import Parser from 'rss-parser';

const parser = new Parser();

// GET /api/feeds - List all feeds
export async function GET() {
  try {
    const feeds = await prisma.feed.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(feeds);
  } catch (error) {
    console.error("Error fetching feeds:", error);
    return NextResponse.json({ error: 'Failed to fetch feeds' }, { status: 500 });
  }
}

// POST /api/feeds - Add a new feed
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Validate RSS URL and extract title
    let feedTitle = 'Unknown Feed';
    try {
      const parsed = await parser.parseURL(url);
      feedTitle = parsed.title || 'Unknown Feed';
    } catch (e) {
      return NextResponse.json({ error: 'Invalid RSS URL' }, { status: 400 });
    }

    const feed = await prisma.feed.create({
      data: {
        url,
        title: feedTitle,
      },
    });

    return NextResponse.json(feed, { status: 201 });
  } catch (error) {
    console.error("Error adding feed:", error);
    return NextResponse.json({ error: 'Failed to add feed' }, { status: 500 });
  }
}
