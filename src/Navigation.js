// Navigation.js

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navigation = () => {
  const navigate = useNavigate();

  const handleButtonClick = (path) => {
    navigate(path);
  };

  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          {/* Add more navigation links as needed */}
        </ul>
      </nav>
      <button onClick={() => handleButtonClick('/')}>Go to Home</button>
      <button onClick={() => handleButtonClick('/about')}>Go to About</button>
      {/* Add more buttons as needed */}
    </div>
  );
};

export default Navigation;
