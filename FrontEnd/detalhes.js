document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('gamesGrid');
    // Edite o segundo campo para personalizar a descrição dos jogos locais.
    // Jogos importados recebem automaticamente a descrição breve da Steam.
    const locais = {
        1: [601150, 'Enfrente demônios com combos estilosos e diferentes caçadores em uma aventura de ação.'],
        2: [1962660, 'Entre em operações militares e combates de tiro em primeira pessoa.'],
        3: [2322010, 'Acompanhe Kratos e Atreus em uma jornada pelos reinos da mitologia nórdica.'],
        4: [null, 'Construa, explore e dispute partidas com amigos em diferentes modos de jogo.'],
        5: [271590, 'Explore Los Santos em uma aventura de mundo aberto com ação e crimes.'],
        6: [2531310, 'Uma jornada de sobrevivência e vingança em um mundo devastado.'],
        7: [null, 'Dispute rodadas de tiro tático combinando pontaria e habilidades de agentes.'],
        8: [1593500, 'Kratos e seu filho enfrentam criaturas e deuses em uma jornada nórdica.'],
        9: [945360, 'Complete tarefas e descubra os impostores antes que sabotem sua tripulação.'],
        10: [1938090, 'Combates de tiro em primeira pessoa no universo Call of Duty.'],
        11: [null, 'Jogo de futebol do catálogo local. Informações adicionais ainda não cadastradas.'],
        12: [2358720, 'Uma aventura de ação inspirada na mitologia chinesa e em Jornada ao Oeste.'],
        13: [1665460, 'Monte seu time e entre em campo em partidas de futebol.'],
        14: [359550, 'Planeje ataques e defesas em confrontos táticos entre equipes.'],
        15: [null, 'Explore mundos de blocos, reúna recursos e construa suas próprias aventuras.']
    };
    const texto = html => new DOMParser().parseFromString(String(html || '').replace(/<\/(p|h[1-6]|div)>|<br\s*\/?\s*>/gi, '\n'), 'text/html').body.textContent.trim();
    const criar = (tag, conteudo, classe) => {
        const el = document.createElement(tag);
        if (conteudo) el.textContent = conteudo;
        if (classe) el.className = classe;
        return el;
    };
    const urlSegura = value => {
        try { const url = new URL(value); return url.protocol === 'https:' ? url.href : ''; } catch { return ''; }
    };
    function prepararCards() {
        grid.querySelectorAll('.card-game').forEach(card => {
            if (card.dataset.detalhesProntos) return;
            card.dataset.detalhesProntos = 'true';
            const local = locais[card.dataset.id];
            if (local?.[0]) card.dataset.steamId = local[0];
            const descricao = texto(card.dataset.descricao || local?.[1]) || 'Abra os detalhes para conhecer este jogo.';
            card.dataset.descricao = descricao;
            const title = card.querySelector('.game-title');
            const button = criar('button', title.textContent, 'game-title-button');
            button.type = 'button';
            title.replaceChildren(button);
            title.after(criar('p', descricao, 'game-description'));
            const cover = card.querySelector('.card-img-container');
            cover.tabIndex = 0;
            cover.setAttribute('role', 'button');
            cover.setAttribute('aria-label', `Ver detalhes de ${title.textContent}`);
            cover.addEventListener('keydown', event => {
                if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); abrir(card); }
            });
        });
    }
    const dialog = criar('dialog', '', 'game-details-dialog');
    dialog.setAttribute('aria-labelledby', 'detailsTitle');
    const fechar = criar('button', 'Fechar ×', 'details-close');
    fechar.type = 'button';
    const content = criar('div');
    dialog.append(fechar, content);
    document.body.append(dialog);
    let controller;
    const players = new Set();
    let hlsPromise;
    function carregarPlayer() {
        if (window.Hls) return Promise.resolve(window.Hls);
        if (!hlsPromise) hlsPromise = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = `${window.API_BASE_URL}/vendor/hls.min.js`;
            script.onload = () => resolve(window.Hls);
            script.onerror = () => { hlsPromise = null; script.remove(); reject(new Error('Player indisponível')); };
            document.head.append(script);
        });
        return hlsPromise;
    }
    function pararVideos() {
        dialog.querySelectorAll('video').forEach(video => video.pause());
        players.forEach(player => player.destroy());
        players.clear();
    }
    fechar.onclick = () => dialog.close();
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => {
        controller?.abort();
        pararVideos();
        document.body.classList.remove('details-open');
    });
    async function json(url, signal) {
        const response = await fetch(`${window.API_BASE_URL}${url}`, { signal: AbortSignal.any([signal, AbortSignal.timeout(15000)]) });
        if (!response.ok) throw new Error('Indisponível');
        return response.json();
    }
    function secao(titulo) {
        const section = criar('section', '', 'details-section');
        section.append(criar('h3', titulo));
        content.append(section);
        return section;
    }
    async function abrir(card) {
        controller?.abort();
        pararVideos();
        controller = new AbortController();
        const signal = controller.signal;
        content.replaceChildren();
        const title = criar('h2', card.querySelector('.game-title').textContent);
        title.id = 'detailsTitle';
        const intro = criar('p', card.dataset.descricao, 'details-intro');
        content.append(title, intro);
        const steamSection = secao('Sobre o jogo');
        const localSection = secao('Avaliações do Pro Reviews');
        steamSection.append(criar('p', 'Carregando detalhes…', 'details-status'));
        localSection.append(criar('p', 'Carregando avaliações…', 'details-status'));
        if (!dialog.open) dialog.showModal();
        document.body.classList.add('details-open');
        fechar.focus();
        const carregarLocais = async () => {
            try {
                const data = await json(`/avaliacoes/jogo/${Number(card.dataset.id)}`, signal);
                if (signal.aborted) return;
                localSection.querySelector('p').remove();
                localSection.append(criar('p', data.avaliacoes.length ? 'Até 50 avaliações mais recentes da comunidade.' : 'Este jogo ainda não recebeu avaliações no Pro Reviews.'));
                data.avaliacoes.forEach(review => {
                    const item = criar('article', '', 'details-review');
                    item.append(criar('strong', `★ ${review.nota}/5`), criar('p', review.comentario || 'Avaliação sem comentário.'));
                    localSection.append(item);
                });
            } catch { if (!signal.aborted) localSection.querySelector('p').textContent = 'Não foi possível carregar as avaliações do Pro Reviews.'; }
        };
        const carregarSteam = async () => {
            if (!card.dataset.steamId) {
                steamSection.querySelector('p').textContent = 'Este título não possui integração com a Steam cadastrada. Imagens, vídeos e descrição ampliada ainda não estão disponíveis.';
                return;
            }
            try {
                const game = await json(`/jogos/steam/${card.dataset.steamId}`, signal);
                if (signal.aborted) return;
                steamSection.querySelector('p').remove();
                steamSection.append(criar('p', [game.desenvolvedores.join(', '), game.lancamento].filter(Boolean).join(' • ')));
                steamSection.append(criar('p', texto(game.descricao) || card.dataset.descricao, 'details-description'));
                const link = criar('a', 'Ver página completa na Steam', 'steam-link');
                link.href = `https://store.steampowered.com/app/${Number(card.dataset.steamId)}/`;
                link.target = '_blank'; link.rel = 'noopener noreferrer';
                steamSection.append(link);
                const gallery = criar('div', '', 'details-gallery');
                steamSection.append(criar('h3', 'Imagens do jogo'), gallery);
                (game.imagens || []).forEach((src, index) => {
                    if (!urlSegura(src)) return;
                    const a = criar('a'); a.href = urlSegura(src); a.target = '_blank'; a.rel = 'noopener noreferrer';
                    const img = criar('img'); img.src = a.href; img.alt = `${game.nome} — imagem ${index + 1}`; img.loading = 'lazy';
                    a.append(img); gallery.append(a);
                });
                if (!gallery.children.length) gallery.append(criar('p', 'Nenhuma imagem disponibilizada pela Steam.'));
                steamSection.append(criar('h3', 'Vídeos da Steam'));
                const videos = (game.videos || []).filter(video => urlSegura(video.url));
                if (!videos.length) steamSection.append(criar('p', 'Nenhum vídeo reproduzível disponível. Confira a página do jogo na Steam.'));
                videos.forEach(movie => {
                    steamSection.append(criar('p', movie.nome || 'Trailer / gameplay'));
                    const video = criar('video'); video.controls = true; video.preload = 'none'; video.playsInline = true;
                    video.poster = urlSegura(movie.capa);
                    video.addEventListener('error', () => { video.replaceWith(criar('p', 'Este vídeo não está disponível neste navegador. Acesse a página do jogo na Steam.')); }, { once: true });
                    steamSection.append(video);
                    if (movie.formato !== 'hls' || video.canPlayType('application/vnd.apple.mpegurl')) video.src = urlSegura(movie.url);
                    else {
                        carregarPlayer().then(Hls => {
                            if (signal.aborted) return;
                            if (!Hls?.isSupported()) throw new Error('Formato não suportado');
                            const player = new Hls({ autoStartLoad: false });
                            players.add(player);
                            player.loadSource(urlSegura(movie.url));
                            player.attachMedia(video);
                            video.addEventListener('play', () => player.startLoad(), { once: true });
                            player.on(Hls.Events.ERROR, (_event, data) => {
                                if (!data.fatal) return;
                                player.destroy(); players.delete(player);
                                video.replaceWith(criar('p', 'Não foi possível reproduzir este vídeo. Confira a página do jogo na Steam.'));
                            });
                        }).catch(() => {
                            if (!signal.aborted) video.replaceWith(criar('p', 'Player indisponível neste navegador. Confira o vídeo na página da Steam.'));
                        });
                    }
                });
                steamSection.append(criar('h3', 'Avaliações da Steam (português do Brasil)'));
                const reviews = game.avaliacoesSteam;
                if (!reviews) steamSection.append(criar('p', 'Avaliações da Steam indisponíveis no momento.'));
                else {
                    const summary = reviews.resumo || {};
                    const total = Number(summary.total_reviews) || 0;
                    steamSection.append(criar('p', total ? `${total.toLocaleString('pt-BR')} avaliações • ${Math.round(Number(summary.total_positive) / total * 100)}% positivas` : 'Nenhuma avaliação encontrada neste idioma.'));
                    reviews.comentarios.forEach(review => {
                        const item = criar('article', '', 'details-review');
                        item.append(criar('strong', `${review.recomenda ? 'Recomenda' : 'Não recomenda'} • ${review.horas} h jogadas`), criar('p', review.texto));
                        steamSection.append(item);
                    });
                }
            } catch {
                if (signal.aborted) return;
                steamSection.querySelector('p').textContent = 'Não foi possível carregar os detalhes da Steam.';
                const retry = criar('button', 'Tentar novamente', 'filter-btn');
                retry.type = 'button'; retry.onclick = () => abrir(card); steamSection.append(retry);
            }
        };
        await Promise.allSettled([carregarLocais(), carregarSteam()]);
    }
    grid.addEventListener('click', event => {
        if (event.target.closest('.card-img-container, .game-title-button')) abrir(event.target.closest('.card-game'));
    });
    prepararCards();
    document.addEventListener('catalogoAtualizado', prepararCards);
});
