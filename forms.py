from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, SelectField, RadioField
from wtforms.validators import DataRequired, Length, Optional

CATEGORIES = [
    ('For Kids', 'For Kids'),
    ('For Parents', 'For Parents'),
    ('Stocking Stuffers', 'Stocking Stuffers'),
    ('DIY', 'DIY'),
    ('Tech', 'Tech'),
    ('Decorations', 'Decorations')
]

class GiftForm(FlaskForm):
    title = StringField('Gift Name', validators=[DataRequired(), Length(max=100)])
    description = TextAreaField('Description', validators=[DataRequired(), Length(max=500)])
    category = SelectField('Category', choices=CATEGORIES, validators=[DataRequired()])

class CommentForm(FlaskForm):
    author_name = StringField('Your Name', validators=[Optional(), Length(max=50)])
    content = TextAreaField('Comment', validators=[DataRequired(), Length(min=10, max=500)])

class VoteForm(FlaskForm):
    score = RadioField('Rating', choices=[('1', '1'), ('2', '2'), ('3', '3'), ('4', '4'), ('5', '5')], validators=[DataRequired()])
