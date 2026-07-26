# Génération des cartes Tempo restantes avec Gemini (Nano Banana Pro)
# — à lancer depuis PowerShell (Windows PowerShell 5.1 ou PowerShell 7+).
#
# Utilisation :
#   $env:GEMINI_API_KEY = "votre_cle"
#   cd <racine du dépôt pepinieresmainaud>
#   .\generation\generate-cartes.ps1              # tout générer
#   .\generation\generate-cartes.ps1 -Limite 31   # s'arrêter après N images
#
# Le script est REPRENABLE : les images déjà présentes dans
# generation\sorties\<theme>\<jour>.png sont sautées. Relancez-le autant de
# fois que nécessaire. Une fois terminé :
#   git add generation/sorties
#   git commit -m "Cartes générées (lots 7 à 12)"
#   git push
# … puis demandez à Claude d'intégrer (conversion WebP + déploiement).

param(
    [int]$Limite = 0,          # 0 = pas de limite
    [string]$Modele = "gemini-3-pro-image-preview"
)

$ErrorActionPreference = "Stop"
$cle = $env:GEMINI_API_KEY
if (-not $cle) {
    Write-Host "ERREUR : définissez d'abord la clé :  `$env:GEMINI_API_KEY = `"votre_cle`"" -ForegroundColor Red
    exit 1
}

$ici = Split-Path -Parent $MyInvocation.MyCommand.Path
$cartes = Get-Content -Raw -Encoding UTF8 (Join-Path $ici "cartes-restantes.json") | ConvertFrom-Json
$url = "https://generativelanguage.googleapis.com/v1beta/models/${Modele}:generateContent"

# Force TLS 1.2 (utile sous Windows PowerShell 5.1)
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$faites = 0; $sautees = 0; $echecs = @()
foreach ($c in $cartes) {
    $dossier = Join-Path $ici ("sorties\" + $c.slug)
    $fichier = Join-Path $dossier ($c.jour.ToString() + ".png")
    if (Test-Path $fichier) { $sautees++; continue }
    if ($Limite -gt 0 -and $faites -ge $Limite) { break }
    New-Item -ItemType Directory -Force -Path $dossier | Out-Null

    $corps = @{
        contents = @(@{ role = "user"; parts = @(@{ text = $c.prompt }) })
        generationConfig = @{
            responseModalities = @("IMAGE")
            imageConfig = @{ aspectRatio = "3:4"; imageSize = "1K" }
        }
    } | ConvertTo-Json -Depth 10

    $ok = $false
    for ($essai = 1; $essai -le 3; $essai++) {
        try {
            $rep = Invoke-RestMethod -Uri $url -Method Post -TimeoutSec 180 `
                -Headers @{ "x-goog-api-key" = $cle } `
                -ContentType "application/json; charset=utf-8" `
                -Body ([System.Text.Encoding]::UTF8.GetBytes($corps))
            $b64 = ($rep.candidates[0].content.parts | Where-Object { $_.inlineData }).inlineData.data
            if (-not $b64) { throw "réponse sans image" }
            [IO.File]::WriteAllBytes($fichier, [Convert]::FromBase64String($b64))
            $faites++
            Write-Host ("OK  {0} jour {1}  ({2} faites, {3} restantes)" -f $c.slug, $c.jour, $faites, ($cartes.Count - $sautees - $faites)) -ForegroundColor Green
            $ok = $true
            break
        } catch {
            $msg = $_.Exception.Message
            Write-Host ("  essai {0}/3 raté pour {1} jour {2} : {3}" -f $essai, $c.slug, $c.jour, $msg) -ForegroundColor Yellow
            if ($msg -match "spend|quota|RESOURCE_EXHAUSTED|429") {
                Write-Host "Plafond ou quota atteint : réessayez plus tard, la reprise est automatique." -ForegroundColor Red
                $echecs += "$($c.slug)/$($c.jour)"
                $essai = 99
            } else {
                Start-Sleep -Seconds (10 * $essai)
            }
        }
    }
    if (-not $ok) { $echecs += "$($c.slug)/$($c.jour)" }
    Start-Sleep -Seconds 2   # petite pause pour ménager les limites de débit
}

Write-Host ""
Write-Host ("Terminé : {0} générées, {1} déjà présentes, {2} échecs." -f $faites, $sautees, $echecs.Count) -ForegroundColor Cyan
if ($echecs.Count) { Write-Host ("À relancer : " + ($echecs -join ", ")) -ForegroundColor Yellow }
else {
    Write-Host "Toutes les cartes sont prêtes ! Poussez-les :" -ForegroundColor Cyan
    Write-Host "  git add generation/sorties ; git commit -m 'Cartes generees' ; git push"
}
