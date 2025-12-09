from datetime import datetime
from typing import List
import sqlalchemy as sa
import sqlalchemy.orm as so
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Gift(db.Model):
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    title: so.Mapped[str] = so.mapped_column(sa.String(100), nullable=False)
    description: so.Mapped[str] = so.mapped_column(sa.String(500), nullable=False)
    category: so.Mapped[str] = so.mapped_column(sa.String(50), nullable=False)
    created_at: so.Mapped[datetime] = so.mapped_column(default=datetime.utcnow)
    
    votes: so.Mapped[List["Vote"]] = so.relationship(back_populates="gift", cascade="all, delete-orphan")
    comments: so.Mapped[List["Comment"]] = so.relationship(back_populates="gift", cascade="all, delete-orphan")

class Vote(db.Model):
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    gift_id: so.Mapped[int] = so.mapped_column(sa.ForeignKey("gift.id"), nullable=False)
    score: so.Mapped[int] = so.mapped_column(nullable=False) # 1-5

    gift: so.Mapped["Gift"] = so.relationship(back_populates="votes")

class Comment(db.Model):
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    gift_id: so.Mapped[int] = so.mapped_column(sa.ForeignKey("gift.id"), nullable=False)
    author_name: so.Mapped[str] = so.mapped_column(sa.String(100), nullable=True, default="Secret Santa")
    content: so.Mapped[str] = so.mapped_column(sa.String(500), nullable=False)
    created_at: so.Mapped[datetime] = so.mapped_column(default=datetime.utcnow)

    gift: so.Mapped["Gift"] = so.relationship(back_populates="comments")
