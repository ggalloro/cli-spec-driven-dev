from typing import List, Optional
from datetime import datetime
import sqlalchemy as sa
import sqlalchemy.orm as so
from app import db
from enum import Enum

class CategoryEnum(Enum):
    FOR_KIDS = "For Kids"
    FOR_PARENTS = "For Parents"
    STOCKING_STUFFERS = "Stocking Stuffers"
    DIY_HOMEMADE = "DIY / Homemade"
    TECH_GADGETS = "Tech & Gadgets"
    DECORATIONS = "Decorations"

class GiftIdea(db.Model):
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    name: so.Mapped[str] = so.mapped_column(sa.String(100), nullable=False)
    description: so.Mapped[str] = so.mapped_column(sa.String(500), nullable=False)
    category: so.Mapped[str] = so.mapped_column(sa.String(50), nullable=False)
    created_at: so.Mapped[datetime] = so.mapped_column(default=sa.func.now())
    
    votes: so.Mapped[List['Vote']] = so.relationship(back_populates='gift', cascade='all, delete-orphan')
    comments: so.Mapped[List['Comment']] = so.relationship(back_populates='gift', cascade='all, delete-orphan')

class Vote(db.Model):
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    gift_id: so.Mapped[int] = so.mapped_column(sa.ForeignKey('gift_idea.id'), nullable=False)
    score: so.Mapped[int] = so.mapped_column(nullable=False)
    created_at: so.Mapped[datetime] = so.mapped_column(default=sa.func.now())
    
    gift: so.Mapped['GiftIdea'] = so.relationship(back_populates='votes')

class Comment(db.Model):
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    gift_id: so.Mapped[int] = so.mapped_column(sa.ForeignKey('gift_idea.id'), nullable=False)
    author_name: so.Mapped[str] = so.mapped_column(sa.String(100), default="Anonymous Elf")
    content: so.Mapped[str] = so.mapped_column(sa.String(500), nullable=False)
    created_at: so.Mapped[datetime] = so.mapped_column(default=sa.func.now())
    
    gift: so.Mapped['GiftIdea'] = so.relationship(back_populates='comments')
