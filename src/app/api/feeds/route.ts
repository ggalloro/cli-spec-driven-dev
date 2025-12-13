import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import Parser from 'rss-parser';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const parser = new Parser();
    let feedTitle = '';

    try {
      const feed = await parser.parseURL(url);
      feedTitle = feed.title || 'Untitled Feed';
    } catch (error) {
       console.error("Error parsing RSS feed:", error);
       return NextResponse.json({ error: 'Invalid RSS feed URL' }, { status: 400 });
    }

    const newFeed = await prisma.feed.create({
      data: {
        url,
        title: feedTitle,
      },
    });

    return NextResponse.json(newFeed);
  } catch (error) {
    console.error("Error creating feed:", error);
    return NextResponse.json({ error: 'Failed to create feed' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const feeds = await prisma.feed.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(feeds);
  } catch (error) {
    console.error("Error fetching feeds:", error);
    return NextResponse.json({ error: 'Failed to fetch feeds' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await prisma.feed.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting feed:", error);
    return NextResponse.json({ error: 'Failed to delete feed' }, { status: 500 });
  }
}