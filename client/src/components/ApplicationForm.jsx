import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';
import { Form, Input, Button, Upload, Typography, Alert, Image } from 'antd';
import { UploadOutlined, UserOutlined, MailOutlined, FileImageOutlined } from '@ant-design/icons';

const { Title } = Typography;

const ApplicationForm = () => {
  const { id } = useParams();
  const history = useHistory();
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [profileLinks, setProfileLinks] = useState(['']);
  const [file, setFile] = useState(null);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleProfileLinkChange = (index, event) => {
    const newLinks = [...profileLinks];
    newLinks[index] = event.target.value;
    setProfileLinks(newLinks);
  };

  const addProfileLink = () => {
    setProfileLinks([...profileLinks, '']);
  };

  const handleFileChange = ({ file }) => {
    if (file && file.status === 'done') {
      setFile(file.originFileObj);
    }
  };

  const handleBeforeUpload = (file) => {
    if (file) {
      setFile(file);
    }
    // Prevent auto upload
    return false;
  };

  const handleSubmit = async (values) => {
    console.log('Submitting values:', values);
    const formData = new FormData();
    formData.append('position_id', id);
    formData.append('user_name', values.userName);
    formData.append('user_email', values.userEmail);
    formData.append('cover_letter', coverLetter);
    
    profileLinks.forEach((link, index) => {
      if (link) formData.append(`profile_links[${index}]`, link);
    });
    
    if (file) {
      formData.append('file', file);
    }
    
    try {
      await axios.post('/api/applications', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess('Application submitted successfully!');
      setUserName('');
      setUserEmail('');
      setCoverLetter('');
      setProfileLinks(['']);
      setFile(null);
      history.push('/success');
    } catch (error) {
      setError('Error submitting application.');
    }
  };

  return (
    <div className="application-form">
      <Button 
        onClick={() => history.push('/positions/' + id)} 
        className="back-button"
      >
        Back to Open Positions
      </Button>
      <div className="header">
        <Title level={2} className="form-title">Apply for Position</Title>
        <Image 
          src="/header-image.jpg" 
          preview={false} 
          className="header-image" 
          alt="Gaming Background"
        />
      </div>
      {success && <Alert message="Success" description={success} type="success" showIcon className="alert" />}
      {error && <Alert message="Error" description={error} type="error" showIcon className="alert" />}
      <Form onFinish={handleSubmit} className="form-container">
        <Form.Item label={<><UserOutlined /> Name</>} name="userName" rules={[{ required: true, message: 'Please enter your name' }]}>
          <Input 
            value={userName} 
            onChange={(e) => setUserName(e.target.value)} 
            className="form-input"
          />
        </Form.Item>
        <Form.Item label={<><MailOutlined /> Email</>} name="userEmail" rules={[{ required: true, message: 'Please enter your email' }]}>
          <Input 
            type="email" 
            value={userEmail} 
            onChange={(e) => setUserEmail(e.target.value)} 
            className="form-input"
          />
        </Form.Item>
        {profileLinks.map((link, index) => (
          <Form.Item key={index} label={`Profile Link ${index + 1}`}>
            <Input 
              value={link} 
              onChange={(e) => handleProfileLinkChange(index, e)} 
              placeholder="Enter a profile link" 
              className="form-input"
            />
          </Form.Item>
        ))}
        <Button 
          type="dashed" 
          onClick={addProfileLink} 
          className="add-link-button"
        >
          Add Profile Link
        </Button>
        <Form.Item label={<><FileImageOutlined /> Resume</>}>
          <Upload
            beforeUpload={handleBeforeUpload}
            onChange={handleFileChange}
            className="upload-area"
          >
            <Button icon={<UploadOutlined />} className="upload-button">
              Upload Resume
            </Button>
          </Upload>
        </Form.Item>
        <Form.Item label={<><FileImageOutlined /> Cover Letter</>}>
          <Input.TextArea
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            className="form-input"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="submit-button">
            Submit Application
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ApplicationForm;

/*
 * Copyright © 2024 Selin Sezer. All rights reserved.
 */