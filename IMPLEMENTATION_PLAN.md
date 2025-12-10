# Implementation Plan - North Pole Wishlist

## Phase 0: Git Setup & Initialization
- [x] Check if the current directory is an initialized git repository.
- [x] Create and checkout a new feature branch named `north-pole-wishlist`.
- [x] Create the project directory structure (`north_pole_wishlist/`, `app/`, `app/static`, `app/templates`, etc.) as defined in the Tech Spec.
- [x] Initialize a virtual environment (`venv`) and create a `requirements.txt` file with dependencies (`Flask`, `SQLAlchemy`, `Flask-SQLAlchemy`).

## Phase 1: Backend Core (Database & Models)
- [x] Create `config.py` with database URI (SQLite) and secret key configuration.
- [x] Implement `app/models.py` defining `GiftIdea`, `Vote`, and `Comment` classes using strict SQLAlchemy 2.0 style (`Mapped`, `mapped_column`).
- [x] Implement `app/__init__.py` to set up the Flask app factory and initialize the database extension.
- [x] Create a script or CLI command to initialize the database tables (`db.create_all()`).

## Phase 2: Frontend Base & Assets
- [x] Create `app/templates/base.html` with Bootstrap 5 CDN links and the festive color palette (CSS variables for `#D42426`, `#165B33`, etc.).
- [x] Create `app/static/css/style.css` to implement the "Christmas Aesthetic" (fonts, background colors).
- [x] Generate the Hero Image ("Santa Claus flying on his sleigh") using Nano Banana and save to `app/static/img/hero.png`.
- [x] Generate festive icons (Snowflakes, Gift Tags) using Nano Banana or find suitable Bootstrap Icons/FontAwesome replacements.

## Phase 3: Gift Management (Submit & View)
- [x] Implement the `POST /submit` route in `app/routes.py` to handle form submissions and save new `GiftIdea` records.
- [x] Create `app/templates/submit.html` with a form for Title, Description, and Category (dropdown).
- [x] Implement the `GET /` route in `app/routes.py` to fetch all gift ideas, supporting sorting (Ranking/Recency) and category filtering.
- [x] Create `app/templates/index.html` to display the gift feed in a grid or list view, showing title, description, and stats.

## Phase 4: Interaction Features (Voting & Comments)
- [x] Implement the `GET /gift/<id>` route to show gift details, comments, and the voting interface.
- [x] Create `app/templates/detail.html` extending `base.html` to render the single gift view.
- [x] Implement `POST /gift/<id>/vote` logic to calculate and save 1-5 snowflake ratings.
- [x] Implement `POST /gift/<id>/comment` logic to save user comments.
- [x] Update the `GiftIdea` model or queries to efficiently calculate average score and vote counts for ranking.

## Phase 5: Polishing & Testing
- [x] Verify all routes and forms work as expected (Validation checks).
- [x] ensure the ranking algorithm (Average Score > Vote Count) works correctly on the Home page.
- [x] Refine CSS to ensure the "Christmas Aesthetic" is consistent and responsive.

## Phase 6: Completion & Version Control
- [ ] Verify application functionality (Walkthrough of all features).
- [ ] Create a `README.md` file in the project root explaining the application, setup instructions, and architecture.
- [ ] Add all changes to the repository (`git add .`).
- [ ] Commit the changes (`git commit -m "Complete implementation of North Pole Wishlist"`).
- [ ] Push the feature branch to the remote repository.
- [ ] Open a pull request for the feature branch using the Gemini CLI github MCP server.
