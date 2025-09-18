import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';

const { Header } = Layout;

const AppHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      label: '首页',
    },
    {
      key: '/editor',
      label: '编辑器',
    },
    {
      key: '/templates',
      label: '模板',
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  // 获取当前激活的菜单项
  const getActiveKey = () => {
    if (location.pathname === '/') return '/';
    if (location.pathname.startsWith('/editor')) return '/editor';
    if (location.pathname.startsWith('/templates')) return '/templates';
    return '/';
  };

  return (
    <Header>
      <div className="logo" style={{ float: 'left', color: 'white', fontSize: '18px', fontWeight: 'bold', marginRight: '20px' }}>
        BetterMD
      </div>
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[getActiveKey()]}
        items={menuItems}
        onClick={handleMenuClick}
        style={{ minWidth: 0 }}
      />
    </Header>
  );
};

export default AppHeader;