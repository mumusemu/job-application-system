import React, { useEffect, useState } from 'react';
import { useParams, Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { Card, Typography, Button, Skeleton, Alert } from 'antd';

const { Title, Paragraph, Text } = Typography;

const PositionDetail = () => {
  const { id } = useParams();
  const history = useHistory();
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`/api/positions/${id}`)
      .then(response => {
        setPosition(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <Skeleton active />;
  if (error) return <Alert message="Error" description={error} type="error" showIcon />;
  if (!position) return <Alert message="Position not found" type="warning" showIcon />;

  return (
    <div className="position-details-form"style={{ padding: '20px' }}>
      <Button onClick={() => history.push('/positions')} className="back-button">
        Back to Open Positions
      </Button>
      <Card
        cover={<img alt={position.title} src={position.image} />}
        actions={[
          <Link to={`/apply/${position.id}`}>
            <Button type="primary" style={{backgroundColor: '#2e32ff'}}>Apply Now</Button>
          </Link>
        ]}
      >
        <Title level={2}>{position.title}</Title>
        <Paragraph>{position.summary}</Paragraph>
        <Paragraph>
          <Text strong>Division:</Text> {position.division}
        </Paragraph>
        <Paragraph>
          <Text strong>Location:</Text> {position.location}
        </Paragraph>
        <Paragraph>
          <Text strong>Description:</Text> {position.description}
        </Paragraph>
        <Paragraph>
          <Text strong>Requirements:</Text> {position.requirements}
        </Paragraph>
        <Paragraph>
          <Text strong>Responsibilities:</Text> {position.responsibilities}
        </Paragraph>
      </Card>
    </div>
  );
};

export default PositionDetail;

/*
 * Copyright © 2024 Selin Sezer. All rights reserved.
 */