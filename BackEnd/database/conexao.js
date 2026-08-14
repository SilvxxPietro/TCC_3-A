const mysql = require("mysql2");

const conexao = mysql.createConnection({
    host:"localhost",
    user: "root",
    password: "123456",
    database: "tcc_3_a"
});


conexao.connect((erro) => {
    if(erro){
        console.log("Erro ao conectar:", erro);
    }else{
        console.log("Banco conectado!");
    }
});

module.exports = conexao;