import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

function DeliveryDashboard() {
  const [delivery, setDelivery] = useState(null);
  const [availableOrders, setAvailableOrders] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const deliveryData = JSON.parse(localStorage.getItem('delivery'));
    if (!deliveryData) {
      navigate('/delivery/login');
      return;
    }
    setDelivery(deliveryData);
    loadAvailableOrders();
    loadMyOrders();
  }, [navigate]);

  const loadAvailableOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/orders/delivery/available');
      setAvailableOrders(response.data);
    } catch (error) {
      console.error('Error loading available orders:', error);
    }
  };

  const loadMyOrders = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/orders/delivery/${delivery?.id}`);
      setMyOrders(response.data);
    } catch (error) {
      console.error('Error loading my orders:', error);
    }
  };

  const acceptOrder = async (orderId) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/accept`, {
        delivery_agent_id: delivery.id
      });
      alert('Order accepted successfully!');
      loadAvailableOrders();
      loadMyOrders();
    } catch (error) {
      console.error('Error accepting order:', error);
      alert('Error accepting order');
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, {
        status: status
      });
      alert(`Order status updated to ${status}`);
      loadMyOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error updating order status');
    }
  };

  const logout = () => {
    localStorage.removeItem('delivery');
    navigate('/');
  };

  if (!delivery) return null;

  return (
    <div className="container" style={{ paddingTop: '20px' }}>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1>Delivery Agent Dashboard - {delivery.name}</h1>
          <button onClick={logout} className="btn btn-danger">Logout</button>
        </div>

        <h2>Available Orders</h2>
        {availableOrders.length === 0 ? (
          <p>No available orders</p>
        ) : (
          availableOrders.map(order => (
            <div key={order.id} className="card" style={{ marginBottom: '20px' }}>
              <h3>Order #{order.id}</h3>
              <p><strong>Customer:</strong> {order.user_name}</p>
              <p><strong>Delivery Address:</strong> {order.user_address}</p>
              <p><strong>Phone:</strong> {order.user_phone}</p>
              <p><strong>Pharmacy:</strong> {order.pharmacy_name}</p>
              <p><strong>Pharmacy Address:</strong> {order.pharmacy_address}</p>
              <p><strong>Total:</strong> ${order.total_amount}</p>
              
              <h4>Items:</h4>
              <ul>
                {order.items?.map((item, idx) => (
                  <li key={idx}>{item.medicine_name} - Qty: {item.quantity}</li>
                ))}
              </ul>

              <button
                className="btn btn-success"
                onClick={() => acceptOrder(order.id)}
              >
                Accept Order
              </button>
            </div>
          ))
        )}

        <h2 style={{ marginTop: '40px' }}>My Orders</h2>
        {myOrders.length === 0 ? (
          <p>No orders assigned to you</p>
        ) : (
          myOrders.map(order => (
            <div key={order.id} className="card" style={{ marginBottom: '20px' }}>
              <h3>Order #{order.id}</h3>
              <p><strong>Customer:</strong> {order.user_name}</p>
              <p><strong>Delivery Address:</strong> {order.user_address}</p>
              <p><strong>Phone:</strong> {order.user_phone}</p>
              <p><strong>Pharmacy:</strong> {order.pharmacy_name}</p>
              <p><strong>Pharmacy Address:</strong> {order.pharmacy_address}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Total:</strong> ${order.total_amount}</p>
              
              <h4>Items:</h4>
              <ul>
                {order.items?.map((item, idx) => (
                  <li key={idx}>{item.medicine_name} - Qty: {item.quantity}</li>
                ))}
              </ul>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                {order.status === 'accepted' && (
                  <button
                    className="btn btn-primary"
                    onClick={() => updateOrderStatus(order.id, 'picked_up')}
                  >
                    Mark as Picked Up
                  </button>
                )}
                {order.status === 'picked_up' && (
                  <button
                    className="btn btn-primary"
                    onClick={() => updateOrderStatus(order.id, 'in_transit')}
                  >
                    Mark as In Transit
                  </button>
                )}
                {order.status === 'in_transit' && (
                  <button
                    className="btn btn-success"
                    onClick={() => updateOrderStatus(order.id, 'delivered')}
                  >
                    Mark as Delivered
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DeliveryDashboard;

