# Bulk patch script for CTA form action support
# Run: pwsh scripts/patch-cta-forms.ps1

$blocksDir = "src\components\blocks"
$hookImport = "import { useCtaAction, type CtaFormType } from '@/hooks/useCtaAction';"

function Patch-DualButton {
  param($file, $btn1Line, $btn2Line, $lastImportPattern, $closingPattern)
  
  $path = "$blocksDir\$file"
  if (-not (Test-Path $path)) { Write-Host "[MISS] $file"; return }
  
  $content = Get-Content $path -Raw
  if ($content -match 'useCtaAction') { Write-Host "[SKIP] $file"; return }
  
  # Add import after last existing import
  $content = $content -replace "(import[^\n]+\n)(?!\s*import)", "`$1$hookImport`n"
  
  # Add formType to interface after button1Url and button2Url
  $content = $content -replace '(button1Url\?:\s*string;)', "`$1`n  button1FormType?: string;"
  $content = $content -replace '(button2Url\?:\s*string;)', "`$1`n  button2FormType?: string;"
  
  # Add formType defaults + hooks after button2Url const line
  $content = $content -replace '(const button2Url\s*=\s*content\?\.button2Url[^\n]+\n)', `
    "`$1  const button1FormType = (content?.button1FormType || '') as CtaFormType;`n  const button2FormType = (content?.button2FormType || '') as CtaFormType;`n`n  const { handleClick: handleBtn1Click, modalNode: modal1 } = useCtaAction(button1Url, button1FormType);`n  const { handleClick: handleBtn2Click, modalNode: modal2 } = useCtaAction(button2Url, button2FormType);`n"
  
  # Replace href={button1Url} Link with conditional button/Link
  $content = $content -replace 'href=\{button1Url\}', 'href={button1FormType ? button1Url : button1Url} onClick={button1FormType ? (e) => { e.preventDefault(); handleBtn1Click(); } : undefined}'
  $content = $content -replace 'href=\{button2Url\}', 'href={button2FormType ? button2Url : button2Url} onClick={button2FormType ? (e) => { e.preventDefault(); handleBtn2Click(); } : undefined}'
  
  # Add modals before closing </section>
  $content = $content -replace '(\s*</section>\s*\);\s*\}\s*)$', "`n      {modal1}`n      {modal2}`n    </section>`n  );`n}`n"
  
  Set-Content $path $content -NoNewline
  Write-Host "[OK]   $file"
}

function Patch-SingleButton {
  param($file, $urlField)
  
  $path = "$blocksDir\$file"
  if (-not (Test-Path $path)) { Write-Host "[MISS] $file"; return }
  
  $content = Get-Content $path -Raw
  if ($content -match 'useCtaAction') { Write-Host "[SKIP] $file"; return }
  
  $content = $content -replace "(import[^\n]+\n)(?!\s*import)", "`$1$hookImport`n"
  $content = $content -replace "($urlField\?:\s*string;)", "`$1`n  ${urlField}FormType?: string;"
  $fType = $urlField + "FormType"
  $content = $content -replace "(const $urlField\s*=\s*content\?\.$urlField[^\n]+\n)", `
    "`$1  const $fType = (content?.$fType || '') as CtaFormType;`n  const { handleClick: handleBtnClick, modalNode } = useCtaAction($urlField, $fType);`n"
  $content = $content -replace "href=\{$urlField\}", "href={$fType ? $urlField : $urlField} onClick={$fType ? (e) => { e.preventDefault(); handleBtnClick(); } : undefined}"
  $content = $content -replace '(\s*</section>\s*\);\s*\}\s*)$', "`n      {modalNode}`n    </section>`n  );`n}`n"
  
  Set-Content $path $content -NoNewline
  Write-Host "[OK]   $file"
}

Write-Host "`n=== Patching dual-button heroes ===" 
foreach ($f in @("RpaHero.tsx","RoiHero.tsx","OracleHero.tsx","OracleApexHero.tsx","AomHero.tsx","AssHero.tsx")) {
  Patch-DualButton -file $f
}

Write-Host "`n=== Patching single-buttonUrl heroes ==="
foreach ($f in @("RetailHero.tsx","StaffingHero.tsx","FmcgHero.tsx","JudicialHero.tsx","OracleApexIntro.tsx")) {
  Patch-SingleButton -file $f -urlField "buttonUrl"
}

Write-Host "`n=== Done ===`n"
