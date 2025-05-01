from datetime import date
from extensions import db

class DadosLogin(db.Model):
    __tablename__ = 'login'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(64), unique=True, nullable=False)
    senha = db.Column(db.String(128), nullable=False)
    data_criacao = db.Column(db.Date, default=date.today)
    ultimo_login = db.Column(db.Date)

    user = db.relationship('User', back_populates='login', uselist=False)

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "data_criacao": self.data_criacao.isoformat() if self.data_criacao else None,
            "ultimo_login": self.ultimo_login.isoformat() if self.ultimo_login else None
        }

class User(db.Model):
    __tablename__ = 'user'
    
    id = db.Column(db.Integer, primary_key=True)
    login_id = db.Column(db.Integer, db.ForeignKey('login.id'), nullable=False)
    nome = db.Column(db.String(64), nullable=False)
    cpf = db.Column(db.String(14), nullable=True)
    role = db.Column(db.String(16), nullable=False)
    criado_em = db.Column(db.Date, default=date.today)
    foto_perfil = db.Column(db.String(64), nullable=True)
    login = db.relationship('DadosLogin', back_populates='user')
    loja = db.relationship('Loja', back_populates='user', uselist=False)
    pedidos = db.relationship("Pedido", back_populates="user")

    def to_dict(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "cpf": self._formatar_cpf(),
            "role": self.role,
            "criado_em": self.criado_em.isoformat() if self.criado_em else None,
            "email": self.login.email if self.login else None,  # Pega o email da tabela login
            "loja": self.loja.to_dict_basic() if self.loja else None,
            "foto_perfil": self.foto_perfil
        }

    def _formatar_cpf(self):
        if self.cpf:
            return self.cpf[:3] + '.***.***-' + self.cpf[-2:]
        return None

    

class Loja(db.Model):
    __tablename__ = 'loja'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    nome_fantasia = db.Column(db.String(64), nullable=False)
    cnpj = db.Column(db.String(18), nullable=False)
    descricao = db.Column(db.Text, nullable=True)
    criada_em = db.Column(db.Date, default=date.today)
    user = db.relationship('User', back_populates='loja')
    produtos = db.relationship('Produto', back_populates='loja')
    pedidos = db.relationship("Pedido", back_populates="loja")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "nome_fantasia": self.nome_fantasia,
            "cnpj": self._formatar_cnpj(),
            "descricao": self.descricao,
            "criada_em": self.criada_em.isoformat() if self.criada_em else None,
        }

    def _formatar_cnpj(self):
        if self.cnpj:
            return self.cnpj[:2] + '.***.***/****-' + self.cnpj[-2:]
        return None

    # Versão resumida para usar em User
    def to_dict_basic(self):
        return {
            "id": self.id,
            "nome_fantasia": self.nome_fantasia
        }

pedido_produto = db.Table('pedido_produto',
    db.Column('id_pedido', db.Integer, db.ForeignKey('pedido.id'), primary_key=True),
    db.Column('id_produto', db.Integer, db.ForeignKey('produto.id'), primary_key=True)
)

class Produto(db.Model):
    __tablename__ = 'produto'

    id = db.Column(db.Integer, primary_key=True)
    loja_id = db.Column(db.Integer, db.ForeignKey('loja.id'), nullable=False)
    nome_produto = db.Column(db.String(64), nullable=False)
    descricao_produto = db.Column(db.Text, nullable=False)
    preco_original = db.Column(db.Numeric(10, 2), nullable=False)
    estoque = db.Column(db.Integer, default=0, nullable=False)
    data_criacao = db.Column(db.Date, default=date.today)
    categoria = db.Column(db.String(64), nullable=False)
    preco_atual = db.Column(db.Numeric(10, 2), nullable=False)
    foto_produto = db.Column(db.String(64), nullable=False)

    loja = db.relationship('Loja', back_populates='produtos')
    pedidos = db.relationship('Pedido', secondary=pedido_produto, back_populates='produtos')

    def to_dict(self):
        return {
            "id": self.id,
            "loja_id": self.loja_id,
            "nome_produto": self.nome_produto,
            "descricao_produto": self.descricao_produto,
            "preco_original": float(self.preco_original),
            "preco_atual": float(self.preco_atual),
            "estoque": self.estoque,
            "data_criacao": self.data_criacao.isoformat(),
            "categoria": self.categoria,
            "foto_produto": self.foto_produto
        }

class Pedido(db.Model):
    __tablename__ = 'pedido'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    data_pedido = db.Column(db.Date, default=date.today)
    status = db.Column(db.String(20), nullable=False, default='pending')
    total = db.Column(db.Numeric(10, 2), nullable=False, default=0.00)
    loja_id = db.Column(db.Integer, db.ForeignKey('loja.id'), nullable=False)
    data_criacao = db.Column(db.Date, default=date.today)

    user = db.relationship('User', back_populates='pedidos')
    produtos = db.relationship('Produto', secondary=pedido_produto, back_populates='pedidos')
    loja = db.relationship('Loja', back_populates='pedidos')

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "loja_id": self.loja_id,
            "data_pedido": self.data_pedido.isoformat() if self.data_pedido else None,
            "status": self.status,
            "total": float(self.total),
            "produtos": [produto.to_dict() for produto in self.produtos],
            "data_criacao": self.data_criacao.isoformat() if self.data_criacao else None,
        }