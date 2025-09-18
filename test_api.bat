@echo off
echo 测试BetterMD API

echo.
echo 1. 测试健康检查端点
curl -X GET http://localhost:8000/api/health

echo.
echo.
echo 2. 测试模板列表端点
curl -X GET http://localhost:8000/api/templates

echo.
echo.
echo 3. 测试Markdown处理端点（需要先启动服务器）
echo 请先确保后端服务已启动，然后使用以下命令测试文件上传：
echo curl -X POST -F "file=@test.md" http://localhost:8000/api/markdown/process

echo.
echo 4. 测试原始Markdown内容处理端点
curl -X POST http://localhost:8000/api/markdown/process/raw ^
  -H "Content-Type: application/json" ^
  -d "{\"content\":\"# 测试标题\n\n这是**粗体**文本。\",\"template\":\"default\"}"

pause