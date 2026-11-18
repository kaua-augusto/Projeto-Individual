var express = require("express");
var router = express.Router();

var conquistaController = require("../controllers/conquistaController");

router.get("/listar/:idUsuario", function (req, res) {
    conquistaController.listar(req, res);
});

router.post("/marcar", function (req, res) {
    conquistaController.marcar(req, res);
});

module.exports = router;
