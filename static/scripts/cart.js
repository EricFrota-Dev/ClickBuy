import { cartIcon } from "./constants.js";

export default class Cart {
  constructor() {
    this.element = document.querySelector("#cart");
    this.count = this.changeCount();
    this.products = this.getProductsInCart();
    this.showIcon();
  }
  showIcon() {
    this.element.innerHTML = cartIcon;
  }
  changeCount() {
    let count = 0;
    return count;
  }
  click() {
    alert("clicou");
  }
  getProductsInCart() {
    return "sem produtos";
  }
}
