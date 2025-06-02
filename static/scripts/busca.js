import { lupaIcon, urlBase } from "./constants.js";
import { doubleArrow, arrow, formatarValor } from "./constants.js";
import { LoadingSpinner } from "./loadingSpiner.js";

const buscaBtn = document.querySelector("#busca-btn");
buscaBtn.innerHTML = lupaIcon;
let filtro = "";
function montarEstruturaInicial() {
  document.querySelector(
    ".section-container"
  ).innerHTML = `<div id="ofertas" class="hide iniciais">
    <div class="header">
      <h2>Ofertas</h2>
      <button id="ver_mais_ofertas" class="btn_padrao">Ver Mais</button>
    </div>
    <div id="produtos">
      <ol></ol>
    </div>
  </div>
  <div id="populares" class="hide iniciais">
  <div class="header">
      <h2>Populares</h2>
      <button id="ver_mais_populares" class="btn_padrao">Ver Mais</button>
    </div>
    <div id="produtos">
      <ol></ol>
    </div></div>`;
}

montarEstruturaInicial();

document.querySelector("#busca-form").addEventListener("submit", (e) => {
  e.preventDefault();
  let texto = document.querySelector("#texto-busca");
  if (texto.value) {
    buscarProdutosFiltrados();
  }
  return;
});

let filtrosAtuais = {};

let produtosIniciais = [
  {
    total: null,
    pages: null,
    current_page: null,
    products: [],
  },
];

async function buscarProdutosIniciais() {
  document.querySelector("#ver_mais_ofertas").addEventListener("click", () => {
    mostrarMaisOfertas("ofertas");
  });
  document
    .querySelector("#ver_mais_populares")
    .addEventListener("click", () => {
      mostrarMaisOfertas("mais-pedidos");
    });
  let ofertas = document.querySelector("#ofertas");
  let populares = document.querySelector("#populares");
  let campos = document.querySelectorAll("#produtos ol");
  let spinner = new LoadingSpinner(
    document.querySelector(".section-container")
  );
  spinner.show();

  produtosIniciais[0] = await buscarProdutos({ filtro: "ofertas" });
  produtosIniciais[1] = await buscarProdutos({ filtro: "mais-pedidos" });

  if (campos[0]) {
    campos[0].innerHTML = produtosIniciais[0].products
      .map(renderCardProduto)
      .join("");
    distribuirEventos(
      campos[0],
      ".card-produto-oferta",
      produtosIniciais[0].products
    );
  }

  if (campos[1]) {
    campos[1].innerHTML = produtosIniciais[1].products
      .map(renderCardProduto)
      .join("");
    distribuirEventos(
      campos[1],
      ".card-produto-oferta",
      produtosIniciais[1].products
    );
  }
  ofertas.classList.remove("hide");
  populares.classList.remove("hide");
  spinner.hide();
}
function distribuirEventos(container, identificador, itens) {
  container.querySelectorAll(identificador).forEach((card, index) => {
    card.addEventListener("click", () => AbrirDetalhes(itens[index].id));
  });
}

buscarProdutosIniciais();

function AbrirDetalhes(id) {
  window.location.href = `${urlBase}produto/${id}`;
}

function renderCardProduto({
  foto_produto,
  nome_produto,
  preco_atual,
  preco_original,
}) {
  const desconto = (100 - (preco_atual / preco_original) * 100).toFixed(0);
  return `<li class="card-produto-oferta">
    ${
      desconto > 0
        ? `<span class="estiqueta-desconto">${desconto}% off</span>`
        : ""
    }
    <div product-img>
        <img src="${urlBase}produto/imagem/${foto_produto}" alt="${nome_produto}" />
    </div>
    <div><h4>${nome_produto}</h4></div>
    <div class="price-field">
        <del class="desconto">R$${formatarValor(preco_original)}</del>
        <h2 class="value">R$ ${formatarValor(preco_atual)}</h2>
        <p><span class="value">em 12X de R$${formatarValor(
          preco_atual
        )}</span></p>
    </div>
  </li>`;
}

async function buscarProdutos({
  filtro = "",
  texto = null,
  page = 1,
  per_page = 4,
}) {
  const usarPost = texto && texto.trim() !== "";
  const url = `${urlBase}produtos${
    usarPost ? `/${filtro}` : filtro ? `/${filtro}` : ""
  }?page=${page}&per_page=${per_page}`;

  try {
    const response = await fetch(url, {
      method: usarPost ? "POST" : "GET",
      headers: usarPost ? { "Content-Type": "application/json" } : {},
      body: usarPost ? JSON.stringify({ texto }) : null,
    });

    if (!response.ok) throw new Error("Erro na requisição");

    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return null;
  }
}

async function buscarProdutosFiltrados(
  texto = document.querySelector("#texto-busca").value,
  ord = document.querySelector("#ordenar").value,
  page = 1,
  qntdPorPAge = 8
) {
  filtrosAtuais = { texto, ord, page, qntdPorPAge };

  const campo = document.querySelector(".section-container");
  const spinner = new LoadingSpinner(campo);
  spinner.show();
  console.log(texto);
  let productsBuscados = {};
  if (texto) {
    productsBuscados = await buscarProdutos({
      filtro: ord,
      texto,
      page,
      per_page: qntdPorPAge,
    });
  } else {
    productsBuscados = await buscarProdutos({
      filtro: filtro,
      texto: "",
      page,
      per_page: qntdPorPAge,
    });
  }

  if (productsBuscados) {
    showProducts(productsBuscados);
  }

  spinner.hide();
}

function showProducts(productsBuscados) {
  const campo = document.querySelector(".section-container");
  campo.innerHTML = `<div id="ofertas" class="iniciais">
    <div id="produtos">
      <div class="header">
        <h3>Resultados: ${productsBuscados.total}</h3>
      </div>
      <ol>
        ${productsBuscados.products.map(renderCardProduto).join("")}
      </ol>
      <div class="produto-navegation">
        <button class="hovered" id="btn-retornar">${arrow()}</button>
        <button class="hovered" id="btn-inicio">${doubleArrow()}</button>
        <div class="pages">página: ${productsBuscados.current_page} de ${
    productsBuscados.pages
  }</div>
        <button class="rotate hovered" id="btn-fim">${doubleArrow()}</button>
        <button class="rotate hovered" id="btn-avancar">${arrow()}</button>
      </div>
    </div>
  </div>`;

  distribuirEventos(campo, ".card-produto-oferta", productsBuscados.products);

  document.querySelector("#btn-retornar").addEventListener("click", () => {
    if (productsBuscados.current_page > 1) {
      buscarProdutosFiltrados(
        filtrosAtuais.texto,
        filtrosAtuais.ord,
        productsBuscados.current_page - 1,
        filtrosAtuais.qntdPorPAge
      );
    }
  });

  document.querySelector("#btn-inicio").addEventListener("click", () => {
    buscarProdutosFiltrados(
      filtrosAtuais.texto,
      filtrosAtuais.ord,
      1,
      filtrosAtuais.qntdPorPAge
    );
  });

  document.querySelector("#btn-fim").addEventListener("click", () => {
    buscarProdutosFiltrados(
      filtrosAtuais.texto,
      filtrosAtuais.ord,
      productsBuscados.pages,
      filtrosAtuais.qntdPorPAge
    );
  });

  document.querySelector("#btn-avancar").addEventListener("click", () => {
    if (productsBuscados.current_page < productsBuscados.pages) {
      buscarProdutosFiltrados(
        filtrosAtuais.texto,
        filtrosAtuais.ord,
        productsBuscados.current_page + 1,
        filtrosAtuais.qntdPorPAge
      );
    }
  });
}

async function mostrarMaisOfertas(cat) {
  const campo = document.querySelector(".section-container");
  const spinner = new LoadingSpinner(campo);
  spinner.show();
  filtro = cat;
  const products = await buscarProdutos({
    filtro: filtro,
    page: 1,
    per_page: 8,
  });
  if (products) showProducts(products);

  spinner.hide();
}
