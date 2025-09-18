import React, { createContext, useContext, useReducer } from 'react';
import {
  MathPluginUI,
  CodeHighlightPluginUI,
  TaskManagerPluginUI,
  KnowledgeGraphPluginUI
} from './PluginUIComponents';

// 插件上下文
const PluginContext = createContext();

// 插件状态管理
const pluginReducer = (state, action) => {
  switch (action.type) {
    case 'REGISTER_PLUGIN':
      return {
        ...state,
        plugins: [...state.plugins, action.plugin]
      };
    case 'UNREGISTER_PLUGIN':
      return {
        ...state,
        plugins: state.plugins.filter(plugin => plugin.id !== action.pluginId)
      };
    case 'ENABLE_PLUGIN':
      return {
        ...state,
        enabledPlugins: [...state.enabledPlugins, action.pluginId]
      };
    case 'DISABLE_PLUGIN':
      return {
        ...state,
        enabledPlugins: state.enabledPlugins.filter(id => id !== action.pluginId)
      };
    default:
      return state;
  }
};

// 插件提供者组件
export const PluginProvider = ({ children }) => {
  const [state, dispatch] = useReducer(pluginReducer, {
    plugins: [],
    enabledPlugins: []
  });

  const registerPlugin = (plugin) => {
    dispatch({ type: 'REGISTER_PLUGIN', plugin });
  };

  const unregisterPlugin = (pluginId) => {
    dispatch({ type: 'UNREGISTER_PLUGIN', pluginId });
  };

  const enablePlugin = (pluginId) => {
    dispatch({ type: 'ENABLE_PLUGIN', pluginId });
  };

  const disablePlugin = (pluginId) => {
    dispatch({ type: 'DISABLE_PLUGIN', pluginId });
  };

  const getEnabledPlugins = () => {
    return state.plugins.filter(plugin => 
      state.enabledPlugins.includes(plugin.id)
    );
  };

  const getPluginById = (pluginId) => {
    return state.plugins.find(plugin => plugin.id === pluginId);
  };

  return (
    <PluginContext.Provider value={{
      plugins: state.plugins,
      enabledPlugins: state.enabledPlugins,
      registerPlugin,
      unregisterPlugin,
      enablePlugin,
      disablePlugin,
      getEnabledPlugins,
      getPluginById
    }}>
      {children}
    </PluginContext.Provider>
  );
};

// 使用插件上下文的Hook
export const usePlugins = () => {
  const context = useContext(PluginContext);
  if (!context) {
    throw new Error('usePlugins must be used within a PluginProvider');
  }
  return context;
};

// 插件基类
export class BasePlugin {
  constructor(id, name, description) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.enabled = false;
  }

  // 插件初始化
  async init() {
    // 子类应重写此方法
  }

  // 插件启用
  async enable() {
    this.enabled = true;
    // 子类应重写此方法
  }

  // 插件禁用
  async disable() {
    this.enabled = false;
    // 子类应重写此方法
  }

  // 获取插件配置组件
  getConfigComponent() {
    return null;
  }

  // 获取插件UI组件
  getUIComponent() {
    return null;
  }
}

// 代码高亮插件
export class CodeHighlightPlugin extends BasePlugin {
  constructor() {
    super('code-highlight', '代码高亮', '为代码块提供语法高亮功能');
  }

  async init() {
    console.log('CodeHighlightPlugin initialized');
  }

  async enable() {
    super.enable();
    console.log('CodeHighlightPlugin enabled');
  }

  async disable() {
    super.disable();
    console.log('CodeHighlightPlugin disabled');
  }

  getUIComponent() {
    return CodeHighlightPluginUI;
  }
}

// 数学公式插件
export class MathPlugin extends BasePlugin {
  constructor() {
    super('math-formula', '数学公式', '支持LaTeX数学公式渲染');
  }

  async init() {
    console.log('MathPlugin initialized');
  }

  async enable() {
    super.enable();
    console.log('MathPlugin enabled');
  }

  async disable() {
    super.disable();
    console.log('MathPlugin disabled');
  }

  getUIComponent() {
    return MathPluginUI;
  }
}

// 任务管理插件
export class TaskManagerPlugin extends BasePlugin {
  constructor() {
    super('task-management', '任务管理', '增强任务列表功能，支持任务状态跟踪和提醒');
  }

  async init() {
    console.log('TaskManagerPlugin initialized');
  }

  async enable() {
    super.enable();
    console.log('TaskManagerPlugin enabled');
  }

  async disable() {
    super.disable();
    console.log('TaskManagerPlugin disabled');
  }

  getUIComponent() {
    return TaskManagerPluginUI;
  }
}

// 知识图谱插件
export class KnowledgeGraphPlugin extends BasePlugin {
  constructor() {
    super('knowledge-graph', '知识图谱', '可视化展示笔记间的关联关系，支持图谱分析');
  }

  async init() {
    console.log('KnowledgeGraphPlugin initialized');
  }

  async enable() {
    super.enable();
    console.log('KnowledgeGraphPlugin enabled');
  }

  async disable() {
    super.disable();
    console.log('KnowledgeGraphPlugin disabled');
  }

  getUIComponent() {
    return KnowledgeGraphPluginUI;
  }
}

export default PluginContext;