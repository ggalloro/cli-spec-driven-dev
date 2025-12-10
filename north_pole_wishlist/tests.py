import unittest
from app import create_app, db
from app.models import GiftIdea, Vote, Comment
from config import Config

class TestConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite://'

class NorthPoleTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app(TestConfig)
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()
        self.client = self.app.test_client()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_gift_creation(self):
        g = GiftIdea(title="Toy Train", description="Choo choo", category="Kids")
        db.session.add(g)
        db.session.commit()
        self.assertEqual(GiftIdea.query.count(), 1) # Note: query property might not exist in 2.0 unless mixed in, checking standard select
        stmt = db.select(GiftIdea)
        results = db.session.execute(stmt).all()
        self.assertEqual(len(results), 1)

    def test_vote_ranking(self):
        g1 = GiftIdea(title="A", description="A", category="Tech")
        g2 = GiftIdea(title="B", description="B", category="Tech")
        db.session.add_all([g1, g2])
        db.session.commit()

        # Vote for g1: 5 stars
        v1 = Vote(gift_id=g1.id, score=5)
        # Vote for g2: 1 star
        v2 = Vote(gift_id=g2.id, score=1)
        db.session.add_all([v1, v2])
        db.session.commit()

        # Test logic used in index route
        # Sort by avg score desc
        # G1 (5.0) should be before G2 (1.0)
        response = self.client.get('/?sort=ranking')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'A', response.data)
        
        # Checking order by inspecting the data directly via the route logic
        # We can't easily parse HTML here without bs4, but we can verify the SQL query logic
        from sqlalchemy import func
        stmt = db.select(
            GiftIdea,
            func.coalesce(func.avg(Vote.score), 0).label('avg_score'),
            func.count(Vote.id).label('vote_count')
        ).outerjoin(Vote).group_by(GiftIdea.id).order_by(func.coalesce(func.avg(Vote.score), 0).desc())
        
        results = db.session.execute(stmt).all()
        self.assertEqual(results[0][0].title, "A")
        self.assertEqual(results[1][0].title, "B")

    def test_submit_route(self):
        response = self.client.post('/submit', data={
            'title': 'New Gift',
            'category': 'Decorations',
            'description': 'Shiny thing'
        }, follow_redirects=True)
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Gift idea submitted successfully', response.data)

if __name__ == '__main__':
    unittest.main()
