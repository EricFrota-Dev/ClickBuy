from datetime import date

import mercadopago
from auth.token import token_required
from extensions import db
from flask import current_app, jsonify, render_template, request, url_for

from models import Endereco, Pedido, PedidoProduto, Produto

class PrdidoController:
    

    def register():
        data = request.get_json()

        produtos_data = data.get("products", [])
        user_data = data.get("user")
        endereco_data = data.get("deliveryAdress")

        if not produtos_data or not user_data or not endereco_data:
            return jsonify(error="Dados incompletos"), 400

        user_id = user_data.get("id")
        loja_id = produtos_data[0].get("loja_id")

        if not user_id or not loja_id:
            return jsonify(error="Usuário ou loja não identificados"), 400

        total = 0
        itens_pedido = []
        preference_items = []

        for p in produtos_data:
            produto = Produto.query.get(p["id"])
            qtd = int(p["quantidade"])

            if not produto:
                return jsonify(error=f"Produto ID {p['id']} não encontrado"), 404

            if produto.estoque < qtd:
                return jsonify(error=f"Estoque insuficiente para o produto '{produto.nome_produto}'"), 400

            total += float(produto.preco_atual) * qtd
            produto.estoque -= qtd

            item = PedidoProduto(produto=produto, quantidade=qtd)
            itens_pedido.append(item)

            # Adiciona o item à preferência do Mercado Pago
            preference_items.append({
                "title": produto.nome_produto,
                "quantity": qtd,
                "unit_price": float(produto.preco_atual),
                "currency_id": "BRL"
            })
            

        endereco = Endereco.query.filter_by(
            user_id=user_id,
            cep=endereco_data.get("cep"),
            logradouro=endereco_data.get("logradouro"),
            numero=endereco_data.get("numero"),
            bairro=endereco_data.get("bairro"),
            cidade=endereco_data.get("cidade"),
            estado=endereco_data.get("estado"),
            complemento=endereco_data.get("complemento")
        ).first()

        if not endereco:
            endereco = Endereco(
                user_id=user_id,
                cep=endereco_data.get("cep"),
                logradouro=endereco_data.get("logradouro"),
                numero=endereco_data.get("numero"),
                bairro=endereco_data.get("bairro"),
                cidade=endereco_data.get("cidade"),
                estado=endereco_data.get("estado"),
                complemento=endereco_data.get("complemento")
            )
            db.session.add(endereco)
            db.session.flush()

        pedido = Pedido(
            user_id=user_id,
            loja_id=loja_id,
            total=total,
            status="pending",
            data_pedido=date.today(),
            data_criacao=date.today(),
            endereco_id=endereco.id,
            itens=itens_pedido
        )

        db.session.add(pedido)
        db.session.commit()

        # Cria a preferência de pagamento
        back_urls = {
            "success": "https://6150-2804-7f0-ba40-6f05-5d8d-5d08-a07c-c5ac.ngrok-free.app/pedido/sucesso",
            "failure": "https://6150-2804-7f0-ba40-6f05-5d8d-5d08-a07c-c5ac.ngrok-free.app/pedido/erro",
            "pending": "https://6150-2804-7f0-ba40-6f05-5d8d-5d08-a07c-c5ac.ngrok-free.app/pedido/pendente"
        }

        preference_data = {
            "items": preference_items,
            "external_reference": str(pedido.id),
            "back_urls": back_urls,
            "auto_return": "approved",
        }
        print(preference_data)
        sdk = mercadopago.SDK(current_app.config["MERCADO_PAGO_ACCESS_TOKEN"])
        preference_response = sdk.preference().create(preference_data)
        print(preference_response,)
        init_point = preference_response["response"]["init_point"]
        print(init_point)
        return jsonify(init_point=init_point), 201
    
    def mp_webhook():
        data = request.get_json()
        payment_id = data.get("data", {}).get("id")

        sdk = mercadopago.SDK(current_app.config["MERCADO_PAGO_ACCESS_TOKEN"])
        result = sdk.payment().get(payment_id)
        payment = result["response"]

        if payment["status"] == "approved":
            pedido_id = payment["external_reference"]
            pedido = Pedido.query.get(pedido_id)
            if pedido:
                pedido.status = "paid"
                db.session.commit()

        return jsonify(status="ok"), 200


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
            frete = 0
            prazo = 5

        return jsonify({
            "frete": frete,
            "prazo": prazo,
            "cep_destino": cep
        })
    
    @token_required
    def checkout(current_user):
        return render_template("checkout.html")
    
    def success():
        return render_template("overview.html")
    def error():
        return render_template("error.html")