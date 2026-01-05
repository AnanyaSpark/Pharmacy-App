# Pharmacy Web Application

A comprehensive web application for managing pharmaceutical needs with three distinct portals: Users, Pharmacies, and Delivery Agents. The application includes mood and mental health support, medicine ordering, payment processing, and delivery management.

## Features

### User Portal
- **Registration & Login**: Users can register with name, email, phone number, and address
- **Mood & Mental Health Support**: 
  - Select your current mood (happy, sad, anxious, angry, stressed, neutral)
  - Get inspirational quotes based on your mood
  - View recommended yoga and exercise postures
- **Buy Pharmaceutical Necessities**:
  - Browse medicines from all registered pharmacies
  - View medicine details: name, price, quantity, expiration date
  - Add medicines to cart
  - Place orders
  - Process payments
  - View order history
  - Submit feedback after delivery
  - Set medicine reminders after delivery

### Pharmacy Portal
- **Registration & Login**: Pharmacies can register with name, email, phone number, and address
- **Medicine Management**:
  - Add medicines with name, price, quantity, expiration date, and description
  - Update medicine details
  - Delete medicines
  - View all medicines in inventory
- **Order Management**:
  - View all orders from customers
  - See order details including customer information and delivery agent

### Delivery Agent Portal
- **Registration & Login**: Delivery agents can register with name, email, phone number, and address
- **Order Management**:
  - View available orders (paid orders waiting for delivery)
  - Accept orders
  - Update order status (picked up, in transit, delivered)
  - View assigned orders

## Technology Stack

### Backend
- **Node.js** with Express.js
- **SQLite** database
- **bcryptjs** for password hashing
- RESTful API architecture

### Frontend
- **React.js** with React Router
- **Axios** for API calls
- Modern CSS with gradients and responsive design

## Project Structure

```
pharmacy-web-app/
├── server/
│   ├── index.js                 # Main server file
│   ├── database/
│   │   └── db.js               # Database initialization and schema
│   └── routes/
│       ├── auth.js             # Authentication routes
│       ├── medicines.js        # Medicine management routes
│       ├── orders.js           # Order management routes
│       ├── mood.js             # Mood support routes
│       └── reminders.js        # Reminder management routes
├── client/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js              # Main App component with routing
│   │   ├── App.css             # Global styles
│   │   ├── index.js            # React entry point
│   │   ├── index.css           # Base styles
│   │   └── components/
│   │       ├── HomePage.js
│   │       ├── UserPortal.js
│   │       ├── PharmacyPortal.js
│   │       ├── DeliveryPortal.js
│   │       ├── UserRegister.js
│   │       ├── UserLogin.js
│   │       ├── UserDashboard.js
│   │       ├── PharmacyRegister.js
│   │       ├── PharmacyLogin.js
│   │       ├── PharmacyDashboard.js
│   │       ├── DeliveryRegister.js
│   │       ├── DeliveryLogin.js
│   │       └── DeliveryDashboard.js
│   └── package.json
├── package.json
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)

### Step 1: Install Backend Dependencies

Navigate to the project root directory and install backend dependencies:

```bash
cd pharmacy-web-app
npm install
```

### Step 2: Install Frontend Dependencies

Navigate to the client directory and install frontend dependencies:

```bash
cd client
npm install
cd ..
```

Or use the convenience script:

```bash
npm run install-all
```

### Step 3: Start the Backend Server

From the project root directory:

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The backend server will start on `http://localhost:5000`

### Step 4: Start the Frontend Development Server

Open a new terminal window, navigate to the client directory:

```bash
cd client
npm start
```

The frontend will start on `http://localhost:3000` and automatically open in your browser.

## How to Use the Application

### For Users:

1. **Access the Application**: Open `http://localhost:3000` in your browser
2. **Register**: Click on "User Portal" → "Register"
   - Fill in your name, email, phone number, address, and password
   - Click "Register"
3. **Login**: After registration, login with your email and password
4. **Use Features**:
   - **Mood Support**: Click "Mood & Mental Health" tab, select your mood, and get quotes and exercises
   - **Buy Medicines**: Click "Buy Medicines" tab, browse available medicines, add to cart
   - **Checkout**: Go to "Cart" tab, review items, and place order
   - **Payment**: Go to "My Orders" tab, click "Pay Now" on pending orders
   - **Feedback**: After delivery, provide feedback on your order
   - **Reminders**: Set reminders for medicines after delivery

### For Pharmacies:

1. **Register**: Click on "Pharmacy Portal" → "Register"
   - Fill in pharmacy name, email, phone, address, and password
2. **Login**: Login with your credentials
3. **Add Medicines**: Click "Add New Medicine" button
   - Enter medicine name, price, quantity, expiration date, and optional description
   - Click "Add Medicine"
4. **Manage Inventory**: Update or delete medicines as needed
5. **View Orders**: See all orders from customers

### For Delivery Agents:

1. **Register**: Click on "Delivery Portal" → "Register"
   - Fill in your name, email, phone, address, and password
2. **Login**: Login with your credentials
3. **Accept Orders**: View available orders and click "Accept Order"
4. **Update Status**: 
   - Mark as "Picked Up" after collecting from pharmacy
   - Mark as "In Transit" when on the way
   - Mark as "Delivered" when order is delivered

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user/pharmacy/delivery agent
- `POST /api/auth/login` - Login
- `GET /api/auth/profile/:id` - Get user profile

### Medicines
- `GET /api/medicines` - Get all medicines
- `GET /api/medicines/pharmacy/:pharmacyId` - Get medicines by pharmacy
- `POST /api/medicines` - Add new medicine (pharmacy only)
- `PUT /api/medicines/:id` - Update medicine
- `DELETE /api/medicines/:id` - Delete medicine

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/user/:userId` - Get user orders
- `GET /api/orders/pharmacy/:pharmacyId` - Get pharmacy orders
- `GET /api/orders/delivery/available` - Get available orders for delivery
- `GET /api/orders/delivery/:agentId` - Get delivery agent orders
- `PUT /api/orders/:orderId/accept` - Accept order (delivery agent)
- `PUT /api/orders/:orderId/status` - Update order status
- `POST /api/orders/:orderId/payment` - Process payment
- `POST /api/orders/:orderId/feedback` - Submit feedback

### Mood Support
- `GET /api/mood/all/:mood` - Get quotes and exercises for mood
- `GET /api/mood/quotes/:mood` - Get quotes for mood
- `GET /api/mood/exercises/:mood` - Get exercises for mood

### Reminders
- `POST /api/reminders` - Create reminder
- `GET /api/reminders/user/:userId` - Get user reminders
- `PUT /api/reminders/:id` - Update reminder
- `DELETE /api/reminders/:id` - Delete reminder

## Database Schema

The application uses SQLite database with the following tables:

- **users**: Stores user, pharmacy, and delivery agent information
- **medicines**: Stores medicine inventory
- **orders**: Stores order information
- **order_items**: Stores individual items in orders
- **feedback**: Stores customer feedback
- **medicine_reminders**: Stores medicine reminders

## Notes

- The database file (`pharmacy.db`) will be automatically created in `server/database/` directory on first run
- Passwords are hashed using bcryptjs before storing
- The application uses localStorage to maintain user sessions
- Payment processing is simulated (no actual payment gateway integration)
- All dates should be in YYYY-MM-DD format

## Troubleshooting

### Port Already in Use
If port 5000 or 3000 is already in use:
- Backend: Change PORT in `server/index.js` or set `PORT` environment variable
- Frontend: React will prompt to use a different port

### Database Issues
- Delete `server/database/pharmacy.db` to reset the database
- The database will be recreated on next server start

### CORS Issues
- Ensure backend server is running before starting frontend
- Check that API calls use correct port (5000 for backend)

## Future Enhancements

- Real payment gateway integration
- Email notifications
- Push notifications for reminders
- Real-time order tracking
- Advanced search and filtering
- Medicine images
- Prescription upload
- Chat support

## License

This project is open source and available for educational purposes.

