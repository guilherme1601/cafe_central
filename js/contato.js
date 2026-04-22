// Pega o formulário pelo ID
const form = document.getElementById("formContato");

// Escuta o evento de envio do formulário
form.addEventListener("submit", async function(event){
    event.preventDefault(); // impede a página de recarregar

    // Pega os valores digitados nos inputs
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const mensagem = document.getElementById("mensagem").value;

    // Cria um objeto com os dados
    const novaMensagem = { nome, email, mensagem };

    try {
        // Envia os dados para um servidor (ou arquivo fake/API)
        const resposta = await fetch("https://jsonplaceholder.typicode.com/posts", {
            method: "POST", // tipo de envio
            headers: {
                "Content-Type": "application/json" // diz que é JSON
            },
            body: JSON.stringify(novaMensagem) // transforma em JSON
        });

        // Converte a resposta
        const dados = await resposta.json();

        console.log("Enviado:", dados);

        alert("Mensagem enviada com sucesso!");
        form.reset(); // limpa o formulário

    } catch (erro) {
        // Caso dê erro
        console.error("Erro:", erro);
        alert("Erro ao enviar mensagem!");
    }
});