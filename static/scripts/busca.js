import { lupaIcon } from "./constants.js";
import { doubleArrow, arrow } from "./constants.js";

const buscaBtn = document.querySelector("#busca-btn");
buscaBtn.innerHTML = lupaIcon;

document.querySelector(".section-container").innerHTML = `<div id="ofertas">
    <div class="header">
      <h2>Ofertas</h2>
      <button id="ver_mais_ofertas" class="btn_padrao">Ver Mais</button>
    </div>
    <div id="produtos">
      <ol></ol>
    </div>
  </div>`;

document.querySelector("#busca-form").addEventListener("submit", (e) => {
  e.preventDefault();
  buscarProdutosFiltrados();
});

let proutosIniciais = {
  ofertas: {
    total: null,
    pages: null,
    current_page: null,
    products: [],
  },
};

async function buscarProdutosIniciais() {
  document.querySelector("#ver_mais_ofertas").addEventListener("click", () => {
    alert("clicou");
  });
  proutosIniciais.ofertas = await buscarProdutos("ofertas");
  let campo = document.querySelector("#produtos ol");
  console.log(proutosIniciais);
  campo.innerHTML = proutosIniciais.ofertas.products
    .map(({ foto_produto, nome_produto, preco_atual, preco_original }, i) => {
      return `<li>
                <div product-img>
                    <img src="http://127.0.0.1:5000/produto/imagem/${foto_produto}"alt="${nome_produto}" />
                </div>
                <div><h4>${nome_produto}</h4></div>
                <div>
                    <p class="desconto">${(
                      100 -
                      (preco_atual / preco_original) * 100
                    ).toFixed(0)}% off</p>
                    <h2>${preco_atual.toLocaleString("pt-br", {
                      style: "currency",
                      currency: "BRL",
                    })}</h2>
                    <p><span>em 12X de ${(preco_atual / 12).toLocaleString(
                      "pt-br",
                      {
                        style: "currency",
                        currency: "BRL",
                      }
                    )}</span></p>
                </div>
            </li>`;
    })
    .join("");
}
buscarProdutosIniciais();

async function buscarProdutos(filtro, params = null, page = 1, per_page = 3) {
  const produtos = await fetch(
    `http://127.0.0.1:5000/produtos${
      filtro ? `/${filtro}` : ""
    }?page=${page}&per_page=${per_page}`,
    {
      method: params ? "POST" : "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body: params ? params : null,
    }
  )
    .then((response) => response.json())
    .catch((error) => console.error(error));
  console.log(produtos);
  return produtos;
}

async function buscarProdutosFiltrados(
  texto = document.querySelector("#texto-busca").value,
  ord = document.querySelector("#ordenar").value,
  body = {
    texto: texto,
  },
  page = 1,
  qntdPorPAge = 8
) {
  const productsBuscados = await buscarProdutos(
    ord,
    JSON.stringify(body),
    page,
    qntdPorPAge
  );
  if (productsBuscados) {
    console.log(productsBuscados);
    document.querySelector(".section-container").innerHTML = `<div id="ofertas">
    <div id="produtos">
    <div class="header">
      <h3>Resultados: ${productsBuscados.total}</h3>
      </div>
      <ol>
      ${productsBuscados.products
        .map(({ foto_produto, nome_produto, preco_atual, preco_original }) => {
          let desconto = (100 - (preco_atual / preco_original) * 100).toFixed(
            0
          );
          return `<li>
                <div product-img>
                    <img src="http://127.0.0.1:5000/produto/imagem/${foto_produto}"alt="${nome_produto}" />
                </div>
                <div><h4>${nome_produto}</h4></div>
                <div>
                    <p class="desconto" >${
                      desconto > 0 ? desconto + " %off" : ""
                    }</p>
                    <h2>${preco_atual.toLocaleString("pt-br", {
                      style: "currency",
                      currency: "BRL",
                    })}</h2>
                    <p><span>em 12X de ${(preco_atual / 12).toLocaleString(
                      "pt-br",
                      {
                        style: "currency",
                        currency: "BRL",
                      }
                    )}</span></p>
                </div>
            </li>`;
        })
        .join("")}
      </ol>
      <div class="produto-navegation">
        <button type="submit" class="hovered" id="btn-inicio">${arrow()}</button>
        <button type="submit" class="hovered" id="btn-retornar">${doubleArrow()}</button>
        <div class="pages">pagina: ${productsBuscados.current_page} de ${
      productsBuscados.pages
    }</div>
        <button type="submit" class="rotate hovered" id="btn-avançar">${doubleArrow()}</button>
        <button type="submit" class="rotate hovered" id="btn-fim">${arrow()}</button>
      </div>
    </div>
  </div>`;
    document
      .querySelectorAll(".produto-navegation button")
      .forEach((btn, i) => {
        btn.addEventListener("click", () => {
          const options = {
            0: productsBuscados.current_page - 1,
            1: 1,
            2: productsBuscados.pages,
            3: productsBuscados.current_page + 1,
          };
          if (productsBuscados.current_page == 1 && i == 0) {
          } else if (
            productsBuscados.current_page == productsBuscados.pages &&
            (i == 2 || i == 3)
          ) {
            return;
          } else {
            buscarProdutosFiltrados(texto, ord, body, options[i], qntdPorPAge);
          }
        });
      });
  }
}
