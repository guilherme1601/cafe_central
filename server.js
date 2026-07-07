require("dotenv").config();
const express = require("express");
const cors = require("cors"); 
const session = require("express-session"); 
const bcrypt = require("bcryptjs"); 
const conexao = require("./db.js");

const app = express();

    const ListOrigins = [
        "http://localhost:8080", 
        "http://localhost:5500", 
        "http://127.0.0.1:5500", 
        "https://guilherme1601.github.io"
    ];
    app.use(cors({
        origin: ListOrigins,
        credentials: true,
        methods: ["GET","POST","PUT","DELETE","OPTIONS"],
        allowedHeaders: ["Content-Type","Authorization"]
    }));

//configuração da API
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

// Configuração do COOKIE de sessão
const sessionConfig = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    name: 'cafe-central.sid',
    cookie: {
        httpOnly: true,
        maxAge: 1000*60*60
    }
};

// Ambiente local X Produção
if(process.env.NODE_ENV==="production"){
 
    app.set("trust proxy",1); 
    sessionConfig.cookie.sameSite="none"; 
    sessionConfig.cookie.secure = true;
} else {
    sessionConfig.cookie.sameSite="lax"; 
    sessionConfig.cookie.secure = false;
};

app.use(session(sessionConfig));

//primeira Rota

app.get("/",(req,res)=>{
    res.send("API Cafe Central funcionando");
});

// rota cadastro

app.post("/cadastro", async (req, res) =>{
    try{
        const{nome,email,senha} = req.body
        console.log(req.body);

        if(!nome || !email || !senha){
            return res.status(400).json({erro: "Preencha todos os campos"})
        }

        const [rows] = await conexao.execute(
             "SELECT id FROM tb_usuarios WHERE email=?", [email]
        );

        if(rows.length>0){
            return res.status(409).json({erro:"E-mail já cadastrado"})
        };

        const senhaHash = await bcrypt.hash(senha,10);

        const sql = `INSERT INTO tb_usuarios (nome,email,senha) VALUES (?,?,?)`
        conexao.execute(sql,[nome,email,senhaHash])
        res.json({mensagem: "Usuário cadastrado com sucesso"}); 
        
    } catch(erro){
        console.log(erro);
        res.status(500).json({erro: "Erro ao cadastrar usuário!"})
    }
})

// rota login
app.post("/login",async (req,res)=>{
    try{
        const {email,senha} = req.body || {};
        
        if(!email || !senha){
            return res.status(400).json({erro: "Preencha todos os campos"})
        }

        const sql = `SELECT * FROM tb_usuarios WHERE email=?`

        const [resultado] = await conexao.execute(sql,[email])

        if(resultado.length === 0){
            return res.status(401).json({mensagem: "Usuário ou senha inválidos!"})
        }

        const usuario = resultado[0]    
     
        const senhaCorreta = await bcrypt.compare(senha,usuario.senha) 
        
        if(!senhaCorreta){
            return res.status(401).json({erro: "Senha inválida"});
        };
    
        res.json({mensagem: "Login realizado com sucesso!"});
    
    } catch(erro){
        console.log("Erro no Login: ",erro)
        res.status(500).json({erro: "Erro ao cadastrar usuário"})
    }
})

// Rota de Contato
app.post("/contato",async (req,res)=>{
    try{
        const {nome, email, mensagem} = req.body

        if(!nome || !email || !mensagem){
            return res.status(400).json({erro: "Preencha todos os campos"});
        }

        const sql = `INSERT INTO tb_contato (nome,email,mensagem) VALUES(?,?,?)`
                    
        await conexao.execute(sql,[nome,email,mensagem])
        res.json({mensagem: "Mensagem enviada com sucesso!"});

    } catch(erro){
        res.status(500).json({erro:"Erro ao enviar mensagem"});
    }

})

// Iniciando o Servidor na porta 3000
app.listen(3000,()=>{
    console.log("Servidor rodando na porta 3000");
})