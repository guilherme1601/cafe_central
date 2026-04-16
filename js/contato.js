const form = document.getElementById("formContato");
form.addEventListener("submit", async function(event){
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const mensagem = document.getElementById("mensagem").value;
    const novaMensagem = {nome, email, mensagem};


    try{
        const resposta = await fetch
    }
})