import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const podcastsDir = path.join(process.cwd(), 'public', 'podcasts');
    
    if (!fs.existsSync(podcastsDir)) {
       return NextResponse.json([]);
    }

    const files = fs.readdirSync(podcastsDir).filter(file => file.endsWith('.mp3'));

    const podcasts = files.map(file => {
      const filePath = path.join(podcastsDir, file);
      const stats = fs.statSync(filePath);
      
      return {
        id: file.replace('podcast_', '').replace('.mp3', ''),
        filename: file,
        createdAt: stats.birthtime.toISOString(),
        duration: 0, // Placeholder as we don't calculate duration yet
        title: `Podcast ${file.substring(0, 8)}...`, // Placeholder title
      };
    });

    // Sort by newest first
    podcasts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json(podcasts);
  } catch (error) {
    console.error('Error fetching podcasts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
