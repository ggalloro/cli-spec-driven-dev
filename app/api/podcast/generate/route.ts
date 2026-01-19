import { NextResponse } from 'next/server';
import { fetchFeedItems, RSSItem } from '@/lib/rss';
import { summarizeArticle } from '@/lib/gemini';
import { synthesizeSpeech } from '@/lib/tts';
import { concatAudioSegments } from '@/lib/audio';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  const tempFiles: string[] = [];

  try {
    const { feedUrls } = await request.json();

    if (!feedUrls || !Array.isArray(feedUrls) || feedUrls.length === 0) {
      return NextResponse.json({ error: 'Invalid feedUrls' }, { status: 400 });
    }

    // 1. Fetch RSS Items
    const allItems: RSSItem[] = [];
    for (const url of feedUrls) {
      const items = await fetchFeedItems(url, 3);
      allItems.push(...items);
    }

    // 2. Filter & Deduplicate
    const uniqueItems = Array.from(new Map(allItems.map(item => [item.link, item])).values());
    const selectedItems = uniqueItems.slice(0, 3);

    // 3. Summarize & Synthesize Loop
    const audioSegments: Buffer[] = [];

    // Intro
    const introBuffer = await synthesizeSpeech("Welcome to your daily news podcast. Here are the top stories for today.");
    audioSegments.push(introBuffer);

    for (const item of selectedItems) {
       if (!item.content && !item.title) continue;
       
       // Summarize
       const summary = await summarizeArticle(item.title, item.content);
       if (!summary) continue;

       // TTS
       // Add a small pause or transition text if needed, or just the summary
       // To separate stories better, maybe add "Next story." or just rely on pause if silence is added.
       // For MVP, just the summary.
       const audioBuffer = await synthesizeSpeech(summary);
       audioSegments.push(audioBuffer);
    }

    // Outro
    const outroBuffer = await synthesizeSpeech("That's all for today. Thanks for listening.");
    audioSegments.push(outroBuffer);

    // 4. Save Temp Files
    const tempDir = path.join(process.cwd(), 'public', 'podcasts', 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    for (let i = 0; i < audioSegments.length; i++) {
      const tempPath = path.join(tempDir, `${uuidv4()}.mp3`);
      fs.writeFileSync(tempPath, audioSegments[i]);
      tempFiles.push(tempPath);
    }

    // 5. Compile
    const podcastId = uuidv4();
    const filename = `podcast_${podcastId}.mp3`;
    const outputPath = path.join(process.cwd(), 'public', 'podcasts', filename);

    await concatAudioSegments(tempFiles, outputPath);

    // Get duration (optional, would need to read file meta, simplified for now)
    // We can estimate or just set 0 and let frontend handle it
    const duration = 0; 

    // 6. Cleanup Temp Files
    tempFiles.forEach(file => {
      try { fs.unlinkSync(file); } catch (e) { console.error('Error deleting temp file', e); }
    });
    // Try to remove temp dir if empty
    try { fs.rmdirSync(tempDir); } catch (e) {}

    const podcastUrl = `/podcasts/${filename}`;

    return NextResponse.json({ 
      success: true,
      podcastUrl,
      podcastId,
      duration,
      title: `News Podcast - ${new Date().toLocaleDateString()}`
    });

  } catch (error) {
    console.error('Error in generate route:', error);
    
    // Attempt cleanup
    tempFiles.forEach(file => {
       try { fs.unlinkSync(file); } catch (e) {}
    });

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}