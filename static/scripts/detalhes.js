import { cart } from "./index.js";
import { Toast } from "./toast.js";

const detalhes = JSON.parse(document.querySelector("#detalhes").innerHTML);
console.log(detalhes);

const comprarBtn = document.querySelector("#btn-comprar");

comprarBtn.addEventListener("click", () => {
  Toast.confirm(`Deseja incluir ${detalhes.nome_produto} ao carrinho?`, () =>
    cart.setProduct(detalhes)
  );
});
