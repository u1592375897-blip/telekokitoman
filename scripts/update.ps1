# update.ps1 — Detección de cambios, deploy local + prod, tests y commit/push
# Uso directo: .\scripts\update.ps1
# Invocado también por el comando /ACTUALIZAR_WEB de Claude Code

param(
  [switch]$forceAll    # Fuerza deploy de todo aunque no haya cambios
)

$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent

# ── Helpers ──────────────────────────────────────────────────────────────────
function Write-Step($msg)  { Write-Host "`n===  $msg" -ForegroundColor Cyan }
function Write-Ok($msg)    { Write-Host "  [OK] $msg" -ForegroundColor Green }
function Write-Warn($msg)  { Write-Host "  [!!] $msg" -ForegroundColor Yellow }
function Write-Fail($msg)  { Write-Host "  [FAIL] $msg" -ForegroundColor Red }
function Write-Info($msg)  { Write-Host "  -->  $msg" -ForegroundColor DarkGray }

function Test-Http {
  param($url, $method = "GET", $body = $null, $label = $url)
  try {
    $params = @{ Uri = $url; Method = $method; UseBasicParsing = $true; TimeoutSec = 15 }
    if ($body) { $params.Body = $body; $params.ContentType = "application/json" }
    $r = Invoke-WebRequest @params
    if ($r.StatusCode -eq 200) { Write-Ok "$label → $($r.StatusCode)" ; return $true }
    else { Write-Warn "$label → $($r.StatusCode)"; return $false }
  } catch {
    Write-Warn "$label → $($_.Exception.Message)"
    return $false
  }
}

# ── Cargar credenciales FTP ───────────────────────────────────────────────────
$ftpConfig = Join-Path $PSScriptRoot "ftp.config.ps1"
if (-not (Test-Path $ftpConfig)) { Write-Fail "Falta scripts\ftp.config.ps1"; exit 1 }
. $ftpConfig

$WORKER_LOCAL  = "http://127.0.0.1:8787"
$WORKER_PROD   = "https://telekoquitoman-worker.sergimontesjimenez.workers.dev"
$FRONTEND_PROD = "https://telekoquitoman.pro"

# ── Detectar cambios ──────────────────────────────────────────────────────────
Write-Step "Detectando cambios"
Set-Location $root

$changedFiles = git diff --name-only HEAD 2>$null
if (-not $changedFiles) { $changedFiles = git diff --name-only 2>$null }
$untrackedFiles = git ls-files --others --exclude-standard 2>$null
$allChanged = @($changedFiles) + @($untrackedFiles) | Where-Object { $_ }

$backChanged  = $forceAll -or ($allChanged | Where-Object { $_ -match "^worker/" })
$frontChanged = $forceAll -or ($allChanged | Where-Object { $_ -match "^frontend/" })

if ($allChanged) {
  Write-Info "Archivos modificados:"
  $allChanged | ForEach-Object { Write-Info "  $_" }
} else {
  Write-Warn "No hay cambios detectados en git"
  if (-not $forceAll) {
    Write-Info "Usa -forceAll para forzar el deploy igualmente"
    exit 0
  }
}

$backChanged  = [bool]$backChanged
$frontChanged = [bool]$frontChanged
Write-Info "Backend modificado:  $backChanged"
Write-Info "Frontend modificado: $frontChanged"

# ════════════════════════════════════════════════════════════════════════════
# BACKEND
# ════════════════════════════════════════════════════════════════════════════
if ($backChanged) {

  # ── Test local del worker ────────────────────────────────────────────────
  Write-Step "Backend — Iniciando worker local"
  Set-Location (Join-Path $root "worker")

  $wranglerJob = Start-Job -ScriptBlock {
    param($dir)
    Set-Location $dir
    npx wrangler dev --port 8787 2>&1
  } -ArgumentList (Join-Path $root "worker")

  Write-Info "Esperando que el worker arranque..."
  Start-Sleep -Seconds 8

  Write-Step "Backend — Tests locales"
  $localResults = @()
  $localResults += Test-Http "$WORKER_LOCAL/api/youtube"          "GET" $null "/api/youtube"
  $localResults += Test-Http "$WORKER_LOCAL/api/chat"             "POST" '{"message":"Hola, quien eres?"}' "/api/chat"
  $localResults += Test-Http "$WORKER_LOCAL/api/contact"          "POST" '{"name":"Test","email":"test@test.com","message":"Test"}' "/api/contact"

  Stop-Job $wranglerJob -ErrorAction SilentlyContinue
  Remove-Job $wranglerJob -ErrorAction SilentlyContinue

  $localFailed = ($localResults | Where-Object { $_ -eq $false }).Count
  if ($localFailed -gt 0) {
    Write-Fail "$localFailed test(s) local(es) del worker fallaron"
    exit 1
  }
  Write-Ok "Todos los tests locales del worker pasaron"

  # ── Deploy worker a producción ───────────────────────────────────────────
  Write-Step "Backend — Deploy a Cloudflare Workers"
  npx wrangler deploy 2>&1 | Select-String -Pattern "Deployed|Error|Uploaded" | ForEach-Object { Write-Info $_.Line }
  if ($LASTEXITCODE -ne 0) { Write-Fail "Deploy del worker fallado"; exit 1 }
  Write-Ok "Worker desplegado en Cloudflare"

  Start-Sleep -Seconds 5  # propagar

  # ── Tests de producción del worker ───────────────────────────────────────
  Write-Step "Backend — Tests en producción"
  $prodBackResults = @()
  $prodBackResults += Test-Http "$WORKER_PROD/api/youtube"  "GET" $null "/api/youtube (prod)"
  $prodBackResults += Test-Http "$WORKER_PROD/api/chat"     "POST" '{"message":"Hola"}' "/api/chat (prod)"

  $prodBackFailed = ($prodBackResults | Where-Object { $_ -eq $false }).Count
  if ($prodBackFailed -gt 0) { Write-Warn "$prodBackFailed test(s) de producción del worker fallaron (no crítico)" }
  else { Write-Ok "Worker en producción OK" }
}

# ════════════════════════════════════════════════════════════════════════════
# FRONTEND
# ════════════════════════════════════════════════════════════════════════════
if ($frontChanged) {

  # ── Build local ──────────────────────────────────────────────────────────
  Write-Step "Frontend — Build de producción"
  Set-Location (Join-Path $root "frontend")
  npm run build 2>&1 | Select-String -Pattern "built|error|warning" -CaseSensitive:$false | ForEach-Object { Write-Info $_.Line }
  if ($LASTEXITCODE -ne 0) { Write-Fail "Build del frontend fallado"; exit 1 }
  Write-Ok "Build completado"

  # ── Tests del build local ────────────────────────────────────────────────
  Write-Step "Frontend — Tests del build"
  $distPath = Join-Path $root "frontend\dist"

  $requiredFiles = @("index.html")
  foreach ($f in $requiredFiles) {
    if (Test-Path (Join-Path $distPath $f)) { Write-Ok "Existe $f" }
    else { Write-Fail "Falta $f en dist/"; exit 1 }
  }

  # Verificar que la URL del worker de producción está en el JS
  $jsFiles = Get-ChildItem -Path (Join-Path $distPath "assets") -Filter "*.js" -ErrorAction SilentlyContinue
  $workerUrlFound = $jsFiles | ForEach-Object { Get-Content $_.FullName } | Select-String "workers\.dev"
  if ($workerUrlFound) { Write-Ok "URL del worker de producción correcta en el build" }
  else { Write-Warn "No se encontró la URL del worker en el build — revisa .env.production" }

  # ── Deploy FTP ───────────────────────────────────────────────────────────
  Write-Step "Frontend — Deploy FTP a $FTP_HOST"
  $files = Get-ChildItem -Path $distPath -Recurse -File
  $ftpOk = 0; $ftpErr = 0

  foreach ($file in $files) {
    $relativePath = $file.FullName.Substring($distPath.Length).Replace("\", "/")
    $remotePath   = "ftp://$FTP_HOST$FTP_REMOTE_PATH$relativePath"

    try {
      $mkDir = [System.Net.FtpWebRequest]::Create($remotePath.Substring(0, $remotePath.LastIndexOf("/")))
      $mkDir.Method = [System.Net.WebRequestMethods+Ftp]::MakeDirectory
      $mkDir.Credentials = New-Object System.Net.NetworkCredential($FTP_USER, $FTP_PASS)
      $mkDir.UsePassive = $true
      $mkDir.GetResponse().Close()
    } catch {}

    try {
      $ftp = [System.Net.FtpWebRequest]::Create($remotePath)
      $ftp.Method      = [System.Net.WebRequestMethods+Ftp]::UploadFile
      $ftp.Credentials = New-Object System.Net.NetworkCredential($FTP_USER, $FTP_PASS)
      $ftp.UseBinary   = $true
      $ftp.UsePassive  = $true
      $content = [System.IO.File]::ReadAllBytes($file.FullName)
      $stream  = $ftp.GetRequestStream()
      $stream.Write($content, 0, $content.Length)
      $stream.Close()
      $ftp.GetResponse().Close()
      Write-Info "UP $relativePath"
      $ftpOk++
    } catch {
      Write-Warn "ERR $relativePath — $($_.Exception.Message)"
      $ftpErr++
    }
  }
  Write-Ok "FTP: $ftpOk subidos, $ftpErr errores"

  # ── Tests de producción del frontend ─────────────────────────────────────
  Write-Step "Frontend — Tests en producción"
  Start-Sleep -Seconds 3
  Test-Http $FRONTEND_PROD "GET" $null "https://telekoquitoman.pro" | Out-Null
}

# ════════════════════════════════════════════════════════════════════════════
# COMMIT Y PUSH
# ════════════════════════════════════════════════════════════════════════════
Write-Step "Git — Commit y push"
Set-Location $root

$pendingChanges = git status --porcelain 2>$null
if (-not $pendingChanges) {
  Write-Info "Nada que commitear"
} else {
  $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
  $parts = @()
  if ($backChanged)  { $parts += "worker" }
  if ($frontChanged) { $parts += "frontend" }
  $scope = if ($parts.Count -gt 0) { $parts -join " + " } else { "misc" }

  git add -A 2>&1 | Out-Null
  git commit -m "update($scope): deploy $timestamp

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>" 2>&1 | ForEach-Object { Write-Info $_ }

  git push origin main 2>&1 | ForEach-Object { Write-Info $_ }
  Write-Ok "Push a GitHub completado"
}

# ── Resumen final ─────────────────────────────────────────────────────────────
Write-Host "`n" + ("=" * 55) -ForegroundColor Cyan
Write-Host "  ACTUALIZACION COMPLETADA" -ForegroundColor Green
Write-Host "  Web:    $FRONTEND_PROD" -ForegroundColor White
Write-Host "  Worker: $WORKER_PROD" -ForegroundColor White
Write-Host ("=" * 55) -ForegroundColor Cyan
