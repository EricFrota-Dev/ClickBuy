from extensions import db
from flask import jsonify, render_template, request

from models import Pedido

class PrdidoController:

    def register():
        if request.method == "POST":
            data = request.get_json()
            pedido = Pedido(
                id_produto=data["id_produto"],
                qtd=data["qtd"],
                user_id=data["usuario_id"]
                )
            db.session.add(pedido)
            db.session.commit()
            return jsonify(mesage="Pedido realizado com sucesso!")
        return render_template("fazer_pedido.html")


    def update():
        data = request.get_json()
        pedido = Pedido.query.filter_by(id=data["pedido_id"]).first()
        if pedido:
            db.session.delete(pedido)
            db.session.commit()
            return jsonify(mesage="Pedido deletado com sucesso!")
        return jsonify(mesage="Pedido não encontrado!"), 404
