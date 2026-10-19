# Catálogo e detalhes dos jogos

Requer Node.js 18+ e MySQL configurado conforme `.env.example`. Execute `npm install` na pasta `BackEnd` para instalar as dependências, incluindo o player de vídeo.

Inicie o backend na pasta `BackEnd` com `npm start` (`npm.cmd start` no PowerShell se a execução de scripts estiver desabilitada). Acesse `http://localhost:3000/index2.html`. Reinicie o backend após alterar os arquivos do servidor.

- O catálogo consulta os 24 IDs em `BackEnd/services/steamService.js`, na constante `APP_IDS`. Para incluir outro jogo, acrescente seu App ID (o número da URL da loja Steam).
- A descrição breve dos jogos importados vem de `short_description`. Para personalizar a descrição dos jogos locais, edite o segundo campo de cada entrada de `locais` em `FrontEnd/detalhes.js`. O primeiro campo é o App ID da Steam ou `null` quando não há vínculo cadastrado. Os IDs locais permanecem preservados para manter as avaliações existentes.
- Capa e título abrem os detalhes. A janela pode ser fechada pelo botão Fechar ou pela tecla Escape. Imagens abrem em tamanho maior em outra aba.
- As avaliações do Pro Reviews vêm do banco configurado no projeto e mostram até 50 comentários recentes. As avaliações da Steam exibem um resumo e até seis comentários em português brasileiro, separados das notas locais.
- Vídeos são os trailers/gameplays retornados pela Steam em HLS, MP4 ou WebM. O player HLS.js é instalado pelo npm e servido pelo próprio backend. Não há garantia de gameplay para todos os títulos. Quando nenhuma mídia reproduzível é retornada, a janela oferece acesso à página da loja. Referência do player: https://github.com/video-dev/hls.js
- O catálogo mantém três colunas, inclusive em telas pequenas. A última linha pode ficar incompleta quando a quantidade de resultados não for múltipla de três, mantendo a largura dos cards.

O servidor limita a concorrência e mantém cache temporário. A Store API de detalhes não tem contrato público estável; falhas têm mensagens e opção de tentar novamente. Referência das avaliações: https://partner.steamgames.com/doc/store/getreviews

`GET /jogos/steam` consulta a seleção de jogos sem exigir chave de API. Busca e filtros atuam sobre o catálogo carregado, não sobre toda a Steam. Preços são consultados em BRL para o Brasil; preços desconhecidos continuam no fim da ordenação. Plataformas da Steam representam computadores, não disponibilidade em consoles. IDs internos dos jogos importados usam `1000000000 + appid`. O catálogo usa até quatro consultas simultâneas e cache de 15 minutos (um minuto se parcial).

Verificação manual: combine busca, plataforma e gênero; teste as ordenações e Limpar filtros. Abra um jogo pela capa e pelo título, navegue pelas imagens, reproduza um vídeo e feche com Escape. Avalie um jogo com uma conta autenticada e abra os detalhes novamente para conferir o comentário. Sem conexão, confira as mensagens e a opção de tentar novamente.

Validação automatizada: `cd BackEnd` e `npm test` (ou `npm.cmd test`).
