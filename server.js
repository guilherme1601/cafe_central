require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const bcrypy = require("bcrytjs");
const pool = require("./db.js");

const app = express();

const listOrigins = [
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://guilherme1601.github.io:"
]

app.use(cors({
    origin:listOrigins,
    credentials:true,
    methods:['GET', 'POST', 'PUT', 'DELETE','OPTIONS'],
    allowedHeaders: ["Content-Type","Authorization"]
}));

app.use(express.json());

const sessionConfig = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUnitialized: false,
    name: "cafecentral.sid",
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60
    }
}

if(process.env.NODE_ENV == "production"){
    app.set("trust proxy",1),
    sessionConfig.cookie.sameSite = "none",
    sessionConfig.cookie.secure = true
} else {
    sessionConfig.cookie.sameSite="lax",
    sessionConfig.cookie.secure = false
}

app.use(session(sessionConfig))

app.post("/mensagem", (req,res) => {
    try{
         //const nome = req.body.nome
        //const email = req.body.email
        //const senha = req.body.senha

        const {nome,email,senha} = req.body
        if(!nome || !email || !senha ){
            return res.status(400).json({erro:"Preencha todos os campos"});
        }
        const [rows] = await pool.execute(
            "SELECT id FROM tb_usuarios WHERE email=?",[email]
        );

        if(rows.length > 0){
            return res.status(409).json({erro: "E-mail já cadastrado"});
        };

        const senhaHash = await bcrypt.hash(senha,10);
        await pool.execute(
            "INSERT INTO tb_usuarios(nome,email,senha) VALUES(?,?,?)", [nome,email,senhaHash]
        );

        res.status(201).json({mensagem:" Cadastro realizado com sucesso!"});
    } catch(error){
        console.error(error);
        res.status(500).json({erro: "Erro ao cadastrar usuário"})
    }

});

app.post("/login", async (req,res) => {
    try{
        const{senha,email} = req.body
        if(!senha||!email){
            return res.status(400).json({erro:"Preencha todos os campos"});
        }

        const [rows] = await pool.execute(
            "SELECT id, nome, email, senha FROM tb_usuarios WHERE email=?",[email] 
        );

        if(rows.length == 0){
            return res.status(401).json({erro:"Usuario não encontrado"});
        };

        const usuario = rows[0]
        const senhaCorreta = await bcrypy.compare(senha,usuario.senha)

        if(!senhaCorreta){
            return res.status(401).json({erro:"Senha Invalida"});

        };

        req.session.usuario = {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email
        }

        res.json
    }
})