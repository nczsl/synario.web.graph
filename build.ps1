$workdir = $PSScriptRoot
echo "get module location:  $workdir"
echo "Building localts..."

rm $workdir\dist\*,$workdir\types\* -r -fo
echo "removed dist and types"
# return
tsc -p $workdir\tsconfig.json

echo 'build typescript module localts done'

# 重写index.ts中的内容让它生成的语句与src中的所有文件一样，导出所有的内容

$srcDir = "$workdir\\src\\"
$indexts = "$workdir\\index.ts"

$files = Get-ChildItem $srcDir -Recurse -Include *.ts
$exportStr = ""
# version = date yyMMdd.HH
$version = Get-Date -Format "yyMMdd.HH"
$exportStr += "///<reference path='./moduledef.d.ts' />`n"
$exportStr += "export const version = '$version';`n"
$exportStr += "export const moduleCount = $($files.Count);`n" 

foreach ($file in $files) {
  $name=$file.Name -replace ".ts$",""
  $importname=$name -replace "-","_"
  $importname="$($importname)_mod"
  $exportStr += "export * as $importname from './src/" + $name + "';`n"
}

$exportStr | Out-File -FilePath $indexts -Encoding utf8

# === 处理 shader/ 下的 .wgsl 文件，生成文本导出 ===
$shaderDir = Join-Path $PSScriptRoot "shader"
$wgslFiles = Get-ChildItem -Path $shaderDir -Filter *.wgsl

$shaderExports = @()
foreach ($file in $wgslFiles) {
    $name = [System.IO.Path]::GetFileNameWithoutExtension($file.Name) -replace "-", "_"
    $importLine = "import $($name)_wgsl from './shader/$($file.Name)' with { type: 'text' };"
    $exportLine = "export { $($name)_wgsl };"
    $shaderExports += $importLine
    $shaderExports += $exportLine
}

# 假设 index.ts 路径如下（如有不同请自行调整）
$indexPath = Join-Path $PSScriptRoot "index.ts"

# 将 shader 导出内容追加到 index.ts
Add-Content -Path $indexPath -Value "`n// shader exports"
Add-Content -Path $indexPath -Value ($shaderExports -join "`n")

echo "rewrite index.ts done"
