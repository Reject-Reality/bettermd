import os
import json
import requests
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv
import logging

# 加载环境变量
load_dotenv()

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AIService:
    """AI服务抽象层，支持多种AI提供商"""

    def __init__(self):
        """初始化AI服务"""
        # 阿里云百炼配置
        self.aliyun_api_key = os.getenv("ALIYUN_API_KEY")
        self.aliyun_base_url = "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation"

        # 智谱AI配置（保留作为备用）
        self.zhipu_api_key = os.getenv("ZHIPU_API_KEY")
        self.zhipu_base_url = "https://open.bigmodel.cn/api/paas/v4"

        # 初始化阿里云百炼客户端
        if self.aliyun_api_key:
            self.aliyun_headers = {
                "Authorization": f"Bearer {self.aliyun_api_key}",
                "Content-Type": "application/json"
            }
            self.model = "qwen-plus"  # 使用Qwen模型
            self.provider = "aliyun"
        elif self.zhipu_api_key:
            self.zhipu_headers = {
                "Authorization": f"Bearer {self.zhipu_api_key}",
                "Content-Type": "application/json"
            }
            self.model = "glm-4-0520"  # 使用GLM-4模型
            self.provider = "zhipu"
        else:
            self.aliyun_headers = None
            self.zhipu_headers = None
            self.model = None
            self.provider = None
            logger.warning("No AI API key found. AI features will be disabled.")

    def is_available(self) -> bool:
        """检查AI服务是否可用"""
        return self.aliyun_headers is not None or self.zhipu_headers is not None

    def get_available_models(self) -> List[str]:
        """获取可用的模型列表"""
        if not self.is_available():
            return []

        if self.provider == "aliyun":
            return ["qwen-plus", "qwen-turbo", "qwen-max", "qwen-max-longcontext", "qwen-7b-chat", "qwen-14b-chat"]
        elif self.provider == "zhipu":
            return ["glm-4-0520", "glm-4", "glm-4-air", "glm-4-airx", "glm-3-turbo"]
        return []
    
    def chat_completion(self, messages: List[Dict[str, str]], model: str = None,
                       temperature: float = 0.7, max_tokens: Optional[int] = None) -> Optional[str]:
        """使用AI服务进行聊天完成任务

        Args:
            messages: 消息列表，格式为[{"role": "user", "content": "内容"}]
            model: 使用的模型，默认使用self.model
            temperature: 温度参数，控制随机性
            max_tokens: 最大令牌数

        Returns:
            AI生成的文本内容，如果出错则返回None
        """
        if not self.is_available():
            logger.warning("AI service is not available")
            return None

        if model is None:
            model = self.model

        try:
            if self.provider == "aliyun":
                # 阿里云百炼API调用
                payload = {
                    "model": model,
                    "input": {
                        "messages": messages
                    },
                    "parameters": {
                        "temperature": temperature
                    }
                }

                if max_tokens:
                    payload["parameters"]["max_tokens"] = max_tokens

                response = requests.post(
                    self.aliyun_base_url,
                    headers=self.aliyun_headers,
                    json=payload,
                    timeout=60
                )

                if response.status_code == 200:
                    result = response.json()
                    return result.get("output", {}).get("choices", [{}])[0].get("message", {}).get("content")
                else:
                    logger.error(f"Alibaba Cloud API request failed with status {response.status_code}: {response.text}")
                    return None

            elif self.provider == "zhipu":
                # 智谱AI API调用
                payload = {
                    "model": model,
                    "messages": messages,
                    "temperature": temperature,
                }

                if max_tokens:
                    payload["max_tokens"] = max_tokens

                response = requests.post(
                    f"{self.zhipu_base_url}/chat/completions",
                    headers=self.zhipu_headers,
                    json=payload,
                    timeout=60
                )

                if response.status_code == 200:
                    result = response.json()
                    return result.get("choices", [{}])[0].get("message", {}).get("content")
                else:
                    logger.error(f"Zhipu API request failed with status {response.status_code}: {response.text}")
                    return None

        except Exception as e:
            logger.error(f"Error in chat completion: {e}")
            return None
    
    def generate_template_recommendations(self, content: str, template_names: List[str]) -> Optional[List[Dict[str, Any]]]:
        """生成模板推荐
        
        Args:
            content: Markdown内容
            template_names: 可用模板名称列表
            
        Returns:
            推荐结果列表，每个元素包含模板名称和推荐理由
        """
        if not self.is_available():
            return None
        
        # 准备模板信息
        template_info = {}
        for name in template_names:
            template_info[name] = f"{name} template"
        
        prompt = f"""
        你是一个专业的文档美化助手。请根据以下Markdown文档内容，从提供的模板列表中推荐最合适的3个模板。
        
        文档内容：
        {content[:2000]}  # 限制内容长度以避免超出token限制
        
        可用模板列表：
        {json.dumps(template_info, ensure_ascii=False, indent=2)}
        
        请分析文档的主题、内容类型和风格，然后推荐最适合的3个模板，并为每个推荐提供简短的理由。
        按推荐优先级排序，最推荐的模板排在前面。
        
        请严格按照以下JSON格式返回结果：
        [
            {{
                "template": "模板名称",
                "reason": "推荐理由"
            }},
            ...
        ]
        
        只返回JSON数组，不要添加其他解释文字。
        """
        
        messages = [
            {"role": "system", "content": "你是一个专业的文档美化助手，擅长根据文档内容推荐合适的模板。请严格按照要求的JSON格式返回结果。"},
            {"role": "user", "content": prompt}
        ]
        
        response = self.chat_completion(messages, model=self.model, temperature=0.3)
        if response:
            try:
                # 尝试解析JSON响应
                recommendations = json.loads(response)
                return recommendations
            except json.JSONDecodeError as e:
                logger.error(f"Error parsing template recommendations JSON: {e}")
                logger.error(f"Response content: {response}")
                # 返回原始响应作为备选
                return [{"template": "default", "reason": "AI service response parsing failed"}]
        return None
    
    def generate_content_suggestions(self, content: str) -> Optional[str]:
        """生成内容优化建议
        
        Args:
            content: Markdown内容
            
        Returns:
            优化建议文本
        """
        if not self.is_available():
            return None
        
        prompt = f"""
        你是一个专业的文档编辑助手。请分析以下Markdown文档内容，提供优化建议：
        
        文档内容：
        {content[:2000]}  # 限制内容长度以避免超出token限制
        
        请从以下几个方面提供具体建议：
        1. 文档结构优化（标题层次、段落组织等）
        2. 语言表达改进（清晰度、准确性、流畅性等）
        3. 内容完整性（是否有遗漏的重要信息）
        4. 其他改进建议
        
        请提供具体、可操作的建议，并保持建议的简洁性。
        """
        
        messages = [
            {"role": "system", "content": "你是一个专业的文档编辑助手，擅长提供文档优化建议。"},
            {"role": "user", "content": prompt}
        ]
        
        return self.chat_completion(messages, model=self.model, temperature=0.5)
    
    def auto_beautify_content(self, content: str, target_template: str = "default") -> Optional[str]:
        """自动美化内容
        
        Args:
            content: Markdown内容
            target_template: 目标模板
            
        Returns:
            美化后的内容
        """
        if not self.is_available():
            return None
        
        prompt = f"""
        你是一个专业的文档美化助手。请对以下Markdown文档进行优化和美化，使其更适合"{target_template}"模板：
        
        原始文档内容：
        {content[:2000]}  # 限制内容长度以避免超出token限制
        
        请进行以下操作：
        1. 优化文档结构（调整标题层次、段落组织等）
        2. 改进语言表达（提升清晰度、准确性、流畅性）
        3. 添加适当的格式化元素（如列表、代码块、引用等）
        4. 确保内容符合"{target_template}"模板的风格
        
        请直接返回优化后的Markdown内容，不要添加任何解释说明。
        """
        
        messages = [
            {"role": "system", "content": "你是一个专业的文档美化助手，擅长优化和美化Markdown文档。"},
            {"role": "user", "content": prompt}
        ]
        
        return self.chat_completion(messages, model=self.model, temperature=0.4)

# 全局AI服务实例
ai_service = AIService()