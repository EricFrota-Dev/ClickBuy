import { verificarAutenticacao } from "./auth.js";
import { LoadingSpinner } from "./loadingSpiner.js";
import { Toast } from "./toast.js";
import { user } from "./userData.js";

const userData = user;

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

  const response = await fetch("http://127.0.0.1:5000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: document.querySelector("#email").value,
      senha: document.querySelector("#senha").value,
    }),
  });
  const { token, user } = await response.json();
  if (token && user) {
    localStorage.setItem("token", token);
    userData.setUser(user);
    window.location.href = "/";
  } else {
    Toast.sentToast(data.message, "fail");
  }
  spinner.hide();
}
