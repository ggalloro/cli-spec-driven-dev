import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function summarizeArticle(content: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Summarize the following news article for a podcast script. Keep it engaging, concise (under 1 minute read time), and conversational. Do not use special formatting like markdown bolding in the output text, just plain text for speech synthesis.\n\nArticle Content:\n${content.substring(0, 10000)}`, // Truncate to avoid huge context if necessary, though flash handles large context well.
      config: {
        systemInstruction: "You are a professional news anchor. Summarize stories clearly and neutrally.",
      }
    });

    return response.text || "Summary not available.";
  } catch (error) {
    console.error("Gemini Summarization Error:", error);
    return "This segment could not be summarized due to an error.";
  }
}
