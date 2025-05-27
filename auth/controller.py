# auth/controller.py

from flask import request, jsonify, session, url_for, render_template, redirect
import jwt
from models import DadosLogin, User, Loja
from extensions import db
from security import hash_password, check_password
from auth.token import decode_token, generate_token, token_required

class AuthController:
    @staticmethod
    def register():
        if request.method == "POST":
            data = request.get_json()
            if not data.get('email'):
                return jsonify(message="E-mail deve ser fornecido"), 400
            if DadosLogin.query.filter_by(email=data["email"]).first():
                return jsonify(message="Email já registrado"), 400
            return jsonify(redirect=url_for('auth.create_password', email=data['email']))
        return render_template("signup.html")

    @staticmethod
    def create_password(email):
        if request.method == "POST":
            data = request.get_json()
            if not data.get('senha'):
                return jsonify(message="A senha não pode ser nula"), 400
            login = DadosLogin(email=email, senha=hash_password(data["senha"]))
            db.session.add(login)
            db.session.commit()
            return jsonify(redirect=url_for('auth.complete_register', login_id=login.id), login_id=login.id)
        return render_template("criar_senha.html", email=email)

    @staticmethod
    def complete_register(login_id):
        login = DadosLogin.query.get_or_404(login_id)
        if request.method == "POST":
            data = request.get_json()
            if User.query.filter_by(login_id=login_id).first():
                return jsonify(message="Usuário já cadastrado."), 400
            
            user = User(
                login_id=login_id,
                nome=data["nome"],
                cpf=data["cpf"],
                role=data['role']
            )
            db.session.add(user)
            db.session.flush()

            userData = user.to_dict()

            if data['role'] == "loja":
                loja = Loja(
                    user_id=user.id,
                    nome_fantasia=data["nome_fantasia"],
                    cnpj=data["cnpj"],
                    descricao=data.get("descricao")
                )
                db.session.add(loja)
                userData["loja"] = loja.to_dict()

            db.session.commit()
            token = generate_token(user.id)
            return jsonify(token=token, user=userData)
        
        return render_template("completar_cadastro.html", email=login.email)

    @staticmethod
    def login():
        if request.method == "POST":
            data = request.get_json()
            login = DadosLogin.query.filter_by(email=data["email"]).first()
            if not login or not check_password(data["senha"], login.senha):
                return jsonify(message="Credenciais inválidas"), 401

            user = User.query.filter_by(login_id=login.id).first()
            if not user:
                return jsonify(message="Usuário não encontrado"), 404

            userData = user.to_dict()

            loja = Loja.query.filter_by(user_id=user.id).first()
            if loja:
                userData["loja"] = loja.to_dict()

            token = generate_token(user.id)

            # Redirecionar se necessário
            next_page = session.pop("next", None)
            response_data = {
                "token": token,
                "user": userData,
                "redirect": next_page or "/"
            }
            return jsonify(response_data)

        return render_template("login.html")
    
    def authenticate():
        token = request.cookies.get('token')
        if not token:
            return jsonify(user=None, error="Token ausente"), 401

        try:
            data = decode_token(token)
            user_id = data.get('user_id')
        except jwt.ExpiredSignatureError:
            return jsonify(user=None, error="Token expirado"), 401
        except jwt.InvalidTokenError:
            return jsonify(user=None, error="Token inválido"), 401

        user = User.query.filter_by(id=user_id).first()
        if not user:
            return jsonify(user=None, error="Usuário não encontrado"), 404

        userData = user.to_dict()

        if user.role == "loja":
            loja = Loja.query.filter_by(user_id=user_id).first()
            if loja:
                userData["loja"] = loja.to_dict()

        return jsonify(user=userData), 200