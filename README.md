# Podcast Generator

An AI-powered application that turns your favorite RSS feeds into a personalized daily news podcast.

![Hero Image](public/hero.png)

## Features

*   **RSS Feed Management**: Add and curate your favorite news sources.
*   **AI Summarization**: Uses Google Gemini 2.5 Flash to generate concise, engaging summaries of the latest articles.
*   **Audio Synthesis**: Converts summaries into natural-sounding speech using Google Cloud Text-to-Speech (Chirp models).
*   **Audio Stitching**: Compiles individual segments into a seamless podcast episode with intro and outro.
*   **Local Playback**: Listen to your generated podcasts directly in the browser.

## Architecture

Built with a monolithic Next.js architecture leveraging Server Actions for backend logic.

*   **Frontend**: Next.js (App Router), React, Tailwind CSS.
*   **Backend**: Next.js Server Actions.
*   **AI**: `@google/genai` (Gemini).
*   **TTS**: `@google-cloud/text-to-speech`.
*   **Audio Processing**: `fluent-ffmpeg`.
*   **Data Storage**: Local JSON file (`data/podcasts.json`) and filesystem for audio.

## Prerequisites

1.  **Node.js**: v18 or later.
2.  **FFmpeg**: Must be installed and available in your system path.
    *   *macOS*: `brew install ffmpeg`
    *   *Linux*: `sudo apt install ffmpeg`
    *   *Windows*: Download and add to PATH.
3.  **Google Cloud Project**:
    *   Enable **Gemini API**.
    *   Enable **Cloud Text-to-Speech API**.
    *   Create a Service Account with TTS permissions and download the JSON key.

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

3.  **Environment Configuration**:
    Create a `.env.local` file in the root directory:
    ```env
    GEMINI_API_KEY=your_gemini_api_key
    GOOGLE_APPLICATION_CREDENTIALS=path/to/your/service-account-key.json
    ```

4.  **Run the application**:
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1.  Enter an RSS feed URL (e.g., `https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml`) in the input box and click **Add Feed**.
2.  Add as many feeds as you like.
3.  Click **Generate Podcast**.
4.  Wait for the process to complete (Fetching -> Summarizing -> Synthesizing -> Stitching).
5.  Once done, the new podcast will appear in the list below. Click play or download!
