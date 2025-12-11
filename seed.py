from app import create_app, db
from app.models import GiftIdea, Vote, Comment

app = create_app()

def seed_data():
    with app.app_context():
        # Clear existing data
        db.drop_all()
        db.create_all()

        print("Creating Gift Ideas...")
        g1 = GiftIdea(title="Retro Popcorn Maker", description="Perfect for movie nights! Makes delicious popcorn in minutes.", category="For Kids")
        g2 = GiftIdea(title="Cozy Wool Socks", description="Keep your feet warm this winter with these hand-knitted socks.", category="Stocking Stuffers")
        g3 = GiftIdea(title="Smart Home Hub", description="Control your lights and music with your voice.", category="Tech & Gadgets")
        g4 = GiftIdea(title="Hand-painted Ornament", description="Beautiful glass ornament for the tree.", category="Decorations")

        db.session.add_all([g1, g2, g3, g4])
        db.session.commit()

        print("Adding Votes...")
        v1 = Vote(gift_id=g1.id, score=5)
        v2 = Vote(gift_id=g1.id, score=4)
        v3 = Vote(gift_id=g2.id, score=5)
        v4 = Vote(gift_id=g3.id, score=3)

        db.session.add_all([v1, v2, v3, v4])
        db.session.commit()

        print("Adding Comments...")
        c1 = Comment(gift_id=g1.id, author_name="Santa Claus", content="Ho ho ho! A wonderful gift!")
        c2 = Comment(gift_id=g1.id, author_name="Elf Buddy", content="I love popcorn!")
        c3 = Comment(gift_id=g3.id, content="Does it work with Matter?")

        db.session.add_all([c1, c2, c3])
        db.session.commit()

        print("Database seeded successfully!")

if __name__ == "__main__":
    seed_data()
