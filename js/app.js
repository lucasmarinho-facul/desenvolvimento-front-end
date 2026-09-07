import { carregarTarefas } from "./api.js";

import {
    instalarEventosDoQuadro
} from "./renderizacao.js";

import {
    renderizarEstado
} from "./estados.js";


async function iniciar() {

    const quadro = document.querySelector(".quadro-tarefas");

    renderizarEstado("carregando");


    try {

        const tarefas = await carregarTarefas();

        instalarEventosDoQuadro(quadro, tarefas);


        if (tarefas.length === 0) {

            renderizarEstado("vazio");

            return;
        }


        renderizarEstado("sucesso", tarefas);


    } catch (erro) {

        renderizarEstado("erro", erro);

    }

}


iniciar();