import axios from 'axios';

// 创建axios实例
const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Markdown API
const markdownAPI = {
  processFile: (file, template = 'default') => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post(`/markdown/process?template=${template}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  processRawContent: (content, template = 'default') => {
    return apiClient.post('/markdown/process/raw', {
      content,
      template,
    });
  },
};

// Template API
const templateAPI = {
  listTemplates: () => apiClient.get('/templates'),
  listTemplatesInfo: () => apiClient.get('/templates/info'),
  getTemplatePreview: (templateName) => apiClient.get(`/templates/${templateName}`),
};

// AI API
const aiAPI = {
  getStatus: () => apiClient.get('/ai/status'),
  getTemplateRecommendation: (content) => apiClient.post('/ai/template-recommend', { content }),
  getContentSuggestions: (content) => apiClient.post('/ai/content-suggestions', { content }),
  beautifyContent: (content, template = 'default') => apiClient.post('/ai/beautify', { content, template }),
};

export const processMarkdownFile = async (file, template = 'default') => {
  try {
    const response = await markdownAPI.processFile(file, template);

    // 添加文件内容
    const fileContent = await file.text();
    return {
      ...response.data,
      markdown_content: fileContent
    };
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to process markdown file');
  }
};

export const processRawMarkdown = async (content, template = 'default') => {
  try {
    const response = await markdownAPI.processRawContent(content, template);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to process markdown content');
  }
};

export const getTemplates = async () => {
  try {
    const response = await templateAPI.listTemplates();
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch templates');
  }
};

export const getTemplatesInfo = async () => {
  try {
    const response = await templateAPI.listTemplatesInfo();
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch template information');
  }
};

export const getTemplatePreview = async (templateName) => {
  try {
    const response = await templateAPI.getTemplatePreview(templateName);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to fetch template preview');
  }
};

export const getAIStatus = async () => {
  try {
    const response = await aiAPI.getStatus();
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to get AI status');
  }
};

export const getAITemplateRecommendation = async (content) => {
  try {
    const response = await aiAPI.getTemplateRecommendation(content);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to get AI template recommendation');
  }
};

export const getAIContentSuggestions = async (content) => {
  try {
    const response = await aiAPI.getContentSuggestions(content);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to get AI content suggestions');
  }
};

export const beautifyContentWithAI = async (content, template = 'default') => {
  try {
    const response = await aiAPI.beautifyContent(content, template);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed to beautify content with AI');
  }
};

export default apiClient;