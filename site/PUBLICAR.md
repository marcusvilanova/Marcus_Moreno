# Checklist para colocar o site no ar

O site é estático (HTML, CSS, JavaScript e imagens): serve qualquer hospedagem simples, como Netlify, Vercel, GitHub Pages, Cloudflare Pages ou a hospedagem do próprio domínio. Não envie a pasta `site`, que é a de trabalho. Gere a versão de publicação e envie a pasta `publicar`, com `index.html` na raiz do domínio:

```
python ferramentas/gerar-publicacao.py
```

Ela junta os estilos e o código da página inicial em um arquivo cada (a página abre mais rápido) e deixa de fora o que é só de trabalho: ferramentas, LEIA-ME, este checklist e o caderno de conceito, que tem as pendências internas. Para publicar o caderno também, rode com `--com-conceito`. No Netlify Drop, basta arrastar a pasta `publicar`.

## Antes de publicar

- [ ] **Conversa com o Marcus:** levar a lista “Para Marcus confirmar” do `conceito.html` (créditos de fotos, legendas escritas provisoriamente, links que faltam, ano de *Entre-espaço*, nome do festival argentino, título no Portal MUD).
- [ ] **Traduções:** pedir a alguém de língua espanhola e a alguém de língua inglesa uma leitura de `es.html` e `en.html` (o texto está em `ferramentas/gerar-kit.py`).
- [ ] **Rider técnico:** se o Marcus tiver riders e mapas de luz em PDF, colocar em `assets/imprensa/` e citar em `ferramentas/gerar-kit.py`. Hoje a página diz “sob consulta com a produção”.

## Ao ter o domínio (troque `SEU-DOMINIO` pelo endereço, sem `https://` no fim)

- [ ] `index.html`: no `og:image`, trocar `assets/marca/compartilhar.jpg` por `https://SEU-DOMINIO/assets/marca/compartilhar.jpg`. Sem o endereço completo, WhatsApp e Instagram mostram o link sem foto.
- [ ] `ferramentas/gerar-kit.py`: a mesma troca no `og:image` das páginas de difusão; depois rodar `python ferramentas/gerar-kit.py`.
- [ ] Depois de qualquer troca, gerar de novo a pasta `publicar` (`python ferramentas/gerar-publicacao.py`).
- [ ] `robots.txt` e `sitemap.xml`: trocar `SEU-DOMINIO` em todas as linhas.
- [ ] Na hospedagem, indicar `404.html` como página de erro (na maioria delas isso é automático). A 404 usa endereços que começam com `/`, então o site precisa estar na raiz do domínio, não numa subpasta.

## Depois de publicar

- [ ] Abrir no **iPhone (Safari)** e conferir: a entrada (o nome se escrevendo sobre o vídeo e os botões “Entrar com som” e “Entrar em silêncio”; conferir se a música começa ao entrar com som), as fotos da capa se fundindo, o mural do Acervo antes do Contato andando (e tocar numa imagem levando à obra ou ao vídeo), as três galerias laterais (Entreato, Entrevistas, Trajetória: a faixa deve andar para o lado sozinha enquanto se rola para baixo, sem saltos quando a barra de endereço some), a cena de *Instante-já*, o quadro de *Entre-espaço* crescendo até a tela cheia, os vídeos de fundo (Epígrafe, Encontros Efêmeros, Danças de Presente e Na imprensa: tocam sem som e devagar, ficam parados enquanto o texto passa e param quando a seção sai da tela; no modo de economia de bateria do iPhone, fica a imagem parada), a entrada das fotos com o fio e a cortina, as miniaturas dos Encontros Efêmeros e o botão Som.
- [ ] Mandar o link para si mesmo no WhatsApp e ver se a prévia aparece com a foto do palco.
- [ ] Cadastrar o site no Google Search Console e enviar o `sitemap.xml`.
- [ ] Testar um vídeo: publicado, o YouTube toca dentro do site (o “Erro 153” só acontece abrindo o arquivo direto do disco).
