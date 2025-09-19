# BetterMD 项目停止脚本 (PowerShell版本)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    BetterMD 项目停止脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 停止后端服务
Write-Host "[1/2] 停止后端服务 (端口 8000)..." -ForegroundColor Green
$backendProcesses = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue |
                    Where-Object { $_.State -eq "Listen" } |
                    Select-Object -ExpandProperty OwningProcess -Unique

if ($backendProcesses) {
    foreach ($process in $backendProcesses) {
        try {
            $proc = Get-Process -Id $process.Id -ErrorAction Stop
            Write-Host "找到后端进程 PID: $($proc.Id) - $($proc.ProcessName)"
            Stop-Process -Id $proc.Id -Force
            Write-Host "[成功] 后端服务已停止" -ForegroundColor Green
        } catch {
            Write-Host "[失败] 无法停止后端进程: $_" -ForegroundColor Red
        }
    }
} else {
    Write-Host "[信息] 未找到运行中的后端服务" -ForegroundColor Yellow
}

# 停止前端服务
Write-Host ""
Write-Host "[2/2] 停止前端服务 (端口 3001)..." -ForegroundColor Green
$frontendProcesses = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue |
                     Where-Object { $_.State -eq "Listen" } |
                     Select-Object -ExpandProperty OwningProcess -Unique

if ($frontendProcesses) {
    foreach ($process in $frontendProcesses) {
        try {
            $proc = Get-Process -Id $process.Id -ErrorAction Stop
            Write-Host "找到前端进程 PID: $($proc.Id) - $($proc.ProcessName)"
            Stop-Process -Id $proc.Id -Force
            Write-Host "[成功] 前端服务已停止" -ForegroundColor Green
        } catch {
            Write-Host "[失败] 无法停止前端进程: $_" -ForegroundColor Red
        }
    }
} else {
    Write-Host "[信息] 未找到运行中的前端服务" -ForegroundColor Yellow
}

# 清理其他相关进程
Write-Host ""
Write-Host "[3/3] 清理其他相关进程..." -ForegroundColor Green

# 停止Node.js相关进程
Get-Process | Where-Object {
    $_.ProcessName -eq "node" -and
    ($_.CommandLine -like "*bettermd*" -or $_.CommandLine -like "*react-scripts*")
} | Stop-Process -Force -ErrorAction SilentlyContinue

# 停止Python相关进程
Get-Process | Where-Object {
    $_.ProcessName -eq "python" -and
    ($_.CommandLine -like "*uvicorn*" -or $_.CommandLine -like "*app.main*")
} | Stop-Process -Force -ErrorAction SilentlyContinue

Write-Host "[完成] 进程清理完成" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    服务停止完成" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Read-Host "按回车键退出"