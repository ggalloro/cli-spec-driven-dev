import { NextResponse } from 'next/server';
import { db } from '@/lib/store';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const podcast = db.getPodcast(id);

  if (!podcast) {
    return NextResponse.json({ error: 'Podcast not found' }, { status: 404 });
  }

  return NextResponse.json(podcast);
}
