import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function summarizeArticle(content: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a news anchor. Summarize the following article for a spoken podcast segment. Keep it engaging and under 100 words: ${content}`,
    });
    return response.text || '';
  } catch (error) {
    console.error('Error summarizing article:', error);
    return 'Summary unavailable.';
  }
}

export async function generateIntro(titles: string[]): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a professional news anchor. specific Generate a short, welcoming intro for a news podcast covering these topics: ${titles.join(', ')}. Keep it under 50 words.`,
    });
    return response.text || 'Welcome to your daily news podcast.';
  } catch (error) {
    console.error('Error generating intro:', error);
    return 'Welcome to your daily news podcast.';
  }
}

export async function generateOutro(): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a professional news anchor. Generate a short, closing goodbye for a news podcast. Keep it under 30 words.`,
    });
    return response.text || 'Thank you for listening. Stay tuned for more updates.';
  } catch (error) {
    console.error('Error generating outro:', error);
    return 'Thank you for listening. Stay tuned for more updates.';
  }
}
