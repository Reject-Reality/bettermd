# BetterMD 开发计划 - 核心功能完善

## 📋 项目概述

基于对当前BetterMD项目的深入分析，发现核心功能存在严重问题。本开发计划专注于修复和完善基础功能，确保应用能够正常使用。

### 🚨 当前核心问题

1. **Markdown编辑器** - 只能预览，无法正常编辑
2. **模板系统** - 模板无法正确应用
3. **AI功能** - 完全无法使用（缺少API配置）
4. **数据流** - 前后端数据传递不完整

## 🎯 修正后的开发优先级

### Phase 1: 核心编辑器功能修复 (最高优先级)
**目标：让用户能够正常编辑和预览Markdown内容**

#### 1.1 修复Markdown编辑器
**问题分析：**
- 当前存在3个编辑器组件，功能重复且都有缺陷
- SimpleMarkdownEditor缺少真正的Markdown格式化功能
- 内容在前后端之间传递不完整

**修复任务：**
- [ ] 统一编辑器架构，移除冗余组件
- [ ] 为SimpleMarkdownEditor添加基本的Markdown语法高亮
- [ ] 修复内容传递问题，确保上传的文件内容能正确显示在编辑器中
- [ ] 添加基本的Markdown快捷键支持

**技术实现：**
```javascript
// 修复SimpleMarkdownEditor.js
const SimpleMarkdownEditor = ({ initialValue, onChange }) => {
  // 添加基本的markdown格式化功能
  const handleFormat = (format) => {
    // 实现加粗、斜体、标题等基本格式
  };

  return (
    <div className="markdown-editor">
      <Toolbar onFormat={handleFormat} />
      <Editable
        value={safeInitialValue}
        onChange={onChange}
        placeholder="开始编辑Markdown..."
      />
    </div>
  );
};
```

**预期时间：** 2-3天

#### 1.2 修复内容数据流
**问题分析：**
- 后端API返回缺少`markdown_content`字段
- 前端编辑器无法获取到原始Markdown内容进行编辑

**修复任务：**
- [ ] 修改后端API，在`/api/markdown/process`响应中添加`markdown_content`字段
- [ ] 修复前端FileUploader，确保正确传递原始内容
- [ ] 更新Editor页面状态管理，正确处理编辑器内容

**技术实现：**
```python
# 修改 backend/app/api/router.py
@router.post("/process")
async def process_markdown_file(file: UploadFile = File(...), template: str = "default"):
    # 现有处理逻辑...

    # 添加markdown_content字段到响应
    return {
        "filename": file.filename,
        "html_content": processed_html,
        "markdown_content": original_content,  # 新增：返回原始内容
        "template": template
    }
```

**预期时间：** 1-2天

### Phase 2: 模板系统修复 (高优先级)
**目标：让模板系统能够正确应用和切换**

#### 2.1 修复模板应用逻辑
**问题分析：**
- 模板存在但应用逻辑不完整
- 模板切换时不会重新处理内容

**修复任务：**
- [ ] 确保模板实际应用于上传的内容
- [ ] 实现模板切换时的内容重新处理
- [ ] 添加模板预览功能

**技术实现：**
```javascript
// 修复 Editor.js 中的模板切换逻辑
const handleTemplateSelect = async (templateName) => {
  setSelectedTemplate(templateName);

  if (editorContent && filename) {
    // 重新应用新模板
    const response = await axios.post('/api/markdown/process/raw', {
      content: editorContent,
      template: templateName
    });

    setProcessedContent(response.data.html_content);
  }
};
```

**预期时间：** 2-3天

#### 2.2 完善模板管理
**修复任务：**
- [ ] 验证所有模板文件的完整性
- [ ] 添加模板描述和预览图
- [ ] 实现模板的增删改查功能

**预期时间：** 1-2天

### Phase 3: AI功能配置 (中优先级)
**目标：让AI功能能够正常工作**

#### 3.1 配置AI服务
**问题分析：**
- AI服务完全不可用，缺少API密钥配置
- 没有fallback机制

**修复任务：**
- [ ] 配置有效的智谱AI API密钥
- [ ] 添加AI服务状态检查和fallback机制
- [ ] 实现基本的模板推荐逻辑

**技术实现：**
```python
# 配置 backend/.env 文件
ZHIPU_API_KEY=your_actual_api_key_here

# 改进AI服务状态检查
async def is_available(self):
    try:
        # 简单的连通性测试
        return self.api_key is not None and len(self.api_key) > 0
    except:
        return False
```

**预期时间：** 1天（如果获得API密钥）

#### 3.2 AI功能降级方案
**修复任务：**
- [ ] 当AI不可用时，提供基础的模板推荐
- [ ] 添加AI功能的用户提示
- [ ] 实现简单的内容美化规则

**预期时间：** 2天

### Phase 4: 用户体验改进 (中优先级)
**目标：提升用户使用体验**

#### 4.1 添加状态反馈
**修复任务：**
- [ ] 添加加载状态指示器
- [ ] 完善错误提示信息
- [ ] 添加操作成功确认

**技术实现：**
```javascript
// 添加状态管理
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

const handleUpload = async (file) => {
  setLoading(true);
  setError(null);
  try {
    const result = await uploadFile(file);
    // 处理成功
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

**预期时间：** 1-2天

#### 4.2 界面优化
**修复任务：**
- [ ] 简化编辑器界面
- [ ] 优化移动端显示
- [ ] 添加快捷键提示

**预期时间：** 2天

## 📅 详细时间安排

### 第1周：核心编辑器修复
- **第1-2天**：修复Markdown编辑器基础功能
- **第3天**：修复内容数据流问题
- **第4-5天**：测试和调试编辑器功能

### 第2周：模板系统修复
- **第1-2天**：修复模板应用逻辑
- **第3天**：完善模板管理功能
- **第4-5天**：测试模板系统

### 第3周：AI功能配置
- **第1天**：配置AI服务和API密钥
- **第2-3天**：实现AI功能降级方案
- **第4-5天**：测试AI功能

### 第4周：用户体验改进
- **第1-2天**：添加状态反馈
- **第3-4天**：界面优化
- **第5天**：整体测试和文档更新

## 🎯 成功标准

### 必须实现的核心功能
- [ ] 用户能够正常编辑Markdown内容
- [ ] 文件上传后内容能正确显示在编辑器中
- [ ] 模板能够正确应用和切换
- [ ] AI功能至少部分可用或有合理的fallback

### 质量标准
- [ ] 无JavaScript控制台错误
- [ ] 所有按钮和功能都能正常响应
- [ ] 错误处理友好，不会出现白屏或崩溃
- [ ] 响应时间在可接受范围内（<3秒）

### 用户体验标准
- [ ] 操作流程直观清晰
- [ ] 有适当的加载和错误状态提示
- [ ] 支持基本的Markdown语法高亮
- [ ] 编辑器响应流畅

## 🚧 风险和挑战

### 技术风险
1. **Slate.js复杂性** - 当前编辑器基于Slate.js，修复可能需要深入理解其工作原理
2. **模板系统** - 模板渲染逻辑可能存在隐藏的问题
3. **AI服务依赖** - 依赖于外部AI服务，可能存在稳定性问题

### 缓解策略
1. **简化编辑器** - 如果Slate.js修复太复杂，考虑替换为更简单的markdown编辑器
2. **逐步修复** - 一次修复一个问题，避免引入新的bug
3. **本地测试** - 充分在本地环境测试后再部署

## 📝 交付物清单

### 代码交付
- [ ] 修复的Markdown编辑器组件
- [ ] 完整的模板系统
- [ ] 可用的AI功能（或fallback）
- [ ] 改进的用户界面

### 文档交付
- [ ] 更新的API文档
- [ ] 用户使用手册
- [ ] 开发者文档
- [ ] 部署指南

## 🔄 开发流程

### 日常工作流程
1. **每日站会** - 15分钟同步进度
2. **代码审查** - 所有代码需要经过审查
3. **测试驱动** - 先写测试，再实现功能
4. **持续集成** - 每次提交都要通过CI/CD

### 质量保证
1. **单元测试** - 核心功能必须有单元测试
2. **集成测试** - 确保前后端集成正常
3. **用户测试** - 邀请用户进行实际使用测试
4. **性能测试** - 确保响应时间在可接受范围内

## 📊 进度跟踪

### 每周目标
- **第1周结束**：Markdown编辑器能够正常使用
- **第2周结束**：模板系统完全可用
- **第3周结束**：AI功能基本可用
- **第4周结束**：所有功能完善，准备发布

### 关键里程碑
- **Week 1.5**：编辑器功能里程碑
- **Week 2.5**：模板系统里程碑
- **Week 3.5**：AI功能里程碑
- **Week 4**：项目完成里程碑

---

**注意事项：**
1. 本计划专注于核心功能修复，不涉及高级功能如数据库、认证系统等
2. 如果在修复过程中发现更复杂的问题，需要及时调整计划
3. 优先确保基础功能稳定可用，再考虑性能优化和功能增强
4. 所有修改都需要保持向后兼容性