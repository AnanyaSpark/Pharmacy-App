# 🚀 How to Run the Pharmacy Web Application

## Step-by-Step Instructions

### Prerequisites
- **Node.js** installed (Download from https://nodejs.org/ if not installed)
- **npm** (comes with Node.js)

### Step 1: Open Terminal/Command Prompt

**On Windows:**
- Press `Win + R`
- Type `powershell` or `cmd`
- Press Enter

### Step 2: Navigate to Project Folder

```powershell
cd C:\Users\anany\pharmacy-web-app
```

### Step 3: Install Backend Dependencies

```powershell
npm install
```

**Wait for this to complete** - it will install all backend packages (Express, SQLite, etc.)

### Step 4: Install Frontend Dependencies

Open a **NEW terminal window** (keep the first one open):

```powershell
cd C:\Users\anany\pharmacy-web-app\client
npm install
```

**Wait for this to complete** - it will install React and all frontend packages

### Step 5: Start the Backend Server

Go back to **Terminal 1** (the first terminal window):

```powershell
cd C:\Users\anany\pharmacy-web-app
npm start
```

**You should see:**
```
Server running on port 5000
Connected to SQLite database
```

**⚠️ Keep this terminal window open!** The backend server must keep running.

### Step 6: Start the Frontend Server

In **Terminal 2** (the second terminal window):

```powershell
cd C:\Users\anany\pharmacy-web-app\client
npm start
```

**This will:**
- Start the React development server
- Automatically open your browser at `http://localhost:3000`
- If it doesn't open automatically, manually go to: `http://localhost:3000`

### Step 7: Use the Application

1. **Home Page** will show 3 portals (User, Pharmacy, Delivery Agent)
2. **Click on any portal** to register or login
3. **Start using the app!**

---

## Quick Reference Commands

### Terminal 1 (Backend):
```powershell
cd C:\Users\anany\pharmacy-web-app
npm install          # First time only
npm start            # Start backend server
```

### Terminal 2 (Frontend):
```powershell
cd C:\Users\anany\pharmacy-web-app\client
npm install          # First time only
npm start            # Start frontend server
```

---

## Troubleshooting

### ❌ "npm: command not found"
**Solution:** Install Node.js from https://nodejs.org/

### ❌ "Port 5000 already in use"
**Solution:** 
- Close any other applications using port 5000
- Or change the port in `server/index.js` (line 12)

### ❌ "Port 3000 already in use"
**Solution:** 
- React will ask if you want to use a different port (say yes)
- Or close any other applications using port 3000

### ❌ "Cannot find module"
**Solution:** 
- Make sure you ran `npm install` in both directories
- Delete `node_modules` folders and run `npm install` again

### ❌ "Database error"
**Solution:** 
- Delete `server/database/pharmacy.db` file
- Restart the backend server

### ❌ Frontend can't connect to backend
**Solution:** 
- Make sure backend is running first (Terminal 1)
- Check that backend shows "Server running on port 5000"
- Then start frontend (Terminal 2)

---

## What You'll See

### When Backend Starts Successfully:
```
Server running on port 5000
Connected to SQLite database
```

### When Frontend Starts Successfully:
```
Compiled successfully!

You can now view pharmacy-client in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

---

## Stopping the Application

1. **Stop Frontend:** In Terminal 2, press `Ctrl + C`
2. **Stop Backend:** In Terminal 1, press `Ctrl + C`

---

## Testing the Application

### Test User Flow:
1. Click "User Portal" → Register → Login
2. Try "Mood & Mental Health" → Select a mood
3. Try "Buy Medicines" → Add to cart → Place order

### Test Pharmacy Flow:
1. Click "Pharmacy Portal" → Register → Login
2. Click "Add New Medicine" → Fill form → Add
3. View your medicines and orders

### Test Delivery Flow:
1. Click "Delivery Portal" → Register → Login
2. View available orders → Accept order
3. Update order status

---

## Need Help?

- Check `README.md` for detailed documentation
- Check `QUICKSTART.md` for quick setup
- Check `PROJECT_SUMMARY.md` for feature overview

