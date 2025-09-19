import React, { useState, useEffect } from 'react';
import { Card, List, Typography, Select, Spin, Alert, Button, Modal } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { getTemplatesInfo, getTemplatePreview } from '../api';

const { Text } = Typography;

const TemplateSelector = ({
  onTemplateSelect,
  selectedTemplate = 'default'
}) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewTemplate, setPreviewTemplate] = useState(selectedTemplate);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const [previewLoading, setPreviewLoading] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const templateList = await getTemplatesInfo();
      setTemplates(templateList);
    } catch (err) {
      setError('Failed to load templates');
      console.error('Error fetching templates:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateChange = (value) => {
    setPreviewTemplate(value);
    onTemplateSelect(value);
  };

  const handlePreview = async (templateName) => {
    try {
      setPreviewLoading(true);
      setPreviewModalVisible(true);
      const response = await getTemplatePreview(templateName);
      setPreviewContent(response);
    } catch (error) {
      console.error('Error loading preview:', error);
      setPreviewContent('<p>预览加载失败</p>');
    } finally {
      setPreviewLoading(false);
    }
  };

  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" />;
  }

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <Text strong>选择模板: </Text>
        <Select
          value={previewTemplate}
          style={{ width: 200, marginLeft: 10 }}
          onChange={handleTemplateChange}
          options={templates.map(template => ({
            value: template.name,
            label: template.title
          }))}
        />
      </div>

      <List
        grid={{ gutter: 16, column: 2 }}
        dataSource={templates}
        renderItem={template => (
          <List.Item>
            <Card
              hoverable
              style={{
                border: previewTemplate === template.name ? '2px solid #1890ff' : '1px solid #f0f0f0',
                borderRadius: 8
              }}
              cover={
                <div style={{
                  height: 120,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  color: 'white',
                  fontWeight: 'bold'
                }}>
                  {template.title}
                </div>
              }
              actions={[
                <Button
                  key="preview"
                  icon={<EyeOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePreview(template.name);
                  }}
                >
                  预览
                </Button>
              ]}
              onClick={() => handleTemplateChange(template.name)}
            >
              <Card.Meta
                title={template.title}
                description={
                  <div>
                    <Text type="secondary">{template.description}</Text>
                    <div style={{ marginTop: 8 }}>
                      {template.tags && template.tags.map(tag => (
                        <span key={tag} style={{
                          display: 'inline-block',
                          backgroundColor: '#f0f0f0',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '10px',
                          margin: '2px',
                          color: '#666'
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        作者: {template.author} | 版本: {template.version}
                      </Text>
                    </div>
                  </div>
                }
              />
            </Card>
          </List.Item>
        )}
      />

      <Modal
        title={`${previewTemplate} 模板预览`}
        visible={previewModalVisible}
        onCancel={() => setPreviewModalVisible(false)}
        footer={null}
        width="80%"
        style={{ top: 20 }}
        bodyStyle={{ height: '70vh', overflow: 'auto' }}
      >
        {previewLoading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
            <div style={{ marginTop: 16 }}>预览加载中...</div>
          </div>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: previewContent }} />
        )}
      </Modal>
    </div>
  );
};

export default TemplateSelector;