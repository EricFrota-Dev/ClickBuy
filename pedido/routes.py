from flask import Blueprint
from pedido.controller import PrdidoController as pc

bp = Blueprint("pedido", __name__)

bp.route("/pedido/register", methods=["POST"])(pc.register)
bp.route("/pedido/update", methods=["PUT"])(pc.update)
 


