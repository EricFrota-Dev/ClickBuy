from datetime import date, timedelta
import time
import os

import mercadopago
import stripe
from auth.token import token_required
from extensions import db
from flask import current_app, jsonify, redirect, render_template, request, url_for

from models import Endereco, Pedido, PedidoProduto, Produto, User

tempUrl = os.getenv("BASE_URL")

class PrdidoController:

    @token_required
    def getPedidosByUser(current_user):
        user = User.query.filter_by(login_id=current_user).first()
        if not user:
            return redirect(url_for("auth.login"))

        pedidos = Pedido.query.filter_by(user_id=user.id).all()
        orders = [pedido.to_summary_dict() for pedido in pedidos]

        return render_template("pedidos.html", orders=orders)
        
    def register():
        data = request.get_json()

        produtos_data = data.get("products", [])
        user_data = data.get("user")
        endereco_data = data.get("deliveryAdress")
        frete = data.get("frete")

        if not produtos_data or not user_data or not endereco_data:
            return jsonify(error="Dados incompletos"), 400

        user_id = user_data.get("id")
        loja_id = produtos_data[0].get("loja_id")

        if not user_id or not loja_id:
            return jsonify(error="Usuário ou loja não identificados"), 400

        valor_frete = float(frete.get("valor_frete"))
        entrega = int(frete.get("data_entrega"))
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

            preference_items.append({
                "name": produto.nome_produto,
                "quantity": qtd,
                "amount": float(produto.preco_atual),
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

        # Cria o pedido
        pedido = Pedido(
            user_id=user_id,
            loja_id=loja_id,
            total=total,
            status="pending",
            data_pedido=date.today(),
            data_criacao=date.today(),
            data_entrega=date.today() + timedelta(days=entrega),
            valor_frete=valor_frete,
            endereco_id=endereco.id,
            itens=itens_pedido
        )
        db.session.add(pedido)
        db.session.flush()

        # Cria a sessão de checkout no Stripe
        session = stripe.checkout.Session.create(
            payment_method_types=["cart"],
            line_items=[{
                'price_data': {
                    'currency': 'brl',
                    'product_data': {
                        'name': item["name"]
                    },
                    'unit_amount': int(item["amount"] * 100),  # O Stripe trabalha com centavos
                },
                'quantity': item["quantity"],
            } for item in preference_items],
            mode="payment",
            success_url=f"{tempUrl}pedido/overview/{pedido.id}",
            cancel_url=f"{tempUrl}pedido/overview/{pedido.id}",
            metadata={"pedido_id": str(pedido.id)}
        )

        pedido.init_point = session.url 
        db.session.commit()

        return jsonify({
            "id": session.id,
            "url": session.url
        }), 201
    
    def stripe_webhook():
        payload = request.get_data(as_text=True)
        sig_header = request.headers.get('Stripe-Signature')
        endpoint_secret = os.getenv("STRIPE_WEBHOOK")  # Sua chave secreta do webhook

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, endpoint_secret
            )
        except ValueError as e:
            return jsonify(error="Invalid payload"), 400
        except stripe.error.SignatureVerificationError as e:
            return jsonify(error="Invalid signature"), 400

        # Processar o evento
        if event["type"] == "checkout.session.completed":
            session = event["data"]["object"]
            pedido_id = session["metadata"]["pedido_id"]

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

    @token_required
    def overview(current_user, pedido_id):
        pedido = Pedido.query.filter_by(id=pedido_id).first()

        if not pedido:
            return redirect(url_for("home"))  # ou retornar um erro 404

        status = request.args.get("collection_status")
        return render_template("overview.html", order=pedido.to_dict(), status=status)
