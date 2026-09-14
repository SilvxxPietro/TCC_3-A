document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("gamesGrid");
    const status = document.getElementById("statusSteam");
    const retry = document.getElementById("tentarSteam");
    async function carregar() {
        retry.hidden = true;
        status.textContent = "Carregando jogos da Steam...";
        try {
            const response = await fetch(`${window.API_BASE_URL}/jogos/steam`, { signal: AbortSignal.timeout(30000) });
            const data = await response.json();
            if (!response.ok) throw new Error("Steam indisponível");
            for (const jogo of data.jogos) {
                if (grid.querySelector(`[data-id="${Number(jogo.id)}"]`)) continue;
                const card = document.createElement("article");
                card.className = "card-game";
                card.dataset.id = jogo.id;
                card.dataset.preco = jogo.preco === null ? "indisponivel" : String(jogo.preco);
                card.innerHTML = '<div class="card-img-container"><img loading="lazy"><span class="badge-tag"></span><span class="rating-badge">Sem nota</span></div><div class="card-content"><h3 class="game-title"></h3><div class="game-meta"><span class="game-platform"></span><span class="game-price"></span></div><div class="rating-box"><div class="stars">☆☆☆☆☆</div><span class="reviews-count">(0 avaliações)</span></div><a class="steam-link" target="_blank" rel="noopener noreferrer">Ver na Steam</a><button class="btn-card-action" type="button">⭐ Avaliar Jogo</button></div>';
                card.querySelector("img").src = jogo.imagem;
                card.querySelector("img").alt = jogo.nome;
                card.querySelector(".game-title").textContent = jogo.nome;
                card.querySelector(".badge-tag").textContent = jogo.generos.join(" / ") || "Sem gênero";
                card.querySelector(".game-platform").textContent = jogo.plataformas.join(" • ");
                card.querySelector(".game-price").textContent = jogo.preco === null ? "Preço indisponível" : jogo.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
                card.querySelector(".steam-link").href = `https://store.steampowered.com/app/${Number(jogo.steamId)}/`;
                grid.appendChild(card);
            }
            status.textContent = `${data.jogos.length} jogos da Steam carregados. Busca e filtros se aplicam aos jogos exibidos. Notas e avaliações são do Pro Reviews.`;
            if (data.parcial || data.desatualizado) {
                status.textContent += " Alguns dados estão indisponíveis ou em cache.";
                retry.hidden = false;
            }
            document.dispatchEvent(new Event("catalogoAtualizado"));
        } catch {
            status.textContent = "Não foi possível carregar a Steam. O catálogo local continua disponível.";
            retry.hidden = false;
        }
    }
    retry.addEventListener("click", carregar);
    carregar();
});
