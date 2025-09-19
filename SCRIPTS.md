# BetterMD 项目管理脚本

## 概述

本项目提供了一系列脚本来方便地启动、停止和重启前后端服务，避免手动管理进程的麻烦。

## 可用脚本

### Windows批处理脚本 (.bat)

- **`start.bat`** - 启动前后端服务
- **`stop.bat`** - 停止所有相关进程
- **`restart.bat`** - 重启服务

### PowerShell脚本 (.ps1)

- **`start.ps1`** - 启动前后端服务（推荐）
- **`stop.ps1`** - 停止所有相关进程（推荐）
- **`restart.ps1`** - 重启服务
- **`status.ps1`** - 检查服务状态

## 使用方法

### 方法1：PowerShell（推荐）

1. 以管理员身份打开PowerShell
2. 进入项目目录：
   ```powershell
   cd C:\develop\workspace\project\bettermd
   ```

3. 启动服务：
   ```powershell
   .\start.ps1
   ```

4. 停止服务：
   ```powershell
   .\stop.ps1
   ```

5. 查看状态：
   ```powershell
   .\status.ps1
   ```

### 方法2：批处理文件

1. 直接双击运行：
   - `start.bat` - 启动服务
   - `stop.bat` - 停止服务
   - `restart.bat` - 重启服务

## 服务地址

- **前端应用**: http://localhost:3001
- **后端API**: http://localhost:8000
- **API文档**: http://localhost:8000/docs

## 功能特点

### PowerShell脚本优势
- 更准确的进程查找和终止
- 彩色输出，更易读
- 详细的状态信息
- 错误处理更好

### 批处理脚本特点
- 无需管理员权限
- 兼容性更好
- 简单直接

## 故障排除

### 端口被占用
如果遇到端口被占用的问题：
1. 运行 `status.ps1` 查看哪些进程在使用端口
2. 运行 `stop.ps1` 清理相关进程
3. 如果仍无法解决，手动重启电脑

### 权限问题
- PowerShell脚本建议以管理员身份运行
- 批处理文件通常不需要特殊权限

### 服务启动失败
1. 检查是否已安装Node.js和Python
2. 确认在正确的目录中运行脚本
3. 查看控制台输出的错误信息

## 注意事项

1. 脚本会终止所有相关进程，包括其他可能运行在相同端口上的进程
2. 建议在启动新服务前先停止现有服务
3. 如果修改了端口配置，需要相应修改脚本中的端口号
4. 在开发环境中使用，生产环境请使用专业的进程管理工具

## 快速命令

```powershell
# 一键启动
.\start.ps1

# 一键停止
.\stop.ps1

# 查看状态
.\status.ps1

# 重启服务
.\restart.ps1
```