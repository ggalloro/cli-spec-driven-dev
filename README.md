# North Pole Wishlist

The **North Pole Wishlist** is a community-driven platform designed to help users discover, share, and curate the best gift ideas for the holiday season. It features a festive Christmas theme and allows elves (users) to submit ideas, vote on them ("Naughty or Nice"), and discuss the best presents.

## Features

-   **Browse Gifts**: View a curated list of gift ideas, filterable by category (Kids, Parents, Tech, etc.) and sortable by popularity or rating.
-   **Submit Ideas**: Share your own gift suggestions with the community.
-   **Naughty or Nice Voting**: Rate gifts on a scale of 1 to 5 Snowflakes.
-   **Elf Discussion**: Leave comments on gift ideas to share reviews or ask questions.
-   **Festive UI**: A fully themed interface with Santa, snowflakes, and holiday colors.

## Tech Stack

-   **Backend**: Python 3, Flask
-   **Database**: SQLite (Development), SQLAlchemy 2.0 ORM
-   **Frontend**: HTML5, Jinja2 Templates, Bootstrap 5, Custom CSS
-   **Icons**: FontAwesome

## Local Development Setup

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
    python app.py
    ```

5.  **Open in Browser**:
    Visit `http://127.0.0.1:5000` to start exploring the wishlist!

## Project Structure

-   `app.py`: Main Flask application entry point and route definitions.
-   `models.py`: SQLAlchemy database models (Gift, Vote, Comment).
-   `templates/`: Jinja2 HTML templates.
-   `static/`: CSS styles and images.
-   `instance/`: Contains the SQLite database (`northpole.db`).

## License

Copyright 2025 North Pole Workshop. Made with ❤️ and ❄️.
