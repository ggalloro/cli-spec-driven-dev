import sqlalchemy as sa
import sqlalchemy.orm as so
from datetime import datetime
from app.extensions import db


class Comment(db.Model):
    __tablename__ = 'comment'

    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    gift_id: so.Mapped[int] = so.mapped_column(sa.ForeignKey('gift_idea.id'), nullable=False)
    author_name: so.Mapped[str] = so.mapped_column(sa.String(50), default="Secret Santa")
    content: so.Mapped[str] = so.mapped_column(sa.String(500), nullable=False)
    created_at: so.Mapped[datetime] = so.mapped_column(sa.DateTime, default=datetime.utcnow)

    gift_idea: so.Mapped['GiftIdea'] = so.relationship(back_populates="comments")

    def __repr__(self):
        return f'<Comment by {self.author_name}>'
