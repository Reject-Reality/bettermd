@echo off
echo ========================================
echo     BetterMD 项目重启脚本
echo ========================================
echo.

:: 先停止现有服务
echo 正在停止现有服务...
call "%~dp0stop.bat"

echo.
echo 等待3秒后启动新服务...
timeout /t 3 /nobreak >nul

:: 启动新服务
echo.
echo 启动新服务...
call "%~dp0start.bat"

pause