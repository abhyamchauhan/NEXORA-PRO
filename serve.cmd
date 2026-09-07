@echo off
rem NEXORA - serve this folder over http:// and open the storefront.
cd /d "%~dp0"
set PORT=8080
echo NEXORA -^> http://localhost:%PORT%/NEXORA.dc.html   (Ctrl+C to stop)
start "" http://localhost:%PORT%/NEXORA.dc.html
where py >nul 2>nul && (py -m http.server %PORT% & goto :eof)
where python >nul 2>nul && (python -m http.server %PORT% & goto :eof)
where npx >nul 2>nul && (npx --yes http-server -p %PORT% . & goto :eof)
echo Install Python 3 or Node, or use the VS Code Live Server extension.
pause
