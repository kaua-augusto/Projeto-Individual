var progressoModel = require("../models/progressoModel");

function listarCategorias(req, res) {
    var idUsuario = req.params.idUsuario;

    progressoModel.listarCategorias(idUsuario)
        .then(function (resultado) {
            res.status(200).json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            console.log("Houve um erro ao buscar as categorias.", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

function atualizar(req, res) {
    var idUsuario = req.body.idUsuarioServer;
    var idCategoria = req.body.idCategoriaServer;
    var concluidas = Number(req.body.concluidasServer);

    if (idUsuario == undefined) {
        res.status(400).send("Seu idUsuario está undefined!");
    } else if (idCategoria == undefined) {
        res.status(400).send("Sua categoria está undefined!");
    } else if (isNaN(concluidas) || concluidas < 0) {
        res.status(400).send("O número de concluídas é inválido!");
    } else {

        progressoModel.buscarTotalCategoria(idCategoria)
            .then(function (resultado) {
                if (resultado.length == 0) {
                    res.status(404).send("Categoria não encontrada!");
                    return;
                }
                var valor = Math.min(concluidas, resultado[0].total);
                return progressoModel.atualizar(idUsuario, idCategoria, valor)
                    .then(function () {
                        res.status(200).json({ idCategoria: idCategoria, concluidas: valor });
                    });
            })
            .catch(function (erro) {
                console.log(erro);
                console.log("Houve um erro ao atualizar o progresso.", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

module.exports = {
    listarCategorias,
    atualizar
};
