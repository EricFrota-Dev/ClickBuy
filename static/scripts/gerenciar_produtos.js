import {
  urlBase,
  deleteIcon,
  doubleArrow,
  editIcon,
  arrow,
} from "./constants.js";
import { user } from "./userData.js";
import { LoadingSpinner } from "./loadingSpiner.js";
import { Toast } from "./toast.js";

window.addEventListener("DOMContentLoaded", () => {
  const toastData = localStorage.getItem("toastMessage");
  if (toastData) {
    const { message, type } = JSON.parse(toastData);
    Toast.create(message, type);
    localStorage.removeItem("toastMessage");
  }
});

const conteudos = document.querySelectorAll("#produtos-content");
const tableHeader = `<tr class="tabela-produtos-header">
          <th>Foto</th>
          <th>Nome</th>
          <th>Valor</th>
          <th>Estoque</th>
          <th></th>
          <th></th>
        </tr>`;
let tipoCadastro = "POST";
let produtoId = null;
document.querySelectorAll(".produto-header-item").forEach((item, i, items) => {
  item.addEventListener("click", () => {
    items.forEach((item, j) => {
      item.classList.toggle("selected", i == j);
      tipoCadastro = "POST";
    });
    conteudos.forEach((conteudo, index) => {
      conteudo.classList.toggle("hide", index !== i);
      tipoCadastro = "POST";
    });
  });
});

document.querySelectorAll(".produto-navegation button").forEach((btn, i) => {
  btn.innerHTML = i == 2 || i == 1 ? doubleArrow() : arrow();
});

document
  .querySelector("#cadastrar-produto-form")
  .addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append(
      "nome_produto",
      document.querySelector("#nome_produto").value
    );
    formData.append(
      "descricao_produto",
      document.querySelector("#descricao_produto").value
    );
    formData.append(
      "preco_atual",
      document.querySelector("#preco_atual").value
    );
    formData.append(
      "preco_original",
      document.querySelector("#preco_original").value
    );
    formData.append("estoque", document.querySelector("#estoque").value);
    formData.append("categoria", document.querySelector("#categoria").value);

    const fotoInput = document.querySelector("#foto_produto");
    if (fotoInput.files.length > 0) {
      formData.append("foto_produto", fotoInput.files[0]);
    }

    fetch(
      `${urlBase}produto/${
        tipoCadastro === "POST"
          ? `register/${user.data.loja.id}`
          : `update/${user.data.loja.id}/${produtoId}`
      }`,
      {
        method: tipoCadastro,
        credentials: "include",
        body: formData,
      }
    )
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Erro desconhecido");
        }
        // Se chegou aqui, deu tudo certo
        return data;
      })
      .then((data) => {
        console.log(data);

        // Manda toast de sucesso agora
        localStorage.setItem(
          "toastMessage",
          JSON.stringify({
            message:
              tipoCadastro === "POST"
                ? "Produto cadastrado com sucesso!"
                : "Produto atualizado com sucesso!",
            type: "success",
          })
        );

        // Redireciona só se deu certo
        window.location.href = `${urlBase}loja/${user.data.loja.id}/produtos/gerenciar`;
      })
      .catch((error) => {
        console.error(error);

        // Manda toast de erro
        localStorage.setItem(
          "toastMessage",
          JSON.stringify({
            message: error.message || "Erro ao enviar produto.",
            type: "fail",
          })
        );

        // Também redireciona em caso de erro (se quiser)
        window.location.href = `${urlBase}loja/${user.data.loja.id}/produtos/gerenciar`;
      });
  });
let produtos;
let qntd = 10;
async function getProducts(page = 1, per_page = qntd) {
  const campoProdutos = document.querySelector(".tabela-produtos");
  const spinner = new LoadingSpinner(campoProdutos);
  spinner.show();

  await fetch(
    `${urlBase}loja/${user.data.loja.id}/produtos?page=${page}&per_page=${per_page}`,
    {
      method: "GET",
      credentials: "include",
    }
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      produtos = data;
      spinner.hide();
      document.querySelector(
        ".pages"
      ).textContent = `Página ${data.current_page} de ${data.pages}`;
      let html = data.products
        .map(({ foto_produto, nome_produto, preco_atual, estoque }) => {
          return `<tr>
          <td class="campo-foto"><img class="produto-img-table" src="${urlBase}produto/imagem/${foto_produto}" alt="${nome_produto}"/></td>
          <td>${nome_produto}</td>
          <td>${preco_atual.toLocaleString("pt-br", {
            style: "currency",
            currency: "BRL",
          })}</td>
          <td>${estoque}</td>
          <td class="edit">${editIcon}</td>
          <td class="delete">${deleteIcon}</td>
        </tr>`;
        })
        .join("");
      campoProdutos.innerHTML = tableHeader + html;
      document.querySelectorAll(".delete").forEach((item, i) => {
        item.addEventListener("click", () => {
          deleteProduct(produtos.products[i].id);
        });
      });
      document.querySelectorAll(".edit").forEach((item, i) => {
        item.addEventListener("click", () => {
          editarProduto(produtos.products[i]);
        });
      });
    })
    .catch((error) => {
      Toast.sentToast(error, "fail");
    });
}
getProducts();
document.querySelectorAll(".produto-navegation button").forEach((btn, i) => {
  btn.addEventListener("click", () => {
    const options = {
      0: produtos.current_page - 1,
      1: 1,
      2: produtos.pages,
      3: produtos.current_page + 1,
    };
    if (produtos.current_page == 1 && i == 0) {
    } else if (produtos.current_page == produtos.pages && (i == 2 || i == 3)) {
      return;
    } else {
      getProducts(options[i], qntd);
    }
  });
});
function deleteProduct(id) {
  Toast.confirm("Deseja realmente excluir esse produto?", async () => {
    await fetch(`${urlBase}produto/delete/${user.data.loja.id}/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        getProducts();
      });
  });
}

function editarProduto(produto) {
  document.querySelector("#nome_produto").value = produto.nome_produto;
  document.querySelector("#categoria").value = produto.categoria;
  document.querySelector("#descricao_produto").value =
    produto.descricao_produto;
  document.querySelector("#estoque").value = produto.estoque;
  document.querySelector("#preco_atual").value = produto.preco_atual;
  document.querySelector("#preco_original").value = produto.preco_original;
  conteudos.forEach((conteudo) => {
    conteudo.classList.toggle("hide");
  });
  tipoCadastro = "PUT";
  produtoId = produto.id;
}
