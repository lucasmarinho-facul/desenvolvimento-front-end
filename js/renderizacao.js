
/* =========================================================
   COR DO ESTADO
========================================================= */

function obterCorDoEstado(status) {

    switch (status) {

        case "a-fazer":
            return "var(--cor-a-fazer)";

        case "em-andamento":
            return "var(--cor-andamento)";

        case "em-revisao":
            return "var(--cor-revisao)";

        case "concluida":
            return "var(--cor-concluido)";

        default:
            return "var(--cor-borda)";
    }
}


/* =========================================================
   CARTÃO DO QUADRO
========================================================= */

export function criarCartao(tarefa) {

    const li =
        document.createElement("li");


    li.dataset.tarefaId =
        tarefa.id;


    const article =
        document.createElement("article");


    article.classList.add(
        "cartao-quadro"
    );


    const titulo =
        document.createElement("h4");


    titulo.textContent =
        tarefa.titulo;


    const projeto =
        document.createElement("p");


    projeto.innerHTML =
        `<strong>Projeto:</strong> ${tarefa.projeto}`;


    const responsavel =
        document.createElement("p");


    responsavel.innerHTML =
        `<strong>Responsável:</strong> ${tarefa.responsavel}`;


    const prioridade =
        document.createElement("p");


    prioridade.classList.add(
        "prioridade"
    );


    prioridade.innerHTML =
        `<strong>Prioridade:</strong> ${tarefa.prioridade}`;


    const prazo =
        document.createElement("p");


    prazo.classList.add(
        "prazo"
    );


    prazo.innerHTML =
        `<strong>Prazo:</strong> ${tarefa.prazo}`;


    /* =====================================================
       BOTÃO COLOCAR NA MESA
    ===================================================== */

    const botao =
        document.createElement("button");


    botao.type =
        "button";


    botao.dataset.acao =
        "ver-detalhes";


    botao.textContent =
        "Colocar na mesa";


    /*
     * Cor do botão baseada no status da tarefa.
     *
     * Isso também ajuda a criar uma identidade
     * visual com a esteira.
     */

    botao.style.setProperty(
        "--cor-estado",
        obterCorDoEstado(
            tarefa.status
        )
    );


    article.append(
        titulo,
        projeto,
        responsavel,
        prioridade,
        prazo,
        botao
    );


    li.appendChild(
        article
    );


    return li;
}


/* =========================================================
   RENDERIZAR TAREFAS DO QUADRO
========================================================= */

export function renderizarTarefas(
    tarefas,
    quadro
) {

    const colunas =
        quadro.querySelectorAll(
            "[data-lista-status]"
        );


    colunas.forEach(
        (coluna) => {

            const status =
                coluna.dataset.listaStatus;


            const lista =
                coluna.querySelector("ul");


            if (!lista) {

                return;

            }


            const tarefasDaColuna =
                tarefas.filter(
                    (tarefa) =>
                        tarefa.status === status
                );


            if (
                tarefasDaColuna.length === 0
            ) {

                const mensagem =
                    document.createElement("li");


                mensagem.classList.add(
                    "coluna-vazia"
                );


                mensagem.textContent =
                    "Nenhuma tarefa nesta coluna.";


                lista.replaceChildren(
                    mensagem
                );


                return;
            }


            const cartoes =
                tarefasDaColuna.map(
                    criarCartao
                );


            lista.replaceChildren(
                ...cartoes
            );

        }
    );
}


/* =========================================================
   CAIXA DA ESTEIRA
========================================================= */

function criarCaixaEsteira(tarefa) {

    const caixa =
        document.createElement("div");


    caixa.classList.add(
        "caixa-tarefa"
    );


    caixa.dataset.tarefaId =
        tarefa.id;


    caixa.textContent =
        tarefa.titulo;


    caixa.style.setProperty(
        "--cor-estado",
        obterCorDoEstado(
            tarefa.status
        )
    );


    caixa.setAttribute(
        "role",
        "button"
    );


    caixa.setAttribute(
        "tabindex",
        "0"
    );


    caixa.setAttribute(
        "aria-label",
        `Abrir tarefa ${tarefa.titulo}`
    );


    return caixa;
}


/* =========================================================
   CRIAR GRUPO DA ESTEIRA
========================================================= */

function criarGrupoEsteira(tarefas) {

    const grupo =
        document.createElement("div");


    grupo.classList.add(
        "grupo-esteira"
    );


    tarefas.forEach(
        (tarefa) => {

            grupo.appendChild(
                criarCaixaEsteira(
                    tarefa
                )
            );

        }
    );


    /*
     * Mantém um número mínimo de elementos
     * para evitar que a esteira fique pequena.
     */

    const quantidadeMinima =
        5;


    const quantidadeVazios =
        Math.max(
            0,
            quantidadeMinima - tarefas.length
        );


    for (
        let i = 0;
        i < quantidadeVazios;
        i++
    ) {

        const vazio =
            document.createElement("div");


        vazio.classList.add(
            "caixa-tarefa",
            "caixa-tarefa-vazia"
        );


        vazio.setAttribute(
            "aria-hidden",
            "true"
        );


        grupo.appendChild(
            vazio
        );

    }


    return grupo;
}


/* =========================================================
   RENDERIZAR ESTEIRA CONTÍNUA
========================================================= */

export function renderizarEsteira(
    tarefas
) {

    const esteira =
        document.querySelector(
            "#esteira-tarefas"
        );


    if (!esteira) {

        return;

    }


    /*
     * Para a animação antes de
     * reconstruir a esteira.
     */

    esteira.classList.remove(
        "esteira-animando"
    );


    esteira.classList.remove(
        "pausada"
    );


    /*
     * Remove o conteúdo anterior.
     */

    esteira.replaceChildren();


    /*
     * Nenhuma tarefa.
     */

    if (
        tarefas.length === 0
    ) {

        const mensagem =
            document.createElement("div");


        mensagem.classList.add(
            "esteira-vazia"
        );


        mensagem.textContent =
            "Nenhuma tarefa para exibir.";


        esteira.appendChild(
            mensagem
        );


        return;
    }


    /*
     * Primeiro grupo.
     */

    const grupo =
        criarGrupoEsteira(
            tarefas
        );


    /*
     * Segundo grupo.
     *
     * Cópia visual para criar
     * o movimento contínuo.
     */

    const grupoDuplicado =
        grupo.cloneNode(true);


    grupoDuplicado.setAttribute(
        "aria-hidden",
        "true"
    );


    esteira.appendChild(
        grupo
    );


    esteira.appendChild(
        grupoDuplicado
    );


    /*
     * Calcula a largura real
     * do primeiro grupo.
     */

    requestAnimationFrame(
        () => {

            const larguraGrupo =
                grupo.offsetWidth;


            esteira.style.setProperty(
                "--distancia-esteira",
                `${larguraGrupo}px`
            );


            /*
             * Reinicia a animação.
             */

            void esteira.offsetWidth;


            esteira.classList.add(
                "esteira-animando"
            );

        }
    );
}


/* =========================================================
   TAREFA NA MESA
========================================================= */

export function renderizarTarefaNaMesa(
    tarefa
) {

    const mesaVazia =
        document.querySelector(
            "#mesa-vazia"
        );


    const tarefaNaMesa =
        document.querySelector(
            "#tarefa-na-mesa"
        );


    if (
        !mesaVazia ||
        !tarefaNaMesa
    ) {

        return;

    }


    /*
     * Nenhuma tarefa selecionada.
     */

    if (!tarefa) {

        mesaVazia.hidden =
            false;


        tarefaNaMesa.hidden =
            true;


        tarefaNaMesa.replaceChildren();


        delete tarefaNaMesa.dataset.tarefaId;


        return;
    }


    /*
     * Existe uma tarefa selecionada.
     */

    mesaVazia.hidden =
        true;


    tarefaNaMesa.hidden =
        false;


    tarefaNaMesa.replaceChildren();


    /*
     * Guarda o ID da tarefa
     * atualmente na mesa.
     */

    tarefaNaMesa.dataset.tarefaId =
        tarefa.id;


    tarefaNaMesa.style.setProperty(
        "--cor-estado",
        obterCorDoEstado(
            tarefa.status
        )
    );


    /* =====================================================
       BOTÃO FECHAR
    ===================================================== */

    const fechar =
        document.createElement("button");


    fechar.type =
        "button";


    fechar.classList.add(
        "fechar-tarefa"
    );


    fechar.dataset.acao =
        "fechar-mesa";


    fechar.textContent =
        "×";


    fechar.setAttribute(
        "aria-label",
        "Fechar tarefa"
    );


    /* =====================================================
       TÍTULO
    ===================================================== */

    const titulo =
        document.createElement("h3");


    titulo.textContent =
        tarefa.titulo;


    /* =====================================================
       PROJETO
    ===================================================== */

    const projeto =
        document.createElement("p");


    projeto.innerHTML =
        `<strong>Projeto:</strong> ${tarefa.projeto}`;


    /* =====================================================
       RESPONSÁVEL
    ===================================================== */

    const responsavel =
        document.createElement("p");


    responsavel.innerHTML =
        `<strong>Responsável:</strong> ${tarefa.responsavel}`;


    /* =====================================================
       STATUS
    ===================================================== */

    const status =
        document.createElement("p");


    status.innerHTML =
        `<strong>Status:</strong> ${tarefa.status}`;


    /* =====================================================
       PRIORIDADE
    ===================================================== */

    const prioridade =
        document.createElement("p");


    prioridade.innerHTML =
        `<strong>Prioridade:</strong> ${tarefa.prioridade}`;


    /* =====================================================
       PRAZO
    ===================================================== */

    const prazo =
        document.createElement("p");


    prazo.innerHTML =
        `<strong>Prazo:</strong> ${tarefa.prazo}`;


    tarefaNaMesa.append(
        fechar,
        titulo,
        projeto,
        responsavel,
        status,
        prioridade,
        prazo
    );
}


/* =========================================================
   EVENTOS DO QUADRO
========================================================= */

export function instalarEventosDoQuadro(
    quadro,
    obterTarefas,
    aoSelecionar
) {

    if (!quadro) {

        return;

    }


    quadro.addEventListener(
        "click",
        (evento) => {

            if (
                !(evento.target instanceof Element)
            ) {

                return;

            }


            /*
             * Procura especificamente pelo botão
             * "Colocar na mesa".
             */

            const botao =
                evento.target.closest(
                    'button[data-acao="ver-detalhes"]'
                );


            if (!botao) {

                return;

            }


            /*
             * Encontra o cartão que contém
             * o botão clicado.
             */

            const cartao =
                botao.closest("li");


            if (!cartao) {

                return;

            }


            /*
             * Recupera o ID da tarefa.
             */

            const id =
                Number(
                    cartao.dataset.tarefaId
                );


            /*
             * Busca as tarefas ATUAIS.
             *
             * Não usamos um array antigo.
             */

            const tarefas =
                obterTarefas();


            const tarefa =
                tarefas.find(
                    (item) =>
                        item.id === id
                );


            if (!tarefa) {

                return;

            }


            /*
             * Coloca a tarefa na mesa.
             */

            aoSelecionar(
                tarefa
            );

        }
    );
}


/* =========================================================
   EVENTOS DA MESA
========================================================= */

export function instalarEventosDaMesa(
    aoFechar
) {

    const mesa =
        document.querySelector(
            "#mesa"
        );


    if (!mesa) {

        return;

    }


    mesa.addEventListener(
        "click",
        (evento) => {

            if (
                !(evento.target instanceof Element)
            ) {

                return;

            }


            const botao =
                evento.target.closest(
                    'button[data-acao="fechar-mesa"]'
                );


            if (!botao) {

                return;

            }


            /*
             * Fecha a tarefa da mesa.
             *
             * A tarefa continua existindo
             * normalmente na esteira e no quadro.
             */

            aoFechar();

        }
    );
}


/* =========================================================
   EVENTOS DA ESTEIRA
========================================================= */

export function instalarEventosDaEsteira(
    aoSelecionar
) {

    const esteira =
        document.querySelector(
            "#esteira-tarefas"
        );


    if (!esteira) {

        return;

    }


    /* =====================================================
       CLIQUE COM MOUSE
    ===================================================== */

    esteira.addEventListener(
        "click",
        (evento) => {

            if (
                !(evento.target instanceof Element)
            ) {

                return;

            }


            const caixa =
                evento.target.closest(
                    ".caixa-tarefa"
                );


            if (!caixa) {

                return;

            }


            /*
             * Ignora caixas vazias.
             */

            if (
                caixa.classList.contains(
                    "caixa-tarefa-vazia"
                )
            ) {

                return;

            }


            const id =
                Number(
                    caixa.dataset.tarefaId
                );


            /*
             * Seleciona a tarefa.
             */

            aoSelecionar(
                id
            );

        }
    );


    /* =====================================================
       TECLADO
    ===================================================== */

    esteira.addEventListener(
        "keydown",
        (evento) => {

            if (
                evento.key !== "Enter" &&
                evento.key !== " "
            ) {

                return;

            }


            if (
                !(evento.target instanceof Element)
            ) {

                return;

            }


            const caixa =
                evento.target.closest(
                    ".caixa-tarefa"
                );


            if (!caixa) {

                return;

            }


            /*
             * Ignora caixas vazias.
             */

            if (
                caixa.classList.contains(
                    "caixa-tarefa-vazia"
                )
            ) {

                return;

            }


            evento.preventDefault();


            const id =
                Number(
                    caixa.dataset.tarefaId
                );


            /*
             * Coloca a tarefa na mesa.
             */

            aoSelecionar(
                id
            );

        }
    );
}

