# Implementation Plan - Podcast Generator

## Phase 0: Git Setup
- [x] Check if the current directory is an initialized git repository.
- [x] If it is, create and checkout a new feature branch named "podcast-generator".

## Phase 1: Project Initialization & Configuration
- [x] Initialize a new Next.js project with Tailwind CSS (`npx create-next-app@latest podcast-generator --typescript --tailwind --eslint`).
- [x] Install project dependencies: `npm install google-genai rss-parser uuid`.
- [x] Create a `.env.local` file for environment variables (`GOOGLE_API_KEY`, `PROJECT_ID`).
- [x] Generate a Hero Image ("Robot Agent in TV Studio") using the Nano Banana extension and save it to `public/hero-image.png`.
- [x] Verify the application runs locally (`npm run dev`).

## Phase 2: Data Layer & API - Feeds
- [x] Create a utility module `lib/store.ts` to handle reading/writing to a local JSON file (`data/db.json`) for data persistence. Define the `Feed` and `Podcast` interfaces here.
- [x] Implement the API route `GET /api/feeds` to retrieve the list of stored feeds.
- [x] Implement the API route `POST /api/feeds` to add a new feed. This must use `rss-parser` to validate the URL and fetch the feed title before saving.
- [x] Implement the API route `DELETE /api/feeds` to remove a feed by ID.
- [x] Verify API endpoints using `curl` or a tool like Postman.

## Phase 3: Frontend - Layout & Feed Manager
- [x] Update `app/layout.tsx` and `app/page.tsx` to implement the basic two-column layout. Include the Hero Image at the top.
- [x] Create a `components/FeedManager.tsx` component. This should include:
    - An input form to add a new RSS feed URL.
    - A list displaying currently added feeds with a "Remove" button.
- [x] Connect `FeedManager` to the `/api/feeds` endpoints to fetch, add, and delete feeds dynamically.
- [x] Verify the Feed Manager UI works correctly (adding valid/invalid URLs, removing feeds).

## Phase 4: API - Podcast Generation Logic
- [x] Create the `POST /api/podcasts/generate` endpoint. This should:
    - Accept a request to start generation.
    - Create a new "PENDING" podcast record in the DB.
    - Trigger the generation process asynchronously (or simulate async if Vercel limits apply, but for local use, normal async is fine).
    - Return the `podcastId`.
- [x] Implement the "Fetch & Filter" logic: Fetch articles from all stored feeds and filter for those published in the last 24 hours.
- [x] Implement the "Summarization" service: Use `google-genai` (`gemini-2.5-flash`) to summarize each article into a short script segment.
- [x] Implement the "Script Compilation" logic: specific Intro + Summaries + Outro.
- [x] Implement the "Audio Synthesis" service: Use `google-genai` (or specific TTS endpoint if `google-genai` audio generation is distinct) to convert the full script to speech. Save the resulting audio buffer to `public/podcasts/[id].mp3`.
- [x] Update the podcast record in `data/db.json` to "COMPLETED" with the path and duration.
- [x] Implement `GET /api/podcasts` to list all generated podcasts.
- [x] Implement `GET /api/podcasts/[id]` to return the status of a specific generation job.

## Phase 5: Frontend - Podcast Player & History
- [x] Create a `components/PodcastGenerator.tsx` component with a "Generate Podcast" button.
    - It should call `/api/podcasts/generate`.
    - It should display a loading state (spinner) while polling `/api/podcasts/[id]` until status is "COMPLETED".
- [x] Create a `components/PodcastList.tsx` component to display the history of generated podcasts.
- [x] Create/Integrate an `AudioPlayer` component (standard HTML5 `<audio>` tag styled with Tailwind) to play the generated files.
- [x] Integrate these components into the main page layout.
- [x] Verify the full flow: Add Feed -> Generate -> Wait -> Play Audio.

## Phase 6: Completion & Version Control
- [x] Verify application functionality.
- [x] Create a `README.md` file explaining the application functions, how to interact with them, the architecture, file breakdown and how to run and test it locally.
- [x] Add all changes to the repository (`git add .`).
- [x] Commit the changes (`git commit -m "Complete implementation of Podcast Generator"`).
- [x] Push the feature branch to the remote repository, creating a branch with the same name in the remote repository, using the Gemini CLI github MCP server.
- [x] Open a pull request for the feature branch using the Gemini CLI github MCP server, leave it open for review, don't merge it.
