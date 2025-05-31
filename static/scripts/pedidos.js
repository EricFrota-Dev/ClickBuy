import { urlBase } from "./constants.js";

const ordersScript = document.getElementById("orders-data");
const orders = JSON.parse(ordersScript.textContent);

const container = document.querySelector("#pedidos");

function Real(value) {
  return value.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });
}

container.innerHTML = orders
  .map(({ id, total, data_entrega, data_pedido, status }) => {
    return `
    <li class="order-card">
      <a href="${urlBase}pedido/overview/${id}" class="order-link">
        <div class="order-header">
          <h3>Pedido #${id}</h3>
          <h3 class="order-total">${Real(total)}</h3>
        </div>
        <div class="order-info">
          <p class="order-date">Data do pedido: ${data_pedido}</p>
          <p class="order-delivery">
            ${status == "entregue" ? "Entregue em: " : "Previsão de entrega: "}
            <strong>${data_entrega}</strong>
          </p>
          ${
            status !== "pending"
              ? `<p class="order-paid status-success">Pagamento realizado</p>`
              : `<p class="order-paid status-warning">Aguardando pagamento</p>`
          }
        </div>
      </a>
    </li>
    `;
  })
  .join("");
