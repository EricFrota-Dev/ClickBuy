///////////////////////////////   checkbox function

import { urlBase } from "./constants.js";

const checkbox = document.querySelector("#terms");
const singinButton = document.querySelector(".singin-button");
checkbox.addEventListener("click", () => aceptTerms());
function aceptTerms() {
  singinButton.classList.toggle("block");
}

//////////////////////////////    show password

const showIcons = document.querySelectorAll(".show-password");
const inputs = document.querySelectorAll(".required-singin-password");

showIcons.forEach((showIcon, index) => {
  showIcon.setAttribute("src", `${urlBase}static/imagens/invisible.svg`);
  showIcon.addEventListener("click", () => {
    if (inputs[index].type === "password") {
      inputs[index].setAttribute("type", "text");
      showIcons[index].setAttribute(
        "src",
        `${urlBase}static/imagens/visible.svg`
      );
    } else {
      inputs[index].setAttribute("type", "password");
      showIcons[index].setAttribute(
        "src",
        `${urlBase}static/imagens/invisible.svg`
      );
    }
  });
});
