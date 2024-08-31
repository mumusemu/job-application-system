import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { List, Card, Typography, Space, Spin, Button } from 'antd';

const { Title } = Typography;

const OpenPositions = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  // State to track expanded summaries
  const [expandedSummaries, setExpandedSummaries] = useState({}); 

  useEffect(() => {
    axios.get('/api/positions')
      .then(response => {
        setPositions(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('There was an error fetching the positions!', error);
        setLoading(false);
      });
  }, []);

  const toggleSummary = (id) => {
    setExpandedSummaries(prevState => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };

  return (
    <div className="open-positions-container">
      <Title level={2} style={{ padding: 20 }}>Open Positions</Title>
      {loading ? (
        <div className="loader-container">
          <Spin size="large" tip="Loading positions..." />
        </div>
      ) : positions.length > 0 ? (
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 2,
            lg: 3,
            xl: 4,
            xxl: 4,
          }}
          dataSource={positions}
          renderItem={position => {
            const isExpanded = expandedSummaries[position.id];
            const shouldTruncate = position.summary.length > 200;
            const summaryText = shouldTruncate && !isExpanded ? (
              <>
                {position.summary.slice(0, 200)} 
                <Button type="link" onClick={() => toggleSummary(position.id)} style={{ padding: 0, margin: 0 }}>
                  More
                </Button>
              </>
            ) : (
              <>
                {position.summary} 
                {shouldTruncate && (
                  <Button type="link" onClick={() => toggleSummary(position.id)} style={{ padding: 0, margin: 0 }}>
                    Less
                  </Button>
                )}
              </>
            );

            return (
              <List.Item>
                <Card 
                  title={position.title} 
                  bordered={false}
                  className="position-card"
                  extra={<Link to={`/positions/${position.id}`} className="details-button">View Details</Link>}
                >
                  <Space direction="vertical" className="position-info">
                    <p><strong>Location:</strong> {position.location}</p>
                    <p><strong>Division:</strong> {position.division}</p>
                    <p><strong>Summary:</strong> {summaryText}</p>
                  </Space>
                </Card>
              </List.Item>
            );
          }}
        />
      ) : (
        <p className="no-positions">No positions available right now. Check back later!</p>
      )}
    </div>
  );
};

export default OpenPositions;

/*
 * Copyright © 2024 Selin Sezer. All rights reserved.
 */