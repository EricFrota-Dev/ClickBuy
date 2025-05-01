export class Toast {
  static create(message, type = "success") {
    const toastContainer =
      document.querySelector("#toast-container") || Toast.#createContainer();

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    toast.innerHTML = `
        <div class="toast-icon">${Toast.#getIcon(type)}</div>
        <div class="toast-message">${message}</div>
        <button class="toast-close">&times;</button>
      `;

    toast.querySelector(".toast-close").addEventListener("click", () => {
      toast.remove();
    });

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 4000);
  }

  static confirm(message, onConfirm) {
    const toastContainer =
      document.querySelector("#toast-container") || Toast.#createContainer();

    const toast = document.createElement("div");
    toast.className = `toast toast-confirm`;

    toast.innerHTML = `
        <div class="toast-icon">${Toast.#getIcon("confirm")}</div>
        <div class="toast-message">${message}</div>
        <div class="toast-actions">
          <button class="toast-button toast-confirm-yes">Sim</button>
          <button class="toast-button toast-confirm-no">Cancelar</button>
        </div>
      `;

    toast.querySelector(".toast-confirm-yes").addEventListener("click", () => {
      onConfirm();
      Toast.create("Operação realizada com sucesso!", "success");
      toast.remove();
    });

    toast.querySelector(".toast-confirm-no").addEventListener("click", () => {
      toast.remove();
    });

    toastContainer.appendChild(toast);
  }

  static #createContainer() {
    const container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
    return container;
  }

  static #getIcon(type) {
    const icons = {
      success: "✅",
      fail: "❌",
      warning: "⚠️",
      confirm: "❓",
    };
    return icons[type] || "ℹ️";
  }
  static sentToast(message, type) {
    localStorage.setItem(
      "toastMessage",
      JSON.stringify({
        message: message,
        type: type,
      })
    );
  }
}
