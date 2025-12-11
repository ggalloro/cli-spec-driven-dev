from flask import Flask
from config import DevelopmentConfig
from app.extensions import db, migrate

def create_app(config_class=DevelopmentConfig):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)

    from app import models # Import models here to register them
    from app import routes
    app.register_blueprint(routes.bp)

    return app
