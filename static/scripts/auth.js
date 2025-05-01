import { user } from "./userData.js";

export class Auth {
  constructor() {
    this.token = localStorage.getItem("token");
    this.estaAutenticado = false;
    if (this.token) {
      this.initialAlth();
    }
  }
  async initialAlth() {
    console.log("tentou atenticar", this.token);
    const response = await fetch("http://127.0.0.1:5000/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
    const data = await response.json();
    if (data.user) {
      user.setUser(data.user);
      return true;
    } else {
      user.clear();
      localStorage.removeItem("token");
      console.log("nao autenticado");
      return false;
    }
  }
  static getToken() {
    return localStorage.getItem("token");
  }
}
const btnEntrar = document.querySelector(".btn_entrar");

export async function verificarAutenticacao() {
  const auth = new Auth();
  const estaAutenticado = await auth.initialAlth();

  if (estaAutenticado) {
    btnEntrar?.classList.add("hide");
    return true;
  } else {
    btnEntrar?.classList.remove("hide");
    return false;
  }
}
