import React, { useState } from 'react';
import { Layout, Card, Button, Row, Col, Typography, Modal } from 'antd';
import { UploadOutlined, FileMarkdownOutlined, HighlightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import FileUploader from '../components/FileUploader';
import TemplateSelector from '../components/TemplateSelector';

const { Title, Paragraph } = Typography;

const Home = () => {
  const navigate = useNavigate();
  const [isTemplateModalVisible, setIsTemplateModalVisible] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('default');

  const handleUploadSuccess = (data) => {
    // 上传成功后显示成功消息，并提供查看选项
    setTimeout(() => {
      if (confirm('文件处理成功！是否前往编辑器查看？')) {
        navigate('/editor', { state: { content: data.html_content, filename: data.filename } });
      }
    }, 500);
  };

  const handleTemplateSelect = (templateName) => {
    setSelectedTemplate(templateName);
  };

  const showTemplateModal = () => {
    setIsTemplateModalVisible(true);
  };

  const handleTemplateOk = () => {
    setIsTemplateModalVisible(false);
  };

  const handleTemplateCancel = () => {
    setIsTemplateModalVisible(false);
  };

  return (
    <Layout>
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Title level={2}>欢迎使用 BetterMD</Title>
        <Paragraph style={{ fontSize: '16px', maxWidth: '800px', margin: '0 auto 40px' }}>
          BetterMD 是一款专业的 Markdown 美化工具，帮助您将普通的 Markdown 文档转换为格式精美、视觉吸引人的文档。
        </Paragraph>

        <Row gutter={[24, 24]} justify="center">
          <Col xs={24} sm={12} md={8}>
            <Card 
              title={<span><UploadOutlined /> 上传文档</span>} 
              bordered={false}
              style={{ borderRadius: '8px' }}
            >
              <Paragraph>上传您的 Markdown 文件，我们将为您进行美化处理。</Paragraph>
              <FileUploader onUploadSuccess={handleUploadSuccess} template={selectedTemplate} />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Card 
              title={<span><FileMarkdownOutlined /> 编辑文档</span>} 
              bordered={false}
              style={{ borderRadius: '8px' }}
            >
              <Paragraph>使用我们内置的编辑器创建和编辑 Markdown 文档。</Paragraph>
              <Button 
                type="primary" 
                icon={<FileMarkdownOutlined />}
                onClick={() => navigate('/editor')}
              >
                打开编辑器
              </Button>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Card 
              title={<span><HighlightOutlined /> 选择模板</span>} 
              bordered={false}
              style={{ borderRadius: '8px' }}
            >
              <Paragraph>从多种精美模板中选择，为您的文档增添专业外观。</Paragraph>
              <Button 
                type="primary" 
                icon={<HighlightOutlined />}
                onClick={showTemplateModal}
              >
                浏览模板
              </Button>
            </Card>
          </Col>
        </Row>

        <div style={{ marginTop: '40px' }}>
          <Title level={3}>特色功能</Title>
          <Row gutter={[16, 16]} justify="center">
            <Col xs={24} sm={12} md={6}>
              <Card size="small">
                <strong>多种模板</strong>
                <p>商务、学术、技术文档等多种风格模板</p>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card size="small">
                <strong>AI辅助</strong>
                <p>智能推荐模板和内容优化建议</p>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card size="small">
                <strong>实时预览</strong>
                <p>所见即所得的编辑体验</p>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card size="small">
                <strong>自定义模板</strong>
                <p>支持用户上传自定义模板</p>
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      <Modal
        title="选择模板"
        visible={isTemplateModalVisible}
        onOk={handleTemplateOk}
        onCancel={handleTemplateCancel}
        width={800}
        footer={null}
      >
        <TemplateSelector 
          onTemplateSelect={handleTemplateSelect} 
          selectedTemplate={selectedTemplate}
        />
        <div style={{ textAlign: 'right', marginTop: 20 }}>
          <Button onClick={handleTemplateCancel}>取消</Button>
          <Button type="primary" onClick={handleTemplateOk} style={{ marginLeft: 10 }}>
            确定
          </Button>
        </div>
      </Modal>
    </Layout>
  );
};

export default Home;