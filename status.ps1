# BetterMD 项目状态检查脚本

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    BetterMD 项目状态检查" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查后端服务状态
Write-Host "[后端服务] 端口 8000" -ForegroundColor Yellow
$backendStatus = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue |
                 Where-Object { $_.State -eq "Listen" }

if ($backendStatus) {
    $process = Get-Process -Id $backendStatus.OwningProcess -ErrorAction SilentlyContinue
    if ($process) {
        Write-Host "状态: 运行中" -ForegroundColor Green
        Write-Host "进程ID: $($process.Id)"
        Write-Host "进程名: $($process.ProcessName)"
        Write-Host "启动时间: $($process.StartTime)"
        Write-Host "测试地址: http://localhost:8000" -ForegroundColor Blue
    }
} else {
    Write-Host "状态: 未运行" -ForegroundColor Red
}

Write-Host ""

# 检查前端服务状态
Write-Host "[前端服务] 端口 3001" -ForegroundColor Yellow
$frontendStatus = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue |
                  Where-Object { $_.State -eq "Listen" }

if ($frontendStatus) {
    $process = Get-Process -Id $frontendStatus.OwningProcess -ErrorAction SilentlyContinue
    if ($process) {
        Write-Host "状态: 运行中" -ForegroundColor Green
        Write-Host "进程ID: $($process.Id)"
        Write-Host "进程名: $($process.ProcessName)"
        Write-Host "启动时间: $($process.StartTime)"
        Write-Host "测试地址: http://localhost:3001" -ForegroundColor Blue
    }
} else {
    Write-Host "状态: 未运行" -ForegroundColor Red
}

Write-Host ""

# 检查相关进程
Write-Host "[相关进程检查]" -ForegroundColor Yellow
$nodeProcesses = Get-Process | Where-Object { $_.ProcessName -eq "node" }
$pythonProcesses = Get-Process | Where-Object { $_.ProcessName -eq "python" }

if ($nodeProcesses) {
    Write-Host "Node.js 进程:" -ForegroundColor Cyan
    $nodeProcesses | ForEach-Object {
        Write-Host "  PID: $($_.Id) - $($_.MainWindowTitle)"
    }
}

if ($pythonProcesses) {
    Write-Host "Python 进程:" -ForegroundColor Cyan
    $pythonProcesses | ForEach-Object {
        Write-Host "  PID: $($_.Id) - $($_.MainWindowTitle)"
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    可用命令" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "启动服务: .\start.ps1" -ForegroundColor Green
Write-Host "停止服务: .\stop.ps1" -ForegroundColor Red
Write-Host "重启服务: .\restart.ps1" -ForegroundColor Yellow
Write-Host ""

Read-Host "按回车键退出"