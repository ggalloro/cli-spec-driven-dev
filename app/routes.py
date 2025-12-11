from flask import Blueprint, render_template, request, redirect, url_for, flash
import sqlalchemy as sa
from sqlalchemy.orm import selectinload
from app.extensions import db
from app.models import GiftIdea, Vote, Comment

bp = Blueprint('main', __name__)

@bp.route('/')
def index():
    category = request.args.get('category')
    sort_by = request.args.get('sort', 'new')
    
    query = sa.select(GiftIdea).options(selectinload(GiftIdea.votes))
    
    if category:
        query = query.where(GiftIdea.category == category)
    
    # Sorting logic
    if sort_by == 'popular':
        # Sort by total number of votes
        query = query.outerjoin(GiftIdea.votes).group_by(GiftIdea.id).order_by(sa.func.count(Vote.id).desc())
    elif sort_by == 'top_rated':
        # Sort by average score
        query = query.outerjoin(GiftIdea.votes).group_by(GiftIdea.id).order_by(sa.func.avg(Vote.score).desc())
    else: # 'new'
        query = query.order_by(GiftIdea.created_at.desc())
        
    gifts = db.session.scalars(query).all()
    
    # Calculate stats for each gift (can be optimized later)
    gift_stats = {}
    for gift in gifts:
        total_votes = len(gift.votes)
        avg_score = sum(v.score for v in gift.votes) / total_votes if total_votes > 0 else 0
        gift_stats[gift.id] = {
            'total_votes': total_votes,
            'avg_score': round(avg_score, 1)
        }

    return render_template('index.html', gifts=gifts, gift_stats=gift_stats, current_category=category, current_sort=sort_by)

@bp.route('/gift/new', methods=['GET', 'POST'])
def create_gift():
    if request.method == 'POST':
        title = request.form.get('title')
        description = request.form.get('description')
        category = request.form.get('category')
        
        # Validation
        if not title or len(title) > 100:
            flash('Invalid title.', 'danger')
            return redirect(url_for('main.create_gift'))
        if not description or len(description) > 500:
            flash('Invalid description.', 'danger')
            return redirect(url_for('main.create_gift'))
        
        valid_categories = ["For Kids", "For Parents", "Stocking Stuffers", "DIY / Homemade", "Tech & Gadgets", "Decorations"]
        if category not in valid_categories:
            flash('Invalid category.', 'danger')
            return redirect(url_for('main.create_gift'))
            
        new_gift = GiftIdea(title=title, description=description, category=category)
        db.session.add(new_gift)
        db.session.commit()
        
        flash('Gift idea submitted successfully!', 'success')
        return redirect(url_for('main.index'))
        
        return render_template('create_gift.html')
        
    
        
    @bp.route('/gift/<int:id>')
        
    
        
    def gift_detail(id):
        
    
        
        stmt = sa.select(GiftIdea).options(selectinload(GiftIdea.votes), selectinload(GiftIdea.comments)).where(GiftIdea.id == id)
        
    
        
        gift = db.session.scalars(stmt).first()
        
    
        
        
        
    
        
        if not gift:
        
    
        
    
        
            flash('Gift not found.', 'danger')
        
            return redirect(url_for('main.index'))
        
        
        
        # Calculate stats
        
        total_votes = len(gift.votes)
        
        avg_score = sum(v.score for v in gift.votes) / total_votes if total_votes > 0 else 0
        
        gift_stats = {
        
            'total_votes': total_votes,
        
            'avg_score': round(avg_score, 1)
        
        }
        
        
        
        # Sort comments: Newest first (chrono order usually means oldest first for convos, but spec says "chronological order" which implies oldest first. "New Arrivals" is newest first. I'll stick to oldest first for comments as is standard)
        
        # Spec: "Display: Comments appear in chronological order under the relevant gift idea." -> Oldest top.
        
        # Actually, SQLAlchemy relationship usually loads in insertion order, but explicit sort is safer.
        
        # I'll rely on default for now or sort in template if needed, but relationship doesn't have order_by.
        
        # Let's add explicit sort in query if needed, or just sort in python.
        
        comments = sorted(gift.comments, key=lambda c: c.created_at)
        
    
        
        return render_template('gift_detail.html', gift=gift, gift_stats=gift_stats, comments=comments)
        
    
        
    @bp.route('/gift/<int:id>/vote', methods=['POST'])
        
    def vote(id):
        
        data = request.get_json()
        
        score = data.get('score')
        
        
        
        if not score or score not in range(1, 6):
        
            return {'error': 'Invalid score'}, 400
        
            
        
        vote = Vote(gift_id=id, score=score)
        
        db.session.add(vote)
        
        db.session.commit()
        
        
        
        # Recalculate stats to return
        
        gift = db.session.get(GiftIdea, id)
        
        total_votes = len(gift.votes)
        
        avg_score = sum(v.score for v in gift.votes) / total_votes if total_votes > 0 else 0
        
        
        
        return {
        
            'new_average': round(avg_score, 1),
        
            'total_votes': total_votes
        
        }
        
    
        
    @bp.route('/gift/<int:id>/comment', methods=['POST'])
        
    def add_comment(id):
        
        content = request.form.get('content')
        
        author_name = request.form.get('author_name') or "Anonymous Elf"
        
        
        
        if not content or len(content) < 10 or len(content) > 500:
        
            flash('Comment must be between 10 and 500 characters.', 'danger')
        
            return redirect(url_for('main.gift_detail', id=id))
        
            
        
        comment = Comment(gift_id=id, content=content, author_name=author_name)
        
        db.session.add(comment)
        
        db.session.commit()
        
        
        
        flash('Comment added!', 'success')
        
        return redirect(url_for('main.gift_detail', id=id))
        
    