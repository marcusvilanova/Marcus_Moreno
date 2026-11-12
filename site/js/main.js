/* Marcus Moreno · Estudos do presente
   Comportamentos do site. Todo o conteúdo vive no HTML; aqui só há movimento. */
(() => {
  'use strict';

  const reduzMovimento = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ponteiroFino = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const SVG = 'http://www.w3.org/2000/svg';

  const limitar = (v) => Math.min(Math.max(v, 0), 1);

  /* ---------- topo: tom da seção e seção atual ---------- */

  function criarTopo(secoes) {
    const topo = document.querySelector('.topo');
    const rotulo = topo.querySelector('.topo__secao');
    const num = topo.querySelector('.topo__num');
    const titulo = topo.querySelector('.topo__titulo');
    const fundos = new Map(secoes.map((s) => [s, getComputedStyle(s).backgroundColor]));
    const LINHA = 34; // altura de leitura do topo, em px

    return () => {
      const atual = secoes.find((s) => {
        const r = s.getBoundingClientRect();
        return r.top <= LINHA && r.bottom > LINHA;
      });
      if (!atual) return;
      topo.dataset.tone = atual.dataset.topo || atual.dataset.tone;
      // no Contato e no rodapé a assinatura grande já está na tela: a do topo se recolhe
      topo.classList.toggle('sem-nome', atual.id === 'contato' || atual.classList.contains('colofao'));
      // sobre a foto de abertura o topo é transparente; nas seções, assume a cor do fundo
      topo.style.backgroundColor = atual.dataset.topo ? 'transparent' : fundos.get(atual);
      if ('num' in atual.dataset) {
        num.textContent = atual.dataset.num;
        titulo.textContent = atual.dataset.title;
        rotulo.classList.toggle('tem-secao', atual.dataset.num !== '');
      }
    };
  }


  /* ---------- blecaute: o papel escurece enquanto o palco sobe ---------- */

  function criarBlecaute(secoes) {
    const camada = document.querySelector('.blecaute');
    // só as passagens de uma seção clara para uma escura
    const palcos = secoes.filter((s, i) => s.tagName === 'SECTION' && s.dataset.tone === 'dark'
      && i > 0 && secoes[i - 1].dataset.tone !== 'dark');
    if (!camada) return () => {};

    const fundoDe = new Map(palcos.map((s) => [s, getComputedStyle(s).backgroundColor]));
    let cor = '';

    return () => {
      let altura = 0;
      let opacidade = 0;
      for (const palco of palcos) {
        const topo = palco.getBoundingClientRect().top;
        if (topo > 0 && topo < innerHeight) {
          altura = topo;
          opacidade = 0.9 * (1 - topo / innerHeight);
          // a sombra tem a cor da seção que vem: marrom antes do palco, preto antes do contato
          cor = fundoDe.get(palco);
          break;
        }
      }
      if (cor) camada.style.backgroundColor = cor;
      camada.style.setProperty('--blecaute-h', `${Math.round(altura)}px`);
      camada.style.setProperty('--blecaute-o', opacidade.toFixed(3));
    };
  }

  /* ---------- numeral: o bistre preenche o contorno conforme a seção é lida ---------- */

  function criarLeitura() {
    const pares = [...document.querySelectorAll('.secao')]
      .map((s) => [s, s.querySelector('.cabeca__num')])
      .filter(([, n]) => n);
    return () => {
      pares.forEach(([secao, numeral]) => {
        const r = secao.getBoundingClientRect();
        const percurso = Math.min(r.height, innerHeight * 2.5);
        const lido = limitar((innerHeight * 0.85 - r.top) / percurso);
        numeral.style.setProperty('--leitura', `${(lido * 100).toFixed(1)}%`);
      });
    };
  }

  function iniciarRolagem() {
    const secoes = [...document.querySelectorAll('main [data-tone], .colofao')];
    const tarefas = [criarTopo(secoes), criarBlecaute(secoes), criarLeitura()];
    let agendado = false;
    const atualizar = () => { agendado = false; tarefas.forEach((t) => t()); };

    addEventListener('scroll', () => {
      if (!agendado) { agendado = true; requestAnimationFrame(atualizar); }
    }, { passive: true });
    addEventListener('resize', atualizar);
    atualizar();
  }

  /* ---------- índice ---------- */

  function iniciarIndice() {
    const botao = document.querySelector('.topo__indice');
    const indice = document.getElementById('indice');
    let aberto = false;

    function abrir() {
      aberto = true;
      indice.hidden = false;
      requestAnimationFrame(() => indice.classList.add('is-aberto'));
      document.documentElement.classList.add('indice-aberto');
      document.body.style.overflow = 'hidden';
      botao.setAttribute('aria-expanded', 'true');
      botao.textContent = 'Fechar';
      indice.querySelector('a').focus({ preventScroll: true });
    }

    function fechar(devolverFoco = true) {
      aberto = false;
      indice.classList.remove('is-aberto');
      document.documentElement.classList.remove('indice-aberto');
      document.body.style.overflow = '';
      botao.setAttribute('aria-expanded', 'false');
      botao.textContent = 'Índice';
      setTimeout(() => { if (!aberto) indice.hidden = true; }, 800);
      if (devolverFoco) botao.focus({ preventScroll: true });
    }

    botao.addEventListener('click', () => (aberto ? fechar() : abrir()));
    indice.addEventListener('click', (e) => { if (e.target.closest('a')) fechar(false); });
    addEventListener('keydown', (e) => { if (e.key === 'Escape' && aberto) fechar(); });
  }

  /* ---------- revelações ao entrar na tela ---------- */

  function iniciarRevelacoes() {
    const alvos = document.querySelectorAll('.revela, .rede, .cabeca');
    if (!('IntersectionObserver' in window)) {
      alvos.forEach((el) => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0, rootMargin: '0px 0px -6% 0px' }); // dispara assim que a foto aponta na tela
    alvos.forEach((el) => io.observe(el));

    // sem mouse, a cor da foto aparece quando ela passa pelo centro da tela
    if (!ponteiroFino) {
      const centro = new IntersectionObserver((entradas) => {
        entradas.forEach((e) => e.target.classList.toggle('is-encontro', e.isIntersecting));
      }, { rootMargin: '-38% 0px -38% 0px' });
      document.querySelectorAll('.tinta').forEach((img) => centro.observe(img));
    }
  }

  /* ---------- rede de afetos: entrevistas (ida) e danças de presente (volta) ---------- */

  const criar = (tag, attrs, pai) => {
    const n = document.createElementNS(SVG, tag);
    Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v));
    pai.appendChild(n);
    return n;
  };

  // curva entre dois pontos; a curvatura empurra o meio para o lado
  const curva = (a, b, k) => {
    const cx = (a.x + b.x) / 2 - (b.y - a.y) * k;
    const cy = (a.y + b.y) / 2 + (b.x - a.x) * k;
    return `M${a.x},${a.y} Q${cx.toFixed(1)},${cy.toFixed(1)} ${b.x},${b.y}`;
  };

  // tremor de mão: ruído desloca o traço, como sanguínea sobre papel
  function criarTremor(svg) {
    const defs = criar('defs', {}, svg);
    const filtro = criar('filter', { id: 'tremor', filterUnits: 'userSpaceOnUse', x: -100, y: -60, width: 1000, height: 760 }, defs);
    criar('feTurbulence', { type: 'fractalNoise', baseFrequency: '0.025', numOctaves: 2, seed: 4, result: 'ruido' }, filtro);
    criar('feDisplacementMap', { in: 'SourceGraphic', in2: 'ruido', scale: 5, xChannelSelector: 'R', yChannelSelector: 'G' }, filtro);
  }

  // nome em duas linhas (prenome / sobrenome), acima ou abaixo do nó
  function escreverNome(pai, nome, p, embaixo, classe = 'rede__nome') {
    const [prenome, ...resto] = nome.split(' ');
    const linhas = resto.length ? [prenome, resto.join(' ')] : [prenome];
    const texto = criar('text', { class: classe, x: p.x, y: p.y, 'text-anchor': 'middle' }, pai);
    linhas.forEach((linha, i) => {
      const primeira = embaixo ? 1.3 : -(0.65 + (linhas.length - 1) * 1.05);
      criar('tspan', { x: p.x, dy: `${i === 0 ? primeira : 1.05}em` }, texto).textContent = linha;
    });
  }

  function desenharVoltas(camada, pos, C) {
    ['zelia', 'key', 'vera'].forEach((id) => {
      if (pos[id]) criar('path', { class: 'rede__volta', d: curva(pos[id], C, 0.22) }, camada);
    });
    // uma dança para três: Alex, Wellington e Mariana dividem a mesma curva
    const { alex, wellington, mariana } = pos;
    if (!(alex && wellington && mariana)) return;
    const meio1 = `${wellington.x + 10},${(alex.y + wellington.y) / 2 - 20}`;
    const meio2 = `${wellington.x + 10},${(wellington.y + mariana.y) / 2 + 20}`;
    criar('path', {
      class: 'rede__volta',
      d: `M${alex.x},${alex.y} Q${meio1} ${wellington.x},${wellington.y} Q${meio2} ${mariana.x},${mariana.y}`,
    }, camada);
    criar('path', { class: 'rede__volta', d: curva(wellington, C, -0.2) }, camada);
  }

  function desenharCentro(svg, C) {
    const centro = criar('g', {}, svg);
    criar('circle', { class: 'rede__no rede__centro', cx: C.x, cy: C.y, r: 5 }, centro);
    criar('rect', { x: C.x - 64, y: C.y + 13, width: 128, height: 24, fill: 'var(--linho)' }, centro);
    criar('text', { class: 'rede__marcus', x: C.x, y: C.y + 30, 'text-anchor': 'middle' }, centro).textContent = 'Marcus Moreno';
  }

  // o nome no botão, sem o "com"/"+" e sem subtítulos
  const nomeDe = (li) => [...li.querySelector('button').childNodes]
    .filter((n) => n.nodeType === Node.TEXT_NODE).map((n) => n.textContent).join('').trim();

  // liga um item da lista ao que ele representa no diagrama: passar o mouse acende os dois
  function ligar(li, alvos, grupoClicavel) {
    const ativar = (on) => [li, ...alvos].forEach((n) => n.classList.toggle('is-ativo', on));
    [li, grupoClicavel].filter(Boolean).forEach((a) => {
      a.addEventListener('mouseenter', () => ativar(true));
      a.addEventListener('mouseleave', () => ativar(false));
    });
    li.addEventListener('focusin', () => ativar(true));
    li.addEventListener('focusout', () => ativar(false));
    if (grupoClicavel) grupoClicavel.addEventListener('click', () => li.querySelector('button').click());
  }

  // encontros efêmeros: quem já está na rede ganha mais uma linha; os demais formam o anel de fora
  function desenharEfemeros(camadaLinhas, camadaNos, pos, grupos, C) {
    const ANEL = { x: 345, y: 285 };
    const ANGULOS = [-90, -30, 30, 150, 210];
    let livre = 0;
    document.querySelectorAll('[data-efemeros] li').forEach((li) => {
      const id = li.dataset.pessoa;
      let p = pos[id];
      let g = null;
      if (!p) {
        const a = ANGULOS[livre++ % ANGULOS.length] * (Math.PI / 180);
        p = { x: Math.round(C.x + ANEL.x * Math.cos(a)), y: Math.round(C.y + ANEL.y * Math.sin(a)) };
        pos[id] = p;
        g = criar('g', { class: 'rede__grupo' }, camadaNos);
        criar('circle', { class: 'rede__no rede__no--efemero', cx: p.x, cy: p.y, r: 4.5 }, g);
        escreverNome(g, nomeDe(li), p, p.y > C.y + 40, 'rede__nome rede__nome--efemero');
        g.style.cursor = 'pointer';
      }
      const linha = criar('path', { class: 'rede__efemero', d: curva(C, p, -0.1) }, camadaLinhas);
      ligar(li, g ? [g, linha] : [grupos[id], linha], g);
    });
  }

  function iniciarRede() {
    const svg = document.querySelector('.rede__svg');
    const itens = [...document.querySelectorAll('[data-rede] li')];
    if (!svg || !itens.length) return;

    const C = { x: 400, y: 320 };
    const RAIO = { x: 270, y: 235 };
    const pos = {};
    const grupos = {};

    criarTremor(svg);
    const camadaEfemeros = criar('g', { filter: 'url(#tremor)' }, svg);
    const camadaIdas = criar('g', { filter: 'url(#tremor)' }, svg);
    const camadaVoltas = criar('g', { filter: 'url(#tremor)' }, svg);
    const camadaNos = criar('g', {}, svg);

    itens.forEach((li, i) => {
      const angulo = (-60 + i * 60) * (Math.PI / 180);
      const p = { x: Math.round(C.x + RAIO.x * Math.cos(angulo)), y: Math.round(C.y + RAIO.y * Math.sin(angulo)) };
      pos[li.dataset.pessoa] = p;

      // a ida nunca é reta: a mão curva um pouco, para um lado ou para o outro
      const ida = criar('path', { class: 'rede__ida', d: curva(C, p, i % 2 ? 0.04 : -0.04), pathLength: 1 }, camadaIdas);
      const g = criar('g', { class: 'rede__grupo' }, camadaNos);
      criar('circle', { class: 'rede__no', cx: p.x, cy: p.y, r: 6 }, g);
      escreverNome(g, nomeDe(li), p, p.y > C.y + 40);
      g.style.cursor = 'pointer';
      grupos[li.dataset.pessoa] = g;
      ligar(li, [g, ida], g);
    });

    desenharVoltas(camadaVoltas, pos, C);
    desenharEfemeros(camadaEfemeros, camadaNos, pos, grupos, C);
    desenharCentro(svg, C);
  }

  /* ---------- quadro do vídeo ao passar o mouse nas listas (encontros, entrevistas) ---------- */

  function iniciarQuadros() {
    document.querySelectorAll('.lista-video__palco').forEach(prepararMiniaturas);
    if (!ponteiroFino) return;
    document.querySelectorAll('.lista-video__palco').forEach(prepararQuadro);
  }

  // sem mouse (celular, tablet, tela estreita), não há como passar por cima dos nomes:
  // cada linha ganha uma miniatura do vídeo, que também abre o vídeo. O CSS só a mostra nessas telas.
  function prepararMiniaturas(palco) {
    palco.querySelectorAll('li[data-quadro]').forEach((li) => {
      if (li.querySelector('.lista-video__mini')) return;
      const img = document.createElement('img');
      img.className = 'lista-video__mini';
      img.src = li.dataset.quadro;
      img.alt = '';
      img.width = 960;
      img.height = 540;
      img.loading = 'lazy';
      img.setAttribute('aria-hidden', 'true');
      img.addEventListener('click', () => li.querySelector('button')?.click());
      li.append(img);
    });
  }

  function prepararQuadro(palco) {
    const quadro = palco.querySelector('.quadro');
    if (!quadro) return;

    const itens = [...palco.querySelectorAll('li[data-quadro]')];
    // duas camadas: a nova aparece por cima enquanto a anterior some
    const primeira = quadro.querySelector('img');
    const camadas = [primeira, primeira.cloneNode()];
    quadro.appendChild(camadas[1]);
    let ativa = 0;

    const posicionar = (li) => {
      const y = li.offsetTop + li.offsetHeight / 2 - quadro.offsetHeight / 2;
      const max = palco.offsetHeight - quadro.offsetHeight;
      quadro.style.setProperty('--quadro-y', `${Math.round(Math.min(Math.max(y, 0), max))}px`);
    };

    const mostrar = (li) => {
      if (camadas[ativa].dataset.src !== li.dataset.quadro) {
        camadas[ativa].classList.remove('is-ativa');
        ativa = 1 - ativa;
        camadas[ativa].src = li.dataset.quadro;
        camadas[ativa].dataset.src = li.dataset.quadro;
        camadas[ativa].classList.add('is-ativa');
      }
      // na primeira aparição o quadro surge no lugar, sem deslizar
      if (!quadro.classList.contains('is-visivel')) {
        quadro.style.transition = 'none';
        posicionar(li);
        void quadro.offsetHeight;
        quadro.style.transition = '';
      } else {
        posicionar(li);
      }
      quadro.classList.add('is-visivel');
    };
    const esconder = () => quadro.classList.remove('is-visivel');

    itens.forEach((li) => {
      li.addEventListener('mouseenter', () => mostrar(li));
      li.addEventListener('focusin', () => mostrar(li));
      new Image().src = li.dataset.quadro; // pré-carrega
    });
    palco.addEventListener('mouseleave', esconder);
    palco.addEventListener('focusout', (e) => { if (!palco.contains(e.relatedTarget)) esconder(); });
  }

  /* ---------- vídeo ---------- */

  const ID_VALIDO = /^[\w-]{11}$/;
  const MIDIA_DA_OBRA = '.obra__midia, .obra__faixa, .obra__triptico, .obra__par, .obra__sobreposta';

  // aberto direto do disco (file://), o YouTube recusa o player (Erro 153): ele exige saber o endereço da página
  const ARQUIVO_LOCAL = location.protocol === 'file:';

  const inicioDe = (alvo) => (/^\d+$/.test(alvo.dataset.start || '') ? alvo.dataset.start : '');

  function enderecoYouTube(alvo) {
    const inicio = inicioDe(alvo);
    return `https://www.youtube.com/watch?v=${alvo.dataset.video}${inicio ? `&t=${inicio}s` : ''}`;
  }

  // saída de emergência: o mesmo vídeo no YouTube, numa aba nova
  function criarLinkYouTube(alvo, classe) {
    const a = document.createElement('a');
    a.className = classe;
    a.href = enderecoYouTube(alvo);
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = 'Abrir no YouTube';
    return a;
  }

  function criarIframe(alvo) {
    const params = new URLSearchParams({ autoplay: '1', rel: '0' });
    if (inicioDe(alvo)) params.set('start', inicioDe(alvo));
    const iframe = document.createElement('iframe');
    iframe.referrerPolicy = 'strict-origin-when-cross-origin'; // o YouTube precisa saber de onde vem o pedido
    iframe.src = `https://www.youtube-nocookie.com/embed/${alvo.dataset.video}?${params}`;
    iframe.title = alvo.dataset.titulo || 'Vídeo';
    iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    iframe.allowFullscreen = true;
    return iframe;
  }

  // nas obras, o vídeo toca no lugar da foto, no mesmo espaço da grade
  function criarPalcoDasObras() {
    let tocando = null; // { obra, tela, midia }

    const rotular = (obra, texto) => obra.querySelectorAll('.tocar').forEach((b) => { b.textContent = texto; });

    function fechar() {
      if (!tocando) return;
      const { obra, tela, midia } = tocando;
      tela.remove(); // tirar o iframe para o som parar
      midia.hidden = false;
      obra.classList.remove('is-tocando');
      rotular(obra, 'Assistir');
      tocando = null;
    }

    function abrir(obra, alvo) {
      const midia = obra.querySelector(MIDIA_DA_OBRA);
      if (!midia) return false;
      const mesma = tocando && tocando.obra === obra;
      fechar();
      if (mesma) return true; // segundo clique no mesmo botão: fecha

      const tela = document.createElement('div');
      tela.className = 'obra__tela';
      const estilo = getComputedStyle(midia);
      // foto estreita demais para um vídeo: o vídeo ocupa a largura toda e o texto desce
      const estreita = midia.offsetWidth < obra.offsetWidth * 0.5;
      tela.style.gridColumn = estreita ? '1 / -1' : estilo.gridColumn;
      tela.style.gridRow = estreita ? 'auto' : estilo.gridRow;
      tela.appendChild(criarIframe(alvo));
      tela.appendChild(criarLinkYouTube(alvo, 'video-youtube video-youtube--obra'));
      midia.before(tela);
      midia.hidden = true;
      obra.classList.add('is-tocando');
      rotular(obra, 'Fechar');
      tocando = { obra, tela, midia };

      const r = tela.getBoundingClientRect();
      const topoFixo = document.querySelector('.topo').offsetHeight;
      if (r.top < topoFixo || r.bottom > innerHeight) tela.scrollIntoView({ behavior: reduzMovimento ? 'auto' : 'smooth', block: 'center' });
      return true;
    }

    return { abrir, fechar };
  }

  function iniciarPlayer() {
    const dialogo = document.querySelector('.player');
    const temVisor = dialogo && typeof dialogo.showModal === 'function';
    const tela = temVisor && dialogo.querySelector('.player__tela');
    const titulo = temVisor && dialogo.querySelector('.player__titulo');
    const linkVisor = temVisor && dialogo.querySelector('.video-youtube');
    const palco = criarPalcoDasObras();

    document.addEventListener('click', (e) => {
      const alvo = e.target.closest('[data-video]');
      if (!alvo || !ID_VALIDO.test(alvo.dataset.video)) return;
      if (ARQUIVO_LOCAL) { window.open(enderecoYouTube(alvo), '_blank', 'noopener'); return; }
      const obra = alvo.closest('.obra');
      if (obra && palco.abrir(obra, alvo)) return;
      if (!temVisor) return;

      // fora das obras (entrevistas, danças de presente), o visor em tela cheia
      palco.fechar();
      tela.replaceChildren(criarIframe(alvo));
      titulo.textContent = alvo.dataset.titulo || '';
      linkVisor.href = enderecoYouTube(alvo);
      dialogo.showModal();
    });

    if (!temVisor) return;
    dialogo.querySelector('.player__fechar').addEventListener('click', () => dialogo.close());
    dialogo.addEventListener('click', (e) => { if (e.target === dialogo) dialogo.close(); });
    dialogo.addEventListener('close', () => tela.replaceChildren());
  }

  /* ---------- galerias laterais (Entreato, Entrevistas, Trajetória) ----------
     Rolar para baixo faz a faixa andar para o lado, como quem atravessa uma sala de exposição.
     Cada galeria é um [data-lateral] com uma faixa [data-lateral-faixa], itens [data-lateral-item],
     um contador [data-lateral-contador] e uma linha [data-lateral-progresso].
     Vale para qualquer tela, inclusive o celular: a pessoa só rola para baixo e a faixa anda sozinha.
     Só quem pede movimento reduzido no sistema recebe a faixa parada, para deslizar com o dedo. */

  const MODO_LATERAL = matchMedia('(prefers-reduced-motion: no-preference)');
  const VELOCIDADE_LATERAL = 1.5; // a faixa anda 1,5 pixel para o lado a cada pixel rolado: menos rolagem para atravessar

  function prepararLateral(caixa) {
    const faixa = caixa.querySelector('[data-lateral-faixa]');
    const palco = caixa.querySelector('.lateral__palco, .entreato__palco');
    const progresso = caixa.querySelector('[data-lateral-progresso]');
    const contador = caixa.querySelector('[data-lateral-contador]');
    if (!faixa) return;
    const itens = [...faixa.querySelectorAll('[data-lateral-item]')];
    const total = String(itens.length).padStart(2, '0');
    let distancia = 0;    // quanto a faixa anda para o lado
    let percurso = 0;     // quanto se rola para baixo para atravessá-la
    let pedido = false;
    let largura = 0;      // largura e altura da tela na última medição:
    let alturaPalco = 0;  // só uma mudança de verdade (girar o celular, redimensionar a janela) pede nova medida

    // o item mais perto do centro da tela é o "atual"
    function contar() {
      if (!contador) return;
      const meio = innerWidth / 2;
      let atual = 0;
      let menor = Infinity;
      itens.forEach((item, i) => {
        const r = item.getBoundingClientRect();
        const d = Math.abs(r.left + r.width / 2 - meio);
        if (d < menor) { menor = d; atual = i; }
      });
      contador.textContent = `${String(atual + 1).padStart(2, '0')} / ${total}`;
    }

    function mover() {
      pedido = false;
      let p = 0;
      if (MODO_LATERAL.matches && distancia > 0) {
        p = Math.min(1, Math.max(0, -caixa.getBoundingClientRect().top / percurso));
        faixa.style.transform = `translate3d(${(-p * distancia).toFixed(1)}px, 0, 0)`;
      } else {
        const fim = faixa.scrollWidth - faixa.clientWidth;
        p = fim > 0 ? faixa.scrollLeft / fim : 0;
      }
      if (progresso) progresso.style.setProperty('--p', p.toFixed(4));
      contar();
    }

    const pedir = () => { if (!pedido) { pedido = true; requestAnimationFrame(mover); } };

    // a caixa ganha a altura do caminho lateral dividido pela velocidade (cada pixel rolado anda 1,5 para o lado).
    // A altura do palco vem do CSS (100svh): no celular ela não muda quando a barra de endereço some,
    // então a página não dá saltos durante a rolagem.
    function medir() {
      caixa.classList.toggle('is-presa', MODO_LATERAL.matches);
      faixa.style.transform = '';
      largura = document.documentElement.clientWidth;
      alturaPalco = palco ? palco.offsetHeight : innerHeight;
      if (MODO_LATERAL.matches) {
        distancia = Math.max(0, faixa.scrollWidth - largura);
        percurso = distancia / VELOCIDADE_LATERAL;
        caixa.style.height = `${percurso + alturaPalco}px`;
      } else {
        distancia = 0;
        percurso = 0;
        caixa.style.height = '';
      }
      mover();
    }

    function aoRedimensionar() {
      const mudou = document.documentElement.clientWidth !== largura
        || (palco ? palco.offsetHeight : innerHeight) !== alturaPalco;
      if (mudou) medir(); else pedir();
    }

    // teclado: ao chegar com Tab a um item que está fora da tela, a página rola até a posição em que
    // ele fica no centro. Sem isto, o navegador empurraria a faixa por dentro e a galeria se desalinharia.
    faixa.addEventListener('focusin', (e) => {
      if (palco) palco.scrollLeft = 0;
      if (!MODO_LATERAL.matches || distancia <= 0) return;
      const item = e.target.closest('[data-lateral-item]') || e.target;
      const ri = item.getBoundingClientRect();
      const rf = faixa.getBoundingClientRect();
      const centro = ri.left - rf.left + ri.width / 2; // posição do item dentro da faixa
      const alvo = Math.min(1, Math.max(0, (centro - largura / 2) / distancia));
      const topoCaixa = caixa.getBoundingClientRect().top + scrollY;
      scrollTo({ top: Math.round(topoCaixa + alvo * percurso), behavior: 'instant' });
    });

    addEventListener('scroll', pedir, { passive: true });
    faixa.addEventListener('scroll', pedir, { passive: true });
    addEventListener('resize', aoRedimensionar);
    MODO_LATERAL.addEventListener('change', medir);
    faixa.querySelectorAll('img').forEach((img) => {
      if (!img.complete) img.addEventListener('load', medir, { once: true });
    });
    medir();
  }

  function iniciarLaterais() {
    document.querySelectorAll('[data-lateral]').forEach(prepararLateral);
  }

  /* ---------- acervo: o mural antes do Contato ----------
     Fora da tela, as faixas param (economiza bateria). Quando a pessoa chega perto, todas as imagens
     carregam de uma vez, para nenhuma peça aparecer vazia enquanto as faixas andam. */

  function iniciarAcervo() {
    const acervo = document.querySelector('.acervo');
    if (!acervo || !('IntersectionObserver' in window)) return;
    const imagens = [...acervo.querySelectorAll('img[loading="lazy"]')];
    let carregou = false;
    new IntersectionObserver(([e]) => {
      acervo.classList.toggle('is-visivel', e.isIntersecting);
      if (e.isIntersecting && !carregou) {
        carregou = true;
        imagens.forEach((img) => { img.loading = 'eager'; });
      }
    }, { rootMargin: '60% 0px' }).observe(acervo);
  }

  // a capa só começa a fundir as fotos quando aparece na tela, para abrir sempre pela primeira; fora da tela, para
  function iniciarCapa() {
    const capa = document.querySelector('.abertura');
    if (!capa || !('IntersectionObserver' in window)) return;
    capa.dataset.espera = '';
    new IntersectionObserver(([e]) => capa.classList.toggle('is-visivel', e.isIntersecting), { threshold: 0.2 }).observe(capa);
  }

  // Aa: cada toque aumenta a letra um passo; depois do maior, volta ao tamanho de origem.
  // A escolha fica guardada neste navegador para as próximas visitas.
  function iniciarLetra() {
    const botao = document.querySelector('.topo__letra');
    if (!botao) return;
    const PASSOS = [1, 1.15, 1.3, 1.5];
    const NOMES = ['Aumentar o tamanho da letra', 'Aumentar mais a letra', 'Aumentar mais a letra', 'Voltar ao tamanho original da letra'];
    let passo = 0;
    try { passo = Math.min(PASSOS.length - 1, Math.max(0, +localStorage.getItem('mm-letra') || 0)); } catch (e) { /* sem memória: começa no tamanho de origem */ }
    function aplicar() {
      document.documentElement.style.setProperty('--escala', PASSOS[passo]);
      botao.dataset.passo = passo;
      botao.setAttribute('aria-label', NOMES[passo]);
    }
    aplicar();
    botao.addEventListener('click', () => {
      passo = (passo + 1) % PASSOS.length;
      aplicar();
      try { localStorage.setItem('mm-letra', String(passo)); } catch (e) { /* sem memória: vale só nesta visita */ }
    });
  }

  /* ---------- início ---------- */

  iniciarRolagem();
  iniciarIndice();
  iniciarRevelacoes();
  iniciarRede();
  iniciarQuadros();
  iniciarPlayer();
  iniciarLaterais();
  iniciarAcervo();
  iniciarCapa();
  iniciarLetra();

  const ano = document.querySelector('[data-ano]');
  if (ano) ano.textContent = new Date().getFullYear();
})();
