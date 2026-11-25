# Kjor de nye offline-testene, lagre full logg lokalt og kopier KUN sammendrag til utklippstavlen.
# Ingen KI-nokler, ingen betalte API-kall, ingen deploy, ingen git push.
param([switch]$Full)

$root = Split-Path -Parent $PSScriptRoot
Push-Location $root
try {
    if (-not (Get-Command npm.cmd -ErrorAction SilentlyContinue)) {
        throw "Finner ikke npm.cmd. Kontroller Node.js-installasjonen."
    }
    $branch = ((& git branch --show-current) | Select-Object -First 1).Trim()
    if ($branch -ne "fix/evidence-sources-20261120") {
        throw "Du er pa $branch. Bytt til fix/evidence-sources-20261120 for a teste de nye endringene."
    }
    $commit = ((& git rev-parse --short HEAD) | Select-Object -First 1).Trim()

    $tests = @(
        "test-sourcebank",
        "test-sector-source-coverage",
        "test-source-acceptance-contract",
        "test-source-acceptance-evaluator",
        "test-source-acceptance-manual-review",
        "test-source-acceptance-routing",
        "test-source-provenance-http",
        "test-source-provenance-ui",
        "test-source-retention",
        "test-source-negation-boundaries",
        "test-source-normalization",
        "test-help-library",
        "test-source-ranking",
        "test-source-policy",
        "test-golden-occupation-routing",
        "test-occupation-router",
        "test-occupation-data",
        "test-agreement-router",
        "test-source-validity",
        "test-historical-source-context",
        "test-legal-claim-review",
        "test-occupation-context",
        "test-benchmark-taxonomy",
        "test-benchmark-evaluation",
        "test-benchmark-budget",
        "test-benchmark-live-http",
        "test-benchmark-budget-rpc",
        "test-benchmark-rpc-http",
        "test-benchmark-privacy-signal"
    )
    if ($Full) { $tests = @("test") }

    $outDir = Join-Path $root "test-results"
    New-Item -ItemType Directory -Force -Path $outDir | Out-Null
    $log = Join-Path $outDir ("nye-tester-" + (Get-Date -Format "yyyyMMdd-HHmmss") + ".log")
    @("Samtalestotte tests", "Branch: $branch", "Commit: $commit", "Ekte KI-kall: 0") |
        Out-File -FilePath $log -Encoding utf8
    $failed = @()
    $failureDetails = @()
    $index = 0
    foreach ($test in $tests) {
        $index++
        Write-Host "[$index/$($tests.Count)] $test" -ForegroundColor Cyan
        "=== $test ===" | Out-File -FilePath $log -Append -Encoding utf8
        # Capture stdout/stderr in the local file; don't flood PowerShell or chat.
        $oldPreference = $ErrorActionPreference
        $ErrorActionPreference = "Continue"
        $output = @()
        $exitCode = 1
        try {
            $output = @(& npm.cmd run $test 2>&1)
            $exitCode = $LASTEXITCODE
            if ($null -eq $exitCode) { $exitCode = 1 }
        } catch {
            $output += $_.Exception.Message
        } finally {
            $ErrorActionPreference = $oldPreference
        }
        $output | Out-File -FilePath $log -Append -Encoding utf8
        "Exit code: $exitCode" | Out-File -FilePath $log -Append -Encoding utf8
        if ($exitCode -eq 0) {
            Write-Host "  BESTATT" -ForegroundColor Green
        } else {
            $failed += $test
            # Ta bare feilspor fra denne testen. Hele loggen forblir pa PC-en.
            $lines = @($output | ForEach-Object { [string]$_ })
            $signals = @($lines | Where-Object {
                $_ -match '(?i)AssertionError|ERR_[A-Z_]+|\bError\b|failed|feilet|EADDRINUSE|ECONNREFUSED|ETIMEDOUT|Timeout|not ready|exit code|Access is denied|EACCES|EPERM'
            } | Select-Object -Last 12)
            $tail = @($lines | Select-Object -Last 8)
            $detail = (@($signals) + @($tail) | Select-Object -Unique) -join [Environment]::NewLine
            if ($detail.Length -gt 2200) {
                $detail = $detail.Substring($detail.Length - 2200)
            }
            $failureDetails += "=== $test ===" + [Environment]::NewLine + $detail
            Write-Host "  FEILET - et kort feilutdrag kopieres automatisk" -ForegroundColor Red
        }
    }

    $passed = $tests.Count - $failed.Count
    $status = if ($failed.Count -eq 0) { "BESTATT" } else { "FEIL FUNNET" }
    $names = if ($failed.Count -eq 0) { "Ingen" } else { $failed -join ", " }
    $summary = @(
        "SAMTALESTOTTE - NYE TESTER",
        "Status: $status",
        "Gren: $branch",
        "Commit: $commit",
        "Bestatt: $passed / $($tests.Count)",
        "Feilet: $($failed.Count)",
        "Tester med feil: $names",
        "Ekte KI-kall: 0",
        "Loggfil pa PC: $log"
    ) -join [Environment]::NewLine

    if ($failureDetails.Count -gt 0) {
        $summary += [Environment]::NewLine + [Environment]::NewLine +
            "FEILUTDRAG (full logg ligger bare lokalt):" + [Environment]::NewLine +
            ($failureDetails -join ([Environment]::NewLine + [Environment]::NewLine))
    }
    # Ikke kopier eventuelle hemmeligheter fra en lokal logg til chatten.
    $summary = $summary -replace '(?i)sk-[A-Za-z0-9_-]{16,}', '[SKJULT-NOKKEL]'
    $summary = $summary -replace '(?i)([A-Z_]*(?:API_KEY|SECRET_KEY|ACCESS_TOKEN|AUTH_TOKEN))\s*[:=]\s*\S+', '$1=[SKJULT]'
    if ($summary.Length -gt 9000) { $summary = $summary.Substring(0,9000) +
        [Environment]::NewLine + "[Kortet ned. Fullstendig logg ligger lokalt.]" }

    Write-Host ""
    Write-Host $summary
    try {
        Set-Clipboard -Value $summary -ErrorAction Stop
        Write-Host "Kort rapport kopiert til utklippstavlen - bruk Ctrl+V i chatten." -ForegroundColor Green
    } catch {
        try {
            $summary | clip.exe
            if ($LASTEXITCODE -ne 0) { throw "clip.exe feilet." }
            Write-Host "Kort rapport kopiert til utklippstavlen - bruk Ctrl+V i chatten." -ForegroundColor Green
        } catch {
            Write-Warning "Kunne ikke kopiere automatisk. Kopier den korte rapporten over."
        }
    }
    if ($failed.Count -gt 0) { exit 1 }
} finally {
    Pop-Location
}