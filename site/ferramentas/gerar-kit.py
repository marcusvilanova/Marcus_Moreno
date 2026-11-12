# Gera as páginas de difusão (programadores.html, es.html, en.html) a partir de um só conteúdo,
# para que as três línguas nunca fiquem diferentes entre si.
# Uso, de dentro da pasta site:  python ferramentas/gerar-kit.py
# Depois de mudar um texto aqui, rode de novo; para refazer os PDFs, veja ferramentas/gerar-pdf.bat.
from html import escape
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent

OBRAS = [
    # ano, título, vídeo (YouTube), formato {pt, es, en}, sinopse {pt, es, en}
    ("2013", "A Imagem como Ausência", "8Wuyt81Asps",
     {"pt": "ProAC · Primeiras Obras", "es": "ProAC · Primeiras Obras", "en": "ProAC · Primeiras Obras"},
     {"pt": "O ponto de partida para esta criação é o da tela em branco, o espaço de acontecimento que está prestes a ser preenchido.",
      "es": "El punto de partida de esta creación es la tela en blanco, el espacio de acontecimiento que está a punto de ser llenado.",
      "en": "The piece starts from the blank canvas: a space where something is about to happen, about to be filled."}),
    ("2016", "A Flor da Lua", "6iJhSnkjBm4",
     {"pt": "Solo · Residência Artística Casa das Caldeiras · estreia no Sesc Campinas",
      "es": "Solo · Residencia Artística Casa das Caldeiras · estreno en el Sesc Campinas",
      "en": "Solo · Casa das Caldeiras artist residency · premiered at Sesc Campinas"},
     {"pt": "Esta peça foi criada em capítulos breves. Tal como a flor da lua nasce e perdura por uma única noite, a dança se expande a caminho do encerro.",
      "es": "Esta pieza fue creada en capítulos breves. Así como la flor de luna nace y dura una sola noche, la danza se expande camino a su final.",
      "en": "A piece made of short chapters. Like the moonflower, which blooms and lasts a single night, the dance unfolds toward its close."}),
    ("2017", "Estudo para o Encontro", "dIDL_3DrXDo",
     {"pt": "ProAC · Edital nº 04/2016", "es": "ProAC · Convocatoria nº 04/2016", "en": "ProAC · Call nº 04/2016"},
     {"pt": "Este trabalho surge de temas corporais concretos para a criação de imagens sensoriais.",
      "es": "Este trabajo parte de temas corporales concretos para crear imágenes sensoriales.",
      "en": "The work starts from concrete bodily themes to create sensory images."}),
    ("2019", "Instante-já", "bwpxBs99I4M",
     {"pt": "Fomento à Dança · criação com Andrea Arobba (UY) · indicado ao Prêmio APCA",
      "es": "Fomento à Dança · creación con Andrea Arobba (UY) · nominada al Premio APCA",
      "en": "Fomento à Dança · created with Andrea Arobba (UY) · APCA Award nominee"},
     {"pt": "Como captar o instante de um acontecimento? Quais imagens se constroem neste instante? É possível dançar uma imagem antes mesmo de conseguir nomeá-la?",
      "es": "¿Cómo captar el instante de un acontecimiento? ¿Qué imágenes se construyen en ese instante? ¿Es posible bailar una imagen antes incluso de poder nombrarla?",
      "en": "How can one capture the instant of an event? What images are built in that instant? Is it possible to dance an image before one can even name it?"}),
    ("2021", "Entre-espaço onde tudo existe", "m-qB_rqaMXo",
     {"pt": "Videodança · com Pri Magalhães / Nome Filmes · Fomento à Dança",
      "es": "Videodanza · con Pri Magalhães / Nome Filmes · Fomento à Dança",
      "en": "Dance film · with Pri Magalhães / Nome Filmes · Fomento à Dança"},
     None),
    ("2021", "Para insistir em brotar", "Vtriv1TdLco",
     {"pt": "Videodança", "es": "Videodanza", "en": "Dance film"},
     {"pt": "O título retoma um dos capítulos de A Flor da Lua.",
      "es": "El título retoma uno de los capítulos de A Flor da Lua.",
      "en": "The title comes from one of the chapters of A Flor da Lua."}),
    ("2023", "Sempre mais que um", "ejixmU_3cXk",
     {"pt": "Fomento à Dança", "es": "Fomento à Dança", "en": "Fomento à Dança"},
     None),
    ("2024", "Onde Houver Céu", "7Ws8Uslqozw",
     {"pt": "Indicada ao Prêmio APCA", "es": "Nominada al Premio APCA", "en": "APCA Award nominee"},
     None),
]

TEXTO = {
    "pt": {
        "arquivo": "programadores.html", "lang": "pt-BR",
        "titulo_pagina": "Material de difusão · Marcus Moreno",
        "descricao": "Release, obras para circulação, vídeos, fotos em alta e contato da produção de Marcus Moreno.",
        "rotulo": "Para programadores, festivais e imprensa",
        "titulo": "Material de <em>difusão</em>",
        "intro": "Release, obras disponíveis para circulação, vídeos, fotos em alta e o contato da produção, num lugar só.",
        "site": "", "voltar": "Marcus Moreno",
        "baixar": [("Release em PDF", "PDF"), ("Fotos em alta", "9 fotos com crédito · ZIP"), ("Assinatura", "MM e nome escrito · SVG")],
        "h_release": "Release", "h_obras": "Obras", "h_contato": "Contato",
        "assistir": "Assistir",
        "nota": "Fichas técnicas completas no site. Rider técnico, mapa de luz e condições de circulação de cada obra: sob consulta com a produção.",
        "producao": "Produção", "creditos": "Fotografias: Silvia Machado, Danilo Patzdorf e Claudia Magalhães. Ao publicar, cite o crédito que está no nome de cada arquivo.",
        "release": [
            "Marcus Moreno é artista da dança e mestre em Artes da Cena pela Unicamp, com especialização em Técnica Klauss Vianna (PUC-SP). Transita por campos poéticos buscando investigar as temporalidades, a improvisação cênica e a criação de redes de afetos.",
            "Desde 2012 realiza criações cênicas sempre em parceria com outros artistas. Entre elas estão <cite>A Imagem como Ausência</cite> (2013), <cite>A Flor da Lua</cite> (2016), <cite>Estudo para o Encontro</cite> (2017), <cite>Instante-já</cite> (2019), criado com a artista uruguaia Andrea Arobba e indicado ao Prêmio APCA-Dança, e <cite>Onde Houver Céu</cite> (2024), também indicada ao Prêmio APCA. Desde 2016 desenvolve os Encontros Efêmeros, trabalhos de improvisação com artistas da cena contemporânea, e em 2022 criou, com Marisa Lambert e Mariana Molinos, as Entrevistas-performativas, série audiovisual sobre improvisação e afeto.",
            "Na gestão cultural, coordenou o Programa Municipal de Fomento à Dança de São Paulo e foi programador cultural da Oficina Cultural Oswald de Andrade de 2020 a 2024. Participou de encontros internacionais de gestão no Festival Danzalborde (Chile), no FIDCU (Uruguai) e no EGA (Argentina).",
        ],
    },
    "es": {
        "arquivo": "es.html", "lang": "es",
        "titulo_pagina": "Material de difusión · Marcus Moreno",
        "descricao": "Biografía, obras para circulación, videos, fotos en alta resolución y contacto de producción de Marcus Moreno, artista de la danza de São Paulo.",
        "rotulo": "Para programadores, festivales y prensa",
        "titulo": "Material de <em>difusión</em>",
        "intro": "Biografía, obras disponibles para circulación, videos, fotos en alta resolución y el contacto de producción, en un solo lugar.",
        "site": "El sitio completo, con fichas técnicas y textos, está en portugués.", "voltar": "Marcus Moreno",
        "baixar": [("Biografía en PDF", "PDF"), ("Fotos en alta", "9 fotos con crédito · ZIP"), ("Firma", "MM y nombre manuscrito · SVG")],
        "h_release": "Biografía", "h_obras": "Obras", "h_contato": "Contacto",
        "assistir": "Ver video",
        "nota": "Fichas técnicas completas en el sitio (en portugués). Rider técnico, plano de luces y condiciones de circulación de cada obra: a consultar con la producción.",
        "producao": "Producción", "creditos": "Fotografías: Silvia Machado, Danilo Patzdorf y Claudia Magalhães. Al publicar, cite el crédito indicado en el nombre de cada archivo.",
        "release": [
            "Marcus Moreno es artista de la danza y magíster en Artes Escénicas por la Unicamp (Brasil), con especialización en Técnica Klauss Vianna (PUC-SP). Transita por campos poéticos que investigan las temporalidades, la improvisación escénica y la creación de redes de afectos.",
            "Desde 2012 realiza creaciones escénicas siempre en colaboración con otros artistas, entre ellas <cite>A Imagem como Ausência</cite> (2013), <cite>A Flor da Lua</cite> (2016), <cite>Estudo para o Encontro</cite> (2017), <cite>Instante-já</cite> (2019), creada con la artista uruguaya Andrea Arobba y nominada al Premio APCA de Danza, y <cite>Onde Houver Céu</cite> (2024), también nominada al Premio APCA. Desde 2016 desarrolla los Encontros Efêmeros (Encuentros Efímeros), trabajos de improvisación con artistas de la escena contemporánea, y en 2022 creó, junto a Marisa Lambert y Mariana Molinos, las Entrevistas-performativas, una serie audiovisual sobre improvisación y afecto.",
            "En la gestión cultural, coordinó el Programa Municipal de Fomento a la Danza de São Paulo y fue programador cultural de la Oficina Cultural Oswald de Andrade entre 2020 y 2024. Participó en encuentros internacionales de gestión en el Festival Danzalborde (Chile), el FIDCU (Uruguay) y el EGA (Argentina).",
        ],
    },
    "en": {
        "arquivo": "en.html", "lang": "en",
        "titulo_pagina": "Press kit · Marcus Moreno",
        "descricao": "Biography, works available for touring, videos, high-resolution photos and production contacts for Marcus Moreno, dance artist from São Paulo.",
        "rotulo": "For presenters, festivals and press",
        "titulo": "Press <em>kit</em>",
        "intro": "Biography, works available for touring, videos, high-resolution photos and production contacts, all in one place.",
        "site": "The full site, with credits and writings, is in Portuguese.", "voltar": "Marcus Moreno",
        "baixar": [("Biography (PDF)", "PDF"), ("High-resolution photos", "9 credited photos · ZIP"), ("Signature", "MM and handwritten name · SVG")],
        "h_release": "Biography", "h_obras": "Works", "h_contato": "Contact",
        "assistir": "Watch",
        "nota": "Full credits on the main site (in Portuguese). Technical rider, lighting plot and touring conditions for each work are available from the production team.",
        "producao": "Production", "creditos": "Photos: Silvia Machado, Danilo Patzdorf and Claudia Magalhães. When publishing, please use the credit given in each file name.",
        "release": [
            "Marcus Moreno is a dance artist with a master's degree in Performing Arts from Unicamp (Brazil) and a specialization in the Klauss Vianna Technique (PUC-SP). His work moves across poetic fields to investigate temporality, improvisation in performance and the making of networks of affect.",
            "Since 2012 he has created stage works, always in partnership with other artists. They include <cite>A Imagem como Ausência</cite> (2013), <cite>A Flor da Lua</cite> (2016), <cite>Estudo para o Encontro</cite> (2017), <cite>Instante-já</cite> (2019), created with Uruguayan artist Andrea Arobba and nominated for the APCA Dance Award, and <cite>Onde Houver Céu</cite> (2024), also nominated for the APCA Award. Since 2016 he has developed the Encontros Efêmeros (Ephemeral Encounters), improvisations with artists from the contemporary scene, and in 2022, with Marisa Lambert and Mariana Molinos, he created the Entrevistas-performativas (Performative Interviews), an audiovisual series on improvisation and affect.",
            "As a cultural manager, he coordinated São Paulo's Municipal Dance Support Program (Fomento à Dança) and was a cultural programmer at Oficina Cultural Oswald de Andrade from 2020 to 2024. He has taken part in international arts management meetings at Festival Danzalborde (Chile), FIDCU (Uruguay) and EGA (Argentina).",
        ],
    },
}

CONTATOS = [
    ("Junior Cecon", "Plural Produtora", "+5511951579773", "(11) 95157-9773", "contato@pluralprodutora.com.br"),
    ("Cristiane Klein", "Dionísio Produção", "+5511992903037", "(11) 99290-3037", "cristiane@dionisio.net.br"),
]


def peso(caminho: str) -> str:
    arquivo = RAIZ / caminho
    if not arquivo.exists():
        return ""
    kb = arquivo.stat().st_size / 1024
    return f" · {kb / 1024:.1f} MB".replace(".", ",") if kb > 1024 else f" · {kb:.0f} KB"


def pagina(lingua: str) -> str:
    t = TEXTO[lingua]
    arquivos = [f"assets/imprensa/release-marcus-moreno-{lingua}.pdf",
                "assets/imprensa/marcus-moreno_fotos-em-alta.zip",
                "assets/imprensa/marcus-moreno_assinatura.zip"]
    baixar = "\n".join(
        f'      <a class="kit__arquivo" href="{a}" download><strong>{nome}</strong><span>{tipo}{peso(a)}</span></a>'
        for a, (nome, tipo) in zip(arquivos, t["baixar"]))
    atual = ' aria-current="page"'
    idiomas = "\n".join(
        f'        <a href="{TEXTO[l]["arquivo"]}" hreflang="{TEXTO[l]["lang"]}" lang="{TEXTO[l]["lang"]}"'
        f'{atual if l == lingua else ""}>{rotulo}</a>'
        for l, rotulo in (("pt", "Português"), ("es", "Español"), ("en", "English")))
    obras = []
    for ano, nome, video, formato, sinopse in OBRAS:
        sin = f'\n          <p class="kit__sinopse">{escape(sinopse[lingua])}</p>' if sinopse else ""
        obras.append(f"""        <li class="kit__obra">
          <span class="kit__ano">{ano}</span>
          <h3 class="kit__nome">{escape(nome)}</h3>
          <p class="kit__formato">{escape(formato[lingua])}</p>{sin}
          <a class="kit__video rotulo" href="https://www.youtube.com/watch?v={video}" target="_blank" rel="noopener">{t["assistir"]}</a>
        </li>""")
    contatos = "\n".join(f"""        <address class="kit__contato">
          <p class="rotulo">{t["producao"]}</p>
          <strong>{nome}</strong>
          <span>{casa}</span>
          <a href="tel:{tel}">{tel_texto}</a>
          <a href="mailto:{email}">{email}</a>
        </address>""" for nome, casa, tel, tel_texto, email in CONTATOS)
    site = f'\n      <p class="kit__intro"><a href="index.html">{t["site"]}</a></p>' if t["site"] else ""
    release = "\n".join(f"        <p>{p}</p>" for p in t["release"])
    return f"""<!doctype html>
<!-- Gerado por ferramentas/gerar-kit.py. Para mudar um texto, edite lá e rode de novo. -->
<html lang="{t["lang"]}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{t["titulo_pagina"]}</title>
  <meta name="description" content="{t["descricao"]}">
  <meta name="theme-color" content="#e7e0d3">
  <meta property="og:type" content="website">
  <meta property="og:title" content="{t["titulo_pagina"]}">
  <meta property="og:description" content="{t["descricao"]}">
  <meta property="og:image" content="assets/marca/compartilhar.jpg">
  <link rel="alternate" hreflang="pt-BR" href="programadores.html">
  <link rel="alternate" hreflang="es" href="es.html">
  <link rel="alternate" hreflang="en" href="en.html">
  <link rel="icon" href="assets/marca/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="assets/marca/apple-touch-icon.png">
  <link rel="preload" href="assets/fontes/cormorant-garamond.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="css/fontes.css">
  <link rel="stylesheet" href="css/base.css">
  <link rel="stylesheet" href="css/programadores.css">
</head>
<body data-tone="light">
  <main class="kit">
    <header class="kit__topo">
      <a class="kit__voltar" href="index.html" aria-label="{t["voltar"]}"><span class="nome-tinta" aria-hidden="true"></span></a>
      <nav class="kit__idiomas rotulo" aria-label="Idioma · Language">
{idiomas}
      </nav>
    </header>

    <section class="kit__abre">
      <p class="rotulo">{t["rotulo"]}</p>
      <h1 class="kit__titulo">{t["titulo"]}</h1>
      <p class="kit__intro">{t["intro"]}</p>{site}
    </section>

    <div class="kit__baixar">
{baixar}
    </div>

    <section class="kit__bloco">
      <h2>{t["h_release"]}</h2>
      <div class="kit__release">
{release}
      </div>
    </section>

    <section class="kit__bloco">
      <h2>{t["h_obras"]}</h2>
      <ol class="kit__obras">
{chr(10).join(obras)}
      </ol>
      <p class="kit__nota">{t["nota"]}</p>
    </section>

    <section class="kit__bloco">
      <h2>{t["h_contato"]}</h2>
      <div class="kit__contatos">
{contatos}
        <div class="kit__contato">
          <p class="rotulo">Instagram</p>
          <a href="https://instagram.com/marcusmoreno_danca" target="_blank" rel="noopener">@marcusmoreno_danca</a>
        </div>
      </div>
      <p class="kit__creditos">{t["creditos"]}</p>
    </section>
  </main>
</body>
</html>
"""


for lingua, t in TEXTO.items():
    (RAIZ / t["arquivo"]).write_text(pagina(lingua), encoding="utf-8")
    print("gerado", t["arquivo"])
