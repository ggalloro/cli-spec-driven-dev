# Implementation Plan - North Pole Wishlist

## Phase 0: Git Setup
- [x] Check if the current directory is an initialized git repository.
- [x] If it is, create and checkout a new feature branch named `north-pole-wishlist`.

## Phase 1: Environment & Configuration
- [x] **Initialize Project**: Create a virtual environment (`venv`), activate it, and create a `requirements.txt` file with dependencies: `Flask`, `SQLAlchemy`, `Flask-SQLAlchemy`, `Flask-WTF`, `email_validator`.
- [x] **Project Structure**: Create the basic folder structure: `app/` (with `__init__.py`), `app/models`, `app/routes`, `app/templates`, `app/static`, `instance/`.
- [x] **Configuration**: Create `config.py` in the root with `Config` class (Secret Key, Database URI).
- [x] **Application Factory**: In `app/__init__.py`, implement the `create_app` factory function, initialize `db` (SQLAlchemy), and register blueprints (to be created later).
- [x] **Run Script**: Create a `run.py` entry point to start the Flask development server. Verify the server starts.

## Phase 2: Database & Models
- [x] **Database Setup**: Configure SQLite for development in `config.py`. Initialize `Flask-SQLAlchemy` in `app/extensions.py` (or `__init__.py`).
- [x] **Model: GiftIdea**: Create `app/models/gift_idea.py` defining the `GiftIdea` model (id, title, description, category, created_at) using SQLAlchemy 2.0 `Mapped` and `mapped_column`.
- [x] **Model: Vote**: Create `app/models/vote.py` defining the `Vote` model (id, gift_id, score, created_at). Add relationship to `GiftIdea`.
- [x] **Model: Comment**: Create `app/models/comment.py` defining the `Comment` model (id, gift_id, author_name, content, created_at). Add relationship to `GiftIdea`.
- [x] **Migration/Initialization**: Create a CLI command or script to `db.create_all()` to initialize the database tables. Verify `instance/database.db` (or similar) is created.

## Phase 3: Core Backend Functionality
- [x] **Forms**: Create `app/forms.py` using `Flask-WTF`. Define `GiftForm` (title, description, category select), `VoteForm` (score select/radio), and `CommentForm` (author_name, content).
- [x] **Route: Home (Read)**: Create `app/routes/main.py` blueprint. Implement route `/` to query all `GiftIdea` records (using `db.session.execute(sa.select(...))`). Pass data to a temporary template.
- [x] **Route: Submit Gift (Create)**: Implement route `/gift/new` in `main.py`. Handle GET (render form) and POST (validate and save new `GiftIdea`).
- [x] **Route: Vote (Update/Create)**: Implement route `/gift/<int:id>/vote`. Handle POST request to add a `Vote` entry.
- [x] **Route: Comment (Create)**: Implement route `/gift/<int:id>/comment`. Handle POST request to add a `Comment`.

## Phase 4: Frontend Implementation
- [x] **Base Template**: Create `app/templates/base.html`. Setup HTML5 boilerplate, include Bootstrap 5 CDN (CSS/JS), and define blocks for `content`, `title`.
- [x] **Holiday Theme**: Add a `<style>` block or `app/static/css/style.css` to override Bootstrap colors with the Holiday palette (Red #D42426, Green #165B33, etc.) and fonts.
- [x] **Hero Asset**: Generate or add the "Santa Claus flying on his sleigh" hero image to `app/static/img/hero.png` and include it in `base.html`.
- [x] **Home Page Template**: Create `app/templates/home.html`. Extend `base.html`. Use Bootstrap Cards to display the list of `GiftIdea` items.
- [x] **Submission Page Template**: Create `app/templates/submit_gift.html`. Render the `GiftForm` with Bootstrap styling.
- [x] **Interactions UI**: Add Vote buttons/form and Comment section within the Gift Card or a Modal on the Home page.

## Phase 5: Business Logic & Refinement
- [x] **Ranking Logic**: Update the Home route query to calculate average score and vote count for each gift. Sort results based on `sort_by` parameter (popularity, rating, newest).
- [x] **Filtering**: Implement filtering by `category` query parameter in the Home route.
- [x] **Frontend Polish**: specific UI elements like Snowflakes for rating display, "Naughty or Nice" badges.
- [x] **Validation & Error Handling**: Ensure standard error pages (404, 500) and flash messages for successful submissions/errors.

## Phase 6: Completion & Version Control
- [ ] **Manual Testing**: specific walkthrough of all features: Submit a gift, Vote on it, Comment on it, Filter by category, Sort by popularity.
- [ ] **Documentation**: Create `README.md` with:
    - Project Description.
    - Setup instructions (venv, install requirements).
    - Run instructions (`python run.py`).
    - Explanation of features.
- [ ] **Git Finalization**:
    - `git add .`
    - `git commit -m "Complete implementation of North Pole Wishlist"`
    - `git push origin north-pole-wishlist` (and create PR if applicable/using GitHub MCP).
