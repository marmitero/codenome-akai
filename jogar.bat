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

if not exist "node_modules" (
    echo [1/2] Instalando dependencias (somente na primeira vez)...
    call npm install --no-audit --no-fund
    if errorlevel 1 (
        echo [ERRO] Falha no npm install. Verifique sua internet.
        pause
        exit /b 1
    )
) else (
    echo [1/2] Dependencias ja instaladas.
)

echo [2/2] Iniciando o jogo...
echo O navegador vai abrir em http://localhost:5173
echo Mantenha esta janela aberta enquanto joga; feche-a para parar o servidor.
echo.

start "" /b cmd /c "timeout /t 4 /nobreak >nul & start "" http://localhost:5173"

call npm run dev
pause
