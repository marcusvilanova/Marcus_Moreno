/* Percurso: a ordem das páginas, para quem quer atravessar o site inteiro.
   Desta lista saem a faixa "A seguir" no fim de cada página, as duas portas da página inicial,
   as descrições do Índice, a página atual marcada nele e a posição no topo ("4 de 12").
   Para mudar a ordem, uma descrição ou uma imagem (de assets/img/mural/), edite só a lista PERCURSO. */
(() => {
  const PERCURSO = [
    { pagina: 'sobre', titulo: 'Sobre', linha: 'Formação e pesquisa de Marcus Moreno.', imagem: 'retrato-25.webp' },
    { pagina: 'criacoes', titulo: 'Criações cênicas', linha: 'Oito obras, de 2024 a 2013, com vídeos e fichas.', imagem: 'onde-houver-ceu-1.webp' },
    { pagina: 'entreato', titulo: 'Entreato', linha: 'Fotografias de cena, de ensaio e de rua.', imagem: 'retrato-07.webp' },
    { pagina: 'efemeros', titulo: 'Encontros Efêmeros', linha: 'Dois artistas dividem a cena num encontro inédito.', imagem: 'efemero-cora.webp' },
    { pagina: 'entrevistas', titulo: 'Entrevistas-performativas', linha: 'Conversas-dançadas em vídeo com artistas convidados.', imagem: 'entrevista-vera.webp' },
    { pagina: 'presente', titulo: 'Danças de Presente', linha: 'Improvisações criadas como agradecimento.', imagem: 'retrato-24.webp' },
    { pagina: 'curadoria', titulo: 'Projetos curatoriais', linha: 'Encontros e projetos de dança com curadoria de Marcus.', imagem: 'img-1639.webp' },
    { pagina: 'textos', titulo: 'Textos', linha: 'A dissertação de mestrado e os artigos da pesquisa.', imagem: 'estudo-encontro-1.webp' },
    { pagina: 'trajetoria', titulo: 'Trajetória', linha: 'Criação, gestão e pesquisa, um ano depois do outro.', imagem: 'fvp-8603.webp' },
    { pagina: 'imprensa', titulo: 'Na imprensa', linha: 'Matérias e críticas sobre o trabalho de Marcus.', imagem: 'instante-ja-1.webp' },
    { pagina: 'acervo', titulo: 'Acervo', linha: 'Um mural com imagens de todas as obras.', imagem: 'flor-casa-caldeiras.webp' },
    { pagina: 'contato', titulo: 'Contato', linha: 'Produção, redes e material para programadores.', imagem: 'fvp-8547.webp' },
  ];
  const INICIO = { pagina: 'index', titulo: 'Início', linha: 'A capa e a agenda do que está acontecendo agora.', imagem: 'instante-ja-2.webp' };

  const nomeDaPagina = (endereco) => (endereco.split('#')[0].split('/').pop() || 'index').replace(/\.html$/, '') || 'index';
  const atual = nomeDaPagina(location.pathname);
  const posicao = PERCURSO.findIndex((p) => p.pagina === atual);
  const total = PERCURSO.length;
  const link = (p) => (p.pagina === 'index' ? 'index.html' : `${p.pagina}.html`);
  const imagem = (p) => `assets/img/mural/${p.imagem}`;

  function el(tag, classe, texto) {
    const e = document.createElement(tag);
    if (classe) e.className = classe;
    if (texto) e.textContent = texto;
    return e;
  }

  /* ---------- fim de cada página: a próxima seção, como o próximo ato ---------- */

  // o título da próxima seção com uma seta, que anda um pouco quando o mouse passa
  function titulo(texto) {
    const t = el('span', 'seguir__titulo', `${texto} `);
    const seta = el('span', 'seguir__seta', '→');
    seta.setAttribute('aria-hidden', 'true');
    t.append(seta);
    return t;
  }

  function faixaSeguir() {
    const rodape = document.querySelector('.colofao');
    if (posicao < 0 || !rodape) return;
    const proxima = PERCURSO[posicao + 1] || INICIO;
    const anterior = PERCURSO[posicao - 1] || INICIO;

    const faixa = el('nav', 'seguir');
    faixa.setAttribute('aria-label', 'Percurso pelo site');
    faixa.dataset.tone = 'dark';

    const principal = el('a', 'seguir__proxima');
    principal.href = link(proxima);
    const texto = el('span', 'seguir__texto');
    texto.append(
      el('span', 'rotulo seguir__rotulo', proxima === INICIO ? 'Fim do percurso · voltar ao' : 'A seguir'),
      titulo(proxima.titulo),
      el('span', 'seguir__linha', proxima.linha),
    );
    const foto = el('img', 'seguir__imagem');
    Object.assign(foto, { src: imagem(proxima), alt: '', width: 512, height: 640, loading: 'lazy', decoding: 'async' });
    principal.append(texto, foto);

    const outros = el('p', 'seguir__outros');
    const voltar = el('a', 'seguir__anterior');
    voltar.append(el('span', 'seguir__seta seguir__seta--volta', '←'), ` Anterior: ${anterior.titulo}`);
    voltar.querySelector('.seguir__seta').setAttribute('aria-hidden', 'true');
    voltar.href = link(anterior);
    const onde = el('span', 'seguir__posicao', `${posicao + 1} de ${total}`);
    const todas = el('button', 'seguir__todas', 'Ver todas as seções');
    todas.type = 'button';
    todas.addEventListener('click', () => document.querySelector('.topo__indice')?.click());
    outros.append(voltar, onde, todas);

    faixa.append(principal, outros);
    rodape.before(faixa);
  }

  /* ---------- página inicial: percorrer tudo ou ir direto a uma seção ---------- */

  function portas() {
    if (atual !== 'index') return;
    const ultima = document.querySelector('main > section:last-of-type');
    if (!ultima) return;

    const secao = el('section', 'portas');
    Object.assign(secao.dataset, { tone: 'dark', title: '' });
    secao.setAttribute('aria-labelledby', 'portas-titulo');

    const percorrer = el('a', 'portas__percorrer');
    percorrer.href = link(PERCURSO[0]);
    percorrer.append(
      el('span', 'rotulo portas__rotulo', 'A experiência completa'),
      el('span', 'portas__titulo', 'Percorrer o site'),
      el('span', 'portas__linha', `${total} seções, uma depois da outra, a partir do ${PERCURSO[0].titulo}.`),
    );
    percorrer.querySelector('.portas__titulo').id = 'portas-titulo';

    const mapa = el('div', 'portas__mapa');
    mapa.append(el('p', 'rotulo portas__rotulo', 'Ou vá direto a uma seção'));
    const lista = el('ol', 'portas__lista');
    PERCURSO.forEach((p) => {
      const item = el('li');
      const a = el('a', 'portas__item');
      a.href = link(p);
      a.append(el('span', 'portas__nome', p.titulo), el('span', 'portas__desc', p.linha));
      item.append(a);
      lista.append(item);
    });
    mapa.append(lista);

    secao.append(percorrer, mapa);
    ultima.after(secao);
  }

  /* ---------- Índice: descrições, página atual e posição no topo ---------- */

  function indice() {
    const porPagina = new Map([...PERCURSO, INICIO].map((p) => [p.pagina, p]));
    document.querySelectorAll('.indice__lista a').forEach((a) => {
      const href = a.getAttribute('href') || '';
      const alvo = href.startsWith('#') ? atual : nomeDaPagina(href);
      const p = porPagina.get(alvo);
      if (!p || p === INICIO) return;
      if (alvo === atual) a.setAttribute('aria-current', 'page');
      a.append(el('small', 'indice__linha', p.linha));
    });

    const rotulo = document.querySelector('.topo__secao');
    if (rotulo && posicao >= 0) rotulo.append(el('span', 'topo__posicao', `${posicao + 1} de ${total}`));
  }

  /* ---------- a faixa e o rodapé vestem a cor da última seção da página ---------- */

  function vestir() {
    const secoes = document.querySelectorAll('main > section');
    const ultima = secoes[secoes.length - 1];
    if (!ultima) return;
    const fundo = getComputedStyle(ultima).backgroundColor;
    if (fundo === 'rgba(0, 0, 0, 0)' || fundo === 'transparent') return;
    const tom = ['light', 'concrete'].includes(ultima.dataset.tone) ? ultima.dataset.tone : 'dark';
    document.querySelectorAll('.seguir, .colofao').forEach((parte) => {
      parte.dataset.tone = tom;
      parte.style.backgroundColor = fundo;
    });
  }

  portas();
  faixaSeguir();
  indice();
  vestir();
  addEventListener('mm-paleta', vestir); // quando a pessoa troca de paleta (js/paleta.js)
})();
