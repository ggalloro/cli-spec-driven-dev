# AI News Anchor - Podcast Generator

A Next.js application that automatically generates personalized news podcasts from your favorite RSS feeds using Google Gemini for summarization and Google Cloud Text-to-Speech for narration.

## Features

-   **RSS Feed Management**: Add and manage your favorite news sources (RSS/Atom feeds).
-   **AI Summarization**: Uses Google's **Gemini 2.5 Flash** model to read articles and generate concise, conversational summaries suitable for a podcast format.
-   **Neural Text-to-Speech**: Converts the generated script into high-quality, natural-sounding audio using Google Cloud TTS.
-   **Audio Compilation**: Merges intro, story segments, and outro into a single downloadable MP3 file.
-   **Podcast History**: Listen to or download previous daily digests.
-   **Modern UI**: Built with Next.js App Router and Tailwind CSS, featuring a responsive dark mode design.

## Architecture

-   **Frontend**: Next.js (React), Tailwind CSS
-   **Backend**: Next.js API Routes (Serverless functions)
-   **AI/ML**:
    -   `@google/generative-ai` (Gemini) for text processing.
    -   `@google-cloud/text-to-speech` for audio synthesis.
-   **Data**: Local JSON storage (simple MVP).
-   **Audio Processing**: `fluent-ffmpeg` for stitching audio files.

## Prerequisites

1.  **Node.js** (v18+) and **npm**.
2.  **Google Cloud Project** with:
    -   Generative AI API enabled (Gemini).
    -   Text-to-Speech API enabled.
3.  **FFmpeg** installed on your system.
    -   macOS: `brew install ffmpeg`
    -   Linux: `sudo apt install ffmpeg`
    -   Windows: Download and add to PATH.

## Setup & Running Locally

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd podcast-generator
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Configuration**:
    Create a `.env.local` file in the root directory:
    ```env
    GOOGLE_API_KEY=your_gemini_api_key
    # If using a Service Account for Google Cloud TTS (Recommended)
    GOOGLE_APPLICATION_CREDENTIALS="path/to/your/service-account-key.json"
    ```

4.  **Run the development server**:
    ```bash
    npm run dev
    ```

5.  **Open the app**:
    Visit [http://localhost:3000](http://localhost:3000).

## Usage

1.  **Add Feeds**: Paste an RSS URL (e.g., `http://feeds.bbci.co.uk/news/rss.xml`) into the "Add Feed" input.
2.  **Generate**: Click "Generate New Episode". The AI will fetch the latest articles, summarize them, and create an MP3. *Note: This process may take 1-2 minutes.*
3.  **Listen**: The new episode will appear in the player on the right. Click play or download.

## License

MIT