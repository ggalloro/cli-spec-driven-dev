import datetime
from typing import List
from sqlalchemy import String, ForeignKey, Integer, Text, DateTime
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from app import db

class GiftIdea(db.Model):
    __tablename__ = 'gift_idea'
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(String(500), nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    
    votes: Mapped[List["Vote"]] = relationship(back_populates="gift")
    comments: Mapped[List["Comment"]] = relationship(back_populates="gift")

class Vote(db.Model):
    __tablename__ = 'vote'
    id: Mapped[int] = mapped_column(primary_key=True)
    gift_id: Mapped[int] = mapped_column(ForeignKey('gift_idea.id'))
    score: Mapped[int] = mapped_column(Integer, nullable=False) # 1-5
    
    gift: Mapped["GiftIdea"] = relationship(back_populates="votes")

class Comment(db.Model):
    __tablename__ = 'comment'
    id: Mapped[int] = mapped_column(primary_key=True)
    gift_id: Mapped[int] = mapped_column(ForeignKey('gift_idea.id'))
    user_name: Mapped[str] = mapped_column(String(100), default="Anonymous Elf")
    content: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    gift: Mapped["GiftIdea"] = relationship(back_populates="comments")
