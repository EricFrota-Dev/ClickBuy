import { urlBase } from "./constants.js";
import { LoadingSpinner } from "./loadingSpiner.js";
import { user } from "./userData.js";

const singinForm = document.querySelector("#singinForm");
const inputsSingin = document.querySelectorAll(".required-singin");
const singinError = document.querySelectorAll(".singin-error");
const senhaForm = document.querySelector("#senhaForm");
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const completarCadastro = document.querySelector("#completarCadastro");
const spinner = new LoadingSpinner(document.body);

singinForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const errorDiv = document.querySelector(".dinamic-error");
  if (emailValidade()) {
    spinner.show();
    try {
      const response = await fetch(`${urlBase}signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: document.querySelector("#email").value,
        }),
      });
      const data = await response.json();
      errorDiv.textContent = data.message;
      errorDiv.style.display = "block";
      if (data.redirect) window.location.href = data.redirect;
    } catch (error) {
      console.log(error);
      errorDiv.textContent = data.message || "Erro desconhecido.";
      errorDiv.style.display = "block";
    } finally {
      spinner.hide();
    }
  }
});

senhaForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  spinner.show();
  if (validateForm()) {
    const email = document.querySelector("#email").value;
    const senha = document.querySelector("#senha").value;
    const response = await fetch(`${urlBase}criar_senha/${email}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        senha: senha,
      }),
    });
    const data = await response.json();
    if (data.redirect) {
      window.location.href = data.redirect;
    } else {
      alert(data.msg || "Erro no redirecionamento.");
    }
    spinner.hide();
  }
});

completarCadastro?.addEventListener("submit", async (event) => {
  spinner.show();
  event.preventDefault();
  const roleAtual = document.querySelector(
    'input[name="userType"]:checked'
  ).value;
  const userInputs = {
    nome: document.querySelector("#nome").value,
    cpf: document.querySelector("#cpf").value,
    role: roleAtual,
  };
  const loja = {
    nome_fantasia: document.querySelector("#nome_fantasia").value,
    cnpj: document.querySelector("#cnpj").value,
    descricao: document.querySelector("#descricao").value,
  };
  const userData = { ...userInputs, ...(roleAtual == "loja" && loja) };
  const urlCompleta = window.location.href;
  console.log(userData);
  const response = await fetch(urlCompleta, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  const data = await response.json();
  if (data.user) {
    user.setUser(data.user);
    window.location.href = data.redirect || "/";
  } else {
    alert(data.message || "Erro no redirecionamento.");
  }
  spinner.hide();
});

function setError(index) {
  singinError[index].classList.remove("hide");
  inputsSingin[index].style.border = "2px solid red";
}

function removeError(index) {
  singinError[index].classList.add("hide");
  inputsSingin[index].style.border = "";
}
document.querySelector("#email")?.addEventListener("input", () => {
  emailValidade();
});

function emailValidade() {
  const errorDiv = document.querySelector(".dinamic-error");
  errorDiv?.classList.remove("block");

  const emailValue = document.querySelector("#email")?.value || "";

  if (!emailPattern.test(emailValue)) {
    setError(0);
    return false;
  } else {
    removeError(0);
    return true;
  }
}

document.querySelector("#senha")?.addEventListener("input", () => {
  passwordValidade();
});

function passwordValidade() {
  if (inputsSingin[0].value.length < 8) {
    setError(0);
    return false;
  } else {
    removeError(0);
    confirmPasswordValidade();
    return true;
  }
}
document.querySelector("#confirmar-senha")?.addEventListener("input", () => {
  confirmPasswordValidade();
});
function confirmPasswordValidade() {
  if (
    inputsSingin[0].value === inputsSingin[1].value &&
    inputsSingin[1].value.length >= 8
  ) {
    removeError(1);
    return true;
  } else {
    setError(1);
    return false;
  }
}

function validateForm() {
  const isPasswordValid = passwordValidade();
  const isConfirmPasswordValid = confirmPasswordValidade();

  return isPasswordValid && isConfirmPasswordValid;
}

document.querySelectorAll(".toggle-role")?.forEach((btn) => {
  btn.addEventListener("click", () => {
    toggleRole();
  });
});

function toggleRole() {
  const roleAtual = document.querySelector(
    'input[name="userType"]:checked'
  ).value;
  const lojaInputs = document.querySelectorAll(".loja-item");
  if (roleAtual == "loja") {
    lojaInputs.forEach((input, i) => {
      input.classList.remove("hide");
    });
  } else {
    lojaInputs.forEach((input, i) => {
      input.classList.add("hide");
    });
  }
}
