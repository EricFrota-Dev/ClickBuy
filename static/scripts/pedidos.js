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
    <li>
        <a href="">
            <h3>Pedido #${id} | Total: ${Real(total)}</h3>
            <p>Data do pedido: ${data_pedido} | ${
      status == "entregue" ? "Entregue em: " : "Previsão de entrega: "
    }${data_entrega}</p>
            ${status !== "pending" && "Pagamento realizado"}
        </a>
        ${status == "pending" && `<button id="pay">Efetuar pagamento</button>`}
    </li>
    `;
  })
  .join(" ");
