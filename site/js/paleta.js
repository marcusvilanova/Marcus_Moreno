/* Escolher paleta: o botão do topo abre as três paletas de cor do site.
   A escolha fica guardada neste navegador (localStorage) e vale para todas as páginas.
   As cores de cada paleta estão em css/paletas.css; aqui ficam só o nome, a descrição e as bolinhas de amostra. */
(() => {
  const PALETAS = [
    { id: 'palco', nome: 'Palco', descricao: 'A original: marrom profundo e papel.', cores: ['#1c140f', '#e7e0d3', '#b39a7e'] },
    { id: 'papel', nome: 'Papel', descricao: 'Clara e quente: linho, kraft e bistre.', cores: ['#e9e0d0', '#f1ebe0', '#6a4e38'] },
    { id: 'galeria', nome: 'Galeria', descricao: 'Clara e neutra: branco, cinza e grafite.', cores: ['#e9e7e3', '#f5f4f1', '#5a5047'] },
  ];
  const CHAVE = 'mm-paleta';
  const raiz = document.documentElement;
  const botao = document.querySelector('.topo__paleta');
  const lista = document.getElementById('paletas');
  if (!botao || !lista) return;

  const atual = () => raiz.dataset.paleta || 'palco';

  function marcar() {
    lista.querySelectorAll('.paleta__opcao').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.paleta === atual())));
  }

  function aplicar(id) {
    if (id === 'palco') delete raiz.dataset.paleta;
    else raiz.dataset.paleta = id;
    try {
      if (id === 'palco') localStorage.removeItem(CHAVE);
      else localStorage.setItem(CHAVE, id);
    } catch (e) { /* sem memória: a escolha vale só nesta página */ }
    marcar();
    dispatchEvent(new Event('scroll')); // o topo recalcula a cor do fundo
  }

  PALETAS.forEach((p) => {
    const opcao = document.createElement('button');
    opcao.type = 'button';
    opcao.className = 'paleta__opcao';
    opcao.dataset.paleta = p.id;
    const cores = document.createElement('span');
    cores.className = 'paleta__cores';
    cores.setAttribute('aria-hidden', 'true');
    p.cores.forEach((cor) => {
      const bolinha = document.createElement('i');
      bolinha.style.background = cor;
      cores.append(bolinha);
    });
    const nome = document.createElement('span');
    nome.className = 'paleta__nome';
    nome.textContent = p.nome;
    const descricao = document.createElement('span');
    descricao.className = 'paleta__desc';
    descricao.textContent = p.descricao;
    opcao.append(cores, nome, descricao);
    opcao.addEventListener('click', () => aplicar(p.id));
    lista.append(opcao);
  });
  marcar();

  function abrir(aberto) {
    lista.hidden = !aberto;
    botao.setAttribute('aria-expanded', String(aberto));
  }
  botao.addEventListener('click', () => abrir(lista.hidden));
  document.addEventListener('click', (e) => {
    if (!lista.hidden && !e.target.closest('.paleta')) abrir(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !lista.hidden) { abrir(false); botao.focus(); }
  });
})();
