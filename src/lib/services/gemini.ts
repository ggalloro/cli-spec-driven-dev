import { GoogleGenerativeAI } from "@google/generative-ai";
import { Article } from "./rss";

const apiKey = process.env.GOOGLE_AI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function generatePodcastScript(articles: Article[]): Promise<string> {
  if (!genAI) {
      throw new Error("GOOGLE_AI_API_KEY is not set");
  }

  if (articles.length === 0) {
      return "There are no news updates for today. Have a wonderful day!";
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const articlesText = articles.map(a => `
    Source: ${a.source}
    Title: ${a.title}
    Content: ${a.content}
  `).join("\n---\n");

  const prompt = `Summarize the following news articles into a cohesive script for a daily news podcast. 
  Group by topic. Use a conversational, engaging tone suitable for audio. 
  Do not use special characters or formatting that breaks TTS (Text-to-Speech), like markdown bolding or bullet points. 
  Keep it natural and fluid.
  
  Articles:
  ${articlesText}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error("Error generating podcast script with Gemini:", error);
    throw new Error("Failed to generate podcast script");
  }
}
