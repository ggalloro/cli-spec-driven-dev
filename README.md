# North Pole Wishlist

## Project Description
The "North Pole Wishlist" is a community-driven web application designed to help users discover, share, and curate the best gift ideas for the holiday season. Users can submit gift suggestions, browse ideas contributed by others, vote on items (ranking them from "Nice List" to "Naughty List"), and engage through comments. The application features a festive holiday theme with custom UI elements and colors.

## Features
- **Gift Idea Management**: Submit new gift ideas with title, description, and category.
- **Viewing Gift Ideas**: Browse a central feed of gift ideas.
- **Filtering & Sorting**: Filter ideas by category and sort by newest, top-rated, or most popular.
- **Voting System**: Cast votes (1-5 snowflakes) on gift ideas.
- **Commenting System**: Add comments to discuss specific gift ideas.
- **Ranking System**: Ideas are automatically ranked based on average score and total votes, displaying "Nice List" or "Naughty List" badges.
- **Festive UI**: Holiday-themed design with custom colors, fonts, and a Santa hero image.

## Setup Instructions

### Prerequisites
- Python 3.8+
- git

### Installation
1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd north-pole-wishlist
    ```
2.  **Create and activate a virtual environment**:
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
    export FLASK_APP=cli.py
    flask db_create
    ```

## How to Run

1.  **Start the Flask development server**:
    ```bash
    python run.py
    ```
2.  Open your web browser and navigate to `http://127.0.0.1:5000`.

## Architecture
The application follows a Model-View-Controller (MVC) architectural pattern:
- **Models**: Defined using SQLAlchemy 2.0.
- **Views**: Rendered using Jinja2 templates, styled with Bootstrap 5 and custom holiday themes.
- **Controllers**: Handled by Flask blueprints, processing requests and interacting with models.

## File Breakdown
- `app/`: Contains the core Flask application.
    - `__init__.py`: Application factory and blueprint registration.
    - `extensions.py`: Initializes SQLAlchemy `db` object.
    - `forms.py`: Web forms for gift submission, voting, and commenting.
    - `models/`: Database models (`gift_idea.py`, `vote.py`, `comment.py`).
    - `routes/`: Blueprint for main application routes (`main.py`).
    - `static/`: Static files (CSS, images).
        - `css/style.css`: Custom holiday theme styles.
        - `img/hero.png`: Santa hero image.
    - `templates/`: Jinja2 templates (`base.html`, `home.html`, `submit_gift.html`, `macros.html`, `404.html`, `500.html`).
- `config.py`: Application configuration settings.
- `requirements.txt`: Python dependencies.
- `run.py`: Entry point to run the Flask development server.
- `cli.py`: Custom Flask CLI commands (e.g., `db_create`).
- `IMPLEMENTATION_PLAN.md`: This document outlining the development process.
