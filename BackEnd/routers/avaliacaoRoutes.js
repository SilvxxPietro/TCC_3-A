const express = require("express");
const router = express.Router();
const avaliacaoController = require("../controllers/avaliacaoController");
const autenticar = require("../middlewares/autenticar");

router.get("/resumo", avaliacaoController.resumo);
router.post("/", autenticar, avaliacaoController.salvar);

module.exports = router;
