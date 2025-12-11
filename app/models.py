from datetime import datetime, timezone
from typing import List, Optional
import sqlalchemy as sa
import sqlalchemy.orm as so
from app.extensions import db

class GiftIdea(db.Model):
    __tablename__ = 'gift_idea'
    
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    title: so.Mapped[str] = so.mapped_column(sa.String(100))
    description: so.Mapped[str] = so.mapped_column(sa.String(500))
    category: so.Mapped[str] = so.mapped_column(sa.String(50))
    created_at: so.Mapped[datetime] = so.mapped_column(default=lambda: datetime.now(timezone.utc))
    
    votes: so.Mapped[List["Vote"]] = so.relationship(back_populates="gift")
    comments: so.Mapped[List["Comment"]] = so.relationship(back_populates="gift")

    def __repr__(self):
        return f'<GiftIdea {self.title}>'

class Vote(db.Model):
    __tablename__ = 'vote'
    
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    gift_id: so.Mapped[int] = so.mapped_column(sa.ForeignKey('gift_idea.id'))
    score: so.Mapped[int] = so.mapped_column()
    created_at: so.Mapped[datetime] = so.mapped_column(default=lambda: datetime.now(timezone.utc))
    
    gift: so.Mapped["GiftIdea"] = so.relationship(back_populates="votes")

    def __repr__(self):
        return f'<Vote {self.score}>'

class Comment(db.Model):
    __tablename__ = 'comment'
    
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    gift_id: so.Mapped[int] = so.mapped_column(sa.ForeignKey('gift_idea.id'))
    author_name: so.Mapped[str] = so.mapped_column(sa.String(100), default="Anonymous Elf")
    content: so.Mapped[str] = so.mapped_column(sa.String(500))
    created_at: so.Mapped[datetime] = so.mapped_column(default=lambda: datetime.now(timezone.utc))
    
    gift: so.Mapped["GiftIdea"] = so.relationship(back_populates="comments")

    def __repr__(self):
        return f'<Comment {self.content[:20]}>'
