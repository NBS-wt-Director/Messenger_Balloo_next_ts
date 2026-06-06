Get-ChildItem -Recurse -Filter "route.ts" | ForEach-Object {
    $content = Get-Content $_.FullName -Raw -Encoding UTF8
    if ($content -match 'getDatabase|db\.users\.find|db\.chats\.find|db\.messages\.find') {
        Remove-Item $_.FullName -Force
        Write-Host "Removed: $($_.FullName)"
    }
}
