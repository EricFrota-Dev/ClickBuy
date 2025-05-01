///////////////////////////////   checkbox function

const checkbox = document.querySelector("#terms");
const singinButton = document.querySelector(".singin-button");

function aceptTerms() {
  singinButton.classList.toggle("block");
}

//////////////////////////////    show password

const showIcons = document.querySelectorAll(".show-password");
const inputs = document.querySelectorAll(".required-singin-password");

showIcons.forEach((showIcon, index) => {
  showIcon.addEventListener("click", () => {
    if (inputs[index].type === "password") {
      inputs[index].setAttribute("type", "text");
      showIcons[index].setAttribute(
        "src",
        "{{ url_for('static', filename='imagens/visible.svg') }}"
      );
    } else {
      inputs[index].setAttribute("type", "password");
      showIcons[index].setAttribute(
        "src",
        "{{ url_for('static', filename='imagens/invisible.svg') }}"
      );
    }
  });
});
