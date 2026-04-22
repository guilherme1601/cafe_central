// ================= IMPORTAÇÕES =================

// Carrega variáveis do .env
require("dotenv").config();

// Importa o Express (framework do servidor)
const express = require("express");

// Permite requisições de outros domínios (frontend)
const cors = require("cors");

// Gerencia sessões (login)
const session = require("express-session");

// 🔥 CORREÇÃO: nome estava errado (bcrytjs → bcryptjs)
const bcrypt = require("bcryptjs");

// Conexão com banco de dados
const pool = require("./db.js");

// Cria o servidor
const app = express();


// ================= CORS =================

// Lista de sites permitidos acessar a API
const listOrigins = [
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://guilherme1601.github.io"
];

// Configuração do CORS
app.use(cors({
    origin: listOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ["Content-Type", "Authorization"]
}));


// Permite receber JSON no body
app.use(express.json());


// ================= SESSÃO =================

const sessionConfig = {
    secret: process.env.SESSION_SECRET, // chave secreta
    resave: false,
    
    // 🔥 CORREÇÃO: estava "saveUnitialized"
    saveUninitialized: false,

    name: "cafecentral.sid",

    cookie: {
        httpOnly: true, // protege contra JS
        maxAge: 1000 * 60 * 60 // 1 hora
    }
};

// Configuração para produção
if (process.env.NODE_ENV == "production") {
    app.set("trust proxy", 1);
    sessionConfig.cookie.sameSite = "none";
    sessionConfig.cookie.secure = true;
} else {
    sessionConfig.cookie.sameSite = "lax";
    sessionConfig.cookie.secure = false;
}

// Ativa sessão
app.use(session(sessionConfig));


// ================= CADASTRO =================

// 🔥 CORREÇÃO: faltava "async"
app.post("/mensagem", async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        // Validação
        if (!nome || !email || !senha) {
            return res.status(400).json({ erro: "Preencha todos os campos" });
        }

        // Verifica se já existe usuário
        const [rows] = await pool.execute(
            "SELECT id FROM tb_usuarios WHERE email=?", [email]
        );

        if (rows.length > 0) {
            return res.status(409).json({ erro: "E-mail já cadastrado" });
        }

        // Criptografa senha
        const senhaHash = await bcrypt.hash(senha, 10);

        // Salva no banco
        await pool.execute(
            "INSERT INTO tb_usuarios(nome,email,senha) VALUES(?,?,?)",
            [nome, email, senhaHash]
        );

        res.status(201).json({ mensagem: "Cadastro realizado com sucesso!" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: "Erro ao cadastrar usuário" });
    }
});


// ================= LOGIN =================

app.post("/login", async (req, res) => {
    try {
        const { senha, email } = req.body;

        if (!senha || !email) {
            return res.status(400).json({ erro: "Preencha todos os campos" });
        }

        // Busca usuário
        const [rows] = await pool.execute(
            "SELECT id, nome, email, senha FROM tb_usuarios WHERE email=?", [email]
        );

        if (rows.length == 0) {
            return res.status(401).json({ erro: "Usuário não encontrado" });
        }

        const usuario = rows[0];

        // 🔥 CORREÇÃO: usar bcrypt correto
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

        if (!senhaCorreta) {
            return res.status(401).json({ erro: "Senha inválida" });
        }

        // Salva sessão
        req.session.usuario = {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email
        };

        res.json({ mensagem: "Login realizado com sucesso!" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: "Erro ao fazer login" });
    }
});


// ================= VERIFICAR LOGIN =================

app.get("/me", (req, res) => {

    if (!req.session.usuario) {
        return res.status(401).json({ logado: false });
    }

    // 🔥 CORREÇÃO: estava com ";" errado
    res.json({
        logado: true,
        usuario: req.session.usuario
    });
});


// ================= LOGOUT =================

app.post("/logout", (req, res) => {

    req.session.destroy(() => {
        res.clearCookie("cafecentral.sid");
        res.json({ mensagem: "Logout realizado" });
    });

});


// ================= SERVIDOR =================

app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});