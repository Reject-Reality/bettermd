import React from 'react';
import { Card, Typography } from 'antd';

const { Title } = Typography;

const MarkdownPreview = ({ content, filename }) => {
  return (
    <Card title={filename ? `预览: ${filename}` : "Markdown 预览"}>
      {content ? (
        <div dangerouslySetInnerHTML={{ __html: content }} />
      ) : (
        <p>请上传一个 Markdown 文件以查看预览</p>
      )}
    </Card>
  );
};

export default MarkdownPreview;