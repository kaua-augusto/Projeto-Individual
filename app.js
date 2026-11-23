var ambiente_processo = 'desenvolvimento';

var path = require("path");
var fs = require("fs");

var caminho_env = path.join(__dirname, ambiente_processo === 'producao' ? '.env' : '.env.dev');

if (!fs.existsSync(caminho_env)) {
    console.log("\n>> NÃO ACHEI O ARQUIVO: " + caminho_env);
    console.log(">> Arquivos .env nesta pasta:", fs.readdirSync(__dirname).filter(function (f) { return f.indexOf(".env") == 0; }), "\n");
}

var resultadoEnv = require("dotenv").config({ path: caminho_env });
if (!resultadoEnv.error && Object.keys(resultadoEnv.parsed || {}).length == 0) {
    console.log("\n>> O arquivo " + caminho_env + " foi encontrado, mas está VAZIO ou não foi salvo (Ctrl + S).\n");
}

var express = require("express");
var cors = require("cors");
var PORTA_APP = process.env.APP_PORT;
var HOST_APP = process.env.APP_HOST;

var app = express();

var indexRouter = require("./src/routes/index");
var usuarioRouter = require("./src/routes/usuarios");
var conquistaRouter = require("./src/routes/conquistas");
var progressoRouter = require("./src/routes/progresso");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(function (req, res, next) {
    res.set("Cache-Control", "no-store");
    next();
});
app.use(express.static(path.join(__dirname, "public"), { etag: false, lastModified: false }));

app.use(cors());

app.use("/", indexRouter);
app.use("/usuarios", usuarioRouter);
app.use("/conquistas", conquistaRouter);
app.use("/progresso", progressoRouter);

app.use(function (req, res) {
    if (req.accepts("html")) {
        res.redirect("/index.html");
    } else {
        res.status(404).json({ codigo: "NAO_ENCONTRADO", mensagem: "Rota não encontrada." });
    }
});

app.listen(PORTA_APP, function () {
    console.log(`
    ███████╗██████╗  ██████╗ ███████╗██████╗ ██╗   ██╗███╗   ██╗███╗   ██╗██╗███╗   ██╗ ██████╗
    ██╔════╝██╔══██╗██╔════╝ ██╔════╝██╔══██╗██║   ██║████╗  ██║████╗  ██║██║████╗  ██║██╔════╝
    █████╗  ██║  ██║██║  ███╗█████╗  ██████╔╝██║   ██║██╔██╗ ██║██╔██╗ ██║██║██╔██╗ ██║██║  ███╗
    ██╔══╝  ██║  ██║██║   ██║██╔══╝  ██╔══██╗██║   ██║██║╚██╗██║██║╚██╗██║██║██║╚██╗██║██║   ██║
    ███████╗██████╔╝╚██████╔╝███████╗██║  ██║╚██████╔╝██║ ╚████║██║ ╚████║██║██║ ╚████║╚██████╔╝
    ╚══════╝╚═════╝  ╚═════╝ ╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═══╝╚═╝╚═╝  ╚═══╝ ╚═════╝
    \n
    Servidor rodando! Acesse: http://${HOST_APP}:${PORTA_APP}\n
    Ambiente: .:${process.env.AMBIENTE_PROCESSO}:.\n`);
});
