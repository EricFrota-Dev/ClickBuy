import { verificarAutenticacao } from "./auth.js";
import Cart from "./cart.js";
import { itensDeNavegacao, urlBase } from "./constants.js";

import { Toast } from "./toast.js";
import { user } from "./userData.js";

document.body.classList.add(localStorage.getItem("theme"));
document.querySelector(".logo_container")?.addEventListener("click", () => {
  window.location.href = "/";
});
const sideBar = document.querySelector("#sidebar_nav");

sideBar.innerHTML += itensDeNavegacao
  .map((item) => {
    return `<li class=${item.titulo}><a href="${item.url}">${item.titulo}</a></li>`;
  })
  .join("");
export const cart = new Cart();
cart.init();
window.addEventListener("DOMContentLoaded", () => {
  const toastData = localStorage.getItem("toastMessage");
  if (toastData) {
    const { message, type } = JSON.parse(toastData);
    Toast.create(message, type);
    localStorage.removeItem("toastMessage");
  }
});

verificarAutenticacao();

export function showLoading() {
  document.getElementById("loadingSpinner").classList.remove("hide");
}

export function hideLoading() {
  document.getElementById("loadingSpinner").classList.add("hide");
}
window.addEventListener("pageshow", () => {
  cart.renderCart();
});
