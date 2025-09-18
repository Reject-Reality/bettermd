import React, { useState } from 'react';
import axios from 'axios';

const AIToolsPanel = () => {
  const [content, setContent] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [suggestions, setSuggestions] = useState('');
  const [beautifiedContent, setBeautifiedContent] = useState('');
  const [loading, setLoading] = useState(false);

  // 检查AI服务状态
  const checkAIStatus = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/ai/status');
      alert(`AI服务状态: ${response.data.available ? '可用' : '不可用'}\n可用模型: ${response.data.models.join(', ')}`);
    } catch (error) {
      console.error('检查AI状态失败:', error);
      alert('检查AI状态失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取模板推荐
  const getTemplateRecommendations = async () => {
    if (!content.trim()) {
      alert('请输入文档内容');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('/api/ai/template-recommend', { content });
      setRecommendations(response.data.recommendations);
    } catch (error) {
      console.error('获取模板推荐失败:', error);
      alert('获取模板推荐失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取内容优化建议
  const getContentSuggestions = async () => {
    if (!content.trim()) {
      alert('请输入文档内容');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('/api/ai/content-suggestions', { content });
      setSuggestions(response.data.suggestions);
    } catch (error) {
      console.error('获取内容优化建议失败:', error);
      alert('获取内容优化建议失败');
    } finally {
      setLoading(false);
    }
  };

  // 自动美化内容
  const beautifyContent = async () => {
    if (!content.trim()) {
      alert('请输入文档内容');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('/api/ai/beautify', { 
        content,
        template: 'default'
      });
      setBeautifiedContent(response.data.beautified_content);
    } catch (error) {
      console.error('自动美化内容失败:', error);
      alert('自动美化内容失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-tools-panel">
      <h3>AI辅助工具</h3>
      
      <div className="ai-tools-section">
        <button onClick={checkAIStatus} disabled={loading}>
          {loading ? '检查中...' : '检查AI服务状态'}
        </button>
      </div>

      <div className="ai-tools-section">
        <h4>文档内容</h4>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="在此输入Markdown文档内容进行AI分析"
          rows={10}
          style={{ width: '100%' }}
        />
      </div>

      <div className="ai-tools-section">
        <button onClick={getTemplateRecommendations} disabled={loading}>
          {loading ? '推荐中...' : '获取模板推荐'}
        </button>
        {recommendations.length > 0 && (
          <div className="recommendations">
            <h4>推荐模板</h4>
            <ul>
              {recommendations.map((rec, index) => (
                <li key={index}>
                  <strong>{rec.template}</strong>: {rec.reason}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="ai-tools-section">
        <button onClick={getContentSuggestions} disabled={loading}>
          {loading ? '分析中...' : '获取内容优化建议'}
        </button>
        {suggestions && (
          <div className="suggestions">
            <h4>优化建议</h4>
            <div style={{ whiteSpace: 'pre-wrap', backgroundColor: '#f5f5f5', padding: '10px' }}>
              {suggestions}
            </div>
          </div>
        )}
      </div>

      <div className="ai-tools-section">
        <button onClick={beautifyContent} disabled={loading}>
          {loading ? '美化中...' : '自动美化内容'}
        </button>
        {beautifiedContent && (
          <div className="beautified-content">
            <h4>美化后的内容</h4>
            <div style={{ whiteSpace: 'pre-wrap', backgroundColor: '#f5f5f5', padding: '10px' }}>
              {beautifiedContent}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIToolsPanel;