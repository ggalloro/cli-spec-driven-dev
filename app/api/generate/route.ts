import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import { getFeeds, savePodcasts, getPodcasts, Podcast } from '@/lib/storage';
import { fetchLatestArticles } from '@/lib/rss';
import { summarizeArticle, generateIntro, generateOutro } from '@/lib/gemini';
import { generateAudioSegment } from '@/lib/tts';
import { mergeAudioSegments } from '@/lib/audio';

export const maxDuration = 300; // Allow longer timeout for generation (5 mins)

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { feedIds } = body; // Optional: filter by specific feed IDs

    const allFeeds = getFeeds();
    const targetFeeds = feedIds && feedIds.length > 0 
      ? allFeeds.filter(f => feedIds.includes(f.id))
      : allFeeds;

    if (targetFeeds.length === 0) {
      return NextResponse.json({ error: 'No feeds available to generate podcast' }, { status: 400 });
    }

    // 1. Fetch Articles
    let articles: { title: string; content: string; source: string }[] = [];
    for (const feed of targetFeeds) {
      const feedArticles = await fetchLatestArticles(feed.url, 3); // Get top 3 from each
      articles.push(...feedArticles.map(a => ({ ...a, source: feed.title })));
    }

    if (articles.length === 0) {
        return NextResponse.json({ error: 'No articles found in feeds' }, { status: 400 });
    }
    
    // Limit total articles to avoid huge costs/time for MVP
    articles = articles.slice(0, 5); 

    // 2. Generate Script & Audio Segments
    const audioSegments: string[] = [];
    
    // Intro
    const introText = await generateIntro(targetFeeds.map(f => f.title));
    console.log("Generating Intro Audio...");
    audioSegments.push(await generateAudioSegment(introText));

    // Stories
    for (const article of articles) {
      console.log(`Summarizing: ${article.title}`);
      const summary = await summarizeArticle(article.title, article.content);
      const spokenText = `Next up, from ${article.source}. ${summary}`;
      console.log(`Generating Audio for: ${article.title}`);
      audioSegments.push(await generateAudioSegment(spokenText));
    }

    // Outro
    const outroText = await generateOutro();
    console.log("Generating Outro Audio...");
    audioSegments.push(await generateAudioSegment(outroText));

    // 3. Merge Audio
    const podcastId = uuidv4();
    const fileName = `podcast-${podcastId}.mp3`;
    const publicDir = path.join(process.cwd(), 'public', 'podcasts');
    
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    const outputPath = path.join(publicDir, fileName);
    console.log("Merging audio segments...");
    await mergeAudioSegments(audioSegments, outputPath);

    // 4. Save Record
    const newPodcast: Podcast = {
      id: podcastId,
      title: `Daily Digest - ${new Date().toLocaleDateString()}`,
      createdAt: new Date().toISOString(),
      audioFilePath: `/podcasts/${fileName}`,
      durationSeconds: 0, // TODO: Get actual duration if needed
      articlesIncluded: articles.length
    };

    const podcasts = getPodcasts(); // Re-fetch to ensure fresh state if needed
    // Actually getPodcasts is sync reading file, so it's fine. 
    // Ideally we append to current list.
    // However, in a real DB we wouldn't fetch all.
    const currentPodcasts = getPodcasts(); 
    currentPodcasts.push(newPodcast);
    savePodcasts(currentPodcasts);

    return NextResponse.json({ 
      message: 'Podcast generated successfully', 
      podcast: newPodcast 
    });

  } catch (error: any) {
    console.error('Error generating podcast:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate podcast' }, { status: 500 });
  }
}
