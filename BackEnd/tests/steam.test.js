const { test } = require('node:test');
const assert = require('node:assert/strict');
const { normalizarJogo, carregarCatalogo, carregarDetalhes, APP_IDS } = require('../services/steamService');

test('preços BRL, jogos grátis e preços desconhecidos permanecem distintos', () => {
    const base = { type: 'game', steam_appid: 570, name: 'Dota', genres: [] };
    assert.equal(normalizarJogo({ ...base, is_free: true }).preco, 0);
    assert.equal(normalizarJogo(base).preco, null);
    assert.equal(normalizarJogo({ ...base, price_overview: { currency: 'USD', final: 999 } }).preco, null);
    assert.equal(normalizarJogo({ ...base, price_overview: { currency: 'BRL', final: 1999 } }).preco, 19.99);
    assert.equal(normalizarJogo(base).id, 1000000570);
    assert.equal(normalizarJogo({ ...base, type: 'dlc' }), null);
});

test('falha total permite nova tentativa; resultado parcial é armazenado em cache', async () => {
    await assert.rejects(carregarCatalogo(async () => { throw new Error('offline'); }));
    let requests = 0;
    const fetcher = async url => {
        requests++;
        const id = Number(new URL(url).searchParams.get('appids'));
        return { ok: true, json: async () => ({ [id]: id === 570 ? { success: true, data: { type: 'game', steam_appid: id, name: 'Dota', is_free: true } } : { success: false } }) };
    };
    const [a, b] = await Promise.all([carregarCatalogo(fetcher), carregarCatalogo(fetcher)]);
    assert.equal(a.jogos.length, 1);
    assert.equal(a.parcial, true);
    assert.deepEqual(a, b);
    await carregarCatalogo(fetcher);
    assert.equal(requests, APP_IDS.length);
});

test('detalhes preservam mídias e funcionam mesmo quando avaliações falham', async () => {
    const jogo = { type: 'game', steam_appid: 123, name: 'Teste', short_description: 'Breve', about_the_game: '<p>Completa</p>', screenshots: [{ path_full: 'https://example.com/img.jpg' }], movies: [{ name: 'Gameplay', mp4: { 480: 'https://example.com/video.mp4' } }, { name: 'Sem arquivo' }] };
    const fetcher = async url => {
        if (url.includes('appreviews')) throw new Error('offline');
        return { ok: true, json: async () => ({ 123: { success: true, data: jogo } }) };
    };
    const result = await carregarDetalhes(123, fetcher);
    assert.equal(result.descricaoBreve, 'Breve');
    assert.equal(result.descricao, '<p>Completa</p>');
    assert.equal(result.imagens.length, 1);
    assert.equal(result.videos.length, 1);
    assert.equal(result.avaliacoesSteam, null);
    await assert.rejects(carregarDetalhes(-1, fetcher));
});

test('detalhes normalizam avaliações e compartilham chamadas concorrentes', async () => {
    let calls = 0;
    const fetcher = async url => {
        calls++;
        return { ok: true, json: async () => url.includes('appreviews') ? { success: 1, query_summary: { total_reviews: 1, total_positive: 1 }, reviews: [{ review: 'Ótimo', voted_up: true, author: { playtime_forever: 120 } }] } : { 124: { success: true, data: { type: 'game', steam_appid: 124 } } } };
    };
    const [a, b] = await Promise.all([carregarDetalhes(124, fetcher), carregarDetalhes(124, fetcher)]);
    assert.deepEqual(a, b);
    assert.equal(a.avaliacoesSteam.comentarios[0].horas, 2);
    await carregarDetalhes(124, fetcher);
    assert.equal(calls, 2);
});

test('vídeos atuais em HLS são incluídos nos detalhes', async () => {
    const fetcher = async url => ({ ok: true, json: async () => url.includes('appreviews') ? { success: 1, reviews: [] } : { 125: { success: true, data: { type: 'game', steam_appid: 125, movies: [{ name: 'Gameplay', hls_h264: 'https://example.com/master.m3u8' }] } } } });
    const result = await carregarDetalhes(125, fetcher);
    assert.equal(result.videos[0].formato, 'hls');
    assert.equal(result.videos[0].url, 'https://example.com/master.m3u8');
});
