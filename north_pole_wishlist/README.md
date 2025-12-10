# North Pole Wishlist 🎅

Welcome to the **North Pole Wishlist**, a community-driven platform where elves, reindeer, and humans alike can discover, share, and curate the best gift ideas for the holiday season!

## Features

- **Gift Idea Management**: Submit your unique gift suggestions with categories like "For Kids", "Tech & Gadgets", and "Stocking Stuffers".
- **Naughty or Nice Voting**: Rate gift ideas on a scale of 1 to 5 snowflakes.
- **Community Ranking**: See what's trending on the "Nice List" based on real-time votes.
- **Discussion Board**: Leave comments and reviews on specific items.
- **Festive Atmosphere**: Immerse yourself in the holiday spirit with a custom Christmas-themed UI.

## Tech Stack

- **Backend**: Python 3, Flask, SQLAlchemy 2.0 (SQLite)
- **Frontend**: HTML5, Bootstrap 5, Custom CSS
- **Assets**: AI-Generated Hero Image & Icons

## Installation & Setup

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd north-pole-wishlist
    ```

2.  **Create a virtual environment**:
    ```bash
    python3 -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

3.  **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

4.  **Initialize the Database**:
    ```bash
    python init_db.py
    ```

5.  **Run the Application**:
    ```bash
    python run.py
    ```
    (Note: You might need to set `FLASK_APP=north_pole_wishlist/app` or similar depending on how you run it, or just `flask run` from the app dir).
    
    *Actually, use the provided `run.py` if available or `flask run`:*
    ```bash
    flask --app app run --debug
    ```

## Project Structure

```text
north_pole_wishlist/
├── app/
│   ├── __init__.py      # App Factory
│   ├── models.py        # Database Models
│   ├── routes.py        # Route Handlers
│   ├── static/          # CSS & Images
│   └── templates/       # HTML Templates
├── config.py            # Configuration
├── init_db.py           # DB Initialization Script
├── requirements.txt     # Python Dependencies
└── tests.py             # Unit Tests
```

## Contributing

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingGift`).
3.  Commit your changes (`git commit -m 'Add some AmazingGift'`).
4.  Push to the branch (`git push origin feature/AmazingGift`).
5.  Open a Pull Request.

Happy Holidays! 🎄
