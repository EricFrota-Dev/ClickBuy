from flask import Flask, jsonify, render_template,request
from extensions import db, migrate, bcrypt
from config import Config
from models import DadosLogin
from security import check_password, hash_password

app=Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
migrate.init_app(app, db)
bcrypt.init_app(app)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/signup", methods=["GET","POST"])
def register():
    if request.method == "POST":
        data = request.get_json()
        if data['email'] == '' or data['senha'] == '':
            return jsonify(msg="os campos estao vazios")
        if DadosLogin.query.filter_by(email=data["email"]).first():
            return jsonify(msg="Email já registrado"), 400

        user = DadosLogin(
            email=data["email"],
            senha=hash_password(data["senha"])
        )
        db.session.add(user)
        db.session.commit()
        return jsonify(msg="Usuário criado")
    return render_template("signup.html")

@app.route('/login',methods=["GET", "POST"])
def login():
    if request.method == "POST":
        data = request.get_json()
        user = DadosLogin.query.filter_by(email=data["email"]).first()
        if not user or not check_password(data["senha"], user.senha):
            return jsonify(msg="Credenciais inválidas"), 401
        return render_template("index.html")

    return render_template('login.html')
# @app.route('/singup')
# def login_page():
#     return render_template('login.html')
    
if __name__=="__main__":
    app.run(debug=True)