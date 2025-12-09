from datetime import datetime, timezone
import sqlalchemy as sa
import sqlalchemy.orm as so
from app import db

class Gift(db.Model):
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    title: so.Mapped[str] = so.mapped_column(sa.String(100), nullable=False)
    description: so.Mapped[str] = so.mapped_column(sa.String(500), nullable=False)
    category: so.Mapped[str] = so.mapped_column(sa.String(50), nullable=False)
    created_at: so.Mapped[datetime] = so.mapped_column(
        default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    votes: so.Mapped[list["Vote"]] = so.relationship(back_populates="gift", cascade="all, delete-orphan")
    comments: so.Mapped[list["Comment"]] = so.relationship(back_populates="gift", cascade="all, delete-orphan")

    def __repr__(self):
        return f'<Gift {self.title}>'

class Vote(db.Model):
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    gift_id: so.Mapped[int] = so.mapped_column(sa.ForeignKey("gift.id"), nullable=False)
    score: so.Mapped[int] = so.mapped_column(nullable=False)

    # Relationship
    gift: so.Mapped["Gift"] = so.relationship(back_populates="votes")

    def __repr__(self):
        return f'<Vote {self.score}>'

class Comment(db.Model):
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    gift_id: so.Mapped[int] = so.mapped_column(sa.ForeignKey("gift.id"), nullable=False)
    author_name: so.Mapped[str] = so.mapped_column(sa.String(50), default="Secret Santa")
    content: so.Mapped[str] = so.mapped_column(sa.String(500), nullable=False)
    created_at: so.Mapped[datetime] = so.mapped_column(
        default=lambda: datetime.now(timezone.utc)
    )

    # Relationship
    gift: so.Mapped["Gift"] = so.relationship(back_populates="comments")

    def __repr__(self):
        return f'<Comment {self.author_name}: {self.content[:20]}>'
