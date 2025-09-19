@echo off
echo ========================================
echo     BetterMD 项目启动脚本
echo ========================================
echo.

:: 检查是否已经运行
netstat -ano | findstr ":3000" >nul
if %errorlevel% == 0 (
    echo [警告] 端口 3000 已被占用，可能已有前端服务运行
)

netstat -ano | findstr ":8000" >nul
if %errorlevel% == 0 (
    echo [警告] 端口 8000 已被占用，可能已有后端服务运行
)

echo.

:: 启动后端服务
echo [1/2] 启动后端服务 (端口 8000)...
cd /d "%~dp0backend"
start "BetterMD Backend" cmd /k "python -m uvicorn app.main:app --reload --port 8000"

timeout /t 3 /nobreak >nul

:: 启动前端服务
echo [2/2] 启动前端服务 (端口 3001)...
cd /d "%~dp0frontend"
start "BetterMD Frontend" cmd /k "set PORT=3001 && npm start"

echo.
echo ========================================
echo     服务启动完成
echo ========================================
echo.
echo 前端地址: http://localhost:3001
echo 后端地址: http://localhost:8000
echo API文档: http://localhost:8000/docs
echo.
echo 如需停止服务，请运行 stop.bat
echo.
pause