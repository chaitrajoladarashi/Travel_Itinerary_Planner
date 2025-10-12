import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Welcome from './pages/Welcome';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateItinerary from './pages/CreateItinerary';
import Expenses from './pages/Expenses';

function ProtectedRoute({ children }) {
  const isAuthenticated = !!localStorage.getItem('token');
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return children;
}

function App() {
  // On every load, if not authenticated, redirect to Welcome
  React.useEffect(() => {
    const isAuthenticated = !!localStorage.getItem('token');
    if (!isAuthenticated && window.location.pathname !== '/') {
      window.location.replace('/');
    }
  }, []);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/create-itinerary" element={<ProtectedRoute><CreateItinerary /></ProtectedRoute>} />
        <Route path="/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
        {/* Optionally, <Route path="/home" element={<Home />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
