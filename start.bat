@echo off
title CRM ON8 - Setup & Start
color 0A

echo ============================================
echo        CRM ON8 - Instalacao e Arranque
echo ============================================
echo.

:: Verificar se Node.js esta instalado
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERRO] Node.js nao encontrado! Instala em https://nodejs.org
    pause
    exit /b
)

echo [1/3] A instalar dependencias...
call npm install
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao instalar dependencias!
    pause
    exit /b
)

echo.
echo [2/3] A verificar .env.local...
if not exist ".env.local" (
    echo [AVISO] Ficheiro .env.local nao encontrado!
    echo.
    echo Cria o ficheiro .env.local na raiz do projeto com:
    echo.
    echo   GOOGLE_CLIENT_ID=o-teu-client-id
    echo   GOOGLE_CLIENT_SECRET=o-teu-client-secret
    echo   NEXTAUTH_SECRET=uma-string-aleatoria
    echo   NEXTAUTH_URL=http://localhost:3000
    echo.
    echo Vai a https://console.cloud.google.com para criar as credenciais.
    echo.
    pause
    exit /b
)
echo    .env.local encontrado!

echo.
echo [3/3] A iniciar o servidor...
echo.
echo ============================================
echo    App disponivel em http://localhost:3000
echo    Prima Ctrl+C para parar
echo ============================================
echo.

start http://localhost:3000
call npm run dev
