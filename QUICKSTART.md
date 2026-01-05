# Quick Start Guide

## Quick Setup (5 minutes)

### 1. Install Dependencies

**Option A: Install everything at once**
```bash
cd pharmacy-web-app
npm run install-all
```

**Option B: Install separately**
```bash
# Backend
npm install

# Frontend
cd client
npm install
cd ..
```

### 2. Start the Application

**Terminal 1 - Backend Server:**
```bash
npm start
```
Wait for: "Server running on port 5000"

**Terminal 2 - Frontend Server:**
```bash
cd client
npm start
```
Wait for browser to open at `http://localhost:3000`

### 3. Test the Application

1. **Create a User Account:**
   - Click "User Portal" → "Register"
   - Fill in details and register
   - Login with your credentials

2. **Create a Pharmacy Account:**
   - Click "Pharmacy Portal" → "Register"
   - Fill in pharmacy details
   - Login and add some medicines

3. **Create a Delivery Agent Account:**
   - Click "Delivery Portal" → "Register"
   - Fill in details
   - Login to see available orders

4. **Test the Flow:**
   - As User: Browse medicines → Add to cart → Place order → Pay
   - As Pharmacy: View the order
   - As Delivery Agent: Accept order → Update status → Mark delivered
   - As User: Give feedback → Set reminders

## Common Issues

**Problem:** `npm install` fails
- **Solution:** Make sure you have Node.js v14+ installed. Check with `node --version`

**Problem:** Port 5000 already in use
- **Solution:** Kill the process using port 5000 or change PORT in `server/index.js`

**Problem:** Frontend can't connect to backend
- **Solution:** Make sure backend is running first, then start frontend

**Problem:** Database errors
- **Solution:** Delete `server/database/pharmacy.db` and restart server

## Need Help?

Check the main README.md for detailed documentation.

