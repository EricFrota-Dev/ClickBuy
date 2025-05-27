from datetime import date
from auth.token import token_required
from extensions import db
from flask import jsonify, render_template, request

from models import Pedido, PedidoProduto, Produto

class PrdidoController:

    def register():
        data = request.get_json()

        produtos_data = data.get("products", [])
        user_data = data.get("user")

        if not produtos_data or not user_data:
            return jsonify(error="Dados incompletos"), 400

        user_id = user_data.get("id")
        loja_id = produtos_data[0].get("loja_id")

        if not user_id or not loja_id:
            return jsonify(error="Usuário ou loja não identificados"), 400

        total = 0
        itens_pedido = []

        for p in produtos_data:
            produto = Produto.query.get(p["id"])
            qtd = int(p["quantidade"])

            if not produto:
                return jsonify(error=f"Produto ID {p['id']} não encontrado"), 404

            if produto.estoque < qtd:
                return jsonify(error=f"Estoque insuficiente para o produto '{produto.nome_produto}'"), 400

            # Atualiza total do pedido
            total += float(produto.preco_atual) * qtd

            # Reduz estoque
            produto.estoque -= qtd

            # Prepara item de pedido
            item = PedidoProduto(produto=produto, quantidade=qtd)
            itens_pedido.append(item)

        # Cria o pedido
        pedido = Pedido(
            user_id=user_id,
            loja_id=loja_id,
            total=total,
            status="pending",
            data_pedido=date.today(),
            data_criacao=date.today(),
            itens=itens_pedido
        )

        db.session.add(pedido)
        db.session.commit()

        return jsonify(ok=True), 201


    def update():
        data = request.get_json()
        pedido = Pedido.query.filter_by(id=data["pedido_id"]).first()
        if pedido:
            db.session.delete(pedido)
            db.session.commit()
            return jsonify(mesage="Pedido deletado com sucesso!")
        return jsonify(mesage="Pedido não encontrado!"), 404
    
    def calcular_frete():
        cep = request.args.get("cep")

        if not cep or len(cep) != 8 or not cep.isdigit():
            return jsonify({"erro": "CEP inválido"}), 400

        # Simulação de cálculo baseado no início do CEP
        if cep.startswith("01"):  # São Paulo
            frete = 14.90
            prazo = 2
        elif cep.startswith("20"):  # Rio de Janeiro
            frete = 19.50
            prazo = 3
        elif cep.startswith("30"):  # Belo Horizonte
            frete = 17.00
            prazo = 3
        else:  # Demais regiões
            frete = 25.00
            prazo = 5

        return jsonify({
            "frete": frete,
            "prazo": prazo,
            "cep_destino": cep
        })
    
    @token_required
    def checkout(current_user):
        return render_template("checkout.html")