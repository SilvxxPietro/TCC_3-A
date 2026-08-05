const formLogin = document.getElementById("formLogin");
const mensagemLogin = document.getElementById("mensagemLogin");

const formCadastro = document.getElementById("formCadastro");
const mensagemCadastro = document.getElementById("mensagemCadastro");

// LOGIN
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

        // Só entra se o login der certo
        if (resposta.ok) {
            formLogin.reset();
            window.location.href = "index2.html";
        }

    } catch (erro) {
        mensagemLogin.innerText = "Erro ao conectar com o servidor!";
        console.log(erro);
    }
});

// CADASTRO
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

        // Se cadastrou com sucesso, limpa os campos
        if (resposta.ok) {
            formCadastro.reset();
        }

    } catch (erro) {
        mensagemCadastro.innerText = "Erro ao conectar com o servidor!";
        console.log(erro);
    }
});