import { GoogleGenAI } from '@google/genai';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function summarizeArticle(content: string): Promise<string> {
  try {
    const prompt = `You are a news anchor. Summarize the following article for a spoken audio broadcast. Keep it under 100 words. Do not use special characters or formatting that cannot be spoken (like markdown bolding or lists). Make it sound natural and engaging. Article: ${content}`;

    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    if (response.text) {
      return response.text;
    }
    return '';
  } catch (error) {
    console.error('Error summarizing article:', error);
    return '';
  }
}