import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Welcome = () => {
  const navigate = useNavigate();
  return (
    <div className="home-hero">
      <h1>Welcome to TravelPlanner</h1>
      <p>Your journey to organized, stress-free travel starts here.</p>
      <div className="hero-buttons">
        <button className="btn gradient" onClick={() => navigate('/register')}>Get Started</button>
      </div>
    </div>
  );
};

export default Welcome; 