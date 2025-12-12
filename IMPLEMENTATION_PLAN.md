# Implementation Plan - North Pole Wishlist

## Phase 0: Git Setup
- [x] Check if the current directory is an initialized git repository.
- [x] If it is, create and checkout a new feature branch named `north-pole-wishlist` (derived from the application name).

## Phase 1: Environment & Project Structure
- [x] Initialize the project structure: create `app/`, `app/templates`, `app/static/css`, `app/static/img` directories.
- [x] Create a virtual environment `venv` and activate it (instructional step for the user/agent).
- [x] Create `requirements.txt` with dependencies: `Flask`, `Flask-SQLAlchemy`, `Flask-WTF`, `email-validator` (if needed for extensive validation, strictly strictly adherence to spec: spec doesn't ask for email, so just core libs).
- [x] Create `run.py` as the entry point.
- [x] Create `app/__init__.py` to initialize the Flask application, database extension, and configuration (Secret Key, DB URI).
- [x] Create a dummy route in `app/routes.py` and register it in `__init__.py` to verify the server runs.

## Phase 2: Database Layer
- [x] Create `app/models.py`.
- [x] Define the `CategoryEnum` class with the specified values.
- [x] Define the `GiftIdea` model using SQLAlchemy 2.0 style (`Mapped`, `mapped_column`) with fields: `id`, `name`, `description`, `category`, `created_at`.
- [x] Define the `Vote` model with fields: `id`, `gift_id`, `score` (1-5), `created_at`.
- [x] Define the `Comment` model with fields: `id`, `gift_id`, `author_name`, `content`, `created_at`.
- [x] Configure relationships between `GiftIdea`, `Vote`, and `Comment`.
- [x] Create a CLI command or update `run.py` context to initialize the database (`db.create_all()`) and test creating a sample entry.

## Phase 3: Gift Submission Feature
- [x] Create `app/forms.py` using Flask-WTF.
- [x] Define `GiftForm` with fields: `name`, `description`, `category` (SelectField). Add validators (DataRequired, Length).
- [x] Create `app/templates/base.html` with the Bootstrap 5 CDN links and a basic navigation bar structure.
- [x] Create `app/templates/submit_gift.html` extending `base.html` to render the `GiftForm`.
- [x] Implement `GET /submit` in `app/routes.py` to render the template.
- [x] Implement `POST /submit` in `app/routes.py` to validate form data and save the new `GiftIdea` to the database. Flash a success message upon completion.

## Phase 4: Feed & Filtering
- [x] Create `app/templates/index.html` extending `base.html`.
- [x] Implement `GET /` in `app/routes.py`.
- [x] Write SQLAlchemy 2.0 queries to fetch `GiftIdea` records.
- [x] Implement the "New Arrivals" sorting logic (default).
- [x] Implement the "Category" filter logic (query parameter `category`).
- [x] Implement the "Ranking" logic: "Top Rated" (Avg Score) and "Most Popular" (Vote Count).
- [x] Render the list of gifts in `index.html` using a basic Bootstrap Card component.

## Phase 5: Gift Details & Interaction
- [x] Create `app/templates/gift_details.html`.
- [x] Implement `GET /gift/<int:id>` to fetch and display a specific gift, its average score, and comments.
- [x] Update `app/forms.py` to include `VoteForm` (Integer/Radio 1-5) and `CommentForm` (Author, Content).
- [x] Implement `POST /gift/<int:id>/vote` to handle voting.
- [x] Implement `POST /gift/<int:id>/comment` to handle comments.
- [x] Add the forms to `gift_details.html` and display existing comments chronologically.

## Phase 6: The "Christmas Aesthetic" (UI/UX)
- [x] Update `app/templates/base.html` to include the Google Fonts (e.g., 'Mountains of Christmas').
- [x] Create `app/static/css/style.css` and define the color palette variables (`--santa-red`, `--pine-green`, etc.).
- [x] Apply the color palette to the Navbar, Buttons, and Body background.
- [x] Add the Hero Image (Santa on Sleigh) to `index.html`.
- [x] Style the Gift Cards to look like wrapped presents (custom borders/shadows).
- [x] Style the Vote input to use snowflakes (❄️) instead of default radio buttons or stars.

## Phase 7: Completion & Version Control
- [ ] Verify all application functionality (Submission, Browsing, Filtering, Voting, Commenting).
- [ ] Create a `README.md` file explaining the application functions, how to interact with them, the architecture, file breakdown and how to run and test it locally.
- [ ] Add all changes to the repository (`git add .`).
- [ ] Commit the changes (`git commit -m "Complete implementation of North Pole Wishlist"`).
- [ ] Push the feature branch to the remote repository, creating a branch with the same name in the remote repository, using the Gemini CLI github MCP server.
- [ ] Open a pull request for the feature branch using the Gemini CLI github MCP server, leave it open for review, don't merge it.
