var express = require("express");
var router = express.Router();

var progressoController = require("../controllers/progressoController");

router.get("/categorias/:idUsuario", function (req, res) {
    progressoController.listarCategorias(req, res);
});

router.put("/atualizar", function (req, res) {
    progressoController.atualizar(req, res);
});

module.exports = router;
