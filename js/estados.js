import { renderizarTarefas } from "./renderizacao.js";


export const estado = {
    tarefas: [],
    busca: "",
    status: "todos",
    prioridade: "todas",
    ordenacao: "padrao",
    carregamento: "carregando",
    erro: null
};


export function derivarTarefasVisiveis(estado) {

    let tarefasVisiveis = [...estado.tarefas];



    if (estado.busca.trim() !== "") {

        const buscaNormalizada = estado.busca
            .trim()
            .toLowerCase();

        tarefasVisiveis = tarefasVisiveis.filter((tarefa) =>
            tarefa.titulo.toLowerCase().includes(buscaNormalizada)
        );
    }



    if (estado.status !== "todos") {

        tarefasVisiveis = tarefasVisiveis.filter(
            (tarefa) => tarefa.status === estado.status
        );
    }



    if (estado.prioridade !== "todas") {

        tarefasVisiveis = tarefasVisiveis.filter(
            (tarefa) => tarefa.prioridade === estado.prioridade
        );
    }



    if (estado.ordenacao === "prazo") {

        tarefasVisiveis.sort((a, b) => {

            const dataA = converterPrazoParaData(a.prazo);
            const dataB = converterPrazoParaData(b.prazo);

            return dataA - dataB;
        });
    }


    return tarefasVisiveis;
}


function converterPrazoParaData(prazo) {

    const [dia, mes, ano] = prazo.split("/");

    return new Date(
        Number(ano),
        Number(mes) - 1,
        Number(dia)
    );
}


export function renderizarEstado() {

    const status = document.querySelector("#status");
    const quadro = document.querySelector(".quadro-tarefas");


    if (estado.carregamento === "carregando") {

        quadro.hidden = true;

        status.textContent = "Carregando tarefas...";

        return;
    }


    if (estado.carregamento === "erro") {

        quadro.hidden = true;

        if (estado.erro.name === "TypeError") {

            status.textContent =
                "Não foi possível carregar as tarefas. Verifique sua conexão.";

            return;
        }


        if (estado.erro.name === "SyntaxError") {

            status.textContent =
                "Os dados recebidos estão em formato inválido.";

            return;
        }


        status.textContent =
            `Não foi possível carregar as tarefas. ${estado.erro.message}`;

        return;
    }



    quadro.hidden = false;


    const tarefasVisiveis = derivarTarefasVisiveis(estado);



    if (estado.tarefas.length === 0) {

        renderizarTarefas([], quadro);

        status.textContent =
            "Não há tarefas cadastradas.";

        return;
    }



    if (tarefasVisiveis.length === 0) {

        renderizarTarefas([], quadro);

        status.textContent =
            "Nenhuma tarefa encontrada para os critérios selecionados.";

        return;
    }



    renderizarTarefas(tarefasVisiveis, quadro);


    status.textContent =
        `${tarefasVisiveis.length} de ${estado.tarefas.length} tarefas.`;
}