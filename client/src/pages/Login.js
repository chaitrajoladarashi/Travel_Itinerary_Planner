import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Welcome Back</h2>
      <p>Sign in to your account to continue planning your trips</p>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>Email Address</label>
        <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required />
        <label>Password</label>
        <input type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button className="btn gradient" type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
        <div className="auth-link">Don't have an account? <a href="/register">Sign up here</a></div>
        {error && <div style={{color: 'red', marginTop: '1rem'}}>{error}</div>}
      </form>
    </div>
  );
};

export default Login; 