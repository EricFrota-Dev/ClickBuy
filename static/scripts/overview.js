import { urlBase } from "./constants.js";
import { LoadingSpinner } from "./loadingSpiner.js";

const container = document.querySelector("#overview");
let order = {};

const getOrder = async () => {
  const loadingSpiner = new LoadingSpinner(container);
  loadingSpiner.show();
  try {
    const pathParts = window.location.pathname.split("/").filter(Boolean);
    const pedido_id = pathParts[pathParts.length - 1];

    const res = await fetch(`${urlBase}/pedido/resume/${pedido_id}`, {
      credentials: "include",
    });

    if (!res.ok) throw new Error("Erro ao buscar pedido");

    const data = await res.json();
    if (data) {
      order = data.order;
      console.log(order);
      container.innerHTML = showOrder(order);
    }
  } catch (error) {
    console.error("Erro ao buscar pedido:", error);
  }
  loadingSpiner.hide();
};
getOrder();

const showOrder = (pedido) => {
  return `
    <div class="order-card">
      <div class="order-header">
        <h2>Pedido #${pedido.id}</h2>
        <a href="${pedido.init_point || "#"}" class="order-status ${
    pedido.init_point ? "pending" : ""
  }">${pedido.status == "pending" ? "Pagar" : pedido.status}</a>
      </div>

      <div class="order-info">
        <p><strong>Data do Pedido:</strong> ${pedido.data_pedido}</p>
        ${
          pedido.status == "payed"
            ? `<p><strong>Entrega Prevista:</strong> ${pedido.data_entrega}</p>`
            : ""
        }
        <p><strong>Frete:</strong> R$ ${pedido.valor_frete.toFixed(2)}</p>
      </div>
      <div class="order-products">
        <p><strong>Produtos:</strong></p>
        ${pedido.produtos
          .map(
            (produto) => `
          <a href="${urlBase}produto/${
              produto.id_produto
            }" class="product-item">
            <span class="start"><img src="${urlBase}produto/imagem/${
              produto.foto_pedido
            }" alt="${produto.foto_pedido}"/></span>
            <span class="middle">${produto.nome_produto} (x${
              produto.quantidade
            })</span>
            <span class="end">R$ ${produto.subtotal.toFixed(2)}</span>
          </a>
        `
          )
          .join("")}
      </div>

      <div class="order-total">Total: R$ ${pedido.total.toFixed(2)}</div>

      <div class="order-address">
        <p><strong>Endereço de Entrega:</strong></p>
        <p>${pedido.endereco.logradouro}, ${pedido.endereco.numero} - ${
    pedido.endereco.complemento
  }</p>
        <p>${pedido.endereco.bairro}, ${pedido.endereco.cidade} - ${
    pedido.endereco.estado
  }</p>
        <p>CEP: ${pedido.endereco.cep}</p>
      </div>
    </div>
  `;
};
