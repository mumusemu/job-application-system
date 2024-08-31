import React from 'react';
import { Button, Typography, Divider, Space } from 'antd';
import { useHistory } from 'react-router-dom';
import { CheckCircleOutlined } from '@ant-design/icons';
import * as confetti from 'confettis'
const { Title, Paragraph } = Typography;

const SuccessPage = () => {
  const history = useHistory();
  const x = 0.5
  const y = 0.7
  
  // Confetti
  confetti.create({
      x: x,
      y: y,
      count: 100,
      gravity: 1,
      ticks: -1,
      scale: [ 0.5, 0.7, 0.8 ],
      speed: 32,
      decay: 0.93,
      shapes: [ 'square', 'ellipse' ]
  })
  
  // Particles
  confetti.create({
      x: x,
      y: y,
      count: 10,
      gravity: 1.5,
      ticks: -1,
      scale: 0.1,
      speed: 42,
      decay: 0.93,
      shapes: [ 'circle' ]
  })
  return (
    <div style={{ 
      position: 'relative',
      padding: '40px', 
      textAlign: 'center', 
      backgroundColor: '#f0f2f5', 
      minHeight: '100vh',
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center',
      alignItems: 'center',
    }}>

      <CheckCircleOutlined style={{ fontSize: '64px', color: '#52c41a', zIndex: 1 }} />
      <Title level={2} style={{ marginTop: '20px', zIndex: 1 }}>Application Submitted Successfully!</Title>
      <Paragraph style={{ margin: '20px 0', zIndex: 1 }}>
        Your application has been successfully submitted. We will review it and get back to you soon.
      </Paragraph>
      <Divider />
      
      <Space>
        <Button 
          onClick={() => history.push('/positions')} 
          type="primary" 
          size="large" 
          style={{ 
            backgroundColor: '#1890ff', 
            borderColor: '#1890ff', 
            borderRadius: '8px',
            zIndex: 1
          }}>
          Back to Open Positions
        </Button>
        <Button 
          onClick={() => history.push('/')} 
          size="large" 
          style={{ zIndex: 1 }}>
          Return to Home
        </Button>
      </Space>
    </div>
  );
};

export default SuccessPage;

/*
 * Copyright © 2024 Selin Sezer. All rights reserved.
 */