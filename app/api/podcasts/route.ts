import { NextResponse } from 'next/server';
import { getPodcasts } from '@/lib/storage';

export async function GET() {
  const podcasts = getPodcasts();
  // Sort by newest first
  const sortedPodcasts = podcasts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return NextResponse.json(sortedPodcasts);
}
