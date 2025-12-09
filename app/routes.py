from flask import Blueprint, jsonify, request, render_template
from app import db
from app.models import GiftIdea, Vote, Comment
import sqlalchemy as sa
from sqlalchemy import func

bp = Blueprint('main', __name__)

def _get_filtered_gifts(category=None, sort_by='newest'):
    query = sa.select(GiftIdea)

    if category:
        query = query.where(GiftIdea.category == category)

    # Sorting
    if sort_by == 'nice_list':
        # AVG score desc, Count desc
        subq = (
            sa.select(
                Vote.gift_id,
                func.avg(Vote.score).label('avg_score'),
                func.count(Vote.id).label('vote_count')
            )
            .group_by(Vote.gift_id)
            .subquery()
        )
        query = query.outerjoin(subq, GiftIdea.id == subq.c.gift_id)
        query = query.order_by(subq.c.avg_score.desc().nulls_last(), subq.c.vote_count.desc())
    
    elif sort_by == 'popularity':
        # Vote count desc
        subq = (
            sa.select(
                Vote.gift_id,
                func.count(Vote.id).label('vote_count')
            )
            .group_by(Vote.gift_id)
            .subquery()
        )
        query = query.outerjoin(subq, GiftIdea.id == subq.c.gift_id)
        query = query.order_by(subq.c.vote_count.desc().nulls_last())
    
    else: # newest
        query = query.order_by(GiftIdea.created_at.desc())

    return db.session.scalars(query).all()

@bp.route('/')
def index():
    category = request.args.get('category')
    sort_by = request.args.get('sort_by', 'newest')
    gifts = _get_filtered_gifts(category, sort_by)
    return render_template('index.html', gifts=gifts)

@bp.route('/api/gifts', methods=['GET'])
def get_gifts():
    category = request.args.get('category')
    sort_by = request.args.get('sort_by', 'newest')
    gifts = _get_filtered_gifts(category, sort_by)
    return jsonify([g.to_dict() for g in gifts])

@bp.route('/api/gifts', methods=['POST'])
def create_gift():
    data = request.get_json()
    if not data or not data.get('name') or not data.get('description') or not data.get('category'):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Validation logic could go here (length checks)
    if len(data['name']) > 100:
        return jsonify({'error': 'Name too long'}), 400

    gift = GiftIdea(
        name=data['name'],
        description=data['description'],
        category=data['category']
    )
    db.session.add(gift)
    db.session.commit()
    return jsonify(gift.to_dict()), 201

@bp.route('/api/gifts/<int:id>/vote', methods=['POST'])
def vote_gift(id):
    data = request.get_json()
    score = data.get('score')
    if not score or not isinstance(score, int) or not (1 <= score <= 5):
         return jsonify({'error': 'Invalid score (1-5)'}), 400

    gift = db.session.get(GiftIdea, id)
    if not gift:
        return jsonify({'error': 'Gift not found'}), 404

    vote = Vote(gift_id=id, score=score)
    db.session.add(vote)
    db.session.commit()
    
    return jsonify({
        'message': 'Vote recorded',
        'new_average': gift.average_score,
        'total_votes': len(gift.votes)
    })

@bp.route('/api/gifts/<int:id>/comments', methods=['GET'])
def get_comments(id):
    gift = db.session.get(GiftIdea, id)
    if not gift:
        return jsonify({'error': 'Gift not found'}), 404
    
    return jsonify([c.to_dict() for c in gift.comments])

@bp.route('/api/gifts/<int:id>/comments', methods=['POST'])
def create_comment(id):
    data = request.get_json()
    content = data.get('content')
    author_name = data.get('author_name', 'Secret Santa')

    if not content or len(content) < 10:
        return jsonify({'error': 'Content must be at least 10 chars'}), 400

    gift = db.session.get(GiftIdea, id)
    if not gift:
        return jsonify({'error': 'Gift not found'}), 404

    comment = Comment(gift_id=id, content=content, author_name=author_name)
    db.session.add(comment)
    db.session.commit()

    return jsonify(comment.to_dict()), 201
