import React, { useMemo, useState, useCallback } from 'react';
import { createEditor, Editor, Transforms, Text } from 'slate';
import { Slate, Editable, withReact, ReactEditor } from 'slate-react';
import { withHistory } from 'slate-history';
import { Card, Button, Space, Input } from 'antd';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism.css';

const MarkdownEditor = ({ initialValue, onChange }) => {
  const [editor] = useState(() => withHistory(withReact(createEditor())));
  const [mathExpression, setMathExpression] = useState('');
  
  // 扩展编辑器以支持自定义元素
  const editorWithExtensions = useMemo(() => {
    const extendedEditor = editor;
    
    // 重写isVoid方法以支持checkbox
    const { isVoid } = extendedEditor;
    extendedEditor.isVoid = element => {
      return element.type === 'checkbox' ? true : isVoid(element);
    };
    
    return extendedEditor;
  }, [editor]);
  
  const renderElement = useCallback(props => {
    switch (props.element.type) {
      case 'heading-one':
        return <h1 {...props.attributes}>{props.children}</h1>;
      case 'heading-two':
        return <h2 {...props.attributes}>{props.children}</h2>;
      case 'heading-three':
        return <h3 {...props.attributes}>{props.children}</h3>;
      case 'block-quote':
        return <blockquote {...props.attributes}>{props.children}</blockquote>;
      case 'bulleted-list':
        return <ul {...props.attributes}>{props.children}</ul>;
      case 'numbered-list':
        return <ol {...props.attributes}>{props.children}</ol>;
      case 'list-item':
        return <li {...props.attributes}>{props.children}</li>;
      case 'code-block':
        return (
          <pre {...props.attributes} style={{ 
            background: '#f5f5f5', 
            padding: '10px', 
            borderRadius: '4px',
            overflowX: 'auto'
          }}>
            <code>{props.children}</code>
          </pre>
        );
      case 'task-list':
        return <div {...props.attributes} className="task-list">{props.children}</div>;
      case 'task-item':
        return (
          <div {...props.attributes} className="task-item" style={{ display: 'flex', alignItems: 'flex-start' }}>
            <span 
              contentEditable={false} 
              style={{ marginRight: '8px', cursor: 'pointer' }}
              onClick={e => {
                e.preventDefault();
                const path = ReactEditor.findPath(editor, props.element);
                Transforms.setNodes(
                  editor,
                  { checked: !props.element.checked },
                  { at: path }
                );
              }}
            >
              <input 
                type="checkbox" 
                checked={props.element.checked || false}
                onChange={() => {}}
              />
            </span>
            <span style={{ flex: 1 }}>{props.children}</span>
          </div>
        );
      case 'math':
        return (
          <div {...props.attributes} style={{ 
            background: '#f0f8ff', 
            padding: '5px 10px', 
            borderRadius: '4px',
            display: 'inline-block',
            border: '1px solid #87ceeb'
          }}>
            <span contentEditable={false}>$</span>
            {props.children}
            <span contentEditable={false}>$</span>
          </div>
        );
      default:
        return <p {...props.attributes}>{props.children}</p>;
    }
  }, [editor]);

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

  const onKeyDown = useCallback(
    event => {
      // 添加快捷键支持
      if (event.key === 'Enter' && event.ctrlKey) {
        event.preventDefault();
        // 触发保存或处理
        return;
      }
      
      // 添加标题快捷键 (Ctrl+1, Ctrl+2, Ctrl+3)
      if (event.key === '1' && event.ctrlKey) {
        event.preventDefault();
        Transforms.setNodes(
          editor,
          { type: 'heading-one' },
          { match: n => Editor.isBlock(editor, n) }
        );
        return;
      }
      
      if (event.key === '2' && event.ctrlKey) {
        event.preventDefault();
        Transforms.setNodes(
          editor,
          { type: 'heading-two' },
          { match: n => Editor.isBlock(editor, n) }
        );
        return;
      }
      
      if (event.key === '3' && event.ctrlKey) {
        event.preventDefault();
        Transforms.setNodes(
          editor,
          { type: 'heading-three' },
          { match: n => Editor.isBlock(editor, n) }
        );
        return;
      }
      
      // 添加代码块快捷键 (Ctrl+`)
      if (event.key === '`' && event.ctrlKey && event.shiftKey) {
        event.preventDefault();
        Transforms.setNodes(
          editor,
          { type: 'code-block' },
          { match: n => Editor.isBlock(editor, n) }
        );
        return;
      }
      
      // 添加任务列表快捷键 (Ctrl+Shift+T)
      if (event.key === 'T' && event.ctrlKey && event.shiftKey) {
        event.preventDefault();
        Transforms.setNodes(
          editor,
          { type: 'task-list' },
          { match: n => Editor.isBlock(editor, n) }
        );
        return;
      }
    },
    [editor]
  );

  const decorate = useCallback(
    ([node, path]) => {
      const ranges = [];
      
      // 语法高亮装饰器
      if (node.type === 'code-block') {
        const text = node.children[0].text;
        const lang = 'javascript'; // 默认语言，可以根据需要更改
        const tokens = Prism.tokenize(text, Prism.languages[lang]);
        
        let start = 0;
        for (const token of tokens) {
          if (typeof token === 'string') {
            start += token.length;
          } else {
            ranges.push({
              anchor: { path, offset: start },
              focus: { path, offset: start + token.length },
              className: `token ${token.type}`,
            });
            start += token.length;
          }
        }
      }
      
      return ranges;
    },
    []
  );

  const insertMathExpression = () => {
    if (mathExpression.trim()) {
      Transforms.insertNodes(editor, {
        type: 'math',
        children: [{ text: mathExpression }],
      });
      setMathExpression('');
    }
  };

  const initialValueContent = initialValue 
    ? [{ type: 'paragraph', children: [{ text: initialValue }] }]
    : [
        {
          type: 'paragraph',
          children: [{ text: '开始编辑你的Markdown内容...' }],
        },
      ];

  return (
    <Card 
      title="Markdown编辑器" 
      extra={
        <Space>
          <Button 
            size="small" 
            onClick={() => {
              // 插入标题1
              Transforms.insertNodes(editor, {
                type: 'heading-one',
                children: [{ text: '一级标题' }],
              });
            }}
          >
            H1
          </Button>
          <Button 
            size="small" 
            onClick={() => {
              // 插入标题2
              Transforms.insertNodes(editor, {
                type: 'heading-two',
                children: [{ text: '二级标题' }],
              });
            }}
          >
            H2
          </Button>
          <Button 
            size="small" 
            onClick={() => {
              // 插入代码块
              Transforms.insertNodes(editor, {
                type: 'code-block',
                children: [{ text: 'console.log("Hello World");' }],
              });
            }}
          >
            代码块
          </Button>
          <Button 
            size="small" 
            onClick={() => {
              // 插入任务列表
              Transforms.insertNodes(editor, {
                type: 'task-list',
                children: [
                  {
                    type: 'task-item',
                    checked: false,
                    children: [{ text: '任务项目' }],
                  }
                ],
              });
            }}
          >
            任务列表
          </Button>
          <Space>
            <Input 
              placeholder="输入LaTeX数学表达式" 
              value={mathExpression}
              onChange={e => setMathExpression(e.target.value)}
              style={{ width: '150px' }}
            />
            <Button 
              size="small" 
              onClick={insertMathExpression}
            >
              插入公式
            </Button>
          </Space>
        </Space>
      }
    >
      <Slate 
        editor={editorWithExtensions} 
        initialValue={initialValueContent}
        onChange={value => {
          onChange && onChange(value);
        }}
      >
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          decorate={decorate}
          onKeyDown={onKeyDown}
          style={{
            minHeight: '300px',
            border: '1px solid #d9d9d9',
            borderRadius: '4px',
            padding: '12px',
            backgroundColor: '#fff'
          }}
        />
      </Slate>
    </Card>
  );
};

export default MarkdownEditor;