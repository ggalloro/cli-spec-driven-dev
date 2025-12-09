# Implementation Plan - North Pole Wishlist

## Phase 0: Git Setup
- [x] Check if the current directory is an initialized git repository.
- [x] If it is, create and checkout a new feature branch named `north-pole-wishlist`.

## Phase 1: Project Initialization & Structure
- [x] Create a virtual environment and activate it.
- [x] Create a `requirements.txt` file with dependencies: `Flask`, `Flask-SQLAlchemy`, `Flask-WTF`, `email_validator`.
- [x] Install dependencies.
- [x] Create the project directory structure:
    ```
    north_pole_wishlist/
    ├── static/
    │   ├── css/
    │   └── images/
    ├── templates/
    ├── models.py
    ├── forms.py
    ├── routes.py
    ├── config.py
    └── app.py
    ```
- [x] Create `config.py` with basic Flask configuration and SQLite database URI.
- [x] Create a basic `app.py` to verify the setup and serve a "Hello World" route.

## Phase 2: Database Models (SQLAlchemy 2.0)
- [x] Implement the `Gift` model in `models.py` using `so.Mapped` and `so.mapped_column`.
- [x] Implement the `Vote` model in `models.py` with a relationship to `Gift`.
- [x] Implement the `Comment` model in `models.py` with a relationship to `Gift`.
- [x] Configure the database extension in `app.py` and import models.
- [x] Create a script or use `flask shell` to initialize the SQLite database tables.

## Phase 3: Forms & Backend Logic
- [x] Create `forms.py` using WTForms.
    - [x] `GiftForm`: title (max 100), description (max 500), category (SelectField).
    - [x] `VoteForm`: score (integer 1-5).
    - [x] `CommentForm`: author_name (optional), content (max 500).
- [x] Create `routes.py` and register a blueprint or attach to app.
- [x] Implement the `GET /gift/new` and `POST /gift/new` logic to add gifts to the database.
- [x] Implement `POST /gift/<int:gift_id>/vote` logic.
- [x] Implement `POST /gift/<int:gift_id>/comment` logic.

## Phase 4: Views & Templates (Basic)
- [x] Create `templates/base.html` with Bootstrap 5 CDN links and a navigation bar.
- [x] Create `templates/index.html` to display a simple list of gifts (fetching all gifts for now).
- [x] Create `templates/create_gift.html` to render the `GiftForm`.
- [x] Create `templates/gift_detail.html` to show gift details, comments, and the voting form.
- [x] Update `routes.py` to render these templates instead of returning strings.

## Phase 5: Theming & Visuals
- [x] Create `static/css/style.css` and define the Christmas color palette:
    - Red: `#D42426`, Green: `#165B33`, White: `#F8F9FA`, Gold: `#FFD700`.
- [x] Update `base.html` to include `style.css` and Google Fonts (*Mountains of Christmas*, *Merryweather*).
- [x] Generate the "Santa Claus flying on his sleigh" hero image using Nano Banana and save to `static/images/hero.png`.
- [x] Update `index.html` to include the Hero image section.
- [x] Style the "Snowflake" rating system in `gift_detail.html` (using icons).
- [x] Create a custom 404 page `templates/404.html` with the "Lost in the Snow" theme.

## Phase 6: Advanced Logic (Sorting & Filtering)
- [x] Update `routes.py` for the Home route (`/`) to accept `category` and `sort_by` query parameters.
- [x] Implement SQLAlchemy 2.0 queries for filtering by category.
- [x] Implement sorting logic:
    - [x] Recency (default): `gift.created_at` desc.
    - [x] Top Rated: Average vote score.
    - [x] Most Popular: Total vote count.
- [x] Update `index.html` to include UI controls for filtering (dropdown/links) and sorting.

## Phase 7: Completion & Version Control
- [ ] Verify application functionality (Create gift, Vote, Comment, Filter, Sort).
- [ ] Run a final lint/formatting check.
- [ ] Create a `README.md` file explaining the architecture, how to run the app, and the features.
- [ ] Add all changes to the repository (`git add .`).
- [ ] Commit the changes (`git commit -m "Complete implementation of North Pole Wishlist"`).
- [ ] Push the feature branch to the remote repository.
- [ ] Open a pull request for the feature branch.
