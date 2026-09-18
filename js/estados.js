import {
renderizarTarefas,
renderizarEsteira,
renderizarTarefaNaMesa
} from "./renderizacao.js";

export const estado = {

tarefas: [],

busca: "",

status: "todos",

prioridade: "todas",

ordenacao: "padrao",

tarefaSelecionadaId: null,

carregamento: "carregando",

erro: null

};

/* =========================================================
CONVERTER PRAZO
========================================================= */

function converterPrazoParaData(prazo) {

const partes =
    prazo.split("/");


const dia =
    Number(partes[0]);


const mes =
    Number(partes[1]);


const ano =
    Number(partes[2]);


return new Date(
    ano,
    mes - 1,
    dia
);

}

/* =========================================================
OBTER TAREFAS VISÍVEIS
========================================================= */

export function derivarTarefasVisiveis() {

let tarefas =
    [...estado.tarefas];


/* =====================================================
   BUSCA
   ===================================================== */

if (
    estado.busca.trim() !== ""
) {

    const busca =
        estado.busca
            .trim()
            .toLowerCase();


    tarefas =
        tarefas.filter(
            (tarefa) =>
                tarefa.titulo
                    .toLowerCase()
                    .includes(busca)
        );

}


/* =====================================================
   STATUS
   ===================================================== */

if (
    estado.status !== "todos"
) {

    tarefas =
        tarefas.filter(
            (tarefa) =>
                tarefa.status ===
                estado.status
        );

}


/* =====================================================
   PRIORIDADE
   ===================================================== */

if (
    estado.prioridade !== "todas"
) {

    tarefas =
        tarefas.filter(
            (tarefa) =>
                tarefa.prioridade ===
                estado.prioridade
        );

}


/* =====================================================
   ORDENAÇÃO
   ===================================================== */

if (
    estado.ordenacao === "prazo"
) {

    tarefas.sort(
        (a, b) => {

            const dataA =
                converterPrazoParaData(
                    a.prazo
                );


            const dataB =
                converterPrazoParaData(
                    b.prazo
                );


            return dataA - dataB;

        }
    );

}


return tarefas;

}

/* =========================================================
RENDERIZAR ESTADO
========================================================= */

export function renderizarEstado() {

    const status =
        document.querySelector("#status");

    const quadro =
        document.querySelector(".quadro-tarefas");


    if (estado.carregamento === "carregando") {

        quadro.hidden = true;

        status.textContent =
            "Carregando tarefas...";

        renderizarEsteira([]);

        renderizarTarefaNaMesa(null);

        return;
    }


    if (estado.carregamento === "erro") {

        quadro.hidden = true;

        status.textContent =
            `Não foi possível carregar as tarefas. ${
                estado.erro?.message || ""
            }`;

        renderizarEsteira([]);

        renderizarTarefaNaMesa(null);

        return;
    }


    quadro.hidden = false;


    const tarefasVisiveis =
        derivarTarefasVisiveis();


    if (estado.tarefas.length === 0) {

        renderizarTarefas([], quadro);

        renderizarEsteira([]);

        renderizarTarefaNaMesa(null);

        status.textContent =
            "Não há tarefas cadastradas.";

        return;
    }


    if (tarefasVisiveis.length === 0) {

        renderizarTarefas([], quadro);

        renderizarEsteira([]);

        renderizarTarefaNaMesa(null);

        status.textContent =
            `0 de ${estado.tarefas.length} tarefas.`;

        return;
    }


    renderizarTarefas(
        tarefasVisiveis,
        quadro
    );


    renderizarEsteira(
        tarefasVisiveis
    );


    const tarefaSelecionada =
        estado.tarefas.find(
            (tarefa) =>
                tarefa.id ===
                estado.tarefaSelecionadaId
        );


    if (
        !tarefaSelecionada ||
        !tarefasVisiveis.some(
            (tarefa) =>
                tarefa.id ===
                estado.tarefaSelecionadaId
        )
    ) {

        estado.tarefaSelecionadaId = null;

        renderizarTarefaNaMesa(null);

    } else {

        renderizarTarefaNaMesa(
            tarefaSelecionada
        );

    }


    status.textContent =
        `${tarefasVisiveis.length} de ${estado.tarefas.length} tarefas.`;
}