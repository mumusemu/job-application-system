// components/AdminLayout.jsx
import React, { useState } from 'react';
import { Layout } from 'antd';
import Sidebar from './Sidebar';

const { Content } = Layout;

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar collapsed={collapsed} toggleCollapsed={toggleCollapsed} />
      <Layout style={{ padding: '0 24px', minHeight: 'calc(100vh - 64px)' }}>
        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;

/*
 * Copyright © 2024 Selin Sezer. All rights reserved.
 */