from flask import render_template, url_for, flash, redirect, request, abort
from app import app, db
from app.forms import GiftForm, VoteForm, CommentForm
from app.models import GiftIdea, CategoryEnum, Vote, Comment
import sqlalchemy as sa

@app.route('/')
def home():
    category_filter = request.args.get('category')
    sort_option = request.args.get('sort', 'new')

    query = sa.select(GiftIdea)

    if category_filter:
        query = query.where(GiftIdea.category == category_filter)
    
    if sort_option == 'popular':
        query = query.outerjoin(Vote).group_by(GiftIdea.id).order_by(sa.func.count(Vote.id).desc())
    elif sort_option == 'top_rated':
        query = query.outerjoin(Vote).group_by(GiftIdea.id).order_by(sa.func.avg(Vote.score).desc(), sa.func.count(Vote.id).desc())
    else: # 'new'
        query = query.order_by(GiftIdea.created_at.desc())

    gifts = db.session.scalars(query).all()
    
    for gift in gifts:
        votes = gift.votes
        gift.vote_count = len(votes)
        if votes:
            gift.avg_score = sum(v.score for v in votes) / len(votes)
        else:
            gift.avg_score = 0.0

    return render_template('index.html', 
                           gifts=gifts, 
                           categories=CategoryEnum, 
                           current_category=category_filter, 
                           current_sort=sort_option)

@app.route('/submit', methods=['GET', 'POST'])
def submit_gift():
    form = GiftForm()
    if form.validate_on_submit():
        gift = GiftIdea(name=form.name.data, description=form.description.data, category=form.category.data)
        db.session.add(gift)
        db.session.commit()
        flash('Your gift idea has been submitted!', 'success')
        return redirect(url_for('home'))
    return render_template('submit_gift.html', title='Submit Gift', form=form)

@app.route('/gift/<int:id>')
def gift_details(id):
    gift = db.session.get(GiftIdea, id)
    if not gift:
        abort(404)
    
    vote_form = VoteForm()
    comment_form = CommentForm()
    
    votes = gift.votes
    vote_count = len(votes)
    avg_score = sum(v.score for v in votes) / vote_count if vote_count > 0 else 0.0
    
    comments = sorted(gift.comments, key=lambda c: c.created_at, reverse=False) # Chronological order

    return render_template('gift_details.html', 
                           gift=gift, 
                           vote_form=vote_form, 
                           comment_form=comment_form, 
                           avg_score=avg_score, 
                           vote_count=vote_count,
                           comments=comments)

@app.route('/gift/<int:id>/vote', methods=['POST'])
def cast_vote(id):
    gift = db.session.get(GiftIdea, id)
    if not gift:
        abort(404)
    
    form = VoteForm()
    if form.validate_on_submit():
        vote = Vote(gift_id=gift.id, score=int(form.score.data))
        db.session.add(vote)
        db.session.commit()
        flash('Vote cast successfully!', 'success')
    else:
        flash('Error casting vote.', 'danger')
    
    return redirect(url_for('gift_details', id=id))

@app.route('/gift/<int:id>/comment', methods=['POST'])
def post_comment(id):
    gift = db.session.get(GiftIdea, id)
    if not gift:
        abort(404)
    
    form = CommentForm()
    if form.validate_on_submit():
        author = form.author_name.data if form.author_name.data else "Anonymous Elf"
        comment = Comment(gift_id=gift.id, author_name=author, content=form.content.data)
        db.session.add(comment)
        db.session.commit()
        flash('Comment posted!', 'success')
    else:
         for error in form.content.errors:
            flash(f'Comment error: {error}', 'danger')

    return redirect(url_for('gift_details', id=id))
