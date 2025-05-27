import jwt
import datetime
from flask import redirect, session,url_for, request
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
        token = request.cookies.get('token')
        if not token:
            session['next'] = request.path
            return redirect(url_for('auth.login'))
        try:
            data = decode_token(token)
            current_user = data['user_id']
        except jwt.ExpiredSignatureError:
            return redirect(url_for('auth.login'))
        except jwt.InvalidTokenError:
            return redirect(url_for('auth.login'))
        return f(current_user, *args, **kwargs)
    return decorated