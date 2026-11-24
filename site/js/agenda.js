/* Marcus Moreno · agenda
   ESTE É O ARQUIVO PARA ATUALIZAR O QUE ESTÁ ACONTECENDO. Não é preciso mexer no index.html.

   Cada item fica entre { } e tem:
     tipo     · o que é (Residência artística, Apresentação, Oficina, Estreia...)
     quando   · como a data aparece no site, do jeito que você quiser escrever
     titulo   · nome da obra, do projeto ou do evento (aparece em itálico)
     detalhe  · uma linha sobre onde, com quem
     ate      · (opcional) último dia, no formato ANO-MÊS-DIA. Depois dessa data o item some sozinho.
     es, en   · (opcional) o mesmo item no site em espanhol e em inglês: { tipo, quando, detalhe }.
                O que faltar aparece em português. O título da obra não se traduz.

   Para acrescentar, copie um bloco { ... }, cole abaixo e troque os textos.
   Os itens aparecem na ordem em que estão aqui. */

window.AGENDA = [
  {
    tipo: 'Residência artística',
    quando: '14 out — 13 dez 2026',
    titulo: 'Imagens da Memória: Espirais em Movimento',
    detalhe: 'com Marcus Moreno, Maria Fernanda Machado e Raony Iaconis',
    ate: '2026-12-13',
    es: { tipo: 'Residencia artística', quando: '14 oct — 13 dic 2026', detalhe: 'con Marcus Moreno, Maria Fernanda Machado y Raony Iaconis' },
    en: { tipo: 'Artist residency', quando: 'Oct 14 — Dec 13, 2026', detalhe: 'with Marcus Moreno, Maria Fernanda Machado and Raony Iaconis' },
  },
  {
    tipo: 'Em desenvolvimento',
    quando: '',
    titulo: 'Onde se Possa Dançar',
    detalhe: 'projeto contemplado pela 39ª edição do Fomento à Dança',
    es: { tipo: 'En desarrollo', detalhe: 'proyecto seleccionado en la 39ª edición del Fomento a la Danza' },
    en: { tipo: 'In development', detalhe: "a project selected in the 39th edition of São Paulo's Fomento à Dança" },
  },
];

/* ---------- daqui para baixo, o desenho da agenda (não precisa mexer) ---------- */
(() => {
  'use strict';

  const lista = document.querySelector('[data-agenda]');
  if (!lista || !Array.isArray(window.AGENDA)) return;

  const hoje = new Date().toISOString().slice(0, 10);
  const LINGUA = (window.MM && window.MM.lingua) || 'pt';
  // nas páginas traduzidas, cada campo usa a versão da língua quando ela existe
  const vigentes = window.AGENDA
    .filter((item) => !item.ate || item.ate >= hoje)
    .map((item) => ({ ...item, ...(item[LINGUA] || {}) }));

  function criarItem(item) {
    // cada item é um cartaz de teatro: o tipo no alto, o título grande ao centro, o detalhe e, no pé, a data
    const li = document.createElement('li');
    li.className = 'agora__cartaz';
    const tipo = document.createElement('span');
    tipo.className = 'agora__tipo';
    tipo.textContent = item.tipo || '';
    const titulo = document.createElement('p');
    titulo.className = 'agora__titulo';
    const cite = document.createElement('cite');
    cite.textContent = item.titulo || '';
    titulo.append(cite);
    li.append(tipo, titulo);
    if (item.detalhe) {
      const detalhe = document.createElement('p');
      detalhe.className = 'agora__detalhe';
      detalhe.textContent = item.detalhe;
      li.append(detalhe);
    }
    if (item.quando) {
      const quando = document.createElement('p');
      quando.className = 'agora__quando';
      quando.textContent = item.quando;
      li.append(quando);
    }
    return li;
  }

  lista.replaceChildren(...vigentes.map(criarItem));
  // sem nada acontecendo, a faixa inteira sai de cena
  const faixa = lista.closest('.agora');
  if (faixa) faixa.hidden = vigentes.length === 0;
})();
