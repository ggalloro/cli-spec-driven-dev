# Implementation Plan - North Pole Wishlist

## Phase 0: Git Setup
- [x] Check if the current directory is an initialized git repository.
- [x] If it is, create and checkout a new feature branch named `north-pole-wishlist`.

## Phase 1: Project Initialization
- [x] Set up a Python virtual environment (`python3 -m venv venv`) and activate it.
- [x] Create a `requirements.txt` file including `Flask`, `Flask-SQLAlchemy`, and any other necessary libraries.
- [x] Install the dependencies (`pip install -r requirements.txt`).
- [x] Create the basic project structure:
    - `app.py` (Main application file)
    - `models.py` (Database models)
    - `templates/` (HTML templates)
    - `static/css/` (Stylesheets)
    - `static/img/` (Images)
- [x] Create a minimal `app.py` to verify the Flask setup works (Hello World).

## Phase 2: Database & Models
- [x] Configure SQLite database connection in `app.py`.
- [x] In `models.py`, define the `Gift` model using SQLAlchemy 2.0 style (Mapped, mapped_column).
    - Fields: `id`, `title`, `description`, `category`, `created_at`.
- [x] In `models.py`, define the `Vote` model.
    - Fields: `id`, `gift_id`, `score`, `created_at`.
- [x] In `models.py`, define the `Comment` model.
    - Fields: `id`, `gift_id`, `author_name`, `content`, `created_at`.
- [x] Create a database initialization script or function to create tables (`db.create_all()`).

## Phase 3: Core Backend Logic & Routes
- [x] Implement the Home route (`GET /`):
    - Query all gifts from the database.
    - Implement filtering by category (via query parameter).
    - Implement sorting (Ranking: avg score, Popularity: vote count, Recency: created_at).
- [x] Implement the Submit Gift route (`GET /gifts/new` & `POST /gifts/new`):
    - GET: Render the submission form.
    - POST: Validate input (lengths, required fields). Create new `Gift` record.
- [x] Implement the Gift Detail route (`GET /gifts/<int:gift_id>`):
    - Query specific gift by ID.
    - Calculate average rating and fetch related comments.
- [x] Implement the Voting route (`POST /gifts/<int:gift_id>/vote`):
    - Validate score (1-5). Create `Vote` record. Redirect or return updated score.
- [x] Implement the Commenting route (`POST /gifts/<int:gift_id>/comment`):
    - Validate content length. Default author name if empty. Create `Comment` record.

## Phase 4: Frontend Implementation
- [x] Create `templates/base.html`:
    - Include Bootstrap 5 via CDN.
    - Link custom CSS (`static/css/style.css`).
    - Define the layout (Navigation, Content Block, Footer).
- [x] Create `static/css/style.css`:
    - Implement the "Christmas Aesthetic" (Deep Red #8B0000, Forest Green #228B22).
    - Style fonts and general layout.
- [x] Create `templates/index.html` (Home):
    - Extend `base.html`.
    - Hero section with Santa image placeholder.
    - Grid of Gift Cards showing Title, Category, Rating.
- [x] Create `templates/submit_gift.html`:
    - Form with fields: Title, Category (Select), Description.
- [x] Create `templates/gift_detail.html`:
    - Detailed view of the gift.
    - Section for Voting (Snowflake icons).
    - Section for Comments list and "Add Comment" form.

## Phase 5: Refinement & Assets
- [x] Add the "Santa flying on sleigh" hero image to `static/img/` (or use a placeholder/generated one).
- [x] Add the "Snowflake" icon for ratings (SVG or image).
- [x] Ensure all forms have proper HTML5 validation attributes (`required`, `maxlength`).
- [x] Test all routes and flows manually to ensure stability.

## Phase 6: Completion & Version Control
- [ ] Verify application functionality (Submit a gift, vote on it, comment on it, check filters).
- [ ] Create a `README.md` file:
    - Explain features (Gift submission, Voting, Comments).
    - Instructions to run locally (`python app.py`).
    - Tech stack details.
- [ ] Add all changes to the repository (`git add .`).
- [ ] Commit the changes (`git commit -m "Complete implementation of North Pole Wishlist"`).
- [ ] Push the feature branch to the remote repository.
