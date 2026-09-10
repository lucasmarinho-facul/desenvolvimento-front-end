import { carregarTarefas } from "./api.js";

import {
    instalarEventosDoQuadro
} from "./renderizacao.js";

import {
    estado,
    renderizarEstado
} from "./estados.js";


async function iniciar() {

    const quadro = document.querySelector(".quadro-tarefas");

    const busca = document.querySelector("#busca");

    const filtrosStatus =
        document.querySelectorAll('input[name="status"]');

    const filtrosPrioridade =
        document.querySelectorAll('input[name="prioridade"]');

    const ordenacao =
        document.querySelector("#ordenacao");

    const limparFiltros =
        document.querySelector("#limpar-filtros");


    // Evento da busca
    busca.addEventListener("input", () => {

        estado.busca = busca.value;

        renderizarEstado();

    });


    // Eventos do filtro de status
    filtrosStatus.forEach((radio) => {

        radio.addEventListener("change", () => {

            estado.status = radio.value;

            renderizarEstado();

        });

    });


    // Eventos do filtro de prioridade
    filtrosPrioridade.forEach((radio) => {

        radio.addEventListener("change", () => {

            estado.prioridade = radio.value;

            renderizarEstado();

        });

    });


    // Evento da ordenação
    ordenacao.addEventListener("change", () => {

        estado.ordenacao = ordenacao.value;

        renderizarEstado();

    });


    // Evento do botão limpar
    limparFiltros.addEventListener("click", () => {

        estado.busca = "";
        estado.status = "todos";
        estado.prioridade = "todas";
        estado.ordenacao = "padrao";


        busca.value = "";

        document.querySelector(
            'input[name="status"][value="todos"]'
        ).checked = true;


        document.querySelector(
            'input[name="prioridade"][value="todas"]'
        ).checked = true;


        ordenacao.value = "padrao";


        renderizarEstado();

    });


    // Estado inicial
    estado.carregamento = "carregando";

    estado.erro = null;

    renderizarEstado();


    try {

        const tarefas = await carregarTarefas();

        estado.tarefas = tarefas;

        estado.carregamento = "sucesso";

        estado.erro = null;


        instalarEventosDoQuadro(
            quadro,
            estado.tarefas
        );


        renderizarEstado();

    } catch (erro) {

        estado.carregamento = "erro";

        estado.erro = erro;

        renderizarEstado();

    }

}


iniciar();