from flask import Blueprint, render_template, request, flash, redirect, url_for
import sqlalchemy as sa
from sqlalchemy import func
from app.extensions import db
from app.models.gift_idea import GiftIdea
from app.models.vote import Vote
from app.models.comment import Comment
from app.forms import GiftForm, VoteForm, CommentForm, GIFT_CATEGORIES

bp = Blueprint('main', __name__)

@bp.route('/')
def home():
    sort_by = request.args.get('sort_by', 'newest')
    category_filter = request.args.get('category', 'All')

    # Calculate average score and vote count
    subquery_votes = (
        sa.select(
            Vote.gift_id,
            func.avg(Vote.score).label('avg_score'),
            func.count(Vote.id).label('vote_count')
        )
        .group_by(Vote.gift_id)
        .subquery()
    )

    # Select GiftIdea and the calculated scores
    # Use a tuple select to retrieve both the GiftIdea object and the aggregated values
    stmt = sa.select(
        GiftIdea,
        sa.case(
            (subquery_votes.c.avg_score.is_(None), 0.0),
            else_=subquery_votes.c.avg_score
        ).label('avg_score'),
        sa.case(
            (subquery_votes.c.vote_count.is_(None), 0),
            else_=subquery_votes.c.vote_count
        ).label('vote_count')
    ).outerjoin(subquery_votes, GiftIdea.id == subquery_votes.c.gift_id)

    if category_filter != 'All':
        stmt = stmt.filter(GiftIdea.category == category_filter)

    if sort_by == 'rating':
        stmt = stmt.order_by(
            sa.desc('avg_score'), # Use label
            sa.desc('vote_count') # Use label
        )
    elif sort_by == 'popularity':
        stmt = stmt.order_by(sa.desc('vote_count')) # Use label
    else: # 'newest'
        stmt = stmt.order_by(sa.desc(GiftIdea.created_at))

    # Fetch results as a list of tuples (GiftIdea, avg_score, vote_count)
    results = db.session.execute(stmt).all()

    # Create a list of GiftIdea objects with appended avg_score and vote_count
    gift_ideas_with_scores = []
    for gift_idea, avg_score, vote_count in results:
        gift_idea.avg_score = avg_score
        gift_idea.vote_count = vote_count
        gift_ideas_with_scores.append(gift_idea)

    gift_ideas = gift_ideas_with_scores
    
    # Instantiate forms for each gift idea for voting/commenting
    vote_forms = {idea.id: VoteForm() for idea in gift_ideas}
    comment_forms = {idea.id: CommentForm() for idea in gift_ideas}

    return render_template('home.html', 
                           gift_ideas=gift_ideas, 
                           gift_form=GiftForm(), # Pass a single gift form for submission
                           vote_forms=vote_forms, 
                           comment_forms=comment_forms,
                           sort_by=sort_by,
                           category_filter=category_filter,
                           categories=[('All', 'All')] + list(GIFT_CATEGORIES))


@bp.route('/gift/new', methods=['GET', 'POST'])
def submit_gift():
    form = GiftForm()
    if form.validate_on_submit():
        new_gift = GiftIdea(
            title=form.title.data,
            description=form.description.data,
            category=form.category.data
        )
        db.session.add(new_gift)
        db.session.commit()
        flash('Your gift idea has been added to the North Pole Wishlist!', 'success')
        return redirect(url_for('main.home'))
    return render_template('submit_gift.html', form=form)


@bp.route('/gift/<int:gift_id>/vote', methods=['POST'])
def vote(gift_id):
    form = VoteForm()
    if form.validate_on_submit():
        gift_idea = db.session.get(GiftIdea, gift_id)
        if gift_idea:
            new_vote = Vote(
                gift_id=gift_id,
                score=form.score.data
            )
            db.session.add(new_vote)
            db.session.commit()
            flash('Your vote has been cast!', 'success')
        else:
            flash('Gift idea not found.', 'danger')
    else:
        flash('Invalid vote submission.', 'danger')
    return redirect(url_for('main.home'))


@bp.route('/gift/<int:gift_id>/comment', methods=['POST'])
def comment(gift_id):
    form = CommentForm()
    if form.validate_on_submit():
        gift_idea = db.session.get(GiftIdea, gift_id)
        if gift_idea:
            author_name = form.author_name.data
            if not author_name:
                author_name = "Secret Santa" # Default if not provided
            new_comment = Comment(
                gift_id=gift_id,
                author_name=author_name,
                content=form.content.data
            )
            db.session.add(new_comment)
            db.session.commit()
            flash('Your comment has been added!', 'success')
        else:
            flash('Gift idea not found.', 'danger')
    else:
        flash('Invalid comment submission.', 'danger')
    return redirect(url_for('main.home'))