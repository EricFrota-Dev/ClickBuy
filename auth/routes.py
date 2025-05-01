from flask import Blueprint
from auth.controller import AuthController

bp = Blueprint("auth", __name__)

bp.route("/signup", methods=["GET", "POST"])(AuthController.register)
bp.route("/criar_senha/<string:email>", methods=["GET", "POST"])(AuthController.create_password)
bp.route("/completar_cadastro/<int:login_id>", methods=["GET", "POST"])(AuthController.complete_register)
bp.route("/login", methods=["GET", "POST"])(AuthController.login)
bp.route('/auth', methods=["POST"])(AuthController.authenticate)
