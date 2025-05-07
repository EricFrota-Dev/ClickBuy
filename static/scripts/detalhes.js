const detalhes = JSON.parse(document.querySelector("#detalhes").innerHTML);
console.log(detalhes);

const modal = `<div class="modal-carrinho">
  <div class="modal-container">
    <ol class="itens-carrinho">
      <li>
        <div></div>
        <div></div>
        <div>
          <button>+</button>
          <button>-</button>
          <button>x</button>
        </div>
      </li>
    </ol>
    <div class="modal-btn">
      <button></button>
      <button></button>
    </div>
  </div>
</div>`;
