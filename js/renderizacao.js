export function criarCartao(tarefa) {

    const li = document.createElement("li");

    li.dataset.tarefaId = tarefa.id;

    const article = document.createElement("article");

    const titulo = document.createElement("h4");

    titulo.textContent = tarefa.titulo;

    const projeto = document.createElement("p");

    const projetoLabel = document.createElement("strong");

    projetoLabel.textContent = "Projeto: ";

    projeto.appendChild(projetoLabel);

    projeto.append(tarefa.projeto);

    const responsavel = document.createElement("p");

    const responsavelLabel = document.createElement("strong");

    responsavelLabel.textContent = "Responsável: ";

    responsavel.appendChild(responsavelLabel);

    responsavel.append(tarefa.responsavel);

    const prioridade = document.createElement("p");

    prioridade.classList.add("prioridade");

    const prioridadeLabel = document.createElement("strong");

    prioridadeLabel.textContent = "Prioridade: ";

    prioridade.appendChild(prioridadeLabel);

    prioridade.append(tarefa.prioridade);

    const prazo = document.createElement("p");

    prazo.classList.add("prazo");

    const prazoLabel = document.createElement("strong");

    prazoLabel.textContent = "Prazo: ";

    prazo.appendChild(prazoLabel);

    prazo.append(tarefa.prazo);

    const botao = document.createElement("button");

    botao.type = "button";

    botao.dataset.acao = "ver-detalhes";

    const span = document.createElement("span");

    span.textContent = "Ver detalhes";

    botao.appendChild(span);

    article.appendChild(titulo);
    article.appendChild(projeto);
    article.appendChild(responsavel);
    article.appendChild(prioridade);
    article.appendChild(prazo);
    article.appendChild(botao);

    li.appendChild(article);

    return li;
}


export function renderizarTarefas(tarefas, quadro) {

    const colunas = quadro.querySelectorAll("[data-lista-status]");

    colunas.forEach((coluna) => {

        const status = coluna.dataset.listaStatus;

        const lista = coluna.querySelector("ul");

        const tarefasDaColuna = tarefas.filter(
            (tarefa) => tarefa.status === status
        );

        const cartoes = tarefasDaColuna.map(criarCartao);

        if (cartoes.length === 0) {

            const mensagem = document.createElement("li");

            mensagem.textContent = "Nenhuma tarefa nesta coluna.";

            lista.replaceChildren(mensagem);

        } else {

            lista.replaceChildren(...cartoes);

        }

    });
}


export function instalarEventosDoQuadro(quadro, tarefas) {

    quadro.addEventListener("click", (evento) => {

        if (!(evento.target instanceof Element)) {
            return;
        }

        const botao = evento.target.closest(
            'button[data-acao="ver-detalhes"]'
        );

        if (!botao) {
            return;
        }

        if (!quadro.contains(botao)) {
            return;
        }

        const cartao = botao.closest("li");

        if (!cartao) {
            return;
        }

        const id = Number(cartao.dataset.tarefaId);

        const tarefa = tarefas.find(
            (item) => item.id === id
        );

        if (!tarefa) {
            return;
        }

        console.log(tarefa);

    });

}