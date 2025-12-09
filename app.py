from flask import Flask, render_template, redirect, url_for, flash, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import desc, func
import sqlalchemy as sa
from config import Config
from forms import GiftForm, CommentForm, VoteForm

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)

    with app.app_context():
        import models
        from models import Gift, Vote, Comment
        db.create_all()

    @app.route('/')
    def index():
        from models import Gift, Vote
        
        category_filter = request.args.get('category')
        sort_by = request.args.get('sort', 'recency')

        # Base query: Join Gift with Vote to calculate average score
        # Using left outer join to include gifts with no votes
        stmt = (
            sa.select(
                Gift, 
                func.avg(Vote.score).label('avg_score'),
                func.count(Vote.id).label('vote_count')
            )
            .outerjoin(Vote)
            .group_by(Gift.id)
        )

        if category_filter:
            stmt = stmt.where(Gift.category == category_filter)

        if sort_by == 'ranking':
            # Sort by average score descending, then by number of votes
            stmt = stmt.order_by(desc('avg_score'), desc('vote_count'))
        else:
            # Default: Recency (Newest first)
            stmt = stmt.order_by(desc(Gift.created_at))

        results = db.session.execute(stmt).all()
        
        # Determine available categories for filter dropdown
        categories = ['For Kids', 'For Parents', 'Stocking Stuffers', 'DIY', 'Tech', 'Decorations']
        
        return render_template('index.html', gifts=results, categories=categories, current_filter=category_filter, current_sort=sort_by)

    @app.route('/submit', methods=['GET', 'POST'])
    def submit_gift():
        from models import Gift
        form = GiftForm()
        if form.validate_on_submit():
            gift = Gift(
                title=form.title.data,
                description=form.description.data,
                category=form.category.data
            )
            db.session.add(gift)
            db.session.commit()
            flash('Gift idea submitted successfully!', 'success')
            return redirect(url_for('index'))
        return render_template('submit.html', form=form)

    @app.route('/gift/<int:id>', methods=['GET'])
    def gift_detail(id):
        from models import Gift, Comment, Vote
        
        gift = db.session.get(Gift, id)
        if not gift:
            flash('Gift not found.', 'danger')
            return redirect(url_for('index'))

        # Calculate score manually for detail view
        avg_score = db.session.scalar(
            sa.select(func.avg(Vote.score)).where(Vote.gift_id == id)
        )
        vote_count = db.session.scalar(
            sa.select(func.count(Vote.id)).where(Vote.gift_id == id)
        )

        comments = db.session.scalars(
            sa.select(Comment).where(Comment.gift_id == id).order_by(desc(Comment.created_at))
        ).all()

        vote_form = VoteForm()
        comment_form = CommentForm()

        return render_template('detail.html', 
                               gift=gift, 
                               avg_score=avg_score, 
                               vote_count=vote_count,
                               comments=comments,
                               vote_form=vote_form,
                               comment_form=comment_form)

    @app.route('/gift/<int:id>/vote', methods=['POST'])
    def vote_gift(id):
        from models import Vote
        form = VoteForm()
        if form.validate_on_submit():
            vote = Vote(gift_id=id, score=int(form.score.data))
            db.session.add(vote)
            db.session.commit()
            flash('Vote cast successfully!', 'success')
        else:
             flash('Invalid vote.', 'danger')
        return redirect(url_for('gift_detail', id=id))

    @app.route('/gift/<int:id>/comment', methods=['POST'])
    def comment_gift(id):
        from models import Comment
        form = CommentForm()
        if form.validate_on_submit():
            author = form.author_name.data if form.author_name.data else "Secret Santa"
            comment = Comment(
                gift_id=id,
                author_name=author,
                content=form.content.data
            )
            db.session.add(comment)
            db.session.commit()
            flash('Comment added!', 'success')
        else:
            flash('Comment too short or invalid.', 'danger')
        return redirect(url_for('gift_detail', id=id))

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
