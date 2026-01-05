import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

function PharmacyLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        ...formData,
        type: 'pharmacy'
      });
      localStorage.setItem('pharmacy', JSON.stringify(response.data.user));
      navigate('/pharmacy/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="container" style={{ paddingTop: '50px' }}>
      <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <Link to="/pharmacy-portal" className="btn btn-secondary" style={{ marginBottom: '20px' }}>
          ← Back
        </Link>
        <h1 style={{ marginBottom: '30px' }}>Pharmacy Login</h1>
        
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Login
          </button>
        </form>

        <p style={{ marginTop: '20px', textAlign: 'center' }}>
          Don't have an account? <Link to="/pharmacy/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}

export default PharmacyLogin;

