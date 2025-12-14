# AI Podcast Generator

A Next.js application that converts RSS news feeds into personalized audio podcasts using Google Gemini for summarization and audio synthesis simulation.

## Features

*   **RSS Feed Management**: Add and remove your favorite news sources.
*   **AI Summarization**: Automatically fetches recent articles (last 24h) and generates concise summaries using `gemini-2.5-flash`.
*   **Audio Generation**: Converts the summarized script into an audio podcast (currently simulates audio output for prototype purposes).
*   **Playback**: Listen to your generated podcasts directly in the app.

## Architecture

*   **Frontend**: Next.js (App Router), Tailwind CSS.
*   **Backend**: Next.js API Routes.
*   **AI**: Google Gen AI SDK (`@google/generative-ai`).
*   **Data**: Local JSON file (`data/db.json`) and filesystem storage.

## Setup & Running

1.  **Prerequisites**: Node.js 18+.
2.  **Environment Variables**:
    Create a `.env.local` file in the `podcast-generator` directory:
    ```bash
    GOOGLE_API_KEY=your_gemini_api_key
    ```
3.  **Install Dependencies**:
    ```bash
    cd podcast-generator
    npm install
    ```
4.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000).

## Usage

1.  **Add Feeds**: Paste an RSS URL (e.g., `https://feeds.npr.org/1001/rss.xml`) and click "Add".
2.  **Generate**: Click "Generate New Podcast". The app will fetch articles, summarize them, and create an audio file.
3.  **Listen**: Click the play button on the generated podcast card.

## Implementation Details

*   **Summarization**: Uses Gemini 2.5 Flash.
*   **Audio**: Uses a simulated output for the prototype (writes transcript to MP3 file). Real implementation would connect to Google Cloud Vertex AI Chirp.