import fs from 'fs';
import path from 'path';
import Parser from 'rss-parser';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { db } from './store';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const parser = new Parser();

export async function generatePodcast(podcastId: string) {
    console.log(`Starting generation for ${podcastId}...`);
    try {
        // 1. Fetch Feeds
        const feeds = db.getFeeds();
        let articles: any[] = [];

        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);

        console.log(`Fetching from ${feeds.length} feeds...`);

        for (const feed of feeds) {
            try {
                const parsed = await parser.parseURL(feed.url);
                // Filter recent
                const recent = parsed.items.filter(item => {
                    return item.pubDate && new Date(item.pubDate) > oneDayAgo;
                });
                articles = [...articles, ...recent];
            } catch (e) {
                console.error(`Error fetching feed ${feed.url}`, e);
            }
        }

        console.log(`Found ${articles.length} recent articles.`);

        if (articles.length === 0) {
            // Fallback for demo if no recent articles: take top 3 latest regardless of date
             console.log("No recent articles, fetching top 3 latest...");
             for (const feed of feeds) {
                try {
                    const parsed = await parser.parseURL(feed.url);
                    articles = [...articles, ...parsed.items.slice(0, 3)];
                } catch(e) {}
             }
             if (articles.length === 0) {
                 db.updatePodcast(podcastId, { status: 'FAILED', title: 'Failed - No Articles' });
                 return;
             }
        }

        // Limit to top 5 to save tokens/time
        articles = articles.slice(0, 5);

        // 2. Summarize
        let script = "Welcome to your daily AI news briefing. Here are the top stories.\n\n";
        
        for (const article of articles) {
            // Check if API key is set
            if (!process.env.GOOGLE_API_KEY) {
                script += `Summary of ${article.title} (API Key missing).\n\n`;
                continue;
            }

            const prompt = `Summarize the following article for a spoken news podcast segment. Keep it under 50 words. Focus on the key facts. 

Title: ${article.title}
Content: ${article.contentSnippet || article.content || ''}`;
            
            try {
                const result = await model.generateContent(prompt);
                const response = await result.response;
                const summary = response.text();
                script += `Next story: ${summary}\n\n`;
            } catch (e) {
                console.error("Summarization failed for article", e);
                script += `Next story: ${article.title}\n\n`;
            }
        }

        script += "That's all for today. Thanks for listening.";
        
        // 3. Audio Synthesis
        // Note: Real integration with Chirp/Vertex AI requires complex auth (ADC/Service Account).
        // For this prototype with API Key, we will simulate the audio file creation.
        // We will create a valid empty file or text-based file to demonstrate flow.
        
        const publicDir = path.join(process.cwd(), 'public', 'podcasts');
        if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir, { recursive: true });
        }

        const audioFilename = `${podcastId}.mp3`;
        const audioPath = `/podcasts/${audioFilename}`;
        const absAudioPath = path.join(publicDir, audioFilename);

        // Writing the script to the file so we can inspect it, though it won't play as music.
        // In a real app, this would be: await fs.promises.writeFile(absAudioPath, audioBuffer);
        fs.writeFileSync(absAudioPath, `(Simulated Audio File)\n\nTRANSCRIPT:\n${script}`);

        // 4. Update DB
        db.updatePodcast(podcastId, {
            status: 'COMPLETED',
            audioPath: audioPath,
            duration: 120, // Fake duration
            transcript: script
        });
        
        console.log(`Podcast ${podcastId} completed.`);

    } catch (error) {
        console.error("Generation failed:", error);
        db.updatePodcast(podcastId, { status: 'FAILED' });
    }
}
