Ejecuta el proceso completo de actualización de telekoquitoman.pro siguiendo estos pasos en orden:

1. Ejecuta el script PowerShell de actualización:
```bash
cd /c/repos/telekokitoman && powershell -ExecutionPolicy Bypass -File scripts/update.ps1
```

2. Lee la salida del script y reporta al usuario:
   - Qué cambios se detectaron (backend / frontend / ninguno)
   - Resultado de los tests locales
   - Resultado del deploy a producción
   - Resultado de los tests en producción
   - Estado del commit y push a GitHub

3. Si el script falla, diagnostica el error y propón la solución.

4. Al finalizar muestra un resumen con:
   - URLs desplegadas
   - Tests que pasaron / fallaron
   - Hash del commit creado (si hubo)
