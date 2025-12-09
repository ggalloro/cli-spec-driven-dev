from flask import Blueprint, render_template, redirect, url_for, request, flash
import sqlalchemy as sa
from models import db, Gift, Vote, Comment
from forms import GiftForm, VoteForm, CommentForm

routes = Blueprint('routes', __name__)

@routes.route('/', methods=['GET'])
def index():
    category = request.args.get('category')
    sort_by = request.args.get('sort_by', 'recency')

    stmt = sa.select(Gift)

    if category:
        stmt = stmt.where(Gift.category == category)

    if sort_by == 'top_rated':
        # Subquery to calculate average score
        subquery = sa.select(
            Vote.gift_id, 
            sa.func.avg(Vote.score).label('avg_score')
        ).group_by(Vote.gift_id).subquery()
        
        # Join with subquery and order by avg_score
        stmt = stmt.outerjoin(subquery, Gift.id == subquery.c.gift_id).order_by(subquery.c.avg_score.desc().nullslast())

    elif sort_by == 'most_popular':
        # Subquery to count votes
        subquery = sa.select(
            Vote.gift_id, 
            sa.func.count(Vote.id).label('vote_count')
        ).group_by(Vote.gift_id).subquery()
        
        # Join with subquery and order by vote_count
        stmt = stmt.outerjoin(subquery, Gift.id == subquery.c.gift_id).order_by(subquery.c.vote_count.desc().nullslast())
    else:
        # Default: Recency
        stmt = stmt.order_by(Gift.created_at.desc())

    gifts = db.session.scalars(stmt).all()
    return render_template('index.html', gifts=gifts, current_category=category, current_sort=sort_by)

@routes.route('/gift/new', methods=['GET', 'POST'])
def new_gift():
    form = GiftForm()
    if form.validate_on_submit():
        gift = Gift(
            title=form.title.data,
            description=form.description.data,
            category=form.category.data
        )
        db.session.add(gift)
        db.session.commit()
        return redirect(url_for('routes.index'))
    return render_template('create_gift.html', form=form)

@routes.route('/gift/<int:gift_id>', methods=['GET'])
def gift_detail(gift_id):
    gift = db.session.get(Gift, gift_id)
    if not gift:
        return "Gift not found", 404
    vote_form = VoteForm()
    comment_form = CommentForm()
    return render_template('gift_detail.html', gift=gift, vote_form=vote_form, comment_form=comment_form)

@routes.route('/gift/<int:gift_id>/vote', methods=['POST'])
def vote_gift(gift_id):
    form = VoteForm()
    if form.validate_on_submit():
        vote = Vote(gift_id=gift_id, score=form.score.data)
        db.session.add(vote)
        db.session.commit()
    return redirect(url_for('routes.gift_detail', gift_id=gift_id))

@routes.route('/gift/<int:gift_id>/comment', methods=['POST'])
def comment_gift(gift_id):
    form = CommentForm()
    if form.validate_on_submit():
        author = form.author_name.data if form.author_name.data else "Secret Santa"
        comment = Comment(
            gift_id=gift_id,
            author_name=author,
            content=form.content.data
        )
        db.session.add(comment)
        db.session.commit()
    return redirect(url_for('routes.gift_detail', gift_id=gift_id))
