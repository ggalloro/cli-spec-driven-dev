from datetime import datetime
from typing import List, Optional
import sqlalchemy as sa
import sqlalchemy.orm as so
from app import db

class GiftIdea(db.Model):
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    name: so.Mapped[str] = so.mapped_column(sa.String(100))
    description: so.Mapped[str] = so.mapped_column(sa.String(500))
    category: so.Mapped[str] = so.mapped_column(sa.String(50))
    created_at: so.Mapped[datetime] = so.mapped_column(default=datetime.utcnow)

    votes: so.Mapped[List['Vote']] = so.relationship(back_populates='gift')
    comments: so.Mapped[List['Comment']] = so.relationship(back_populates='gift')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'category': self.category,
            'created_at': self.created_at.isoformat(),
            'average_score': self.average_score,
            'vote_count': len(self.votes),
            'comment_count': len(self.comments)
        }

    @property
    def average_score(self):
        if not self.votes:
            return 0
        return sum(v.score for v in self.votes) / len(self.votes)

class Vote(db.Model):
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    gift_id: so.Mapped[int] = so.mapped_column(sa.ForeignKey('gift_idea.id'))
    score: so.Mapped[int] = so.mapped_column(sa.Integer)
    created_at: so.Mapped[datetime] = so.mapped_column(default=datetime.utcnow)

    gift: so.Mapped['GiftIdea'] = so.relationship(back_populates='votes')

class Comment(db.Model):
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    gift_id: so.Mapped[int] = so.mapped_column(sa.ForeignKey('gift_idea.id'))
    author_name: so.Mapped[str] = so.mapped_column(sa.String(50), default="Secret Santa")
    content: so.Mapped[str] = so.mapped_column(sa.String(500))
    created_at: so.Mapped[datetime] = so.mapped_column(default=datetime.utcnow)

    gift: so.Mapped['GiftIdea'] = so.relationship(back_populates='comments')

    def to_dict(self):
        return {
            'id': self.id,
            'gift_id': self.gift_id,
            'author_name': self.author_name,
            'content': self.content,
            'created_at': self.created_at.isoformat()
        }
