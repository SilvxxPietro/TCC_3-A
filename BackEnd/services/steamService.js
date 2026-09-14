// Catálogo inicial: a Store API não documentada pode mudar sem aviso.
// IDs internos separados dos 1–15 já utilizados pelas avaliações locais.
const APP_IDS = [570, 730, 620, 400, 440, 550, 413150, 1091500, 1245620, 1086940];
let cache;
let pending;

function normalizarJogo(data) {
    if (data.type !== 'game') return null;
    return {
        id: 1000000000 + data.steam_appid,
        steamId: data.steam_appid,
        nome: data.name,
        imagem: data.header_image,
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
        // Duas requisições simultâneas para evitar rajadas contra a Steam.
        for (let i = 0; i < APP_IDS.length; i += 2) {
            const results = await Promise.allSettled(APP_IDS.slice(i, i + 2).map(async id => {
                const response = await fetcher(`https://store.steampowered.com/api/appdetails?appids=${id}&cc=br&l=portuguese`, { signal: AbortSignal.timeout(5000) });
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

module.exports = { carregarCatalogo, normalizarJogo };
