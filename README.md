# North Pole Wishlist

A community-driven platform to discover, share, and curate the best holiday gift ideas.

## Features

-   **Gift Ideas**: Submit and browse gift suggestions with categories.
-   **Voting**: Rate gifts on a 5-snowflake scale ("Naughty or Nice").
-   **Comments**: Discuss gift ideas with the community.
-   **Sorting & Filtering**: Find the best gifts by Popularity, Rating, or Category.
-   **Festive Theme**: A fully immersive Christmas design.

## Architecture

-   **Backend**: Python Flask
-   **Database**: SQLite with SQLAlchemy 2.0 (ORM)
-   **Frontend**: Bootstrap 5 + Jinja2 Templates
-   **Theme**: Custom CSS with Google Fonts (*Mountains of Christmas*)

## Setup & Run

1.  **Clone the repository**
2.  **Create a virtual environment**:
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```
3.  **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```
4.  **Initialize the database**:
    ```bash
    flask db upgrade
    python seed.py  # Optional: Seed with sample data
    ```
5.  **Run the application**:
    ```bash
    python run.py
    ```
6.  Open `http://127.0.0.1:5000` in your browser.

## File Structure

-   `app/`: Application source code.
    -   `models.py`: Database models.
    -   `routes.py`: API and view routes.
    -   `templates/`: HTML templates.
    -   `static/`: CSS and Images.
-   `migrations/`: Database migration scripts.
-   `config.py`: Configuration settings.
-   `run.py`: Entry point.
