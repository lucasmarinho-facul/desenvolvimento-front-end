
import {
    carregarTarefas
} from "./api.js";

import {
    estado,
    renderizarEstado
} from "./estados.js";

import {
    instalarEventosDoQuadro,
    instalarEventosDaMesa,
    instalarEventosDaEsteira
} from "./renderizacao.js";


/* =========================================================
   INICIAR A APLICAÇÃO
========================================================= */

async function iniciar() {


    /* =====================================================
       ELEMENTOS
    ===================================================== */

    const quadro =
        document.querySelector(
            ".quadro-tarefas"
        );


    const busca =
        document.querySelector(
            "#busca"
        );


    const filtrosStatus =
        document.querySelectorAll(
            'input[name="status"]'
        );


    const filtrosPrioridade =
        document.querySelectorAll(
            'input[name="prioridade"]'
        );


    const ordenacao =
        document.querySelector(
            "#ordenacao"
        );


    const limparFiltros =
        document.querySelector(
            "#limpar-filtros"
        );


    const controleEsteira =
        document.querySelector(
            "#controle-esteira"
        );


    const esteira =
        document.querySelector(
            "#esteira-tarefas"
        );


    /* =====================================================
       BUSCA
    ===================================================== */

    busca.addEventListener(
        "input",
        () => {

            estado.busca =
                busca.value;


            renderizarEstado();

        }
    );


    /* =====================================================
       FILTRO DE STATUS
    ===================================================== */

    filtrosStatus.forEach(
        (radio) => {

            radio.addEventListener(
                "change",
                () => {

                    estado.status =
                        radio.value;


                    renderizarEstado();

                }
            );

        }
    );


    /* =====================================================
       FILTRO DE PRIORIDADE
    ===================================================== */

    filtrosPrioridade.forEach(
        (radio) => {

            radio.addEventListener(
                "change",
                () => {

                    estado.prioridade =
                        radio.value;


                    renderizarEstado();

                }
            );

        }
    );


    /* =====================================================
       ORDENAÇÃO
    ===================================================== */

    ordenacao.addEventListener(
        "change",
        () => {

            estado.ordenacao =
                ordenacao.value;


            renderizarEstado();

        }
    );


    /* =====================================================
       LIMPAR FILTROS
    ===================================================== */

    limparFiltros.addEventListener(
        "click",
        () => {

            estado.busca =
                "";


            estado.status =
                "todos";


            estado.prioridade =
                "todas";


            estado.ordenacao =
                "padrao";


            busca.value =
                "";


            const statusTodos =
                document.querySelector(
                    'input[name="status"][value="todos"]'
                );


            const prioridadeTodas =
                document.querySelector(
                    'input[name="prioridade"][value="todas"]'
                );


            statusTodos.checked =
                true;


            prioridadeTodas.checked =
                true;


            ordenacao.value =
                "padrao";


            renderizarEstado();

        }
    );


    /* =====================================================
       PAUSAR / CONTINUAR ESTEIRA
    ===================================================== */

    let esteiraPausada =
        false;


    controleEsteira.addEventListener(
        "click",
        () => {

            esteiraPausada =
                !esteiraPausada;


            if (
                esteiraPausada
            ) {

                esteira.classList.add(
                    "pausada"
                );


                controleEsteira.textContent =
                    "▶ Continuar esteira";


                controleEsteira.setAttribute(
                    "aria-pressed",
                    "true"
                );


                controleEsteira.setAttribute(
                    "aria-label",
                    "Continuar movimento da esteira"
                );

            } else {

                esteira.classList.remove(
                    "pausada"
                );


                controleEsteira.textContent =
                    "⏸ Pausar esteira";


                controleEsteira.setAttribute(
                    "aria-pressed",
                    "false"
                );


                controleEsteira.setAttribute(
                    "aria-label",
                    "Pausar movimento da esteira"
                );

            }

        }
    );


    /* =====================================================
       SELECIONAR TAREFA
    ===================================================== */

    function selecionarTarefa(tarefa) {

        estado.tarefaSelecionadaId =
            tarefa.id;


        renderizarEstado();

    }


    /* =====================================================
       SELECIONAR TAREFA PELO ID
    ===================================================== */

    function selecionarTarefaPorId(id) {

        const tarefa =
            estado.tarefas.find(
                (item) =>
                    item.id === id
            );


        if (!tarefa) {

            return;

        }


        selecionarTarefa(
            tarefa
        );

    }


    /* =====================================================
       FECHAR TAREFA DA MESA
    ===================================================== */

    function fecharMesa() {

        estado.tarefaSelecionadaId =
            null;


        renderizarEstado();

    }


    /* =====================================================
       EVENTOS
    ===================================================== */

    /*
     * IMPORTANTE:
     *
     * Passamos uma função que sempre devolve
     * estado.tarefas atualizado.
     *
     * Assim o botão "Colocar na mesa" funciona
     * mesmo quando as tarefas são carregadas
     * depois da instalação dos eventos.
     */

    instalarEventosDoQuadro(
        quadro,
        () => estado.tarefas,
        selecionarTarefa
    );


    instalarEventosDaEsteira(
        selecionarTarefaPorId
    );


    instalarEventosDaMesa(
        fecharMesa
    );


    /* =====================================================
       ESTADO INICIAL
    ===================================================== */

    estado.carregamento =
        "carregando";


    estado.erro =
        null;


    renderizarEstado();


    /* =====================================================
       CARREGAR DADOS
    ===================================================== */

    try {

        const tarefas =
            await carregarTarefas();


        estado.tarefas =
            tarefas;


        estado.carregamento =
            "sucesso";


        estado.erro =
            null;


        renderizarEstado();

    } catch (erro) {

        estado.carregamento =
            "erro";


        estado.erro =
            erro;


        renderizarEstado();

    }

}


/* =========================================================
   EXECUTAR
========================================================= */

iniciar();

