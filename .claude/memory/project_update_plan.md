---
name: Plan de actualización web telekoquitoman.pro
description: Flujo completo de actualización — detectar cambios, tests, deploy local/prod, commit/push y archivado
type: project
---

Script principal: `scripts/update.ps1` (invocar con `/ACTUALIZAR_WEB`)

**Flujo:**
1. Detectar cambios en `worker/` y `frontend/` via `git diff`
2. Si hay cambios en backend: wrangler dev local → tests `/api/youtube` `/api/chat` `/api/contact` → `wrangler deploy` → tests producción
3. Si hay cambios en frontend: `npm run build` → verificar dist → FTP upload a dondominio → test https://telekoquitoman.pro
4. Commit automático con timestamp + push a `origin main`
5. Archivar https://telekoquitoman.pro en Internet Archive (https://web.archive.org/save)

**Why:** Proceso unificado para no olvidar pasos manuales y garantizar que cada deploy queda archivado públicamente.
**How to apply:** Ejecutar `/ACTUALIZAR_WEB` tras cualquier cambio en frontend/ o worker/. El script detecta automáticamente qué hay que desplegar.
