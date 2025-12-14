# AI News Podcast Generator

This application allows users to generate personalized daily news podcasts from their favorite RSS feeds using AI summarization and natural-sounding text-to-speech.

## Features

- **RSS Feed Management**: Add and remove multiple RSS feeds.
- **AI Summarization**: Uses Google Gemini (`gemini-2.5-flash`) to summarize the top stories.
- **Audio Generation**: Uses Google Cloud Text-to-Speech (Chirp) to create a seamless audio experience.
- **Playback**: Built-in audio player to listen to your generated podcasts.

## Architecture

- **Frontend**: Next.js 14+ (App Router), Tailwind CSS, React Context.
- **Backend**: Next.js API Routes (`/api/generate`).
- **AI**: Google Gemini API & Google Cloud TTS.

## Prerequisites

- Node.js 18+
- Google Gemini API Key
- Google Cloud Project with Text-to-Speech API enabled and credentials JSON.

## Setup

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    cd podcast-generator
    npm install
    ```
3.  Configure Environment Variables:
    - Create `.env.local` in `podcast-generator/`.
    - Add:
      ```env
      GEMINI_API_KEY=your_key
      GOOGLE_APPLICATION_CREDENTIALS=path/to/credentials.json
      ```
4.  Run Development Server:
    ```bash
    npm run dev
    ```
5.  Open [http://localhost:3000](http://localhost:3000).

## Usage

1.  Paste an RSS feed URL (e.g., `https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml`) into the input field.
2.  Click "Add". Add more feeds if desired.
3.  Click "Generate Podcast".
4.  Wait for the AI to process and generate the audio (this may take 10-20 seconds).
5.  Listen to your custom news update!

## Testing

Currently, the project supports manual testing via the UI. Ensure you have valid API keys to test the full generation pipeline.