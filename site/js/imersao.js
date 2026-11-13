/* Marcus Moreno · imersão
   1. entrada: sobre o vídeo das Danças de Presente, o nome de Marcus se escreve à mão e o botão Entrar abre o site;
   2. quadro que cresce: o quadro de Entre-espaço começa muito pequeno e cresce até tomar a tela;
   3. cena de Instante-já: as três perguntas passam uma a uma sobre a foto, no ritmo da rolagem;
   4. telões: os trechos de vídeo atrás de quatro seções só carregam quando a seção se aproxima e só tocam enquanto ela está na tela. */
(() => {
  'use strict';

  const reduzMovimento = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const raiz = document.documentElement;
  const limitar = (v, min, max) => Math.min(max, Math.max(min, v));

  // vídeo de fundo, sem som e em loop; ganha a classe is-tocando (e acende por cima do quadro parado) quando começa a tocar
  function criarVideo(src, classe) {
    const video = document.createElement('video');
    if (classe) video.className = classe;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('aria-hidden', 'true');
    video.preload = 'auto';
    video.src = src;
    video.addEventListener('playing', () => video.classList.add('is-tocando'), { once: true });
    return video;
  }

  /* ---------- 1 · entrada ---------- */

  // o nome se escreve sobre o vídeo; quando termina, aparece o botão, e o site só abre quando a pessoa entra
  function iniciarCarregamento() {
    const tela = document.querySelector('.carregando');
    if (!tela || !raiz.classList.contains('com-carregamento')) return;
    raiz.dataset.entrada = 'aberta'; // a garantia do <head> não abre o site sozinha: quem entra é a pessoa
    const nome = tela.querySelector('.carregando__nome');
    const botoes = tela.querySelectorAll('.carregando__entrar');
    // enquanto a entrada está aberta, o resto da página fica fora do alcance do teclado
    const fundo = [...document.body.children].filter((el) => el !== tela);
    fundo.forEach((el) => { el.inert = true; });

    // sem movimento reduzido, o vídeo toca atrás do nome; se o navegador não deixar, fica o quadro parado
    const video = reduzMovimento ? null : criarVideo('assets/video/presente-key.mp4', 'carregando__video');
    if (video) {
      tela.querySelector('.carregando__quadro').after(video);
      video.play().catch(() => {});
    }

    const escrito = reduzMovimento
      ? new Promise((r) => setTimeout(r, 600))
      : new Promise((r) => { nome.addEventListener('animationend', r, { once: true }); setTimeout(r, 3600); });
    // os dois botões são a única coisa que o teclado alcança enquanto a entrada está aberta: um Tab chega neles
    escrito.then(() => tela.classList.add('is-pronta'));

    let entrou = false;
    function entrar(comSom) {
      if (entrou) return;
      entrou = true;
      // a escolha do som já foi feita aqui: o botão Som do topo não precisa mais se apresentar
      try { sessionStorage.setItem('mm-carregou', '1'); sessionStorage.setItem('mm-som-convite', '1'); } catch (e) { /* sem memória: a entrada volta na próxima visita */ }
      fundo.forEach((el) => { el.inert = false; });
      // com som: liga a música pelo botão do topo (este clique vale como a permissão que o navegador exige)
      const som = comSom && document.querySelector('.topo__som');
      if (som) som.click();
      raiz.classList.remove('com-carregamento'); // o site começa
      tela.style.display = 'grid';               // continua visível só durante a saída
      tela.classList.add('is-saindo');
      setTimeout(() => {
        tela.hidden = true;
        tela.style.display = '';
        if (video) video.remove();
      }, reduzMovimento ? 0 : 1400);
    }
    botoes.forEach((botao) => botao.addEventListener('click', () => entrar(botao.hasAttribute('data-som'))));
  }

  /* ---------- quadro que cresce (Entre-espaço) ----------
     A tela para e o quadro, muito pequeno no início, cresce até as bordas. Chega à tela cheia aos 85% do caminho
     e fica assim no resto, para a imagem respirar inteira antes de a página seguir. */

  function iniciarExpansao() {
    if (reduzMovimento) return;
    const suave = (t) => (t < 0.5 ? 2 * t * t : 1 - ((-2 * t + 2) ** 2) / 2);
    document.querySelectorAll('[data-expande]').forEach((caixa) => {
      const palco = caixa.querySelector('.expande__palco');
      caixa.classList.add('is-viva');
      let pedido = false;
      function atualizar() {
        pedido = false;
        const r = caixa.getBoundingClientRect();
        const percurso = r.height - palco.offsetHeight;
        const p = percurso > 0 ? limitar(-r.top / percurso, 0, 1) : 1;
        // cresce até 67% do caminho, fica inteiro até 80% e, daí ao fim, se desfaz em desfoque (--p, no css/obras.css)
        caixa.style.setProperty('--q', suave(limitar(p / 0.67, 0, 1)).toFixed(4));
        caixa.style.setProperty('--p', p.toFixed(3));
      }
      const pedir = () => { if (!pedido) { pedido = true; requestAnimationFrame(atualizar); } };
      addEventListener('scroll', pedir, { passive: true });
      addEventListener('resize', pedir);
      atualizar();
    });
  }

  /* ---------- 2 · cena de Instante-já ---------- */

  function iniciarCena() {
    const cena = document.querySelector('[data-cena-instante]');
    if (!cena || reduzMovimento) return;
    const perguntas = [...cena.querySelectorAll('.cena-instante__perguntas li')];
    cena.classList.add('is-viva');

    // 0–10%: só a foto; depois, uma pergunta a cada trecho; perto do fim, a foto de novo, sem pergunta,
    // e a partir de 83% ela se desfaz em desfoque até o escuro do palco (no css/imersao.css)
    const INICIO = 0.1;
    const FIM = 0.75;
    let pedido = false;

    function atualizar() {
      pedido = false;
      const r = cena.getBoundingClientRect();
      const p = limitar(-r.top / (r.height - innerHeight), 0, 1);
      const trecho = (FIM - INICIO) / perguntas.length;
      const atual = p < INICIO || p >= FIM ? -1 : Math.floor((p - INICIO) / trecho);
      perguntas.forEach((li, i) => li.classList.toggle('is-atual', i === atual));
      cena.classList.toggle('com-pergunta', atual >= 0);
      cena.style.setProperty('--p', p.toFixed(3));
    }

    const pedir = () => { if (!pedido) { pedido = true; requestAnimationFrame(atualizar); } };
    addEventListener('scroll', pedir, { passive: true });
    addEventListener('resize', pedir);
    atualizar();
  }

  /* ---------- 4 · telões ---------- */

  // o vídeo entra por cima do quadro parado quando começa a tocar; para quem pede movimento reduzido, fica só o quadro
  function iniciarTeloes() {
    const teloes = document.querySelectorAll('.telao[data-video]');
    if (reduzMovimento || !teloes.length || !('IntersectionObserver' in window)) return;
    // em telas pequenas, a versão menor do vídeo, quando existe
    const fonte = (telao) => (innerWidth <= 800 && telao.dataset.videoMenor) || telao.dataset.video;
    const olhar = new IntersectionObserver((entradas) => {
      entradas.forEach(({ target, isIntersecting }) => {
        let video = target.querySelector('video');
        if (isIntersecting && !video) {
          video = criarVideo(fonte(target));
          target.querySelector('.telao__quadro').append(video);
        }
        if (!video) return;
        // se o navegador não deixar tocar (economia de bateria, por exemplo), o quadro parado continua no lugar
        if (isIntersecting) video.play().catch(() => {});
        else video.pause();
      });
    }, { rootMargin: '30% 0px' });
    // o vídeo começa a baixar duas telas antes de a seção aparecer, para já estar pronto na chegada
    const adiantar = new IntersectionObserver((entradas, obs) => {
      entradas.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        obs.unobserve(target);
        if (!target.querySelector('video')) target.querySelector('.telao__quadro').append(criarVideo(fonte(target)));
      });
    }, { rootMargin: '200% 0px' });
    teloes.forEach((telao) => { adiantar.observe(telao); olhar.observe(telao); });
  }

  /* ---------- 5 · assinatura do rodapé ---------- */

  // o nome à mão se escreve de novo quando o rodapé aparece: o site fecha como abriu
  function iniciarAssinatura() {
    const nome = document.querySelector('.colofao__nome');
    if (!nome) return;
    if (!('IntersectionObserver' in window)) { nome.classList.add('is-escrita'); return; }
    // observa o rodapé, não o nome: antes de se escrever, o nome está todo recortado e não conta como visível
    new IntersectionObserver(([e], olhar) => {
      if (!e.isIntersecting) return;
      nome.classList.add('is-escrita');
      olhar.disconnect();
    }, { threshold: 0.3 }).observe(nome.parentElement);
  }

  /* ---------- 6 · ampliar as fotos ---------- */

  // um clique na foto a abre grande, em cor; o X, o Esc ou um clique fora fecham.
  // Ficam de fora as fotos que são o próprio vídeo: as das entrevistas, o quadro de Entre-espaço e Sempre mais que um.
  const NAO_AMPLIA = '.conversa__botao, .expande, .obra--tela-cheia';

  function iniciarAmpliar() {
    const fotos = [...document.querySelectorAll('img.tinta')].filter((img) => !img.closest(NAO_AMPLIA));
    if (!fotos.length || typeof HTMLDialogElement !== 'function') return;

    const caixa = document.createElement('dialog');
    caixa.className = 'ampliar';
    caixa.setAttribute('aria-label', 'Foto ampliada');
    caixa.innerHTML = '<button class="ampliar__fechar" type="button" aria-label="Fechar">×</button>'
      + '<figure class="ampliar__quadro"><img alt=""><figcaption class="ampliar__legenda"></figcaption></figure>';
    document.body.append(caixa);
    const grande = caixa.querySelector('img');
    const legenda = caixa.querySelector('figcaption');

    // a versão maior da foto: a última do srcset, ou a própria
    const maior = (img) => {
      const opcoes = (img.getAttribute('srcset') || '').split(',').map((s) => s.trim().split(/\s+/)[0]).filter(Boolean);
      return opcoes.length ? opcoes[opcoes.length - 1] : img.currentSrc || img.src;
    };

    fotos.forEach((img) => img.classList.add('is-ampliavel'));
    // captura: o clique na foto abre a foto, não o vídeo (o vídeo continua no botão Assistir)
    document.addEventListener('click', (e) => {
      const img = e.target instanceof Element ? e.target.closest('img.is-ampliavel') : null;
      if (!img) return;
      e.preventDefault();
      e.stopPropagation();
      grande.src = maior(img);
      grande.alt = img.alt;
      const cap = img.closest('figure')?.querySelector('figcaption');
      legenda.textContent = cap ? cap.textContent.trim() : '';
      caixa.showModal();
    }, true);
    caixa.querySelector('.ampliar__fechar').addEventListener('click', () => caixa.close());
    caixa.addEventListener('click', (e) => { if (e.target === caixa) caixa.close(); });
  }

  iniciarCarregamento();
  iniciarAmpliar();
  iniciarExpansao();
  iniciarCena();
  iniciarTeloes();
  iniciarAssinatura();
})();
