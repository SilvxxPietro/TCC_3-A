const usuarioModel = require("../models/usuarioModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function criarToken(usuario) {
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET não configurado.");
    return jwt.sign(
        { sub: usuario.id, email: usuario.email, nome: usuario.nome },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "2h" }
    );
}

const usuarioController = {
    cadastrar: async (req, res) => {
        const { nome, email, senha } = req.body;
        if (!nome || !email || !senha) {
            return res.status(400).json({ sucesso: false, mensagem: "Preencha todos os campos." });
        }
        try {
            const senhaHash = await bcrypt.hash(senha, 12);
            usuarioModel.cadastrar(nome, email, senhaHash, (erro) => {
                if (erro) {
                    console.error("Erro ao cadastrar usuário:", erro.message);
                    const status = erro.code === "ER_DUP_ENTRY" ? 409 : 500;
                    return res.status(status).json({ sucesso: false, mensagem: status === 409 ? "E-mail já cadastrado." : "Erro ao cadastrar usuário." });
                }
                return res.status(201).json({ sucesso: true, mensagem: "Usuário cadastrado com sucesso!" });
            });
        } catch (erro) {
            console.error("Erro ao gerar hash da senha:", erro.message);
            return res.status(500).json({ sucesso: false, mensagem: "Erro ao cadastrar usuário." });
        }
    },
    login: (req, res) => {
        const { email, senha } = req.body;
        if (!email || !senha) {
            return res.status(400).json({ sucesso: false, mensagem: "E-mail e senha são obrigatórios." });
        }
        usuarioModel.buscarPorEmail(email, async (erro, resultado) => {
            if (erro) return res.status(500).json({ sucesso: false, mensagem: "Erro no servidor." });
            const usuario = resultado && resultado[0];
            const senhaCorreta = usuario && await bcrypt.compare(senha, usuario.senha);
            if (!senhaCorreta) return res.status(401).json({ sucesso: false, mensagem: "E-mail ou senha incorretos." });
            try {
                return res.json({
                    sucesso: true,
                    mensagem: "Login realizado com sucesso!",
                    token: criarToken(usuario),
                    usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email }
                });
            } catch (erroToken) {
                console.error("Erro ao criar token:", erroToken.message);
                return res.status(500).json({ sucesso: false, mensagem: "Erro no servidor." });
            }
        });
    },
    perfil: (req, res) => res.json({ sucesso: true, usuario: req.usuario })
};

module.exports = usuarioController;
