flask db init
flask db migrate -m "Criação da tabela User"
flask db upgrade

pip install flask flask_sqlalchemy flask_bcrypt flask_jwt_extended
