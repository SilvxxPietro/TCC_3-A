const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const [tipo, token] = (req.headers.authorization || "").split(" ");
    if (tipo !== "Bearer" || !token) {
        return res.status(401).json({ sucesso: false, mensagem: "Autenticação necessária." });
    }
    try {
        const dados = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = { id: dados.sub, nome: dados.nome, email: dados.email };
        return next();
    } catch {
        return res.status(401).json({ sucesso: false, mensagem: "Sessão inválida ou expirada." });
    }
};
