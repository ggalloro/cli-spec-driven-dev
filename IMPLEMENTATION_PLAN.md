# Implementation Plan - Podcast Generator

## Phase 0: Git Setup
- [x] Check if the current directory is an initialized git repository.
- [x] If it is, create and checkout a new feature branch named "podcast-generator".

## Phase 1: Project Initialization
- [x] Initialize a new Next.js project with TypeScript and Tailwind CSS using `npx create-next-app@latest`.
- [x] Install Prisma and SQLite dependencies (`npm install prisma @prisma/client`, `npx prisma init`).
- [x] Install backend utilities: `rss-parser`, `fluent-ffmpeg`, `@google/generative-ai`.
- [x] Install UI icons (e.g., `lucide-react` or `heroicons`).
- [x] Configure `next.config.js` if necessary for external images or specific build settings.
- [x] Create a `.env` file for API keys (Gemini API Key) and database URL.

## Phase 2: Database & Backend Basics
- [x] Define the Prisma schema (`Feed` and `Podcast` models) in `prisma/schema.prisma` as per the tech spec.
- [x] Run `npx prisma migrate dev --name init` to create the SQLite database tables.
- [x] Create a Prisma client instance singleton (`lib/prisma.ts`) to avoid connection exhaustion in dev.
- [x] Implement `POST /api/feeds` API route: Validate URL, fetch title with `rss-parser`, save to DB.
- [x] Implement `GET /api/feeds` API route: Retrieve all feeds from DB.
- [x] Implement `DELETE /api/feeds` API route: Remove a feed by ID.

## Phase 3: Core Logic (AI & Audio)
- [x] Create a utility function `lib/gemini.ts` to handle Gemini API interactions (Summarization).
- [x] Create a utility function `lib/audio.ts` to handle Text-to-Speech (using Google Cloud TTS or Gemini Multimodal if available/configured).
- [x] Install FFmpeg locally or ensure it's available in the environment (for `fluent-ffmpeg` to work).
- [x] Create `lib/ffmpeg.ts` to handle audio stitching (Intro + Segments + Outro).
- [x] Implement the `POST /api/generate` logic:
    - [x] Fetch feeds from DB.
    - [x] Parse latest articles (limit 3-5).
    - [x] Loop: Summarize articles using Gemini.
    - [x] Loop: Generate audio segments from summaries.
    - [x] Stitch segments into a single MP3.
    - [x] Save MP3 to `public/podcasts/`.
    - [x] Save metadata to `Podcast` table in DB.

## Phase 4: Frontend Implementation
- [x] Generate the Hero Image using Nano Banana (prompt: "robot agent reading the news in a TV studio").
- [x] Create `components/Hero.tsx` to display the hero image and title.
- [x] Create `components/FeedManager.tsx`:
    - [x] Input field for RSS URL.
    - [x] List of added feeds with delete button.
    - [x] Connect to `GET`, `POST`, `DELETE /api/feeds`.
- [x] Create `components/PodcastGenerator.tsx`:
    - [x] "Generate Podcast" button.
    - [x] Loading state/spinner handling (long-running process).
- [x] Create `components/PodcastList.tsx`:
    - [x] Fetch and display list of generated podcasts (`GET /api/podcasts`).
    - [x] Embed HTML5 `<audio>` player for playback.
    - [x] Download link.
- [x] Assemble the main page (`app/page.tsx`) with all components.

## Phase 5: Completion & Version Control
- [ ] Verify application functionality (Add feed, Generate, Play).
- [ ] Create a `README.md` file explaining the application functions, architecture, and how to run it.
- [ ] Add all changes to the repository (`git add .`).
- [ ] Commit the changes (`git commit -m "Complete implementation of Podcast Generator"`).
- [ ] Push the feature branch to the remote repository.
- [ ] Open a pull request for the feature branch.
