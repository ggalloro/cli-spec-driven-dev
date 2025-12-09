# Implementation Plan - North Pole Wishlist

## Phase 0: Git Setup
- [x] Check if the current directory is an initialized git repository.
- [x] If it is, create and checkout a new feature branch named "north-pole-wishlist".

## Phase 1: Environment & Project Initialization
- [x] Create a `requirements.txt` file with dependencies: `Flask`, `SQLAlchemy`, `Flask-SQLAlchemy`, `Flask-Migrate`, `python-dotenv`.
- [x] Create a `config.py` file to handle environment configurations (Secret key, Database URL).
- [x] Create the application package structure: `app/` folder and `app/__init__.py`.
- [x] Implement the Flask "Application Factory" pattern in `app/__init__.py`.
- [x] Create a `run.py` entry point file in the root directory.
- [x] Verify the server starts (`python run.py`) and returns a "Hello World" on the root route.

## Phase 2: Database Layer
- [x] Create `app/models.py`.
- [x] Define the `GiftIdea` model using SQLAlchemy 2.0 syntax (`Mapped`, `mapped_column`).
- [x] Define the `Vote` model with a Foreign Key to `GiftIdea`.
- [x] Define the `Comment` model with a Foreign Key to `GiftIdea`.
- [x] Initialize Flask-Migrate in the app factory.
- [x] Run `flask db init`, `flask db migrate -m "Initial migration"`, and `flask db upgrade` to create the SQLite database.

## Phase 3: Core API & Logic (Backend)
- [x] Create `app/routes.py` and define a Blueprint for the main application.
- [x] Register the Blueprint in `app/__init__.py`.
- [x] Implement `POST /api/gifts` endpoint to accept JSON data and save new gifts.
- [x] Implement `GET /api/gifts` endpoint with query parameters for filtering (`category`) and sorting (`nice_list`, `popularity`, `newest`).
- [x] Implement `POST /api/gifts/<id>/vote` endpoint to save scores.
- [x] Implement `POST /api/gifts/<id>/comments` and `GET /api/gifts/<id>/comments` endpoints.

## Phase 4: Frontend Base & Assets
- [x] Create `app/templates/base.html`.
- [x] Add Tailwind CSS via CDN to `base.html` head.
- [x] Configure the Tailwind theme in `base.html` (script tag) to include custom colors: `santa-red` (red-600), `pine-green` (green-700), `snow-white` (slate-50).
- [x] Build the layout in `base.html`: Festive Header (Navigation), Main Content Block, Footer.
- [x] Add a "Hero" section to the header with a placeholder Santa/Sleigh image.

## Phase 5: Frontend Feature Implementation
- [x] Create `app/templates/index.html` extending `base.html`.
- [x] Implement the "Submit Gift" form in a Modal or separate section on `index.html`.
- [x] Create a Jinja2 macro or component for the "Gift Card" to display Gift Name, Description, Category Badge, and Score.
- [x] Render the list of `GiftIdea` items on `index.html` (server-side initial render).

## Phase 6: Interactivity (JavaScript)
- [x] Create `app/static/js/main.js` and link it in `base.html`.
- [x] Implement AJAX fetch logic to handle the "Submit Gift" form without reloading.
- [x] Add event listeners to the "Vote" buttons (Snowflakes) to call `POST /api/gifts/<id>/vote` and update the UI score dynamically.
- [x] Add "Show Comments" toggle on Gift Cards to fetch and display comments asynchronously.
- [x] Implement the "Post Comment" logic via AJAX.

## Phase 7: Completion & Version Control
- [ ] Verify all functionalities: Submission, Voting, Commenting, Filtering/Sorting.
- [ ] Create a `README.md` file explaining the application functions, architecture, and how to run it locally.
- [ ] Add all changes to the repository (`git add .`).
- [ ] Commit the changes (`git commit -m "Complete implementation of North Pole Wishlist"`).
- [ ] Push the feature branch to the remote repository, creating a branch with the same name in the remote repository, using the Gemini CLI github MCP server.
- [ ] Open a pull request for the feature branch using the Gemini CLI github MCP server, leave it open for review, don't merge it.
