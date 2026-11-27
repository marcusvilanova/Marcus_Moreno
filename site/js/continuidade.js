/* Marcus Moreno · navegação contínua
   Entre as seções do site, a página não recarrega: o conteúdo da seção seguinte é buscado e trocado no lugar,
   numa passagem curta de luz. A janela e o som continuam; por isso a música não corta e a tela não fica vazia.
   Cada seção mantém o próprio endereço: o Voltar do navegador funciona e um link compartilhado abre a seção certa.
   Se a busca falhar (sem internet, por exemplo), o link funciona do jeito comum e a página recarrega.

   Para o resto do código (js/*.js): em vez de rodar uma vez só, cada parte se inscreve com MMVida.aoEntrar(montar).
   montar(pagina) roda na hora, para a página aberta, e de novo a cada troca de seção. Ouvintes na janela ou no
   documento recebem { signal: pagina.sinal } e somem sozinhos na troca; observadores e laços se desligam em
   pagina.aoSair(fn). Este arquivo vem antes dos outros (ferramentas/gerar-publicacao.py, JS_DA_CAPA). */
(() => {
  'use strict';

  const raiz = document.documentElement;
  const reduzMovimento = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- a vida de cada página ---------- */

  const montadores = [];
  let controle = new AbortController();
  let limpezas = [];

  function rodar(montar) {
    try {
      montar({ sinal: controle.signal, aoSair: (fn) => limpezas.push(fn) });
    } catch (erro) {
      console.error(erro); // uma parte com defeito não impede as outras de montar
    }
  }

  function desmontar() {
    controle.abort();
    limpezas.splice(0).forEach((fn) => {
      try { fn(); } catch (erro) { console.error(erro); }
    });
    controle = new AbortController();
  }

  window.MMVida = {
    aoEntrar(montar) {
      montadores.push(montar);
      rodar(montar);
    },
  };

  /* ---------- quais links trocam no lugar: as sete páginas do site, em português, espanhol e inglês ---------- */

  const PAGINA_DO_SITE = /^(?:(?:es|en)\/)?(?:(?:index|sobre|criacoes|encontros|imagens|textos|contato)\.html)?$/;

  function doSite(url) {
    // a raiz do site, a partir da página aberta (window.MM.raiz: '' em português, '../' nas traduções)
    const base = new URL((window.MM && window.MM.raiz) || './', location.href);
    if (url.origin !== base.origin || !url.pathname.startsWith(base.pathname)) return false;
    return PAGINA_DO_SITE.test(url.pathname.slice(base.pathname.length));
  }

  const semAncora = (url) => url.href.split('#')[0];

  // cada seção é buscada uma vez por visita; passar o mouse (ou o dedo) num link já começa a busca
  const guardadas = new Map();
  function buscar(endereco) {
    if (!guardadas.has(endereco)) {
      const pedido = fetch(endereco, { credentials: 'same-origin' }).then((resposta) => {
        // um endereço antigo que redireciona (vercel.json) segue pelo caminho comum
        if (!resposta.ok || resposta.redirected) throw new Error(`${resposta.status} ${endereco}`);
        return resposta.text();
      });
      pedido.catch(() => guardadas.delete(endereco)); // falhou: a próxima tentativa busca de novo
      guardadas.set(endereco, pedido);
    }
    return guardadas.get(endereco);
  }

  /* ---------- a troca ---------- */

  // o <head> fica o mesmo de seção para seção: o ícone da aba ganha o endereço completo,
  // senão ele se perderia ao trocar de pasta (o espanhol fica em es/, o inglês em en/)
  document.head.querySelectorAll('link[rel~="icon"], link[rel="apple-touch-icon"]').forEach((link) => { link.href = link.href; });

  // aviso para leitores de tela: o nome da seção que chegou
  const aviso = document.createElement('p');
  aviso.className = 'sr';
  aviso.setAttribute('aria-live', 'polite');
  aviso.dataset.permanente = '';
  document.body.append(aviso);

  let mostrada = location.pathname; // a seção na tela (uma âncora na mesma página não troca nada)

  const lembrarRolagem = () => history.replaceState({ ...(history.state || {}), y: scrollY }, '');

  // a língua e o caminho da página nova, escritos no <head> dela (ferramentas/gerar-traducoes.py)
  function lerMM(documento) {
    const codigo = [...documento.querySelectorAll('script:not([src])')].map((s) => s.textContent).join('\n');
    const lingua = codigo.match(/lingua:\s*'([\w-]+)'/);
    const caminho = codigo.match(/raiz:\s*'([^']*)'/);
    window.MM = { ...window.MM, lingua: lingua ? lingua[1] : 'pt', raiz: caminho ? caminho[1] : '' };
  }

  // o botão do som continua o mesmo, com a música e o estado; só o nome muda para a língua da página nova
  function manterSom(antes, novo) {
    ['title', 'aria-label'].forEach((nome) => {
      if (novo.hasAttribute(nome)) antes.setAttribute(nome, novo.getAttribute(nome));
      else antes.removeAttribute(nome);
    });
    const rotulo = (botao) => [...botao.childNodes].reverse().find((n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
    const nomeAntes = rotulo(antes);
    const nomeNovo = rotulo(novo);
    if (nomeAntes && nomeNovo) nomeAntes.textContent = nomeNovo.textContent;
    novo.replaceWith(antes);
  }

  function rolar(url, y) {
    const alvo = url.hash && document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (alvo) alvo.scrollIntoView({ behavior: 'instant', block: 'start' });
    else if (y) scrollTo({ top: y, behavior: 'instant' });
  }

  function trocar(documento, url, opcoes) {
    if (opcoes.empurrar) {
      lembrarRolagem();
      history.pushState({ mm: true }, '', url.href); // antes da troca: os endereços da página nova partem daqui
    }
    desmontar();
    document.title = documento.title;
    raiz.lang = documento.documentElement.lang;
    raiz.classList.remove('indice-aberto');
    lerMM(documento);

    const somAntes = document.querySelector('.topo__som');
    const ficam = [...document.body.querySelectorAll('[data-permanente]')];
    const corpo = document.adoptNode(documento.body);
    corpo.querySelectorAll('script').forEach((s) => s.remove()); // o código já está rodando
    document.body.removeAttribute('style');
    document.body.replaceChildren(...corpo.childNodes);
    const somNovo = document.querySelector('.topo__som');
    if (somAntes && somNovo) manterSom(somAntes, somNovo);
    document.body.append(...ficam);
    mostrada = location.pathname;

    scrollTo({ top: 0, behavior: 'instant' });
    montadores.forEach(rodar);
    rolar(url, opcoes.y);
    const principal = document.querySelector('main');
    if (principal) {
      principal.setAttribute('tabindex', '-1');
      principal.focus({ preventScroll: true });
    }
    aviso.textContent = documento.title;
  }

  let vez = 0; // dois cliques seguidos: só vale o último

  async function ir(url, opcoes) {
    const minha = ++vez;
    raiz.classList.add('a-caminho');
    let documento;
    try {
      documento = new DOMParser().parseFromString(await buscar(semAncora(url)), 'text/html');
      if (!documento.querySelector('main') || !documento.querySelector('.topo')) throw new Error(`fora do site: ${url.href}`);
    } catch (erro) {
      if (minha === vez) location.href = url.href;
      return;
    } finally {
      if (minha === vez) raiz.classList.remove('a-caminho');
    }
    if (minha !== vez) return;

    const fazer = () => trocar(documento, url, opcoes);
    const falhou = (erro) => { console.error(erro); location.href = url.href; };
    try {
      // a seção que sai e a que entra se cruzam (css/percurso.css); sem a transição no navegador, a troca é direta
      if (document.startViewTransition && !reduzMovimento()) document.startViewTransition(fazer).updateCallbackDone.catch(falhou);
      else fazer();
    } catch (erro) {
      falhou(erro);
    }
  }

  /* ---------- cliques, Voltar e Avançar ---------- */

  document.addEventListener('click', (evento) => {
    if (evento.defaultPrevented || evento.button !== 0 || evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey) return;
    const link = evento.target instanceof Element ? evento.target.closest('a[href]') : null;
    if (!link || (link.target && link.target !== '_self') || link.hasAttribute('download')) return;
    const url = new URL(link.href);
    if (!doSite(url)) return;
    const mesma = url.pathname === location.pathname && url.search === location.search;
    if (mesma && url.hash) return; // uma parte da mesma página: o navegador rola até ela
    evento.preventDefault();
    if (mesma) scrollTo({ top: 0, behavior: reduzMovimento() ? 'auto' : 'smooth' });
    else ir(url, { empurrar: true });
  });

  addEventListener('popstate', (evento) => {
    if (location.pathname === mostrada) return; // só a âncora mudou
    ir(new URL(location.href), { empurrar: false, y: evento.state && evento.state.y });
  });

  function adiantar(evento) {
    if (navigator.connection && navigator.connection.saveData) return;
    const link = evento.target instanceof Element ? evento.target.closest('a[href]') : null;
    if (!link) return;
    const url = new URL(link.href);
    // a busca antecipada é só um adianto: se falhar, o clique tenta de novo e, em último caso, recarrega
    if (doSite(url) && url.pathname !== location.pathname) buscar(semAncora(url)).catch(() => {});
  }
  document.addEventListener('pointerover', adiantar, { passive: true });
  document.addEventListener('touchstart', adiantar, { passive: true });
  document.addEventListener('focusin', adiantar);

  // a rolagem de cada seção fica guardada no histórico; ao recarregar ou voltar a uma página aberta do zero, ela volta
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  addEventListener('pagehide', lembrarRolagem);
  const chegada = performance.getEntriesByType('navigation')[0];
  if (chegada && chegada.type !== 'navigate' && history.state && history.state.y && !location.hash) {
    const y = history.state.y;
    addEventListener('load', () => scrollTo({ top: y, behavior: 'instant' }), { once: true });
  }
})();
