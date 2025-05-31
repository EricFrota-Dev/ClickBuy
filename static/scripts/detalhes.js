import { cartIcon, formatarValor } from "./constants.js";
import { cart } from "./index.js";
import { Toast } from "./toast.js";

const wraper = document.querySelector(".details-wraper");
const produto = JSON.parse(document.querySelector("#product-data").textContent);
let desconto = (
  100 -
  (produto.preco_atual / produto.preco_original) * 100
).toFixed(0);
wraper.innerHTML = `
  <div class="details-container">
  
    <div class="product-image">
      <img
        src="https://light-labrador-composed.ngrok-free.app/produto/imagem/${
          produto.foto_produto
        }"
        alt="${produto.nome_produto}"
      />
    </div>
    <div class="product-details">
    <h1 class="product-title">${produto.nome_produto}</h1>
      <p class="product-category">
        Categoria: <strong>${produto.categoria}</strong>
      </p>
      <p class="product-stock">
        Estoque disponível: <strong>${produto.estoque} unidades</strong>
      </p>

      <div class="product-price">
        <del class="original-price">R$ ${formatarValor(
          produto.preco_original
        )}</del>
        <span class="current-price">R$ ${formatarValor(
          produto.preco_atual
        )}<span class="discount">${desconto}% off</span></span>
        <span class="parcels">em 12x R$${formatarValor(
          produto.preco_atual / 12
        )}</span>
      </div>
      <button class="buy-button">
        <div class="btn-background"></div>
        <p>Adicionar ao Carrinho ${cartIcon}</p>
      </button>
    </div>
  </div>
  <p class="product-description">${produto.descricao_produto}</p>`;

const comprarBtn = document.querySelector(".buy-button");
comprarBtn.addEventListener("click", () => {
  cart.setProduct(produto);
});
