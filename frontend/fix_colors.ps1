$files = Get-ChildItem -Path ".\src" -Recurse -Filter "*.jsx"
foreach ($f in $files) {
    $c = Get-Content $f.FullName -Raw -Encoding UTF8
    $c2 = $c -replace "bgcolor: 'grey\.50'", "bgcolor: 'action.hover'"
    $c2 = $c2 -replace 'bgcolor: "grey\.50"', 'bgcolor: "action.hover"'
    $c2 = $c2 -replace "bgcolor: 'grey\.100'", "bgcolor: 'action.selected'"
    $c2 = $c2 -replace 'bgcolor: "grey\.100"', 'bgcolor: "action.selected"'
    $c2 = $c2 -replace "bgcolor: '#ffffff'", "bgcolor: 'background.paper'"
    $c2 = $c2 -replace 'bgcolor: "#ffffff"', 'bgcolor: "background.paper"'
    if ($c2 -ne $c) {
        [System.IO.File]::WriteAllText($f.FullName, $c2, [System.Text.Encoding]::UTF8)
        Write-Host ("Fixed: " + $f.Name)
    }
}
Write-Host "Done!"
