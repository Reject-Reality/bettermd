# BetterMD - 专业的Markdown美化器

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100.0-009688.svg)
![Python](https://img.shields.io/badge/Python-3.10+-3776AB.svg)

BetterMD 是一款专业的 Markdown 文档美化工具，集成了 AI 智能辅助功能，帮助用户将普通的 Markdown 文档转换为格式精美、视觉吸引人的专业文档。

## ✨ 主要特性

### 🎨 文档美化
- **多种模板**: 内置商务、学术、技术等多种风格模板
- **实时预览**: 所见即所得的编辑体验
- **自定义模板**: 支持用户上传和应用自定义模板
- **一键美化**: 快速应用模板到文档

### 📝 专业编辑器
- **Markdown编辑**: 基于 @uiw/react-md-editor 的专业编辑器
- **实时预览**: 编辑和预览模式无缝切换
- **语法高亮**: 支持多种编程语言的代码高亮
- **工具栏**: 完整的 Markdown 格式化工具栏
- **文件上传**: 支持 .md 文件上传和内容编辑

### 🤖 AI 智能辅助
- **智能推荐**: AI 根据内容推荐最适合的模板
- **内容优化**: 提供文档结构和语言改进建议
- **自动美化**: AI 驱动的文档自动美化功能
- **智能润色**: 语言表达和格式优化

### 🔧 插件系统
- **可扩展架构**: 支持自定义插件开发
- **内置插件**: 代码高亮、数学公式、知识图谱等
- **插件管理**: 可视化插件管理界面

## 🏗️ 技术架构

### 前端技术栈
- **React 18** - 现代化的用户界面框架
- **Ant Design 5** - 企业级 UI 组件库
- **@uiw/react-md-editor** - 专业的 Markdown 编辑器组件
- **Axios** - HTTP 客户端
- **React Router** - 单页应用路由管理

### 后端技术栈
- **FastAPI** - 高性能的 Python Web 框架
- **智谱 GLM-4.5** - AI 服务提供商
- **Jinja2** - 模板引擎
- **Markdown** - 文档处理库
- **BeautifulSoup** - HTML 处理库

## 🚀 快速开始

### 环境要求
- Node.js 18+
- Python 3.10+
- Docker (可选)

### 开发环境部署

#### 方式一：Docker (推荐)

```bash
# 克隆项目
git clone https://github.com/Reject-Reality/bettermd.git
cd bettermd

# 启动开发环境
docker-compose up --build

# 访问应用
# 前端: http://localhost:3001
# 后端API: http://localhost:8000
# API文档: http://localhost:8000/docs
```

#### 方式二：本地开发 (推荐)

**使用开发脚本** (最简单):
```bash
# 启动所有服务 (PowerShell - 推荐)
.\start.ps1

# 或者使用批处理文件
start.bat

# 查看服务状态
.\status.ps1

# 停止所有服务
.\stop.ps1

# 重启服务
.\restart.ps1
```

**手动启动**:
```bash
# 前端启动
cd frontend
npm install
PORT=3001 npm start

# 后端启动
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## 📖 使用指南

### 1. 文件上传美化
1. 访问主页，点击"上传文档"
2. 选择要美化的 Markdown 文件
3. 选择合适的模板
4. 点击上传，系统自动处理并预览

### 2. 在线编辑
1. 点击"打开编辑器"进入编辑界面
2. 使用专业的 Markdown 编辑器创建或编辑内容
3. 支持实时预览和编辑模式切换
4. 可以上传 .md 文件或直接编辑内容
5. 支持切换不同模板查看美化效果

### 3. AI 辅助功能
1. 在编辑器中点击"AI工具"标签页
2. 使用"模板推荐"获取 AI 建议
3. 使用"内容优化"改进文档质量
4. 使用"自动美化"让 AI 帮助美化文档

## 📁 项目结构

```
bettermd/
├── frontend/                    # React 前端应用
│   ├── src/
│   │   ├── components/         # React 组件
│   │   ├── pages/             # 页面组件
│   │   ├── api/               # API 客户端
│   │   └── types/             # TypeScript 类型定义
│   ├── public/                # 静态资源
│   └── package.json           # 前端依赖
├── backend/                    # FastAPI 后端
│   ├── app/
│   │   ├── api/               # API 路由
│   │   ├── core/              # 核心业务逻辑
│   │   ├── utils/             # 工具函数
│   │   └── templates/         # 美化模板
│   ├── requirements.txt       # Python 依赖
│   └── Dockerfile            # 后端容器配置
├── docker-compose.yml         # 容器编排配置
└── README.md                 # 项目说明文档
```

## 🔧 配置说明

### 环境变量配置

后端需要配置 AI 服务密钥：

```bash
# 复制环境变量模板
cp backend/.env.example backend/.env

# 编辑环境变量文件
# 配置智谱AI API密钥
ZHIPU_API_KEY=your_zhipu_api_key_here
ENV=development
```

### 模板系统

模板位于 `backend/app/templates/` 目录下，每个模板包含：
- `template.json` - 模板元数据
- `layout.html` - HTML 布局模板
- `style.css` - 样式文件

## 🤝 贡献指南

我们欢迎任何形式的贡献！

### 开发流程
1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 代码规范
- 前端代码遵循 ESLint 规范
- 后端代码遵循 PEP 8 规范
- 提交信息遵循 Conventional Commits 规范

## 📄 许可证

本项目采用 [MIT 许可证](LICENSE) - 详情请查看许可证文件。

## 🙏 致谢

- [React](https://reactjs.org/) - 用于构建用户界面的 JavaScript 库
- [FastAPI](https://fastapi.tiangolo.com/) - 现代、快速的 Python Web 框架
- [智谱AI](https://open.bigmodel.cn/) - 提供 AI 服务支持
- [Ant Design](https://ant.design/) - 企业级 UI 设计语言

## 📞 联系我们

- 📧 Email: [294215988@qq.com](294215988@qq.com)
- 🐛 Issues: [GitHub Issues](https://github.com/Reject-Reality/bettermd/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/Reject-Reality/bettermd/discussions)

---

⭐ 如果这个项目对您有帮助，请考虑给我们一个 Star！