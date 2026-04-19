# deploy.ps1 — Build + FTP deploy + smoke test
# Usage:
#   .\scripts\deploy.ps1              # build + deploy + test
#   .\scripts\deploy.ps1 -buildOnly   # solo build
#   .\scripts\deploy.ps1 -testOnly    # solo smoke test

param(
  [switch]$buildOnly,
  [switch]$testOnly
)

$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent

function Write-Step($msg) { Write-Host "`n>> $msg" -ForegroundColor Cyan }
function Write-Ok($msg)   { Write-Host "   OK: $msg" -ForegroundColor Green }
function Write-Err($msg)  { Write-Host "   ERROR: $msg" -ForegroundColor Red; exit 1 }

# ── Cargar credenciales FTP ──────────────────────────────────────────────────
$ftpConfig = Join-Path $PSScriptRoot "ftp.config.ps1"
if (-not (Test-Path $ftpConfig)) {
  Write-Err "No se encuentra scripts\ftp.config.ps1 — créalo con tus credenciales FTP"
}
. $ftpConfig

# ── Build ────────────────────────────────────────────────────────────────────
if (-not $testOnly) {
  Write-Step "Building frontend (production)..."
  Set-Location (Join-Path $root "frontend")
  npm run build
  if ($LASTEXITCODE -ne 0) { Write-Err "Build fallido" }
  Write-Ok "Build completado → frontend/dist/"
}

if ($buildOnly) { Write-Ok "Build-only completado."; exit 0 }

# ── FTP Upload ───────────────────────────────────────────────────────────────
if (-not $testOnly) {
  Write-Step "Subiendo archivos por FTP a $FTP_HOST..."

  $distPath = Join-Path $root "frontend\dist"
  $files = Get-ChildItem -Path $distPath -Recurse -File

  foreach ($file in $files) {
    $relativePath = $file.FullName.Substring($distPath.Length).Replace("\", "/")
    $remotePath = "$FTP_REMOTE_PATH$relativePath"
    $remoteDir  = ($remotePath -split "/")[0..($remotePath.Split("/").Count - 2)] -join "/"

    $ftpRequest = [System.Net.FtpWebRequest]::Create("ftp://$FTP_HOST$remotePath")
    $ftpRequest.Method      = [System.Net.WebRequestMethods+Ftp]::UploadFile
    $ftpRequest.Credentials = New-Object System.Net.NetworkCredential($FTP_USER, $FTP_PASS)
    $ftpRequest.UseBinary   = $true
    $ftpRequest.UsePassive  = $true
    $ftpRequest.KeepAlive   = $false

    try {
      $fileContent = [System.IO.File]::ReadAllBytes($file.FullName)
      $requestStream = $ftpRequest.GetRequestStream()
      $requestStream.Write($fileContent, 0, $fileContent.Length)
      $requestStream.Close()
      $response = $ftpRequest.GetResponse()
      $response.Close()
      Write-Host "   ↑ $relativePath" -ForegroundColor DarkGray
    } catch {
      Write-Host "   WARN: $relativePath — $($_.Exception.Message)" -ForegroundColor Yellow
    }
  }

  Write-Ok "Todos los archivos subidos"
}

# ── Smoke test ───────────────────────────────────────────────────────────────
Write-Step "Smoke test..."

$workerUrl = "https://telekoquitoman-worker.sergimontesjimenez.workers.dev"

# Test worker /api/youtube
try {
  $ytRes = Invoke-WebRequest -Uri "$workerUrl/api/youtube" -UseBasicParsing -TimeoutSec 10
  if ($ytRes.StatusCode -eq 200) { Write-Ok "Worker /api/youtube → 200 OK" }
  else { Write-Host "   WARN: /api/youtube devolvió $($ytRes.StatusCode)" -ForegroundColor Yellow }
} catch {
  Write-Host "   WARN: Worker no responde — $($_.Exception.Message)" -ForegroundColor Yellow
}

# Test worker /api/chat
try {
  $body    = '{"message":"Hola"}'
  $chatRes = Invoke-WebRequest -Uri "$workerUrl/api/chat" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing -TimeoutSec 15
  if ($chatRes.StatusCode -eq 200) { Write-Ok "Worker /api/chat → 200 OK" }
  else { Write-Host "   WARN: /api/chat devolvió $($chatRes.StatusCode)" -ForegroundColor Yellow }
} catch {
  Write-Host "   WARN: Chat no responde — $($_.Exception.Message)" -ForegroundColor Yellow
}

# Test frontend
try {
  $webRes = Invoke-WebRequest -Uri "https://telekoquitoman.pro" -UseBasicParsing -TimeoutSec 10
  if ($webRes.StatusCode -eq 200) { Write-Ok "Frontend https://telekoquitoman.pro → 200 OK" }
  else { Write-Host "   WARN: Frontend devolvió $($webRes.StatusCode)" -ForegroundColor Yellow }
} catch {
  Write-Host "   WARN: Frontend no accesible aún — $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host "`n>> Deploy completado!" -ForegroundColor Green
Write-Host "   Web: https://telekoquitoman.pro" -ForegroundColor White
Write-Host "   Worker: $workerUrl" -ForegroundColor White
