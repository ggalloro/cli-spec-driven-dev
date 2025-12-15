# Implementation Plan - Podcast Generator

## Phase 0: Git Setup
- [x] Check if the current directory is an initialized git repository.
- [x] If it is, create and checkout a new feature branch named `podcast-generator`.

## Phase 1: Project Initialization
- [x] Initialize a new Next.js project with TypeScript and Tailwind CSS (`npx create-next-app@latest . --typescript --tailwind --eslint`).
- [x] Install backend dependencies: `npm install @google/genai @google-cloud/text-to-speech rss-parser fluent-ffmpeg uuid`.
- [x] Install type definitions: `npm install -D @types/fluent-ffmpeg @types/uuid`.
- [x] Configure environment variables in `.env.local` for `GEMINI_API_KEY` and `GOOGLE_APPLICATION_CREDENTIALS`.
- [x] Ensure `ffmpeg` is installed on the system (Note: User needs to have this installed, or we verify it exists).
- [x] Create basic project structure for services (`src/services/`) and types (`src/types/`).

## Phase 2: UI & Core Components
- [x] Define TypeScript interfaces (`Feed`, `Article`, `Podcast`) in `src/types/index.ts` based on the Tech Spec.
- [x] Generate a Hero Image using Gemini Image Generation (Nano Banana) with a prompt like "robot agent reading news in a TV studio" and save it to `public/hero.png`.
- [x] Create `HeroSection` component in `src/components/HeroSection.tsx`.
- [x] Create `FeedManager` component in `src/components/FeedManager.tsx` to handle adding/removing RSS URLs (client-side state).
- [x] Create `PodcastList` component in `src/components/PodcastList.tsx` to display generated podcasts with an HTML5 audio player.
- [x] Layout the main page (`src/app/page.tsx`) with Header, Hero, FeedManager, and PodcastList placeholders.

## Phase 3: Backend Logic (Server Actions)
- [x] Create `src/app/actions.ts` for Server Actions.
- [x] Implement `validateFeed(url: string)` action using `rss-parser` to verify feeds and return metadata.
- [x] Implement `getPodcasts()` action to read from a local `data/podcasts.json` file.
- [x] Create a utility to manage the local `data/podcasts.json` file (read/write).

## Phase 4: AI & Audio Integration
- [x] Create `src/services/gemini.ts` to handle article summarization using `@google/genai` (Model: `gemini-2.5-flash`).
- [x] Create `src/services/tts.ts` to handle text-to-speech conversion using `@google-cloud/text-to-speech` (Voice: `en-US-Chirp-HD-D`).
- [x] Create `src/services/audio.ts` to handle audio stitching using `fluent-ffmpeg`.
- [x] Implement the core `generatePodcast(feedUrls: string[])` action in `src/app/actions.ts`:
    - [x] Fetch articles from provided URLs.
    - [x] Summarize articles via Gemini.
    - [x] Generate audio segments via Google TTS.
    - [x] Stitch audio segments.
    - [x] Save output to `public/podcasts/` and update `podcasts.json`.

## Phase 5: UI Integration & Polish
- [x] Create `PodcastGenerator` component in `src/components/PodcastGenerator.tsx` with a "Generate" button and progress feedback.
- [x] Connect `PodcastGenerator` to the `generatePodcast` server action.
- [x] Implement loading states and error handling in the UI.
- [x] Ensure the generated audio files are accessible via the `PodcastList`.
- [x] Refine Tailwind styling for a polished look.

## Phase 6: Completion & Version Control
- [x] Verify application functionality (Add feed -> Generate -> Play).
- [x] Create a `README.md` file explaining the application functions, setup (including ffmpeg requirement), and how to run it.
- [ ] Add all changes to the repository (`git add .`).
- [ ] Commit the changes (`git commit -m "Complete implementation of Podcast Generator"`).
- [ ] Push the feature branch to the remote repository (`git push origin podcast-generator`).
- [ ] Open a pull request for the feature branch using the Gemini CLI github MCP server.
