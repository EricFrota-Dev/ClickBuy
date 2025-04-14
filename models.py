from datetime import date

from extensions import db

class DadosLogin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(64), unique=True, nullable=False)
    senha = db.Column(db.String(64), nullable=False)
    dataCriacao = db.Column(db.Date, default=date.today)
    ultimoLogin = db.Column(db.Date)
    
    
    