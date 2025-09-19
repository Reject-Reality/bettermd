import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Layout, Row, Col, Typography, Card, Tabs } from 'antd';
import FileUploader from '../components/FileUploader';
import MarkdownPreview from '../components/MarkdownPreview';
import TemplateSelector from '../components/TemplateSelector';
import MarkdownEditor from '../components/MarkdownEditor';
import SimpleMarkdownEditor from '../components/SimpleMarkdownEditor';
import TestEditor from '../components/TestEditor';
import BacklinkPanel from '../components/BacklinkPanel';
import KnowledgeGraph from '../components/KnowledgeGraph';
import PluginManager from '../components/PluginManager';
import AIToolsPanel from '../components/AIToolsPanel';
import { usePlugins } from '../components/PluginSystem';

const { Title } = Typography;
const { TabPane } = Tabs;

const Editor = () => {
  const location = useLocation();
  const [processedContent, setProcessedContent] = useState(null);
  const [filename, setFilename] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('default');
  const [editorContent, setEditorContent] = useState('');
  const [currentNote, setCurrentNote] = useState({ id: 1, title: '项目规划', content: '这是关于项目规划的笔记内容...', links: [2, 3] });

  const { getEnabledPlugins } = usePlugins();

  // 处理从Home页面传递过来的状态
  useEffect(() => {
    if (location.state && location.state.content) {
      setProcessedContent(location.state.content);
      setFilename(location.state.filename || '');
      // 由于后端没有返回markdown_content，我们需要从原始文件中读取内容
      // 暂时设置为空字符串，让编辑器显示默认提示文本
      setEditorContent('');
    }
  }, [location.state]);

  const handleUploadSuccess = (data) => {
    setProcessedContent(data.html_content);
    setFilename(data.filename);
    // 确保editorContent永远不会是undefined
    setEditorContent(data.markdown_content || data.original_content || '');
  };

  const handleTemplateSelect = (templateName) => {
    setSelectedTemplate(templateName);
    // 如果已经有处理过的内容，重新应用新模板
    if (processedContent && filename) {
      // 这里需要重新处理内容以应用新模板
      // 在实际应用中，我们会调用API重新处理
      console.log(`Template changed to: ${templateName}`);
    }
  };

  const handleEditorChange = (value) => {
    // 确保value是有效的Slate值数组，然后提取文本内容
    if (value && Array.isArray(value)) {
      // 从Slate值中提取纯文本内容用于存储
      const textContent = value
        .map(node => {
          if (node.type === 'paragraph' && node.children) {
            return node.children.map(child => child.text || '').join('');
          }
          return '';
        })
        .join('\n');
      setEditorContent(textContent);
      console.log('Editor content changed:', textContent);
    }
  };

  const handleNoteSelect = (note) => {
    setCurrentNote(note);
    // 在实际应用中，这里会加载选中笔记的内容
    console.log('Selected note:', note);
  };

  // 获取启用的插件
  const enabledPlugins = getEnabledPlugins();

  return (
    <Layout>
      <div style={{ padding: '24px' }}>
        <Title level={2}>Markdown 编辑器</Title>
        
        <Row gutter={[24, 24]}>
          <Col span={12}>
            <Card title="文件上传">
              <FileUploader 
                onUploadSuccess={handleUploadSuccess} 
                template={selectedTemplate}
              />
            </Card>
            
            <Card title="模板选择" style={{ marginTop: 20 }}>
              <TemplateSelector 
                onTemplateSelect={handleTemplateSelect} 
                selectedTemplate={selectedTemplate}
              />
            </Card>
            
            <Card title="编辑器" style={{ marginTop: 20 }}>
              <SimpleMarkdownEditor
                initialValue={editorContent || ''}
                onChange={handleEditorChange}
              />
              <div style={{ marginTop: 10, fontSize: '12px', color: '#666' }}>
                Debug: editorContent = "{editorContent}"
              </div>
            </Card>
            
            {/* 插件管理面板 */}
            <Card title="插件管理" style={{ marginTop: 20 }}>
              <PluginManager />
            </Card>
            
            {/* 启用插件的UI组件 */}
            {enabledPlugins.map(plugin => {
              const UIComponent = plugin.getUIComponent();
              return UIComponent ? (
                <div key={plugin.id} style={{ marginTop: 20 }}>
                  <UIComponent />
                </div>
              ) : null;
            })}
          </Col>
          
          <Col span={12}>
            <Tabs defaultActiveKey="1">
              <TabPane tab="预览" key="1">
                <MarkdownPreview content={processedContent} filename={filename} />
              </TabPane>
              <TabPane tab="双链笔记" key="2">
                <BacklinkPanel 
                  currentNote={currentNote} 
                  onNoteSelect={handleNoteSelect} 
                />
              </TabPane>
              <TabPane tab="知识图谱" key="3">
                <KnowledgeGraph />
              </TabPane>
              <TabPane tab="AI工具" key="4">
                <AIToolsPanel />
              </TabPane>
              {enabledPlugins.map(plugin => {
                const UIComponent = plugin.getUIComponent();
                return UIComponent ? (
                  <TabPane tab={plugin.name} key={plugin.id}>
                    <Card>
                      <UIComponent />
                    </Card>
                  </TabPane>
                ) : null;
              })}
            </Tabs>
          </Col>
        </Row>
      </div>
    </Layout>
  );
};

export default Editor;