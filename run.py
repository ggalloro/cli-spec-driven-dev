from app import app, db
from app.models import GiftIdea, CategoryEnum

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        # Create a sample entry if DB is empty
        if not db.session.get(GiftIdea, 1):
            sample_gift = GiftIdea(
                name="Sample Holiday Mug",
                description="A festive mug for hot cocoa.",
                category=CategoryEnum.DECORATIONS.value
            )
            db.session.add(sample_gift)
            db.session.commit()
            print("Database initialized and sample gift added.")
            
    app.run(debug=True)
