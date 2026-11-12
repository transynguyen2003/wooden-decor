@echo off
title Wooden Decor Server
echo ===================================================
echo     DANG KHOI DONG WEBSITE WOODEN DECOR (THIEN AN)
echo ===================================================
echo.
cd /d "%~dp0"
node node_modules\next\dist\bin\next start -p 3000
pause
