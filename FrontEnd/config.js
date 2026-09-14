// Em produção, defina window.APP_CONFIG.API_BASE_URL antes deste arquivo.
window.APP_CONFIG = window.APP_CONFIG || {};

const emDesenvolvimentoLocal = ["localhost", "127.0.0.1"].includes(window.location.hostname);
const frontendEmOutraPorta = emDesenvolvimentoLocal && window.location.port !== "3000";
const frontendAbertoComoArquivo = window.location.protocol === "file:";

// Live Server (ex.: porta 5500) e arquivos abertos diretamente usam a API Express na porta 3000.
window.API_BASE_URL = window.APP_CONFIG.API_BASE_URL
    || (frontendEmOutraPorta || frontendAbertoComoArquivo ? "http://localhost:3000" : window.location.origin);
