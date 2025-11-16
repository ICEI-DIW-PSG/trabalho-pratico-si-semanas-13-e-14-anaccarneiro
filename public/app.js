const main = document.getElementById('main');
const urlAPI = "http://localhost:3000/cidades";

// -------- FUNÇÃO PARA LISTAR TODAS AS CIDADES --------
function construirHTML() {
    fetch(urlAPI)
        .then(res => res.json())
        .then(cidades => {
            main.innerHTML = ""; // limpa conteúdo antes de renderizar

            cidades.forEach(cidade => {
                main.innerHTML += `
                <section class="mb-5 p-4 rounded bg-light border">
                    <a href="detalhes.html?id=${cidade.id}" class="text-decoration-none">
                        <h2 class="mb-3 text-dark" id="nome">${cidade.nome}</h2>
                    </a>
                    <img src="${cidade.foto}" alt="${cidade.nome}" class="d-block mx-auto mb-3 img-fluid w-75" id="foto">
                    <p class="text-dark" id="resumo">${cidade.resumo}</p>
                    <button onclick="deletarCidade(${cidade.id})" class="btn btn-danger btn-sm mt-2">Excluir</button>
                    <a href="cadastro_cidade.html?id=${cidade.id}" class="btn btn-warning btn-sm mt-2">Editar</a>
                </section>`;
            });
        })
        .catch(err => console.error("Erro ao carregar cidades:", err));
}

// -------- FUNÇÃO PARA REDIRECIONAR DETALHES --------
function pegarID() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

// -------- FUNÇÃO PARA EXIBIR DETALHES --------
function construirDetalhes() {
    const id = pegarID();

    fetch(`${urlAPI}/${id}`)
        .then(res => res.json())
        .then(cidade => {
            main.innerHTML = `
            <section class="mb-5 p-4 rounded bg-light border">
                <h2 class="mb-3 text-dark" id="nome">${cidade.nome}</h2>
                <img src="${cidade.foto}" alt="${cidade.nome}" class="d-block mx-auto mb-3 img-fluid w-75" id="foto">
                <p class="text-dark" id="resumo">${cidade.sobre}</p>
            </section>`;
        })
        .catch(err => console.error("Erro ao carregar detalhes:", err));
}

// -------- FUNÇÃO PARA CADASTRAR OU ATUALIZAR CIDADE --------
function salvarCidade(event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const foto = document.getElementById("foto").value;
    const resumo = document.getElementById("resumo").value;
    const sobre = document.getElementById("sobre").value;
    const id = pegarID();

    const dados = { nome, foto, resumo, sobre };

    if (id) {
        // Atualizar cidade
        fetch(`${urlAPI}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        })
        .then(res => res.json())
        .then(() => alert("Cidade atualizada com sucesso!"))
        .catch(err => console.error("Erro ao atualizar:", err));
    } else {
        // Criar nova cidade
        fetch(urlAPI, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        })
        .then(res => res.json())
        .then(() => alert("Cidade cadastrada com sucesso!"))
        .catch(err => console.error("Erro ao cadastrar:", err));
    }
}

// -------- FUNÇÃO PARA DELETAR CIDADE --------
function deletarCidade(id) {
    if(confirm("Deseja realmente excluir esta cidade?")) {
        fetch(`${urlAPI}/${id}`, { method: "DELETE" })
            .then(() => {
                alert("Cidade excluída com sucesso!");
                construirHTML(); // Atualiza lista
            })
            .catch(err => console.error("Erro ao excluir:", err));
    }
}
