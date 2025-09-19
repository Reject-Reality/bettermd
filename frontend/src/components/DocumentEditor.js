import React, { useMemo, useCallback, useState } from 'react';
import { createEditor, Editor, Transforms, Text } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import { Card, Button, Space, Tabs, message } from 'antd';
import {
  BoldOutlined,
  ItalicOutlined,
  CodeOutlined,
  EyeOutlined,
  EditOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { TabPane } = Tabs;

const DocumentEditor = ({
  initialContent = '',
  initialTemplate = 'default',
  filename = '',
  onContentChange,
  onTemplateChange
}) => {
  const [currentTemplate, setCurrentTemplate] = useState(initialTemplate);
  const [editMode, setEditMode] = useState('edit'); // 'edit' or 'preview'
  const [markdownContent, setMarkdownContent] = useState(initialContent);
  const [htmlPreview, setHtmlPreview] = useState('');
  const [loading, setLoading] = useState(false);

  // 创建编辑器实例
  const editor = useMemo(() => {
    const baseEditor = createEditor();
    const withReactEditor = withReact(baseEditor);
    const withHistoryEditor = withHistory(withReactEditor);
    return withHistoryEditor;
  }, []);

  // 将Markdown转换为Slate格式
  const markdownToSlate = useCallback((markdown) => {
    if (!markdown || typeof markdown !== 'string' || markdown.trim() === '') {
      return [{ type: 'paragraph', children: [{ text: '开始编辑...' }] }];
    }

    const lines = markdown.split('\n');
    const slateNodes = lines.map(line => {
      let type = 'paragraph';
      let text = line;

      // 检测标题
      if (line.startsWith('# ')) {
        type = 'heading-one';
        text = line.substring(2);
      } else if (line.startsWith('## ')) {
        type = 'heading-two';
        text = line.substring(3);
      } else if (line.startsWith('### ')) {
        type = 'heading-three';
        text = line.substring(4);
      } else if (line.startsWith('**') && line.endsWith('**')) {
        type = 'paragraph';
        text = line;
      } else if (line.startsWith('* ') || line.startsWith('- ')) {
        type = 'list-item';
        text = line.substring(2);
      }

      return { type, children: [{ text }] };
    });

    return slateNodes;
  }, []);

  // 将Slate格式转换为Markdown
  const slateToMarkdown = useCallback((value) => {
    return value.map(node => {
      if (node.type === 'heading-one') {
        return `# ${node.children[0].text}`;
      } else if (node.type === 'heading-two') {
        return `## ${node.children[0].text}`;
      } else if (node.type === 'heading-three') {
        return `### ${node.children[0].text}`;
      } else if (node.type === 'code-block') {
        return `\`\`\`\n${node.children[0].text}\n\`\`\``;
      } else if (node.type === 'list-item') {
        return `- ${node.children[0].text}`;
      } else if (node.type === 'block-quote') {
        return `> ${node.children[0].text}`;
      } else {
        return node.children[0].text;
      }
    }).join('\n');
  }, []);

  // 确保初始值是有效的 Slate 格式
  const safeInitialValue = useMemo(() => {
    return markdownToSlate(markdownContent);
  }, [markdownContent, markdownToSlate]);

  // 渲染元素
  const renderElement = useCallback(props => {
    const { attributes, children, element } = props;

    switch (element.type) {
      case 'heading-one':
        return <h1 {...attributes}>{children}</h1>;
      case 'heading-two':
        return <h2 {...attributes}>{children}</h2>;
      case 'heading-three':
        return <h3 {...attributes}>{children}</h3>;
      case 'block-quote':
        return <blockquote {...attributes}>{children}</blockquote>;
      case 'bulleted-list':
        return <ul {...attributes}>{children}</ul>;
      case 'numbered-list':
        return <ol {...attributes}>{children}</ol>;
      case 'list-item':
        return <li {...attributes}>{children}</li>;
      case 'code-block':
        return (
          <pre {...attributes} style={{
            background: '#f5f5f5',
            padding: '10px',
            borderRadius: '4px',
            overflowX: 'auto'
          }}>
            <code>{children}</code>
          </pre>
        );
      default:
        return <p {...attributes}>{children}</p>;
    }
  }, []);

  // 渲染叶子节点
  const renderLeaf = useCallback(({ attributes, children, leaf }) => {
    if (leaf.bold) {
      children = <strong>{children}</strong>;
    }
    if (leaf.italic) {
      children = <em>{children}</em>;
    }
    if (leaf.underline) {
      children = <u>{children}</u>;
    }
    if (leaf.code) {
      children = <code style={{
        background: '#f5f5f5',
        padding: '2px 4px',
        borderRadius: '2px',
        fontFamily: 'monospace'
      }}>{children}</code>;
    }
    return <span {...attributes}>{children}</span>;
  }, []);

  // 键盘快捷键处理
  const onKeyDown = useCallback(
    event => {
      // 加粗 (Ctrl+B)
      if (event.ctrlKey && event.key === 'b') {
        event.preventDefault();
        editor.toggleFormat('bold');
        return;
      }

      // 斜体 (Ctrl+I)
      if (event.ctrlKey && event.key === 'i') {
        event.preventDefault();
        editor.toggleFormat('italic');
        return;
      }

      // 代码 (Ctrl+`)
      if (event.ctrlKey && event.key === '`') {
        event.preventDefault();
        editor.toggleFormat('code');
        return;
      }

      // 标题快捷键
      if (event.ctrlKey && event.key === '1') {
        event.preventDefault();
        editor.toggleBlock('heading-one');
        return;
      }

      if (event.ctrlKey && event.key === '2') {
        event.preventDefault();
        editor.toggleBlock('heading-two');
        return;
      }

      if (event.ctrlKey && event.key === '3') {
        event.preventDefault();
        editor.toggleBlock('heading-three');
        return;
      }
    },
    [editor]
  );

  // 扩展编辑器功能
  useMemo(() => {
    editor.toggleFormat = format => {
      const isActive = isFormatActive(editor, format);
      Transforms.setNodes(
        editor,
        { [format]: isActive ? null : true },
        { match: Text.isText, split: true }
      );
    };

    editor.toggleBlock = type => {
      const isActive = isBlockActive(editor, type);
      Transforms.setNodes(
        editor,
        { type: isActive ? 'paragraph' : type },
        { match: n => Editor.isBlock(editor, n) }
      );
    };
  }, [editor]);

  // 工具栏按钮点击处理
  const handleFormatClick = (format) => {
    editor.toggleFormat(format);
  };

  const handleBlockClick = (type) => {
    editor.toggleBlock(type);
  };

  // 处理内容变化
  const handleContentChange = (value) => {
    if (value && Array.isArray(value)) {
      const newMarkdownContent = slateToMarkdown(value);
      setMarkdownContent(newMarkdownContent);

      // 通知父组件内容变化
      if (onContentChange) {
        onContentChange(newMarkdownContent);
      }

      // 如果是编辑模式，更新预览
      if (editMode === 'edit') {
        updatePreview(newMarkdownContent);
      }
    }
  };

  // 应用模板
  const applyTemplate = async (templateName) => {
    if (!markdownContent.trim()) {
      message.warning('请先输入内容再应用模板');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/markdown/process/raw', {
        content: markdownContent,
        template: templateName
      });

      setHtmlPreview(response.data.html_content);
      setCurrentTemplate(templateName);

      if (onTemplateChange) {
        onTemplateChange(templateName);
      }

      message.success(`已应用模板: ${templateName}`);
    } catch (error) {
      message.error('应用模板失败: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  // 更新预览
  const updatePreview = async (content) => {
    if (!content.trim()) {
      setHtmlPreview('');
      return;
    }

    try {
      const response = await axios.post('/api/markdown/process/raw', {
        content: content,
        template: currentTemplate
      });
      setHtmlPreview(response.data.html_content);
    } catch (error) {
      console.error('更新预览失败:', error);
    }
  };

  // 切换编辑/预览模式
  const handleModeChange = (key) => {
    setEditMode(key);
    if (key === 'preview' && markdownContent.trim()) {
      updatePreview(markdownContent);
    }
  };

  // 刷新预览
  const refreshPreview = () => {
    if (markdownContent.trim()) {
      updatePreview(markdownContent);
      message.success('预览已更新');
    }
  };

  if (!editor || !safeInitialValue) {
    return (
      <Card title="文档编辑器">
        <div style={{ padding: '50px', textAlign: 'center' }}>
          <p>编辑器初始化中...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card
      title={`文档编辑器 - ${filename || '未命名文档'}`}
      extra={
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            type={editMode === 'edit' ? 'primary' : 'default'}
            onClick={() => handleModeChange('edit')}
          >
            编辑
          </Button>
          <Button
            size="small"
            icon={<EyeOutlined />}
            type={editMode === 'preview' ? 'primary' : 'default'}
            onClick={() => handleModeChange('preview')}
          >
            预览
          </Button>
          {editMode === 'preview' && (
            <Button
              size="small"
              icon={<ReloadOutlined />}
              onClick={refreshPreview}
              loading={loading}
            >
              刷新
            </Button>
          )}
        </Space>
      }
    >
      {/* 模板选择和应用 */}
      <div style={{ marginBottom: 16 }}>
        <Space>
          <span>当前模板: {currentTemplate}</span>
          <Button size="small" onClick={() => applyTemplate('default')}>默认模板</Button>
          <Button size="small" onClick={() => applyTemplate('academic')}>学术模板</Button>
          <Button size="small" onClick={() => applyTemplate('business')}>商务模板</Button>
          <Button size="small" onClick={() => applyTemplate('technical')}>技术模板</Button>
        </Space>
      </div>

      {/* 编辑器工具栏 */}
      {editMode === 'edit' && (
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Button
              size="small"
              icon={<BoldOutlined />}
              onClick={() => handleFormatClick('bold')}
              title="加粗 (Ctrl+B)"
            />
            <Button
              size="small"
              icon={<ItalicOutlined />}
              onClick={() => handleFormatClick('italic')}
              title="斜体 (Ctrl+I)"
            />
            <Button
              size="small"
              icon={<CodeOutlined />}
              onClick={() => handleFormatClick('code')}
              title="代码 (Ctrl+`)"
            />
            <Button
              size="small"
              onClick={() => handleBlockClick('heading-one')}
              title="标题1 (Ctrl+1)"
            >
              H1
            </Button>
            <Button
              size="small"
              onClick={() => handleBlockClick('heading-two')}
              title="标题2 (Ctrl+2)"
            >
              H2
            </Button>
            <Button
              size="small"
              onClick={() => handleBlockClick('heading-three')}
              title="标题3 (Ctrl+3)"
            >
              H3
            </Button>
          </Space>
        </div>
      )}

      {/* 编辑器/预览区域 */}
      {editMode === 'edit' ? (
        <Slate
          editor={editor}
          initialValue={safeInitialValue}
          onChange={handleContentChange}
        >
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            onKeyDown={onKeyDown}
            placeholder="开始输入Markdown内容..."
            style={{
              minHeight: '400px',
              border: '1px solid #d9d9d9',
              borderRadius: '4px',
              padding: '12px',
              backgroundColor: '#fff',
              fontSize: '14px',
              lineHeight: '1.6'
            }}
          />
        </Slate>
      ) : (
        <div
          style={{
            minHeight: '400px',
            border: '1px solid #d9d9d9',
            borderRadius: '4px',
            padding: '12px',
            backgroundColor: '#fff',
            fontSize: '14px',
            lineHeight: '1.6'
          }}
          dangerouslySetInnerHTML={{ __html: htmlPreview }}
        />
      )}

      {/* 快捷键提示 */}
      {editMode === 'edit' && (
        <div style={{ marginTop: 10, fontSize: '12px', color: '#666' }}>
          <p>快捷键提示：</p>
          <ul style={{ paddingLeft: 20, margin: '5px 0' }}>
            <li>Ctrl+B: 加粗 | Ctrl+I: 斜体 | Ctrl+`: 代码</li>
            <li>Ctrl+1/2/3: 标题级别</li>
            <li>编辑模式下内容会自动保存</li>
          </ul>
        </div>
      )}

      {/* 内容状态 */}
      <div style={{ marginTop: 10, fontSize: '12px', color: '#999' }}>
        <p>文档长度: {markdownContent.length} 字符 | 模板: {currentTemplate} | 模式: {editMode === 'edit' ? '编辑' : '预览'}</p>
      </div>
    </Card>
  );
};

// 辅助函数
const isFormatActive = (editor, format) => {
  const [match] = Editor.nodes(editor, {
    match: n => n[format] === true,
    mode: 'all'
  });
  return !!match;
};

const isBlockActive = (editor, type) => {
  const [match] = Editor.nodes(editor, {
    match: n => n.type === type,
    mode: 'all'
  });
  return !!match;
};

export default DocumentEditor;