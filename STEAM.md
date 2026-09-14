# Integração Steam

Requer Node.js 18+ e o MySQL configurado conforme `.env.example`.
Execute `npm install` e `npm start` na pasta `BackEnd` e abra
`http://localhost:3000/index2.html`. Execute `npm test` para verificar o serviço.

`GET /jogos/steam` carrega uma seleção inicial de dez jogos definida em
`BackEnd/services/steamService.js`, sem chave de API. A busca e os filtros
combinam os jogos locais com os jogos carregados; não pesquisam toda a Steam.
Gêneros não informados pela Steam não são inferidos. As plataformas da Steam
descrevem computadores, não disponibilidade em consoles.

Preços são consultados para Brasil em BRL. Preços indisponíveis ficam ao final
de ambas as ordenações por preço. As notas dos novos jogos são do Pro Reviews,
não importadas da Steam. IDs internos usam `1000000000 + appid`, preservando
as avaliações existentes dos jogos locais.

A Store API `https://store.steampowered.com/api/appdetails` é um endpoint sem
contrato público documentado, sujeito a alterações. A integração usa timeout,
no máximo duas consultas simultâneas e cache de 15 minutos (um minuto se parcial).
Falhas preservam o catálogo local e oferecem um botão para tentar novamente.

Verificação manual: combine nome, plataforma e gênero, teste as cinco ordenações
e Limpar filtros; confira a mensagem de nenhum resultado. Avalie um jogo Steam
com uma conta autenticada e confirme a atualização da nota. Sem conexão com a
Steam, confira a preservação do catálogo local e o botão de nova tentativa.
