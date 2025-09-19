import React, { useState, useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Card, Button, Space, message } from 'antd';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import axios from 'axios';

const ReactMDEditor = ({
  initialContent = '',
  initialTemplate = 'default',
  filename = '',
  onContentChange,
  onTemplateChange
}) => {
  const [currentTemplate, setCurrentTemplate] = useState(initialTemplate);
  const [markdownContent, setMarkdownContent] = useState(initialContent);
  const [htmlPreview, setHtmlPreview] = useState('');
  const [mode, setMode] = useState('edit'); // 'edit' or 'preview'
  const [loading, setLoading] = useState(false);

  // 应用模板
  const applyTemplate = async (templateName) => {
    if (!markdownContent.trim()) {
      message.warning('请先输入内容再应用模板');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/markdown/process/raw', {
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

  // 处理文件上传
  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('template', currentTemplate);

    try {
      const response = await axios.post('http://localhost:8000/api/markdown/process', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // 读取文件内容作为markdown_content
      const fileContent = await file.text();
      const content = fileContent || '';

      setMarkdownContent(content);
      setHtmlPreview(response.data.html_content);

      if (onContentChange) {
        onContentChange(content);
      }

      message.success('文件上传成功');
    } catch (error) {
      console.error('文件上传错误:', error);
      message.error('文件上传失败: ' + (error.response?.data?.detail || error.message));
    }
  };

  // 处理内容变化
  const handleContentChange = (value) => {
    setMarkdownContent(value || '');
    if (onContentChange) {
      onContentChange(value || '');
    }
  };

  // 切换模式
  const handleModeChange = (newMode) => {
    setMode(newMode);
    if (newMode === 'preview' && markdownContent.trim()) {
      applyTemplate(currentTemplate);
    }
  };

  return (
    <Card
      title={`Markdown 编辑器 - ${filename || '未命名文档'}`}
      extra={
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            type={mode === 'edit' ? 'primary' : 'default'}
            onClick={() => handleModeChange('edit')}
          >
            编辑
          </Button>
          <Button
            size="small"
            icon={<EyeOutlined />}
            type={mode === 'preview' ? 'primary' : 'default'}
            onClick={() => handleModeChange('preview')}
            loading={loading}
          >
            预览
          </Button>
        </Space>
      }
    >
      {/* 文件上传区域 */}
      <div style={{ marginBottom: 16 }}>
        <input
          type="file"
          accept=".md"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              handleFileUpload(file);
            }
          }}
          style={{ display: 'none' }}
          id="file-upload"
        />
        <Button
          type="dashed"
          style={{ width: '100%' }}
          onClick={() => document.getElementById('file-upload').click()}
        >
          点击上传 Markdown 文件
        </Button>
      </div>

      {/* 模板选择 */}
      <div style={{ marginBottom: 16 }}>
        <Space>
          <span>当前模板: {currentTemplate}</span>
          <Button size="small" onClick={() => applyTemplate('default')}>默认模板</Button>
          <Button size="small" onClick={() => applyTemplate('academic')}>学术模板</Button>
          <Button size="small" onClick={() => applyTemplate('business')}>商务模板</Button>
          <Button size="small" onClick={() => applyTemplate('technical')}>技术模板</Button>
        </Space>
      </div>

      {/* 编辑器/预览区域 */}
      {mode === 'edit' ? (
        <div data-color-mode="light">
          <MDEditor
            value={markdownContent}
            onChange={handleContentChange}
            height={500}
            visibleDragBar={false}
            textareaProps={{
              placeholder: '开始输入 Markdown 内容...',
            }}
            preview="edit"
            hideToolbar={false}
          />
        </div>
      ) : (
        <div
          style={{
            minHeight: '500px',
            border: '1px solid #d9d9d9',
            borderRadius: '4px',
            padding: '16px',
            backgroundColor: '#fff',
            fontSize: '14px',
            lineHeight: '1.6',
            overflow: 'auto'
          }}
          dangerouslySetInnerHTML={{ __html: htmlPreview }}
        />
      )}

      {/* 使用说明 */}
      <div style={{ marginTop: 16, fontSize: '12px', color: '#666' }}>
        <p>使用说明：</p>
        <ul style={{ paddingLeft: 20, margin: '5px 0' }}>
          <li>支持直接在编辑器中输入 Markdown 内容</li>
          <li>可以上传 .md 文件或直接粘贴文本</li>
          <li>编辑模式下支持实时预览（侧边栏模式）</li>
          <li>预览模式查看最终文档效果</li>
        </ul>
      </div>
    </Card>
  );
};

export default ReactMDEditor;