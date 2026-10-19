const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
 
const usuarioRoutes = require("./routers/usuarioRoutes");
const avaliacaoRoutes = require("./routers/avaliacaoRoutes");
 
const app = express();
 
app.use(cors());
app.use(express.json());
app.get('/vendor/hls.min.js', (_req, res) => {
    res.sendFile(path.join(__dirname, 'node_modules/hls.js/dist/hls.min.js'));
});
 
// Disponibiliza os arquivos do frontend
app.use(express.static(path.join(__dirname, "../FrontEnd")));
 
// Página inicial
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../FrontEnd/login.html"));
});
 
// Rotas da API
app.use("/usuarios", usuarioRoutes);
app.use("/avaliacoes", avaliacaoRoutes);
app.get("/jogos/steam", async (_req, res) => {
    try {
        res.json(await require("./services/steamService").carregarCatalogo());
    } catch {
        res.status(503).json({ mensagem: "Steam indisponível no momento. Tente novamente.", jogos: [] });
    }
});
 
app.get('/jogos/steam/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isSafeInteger(id) || id < 1 || id > 999999999) return res.status(400).json({ mensagem: 'Jogo inválido.' });
    try {
        res.json(await require('./services/steamService').carregarDetalhes(id));
    } catch {
        res.status(503).json({ mensagem: 'Não foi possível carregar os detalhes da Steam. Tente novamente.' });
    }
});

const PORT = Number(process.env.PORT || 3000);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
