pip install flask flask_sqlalchemy flask_bcrypt flask_jwt_extended Flask-Migrate python-dotenv psycopg2 Flask PyJWT

flask db init
flask db migrate -m "Criação da tabela User"
flask db upgrade
