from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, SelectField, IntegerField, SubmitField
from wtforms.validators import DataRequired, Length, NumberRange, Optional

class GiftForm(FlaskForm):
    title = StringField('Gift Name', validators=[DataRequired(), Length(max=100)])
    description = TextAreaField('Description', validators=[DataRequired(), Length(max=500)])
    category = SelectField('Category', choices=[
        ('For Kids', 'For Kids'),
        ('For Parents', 'For Parents'),
        ('Stocking Stuffers', 'Stocking Stuffers'),
        ('DIY / Homemade', 'DIY / Homemade'),
        ('Tech & Gadgets', 'Tech & Gadgets'),
        ('Decorations', 'Decorations')
    ], validators=[DataRequired()])
    submit = SubmitField('Submit Gift')

class VoteForm(FlaskForm):
    score = IntegerField('Score (1-5)', validators=[DataRequired(), NumberRange(min=1, max=5)])
    submit = SubmitField('Vote')

class CommentForm(FlaskForm):
    author_name = StringField('Your Name (Optional)', validators=[Optional(), Length(max=100)])
    content = TextAreaField('Comment', validators=[DataRequired(), Length(max=500)])
    submit = SubmitField('Post Comment')
