import requests
import json

# 测试API端点
BASE_URL = "http://localhost:8000/api"

def test_api_endpoints():
    print("Testing API endpoints...")
    
    # 测试获取模板列表
    try:
        response = requests.get(f"{BASE_URL}/templates")
        print(f"GET /templates: {response.status_code}")
        if response.status_code == 200:
            templates = response.json()
            print(f"  Available templates: {templates}")
    except Exception as e:
        print(f"Error testing /templates: {e}")
    
    # 测试获取模板详细信息
    try:
        response = requests.get(f"{BASE_URL}/templates/info")
        print(f"GET /templates/info: {response.status_code}")
        if response.status_code == 200:
            templates_info = response.json()
            print(f"  Templates info count: {len(templates_info)}")
            if templates_info:
                print(f"  First template: {templates_info[0]['name']} - {templates_info[0]['title']}")
    except Exception as e:
        print(f"Error testing /templates/info: {e}")
    
    # 测试处理Markdown内容
    try:
        test_markdown = "# Test Document\n\nThis is a **test** paragraph with *italic* text."
        response = requests.post(f"{BASE_URL}/markdown/process/raw", 
                                json={"content": test_markdown, "template": "default"})
        print(f"POST /markdown/process/raw: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"  Processed content length: {len(result['html_content'])} characters")
    except Exception as e:
        print(f"Error testing markdown processing: {e}")

if __name__ == "__main__":
    test_api_endpoints()