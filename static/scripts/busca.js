import { lupaIcon, urlBase } from "./constants.js";
import { doubleArrow, arrow, formatarValor } from "./constants.js";
import { LoadingSpinner } from "./loadingSpiner.js";

const buscaBtn = document.querySelector("#busca-btn");
buscaBtn.innerHTML = lupaIcon;

// estrutura inicial da página
function montarEstruturaInicial() {
  document.querySelector(".section-container").innerHTML = `<div id="ofertas">
    <div class="header">
      <h2>Ofertas</h2>
      <button id="ver_mais_ofertas" class="btn_padrao">Ver Mais</button>
    </div>
    <div id="produtos">
      <ol></ol>
    </div>
  </div>`;
}

montarEstruturaInicial();

document.querySelector("#busca-form").addEventListener("submit", (e) => {
  e.preventDefault();
  buscarProdutosFiltrados();
});

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
    mostrarMaisOfertas();
  });

  let campo = document.querySelector("#produtos ol");
  let spinner = new LoadingSpinner(campo);
  spinner.show();

  produtosIniciais[0] = await buscarProdutos("ofertas");

  campo.innerHTML = produtosIniciais[0].products
    .map(renderCardProduto)
    .join("");

  distribuirEventos(".card-produto-oferta", produtosIniciais[0].products);
  spinner.hide();
}

buscarProdutosIniciais();

function AbrirDetalhes(id) {
  window.location.href = `${urlBase}produto/${id}`;
}

function distribuirEventos(identificador, itens) {
  document.querySelectorAll(identificador).forEach((card, index) => {
    card.addEventListener("click", () => AbrirDetalhes(itens[index].id));
  });
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

async function buscarProdutos(filtro, params = null, page = 1, per_page = 3) {
  const url = `${urlBase}produtos${
    filtro ? `/${filtro}` : ""
  }?page=${page}&per_page=${per_page}`;

  try {
    const response = await fetch(url, {
      method: params ? "POST" : "GET",
      headers: { "Content-Type": "application/json" },
      body: params ? params : null,
    });
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return null;
  }
}

async function buscarProdutosFiltrados(
  texto = document.querySelector("#texto-busca").value,
  ord = document.querySelector("#ordenar").value,
  body = { texto },
  page = 1,
  qntdPorPAge = 8
) {
  if (!texto) return;

  const campo = document.querySelector(".section-container");
  const spinner = new LoadingSpinner(campo);
  spinner.show();

  const productsBuscados = await buscarProdutos(
    ord,
    JSON.stringify(body),
    page,
    qntdPorPAge
  );
  if (productsBuscados) {
    showProducts(productsBuscados, { body, ord, page, qntdPorPAge });
  }

  spinner.hide();
}

function showProducts(productsBuscados, filters) {
  document.querySelector(".section-container").innerHTML = `<div id="ofertas">
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

  distribuirEventos(".card-produto-oferta", productsBuscados.products);

  document.querySelector("#btn-retornar").addEventListener("click", () => {
    if (productsBuscados.current_page > 1) {
      buscarProdutosFiltrados(
        filters.body.texto,
        filters.ord,
        filters.body,
        productsBuscados.current_page - 1,
        filters.qntdPorPAge
      );
    }
  });

  document.querySelector("#btn-inicio").addEventListener("click", () => {
    buscarProdutosFiltrados(
      filters.body.texto,
      filters.ord,
      filters.body,
      1,
      filters.qntdPorPAge
    );
  });

  document.querySelector("#btn-fim").addEventListener("click", () => {
    buscarProdutosFiltrados(
      filters.body.texto,
      filters.ord,
      filters.body,
      productsBuscados.pages,
      filters.qntdPorPAge
    );
  });

  document.querySelector("#btn-avancar").addEventListener("click", () => {
    if (productsBuscados.current_page < productsBuscados.pages) {
      buscarProdutosFiltrados(
        filters.body.texto,
        filters.ord,
        filters.body,
        productsBuscados.current_page + 1,
        filters.qntdPorPAge
      );
    }
  });
}

async function mostrarMaisOfertas() {
  const campo = document.querySelector(".section-container");
  const spinner = new LoadingSpinner(campo);
  spinner.show();

  const products = await buscarProdutos("ofertas", "", 1, 8);
  if (products)
    showProducts(products, {
      body: {},
      ord: "ofertas",
      page: 1,
      qntdPorPAge: 8,
    });

  spinner.hide();
}
