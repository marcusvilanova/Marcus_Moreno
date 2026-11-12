@echo off
rem Refaz os PDFs do release (português, espanhol e inglês) a partir das páginas de difusão.
rem Precisa do Google Chrome instalado. Rode com dois cliques, depois de "python ferramentas\gerar-kit.py".
cd /d "%~dp0.."
set CHROME="C:\Program Files\Google\Chrome\Application\chrome.exe"
if not exist %CHROME% set CHROME="C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
for %%L in (pt es en) do (
  if "%%L"=="pt" (set PAGINA=programadores.html) else (set PAGINA=%%L.html)
  call %CHROME% --headless=new --disable-gpu --no-pdf-header-footer --print-to-pdf="%cd%\assets\imprensa\release-marcus-moreno-%%L.pdf" "file:///%cd:\=/%/%%PAGINA%%"
)
echo PDFs prontos em assets\imprensa
