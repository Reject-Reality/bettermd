# BetterMD 项目重启脚本 (PowerShell版本)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    BetterMD 项目重启脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 先停止现有服务
Write-Host "正在停止现有服务..." -ForegroundColor Yellow
& "$PSScriptRoot\stop.ps1"

Write-Host ""
Write-Host "等待3秒后启动新服务..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# 启动新服务
Write-Host ""
Write-Host "启动新服务..." -ForegroundColor Green
& "$PSScriptRoot\start.ps1"