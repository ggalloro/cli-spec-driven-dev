import os
from flask import Flask, render_template, request, redirect, url_for, abort
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import select, func, desc

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///northpole.db')
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key')
    
    db.init_app(app)
    
    with app.app_context():
        import models
        db.create_all()

    from models import Gift, Vote, Comment

    @app.route('/')
    def index():
        category = request.args.get('category')
        sort_by = request.args.get('sort', 'newest')
        
        stmt = select(Gift)
        
        if category:
            stmt = stmt.where(Gift.category == category)
            
        if sort_by == 'popular':
            # Sort by vote count
            stmt = stmt.outerjoin(Gift.votes).group_by(Gift.id).order_by(func.count(Vote.id).desc())
        elif sort_by == 'ranking':
            # Sort by average score
            stmt = stmt.outerjoin(Gift.votes).group_by(Gift.id).order_by(func.avg(Vote.score).desc())
        else: # newest
            stmt = stmt.order_by(Gift.created_at.desc())
            
        gifts = db.session.scalars(stmt).all()
        
        # Calculate average scores for display (could be optimized)
        gift_stats = {}
        for gift in gifts:
            avg_score = db.session.scalar(select(func.avg(Vote.score)).where(Vote.gift_id == gift.id))
            vote_count = db.session.scalar(select(func.count(Vote.id)).where(Vote.gift_id == gift.id))
            gift_stats[gift.id] = {
                'avg_score': round(avg_score, 1) if avg_score else 0,
                'vote_count': vote_count
            }
            
        return render_template('index.html', gifts=gifts, stats=gift_stats, current_category=category, current_sort=sort_by)

    @app.route('/gifts/new', methods=['GET', 'POST'])
    def submit_gift():
        if request.method == 'POST':
            title = request.form.get('title')
            description = request.form.get('description')
            category = request.form.get('category')
            
            if not title or len(title) > 100:
                # Basic validation, ideally flash error
                return "Invalid Title", 400
            if not description or len(description) > 500:
                return "Invalid Description", 400
            if not category:
                return "Category required", 400
                
            new_gift = Gift(title=title, description=description, category=category)
            db.session.add(new_gift)
            db.session.commit()
            
            return redirect(url_for('index'))
            
        return render_template('submit_gift.html')

    @app.route('/gifts/<int:gift_id>')
    def gift_detail(gift_id):
        gift = db.get_or_404(Gift, gift_id)
        
        avg_score = db.session.scalar(select(func.avg(Vote.score)).where(Vote.gift_id == gift_id))
        vote_count = db.session.scalar(select(func.count(Vote.id)).where(Vote.gift_id == gift_id))
        
        # Get comments ordered by newest
        comments = db.session.scalars(select(Comment).where(Comment.gift_id == gift_id).order_by(Comment.created_at.desc())).all()
        
        stats = {
            'avg_score': round(avg_score, 1) if avg_score else 0,
            'vote_count': vote_count
        }
        
        return render_template('gift_detail.html', gift=gift, stats=stats, comments=comments)

    @app.route('/gifts/<int:gift_id>/vote', methods=['POST'])
    def vote_gift(gift_id):
        score = request.form.get('score', type=int)
        if not score or score < 1 or score > 5:
             return "Invalid Score", 400
             
        vote = Vote(gift_id=gift_id, score=score)
        db.session.add(vote)
        db.session.commit()
        
        return redirect(url_for('gift_detail', gift_id=gift_id))

    @app.route('/gifts/<int:gift_id>/comment', methods=['POST'])
    def comment_gift(gift_id):
        author = request.form.get('author_name') or "Secret Santa"
        content = request.form.get('content')
        
        if not content or len(content) < 10 or len(content) > 500:
            return "Content length must be between 10 and 500 characters", 400
            
        comment = Comment(gift_id=gift_id, author_name=author, content=content)
        db.session.add(comment)
        db.session.commit()
        
        return redirect(url_for('gift_detail', gift_id=gift_id))
        
    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)
