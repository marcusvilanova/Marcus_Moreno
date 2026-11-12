# Gera os telões em movimento: trechos curtos dos vídeos de Marcus, em sépia e em loop, para o fundo de quatro
# seções (Epígrafe, Encontros Efêmeros, Danças de Presente e Na imprensa).
# Cada trecho vira um vídeo leve, sem som (assets/video/), e um quadro parado (assets/img/teloes/), que aparece
# antes de o vídeo começar, para quem pede movimento reduzido e se o vídeo não puder tocar.
# O véu que deixa o texto legível por cima fica no css/secoes.css (bloco "telões").
#
# Uso, de dentro da pasta site:   python ferramentas/gerar-teloes.py
# Os trechos originais (baixados do canal de Marcus no YouTube com o yt-dlp) ficam em ferramentas/videos/
# e não vão para a publicação. Para trocar um trecho: ponha o vídeo novo em ferramentas/videos/, ajuste a
# lista TELOES e rode de novo; se o nome mudar, troque também no <div class="telao"> da seção, no index.html.
import io
import subprocess
from dataclasses import dataclass
from pathlib import Path

import imageio_ffmpeg
import numpy as np
from PIL import Image

SITE = Path(__file__).resolve().parent.parent
ORIGEM = Path(__file__).resolve().parent / "videos"
VIDEOS = SITE / "assets" / "video"
QUADROS = SITE / "assets" / "img" / "teloes"
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()

LARGURA = 960       # o véu e a sépia escondem detalhe: não precisa de mais
EMENDA = 1.5        # segundos em que o fim se funde ao começo, para o loop não ter salto
RASTRO = "1 2 3 4"  # cada quadro guarda um pouco dos três anteriores: o movimento deixa rastro
QUALIDADE = 30      # crf do H.264: maior = arquivo menor

# as cores do site (css/base.css)
PALCO = (28, 20, 15)
UMBRIA = (43, 32, 25)
LINHO = (231, 224, 211)
KRAFT = (214, 198, 171)


@dataclass(frozen=True)
class Telao:
    fonte: str                 # trecho em ferramentas/videos
    nome: str                  # nome do vídeo e do quadro gerados
    recorte: tuple = None      # (x, y, largura, altura) em pixels do original 1280x720
    sombra: tuple = UMBRIA     # cor do preto: a cor da seção
    luz: tuple = LINHO         # cor do branco: o papel nas seções claras, o kraft nas escuras
    lentidao: float = 1.5      # câmera lenta: 1.5 faz 14 segundos virarem 21
    curva: float = 1.0         # acima de 1, as sombras ficam mais fundas
    abaixo: float = 0.0        # faixa escura acrescentada embaixo (fração da altura), para subir o que está no pé do quadro
    largura: int = LARGURA     # largura do vídeo gerado
    desfoque: float = 0.8      # desfoque leve para esconder o ruído; 0 deixa nítido
    qualidade: int = QUALIDADE # crf do H.264: menor = mais nítido e mais pesado
    rastro: str = RASTRO       # pesos dos quadros que se misturam no rastro do movimento
    limpeza: str = ""          # filtro de redução de ruído do ffmpeg (hqdn3d), para cenas escuras e granuladas


# De onde vem cada trecho (vídeo no YouTube e minutos), para baixar de novo ou trocar:
#   instante-ja-linha-1080  Instante-já                                bwpxBs99I4M  17:22–17:44  (a linha de luz no chão)
#   encontro-vento     Encontro para contemplar o vento (Cora)    5xQ4a2cmItM  24:58.2–25:12.2
#   presente-key       Danças de Presente: para Key Sawao         E3VUumx556c  2:51–3:05
#   instante-ja        Instante-já                                bwpxBs99I4M  8:22.8–8:36.8
TELOES = [
    # Epígrafe (seção escura): no ritmo original, e com a linha de luz erguida para correr atrás da frase
    # (em 1080p, mais largo e nítido: é o primeiro vídeo que aparece, logo depois da capa)
    Telao("instante-ja-linha-1080.mp4", "instante-linha", sombra=PALCO, luz=LINHO, lentidao=1.0, curva=1.15, abaixo=0.25,
          largura=1600, desfoque=0, qualidade=20, rastro="1", limpeza="hqdn3d=3:2:4:3"),
    # Encontros Efêmeros: mais perto do círculo de luz
    Telao("encontro-vento.mp4", "encontro-vento", recorte=(243, 194, 794, 446)),
    # Danças de Presente (seção escura): sem as faixas pretas dos lados
    Telao("presente-key.mp4", "presente-key", recorte=(200, 114, 880, 492), luz=KRAFT),
    # Na imprensa
    Telao("instante-ja.mp4", "instante-ja"),
]


def recortar(recorte) -> str:
    if recorte is None:
        return ""
    x, y, w, h = recorte
    return f"crop={w}:{h}:{x}:{y},"


def tons(fonte: Path, recorte) -> tuple:
    """O 1% mais escuro e o 0,5% mais claro do trecho: viram a sombra e a luz da sépia."""
    gen = imageio_ffmpeg.read_frames(str(fonte), pix_fmt="rgb24", output_params=["-vf", f"{recortar(recorte)}fps=2"])
    meta = next(gen)
    w, h = meta["size"]
    claridade = np.concatenate([
        (np.frombuffer(b, np.uint8).reshape(h, w, 3).astype(np.float32) @ np.array([0.299, 0.587, 0.114], np.float32)).ravel()
        for b in gen
    ])
    baixo, alto = np.percentile(claridade, (1, 99.5))
    return round(float(baixo)), round(float(max(alto, baixo + 30)))


def duracao(fonte: Path) -> float:
    saida = subprocess.run([FFMPEG, "-hide_banner", "-i", str(fonte)], capture_output=True, text=True).stderr
    h, m, s = saida.split("Duration: ")[1].split(",")[0].split(":")
    return int(h) * 3600 + int(m) * 60 + float(s)


def sepia(baixo: int, alto: int, t: Telao) -> str:
    canais = []
    for nome, a, b in zip("rgb", t.sombra, t.luz):
        canais.append(f"{nome}='{a}+({b}-{a})*pow(clip((val-{baixo})/({alto}-{baixo}),0,1),{t.curva})'")
    return "lutrgb=" + ":".join(canais)


def gerar(t: Telao) -> None:
    fonte = ORIGEM / t.fonte
    baixo, alto = tons(fonte, t.recorte)
    total = duracao(fonte) * t.lentidao - 0.1
    faixa = f"pad=iw:trunc(ih*{1 + t.abaixo}/2)*2:0:0:black," if t.abaixo else ""
    filtros = (
        f"[0:v]{recortar(t.recorte)}{t.limpeza + ',' if t.limpeza else ''}scale={t.largura}:-2:flags=lanczos,{faixa}setpts={t.lentidao}*PTS,framerate=fps=24,"
        f"tmix=frames={len(t.rastro.split())}:weights='{t.rastro}',format=gray,format=rgb24,{sepia(baixo, alto, t)},{f'gblur=sigma={t.desfoque},' if t.desfoque else ''}split=2[a][b];"
        f"[a]trim=start={EMENDA}:end={total:.2f},setpts=PTS-STARTPTS,fps=24[corpo];"
        f"[b]trim=start=0:end={EMENDA},setpts=PTS-STARTPTS,fps=24[comeco];"
        f"[corpo][comeco]xfade=transition=fade:duration={EMENDA}:offset={total - 2 * EMENDA:.2f},format=yuv420p[saida]"
    )
    destino = VIDEOS / f"{t.nome}.mp4"
    subprocess.run([FFMPEG, "-v", "error", "-y", "-i", str(fonte), "-filter_complex", filtros, "-map", "[saida]", "-an",
                    "-c:v", "libx264", "-preset", "slow", "-crf", str(t.qualidade), "-profile:v", "high", "-g", "48",
                    "-movflags", "+faststart", str(destino)], check=True)
    # o primeiro quadro do loop vira a imagem parada
    png = subprocess.run([FFMPEG, "-v", "error", "-i", str(destino), "-frames:v", "1", "-f", "image2pipe", "-vcodec", "png", "-"],
                         capture_output=True, check=True).stdout
    quadro = Image.open(io.BytesIO(png)).convert("RGB")
    quadro.save(QUADROS / f"{t.nome}.webp", "WEBP", quality=72, method=6)
    print(f"{t.nome}: vídeo {destino.stat().st_size // 1024} KB, {total - EMENDA:.1f} s; quadro {quadro.width}x{quadro.height} "
          f"{(QUADROS / f'{t.nome}.webp').stat().st_size // 1024} KB; tons {baixo}-{alto}")


def principal() -> None:
    VIDEOS.mkdir(parents=True, exist_ok=True)
    QUADROS.mkdir(parents=True, exist_ok=True)
    for t in TELOES:
        gerar(t)


if __name__ == "__main__":
    principal()
