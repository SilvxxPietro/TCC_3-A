// Catálogo inicial: a Store API não documentada pode mudar sem aviso.
// IDs internos separados dos 1–15 já utilizados pelas avaliações locais.
const APP_IDS = [570, 730, 620, 400, 440, 550, 413150, 1091500, 1245620, 1086940, 105600, 292030, 1145360, 367520, 1172470, 252490, 892970, 1966720, 1623730, 227300, 255710, 646570, 250900, 588650];
const detalhesCache = new Map();
const detalhesPending = new Map();
let cache;
let pending;

function normalizarJogo(data) {
    if (data.type !== 'game') return null;
    return {
        id: 1000000000 + data.steam_appid,
        steamId: data.steam_appid,
        nome: data.name,
        imagem: data.header_image,
        descricaoBreve: data.short_description || '',
        generos: (data.genres || []).map(item => item.description),
        plataformas: ['PC', ...(data.platforms?.mac ? ['Mac'] : []), ...(data.platforms?.linux ? ['Linux'] : [])],
        preco: data.is_free ? 0 : data.price_overview?.currency === 'BRL' ? data.price_overview.final / 100 : null
    };
}

async function carregarCatalogo(fetcher = fetch) {
    if (cache && Date.now() < cache.expires) return cache.value;
    if (pending) return pending;
    pending = (async () => {
        const jogos = [];
        // Concorrência limitada e cache para evitar rajadas contra a Steam.
        for (let i = 0; i < APP_IDS.length; i += 4) {
            const results = await Promise.allSettled(APP_IDS.slice(i, i + 4).map(async id => {
                const response = await fetcher(`https://store.steampowered.com/api/appdetails?appids=${id}&cc=br&l=brazilian`, { signal: AbortSignal.timeout(5000) });
                if (!response.ok) throw new Error('Steam indisponível');
                const body = await response.json();
                if (!body[id]?.success) throw new Error('Jogo indisponível');
                return normalizarJogo(body[id].data);
            }));
            for (const result of results) if (result.status === 'fulfilled' && result.value) jogos.push(result.value);
        }
        if (!jogos.length) {
            if (cache) return { ...cache.value, desatualizado: true };
            throw new Error('Não foi possível consultar a Steam.');
        }
        const value = { jogos, parcial: jogos.length < APP_IDS.length };
        cache = { value, expires: Date.now() + (value.parcial ? 60000 : 900000) };
        return value;
    })();
    try { return await pending; } finally { pending = null; }
}

async function carregarDetalhes(id, fetcher = fetch) {
    if (!Number.isSafeInteger(id) || id < 1 || id > 999999999) throw new Error('ID inválido');
    const cached = detalhesCache.get(id);
    if (cached && cached.expires > Date.now()) return cached.value;
    if (detalhesPending.has(id)) return detalhesPending.get(id);
    const request = (async () => {
        const [app, reviews] = await Promise.allSettled([
            fetcher(`https://store.steampowered.com/api/appdetails?appids=${id}&cc=br&l=brazilian`, { signal: AbortSignal.timeout(8000) }).then(async res => {
                if (!res.ok) throw new Error('Steam indisponível');
                const body = await res.json();
                if (!body[id]?.success || body[id].data.type !== 'game') throw new Error('Jogo indisponível');
                return body[id].data;
            }),
            fetcher(`https://store.steampowered.com/appreviews/${id}?json=1&language=brazilian&filter=all&purchase_type=all&num_per_page=6`, { signal: AbortSignal.timeout(8000) }).then(async res => {
                if (!res.ok) throw new Error('Avaliações indisponíveis');
                const body = await res.json();
                if (body.success !== 1) throw new Error('Avaliações indisponíveis');
                return body;
            })
        ]);
        if (app.status === 'rejected') throw app.reason;
        const data = app.value;
        const value = {
            ...normalizarJogo(data), descricao: data.about_the_game || data.detailed_description || data.short_description || '',
            desenvolvedores: data.developers || [], lancamento: data.release_date?.date || '',
            imagens: (data.screenshots || []).map(item => item.path_full),
            videos: (data.movies || []).map(item => ({ nome: item.name, capa: item.thumbnail, url: item.hls_h264 || item.mp4?.max || item.mp4?.['480'] || item.webm?.max || item.webm?.['480'], formato: item.hls_h264 ? 'hls' : 'arquivo' })).filter(item => item.url),
            avaliacoesSteam: reviews.status === 'fulfilled' ? {
                resumo: reviews.value.query_summary,
                comentarios: (reviews.value.reviews || []).map(item => ({ texto: item.review, recomenda: item.voted_up, horas: Math.round((item.author?.playtime_forever || 0) / 60) }))
            } : null
        };
        if (detalhesCache.size >= 100) detalhesCache.delete(detalhesCache.keys().next().value);
        detalhesCache.set(id, { value, expires: Date.now() + (value.avaliacoesSteam ? 900000 : 60000) });
        return value;
    })();
    detalhesPending.set(id, request);
    try { return await request; } finally { detalhesPending.delete(id); }
}

module.exports = { carregarCatalogo, normalizarJogo, carregarDetalhes, APP_IDS };
