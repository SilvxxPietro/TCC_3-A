const formLogin = document.getElementById("formLogin"), mensagemLogin = document.getElementById("mensagemLogin");
const formCadastro = document.getElementById("formCadastro"), mensagemCadastro = document.getElementById("mensagemCadastro");
const boxLogin = document.getElementById("boxLogin"), boxCadastro = document.getElementById("boxCadastro");

async function sessaoValida() {
    const token = sessionStorage.getItem("authToken");
    if (!token) return false;
    const resposta = await fetch(`${window.API_BASE_URL}/usuarios/me`, { headers: { Authorization: `Bearer ${token}` } });
    if (!resposta.ok) sessionStorage.removeItem("authToken");
    return resposta.ok;
}

(async () => {
    if (await sessaoValida()) return window.location.href = "index2.html";
    boxCadastro.classList.remove("active"); boxLogin.classList.add("active");
})();

document.getElementById("irParaCadastro").addEventListener("click", (e) => { e.preventDefault(); boxLogin.classList.remove("active"); boxCadastro.classList.add("active"); });
document.getElementById("irParaLogin").addEventListener("click", (e) => { e.preventDefault(); boxCadastro.classList.remove("active"); boxLogin.classList.add("active"); });

formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
        const resposta = await fetch(`${window.API_BASE_URL}/usuarios/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: document.getElementById("emailLogin").value, senha: document.getElementById("senhaLogin").value }) });
        const dados = await resposta.json(); mensagemLogin.innerText = dados.mensagem;
        if (resposta.ok) { sessionStorage.setItem("authToken", dados.token); formLogin.reset(); window.location.href = "index2.html"; }
    } catch { mensagemLogin.innerText = "Erro ao conectar com o servidor."; }
});

formCadastro.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
        const resposta = await fetch(`${window.API_BASE_URL}/usuarios/cadastro`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nome: document.getElementById("nomeCadastro").value, email: document.getElementById("emailCadastro").value, senha: document.getElementById("senhaCadastro").value }) });
        const dados = await resposta.json(); mensagemCadastro.innerText = dados.mensagem;
        if (resposta.ok) { formCadastro.reset(); boxCadastro.classList.remove("active"); boxLogin.classList.add("active"); }
    } catch { mensagemCadastro.innerText = "Erro ao conectar com o servidor."; }
});
