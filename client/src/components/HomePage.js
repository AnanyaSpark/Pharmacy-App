import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function HomePage() {
  return (
    <div className="container" style={{ paddingTop: '50px' }}>
      <div className="card" style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          🏥 Pharmacy Web App
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '40px' }}>
          Your one-stop solution for pharmaceutical needs and mental health support
        </p>
        
        <div className="grid" style={{ marginTop: '40px' }}>
          <div className="card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <h2 style={{ marginBottom: '20px' }}>👤 User Portal</h2>
            <p style={{ marginBottom: '30px' }}>
              Browse medicines, manage your health, and get mood support
            </p>
            <Link to="/user-portal" className="btn" style={{ background: 'white', color: '#667eea' }}>
              Enter User Portal
            </Link>
          </div>

          <div className="card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <h2 style={{ marginBottom: '20px' }}>💊 Pharmacy Portal</h2>
            <p style={{ marginBottom: '30px' }}>
              Manage your inventory, medicines, and orders
            </p>
            <Link to="/pharmacy-portal" className="btn" style={{ background: 'white', color: '#f5576c' }}>
              Enter Pharmacy Portal
            </Link>
          </div>

          <div className="card" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
            <h2 style={{ marginBottom: '20px' }}>🚚 Delivery Portal</h2>
            <p style={{ marginBottom: '30px' }}>
              Accept and manage delivery orders
            </p>
            <Link to="/delivery-portal" className="btn" style={{ background: 'white', color: '#4facfe' }}>
              Enter Delivery Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;

