const conexao = require("../database/conexao");

const avaliacaoModel = {
    listarPorJogo: (idJogo, callback) => {
        conexao.query('SELECT nota, comentario, atualizado_em FROM avaliacao WHERE id_jogo = ? ORDER BY atualizado_em DESC LIMIT 50', [idJogo], callback);
    },
    salvar: (idUsuario, idJogo, nota, comentario, callback) => {
        const sql = `
            INSERT INTO avaliacao (id_usuario, id_jogo, nota, comentario)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                nota = VALUES(nota),
                comentario = VALUES(comentario),
                atualizado_em = CURRENT_TIMESTAMP
        `;
        conexao.query(sql, [idUsuario, idJogo, nota, comentario || null], callback);
    },

    resumoPorJogo: (callback) => {
        const sql = `
            SELECT id_jogo, ROUND(AVG(nota), 1) AS media, COUNT(*) AS quantidade
            FROM avaliacao
            GROUP BY id_jogo
        `;
        conexao.query(sql, callback);
    }
};

module.exports = avaliacaoModel;
