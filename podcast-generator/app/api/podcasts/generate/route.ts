import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { db, Podcast } from '@/lib/store';
import { generatePodcast } from '@/lib/generator';

export async function POST() {
  try {
    const podcastId = uuidv4();
    const newPodcast: Podcast = {
      id: podcastId,
      title: `Daily Briefing - ${new Date().toLocaleDateString()}`,
      createdAt: new Date().toISOString(),
      duration: 0,
      audioPath: '',
      status: 'PENDING',
    };

    db.addPodcast(newPodcast);

    // Trigger async generation
    generatePodcast(podcastId).catch(err => console.error("Generation failed in background:", err));

    return NextResponse.json({ podcastId, status: 'PENDING' }, { status: 202 });
  } catch (error: any) {
    console.error("Trigger generation error:", error);
    return NextResponse.json({ error: 'Failed to trigger generation', details: error.message }, { status: 500 });
  }
}
