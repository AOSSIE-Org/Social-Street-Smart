from flask import Flask
from .routes import main_bp, lookup_bp

def create_app():
    app = Flask(__name__)

    # Register Blueprints
    app.register_blueprint(main_bp)
    app.register_blueprint(lookup_bp, url_prefix='/lookup')

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
