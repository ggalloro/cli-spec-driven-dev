# Podcast Generator

A Next.js application that automatically generates personalized audio news podcasts from RSS feeds. It leverages **Google Gemini** for intelligent summarization and **Google Cloud Text-to-Speech (Chirp)** for natural-sounding audio synthesis.

## Features

- **RSS Feed Management**: Add and manage multiple RSS feeds.
- **AI Summarization**: Automatically summarizes news articles using Gemini 2.5 Flash.
- **High-Quality Audio**: Converts summaries into a spoken podcast using Google's Chirp voices.
- **Podcast Player**: Listen to the generated podcast directly in the browser or download the MP3.

## Architecture

- **Frontend**: Next.js (App Router), React, Tailwind CSS.
- **Backend**: Next.js API Routes.
- **AI**: Google Gemini (via `@google/genai`).
- **TTS**: Google Cloud Text-to-Speech (via `@google-cloud/text-to-speech`).
- **Data Handling**: `rss-parser` for feed ingestion, local filesystem for audio storage.

## Folder Structure

```
├── src/
│   ├── app/
│   │   ├── api/generate/ # Podcast generation endpoint
│   │   ├── page.tsx      # Main UI
│   │   └── layout.tsx
│   ├── components/       # UI Components (FeedInput, FeedList, AudioPlayer)
│   └── lib/              # Service logic (rss, gemini, tts, audio)
├── public/               # Static assets & generated podcasts
└── ...config files
```

## Setup & Running Locally

1.  **Clone the repository**:
    ```bash
    git clone <repo-url>
    cd podcast-generator
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Configuration**:
    Rename `.env.local.example` (if available) or create `.env.local` and add your keys:
    ```env
    GEMINI_API_KEY=your_gemini_api_key
    GOOGLE_APPLICATION_CREDENTIALS=path/to/your/service-account.json
    ```

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

5.  **Open Browser**:
    Navigate to `http://localhost:3000`.

## Testing

1.  Add a valid RSS feed URL (e.g., `https://news.ycombinator.com/rss`).
2.  Click "Generate Podcast".
3.  Wait for the process to complete (Fetching -> Summarizing -> Synthesizing).
4.  Play the generated audio.