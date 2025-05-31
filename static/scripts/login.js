import { verificarAutenticacao } from "./auth.js";
import { LoadingSpinner } from "./loadingSpiner.js";
import { user } from "./userData.js";
import { urlBase } from "./constants.js";

const userData = user;
const a = document.querySelector("#google-login");
a.setAttribute("href", `${urlBase}login/google`);
const spinner = new LoadingSpinner(document.body);

async function estaLogado() {
  if (await verificarAutenticacao()) {
    console.log("Já está logado");
    console.log("Redirecionando para home");
    window.location.href = "/";
  }
}
estaLogado();
document.body.classList.add(localStorage.getItem("theme"));

document.querySelector(".login-form").addEventListener("submit", handleSubmit);
async function handleSubmit(e) {
  e.preventDefault();
  spinner.show();

  const response = await fetch(`${urlBase}login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: document.querySelector("#email").value,
      senha: document.querySelector("#senha").value,
    }),
  });
  const result = await response.json();
  if (response.ok && result.token && result.user) {
    userData.setUser(result.user);
    window.location.href = result.redirect || "/";
  } else {
    document.querySelector(
      `${
        result.message.includes("Usuário") ? ".email-error" : ".password-error"
      }`
    ).textContent = result.message;
  }
  spinner.hide();
}
