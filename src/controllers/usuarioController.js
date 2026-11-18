var usuarioModel = require("../models/usuarioModel");

function autenticar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está indefinida!");
    } else {

        usuarioModel.autenticar(email, senha)
            .then(
                function (resultadoAutenticar) {
                    console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);

                    if (resultadoAutenticar.length == 1) {
                        res.json({
                            id: resultadoAutenticar[0].idUsuario,
                            email: resultadoAutenticar[0].email,
                            nome: resultadoAutenticar[0].nome
                        });
                    } else if (resultadoAutenticar.length == 0) {
                        res.status(403).send("Email e/ou senha inválido(s)");
                    } else {
                        res.status(403).send("Mais de um usuário com o mesmo login e senha!");
                    }
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

function cadastrar(req, res) {
    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (nome == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está undefined!");
    } else {

        usuarioModel.cadastrar(nome, email, senha)
            .then(function (resultado) {
                res.json({ id: resultado.insertId, nome: nome, email: email });
            })
            .catch(function (erro) {
                console.log(erro);
                if (erro.code == "ER_DUP_ENTRY") {
                    res.status(409).send("Esse e-mail já está cadastrado. Faça login.");
                } else {
                    console.log("\nHouve um erro ao realizar o cadastro! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            });
    }
}

function perfil(req, res) {
    usuarioModel.buscarPerfil(req.params.idUsuario)
        .then(function (resultado) {
            if (resultado.length == 0) {
                res.status(404).send("Usuário não encontrado!");
                return;
            }
            res.json({
                nome: resultado[0].nome,
                horasJogadas: resultado[0].horasJogadas || 0,
                dtHoras: resultado[0].dtHoras ? new Date(resultado[0].dtHoras).getTime() : null
            });
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function atualizarHoras(req, res) {
    var idUsuario = req.body.idUsuarioServer;
    var horas = Number(req.body.horasServer);

    if (idUsuario == undefined) {
        res.status(400).send("Seu idUsuario está undefined!");
    } else if (isNaN(horas) || horas < 0 || horas > 100000) {
        res.status(400).send("Número de horas inválido!");
    } else {
        usuarioModel.atualizarHoras(idUsuario, Math.round(horas))
            .then(function () {
                res.json({ horasJogadas: Math.round(horas), dtHoras: Date.now() });
            })
            .catch(function (erro) {
                console.log(erro);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

module.exports = {
    autenticar,
    cadastrar,
    perfil,
    atualizarHoras
};
