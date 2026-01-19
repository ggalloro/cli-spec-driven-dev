# Implementation Plan - Podcast Generator

## Phase 0: Git Setup
- [x] Check if the current directory is an initialized git repository.
- [x] If it is, create and checkout a new feature branch named "podcast-generator".

## Phase 1: Project Initialization & Configuration
- [x] Initialize a new Next.js project with TypeScript, Tailwind CSS, and App Router.
- [x] Install dependencies: `rss-parser`, `fluent-ffmpeg`, `uuid`, `@google/genai`, and Google Cloud Text-to-Speech client library.
- [x] Install development dependencies: `@types/fluent-ffmpeg`, `@types/uuid`, `@types/node`.
- [x] Configure environment variables in `.env.local` for `GEMINI_API_KEY` and Google Cloud credentials.
- [x] Create the `./public/podcasts/` directory for storing generated audio files.

## Phase 2: UI Implementation
- [x] Generate the Hero Image using Nano Banana (`Robot agent reading news in TV studio`).
- [x] Create the main layout structure in `app/page.tsx` with Tailwind CSS styling.
- [x] Implement the `Hero` component displaying the generated image.
- [x] Implement the `FeedManager` component:
    - [x] Input field for RSS URL.
    - [x] "Add" button to fetch and validate feed metadata (mock validation for now).
    - [x] List view of added feeds with "Remove" functionality.
- [x] Implement the `PodcastGenerator` component:
    - [x] "Generate Episode" button (disabled if no feeds).
    - [x] Loading state with a spinner/progress indicator.
- [x] Implement the `PodcastList` component:
    - [x] Display card for podcast episodes.
    - [x] HTML5 `<audio>` player integration.
- [x] Integrate all components into the main page with `useState` for state management (`feeds`, `isGenerating`, `podcasts`).

## Phase 3: Backend - Core Logic (Parsing & Summarization)
- [x] Create a utility service `lib/rss.ts` to fetch and parse top 3 items from given RSS URLs using `rss-parser`.
- [x] Create a utility service `lib/gemini.ts` to interact with the Gemini API (`gemini-2.5-flash`).
    - [x] Implement `summarizeArticle(title, content)` function with the specified prompt.
- [x] Create an API route `app/api/podcast/generate/route.ts` (skeleton).
- [x] Implement the parsing and filtering logic in the API route.
- [x] Implement the summarization loop in the API route (getting text summaries for selected articles).

## Phase 4: Backend - Audio Synthesis & Compilation
- [x] Create a utility service `lib/tts.ts` to interact with Google Cloud Text-to-Speech (Chirp).
    - [x] Implement `synthesizeSpeech(text)` function using `en-US-Chirp-HD-F` voice.
- [x] Create a utility service `lib/audio.ts` using `fluent-ffmpeg`.
    - [x] Implement `concatAudioSegments(filePaths, outputPath)` to stitch audio files.
- [x] Update `app/api/podcast/generate/route.ts` to:
    - [x] Generate Intro and Outro audio.
    - [x] Call TTS for each summary.
    - [x] Save temporary audio segments.
    - [x] Compile all segments into a final MP3 in `./public/podcasts/`.
    - [x] Return the public URL and metadata.

## Phase 5: API Integration & Final Polish
- [x] Connect the `PodcastGenerator` frontend component to `POST /api/podcast/generate`.
- [x] Implement `GET /api/podcasts` route to scan `./public/podcasts/` and return available files.
- [x] Connect `PodcastList` to fetch and display the list of podcasts on load.
- [x] Refine UI/UX: Error handling for bad feeds or failed generation.
- [x] Clean up temporary files after generation.

## Phase 6: Completion & Version Control
- [ ] Verify application functionality: Add feed, generate, play, download.
- [ ] Create a `README.md` file explaining the application functions, architecture, and how to run/test locally.
- [ ] Add all changes to the repository (`git add .`).
- [ ] Commit the changes (`git commit -m "Complete implementation of Podcast Generator"`).
- [ ] Push the feature branch to the remote repository.
- [ ] Open a pull request for the feature branch.
