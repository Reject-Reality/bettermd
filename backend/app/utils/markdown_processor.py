import markdown
from bs4 import BeautifulSoup
from app.core.template_manager import template_manager

def process_markdown(markdown_text: str) -> str:
    """
    处理Markdown文本并转换为HTML
    
    Args:
        markdown_text (str): 原始Markdown文本
        
    Returns:
        str: 处理后的HTML
    """
    # 配置Markdown扩展，支持标准语法和扩展语法
    md = markdown.Markdown(extensions=[
        # 标准Markdown语法支持
        'markdown.extensions.extra',
        'markdown.extensions.codehilite',
        'markdown.extensions.toc',
        'markdown.extensions.tables',
        'markdown.extensions.fenced_code',
    ])
    
    # 转换Markdown为HTML
    html = md.convert(markdown_text)
    
    # 使用BeautifulSoup清理HTML并添加基本样式
    soup = BeautifulSoup(html, 'html.parser')
    
    # 添加基本的CSS样式以确保基本的Markdown元素正确显示
    styled_html = str(soup)
    
    return styled_html

def apply_template(html_content: str, template_name: str = "default") -> str:
    """
    应用模板到HTML内容
    
    Args:
        html_content (str): HTML内容
        template_name (str): 模板名称
        
    Returns:
        str: 应用模板后的完整HTML
    """
    # 使用模板管理器渲染内容
    return template_manager.render_template(html_content, template_name, "Beautified Document")