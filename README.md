# North Pole Wishlist 🎅

A community-driven platform to share and curate the best holiday gift ideas. Built with Python (Flask) and love.

## Features

- **Gift Submission**: Users can share their gift ideas with descriptions and categories.
- **Vote & Rank**: Community voting system ("Snowflakes") to highlight the best gifts.
- **Comments**: Discuss and review gift ideas.
- **Festive UI**: A fully immersive Christmas-themed interface.
- **Sorting & Filtering**: Browse by category, popularity, rating, or new arrivals.

## Tech Stack

- **Backend**: Python 3, Flask, SQLAlchemy (2.0 style)
- **Frontend**: Bootstrap 5, Jinja2, Custom CSS
- **Database**: SQLite (Development)

## Setup & Running Locally

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd north-pole-wishlist
    ```

2.  **Create and activate a virtual environment**:
    ```bash
    python3 -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

3.  **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

4.  **Run the application**:
    ```bash
    python run.py
    ```
    The application will start at `http://127.0.0.1:5000`. The database will be automatically initialized with a sample gift if it's empty.

## Project Structure

- `app/`: Main application package.
    - `models.py`: Database models (GiftIdea, Vote, Comment).
    - `routes.py`: Route handlers and logic.
    - `forms.py`: WTForms definitions.
    - `templates/`: HTML templates.
    - `static/`: CSS, Images, and JS.
- `run.py`: Application entry point.
- `requirements.txt`: Project dependencies.

## License

MIT License.
