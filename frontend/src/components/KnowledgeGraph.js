import React, { useEffect, useRef } from 'react';
import { Card, Typography } from 'antd';

const { Title } = Typography;

// 模拟图谱数据
const mockGraphData = {
  nodes: [
    { id: '1', label: '项目规划', group: 'planning' },
    { id: '2', label: '技术选型', group: 'technical' },
    { id: '3', label: '需求分析', group: 'analysis' },
    { id: '4', label: '架构设计', group: 'technical' },
    { id: '5', label: '用户调研', group: 'analysis' },
    { id: '6', label: '前端开发', group: 'development' },
    { id: '7', label: '后端开发', group: 'development' },
  ],
  edges: [
    { from: '1', to: '2' },
    { from: '1', to: '3' },
    { from: '2', to: '4' },
    { from: '3', to: '5' },
    { from: '4', to: '6' },
    { from: '4', to: '7' },
    { from: '2', to: '6' },
    { from: '2', to: '7' },
  ]
};

const KnowledgeGraph = () => {
  const containerRef = useRef(null);
  const networkRef = useRef(null);

  useEffect(() => {
    // 检查是否已加载vis.js库
    if (typeof window !== 'undefined') {
      if (window.vis) {
        renderGraph();
      } else {
        // 动态加载vis.js库
        loadVisLibrary().then(() => {
          renderGraph();
        }).catch(err => {
          console.error('Failed to load vis.js library:', err);
        });
      }
    }

    return () => {
      // 清理函数
      if (networkRef.current) {
        networkRef.current.destroy();
        networkRef.current = null;
      }
    };
  }, []);

  const loadVisLibrary = () => {
    return new Promise((resolve, reject) => {
      // 检查是否已经加载
      if (window.vis) {
        resolve();
        return;
      }

      // 加载CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/vis-network@9.1.2/dist/vis-network.min.css';
      link.onload = () => {
        // 加载JavaScript
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/vis-network@9.1.2/dist/vis-network.min.js';
        script.onload = () => {
          resolve();
        };
        script.onerror = () => {
          reject(new Error('Failed to load vis-network JavaScript'));
        };
        document.head.appendChild(script);
      };
      link.onerror = () => {
        reject(new Error('Failed to load vis-network CSS'));
      };
      document.head.appendChild(link);
    });
  };

  const renderGraph = () => {
    if (containerRef.current && window.vis) {
      const container = containerRef.current;
      
      // 创建节点和边的数据集
      const nodes = new window.vis.DataSet(mockGraphData.nodes);
      const edges = new window.vis.DataSet(mockGraphData.edges);

      // 创建网络
      const data = { nodes, edges };
      const options = {
        nodes: {
          shape: 'dot',
          size: 16,
          font: {
            size: 12,
            face: 'Tahoma'
          }
        },
        edges: {
          width: 2,
          arrows: {
            to: { enabled: true, scaleFactor: 0.5 }
          }
        },
        physics: {
          stabilization: { iterations: 100 }
        },
        groups: {
          planning: { color: { background: '#FF9900' } },
          technical: { color: { background: '#5DADE2' } },
          analysis: { color: { background: '#58D68D' } },
          development: { color: { background: '#BB8FCE' } }
        }
      };

      // 销毁之前的网络实例（如果存在）
      if (networkRef.current) {
        networkRef.current.destroy();
      }

      // 创建网络实例
      networkRef.current = new window.vis.Network(container, data, options);
      
      // 添加点击事件
      networkRef.current.on("click", function (params) {
        if (params.nodes.length > 0) {
          const nodeId = params.nodes[0];
          const node = nodes.get(nodeId);
          console.log('Clicked node:', node);
        }
      });
    }
  };

  return (
    <Card title="知识图谱" style={{ height: '100%' }}>
      <div 
        ref={containerRef} 
        style={{ 
          width: '100%', 
          height: '400px',
          border: '1px solid #e8e8e8',
          borderRadius: '4px'
        }}
      />
    </Card>
  );
};

export default KnowledgeGraph;