@echo off
echo.
echo ================================================
echo   Starting Movie Recommendation Backend
echo ================================================
echo.

cd /d "%~dp0"

echo Checking setup...
python start_backend.py

pause
