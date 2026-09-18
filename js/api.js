export async function carregarTarefas() {

const resposta =
    await fetch("./dados.json");


if (!resposta.ok) {

    throw new Error(
        `Erro HTTP: ${resposta.status}`
    );

}


const dados =
    await resposta.json();


if (
    !dados ||
    !Array.isArray(dados.tarefas)
) {

    throw new Error(
        "O arquivo dados.json não possui uma lista de tarefas válida."
    );

}


return dados.tarefas;

}