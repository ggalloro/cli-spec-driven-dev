from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, SelectField, IntegerField, SubmitField
from wtforms.validators import DataRequired, Length, NumberRange

# Predefined categories for gift ideas
GIFT_CATEGORIES = [
    ('For Kids', 'For Kids'),
    ('For Parents', 'For Parents'),
    ('Stocking Stuffers', 'Stocking Stuffers'),
    ('DIY / Homemade', 'DIY / Homemade'),
    ('Tech & Gadgets', 'Tech & Gadgets'),
    ('Decorations', 'Decorations'),
]

class GiftForm(FlaskForm):
    title = StringField('Gift Name', validators=[DataRequired(), Length(max=100)])
    description = TextAreaField('Description', validators=[DataRequired(), Length(max=500)])
    category = SelectField('Category', choices=GIFT_CATEGORIES, validators=[DataRequired()])
    submit = SubmitField('Submit Gift')

class VoteForm(FlaskForm):
    score = SelectField('Score', choices=[(str(i), str(i)) for i in range(1, 6)], validators=[DataRequired()])
    submit = SubmitField('Vote')

class CommentForm(FlaskForm):
    author_name = StringField('Your Name', validators=[Length(max=50)], default="Secret Santa")
    content = TextAreaField('Comment', validators=[DataRequired(), Length(min=10, max=500)])
    submit = SubmitField('Add Comment')
