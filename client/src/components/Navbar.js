import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span role="img" aria-label="plane">✈️</span> <span className="brand">TravelPlanner</span>
      </div>
      <div className="navbar-links">
        {!isAuthenticated ? (
          <>
            <Link to="/login">Sign In</Link>
            <Link to="/register" className="signup-btn">Sign Up</Link>
          </>
        ) : (
          <>
            <div className="nav-group-tight">
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/create-itinerary">Create Trip</Link>
              <Link to="/expenses">Expenses Tracker</Link>
            </div>
            <button className="btn logout" onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 