# Implementation Plan - Podcast Generator

## Phase 0: Git Setup
- [x] Check if the current directory is an initialized git repository.
- [x] If it is, create and checkout a new feature branch named `podcast-generator`.

## Phase 1: Project Initialization
- [x] Initialize a new Next.js application using `create-next-app` with TypeScript, Tailwind CSS, and App Router.
- [x] Install necessary backend dependencies: `rss-parser`, `@google/genai` (for Gemini), `@google-cloud/text-to-speech`.
- [x] Install utility dependencies: `uuid`, `clsx`, `tailwind-merge`.
- [x] Create a `.env.local` file and add placeholders for `GEMINI_API_KEY` and `GOOGLE_APPLICATION_CREDENTIALS` (content/path).
- [x] Verify the project builds and runs locally (`npm run dev`).

## Phase 2: Core Frontend UI
- [x] Create a global Context (`FeedContext`) to manage the list of RSS feeds and generated podcasts state.
- [x] Create a `Hero` component with a placeholder or generated image of a robot news anchor.
- [x] Create a `FeedInput` component allows users to type a URL and add it to the state.
- [x] Create a `FeedList` component to display active feeds with a "Remove" button.
- [x] Create a `PodcastPlayer` component that wraps the standard HTML5 audio element and displays podcast details.
- [x] Assemble the `page.tsx` with the Hero, Feed management section, and a "Generate Podcast" button (initially disabled if no feeds).

## Phase 3: Backend Services - RSS & Gemini
- [x] Create a Next.js API route handler at `app/api/generate/route.ts`.
- [x] Implement the `fetchFeeds` function: Use `rss-parser` to fetch user-provided URLs, merge items, sort by date, and slice the top 3 unique articles.
- [x] Implement the `summarizeArticle` function: Use `@google/genai` to send article content to the Gemini `gemini-2.5-flash` model with the specific prompt defined in specs.
- [x] Create an "Intro" and "Outro" script generator (can be simple static text or AI-enhanced).

## Phase 4: Backend Services - Audio & Stitching
- [x] Implement the `generateAudio` function: Use `@google-cloud/text-to-speech` to convert text segments (Intro, Summaries, Outro) into MP3 binary buffers.
- [x] Implement the `stitchAudio` function: Concatenate the resulting audio buffers into a single buffer.
- [x] Implement file saving: Write the final buffer to `public/podcasts/[uuid].mp3`.
- [x] Ensure the `public/podcasts` directory exists or create it dynamically.

## Phase 5: Integration & Polish
- [x] Connect the Frontend "Generate" button to the `/api/generate` endpoint.
- [x] Implement a loading state in the UI (spinner or progress bar) while the API is processing.
- [x] Handle API responses: On success, update the `PodcastContext` with the new podcast URL and show the Player.
- [x] Implement error handling: Display toast notifications or alerts if RSS fetching or AI generation fails.
- [x] Style the application using Tailwind CSS to match the "modern & clean" aesthetic.

## Phase 6: Completion & Version Control
- [ ] Verify application functionality: Add feeds, generate podcast, play audio.
- [ ] Create a `README.md` file explaining the application functions, how to interact with them, the architecture, file breakdown and how to run and test it locally.
- [ ] Add all changes to the repository (`git add .`).
- [ ] Commit the changes (`git commit -m "Complete implementation of Podcast Generator"`).
- [ ] Push the feature branch to the remote repository, creating a branch with the same name in the remote repository, using the Gemini CLI github MCP server.
- [ ] Open a pull request for the feature branch using the Gemini CLI github MCP server, leave it open for review, don't merge it.
