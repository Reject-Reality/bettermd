import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Layout, Row, Col, Typography, Card, Tabs } from 'antd';
import ReactMDEditor from '../components/ReactMDEditor';
import BacklinkPanel from '../components/BacklinkPanel';
import KnowledgeGraph from '../components/KnowledgeGraph';
import PluginManager from '../components/PluginManager';
import AIToolsPanel from '../components/AIToolsPanel';
import { usePlugins } from '../components/PluginSystem';

const { Title } = Typography;
const { TabPane } = Tabs;

const Editor = () => {
  const location = useLocation();
  const [filename, setFilename] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('default');
  const [editorContent, setEditorContent] = useState('');
  const [currentNote, setCurrentNote] = useState({ id: 1, title: '项目规划', content: '这是关于项目规划的笔记内容...', links: [2, 3] });

  const { getEnabledPlugins } = usePlugins();

  // 处理从Home页面传递过来的状态
  useEffect(() => {
    if (location.state && location.state.content) {
      setFilename(location.state.filename || '');
      setEditorContent(location.state.markdown_content || '');
    }
  }, [location.state]);

  const handleNoteSelect = (note) => {
    setCurrentNote(note);
    console.log('Selected note:', note);
  };

  // 获取启用的插件
  const enabledPlugins = getEnabledPlugins();

  return (
    <Layout>
      <div style={{ padding: '24px' }}>
        <Title level={2}>Markdown 编辑器</Title>

        <Row gutter={[24, 24]}>
          <Col span={16}>
            <ReactMDEditor
              initialContent={editorContent}
              initialTemplate={selectedTemplate}
              filename={filename}
              onContentChange={(content) => {
                setEditorContent(content || '');
              }}
              onTemplateChange={(template) => {
                setSelectedTemplate(template);
              }}
            />

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

          <Col span={8}>
            <Tabs defaultActiveKey="1">
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