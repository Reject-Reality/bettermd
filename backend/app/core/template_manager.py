import os
import json
from typing import List, Dict, Optional
from jinja2 import Environment, FileSystemLoader
from pydantic import BaseModel

class TemplateInfo(BaseModel):
    name: str
    title: str
    description: str
    author: str
    version: str
    tags: List[str]
    created_at: str

class TemplateManager:
    def __init__(self, templates_dir: str = "app/templates"):
        self.templates_dir = templates_dir
        self.env = Environment(loader=FileSystemLoader(templates_dir))
        
    def get_template_info(self, template_name: str) -> Optional[TemplateInfo]:
        """获取模板信息"""
        template_dir = os.path.join(self.templates_dir, template_name)
        if not os.path.exists(template_dir):
            return None
            
        info_file = os.path.join(template_dir, "template.json")
        if not os.path.exists(info_file):
            return None
            
        try:
            with open(info_file, "r", encoding="utf-8") as f:
                data = json.load(f)
                return TemplateInfo(**data)
        except Exception:
            return None
    
    def list_templates(self) -> List[TemplateInfo]:
        """列出所有可用模板"""
        templates = []
        if not os.path.exists(self.templates_dir):
            return templates
            
        for item in os.listdir(self.templates_dir):
            item_path = os.path.join(self.templates_dir, item)
            if os.path.isdir(item_path):
                template_info = self.get_template_info(item)
                if template_info:
                    templates.append(template_info)
        
        return templates
    
    def render_template(self, content: str, template_name: str = "default", title: str = "Beautified Document") -> str:
        """使用指定模板渲染内容"""
        try:
            # 检查模板是否存在，如果不存在则使用默认模板
            template_dir = os.path.join(self.templates_dir, template_name)
            if not os.path.exists(template_dir):
                template_name = "default"
            
            # 加载布局模板
            layout_file = f"{template_name}/layout.html"
            template = self.env.get_template(layout_file)
            
            # 渲染模板
            return template.render(content=content, title=title)
        except Exception as e:
            # 如果模板渲染失败，返回基本HTML
            return f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>{title}</title>
            </head>
            <body>
                <div class="document-container">
                    {content}
                </div>
            </body>
            </html>
            """
    
    def get_template_names(self) -> List[str]:
        """获取所有模板名称"""
        template_names = []
        if not os.path.exists(self.templates_dir):
            return template_names
            
        for item in os.listdir(self.templates_dir):
            item_path = os.path.join(self.templates_dir, item)
            if os.path.isdir(item_path):
                template_names.append(item)
        
        return template_names

# 全局模板管理器实例
template_manager = TemplateManager()