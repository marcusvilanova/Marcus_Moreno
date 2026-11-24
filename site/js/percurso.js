/* Percurso: a ordem das páginas, para quem quer atravessar o site inteiro.
   Desta lista saem a faixa "A seguir" no fim de cada página, as duas portas da página inicial,
   as descrições do Índice, a página atual marcada nele e a posição no topo ("4 de 12").
   Para mudar a ordem, uma descrição ou uma imagem (de assets/img/mural/), edite a lista PERCURSO_PT;
   as descrições em espanhol e inglês ficam logo abaixo, em TRADUCOES. */
(() => {
  const PERCURSO_PT = [
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
  const INICIO_PT = { pagina: 'index', titulo: 'Início', linha: 'A capa e a agenda do que está acontecendo agora.', imagem: 'instante-ja-2.webp' };

  // as páginas traduzidas (es/, en/) trocam o título e a linha de cada seção e os rótulos da faixa
  const LINGUA = (window.MM && window.MM.lingua) || 'pt';
  const RAIZ = (window.MM && window.MM.raiz) || '';
  const TRADUCOES = {
    es: {
      paginas: {
        index: ['Inicio', 'La portada y la agenda de lo que está pasando ahora.'],
        sobre: ['Sobre', 'Formación e investigación de Marcus Moreno.'],
        criacoes: ['Creaciones escénicas', 'Ocho obras, de 2024 a 2013, con videos y fichas.'],
        entreato: ['Entreacto', 'Fotografías de escena, de ensayo y de calle.'],
        efemeros: ['Encuentros Efímeros', 'Dos artistas comparten la escena en un encuentro inédito.'],
        entrevistas: ['Entrevistas performativas', 'Conversaciones bailadas en video con artistas invitados.'],
        presente: ['Danzas de Presente', 'Improvisaciones creadas como agradecimiento.'],
        curadoria: ['Proyectos curatoriales', 'Encuentros y proyectos de danza con curaduría de Marcus.'],
        textos: ['Textos', 'La tesis de maestría y los artículos de la investigación.'],
        trajetoria: ['Trayectoria', 'Creación, gestión e investigación, un año tras otro.'],
        imprensa: ['En la prensa', 'Notas y críticas sobre el trabajo de Marcus.'],
        acervo: ['Archivo', 'Un mural con imágenes de todas las obras.'],
        contato: ['Contacto', 'Producción, redes y material para programadores.'],
      },
      percurso: 'Recorrido por el sitio', seguir: 'A continuación', fim: 'Fin del recorrido · volver al',
      anterior: 'Anterior', de: 'de', todas: 'Ver todas las secciones', completa: 'La experiencia completa',
      percorrer: 'Recorrer el sitio', direto: 'O ve directo a una sección',
      linhaPercorrer: (n, primeira) => `${n} secciones, una tras otra, a partir de ${primeira}.`,
    },
    en: {
      paginas: {
        index: ['Home', 'The cover and what is happening now.'],
        sobre: ['About', 'Marcus Moreno’s training and research.'],
        criacoes: ['Stage works', 'Eight works, from 2024 back to 2013, with videos and credits.'],
        entreato: ['Interlude', 'Photographs from performances, rehearsals and the street.'],
        efemeros: ['Ephemeral Encounters', 'Two artists share the stage in a first-time encounter.'],
        entrevistas: ['Performative Interviews', 'Danced conversations on video with guest artists.'],
        presente: ['Present Dances', 'Improvisations made as a way of giving thanks.'],
        curadoria: ['Curatorial projects', 'Dance meetings and projects curated by Marcus.'],
        textos: ['Writing', 'The master’s dissertation and research articles.'],
        trajetoria: ['Career', 'Creation, management and research, one year after another.'],
        imprensa: ['In the press', 'Articles and reviews of Marcus’s work.'],
        acervo: ['Archive', 'A mural with images from every work.'],
        contato: ['Contact', 'Production, social media and material for programmers.'],
      },
      percurso: 'Journey through the site', seguir: 'Next', fim: 'End of the journey · back to',
      anterior: 'Previous', de: 'of', todas: 'See all sections', completa: 'The full experience',
      percorrer: 'Walk through the site', direto: 'Or go straight to a section',
      linhaPercorrer: (n, primeira) => `${n} sections, one after another, starting with ${primeira}.`,
    },
  };
  const ROTULOS = TRADUCOES[LINGUA] || {
    percurso: 'Percurso pelo site', seguir: 'A seguir', fim: 'Fim do percurso · voltar ao',
    anterior: 'Anterior', de: 'de', todas: 'Ver todas as seções', completa: 'A experiência completa',
    percorrer: 'Percorrer o site', direto: 'Ou vá direto a uma seção',
    linhaPercorrer: (n, primeira) => `${n} seções, uma depois da outra, a partir do ${primeira}.`,
  };
  const traduzir = (p) => {
    const t = ROTULOS.paginas && ROTULOS.paginas[p.pagina];
    return t ? { ...p, titulo: t[0], linha: t[1] } : p;
  };
  const PERCURSO = PERCURSO_PT.map(traduzir);
  const INICIO = traduzir(INICIO_PT);

  const nomeDaPagina = (endereco) => (endereco.split('#')[0].split('/').pop() || 'index').replace(/\.html$/, '') || 'index';
  const atual = nomeDaPagina(location.pathname);
  const posicao = PERCURSO.findIndex((p) => p.pagina === atual);
  const total = PERCURSO.length;
  const link = (p) => (p.pagina === 'index' ? 'index.html' : `${p.pagina}.html`);
  const imagem = (p) => `${RAIZ}assets/img/mural/${p.imagem}`;

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
    faixa.setAttribute('aria-label', ROTULOS.percurso);
    faixa.dataset.tone = 'dark';

    const principal = el('a', 'seguir__proxima');
    principal.href = link(proxima);
    const texto = el('span', 'seguir__texto');
    texto.append(
      el('span', 'rotulo seguir__rotulo', proxima === INICIO ? ROTULOS.fim : ROTULOS.seguir),
      titulo(proxima.titulo),
      el('span', 'seguir__linha', proxima.linha),
    );
    const foto = el('img', 'seguir__imagem');
    Object.assign(foto, { src: imagem(proxima), alt: '', width: 512, height: 640, loading: 'lazy', decoding: 'async' });
    principal.append(texto, foto);

    const outros = el('p', 'seguir__outros');
    const voltar = el('a', 'seguir__anterior');
    voltar.append(el('span', 'seguir__seta seguir__seta--volta', '←'), ` ${ROTULOS.anterior}: ${anterior.titulo}`);
    voltar.querySelector('.seguir__seta').setAttribute('aria-hidden', 'true');
    voltar.href = link(anterior);
    const onde = el('span', 'seguir__posicao', `${posicao + 1} ${ROTULOS.de} ${total}`);
    const todas = el('button', 'seguir__todas', ROTULOS.todas);
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
      el('span', 'rotulo portas__rotulo', ROTULOS.completa),
      el('span', 'portas__titulo', ROTULOS.percorrer),
      el('span', 'portas__linha', ROTULOS.linhaPercorrer(total, PERCURSO[0].titulo)),
    );
    percorrer.querySelector('.portas__titulo').id = 'portas-titulo';

    const mapa = el('div', 'portas__mapa');
    mapa.append(el('p', 'rotulo portas__rotulo', ROTULOS.direto));
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
    document.querySelectorAll('.indice__lista li:not(.indice__lingua) a').forEach((a) => {
      const href = a.getAttribute('href') || '';
      const alvo = href.startsWith('#') ? atual : nomeDaPagina(href);
      const p = porPagina.get(alvo);
      if (!p || p === INICIO) return;
      if (alvo === atual) a.setAttribute('aria-current', 'page');
      a.append(el('small', 'indice__linha', p.linha));
    });

    const rotulo = document.querySelector('.topo__secao');
    if (rotulo && posicao >= 0) rotulo.append(el('span', 'topo__posicao', `${posicao + 1} ${ROTULOS.de} ${total}`));
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
})();
