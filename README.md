# Podcast Generator

An AI-powered application that turns your favorite RSS feeds into a personalized news podcast.

## Features

-   **RSS Feed Management**: Add, view, and remove RSS feeds.
-   **AI Summarization**: Automatically fetches and summarizes the latest articles from your feeds using Google Gemini.
-   **Audio Generation**: Converts summaries into natural-sounding speech.
-   **Podcast Assembly**: Stitches intro, segments, and outro into a single MP3 file.
-   **Playback & Download**: Listen to your generated podcasts directly in the app or download them.

## Architecture

-   **Frontend**: Next.js (App Router), Tailwind CSS, Lucide Icons.
-   **Backend**: Next.js API Routes.
-   **Database**: SQLite with Prisma ORM.
-   **AI**: Google Gemini API (`gemini-1.5-flash`) for summarization.
-   **Audio**: `google-tts-api` (fallback) or configured TTS service, processed with `fluent-ffmpeg`.

## Prerequisites

-   Node.js (v18+)
-   FFmpeg installed on your system (required for audio stitching).
    -   macOS: `brew install ffmpeg`
    -   Linux: `sudo apt install ffmpeg`
-   Google Gemini API Key.

## Setup

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd podcast-generator
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Variables**:
    Create a `.env` file in the root directory:
    ```env
    DATABASE_URL="file:./dev.db"
    GEMINI_API_KEY="your_gemini_api_key_here"
    ```

4.  **Database Setup**:
    ```bash
    npx prisma migrate dev --name init
    ```

5.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1.  **Add Feeds**: Enter an RSS URL (e.g., `https://feeds.npr.org/1001/rss.xml`) and click "Add".
2.  **Generate**: Click the "Generate Podcast" button. Wait for the AI to process (1-2 mins).
3.  **Listen**: Click play on the generated episode or download it.

## License

MIT