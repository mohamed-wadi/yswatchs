@echo off
REM YsWatchs — Demarrage local (Windows 10/11)
REM Usage : double-cliquez ou lancez dans CMD / PowerShell

echo.
echo ==========================================
echo   YsWatchs -- Demarrage local (Windows)
echo ==========================================
echo.

REM Verifier Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
  echo [ERREUR] Node.js non trouve.
  echo Installez Node.js v20+ depuis https://nodejs.org
  echo.
  pause
  exit /b 1
)
for /f "tokens=*" %%i in ('node -e "process.stdout.write(process.versions.node)"') do set NODE_VER=%%i
echo [OK] Node.js %NODE_VER%

REM Verifier / installer pnpm
where pnpm >nul 2>&1
if %errorlevel% neq 0 (
  echo [INFO] Installation de pnpm...
  npm install -g pnpm
  if %errorlevel% neq 0 (
    echo [ERREUR] Impossible d'installer pnpm. Relancez en tant qu'Administrateur.
    pause
    exit /b 1
  )
)
for /f "tokens=*" %%i in ('pnpm --version') do set PNPM_VER=%%i
echo [OK] pnpm %PNPM_VER%

REM Installer les dependances
echo.
echo [INFO] Installation des dependances...
pnpm install
if %errorlevel% neq 0 (
  echo [ERREUR] pnpm install a echoue.
  pause
  exit /b 1
)

echo.
echo [INFO] Demarrage des 3 services...
echo.
echo   API Server  --  http://localhost:8080
echo   Boutique    --  http://localhost:3000
echo   Admin       --  http://localhost:3001/admin/
echo.
echo Fermez les fenetres de commande pour arreter les services.
echo.

REM Demarrer l'API dans une nouvelle fenetre
start "YsWatchs — API Server (port 8080)" cmd /k "set PORT=8080 && pnpm --filter @workspace/api-server run dev"

REM Attendre 2 secondes pour que l'API demarre
timeout /t 2 /nobreak >nul

REM Demarrer la boutique dans une nouvelle fenetre
start "YsWatchs — Boutique (port 3000)" cmd /k "set PORT=3000 && set BASE_PATH=/ && pnpm --filter @workspace/yswatchs run dev"

REM Demarrer l'admin dans une nouvelle fenetre
start "YsWatchs — Admin (port 3001)" cmd /k "set PORT=3001 && set BASE_PATH=/admin/ && pnpm --filter @workspace/ys-admin run dev"

echo [OK] Tous les services ont ete lances dans des fenetres separees.
echo.
echo Ouvrez votre navigateur :
echo   Boutique : http://localhost:3000
echo   Admin    : http://localhost:3001/admin/
echo   API      : http://localhost:8080/api/health
echo.
pause
