import sqlalchemy as sa
import sqlalchemy.orm as so
from datetime import datetime
from app.extensions import db


class Vote(db.Model):
    __tablename__ = 'vote'

    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    gift_id: so.Mapped[int] = so.mapped_column(sa.ForeignKey('gift_idea.id'), nullable=False)
    score: so.Mapped[int] = so.mapped_column(sa.Integer, nullable=False)
    created_at: so.Mapped[datetime] = so.mapped_column(sa.DateTime, default=datetime.utcnow)

    gift_idea: so.Mapped['GiftIdea'] = so.relationship(back_populates="votes")

    __table_args__ = (
        sa.CheckConstraint('score >= 1 AND score <= 5', name='score_check'),
    )

    def __repr__(self):
        return f'<Vote {self.score}>'
