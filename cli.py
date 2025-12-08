from app import create_app
from app.extensions import db
from app.models.gift_idea import GiftIdea
from app.models.vote import Vote
from app.models.comment import Comment
import click

app = create_app()

@app.cli.command("db_create")
def db_create():
    """Creates all database tables."""
    with app.app_context():
        db.create_all()
    click.echo("Database tables created.")

if __name__ == '__main__':
    app.cli()
