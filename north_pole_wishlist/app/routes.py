from flask import Blueprint, render_template, request, redirect, url_for, flash
from app import db
from app.models import GiftIdea, Vote, Comment
import sqlalchemy as sa
from sqlalchemy import func

bp = Blueprint('main', __name__)

@bp.route('/')
def index():
    sort_by = request.args.get('sort', 'ranking')
    category = request.args.get('category')

    stmt = sa.select(
        GiftIdea,
        func.coalesce(func.avg(Vote.score), 0).label('avg_score'),
        func.count(Vote.id).label('vote_count')
    ).outerjoin(Vote).group_by(GiftIdea.id)

    if category:
        stmt = stmt.where(GiftIdea.category == category)

    if sort_by == 'recency':
        stmt = stmt.order_by(GiftIdea.created_at.desc())
    else:
        stmt = stmt.order_by(func.coalesce(func.avg(Vote.score), 0).desc(), func.count(Vote.id).desc())

    results = db.session.execute(stmt).all()
    
    gifts = []
    for row in results:
        gift = row[0]
        gift.avg_score = row[1]
        gift.vote_count = row[2]
        gifts.append(gift)

    return render_template('index.html', gifts=gifts)

@bp.route('/submit', methods=['GET', 'POST'])
def submit_gift():
    if request.method == 'POST':
        title = request.form.get('title')
        category = request.form.get('category')
        description = request.form.get('description')

        if not title or not category or not description:
            flash('All fields are required!')
            return redirect(url_for('main.submit_gift'))

        new_gift = GiftIdea(title=title, category=category, description=description)
        db.session.add(new_gift)
        db.session.commit()
        
        flash('Gift idea submitted successfully! Santa is pleased.')
        return redirect(url_for('main.index'))

    return render_template('submit.html')

@bp.route('/gift/<int:id>')
def gift_detail(id):
    gift = db.session.get(GiftIdea, id)
    if not gift:
        flash('Gift not found!')
        return redirect(url_for('main.index'))

    # Calculate aggregate stats for this single gift
    # We could do this in Python since we have the relationship loaded, 
    # but SQL is more efficient for aggregates usually. 
    # However, since we need the gift object anyway, utilizing the relationship for comments is fine.
    # For votes, let's just run a quick query or use the relationship if the list isn't massive.
    # Given the scale, iterating relationship is fine, but let's stick to SQL for stats to be consistent.
    
    stats_stmt = sa.select(
        func.coalesce(func.avg(Vote.score), 0).label('avg_score'),
        func.count(Vote.id).label('vote_count')
    ).where(Vote.gift_id == id)
    
    stats = db.session.execute(stats_stmt).first()
    avg_score = stats[0]
    vote_count = stats[1]

    return render_template('detail.html', gift=gift, avg_score=avg_score, vote_count=vote_count)

@bp.route('/gift/<int:id>/vote', methods=['POST'])
def vote_gift(id):
    score = request.form.get('score')
    if score and score.isdigit() and 1 <= int(score) <= 5:
        new_vote = Vote(gift_id=id, score=int(score))
        db.session.add(new_vote)
        db.session.commit()
        flash('Vote cast! You are on the Nice List.')
    else:
        flash('Invalid vote!')
    
    return redirect(url_for('main.gift_detail', id=id))

@bp.route('/gift/<int:id>/comment', methods=['POST'])
def add_comment(id):
    content = request.form.get('content')
    user_name = request.form.get('user_name') or "Anonymous Elf"

    if content and len(content) >= 10:
        new_comment = Comment(gift_id=id, content=content, user_name=user_name)
        db.session.add(new_comment)
        db.session.commit()
        flash('Comment posted!')
    else:
        flash('Comment must be at least 10 characters long.')

    return redirect(url_for('main.gift_detail', id=id))