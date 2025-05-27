import { verificarAutenticacao } from "./auth.js";
import Cart from "./cart.js";
import {
  itensDeNavegacao,
  itensDeNavegacaoLoja,
  itensDeNavegacaoUser,
} from "./constants.js";

import { Toast } from "./toast.js";
import { user } from "./userData.js";

document.body.classList.add(localStorage.getItem("theme"));
document.querySelector(".logo_container")?.addEventListener("click", () => {
  window.location.href = "/";
});

window.addEventListener("DOMContentLoaded", () => {
  const toastData = localStorage.getItem("toastMessage");
  if (toastData) {
    const { message, type } = JSON.parse(toastData);
    Toast.create(message, type);
    localStorage.removeItem("toastMessage");
  }
});
export const cart = new Cart();
cart.init();
verificarAutenticacao();

export async function deslogar() {
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  distribuirItensDeNavegacao();
  user.clear();
  window.location.href = "/";
}
export function showLoading() {
  document.getElementById("loadingSpinner").classList.remove("hide");
}

export function hideLoading() {
  document.getElementById("loadingSpinner").classList.add("hide");
}
export function distribuirItensDeNavegacao() {
  const sideBar = document.querySelector("#sidebar_nav");
  const userName = document.querySelector("#user_name");

  setTimeout(() => {
    sideBar.innerHTML += itensDeNavegacao
      .map((item) => {
        return `<li class=${item.titulo}><a href="${item.url}">${item.titulo}</a></li>`;
      })
      .join("");
    if (user.data) {
      userName.innerHTML = `<h3 class="user_title">olá,&nbsp;<span>${user.data.nome}</span></h3>`;
      if (user.data.role === "loja") {
        sideBar.innerHTML += itensDeNavegacaoLoja(user.data.loja.id)
          .map((item) => {
            return `<li class=${item.titulo}><a href="${item.url}" >${item.titulo}</a></li>`;
          })
          .join("");
      }
      sideBar.innerHTML += itensDeNavegacaoUser
        .map((item) => {
          return `<li class=${item.titulo}><a href="${item.url}">${item.titulo}</a></li>`;
        })
        .join("");
    } else {
      userName.innerHTML = "";
    }
    document.querySelector(".sair")?.addEventListener("click", () => {
      deslogar();
    });
  }, 2000);
}
distribuirItensDeNavegacao();
