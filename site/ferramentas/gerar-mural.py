# Gera o mural do Acervo (antes do Contato): recorta cada imagem no mesmo formato (4:5), em assets/img/mural/,
# e escreve as três faixas no index.html, entre <!-- MURAL:INICIO --> e <!-- MURAL:FIM -->.
#
# Uso, de dentro da pasta site:   python ferramentas/gerar-mural.py
# Para trocar, tirar ou reordenar imagens, edite a lista FAIXAS abaixo e rode de novo.
# Cada peça: (arquivo em assets/img, ponto de foco x e y de 0 a 1, destino, legenda)
#   destino "#obra-flor" vira um link para a obra; destino ("video", id, início, título) abre o vídeo.
from html import escape
from pathlib import Path

from PIL import Image

SITE = Path(__file__).resolve().parent.parent
ORIGEM = SITE / "assets" / "img"
SAIDA = ORIGEM / "mural"
LARGURA, ALTURA = 512, 640  # 4:5, um pouco mais alta que larga, como os quadros de um acervo
QUALIDADE = 72


def video(id_video: str, inicio: str, titulo: str) -> tuple:
    return ("video", id_video, inicio, titulo)


FAIXAS = [
    [
        ("imagem-como-ausencia.webp", 0.72, 0.5, "#obra-ausencia", "2013 <cite>A Imagem como Ausência</cite>"),
        ("quadros/efemero-cora.webp", 0.5, 0.5, video("5xQ4a2cmItM", "1343", "Encontros Efêmeros: Marcus Moreno + Cora Laszlo · Encontro para contemplar o vento"), "Encontro Efêmero <cite>com Cora Laszlo</cite>"),
        ("flor-da-lua-patzdorf.webp", 0.5, 0.45, "#obra-flor", "2016 <cite>A Flor da Lua</cite>"),
        ("quadros/entrevista-zelia.webp", 0.5, 0.5, video("jd_U6hWVAxY", "", "Entrevista-performativa com Zélia Monteiro"), "Entrevista <cite>com Zélia Monteiro</cite>"),
        ("instante-ja-1.webp", 0.48, 0.5, "#obra-instante", "2019 <cite>Instante-já</cite>"),
        ("quadros/efemero-patricia.webp", 0.5, 0.5, video("mSVXEeCJtak", "356", "Encontros Efêmeros: Marcus Moreno + Patrícia Árabe"), "Encontro Efêmero <cite>com Patrícia Árabe</cite>"),
        ("onde-houver-ceu-1.webp", 0.5, 0.45, "#obra-ceu", "2024 <cite>Onde Houver Céu</cite>"),
        ("quadros/entrevista-key.webp", 0.5, 0.5, video("lXd31e4e4DI", "", "Entrevista-performativa com Key Sawao"), "Entrevista <cite>com Key Sawao</cite>"),
        ("retrato-25.webp", 0.55, 0.5, "#sobre", "Retrato · 2025"),
        ("quadros/efemero-jose-artur.webp", 0.5, 0.5, video("MUSrxQCvAzc", "16", "Encontros Efêmeros: Marcus Moreno + José Artur Campos"), "Encontro Efêmero <cite>com José Artur Campos</cite>"),
        ("sempre-mais-que-um.webp", 0.55, 0.5, "#obra-sempre", "2023 <cite>Sempre mais que um</cite>"),
    ],
    [
        ("estudo-encontro-2.webp", 0.5, 0.5, "#obra-estudo", "2017 <cite>Estudo para o Encontro</cite>"),
        ("quadros/entrevista-vera.webp", 0.86, 0.5, video("5UkvPAkzwQQ", "", "Entrevista-performativa com Vera Sala"), "Entrevista <cite>com Vera Sala</cite>"),
        ("flor-mario-de-andrade.webp", 0.6, 0.5, "#obra-flor", "2016 <cite>A Flor da Lua</cite>"),
        ("quadros/efemero-marcio.webp", 0.5, 0.5, video("BS4TVR6UXvo", "331", "Encontros Efêmeros: Marcus Moreno + Márcio Greyk"), "Encontro Efêmero <cite>com Márcio Greyk</cite>"),
        ("entre-espaco-still.webp", 0.53, 0.5, "#obra-cinema", "2021 <cite>Entre-espaço onde tudo existe</cite>"),
        ("quadros/entrevista-mariana.webp", 0.5, 0.5, video("azvbrgBYgow", "1", "Entrevista-performativa com Mariana Muniz"), "Entrevista <cite>com Mariana Muniz</cite>"),
        ("retrato-07.webp", 0.5, 0.5, "#entreato", "Retrato · 2025"),
        ("quadros/efemero-alex.webp", 0.5, 0.5, video("g3cO501wIUE", "2", "Encontros Efêmeros: Marcus Moreno + Alex Ratton"), "Encontro Efêmero <cite>com Alex Ratton</cite>"),
        ("fvp-8603.webp", 0.47, 0.5, "#trajetoria", "Palco"),
        ("para-insistir-em-brotar.webp", 0.55, 0.5, "#obra-brotar", "2021 <cite>Para insistir em brotar</cite>"),
    ],
    [
        ("instante-ja-2.webp", 0.5, 0.4, "#obra-instante", "2019 <cite>Instante-já</cite>"),
        ("quadros/entrevista-wellington.webp", 0.5, 0.5, video("UQLYlQUCsjA", "", "Entrevista-performativa com Wellington Duarte"), "Entrevista <cite>com Wellington Duarte</cite>"),
        ("flor-casa-caldeiras.webp", 0.62, 0.5, "#obra-flor", "2016 <cite>A Flor da Lua</cite>"),
        ("quadros/efemero-rafaela.webp", 0.5, 0.5, video("RpqCcdeJHao", "1", "Encontros Efêmeros: Marcus Moreno + Rafaela Sahyoun"), "Encontro Efêmero <cite>com Rafaela Sahyoun</cite>"),
        ("onde-houver-ceu-2.webp", 0.42, 0.5, "#obra-ceu", "2024 <cite>Onde Houver Céu</cite>"),
        ("quadros/entrevista-alex.webp", 0.86, 0.5, video("k5sz9-4NUl4", "", "Entrevista-performativa com Alex Ratton"), "Entrevista <cite>com Alex Ratton</cite>"),
        ("estudo-encontro-1.webp", 0.5, 0.5, "#obra-estudo", "2017 <cite>Estudo para o Encontro</cite>"),
        ("img-1639.webp", 0.48, 0.5, "#curadoria", "Marcus Moreno"),
        ("retrato-24.webp", 0.55, 0.5, "#presente", "<cite>Danças de Presente</cite>"),
        ("fvp-8547.webp", 0.5, 0.45, "#contato", "Palco"),
    ],
]
DURACOES = ["130s", "150s", "140s"]  # cada faixa anda num ritmo; a do meio, no sentido contrário


def recortar(arquivo: str, fx: float, fy: float) -> str:
    """Recorta no formato 4:5 em volta do ponto de foco e salva em assets/img/mural/."""
    im = Image.open(ORIGEM / arquivo).convert("RGB")
    w, h = im.size
    if w / h > LARGURA / ALTURA:  # mais larga: corta dos lados
        nw, nh = round(h * LARGURA / ALTURA), h
    else:                          # mais alta: corta em cima e embaixo
        nw, nh = w, round(w * ALTURA / LARGURA)
    x = min(max(round(fx * w - nw / 2), 0), w - nw)
    y = min(max(round(fy * h - nh / 2), 0), h - nh)
    nome = Path(arquivo).stem + ".webp"
    im.crop((x, y, x + nw, y + nh)).resize((LARGURA, ALTURA), Image.LANCZOS).save(SAIDA / nome, "WEBP", quality=QUALIDADE, method=6)
    return nome


def peca(nome: str, destino, legenda: str, indice: int) -> str:
    # o mural fica no fim da página: as imagens só carregam quando a pessoa se aproxima (ver iniciarAcervo no main.js)
    img = f'<img src="assets/img/mural/{nome}" width="{LARGURA}" height="{ALTURA}" alt="" loading="lazy" decoding="async">'
    rotulo = f'<span class="mural__legenda">{legenda}</span>'
    if isinstance(destino, tuple):
        _, id_video, inicio, titulo = destino
        inicio_attr = f' data-start="{inicio}"' if inicio else ""
        return (f'<button class="mural__peca" type="button" tabindex="-1" data-video="{id_video}"{inicio_attr} '
                f'data-titulo="{escape(titulo)}">{img}{rotulo}</button>')
    return f'<a class="mural__peca" href="{destino}" tabindex="-1">{img}{rotulo}</a>'


def principal() -> None:
    SAIDA.mkdir(exist_ok=True)
    usadas = set()
    faixas_html = []
    for n, (faixa, duracao) in enumerate(zip(FAIXAS, DURACOES)):
        pecas = []
        for i, (arquivo, fx, fy, destino, legenda) in enumerate(faixa):
            nome = recortar(arquivo, fx, fy)
            usadas.add(nome)
            pecas.append(peca(nome, destino, legenda, i))
        sequencia = "\n            ".join(pecas)
        # a sequência aparece duas vezes: quando a primeira sai pela esquerda, a cópia já ocupa o lugar
        faixas_html.append(f'''        <div class="mural__faixa{" mural__faixa--volta" if n == 1 else ""}" style="--duracao: {duracao}">
          <div class="mural__trilho">
            {sequencia}
            {sequencia}
          </div>
        </div>''')
    for velho in SAIDA.glob("*.webp"):
        if velho.name not in usadas:
            velho.unlink()

    bloco = ("<!-- MURAL:INICIO · gerado por ferramentas/gerar-mural.py; para mudar, edite lá e rode de novo -->\n"
             '      <div class="mural" aria-hidden="true">\n' + "\n".join(faixas_html) + "\n      </div>\n      <!-- MURAL:FIM -->")
    index = SITE / "index.html"
    texto = index.read_text(encoding="utf-8")
    inicio = texto.index("<!-- MURAL:INICIO")
    fim = texto.index("<!-- MURAL:FIM -->") + len("<!-- MURAL:FIM -->")
    index.write_text(texto[:inicio] + bloco + texto[fim:], encoding="utf-8")
    total = sum(len(f) for f in FAIXAS)
    peso = sum((SAIDA / n).stat().st_size for n in usadas) // 1024
    print(f"Mural: {total} imagens em {len(FAIXAS)} faixas, {peso} KB em assets/img/mural/")


if __name__ == "__main__":
    principal()
