import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Editor from './pages/Editor';
import { PluginProvider } from './components/PluginSystem';
import './App.css';

const { Content } = Layout;

function App() {
  return (
    <PluginProvider>
      <Router>
        <Layout className="layout" style={{ minHeight: '100vh' }}>
          <Header />
          <Content style={{ padding: '24px', flex: 1 }}>
            <div className="site-layout-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/editor" element={<Editor />} />
              </Routes>
            </div>
          </Content>
          <Footer />
        </Layout>
      </Router>
    </PluginProvider>
  );
}

export default App;