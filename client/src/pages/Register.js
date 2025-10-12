import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      setOtpStep(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setOtpError('');
    setOtpLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'OTP verification failed');
      setSuccessMsg('Email verified! You can now log in.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setOtpError(err.message);
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Create Account</h2>
      <p>Join TravelPlanner to start planning your dream trips!</p>
      {!otpStep ? (
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>Email Address</label>
          <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required />
          <label>Password</label>
          <input type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required />
          <label>Confirm Password</label>
          <input type="password" placeholder="Confirm your password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
          <button className="btn gradient" type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Account'}</button>
          {error && <div style={{color: 'red', marginTop: '1rem'}}>{error}</div>}
        </form>
      ) : (
        <form className="auth-form" onSubmit={handleOtpSubmit}>
          <label>Enter OTP sent to your email</label>
          <input type="text" placeholder="Enter OTP" value={otp} onChange={e => setOtp(e.target.value)} required maxLength={6} />
          <button className="btn gradient" type="submit" disabled={otpLoading}>{otpLoading ? 'Verifying...' : 'Verify OTP'}</button>
          {otpError && <div style={{color: 'red', marginTop: '1rem'}}>{otpError}</div>}
          {successMsg && <div style={{color: 'green', marginTop: '1rem'}}>{successMsg}</div>}
        </form>
      )}
    </div>
  );
};

export default Register; 