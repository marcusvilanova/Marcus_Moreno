# Gera o vídeo de fundo da epígrafe em alta qualidade (a linha de luz de Instante-já), separado dos outros telões
# porque a cena é muito escura e pede um tratamento próprio:
#   - a origem é o trecho em 1080p baixado do YouTube sem recompressão (formato 270, 17:20 a 17:46);
#   - a limpeza de granulado é feita no tempo (a câmera é fixa), em 16 bits, sem borrar a figura;
#   - o fundo vai exatamente para a cor do palco e as luzes para a cor do papel, sem véu por cima.
# Saídas: assets/video/instante-linha.mp4 (1920 px), instante-linha-960.mp4 (celular) e o quadro parado.
#
# Uso, de dentro da pasta site:   python ferramentas/gerar-telao-epigrafe.py
import io
import subprocess
from pathlib import Path

import imageio_ffmpeg
from PIL import Image

SITE = Path(__file__).resolve().parent.parent
FONTE = Path(__file__).resolve().parent / "videos" / "instante-ja-linha-hq.mp4"
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()

INICIO, FIM = 2.0, 24.0   # dentro do trecho baixado: a cena sem cortes
EMENDA = 1.5              # segundos em que o fim se funde ao começo
PISO, TETO = 8.2, 58.0    # tons de origem (0 a 255): abaixo do piso é fundo; acima do teto, luz plena
CURVA = 0.7               # abaixo de 1, clareia os meios-tons: o corpo aparece mais
SOMBRA = (28, 20, 15)     # palco (#1c140f), a cor da seção
LUZ = (231, 224, 211)     # linho (#e7e0d3)


def tons() -> str:
    canais = []
    for nome, a, b in zip("rgb", SOMBRA, LUZ):
        canais.append(f"{nome}='maxval/255*({a}+({b}-{a})*pow(clip((val/maxval*255-{PISO})/({TETO}-{PISO}),0,1),{CURVA}))'")
    return "lutrgb=" + ":".join(canais)


def gerar(destino: Path, largura: int, crf: int) -> None:
    total = FIM - INICIO - 0.1
    escala = f"scale={largura}:-2:flags=lanczos," if largura != 1920 else ""
    filtros = (
        f"[0:v]trim=start={INICIO}:end={FIM},setpts=PTS-STARTPTS,fps=24,scale=in_range=tv:out_range=pc,format=gray16le,"
        f"atadenoise=0a=0.3:0b=0.6:s=15,hqdn3d=2:0:4:0,pad=iw:trunc(ih*1.25/2)*2:0:0:black,format=gbrp16le,{tons()},split=2[a][b];"
        f"[a]trim=start={EMENDA}:end={total:.2f},setpts=PTS-STARTPTS,fps=24[corpo];"
        f"[b]trim=start=0:end={EMENDA},setpts=PTS-STARTPTS,fps=24[comeco];"
        f"[corpo][comeco]xfade=transition=fade:duration={EMENDA}:offset={total - 2 * EMENDA:.2f},"
        f"{escala}scale=out_color_matrix=bt709:out_range=tv,format=yuv420p[saida]"
    )
    subprocess.run([FFMPEG, "-v", "error", "-y", "-i", str(FONTE), "-filter_complex", filtros, "-map", "[saida]", "-an",
                    "-c:v", "libx264", "-preset", "slow", "-crf", str(crf), "-profile:v", "high", "-g", "48",
                    "-x264-params", "aq-mode=3", "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709",
                    "-movflags", "+faststart", str(destino)], check=True)
    print(f"{destino.name}: {destino.stat().st_size // 1024} KB")


def principal() -> None:
    video = SITE / "assets" / "video" / "instante-linha.mp4"
    gerar(video, 1920, 19)
    gerar(SITE / "assets" / "video" / "instante-linha-960.mp4", 960, 22)
    png = subprocess.run([FFMPEG, "-v", "error", "-i", str(video), "-frames:v", "1", "-f", "image2pipe", "-vcodec", "png", "-"],
                         capture_output=True, check=True).stdout
    quadro = Image.open(io.BytesIO(png)).convert("RGB")
    quadro = quadro.resize((1280, round(quadro.height * 1280 / quadro.width)), Image.LANCZOS)
    quadro.save(SITE / "assets" / "img" / "teloes" / "instante-linha.webp", "WEBP", quality=78, method=6)
    print("quadro parado:", quadro.size)


if __name__ == "__main__":
    principal()
