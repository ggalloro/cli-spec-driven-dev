from flask import Flask, render_template
from config import Config
from models import db
from routes import routes

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
app.register_blueprint(routes)

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

if __name__ == '__main__':
    app.run(debug=True)
