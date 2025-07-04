from flask import Blueprint
from pedido.controller import PrdidoController as pc

bp = Blueprint("pedido", __name__)

bp.route("/pedido/register", methods=["POST"])(pc.register)
bp.route("/pedido/update", methods=["PUT"])(pc.update)
bp.route("/pedido/frete", methods=["GET"])(pc.calcular_frete)
bp.route("/pedido/checkout", methods=["GET"])(pc.checkout)
bp.route("/webhook", methods=["POST"])(pc.stripe_webhook)
bp.route("/pedido/overview/<int:pedido_id>", methods=["GET"])(pc.overview)
bp.route("/pedidos", methods=["GET"])(pc.getPedidosByUser)
# bp.route("/webhook/asaas", methods=["POST"])(pc.asaas_webhook)
