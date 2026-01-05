import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function DeliveryPortal() {
  return (
    <div className="container" style={{ paddingTop: '50px' }}>
      <div className="card">
        <Link to="/" className="btn btn-secondary" style={{ marginBottom: '20px' }}>
          ← Back to Home
        </Link>
        <h1 style={{ marginBottom: '30px' }}>Delivery Agent Portal</h1>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/delivery/register" className="btn btn-primary">
            Register
          </Link>
          <Link to="/delivery/login" className="btn btn-success">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default DeliveryPortal;

