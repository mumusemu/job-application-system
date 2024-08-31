import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu, Button } from 'antd';
import { HomeOutlined, FileAddOutlined, LogoutOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';

const { Sider } = Layout;

const Sidebar = ({ collapsed, toggleCollapsed }) => {

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    window.location.assign(
      `http://localhost:3000/admindashboard`
    );
  };

  return (
    <Sider 
      width={250} 
      className={`sidebar ${collapsed ? 'collapsed' : ''}`} 
      theme="light"
      collapsed={collapsed}
      onCollapse={toggleCollapsed}
    >
      <div className="logo">
        {!collapsed && (
          <div className="logo-content">
            <h2>Admin Dashboard</h2>
          </div>
        )}
        <Button 
          type="text" 
          icon={collapsed ? <MenuUnfoldOutlined style={{color:'white'}}/> : <MenuFoldOutlined style={{color:'white'}}/>} 
          onClick={toggleCollapsed}
          className="collapse-button"
        />
      </div>
      {!collapsed && (
        <Menu theme="light" mode="inline" defaultSelectedKeys={['1']} >
          <Menu.Item key="1" icon={<HomeOutlined />}>
            <Link to="/admindashboard">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<FileAddOutlined />}>
            <Link to="/addposition">Add Position</Link>
          </Menu.Item>
        </Menu>
      )}
      {!collapsed && 
        (<Button
          type="text"
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          className="logout-button"
        >
        </Button>)}
    </Sider>
  );
};

export default Sidebar;

/*
 * Copyright © 2024 Selin Sezer. All rights reserved.
 */