function Entrar() { window.location.href = "login.html"; }

document.addEventListener("DOMContentLoaded", async () => {
    const token = sessionStorage.getItem("authToken");
    const entrar = document.getElementById("navBtnEntrar"), perfil = document.getElementById("navPerfil"), menu = document.querySelector(".profile-dropdown");
    if (token) {
        try {
            const resposta = await fetch(`${window.API_BASE_URL}/usuarios/me`, { headers: { Authorization: `Bearer ${token}` } });
            if (!resposta.ok) throw new Error("Sessão inválida");
            const { usuario } = await resposta.json();
            document.getElementById("navNomeUsuario").textContent = usuario.nome;
            document.getElementById("navEmailUsuario").textContent = usuario.email;
            entrar.style.display = "none"; perfil.style.display = "flex";
            perfil.addEventListener("click", (e) => { e.stopPropagation(); menu.classList.toggle("show"); });
            document.addEventListener("click", () => menu.classList.remove("show"));
        } catch { sessionStorage.removeItem("authToken"); }
    }
    document.getElementById("navBtnSair")?.addEventListener("click", () => { sessionStorage.removeItem("authToken"); window.location.href = "login.html"; });
});

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("reviewModal");
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
            if (!resumo) return;

            const media = Number(resumo.media).toFixed(1);
            const quantidade = Number(resumo.quantidade).toLocaleString("pt-BR");
            card.querySelector(".rating-badge").textContent = `★ ${media}`;
            card.querySelector(".stars").textContent = "★".repeat(Math.round(Number(resumo.media))) + "☆".repeat(5 - Math.round(Number(resumo.media)));
            card.querySelector(".reviews-count").textContent = `(${quantidade} avaliações)`;
        });
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

    document.querySelectorAll(".btn-card-action").forEach((button) => {
        button.addEventListener("click", () => {
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

    carregarResumos();
});
