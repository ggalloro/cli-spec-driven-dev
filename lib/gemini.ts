import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function summarizeArticle(title: string, content: string): Promise<string> {
  try {
    const prompt = `Summarize the following article for a spoken news segment. Keep it under 100 words. Title: ${title}. Content: ${content}.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || '';
  } catch (error) {
    console.error('Error summarizing article with Gemini:', error);
    // Return empty string on failure to allow process to continue or handle upstream
    return '';
  }
}
