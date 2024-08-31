import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to the Job Application System</h1>
      <Link to="/positions">View Open Positions</Link>
    </div>
  );
};

export default HomePage;

/*
 * Copyright © 2024 Selin Sezer. All rights reserved.
 */
