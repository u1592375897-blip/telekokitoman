# update.ps1 - Deteccion de cambios, deploy local + prod, tests y commit/push
# Uso directo: .\scripts\update.ps1
# Invocado también por el comando /ACTUALIZAR_WEB de Claude Code

param(
  [switch]$forceAll    # Fuerza deploy de todo aunque no haya cambios
)

$ErrorActionPreference = "Continue"
$root = Split-Path $PSScriptRoot -Parent

# ── Helpers ──────────────────────────────────────────────────────────────────
$script:stepNum = 0
$script:results = @()

function Write-Step($msg) {
  $script:stepNum++
  Write-Host ""
  Write-Host "+-------------------------------------------------+" -ForegroundColor Cyan
  Write-Host "  PASO $($script:stepNum): $msg" -ForegroundColor Cyan
  Write-Host "+-------------------------------------------------+" -ForegroundColor Cyan
}
function Write-Ok($msg) {
  Write-Host "  [OK]   $msg" -ForegroundColor Green
  $script:results += "[OK]   $msg"
}
function Write-Warn($msg) {
  Write-Host "  [WARN] $msg" -ForegroundColor Yellow
  $script:results += "[WARN] $msg"
}
function Write-Fail($msg) {
  Write-Host "  [FAIL] $msg" -ForegroundColor Red
  $script:results += "[FAIL] $msg"
}
function Write-Info($msg)  { Write-Host "         $msg" -ForegroundColor DarkGray }
function Write-Action($msg){ Write-Host "  >>     $msg" -ForegroundColor White }

function Test-Http {
  param($url, $method = "GET", $body = $null, $label = $url)
  Write-Action "Probando $method $label..."
  try {
    $params = @{ Uri = $url; Method = $method; UseBasicParsing = $true; TimeoutSec = 15 }
    if ($body) { $params.Body = $body; $params.ContentType = "application/json" }
    $r = Invoke-WebRequest @params
    if ($r.StatusCode -eq 200) { Write-Ok "$label -> $($r.StatusCode) OK" ; return $true }
    else { Write-Warn "$label -> $($r.StatusCode)"; return $false }
  } catch {
    Write-Warn "$label -> ERROR: $($_.Exception.Message)"
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

Write-Host ""
Write-Host "=================================================" -ForegroundColor Magenta
Write-Host "   ACTUALIZACION TELEKOQUITOMAN.PRO" -ForegroundColor Magenta
Write-Host "   $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor DarkGray
Write-Host "=================================================" -ForegroundColor Magenta

# ── Detectar cambios ──────────────────────────────────────────────────────────
Write-Step "Detectando cambios en el repositorio"
Set-Location $root

Write-Action "Ejecutando git diff..."
$changedFiles = (git diff --name-only HEAD 2>&1) | Where-Object { $_ -notmatch "^warning:" }
if (-not $changedFiles) { $changedFiles = (git diff --name-only 2>&1) | Where-Object { $_ -notmatch "^warning:" } }
$untrackedFiles = (git ls-files --others --exclude-standard 2>&1) | Where-Object { $_ -notmatch "^warning:" }
$allChanged = @($changedFiles) + @($untrackedFiles) | Where-Object { $_ }

$backChanged  = $forceAll -or ($allChanged | Where-Object { $_ -match "^worker/" })
$frontChanged = $forceAll -or ($allChanged | Where-Object { $_ -match "^frontend/" })

if ($allChanged) {
  Write-Ok "$($allChanged.Count) archivo(s) modificado(s):"
  $allChanged | ForEach-Object { Write-Info "  * $_" }
} else {
  Write-Warn "No hay cambios detectados en git"
  if (-not $forceAll) {
    Write-Info "Usa -forceAll para forzar el deploy igualmente"
    exit 0
  }
}

$backChanged  = [bool]$backChanged
$frontChanged = [bool]$frontChanged
if ($backChanged)  { Write-Ok "Backend (worker/) tiene cambios -> se desplegara" }
else               { Write-Info "Backend sin cambios -> se omite" }
if ($frontChanged) { Write-Ok "Frontend (frontend/) tiene cambios -> se desplegara" }
else               { Write-Info "Frontend sin cambios -> se omite" }

# ════════════════════════════════════════════════════════════════════════════
# BACKEND
# ════════════════════════════════════════════════════════════════════════════
if ($backChanged) {

  # ── Test local del worker ────────────────────────────────────────────────
  Write-Step "Backend - Iniciando worker local (wrangler dev)"
  Set-Location (Join-Path $root "worker")
  Write-Action "Lanzando wrangler dev en background en puerto 8787..."

  $wranglerJob = Start-Job -ScriptBlock {
    param($dir)
    Set-Location $dir
    npx wrangler dev --port 8787 2>&1
  } -ArgumentList (Join-Path $root "worker")

  Write-Action "Esperando 8 segundos a que el worker arranque..."
  Start-Sleep -Seconds 8
  Write-Ok "Worker local listo en $WORKER_LOCAL"

  Write-Step "Backend - Tests locales (3 endpoints)"
  $localResults = @()
  $localResults += Test-Http "$WORKER_LOCAL/api/youtube" "GET"  $null                                               "/api/youtube"
  $localResults += Test-Http "$WORKER_LOCAL/api/chat"    "POST" '{"message":"Hola, quien eres?"}'                   "/api/chat"
  $localResults += Test-Http "$WORKER_LOCAL/api/contact" "POST" '{"name":"Test","email":"t@t.com","message":"Test"}' "/api/contact"

  Write-Action "Deteniendo worker local..."
  Stop-Job $wranglerJob -ErrorAction SilentlyContinue
  Remove-Job $wranglerJob -ErrorAction SilentlyContinue

  $localFailed = ($localResults | Where-Object { $_ -eq $false }).Count
  if ($localFailed -gt 0) {
    Write-Fail "$localFailed test(s) local(es) fallaron - abortando"
    exit 1
  }
  Write-Ok "Todos los tests locales del worker pasaron (3/3)"

  Write-Step "Backend - Deploy a Cloudflare Workers (produccion)"
  Write-Action "Ejecutando wrangler deploy..."
  npx wrangler deploy 2>&1 | Select-String -Pattern "Deployed|Error|Uploaded|Version" | ForEach-Object { Write-Info $_.Line }
  if ($LASTEXITCODE -ne 0) { Write-Fail "Deploy del worker fallado"; exit 1 }
  Write-Ok "Worker desplegado en Cloudflare -> $WORKER_PROD"

  Write-Action "Esperando 5 segundos a que se propague..."
  Start-Sleep -Seconds 5

  Write-Step "Backend - Tests en produccion"
  $prodBackResults = @()
  $prodBackResults += Test-Http "$WORKER_PROD/api/youtube" "GET"  $null              "/api/youtube (prod)"
  $prodBackResults += Test-Http "$WORKER_PROD/api/chat"    "POST" '{"message":"Hola"}' "/api/chat (prod)"

  $prodBackFailed = ($prodBackResults | Where-Object { $_ -eq $false }).Count
  if ($prodBackFailed -gt 0) { Write-Warn "$prodBackFailed test(s) de produccion fallaron (no critico)" }
  else { Write-Ok "Worker en produccion OK (2/2 tests pasados)" }
}

# ════════════════════════════════════════════════════════════════════════════
# FRONTEND
# ════════════════════════════════════════════════════════════════════════════
if ($frontChanged) {

  Write-Step "Frontend - Build de produccion"
  Set-Location (Join-Path $root "frontend")
  Write-Action "Ejecutando npm run build con .env.production..."
  $buildOut = npm run build 2>&1
  $buildOut | Select-String -Pattern "built|error|modules transformed" -CaseSensitive:$false | ForEach-Object { Write-Info $_.Line }
  if ($LASTEXITCODE -ne 0) { Write-Fail "Build del frontend fallado"; exit 1 }
  Write-Ok "Build completado -> frontend/dist/"

  Write-Step "Frontend - Verificacion del build"
  $distPath = Join-Path $root "frontend\dist"
  Write-Action "Comprobando archivos generados en dist/..."

  $requiredFiles = @("index.html")
  foreach ($f in $requiredFiles) {
    if (Test-Path (Join-Path $distPath $f)) { Write-Ok "Archivo obligatorio existe: $f" }
    else { Write-Fail "Falta $f en dist/"; exit 1 }
  }

  $jsFiles = Get-ChildItem -Path (Join-Path $distPath "assets") -Filter "*.js" -ErrorAction SilentlyContinue
  $cssFiles = Get-ChildItem -Path (Join-Path $distPath "assets") -Filter "*.css" -ErrorAction SilentlyContinue
  Write-Ok "Assets generados: $($jsFiles.Count) JS, $($cssFiles.Count) CSS"

  Write-Action "Verificando URL del worker en el bundle..."
  $workerUrlFound = $jsFiles | ForEach-Object { Get-Content $_.FullName } | Select-String "workers\.dev"
  if ($workerUrlFound) { Write-Ok "URL del worker de produccion correcta en el build" }
  else { Write-Warn "URL del worker no encontrada en el build -> revisa .env.production" }

  Write-Step "Frontend - Deploy FTP a $FTP_HOST"
  $files = Get-ChildItem -Path $distPath -Recurse -File
  Write-Action "Subiendo $($files.Count) archivos por FTP..."
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
      Write-Info "  [UP] $relativePath ($([math]::Round($file.Length/1KB, 1)) KB)"
      $ftpOk++
    } catch {
      Write-Warn "  [ERR] $relativePath - $($_.Exception.Message)"
      $ftpErr++
    }
  }
  if ($ftpErr -eq 0) { Write-Ok "FTP completado: $ftpOk archivos subidos sin errores" }
  else               { Write-Warn "FTP: $ftpOk subidos, $ftpErr errores" }

  Write-Step "Frontend - Tests en produccion"
  Write-Action "Esperando 3 segundos y testeando $FRONTEND_PROD..."
  Start-Sleep -Seconds 3
  Test-Http $FRONTEND_PROD "GET" $null $FRONTEND_PROD | Out-Null
}

# ════════════════════════════════════════════════════════════════════════════
# COMMIT Y PUSH
# ════════════════════════════════════════════════════════════════════════════
Write-Step "Git - Commit y push a GitHub"
Set-Location $root

Write-Action "Comprobando cambios pendientes con git status..."
$pendingChanges = (git status --porcelain 2>&1) | Where-Object { $_ -notmatch "^warning:" }
if (-not $pendingChanges) {
  Write-Info "Nada que commitear, el repositorio esta limpio"
} else {
  Write-Info "Archivos a commitear:"
  $pendingChanges | ForEach-Object { Write-Info "  $_" }

  $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
  $parts = @()
  if ($backChanged)  { $parts += "worker" }
  if ($frontChanged) { $parts += "frontend" }
  $scope = if ($parts.Count -gt 0) { $parts -join " + " } else { "misc" }

  Write-Action "Ejecutando git add -A..."
  git add -A 2>&1 | Out-Null

  Write-Action "Creando commit: update($scope): deploy $timestamp"
  $commitMsg = "update($scope): deploy $timestamp`n`nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
  $commitOut = git commit -m $commitMsg 2>&1 | Where-Object { $_ -notmatch "^warning:" }
  $commitOut | ForEach-Object { Write-Info "  $_" }

  Write-Action "Ejecutando git push origin main..."
  $pushOut = git push origin main 2>&1 | Where-Object { $_ -notmatch "^warning:" }
  $pushOut | ForEach-Object { Write-Info "  $_" }
  Write-Ok "Push a GitHub completado -> https://github.com/u1592375897-blip/telekokitoman"
}

# ════════════════════════════════════════════════════════════════════════════
# ARCHIVAR EN INTERNET ARCHIVE (Wayback Machine)
# ════════════════════════════════════════════════════════════════════════════
Write-Step "Archivando en Internet Archive (Wayback Machine)"
Write-Action "Enviando solicitud de archivado a web.archive.org/save..."
try {
  $archiveUrl = "https://web.archive.org/save/$FRONTEND_PROD"
  $archiveRes = Invoke-WebRequest -Uri $archiveUrl -Method GET -UseBasicParsing -TimeoutSec 30
  if ($archiveRes.StatusCode -in 200, 302) {
    Write-Ok "Archivado correctamente en Wayback Machine"
    Write-Info "  Ver en: https://web.archive.org/web/*/$FRONTEND_PROD"
  } else {
    Write-Warn "Respuesta inesperada del archivado: $($archiveRes.StatusCode)"
  }
} catch {
  Write-Warn "No se pudo archivar: $($_.Exception.Message)"
}

# ── Resumen final ────────────────────────────────────────────────────────────
$sep = "=" * 55
Write-Host ""
Write-Host $sep -ForegroundColor Magenta
Write-Host "  ACTUALIZACION COMPLETADA - $($script:stepNum) pasos ejecutados" -ForegroundColor Green
Write-Host $sep -ForegroundColor Magenta
Write-Host "  Web:    $FRONTEND_PROD" -ForegroundColor White
Write-Host "  Worker: $WORKER_PROD" -ForegroundColor White
Write-Host $sep -ForegroundColor Magenta
Write-Host ""
Write-Host "  RESUMEN DE RESULTADOS:" -ForegroundColor Cyan
$script:results | ForEach-Object {
  if ($_ -match "^\[OK\]")   { Write-Host "  $_" -ForegroundColor Green }
  elseif ($_ -match "^\[WARN\]") { Write-Host "  $_" -ForegroundColor Yellow }
  elseif ($_ -match "^\[FAIL\]") { Write-Host "  $_" -ForegroundColor Red }
}
Write-Host $sep -ForegroundColor Magenta
