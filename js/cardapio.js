const ListaCardapio = document.querySelector("#ListaCardapio"); /*onde os cards do cardapio vão aparecer*/
const BuscaCardapio = document.querySelector("#BuscaCardapio")  /*campo de busca*/

let cardapio = []   /*criando lista vazia para guardar o cardapio*/

 async function carregarCardapio{
    const resposta = await fetch("../data/cardapio.json");
    cardapio = await resposta.json(); /* transforma o json em dados que o js entende */
    renderizarCardapio(cardapio);
};

function renderizarCardapio(lista){
    ListaCardapio.innerHTML = ""; /* InnerHTML coloca um codigo html dentro de algo*/
    lista.forEach(cardapio => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
        <img scr="${cardapio.img}" width"100" height"140">
        <h3> ${cardapio.titulo} </h3>
        <p> ${cardapio.desc}</p>
        <p> <strong>preco: </strong> ${cardapio.preco} </p>
        `;

        ListaCardapio.appendChild(card);
    });

};

carregarCardapio();

