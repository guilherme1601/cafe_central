
// Pega o formulário pelo ID
const formContato = document.getElementById("formContato");

// URL da API
// const API_URL = "http://localhost:3000";
const API_URL = "https://cafe-central-mc3h.onrender.com";

// Verifica se o formulário existe
if (formContato) {

    // Evento de envio do formulário
    formContato.addEventListener("submit", async function(event) {

        // Impede a página de recarregar
        event.preventDefault();

        // Captura os valores dos campos
        const nome = document.getElementById("nome").value.trim();
        const email = document.getElementById("email").value.trim();
        const mensagem = document.getElementById("mensagem").value.trim();

        // Pega o campo de mensagem de status
        const msgStatus = document.getElementById("msgStatus");

        // Limpa mensagem anterior
        msgStatus.textContent = "";

        // Verifica campos vazios
        if (!nome || !email || !mensagem) {
            msgStatus.textContent = "Preencha os campos";
            return;
        }

        // Verifica tamanho do nome
        if (nome.length < 3) {
            msgStatus.textContent = "O nome deve ter no mínimo 3 caracteres";
            return;
        }

        // Verifica se o nome possui números
        if (/\d/.test(nome)) {
            msgStatus.textContent = "O nome não pode conter números";
            return;
        }

        // Verifica tamanho da mensagem
        if (mensagem.length < 10) {
            msgStatus.textContent = "A mensagem deve ter no mínimo 10 caracteres";
            return;
        }

        // Verifica o email
        if (!email.includes("@") || !email.includes(".")) {
            msgStatus.textContent = "Digite um email válido";
            return;
        }

        // Cria o objeto com os dados
        const novaMensagem = {
            nome: nome,
            email: email,
            mensagem: mensagem
        };

        try {

            // Envia os dados para a API
            const resposta = await fetch(`${API_URL}/contato`, {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(novaMensagem)
            });

            // Verifica se a API retornou erro
            if (!resposta.ok) {
                throw new Error(`Erro HTTP: ${resposta.status}`);
            }

            // Converte a resposta para JSON
            const dados = await resposta.json();

            console.log("Enviado:", dados);

            // Mostra mensagem de sucesso
            msgStatus.textContent = "Mensagem enviada com sucesso!";

            // Limpa o formulário
            formContato.reset();

        } catch (erro) {

            console.error("Erro ao enviar:", erro);

            msgStatus.textContent = "Erro ao enviar mensagem!";
        }
    });
}
