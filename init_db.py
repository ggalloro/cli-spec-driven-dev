from app import create_app, db
from models import Gift, Vote, Comment

app = create_app()

with app.app_context():
    print("Creating database tables...")
    db.create_all()
    print("Tables created.")
