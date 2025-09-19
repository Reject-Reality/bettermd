# BetterMD 项目启动脚本 (PowerShell版本)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    BetterMD 项目启动脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查端口占用
function Check-Port {
    param($port, $name)

    $connection = netstat -ano | findstr ":$port"
    if ($connection) {
        Write-Host "[警告] 端口 $port 已被占用，可能已有$name服务运行" -ForegroundColor Yellow
        return $true
    }
    return $false
}

Check-Port 3000 "前端"
Check-Port 8000 "后端"
Write-Host ""

# 启动后端服务
Write-Host "[1/2] 启动后端服务 (端口 8000)..." -ForegroundColor Green
Set-Location "$PSScriptRoot\backend"
Start-Process cmd -ArgumentList "/k", "python -m uvicorn app.main:app --reload --port 8000" -WindowStyle Normal -WindowTitle "BetterMD Backend"

Start-Sleep -Seconds 3

# 启动前端服务
Write-Host "[2/2] 启动前端服务 (端口 3001)..." -ForegroundColor Green
Set-Location "$PSScriptRoot\frontend"
$env:PORT = 3001
Start-Process cmd -ArgumentList "/k", "npm start" -WindowStyle Normal -WindowTitle "BetterMD Frontend"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    服务启动完成" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "前端地址: http://localhost:3001" -ForegroundColor Green
Write-Host "后端地址: http://localhost:8000" -ForegroundColor Green
Write-Host "API文档: http://localhost:8000/docs" -ForegroundColor Green
Write-Host ""
Write-Host "如需停止服务，请运行: .\stop.ps1" -ForegroundColor Yellow
Write-Host ""

Read-Host "按回车键退出"