@echo off
cd /d "%~dp0"
set PORT=8765
echo Starting IntGen Stay Intelligence Engine...
echo Opening http://localhost:%PORT% in your browser.
echo Keep this window open while viewing. Close it when finished.
start "" "http://localhost:%PORT%/index.html"
python -m http.server %PORT% 2>nul || py -m http.server %PORT%
