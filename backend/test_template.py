import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.core.template_manager import template_manager

def test_template_system():
    print("Testing template system...")
    
    # 测试列出模板
    templates = template_manager.list_templates()
    print(f"Available templates: {len(templates)}")
    for template in templates:
        print(f"  - {template.name}: {template.title}")
    
    # 测试获取特定模板信息
    default_template = template_manager.get_template_info("default")
    if default_template:
        print(f"\nDefault template info:")
        print(f"  Name: {default_template.name}")
        print(f"  Title: {default_template.title}")
        print(f"  Description: {default_template.description}")
    
    # 测试渲染内容
    test_content = "<h1>Test Document</h1><p>This is a test paragraph.</p>"
    rendered = template_manager.render_template(test_content, "default", "Test Document")
    print(f"\nRendered content length: {len(rendered)} characters")
    print("Template system test completed successfully!")

if __name__ == "__main__":
    test_template_system()