function Entrar() { window.location.href = "login.html"; }

document.addEventListener("DOMContentLoaded", async () => {
    const token = sessionStorage.getItem("authToken");
    const entrar = document.getElementById("navBtnEntrar"), perfil = document.getElementById("navPerfil"), menu = document.querySelector(".profile-dropdown");
    const paginaPerfil = window.location.pathname.endsWith("/perfil.html");
    if (!token && paginaPerfil) {
        window.location.href = "login.html";
        return;
    }
    if (token) {
        try {
            const resposta = await fetch(`${window.API_BASE_URL}/usuarios/me`, { headers: { Authorization: `Bearer ${token}` } });
            if (!resposta.ok) throw new Error("Sessão inválida");
            const { usuario } = await resposta.json();
            document.getElementById("navNomeUsuario").textContent = usuario.nome;
            document.getElementById("navEmailUsuario").textContent = usuario.email;
            const profileName = document.getElementById("profileName");
            const profileEmail = document.getElementById("profileEmail");
            if (profileName) profileName.textContent = usuario.nome;
            if (profileEmail) profileEmail.textContent = usuario.email;
            entrar.style.display = "none"; perfil.style.display = "flex";
            perfil.addEventListener("click", (e) => { e.stopPropagation(); menu.classList.toggle("show"); });
            document.addEventListener("click", () => menu.classList.remove("show"));
        } catch {
            sessionStorage.removeItem("authToken");
            if (paginaPerfil) window.location.href = "login.html";
        }
    }
    document.getElementById("navBtnSair")?.addEventListener("click", () => { sessionStorage.removeItem("authToken"); window.location.href = "login.html"; });
});

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("reviewModal");
    if (!modal) return;
    const modalClose = document.getElementById("modalClose");
    const modalTitle = document.getElementById("modalGameTitle");
    const comment = document.getElementById("reviewComment");
    const message = document.getElementById("reviewMessage");
    const submitButton = document.getElementById("submitReview");
    const stars = [...document.querySelectorAll("#interactiveStars .star")];
    let jogoSelecionado = null;
    let notaSelecionada = 0;

    const desenharEstrelas = (nota) => {
        stars.forEach((star) => star.classList.toggle("selected", Number(star.dataset.val) <= nota));
    };

    const fecharModal = () => {
        modal.classList.remove("show");
        modal.setAttribute("aria-hidden", "true");
    };

    const atualizarResumo = (avaliacoes) => {
        const porJogo = new Map(avaliacoes.map((avaliacao) => [String(avaliacao.id_jogo), avaliacao]));
        document.querySelectorAll(".card-game").forEach((card) => {
            const resumo = porJogo.get(card.dataset.id);
            if (!resumo) {
                card.querySelector('.rating-badge').textContent = 'Sem nota';
                card.querySelector('.stars').textContent = '☆☆☆☆☆';
                card.querySelector('.reviews-count').textContent = '(0 avaliações)';
                return;
            }

            const media = Number(resumo.media).toFixed(1);
            const quantidade = Number(resumo.quantidade).toLocaleString("pt-BR");
            card.querySelector(".rating-badge").textContent = `★ ${media}`;
            card.querySelector(".stars").textContent = "★".repeat(Math.round(Number(resumo.media))) + "☆".repeat(5 - Math.round(Number(resumo.media)));
            card.querySelector(".reviews-count").textContent = `(${quantidade} avaliações)`;
        });
        aplicarFiltros();
    };

    const carregarResumos = async () => {
        try {
            const resposta = await fetch(`${window.API_BASE_URL}/avaliacoes/resumo`);
            const dados = await resposta.json();
            if (resposta.ok) atualizarResumo(dados.avaliacoes);
        } catch (erro) {
            console.warn("Não foi possível carregar as avaliações.", erro);
        }
    };

    document.getElementById("gamesGrid").addEventListener("click", (event) => {
            const button = event.target.closest(".btn-card-action");
            if (!button) return;
            if (!sessionStorage.getItem("authToken")) {
                window.location.href = "login.html";
                return;
            }
            const card = button.closest(".card-game");
            jogoSelecionado = Number(card.dataset.id);
            notaSelecionada = 0;
            comment.value = "";
            message.textContent = "";
            modalTitle.textContent = `Avaliar: ${card.querySelector(".game-title").textContent}`;
            desenharEstrelas(0);
            modal.classList.add("show");
            modal.setAttribute("aria-hidden", "false");
    });

    stars.forEach((star) => {
        star.addEventListener("click", () => {
            notaSelecionada = Number(star.dataset.val);
            desenharEstrelas(notaSelecionada);
        });
    });

    modalClose.addEventListener("click", fecharModal);
    modal.addEventListener("click", (event) => {
        if (event.target === modal) fecharModal();
    });

    submitButton.addEventListener("click", async () => {
        if (!notaSelecionada) {
            message.textContent = "Escolha uma nota de 1 a 5 estrelas.";
            return;
        }

        submitButton.disabled = true;
        message.textContent = "Enviando avaliação...";
        try {
            const resposta = await fetch(`${window.API_BASE_URL}/avaliacoes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem("authToken")}`
                },
                body: JSON.stringify({ idJogo: jogoSelecionado, nota: notaSelecionada, comentario: comment.value })
            });
            const dados = await resposta.json();
            if (!resposta.ok) throw new Error(dados.mensagem || "Não foi possível salvar a avaliação.");

            message.textContent = dados.mensagem;
            await carregarResumos();
            setTimeout(fecharModal, 700);
        } catch (erro) {
            message.textContent = erro.message || "Erro ao conectar com o servidor.";
        } finally {
            submitButton.disabled = false;
        }
    });

    const busca = document.getElementById("buscaJogos");
    const filtroPlataforma = document.getElementById("filtroPlataforma");
    const filtroGenero = document.getElementById("filtroGenero");
    const ordenacao = document.getElementById("ordenacao");
    const limparFiltros = document.getElementById("limparFiltros");
    const grid = document.getElementById("gamesGrid");
    const mensagemSemResultados = document.getElementById("mensagemSemResultados");

    const normalizar = (texto) => texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

    const numeroDoTexto = (texto) => Number((texto.match(/[\d.,]+/) || ["0"])[0].replace(/\./g, "").replace(",", "."));

    const notaDoCard = (card) => Number((card.querySelector(".rating-badge").textContent.match(/[\d.,]+/) || ["0"])[0].replace(",", "."));
    const avaliacoesDoCard = (card) => numeroDoTexto(card.querySelector(".reviews-count").textContent);
    const precoDoCard = (card) => card.dataset.preco === "indisponivel" ? null : numeroDoTexto(card.querySelector(".game-price").textContent);
    const compararPreco = (a, b, direcao) => {
        const x = precoDoCard(a), y = precoDoCard(b);
        if (x === null) return y === null ? 0 : 1;
        if (y === null) return -1;
        return (x - y) * direcao;
    };

    const generosEquivalentes = {
        acao: ["acao"],
        fps: ["fps", "tiro em primeira pessoa", "tiro"],
        aventura: ["aventura"],
        sobrevivencia: ["sobrevivencia"],
        esportes: ["esportes"],
        rpg: ["rpg"],
        estrategia: ["estrategia"]
    };

    function aplicarFiltros() {
        const plataforma = filtroPlataforma.value;
        const genero = filtroGenero.value;
        const cards = [...grid.querySelectorAll(".card-game")];

        let jogosVisiveis = 0;
        cards.forEach((card) => {
            const plataformasDoJogo = normalizar(card.querySelector(".game-platform").textContent);
            const generosDoJogo = normalizar(card.querySelector(".badge-tag").textContent);
            const plataformaCorresponde = !plataforma || plataformasDoJogo.includes(plataforma);
            const generoCorresponde = !genero || generosEquivalentes[genero].some((termo) => generosDoJogo.includes(termo));
            const nomeCorresponde = normalizar(card.querySelector(".game-title").textContent).includes(normalizar(busca.value.trim()));
            const deveExibir = plataformaCorresponde && generoCorresponde && nomeCorresponde;
            card.hidden = !deveExibir;
            if (deveExibir) jogosVisiveis += 1;
        });

        mensagemSemResultados.hidden = jogosVisiveis > 0;

        const comparadores = {
            "maior-avaliacao": (a, b) => notaDoCard(b) - notaDoCard(a),
            "menor-avaliacao": (a, b) => notaDoCard(a) - notaDoCard(b),
            "mais-avaliacoes": (a, b) => avaliacoesDoCard(b) - avaliacoesDoCard(a),
            "menor-preco": (a, b) => compararPreco(a, b, 1),
            "maior-preco": (a, b) => compararPreco(a, b, -1)
        };
        cards.sort(comparadores[ordenacao.value]).forEach((card) => grid.appendChild(card));
    }

    [filtroPlataforma, filtroGenero, ordenacao].forEach((filtro) => {
        filtro.addEventListener("change", aplicarFiltros);
    });
    busca.addEventListener("input", aplicarFiltros);
    limparFiltros.addEventListener("click", () => {
        busca.value = "";
        filtroPlataforma.value = "";
        filtroGenero.value = "";
        ordenacao.value = "maior-avaliacao";
        aplicarFiltros();
    });

    aplicarFiltros();
    carregarResumos();
    document.addEventListener("catalogoAtualizado", () => {
        aplicarFiltros();
        carregarResumos();
    });
});
