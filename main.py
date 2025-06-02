import os
from flask import Flask, render_template
from constants import categorias
from extensions import db, migrate, bcrypt
from config import Config
from auth.routes import bp as auth_bp
from produto.routes import bp as produto_bp
from pedido.routes import bp as pedido_bp
from flask_cors import CORS
import stripe

def create_app():
    app = Flask(__name__)
    app.secret_key = "minha_chave_super_secreta_123" 
    app.config.from_object(Config)
    app.config['UPLOAD_FOLDER'] = 'uploads'
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
    CORS(app, supports_credentials=True)
    stripe.api_key = os.getenv("SK_KEY")

    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)

    app.register_blueprint(auth_bp)
    app.register_blueprint(produto_bp)
    app.register_blueprint(pedido_bp)

    @app.route("/")
    def home():
        return render_template("inicio.html",categorias=categorias.categorias)
    
    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
