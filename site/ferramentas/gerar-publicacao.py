# Gera a versão de publicação do site na pasta "publicar", ao lado da pasta "site".
# Junta os arquivos de estilo da página inicial em um só (css/site.min.css) e os 5 de código em um só
# (js/site.min.js), tira os comentários e deixa de fora o que é só de trabalho (ferramentas, LEIA-ME,
# PUBLICAR, abrir-site.bat e o caderno de conceito, que tem as pendências internas).
#
# Uso, de dentro da pasta site:   python ferramentas/gerar-publicacao.py
# Para publicar também o caderno de conceito:   python ferramentas/gerar-publicacao.py --com-conceito
#
# Edite sempre a pasta "site" e gere de novo; a pasta "publicar" é apagada e refeita a cada vez.
import re
import shutil
import sys
from pathlib import Path

SITE = Path(__file__).resolve().parent.parent
SAIDA = SITE.parent / "publicar"
MARCA = ".gerada-por-gerar-publicacao"

# na ordem em que a página inicial os carrega
CSS_DA_CAPA = ["fontes", "base", "obras", "secoes", "acervo", "laterais", "entreato", "imersao"]
JS_DA_CAPA = ["agenda", "main", "mouse", "som", "imersao"]
# arquivos de estilo que outras páginas (programadores, es, en, 404) continuam usando soltos
CSS_SOLTOS = {"fontes", "base", "programadores"}

FORA = {"ferramentas", "LEIA-ME.md", "PUBLICAR.md", "abrir-site.bat", "__pycache__"}


def compactar_css(texto: str) -> str:
    texto = re.sub(r"/\*.*?\*/", "", texto, flags=re.S)
    linhas = (linha.strip() for linha in texto.splitlines())
    texto = " ".join(linha for linha in linhas if linha)
    texto = re.sub(r" {2,}", " ", texto)
    # só em volta de chaves e ponto e vírgula, onde o espaço nunca faz diferença
    return re.sub(r"\s*([{};])\s*", r"\1", texto)


def compactar_js(texto: str) -> str:
    """Tira comentários de linha inteira e o recuo; não mexe dentro das linhas de código."""
    saida = []
    em_bloco = False
    for linha in texto.splitlines():
        limpa = linha.strip()
        if em_bloco:
            if "*/" in limpa:
                em_bloco = False
            continue
        if limpa.startswith("/*"):
            em_bloco = "*/" not in limpa
            continue
        if not limpa or limpa.startswith("//"):
            continue
        saida.append(limpa)
    return "\n".join(saida)


def tirar_comentarios_html(texto: str) -> str:
    return re.sub(r"<!--(?!\[if).*?-->\s*", "", texto, flags=re.S)


def principal(com_conceito: bool) -> None:
    if SAIDA.exists():
        vazia = not any(SAIDA.iterdir())
        if not vazia and not (SAIDA / MARCA).exists():
            sys.exit(f"A pasta {SAIDA} existe e não foi criada por este script. Nada foi apagado.")
        try:
            shutil.rmtree(SAIDA)
        except PermissionError:
            sys.exit(f"Não consegui apagar {SAIDA}: feche o que estiver usando essa pasta (um servidor, o Explorador) e rode de novo.")

    fora = set(FORA)
    if not com_conceito:
        fora |= {"conceito.html"}
    shutil.copytree(SITE, SAIDA, ignore=lambda pasta, nomes: [n for n in nomes if n in fora])
    (SAIDA / MARCA).write_text("Pasta gerada por ferramentas/gerar-publicacao.py. Pode ser apagada e refeita.\n", encoding="utf-8")

    # estilos: um arquivo só para a página inicial
    css = "\n".join((SITE / "css" / f"{nome}.css").read_text(encoding="utf-8") for nome in CSS_DA_CAPA)
    (SAIDA / "css" / "site.min.css").write_text(compactar_css(css), encoding="utf-8")
    for nome in CSS_DA_CAPA:
        if nome not in CSS_SOLTOS:
            (SAIDA / "css" / f"{nome}.css").unlink()
    if not com_conceito:
        (SAIDA / "css" / "conceito.css").unlink()

    # código: um arquivo só
    js = "\n;\n".join(compactar_js((SITE / "js" / f"{nome}.js").read_text(encoding="utf-8")) for nome in JS_DA_CAPA)
    (SAIDA / "js" / "site.min.js").write_text(js + "\n", encoding="utf-8")
    for nome in JS_DA_CAPA:
        (SAIDA / "js" / f"{nome}.js").unlink()

    # página inicial apontando para os arquivos juntos
    pagina = (SITE / "index.html").read_text(encoding="utf-8")
    pagina = re.sub(r'  <link rel="stylesheet" href="css/fontes\.css">\n(?:.*\n)*?  <link rel="stylesheet" href="css/imersao\.css">\n',
                    '  <link rel="stylesheet" href="css/site.min.css">\n', pagina, count=1)
    pagina = re.sub(r'  <script src="js/agenda\.js" defer></script>\n(?:  <script src="js/\w+\.js" defer></script>\n)+',
                    '  <script src="js/site.min.js" defer></script>\n', pagina, count=1)
    if not com_conceito:
        pagina = pagina.replace(' · <a href="conceito.html">Caderno de conceito</a>', "")
    assert "css/site.min.css" in pagina and "js/site.min.js" in pagina, "não achei os links para trocar no index.html"
    (SAIDA / "index.html").write_text(tirar_comentarios_html(pagina), encoding="utf-8")

    def tamanho(pasta: Path) -> float:
        return sum(a.stat().st_size for a in pasta.rglob("*") if a.is_file()) / 1024 / 1024

    print(f"Pronto: {SAIDA}")
    print(f"  estilos da página inicial: {len(CSS_DA_CAPA)} arquivos -> 1 ({(SAIDA / 'css' / 'site.min.css').stat().st_size // 1024} KB)")
    print(f"  código: 5 arquivos -> 1 ({(SAIDA / 'js' / 'site.min.js').stat().st_size // 1024} KB)")
    print(f"  pasta inteira: {tamanho(SAIDA):.1f} MB" + ("" if com_conceito else " (sem o caderno de conceito)"))


if __name__ == "__main__":
    principal("--com-conceito" in sys.argv)
