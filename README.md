# Marcus Moreno · site

Site do artista da dança Marcus Moreno. HTML, CSS e JavaScript, sem framework.

- `site/` é a pasta de trabalho: é aqui que tudo se edita. Ver `site/LEIA-ME.md` e `site/PUBLICAR.md`.
- `publicar/` é a versão que vai ao ar, gerada a partir de `site/`:

  ```
  cd site
  python ferramentas/gerar-publicacao.py
  ```

  Depois de qualquer mudança em `site/`, gere de novo e faça o commit das duas pastas.

## Vercel

O `vercel.json` publica a pasta `publicar/` como está, sem etapa de build.
Na Vercel: importar o repositório, deixar o Framework Preset em "Other" e publicar.
