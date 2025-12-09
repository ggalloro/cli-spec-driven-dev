# North Pole Wishlist

North Pole Wishlist is a festive community platform where users can discover, share, and rate the best holiday gift ideas. It's designed with a "Santa's Workshop" theme to bring holiday cheer to your gift planning.

## Features

*   **Share Gift Ideas**: Submit new gift suggestions with titles, descriptions, and categories.
*   **Discover Gifts**: Browse a feed of community-submitted gifts.
*   **Vote & Rate**: Rate gifts using a 1-5 "Snowflake" scale.
*   **Discuss**: Comment on gift ideas to share reviews or ask questions.
*   **Sort & Filter**: Find the perfect gift by filtering categories (e.g., "For Kids", "Tech") or sorting by popularity/recency.

## Tech Stack

*   **Backend**: Python 3, Flask
*   **Database**: SQLite with SQLAlchemy 2.0 ORM
*   **Frontend**: Bootstrap 5, Jinja2 Templates, Custom CSS
*   **Forms**: Flask-WTF

## Installation & Setup

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

4.  **Initialize the database**:
    ```bash
    python init_db.py
    ```

5.  **Run the application**:
    ```bash
    python app.py
    ```
    The app will be available at `http://127.0.0.1:5000`.

## Project Structure

*   `app.py`: Main application entry point and route definitions.
*   `models.py`: Database models (Gift, Vote, Comment).
*   `forms.py`: WTForms definitions for validation.
*   `config.py`: Configuration settings.
*   `templates/`: HTML templates (Jinja2).
*   `static/`: CSS, Images, and JavaScript.

## License

Merry Christmas! 🎄
