import React, { useMemo, useCallback } from 'react';
import { createEditor, Editor, Transforms, Text } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import { Card, Button, Space } from 'antd';
import {
  BoldOutlined,
  ItalicOutlined,
  CodeOutlined
} from '@ant-design/icons';

const ImprovedMarkdownEditor = ({ initialValue, onChange }) => {
  console.log('ImprovedMarkdownEditor: Rendering with initialValue:', initialValue);

  // 创建编辑器实例
  const editor = useMemo(() => {
    const baseEditor = createEditor();
    const withReactEditor = withReact(baseEditor);
    const withHistoryEditor = withHistory(withReactEditor);
    return withHistoryEditor;
  }, []);

  // 确保初始值是有效的 Slate 格式
  const safeInitialValue = useMemo(() => {
    console.log('ImprovedMarkdownEditor: Processing initialValue:', initialValue);

    if (!initialValue || typeof initialValue !== 'string' || initialValue.trim() === '') {
      const defaultValue = [{ type: 'paragraph', children: [{ text: '开始编辑...' }] }];
      console.log('ImprovedMarkdownEditor: Using default value:', defaultValue);
      return defaultValue;
    }

    // 简单的markdown到Slate格式转换
    const lines = initialValue.split('\n');
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
      }

      return { type, children: [{ text }] };
    });

    console.log('ImprovedMarkdownEditor: Using converted value:', slateNodes);
    return slateNodes;
  }, [initialValue]);

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

  if (!editor || !safeInitialValue) {
    return (
      <Card title="Markdown编辑器">
        <div style={{ padding: '50px', textAlign: 'center' }}>
          <p>编辑器初始化中...</p>
        </div>
      </Card>
    );
  }

  // 将Slate值转换为Markdown文本
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
      } else if (node.type === 'block-quote') {
        return `> ${node.children[0].text}`;
      } else {
        return node.children[0].text;
      }
    }).join('\n');
  }, []);

  return (
    <Card
      title="Markdown编辑器"
      extra={
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
      }
    >
      <Slate
        editor={editor}
        initialValue={safeInitialValue}
        onChange={value => {
          console.log('ImprovedMarkdownEditor: onChange called with:', value);
          if (onChange && Array.isArray(value)) {
            // 同时传递Slate格式和Markdown格式
            const markdownContent = slateToMarkdown(value);
            onChange(value, markdownContent);
          }
        }}
      >
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onKeyDown={onKeyDown}
          placeholder="开始输入Markdown..."
          style={{
            minHeight: '300px',
            border: '1px solid #d9d9d9',
            borderRadius: '4px',
            padding: '12px',
            backgroundColor: '#fff',
            fontSize: '14px',
            lineHeight: '1.6'
          }}
        />
      </Slate>

      <div style={{ marginTop: 10, fontSize: '12px', color: '#666' }}>
        <p>快捷键提示：</p>
        <ul style={{ paddingLeft: 20, margin: '5px 0' }}>
          <li>Ctrl+B: 加粗 | Ctrl+I: 斜体 | Ctrl+`: 代码</li>
          <li>Ctrl+1/2/3: 标题级别</li>
        </ul>
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

export default ImprovedMarkdownEditor;