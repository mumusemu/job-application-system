import React, { useState } from 'react';
import { Form, Input, Button, message, Typography, Divider } from 'antd';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const { Title } = Typography;

const AdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const history = useHistory();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/admin/login', values);
      sessionStorage.setItem('token', response.data.token);
      message.success('Login successful!');
    } catch (error) {
      message.error('Invalid username or password');
    } finally {
      setLoading(false);
      window.location.assign(
        `http://localhost:3000/admindashboard`
      );
    }
  };

  return (
    
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Admin Login</h2>
        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          className="login-form"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input className="login-input" placeholder="Username" />
          </Form.Item>
          <Form.Item
            style={{backgroundColor:'#fff', borderRadius:'5px'}}
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password className="login-input-password" placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-button">
              <div style={{marginBottom:20}}>Log In</div>
            </Button>
          </Form.Item>
        </Form>
        <Divider />
      </div>
    </div>
  );
};

export default AdminLogin;

/*
 * Copyright © 2024 Selin Sezer. All rights reserved.
 */