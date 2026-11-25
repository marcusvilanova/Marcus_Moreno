/* Percurso: a ordem das páginas, para quem quer atravessar o site inteiro.
   Desta lista saem a faixa "A seguir" no fim de cada página, as seções da página inicial,
   as descrições do Índice, a página atual marcada nele e a posição no topo ("4 de 12").
   Para mudar a ordem, uma descrição ou uma imagem (de assets/img/mural/), edite a lista PERCURSO_PT;
   as descrições em espanhol e inglês ficam logo abaixo, em TRADUCOES. */
(() => {
  const PERCURSO_PT = [
    { pagina: 'sobre', titulo: 'Sobre', linha: 'Biografia, trajetória e projetos curatoriais.', imagem: 'retrato-25.webp' },
    { pagina: 'criacoes', titulo: 'Criações cênicas', linha: 'Oito obras, de 2024 a 2013, com vídeos e fichas.', imagem: 'onde-houver-ceu-1.webp' },
    { pagina: 'encontros', titulo: 'Encontros', linha: 'Encontros Efêmeros, Entrevistas-performativas e Danças de Presente.', imagem: 'entrevista-mariana.webp' },
    { pagina: 'imagens', titulo: 'Imagens', linha: 'Fotografias de cena e o mural de todas as obras.', imagem: 'retrato-07.webp' },
    { pagina: 'textos', titulo: 'Textos e imprensa', linha: 'O que Marcus escreve e o que se escreve sobre ele.', imagem: 'instante-ja-1.webp' },
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
        sobre: ['Sobre', 'Biografía, trayectoria y proyectos curatoriales.'],
        criacoes: ['Creaciones escénicas', 'Ocho obras, de 2024 a 2013, con videos y fichas.'],
        encontros: ['Encuentros', 'Encuentros Efímeros, Entrevistas performativas y Danzas de Presente.'],
        imagens: ['Imágenes', 'Fotografías de escena y el mural de todas las obras.'],
        textos: ['Textos y prensa', 'Lo que Marcus escribe y lo que se escribe sobre él.'],
        contato: ['Contacto', 'Producción, redes y material para programadores.'],
      },
      percurso: 'Recorrido por el sitio', seguir: 'A continuación', fim: 'Fin del recorrido · volver al',
      anterior: 'Anterior', de: 'de', todas: 'Ver todas las secciones', secoes: 'Secciones', subir: 'Volver arriba',
      percorrer: 'Recorrer el sitio',
    },
    en: {
      paginas: {
        index: ['Home', 'The cover and what is happening now.'],
        sobre: ['About', 'Biography, career and curatorial projects.'],
        criacoes: ['Stage works', 'Eight works, from 2024 back to 2013, with videos and credits.'],
        encontros: ['Encounters', 'Ephemeral Encounters, Performative Interviews and Present Dances.'],
        imagens: ['Images', 'Stage photographs and a mural of every work.'],
        textos: ['Writing and press', 'What Marcus writes and what is written about him.'],
        contato: ['Contact', 'Production, social media and material for programmers.'],
      },
      percurso: 'Journey through the site', seguir: 'Next', fim: 'End of the journey · back to',
      anterior: 'Previous', de: 'of', todas: 'See all sections', secoes: 'Sections', subir: 'Back to top',
      percorrer: 'Walk through the site',
    },
  };
  const ROTULOS = TRADUCOES[LINGUA] || {
    percurso: 'Percurso pelo site', seguir: 'A seguir', fim: 'Fim do percurso · voltar ao',
    anterior: 'Anterior', de: 'de', todas: 'Ver todas as seções', secoes: 'Seções', subir: 'Voltar ao topo',
    percorrer: 'Percorrer o site',
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

  /* ---------- página inicial: as seções do site, cada uma com uma imagem e uma linha ---------- */

  function portas() {
    if (atual !== 'index') return;
    const ultima = document.querySelector('main > section:last-of-type');
    if (!ultima) return;

    const secao = el('section', 'portas');
    Object.assign(secao.dataset, { tone: 'dark', title: '' });
    secao.setAttribute('aria-labelledby', 'portas-titulo');

    const cabeca = el('header', 'portas__cabeca');
    const titulo = el('h2', 'rotulo portas__titulo', ROTULOS.secoes);
    titulo.id = 'portas-titulo';
    const percorrer = el('a', 'portas__percorrer', `${ROTULOS.percorrer} `);
    percorrer.href = link(PERCURSO[0]);
    const seta = el('span', '', '→');
    seta.setAttribute('aria-hidden', 'true');
    percorrer.append(seta);
    cabeca.append(titulo, percorrer);

    const lista = el('ol', 'portas__lista');
    PERCURSO.forEach((p) => {
      const item = el('li');
      const a = el('a', 'portas__item');
      a.href = link(p);
      const foto = el('img', 'portas__imagem tinta');
      Object.assign(foto, { src: imagem(p), alt: '', width: 512, height: 640, loading: 'lazy', decoding: 'async' });
      a.append(foto, el('span', 'portas__nome', p.titulo), el('span', 'portas__desc', p.linha));
      item.append(a);
      lista.append(item);
    });

    secao.append(cabeca, lista);
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

  /* ---------- Voltar (no topo): a página anterior, se ela for do site; se não, a página inicial ---------- */

  function voltar() {
    const botao = document.querySelector('.topo__voltar');
    if (!botao) return;
    botao.addEventListener('click', (evento) => {
      let veioDoSite = false;
      try { veioDoSite = Boolean(document.referrer) && new URL(document.referrer).origin === location.origin; } catch (e) { /* endereço de origem ilegível: segue o link */ }
      if (veioDoSite && history.length > 1) {
        evento.preventDefault();
        history.back();
      }
    });
  }

  /* ---------- seta de voltar ao topo: só nas páginas longas, depois de rolar um bom trecho ---------- */

  function subir() {
    const botao = el('button', 'subir');
    botao.type = 'button';
    botao.setAttribute('aria-label', ROTULOS.subir);
    const seta = el('span', '', '↑');
    seta.setAttribute('aria-hidden', 'true');
    botao.append(seta);
    document.body.append(botao);
    const atualizar = () => {
      const longa = document.documentElement.scrollHeight > innerHeight * 2.5;
      botao.classList.toggle('is-visivel', longa && scrollY > innerHeight * 1.2);
    };
    addEventListener('scroll', atualizar, { passive: true });
    addEventListener('resize', atualizar);
    atualizar();
    botao.addEventListener('click', () => {
      const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
      scrollTo({ top: 0, behavior: reduz ? 'auto' : 'smooth' });
      // o foco volta para o começo da página, para quem navega pelo teclado
      const inicio = document.querySelector('.topo__nome');
      if (inicio) inicio.focus({ preventScroll: true });
    });
  }

  portas();
  faixaSeguir();
  indice();
  vestir();
  voltar();
  subir();
})();
