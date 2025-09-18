# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Frontend (React)
```bash
cd frontend
npm install           # Install dependencies
npm start             # Start development server (port 3000)
npm run build         # Create production build
npm test              # Run tests
```

### Backend (Python/FastAPI)
```bash
cd backend
python -m venv venv   # Create virtual environment
venv\Scripts\activate # Activate on Windows
source venv/bin/activate  # Activate on Linux/Mac
pip install -r requirements.txt  # Install dependencies
uvicorn app.main:app --reload  # Start development server (port 8000)
```

### Docker Development
```bash
docker-compose up --build  # Start both frontend and backend
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

## Architecture Overview

BetterMD is a Markdown beautifier application with:
- **Frontend**: React SPA with Ant Design UI, Slate.js editor, and plugin system
- **Backend**: FastAPI server with AI integration, template management, and Markdown processing
- **Architecture**: Full-stack application with real-time preview and AI-powered enhancements

### Core Features
1. **Markdown Processing**: File upload, real-time preview, template application
2. **Advanced Editor**: Obsidian-style features with syntax highlighting, LaTeX support, and knowledge graph
3. **AI Integration**: Smart template recommendations and content optimization
4. **Plugin System**: Extensible architecture for additional features

### Project Structure
```
bettermd/
├── frontend/           # React SPA with editor components
│   ├── src/
│   │   ├── components/  # React components (MarkdownEditor, Preview, etc.)
│   │   ├── pages/       # Page components (Home, Editor)
│   │   └── api/         # Backend API client
├── backend/            # FastAPI backend
│   ├── app/
│   │   ├── main.py      # FastAPI application entry point
│   │   ├── api/         # API routes
│   │   ├── core/        # Business logic (AI service, templates)
│   │   └── utils/       # Utilities (Markdown processing)
│   ├── tests/           # Backend tests
│   └── requirements.txt
└── docker-compose.yml   # Multi-container orchestration
```

### Key API Endpoints
- `POST /api/markdown/process` - Process uploaded .md files
- `POST /api/markdown/process/raw` - Process raw markdown content
- `GET /api/templates` - List available templates
- `POST /api/ai/template-recommend` - Get AI template recommendations
- `POST /api/ai/content-suggestions` - Get content optimization suggestions

### Template System
Templates are structured with:
- `template.json` - Metadata and configuration
- `style.css` - Styling rules
- `layout.html` - HTML layout template
- `preview.png` - Template preview image

### AI Integration
Uses OpenAI API for:
- Smart template recommendations based on content analysis
- Content optimization and language improvement suggestions
- Automatic document beautification

### Plugin Architecture
Frontend supports extensible plugins for:
- Code highlighting (Prism.js)
- Math formulas (LaTeX support)
- Task lists and bidirectional linking
- Knowledge graph visualization (vis.js)

## Environment Setup
- Backend requires OpenAI API key in `.env` file
- Frontend uses environment variable `REACT_APP_API_BASE_URL`
- CORS configured for cross-origin requests
- HTTPS recommended for production