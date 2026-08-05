const mysql = require("mysql2");

const conexao = mysql.createConnection({
    host:"localhost",
    user: "root",
    password: "#Pi123456",
    database: "tcc"
});

conexao.connect((erro) => {
    if(erro){
        console.log("Erro ao conectar:", erro);
    }else{
        console.log("Banco conectado!");
    }
});

module.exports = conexao;