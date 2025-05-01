import jwt
import datetime
from flask import jsonify,redirect,url_for, request
from functools import wraps

SECRET_KEY = 'meu_token'

def generate_token(user_id, expires_in=3600):
    payload = {
        'user_id': user_id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=expires_in)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

def decode_token(token):
    return jwt.decode(token, SECRET_KEY, algorithms=["HS256"])

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            parts = request.headers['Authorization'].split()
            if len(parts) == 2 and parts[0] == 'Bearer':
                token = parts[1]
        if not token:
            return jsonify(redirect=url_for('auth.login')),401
        try:
            data = decode_token(token)
            current_user = data['user_id']
        except jwt.ExpiredSignatureError:
            return jsonify(redirect=url_for('auth.login')),401
        except jwt.InvalidTokenError:
            return jsonify(redirect=url_for('auth.login')),401
        return f(current_user, *args, **kwargs)
    return decorated
