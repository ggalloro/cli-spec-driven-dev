# Podcast Generator

A web application that converts RSS news feeds into personalized audio podcasts using Google Gemini for summarization and Google Cloud Text-to-Speech (Chirp) for audio synthesis.

## Features

- **RSS Feed Management**: Add multiple RSS feeds to curate your news source.
- **AI Summarization**: Automatically summarizes articles using Google Gemini 1.5/2.5 Flash.
- **Audio Generation**: Converts summaries into natural-sounding audio using Google Cloud Chirp voices.
- **Podcast Compilation**: Stitches intro, summaries, and outro into a single MP3 file.
- **Playback & Download**: Listen to or download your generated podcasts directly from the UI.

## Architecture

- **Frontend**: Next.js 14+ (App Router), Tailwind CSS.
- **Backend**: Next.js API Routes.
- **Services**:
    - **RSS Parsing**: `rss-parser`
    - **AI**: Google Gemini API (`@google/genai`)
    - **TTS**: Google Cloud Text-to-Speech
    - **Audio Processing**: `fluent-ffmpeg`

## Prerequisites

- Node.js 18+
- `ffmpeg` installed on the system.
- Google Cloud Project with Text-to-Speech API enabled.
- Gemini API Key (AI Studio).

## Installation

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure environment variables in `.env.local`:
    ```bash
    GEMINI_API_KEY=your_gemini_key
    GOOGLE_APPLICATION_CREDENTIALS=path/to/credentials.json
    ```
4.  Run the development server:
    ```bash
    npm run dev
    ```
5.  Open [http://localhost:3000](http://localhost:3000).

## Usage

1.  Enter an RSS feed URL (e.g., `https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml`).
2.  Click "Add Feed".
3.  Click "Generate Episode".
4.  Wait for processing (summarization + TTS + compilation).
5.  Play or download the resulting podcast.

## Development

- `app/page.tsx`: Main UI.
- `app/api/podcast/generate/route.ts`: Core logic pipeline.
- `lib/`: Utility services for RSS, Gemini, TTS, and Audio.