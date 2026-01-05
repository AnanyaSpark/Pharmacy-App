import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import UserPortal from './components/UserPortal';
import PharmacyPortal from './components/PharmacyPortal';
import DeliveryPortal from './components/DeliveryPortal';
import UserRegister from './components/UserRegister';
import UserLogin from './components/UserLogin';
import UserDashboard from './components/UserDashboard';
import PharmacyRegister from './components/PharmacyRegister';
import PharmacyLogin from './components/PharmacyLogin';
import PharmacyDashboard from './components/PharmacyDashboard';
import DeliveryRegister from './components/DeliveryRegister';
import DeliveryLogin from './components/DeliveryLogin';
import DeliveryDashboard from './components/DeliveryDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/user-portal" element={<UserPortal />} />
          <Route path="/pharmacy-portal" element={<PharmacyPortal />} />
          <Route path="/delivery-portal" element={<DeliveryPortal />} />
          <Route path="/user/register" element={<UserRegister />} />
          <Route path="/user/login" element={<UserLogin />} />
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/pharmacy/register" element={<PharmacyRegister />} />
          <Route path="/pharmacy/login" element={<PharmacyLogin />} />
          <Route path="/pharmacy/dashboard" element={<PharmacyDashboard />} />
          <Route path="/delivery/register" element={<DeliveryRegister />} />
          <Route path="/delivery/login" element={<DeliveryLogin />} />
          <Route path="/delivery/dashboard" element={<DeliveryDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

