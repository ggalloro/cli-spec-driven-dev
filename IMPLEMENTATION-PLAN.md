# Implementation Plan - Podcast Generator

## Phase 0: Git Setup
- [x] Check if the current directory is an initialized git repository.
- [x] If it is, create and checkout a new feature branch named "podcast-generator".

## Phase 1: Project Initialization & Environment
- [x] Initialize a new Next.js application (App Router, TypeScript, Tailwind CSS) using `create-next-app`.
- [x] Install required dependencies: `@google/genai` (Gemini), `@google-cloud/text-to-speech` (TTS), `rss-parser` (RSS).
- [x] Configure `tailwind.config.ts` to match the project's design needs (if any specific overrides are needed).
- [x] Create a `.env.local` file template with placeholders for `GEMINI_API_KEY` and `GOOGLE_APPLICATION_CREDENTIALS`.
- [x] Create the project folder structure for services (`lib/`) and components (`components/`).

## Phase 2: Core Backend Services
- [x] **RSS Service**: Implement `lib/rss.ts` to fetch and parse RSS feeds using `rss-parser`. Return standardized article objects.
- [x] **AI Service**: Implement `lib/gemini.ts` using `@google/genai` to summarize article text and generate Intro/Outro scripts.
- [x] **TTS Service**: Implement `lib/tts.ts` using `@google-cloud/text-to-speech` to convert text to MP3 audio using Chirp voices.
- [x] **Audio Utility**: Implement `lib/audio.ts` to handle binary buffer concatenation and file saving to the `public/podcasts/` directory.

## Phase 3: API Development
- [x] Create the API route `app/api/generate/route.ts`.
- [x] Implement request validation (ensure `feedUrls` are provided).
- [x] Orchestrate the pipeline: Fetch RSS -> Summarize (Gemini) -> Synthesize (TTS) -> Compile Audio -> Save File.
- [x] Implement error handling and return the Podcast object (ID, URL, Duration).

## Phase 4: Frontend Development
- [x] **Asset Generation**: Generate the Hero Image (Robot Agent in TV Studio) using the Nano Banana extension and save to `public/hero-robot.png`.
- [x] **UI Components**: Create `components/FeedInput.tsx` for adding RSS URLs and `components/FeedList.tsx` for displaying/removing them.
- [x] **Player Component**: Create `components/AudioPlayer.tsx` using standard HTML5 audio with Tailwind styling.
- [x] **Main Page Integration**: specific implementation in `app/page.tsx` to manage state (active feeds, loading status, generated podcast) and assemble the UI components.

## Phase 5: Completion & Version Control
- [x] Verify application functionality (End-to-End test of generating and playing a podcast).
- [x] Create a `README.md` file explaining the application functions, how to interact with them, the architecture, file breakdown, and how to run and test it locally.
- [ ] Add all changes to the repository (`git add .`).
- [ ] Commit the changes (`git commit -m "Complete implementation of Podcast Generator"`).
- [ ] Push the feature branch to the remote repository, creating a branch with the same name in the remote repository, using the Gemini CLI github MCP server.
- [ ] Open a pull request for the feature branch using the Gemini CLI github MCP server, leave it open for review, don't merge it.
