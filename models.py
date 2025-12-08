from datetime import datetime
from sqlalchemy import String, Integer, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app import db

class Gift(db.Model):
    __tablename__ = 'gift_idea'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(String(500), nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    votes: Mapped[list["Vote"]] = relationship(back_populates="gift")
    comments: Mapped[list["Comment"]] = relationship(back_populates="gift")

class Vote(db.Model):
    __tablename__ = 'vote'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    gift_id: Mapped[int] = mapped_column(ForeignKey('gift_idea.id'), nullable=False)
    score: Mapped[int] = mapped_column(Integer, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    gift: Mapped["Gift"] = relationship(back_populates="votes")

class Comment(db.Model):
    __tablename__ = 'comment'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    gift_id: Mapped[int] = mapped_column(ForeignKey('gift_idea.id'), nullable=False)
    author_name: Mapped[str] = mapped_column(String(50), nullable=False, default="Secret Santa")
    content: Mapped[str] = mapped_column(String(500), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    gift: Mapped["Gift"] = relationship(back_populates="comments")
