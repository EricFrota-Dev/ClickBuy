import { cartIcon, urlBase } from "./constants.js";
import { Toast } from "./toast.js";
import { deleteIcon } from "./constants.js";

export default class Cart {
  STOREGEKEY = "cartItems";
  subscribers = [];

  constructor() {
    this.iconElement = document.querySelector("#cart");
    this.modalElement = document.querySelector("#modal");
    this.count = this.changeCount();
    this.products = this.getProductsInCart();
    this.showIcon();
    this.isOpen = false;
  }

  showIcon() {
    this.iconElement.innerHTML = cartIcon;
  }

  subscribe(callback) {
    this.subscribers.push(callback);
  }

  notify() {
    // Garante que não ocorra loop de chamadas recursivas indesejadas
    const productsCopy = JSON.parse(JSON.stringify(this.products));
    this.subscribers.forEach((cb) => cb(productsCopy));
  }

  changeCount() {
    return 0;
  }

  click() {
    this.toggleCart();
  }

  getProductsInCart() {
    const storegeProducts = localStorage.getItem(this.STOREGEKEY);
    return storegeProducts ? JSON.parse(storegeProducts) : [];
  }

  setProduct(produto) {
    const existingProduct = this.products.find(
      (item) => item.id === produto.id
    );

    if (existingProduct) {
      existingProduct.quantidade += 1;
    } else {
      this.products.push({ ...produto, quantidade: 1 });
      Toast.create(
        `${
          produto.nome_produto || "Um produto"
        } adicionado ao carrinho com sucesso!`
      );
    }

    this.saveOnLocalStorege();
    this.renderCart();
    this.toggleCart();
  }

  toggleCart() {
    this.isOpen = !this.isOpen;
    this.modalElement.classList.toggle("hide");
  }

  clearCartProducts() {
    this.products = [];
    localStorage.removeItem(this.STOREGEKEY);
    this.renderCart();
  }

  modal(cartProducts) {
    return `
      <div class="modal-bg"></div>
      <div class="modal-carrinho">
        <div class="modal-container">
          <ol class="itens-carrinho">
            ${this.listItems(cartProducts)}
          </ol>
          <div class="modal-btn">
            <button class="btn_padrao btn-finalizar"><h3>Finalizar compra</h3></button>
            <button class="btn_padrao btn-continuar"><h3>Continuar comprando</h3></button>
          </div>
        </div>
      </div>
    `;
  }

  listItems(cartProducts) {
    return cartProducts
      .map(
        (p) => `
        <li>
          <div class="img">
            <img src="http://127.0.0.1:5000/produto/imagem/${
              p.foto_produto
            }" alt="${p.nome_produto}" />
          </div>
          <div class="cart-item-desc">
            <div>
              <p>${p.nome_produto}</p>
            </div>
            <div>
              <strong>${(p.preco_atual * p.quantidade).toLocaleString("pt-br", {
                style: "currency",
                currency: "BRL",
              })}</strong>
              <button class="item-asc">+</button>
              <input type="number" value="${p.quantidade}" />
              <button class="item-desc">-</button>
              <button class="removeCartItem">${deleteIcon}</button>
            </div>
          </div>
        </li>`
      )
      .join(" ");
  }

  saveOnLocalStorege() {
    localStorage.setItem(this.STOREGEKEY, JSON.stringify(this.products));
  }

  renderCart() {
    this.products = this.getProductsInCart();
    this.modalElement.innerHTML = this.modal(this.products);
    this.modalElement
      .querySelector(".modal-bg")
      ?.addEventListener("click", () => this.toggleCart());

    this.modalElement.querySelectorAll("ol li").forEach((item, i) => {
      const btns = item.querySelectorAll("button");

      btns[0]?.addEventListener("click", () => {
        this.products[i].quantidade += 1;
        this.saveOnLocalStorege();
        this.renderCart();
      });

      btns[1]?.addEventListener("click", () => {
        if (this.products[i].quantidade > 1) {
          this.products[i].quantidade -= 1;
          this.saveOnLocalStorege();
          this.renderCart();
        }
      });

      btns[2]?.addEventListener("click", () => {
        Toast.confirm("Deseja remover item do carrinho?", () => {
          this.products.splice(i, 1);
          this.saveOnLocalStorege();
          this.renderCart();
        });
      });
    });

    document.querySelectorAll(".modal-btn button").forEach((btn, i) => {
      btn.addEventListener("click", async () => {
        if (i == 0) {
          window.location.href = `${urlBase}pedido/checkout`;
        } else if (window.location.href.includes("/produto")) {
          window.history.back();
        } else {
          this.toggleCart();
        }
      });
    });

    this.notify();
  }

  renderCartItems(containerElement) {
    this.products = this.getProductsInCart();
    containerElement.innerHTML = `
      <ol class="itens-carrinho">
        ${this.listItems(this.products)}
      </ol>
    `;

    containerElement.querySelectorAll("ol li").forEach((item, i) => {
      const btns = item.querySelectorAll("button");

      btns[0]?.addEventListener("click", () => {
        this.products[i].quantidade += 1;
        this.saveOnLocalStorege();
        this.renderCartItems(containerElement);
      });

      btns[1]?.addEventListener("click", () => {
        if (this.products[i].quantidade > 1) {
          this.products[i].quantidade -= 1;
          this.saveOnLocalStorege();
          this.renderCartItems(containerElement);
        }
      });

      btns[2]?.addEventListener("click", () => {
        Toast.confirm("Deseja remover o item do carrinho?", () => {
          this.products.splice(i, 1);
          this.saveOnLocalStorege();
          this.renderCartItems(containerElement);
        });
      });
    });

    this.notify();
  }

  async init() {
    this.modalElement.classList.add("hide");
    this.iconElement.addEventListener("click", () => {
      this.renderCart();
      this.toggleCart();
    });
    this.renderCart();
  }
}
