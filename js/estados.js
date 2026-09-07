import { renderizarTarefas } from "./renderizacao.js";


export function renderizarEstado(estado, dados) {

    const status = document.querySelector("#status");

    const quadro = document.querySelector(".quadro-tarefas");


    if (estado === "carregando") {

        quadro.hidden = true;

        status.textContent = "Carregando tarefas...";

        return;
    }


    if (estado === "sucesso") {

        quadro.hidden = false;

        renderizarTarefas(dados, quadro);

        status.textContent = `${dados.length} tarefas carregadas.`;

        return;
    }


    if (estado === "vazio") {

        quadro.hidden = false;

        renderizarTarefas([], quadro);

        status.textContent = "Não há tarefas cadastradas.";

        return;
    }


    if (estado === "erro") {

        quadro.hidden = true;


        if (dados.name === "TypeError") {

            status.textContent =
                "Não foi possível carregar as tarefas. Verifique sua conexão.";

            return;
        }


        if (dados.name === "SyntaxError") {

            status.textContent =
                "Os dados recebidos estão em formato inválido.";

            return;
        }


        status.textContent =
            `Não foi possível carregar as tarefas. ${dados.message}`;

    }

}