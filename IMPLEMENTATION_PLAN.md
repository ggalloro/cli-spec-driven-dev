# Implementation Plan - Podcast Generator

## Phase 0: Git Setup
- [x] Check if the current directory is an initialized git repository.
- [x] If it is, create and checkout a new feature branch named `podcast-generator`.

## Phase 1: Environment & Project Setup
- [x] Initialize a new Next.js project with TypeScript, Tailwind CSS, and App Router.
- [x] Install backend dependencies: `prisma`, `@prisma/client` (or `better-sqlite3`), `rss-parser`, `fluent-ffmpeg`, `@google/generative-ai` (Gemini SDK), `@google-cloud/text-to-speech`.
- [x] Install frontend dependencies: `lucide-react` (for icons), `axios` or use `fetch`.
- [x] Configure Environment Variables (`.env.local`): `GOOGLE_AI_API_KEY`, `GOOGLE_APPLICATION_CREDENTIALS`, `DATABASE_URL`.
- [x] Verify `ffmpeg` installation on the local machine.

## Phase 2: Database & Data Access
- [x] Initialize Prisma with SQLite provider (`npx prisma init --datasource-provider sqlite`).
- [x] Define `Feed` model in `prisma/schema.prisma` (id, url, title, createdAt).
- [x] Define `Podcast` model in `prisma/schema.prisma` (id, title, filePath, duration, createdAt, summary).
- [x] Run migration to create the SQLite database (`npx prisma migrate dev --name init`).
- [x] Create a `db.ts` lib file to export the singleton Prisma client instance.

## Phase 3: Backend Services (Core Logic)
- [x] **RSS Service**: Create `lib/services/rss.ts`. Implement `fetchLatestArticles(feeds)` using `rss-parser`. Filter articles from the last 24 hours.
- [x] **AI Service (Summarization)**: Create `lib/services/gemini.ts`. Implement `generatePodcastScript(articles)` using the Gemini API. Construct the prompt as specified in the Tech Spec.
- [x] **TTS Service (Synthesis)**: Create `lib/services/tts.ts`. Implement `synthesizeSpeech(text)` using Google Cloud TTS (Chirp model). Handle text chunking if necessary.
- [x] **Audio Service (Processing)**: Create `lib/services/audio.ts`. Implement `concatAudioSegments(segments, outputPath)` using `fluent-ffmpeg` to merge Intro + Body + Outro.

## Phase 4: API Routes
- [x] **Feed Endpoints**: Create `app/api/feeds/route.ts` and `app/api/feeds/[id]/route.ts`. Implement GET (list), POST (add & validate), DELETE (remove).
- [x] **Podcast Endpoints**: Create `app/api/podcasts/route.ts`. Implement GET (list history).
- [x] **Generation Endpoint**: Create `app/api/podcasts/generate/route.ts`. Implement POST. This should orchestrate the full pipeline: Fetch RSS -> Summarize -> TTS -> Concat -> Save to DB -> Return Result.

## Phase 5: Frontend - UI Components
- [x] **Layout & Hero**: Update `app/page.tsx` with a responsive layout. Add the Hero section with the "Robot agent reading news" image (placeholder or generated).
- [x] **Feed Manager Component**: Create `components/FeedManager.tsx`. Implement a form to add URLs and a list to display/delete current feeds. Connect to `/api/feeds`.
- [x] **Podcast History & Player**: Create `components/PodcastPlayer.tsx`. Display a list of generated podcasts. When selected, play the audio file using the standard `<audio>` tag. Connect to `/api/podcasts`.
- [x] **Generate Button**: Create a prominent "Generate Podcast" button in `app/page.tsx`. Connect to `/api/podcasts/generate` and handle loading states (this might take a while to process).

## Phase 6: Integration & Polish
- [x] Verify the full flow: Add Feed -> Generate -> Wait -> Play Audio.
- [x] Add basic error handling (invalid RSS, API failures).
- [x] Refine the Prompt engineering for Gemini to ensure the script sounds natural.
- [x] Ensure the generated audio files are accessible publicly (saved in `public/podcasts` or served via a static route).

## Phase 7: Completion & Version Control
- [x] Verify application functionality.
- [x] Create a `README.md` file explaining the application functions, how to interact with them, the architecture, file breakdown and how to run and test it locally.
- [x] Add all changes to the repository (`git add .`).
- [x] Commit the changes (`git commit -m "Complete implementation of Podcast Generator"`).
- [x] Push the feature branch to the remote repository, creating a branch with the same name in the remote repository, using the Gemini CLI github MCP server.
- [x] Open a pull request for the feature branch using the Gemini CLI github MCP server, leave it open for review, don't merge it.
