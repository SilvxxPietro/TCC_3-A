const conexao = require("../database/conexao");

const avaliacaoModel = {
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
