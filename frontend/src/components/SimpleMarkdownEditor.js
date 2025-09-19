import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Space, Tabs, message } from 'antd';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import EasyMDE from 'easymde';
import 'easymde/dist/easymde.min.css';
import axios from 'axios';

const { TabPane } = Tabs;

const SimpleMarkdownEditor = ({
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
  const editorRef = useRef(null);

  // 初始化 EasyMDE 编辑器
  useEffect(() => {
    if (mode === 'edit') {
      // 确保元素存在
      const textarea = document.getElementById('markdown-editor');
      if (!textarea) return;

      if (!editorRef.current) {
        const editor = new EasyMDE({
          element: textarea,
          initialValue: markdownContent,
          renderingConfig: {
            singleLineBreaks: false,
            codeSyntaxHighlighting: true,
          },
          toolbar: [
            'bold', 'italic', 'heading', '|',
            'quote', 'unordered-list', 'ordered-list', '|',
            'link', 'image', 'table', '|',
            'preview', 'side-by-side', 'fullscreen', '|',
            'guide'
          ],
          autosave: {
            enabled: true,
            uniqueId: 'bettermd-editor',
            delay: 1000,
          },
          placeholder: '开始输入 Markdown 内容，或粘贴您的文本...',
          sideBySideFullscreen: false,
          syncSideBySidePreviewScroll: true,
          previewClass: 'editor-preview',
        });

        // 监听内容变化
        editor.codemirror.on('change', () => {
          const content = editor.value();
          setMarkdownContent(content);
          if (onContentChange) {
            onContentChange(content);
          }
        });

        editorRef.current = editor;
      } else {
        // 如果编辑器已存在，更新其内容
        editorRef.current.value(markdownContent);
      }
    }

    // 清理函数
    return () => {
      if (editorRef.current) {
        try {
          editorRef.current.toTextArea();
        } catch (error) {
          console.warn('Error destroying EasyMDE editor:', error);
        }
        editorRef.current = null;
      }
    };
  }, [mode, markdownContent]);

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

  // 处理文件上传
  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('template', currentTemplate);

    try {
      const response = await axios.post('/api/markdown/process', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const content = response.data.markdown_content || '';
      setMarkdownContent(content);
      setHtmlPreview(response.data.html_content);

      // 更新编辑器内容
      if (editorRef.current) {
        editorRef.current.value(content);
      }

      if (onContentChange) {
        onContentChange(content);
      }

      message.success('文件上传成功');
    } catch (error) {
      message.error('文件上传失败: ' + (error.response?.data?.detail || error.message));
    }
  };

  // 处理粘贴事件
  const handlePaste = (event) => {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf('image') !== -1) {
        event.preventDefault();
        const file = item.getAsFile();
        // 这里可以添加图片上传逻辑
        message.info('图片上传功能开发中...');
      }
    }
  };

  // 切换模式
  const handleModeChange = (key) => {
    setMode(key);
    if (key === 'preview' && markdownContent.trim()) {
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
        <div onPaste={handlePaste}>
          <textarea id="markdown-editor" style={{ display: 'none' }} />
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

export default SimpleMarkdownEditor;