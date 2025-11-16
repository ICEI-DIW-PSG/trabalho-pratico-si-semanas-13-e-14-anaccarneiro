const main = document.getElementById('main');
const urlAPI = "http://localhost:3000/cidades";

/* -------------------------------------------------------
   LISTAR TODAS AS CIDADES
--------------------------------------------------------- */
function construirHTML() {
    fetch(urlAPI)
        .then(res => res.json())
        .then(cidades => {
            main.innerHTML = "";

            cidades.forEach(cidade => {
                main.innerHTML += `
                <section class="mb-5 p-4 rounded bg-light border">
                    <a href="detalhes.html?id=${cidade.id}" class="text-decoration-none">
                        <h2 class="mb-3 text-dark">${cidade.nome}</h2>
                    </a>
                    <img src="${cidade.foto}" alt="${cidade.nome}" class="d-block mx-auto mb-3 img-fluid w-75">
                    <p class="text-dark">${cidade.resumo}</p>

                    <p class="text-dark"><strong>Estado:</strong> ${cidade.estado}</p>

                    <button onclick="deletarCidade(${cidade.id})" class="btn btn-danger btn-sm mt-2">Excluir</button>
                    <a href="cadastro_cidade.html?id=${cidade.id}" class="btn btn-warning btn-sm mt-2">Editar</a>
                </section>`;
            });
        })
        .catch(err => console.error("Erro ao carregar cidades:", err));
}

/* -------------------------------------------------------
   PEGAR ID DA URL
--------------------------------------------------------- */
function pegarID() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

/* -------------------------------------------------------
   EXIBIR DETALHES
--------------------------------------------------------- */
function construirDetalhes() {
    const id = pegarID();

    fetch(`${urlAPI}/${id}`)
        .then(res => res.json())
        .then(cidade => {
            main.innerHTML = `
            <section class="mb-5 p-4 rounded bg-light border">
                <h2 class="mb-3 text-dark">${cidade.nome}</h2>
                <img src="${cidade.foto}" alt="${cidade.nome}" class="d-block mx-auto mb-3 img-fluid w-75">
                <p class="text-dark">${cidade.sobre}</p>

                <p class="text-dark"><strong>Estado:</strong> ${cidade.estado}</p>
            </section>`;
        })
        .catch(err => console.error("Erro ao carregar detalhes:", err));
}

/* -------------------------------------------------------
   SALVAR OU ATUALIZAR CIDADE
--------------------------------------------------------- */
function salvarCidade(event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const estado = document.getElementById("estado").value;
    const foto = document.getElementById("foto").value;
    const resumo = document.getElementById("resumo").value;
    const sobre = document.getElementById("sobre").value;
    const id = pegarID();

    const dados = { nome, estado, foto, resumo, sobre };

    if (id) {
        fetch(`${urlAPI}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        })
        .then(res => res.json())
        .then(() => alert("Cidade atualizada com sucesso!"))
        .catch(err => console.error("Erro ao atualizar:", err));
    } else {
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

/* -------------------------------------------------------
   DELETAR CIDADE
--------------------------------------------------------- */
function deletarCidade(id) {
    if(confirm("Deseja realmente excluir esta cidade?")) {
        fetch(`${urlAPI}/${id}`, { method: "DELETE" })
            .then(() => {
                alert("Cidade excluída com sucesso!");
                construirHTML();
            })
            .catch(err => console.error("Erro ao excluir:", err));
    }
}

/* -------------------------------------------------------
   GRÁFICO COM CHART.JS
--------------------------------------------------------- */
function montarGrafico() {
    fetch(urlAPI)
        .then(res => res.json())
        .then(cidades => {

            const contagem = {};

            cidades.forEach(c => {
                const uf = c.estado.toUpperCase();
                if (!contagem[uf]) contagem[uf] = 0;
                contagem[uf]++;
            });

            const estados = Object.keys(contagem);
            const quantidades = Object.values(contagem);

            const ctx = document.getElementById('graficoEstados');

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: estados,
                    datasets: [{
                        label: 'Cidades por Estado',
                        data: quantidades,
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: { y: { beginAtZero: true } }
                }
            });

        })
        .catch(err => console.error("Erro ao montar gráfico:", err));
}
