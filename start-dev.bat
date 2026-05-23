@echo off
REM YsWatchs — Local Development Starter (Windows)
REM Usage: double-cliquez ou lancez dans CMD

echo.
echo ==========================================
echo   YsWatchs -- Demarrage local (Windows)
echo ==========================================
echo.

where node >nul 2>&1
if %errorlevel% neq 0 (
  echo ERREUR: Node.js non trouve. Installez Node.js v18+ depuis https://nodejs.org
  pause
  exit /b 1
)

where pnpm >nul 2>&1
if %errorlevel% neq 0 (
  echo Installation de pnpm...
  npm install -g pnpm
)

echo Installation des dependances...
pnpm install

echo.
echo Demarrage des services...
echo   API Server  --  http://localhost:8080
echo   Boutique    --  http://localhost:3000
echo   Admin       --  http://localhost:3001/admin/
echo.

start "API Server" cmd /k "set PORT=8080 && pnpm --filter @workspace/api-server run dev"
timeout /t 2 /nobreak >nul
start "Boutique" cmd /k "set PORT=3000 && set BASE_PATH=/ && pnpm --filter @workspace/yswatchs run dev"
start "Admin" cmd /k "set PORT=3001 && set BASE_PATH=/admin/ && pnpm --filter @workspace/ys-admin run dev"

echo.
echo Tous les services sont en cours de demarrage dans des fenetres separees.
pause
