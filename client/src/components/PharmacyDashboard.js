import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

function PharmacyDashboard() {
  const [pharmacy, setPharmacy] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showAddMedicine, setShowAddMedicine] = useState(false);
  const [medicineForm, setMedicineForm] = useState({
    name: '',
    price: '',
    quantity: '',
    expiration_date: '',
    description: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const pharmacyData = JSON.parse(localStorage.getItem('pharmacy'));
    if (!pharmacyData) {
      navigate('/pharmacy/login');
      return;
    }
    setPharmacy(pharmacyData);
    loadMedicines();
    loadOrders();
  }, [navigate]);

  const loadMedicines = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/medicines/pharmacy/${pharmacy?.id}`);
      setMedicines(response.data);
    } catch (error) {
      console.error('Error loading medicines:', error);
    }
  };

  const loadOrders = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/orders/pharmacy/${pharmacy?.id}`);
      setOrders(response.data);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const handleAddMedicine = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/medicines', {
        ...medicineForm,
        pharmacy_id: pharmacy.id,
        price: parseFloat(medicineForm.price),
        quantity: parseInt(medicineForm.quantity)
      });
      alert('Medicine added successfully!');
      setMedicineForm({
        name: '',
        price: '',
        quantity: '',
        expiration_date: '',
        description: ''
      });
      setShowAddMedicine(false);
      loadMedicines();
    } catch (error) {
      console.error('Error adding medicine:', error);
      alert('Error adding medicine');
    }
  };

  const handleUpdateMedicine = async (medicine) => {
    const name = prompt('Medicine Name:', medicine.name);
    const price = prompt('Price:', medicine.price);
    const quantity = prompt('Quantity:', medicine.quantity);
    const expiration_date = prompt('Expiration Date (YYYY-MM-DD):', medicine.expiration_date);
    const description = prompt('Description:', medicine.description || '');

    if (name && price && quantity && expiration_date) {
      try {
        await axios.put(`http://localhost:5000/api/medicines/${medicine.id}`, {
          name,
          price: parseFloat(price),
          quantity: parseInt(quantity),
          expiration_date,
          description: description || ''
        });
        alert('Medicine updated successfully!');
        loadMedicines();
      } catch (error) {
        console.error('Error updating medicine:', error);
        alert('Error updating medicine');
      }
    }
  };

  const handleDeleteMedicine = async (medicineId) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      try {
        await axios.delete(`http://localhost:5000/api/medicines/${medicineId}`);
        alert('Medicine deleted successfully!');
        loadMedicines();
      } catch (error) {
        console.error('Error deleting medicine:', error);
        alert('Error deleting medicine');
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('pharmacy');
    navigate('/');
  };

  if (!pharmacy) return null;

  return (
    <div className="container" style={{ paddingTop: '20px' }}>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1>Pharmacy Dashboard - {pharmacy.name}</h1>
          <button onClick={logout} className="btn btn-danger">Logout</button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <button
            className="btn btn-primary"
            onClick={() => setShowAddMedicine(!showAddMedicine)}
          >
            {showAddMedicine ? 'Cancel' : 'Add New Medicine'}
          </button>
        </div>

        {showAddMedicine && (
          <div className="card" style={{ marginBottom: '20px' }}>
            <h2>Add New Medicine</h2>
            <form onSubmit={handleAddMedicine}>
              <div className="form-group">
                <label>Medicine Name</label>
                <input
                  type="text"
                  value={medicineForm.name}
                  onChange={(e) => setMedicineForm({ ...medicineForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={medicineForm.price}
                  onChange={(e) => setMedicineForm({ ...medicineForm, price: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  value={medicineForm.quantity}
                  onChange={(e) => setMedicineForm({ ...medicineForm, quantity: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Expiration Date (YYYY-MM-DD)</label>
                <input
                  type="date"
                  value={medicineForm.expiration_date}
                  onChange={(e) => setMedicineForm({ ...medicineForm, expiration_date: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description (Optional)</label>
                <textarea
                  value={medicineForm.description}
                  onChange={(e) => setMedicineForm({ ...medicineForm, description: e.target.value })}
                  rows="3"
                />
              </div>
              <button type="submit" className="btn btn-success">Add Medicine</button>
            </form>
          </div>
        )}

        <h2>My Medicines</h2>
        <div className="grid">
          {medicines.map(medicine => (
            <div key={medicine.id} className="card">
              <h3>{medicine.name}</h3>
              <p><strong>Price:</strong> ${medicine.price}</p>
              <p><strong>Quantity:</strong> {medicine.quantity}</p>
              <p><strong>Expiration Date:</strong> {medicine.expiration_date}</p>
              {medicine.description && <p>{medicine.description}</p>}
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  className="btn btn-primary"
                  onClick={() => handleUpdateMedicine(medicine)}
                >
                  Update
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteMedicine(medicine.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <h2 style={{ marginTop: '40px' }}>Orders</h2>
        {orders.length === 0 ? (
          <p>No orders yet</p>
        ) : (
          orders.map(order => (
            <div key={order.id} className="card" style={{ marginBottom: '20px' }}>
              <h3>Order #{order.id}</h3>
              <p><strong>Customer:</strong> {order.user_name}</p>
              <p><strong>Address:</strong> {order.user_address}</p>
              <p><strong>Phone:</strong> {order.user_phone}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Payment Status:</strong> {order.payment_status}</p>
              <p><strong>Total:</strong> ${order.total_amount}</p>
              <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
              {order.delivery_agent_name && (
                <p><strong>Delivery Agent:</strong> {order.delivery_agent_name}</p>
              )}
              
              <h4>Items:</h4>
              <ul>
                {order.items?.map((item, idx) => (
                  <li key={idx}>{item.medicine_name} - Qty: {item.quantity} - ${item.price}</li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PharmacyDashboard;

