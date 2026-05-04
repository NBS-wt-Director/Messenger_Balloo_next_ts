# Fix RxDB API routes
# Исправление импортов в файлах, которые используют RxDB

Write-Host "Fixing RxDB API routes..." -ForegroundColor Cyan

$files = @(
    "src\app\api\chats\[id]\clear\route.ts",
    "src\app\api\chats\[id]\favorite\route.ts",
    "src\app\api\chats\[id]\pin\route.ts",
    "src\app\api\users\[id]\block\route.ts",
    "src\app\api\health\route.ts"
)

foreach ($file in $files) {
    $fullPath = Join-Path $PSScriptRoot $file
    if (Test-Path $fullPath) {
        $content = Get-Content $fullPath -Encoding UTF8 -Raw
        $original = $content
        
        # Заменяем импорт
        if ($content -match "import db from '@/lib/database'") {
            $content = $content -replace "import db from '@/lib/database'", "import { getDatabase } from '@/lib/database'"
            Write-Host "  Fixed import: $file" -ForegroundColor Green
        }
        
        # Заменяем использование
        if ($content -match "const db = await getDatabase\(\)") {
            $content = $content -replace "const db = await getDatabase\(\)", "const db: any = await getDatabase()"
            Write-Host "  Fixed await: $file" -ForegroundColor Green
        }
        
        if ($content -ne $original) {
            Set-Content $fullPath $content -Encoding UTF8 -NoNewline
        }
    } else {
        Write-Host "  File not found: $file" -ForegroundColor Yellow
    }
}

Write-Host "`nDone!" -ForegroundColor Green
