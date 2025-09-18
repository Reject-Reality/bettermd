import sys
import os
import importlib.util

# 添加项目路径到Python路径
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.utils.markdown_processor import process_markdown, apply_template

# 测试Markdown内容
test_markdown = """
# 测试文档

这是一个用于测试Markdown处理功能的文档。

## 标题测试

### H3 标题

#### H4 标题

##### H5 标题

###### H6 标题

## 文本样式

这是**粗体**文本。

这是*斜体*文本。

这是~~删除线~~文本。

这是`行内代码`。

## 列表测试

无序列表：
- 项目 1
- 项目 2
  - 子项目 2.1
  - 子项目 2.2

有序列表：
1. 第一项
2. 第二项
   1. 子项 2.1
   2. 子项 2.2

## 代码块测试

```python
def hello_world():
    print("Hello, BetterMD!")
```

## 表格测试

| 姓名 | 年龄 | 职业 |
|------|------|------|
| 张三 | 25   | 工程师 |
| 李四 | 30   | 设计师 |

## 链接测试

这是一个[链接](https://www.example.com)。

## 引用测试

> 这是一个引用块。
> 包含多行内容。

## 水平线测试

---
"""

def test_markdown_processing():
    try:
        # 处理Markdown
        html_result = process_markdown(test_markdown)
        print("Markdown处理成功!")
        print("HTML结果:")
        print("=" * 50)
        print(html_result)
        print("=" * 50)
        
        # 应用模板
        templated_result = apply_template(html_result, "default")
        print("\n应用模板后的完整HTML:")
        print("=" * 50)
        print(templated_result)
        print("=" * 50)
        
        return True
    except Exception as e:
        print(f"处理Markdown时出错: {e}")
        return False

if __name__ == "__main__":
    test_markdown_processing()