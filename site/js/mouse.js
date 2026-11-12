/* Marcus Moreno · gestos do mouse
   Três efeitos nas fotos, só no computador e só para quem não pede movimento reduzido
   (o cursor é o do sistema, a seta normal):
   1. refletor: um círculo de luz segue o mouse e só dentro dele a foto ganha a cor e o brilho originais;
   2. água: só na foto de Sempre mais que um, a imagem ondula na medida da velocidade do gesto;
   3. paralaxe: a foto desliza alguns pixels dentro da moldura, no sentido oposto ao mouse.
   Nada roda em repouso: cada laço de animação para sozinho quando não há mais o que mover. */
(() => {
  'use strict';

  const reduzMovimento = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ponteiroFino = matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (reduzMovimento || !ponteiroFino) return;

  const aproximar = (de, para, k) => de + (para - de) * k;
  const COM_AGUA = '#obra-sempre img.tinta';

  /* ---------- 1 · refletor ----------
     Uma cópia da foto, em cor e sem filtro, fica por cima dela, recortada por uma máscara circular
     que acompanha o mouse; a foto de baixo escurece um pouco, como a plateia fora do foco de luz. */
  const luz = document.createElement('img');
  luz.className = 'refletor';
  luz.alt = '';
  luz.setAttribute('aria-hidden', 'true');
  document.body.append(luz);

  function acender(foto) {
    luz.src = foto.currentSrc || foto.src;
    const estilo = getComputedStyle(foto);
    luz.style.objectFit = estilo.objectFit;
    luz.style.objectPosition = estilo.objectPosition;
    foto.classList.add('com-refletor');
    luz.classList.add('is-aceso');
  }

  function apagar(foto) {
    luz.classList.remove('is-aceso');
    if (foto) foto.classList.remove('com-refletor');
  }

  // a cópia ocupa exatamente o lugar da foto e é recortada pela moldura dela
  function posicionar(foto, mx, my) {
    const r = foto.getBoundingClientRect();
    const m = foto.parentElement.getBoundingClientRect();
    Object.assign(luz.style, { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` });
    luz.style.clipPath = `inset(${Math.max(0, m.top - r.top)}px ${Math.max(0, r.right - m.right)}px ${Math.max(0, r.bottom - m.bottom)}px ${Math.max(0, m.left - r.left)}px)`;
    luz.style.setProperty('--rx', `${mx - r.left}px`);
    luz.style.setProperty('--ry', `${my - r.top}px`);
    luz.style.setProperty('--raio', `${Math.max(150, Math.max(r.width, r.height) * 0.24)}px`);
  }

  /* ---------- 2 e 3 · água (só em Sempre mais que um) e paralaxe ---------- */

  function iniciarFotosVivas() {
    const mapa = document.querySelector('#agua feDisplacementMap');
    const ruido = document.querySelector('#agua feTurbulence');

    const FORCA_MAX = 16;    // ondulação máxima, em pixels
    const DESLIZE = 5;       // paralaxe máxima, em pixels
    let foto = null;         // a foto sob o mouse
    let forca = 0;           // cresce com a velocidade do mouse, decai sozinha
    let alvoX = 0; let alvoY = 0; let px = 0; let py = 0;
    let mouse = { x: 0, y: 0 };
    let anterior = null;
    let rodando = false;

    const temAgua = (el) => el && mapa && el.matches(COM_AGUA);

    function soltar(el) {
      if (!el) return;
      el.classList.remove('is-agua');
      el.style.translate = '';
      el.style.scale = '';
      apagar(el);
    }

    function passo(agora) {
      forca *= 0.93;
      px = aproximar(px, foto ? alvoX : 0, 0.1);
      py = aproximar(py, foto ? alvoY : 0, 0.1);

      if (foto) {
        foto.classList.toggle('is-agua', temAgua(foto) && forca > 0.25);
        foto.style.translate = `${(-px * DESLIZE).toFixed(2)}px ${(-py * DESLIZE).toFixed(2)}px`;
        foto.style.scale = '1.025';
        if (!temAgua(foto)) posicionar(foto, mouse.x, mouse.y);
      }
      if (mapa && forca > 0.25) {
        mapa.setAttribute('scale', forca.toFixed(2));
        // a água corre devagar enquanto há gesto
        ruido.setAttribute('baseFrequency', `0.011 ${(0.024 + Math.sin(agora / 700) * 0.004).toFixed(4)}`);
      }

      const parado = forca < 0.25 && Math.abs(px - (foto ? alvoX : 0)) < 0.01 && Math.abs(py - (foto ? alvoY : 0)) < 0.01;
      if (parado) {
        if (mapa) mapa.setAttribute('scale', '0');
        if (foto) foto.classList.remove('is-agua');
        rodando = false;
        return;
      }
      requestAnimationFrame(passo);
    }

    addEventListener('pointermove', (e) => {
      if (anterior) forca = Math.min(FORCA_MAX, forca + Math.hypot(e.clientX - anterior.x, e.clientY - anterior.y) * 0.12);
      anterior = { x: e.clientX, y: e.clientY };
      mouse = anterior;

      const sob = e.target instanceof Element ? e.target.closest('img.tinta') : null;
      if (sob !== foto) {
        soltar(foto);
        foto = sob;
        if (foto && !temAgua(foto)) acender(foto);
      }
      if (foto) {
        const r = foto.getBoundingClientRect();
        alvoX = ((e.clientX - r.left) / r.width - 0.5) * 2;
        alvoY = ((e.clientY - r.top) / r.height - 0.5) * 2;
        if (!temAgua(foto)) posicionar(foto, e.clientX, e.clientY);
      }
      if (!rodando) { rodando = true; requestAnimationFrame(passo); }
    }, { passive: true });

    // ao rolar com o mouse parado, a foto sai de baixo dele: o refletor acompanha ou se apaga
    addEventListener('scroll', () => {
      if (!foto) return;
      const sob = document.elementFromPoint(mouse.x, mouse.y);
      if (!sob || sob.closest('img.tinta') !== foto) { soltar(foto); foto = null; return; }
      if (!temAgua(foto)) posicionar(foto, mouse.x, mouse.y);
    }, { passive: true });
  }

  iniciarFotosVivas();
})();
