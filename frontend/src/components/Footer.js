import React from 'react';
import { Layout } from 'antd';

const { Footer } = Layout;

const AppFooter = () => {
  return (
    <Footer style={{ textAlign: 'center' }}>
      BetterMD - Markdown Beautifier ©{new Date().getFullYear()} Created with ❤️
    </Footer>
  );
};

export default AppFooter;