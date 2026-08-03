const conteudoCardapio = document.querySelector("#conteudoCardapio");
const mensagemCarregamento = document.querySelector("#mensagemCarregamento")
const parametros = new URLSearchParams(window.location.search);
const idCardapio = Number(parametros.get("id"));

async function carregarDetalhesCardapio(){
    try{
        const resposta = await fetch("../data/cardapio.json");
        console.log(resposta);

        if(!resposta){
            console.error("Não foi possivel carregar o cardapio");
            mensagemCarregamento.textContent= "Não foi possivel carregar o cardapio";
        };

        const cardapio = await resposta.json();

        const ItemDoCardapioEncontrado = cardapio.find(
            cardapio => cardapio.id === idCardapio
        );

        if(!ItemDoCardapioEncontrado){
            mostrarItemDoCardapioNaoEncontrado();
            return;
        };

        mostrarItemCardapio(ItemDoCardapioEncontrado);
    
    } catch(erro){
        console.error("Erro ao carregar cardapio",erro);
        mensagemCarregamento.textContent = "Não foi possivel carregar as informações do cardapio";
    }
}

function mostrarItemCardapio(cardapio){
    mensagemCarregamento.textContent =  "";
    conteudoCardapio.innerHTML = `
        <h3> ${cardapio.titulo} </h3>
        <img src="${cardapio.img}" width="150" height="150">
        <p> ${cardapio.desc} </p>
        <div class="infobox"> <p class="infoLabel"> <strong></p> <p class="infoValor">Preço: </strong> ${cardapio.preco}</p> </div>
    `
}

function mostrarItemDoCardapioNaoEncontrado(){
    mensagemCarregamento.textContent = "";
    conteudoCardapio.innerHTML = `
        <div class="detalhe-carapio">
            <h1> Refeição não encontrada!</h1>
            <p> O item do cardapio não esta disponivel no momento</p>
        </div>
    `
}

carregarDetalhesCardapio()
