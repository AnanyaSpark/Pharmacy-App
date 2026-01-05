import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

function UserDashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [medicines, setMedicines] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [moodData, setMoodData] = useState(null);
  const [selectedMood, setSelectedMood] = useState('');
  const [showFeedback, setShowFeedback] = useState(null);
  const [feedback, setFeedback] = useState({ rating: 5, comment: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) {
      navigate('/user/login');
      return;
    }
    setUser(userData);
    loadMedicines();
    loadOrders();
    loadReminders();
  }, [navigate]);

  const loadMedicines = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/medicines');
      setMedicines(response.data);
    } catch (error) {
      console.error('Error loading medicines:', error);
    }
  };

  const loadOrders = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/orders/user/${user?.id}`);
      setOrders(response.data);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const loadReminders = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/reminders/user/${user?.id}`);
      setReminders(response.data);
    } catch (error) {
      console.error('Error loading reminders:', error);
    }
  };

  const handleMoodSelect = async (mood) => {
    setSelectedMood(mood);
    try {
      const response = await axios.get(`http://localhost:5000/api/mood/all/${mood}`);
      setMoodData(response.data);
    } catch (error) {
      console.error('Error loading mood data:', error);
    }
  };

  const addToCart = (medicine) => {
    const existingItem = cart.find(item => item.id === medicine.id);
    if (existingItem) {
      if (existingItem.quantity < medicine.quantity) {
        setCart(cart.map(item =>
          item.id === medicine.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      }
    } else {
      setCart([...cart, { ...medicine, quantity: 1 }]);
    }
  };

  const removeFromCart = (medicineId) => {
    setCart(cart.filter(item => item.id !== medicineId));
  };

  const updateCartQuantity = (medicineId, quantity) => {
    setCart(cart.map(item =>
      item.id === medicineId ? { ...item, quantity } : item
    ));
  };

  const placeOrder = async () => {
    if (cart.length === 0) return;

    // Group by pharmacy
    const pharmacyGroups = {};
    cart.forEach(item => {
      if (!pharmacyGroups[item.pharmacy_id]) {
        pharmacyGroups[item.pharmacy_id] = [];
      }
      pharmacyGroups[item.pharmacy_id].push({
        medicine_id: item.id,
        quantity: item.quantity,
        price: item.price
      });
    });

    // Create orders for each pharmacy
    for (const [pharmacyId, items] of Object.entries(pharmacyGroups)) {
      const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      try {
        await axios.post('http://localhost:5000/api/orders', {
          user_id: user.id,
          pharmacy_id: pharmacyId,
          items: items,
          total_amount: totalAmount
        });
      } catch (error) {
        console.error('Error placing order:', error);
        alert('Error placing order');
        return;
      }
    }

    setCart([]);
    alert('Order placed successfully! Please proceed to payment.');
    loadOrders();
    setActiveTab('orders');
  };

  const processPayment = async (orderId) => {
    try {
      await axios.post(`http://localhost:5000/api/orders/${orderId}/payment`, {
        payment_id: `PAY_${Date.now()}`
      });
      alert('Payment successful!');
      loadOrders();
      setShowFeedback(orderId);
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Payment failed');
    }
  };

  const submitFeedback = async (orderId) => {
    try {
      await axios.post(`http://localhost:5000/api/orders/${orderId}/feedback`, {
        user_id: user.id,
        rating: feedback.rating,
        comment: feedback.comment
      });
      alert('Thank you for your feedback!');
      setShowFeedback(null);
      setFeedback({ rating: 5, comment: '' });
      loadOrders();
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const addReminder = async (medicineName) => {
    const reminderTime = prompt('Enter reminder time (e.g., 09:00):');
    const frequency = prompt('Enter frequency (daily/weekly):', 'daily');
    
    if (reminderTime && frequency) {
      try {
        await axios.post('http://localhost:5000/api/reminders', {
          user_id: user.id,
          medicine_name: medicineName,
          reminder_time: reminderTime,
          frequency: frequency
        });
        alert('Reminder added successfully!');
        loadReminders();
      } catch (error) {
        console.error('Error adding reminder:', error);
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) return null;

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="container" style={{ paddingTop: '20px' }}>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1>Welcome, {user.name}!</h1>
          <button onClick={logout} className="btn btn-danger">Logout</button>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <button
            className={`btn ${activeTab === 'home' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('home')}
          >
            Home
          </button>
          <button
            className={`btn ${activeTab === 'mood' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('mood')}
          >
            Mood & Mental Health
          </button>
          <button
            className={`btn ${activeTab === 'medicines' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('medicines')}
          >
            Buy Medicines
          </button>
          <button
            className={`btn ${activeTab === 'cart' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('cart')}
          >
            Cart ({cart.length})
          </button>
          <button
            className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('orders')}
          >
            My Orders
          </button>
          <button
            className={`btn ${activeTab === 'reminders' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('reminders')}
          >
            Reminders
          </button>
        </div>

        {activeTab === 'home' && (
          <div>
            <h2>Choose an option:</h2>
            <div className="grid">
              <div className="card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('mood')}>
                <h3>🧘 Mood & Mental Health</h3>
                <p>Get quotes and exercises based on your mood</p>
              </div>
              <div className="card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('medicines')}>
                <h3>💊 Buy Pharmaceutical Necessities</h3>
                <p>Browse and order medicines from nearby pharmacies</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'mood' && (
          <div>
            <h2>Mood & Mental Health Support</h2>
            <div style={{ marginBottom: '20px' }}>
              <p>How are you feeling today?</p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                {['happy', 'sad', 'anxious', 'angry', 'stressed', 'neutral'].map(mood => (
                  <button
                    key={mood}
                    className="btn btn-primary"
                    onClick={() => handleMoodSelect(mood)}
                  >
                    {mood.charAt(0).toUpperCase() + mood.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {moodData && (
              <div className="card">
                <h3>Quote for {moodData.mood} mood:</h3>
                <p style={{ fontSize: '1.2rem', fontStyle: 'italic', margin: '20px 0' }}>
                  "{moodData.quote}"
                </p>

                <h3 style={{ marginTop: '30px' }}>Recommended Exercises:</h3>
                <div className="grid">
                  {moodData.exercises.map((exercise, idx) => (
                    <div key={idx} className="card">
                      <h4>{exercise.name}</h4>
                      <p>{exercise.description}</p>
                      <p><strong>Duration:</strong> {exercise.duration}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'medicines' && (
          <div>
            <h2>Available Medicines</h2>
            <div className="grid">
              {medicines.map(medicine => (
                <div key={medicine.id} className="card">
                  <h3>{medicine.name}</h3>
                  <p><strong>Pharmacy:</strong> {medicine.pharmacy_name}</p>
                  <p><strong>Price:</strong> ${medicine.price}</p>
                  <p><strong>Quantity Available:</strong> {medicine.quantity}</p>
                  <p><strong>Expiration Date:</strong> {medicine.expiration_date}</p>
                  {medicine.description && <p>{medicine.description}</p>}
                  <button
                    className="btn btn-success"
                    onClick={() => addToCart(medicine)}
                    disabled={medicine.quantity === 0}
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'cart' && (
          <div>
            <h2>Shopping Cart</h2>
            {cart.length === 0 ? (
              <p>Your cart is empty</p>
            ) : (
              <>
                {cart.map(item => (
                  <div key={item.id} className="card" style={{ marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h3>{item.name}</h3>
                        <p>Price: ${item.price} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}</p>
                        <p>Pharmacy: {item.pharmacy_name}</p>
                      </div>
                      <div>
                        <input
                          type="number"
                          min="1"
                          max={item.quantity}
                          value={item.quantity}
                          onChange={(e) => updateCartQuantity(item.id, parseInt(e.target.value))}
                          style={{ width: '60px', marginRight: '10px' }}
                        />
                        <button
                          className="btn btn-danger"
                          onClick={() => removeFromCart(item.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="card">
                  <h3>Total: ${cartTotal.toFixed(2)}</h3>
                  <button className="btn btn-primary" onClick={placeOrder}>
                    Place Order
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <h2>My Orders</h2>
            {orders.length === 0 ? (
              <p>No orders yet</p>
            ) : (
              orders.map(order => (
                <div key={order.id} className="card" style={{ marginBottom: '20px' }}>
                  <h3>Order #{order.id}</h3>
                  <p><strong>Pharmacy:</strong> {order.pharmacy_name}</p>
                  <p><strong>Status:</strong> {order.status}</p>
                  <p><strong>Payment Status:</strong> {order.payment_status}</p>
                  <p><strong>Total:</strong> ${order.total_amount}</p>
                  <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
                  
                  <h4>Items:</h4>
                  <ul>
                    {order.items?.map((item, idx) => (
                      <li key={idx}>{item.medicine_name} - Qty: {item.quantity} - ${item.price}</li>
                    ))}
                  </ul>

                  {order.payment_status === 'pending' && (
                    <button
                      className="btn btn-success"
                      onClick={() => processPayment(order.id)}
                    >
                      Pay Now
                    </button>
                  )}

                  {order.payment_status === 'paid' && order.status === 'delivered' && !showFeedback && (
                    <button
                      className="btn btn-primary"
                      onClick={() => setShowFeedback(order.id)}
                    >
                      Give Feedback
                    </button>
                  )}

                  {showFeedback === order.id && (
                    <div className="card" style={{ marginTop: '20px' }}>
                      <h4>Feedback</h4>
                      <div className="form-group">
                        <label>Rating (1-5)</label>
                        <input
                          type="number"
                          min="1"
                          max="5"
                          value={feedback.rating}
                          onChange={(e) => setFeedback({ ...feedback, rating: parseInt(e.target.value) })}
                        />
                      </div>
                      <div className="form-group">
                        <label>Comment</label>
                        <textarea
                          value={feedback.comment}
                          onChange={(e) => setFeedback({ ...feedback, comment: e.target.value })}
                          rows="3"
                        />
                      </div>
                      <button
                        className="btn btn-success"
                        onClick={() => submitFeedback(order.id)}
                      >
                        Submit Feedback
                      </button>
                    </div>
                  )}

                  {order.status === 'delivered' && (
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        const medicineNames = order.items?.map(item => item.medicine_name).join(', ');
                        addReminder(medicineNames);
                      }}
                      style={{ marginTop: '10px' }}
                    >
                      Set Reminder for Medicines
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'reminders' && (
          <div>
            <h2>Medicine Reminders</h2>
            {reminders.length === 0 ? (
              <p>No reminders set</p>
            ) : (
              reminders.map(reminder => (
                <div key={reminder.id} className="card" style={{ marginBottom: '10px' }}>
                  <h3>{reminder.medicine_name}</h3>
                  <p><strong>Time:</strong> {reminder.reminder_time}</p>
                  <p><strong>Frequency:</strong> {reminder.frequency}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;

