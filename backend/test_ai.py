import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.core.ai_service import ai_service

def test_ai_service():
    """测试AI服务"""
    print("Testing AI service...")
    
    # 检查AI服务是否可用
    if not ai_service.is_available():
        print("AI service is not available. Please check your API key.")
        return
    
    print("AI service is available!")
    
    # 获取模型列表
    models = ai_service.get_openai_models()
    print(f"Available models: {models[:5]}...")  # 只显示前5个模型
    
    # 测试聊天完成
    messages = [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Hello, how are you?"}
    ]
    
    response = ai_service.chat_completion(messages, model="gpt-3.5-turbo", temperature=0.7)
    if response:
        print(f"Chat completion response: {response[:100]}...")
    else:
        print("Failed to get chat completion response")

if __name__ == "__main__":
    test_ai_service()