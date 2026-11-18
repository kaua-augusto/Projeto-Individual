var conquistaModel = require("../models/conquistaModel");

function listar(req, res) {
    var idUsuario = req.params.idUsuario;

    conquistaModel.listar(idUsuario)
        .then(function (resultado) {
            var lista = resultado.map(function (c) {
                return {
                    idConquista: c.idConquista,
                    nome: c.nome,
                    descricao: c.descricao || "",
                    oculta: !c.descricao,
                    desbloqueada: c.dtDesbloqueio != null,
                    desbloqueadaEm: c.dtDesbloqueio ? new Date(c.dtDesbloqueio + "T12:00:00").getTime() : null,
                    dtDesbloqueio: c.dtDesbloqueio,
                    global: c.raridadeGlobal != null ? Number(c.raridadeGlobal) : null,
                    imagem: c.imagem
                };
            });
            res.status(200).json(lista);
        })
        .catch(function (erro) {
            console.log(erro);
            console.log("Houve um erro ao listar as conquistas.", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

function marcar(req, res) {
    var idUsuario = req.body.idUsuarioServer;
    var idConquista = req.body.idConquistaServer;
    var desbloqueada = req.body.desbloqueadaServer;
    var data = req.body.dataServer;

    if (idUsuario == undefined) {
        res.status(400).send("Seu idUsuario está undefined!");
    } else if (idConquista == undefined) {
        res.status(400).send("A conquista está undefined!");
    } else if (desbloqueada == false) {
        conquistaModel.desmarcar(idUsuario, idConquista)
            .then(function () {
                res.status(200).json({ idConquista: idConquista, desbloqueada: false });
            })
            .catch(function (erro) {
                console.log(erro);
                res.status(500).json(erro.sqlMessage);
            });
    } else {
        var agora = new Date();
        var hoje = agora.getFullYear() + "-" + String(agora.getMonth() + 1).padStart(2, "0") + "-" + String(agora.getDate()).padStart(2, "0");
        if (!/^\d{4}-\d{2}-\d{2}$/.test(data || "") || data > hoje) {
            data = hoje;
        }

        conquistaModel.marcar(idUsuario, idConquista, data)
            .then(function () {
                res.status(200).json({ idConquista: idConquista, desbloqueada: true, data: data });
            })
            .catch(function (erro) {
                console.log(erro);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

module.exports = {
    listar,
    marcar
};
