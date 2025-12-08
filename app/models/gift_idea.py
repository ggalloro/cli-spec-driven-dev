import sqlalchemy as sa
import sqlalchemy.orm as so
from datetime import datetime
from app.extensions import db


class GiftIdea(db.Model):
    __tablename__ = 'gift_idea'

    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    title: so.Mapped[str] = so.mapped_column(sa.String(100), nullable=False)
    description: so.Mapped[str] = so.mapped_column(sa.String(500), nullable=False)
    category: so.Mapped[str] = so.mapped_column(sa.String(50), nullable=False)
    created_at: so.Mapped[datetime] = so.mapped_column(sa.DateTime, default=datetime.utcnow)

    votes: so.Mapped[list["Vote"]] = so.relationship(back_populates="gift_idea", cascade="all, delete-orphan")
    comments: so.Mapped[list["Comment"]] = so.relationship(back_populates="gift_idea", cascade="all, delete-orphan")

    def __repr__(self):
        return f'<GiftIdea {self.title}>'
