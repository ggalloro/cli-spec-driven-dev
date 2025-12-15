'use server';

import Parser from 'rss-parser';
import { Feed, Podcast } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';
import { summarizeArticle } from '@/services/gemini';
import { synthesizeSpeech } from '@/services/tts';
import { stitchAudioSegments } from '@/services/audio';

const DATA_FILE = path.join(process.cwd(), 'data', 'podcasts.json');

// Ensure data directory exists
async function ensureDataDir() {
  const dir = path.dirname(DATA_FILE);
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

// Helper to read podcasts
async function readPodcastsDb(): Promise<Podcast[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Helper to write podcasts
async function writePodcastsDb(podcasts: Podcast[]) {
  await ensureDataDir();
  await fs.writeFile(DATA_FILE, JSON.stringify(podcasts, null, 2));
}

export async function validateFeed(url: string): Promise<Feed | { error: string }> {
  const parser = new Parser();
  try {
    const feed = await parser.parseURL(url);
    return {
      id: uuidv4(),
      url: url,
      title: feed.title || 'Untitled Feed',
    };
  } catch (error) {
    console.error('Error validating feed:', error);
    return { error: 'Invalid RSS URL or unable to fetch feed.' };
  }
}

export async function getPodcasts(): Promise<Podcast[]> {
  return await readPodcastsDb();
}

export async function generatePodcast(feedUrls: string[]): Promise<Podcast | { error: string }> {
  try {
    const parser = new Parser();
    let allArticles: { title: string; content: string; feedTitle: string }[] = [];

    // Step 1: Fetch Articles (Latest 3 from each feed)
    for (const url of feedUrls) {
      try {
        const feed = await parser.parseURL(url);
        const articles = feed.items.slice(0, 3).map(item => ({
          title: item.title || 'Untitled Article',
          content: item.contentSnippet || item.content || item.summary || 'No content available.',
          feedTitle: feed.title || 'Unknown Source'
        }));
        allArticles = [...allArticles, ...articles];
      } catch (e) {
        console.error(`Failed to fetch feed ${url}`, e);
      }
    }

    if (allArticles.length === 0) {
      return { error: "No articles found in the provided feeds." };
    }

    // Step 2: Summarize Articles
    // We will summarize them one by one.
    const audioSegments: string[] = [];
    const introText = "Welcome to your personalized AI News Podcast. Here are the top stories for today.";
    const introAudioPath = await synthesizeSpeech(introText);
    audioSegments.push(introAudioPath);

    let combinedSummary = "";

    for (const article of allArticles) {
        // Add a short transition/intro for the article
        const articleIntro = `From ${article.feedTitle}: ${article.title}.`;
        const summary = await summarizeArticle(article.content);
        
        const segmentText = `${articleIntro} ${summary}`;
        const segmentAudioPath = await synthesizeSpeech(segmentText);
        audioSegments.push(segmentAudioPath);
        
        combinedSummary += `- ${article.title} (${article.feedTitle})\n`;
    }

    const outroText = "That's all for today. Thanks for listening. Goodbye!";
    const outroAudioPath = await synthesizeSpeech(outroText);
    audioSegments.push(outroAudioPath);

    // Step 5: Stitching
    const { fileName, duration } = await stitchAudioSegments(audioSegments);

    // Step 6: Save Metadata
    const newPodcast: Podcast = {
        id: uuidv4(),
        title: `News Podcast - ${new Date().toLocaleDateString()}`,
        createdAt: new Date().toISOString(),
        duration: duration,
        filePath: fileName,
        summary: `Featuring stories from: ${Array.from(new Set(allArticles.map(a => a.feedTitle))).join(', ')}`,
    };

    const existingPodcasts = await readPodcastsDb();
    await writePodcastsDb([newPodcast, ...existingPodcasts]);

    return newPodcast;

  } catch (error: any) {
    console.error("Podcast Generation Failed:", error);
    return { error: error.message || "Failed to generate podcast." };
  }
}