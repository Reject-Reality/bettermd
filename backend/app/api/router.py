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

@router.post("/markdown/process", response_model=MarkdownProcessResponse)
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
        
        return MarkdownProcessResponse(
            filename=file.filename,
            html_content=final_html,
            template=template
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

@router.post("/markdown/process/raw", response_model=MarkdownProcessResponse)
async def process_markdown_raw(request: MarkdownProcessRequest):
    try:
        processed_html = process_markdown(request.content)
        final_html = apply_template(processed_html, request.template)
        
        return MarkdownProcessResponse(
            filename="raw_content.md",
            html_content=final_html,
            template=request.template
        )
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
    # 返回模板预览
    html_content = f"""<h1>Template Preview</h1><p>This is a preview of the <strong>{template_name}</strong> template.</p><h2>Sample Content</h2><p>This is a sample paragraph to demonstrate the template styling.</p><h3>Code Example</h3><pre><code>function hello() {{
  console.log('Hello, world!');
}}</code></pre>"""
    return apply_template(html_content, template_name)

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