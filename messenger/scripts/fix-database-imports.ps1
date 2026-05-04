# Fix Database Imports in API Routes
# Запускается из корни проекта: powershell -ExecutionPolicy Bypass -File scripts\fix-database-imports.ps1

Write-Host "Fixing database imports in API routes..." -ForegroundColor Cyan

$apiDir = "src\app\api"
$fixedCount = 0

Get-ChildItem -Recurse -Path $apiDir -Filter "route.ts" | ForEach-Object {
    $filePath = $_.FullName
    $content = Get-Content $filePath -Raw -Encoding UTF8
    
    $originalContent = $content
    
    # Заменяем импорт
    if ($content -match "import db from '@/lib/database'") {
        $content = $content -replace "import db from '@/lib/database'", "import { getDatabase } from '@/lib/database'"
        Write-Host "  Fixed import in: $filePath" -ForegroundColor Green
    }
    
    # Заменяем использование (только если есть await getDatabase)
    if ($content -match "const db = await getDatabase\(\)") {
        $content = $content -replace "const db = await getDatabase\(\)", "const db: any = await getDatabase()"
        Write-Host "  Fixed await in: $filePath" -ForegroundColor Green
    }
    
    # Сохраняем только если были изменения
    if ($content -ne $originalContent) {
        Set-Content $filePath $content -Encoding UTF8 -NoNewline
        $fixedCount++
    }
}

Write-Host "`nFixed $fixedCount files" -ForegroundColor Green
Write-Host "Now run: npm run build" -ForegroundColor Cyan
