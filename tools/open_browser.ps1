# Abre o navegador assim que o servidor local responder (usado pelo jogar.bat).
$url = 'http://localhost:5173'
$ok = $false
for ($i = 0; $i -lt 120 -and -not $ok; $i++) {
    try {
        Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 1 | Out-Null
        $ok = $true
    } catch {
        Start-Sleep -Seconds 1
    }
}
if ($ok) {
    Start-Process $url
} else {
    Write-Host 'Servidor nao respondeu a tempo; acesse http://localhost:5173 manualmente.'
}
