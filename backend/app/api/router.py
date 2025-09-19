from fastapi import APIRouter, UploadFile, File, HTTPException, Query
from fastapi.responses import HTMLResponse
from typing import List, Optional
import os
from app.utils.markdown_processor import process_markdown, apply_template
from app.schemas import (
    MarkdownProcessRequest, 
    MarkdownProcessResponse, 
    TemplateInfo,
    AITemplateRecommendationRequest,
    AITemplateRecommendationResponse,
    AIContentSuggestionRequest,
    AIContentSuggestionResponse,
    AIBeautifyRequest,
    AIBeautifyResponse
)
from app.core.template_manager import template_manager
from app.core.ai_service import ai_service

router = APIRouter()

@router.get("/")
async def root():
    return {"message": "BetterMD API"}

@router.post("/markdown/process")
async def process_markdown_file(
    file: UploadFile = File(...),
    template: Optional[str] = Query("default", description="Template to apply to the processed Markdown")
):
    if not file.filename.endswith('.md'):
        raise HTTPException(status_code=400, detail="Only .md files are allowed")

    try:
        content = await file.read()
        markdown_text = content.decode('utf-8')
        processed_html = process_markdown(markdown_text)

        # 应用模板
        final_html = apply_template(processed_html, template)

        response_data = {
            "filename": file.filename,
            "html_content": final_html,
            "markdown_content": markdown_text,
            "template": template
        }
        print(f"返回数据: {list(response_data.keys())}")
        return response_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

@router.post("/markdown/process/raw")
async def process_markdown_raw(request: MarkdownProcessRequest):
    try:
        processed_html = process_markdown(request.content)
        final_html = apply_template(processed_html, request.template)
        
        return {
            "filename": "raw_content.md",
            "html_content": final_html,
            "markdown_content": request.content,
            "template": request.template
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing content: {str(e)}")

@router.get("/templates", response_model=List[str])
async def list_templates():
    # 返回可用模板的列表
    return template_manager.get_template_names()

@router.get("/templates/info", response_model=List[TemplateInfo])
async def list_templates_info():
    # 返回模板详细信息列表
    return template_manager.list_templates()

@router.get("/templates/{template_name}", response_class=HTMLResponse)
async def get_template_preview(template_name: str):
    """获取模板预览"""
    try:
        template_info = template_manager.get_template_info(template_name)
        if not template_info:
            raise HTTPException(status_code=404, detail="Template not found")

        # 生成预览内容
        preview_content = """# 示例文档标题

## 这是一个二级标题

这是一个段落的示例文本。这里有一些普通的文字内容，用于展示模板的样式效果。

### 这是一个三级标题

#### 特性展示：

- **粗体文本**示例
- *斜体文本*示例
- `行内代码`示例
- [链接示例](https://example.com)

```python
# 代码块示例
def hello_world():
    print("Hello, World!")
    return True
```

> 这是一个引用块的示例文本。引用通常用于显示重要的信息或者引用他人的话。

## 表格示例

| 功能 | 状态 | 描述 |
|------|------|------|
| 编辑 | ✅ | 支持Markdown编辑 |
| 预览 | ✅ | 实时预览功能 |
| 导出 | ✅ | 支持多种格式导出 |

## 任务列表

- [x] 完成模板设计
- [x] 实现预览功能
- [ ] 添加更多模板
- [ ] 优化用户体验
"""

        # 使用模板渲染预览内容
        preview_html = template_manager.render_template(preview_content, template_name, "模板预览")

        return preview_html
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
async def health_check():
    return {"status": "healthy"}

# AI相关API端点
@router.get("/ai/status")
async def ai_status():
    """检查AI服务状态"""
    return {
        "available": ai_service.is_available(),
        "models": ai_service.get_available_models() if ai_service.is_available() else []
    }

@router.post("/ai/template-recommend", response_model=AITemplateRecommendationResponse)
async def ai_template_recommend(request: AITemplateRecommendationRequest):
    """AI智能模板推荐"""
    if not ai_service.is_available():
        raise HTTPException(status_code=503, detail="AI service is not available")
    
    template_names = template_manager.get_template_names()
    recommendations = ai_service.generate_template_recommendations(request.content, template_names)
    
    if recommendations is None:
        raise HTTPException(status_code=500, detail="Failed to generate recommendations")
    
    # 确保返回的数据格式正确
    formatted_recommendations = []
    for rec in recommendations[:3]:  # 限制最多返回3个推荐
        if isinstance(rec, dict) and "template" in rec and "reason" in rec:
            formatted_recommendations.append({
                "template": rec["template"],
                "reason": rec["reason"]
            })
        else:
            # 如果格式不正确，使用默认值
            formatted_recommendations.append({
                "template": "default",
                "reason": "AI recommendation format not recognized"
            })
    
    return AITemplateRecommendationResponse(recommendations=formatted_recommendations)

@router.post("/ai/content-suggestions", response_model=AIContentSuggestionResponse)
async def ai_content_suggestions(request: AIContentSuggestionRequest):
    """AI内容优化建议"""
    if not ai_service.is_available():
        raise HTTPException(status_code=503, detail="AI service is not available")
    
    suggestions = ai_service.generate_content_suggestions(request.content)
    
    if suggestions is None:
        raise HTTPException(status_code=500, detail="Failed to generate suggestions")
    
    return AIContentSuggestionResponse(suggestions=suggestions)

@router.post("/ai/beautify", response_model=AIBeautifyResponse)
async def ai_beautify(request: AIBeautifyRequest):
    """AI自动美化"""
    if not ai_service.is_available():
        raise HTTPException(status_code=503, detail="AI service is not available")
    
    beautified_content = ai_service.auto_beautify_content(request.content, request.template)
    
    if beautified_content is None:
        raise HTTPException(status_code=500, detail="Failed to beautify content")
    
    return AIBeautifyResponse(beautified_content=beautified_content)