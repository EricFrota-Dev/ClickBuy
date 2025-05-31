from flask import jsonify, render_template, request, send_from_directory
from flask import current_app
from sqlalchemy import or_
from auth.token import token_required
from constants import categorias
from extensions import db
import os
from models import Loja, Produto, User
from werkzeug.utils import secure_filename

class ProdutoController:

    @staticmethod
    def show():
        produtos = Produto.query.all()
        return jsonify(
            [p.to_dict() for p in produtos]
        )
    @staticmethod
    def get_product_by_id(id):
        produto = Produto.query.get_or_404(id)
        return render_template('detalhes.html',produto=produto.to_dict())
    
    @staticmethod
    def get_products_by_store(loja_id, page=1, per_page=10):
        produtos = Produto.query.filter_by(loja_id=loja_id).paginate(page=page, per_page=per_page)
        return {
            "total": produtos.total,
            "pages": produtos.pages,
            "current_page": produtos.page,
            "products": [produto.to_dict() for produto in produtos.items]
    }

    @staticmethod
    def gerenciar_produtos(loja_id):

        return render_template('gerenciar_produtos.html',categorias=categorias.categorias)


    @staticmethod
    @token_required
    def get_produtos_by_loja(current_user, loja_id):
        try:
            page = request.args.get('page', default=1, type=int)
            per_page = request.args.get('per_page', default=10, type=int)
            
            data = ProdutoController.get_products_by_store(loja_id, page, per_page)
            return jsonify(data), 200
        
        except Exception as e:
            return jsonify(message=f"Erro ao buscar produtos: {str(e)}"), 500

    @staticmethod
    def get_imagem(foto_produto):
        print(foto_produto)
        uploads_dir = os.path.join(os.getcwd(), 'uploads')
        print(uploads_dir)
        return send_from_directory(uploads_dir, foto_produto)

    @staticmethod
    @token_required
    def register(current_user, loja_id):
        try:
            loja = Loja.query.get_or_404(loja_id)
            user = User.query.filter_by(login_id = current_user).first()
            if user.id != loja.user_id:
                
                return jsonify(message="Você não tem permissão para adicionar produtos nesta loja!"), 403

            foto = request.files.get('foto_produto')
            if not foto:
                return jsonify(message="Nenhuma imagem enviada."), 400

            filename = secure_filename(foto.filename)
            caminho_foto = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
            foto.save(caminho_foto)

            produto = Produto(
                loja_id=loja_id,
                nome_produto=request.form.get("nome_produto"),
                descricao_produto=request.form.get("descricao_produto"),
                preco_atual=request.form.get('preco_atual'),
                preco_original=request.form.get('preco_original'),
                estoque=request.form.get('estoque'),
                categoria=request.form.get('categoria'),
                foto_produto=filename
            )
            db.session.add(produto)
            db.session.commit()
            return jsonify(data=produto.to_dict()), 201
        except Exception as error:
            db.session.rollback()
            return jsonify(message=str(error)), 500

    @staticmethod
    @token_required
    def update(current_user, loja_id, id):
        try:
            loja = Loja.query.get_or_404(loja_id)
            user = User.query.filter_by(login_id = current_user).first()
            if user.id != loja.user_id:
                return jsonify(message="Você não tem permissão para atualizar produtos nesta loja!"), 403

            produto = Produto.query.get_or_404(id)
            if produto.loja_id != loja_id:
                return jsonify(message="Este produto não pertence a esta loja."), 403

            foto = request.files.get('foto_produto')
            if foto:
                filename = secure_filename(foto.filename)
                caminho_foto = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
                foto.save(caminho_foto)
                produto.foto_produto = filename

            produto.nome_produto = request.form.get("nome_produto")
            produto.descricao_produto = request.form.get("descricao_produto")
            produto.preco_atual = request.form.get('preco_atual')
            produto.preco_original = request.form.get('preco_original')
            produto.estoque = request.form.get('estoque')
            produto.categoria = request.form.get('categoria')

            db.session.commit()
            return jsonify(message="Produto atualizado com sucesso!"), 200
        except Exception as error:
            db.session.rollback()
            return jsonify(message=str(error)), 500

    @staticmethod
    @token_required
    def delete(current_user, loja_id, id):
        try:
            loja = Loja.query.get_or_404(loja_id)
            user = User.query.filter_by(login_id = current_user).first()
            if user.id != loja.user_id:
                return jsonify(message="Você não tem permissão para deletar produtos nesta loja!"), 403

            produto = Produto.query.get_or_404(id)
            if produto.loja_id != loja_id:
                return jsonify(message="Este produto não pertence a esta loja."), 403
            if produto.foto_produto:
                imagem_path = os.path.join(current_app.config['UPLOAD_FOLDER'], produto.foto_produto)
                if os.path.exists(imagem_path):
                    os.remove(imagem_path)

            db.session.delete(produto)
            db.session.commit()
            return jsonify(message=f"Produto '{produto.nome_produto}' deletado com sucesso!"), 200
        except Exception as error:
            db.session.rollback()
            return jsonify(message=str(error)), 500
        
    def buscar_por_texto():
        texto = request.args.get('texto', '')
        produtos = Produto.query.filter(Produto.nome_produto.ilike(f'%{texto}%')).all()
        if categorias[texto]:
            produtos += Produto.query.filter(Produto.categoria.ilike(f'%{texto}%')).all()
        
        return jsonify([p.to_dict() for p in produtos])

    def buscar_por_categoria(categoria):
        if categorias.categorias.__contains__(categoria):
            produtos = Produto.query.filter_by(categoria=categoria).all()
            return jsonify([p.to_dict() for p in produtos])
        return jsonify(message="Categoria inesistente"),404
    
    def buscar_ofertas(page=1, per_page=10):
        page = request.args.get('page', default=1, type=int)
        per_page = request.args.get('per_page', default=10, type=int)
        produtos = Produto.query.filter(Produto.preco_atual < Produto.preco_original).paginate(page=page, per_page=per_page)
        return {
            "total": produtos.total,
            "pages": produtos.pages,
            "current_page": produtos.page,
            "products": [produto.to_dict() for produto in produtos.items]}

    def busca_filtrada(filter, page=1, per_page=10):
        page = request.args.get('page', default=1, type=int)
        per_page = request.args.get('per_page', default=10, type=int)
        data = request.get_json()
        textoBusca = data.get("texto", "").strip().lower()

        query = Produto.query

        if textoBusca:
            query = query.filter(
                or_(
                    Produto.nome_produto.ilike(f"%{textoBusca}%"),
                    Produto.descricao_produto.ilike(f"%{textoBusca}%"),
                    Produto.categoria.ilike(f"%{textoBusca}%")
                )
            )

        if filter == "Recentes":
            query = query.order_by(Produto.data_criacao.desc())
        elif filter == "Ofertas":
            query = query.filter(Produto.preco_atual < Produto.preco_original)
        elif filter == "Mais Barato":
            query = query.order_by(Produto.preco_atual.asc())
        elif filter == "Mais Caro":
            query = query.order_by(Produto.preco_atual.desc())

        produtos = query.paginate(page=page, per_page=per_page)

        return {
            "total": produtos.total,
            "pages": produtos.pages,
            "current_page": produtos.page,
            "products": [produto.to_dict() for produto in produtos.items]
        }

    def buscar_por_preco():
        min_preco = request.args.get('min', type=float)
        max_preco = request.args.get('max', type=float)
        query = Produto.query
        if min_preco is not None:
            query = query.filter(Produto.preco >= min_preco)
        if max_preco is not None:
            query = query.filter(Produto.preco <= max_preco)
        produtos = query.all()
        return jsonify([p.to_dict() for p in produtos])