# North Pole Wishlist 🎅

Welcome to the North Pole Wishlist, a festive community platform where users can share, discover, and vote on the best holiday gift ideas!

## Features

- **Gift Submission**: Share your unique gift ideas with the community.
- **Categorization**: Organize gifts by categories like Kids, Parents, Tech, DIY, etc.
- **Voting ("Naughty or Nice")**: Upvote your favorite gifts to help them reach the top of the "Nice List".
- **Comments**: Discuss gift ideas, ask for purchase links, or share reviews.
- **Festive UI**: A fully themed "Santa's Workshop" interface using Tailwind CSS.

## Tech Stack

- **Backend**: Python, Flask, SQLAlchemy 2.0
- **Database**: SQLite (Development), with Flask-Migrate (Alembic)
- **Frontend**: HTML5 (Jinja2 Templates), Tailwind CSS, Vanilla JavaScript

## Setup & Running Locally

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd north-pole-wishlist
    ```

2.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

3.  **Initialize the Database**:
    ```bash
    export FLASK_APP=run.py
    flask db upgrade
    ```

4.  **Run the Application**:
    ```bash
    python run.py
    ```

5.  **Visit**: Open [http://127.0.0.1:5000](http://127.0.0.1:5000) in your browser.

## API Endpoints

- `GET /api/gifts`: List all gifts (supports `category` and `sort_by` params).
- `POST /api/gifts`: Submit a new gift.
- `POST /api/gifts/<id>/vote`: Vote for a gift.
- `POST /api/gifts/<id>/comments`: Add a comment.
- `GET /api/gifts/<id>/comments`: Get comments for a gift.

## Project Structure

- `app/`: Application source code.
    - `models.py`: Database models.
    - `routes.py`: API endpoints and views.
    - `templates/`: HTML templates.
    - `static/`: CSS/JS assets.
- `migrations/`: Database migration scripts.
- `config.py`: Configuration settings.
- `run.py`: Entry point.
