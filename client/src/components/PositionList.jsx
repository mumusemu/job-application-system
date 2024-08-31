import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const PositionList = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('/api/positions')
      .then(response => {
        setPositions(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (positions.length === 0) return <div>No positions available.</div>;

  return (
    <div>
      <h1>Open Positions</h1>
      <ul>
        {positions.map(position => (
          <li key={position.id}>
            <Link to={`/positions/${position.id}`}>{position.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PositionList;

/*
 * Copyright © 2024 Selin Sezer. All rights reserved.
 */