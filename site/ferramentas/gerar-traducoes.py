# Gera o site em espanhol (site/es/) e em inglês (site/en/) a partir das páginas em português.
#
# As páginas em português continuam sendo a base: edite sempre elas. As traduções ficam em ferramentas/traducoes/,
# um arquivo por página (e comum.py para o topo, o índice, o rodapé e a entrada). Cada arquivo tem um dicionário T:
#     "texto em português": ("texto em espanhol", "texto em inglês"),
# e um conjunto MESMO com o que fica igual nas três línguas (nomes de pessoas, títulos de obras).
#
# Uso, de dentro da pasta site:
#     python ferramentas/gerar-traducoes.py              gera es/ e en/ e avisa quantos trechos ainda não têm tradução
#     python ferramentas/gerar-traducoes.py --faltando   lista esses trechos, página por página
# Um trecho sem tradução aparece em português na página traduzida, até ser acrescentado ao arquivo da página.
import importlib.util
import re
import sys
from pathlib import Path

SITE = Path(__file__).resolve().parent.parent
PASTA_TRADUCOES = Path(__file__).resolve().parent / "traducoes"
PAGINAS = ["index", "sobre", "criacoes", "entreato", "efemeros", "entrevistas", "presente",
           "curadoria", "textos", "trajetoria", "imprensa", "acervo", "contato"]
LINGUAS = {
    "pt": {"html": "pt-BR", "og": "pt_BR", "nome": "Português", "sigla": "PT", "pasta": ""},
    "es": {"html": "es", "og": "es_ES", "nome": "Español", "sigla": "ES", "pasta": "es/"},
    "en": {"html": "en", "og": "en_US", "nome": "English", "sigla": "EN", "pasta": "en/"},
}
POSICAO = {"es": 0, "en": 1}
KIT = {"pt": "programadores.html", "es": "es.html", "en": "en.html"}  # material para programadores em cada língua

PROTEGIDO = re.compile(r"<script\b.*?</script>|<style\b.*?</style>|<!--.*?-->", re.S)
ATRIBUTO = re.compile(r'(\s(?:alt|aria-label|title|data-titulo|data-title|placeholder)=")([^"]*)(")')
META = re.compile(r'(<meta (?:name="description"|property="og:title"|property="og:description"|property="og:image:alt") content=")([^"]*)(")')
TEXTO = re.compile(r"(?<=>)([^<]+)(?=<)")


def normalizar(texto: str) -> str:
    return " ".join(texto.split())


def carregar_traducoes() -> tuple[dict, set]:
    traducoes, mesmo = {}, set()
    for arquivo in sorted(PASTA_TRADUCOES.glob("*.py")):
        spec = importlib.util.spec_from_file_location(f"traducoes_{arquivo.stem}", arquivo)
        modulo = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(modulo)
        for pt, par in getattr(modulo, "T", {}).items():
            traducoes[normalizar(pt)] = par
        mesmo |= {normalizar(s) for s in getattr(modulo, "MESMO", set())}
    return traducoes, mesmo


def endereco(arquivo: str, de: str, para: str) -> str:
    """Link de uma página na língua `de` para o mesmo arquivo na língua `para`."""
    return ("" if de == "pt" else "../") + LINGUAS[para]["pasta"] + arquivo


def blocos_de_lingua(texto: str, pagina: str, lingua: str) -> str:
    """Os links entre as línguas: alternates no <head>, o seletor PT · ES · EN do topo e os itens do Índice."""
    arquivo = f"{pagina}.html"
    alternates = "".join(f'  <link rel="alternate" hreflang="{d["html"]}" href="{endereco(arquivo, lingua, l)}">\n'
                         for l, d in LINGUAS.items())
    texto = re.sub(r'(  <link rel="alternate" hreflang="[^"]+" href="[^"]+">\n)+', alternates, texto, count=1)
    rotulo = "Language" if lingua == "en" else "Idioma"
    seletor = f'<nav class="linguas" aria-label="{rotulo}">' + "".join(
        f'<a href="{endereco(arquivo, lingua, l)}" hreflang="{d["html"]}" lang="{d["html"]}"'
        + (' aria-current="page"' if l == lingua else "") + f'>{d["sigla"]}</a>'
        for l, d in LINGUAS.items()) + "</nav>"
    texto = re.sub(r'<nav class="linguas".*?</nav>', seletor, texto, count=1, flags=re.S)
    itens = "".join(f'      <li class="indice__lingua"><a href="{endereco(arquivo, lingua, l)}" hreflang="{d["html"]}" '
                    f'lang="{d["html"]}"><span>{d["sigla"]}</span>{d["nome"]}</a></li>\n'
                    for l, d in LINGUAS.items() if l != lingua)
    return re.sub(r'(      <li class="indice__lingua">.*?</li>\n)+', itens, texto, count=1)


def traduzir_trecho(trecho: str, lingua: str, traducoes: dict, mesmo: set, faltando: list) -> str:
    def trocar(original: str) -> str | None:
        chave = normalizar(original)
        if not chave or not re.search(r"[A-Za-zÀ-ÿ]", chave) or chave in mesmo:
            return None
        if chave not in traducoes:
            faltando.append(chave)
            return None
        return traducoes[chave][POSICAO[lingua]]

    def no_de_texto(m):
        bruto = m.group(1)
        novo = trocar(bruto)
        if novo is None:
            return bruto
        return bruto[:len(bruto) - len(bruto.lstrip())] + novo + bruto[len(bruto.rstrip()):]

    def atributo(m):
        novo = trocar(m.group(2))
        return m.group(0) if novo is None else m.group(1) + novo.replace('"', "&quot;") + m.group(3)

    trecho = META.sub(atributo, trecho)
    trecho = ATRIBUTO.sub(atributo, trecho)
    return TEXTO.sub(no_de_texto, trecho)


def ajustar_caminhos(trecho: str, lingua: str) -> str:
    """A página traduzida mora uma pasta abaixo: assets, css e js passam a começar com ../"""
    trecho = re.sub(r'(\s(?:src|href|poster|content|data-[\w-]+)=")(assets/|css/|js/)', r"\1../\2", trecho)
    trecho = re.sub(r'(srcset=")([^"]*)(")',
                    lambda m: m.group(1) + re.sub(r"(^|,\s*)assets/", r"\1../assets/", m.group(2)) + m.group(3), trecho)
    trecho = trecho.replace('href="programadores.html"', f'href="../{KIT[lingua]}"')
    return trecho.replace('href="conceito.html"', 'href="../conceito.html"')


def gerar(pagina: str, lingua: str, traducoes: dict, mesmo: set, faltando: list) -> str:
    texto = (SITE / f"{pagina}.html").read_text(encoding="utf-8")
    partes, fim = [], 0
    for m in PROTEGIDO.finditer(texto):
        livre = texto[fim:m.start()]
        partes.append(ajustar_caminhos(traduzir_trecho(livre, lingua, traducoes, mesmo, faltando), lingua))
        partes.append(m.group(0))
        fim = m.end()
    partes.append(ajustar_caminhos(traduzir_trecho(texto[fim:], lingua, traducoes, mesmo, faltando), lingua))
    saida = "".join(partes)
    # os blocos <script> não são traduzidos, mas o endereço dos arquivos de código também desce uma pasta
    saida = re.sub(r'(<script src=")(js/)', r"\1../\2", saida)
    saida = saida.replace('<html lang="pt-BR">', f'<html lang="{LINGUAS[lingua]["html"]}">', 1)
    saida = saida.replace('content="pt_BR"', f'content="{LINGUAS[lingua]["og"]}"', 1)
    saida = saida.replace("window.MM = { lingua: 'pt', raiz: '' };", f"window.MM = {{ lingua: '{lingua}', raiz: '../' }};", 1)
    return blocos_de_lingua(saida, pagina, lingua)


def principal(listar: bool) -> None:
    traducoes, mesmo = carregar_traducoes()
    faltando_por_pagina = {}
    for pagina in PAGINAS:
        origem = SITE / f"{pagina}.html"
        # as páginas em português também recebem os links certos entre as línguas
        texto = origem.read_text(encoding="utf-8")
        atualizado = blocos_de_lingua(texto, pagina, "pt")
        if atualizado != texto:
            origem.write_text(atualizado, encoding="utf-8")
        for lingua in ("es", "en"):
            faltando = []
            destino = SITE / lingua / f"{pagina}.html"
            destino.parent.mkdir(exist_ok=True)
            destino.write_text(gerar(pagina, lingua, traducoes, mesmo, faltando), encoding="utf-8")
            if lingua == "es":
                faltando_por_pagina[pagina] = list(dict.fromkeys(faltando))
    total = sum(len(v) for v in faltando_por_pagina.values())
    print(f"Gerado: {len(PAGINAS)} páginas em es/ e em en/. Trechos sem tradução: {total}")
    if listar:
        for pagina, trechos in faltando_por_pagina.items():
            if trechos:
                print(f"\n## {pagina} ({len(trechos)})")
                for t in trechos:
                    print(f"  {t}")


if __name__ == "__main__":
    principal("--faltando" in sys.argv)
