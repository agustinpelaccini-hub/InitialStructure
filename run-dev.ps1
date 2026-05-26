<#
Run-dev helper script for Windows PowerShell.
This script will:
- create Python venv and install backend requirements if needed
- install frontend deps if needed
- start backend (uvicorn) and frontend (vite) in separate windows

Notes:
- Requires Python and Node.js installed on the machine.
- If you want a zero-install solution use Docker; I can add a docker-compose file if preferred.
#>

$root = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $root

function Check-Command($cmd) {
    $p = Get-Command $cmd -ErrorAction SilentlyContinue
    return $null -ne $p
}

if (-not (Check-Command python)) {
    Write-Host "ERROR: 'python' not found in PATH. Please install Python 3.10+ or adjust PATH." -ForegroundColor Red
}
if (-not (Check-Command npm)) {
    Write-Host "ERROR: 'npm' not found in PATH. Please install Node.js or adjust PATH." -ForegroundColor Red
}

# Backend setup
Push-Location backend
if (-not (Test-Path venv)) {
    Write-Host "Creating Python venv for backend..."
    python -m venv venv
}
$pip = Join-Path -Path (Join-Path -Path (Get-Location) -ChildPath "venv") -ChildPath "Scripts\pip.exe"
if (Test-Path $pip) {
    & $pip install -r requirements.txt
} else {
    Write-Host "pip not found in venv, attempting global pip install..."
    pip install -r requirements.txt
}

# Start backend
Write-Host "Starting backend (uvicorn) in a new window..."
Start-Process powershell -ArgumentList "-NoProfile -ExecutionPolicy Bypass -Command \"cd '$PWD'; ./venv/Scripts/Activate.ps1; uvicorn src.app:app --reload\"" -WindowStyle Normal
Pop-Location

# Frontend setup
Push-Location frontend
if (-not (Test-Path node_modules)) {
    Write-Host "Installing frontend dependencies (npm ci)..."
    npm ci
}

# Start frontend
Write-Host "Starting frontend (vite) in a new window..."
Start-Process powershell -ArgumentList "-NoProfile -ExecutionPolicy Bypass -Command \"cd '$PWD'; npm run dev\"" -WindowStyle Normal
Pop-Location

Write-Host "Both processes started. Open the browser to the frontend URL printed by Vite and the backend at http://localhost:8000/docs" -ForegroundColor Green
