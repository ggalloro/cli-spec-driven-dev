import { NextRequest, NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { GoogleGenAI } from '@google/genai';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Initialize RSS Parser
const parser = new Parser();

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Initialize Google TTS Client
const ttsClient = new TextToSpeechClient();

interface Article {
  title: string;
  content: string;
  pubDate: string;
  link: string;
}

// Helper: Fetch and Parse Feeds
async function fetchFeeds(feedUrls: string[]): Promise<Article[]> {
  const allArticles: Article[] = [];

  const feedPromises = feedUrls.map(async (url) => {
    try {
      const feed = await parser.parseURL(url);
      return feed.items.map((item) => ({
        title: item.title || 'No Title',
        content: item.contentSnippet || item.content || '',
        pubDate: item.pubDate || new Date().toISOString(),
        link: item.link || '',
      }));
    } catch (error) {
      console.error(`Error parsing feed ${url}:`, error);
      return [];
    }
  });

  const results = await Promise.all(feedPromises);
  results.forEach((articles) => allArticles.push(...articles));

  // Sort by date (descending) and take top 3 unique
  const sortedArticles = allArticles.sort((a, b) => {
    return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
  });

  const uniqueArticles = sortedArticles.filter(
    (article, index, self) =>
      index === self.findIndex((t) => t.title === article.title)
  );

  return uniqueArticles.slice(0, 3);
}

// Helper: Summarize Article using Gemini
async function summarizeArticle(article: Article): Promise<string> {
  const prompt = `Summarize the following news article for a spoken podcast segment. Keep it under 100 words. Make it engaging and clear. Title: ${article.title}. Content: ${article.content.substring(0, 5000)}`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text || '';
  } catch (error) {
    console.error('Error summarizing article:', error);
    return `Here is a story about ${article.title}, but I couldn't summarize it right now.`;
  }
}

// Helper: Generate Intro and Outro
function generateScripts(date: string) {
    return {
        intro: `Welcome to your daily news update for ${date}. Here are the top stories making headlines today.`,
        outro: "That's all for today. Thanks for listening, and stay tuned for more updates tomorrow."
    };
}

// Helper: Generate Audio from Text
async function generateAudio(text: string): Promise<Buffer> {
    if (!text) return Buffer.from([]);

    const request = {
        input: { text },
        voice: { languageCode: 'en-US', name: 'en-US-Studio-O' },
        audioConfig: { audioEncoding: 'MP3' as const },
    };

    try {
        const [response] = await ttsClient.synthesizeSpeech(request);
        return Buffer.from(response.audioContent as Uint8Array);
    } catch (error) {
        console.error('Error generating audio:', error);
        throw error;
    }
}

// Helper: Stitch Audio Buffers
function stitchAudio(buffers: Buffer[]): Buffer {
    return Buffer.concat(buffers);
}

export async function POST(req: NextRequest) {
  try {
    const { feeds } = await req.json();

    if (!feeds || !Array.isArray(feeds) || feeds.length === 0) {
      return NextResponse.json({ error: 'Invalid feeds provided' }, { status: 400 });
    }

    // 1. Fetch Articles
    const articles = await fetchFeeds(feeds);

    if (articles.length === 0) {
        return NextResponse.json({ error: 'No articles found in provided feeds' }, { status: 404 });
    }

    // 2. Summarize Articles
    const summaries = await Promise.all(articles.map(summarizeArticle));

    // 3. Generate Scripts
    const { intro, outro } = generateScripts(new Date().toLocaleDateString());

    // 4. Generate Audio Segments
    // Intro -> Summary 1 -> Summary 2 -> Summary 3 -> Outro
    const textSegments = [intro, ...summaries, outro];
    const audioBuffers = await Promise.all(textSegments.map(generateAudio));

    // 5. Stitch Audio
    const finalAudioBuffer = stitchAudio(audioBuffers);

    // 6. Save File
    const podcastId = uuidv4();
    const fileName = `${podcastId}.mp3`;
    const publicDir = path.join(process.cwd(), 'public', 'podcasts');
    
    // Ensure directory exists
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
    }

    const filePath = path.join(publicDir, fileName);
    fs.writeFileSync(filePath, finalAudioBuffer);

    // 7. Return Response
    // Calculate rough duration (mp3 is approx X bytes/sec depending on bitrate, but exact duration from buffer is tricky without decoding. 
    // Studio voices usually 24khz/48khz linear or encoded. For MP3 standard ~16KB/s for 128kbps. 
    // This is an estimation for metadata.
    const durationEst = finalAudioBuffer.length / 16000; // Very rough estimate

    return NextResponse.json({
        success: true,
        podcast: {
            id: podcastId,
            title: `Your News Update - ${new Date().toLocaleDateString()}`,
            audioUrl: `/podcasts/${fileName}`,
            duration: Math.round(durationEst),
            createdAt: new Date(),
        }
    });

  } catch (error) {
    console.error('Error in generate API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}