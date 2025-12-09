# Implementation Plan - North Pole Wishlist

## Phase 0: Git Setup
- [x] Check if the current directory is an initialized git repository.
- [x] If it is, create and checkout a new feature branch named "north-pole-wishlist".

## Phase 1: Environment & Project Structure
- [x] Set up a Python virtual environment and activate it.
- [x] Install required packages: `Flask`, `Flask-SQLAlchemy`, `Flask-WTF`, `email_validator` (if needed for WTForms).
- [x] Create `requirements.txt` with frozen dependencies.
- [x] Create project structure:
    ```
    /
    ├── app.py
    ├── config.py
    ├── models.py
    ├── forms.py
    ├── static/
    │   ├── css/
    │   │   └── style.css
    │   └── images/
    └── templates/
        ├── base.html
        ├── index.html
        ├── submit.html
        └── detail.html
    ```
- [x] Create `config.py` with secret key and database URI configuration.
- [x] Create a basic `app.py` to verify Flask runs.

## Phase 2: Database & Models
- [x] Configure `Flask-SQLAlchemy` in `app.py` using modern SQLAlchemy 2.0 style.
- [x] In `models.py`, implement the `Gift` model with fields: `id`, `title`, `description`, `category`, `created_at`.
- [x] In `models.py`, implement the `Vote` model with fields: `id`, `gift_id`, `score`.
- [x] In `models.py`, implement the `Comment` model with fields: `id`, `gift_id`, `author_name`, `content`, `created_at`.
- [x] Create a database initialization script or function to create tables (`db.create_all()`).

## Phase 3: Forms & Backend Logic
- [x] In `forms.py`, create `GiftForm` using Flask-WTF (Title, Description, Category select).
- [x] In `forms.py`, create `CommentForm` (Author Name, Content).
- [x] In `forms.py`, create `VoteForm` (Score integer/radio).
- [x] In `app.py`, implement the `POST /gift/new` route to handle gift submission and validation.
- [x] In `app.py`, implement the `POST /gift/<int:id>/vote` route to save votes.
- [x] In `app.py`, implement the `POST /gift/<int:id>/comment` route to save comments.
- [x] In `app.py`, implement the `GET /` route with query parameters for sorting (Ranking/Recency) and filtering (Category). Use `sqlalchemy.select` with `func.avg` for ranking logic.

## Phase 4: Frontend - Base & Home
- [x] Create `templates/base.html` including Bootstrap 5 (via CDN) and a custom stylesheet link.
- [x] In `static/css/style.css`, define the "Christmas" theme variables:
    - Primary: `#D42426` (Santa Red)
    - Success: `#165B33` (Pine Green)
    - Background: `#F8F8FF` (Snow White)
- [x] Generate a "Santa flying on a sleigh" hero image using Nano Banana (or use a placeholder) and save to `static/images/hero.png`.
- [x] Implement `templates/index.html`:
    - Display the Hero image.
    - Add Filter and Sort controls (dropdowns/links).
    - Iterate through gifts and display them as Bootstrap Cards.
    - Show average rating and comment count on cards.

## Phase 5: Frontend - Details & Interactions
- [x] Implement `templates/submit.html`: Render `GiftForm` with festive styling.
- [x] Implement `templates/detail.html`:
    - Display full gift details.
    - Show list of comments.
    - Render `CommentForm` for new comments.
    - Render `VoteForm` or a custom interactive star/snowflake rating widget.
- [x] Integrate "Snowflake" icons (Bootstrap Icons `bi-snow2`) for ratings in both the list and detail views.

## Phase 6: Final Polish
- [x] Add Flash message support in `base.html` for feedback (e.g., "Gift submitted!", "Vote cast!").
- [x] Ensure all forms have validation error display.
- [x] Verify responsive layout on mobile/desktop.

## Phase 7: Completion & Version Control
- [ ] Verify application functionality (Submit gift, Vote, Comment, Sort/Filter).
- [ ] Create a `README.md` file explaining the application functions, how to interact with them, the architecture, file breakdown and how to run and test it locally.
- [ ] Add all changes to the repository (`git add .`).
- [ ] Commit the changes (`git commit -m "Complete implementation of North Pole Wishlist"`).
- [ ] Push the feature branch to the remote repository, creating a branch with the same name in the remote repository.
- [ ] Open a pull request for the feature branch using the Gemini CLI github MCP server, leave it open for review, don't merge it.
