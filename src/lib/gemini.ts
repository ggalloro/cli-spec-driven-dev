import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function summarizeArticle(content: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `You are a news anchor. Summarize the following article for a spoken audio broadcast. Keep it under 100 words. Do not use special characters or formatting that cannot be spoken (like markdown bolding or lists). Make it sound natural and engaging. Article: ${content}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error summarizing article:', error);
    return '';
  }
}
