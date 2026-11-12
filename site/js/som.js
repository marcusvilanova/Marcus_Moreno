/* Marcus Moreno · som do site
   Música feita na hora pelo navegador, sem arquivos: um grave que respira devagar, um sopro de ar
   e notas esparsas que caem como passos num palco vazio. Nunca toca igual duas vezes.
   Só começa quando a pessoa aperta "Som"; logo depois do carregamento, o botão se apresenta uma vez.
   O som acompanha a luz das seções (no palco escuro ele abafa, no papel claro ele abre), muda de
   caráter a cada seção (ver CENAS) e se cala enquanto um vídeo toca. */
(() => {
  'use strict';

  const botao = document.querySelector('.topo__som');
  const Contexto = window.AudioContext || window.webkitAudioContext;
  if (!botao) return;
  if (!Contexto) { botao.hidden = true; return; }

  const VOLUME = 0.8;
  // ré dórico sem o fá e o si: nenhuma nota briga com outra
  const NOTAS = [146.83, 164.81, 196.0, 220.0, 261.63, 293.66, 329.63, 392.0];
  // frequência de corte do filtro conforme o tom da seção
  const BRILHO = { foto: 900, dark: 1100, concrete: 2400, light: 4200 };

  // cada parte do site tem seu caráter: quanto pesa o grave, quantas notas caem uma oitava abaixo
  // ou acima, o espaço entre as notas (em ms) e a chance de um segundo passo logo depois
  const CENAS = {
    padrao: { grave: 0.05, graves: 0.2, agudas: 0, intervalo: [2600, 5200], segunda: 0.25 },
    palco: { grave: 0.075, graves: 0.55, agudas: 0, intervalo: [3400, 6200], segunda: 0.15 },   // as obras: mais fundo, mais espaçado
    conversa: { grave: 0.035, graves: 0.05, agudas: 0.3, intervalo: [1500, 3000], segunda: 0.45 }, // encontros e entrevistas: mais claro, como diálogo
    tempo: { grave: 0.045, graves: 0.2, agudas: 0, intervalo: [4200, 6400], segunda: 0.1 },     // textos, trajetória, imprensa: mais devagar
    fim: { grave: 0.03, graves: 0.35, agudas: 0, intervalo: [6500, 8000], segunda: 0 },         // contato: a sala se apagando
  };
  const CENA_DA_SECAO = {
    criacoes: 'palco', entreato: 'palco', presente: 'palco',
    efemeros: 'conversa', entrevistas: 'conversa',
    textos: 'tempo', trajetoria: 'tempo', imprensa: 'tempo',
    acervo: 'palco', contato: 'fim',
  };

  const topo = document.querySelector('.topo');
  let ctx = null;
  let saida = null;
  let filtro = null;
  let sala = null;
  let ligado = false;
  let calado = false; // um vídeo está tocando
  let espera = 0;
  let ultima = -1;
  let cena = CENAS.padrao;
  let corpoGrave = null;

  const brilhoAtual = () => BRILHO[topo && topo.dataset.tone] || 3000;
  const sorteio = (min, max) => min + Math.random() * (max - min);

  /* ---------- a sala: um eco longo, feito de ruído que se apaga ---------- */

  function criarSala() {
    const segundos = 4.5;
    const n = Math.floor(ctx.sampleRate * segundos);
    const resposta = ctx.createBuffer(2, n, ctx.sampleRate);
    for (let canal = 0; canal < 2; canal++) {
      const dados = resposta.getChannelData(canal);
      for (let i = 0; i < n; i++) dados[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 3.2);
    }
    const eco = ctx.createConvolver();
    eco.buffer = resposta;
    return eco;
  }

  function oscilador(freq, tipo = 'sine') {
    const o = ctx.createOscillator();
    o.type = tipo;
    o.frequency.value = freq;
    return o;
  }

  // um oscilador lento que faz um parâmetro subir e descer
  function respirar(parametro, velocidade, amplitude) {
    const lfo = oscilador(velocidade);
    const ganho = ctx.createGain();
    ganho.gain.value = amplitude;
    lfo.connect(ganho).connect(parametro);
    lfo.start();
  }

  /* ---------- o grave: ré e lá, levemente desafinados, que respiram ---------- */

  function criarGrave() {
    const corpo = ctx.createGain();
    corpo.gain.value = cena.grave;
    corpoGrave = corpo;
    respirar(corpo.gain, 0.06, 0.025);
    // os dois rés batem a cada 5 segundos, como uma respiração lenta
    [[73.42, 1, 'sine'], [73.62, 0.5, 'sine'], [110, 0.35, 'sine'], [146.83, 0.08, 'triangle']].forEach(([freq, nivel, tipo]) => {
      const o = oscilador(freq, tipo);
      const g = ctx.createGain();
      g.gain.value = nivel;
      o.connect(g).connect(corpo);
      o.start();
    });
    corpo.connect(filtro);
    corpo.connect(sala);
  }

  /* ---------- o ar: ruído filtrado, como vento numa sala grande ---------- */

  function criarAr() {
    const n = ctx.sampleRate * 3;
    const ruido = ctx.createBuffer(1, n, ctx.sampleRate);
    const dados = ruido.getChannelData(0);
    for (let i = 0; i < n; i++) dados[i] = Math.random() * 2 - 1;
    const fonte = ctx.createBufferSource();
    fonte.buffer = ruido;
    fonte.loop = true;

    const banda = ctx.createBiquadFilter();
    banda.type = 'bandpass';
    banda.frequency.value = 650;
    banda.Q.value = 0.6;
    respirar(banda.frequency, 0.03, 280);

    const ganho = ctx.createGain();
    ganho.gain.value = 0.014;
    respirar(ganho.gain, 0.045, 0.011);

    fonte.connect(banda).connect(ganho);
    ganho.connect(filtro);
    ganho.connect(sala);
    fonte.start();
  }

  /* ---------- as notas: como um vidro tocado de leve, cada uma num lugar do espaço ---------- */

  function tocarNota(quando) {
    let i;
    do { i = Math.floor(Math.random() * NOTAS.length); } while (i === ultima);
    ultima = i;
    const sorte = Math.random();
    const oitava = sorte < cena.graves ? 0.5 : (sorte > 1 - cena.agudas ? 2 : 1);
    const freq = NOTAS[i] * oitava;
    const duracao = sorteio(5, 9);
    const pico = sorteio(0.045, 0.085);

    const envelope = ctx.createGain();
    envelope.gain.setValueAtTime(0, quando);
    envelope.gain.linearRampToValueAtTime(pico, quando + sorteio(0.015, 0.6));
    envelope.gain.exponentialRampToValueAtTime(0.0001, quando + duracao);

    const lugar = ctx.createStereoPanner ? ctx.createStereoPanner() : ctx.createGain();
    if (lugar.pan) lugar.pan.value = sorteio(-0.7, 0.7);
    const seco = ctx.createGain();
    seco.gain.value = 0.35;
    envelope.connect(lugar);
    lugar.connect(sala);
    lugar.connect(seco).connect(filtro);

    // a fundamental e dois harmônicos fracos
    [[1, 1], [2, 0.16], [3.01, 0.05]].forEach(([multiplo, nivel], k) => {
      const o = oscilador(freq * multiplo);
      const g = ctx.createGain();
      g.gain.value = nivel;
      o.connect(g).connect(envelope);
      o.start(quando);
      o.stop(quando + duracao + 0.1);
      if (k === 0) o.onended = () => { envelope.disconnect(); lugar.disconnect(); seco.disconnect(); };
    });
  }

  function agendar() {
    if (!ligado) return;
    // aba escondida: o tempo do áudio para, então não acumula notas
    if (!document.hidden) {
      const agora = ctx.currentTime + 0.05;
      tocarNota(agora);
      if (Math.random() < cena.segunda) tocarNota(agora + sorteio(0.6, 1.8)); // às vezes, um segundo passo
    }
    espera = setTimeout(agendar, cena.intervalo[0] + Math.random() * cena.intervalo[1]);
  }

  /* ---------- montar, ligar, desligar ---------- */

  function montar() {
    ctx = new Contexto();
    saida = ctx.createGain();
    saida.gain.value = 0;
    saida.connect(ctx.destination);

    filtro = ctx.createBiquadFilter();
    filtro.type = 'lowpass';
    filtro.frequency.value = brilhoAtual();
    filtro.Q.value = 0.4;
    filtro.connect(saida);

    sala = criarSala();
    const molhado = ctx.createGain();
    molhado.gain.value = 0.9;
    sala.connect(molhado).connect(filtro);

    criarGrave();
    criarAr();
  }

  // chega em cerca de um terço do tempo pedido e se assenta no resto
  function ajustarVolume(segundos) {
    const alvo = ligado && !calado ? VOLUME : 0;
    saida.gain.cancelScheduledValues(ctx.currentTime);
    saida.gain.setTargetAtTime(alvo, ctx.currentTime, segundos / 3);
  }

  function alternar() {
    botao.classList.remove('is-convite');
    ligado = !ligado;
    botao.setAttribute('aria-pressed', String(ligado));
    if (!ctx) montar();
    clearTimeout(espera);
    if (ligado) {
      ctx.resume();
      ajustarVolume(3);
      agendar();
    } else {
      ajustarVolume(1);
      setTimeout(() => { if (!ligado) ctx.suspend(); }, 1600);
    }
  }

  botao.addEventListener('click', alternar);

  /* ---------- a cena muda com a seção que está no meio da tela ---------- */

  if ('IntersectionObserver' in window) {
    const observador = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => {
        if (!e.isIntersecting) return;
        cena = CENAS[CENA_DA_SECAO[e.target.id]] || CENAS.padrao;
        if (ctx && corpoGrave) corpoGrave.gain.setTargetAtTime(cena.grave, ctx.currentTime, 2);
      });
    }, { rootMargin: '-50% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach((s) => observador.observe(s));
  }

  /* ---------- convite: depois do carregamento, o botão se apresenta uma vez por visita ---------- */

  function convidar() {
    try { if (sessionStorage.getItem('mm-som-convite')) return; sessionStorage.setItem('mm-som-convite', '1'); } catch (e) { /* sem memória: o convite pode voltar */ }
    if (ligado) return;
    botao.classList.add('is-convite');
    setTimeout(() => botao.classList.remove('is-convite'), 5000);
  }
  const raiz = document.documentElement;
  if (raiz.classList.contains('com-carregamento')) {
    // espera o nome terminar de se escrever e a luz subir
    const fimDoCarregamento = new MutationObserver(() => {
      if (raiz.classList.contains('com-carregamento')) return;
      fimDoCarregamento.disconnect();
      setTimeout(convidar, 1800);
    });
    fimDoCarregamento.observe(raiz, { attributes: true, attributeFilter: ['class'] });
  } else {
    setTimeout(convidar, 2500);
  }

  // a luz da seção muda o timbre
  if (topo) {
    new MutationObserver(() => {
      if (ctx) filtro.frequency.setTargetAtTime(brilhoAtual(), ctx.currentTime, 1.2);
    }).observe(topo, { attributes: true, attributeFilter: ['data-tone'] });
  }

  // enquanto um vídeo do YouTube estiver aberto, o som se cala
  new MutationObserver(() => {
    const temVideo = !!document.querySelector('iframe');
    if (temVideo === calado) return;
    calado = temVideo;
    if (ctx && ligado) ajustarVolume(calado ? 0.6 : 4);
  }).observe(document.body, { childList: true, subtree: true });

  document.addEventListener('visibilitychange', () => {
    if (!ctx || !ligado) return;
    if (document.hidden) ctx.suspend();
    else ctx.resume();
  });
})();
