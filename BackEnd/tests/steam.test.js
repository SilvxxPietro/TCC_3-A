const { test } = require('node:test');
const assert = require('node:assert/strict');
const { normalizarJogo, carregarCatalogo } = require('../services/steamService');

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
    assert.equal(requests, 10);
});
