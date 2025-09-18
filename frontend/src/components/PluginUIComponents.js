import React from 'react';
import { Card, Button, message } from 'antd';

// 数学公式插件UI组件
export const MathPluginUI = () => {
  const insertSampleFormula = () => {
    // 在实际应用中，这里会与编辑器API交互
    message.success('已插入数学公式示例: E = mc²');
    console.log('Inserting math formula: E = mc^2');
  };

  return (
    <Card size="small" title="数学公式插件" style={{ marginBottom: 16 }}>
      <p>此插件提供LaTeX数学公式支持</p>
      <Button onClick={insertSampleFormula} size="small">
        插入示例公式
      </Button>
    </Card>
  );
};

// 代码高亮插件UI组件
export const CodeHighlightPluginUI = () => {
  const changeTheme = () => {
    // 在实际应用中，这里会更改代码高亮主题
    message.success('代码高亮主题已更改');
    console.log('Changing code highlight theme');
  };

  return (
    <Card size="small" title="代码高亮插件" style={{ marginBottom: 16 }}>
      <p>此插件为代码块提供语法高亮功能</p>
      <Button onClick={changeTheme} size="small">
        更改主题
      </Button>
    </Card>
  );
};

// 任务管理插件UI组件
export const TaskManagerPluginUI = () => {
  const exportTasks = () => {
    // 在实际应用中，这里会导出任务列表
    message.success('任务列表已导出');
    console.log('Exporting task list');
  };

  return (
    <Card size="small" title="任务管理插件" style={{ marginBottom: 16 }}>
      <p>此插件增强任务列表功能</p>
      <Button onClick={exportTasks} size="small">
        导出任务
      </Button>
    </Card>
  );
};

// 知识图谱插件UI组件
export const KnowledgeGraphPluginUI = () => {
  const refreshGraph = () => {
    // 在实际应用中，这里会刷新知识图谱
    message.success('知识图谱已刷新');
    console.log('Refreshing knowledge graph');
  };

  return (
    <Card size="small" title="知识图谱插件" style={{ marginBottom: 16 }}>
      <p>此插件提供知识图谱可视化功能</p>
      <Button onClick={refreshGraph} size="small">
        刷新图谱
      </Button>
    </Card>
  );
};