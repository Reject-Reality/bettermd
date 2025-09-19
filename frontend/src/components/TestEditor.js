import React, { useState } from 'react';
import { Card, Input } from 'antd';

const TestEditor = ({ initialValue, onChange }) => {
  const [content, setContent] = useState(initialValue || '');

  const handleChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    if (onChange) {
      // 转换为 Slate 格式以保持兼容性
      onChange([{
        type: 'paragraph',
        children: [{ text: newContent }]
      }]);
    }
  };

  return (
    <Card title="测试编辑器">
      <Input.TextArea
        value={content}
        onChange={handleChange}
        placeholder="输入文本内容..."
        autoSize={{ minRows: 4, maxRows: 10 }}
        style={{
          minHeight: '200px',
          border: '1px solid #d9d9d9',
          borderRadius: '4px',
          padding: '12px',
          backgroundColor: '#fff'
        }}
      />
      <div style={{ marginTop: 10, fontSize: '12px', color: '#666' }}>
        Debug: Raw content = "{content}"
      </div>
    </Card>
  );
};

export default TestEditor;