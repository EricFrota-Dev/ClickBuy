import { urlBase } from "./constants.js";
import { cart } from "./index.js";
import { LoadingSpinner } from "./loadingSpiner.js";
import { user } from "./userData.js";
const stripe = Stripe(
  "pk_live_51RVMrXBpe3UKgZbLMF2yWVSXfhSD90IImp8dDr3rsrsoRDAdwSZIz1IcCQJYjUC4uUgRJRf1FlibnAb3tpbzuKb100nJOQerEr"
);

const checkoutContainer = document.querySelector(".itens-carrinho");
document.querySelector("#cart").classList.add("hide");
const btnComprar = document.querySelector("#confirm-payment");

cart.renderCartItems(checkoutContainer);

document.addEventListener("click", () => updateResumo());
const campos = [
  "#cep",
  "#logradouro",
  "#bairro",
  "#cidade",
  "#estado",
  "#numero",
];

campos.forEach((seletor) => {
  document.querySelector(seletor).addEventListener("input", validate);
});

// Elementos
const subtotalSpan = document.querySelector("#subtotal");
const totalSpan = document.querySelector("#total");
const freteSpan = document.querySelector("#frete");
let frete = 0;
let subtotal = 0;
let total = 0;
let data_entrega = 0;
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
    const response = await fetch(`${urlBase}/pedido/frete?cep=${cep}`);
    const data = await response.json();

    if (data.erro) {
      alert("Erro ao calcular frete: " + data.erro);
      return;
    }
    console.log(data);
    frete = data.frete;
    data_entrega = data.prazo;

    console.log(`Frete calculado: R$ ${data.frete}, Prazo: ${data.prazo} dias`);
  } catch (error) {
    console.error("Erro ao buscar frete:", error);
  }
}
function validate() {
  if (
    isOk &&
    document.querySelector("#cep").value &&
    document.querySelector("#logradouro").value &&
    document.querySelector("#bairro").value &&
    document.querySelector("#cidade").value &&
    document.querySelector("#estado").value &&
    document.querySelector("#numero").value
  ) {
    btnComprar.removeAttribute("disabled");
  } else {
    btnComprar.setAttribute("disabled", true);
  }
}

btnComprar.addEventListener("click", async () => {
  const userData = user.getUser();
  const products = cart.getProductsInCart();
  const pedido = {
    user: {
      id: userData.id,
    },
    frete: { data_entrega: data_entrega, valor_frete: frete },
    products: products.map(({ loja_id, id, quantidade }) => {
      return {
        id: id,
        quantidade: quantidade,
        loja_id: loja_id,
      };
    }),
    deliveryAdress: {
      cep: document.querySelector("#cep").value,
      logradouro: document.querySelector("#logradouro").value,
      bairro: document.querySelector("#bairro").value,
      cidade: document.querySelector("#cidade").value,
      estado: document.querySelector("#estado").value,
      numero: document.querySelector("#numero").value,
      complemento: document.querySelector("#complemento").value,
    },
  };
  console.log(pedido);
  const loadingSpiner = new LoadingSpinner(document.querySelector("main"));
  loadingSpiner.show();
  await fetch(`${urlBase}pedido/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(pedido),
  })
    .then((response) => response.json())
    .then((data) => {
      // Redireciona para o Stripe
      cart.clearCartProducts();
      window.addEventListener("pageshow", () => {
        window.location.href = `${urlBase}pedido/overview/${data}`;
      });
      return stripe.redirectToCheckout({ sessionId: data.id });
    })
    .then((result) => {
      if (result.error) {
        alert(result.error.message);
      }
    })
    .catch((error) => console.error("Erro:", error));
  loadingSpiner.hide();
});
