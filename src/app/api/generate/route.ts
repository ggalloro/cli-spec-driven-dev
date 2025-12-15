import { NextResponse } from 'next/server';
import { fetchMultipleFeeds } from '@/lib/rss';
import { summarizeArticle, generateIntro, generateOutro } from '@/lib/gemini';
import { synthesizeSpeech } from '@/lib/tts';
import { savePodcastFile } from '@/lib/audio';

export async function POST(request: Request) {
  try {
    const { feedUrls } = await request.json();

    if (!feedUrls || !Array.isArray(feedUrls) || feedUrls.length === 0) {
      return NextResponse.json({ error: 'Invalid or missing feedUrls' }, { status: 400 });
    }

    // 1. Fetch Articles
    const articles = await fetchMultipleFeeds(feedUrls);
    if (articles.length === 0) {
      return NextResponse.json({ error: 'No articles found in provided feeds' }, { status: 404 });
    }

    // 2. Generate Scripts (Summaries, Intro, Outro)
    const introText = await generateIntro(articles.map((a) => a.title).slice(0, 5));
    const summaries = await Promise.all(articles.map((a) => summarizeArticle(a.content)));
    const outroText = await generateOutro();

    // 3. Synthesize Audio
    const introAudio = await synthesizeSpeech(introText);
    const summaryAudios = await Promise.all(summaries.map((s) => synthesizeSpeech(s)));
    const outroAudio = await synthesizeSpeech(outroText);

    // Filter out failed syntheses
    const validAudios = [introAudio, ...summaryAudios, outroAudio].filter((b): b is Buffer => b !== null);

    if (validAudios.length === 0) {
      return NextResponse.json({ error: 'Failed to generate audio' }, { status: 500 });
    }

    // 4. Compile & Save
    const podcastId = Math.random().toString(36).substring(7);
    const { url, duration } = await savePodcastFile(validAudios, podcastId);

    return NextResponse.json({
      success: true,
      podcast: {
        id: podcastId,
        url,
        duration,
        title: `News Digest - ${new Date().toLocaleDateString()}`,
      },
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
