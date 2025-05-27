import { urlBase } from "./constants.js";
import { cart } from "./index.js";
import { LoadingSpinner } from "./loadingSpiner.js";
import { user } from "./userData.js";

const checkoutContainer = document.querySelector(".itens-carrinho");
document.querySelector("#cart").classList.add("hide");
const btnComprar = document.querySelector("#confirm-payment");

cart.renderCartItems(checkoutContainer);

document.addEventListener("click", () => updateResumo());

// Elementos
const subtotalSpan = document.querySelector("#subtotal");
const totalSpan = document.querySelector("#total");
const freteSpan = document.querySelector("#frete");
let frete = 0;
let subtotal = 0;
let total = 0;
let isOk = false;

function updateResumo() {
  subtotal = cart.products.reduce((acc, { preco_atual, quantidade }) => {
    return acc + preco_atual * quantidade;
  }, 0);
  total = frete + subtotal;
  subtotalSpan.innerText = subtotal.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });
  freteSpan.innerText = frete.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });

  totalSpan.innerText = total.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });
}

// Atualiza inicialmente sem frete
updateResumo();
validate();

// Preenchimento e cálculo de frete via CEP
document.addEventListener("DOMContentLoaded", () => {
  const cepInput = document.querySelector("#cep");
  const logradouro = document.querySelector("#logradouro");
  const bairro = document.querySelector("#bairro");
  const cidade = document.querySelector("#cidade");
  const estado = document.querySelector("#estado");

  cepInput.addEventListener("blur", async () => {
    const cep = cepInput.value.replace(/\D/g, "");

    if (cep.length !== 8) {
      isOk = false;
      alert("CEP inválido.");
      return;
    }

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();

      if (data.erro) {
        isOk = false;
        alert("CEP não encontrado.");
        return;
      }
      await calcularFrete(cep);

      // Preencher endereço
      logradouro.value = data.logradouro || "";
      bairro.value = data.bairro || "";
      cidade.value = data.localidade || "";
      estado.value = data.uf || "";

      isOk = true;
      validate();
      // Atualiza o resumo com novo frete e total
      updateResumo();
    } catch (error) {
      console.error("Erro ao buscar endereço:", error);
    }
  });
});
async function calcularFrete(cep) {
  try {
    const response = await fetch(`/pedido/frete?cep=${cep}`);
    const data = await response.json();

    if (data.erro) {
      alert("Erro ao calcular frete: " + data.erro);
      return;
    }

    frete = data.frete;
    const prazo = data.prazo;

    console.log(`Frete calculado: R$ ${frete}, Prazo: ${prazo} dias`);
  } catch (error) {
    console.error("Erro ao buscar frete:", error);
  }
}
function validate() {
  isOk
    ? btnComprar.removeAttribute("disabled")
    : btnComprar.setAttribute("disabled", true);
}

btnComprar.addEventListener("click", async () => {
  const user = user.getUser();
  const products = cart.getProductsInCart();
  const pedido = {
    user: {
      id: user.id,
    },
    products: products.map(({ loja_id, id, quantidade }) => {
      return {
        id: id,
        quantidade: quantidade,
        loja_id: loja_id,
      };
    }),
  };

  const loadingSpiner = new LoadingSpinner(document.querySelector("main"));
  loadingSpiner.show();
  await fetch(`${urlBase}pedido`, {
    method: "POST",
    headers: { "Content-Type": "Aplication-json" },
    credentials: "include",
    body: pedido,
  })
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((err) => console.error(err))
    .finally(() => loadingSpiner.hide());
});
