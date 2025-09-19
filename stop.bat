@echo off
echo ========================================
echo     BetterMD 项目停止脚本
echo ========================================
echo.

:: 查找并终止后端进程 (端口 8000)
echo [1/2] 停止后端服务 (端口 8000)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8000" ^| findstr "LISTENING"') do (
    echo 找到后端进程 PID: %%a
    taskkill /F /PID %%a 2>nul
    if %errorlevel% == 0 (
        echo [成功] 后端服务已停止
    ) else (
        echo [失败] 无法停止后端进程或进程不存在
    )
)

:: 查找并终止前端进程 (端口 3001)
echo.
echo [2/2] 停止前端服务 (端口 3001)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3001" ^| findstr "LISTENING"') do (
    echo 找到前端进程 PID: %%a
    taskkill /F /PID %%a 2>nul
    if %errorlevel% == 0 (
        echo [成功] 前端服务已停止
    ) else (
        echo [失败] 无法停止前端进程或进程不存在
    )
)

:: 检查还有没有其他相关进程
echo.
echo [3/3] 清理其他相关进程...
wmic process where "name='node.exe' and commandline like '%bettermd%'" delete 2>nul
wmic process where "name='python.exe' and commandline like '%uvicorn%'" delete 2>nul
wmic process where "name='python.exe' and commandline like '%app.main%'" delete 2>nul

echo [完成] 进程清理完成

echo.
echo ========================================
echo     服务停止完成
echo ========================================
echo.
pause