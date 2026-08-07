// SEUS SELETORES ORIGINAIS
const formLogin = document.getElementById("formLogin");
const mensagemLogin = document.getElementById("mensagemLogin");
const formCadastro = document.getElementById("formCadastro");
const mensagemCadastro = document.getElementById("mensagemCadastro");

const boxLogin = document.getElementById('boxLogin');
const boxCadastro = document.getElementById('boxCadastro');
const irParaCadastro = document.getElementById('irParaCadastro');
const irParaLogin = document.getElementById('irParaLogin');

// --- FUNÇÃO DE REDIRECIONAMENTO SE JÁ ESTIVER LOGADO ---
function verificarEstadoLogin() {
    const usuarioLogado = localStorage.getItem('usuarioLogado');

    // Se o usuário já estiver logado e entrar na página de login, manda ele direto para a principal
    if (usuarioLogado) {
        window.location.href = "index2.html";
    } else {
        // Garante que o formulário de login fique visível se não houver dados
        if (boxCadastro) boxCadastro.classList.remove('active');
        if (boxLogin) boxLogin.classList.add('active');
    }
}

// Executa a checagem assim que a página de login abre
verificarEstadoLogin();

// ALTERNÂNCIA DE TELAS (Ir para cadastro)
irParaCadastro.addEventListener('click', function(event) {
    event.preventDefault(); 
    boxLogin.classList.remove('active');
    boxCadastro.classList.add('active');
});

// ALTERNÂNCIA DE TELAS (Voltar para o login)
irParaLogin.addEventListener('click', function(event) {
    event.preventDefault(); 
    boxCadastro.classList.remove('active');
    boxLogin.classList.add('active');
});

// LOGIN (Modificado para salvar os dados e mudar de página)
formLogin.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("emailLogin").value;
    const senha = document.getElementById("senhaLogin").value;

    try {
        const resposta = await fetch("http://localhost:3000/usuarios/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, senha })
        });

        const dados = await resposta.json();
        mensagemLogin.innerText = dados.mensagem;
        console.log(dados);

        if (resposta.ok) {
            // SALVA OS DADOS DO USUÁRIO NO NAVEGADOR
            const dadosUsuario = {
                nome: dados.nome || email.split('@')[0].toUpperCase(),
                email: email
            };
            localStorage.setItem('usuarioLogado', JSON.stringify(dadosUsuario));
            
            formLogin.reset();
            
            // REDIRECIONA PARA A SUA PÁGINA PRINCIPAL
            window.location.href = "index2.html";
        }

    } catch (erro) {
        mensagemLogin.innerText = "Erro ao conectar com o servidor!";
        console.log(erro);
    }
});

// CADASTRO (Inalterado)
formCadastro.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nome = document.getElementById("nomeCadastro").value;
    const email = document.getElementById("emailCadastro").value;
    const senha = document.getElementById("senhaCadastro").value;

    try {
        const resposta = await fetch("http://localhost:3000/usuarios/cadastro", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nome, email, senha })
        });

        const dados = await resposta.json();
        mensagemCadastro.innerText = dados.mensagem;
        console.log(dados);

        if (resposta.ok) {
            formCadastro.reset();
            boxCadastro.classList.remove('active');
            boxLogin.classList.add('active');
        }

    } catch (erro) {
        mensagemCadastro.innerText = "Erro ao conectar com o servidor!";
        console.log(erro);
    }
});
