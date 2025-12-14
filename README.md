# Podcast Generator

A Next.js application that generates personalized audio news podcasts from RSS feeds using Google Gemini for summarization and Google Cloud Chirp for high-quality text-to-speech.

## Features

- **RSS Feed Management**: Add and remove RSS feeds.
- **AI Summarization**: Automatically fetches and summarizes the latest articles from your feeds using Gemini 1.5 Flash.
- **Audio Generation**: Converts summaries into natural-sounding speech using Google's Chirp models.
- **Podcast Player**: Listen to your generated daily briefings directly in the app.

## Architecture

- **Frontend**: Next.js (App Router), Tailwind CSS.
- **Backend**: Next.js API Routes.
- **Database**: SQLite (via Prisma & Better-SQLite3).
- **AI Services**: Google Gemini API, Google Cloud Text-to-Speech.
- **Audio Processing**: fluent-ffmpeg.

## Setup

1.  **Clone the repository**.
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Environment Variables**:
    Create a `.env.local` file with the following:
    ```env
    GOOGLE_AI_API_KEY=your_gemini_api_key
    GOOGLE_APPLICATION_CREDENTIALS=path/to/your/google_cloud_credentials.json
    DATABASE_URL="file:./dev.db"
    ```
4.  **Database Migration**:
    ```bash
    npx prisma migrate dev --name init
    ```
5.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## Requirements

- Node.js 18+
- ffmpeg installed on the system.
- Google Cloud Project with Vertex AI / Gemini API and Text-to-Speech API enabled.

## Usage

1.  Open `http://localhost:3000`.
2.  Add RSS feed URLs (e.g., `https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml`).
3.  Click "Generate New Episode".
4.  Wait for the process to complete (this can take a minute).
5.  Play the generated episode from the list.