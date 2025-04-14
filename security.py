from extensions import bcrypt

def hash_password(password):
    return bcrypt.generate_password_hash(password).decode("utf-8")

def check_password(password, hashed):
    return bcrypt.check_password_hash(hashed, password)

# def generate_token(user_id, role):
#     return create_access_token(identity={"id": user_id, "role": role})