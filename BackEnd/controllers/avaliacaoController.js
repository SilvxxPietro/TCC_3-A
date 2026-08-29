const avaliacaoModel = require("../models/avaliacaoModel");

const avaliacaoController = {
    salvar: (req, res) => {
        const idJogo = Number(req.body.idJogo);
        const nota = Number(req.body.nota);
        const comentario = typeof req.body.comentario === "string" ? req.body.comentario.trim() : "";

        if (!Number.isInteger(idJogo) || idJogo < 1) {
            return res.status(400).json({ sucesso: false, mensagem: "Jogo inválido." });
        }
        if (!Number.isInteger(nota) || nota < 1 || nota > 5) {
            return res.status(400).json({ sucesso: false, mensagem: "Escolha uma nota de 1 a 5." });
        }
        if (comentario.length > 1000) {
            return res.status(400).json({ sucesso: false, mensagem: "O comentário pode ter no máximo 1000 caracteres." });
        }

        avaliacaoModel.salvar(req.usuario.id, idJogo, nota, comentario, (erro) => {
            if (erro) {
                console.error("Erro ao salvar avaliação:", erro.message);
                return res.status(500).json({ sucesso: false, mensagem: "Não foi possível salvar a avaliação." });
            }
            return res.status(201).json({ sucesso: true, mensagem: "Avaliação salva com sucesso!" });
        });
    },

    resumo: (_req, res) => {
        avaliacaoModel.resumoPorJogo((erro, avaliacoes) => {
            if (erro) {
                console.error("Erro ao consultar avaliações:", erro.message);
                return res.status(500).json({ sucesso: false, mensagem: "Não foi possível carregar as avaliações." });
            }
            return res.json({ sucesso: true, avaliacoes });
        });
    }
};

module.exports = avaliacaoController;
