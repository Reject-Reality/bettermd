import React, { useEffect } from 'react';
import { Card, List, Switch, Button, Typography, Space } from 'antd';
import { 
  usePlugins, 
  CodeHighlightPlugin, 
  MathPlugin, 
  TaskManagerPlugin, 
  KnowledgeGraphPlugin 
} from '../components/PluginSystem';

const { Title, Text } = Typography;

const PluginManager = () => {
  const { 
    plugins, 
    enabledPlugins, 
    registerPlugin, 
    unregisterPlugin, 
    enablePlugin, 
    disablePlugin 
  } = usePlugins();

  // 注册示例插件
  useEffect(() => {
    // 在实际应用中，这里会从服务器加载插件或从本地存储恢复插件状态
    const pluginInstances = [
      new CodeHighlightPlugin(),
      new MathPlugin(),
      new TaskManagerPlugin(),
      new KnowledgeGraphPlugin()
    ];

    pluginInstances.forEach(plugin => {
      if (!plugins.find(p => p.id === plugin.id)) {
        registerPlugin(plugin);
      }
    });
  }, [plugins, registerPlugin]);

  const handlePluginToggle = async (pluginId, enabled) => {
    if (enabled) {
      await enablePlugin(pluginId);
      // 启用插件后初始化
      const plugin = plugins.find(p => p.id === pluginId);
      if (plugin) {
        await plugin.enable();
      }
    } else {
      await disablePlugin(pluginId);
      // 禁用插件
      const plugin = plugins.find(p => p.id === pluginId);
      if (plugin) {
        await plugin.disable();
      }
    }
  };

  // 插件数据用于显示
  const pluginDisplayData = [
    {
      id: 'code-highlight',
      name: '代码高亮插件',
      description: '为代码块提供语法高亮功能，支持多种编程语言',
      version: '1.0.0',
      author: 'BetterMD Team'
    },
    {
      id: 'math-formula',
      name: '数学公式插件',
      description: '支持LaTeX数学公式渲染，提供公式编辑器',
      version: '1.2.1',
      author: 'BetterMD Team'
    },
    {
      id: 'task-management',
      name: '任务管理插件',
      description: '增强任务列表功能，支持任务状态跟踪和提醒',
      version: '1.1.0',
      author: 'BetterMD Team'
    },
    {
      id: 'knowledge-graph',
      name: '知识图谱插件',
      description: '可视化展示笔记间的关联关系，支持图谱分析',
      version: '2.0.3',
      author: 'BetterMD Team'
    }
  ];

  return (
    <Card title="插件管理">
      <List
        dataSource={pluginDisplayData}
        renderItem={plugin => {
          const isEnabled = enabledPlugins.includes(plugin.id);
          return (
            <List.Item
              actions={[
                <Switch
                  checked={isEnabled}
                  onChange={checked => handlePluginToggle(plugin.id, checked)}
                  checkedChildren="启用"
                  unCheckedChildren="禁用"
                />
              ]}
            >
              <List.Item.Meta
                title={
                  <Space>
                    <Text strong>{plugin.name}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      v{plugin.version}
                    </Text>
                  </Space>
                }
                description={
                  <div>
                    <Text>{plugin.description}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      作者: {plugin.author}
                    </Text>
                  </div>
                }
              />
            </List.Item>
          );
        }}
      />
      
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Button type="primary">安装新插件</Button>
      </div>
    </Card>
  );
};

export default PluginManager;