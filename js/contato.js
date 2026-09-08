// Pega o formulário pelo ID
const form = document.getElementById("formContato");
//const API_URL = "http://localhost:3000"
const API_URL = "https://cafe-central-mc3h.onrender.com"

if(form){
    form.addEventListener("submit", async function(event){
        event.preventDefault(); // previne que a página recarregue

        // Captura cada campo do form
        const nome = document.getElementById("nome").value.trim();
        const email = document.getElementById("email").value.trim();
        const mensagem = document.getElementById("mensagem").value.trim();

        const mensagems = document.getElementById("mensagems");
        mensagems.textContent=""; // Limpa mensagem anterior   

        // Campo vazio -> interromper
        if(!nome || !email || !mensagem ){
            mensagems.textContent = "Preencha os campos";
            return
        }
        if (mensagem.length < 10){
            mensagems.textContent = "A mensagem deve ter no mínimo 10 caracteres";
            return
        }
        if (nome.length < 3){
            mensagems.textContent = "O nome deve ter no mínimo 3 caracteres";
            return
        }
        if (!email.includes("@")){
            mensagems.textContent = "Digite um email válido";
            return
        }
        if (!email.includes(".")){
            mensagems.textContent = "Digite um email válido";
            return
        }
    });
}

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
        const resposta = await fetch(`${API_URL}/contato`, {
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
        console.log(erro);
        alert("Erro ao enviar mensagem!");
    }
});