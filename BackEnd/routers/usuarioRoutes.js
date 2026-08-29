const express = require("express");
const router = express.Router();

const usuarioController = require("../controllers/usuarioController");
const autenticar = require("../middlewares/autenticar");

router.post("/cadastro", usuarioController.cadastrar);
router.post("/login", usuarioController.login);
router.get("/me", autenticar, usuarioController.perfil);

module.exports = router;
