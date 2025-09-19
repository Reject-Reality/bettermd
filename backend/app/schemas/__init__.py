from pydantic import BaseModel
from typing import Optional, List

class MarkdownProcessRequest(BaseModel):
    content: str
    template: Optional[str] = "default"

class MarkdownProcessResponse(BaseModel):
    filename: str
    html_content: str
    markdown_content: str
    template: Optional[str] = None

class TemplateInfo(BaseModel):
    name: str
    title: str
    description: str
    author: str
    version: str
    tags: List[str]
    created_at: str

# AI相关模型
class TemplateRecommendation(BaseModel):
    template: str
    reason: str

class AITemplateRecommendationRequest(BaseModel):
    content: str

class AITemplateRecommendationResponse(BaseModel):
    recommendations: List[TemplateRecommendation]

class AIContentSuggestionRequest(BaseModel):
    content: str

class AIContentSuggestionResponse(BaseModel):
    suggestions: str

class AIBeautifyRequest(BaseModel):
    content: str
    template: Optional[str] = "default"

class AIBeautifyResponse(BaseModel):
    beautified_content: str