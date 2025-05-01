export class LoadingSpinner {
  constructor(componente) {
    this.componente = componente;
    this.injectHTML();
  }

  injectHTML() {
    if (
      !this.componente.style.position ||
      this.componente.style.position === "static"
    ) {
      this.componente.style.position = "relative";
    }
    const spinnerHtml = `
        <div id="loadingSpinner" class="spinner-overlay hide">
          <div class="spinner"></div>
        </div>
      `;
    this.componente.insertAdjacentHTML("beforeend", spinnerHtml);
    this.spinner = document.getElementById("loadingSpinner");
  }

  show() {
    this.spinner?.classList.remove("hide");
  }

  hide() {
    this.spinner?.classList.add("hide");
  }
}
