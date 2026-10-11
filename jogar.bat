@echo off
chcp 65001 >nul
title Codenome: AKAI
cd /d "%~dp0"

echo ============================================
echo   CODENOME: AKAI - RPG Idle 2D de navegador
echo ============================================
echo.

where node >nul 2>nul
if errorlevel 1 (
    echo [ERRO] Node.js nao encontrado.
    echo Baixe e instale o Node.js LTS em https://nodejs.org
    echo Depois abra este arquivo novamente.
    pause
    exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
    echo [ERRO] npm nao encontrado. Reinstale o Node.js LTS de https://nodejs.org
    pause
    exit /b 1
)

if not exist "node_modules\phaser" (
    echo [1/2] Instalando dependencias (somente na primeira vez)...
    call npm install --no-audit --no-fund
    if errorlevel 1 (
        echo [ERRO] Falha no npm install. Verifique sua internet e rode de novo.
        pause
        exit /b 1
    )
) else (
    echo [1/2] Dependencias ja instaladas.
)

echo [2/2] Iniciando o jogo em http://localhost:5173 ...
echo Mantenha esta janela aberta enquanto joga; feche-a para parar o servidor.
echo.

rem abre o navegador assim que o servidor responder (ate ~2 min de espera)
start "" /b powershell -NoProfile -ExecutionPolicy Bypass -File "tools\open_browser.ps1"

call npm run dev -- --strictPort
echo.
echo O servidor parou. Se foi inesperado, leia a mensagem acima.
pause
