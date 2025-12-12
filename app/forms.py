from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, SelectField, SubmitField, RadioField
from wtforms.validators import DataRequired, Length
from app.models import CategoryEnum

class GiftForm(FlaskForm):
    name = StringField('Gift Name', validators=[DataRequired(), Length(max=100)])
    description = TextAreaField('Description', validators=[DataRequired(), Length(max=500)])
    category = SelectField('Category', choices=[(c.value, c.value) for c in CategoryEnum], validators=[DataRequired()])
    submit = SubmitField('Submit Gift Idea')

class VoteForm(FlaskForm):
    score = RadioField('Rating', choices=[('5', '5'), ('4', '4'), ('3', '3'), ('2', '2'), ('1', '1')], validators=[DataRequired()])
    submit = SubmitField('Vote')

class CommentForm(FlaskForm):
    author_name = StringField('Name (Optional)', validators=[Length(max=100)])
    content = TextAreaField('Comment', validators=[DataRequired(), Length(min=10, max=500)])
    submit = SubmitField('Post Comment')
