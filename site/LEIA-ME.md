# Site Marcus Moreno · Estudos do presente

Site estático: abra `index.html` no navegador. O conceito de arte está em `conceito.html`.
Para colocar no ar, siga o checklist em `PUBLICAR.md`: edite sempre esta pasta e gere a versão de publicação com `python ferramentas/gerar-publicacao.py` (ela sai na pasta `publicar`, ao lado desta).

## Ver com os vídeos funcionando

Aberto direto do disco (dois cliques no `index.html`), o YouTube recusa o player e mostra “Erro 153”, porque exige saber o endereço da página. Nesse caso o site abre cada vídeo numa aba do YouTube.

Para ver os vídeos dentro do site no seu computador, dê dois cliques em `abrir-site.bat` (precisa do Python). Ele abre o site em `http://localhost:8000`; feche a janela preta para encerrar. Publicado num endereço web, os vídeos tocam normalmente, sem nada disso.

## Onde editar

- **Textos e obras:** tudo está em `index.html`, em português, com comentários marcando cada seção (I a X).
- **Acervo (o mural antes do Contato):** as imagens, a ordem, os links e as legendas ficam em `ferramentas/gerar-mural.py`. Para trocar, tirar ou acrescentar uma imagem, edite a lista `FAIXAS` e rode `python ferramentas/gerar-mural.py`: ele recorta tudo no mesmo formato em `assets/img/mural/` e reescreve o mural no `index.html`. A velocidade de cada faixa está em `DURACOES`.
- **Nova obra:** copie um bloco `<article class="obra ...">` dentro da seção `#criacoes` e troque ano, título, fotos e o código do vídeo do YouTube (`data-video`, os 11 caracteres depois de `v=`).
- **Nova entrevista:** copie um `<li class="conversa">` na lista `data-rede` (a galeria lateral das Entrevistas) e troque pessoa, quadro (pasta `assets/img/quadros/`), vídeo e nome. Ajuste o total no contador (`01 / 06`). O diagrama da rede é redesenhado sozinho a partir dessa lista.
- **Trajetória:** cada ano é um `<li class="marco">` na galeria lateral da seção; para acrescentar, copie um e ajuste o total no contador.
- **Galerias laterais (Entreato, Entrevistas, Trajetória):** qualquer bloco com `data-lateral` para na tela e anda para o lado sozinho enquanto a pessoa rola para baixo, no computador e no celular (só quem pede movimento reduzido no sistema desliza com o dedo). O movimento está em `js/main.js` (galerias laterais) e o estilo em `css/laterais.css`.
- **Agora (agenda):** a faixa logo após a epígrafe lista o que está acontecendo. Edite só o arquivo `js/agenda.js`: cada item é um bloco `{ ... }` com tipo, data, título e detalhe. Itens com `ate` (último dia) somem sozinhos depois da data; sem nenhum item, a faixa some.
- **Entreato (galeria lateral):** a seção `#entreato`, entre as obras e os Encontros Efêmeros. Cada foto é um `<figure class="entreato__foto">`; use `entreato__foto--v` para fotos verticais, `entreato__foto--h` para horizontais e acrescente `entreato__foto--baixo` para alinhar uma horizontal embaixo. Lembre de trocar o total no contador (`01 / 08`). O caminho lateral é medido sozinho pelo `main.js`.
- **Encontros Efêmeros:** cada encontro é um `<li data-pessoa="..." data-quadro="...">` na lista `data-efemeros`. Quem não estiver nas entrevistas entra sozinho no anel de fora da rede.
- **Quadro que cresce:** na obra *Entre-espaço*, o bloco `<div class="expande" data-expande>` faz o quadro começar pequeno e crescer até a tela cheia com a rolagem. O tamanho inicial (`--s0`, a fração da tela: 0.13 no computador, 0.3 no celular) e a altura do centro (`--cy`) ficam em `css/obras.css`; o caminho de rolagem, em `.expande.is-viva { height: 290svh; }` (no fim do arquivo). Para usar em outra obra, copie o bloco e troque a imagem.
- **Telões (vídeos de fundo):** a Epígrafe, os Encontros Efêmeros, as Danças de Presente e Na imprensa têm um trecho de vídeo de Marcus atrás do texto, no `<div class="telao" data-video="...">` logo no começo da seção. Os trechos originais (de 14 a 22 segundos, baixados do YouTube com o `yt-dlp`) ficam em `ferramentas/videos/`; `python ferramentas/gerar-teloes.py` faz a sépia, a câmera lenta, o rastro e o loop, e salva o vídeo em `assets/video/` e o quadro parado em `assets/img/teloes/`. O vídeo só carrega quando a seção se aproxima e só toca enquanto ela está na tela (`js/imersao.js`). A força do véu é o `--veu` em `css/secoes.css`, no bloco “telões” (quanto mais alto, mais apagado o vídeo); o ponto da imagem que fica à vista no celular é o `--foco` no `<div class="telao__quadro">`. Para tirar um vídeo, apague o `<div class="telao">` da seção.
- **Obra em tela cheia:** acrescentar `obra--tela-cheia` à classe de um `<article class="obra ...">` faz a foto ocupar a tela inteira, com o texto por cima (hoje só em *Sempre mais que um*). Use fotos de pelo menos 2000 px de largura.
- **Sinopse e ficha técnica:** dentro de cada obra, no bloco `<details class="obra__mais">`.
- **Sobre:** a primeira frase (`sobre__lead`) fica à vista; o resto da biografia está dentro do `<details class="sobre__mais">`, o “Ler mais”.
- **Entrada:** a tela em que o nome se escreve sobre o vídeo das Danças de Presente (`assets/video/presente-key.mp4`, o mesmo da seção) e os botões “Entrar com som” e “Entrar em silêncio” abrem o site aparece uma vez por visita; para ver de novo, abra o site com `?entrada` no fim do endereço (por exemplo `index.html?entrada`). O comportamento está em `js/imersao.js`; o tempo da escrita, em `css/imersao.css` (`.carregando__nome`).
- **Cena de Instante-já:** o bloco `<div class="cena-instante">` antes da obra. As perguntas são os `<li>`; a foto é a `<img>`. A altura da cena (quanto se rola até passar as três perguntas) está em `css/imersao.css` (`.cena-instante.is-viva { height: 340vh; }`); no fim, a foto se desfaz em desfoque até o escuro do palco (o trecho final é o `--fim`, no mesmo arquivo).
- **Som:** o botão “Som” do topo liga a música gerada em `js/som.js`. As notas ficam na lista `NOTAS` (em hertz) e o volume em `VOLUME`; o caráter de cada parte do site (grave, oitavas, espaço entre as notas) fica em `CENAS`, e qual seção usa qual cena, em `CENA_DA_SECAO`. Para tirar o som, apague o `<button class="topo__som">` e a linha do `som.js` no fim do `index.html`.
- **Textos:** a dissertação abre a seção (`<article class="tese">`); os outros textos estão em três grupos (Pesquisa, Crítica e reflexão, Gestão cultural). Para acrescentar, copie um `<li class="biblio__item">` no grupo certo: ano, título em `<cite>`, e uma linha com onde saiu e com quem. Se o texto estiver na internet, use `biblio__item biblio__item--link`, envolva o título em `<a class="biblio__titulo" href="..." target="_blank" rel="noopener">` e acrescente `<span class="biblio__ler" aria-hidden="true">Ler o texto</span>`; a linha inteira vira o link. Quando a dissertação sair no repositório da Unicamp, vale fazer o mesmo com ela.
- **Material de difusão (programadores, espanhol e inglês):** as páginas `programadores.html`, `es.html` e `en.html` são geradas a partir de um só arquivo, `ferramentas/gerar-kit.py`, que guarda o release, as obras e os contatos nas três línguas. Mude o texto lá e rode `python ferramentas/gerar-kit.py`; depois dê dois cliques em `ferramentas/gerar-pdf.bat` para refazer os PDFs do release (precisa do Chrome). Não edite essas três páginas à mão: a próxima geração apaga a mudança.
- **Imprensa:** cada matéria é um `<li>` na lista `clipping`; quando houver link, o título pode virar `<a href="...">`.
- **Cores e fontes:** variáveis no topo de `css/base.css`. A cor de destaque (bistre) é `--destaque` no papel e `--destaque-claro` no escuro; a cor dos títulos é `--cor-titulo`, úmbria no papel e kraft no escuro. O fundo das seções escuras é `--palco` (marrom profundo). Mudando esses valores, o site inteiro acompanha.

## Arquivos

- `css/fontes.css` · as fontes, hospedadas no próprio site (`assets/fontes/`), sem chamadas ao Google
- `css/base.css` · cores, tipografia, topo, índice, abertura, revelação das fotos
- `css/obras.css` · Criações cênicas: as obras, o botão assistir, o vídeo dentro da obra, capítulos
- `css/secoes.css` · as demais seções (sobre, encontros, entrevistas, danças de presente, curadoria, textos, trajetória, imprensa, contato)
- `css/acervo.css` · o mural do Acervo, antes do Contato
- `css/laterais.css` · as galerias com rolagem lateral das Entrevistas e da Trajetória
- `css/programadores.css` · as páginas de difusão e o PDF do release
- `css/entreato.css` · a galeria com rolagem lateral
- `css/conceito.css` · só o caderno de conceito
- `js/main.js` · movimento (blecaute, numerais, revelações, rede, quadros das entrevistas, vídeos, rolagem lateral do Entreato)
- `js/agenda.js` · a agenda da faixa “Agora” (o arquivo para atualizar)
- `js/imersao.js` e `css/imersao.css` · o carregamento (o nome se escrevendo) e a cena de Instante-já
- `js/som.js` · a música gerada na hora, ligada pelo botão “Som”
- `js/mouse.js` · gestos do mouse nas fotos, só no computador: água e paralaxe (o cursor é o normal do sistema)
- `assets/img/` · fotos otimizadas em WebP (versão de 2000 px e de 1000 px para celular). Para acrescentar uma foto, converta para WebP (qualidade 80) antes de usar
- `assets/marca/` · assinatura MM em bistre, nanquim e cal, o ícone da aba e o nome escrito à mão da entrada, do topo e do rodapé (`nome-tinta.svg`, usado como máscara: a cor vem do CSS), o ícone do iPhone e a imagem de prévia para compartilhar (`compartilhar.jpg`)
- `assets/imprensa/` · os downloads da área de difusão: releases em PDF (pt, es, en), fotos em alta com crédito e a assinatura
- `ferramentas/` · os geradores do mural do Acervo (`gerar-mural.py`), das páginas de difusão, dos PDFs e da versão de publicação (`gerar-publicacao.py`)
- `404.html`, `robots.txt`, `sitemap.xml` · para a publicação (ver `PUBLICAR.md`)

As fotos originais continuam em `../Fotos`.
