import React from 'react';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { processMarkdownFile } from '../api';

const FileUploader = ({ onUploadSuccess, template = 'default' }) => {
  const handleFileUpload = async (file) => {
    try {
      const response = await processMarkdownFile(file, template);
      message.success('文件上传和解析成功');
      if (onUploadSuccess) {
        onUploadSuccess(response);
      }
    } catch (error) {
      message.error('文件上传失败: ' + (error.message || '未知错误'));
    }
  };

  const props = {
    beforeUpload: (file) => {
      const isMarkdown = file.type === 'text/markdown' || file.name.endsWith('.md');
      if (!isMarkdown) {
        message.error('只能上传.md格式的文件!');
        return false;
      }
      handleFileUpload(file);
      return false;
    },
    maxCount: 1,
  };

  return (
    <Upload {...props}>
      <Button icon={<UploadOutlined />}>上传 Markdown 文件</Button>
    </Upload>
  );
};

export default FileUploader;