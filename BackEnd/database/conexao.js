const mysql = require("mysql2");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const obrigatorias = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME"];
const ausentes = obrigatorias.filter((variavel) => !process.env[variavel]);
if (ausentes.length) {
    throw new Error(`Variáveis do banco não configuradas: ${ausentes.join(", ")}`);
}

const conexao = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
    queueLimit: 0,
    connectTimeout: 10000,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

conexao.getConnection((erro, connection) => {
    if (erro) return console.error("Erro ao conectar ao banco:", erro.message);
    console.log("Banco conectado!");
    connection.release();
});

conexao.on("error", (erro) => {
    console.error("Erro no pool MySQL:", erro.message);
});

module.exports = conexao;
