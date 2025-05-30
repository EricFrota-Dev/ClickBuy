import { user } from "./userData.js";
import { urlBase } from "./constants.js";

export class Auth {
  constructor() {
    this.token = Auth.getToken();
    this.estaAutenticado = false;

    if (this.token) {
      this.initialAuth();
    }
  }

  async initialAuth() {
    console.log("tentou autenticar", this.token);

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

  static getToken() {
    const match = document.cookie.match(/(?:^|;\s*)token=([^;]*)/);
    return match ? match[1] : null;
  }
}

const btnEntrar = document.querySelector(".btn_entrar");

export async function verificarAutenticacao() {
  const auth = new Auth();
  const estaAutenticado = await auth.initialAuth();

  if (estaAutenticado) {
    btnEntrar?.classList.add("hide");
    return true;
  } else {
    btnEntrar?.classList.remove("hide");
    return false;
  }
}
