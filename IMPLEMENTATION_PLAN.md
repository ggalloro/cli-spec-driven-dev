# Implementation Plan - Podcast Generator

## Phase 0: Git Setup
- [x] Check if the current directory is an initialized git repository.
- [x] If it is, create and checkout a new feature branch named `podcast-generator`.

## Phase 1: Project Initialization & Configuration
- [x] Initialize a new Next.js project using `create-next-app` with TypeScript, Tailwind CSS, and App Router.
- [x] Install necessary dependencies: `google-genai` (using `@google/generative-ai` for Node), `@google-cloud/text-to-speech`, `rss-parser`, `fluent-ffmpeg`, `uuid`.
- [x] Install dev dependencies for types: `@types/fluent-ffmpeg`, `@types/uuid`.
- [x] Configure `tailwind.config.ts` (Using Tailwind v4 default CSS configuration).
- [x] Create the directory structure as defined in the Tech Spec (`/lib`, `/public/podcasts`, `/app/api/...`).
- [x] Set up environment variables (e.g., `GOOGLE_API_KEY`, `GOOGLE_APPLICATION_CREDENTIALS`).

## Phase 2: Backend Core Libraries (Data & Logic)
- [x] Implement `/lib/storage.ts`: Create functions to read/write `feeds.json` and `podcasts.json` (mock DB). Define TypeScript interfaces `Feed` and `Podcast`.
- [x] Implement `/lib/rss.ts`: Create function `fetchLatestArticles(feedUrl)` using `rss-parser`.
- [x] Implement `/lib/gemini.ts`: Initialize Google Gen AI client and create `summarizeArticle(text)` function using `gemini-2.5-flash`.
- [x] Implement `/lib/tts.ts`: Initialize Google Cloud TTS client and create `generateAudioSegment(text)` function.
- [x] Implement `/lib/audio.ts`: Logic to merge audio segments using `fluent-ffmpeg`.

## Phase 3: API Routes Implementation
- [x] Implement `GET /api/feeds`: Retrieve all feeds from storage.
- [x] Implement `POST /api/feeds`: Validate URL, fetch title, add to storage.
- [x] Implement `DELETE /api/feeds`: Remove feed by ID.
- [x] Implement `GET /api/podcasts`: Retrieve podcast history.
- [x] Implement `POST /api/generate`: Orchestrate the full pipeline (Fetch -> Summarize -> Script -> Synthesize -> Merge -> Save).

## Phase 4: Frontend Components & UI
- [x] Generate the "Robot News Anchor" hero image using Nano Banana and save to `/public`.
- [x] Create `FeedList` component: Display feeds, input for new feed, delete button. Connect to API.
- [x] Create `PodcastPlayer` component: List previous podcasts, play audio, download button. Connect to API.
- [x] Implement `HomePage` (`/app/page.tsx`): Assemble the Hero, FeedList, Generate Button, and PodcastPlayer.
- [x] Add loading states and error handling for the "Generate Podcast" action.

## Phase 5: Testing & Refinement
- [x] Verify RSS feed addition with valid/invalid URLs.
- [x] Test Podcast Generation flow (end-to-end) and check generated MP3 quality/content.
- [x] Ensure audio playback works correctly in the browser.
- [x] Polish UI with Tailwind CSS (responsiveness, spacing, typography).

## Phase 6: Completion & Version Control
- [x] Verify application functionality.
- [x] Create a `README.md` file explaining the application functions, how to interact with them, the architecture, file breakdown and how to run and test it locally.
- [x] Add all changes to the repository (`git add .`).
- [x] Commit the changes (`git commit -m "Complete implementation of Podcast Generator"`).
- [x] Push the feature branch to the remote repository, creating a branch with the same name in the remote repository, using the Gemini CLI github MCP server.
- [x] Open a pull request for the feature branch using the Gemini CLI github MCP server, leave it open for review, don't merge it.
