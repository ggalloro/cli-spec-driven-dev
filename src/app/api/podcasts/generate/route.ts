import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { fetchLatestArticles } from '@/lib/services/rss';
import { generatePodcastScript } from '@/lib/services/gemini';
import { synthesizeSpeech } from '@/lib/services/tts';
import { concatAudioSegments } from '@/lib/services/audio';

// POST /api/podcasts/generate - Generate a new podcast
export async function POST() {
  try {
    // 1. Fetch Active Feeds
    const feeds = await prisma.feed.findMany();
    if (feeds.length === 0) {
      return NextResponse.json({ error: 'No feeds configured' }, { status: 400 });
    }

    // 2. Fetch Latest Articles
    console.log("Fetching articles...");
    const articles = await fetchLatestArticles(feeds);
    if (articles.length === 0) {
        return NextResponse.json({ message: 'No new articles found in the last 24 hours.' }, { status: 200 });
    }

    // 3. Summarize with Gemini
    console.log("Generating script...");
    const script = await generatePodcastScript(articles);
    
    // 4. Synthesize Speech
    console.log("Synthesizing speech...");
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const mainAudioFilename = `body-${timestamp}.mp3`;
    const mainAudioPath = await synthesizeSpeech(script, mainAudioFilename);

    // 5. Concatenate (Intro + Body + Outro) - Ideally fetch these paths or generate them
    // For now, let's just use the body as the podcast or assume placeholders exist.
    // To make it robust without existing assets, we will just use the body. 
    // If we had assets: await concatAudioSegments(['intro.mp3', mainAudioPath, 'outro.mp3'], finalFilename);
    
    // NOTE: Implementing full intro/outro concat requires valid intro/outro files.
    // For this MVP, we will use the synthesized body directly as the podcast file.
    // If you want to add Intro/Outro later, ensure the files exist in public/assets/
    
    const finalAudioPath = mainAudioPath; 
    
    // 6. Save to DB
    const podcast = await prisma.podcast.create({
      data: {
        title: `Daily News - ${new Date().toLocaleDateString()}`,
        filePath: finalAudioPath,
        duration: 0, // We would need to read the file to get duration, skipping for now
        summary: script, // Storing the script as summary
      },
    });

    return NextResponse.json(podcast, { status: 201 });

  } catch (error) {
    console.error("Error generating podcast:", error);
    return NextResponse.json({ error: 'Failed to generate podcast' }, { status: 500 });
  }
}
