from flask import Blueprint
from produto.controller import ProdutoController

bp = Blueprint("produto", __name__)

bp.route("/produtos", methods=["GET"])(ProdutoController.show)
bp.route("/produto/<int:id>", methods=["GET"])(ProdutoController.get_product_by_id)
bp.route("/loja/<int:loja_id>/produtos", methods=["GET"])(ProdutoController.get_produtos_by_loja)
bp.route("/produto/imagem/<string:foto_produto>", methods=["GET"])(ProdutoController.get_imagem)
bp.route("/loja/<int:loja_id>/produtos/gerenciar", methods=["GET"])(ProdutoController.gerenciar_produtos)
bp.route("/produto/register/<int:loja_id>", methods=["POST"])(ProdutoController.register)
bp.route("/produto/update/<int:loja_id>/<int:id>", methods=["PUT"])(ProdutoController.update)
bp.route("/produto/delete/<int:loja_id>/<int:id>", methods=["DELETE"])(ProdutoController.delete)
bp.route("/produtos/ofertas", methods=["GET"])(ProdutoController.buscar_ofertas)
bp.route("/produtos/<string:filter>", methods=["GET", "POST"])(ProdutoController.busca_filtrada)
bp.route("/produtos/categoria/<string:categoria>", methods=["GET"])(ProdutoController.buscar_por_categoria)
bp.route("/produtos/mais-pedidos", methods=["GET"])(ProdutoController.produtos_mais_pedidos)
