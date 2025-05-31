from flask import Blueprint
from auth.controller import AuthController

bp = Blueprint("auth", __name__)

bp.route("/signup", methods=["GET", "POST"])(AuthController.register)
bp.route("/criar_senha/<string:email>", methods=["GET", "POST"])(AuthController.create_password)
bp.route("/completar_cadastro/<int:login_id>", methods=["GET", "POST"])(AuthController.complete_register)
bp.route("/login", methods=["GET", "POST"])(AuthController.login)
bp.route('/auth', methods=["POST"])(AuthController.authenticate)
bp.route("/auth/callback",methods=['GET'])(AuthController.auth_callback)
bp.route("/login/google",methods=['GET'])(AuthController.login_google)
bp.route("/auth/handle_google_token", methods=["POST"])(AuthController.handle_google_token)
bp.route("/logout", methods=["POST"])(AuthController.logout)