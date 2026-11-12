@echo off
rem Abre o site num endereco local (http://localhost:8000), para os videos do YouTube funcionarem.
rem Aberto direto do disco, o YouTube recusa o player (Erro 153). Precisa do Python instalado.
rem Para encerrar, feche esta janela.
cd /d "%~dp0"
where python >nul 2>nul || (echo Python nao encontrado. Instale em https://www.python.org/downloads/ ou publique o site num endereco web. & pause & exit /b)
start "" cmd /c "timeout /t 2 >nul & start http://localhost:8000"
echo Site em http://localhost:8000  -  feche esta janela para encerrar.
python -m http.server 8000
