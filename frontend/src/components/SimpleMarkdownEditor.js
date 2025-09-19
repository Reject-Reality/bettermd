import React, { useMemo } from 'react';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import { Card } from 'antd';

const SimpleMarkdownEditor = ({ initialValue, onChange }) => {
  console.log('SimpleMarkdownEditor: Rendering with initialValue:', initialValue);

  // 创建编辑器实例
  const editor = useMemo(() => {
    const baseEditor = createEditor();
    const withReactEditor = withReact(baseEditor);
    const withHistoryEditor = withHistory(withReactEditor);
    return withHistoryEditor;
  }, []);

  // 确保初始值是有效的 Slate 格式
  const safeInitialValue = useMemo(() => {
    console.log('SimpleMarkdownEditor: Processing initialValue:', initialValue);

    if (!initialValue || typeof initialValue !== 'string' || initialValue.trim() === '') {
      const defaultValue = [{ type: 'paragraph', children: [{ text: '开始编辑...' }] }];
      console.log('SimpleMarkdownEditor: Using default value:', defaultValue);
      return defaultValue;
    }

    const resultValue = [{ type: 'paragraph', children: [{ text: initialValue }] }];
    console.log('SimpleMarkdownEditor: Using provided value:', resultValue);
    return resultValue;
  }, [initialValue]);

  if (!editor || !safeInitialValue) {
    console.log('SimpleMarkdownEditor: Waiting for initialization');
    return (
      <Card title="简单编辑器">
        <div style={{ padding: '50px', textAlign: 'center' }}>
          <p>编辑器初始化中...</p>
        </div>
      </Card>
    );
  }

  console.log('SimpleMarkdownEditor: Rendering with editor and value');

  return (
    <Card title="简单编辑器">
      <Slate
        editor={editor}
        initialValue={safeInitialValue}
        onChange={value => {
          console.log('SimpleMarkdownEditor: onChange called with:', value);
          if (onChange && Array.isArray(value)) {
            onChange(value);
          }
        }}
      >
        <Editable
          placeholder="开始输入..."
          style={{
            minHeight: '200px',
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

export default SimpleMarkdownEditor;