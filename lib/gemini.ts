import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GOOGLE_API_KEY;

if (!API_KEY) {
  console.warn("GOOGLE_API_KEY is not set in environment variables.");
}

const genAI = new GoogleGenerativeAI(API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function summarizeArticle(title: string, content: string): Promise<string> {
  const prompt = `
    You are a professional news anchor preparing a script for a podcast.
    Summarize the following article in a concise, engaging, and conversational tone suitable for audio narration.
    Focus on the key facts and why it matters.
    Do not use special characters (like asterisks, hashtags, or markdown bolding) that would break text-to-speech or sound unnatural.
    Keep the summary under 150 words.

    Article Title: ${title}
    Article Content: ${content}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text.trim();
  } catch (error) {
    console.error("Error generating summary with Gemini:", error);
    return `Here is a story about ${title}. However, I couldn't summarize the details at this time.`;
  }
}

export async function generateIntro(feedTitles: string[]): Promise<string> {
    const feedList = feedTitles.join(', ');
    const prompt = `Generate a short, enthusiastic 1-2 sentence intro for a daily news podcast covering feeds from: ${feedList}. "Hello and welcome to your Daily News Digest..."`;
    try {
        const result = await model.generateContent(prompt);
        return result.response.text().trim();
    } catch (error) {
        return "Hello and welcome to your Daily News Digest. Here are today's top stories.";
    }
}

export async function generateOutro(): Promise<string> {
    const prompt = `Generate a short, friendly 1 sentence outro for a news podcast. "That's all for today..."`;
    try {
        const result = await model.generateContent(prompt);
        return result.response.text().trim();
    } catch (error) {
        return "That's all for today. Thanks for listening!";
    }
}
