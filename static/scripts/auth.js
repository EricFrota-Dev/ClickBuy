import { user } from "./userData.js";
import {
  urlBase,
  itensDeNavegacaoLoja,
  itensDeNavegacaoUser,
} from "./constants.js";

export class Auth {
  constructor() {
    this.estaAutenticado = false;
    this.initialAuth();
  }

  async initialAuth() {
    console.log("tentou autenticar");

    const response = await fetch(`${urlBase}auth`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (data.user) {
      user.setUser(data.user);
      this.estaAutenticado = true;
      return true;
    } else {
      user.clear();
      console.log("não autenticado");
      this.estaAutenticado = false;
      return false;
    }
  }
}

const btnEntrar = document.querySelector(".btn_entrar");

export async function verificarAutenticacao() {
  const auth = new Auth();
  const estaAutenticado = await auth.initialAuth();

  if (estaAutenticado) {
    btnEntrar?.classList.add("hide");
    console.log(user.data);
    distribuirItensDeNavegacao();
    return true;
  } else {
    btnEntrar?.classList.remove("hide");
    return false;
  }
}
function distribuirItensDeNavegacao() {
  const sideBar = document.querySelector("#sidebar_nav");
  const userName = document.querySelector("#user_name");
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
}
async function deslogar() {
  await fetch(`${urlBase}logout`, {
    method: "POST",
    credentials: "include",
  })
    .then((res) => res.json())
    .then((data) => {
      Toast.sentToast(`${data.message}`, "success");
    })
    .catch((err) => console.error(err));
  distribuirItensDeNavegacao();
  user.clear();
  window.location.href = "/";
}
