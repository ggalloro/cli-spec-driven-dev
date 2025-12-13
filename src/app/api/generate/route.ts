import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import Parser from 'rss-parser';
import { summarizeArticle } from '@/lib/gemini';
import { generateAudio } from '@/lib/audio';
import { stitchAudio } from '@/lib/ffmpeg';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    // 1. Fetch feeds
    const feeds = await prisma.feed.findMany();
    if (feeds.length === 0) {
      return NextResponse.json({ error: 'No feeds available' }, { status: 400 });
    }

    const parser = new Parser();
    const allSegments: string[] = [];
    const tempDir = path.join(process.cwd(), 'tmp');
    
    // Ensure temp and public dirs exist
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
    const publicPodcastsDir = path.join(process.cwd(), 'public', 'podcasts');
    if (!fs.existsSync(publicPodcastsDir)) fs.mkdirSync(publicPodcastsDir, { recursive: true });

    // Generate Intro
    const introPath = await generateAudio("Welcome to your AI News Feed. Here are the latest updates.");
    allSegments.push(introPath);

    // 2. Process Feeds
    for (const feed of feeds) {
      try {
        const parsedFeed = await parser.parseURL(feed.url);
        // Take top 2 articles to keep it short for prototype
        const articles = parsedFeed.items.slice(0, 2);

        for (const article of articles) {
          if (article.content || article.contentSnippet || article.summary) {
             const textToSummarize = article.contentSnippet || article.summary || article.content || "";
             // 3. Summarize
             const summary = await summarizeArticle(textToSummarize);
             
             if (summary) {
                 // 4. Generate Audio for Segment
                 // Clean summary for TTS (remove markdown, etc already handled by prompt instructions but good to be safe)
                 const cleanSummary = summary.replace(/[*#]/g, '');
                 const segmentPath = await generateAudio(cleanSummary);
                 allSegments.push(segmentPath);
             }
          }
        }
      } catch (e) {
        console.error(`Failed to process feed ${feed.url}`, e);
      }
    }

    // Generate Outro
    const outroPath = await generateAudio("That's all for today. Thanks for listening.");
    allSegments.push(outroPath);

    // 5. Stitch
    const podcastId = crypto.randomUUID();
    const outputFileName = `${podcastId}.mp3`;
    const outputPath = path.join(publicPodcastsDir, outputFileName);

    await stitchAudio(allSegments, outputPath);

    // 6. Save Metadata
    const newPodcast = await prisma.podcast.create({
      data: {
        title: `AI News - ${new Date().toLocaleDateString()}`,
        filePath: `/podcasts/${outputFileName}`,
        duration: 0, // Calculate if possible, optional for now
      },
    });

    // Cleanup temp files
    allSegments.forEach(file => {
        try { fs.unlinkSync(file); } catch(e) {}
    });

    return NextResponse.json({ status: 'success', podcastId: newPodcast.id });

  } catch (error) {
    console.error('Error generating podcast:', error);
    return NextResponse.json({ error: 'Failed to generate podcast' }, { status: 500 });
  }
}
