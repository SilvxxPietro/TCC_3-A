const express = require("express");
const router = express.Router();
const avaliacaoController = require("../controllers/avaliacaoController");
const autenticar = require("../middlewares/autenticar");

router.get("/resumo", avaliacaoController.resumo);
router.get('/jogo/:id', (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isSafeInteger(id) || id < 1) return res.status(400).json({ mensagem: 'Jogo inválido.' });
    require('../models/avaliacaoModel').listarPorJogo(id, (erro, avaliacoes) => {
        if (erro) return res.status(503).json({ mensagem: 'Avaliações indisponíveis no momento.' });
        res.json({ avaliacoes });
    });
});
router.post("/", autenticar, avaliacaoController.salvar);

module.exports = router;
