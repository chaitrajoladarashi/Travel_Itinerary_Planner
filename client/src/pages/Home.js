import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-hero">
      <h1>Plan Your Perfect Trip</h1>
      <p>Create detailed travel itineraries, organize activities, and make your dream vacation a reality with our intuitive planning tools.</p>
      <div className="hero-buttons">
        <a href="/register" className="btn gradient">Get Started Free</a>
        <a href="/login" className="btn">Sign In</a>
      </div>
    </div>
  );
};

export default Home; 