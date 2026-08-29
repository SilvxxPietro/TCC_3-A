const conexao = require("../database/conexao");

const usuarioModel = {
    cadastrar: (nome, email, senhaHash, callback) => {
        const sql = "INSERT INTO usuario (nome, email, senha) VALUES (?, ?, ?)";
        conexao.query(sql, [nome, email, senhaHash], callback);
    },
    buscarPorEmail: (email, callback) => {
        const sql = "SELECT id_usuario AS id, nome, email, senha FROM usuario WHERE email = ? LIMIT 1";
        conexao.query(sql, [email], callback);
    }
};

module.exports = usuarioModel;
