import React, { useState, useEffect } from 'react';
import { Card, List, Typography, Select, Spin, Alert } from 'antd';
import { getTemplatesInfo } from '../api';

const { Text } = Typography;

const TemplateSelector = ({ 
  onTemplateSelect, 
  selectedTemplate = 'default' 
}) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewTemplate, setPreviewTemplate] = useState(selectedTemplate);

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
                  backgroundColor: '#f5f5f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  color: '#999'
                }}>
                  模板预览 ({template.name})
                </div>
              }
              onClick={() => handleTemplateChange(template.name)}
            >
              <Card.Meta
                title={template.title}
                description={
                  <div>
                    <Text type="secondary">{template.description}</Text>
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
    </div>
  );
};

export default TemplateSelector;